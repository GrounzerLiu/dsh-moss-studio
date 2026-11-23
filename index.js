/**
 * dsh-moss-studio host half.
 *
 * Owns the durable studio state (drafts + records under ~/.dsh/moss-studio),
 * the generation pipeline, the model-facing tools, and the same-origin routes
 * the sidebar panel talks to. The browser half renders that state and writes
 * back through the same routes, so the user and the model share one truth.
 */
import { readFile } from 'node:fs/promises'
import z from '@deepseek-ai/schemastery'
import { fileURLToPath } from 'node:url'
import { probe } from './lib/comfy.js'
import { runGeneration } from './lib/engine.js'
import { ROUTE_PREFIX, studioRoutes } from './lib/routes.js'
import { readSettingsPatch, settingsState } from './lib/settings.js'
import { DEFAULT_NEGATIVE, DEFAULT_PARAMS, StudioError, StudioStore, defaultDataRoot } from './lib/storage.js'
import { studioTools } from './lib/tools.js'

export const name = 'dsh-moss-studio'

export const inject = ['tools', 'webServer', 'attachments']

const BUNDLED_WORKFLOW = fileURLToPath(new URL('./workflow/moss_bbox_api.json', import.meta.url))

/**
 * Row config. `comfyUrl` is volatile: editing it updates this run in place
 * instead of remounting the plugin, so a changed address takes effect on the
 * next request without dropping the panel or its state.
 */
export const Config = z.object({
  comfyUrl: z.string().default('http://127.0.0.1:8188').description('ComfyUI API 基址，例如 http://127.0.0.1:8188').volatile(),
  workflowPath: z.string().default('').description('API 工作流 JSON 的绝对路径；留空用包内模板'),
  dataDir: z.string().default('').description('记录与草稿的根目录；留空用 ~/.dsh/moss-studio'),
  steps: z.number().default(25).description('新草稿的默认步数'),
  cfg: z.number().default(2.5).description('新草稿的默认 CFG'),
  negative: z.string().default(DEFAULT_NEGATIVE).description('新草稿的默认负向提示词'),
  retention: z.number().default(0).description('最多保留多少条记录；0 表示不限制。置顶与生成中的记录不会被清理').volatile(),
  defaultSize: z.string().default('1024x1024').description('新草稿的默认尺寸').volatile(),
  defaultSteps: z.number().default(25).description('新草稿的默认步数').volatile(),
  defaultCfg: z.number().default(2.5).description('新草稿的默认 CFG').volatile(),
  defaultNegative: z.string().default(DEFAULT_NEGATIVE).description('新草稿的默认负向提示词').volatile(),
  timeoutMs: z.number().default(600000).description('单次生成的超时毫秒数'),
  pollMs: z.number().default(1000).description('轮询 ComfyUI 的间隔毫秒数'),
})

/** Volatile fields arrive as live refs; plain ones as values. */
function deref(value) {
  return typeof value === 'object' && value !== null && typeof value.get === 'function' ? value.get() : value
}

function derefConfig(raw) {
  if (raw === null || typeof raw !== 'object') return raw
  const out = {}
  for (const [key, value] of Object.entries(raw)) out[key] = deref(value)
  return out
}

function normalizeConfig(raw) {
  const config = raw !== null && typeof raw === 'object' ? raw : {}
  const number = (value, fallback) => (typeof value === 'number' && Number.isFinite(value) ? value : fallback)
  const text = (value, fallback) => (typeof value === 'string' && value.trim() !== '' ? value.trim() : fallback)
  return {
    comfyUrl: text(config.comfyUrl, 'http://127.0.0.1:8188'),
    workflowPath: text(config.workflowPath, ''),
    dataDir: text(config.dataDir, defaultDataRoot()),
    retention: number(config.retention, 0),
    defaultSize: text(config.defaultSize, '1024x1024'),
    defaultSteps: number(config.defaultSteps, 25),
    defaultCfg: number(config.defaultCfg, 2.5),
    defaultNegative: typeof config.defaultNegative === 'string' ? config.defaultNegative : DEFAULT_NEGATIVE,
    steps: number(config.steps, 25),
    cfg: number(config.cfg, 2.5),
    negative: typeof config.negative === 'string' && config.negative !== '' ? config.negative : DEFAULT_NEGATIVE,
    timeoutMs: number(config.timeoutMs, 600_000),
    pollMs: number(config.pollMs, 1000),
  }
}

/**
 * @param {import('@deepseek-ai/cordis').Context} ctx
 * @param {Record<string, unknown> | undefined} rawConfig
 */
export function apply(ctx, rawConfig) {
  const config = normalizeConfig(derefConfig(rawConfig))
  /** Fresh config for values that can change while the plugin is running. */
  const live = () => normalizeConfig(derefConfig(rawConfig))
  const store = new StudioStore({
    root: config.dataDir,
    // Read on every new draft so a settings change applies without a restart.
    defaults: () => {
      const now = live()
      return {
        ...DEFAULT_PARAMS,
        size: now.defaultSize,
        steps: now.defaultSteps,
        cfg: now.defaultCfg,
        negative: now.defaultNegative,
      }
    },
  })
  const templateCache = new Map()

  async function template() {
    const path = config.workflowPath !== '' ? config.workflowPath : BUNDLED_WORKFLOW
    const cached = templateCache.get(path)
    if (cached !== undefined) return cached
    let text
    try {
      text = await readFile(path, 'utf8')
    } catch (error) {
      throw new Error(`读不到 API 工作流 ${path}：${error instanceof Error ? error.message : String(error)}`)
    }
    let parsed
    try {
      parsed = JSON.parse(text)
    } catch (error) {
      throw new Error(`API 工作流不是合法 JSON（${path}）：${error instanceof Error ? error.message : String(error)}`)
    }
    templateCache.set(path, parsed)
    return parsed
  }

  /** A changed address invalidates both the probe cache and the template path. */
  function resetHealth() {
    healthCache = { at: 0, value: { ok: false, error: '未检测' } }
  }

  /**
   * Persist a new ComfyUI address into the profile's patch layer.
   *
   * `configEditor.edit` validates the whole row, keeps the rest of the YAML
   * intact, and (because the field is volatile) updates this run in place
   * instead of remounting the plugin.
   */
  /**
   * Persist an editable settings patch into the profile's patch layer.
   *
   * `configEditor.edit` validates the whole row, keeps the rest of the YAML
   * intact, and (because these fields are volatile) updates this run in place
   * instead of remounting the plugin.
   */
  async function saveSettings(body) {
    const patch = readSettingsPatch(body)
    const editor = typeof ctx.get === 'function' ? ctx.get('configEditor') : undefined
    if (typeof editor?.edit !== 'function') {
      throw new StudioError('NO_EDITOR', '当前 profile 没有配置编辑器，只能改 cordis.patch.yml')
    }
    const entry = ctx.fiber?.entry
    if (entry === undefined) {
      throw new StudioError('NO_ENTRY', '这行插件没有可写的 profile 条目')
    }
    const { comfyUrl, retention, defaults } = patch
    try {
      await editor.edit(entry, (current) => ({
        ...(current ?? {}),
        ...(comfyUrl === undefined ? {} : { comfyUrl }),
        ...(retention === undefined ? {} : { retention }),
        ...(defaults === undefined ? {} : defaults),
      }))
    } catch (error) {
      // A higher layer (profile patch or a launch arg) can pin the row; say so
      // instead of pretending the value was saved.
      const reason = error instanceof Error ? error.message : String(error)
      throw new StudioError('SAVE_REJECTED', `保存被拒绝：${reason}`)
    }
    resetHealth()
    return settingsForPanel()
  }
  function settingsForPanel() {
    const now = live()
    const editor = typeof ctx.get === 'function' ? ctx.get('configEditor') : undefined
    return settingsState({
      comfyUrl: now.comfyUrl,
      retention: now.retention,
      defaultSize: now.defaultSize,
      defaultSteps: now.defaultSteps,
      defaultCfg: now.defaultCfg,
      defaultNegative: now.defaultNegative,
      dataDir: now.dataDir,
      workflowPath: now.workflowPath !== '' ? now.workflowPath : BUNDLED_WORKFLOW,
      timeoutMs: now.timeoutMs,
      pollMs: now.pollMs,
      editable: typeof editor?.edit === 'function',
    })
  }
  // Cached so a panel that asks often cannot flood ComfyUI with probes.
  let healthCache = { at: 0, value: { ok: false, error: '未检测' } }
  async function health() {
    const now = Date.now()
    // Memory moves, so the cache is short: long enough to absorb a burst of
    // panel refreshes, short enough that the strip changes when a job loads models.
    if (now - healthCache.at < 3000) return healthCache.value
    try {
      const info = await probe(live().comfyUrl, undefined)
      healthCache = {
        at: now,
        value: {
          ok: true,
          version: info.version,
          url: live().comfyUrl,
          ramTotal: info.ramTotal,
          ramFree: info.ramFree,
          gpu: info.gpu,
        },
      }
    } catch (error) {
      healthCache = { at: now, value: { ok: false, url: live().comfyUrl, error: error instanceof Error ? error.message : String(error) } }
    }
    return healthCache.value
  }

  let running = 0
  let runningSession = null
  const busy = () => running > 0

  /** Run one generation and persist it as a record. Shared by tools and routes. */
  async function generate({ sessionId, params, signal, source = 'user' }) {
    if (running > 0) throw new Error('上一次生成还在进行，请稍后再试')
    running += 1
    runningSession = sessionId
    let record
    const startedAt = Date.now()
    try {
      record = await store.createRecord({ sessionId, params })
      store.emit({ kind: 'progress', recordId: record.id, phase: 'probe', source })

      const result = await runGeneration({
        baseUrl: live().comfyUrl,
        template: await template(),
        params,
        timeoutMs: config.timeoutMs,
        pollMs: config.pollMs,
        signal,
        onProgress: (progress) => store.emit({ kind: 'progress', recordId: record.id, ...progress, source }),
      })

      const attachments = ctx.get('attachments')
      const imageRefs = []
      if (attachments !== undefined) {
        try {
          const ref = await attachments.saveImage({
            data: result.data,
            mediaType: result.mediaType,
            name: `${record.id}.png`,
          })
          imageRefs.push({
            attachmentId: ref.attachmentId,
            mediaType: ref.mediaType,
            bytes: ref.bytes,
            width: ref.width,
            height: ref.height,
            ...(ref.name === undefined ? {} : { name: ref.name }),
          })
        } catch { /* the record keeps its file even when the card cannot embed */ }
      }

      const image = { file: 'image.png', bytes: result.data.byteLength, mediaType: result.mediaType, width: result.meta.width, height: result.meta.height }
      await store.finishRecord(record.id, {
        status: 'done',
        result: {
          width: result.meta.width,
          height: result.meta.height,
          seconds: Math.round(result.seconds * 10) / 10,
          promptId: result.promptId,
          comfyVersion: result.comfyVersion,
          boxCount: result.meta.boxCount,
          enhance: result.meta.enhance,
        },
        image,
        data: result.data,
      })

      // Trim the history after a successful run so the cap is enforced at the
      // moment the pile grows, not only when someone opens settings.
      const limit = live().retention
      if (limit > 0) {
        try {
          await store.pruneRecords(limit)
        } catch (error) {
          ctx.logger?.warn?.(`moss-studio: 清理旧记录失败：${error instanceof Error ? error.message : String(error)}`)
        }
      }

      return {
        recordId: record.id,
        width: result.meta.width,
        height: result.meta.height,
        seed: result.meta.seed,
        seconds: Math.round(result.seconds * 10) / 10,
        paths: [store.imagePath(record.id)],
        images: imageRefs,
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      if (record !== undefined) {
        try {
          await store.finishRecord(record.id, { status: 'failed', error: { message, elapsed: Math.round((Date.now() - startedAt) / 1000) } })
        } catch { /* keep the original failure */ }
      }
      throw error
    } finally {
      running -= 1
      runningSession = null
    }
  }

  ctx.effect(() => {
    void store.ensure().catch((error) => {
      ctx.logger?.warn?.(`moss-studio: 无法创建数据目录 ${config.dataDir}: ${error instanceof Error ? error.message : String(error)}`)
    })
    return () => {}
  }, 'moss-studio: data directory')

  for (const definition of studioTools({ store, template, settings: () => config, generate })) {
    ctx.effect(() => ctx.tools.register(definition), `moss-studio: tool ${definition.name}`)
  }

  ctx.effect(() => ctx.webServer.register({
    kind: 'prefix',
    path: ROUTE_PREFIX,
    handler: studioRoutes({ store, generate, isGenerating: busy, busySession, health, settings: settingsForPanel, saveSettings }),
  }), 'moss-studio: routes')

  ctx.logger?.info?.(`moss-studio: 数据目录 ${config.dataDir}，ComfyUI ${config.comfyUrl}`)
}
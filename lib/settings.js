/**
 * Settings that belong to the plugin's own row: parsing, validation and the
 * payload the panel reads.
 */

import { StudioError, sanitizeParams } from './storage.js'
import { parseSize } from './workflow.js'

export const RETENTION_MAX = 5000

/**
 * Normalize a ComfyUI base URL.
 *
 * Only http/https is accepted, the value is trimmed and trailing slashes are
 * removed so `/prompt` never becomes `//prompt`. Credentials are rejected
 * rather than stored in a config file other tools read.
 *
 * @param {unknown} value
 * @returns {string}
 */
export function normalizeComfyUrl(value) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new StudioError('INVALID_URL', '请填写 ComfyUI 地址，例如 http://127.0.0.1:8188')
  }
  const text = value.trim().replace(/\/+$/, '')
  let url
  try {
    url = new URL(text)
  } catch {
    throw new StudioError('INVALID_URL', `不是有效的地址：${value}`)
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new StudioError('INVALID_URL', '只支持 http 或 https')
  }
  if (url.username !== '' || url.password !== '') {
    throw new StudioError('INVALID_URL', '地址里不能带账号密码')
  }
  if (url.hostname === '') {
    throw new StudioError('INVALID_URL', '地址缺少主机名')
  }
  // Keep a proxy path prefix but drop query and hash: neither means anything here.
  const path = url.pathname === '/' ? '' : url.pathname.replace(/\/+$/, '')
  return `${url.protocol}//${url.host}${path}`
}

/** @param {unknown} value */
export function normalizeRetention(value) {
  if (value === null || value === undefined || value === '') return 0
  const count = Number(value)
  if (!Number.isSafeInteger(count) || count < 0 || count > RETENTION_MAX) {
    throw new StudioError('INVALID_RETENTION', `保留条数必须是 0 到 ${RETENTION_MAX} 之间的整数`)
  }
  return count
}

/**
 * Validate the editable half of a settings patch.
 *
 * Unknown keys are rejected instead of ignored: a typo should fail loudly, not
 * silently write nothing.
 *
 * @param {object} body - request body
 * @returns {{ comfyUrl?: string, retention?: number, defaults?: object }}
 */
export function readSettingsPatch(body) {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    throw new StudioError('INVALID_SETTINGS', 'settings patch must be an object')
  }
  const allowed = new Set(['comfyUrl', 'retention', 'defaults'])
  for (const key of Object.keys(body)) {
    if (!allowed.has(key)) throw new StudioError('INVALID_SETTINGS', `unknown setting "${key}"`)
  }
  const patch = {}
  if (body.comfyUrl !== undefined) patch.comfyUrl = normalizeComfyUrl(body.comfyUrl)

  if (body.retention !== undefined) patch.retention = normalizeRetention(body.retention)

  if (body.defaults !== undefined) {
    const source = body.defaults
    if (source === null || typeof source !== 'object' || Array.isArray(source)) {
      throw new StudioError('INVALID_SETTINGS', 'defaults must be an object')
    }
    const defaults = {}
    if (source.size !== undefined) {
      if (typeof source.size !== 'string') throw new StudioError('INVALID_SETTINGS', '默认尺寸必须是字符串')
      parseSize(source.size)
      defaults.defaultSize = source.size.trim()
    }
    if (source.steps !== undefined) {
      const steps = Number(source.steps)
      if (!Number.isInteger(steps) || steps < 1 || steps > 200) {
        throw new StudioError('INVALID_SETTINGS', '默认步数必须是 1 到 200 的整数')
      }
      defaults.defaultSteps = steps
    }
    if (source.cfg !== undefined) {
      const cfg = Number(source.cfg)
      if (!Number.isFinite(cfg) || cfg < 0 || cfg > 30) {
        throw new StudioError('INVALID_SETTINGS', '默认 CFG 必须在 0 到 30 之间')
      }
      defaults.defaultCfg = cfg
    }
    if (source.negative !== undefined) {
      if (typeof source.negative !== 'string' || source.negative.length > 2000) {
        throw new StudioError('INVALID_SETTINGS', '默认负向提示词必须是不超过 2000 字的字符串')
      }
      defaults.defaultNegative = source.negative
    }
    if (Object.keys(defaults).length > 0) patch.defaults = defaults
  }

  if (Object.keys(patch).length === 0) {
    throw new StudioError('INVALID_SETTINGS', '没有需要保存的设置')
  }
  return patch
}

/**
 * Payload for the panel: what it may edit, plus the wiring it may only read.
 */
export function settingsState(input) {
  return {
    ok: true,
    settings: {
      comfyUrl: input.comfyUrl,
      retention: input.retention,
      defaults: {
        size: input.defaultSize,
        steps: input.defaultSteps,
        cfg: input.defaultCfg,
        negative: input.defaultNegative,
      },
      editable: input.editable,
    },
    wiring: {
      dataDir: input.dataDir,
      workflowPath: input.workflowPath,
      timeoutMs: input.timeoutMs,
      pollMs: input.pollMs,
    },
  }
}

/** Also used by tests to keep the parameter rules in one place. */
export { sanitizeParams }

/**
 * Model-facing tools for the studio: read the draft, patch it, generate from it,
 * and browse history. Every write returns the complete new state so the model
 * never has to follow up with a read.
 */
import { sanitizeParams } from './storage.js'
import { parseSize } from './workflow.js'

const PARAM_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    prompt: { type: 'string' },
    negative: { type: 'string' },
    size: { type: 'string' },
    steps: { type: 'integer' },
    cfg: { type: 'number' },
    seed: { type: 'integer' },
    characterBoxes: { type: 'string' },
    enhance: { type: 'boolean' },
    boxes: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          x: { type: 'number' },
          y: { type: 'number' },
          width: { type: 'number' },
          height: { type: 'number' },
          type: { type: 'string' },
          text: { type: 'string' },
          desc: { type: 'string' },
          palette: { type: 'array', items: { type: 'string' } },
          locked: { type: 'boolean' },
          hidden: { type: 'boolean' },
        },
      },
    },
  },
}

/**
 * @param {object} deps
 * @param {import('./storage.js').StudioStore} deps.store
 * @param {(sessionId: string) => Promise<Record<string, unknown>>} deps.template
 * @param {() => { comfyUrl: string, timeoutMs: number, pollMs: number }} deps.settings
 * @param {(input: object) => Promise<object>} deps.generate
 */
export function studioTools(deps) {
  const { store } = deps

  async function sessionDraft(sessionId) {
    return store.draft(sessionId)
  }

  function renderState(value) {
    const lines = []
    if (value.ok !== true) return [{ type: 'text', text: `moss studio: ${value.note ?? '失败'}` }]
    lines.push(`草稿 revision ${value.revision}，${value.params.boxes.length} 个框，${value.params.size}`)
    lines.push(`prompt: ${value.params.prompt || '(空)'}`)
    if (value.records.length > 0) lines.push(`最近记录: ${value.records.slice(0, 5).map((record) => `${record.id}${record.status === 'done' ? '' : `(${record.status})`}`).join(', ')}`)
    if (value.draft?.ui) lines.push(`面板: ${value.draft.ui.open ? '已打开' : '已关闭'}${value.draft.ui.selectedRecordId ? `，选中 ${value.draft.ui.selectedRecordId}` : ''}`)
    return [{ type: 'text', text: lines.join('\n') }]
  }

  const stateTool = {
    name: 'moss_studio_state',
    description:
      '读取 moss studio 的当前状态：草稿参数（提示词、框、尺寸、步数、CFG、seed、负向）、revision、最近的历史记录，以及面板是否打开、选中了哪条记录。'
      + ' 修改前先读一次；sessionId 省略时用当前会话。',
    parameters: {
      type: 'object',
      additionalProperties: false,
      properties: {
        sessionId: { type: 'string', description: '目标会话；省略则用当前会话的草稿。' },
        historyLimit: { type: 'integer', description: '返回多少条历史摘要，默认 10，最大 50。' },
      },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        required: ['ok', 'revision', 'params', 'records'],
        properties: {
          ok: { type: 'boolean' },
          note: { type: 'string' },
          sessionId: { type: 'string' },
          revision: { type: 'integer' },
          params: PARAM_SCHEMA,
          records: { type: 'array', items: { type: 'object', additionalProperties: true, properties: {} } },
        },
      },
      render: (_args, value) => renderState(value),
    },
    async execute(args, exec) {
      const sessionId = resolveSession(args, exec)
      const limit = Math.min(50, Math.max(1, Number(args?.historyLimit ?? 10) | 0))
      const draft = await sessionDraft(sessionId)
      const records = await store.listRecords({ limit })
      return {
        ok: true,
        sessionId: draft.sessionId,
        revision: draft.revision,
        params: draft.params,
        records,
      }
    },
  }

  const editTool = {
    name: 'moss_studio_edit',
    description:
      '修改 moss studio 草稿里的参数（提示词、框、尺寸、步数、CFG、seed、负向、人物标记、提示词增强）。'
      + ' 只传要改的字段；框数组整体替换。返回修改后的完整草稿与新 revision。'
      + ' 传 revision 时若已被别人改过会返回 conflict=true 和最新草稿。',
    parameters: {
      type: 'object',
      additionalProperties: false,
      required: ['patch'],
      properties: {
        patch: PARAM_SCHEMA,
        revision: { type: 'integer', description: '上次读到的 revision；不传则不校验。' },
        sessionId: { type: 'string' },
      },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        required: ['ok', 'conflict', 'revision', 'params'],
        properties: {
          ok: { type: 'boolean' },
          conflict: { type: 'boolean' },
          note: { type: 'string' },
          sessionId: { type: 'string' },
          revision: { type: 'integer' },
          params: PARAM_SCHEMA,
        },
      },
      render: (_args, value) => [{
        type: 'text',
        text: value.ok !== true
          ? `moss studio 修改失败：${value.note ?? '未知错误'}`
          : value.conflict
            ? `草稿已被更新到 revision ${value.revision}，本次修改未应用；请重新读取后再改。`
            : `草稿已更新到 revision ${value.revision}：${value.params.boxes.length} 个框，${value.params.size}`,
      }],
    },
    async execute(args, exec) {
      const sessionId = resolveSession(args, exec)
      const result = await store.putDraft(sessionId, args?.patch ?? {}, args?.revision, 'ai')
      return {
        ok: true,
        conflict: result.conflict === true,
        sessionId: result.draft.sessionId,
        revision: result.draft.revision,
        params: result.draft.params,
        ...(result.conflict === true ? { note: 'revision mismatch' } : {}),
      }
    },
  }

  const generateTool = {
    name: 'moss_studio_generate',
    description:
      '用 moss studio 当前草稿出图：先按 overrides 覆盖参数（可选），再提交到本机 ComfyUI，生成一条历史记录并把图片存到记录目录。'
      + ' overrides 是局部覆盖：没传的字段沿用草稿里的值，所以草稿里已有的 boxes 会被一起送进布局提示词。'
      + ' 要纯文生图（不继承草稿的框），显式传 boxes: []。'
      + ' 返回 recordId、尺寸、耗时与图片附件。',
    parameters: {
      type: 'object',
      additionalProperties: false,
      properties: {
        overrides: {
          description: '局部覆盖草稿参数：只覆盖这里出现的字段，其余沿用草稿；不传 boxes 会继承草稿里的框，纯文生图请传 boxes: []。',
          ...PARAM_SCHEMA,
        },
        revision: { type: 'integer', description: '草稿 revision；不匹配则返回 conflict，不出图。' },
        sessionId: { type: 'string' },
      },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        required: ['ok'],
        properties: {
          ok: { type: 'boolean' },
          conflict: { type: 'boolean' },
          note: { type: 'string' },
          recordId: { type: 'string' },
          width: { type: 'integer' },
          height: { type: 'integer' },
          seed: { type: 'integer' },
          seconds: { type: 'number' },
          paths: { type: 'array', items: { type: 'string' } },
          images: {
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: false,
              required: ['attachmentId', 'mediaType', 'bytes', 'width', 'height'],
              properties: {
                attachmentId: { type: 'string' },
                mediaType: { type: 'string' },
                bytes: { type: 'integer' },
                width: { type: 'integer' },
                height: { type: 'integer' },
                name: { type: 'string' },
              },
            },
          },
        },
      },
      render: (_args, value) => {
        if (value.ok !== true) {
          return [{ type: 'text', text: value.conflict === true ? `草稿已被更新到 revision，未出图：${value.note ?? ''}` : `生成失败：${value.note ?? '未知错误'}` }]
        }
        const blocks = [{
          type: 'text',
          text: `已出图 ${value.width}×${value.height}，seed ${value.seed}，${value.seconds} 秒，记录 ${value.recordId}`,
        }]
        for (const image of value.images ?? []) blocks.push({ type: 'image', attachment: image })
        return blocks
      },
    },
    async execute(args, exec) {
      const sessionId = resolveSession(args, exec)
      const draft = await sessionDraft(sessionId)
      if (args?.revision !== undefined && args.revision !== draft.revision) {
        return { ok: false, conflict: true, note: `revision ${draft.revision}` }
      }
      let params
      try {
        params = { ...draft.params, ...sanitizeParams(args?.overrides ?? {}, { partial: true }) }
      } catch (error) {
        return { ok: false, note: error instanceof Error ? error.message : String(error) }
      }
      try {
        const result = await deps.generate({ sessionId, params, signal: exec.signal })
        return { ok: true, ...result }
      } catch (error) {
        return { ok: false, note: error instanceof Error ? error.message : String(error) }
      }
    },
  }

  const historyTool = {
    name: 'moss_studio_history',
    description:
      '浏览 moss studio 的历史记录：list 列出最近的记录（置顶的单独返回），load 把某条记录的参数载回草稿并返回该记录，delete 删除，pin/unpin 置顶，archive/unarchive 归档。',
    parameters: {
      type: 'object',
      additionalProperties: false,
      required: ['action'],
      properties: {
        action: { type: 'string', description: 'list | load | delete | pin | unpin | archive | unarchive' },
        recordId: { type: 'string', description: 'load、delete、pin、archive 等操作必填。' },
        limit: { type: 'integer', description: 'list 的条数，默认 20。' },
        includeArchived: { type: 'boolean', description: 'list 时是否包含已归档的记录，默认 false。' },
        sessionId: { type: 'string', description: 'load 时把参数写进哪个会话的草稿。' },
      },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        required: ['ok', 'records'],
        properties: {
          ok: { type: 'boolean' },
          note: { type: 'string' },
          records: { type: 'array', items: { type: 'object', additionalProperties: true, properties: {} } },
          pinned: { type: 'array', items: { type: 'object', additionalProperties: true, properties: {} } },
          record: { type: 'object', additionalProperties: true, properties: {} },
          revision: { type: 'integer' },
        },
      },
      render: (_args, value) => {
        if (value.ok !== true) return [{ type: 'text', text: `moss studio 历史操作失败：${value.note ?? '未知错误'}` }]
        if (value.record !== undefined) {
          return [{ type: 'text', text: `已载入记录 ${value.record.id}（${value.record.params.size}，${value.record.params.boxes.length} 个框），草稿 revision ${value.revision}` }]
        }
        const rows = value.records.map((record) => `${record.id} · ${record.size} · ${record.boxCount} 框 · ${record.status}${record.hasImage ? '' : ' · 无图'}`)
        return [{ type: 'text', text: rows.length === 0 ? '还没有任何记录' : rows.join('\n') }]
      },
    },
    async execute(args, exec) {
      const action = typeof args?.action === 'string' ? args.action : 'list'
      if (action === 'list') {
        return {
          ok: true,
          records: await store.listRecords({
            limit: Math.min(100, Math.max(1, Number(args?.limit ?? 20) | 0)),
            includeArchived: args?.includeArchived === true,
          }),
          pinned: await store.listRecords({ limit: 50, pinnedOnly: true }),
        }
      }
      if (action === 'load') {
        const record = await store.record(String(args?.recordId ?? ''))
        const draft = await store.setDraft(resolveSession(args, exec), record.params, 'ai')
        return { ok: true, records: [], record, revision: draft.revision }
      }
      if (action === 'delete') {
        await store.deleteRecord(String(args?.recordId ?? ''))
        return { ok: true, records: await store.listRecords({ limit: 20 }) }
      }
      if (action === 'pin' || action === 'unpin' || action === 'archive' || action === 'unarchive') {
        const flags = action === 'pin' || action === 'unpin'
          ? { pinned: action === 'pin' }
          : { archived: action === 'archive' }
        const record = await store.setRecordFlags(String(args?.recordId ?? ''), flags)
        return {
          ok: true,
          records: await store.listRecords({ limit: 20 }),
          pinned: await store.listRecords({ limit: 50, pinnedOnly: true }),
          record,
        }
      }
      return { ok: false, records: [], note: `未知 action: ${action}` }
    },
  }

  return [stateTool, editTool, generateTool, historyTool]
}

function resolveSession(args, exec) {
  if (typeof args?.sessionId === 'string' && args.sessionId !== '') return args.sessionId
  const session = exec?.agent?.session
  if (session !== undefined && typeof session.id === 'string') return session.id
  return 'global'
}

export { parseSize }
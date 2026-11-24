/**
 * Durable studio state: settings, per-session drafts, and generation records.
 *
 * Layout under `root` (default `~/.dsh/moss-studio`):
 *
 *   settings.json
 *   drafts/<sessionKey>.json      { revision, updatedAt, params }
 *   records/<id>/record.json
 *   records/<id>/image.png
 *
 * Writes are serialized per store instance and applied atomically through a
 * temporary file plus rename, so a crash never leaves a half-written draft.
 */
import { randomBytes } from 'node:crypto'
import { parseSize } from './workflow.js'
import { mkdir, readFile, readdir, rename, rm, stat, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'

export const DEFAULT_NEGATIVE = 'nsfw, worst quality, bad anatomy, watermark, jpeg artifact'

/** The parameter set one generation needs; every field is user- and AI-editable. */
export const DEFAULT_PARAMS = Object.freeze({
  prompt: '',
  negative: DEFAULT_NEGATIVE,
  boxes: [],
  size: '1024x1024',
  steps: 25,
  cfg: 2.5,
  seed: -1,
  characterBoxes: '',
  enhance: false,
})

const PARAM_KEYS = Object.keys(DEFAULT_PARAMS)

export class StudioError extends Error {
  constructor(code, message, details) {
    super(message)
    this.name = 'StudioError'
    this.code = code
    this.details = details
  }
}

/**
 * Accept only the parameters the studio owns and reject wrong types early, so a
 * bad patch never reaches disk.
 * @param {unknown} patch
 * @param {{ partial?: boolean }} options
 */
export function sanitizeParams(patch, options = {}) {
  if (patch === null || typeof patch !== 'object' || Array.isArray(patch)) {
    throw new StudioError('INVALID_PARAMS', 'params must be an object')
  }
  const out = {}
  for (const [key, value] of Object.entries(patch)) {
    if (!PARAM_KEYS.includes(key)) throw new StudioError('INVALID_PARAMS', `unknown parameter "${key}"`)
    switch (key) {
      case 'prompt':
      case 'negative':
      case 'characterBoxes':
        if (typeof value !== 'string') throw new StudioError('INVALID_PARAMS', `${key} must be a string`)
        out[key] = value
        break
      case 'size':
        if (typeof value !== 'string') throw new StudioError('INVALID_PARAMS', 'size must be a string')
        // Reject an unusable size here rather than after a record was created.
        parseSize(value)
        out[key] = value
        break
      case 'steps':
        if (!Number.isInteger(value) || value < 1 || value > 200) throw new StudioError('INVALID_PARAMS', 'steps must be an integer between 1 and 200')
        out[key] = value
        break
      case 'cfg':
        if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 30) throw new StudioError('INVALID_PARAMS', 'cfg must be a number between 0 and 30')
        out[key] = value
        break
      case 'seed':
        if (!Number.isSafeInteger(value)) throw new StudioError('INVALID_PARAMS', 'seed must be an integer')
        out[key] = value
        break
      case 'enhance':
        if (typeof value !== 'boolean') throw new StudioError('INVALID_PARAMS', 'enhance must be a boolean')
        out[key] = value
        break
      case 'boxes':
        if (!Array.isArray(value)) throw new StudioError('INVALID_PARAMS', 'boxes must be an array')
        if (value.length > 24) throw new StudioError('INVALID_PARAMS', 'at most 24 boxes are supported')
        out.boxes = value.map((box, index) => sanitizeBox(box, index))
        break
      default:
        break
    }
  }
  if (options.partial !== true) {
    for (const key of PARAM_KEYS) {
      if (!(key in out)) out[key] = DEFAULT_PARAMS[key]
    }
  }
  return out
}

function sanitizeBox(box, index) {
  if (box === null || typeof box !== 'object' || Array.isArray(box)) {
    throw new StudioError('INVALID_PARAMS', `boxes[${index}] must be an object`)
  }
  for (const key of ['x', 'y', 'width', 'height']) {
    const value = box[key]
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new StudioError('INVALID_PARAMS', `boxes[${index}].${key} must be a finite number`)
    }
  }
  const type = box.type === 'text' ? 'text' : 'obj'
  const palette = Array.isArray(box.palette)
    ? box.palette.filter((color) => typeof color === 'string').slice(0, 5)
    : []
  return {
    x: box.x,
    y: box.y,
    width: box.width,
    height: box.height,
    type,
    text: typeof box.text === 'string' ? box.text : '',
    desc: typeof box.desc === 'string' ? box.desc : '',
    palette,
    // Editing-state flags; both default to false and survive a round trip so a
    // tool call cannot silently re-enable a box the user excluded.
    locked: box.locked === true,
    hidden: box.hidden === true,
  }
}

/** Filesystem-safe session key; the session id never appears as a raw path segment. */
export function sessionKey(sessionId) {
  return String(sessionId ?? 'global').replace(/[^\w.-]/g, '_').slice(0, 120) || 'global'
}

function newRecordId() {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.(\d{3})Z$/, '$1Z')
  return `${stamp}-${randomBytes(2).toString('hex')}`
}

export class StudioStore {
  /**
   * @param {{ root: string }} options
   */
  constructor(options) {
    this.root = options.root
    this.chain = Promise.resolve()
    this.listeners = new Set()
    // New drafts start from the user's defaults, not from a frozen constant.
    this.defaults = typeof options.defaults === 'function' ? options.defaults : () => ({ ...DEFAULT_PARAMS })
    this.index = undefined
    this.indexBuild = undefined
  }

  get recordsDir() { return join(this.root, 'records') }
  get draftsDir() { return join(this.root, 'drafts') }

  /** Register a change listener; returns its disposer. */
  subscribe(listener) {
    this.listeners.add(listener)
    return () => { this.listeners.delete(listener) }
  }

  emit(event) {
    for (const listener of [...this.listeners]) {
      try { listener(event) } catch { /* a broken subscriber must not break the writer */ }
    }
  }

  async ensure() {
    await mkdir(this.recordsDir, { recursive: true })
    await mkdir(this.draftsDir, { recursive: true })
  }

  /** Serialize every mutation so revision numbers cannot interleave. */
  mutate(task) {
    const run = this.chain.then(task, task)
    this.chain = run.catch(() => {})
    return run
  }

  async readJson(path, fallback) {
    try {
      return JSON.parse(await readFile(path, 'utf8'))
    } catch (error) {
      if (error && error.code === 'ENOENT') return fallback
      if (error instanceof SyntaxError) throw new StudioError('CORRUPT_STATE', `state file is not valid JSON: ${path}`)
      throw error
    }
  }

  async writeJson(path, value) {
    const temporary = `${path}.${randomBytes(3).toString('hex')}.tmp`
    await writeFile(temporary, JSON.stringify(value, null, 2), 'utf8')
    await rename(temporary, path)
  }

  async draftPath(sessionId) {
    return join(this.draftsDir, `${sessionKey(sessionId)}.json`)
  }

  /** Read one session's draft, creating the default shape when absent. */
  async draft(sessionId) {
    const stored = await this.readJson(await this.draftPath(sessionId), null)
    if (stored === null) {
      return { sessionId: sessionKey(sessionId), revision: 0, updatedAt: null, params: { ...this.defaults() } }
    }
    return {
      sessionId: sessionKey(sessionId),
      revision: typeof stored.revision === 'number' ? stored.revision : 0,
      updatedAt: typeof stored.updatedAt === 'number' ? stored.updatedAt : null,
      params: { ...DEFAULT_PARAMS, ...sanitizeParams(stored.params ?? {}, { partial: true }) },
    }
  }

  /**
   * Merge a patch into one session's draft.
   * @param {string} sessionId
   * @param {Record<string, unknown>} patch
   * @param {number | undefined} expectedRevision - when given, a mismatch is a conflict
   * @param {string} source - who wrote it: "user" | "ai"
   */
  async putDraft(sessionId, patch, expectedRevision, source = 'user') {
    return this.mutate(async () => {
      await this.ensure()
      const current = await this.draft(sessionId)
      if (expectedRevision !== undefined && expectedRevision !== null && expectedRevision !== current.revision) {
        return { conflict: true, draft: current }
      }
      const merged = { ...current.params, ...sanitizeParams(patch, { partial: true }) }
      const next = {
        sessionId: current.sessionId,
        revision: current.revision + 1,
        updatedAt: Date.now(),
        params: merged,
      }
      await this.writeJson(await this.draftPath(sessionId), next)
      this.emit({ kind: 'draft', sessionId: current.sessionId, revision: next.revision, source })
      return { conflict: false, draft: next }
    })
  }

  /** Replace a session's whole draft (used when loading a record). */
  async setDraft(sessionId, params, source = 'user') {
    return this.mutate(async () => {
      await this.ensure()
      const current = await this.draft(sessionId)
      const next = {
        sessionId: current.sessionId,
        revision: current.revision + 1,
        updatedAt: Date.now(),
        params: sanitizeParams(params),
      }
      await this.writeJson(await this.draftPath(sessionId), next)
      this.emit({ kind: 'draft', sessionId: current.sessionId, revision: next.revision, source })
      return next
    })
  }

  async recordPath(id) {
    return join(this.recordsDir, id, 'record.json')
  }

  /** Newest-first record summaries, without loading images. */
  /**
   * One page of history.
   *
   * Pinned records are listed separately by the panel, so the default page
   * excludes them; archived records stay hidden unless asked for. Ids sort by
   * time, which makes `before` a plain "older than this id" cursor.
   */
  async listRecords({ limit = 40, sessionId, before, pinnedOnly = false, includeArchived = false, query } = {}) {
    const entries = await this.recordIndex()
    const needle = typeof query === 'string' ? query.trim().toLowerCase() : ''
    const ids = [...entries.keys()]
      .filter((id) => before === undefined || before === null || id < before)
      .sort()
      .reverse()
    const out = []
    for (const id of ids) {
      const record = entries.get(id)
      if (record === undefined) continue
      if (sessionId !== undefined && record.sessionId !== sessionId) continue
      if (pinnedOnly ? !record.pinned : record.pinned) continue
      if (!includeArchived && record.archived) continue
      if (needle !== '' && !(`${record.prompt} ${id}`.toLowerCase().includes(needle))) continue
      out.push(record)
      if (out.length >= limit) break
    }
    return out
  }

  /**
   * Record summaries by id, read once and then kept current by the mutators.
   * Every call used to re-scan the directory and parse each record, which made
   * the panel's own refresh the most expensive thing it did.
   * @returns {Promise<Map<string, object>>}
   */
  async recordIndex() {
    if (this.index !== undefined) return this.index
    if (this.indexBuild !== undefined) return this.indexBuild
    this.indexBuild = (async () => {
      const map = new Map()
      let entries = []
      try {
        entries = await readdir(this.recordsDir, { withFileTypes: true })
      } catch (error) {
        if (error && error.code === 'ENOENT') {
          this.index = map
          return map
        }
        throw error
      }
      for (const entry of entries) {
        if (!entry.isDirectory()) continue
        const record = await this.readJson(join(this.recordsDir, entry.name, 'record.json'), null)
        if (record !== null) map.set(entry.name, summarize(record))
      }
      this.index = map
      return map
    })()
    try {
      return await this.indexBuild
    } finally {
      this.indexBuild = undefined
    }
  }

  /**
   * Pin or archive one record.
   * @param {string} id
   * @param {{ pinned?: boolean, archived?: boolean }} flags
   */
  async setRecordFlags(id, flags) {
    return this.mutate(async () => {
      const record = await this.record(id)
      const next = { ...record }
      if (typeof flags.pinned === 'boolean') next.pinned = flags.pinned
      if (typeof flags.archived === 'boolean') {
        next.archivedAt = flags.archived ? Date.now() : null
        // Archiving puts a record out of the way, so it cannot stay pinned.
        if (flags.archived) next.pinned = false
      }
      await this.writeJson(await this.recordPath(id), next)
      this.index?.set(id, summarize(next))
      this.emit({ kind: 'records' })
      return summarize(next)
    })
  }

  async record(id) {
    if (!/^[\w.-]+$/.test(id)) throw new StudioError('BAD_ID', 'invalid record id')
    const record = await this.readJson(await this.recordPath(id), null)
    if (record === null) throw new StudioError('NOT_FOUND', `record ${id} does not exist`)
    return record
  }

  imagePath(id) {
    if (!/^[\w.-]+$/.test(id)) throw new StudioError('BAD_ID', 'invalid record id')
    return join(this.recordsDir, id, 'image.png')
  }

  /** Create a record in the running state so history shows it immediately. */
  async createRecord({ sessionId, params, status = 'running' }) {
    return this.mutate(async () => {
      await this.ensure()
      const id = newRecordId()
      const record = {
        // Migration anchor: readers may rely on the shape this version wrote.
        version: 1,
        id,
        createdAt: Date.now(),
        sessionId: sessionKey(sessionId),
        status,
        params: sanitizeParams(params),
        result: null,
        image: null,
        error: null,
      }
      await mkdir(join(this.recordsDir, id), { recursive: true })
      await this.writeJson(join(this.recordsDir, id, 'record.json'), record)
      this.index?.set(id, summarize(record))
      this.emit({ kind: 'records' })
      return record
    })
  }

  async updateRecord(id, patch) {
    return this.mutate(async () => {
      const record = await this.record(id)
      const next = { ...record, ...patch }
      await this.writeJson(await this.recordPath(id), next)
      this.index?.set(id, summarize(next))
      this.emit({ kind: 'records' })
      return next
    })
  }

  /** Finish a record: persist the result metadata and the image bytes together. */
  async finishRecord(id, { status, result, image, data, error }) {
    return this.mutate(async () => {
      const record = await this.record(id)
      if (data !== undefined) await writeFile(join(this.recordsDir, id, 'image.png'), data)
      const next = {
        ...record,
        status,
        result: result ?? null,
        image: image ?? null,
        error: error ?? null,
      }
      await this.writeJson(await this.recordPath(id), next)
      this.index?.set(id, summarize(next))
      this.emit({ kind: 'records' })
      return next
    })
  }

  /**
   * Trim history down to `keep` records.
   *
   * Pinned records are never removed — pinning is how a user protects a result —
   * and a running record is still being written by the engine. Oldest go first.
   * @param {number} keep - maximum records to retain; 0 or less disables pruning
   * @returns {Promise<{ removed: number, kept: number }>}
   */
  async pruneRecords(keep) {
    return this.mutate(async () => {
      if (typeof keep !== 'number' || !Number.isFinite(keep) || keep <= 0) {
        return { removed: 0, kept: (await this.recordIndex()).size }
      }
      const entries = await this.recordIndex()
      const limit = Math.floor(keep)
      const excess = entries.size - limit
      if (excess <= 0) return { removed: 0, kept: entries.size }
      const victims = [...entries.keys()]
        .sort()
        .filter((id) => {
          const record = entries.get(id)
          return record !== undefined && record.pinned !== true && record.status !== 'running'
        })
        .slice(0, excess)
      for (const id of victims) {
        await rm(join(this.recordsDir, id), { recursive: true, force: true })
        entries.delete(id)
      }
      if (victims.length > 0) this.emit({ kind: 'records' })
      return { removed: victims.length, kept: entries.size }
    })
  }

  async deleteRecord(id) {
    return this.mutate(async () => {
      if (!/^[\w.-]+$/.test(id)) throw new StudioError('BAD_ID', 'invalid record id')
      // A running record is still being written by the engine; deleting its
      // directory would throw away the picture the GPU already rendered.
      const record = await this.record(id)
      if (record.status === 'running') {
        throw new StudioError('BUSY', '这条记录还在生成，等它结束再删')
      }
      await rm(join(this.recordsDir, id), { recursive: true, force: true })
      this.index?.delete(id)
      this.emit({ kind: 'records' })
      return { id }
    })
  }

}

function summarize(record) {
  return {
    id: record.id,
    createdAt: record.createdAt,
    sessionId: record.sessionId,
    status: record.status,
    size: record.params?.size ?? '',
    steps: record.params?.steps ?? 0,
    seed: record.params?.seed ?? 0,
    boxCount: Array.isArray(record.params?.boxes) ? record.params.boxes.length : 0,
    prompt: typeof record.params?.prompt === 'string' ? record.params.prompt : '',
    width: record.result?.width ?? 0,
    height: record.result?.height ?? 0,
    seconds: record.result?.seconds ?? 0,
    hasImage: record.image !== null && record.image !== undefined,
    pinned: record.pinned === true,
    archived: record.archivedAt !== null && record.archivedAt !== undefined,
    error: record.error ?? null,
  }
}

/** Default data root. */
export function defaultDataRoot() {
  return join(homedir(), '.dsh', 'moss-studio')
}
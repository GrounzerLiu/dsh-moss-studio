/**
 * Same-origin HTTP surface for the studio panel.
 *
 *   GET    /plugins/dsh-moss-studio/state?sessionId=…&limit=…
 *   PUT    /plugins/dsh-moss-studio/draft
 *   POST   /plugins/dsh-moss-studio/generate
 *   GET    /plugins/dsh-moss-studio/records
 *   GET    /plugins/dsh-moss-studio/records/<id>
 *   DELETE /plugins/dsh-moss-studio/records/<id>
 *   GET    /plugins/dsh-moss-studio/image/<id>
 *   GET    /plugins/dsh-moss-studio/events?sessionId=…   (server-sent events)
 */
import { readFile } from 'node:fs/promises'
import { StudioError, sanitizeParams } from './storage.js'
import { readSettingsPatch } from './settings.js'

export const ROUTE_PREFIX = '/plugins/dsh-moss-studio'

const MAX_BODY_BYTES = 2 * 1024 * 1024

function json(res, status, body) {
  const payload = JSON.stringify(body)
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'referrer-policy': 'no-referrer',
  })
  res.end(payload)
}

function fail(res, error) {
  if (error instanceof StudioError) {
    const status = error.code === 'NOT_FOUND' ? 404 : error.code === 'BAD_ID' ? 400 : error.code === 'BUSY' ? 409 : 400
    json(res, status, { error: error.code, message: error.message })
    return
  }
  json(res, 500, { error: 'INTERNAL', message: error instanceof Error ? error.message : String(error) })
}

/**
 * Reject cross-origin writes. Same-origin fetches from the app either omit
 * Origin (GET) or send the app's own origin (writes).
 */
function sameOrigin(req) {
  const origin = req.headers.origin
  if (origin === undefined) return true
  const host = req.headers.host
  if (host === undefined) return false
  try {
    const parsed = new URL(origin)
    return parsed.host === host
  } catch {
    return false
  }
}

async function readJsonBody(req) {
  const chunks = []
  let size = 0
  for await (const chunk of req) {
    size += chunk.length
    if (size > MAX_BODY_BYTES) throw new StudioError('TOO_LARGE', 'request body is too large')
    chunks.push(chunk)
  }
  if (size === 0) return {}
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    throw new StudioError('BAD_JSON', 'request body is not valid JSON')
  }
}

/**
 * @param {object} deps
 * @param {import('./storage.js').StudioStore} deps.store
 * @param {(input: object) => Promise<object>} deps.generate
 * @param {() => boolean} deps.isGenerating
 */
export function studioRoutes(deps) {
  const { store } = deps

  async function stateBody(sessionId, limit, includeArchived) {
    const draft = await store.draft(sessionId)
    // Pinned records get their own section, so the paged list leaves them out.
    // Ask for one extra row so an overflowing pin list can say so instead of
    // silently hiding the rest.
    const pinnedPage = await store.listRecords({ limit: 51, pinnedOnly: true })
    const pinned = pinnedPage.slice(0, 50)
    const records = await store.listRecords({ limit, includeArchived })
    const nextBefore = records.length === limit ? records[records.length - 1].id : null
    return {
      ok: true,
      sessionId: draft.sessionId,
      revision: draft.revision,
      params: draft.params,
      updatedAt: draft.updatedAt,
      records,
      pinned,
      pinnedTruncated: pinnedPage.length > 50,
      nextBefore,
      generations: typeof deps.generations === 'function' ? deps.generations() : [],
      generation: deps.isGenerating() && typeof deps.generationProgress === 'function'
        ? { recordId: deps.busyRecordId?.() ?? null, sessionId: deps.busySession?.() ?? null, progress: deps.generationProgress() }
        : null,
    }
  }

  async function route(req, res) {
    if (!sameOrigin(req)) return json(res, 403, { error: 'ORIGIN_REJECTED', message: 'cross-origin request rejected' })
    const url = new URL(req.url ?? '/', 'http://localhost')
    const path = url.pathname.startsWith(ROUTE_PREFIX) ? url.pathname.slice(ROUTE_PREFIX.length) : url.pathname
    const sessionId = url.searchParams.get('sessionId') ?? 'global'
    // Only a stream that asked for a session gets its draft events filtered.
    const filterBySession = url.searchParams.has('sessionId')

    if (path === '/settings' && req.method === 'GET') {
      if (typeof deps.settings !== 'function') return json(res, 501, { error: 'NO_SETTINGS', message: 'settings unavailable' })
      return json(res, 200, await deps.settings())
    }

    if (path === '/settings' && req.method === 'PATCH') {
      if (typeof deps.saveSettings !== 'function') return json(res, 501, { error: 'NO_SETTINGS', message: 'settings unavailable' })
      const body = await readJsonBody(req)
      // Validate before touching the profile so a typo never reaches the YAML.
      readSettingsPatch(body)
      const state = await deps.saveSettings(body)
      return json(res, 200, state)
    }

    if (path === '/health' && req.method === 'GET') {
      const health = typeof deps.health === 'function' ? await deps.health() : { ok: false, error: 'not configured' }
      return json(res, 200, {
        ok: true,
        comfy: health,
        busy: deps.isGenerating(),
        // Which draft holds the pipeline, so another session can say why it waits.
        busySession: typeof deps.busySession === 'function' ? deps.busySession() : null,
        busyRecordId: typeof deps.busyRecordId === 'function' ? deps.busyRecordId() : null,
        progress: deps.isGenerating() && typeof deps.generationProgress === 'function' ? deps.generationProgress() : null,
        generations: typeof deps.generations === 'function' ? deps.generations() : [],
      })
    }

    if (path === '/state' && req.method === 'GET') {
      const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit') ?? 40) | 0))
      const includeArchived = url.searchParams.get('archived') === '1'
      return json(res, 200, await stateBody(sessionId, limit, includeArchived))
    }

    if (path === '/draft' && req.method === 'PUT') {
      const body = await readJsonBody(req)
      const target = typeof body.sessionId === 'string' && body.sessionId !== '' ? body.sessionId : sessionId
      const result = await store.putDraft(target, body.patch ?? {}, body.revision, 'user')
      if (result.conflict === true) {
        return json(res, 409, { conflict: true, revision: result.draft.revision, params: result.draft.params, updatedAt: result.draft.updatedAt })
      }
      return json(res, 200, { conflict: false, revision: result.draft.revision, params: result.draft.params, updatedAt: result.draft.updatedAt })
    }

    if (path === '/generate' && req.method === 'POST') {
      const body = await readJsonBody(req)
      const target = typeof body.sessionId === 'string' && body.sessionId !== '' ? body.sessionId : sessionId
      const draft = await store.draft(target)
      if (typeof body.revision === 'number' && body.revision !== draft.revision) {
        return json(res, 409, { conflict: true, revision: draft.revision, params: draft.params })
      }
      // Validate the override exactly like a draft patch, so a bad size or box
      // count is a 400 now rather than a failed record later.
      let params
      try {
        params = { ...draft.params, ...sanitizeParams(body.overrides ?? {}, { partial: true }) }
      } catch (error) {
        return json(res, 400, {
          error: error.code ?? 'INVALID_PARAMS',
          message: error instanceof Error ? error.message : String(error),
        })
      }
      // Wait only until the record exists, not for generation to finish. The
      // client needs its id so another session's record cannot complete this one.
      let recordId
      const created = new Promise((resolve, reject) => {
        void deps.generate({
          sessionId: target,
          params,
          source: 'user',
          onCreated: (record) => {
            recordId = record.id
            resolve(record.id)
          },
        }).catch((error) => {
          const message = error instanceof Error ? error.message : String(error)
          store.emit({ kind: 'error', sessionId: target, recordId, message })
          reject(error)
        })
      })
      try {
        const id = await created
        return json(res, 202, { ok: true, started: true, recordId: id })
      } catch (error) {
        return json(res, 500, { error: 'GENERATE', message: error instanceof Error ? error.message : String(error) })
      }
    }

    if (path === '/generate/cancel' && req.method === 'POST') {
      const body = await readJsonBody(req)
      const target = typeof body.sessionId === 'string' && body.sessionId !== '' ? body.sessionId : sessionId
      if (typeof deps.cancelGeneration !== 'function') {
        return json(res, 501, { error: 'NO_CANCEL', message: '当前宿主不支持取消生成' })
      }
      const cancelled = deps.cancelGeneration({ sessionId: target, recordId: body.recordId })
      return json(res, cancelled ? 200 : 409, { ok: cancelled, cancelled })
    }

    if (path === '/records' && req.method === 'GET') {
      const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit') ?? 40) | 0))
      const before = url.searchParams.get('before') ?? undefined
      const includeArchived = url.searchParams.get('archived') === '1'
      const query = url.searchParams.get('q') ?? undefined
      const records = await store.listRecords({ limit, before, includeArchived, query })
      const nextBefore = records.length === limit ? records[records.length - 1].id : null
      return json(res, 200, { ok: true, records, nextBefore })
    }

    const recordMatch = /^\/records\/([\w.-]+)$/.exec(path)
    if (recordMatch !== null) {
      const id = recordMatch[1]
      if (req.method === 'GET') return json(res, 200, { ok: true, record: await store.record(id) })
      if (req.method === 'DELETE') {
        await store.deleteRecord(id)
        return json(res, 200, { ok: true })
      }
      if (req.method === 'PATCH') {
        const body = await readJsonBody(req)
        const flags = {}
        if (typeof body.pinned === 'boolean') flags.pinned = body.pinned
        if (typeof body.archived === 'boolean') flags.archived = body.archived
        if (Object.keys(flags).length === 0) {
          return json(res, 400, { error: 'BAD_FLAGS', message: 'pinned or archived is required' })
        }
        return json(res, 200, { ok: true, record: await store.setRecordFlags(id, flags) })
      }
      return json(res, 405, { error: 'METHOD', message: 'method not allowed' })
    }

    const imageMatch = /^\/image\/([\w.-]+)$/.exec(path)
    if (imageMatch !== null && req.method === 'GET') {
      const id = imageMatch[1]
      const file = store.imagePath(id)
      let data
      try {
        data = await readFile(file)
      } catch (error) {
        if (error && error.code === 'ENOENT') return json(res, 404, { error: 'NO_IMAGE', message: 'record has no image yet' })
        throw error
      }
      res.writeHead(200, {
        'content-type': 'image/png',
        'content-length': String(data.byteLength),
        'cache-control': 'private, max-age=31536000, immutable',
        'referrer-policy': 'no-referrer',
      })
      res.end(data)
      return undefined
    }

    if (path === '/events' && req.method === 'GET') {
      res.writeHead(200, {
        'content-type': 'text/event-stream; charset=utf-8',
        'cache-control': 'no-cache, no-transform',
        connection: 'keep-alive',
        'x-accel-buffering': 'no',
      })
      // The first frame tells the client the stream is live, so it can stop polling.
      res.write('event: ready\ndata: {}\n\n')
      const dispose = store.subscribe((event) => {
        // Draft and error events belong to one session; history and progress are global.
        if (filterBySession && ['draft', 'error'].includes(event?.kind)
          && event?.sessionId !== undefined && event.sessionId !== sessionId) return
        try {
          res.write(`data: ${JSON.stringify(event)}\n\n`)
        } catch { /* the peer went away; cleanup runs on close */ }
      })
      const heartbeat = setInterval(() => {
        try { res.write(': ping\n\n') } catch { /* ignore */ }
      }, 25_000)
      if (typeof heartbeat.unref === 'function') heartbeat.unref()
      const close = () => {
        clearInterval(heartbeat)
        dispose()
      }
      req.on?.('close', close)
      res.on?.('close', close)
      return undefined
    }

    return json(res, 404, { error: 'NOT_FOUND', message: 'unknown studio route' })
  }

  return async (req, res) => {
    try {
      return await route(req, res)
    } catch (error) {
      return fail(res, error)
    }
  }
}
/**
 * Thin client for the studio routes. Every call is same-origin and carries the
 * session that owns the draft.
 */

const PREFIX = '/plugins/dsh-moss-studio'

async function request(path, init) {
  const response = await fetch(`${PREFIX}${path}`, {
    credentials: 'same-origin',
    headers: init?.body === undefined ? undefined : { 'content-type': 'application/json' },
    ...init,
  })
  let body = null
  const type = response.headers.get('content-type') ?? ''
  if (type.includes('application/json')) body = await response.json().catch(() => null)
  return { status: response.status, body }
}

export async function fetchState(sessionId, limit = 40, archived = false) {
  const query = new URLSearchParams({ sessionId, limit: String(limit) })
  if (archived) query.set('archived', '1')
  const { status, body } = await request(`/state?${query.toString()}`)
  if (status !== 200 || body === null) throw new Error(body?.message ?? `state 请求失败（${status}）`)
  return body
}

/**
 * One page of history, newest first. Pass the previous page's `nextBefore` to
 * continue backwards; a null cursor means the list is exhausted.
 */
export async function fetchRecords(limit = 40, before, archived = false, search) {
  const query = new URLSearchParams({ limit: String(limit) })
  if (typeof search === 'string' && search.trim() !== '') query.set('q', search.trim())
  if (before !== undefined && before !== null) query.set('before', before)
  if (archived) query.set('archived', '1')
  const { status, body } = await request(`/records?${query.toString()}`)
  if (status !== 200 || body === null) throw new Error(body?.message ?? `records 请求失败（${status}）`)
  return { records: body.records ?? [], nextBefore: body.nextBefore ?? null }
}

export async function putDraft(sessionId, patch, revision) {
  return request('/draft', {
    method: 'PUT',
    body: JSON.stringify({ sessionId, patch, revision }),
  })
}

export async function generate(sessionId, revision, overrides) {
  return request('/generate', {
    method: 'POST',
    body: JSON.stringify({ sessionId, revision, overrides }),
  })
}

export async function deleteRecord(id) {
  return request(`/records/${encodeURIComponent(id)}`, { method: 'DELETE' })
}

export function imageUrl(id) {
  return `${PREFIX}/image/${encodeURIComponent(id)}`
}

export async function fetchRecord(id) {
  const { status, body } = await request(`/records/${encodeURIComponent(id)}`)
  if (status !== 200 || body === null) throw new Error(body?.message ?? `记录请求失败（${status}）`)
  return body.record
}
/** Pin or archive one record. */
export async function patchRecord(id, flags) {
  return request(`/records/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(flags),
  })
}

/** ComfyUI reachability, cached on the host for a few seconds. */
export async function fetchHealth() {
  const { status, body } = await request('/health')
  if (status !== 200 || body === null) return { ok: false, error: `health 请求失败（${status}）` }
  return body
}

/** Panel-visible settings plus the read-only wiring values. */
export async function fetchSettings() {
  const { status, body } = await request('/settings')
  if (status !== 200 || body === null) throw new Error(body?.message ?? `设置读取失败（${status}）`)
  return body
}

/** Persist an editable settings patch; the host validates and writes it back. */
export async function saveSettings(patch) {
  return request('/settings', {
    method: 'PATCH',
    body: JSON.stringify(patch),
  })
}

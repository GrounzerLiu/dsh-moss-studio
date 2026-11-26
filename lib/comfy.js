/**
 * Minimal ComfyUI HTTP client: submit an API-format graph, wait for its
 * history entry, then download the produced image.
 *
 * Only Node built-ins and the small `ws` client are used, so a linked plugin
 * outside the profile tree does not depend on any `@deepseek-ai/*` resolution.
 */

import { randomUUID } from 'node:crypto'
import WebSocket from 'ws'

export class ComfyError extends Error {
  /**
   * @param {string} code
   * @param {string} message
   * @param {Record<string, unknown>} [details]
   */
  constructor(code, message, details) {
    super(message)
    this.name = 'ComfyError'
    this.code = code
    this.details = details
  }
}

const JSON_TIMEOUT_MS = 15_000
const IMAGE_MAX_BYTES = 64 * 1024 * 1024

function joinUrl(base, path) {
  return `${base.replace(/\/+$/, '')}${path}`
}

function timeoutSignal(ms) {
  return AbortSignal.timeout(Math.max(1, Math.floor(ms)))
}

function translateNetworkError(error, baseUrl) {
  if (error instanceof ComfyError) return error
  if (error && (error.name === 'AbortError' || error.name === 'TimeoutError')) {
    return new ComfyError('COMFY_TIMEOUT', `ComfyUI 请求超时（${baseUrl}）`)
  }
  return new ComfyError(
    'COMFY_UNREACHABLE',
    `连不上 ComfyUI（${baseUrl}）。请确认 ComfyUI Desktop 已启动、端口正确。`,
    { cause: error instanceof Error ? error.message : String(error) },
  )
}

/**
 * Fetch JSON without throwing on non-2xx; callers decide from `status`.
 * @returns {Promise<{ status: number, body: unknown, contentType: string }>}
 */
async function fetchJson(url, init, signal, timeoutMs = JSON_TIMEOUT_MS) {
  let response
  let text
  try {
    response = await fetch(url, {
      ...init,
      signal: signal === undefined ? timeoutSignal(timeoutMs) : AbortSignal.any([signal, timeoutSignal(timeoutMs)]),
    })
    text = await response.text()
  } catch (error) {
    if (signal?.aborted) throw new ComfyError('ABORTED', '已取消')
    throw translateNetworkError(error, new URL(url).origin)
  }
  const contentType = response.headers.get('content-type') ?? ''
  let body = text
  if (contentType.includes('application/json') && text !== '') {
    try {
      body = JSON.parse(text)
    } catch {
      body = text
    }
  }
  return { status: response.status, body, contentType }
}

/** Turn an HTTP base URL into the ComfyUI websocket endpoint, preserving proxy paths. */
export function progressSocketUrl(baseUrl, clientId) {
  const url = new URL(baseUrl)
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:'
  url.pathname = `${url.pathname.replace(/\/+$/, '')}/ws`
  url.search = ''
  url.hash = ''
  url.searchParams.set('clientId', clientId)
  return url.toString()
}

/** Parse one ComfyUI websocket message into a progress patch. */
export function parseProgressMessage(message) {
  const data = message?.data && typeof message.data === 'object' ? message.data : {}
  if (message?.type === 'progress') {
    const max = Number(data.max)
    const value = Number(data.value)
    if (!(max > 0) || !Number.isFinite(value)) return null
    return {
      promptId: data.prompt_id ?? null,
      percent: Math.min(100, Math.max(0, value / max * 100)),
      step: value,
      maxStep: max,
      node: data.node ?? null,
    }
  }
  if (message?.type === 'progress_state') {
    const all = Object.values(data.nodes ?? {}).filter((node) => node && Number(node.max) > 0)
    const running = all.filter((node) => node.state === 'running')
    // A finished model-load node must not flash 100% while the sampler is still
    // at step 0. Prefer the active node and keep the previous value between nodes.
    const node = running.sort((a, b) => (
      Number(b.max) - Number(a.max)
      || Number(b.value) / Number(b.max) - Number(a.value) / Number(a.max)
    ))[0]
    if (node === undefined) return null
    const max = Number(node.max)
    const value = Number(node.value)
    return {
      promptId: data.prompt_id ?? node.prompt_id ?? null,
      percent: Math.min(100, Math.max(0, value / max * 100)),
      step: value,
      maxStep: max,
      node: node.node_id ?? node.display_node_id ?? null,
    }
  }
  if (message?.type === 'execution_start') return { promptId: data.prompt_id ?? null, percent: 0, step: 0, node: null }
  if (message?.type === 'execution_success') return { promptId: data.prompt_id ?? null, percent: 100 }
  if (message?.type === 'executing' && data.node !== undefined) return { promptId: data.prompt_id ?? null, node: data.node }
  if (message?.type === 'status') {
    const remaining = Number(data.status?.exec_info?.queue_remaining)
    return Number.isFinite(remaining) && remaining >= 0 ? { queueRemaining: remaining } : null
  }
  return null
}

/**
 * Best-effort progress stream. A missing/old websocket must never fail a job;
 * HTTP history polling remains the source of truth.
 *
 * @param {string} baseUrl
 * @param {string} clientId
 * @param {AbortSignal} [signal]
 * @param {(progress: { percent?: number, step?: number, maxStep?: number, node?: string|null, queueRemaining?: number }) => void} [onProgress]
 */
export function openProgressSocket(baseUrl, clientId, signal, onProgress, handlers = {}) {
  let socket
  let settled = false
  let resolveReady
  const ready = new Promise((resolve) => { resolveReady = resolve })
  const settle = (value) => {
    if (settled) return
    settled = true
    resolveReady(value)
  }
  try {
    socket = new WebSocket(progressSocketUrl(baseUrl, clientId), { handshakeTimeout: 3000 })
  } catch {
    settle(false)
    handlers.onDown?.('unavailable')
    return { close() {}, ready, isOpen: () => false }
  }
  let closed = false
  const close = () => {
    if (closed) return
    closed = true
    settle(false)
    signal?.removeEventListener?.('abort', close)
    try { socket.close() } catch { /* already closed */ }
  }
  socket.on('open', () => settle(true))
  socket.on('message', (raw, isBinary) => {
    if (isBinary) return
    let message
    try { message = JSON.parse(String(raw)) } catch { return }
    const progress = parseProgressMessage(message)
    if (progress !== null) onProgress?.(progress)
  })
  // A drop is reported separately from a deliberate close: the hub reconnects
  // on the first and stays quiet on the second.
  socket.on('error', () => { close(); handlers.onDown?.('error') })
  socket.on('close', () => { close(); handlers.onDown?.('close') })
  signal?.addEventListener?.('abort', close, { once: true })
  if (signal?.aborted === true) close()
  return { close, ready, isOpen: () => closed !== true }
}

const progressHubs = new Map()

/** Retry ladder for a dropped progress socket; the last value repeats. */
const RECONNECT_DELAYS = [250, 500, 1000, 2000, 4000]

/**
 * One websocket per ComfyUI endpoint, shared by every queued job. ComfyUI sends
 * each prompt's events to the client id used at submission, so a shared hub is
 * required when several prompts are in flight.
 *
 * A dropped socket is reconnected with the same client id. ComfyUI keeps the
 * prompt's owning client id, so once the connection is back it resumes sending
 * progress for jobs already submitted instead of leaving them at "排队中".
 */
export function acquireProgressHub(baseUrl) {
  let hub = progressHubs.get(baseUrl)
  if (hub === undefined) hub = createProgressHub(baseUrl)
  hub.refs = (hub.refs ?? 0) + 1
  return hub
}

function createProgressHub(baseUrl) {
  const clientId = randomUUID()
  const listeners = new Map()
  const latest = new Map()
  let socket = null
  let attempt = 0
  let timer = null
  let closed = false
  let settled = false
  let resolveReady
  const ready = new Promise((resolve) => { resolveReady = resolve })

  const settleReady = (value) => {
    if (settled) return
    settled = true
    resolveReady(value)
  }

  const connect = () => {
    timer = null
    if (closed) return
    socket = openProgressSocket(baseUrl, clientId, undefined, (progress) => {
      if (typeof progress.promptId !== 'string' || progress.promptId === '') return
      latest.set(progress.promptId, progress)
      for (const listener of listeners.get(progress.promptId) ?? []) listener(progress)
    }, {
      onDown: () => {
        socket = null
        if (closed) return
        const delay = RECONNECT_DELAYS[Math.min(attempt, RECONNECT_DELAYS.length - 1)]
        attempt += 1
        timer = setTimeout(connect, delay)
        if (typeof timer.unref === 'function') timer.unref()
      },
    })
    void socket.ready.then((ok) => {
      if (closed) return
      if (ok === true) attempt = 0
      settleReady(ok === true)
    })
  }

  const hub = {
    clientId,
    ready,
    /** True while the socket can carry progress events. */
    online: () => socket !== null && socket.isOpen() === true,
    subscribe(promptId, listener) {
      let set = listeners.get(promptId)
      if (set === undefined) {
        set = new Set()
        listeners.set(promptId, set)
      }
      set.add(listener)
      const pending = latest.get(promptId)
      if (pending !== undefined) listener(pending)
      return () => {
        set.delete(listener)
        latest.delete(promptId)
        if (set.size === 0) listeners.delete(promptId)
      }
    },
    release() {
      closed = true
      if (timer !== null) clearTimeout(timer)
      for (const set of listeners.values()) for (const listener of set) listener({ promptId: '', disconnected: true })
      listeners.clear()
      latest.clear()
      socket?.close()
      socket = null
      progressHubs.delete(baseUrl)
    },
  }
  connect()
  progressHubs.set(baseUrl, hub)
  return hub
}

export function releaseProgressHub(baseUrl, hub) {
  if (hub === undefined) return
  hub.refs = Math.max(0, (hub.refs ?? 1) - 1)
  if (hub.refs === 0) hub.release()
}

/** Locate one prompt in ComfyUI's queue and return a 1-based pending position. */
export async function fetchQueuePosition(baseUrl, promptId, signal) {
  try {
    const { status, body } = await fetchJson(joinUrl(baseUrl, '/queue'), { method: 'GET' }, signal, 5000)
    if (status !== 200 || body === null || typeof body !== 'object') return null
    const running = Array.isArray(body.queue_running) ? body.queue_running : []
    const pending = Array.isArray(body.queue_pending) ? body.queue_pending : []
    const idOf = (entry) => (Array.isArray(entry) ? entry[1] : entry?.prompt_id)
    if (running.some((entry) => idOf(entry) === promptId)) {
      return { state: 'running', position: 0, running: running.length, pending: pending.length }
    }
    const index = pending.findIndex((entry) => idOf(entry) === promptId)
    if (index < 0) return null
    return { state: 'queued', position: index + 1, running: running.length, pending: pending.length }
  } catch {
    return null
  }
}

/** Check the server is alive and return its version. */
export async function probe(baseUrl, signal) {
  const { status, body } = await fetchJson(joinUrl(baseUrl, '/system_stats'), { method: 'GET' }, signal, 5000)
  if (status !== 200 || body === null || typeof body !== 'object') {
    throw new ComfyError('COMFY_BAD_RESPONSE', `ComfyUI 返回异常状态（HTTP ${status}）`)
  }
  const system = body.system && typeof body.system === 'object' ? body.system : {}
  const devices = Array.isArray(body.devices) ? body.devices : []
  const first = devices[0] && typeof devices[0] === 'object' ? devices[0] : undefined
  return {
    version: typeof system.comfyui_version === 'string' ? system.comfyui_version : 'unknown',
    ramTotal: typeof system.ram_total === 'number' ? system.ram_total : undefined,
    ramFree: typeof system.ram_free === 'number' ? system.ram_free : undefined,
    gpu: first === undefined
      ? undefined
      : {
        name: typeof first.name === 'string' ? first.name : 'GPU',
        vramTotal: typeof first.vram_total === 'number' ? first.vram_total : undefined,
        vramFree: typeof first.vram_free === 'number' ? first.vram_free : undefined,
      },
  }
}

/**
 * Submit a graph and return the prompt id.
 * @returns {Promise<{ promptId: string, number: number }>}
 */
export async function submitPrompt(baseUrl, graph, clientId, signal) {
  const { status, body } = await fetchJson(
    joinUrl(baseUrl, '/prompt'),
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ prompt: graph, client_id: clientId }),
    },
    signal,
    30_000,
  )
  if (body === null || typeof body !== 'object') {
    throw new ComfyError('COMFY_BAD_RESPONSE', `ComfyUI /prompt 返回了非 JSON 内容（HTTP ${status}）`)
  }
  const error = body.error
  const nodeErrors = body.node_errors
  const hasNodeErrors = nodeErrors !== null && typeof nodeErrors === 'object' && Object.keys(nodeErrors).length > 0
  if (status !== 200 || error !== undefined || hasNodeErrors) {
    const message = typeof error === 'object' && error !== null && typeof error.message === 'string'
      ? error.message
      : typeof error === 'string' ? error : ''
    const details = []
    if (hasNodeErrors) {
      for (const [nodeId, value] of Object.entries(nodeErrors)) {
        const list = value && Array.isArray(value.errors) ? value.errors : []
        for (const item of list.slice(0, 2)) {
          if (!item || typeof item !== 'object') continue
          const text = [item.message, item.details].filter((part) => typeof part === 'string' && part !== '').join(' - ')
          if (text) details.push(`节点 ${nodeId}: ${text}`)
        }
      }
    }
    throw new ComfyError(
      'COMFY_REJECTED',
      `ComfyUI 拒绝了工作流${message ? `：${message}` : ''}${details.length > 0 ? `（${details.slice(0, 4).join('；')}）` : ''}`,
      { status, nodeErrors },
    )
  }
  if (typeof body.prompt_id !== 'string' || body.prompt_id === '') {
    throw new ComfyError('COMFY_BAD_RESPONSE', 'ComfyUI 没有返回 prompt_id')
  }
  return {
    promptId: body.prompt_id,
    number: typeof body.number === 'number' ? body.number : 0,
  }
}

/**
 * Cancel one submitted prompt, whether it is running or still queued.
 *
 * Current ComfyUI exposes an atomic, idempotent job-cancel endpoint. Older
 * versions only have POST /interrupt, so a 404/405 falls back to its targeted
 * prompt_id form rather than interrupting every job on the server.
 * @param {string} baseUrl
 * @param {string} promptId
 * @param {AbortSignal} [signal] - optional timeout/cancellation for this HTTP request
 */
export async function interruptPrompt(baseUrl, promptId, signal) {
  if (typeof promptId !== 'string' || promptId === '') {
    throw new ComfyError('COMFY_INTERRUPT', 'prompt_id is required to interrupt a ComfyUI prompt')
  }
  const response = await fetchJson(
    joinUrl(baseUrl, `/api/jobs/${encodeURIComponent(promptId)}/cancel`),
    { method: 'POST' },
    signal,
    5000,
  )
  if (response.status === 200) {
    return { promptId, cancelled: response.body?.cancelled !== false }
  }
  if (response.status === 404 || response.status === 405) {
    const legacy = await fetchJson(
      joinUrl(baseUrl, '/interrupt'),
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ prompt_id: promptId }),
      },
      signal,
      5000,
    )
    if (legacy.status !== 200) {
      throw new ComfyError('COMFY_INTERRUPT', `ComfyUI 中断任务失败（HTTP ${legacy.status}）`, { promptId, status: legacy.status })
    }
    return { promptId, cancelled: true }
  }
  throw new ComfyError('COMFY_INTERRUPT', `ComfyUI 取消任务失败（HTTP ${response.status}）`, { promptId, status: response.status })
}

function delay(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new ComfyError('ABORTED', '已取消'))
      return
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort)
      resolve()
    }, ms)
    function onAbort() {
      clearTimeout(timer)
      reject(new ComfyError('ABORTED', '已取消'))
    }
    signal?.addEventListener('abort', onAbort, { once: true })
  })
}

/**
 * Wait deadline for a prompt ComfyUI still has pending.
 *
 * Queue time is not generation time: a job sitting behind three others would
 * otherwise "time out" while nothing is wrong. The deadline slides only while
 * the prompt is reported queued, and never past the hard cap.
 */
export function queuedDeadline(deadline, now, timeoutMs, hardDeadline, state) {
  if (state !== 'queued') return deadline
  return Math.min(hardDeadline, Math.max(deadline, now + timeoutMs))
}

/**
 * Poll `/history/<promptId>` until the run finishes.
 * @returns {Promise<Record<string, unknown>>} the finished history entry.
 */
export async function waitForResult(baseUrl, promptId, options) {
  const { signal, timeoutMs, pollMs, onQueue } = options
  const startedAt = Date.now()
  let deadline = startedAt + timeoutMs
  // Time spent waiting for a queue slot is not the model's doing, so the
  // deadline slides while ComfyUI reports the prompt as pending. The hard cap
  // keeps a stuck queue from holding the job forever.
  const hardDeadline = startedAt + timeoutMs * 4
  let sawServer = false
  let lastQueueAt = 0
  while (Date.now() < deadline) {
    if (signal?.aborted) throw new ComfyError('ABORTED', '已取消')
    let response
    try {
      response = await fetchJson(
        joinUrl(baseUrl, `/history/${encodeURIComponent(promptId)}`),
        { method: 'GET' },
        signal,
        Math.min(JSON_TIMEOUT_MS, Math.max(1000, deadline - Date.now())),
      )
    } catch (error) {
      if (sawServer && error instanceof ComfyError && error.code === 'COMFY_UNREACHABLE') {
        throw new ComfyError(
          'COMFY_LOST',
          'ComfyUI 在出图过程中失去响应，进程可能因显存不足退出。请重启 ComfyUI Desktop 后重试；若反复发生，用 --disable-dynamic-vram 启动或降低尺寸。',
          { cause: error.details?.cause },
        )
      }
      throw error
    }
    sawServer = true
    if (response.status !== 200) {
      throw new ComfyError('COMFY_BAD_RESPONSE', `查询历史失败（HTTP ${response.status}）`)
    }
    const body = response.body
    const entry = body && typeof body === 'object' ? body[promptId] : undefined
    if (entry !== undefined) {
      const status = entry.status && typeof entry.status === 'object' ? entry.status : {}
      if (status.status_str === 'error') {
        const detail = Array.isArray(status.messages)
          ? status.messages.map((message) => (Array.isArray(message) && message[1] && typeof message[1] === 'object'
            ? [message[1].node_type, message[1].node_id, message[1].exception_message].filter(Boolean).join(' ')
            : '')).filter(Boolean).join('; ')
          : ''
        throw new ComfyError('COMFY_EXECUTION', `ComfyUI 执行失败${detail ? `：${detail}` : ''}`)
      }
      const completed = status.completed === true || status.status_str === 'success'
      if (completed || entry.outputs !== undefined) return entry
    }
    if (typeof onQueue === 'function' && Date.now() - lastQueueAt >= Math.max(250, pollMs ?? 1000)) {
      lastQueueAt = Date.now()
      const queue = await fetchQueuePosition(baseUrl, promptId, signal)
      if (queue !== null) {
        onQueue(queue)
        deadline = queuedDeadline(deadline, Date.now(), timeoutMs, hardDeadline, queue.state)
      }
    }
    await delay(Math.max(200, pollMs ?? 1000), signal)
  }
  throw new ComfyError(
    'COMFY_TIMEOUT',
    `等待出图超时（${Math.round(timeoutMs / 1000)} 秒）。任务可能仍在 ComfyUI 队列中，prompt_id=${promptId}。`,
    { promptId },
  )
}

/**
 * Download one output image.
 * @param {{ filename: string, subfolder?: string, type?: string }} image
 * @returns {Promise<{ data: Uint8Array, mediaType: string }>}
 */
export async function downloadImage(baseUrl, image, signal) {
  const query = new URLSearchParams({
    filename: image.filename,
    subfolder: image.subfolder ?? '',
    type: image.type ?? 'output',
  })
  let response
  let buffer
  try {
    response = await fetch(joinUrl(baseUrl, `/view?${query.toString()}`), {
      method: 'GET',
      signal: signal === undefined ? timeoutSignal(60_000) : AbortSignal.any([signal, timeoutSignal(60_000)]),
    })
    buffer = await response.arrayBuffer()
  } catch (error) {
    if (signal?.aborted) throw new ComfyError('ABORTED', '已取消')
    throw translateNetworkError(error, new URL(baseUrl).origin)
  }
  if (!response.ok) {
    throw new ComfyError('COMFY_DOWNLOAD', `下载图片失败（HTTP ${response.status}）`)
  }
  const mediaType = response.headers.get('content-type') ?? 'application/octet-stream'
  if (!mediaType.startsWith('image/')) {
    throw new ComfyError('COMFY_DOWNLOAD', `下载到的内容不是图片（${mediaType}）`)
  }
  if (buffer.byteLength > IMAGE_MAX_BYTES) {
    throw new ComfyError('COMFY_DOWNLOAD', '图片超过 64 MB，已放弃')
  }
  return { data: new Uint8Array(buffer), mediaType }
}
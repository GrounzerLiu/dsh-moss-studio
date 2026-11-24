/**
 * Minimal ComfyUI HTTP client: submit an API-format graph, wait for its
 * history entry, then download the produced image.
 *
 * Only Node built-ins are used, so a linked plugin outside the profile tree
 * does not depend on any `@deepseek-ai/*` resolution.
 */

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
 * Poll `/history/<promptId>` until the run finishes.
 * @returns {Promise<Record<string, unknown>>} the finished history entry.
 */
export async function waitForResult(baseUrl, promptId, options) {
  const { signal, timeoutMs, pollMs } = options
  const deadline = Date.now() + timeoutMs
  let sawServer = false
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
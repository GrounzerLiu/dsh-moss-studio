/**
 * One generation through the local ComfyUI MOSS-Image graph.
 *
 * Wraps the shared workflow preparation and HTTP client with progress reporting
 * so the studio can show a live status line.
 */
import { randomUUID } from 'node:crypto'
import { probe, submitPrompt, waitForResult, downloadImage, interruptPrompt, openProgressSocket, ComfyError } from './comfy.js'
import { historyImage, injectWorkflow, WorkflowError } from './workflow.js'

/**
 * @param {object} input
 * @param {string} input.baseUrl
 * @param {Record<string, unknown>} input.template
 * @param {Record<string, unknown>} input.params - studio parameters
 * @param {number} [input.timeoutMs]
 * @param {number} [input.pollMs]
 * @param {AbortSignal} [input.signal]
 * @param {(progress: { phase: string, elapsed: number, percent?: number, step?: number, maxStep?: number, node?: string|null, queuePosition?: number, queuePending?: number, queueRunning?: number, queueRemaining?: number }) => void} [input.onProgress]
 * @param {typeof openProgressSocket} [input.socketFactory] - tests can disable the websocket
 */
export async function runGeneration(input) {
  const started = Date.now()
  const { graph, meta } = injectWorkflow(input.template, {
    prompt: input.params.prompt,
    boxes: input.params.boxes,
    size: input.params.size,
    seed: input.params.seed,
    steps: input.params.steps,
    cfg: input.params.cfg,
    negative: input.params.negative,
    characterBoxes: input.params.characterBoxes,
    enhance: input.params.enhance,
    filenamePrefix: 'moss_studio',
  })

  let latest = { phase: 'probe' }
  const report = (patch) => {
    latest = { ...latest, ...patch }
    try {
      input.onProgress?.({ ...latest, elapsed: (Date.now() - started) / 1000 })
    } catch { /* progress is best effort */ }
  }

  report({ phase: 'probe' })
  const info = await probe(input.baseUrl, input.signal)
  const clientId = randomUUID()
  const socket = (input.socketFactory ?? openProgressSocket)(
    input.baseUrl,
    clientId,
    input.signal,
    (progress) => report(progress),
  )
  let submitted
  try {
    report({ phase: 'submit' })
    submitted = await submitPrompt(input.baseUrl, graph, clientId, input.signal)
    report({ phase: 'wait' })
  } catch (error) {
    socket.close()
    throw error
  }

  const cancelSubmitted = async (error) => {
    if (input.signal?.aborted !== true && !(error instanceof ComfyError && error.code === 'ABORTED')) {
      throw error
    }
    try {
      await interruptPrompt(input.baseUrl, submitted.promptId)
    } catch (cause) {
      throw new ComfyError(
        'COMFY_INTERRUPT',
        `已取消，但无法确认 ComfyUI 任务已中断（prompt_id=${submitted.promptId}）`,
        { promptId: submitted.promptId, cause: cause instanceof Error ? cause.message : String(cause) },
      )
    }
    throw new ComfyError('ABORTED', '已取消')
  }

  const ticker = setInterval(() => report({}), 5000)
  let entry
  try {
    entry = await waitForResult(input.baseUrl, submitted.promptId, {
      signal: input.signal,
      timeoutMs: input.timeoutMs ?? 600_000,
      pollMs: input.pollMs ?? 1000,
      onQueue: (queue) => report({
        queuePosition: queue.position,
        queuePending: queue.pending,
        queueRunning: queue.running,
      }),
    })
  } catch (error) {
    clearInterval(ticker)
    socket.close()
    await cancelSubmitted(error)
  } finally {
    clearInterval(ticker)
  }

  try {
    const image = historyImage(entry)
    if (image === null) {
      throw new WorkflowError('ComfyUI 执行完成，但历史里没有输出图片；检查 SaveImage 节点是否被禁用')
    }
    report({ phase: 'download' })
    const downloaded = await downloadImage(input.baseUrl, image, input.signal)

    return {
      data: downloaded.data,
      mediaType: downloaded.mediaType,
      promptId: submitted.promptId,
      meta,
      comfyVersion: info.version,
      seconds: (Date.now() - started) / 1000,
    }
  } catch (error) {
    socket.close()
    await cancelSubmitted(error)
  } finally {
    socket.close()
  }
}

export { ComfyError, WorkflowError }

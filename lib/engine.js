/**
 * One generation through the local ComfyUI MOSS-Image graph.
 *
 * Wraps the shared workflow preparation and HTTP client with progress reporting
 * so the studio can show a live status line.
 */
import { randomUUID } from 'node:crypto'
import { probe, submitPrompt, waitForResult, downloadImage, ComfyError } from './comfy.js'
import { historyImage, injectWorkflow, WorkflowError } from './workflow.js'

/**
 * @param {object} input
 * @param {string} input.baseUrl
 * @param {Record<string, unknown>} input.template
 * @param {Record<string, unknown>} input.params - studio parameters
 * @param {number} [input.timeoutMs]
 * @param {number} [input.pollMs]
 * @param {AbortSignal} [input.signal]
 * @param {(progress: { phase: string, elapsed: number }) => void} [input.onProgress]
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

  const report = (phase) => {
    try {
      input.onProgress?.({ phase, elapsed: (Date.now() - started) / 1000 })
    } catch { /* progress is best effort */ }
  }

  report('probe')
  const info = await probe(input.baseUrl, input.signal)
  report('submit')
  const submitted = await submitPrompt(input.baseUrl, graph, randomUUID(), input.signal)
  report('wait')

  const ticker = setInterval(() => report('wait'), 5000)
  let entry
  try {
    entry = await waitForResult(input.baseUrl, submitted.promptId, {
      signal: input.signal,
      timeoutMs: input.timeoutMs ?? 600_000,
      pollMs: input.pollMs ?? 1000,
    })
  } finally {
    clearInterval(ticker)
  }

  const image = historyImage(entry)
  if (image === null) {
    throw new WorkflowError('ComfyUI 执行完成，但历史里没有输出图片；检查 SaveImage 节点是否被禁用')
  }
  report('download')
  const downloaded = await downloadImage(input.baseUrl, image, input.signal)

  return {
    data: downloaded.data,
    mediaType: downloaded.mediaType,
    promptId: submitted.promptId,
    meta,
    comfyVersion: info.version,
    seconds: (Date.now() - started) / 1000,
  }
}

export { ComfyError, WorkflowError }
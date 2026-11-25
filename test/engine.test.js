import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { ComfyError, runGeneration } from '../lib/engine.js'

const template = JSON.parse(readFileSync('workflow/moss_bbox_api.json', 'utf8'))
const params = {
  prompt: 'a poster', negative: '', boxes: [], size: '512x512', steps: 1, cfg: 1, seed: 1,
  characterBoxes: '', enhance: false,
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })
}

function abortError() {
  const error = new Error('aborted')
  error.name = 'AbortError'
  return error
}

function pendingUntilAbort(signal) {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(abortError())
      return
    }
    signal.addEventListener('abort', () => reject(abortError()), { once: true })
  })
}

function installFetch(t, handler) {
  const original = globalThis.fetch
  globalThis.fetch = handler
  t.after(() => { globalThis.fetch = original })
}

test('aborting a submitted prompt interrupts that prompt through ComfyUI', async (t) => {
  const requests = []
  let submitted
  const promptSubmitted = new Promise((resolve) => { submitted = resolve })
  installFetch(t, async (input, init = {}) => {
    const url = new URL(String(input))
    const method = init.method ?? 'GET'
    requests.push({ path: url.pathname, method, body: init.body })
    if (url.pathname === '/system_stats') return json({ system: { comfyui_version: 'test' }, devices: [] })
    if (url.pathname === '/prompt') {
      submitted()
      return json({ prompt_id: 'prompt-1', number: 1 })
    }
    if (url.pathname === '/history/prompt-1') return pendingUntilAbort(init.signal)
    if (url.pathname === '/api/jobs/prompt-1/cancel') return json({ cancelled: true })
    throw new Error(`unexpected request ${method} ${url.pathname}`)
  })

  const controller = new AbortController()
  const running = runGeneration({
    baseUrl: 'http://127.0.0.1:8188', template, params, signal: controller.signal, timeoutMs: 5000, pollMs: 20,
    socketFactory: () => ({ close() {} }),
  })
  await promptSubmitted
  controller.abort()
  await assert.rejects(running, (error) => {
    assert.ok(error instanceof ComfyError)
    assert.equal(error.code, 'ABORTED')
    assert.equal(error.message, '已取消')
    return true
  })

  const interrupt = requests.find((request) => request.path === '/api/jobs/prompt-1/cancel')
  assert.ok(interrupt, 'the submitted prompt is cancelled')
  assert.equal(interrupt.method, 'POST')
  assert.deepEqual(JSON.parse(interrupt.body ?? '{}'), {}, 'the job id is carried by the URL')
})

test('aborting before submission does not call the interrupt endpoint', async (t) => {
  const requests = []
  let probing
  const probeStarted = new Promise((resolve) => { probing = resolve })
  installFetch(t, async (input, init = {}) => {
    const url = new URL(String(input))
    requests.push({ path: url.pathname, method: init.method ?? 'GET' })
    if (url.pathname === '/system_stats') {
      probing()
      return pendingUntilAbort(init.signal)
    }
    throw new Error(`unexpected request ${url.pathname}`)
  })

  const controller = new AbortController()
  const running = runGeneration({
    baseUrl: 'http://127.0.0.1:8188', template, params, signal: controller.signal, timeoutMs: 5000, pollMs: 20,
    socketFactory: () => ({ close() {} }),
  })
  await probeStarted
  controller.abort()
  await assert.rejects(running, (error) => error instanceof ComfyError && error.code === 'ABORTED')
  assert.equal(requests.some((request) => request.path === '/prompt'), false)
  assert.equal(requests.some((request) => request.path.startsWith('/api/jobs/')), false)
})

test('a failed interrupt is reported instead of pretending cancellation completed', async (t) => {
  let submitted
  const promptSubmitted = new Promise((resolve) => { submitted = resolve })
  installFetch(t, async (input, init = {}) => {
    const url = new URL(String(input))
    if (url.pathname === '/system_stats') return json({ system: { comfyui_version: 'test' }, devices: [] })
    if (url.pathname === '/prompt') {
      submitted()
      return json({ prompt_id: 'prompt-1', number: 1 })
    }
    if (url.pathname === '/history/prompt-1') return pendingUntilAbort(init.signal)
    if (url.pathname === '/api/jobs/prompt-1/cancel') return new Response('', { status: 500 })
    throw new Error(`unexpected request ${url.pathname}`)
  })

  const controller = new AbortController()
  const running = runGeneration({
    baseUrl: 'http://127.0.0.1:8188', template, params, signal: controller.signal, timeoutMs: 5000, pollMs: 20,
    socketFactory: () => ({ close() {} }),
  })
  await promptSubmitted
  controller.abort()
  await assert.rejects(running, (error) => {
    assert.ok(error instanceof ComfyError)
    assert.equal(error.code, 'COMFY_INTERRUPT')
    assert.match(error.message, /无法确认 ComfyUI 任务已中断/)
    assert.equal(error.details.promptId, 'prompt-1')
    return true
  })
})

test('older ComfyUI versions fall back to targeted /interrupt', async (t) => {
  const requests = []
  let submitted
  const promptSubmitted = new Promise((resolve) => { submitted = resolve })
  installFetch(t, async (input, init = {}) => {
    const url = new URL(String(input))
    requests.push({ path: url.pathname, method: init.method ?? 'GET', body: init.body })
    if (url.pathname === '/system_stats') return json({ system: { comfyui_version: 'old' }, devices: [] })
    if (url.pathname === '/prompt') {
      submitted()
      return json({ prompt_id: 'prompt-1', number: 1 })
    }
    if (url.pathname === '/history/prompt-1') return pendingUntilAbort(init.signal)
    if (url.pathname === '/api/jobs/prompt-1/cancel') return new Response('', { status: 404 })
    if (url.pathname === '/interrupt') return new Response('', { status: 200 })
    throw new Error(`unexpected request ${url.pathname}`)
  })

  const controller = new AbortController()
  const running = runGeneration({
    baseUrl: 'http://127.0.0.1:8188', template, params, signal: controller.signal, timeoutMs: 5000, pollMs: 20,
    socketFactory: () => ({ close() {} }),
  })
  await promptSubmitted
  controller.abort()
  await assert.rejects(running, (error) => error instanceof ComfyError && error.code === 'ABORTED')
  const legacy = requests.find((request) => request.path === '/interrupt')
  assert.ok(legacy)
  assert.deepEqual(JSON.parse(legacy.body), { prompt_id: 'prompt-1' })
})

test('generation reports sampler progress and queue position without failing the run', async (t) => {
  const updates = []
  let historyChecks = 0
  installFetch(t, async (input, init = {}) => {
    const url = new URL(String(input))
    if (url.pathname === '/system_stats') return json({ system: { comfyui_version: 'test' }, devices: [] })
    if (url.pathname === '/prompt') return json({ prompt_id: 'prompt-1', number: 1 })
    if (url.pathname === '/history/prompt-1') {
      historyChecks += 1
      if (historyChecks === 1) return json({})
      return json({ 'prompt-1': { status: { completed: true }, outputs: { '9': { images: [{ filename: 'x.png', subfolder: '', type: 'output' }] } } } })
    }
    if (url.pathname === '/queue') return json({ queue_running: [], queue_pending: [[1, 'prompt-1', {}, [], []]] })
    if (url.pathname === '/view') return new Response(new Uint8Array([1, 2, 3]), { status: 200, headers: { 'content-type': 'image/png' } })
    throw new Error(`unexpected request ${url.pathname}`)
  })

  const result = await runGeneration({
    baseUrl: 'http://127.0.0.1:8188', template, params, timeoutMs: 5000, pollMs: 20,
    socketFactory: (_baseUrl, _clientId, _signal, onProgress) => {
      onProgress({ percent: 50, step: 5, maxStep: 10, node: '18' })
      return { close() {} }
    },
    onProgress: (progress) => updates.push(progress),
  })
  assert.equal(result.promptId, 'prompt-1')
  assert.ok(updates.some((entry) => entry.percent === 50 && entry.step === 5 && entry.maxStep === 10))
  assert.ok(updates.some((entry) => entry.queuePosition === 1 && entry.queuePending === 1))
})

test('generation waits for the progress socket before submitting the prompt', async (t) => {
  const order = []
  let openSocket
  const socketReady = new Promise((resolve) => { openSocket = resolve })
  installFetch(t, async (input, init = {}) => {
    const url = new URL(String(input))
    if (url.pathname === '/system_stats') return json({ system: { comfyui_version: 'test' }, devices: [] })
    if (url.pathname === '/prompt') {
      order.push('submit')
      return json({ prompt_id: 'prompt-1', number: 1 })
    }
    if (url.pathname === '/history/prompt-1') {
      return json({ 'prompt-1': { status: { completed: true }, outputs: { '9': { images: [{ filename: 'x.png', subfolder: '', type: 'output' }] } } } })
    }
    if (url.pathname === '/view') return new Response(new Uint8Array([1, 2, 3]), { status: 200, headers: { 'content-type': 'image/png' } })
    throw new Error(`unexpected request ${url.pathname}`)
  })

  const running = runGeneration({
    baseUrl: 'http://127.0.0.1:8188', template, params, timeoutMs: 5000, pollMs: 20,
    socketFactory: () => {
      order.push('socket')
      return { close() {}, ready: socketReady }
    },
  })
  await new Promise((resolve) => setTimeout(resolve, 20))
  assert.deepEqual(order, ['socket'], 'submission waits for websocket readiness')
  openSocket(true)
  await running
  assert.deepEqual(order, ['socket', 'submit'])
})

test('a non-cancellation execution failure does not interrupt another prompt', async (t) => {
  const requests = []
  installFetch(t, async (input, init = {}) => {
    const url = new URL(String(input))
    requests.push({ path: url.pathname, method: init.method ?? 'GET' })
    if (url.pathname === '/system_stats') return json({ system: { comfyui_version: 'test' }, devices: [] })
    if (url.pathname === '/prompt') return json({ prompt_id: 'prompt-1', number: 1 })
    if (url.pathname === '/history/prompt-1') {
      return json({ 'prompt-1': { status: { status_str: 'error', messages: [['execution_error', { exception_message: 'boom' }]] } } })
    }
    throw new Error(`unexpected request ${url.pathname}`)
  })

  await assert.rejects(runGeneration({
    baseUrl: 'http://127.0.0.1:8188', template, params, signal: new AbortController().signal, timeoutMs: 5000, pollMs: 20,
    socketFactory: () => ({ close() {} }),
  }), (error) => error instanceof ComfyError && error.code === 'COMFY_EXECUTION')
  assert.equal(requests.some((request) => request.path.startsWith('/api/jobs/')), false)
})

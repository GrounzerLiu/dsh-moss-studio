import test from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { apply } from '../index.js'

function responseDouble() {
  const out = { status: 0, headers: {}, chunks: [] }
  return {
    out,
    writeHead(status, headers) { out.status = status; out.headers = headers ?? {} },
    write(chunk) { out.chunks.push(Buffer.from(String(chunk))); return true },
    end(chunk) { if (chunk !== undefined) out.chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk))) },
    get body() {
      const text = Buffer.concat(out.chunks).toString('utf8')
      try { return JSON.parse(text) } catch { return text }
    },
  }
}

function request(method, url, body) {
  return {
    method,
    url,
    headers: { host: '127.0.0.1' },
    on() {},
    async *[Symbol.asyncIterator]() {
      if (body !== undefined) yield Buffer.from(JSON.stringify(body))
    },
  }
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

test('host accepts concurrent submissions and cancels only the requested record', async () => {
  const root = await mkdtemp(join(tmpdir(), 'moss-host-multi-'))
  const active = new Set()
  let nextPrompt = 0
  const server = createServer((req, res) => {
    const path = new URL(req.url ?? '/', 'http://127.0.0.1').pathname
    if (path === '/system_stats') {
      res.writeHead(200, { 'content-type': 'application/json' })
      res.end(JSON.stringify({ system: { comfyui_version: 'test' }, devices: [] }))
      return
    }
    if (path === '/prompt') {
      nextPrompt += 1
      const promptId = `prompt-${nextPrompt}`
      active.add(promptId)
      res.writeHead(200, { 'content-type': 'application/json' })
      res.end(JSON.stringify({ prompt_id: promptId, number: nextPrompt }))
      return
    }
    if (path.startsWith('/history/')) {
      const promptId = path.slice('/history/'.length)
      res.writeHead(200, { 'content-type': 'application/json' })
      res.end(JSON.stringify({ [promptId]: { status: { status_str: 'running' } } }))
      return
    }
    if (path === '/queue') {
      res.writeHead(200, { 'content-type': 'application/json' })
      res.end(JSON.stringify({ queue_running: [], queue_pending: [...active].map((id, index) => [index + 1, id, {}, [], []]) }))
      return
    }
    if (path.startsWith('/api/jobs/') && path.endsWith('/cancel')) {
      const promptId = path.slice('/api/jobs/'.length, -'/cancel'.length)
      active.delete(promptId)
      res.writeHead(200, { 'content-type': 'application/json' })
      res.end(JSON.stringify({ cancelled: true }))
      return
    }
    res.writeHead(404)
    res.end('')
  })
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  const baseUrl = `http://127.0.0.1:${server.address().port}`
  const routes = []
  const ctx = {
    effect(run) { const dispose = run(); return typeof dispose === 'function' ? dispose : () => {} },
    get() { return undefined },
    logger: { info() {}, warn() {}, error() {} },
    tools: { register() { return () => {} } },
    webServer: { register(route) { routes.push(route); return () => {} } },
  }
  apply(ctx, { dataDir: root, comfyUrl: baseUrl, timeoutMs: 5000, pollMs: 20 })
  const call = async (method, url, body) => {
    const res = responseDouble()
    await routes[0].handler(request(method, url, body), res)
    return res
  }

  const recordIds = []
  let startedVersion = 0
  try {
    for (const prompt of ['first', 'second']) {
      const started = await call('POST', '/plugins/dsh-moss-studio/generate', {
        sessionId: 's1', overrides: { prompt },
      })
      assert.equal(started.out.status, 202)
      recordIds.push(started.body.recordId)
    }
    assert.notEqual(recordIds[0], recordIds[1])
    startedVersion = (await call('GET', '/plugins/dsh-moss-studio/health')).body.generationVersion
    await wait(100)
    assert.equal(active.size, 2, 'both prompts are submitted to ComfyUI')

    const wrong = await call('POST', '/plugins/dsh-moss-studio/generate/cancel', { sessionId: 'other', recordId: recordIds[0] })
    assert.equal(wrong.out.status, 409)
    assert.equal(active.size, 2)

    const cancelled = await call('POST', '/plugins/dsh-moss-studio/generate/cancel', { sessionId: 's1', recordId: recordIds[0] })
    assert.equal(cancelled.out.status, 200)
    await wait(80)
    assert.equal(active.size, 1, 'the other prompt keeps running')

    // The cancelled job left the live table: a second attempt is a 404, not a
    // permission error, so the panel can refresh instead of complaining.
    const again = await call('POST', '/plugins/dsh-moss-studio/generate/cancel', { sessionId: 's1', recordId: recordIds[0] })
    assert.equal(again.out.status, 404)
    assert.equal(again.body.reason, 'missing')

    const health = await call('GET', '/plugins/dsh-moss-studio/health')
    assert.equal(health.body.busy, true)
    assert.deepEqual(health.body.generations.map((entry) => entry.recordId), [recordIds[1]])
    assert.ok(Number.isInteger(health.body.generationVersion))
    assert.ok(health.body.generationVersion > startedVersion, 'job creation, progress and removal advance the version')
  } finally {
    for (const recordId of recordIds) await call('POST', '/plugins/dsh-moss-studio/generate/cancel', { sessionId: 's1', recordId })
    await new Promise((resolve) => server.close(resolve))
    await rm(root, { recursive: true, force: true })
  }
})

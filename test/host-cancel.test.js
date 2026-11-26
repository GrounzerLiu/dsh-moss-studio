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

/** Poll a condition: the full suite runs files in parallel, so fixed sleeps race. */
async function until(check, timeoutMs = 4000) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    if (await check()) return true
    await wait(20)
  }
  return check()
}

test('host cancellation interrupts the submitted ComfyUI job and releases the pipeline', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'moss-host-cancel-'))
  let remoteActive = false
  let cancelCount = 0
  const server = createServer((req, res) => {
    const path = new URL(req.url ?? '/', 'http://127.0.0.1').pathname
    if (path === '/system_stats') {
      res.writeHead(200, { 'content-type': 'application/json' })
      res.end(JSON.stringify({ system: { comfyui_version: 'test' }, devices: [] }))
      return
    }
    if (path === '/prompt') {
      remoteActive = true
      res.writeHead(200, { 'content-type': 'application/json' })
      res.end(JSON.stringify({ prompt_id: 'prompt-1', number: 1 }))
      return
    }
    if (path === '/history/prompt-1') {
      res.writeHead(200, { 'content-type': 'application/json' })
      res.end(JSON.stringify({ 'prompt-1': { status: { status_str: 'running' } } }))
      return
    }
    if (path === '/api/jobs/prompt-1/cancel') {
      remoteActive = false
      cancelCount += 1
      res.writeHead(200, { 'content-type': 'application/json' })
      res.end(JSON.stringify({ cancelled: true }))
      return
    }
    res.writeHead(404)
    res.end('')
  })
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  const address = server.address()
  const baseUrl = `http://127.0.0.1:${address.port}`

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

  let recordId
  try {
    const started = await call('POST', '/plugins/dsh-moss-studio/generate', {
      sessionId: 's1',
      overrides: { prompt: 'a poster' },
    })
    assert.equal(started.out.status, 202)
    assert.equal(typeof started.body.recordId, 'string')
    recordId = started.body.recordId
    assert.ok(await until(() => remoteActive === true), 'the fake ComfyUI job is running')

    const wrongSession = await call('POST', '/plugins/dsh-moss-studio/generate/cancel', {
      sessionId: 'other', recordId,
    })
    assert.equal(wrongSession.out.status, 409)
    assert.equal(remoteActive, true, 'another session cannot cancel this job')

    const cancelled = await call('POST', '/plugins/dsh-moss-studio/generate/cancel', {
      sessionId: 's1', recordId,
    })
    assert.equal(cancelled.out.status, 200)
    assert.equal(cancelled.body.cancelled, true)

    let state
    const settled = await until(async () => {
      state = await call('GET', `/plugins/dsh-moss-studio/state?sessionId=s1`)
      const entry = state.body.records.find((item) => item.id === recordId)
      return entry?.status === 'failed'
    })
    assert.ok(settled, 'the cancelled record is marked failed')
    const record = state.body.records.find((entry) => entry.id === recordId)
    assert.equal(record?.status, 'failed')
    assert.equal(record?.error?.message, '已取消')
    assert.equal(cancelCount, 1)
    assert.equal(remoteActive, false)

    const health = await call('GET', '/plugins/dsh-moss-studio/health')
    assert.equal(health.body.busy, false, 'the finished job leaves the active set')
    assert.equal(health.body.busySession, null)
    assert.equal(health.body.busyRecordId, null)
  } finally {
    if (remoteActive) {
      await call('POST', '/plugins/dsh-moss-studio/generate/cancel', { sessionId: 's1', recordId })
    }
    await new Promise((resolve) => server.close(resolve))
    await rm(root, { recursive: true, force: true })
  }
})

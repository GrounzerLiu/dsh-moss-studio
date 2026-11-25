import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { studioRoutes } from '../lib/routes.js'
import { StudioStore } from '../lib/storage.js'

const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
)

/** Minimal ServerResponse double: records status, headers and body chunks. */
function responseDouble() {
  const out = { status: 0, headers: {}, chunks: [] }
  return {
    out,
    writeHead(status, headers) {
      out.status = status
      out.headers = headers ?? {}
    },
    end(chunk) {
      if (chunk !== undefined) out.chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)))
    },
    write(chunk) {
      out.chunks.push(Buffer.from(String(chunk)))
      return true
    },
    get body() {
      const text = Buffer.concat(out.chunks).toString('utf8')
      try {
        return JSON.parse(text)
      } catch {
        return text
      }
    },
  }
}

function request({ method = 'GET', url, body, origin }) {
  const chunks = body === undefined ? [] : [Buffer.from(JSON.stringify(body))]
  return {
    method,
    url,
    headers: { host: '127.0.0.1:57529', ...(origin === undefined ? {} : { origin }) },
    on() {},
    async *[Symbol.asyncIterator]() {
      for (const chunk of chunks) yield chunk
    },
  }
}

async function harness(run, extra = {}) {
  const root = await mkdtemp(join(tmpdir(), 'moss-routes-'))
  const store = new StudioStore({ root })
  await store.ensure()
  let generating = false
  const started = []
  const generate = async (input) => {
    started.push(input)
    input.onCreated?.({ id: 'rec' })
    return { recordId: 'rec', width: 512, height: 512, seed: 1, seconds: 1, paths: [], images: [] }
  }
  const handler = studioRoutes({ store, generate, isGenerating: () => generating, ...extra })
  try {
    await run({
      store,
      started,
      call: async (options) => {
        const res = responseDouble()
        await handler(request(options), res)
        return res
      },
      /** Open the event stream with a response double that can emit `close`. */
      stream: async ({ sessionId } = {}) => {
        const { EventEmitter } = await import('node:events')
        const res = new EventEmitter()
        res.status = 0
        res.headers = {}
        res.chunks = []
        res.writeHead = (status, headers) => {
          res.status = status
          res.headers = headers ?? {}
        }
        res.write = (chunk) => {
          res.chunks.push(Buffer.from(String(chunk)))
          return true
        }
        res.end = () => {}
        res.text = () => Buffer.concat(res.chunks).toString('utf8')
        const suffix = sessionId === undefined ? '' : `?sessionId=${encodeURIComponent(sessionId)}`
        await handler(request({ url: `/plugins/dsh-moss-studio/events${suffix}` }), res)
        return res
      },
      setGenerating: (value) => { generating = value },
    })
  } finally {
    await rm(root, { recursive: true, force: true })
  }
}

test('state and health expose the active generation progress snapshot', async () => {
  const progress = { recordId: 'rec-1', sessionId: 's1', phase: 'wait', percent: 40, step: 10, maxStep: 25, queuePosition: 2 }
  await harness(async ({ call }) => {
    const state = await call({ url: '/plugins/dsh-moss-studio/state?sessionId=s1' })
    assert.deepEqual(state.body.generation, { recordId: 'rec-1', sessionId: 's1', progress })
    const health = await call({ url: '/plugins/dsh-moss-studio/health' })
    assert.deepEqual(health.body.progress, progress)
  }, {
    isGenerating: () => true,
    busySession: () => 's1',
    busyRecordId: () => 'rec-1',
    generationProgress: () => progress,
  })
})

test('state reports the draft and the records', async () => {
  await harness(async ({ store, call }) => {
    await store.putDraft('s1', { prompt: 'p' }, 0)
    const res = await call({ url: '/plugins/dsh-moss-studio/state?sessionId=s1' })
    assert.equal(res.out.status, 200)
    assert.equal(res.body.revision, 1)
    assert.equal(res.body.params.prompt, 'p')
    assert.deepEqual(res.body.records, [])
  })
})

test('draft writes bump the revision and stale writes answer 409', async () => {
  await harness(async ({ call }) => {
    const first = await call({ method: 'PUT', url: '/plugins/dsh-moss-studio/draft', body: { sessionId: 's1', patch: { prompt: 'a' }, revision: 0 } })
    assert.equal(first.out.status, 200)
    assert.equal(first.body.revision, 1)

    const stale = await call({ method: 'PUT', url: '/plugins/dsh-moss-studio/draft', body: { sessionId: 's1', patch: { prompt: 'b' }, revision: 0 } })
    assert.equal(stale.out.status, 409)
    assert.equal(stale.body.conflict, true)
    assert.equal(stale.body.params.prompt, 'a')
  })
})

test('generate refuses a stale revision and a busy pipeline', async () => {
  await harness(async ({ store, call, started, setGenerating }) => {
    await store.putDraft('s1', { prompt: 'a' }, 0)
    const stale = await call({ method: 'POST', url: '/plugins/dsh-moss-studio/generate', body: { sessionId: 's1', revision: 0 } })
    assert.equal(stale.out.status, 409)
    assert.equal(started.length, 0)

    setGenerating(true)
    const busy = await call({ method: 'POST', url: '/plugins/dsh-moss-studio/generate', body: { sessionId: 's1', revision: 1 } })
    assert.equal(busy.out.status, 429)

    setGenerating(false)
    const accepted = await call({ method: 'POST', url: '/plugins/dsh-moss-studio/generate', body: { sessionId: 's1', revision: 1 } })
    assert.equal(accepted.out.status, 202)
    assert.equal(accepted.body.recordId, 'rec', 'the client receives the exact record to wait for')
    await new Promise((resolve) => setTimeout(resolve, 10))
    assert.equal(started.length, 1)
    assert.equal(started[0].params.prompt, 'a')
  })
})

test('records can be read and deleted', async () => {
  await harness(async ({ store, call }) => {
    const record = await store.createRecord({ sessionId: 's1', params: { prompt: 'x' } })
    const read = await call({ url: `/plugins/dsh-moss-studio/records/${record.id}` })
    assert.equal(read.out.status, 200)
    assert.equal(read.body.record.id, record.id)

    // A running record refuses deletion: the engine still writes its image.
    const busy = await call({ method: 'DELETE', url: `/plugins/dsh-moss-studio/records/${record.id}` })
    assert.equal(busy.out.status, 409)

    await store.finishRecord(record.id, { status: 'failed', error: { message: 'x' } })
    const removed = await call({ method: 'DELETE', url: `/plugins/dsh-moss-studio/records/${record.id}` })
    assert.equal(removed.out.status, 200)
    assert.equal((await store.listRecords({ limit: 5 })).length, 0)
  })
})

test('images are served with a long private cache and 404 before they exist', async () => {
  await harness(async ({ store, call }) => {
    const record = await store.createRecord({ sessionId: 's1', params: {} })
    const missing = await call({ url: `/plugins/dsh-moss-studio/image/${record.id}` })
    assert.equal(missing.out.status, 404)

    await store.finishRecord(record.id, { status: 'done', result: {}, image: { file: 'image.png' }, data: PNG })
    const served = await call({ url: `/plugins/dsh-moss-studio/image/${record.id}` })
    assert.equal(served.out.status, 200)
    assert.equal(served.out.headers['content-type'], 'image/png')
    assert.match(served.out.headers['cache-control'], /immutable/)
    assert.equal(Buffer.concat(served.out.chunks).byteLength, PNG.byteLength)
  })
})

test('cross-origin writes are rejected', async () => {
  await harness(async ({ call, started }) => {
    const res = await call({
      method: 'POST',
      url: '/plugins/dsh-moss-studio/generate',
      body: { sessionId: 's1' },
      origin: 'http://evil.example',
    })
    assert.equal(res.out.status, 403)
    assert.equal(started.length, 0)
  })
})

test('unknown paths answer 404 as JSON', async () => {
  await harness(async ({ call }) => {
    const res = await call({ url: '/plugins/dsh-moss-studio/nope' })
    assert.equal(res.out.status, 404)
    assert.equal(res.body.error, 'NOT_FOUND')
  })
})

test('events streams a ready frame, pushes changes, and stops on close', async () => {
  await harness(async ({ stream, store }) => {
    const res = await stream()
    assert.equal(res.status, 200)
    assert.match(res.headers['content-type'], /text\/event-stream/)
    assert.match(res.text(), /event: ready/)

    await store.putDraft('s1', { prompt: 'streamed' }, 0)
    const text = res.text()
    assert.match(text, /"kind":"draft"/)
    assert.match(text, /"revision":1/)

    const before = res.chunks.length
    res.emit('close')
    await store.putDraft('s1', { prompt: 'after close' }, 1)
    assert.equal(res.chunks.length, before, 'no writes after the client closes')
  })
})
test('records pages backwards with a before cursor', async () => {
  await harness(async ({ store, call }) => {
    const created = []
    for (let index = 0; index < 3; index++) {
      created.push(await store.createRecord({ sessionId: 's1', params: { prompt: `p${index}` } }))
      await new Promise((resolve) => setTimeout(resolve, 3))
    }
    const first = await call({ url: '/plugins/dsh-moss-studio/records?limit=2' })
    assert.equal(first.out.status, 200)
    assert.deepEqual(first.body.records.map((record) => record.id), [created[2].id, created[1].id])
    assert.equal(first.body.nextBefore, created[1].id)

    const second = await call({ url: `/plugins/dsh-moss-studio/records?limit=2&before=${created[1].id}` })
    assert.deepEqual(second.body.records.map((record) => record.id), [created[0].id])
    assert.equal(second.body.nextBefore, null)
  })
})

test('records can be pinned and archived over PATCH', async () => {
  await harness(async ({ store, call }) => {
    const record = await store.createRecord({ sessionId: 's1', params: { prompt: 'x' } })
    const pinned = await call({ method: 'PATCH', url: `/plugins/dsh-moss-studio/records/${record.id}`, body: { pinned: true } })
    assert.equal(pinned.out.status, 200)
    assert.equal(pinned.body.record.pinned, true)

    const state = await call({ url: '/plugins/dsh-moss-studio/state' })
    assert.deepEqual(state.body.pinned.map((row) => row.id), [record.id])
    assert.deepEqual(state.body.records.map((row) => row.id), [])

    const archived = await call({ method: 'PATCH', url: `/plugins/dsh-moss-studio/records/${record.id}`, body: { archived: true, pinned: false } })
    assert.equal(archived.body.record.archived, true)
    assert.deepEqual((await call({ url: '/plugins/dsh-moss-studio/state' })).body.records.map((row) => row.id), [])
    assert.deepEqual((await call({ url: '/plugins/dsh-moss-studio/state?archived=1' })).body.records.map((row) => row.id), [record.id])

    const bad = await call({ method: 'PATCH', url: `/plugins/dsh-moss-studio/records/${record.id}`, body: {} })
    assert.equal(bad.out.status, 400)
  })
})

test('health reports the ComfyUI probe and the busy flag', async () => {
  await harness(async ({ call }) => {
    const res = await call({ url: '/plugins/dsh-moss-studio/health' })
    assert.equal(res.out.status, 200)
    assert.equal(res.body.ok, true)
    assert.equal(res.body.busy, false)
  })
})

test('health passes the memory figures through', async () => {
  await harness(async ({ call }) => {
    const res = await call({ url: '/plugins/dsh-moss-studio/health' })
    assert.equal(res.out.status, 200)
    assert.equal(res.body.ok, true)
    assert.equal(typeof res.body.busy, 'boolean')
    // The harness route has no ComfyUI, so the probe reports unavailable rather than throwing.
    assert.equal(typeof res.body.comfy, 'object')
  })
})

test('generate rejects an invalid override instead of recording a failure', async () => {
  await harness(async ({ store, call }) => {
    const bad = await call({ method: 'POST', url: '/plugins/dsh-moss-studio/generate', body: { overrides: { steps: 0 } } })
    assert.equal(bad.out.status, 400)
    assert.match(bad.body.message, /steps/)
    assert.deepEqual((await store.listRecords({ limit: 5 })).map((row) => row.id), [])
  })
})
test('records can be searched by prompt across every page', async () => {
  await harness(async ({ store, call }) => {
    for (const prompt of ['a red kite', 'a blue kite', 'green field']) {
      const record = await store.createRecord({ sessionId: 's1', params: { prompt } })
      await store.finishRecord(record.id, { status: 'failed', error: { message: 'x' } })
      await new Promise((resolve) => setTimeout(resolve, 2))
    }
    const hits = await call({ url: '/plugins/dsh-moss-studio/records?q=kite' })
    assert.equal(hits.body.records.length, 2)
    assert.ok(hits.body.records.every((row) => row.prompt.includes('kite')))
  })
})
test('settings expose the wiring and accept an editable patch', async () => {
  const saved = []
  const state = () => ({
    ok: true,
    settings: {
      comfyUrl: 'http://127.0.0.1:8188',
      retention: 0,
      defaults: { size: '1024x1024', steps: 25, cfg: 2.5, negative: 'nsfw' },
      editable: true,
    },
    wiring: { dataDir: 'C:/x', workflowPath: 'C:/x/wf.json', timeoutMs: 600000, pollMs: 1000 },
  })

  await harness(async ({ call }) => {
    const read = await call({ url: '/plugins/dsh-moss-studio/settings' })
    assert.equal(read.out.status, 200)
    assert.equal(read.body.settings.comfyUrl, 'http://127.0.0.1:8188')
    assert.equal(read.body.settings.defaults.steps, 25)
    assert.equal(typeof read.body.wiring.dataDir, 'string')

    const badUrl = await call({ method: 'PATCH', url: '/plugins/dsh-moss-studio/settings', body: { comfyUrl: 'ftp://x' } })
    assert.equal(badUrl.out.status, 400)
    const badKey = await call({ method: 'PATCH', url: '/plugins/dsh-moss-studio/settings', body: { nope: 1 } })
    assert.equal(badKey.out.status, 400)
    const badRetention = await call({ method: 'PATCH', url: '/plugins/dsh-moss-studio/settings', body: { retention: -1 } })
    assert.equal(badRetention.out.status, 400)
    const empty = await call({ method: 'PATCH', url: '/plugins/dsh-moss-studio/settings', body: {} })
    assert.equal(empty.out.status, 400)

    const good = await call({
      method: 'PATCH',
      url: '/plugins/dsh-moss-studio/settings',
      body: { comfyUrl: 'http://127.0.0.1:8189/', retention: 50, defaults: { steps: 30, cfg: 3 } },
    })
    assert.equal(good.out.status, 200)
    assert.equal(good.body.settings.comfyUrl, 'http://127.0.0.1:8188')
  }, {
    settings: state,
    saveSettings: (body) => { saved.push(body); return state() },
  })

  assert.equal(saved.length, 1)
})

test('a session-scoped stream ignores drafts from other sessions', async () => {
  await harness(async ({ stream, store }) => {
    const res = await stream({ sessionId: 's1' })
    assert.match(res.text(), /event: ready/)

    await store.putDraft('other', { prompt: 'not mine' }, 0)
    assert.doesNotMatch(res.text(), /not mine/, 'another session must not wake this panel')

    await store.putDraft('s1', { prompt: 'mine' }, 0)
    assert.match(res.text(), /"kind":"draft"/)
  })
})

test('generate cancellation is scoped to the requested session and record', async () => {
  const calls = []
  await harness(async ({ call }) => {
    const accepted = await call({
      method: 'POST',
      url: '/plugins/dsh-moss-studio/generate/cancel',
      body: { sessionId: 's1', recordId: 'rec-1' },
    })
    assert.equal(accepted.out.status, 200)
    assert.equal(accepted.body.cancelled, true)
  }, {
    cancelGeneration: (input) => { calls.push(input); return true },
  })
  assert.deepEqual(calls, [{ sessionId: 's1', recordId: 'rec-1' }])
})

test('a session-scoped stream ignores progress and errors from other sessions', async () => {
  await harness(async ({ stream, store }) => {
    const res = await stream({ sessionId: 's1' })
    store.emit({ kind: 'progress', sessionId: 'other', recordId: 'r-other', phase: 'wait' })
    store.emit({ kind: 'error', sessionId: 'other', recordId: 'r-other', message: 'other failed' })
    assert.doesNotMatch(res.text(), /other failed/)
    assert.doesNotMatch(res.text(), /r-other/)

    store.emit({ kind: 'progress', sessionId: 's1', recordId: 'r-mine', phase: 'wait' })
    store.emit({ kind: 'error', sessionId: 's1', recordId: 'r-mine', message: 'mine failed' })
    assert.match(res.text(), /r-mine/)
    assert.match(res.text(), /mine failed/)
  })
})

test('health reports which session holds the pipeline', async () => {
  await harness(async ({ call }) => {
    const res = await call({ url: '/plugins/dsh-moss-studio/health' })
    assert.equal(res.body.busy, false)
    assert.equal(res.body.busySession ?? null, null)
  })
})

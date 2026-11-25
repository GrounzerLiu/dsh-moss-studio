import test from 'node:test'
import assert from 'node:assert/strict'
import { once } from 'node:events'

import { WebSocketServer } from 'ws'
import { fetchQueuePosition, openProgressSocket, parseProgressMessage, progressSocketUrl } from '../lib/comfy.js'

test('progress websocket URLs preserve reverse-proxy paths and switch protocol', () => {
  assert.equal(
    progressSocketUrl('http://127.0.0.1:8188/comfy/', 'client-1'),
    'ws://127.0.0.1:8188/comfy/ws?clientId=client-1',
  )
  assert.equal(
    progressSocketUrl('https://example.test/base', 'client-1'),
    'wss://example.test/base/ws?clientId=client-1',
  )
})

test('legacy progress messages become a clamped percentage', () => {
  assert.deepEqual(parseProgressMessage({ type: 'progress', data: { max: 20, value: 5, node: '7' } }), {
    percent: 25, step: 5, maxStep: 20, node: '7',
  })
  assert.equal(parseProgressMessage({ type: 'progress', data: { max: 0, value: 1 } }), null)
})

test('progress_state prefers the running sampler over finished model loading', () => {
  const patch = parseProgressMessage({
    type: 'progress_state',
    data: {
      nodes: {
        load: { value: 1, max: 1, state: 'finished', node_id: '1' },
        sample: { value: 3, max: 12, state: 'running', node_id: '18' },
      },
    },
  })
  assert.deepEqual(patch, { percent: 25, step: 3, maxStep: 12, node: '18' })
  assert.deepEqual(parseProgressMessage({ type: 'execution_start', data: {} }), { percent: 0, step: 0, node: null })
  assert.deepEqual(parseProgressMessage({ type: 'execution_success', data: {} }), { percent: 100 })
})

test('queue position recognizes running and 1-based pending entries', async (t) => {
  const original = globalThis.fetch
  t.after(() => { globalThis.fetch = original })
  globalThis.fetch = async () => new Response(JSON.stringify({
    queue_running: [[0, 'other', {}, [], []]],
    queue_pending: [[1, 'first', {}, [], []], [2, 'mine', {}, [], []], [3, 'last', {}, [], []]],
  }), { status: 200, headers: { 'content-type': 'application/json' } })

  assert.deepEqual(await fetchQueuePosition('http://127.0.0.1:8188', 'mine'), {
    state: 'queued', position: 2, running: 1, pending: 3,
  })
  assert.deepEqual(await fetchQueuePosition('http://127.0.0.1:8188', 'other'), {
    state: 'running', position: 0, running: 1, pending: 3,
  })
  assert.equal(await fetchQueuePosition('http://127.0.0.1:8188', 'missing'), null)
})

test('openProgressSocket receives live messages and closes cleanly', async (t) => {
  const server = new WebSocketServer({ host: '127.0.0.1', port: 0 })
  await once(server, 'listening')
  t.after(() => { for (const client of server.clients) client.terminate(); server.close() })
  const address = server.address()
  const updates = []
  const controller = new AbortController()
  const stream = openProgressSocket(`http://127.0.0.1:${address.port}`, 'client-1', controller.signal, (patch) => updates.push(patch))
  const [client] = await once(server, 'connection')
  client.send(JSON.stringify({ type: 'progress', data: { max: 10, value: 4, node: '18' } }))
  for (let attempt = 0; attempt < 50 && updates.length === 0; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 10))
  }
  assert.deepEqual(updates[0], { percent: 40, step: 4, maxStep: 10, node: '18' })
  stream.close()
  await once(client, 'close')
})

test('queue lookup is best effort when an older server has no queue route', async (t) => {
  const original = globalThis.fetch
  t.after(() => { globalThis.fetch = original })
  globalThis.fetch = async () => new Response('', { status: 404 })
  assert.equal(await fetchQueuePosition('http://127.0.0.1:8188', 'mine'), null)
})

import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { StudioStore, DEFAULT_PARAMS, sanitizeParams, sessionKey } from '../lib/storage.js'

async function withStore(run) {
  const root = await mkdtemp(join(tmpdir(), 'moss-studio-'))
  try {
    const store = new StudioStore({ root })
    await store.ensure()
    await run(store, root)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
}

test('sanitizeParams rejects unknown keys and wrong types', () => {
  assert.throws(() => sanitizeParams({ nope: 1 }), /unknown parameter/)
  assert.throws(() => sanitizeParams({ steps: 0 }), /steps/)
  assert.throws(() => sanitizeParams({ cfg: 99 }), /cfg/)
  assert.throws(() => sanitizeParams({ boxes: 'x' }), /boxes must be an array/)
  assert.throws(() => sanitizeParams({ boxes: [{ x: 0, y: 0, width: 0.1 }] }), /height/)
})

test('sanitizeParams fills defaults for a full params object', () => {
  const full = sanitizeParams({ prompt: 'hi' })
  assert.equal(full.negative, DEFAULT_PARAMS.negative)
  assert.equal(full.steps, DEFAULT_PARAMS.steps)
  assert.deepEqual(full.boxes, [])
})

test('a box keeps its text and description', () => {
  const params = sanitizeParams({
    boxes: [{ x: 0.1, y: 0.2, width: 0.3, height: 0.4, type: 'text', text: 'MOSS', desc: 'top line', palette: ['#fff', 7] }],
  })
  assert.equal(params.boxes[0].type, 'text')
  assert.equal(params.boxes[0].text, 'MOSS')
  assert.deepEqual(params.boxes[0].palette, ['#fff'])
})

test('sessionKey is filesystem safe', () => {
  assert.equal(sessionKey('sess:abc/def'), 'sess_abc_def')
  assert.equal(sessionKey(''), 'global')
})

test('drafts start empty and increment their revision on every write', async () => {
  await withStore(async (store) => {
    const initial = await store.draft('s1')
    assert.equal(initial.revision, 0)
    assert.equal(initial.params.prompt, '')

    const first = await store.putDraft('s1', { prompt: 'one' }, 0, 'user')
    assert.equal(first.conflict, false)
    assert.equal(first.draft.revision, 1)
    assert.equal(first.draft.params.prompt, 'one')

    const second = await store.putDraft('s1', { steps: 30 }, 1, 'ai')
    assert.equal(second.draft.revision, 2)
    assert.equal(second.draft.params.prompt, 'one', 'patch merges instead of replacing')
    assert.equal(second.draft.params.steps, 30)
  })
})

test('a stale revision is a conflict that returns the current draft', async () => {
  await withStore(async (store) => {
    await store.putDraft('s1', { prompt: 'one' }, 0)
    const stale = await store.putDraft('s1', { prompt: 'two' }, 0)
    assert.equal(stale.conflict, true)
    assert.equal(stale.draft.revision, 1)
    assert.equal(stale.draft.params.prompt, 'one')
  })
})

test('drafts are isolated per session', async () => {
  await withStore(async (store) => {
    await store.putDraft('a', { prompt: 'A' }, 0)
    await store.putDraft('b', { prompt: 'B' }, 0)
    assert.equal((await store.draft('a')).params.prompt, 'A')
    assert.equal((await store.draft('b')).params.prompt, 'B')
  })
})

test('records are listed newest first and can be finished and deleted', async () => {
  await withStore(async (store) => {
    const first = await store.createRecord({ sessionId: 's1', params: { prompt: 'x' } })
    await new Promise((resolve) => setTimeout(resolve, 5))
    const second = await store.createRecord({ sessionId: 's1', params: { prompt: 'y' } })
    const list = await store.listRecords({ limit: 10 })
    assert.equal(list.length, 2)
    assert.equal(list[0].id, second.id)
    assert.equal(list[1].id, first.id)
    assert.equal(list[0].status, 'running')

    await store.finishRecord(second.id, {
      status: 'done',
      result: { width: 512, height: 512, seconds: 1.5 },
      image: { file: 'image.png', bytes: 3 },
      data: Buffer.from([1, 2, 3]),
    })
    const record = await store.record(second.id)
    assert.equal(record.status, 'done')
    assert.equal(record.result.width, 512)
    assert.equal((await readFile(store.imagePath(second.id))).byteLength, 3)

    const done = await store.listRecords({ limit: 10 })
    assert.equal(done[0].hasImage, true)
    assert.equal(done[0].seconds, 1.5)

    await store.deleteRecord(second.id)
    assert.equal((await store.listRecords({ limit: 10 })).length, 1)
    await assert.rejects(() => store.record(second.id), /does not exist/)
  })
})

test('failed records keep their error', async () => {
  await withStore(async (store) => {
    const record = await store.createRecord({ sessionId: 's1', params: {} })
    await store.finishRecord(record.id, { status: 'failed', error: { message: 'boom' } })
    const loaded = await store.record(record.id)
    assert.equal(loaded.status, 'failed')
    assert.equal(loaded.error.message, 'boom')
  })
})

test('subscribers hear draft and record changes', async () => {
  await withStore(async (store) => {
    const events = []
    const dispose = store.subscribe((event) => events.push(event.kind))
    await store.putDraft('s1', { prompt: 'x' }, 0)
    await store.createRecord({ sessionId: 's1', params: {} })
    dispose()
    assert.deepEqual(events, ['draft', 'records'])
  })
})
test('listRecords pages backwards with a before cursor', async () => {
  await withStore(async (store) => {
    const created = []
    for (let index = 0; index < 5; index++) {
      created.push(await store.createRecord({ sessionId: 's1', params: { prompt: `p${index}` } }))
      await new Promise((resolve) => setTimeout(resolve, 3))
    }
    const first = await store.listRecords({ limit: 2 })
    assert.deepEqual(first.map((record) => record.id), [created[4].id, created[3].id])

    const second = await store.listRecords({ limit: 2, before: first[1].id })
    assert.deepEqual(second.map((record) => record.id), [created[2].id, created[1].id])

    const third = await store.listRecords({ limit: 2, before: second[1].id })
    assert.deepEqual(third.map((record) => record.id), [created[0].id])
  })
})

test('pinned records leave the main page and archived ones hide by default', async () => {
  await withStore(async (store) => {
    const first = await store.createRecord({ sessionId: 's1', params: { prompt: 'a' } })
    await new Promise((resolve) => setTimeout(resolve, 3))
    const second = await store.createRecord({ sessionId: 's1', params: { prompt: 'b' } })

    await store.setRecordFlags(first.id, { pinned: true })
    const page = await store.listRecords({ limit: 10 })
    assert.deepEqual(page.map((record) => record.id), [second.id], 'pinned records are listed separately')

    const pinned = await store.listRecords({ limit: 10, pinnedOnly: true })
    assert.deepEqual(pinned.map((record) => record.id), [first.id])
    assert.equal(pinned[0].pinned, true)

    await store.setRecordFlags(second.id, { archived: true })
    assert.deepEqual((await store.listRecords({ limit: 10 })).map((record) => record.id), [])
    const withArchived = await store.listRecords({ limit: 10, includeArchived: true })
    assert.deepEqual(withArchived.map((record) => record.id), [second.id])
    assert.equal(withArchived[0].archived, true)

    await store.setRecordFlags(second.id, { archived: false })
    assert.equal((await store.listRecords({ limit: 10 }))[0].archived, false)
  })
})

test('an overflowing pin list reports more than it returns', async () => {
  await withStore(async (store) => {
    for (let index = 0; index < 3; index++) {
      const record = await store.createRecord({ sessionId: 's1', params: { prompt: `p${index}` } })
      await store.setRecordFlags(record.id, { pinned: true })
      await new Promise((resolve) => setTimeout(resolve, 2))
    }
    const page = await store.listRecords({ limit: 2, pinnedOnly: true })
    assert.equal(page.length, 2)
  })
})
test('records carry a schema version for later migrations', async () => {
  await withStore(async (store) => {
    const record = await store.createRecord({ sessionId: 's1', params: { prompt: 'x' } })
    assert.equal(record.version, 1)
    const reread = await store.record(record.id)
    assert.equal(reread.version, 1)
  })
})
test('pruning drops the oldest records but never pinned or running ones', async () => {
  await withStore(async (store) => {
    const ids = []
    for (let index = 0; index < 4; index++) {
      const record = await store.createRecord({ sessionId: 's1', params: { prompt: `p${index}` } })
      await store.finishRecord(record.id, { status: 'failed', error: { message: 'x' } })
      ids.push(record.id)
      await new Promise((resolve) => setTimeout(resolve, 2))
    }
    const running = await store.createRecord({ sessionId: 's1', params: { prompt: 'running' } })
    await store.setRecordFlags(ids[0], { pinned: true })

    const result = await store.pruneRecords(2)
    // The paged list excludes pinned records by design, so check them separately.
    const pinned = (await store.listRecords({ limit: 20, pinnedOnly: true })).map((row) => row.id)
    const page = (await store.listRecords({ limit: 20 })).map((row) => row.id)

    assert.equal(result.kept, 2)
    assert.deepEqual(pinned, [ids[0]], 'pinned survives')
    assert.ok(page.includes(running.id), 'running survives')
    assert.equal(pinned.length + page.length, 2)

    // Disabled pruning is a no-op.
    assert.deepEqual(await store.pruneRecords(0), { removed: 0, kept: 2 })
  })
})

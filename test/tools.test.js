import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { StudioStore } from '../lib/storage.js'
import { studioTools } from '../lib/tools.js'

const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
)

async function harness(run) {
  const root = await mkdtemp(join(tmpdir(), 'moss-tools-'))
  const store = new StudioStore({ root })
  await store.ensure()
  const calls = []
  const generate = async ({ sessionId, params }) => {
    calls.push({ sessionId, params })
    return { recordId: 'rec-1', width: 512, height: 512, seed: 7, seconds: 1.2, paths: [], images: [] }
  }
  const tools = Object.fromEntries(
    studioTools({ store, template: async () => ({}), settings: () => ({}), generate }).map((tool) => [tool.name, tool]),
  )
  try {
    await run({ store, tools, calls })
  } finally {
    await rm(root, { recursive: true, force: true })
  }
}

function exec(agent) {
  return { signal: new AbortController().signal, agent }
}

test('state returns the draft and the history', async () => {
  await harness(async ({ store, tools }) => {
    await store.putDraft('s1', { prompt: 'hi' }, 0)
    await store.createRecord({ sessionId: 's1', params: { prompt: 'hi' } })
    const value = await tools.moss_studio_state.execute({ sessionId: 's1' }, exec())
    assert.equal(value.ok, true)
    assert.equal(value.revision, 1)
    assert.equal(value.params.prompt, 'hi')
    assert.equal(value.records.length, 1)
    const blocks = tools.moss_studio_state.output.render({}, value)
    assert.match(blocks[0].text, /草稿 revision 1/)
  })
})

test('edit merges a patch and reports the new revision', async () => {
  await harness(async ({ tools }) => {
    const first = await tools.moss_studio_edit.execute({ sessionId: 's1', patch: { prompt: 'a', steps: 12 } }, exec())
    assert.equal(first.revision, 1)
    assert.equal(first.params.steps, 12)
    const second = await tools.moss_studio_edit.execute({ sessionId: 's1', patch: { prompt: 'b' }, revision: 1 }, exec())
    assert.equal(second.conflict, false)
    assert.equal(second.revision, 2)
    assert.equal(second.params.steps, 12)
  })
})

test('a stale revision is reported as a conflict, not an error', async () => {
  await harness(async ({ tools }) => {
    await tools.moss_studio_edit.execute({ sessionId: 's1', patch: { prompt: 'a' } }, exec())
    const stale = await tools.moss_studio_edit.execute({ sessionId: 's1', patch: { prompt: 'b' }, revision: 0 }, exec())
    assert.equal(stale.conflict, true)
    assert.equal(stale.revision, 1)
    assert.equal(stale.params.prompt, 'a')
    const blocks = tools.moss_studio_edit.output.render({}, stale)
    assert.match(blocks[0].text, /未应用/)
  })
})

test('generate uses the draft plus overrides', async () => {
  await harness(async ({ tools, store, calls }) => {
    await store.putDraft('s1', { prompt: 'base', steps: 20 }, 0)
    const value = await tools.moss_studio_generate.execute({ sessionId: 's1', overrides: { steps: 40 } }, exec())
    assert.equal(value.ok, true)
    assert.equal(calls.length, 1)
    assert.equal(calls[0].params.prompt, 'base')
    assert.equal(calls[0].params.steps, 40)
    const blocks = tools.moss_studio_generate.output.render({}, value)
    assert.match(blocks[0].text, /已出图 512×512/)
  })
})

test('generate refuses a stale revision without calling ComfyUI', async () => {
  await harness(async ({ tools, store, calls }) => {
    await store.putDraft('s1', { prompt: 'base' }, 0)
    await store.putDraft('s1', { prompt: 'newer' }, 1)
    const value = await tools.moss_studio_generate.execute({ sessionId: 's1', revision: 0 }, exec())
    assert.equal(value.ok, false)
    assert.equal(value.conflict, true)
    assert.equal(calls.length, 0)
  })
})

test('history lists, loads a record into the draft, and deletes it', async () => {
  await harness(async ({ tools, store }) => {
    const record = await store.createRecord({ sessionId: 's1', params: { prompt: 'from record', steps: 9 } })
    await store.finishRecord(record.id, { status: 'done', result: { width: 512, height: 512, seconds: 1 }, image: { file: 'image.png' }, data: PNG })

    const list = await tools.moss_studio_history.execute({ action: 'list' }, exec())
    assert.equal(list.ok, true)
    assert.equal(list.records.length, 1)

    const loaded = await tools.moss_studio_history.execute({ action: 'load', recordId: record.id, sessionId: 's1' }, exec())
    assert.equal(loaded.ok, true)
    assert.equal(loaded.record.params.prompt, 'from record')
    const draft = await store.draft('s1')
    assert.equal(draft.params.steps, 9)

    const removed = await tools.moss_studio_history.execute({ action: 'delete', recordId: record.id }, exec())
    assert.equal(removed.ok, true)
    assert.equal((await store.listRecords({ limit: 5 })).length, 0)
  })
})

test('the session falls back to the calling agent', async () => {
  await harness(async ({ tools, store }) => {
    const value = await tools.moss_studio_edit.execute(
      { patch: { prompt: 'agent-scoped' } },
      exec({ session: { id: 'agent-session' } }),
    )
    assert.equal(value.sessionId, 'agent-session')
    assert.equal((await store.draft('agent-session')).params.prompt, 'agent-scoped')
  })
})

test('tool output schemas are valid JSON Schema objects', async () => {
  await harness(async ({ tools }) => {
    for (const tool of Object.values(tools)) {
      assert.equal(typeof tool.name, 'string')
      assert.equal(typeof tool.description, 'string')
      assert.equal(tool.output.schema.type, 'object')
      assert.equal(typeof tool.output.render, 'function')
      if (tool.output.schema.required !== undefined) assert.ok(Array.isArray(tool.output.schema.required))
    }
  })
})
test('history can pin and archive a record', async () => {
  await harness(async ({ tools, store }) => {
    const record = await store.createRecord({ sessionId: 's1', params: { prompt: 'x' } })

    const pinned = await tools.moss_studio_history.execute({ action: 'pin', recordId: record.id }, exec())
    assert.equal(pinned.ok, true)
    assert.equal(pinned.record.pinned, true)
    assert.deepEqual(pinned.pinned.map((row) => row.id), [record.id])

    const archived = await tools.moss_studio_history.execute({ action: 'archive', recordId: record.id }, exec())
    assert.equal(archived.record.archived, true)
    assert.deepEqual(archived.pinned.map((row) => row.id), [])

    const listed = await tools.moss_studio_history.execute({ action: 'list' }, exec())
    assert.deepEqual(listed.records.map((row) => row.id), [])
    const withArchived = await tools.moss_studio_history.execute({ action: 'list', includeArchived: true }, exec())
    assert.deepEqual(withArchived.records.map((row) => row.id), [record.id])
  })
})

test('generate refuses an override outside the parameter ranges', async () => {
  await harness(async ({ tools }) => {
    const result = await tools.moss_studio_generate.execute({ overrides: { size: '100x100' } }, exec())
    assert.equal(result.ok, false)
    assert.match(result.note, /multiples of 16|0.25/)
  })
})
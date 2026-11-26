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
  const cancelled = []
  const generate = async ({ sessionId, params }) => {
    calls.push({ sessionId, params })
    return { recordId: 'rec-1', width: 512, height: 512, seed: 7, seconds: 1.2, paths: [], images: [] }
  }
  const jobs = [{ recordId: 'rec-live', sessionId: 's1', phase: 'running', percent: 40, step: 4, maxStep: 10 }]
  const tools = Object.fromEntries(
    studioTools({
      store,
      template: async () => ({}),
      settings: () => ({}),
      generate,
      cancelGeneration: ({ sessionId, recordId }) => {
        cancelled.push({ sessionId, recordId })
        return recordId === 'rec-live' ? { ok: true } : { ok: false, reason: 'missing' }
      },
      generationSnapshot: () => ({ version: 7, generations: jobs }),
    }).map((tool) => [tool.name, tool]),
  )
  try {
    await run({ store, tools, calls, cancelled })
  } finally {
    await rm(root, { recursive: true, force: true })
  }
}

function exec(agent) {
  return { signal: new AbortController().signal, agent }
}

/** Validate the JSON Schema subset used by the tool contracts without a new dependency. */
function schemaErrors(value, schema, path = '$') {
  const errors = []
  const type = schema.type
  const matches = type === 'object'
    ? value !== null && typeof value === 'object' && !Array.isArray(value)
    : type === 'array'
      ? Array.isArray(value)
      : type === 'string'
        ? typeof value === 'string'
        : type === 'boolean'
          ? typeof value === 'boolean'
          : type === 'integer'
            ? Number.isInteger(value)
            : type === 'number'
              ? typeof value === 'number' && Number.isFinite(value)
              : true
  if (!matches) return [`${path} must be ${type}`]
  if (type === 'object') {
    for (const key of schema.required ?? []) {
      if (!Object.hasOwn(value, key)) errors.push(`${path}.${key} is required`)
    }
    for (const [key, item] of Object.entries(value)) {
      const child = schema.properties?.[key]
      if (child === undefined) {
        if (schema.additionalProperties === false) errors.push(`${path}.${key} is not allowed`)
        continue
      }
      errors.push(...schemaErrors(item, child, `${path}.${key}`))
    }
  } else if (type === 'array' && schema.items !== undefined) {
    value.forEach((item, index) => errors.push(...schemaErrors(item, schema.items, `${path}[${index}]`)))
  }
  return errors
}

function assertOutput(value, schema) {
  assert.deepEqual(schemaErrors(value, schema), [])
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

test('state and edit outputs satisfy their declared schemas with editing flags', async () => {
  await harness(async ({ tools }) => {
    const box = {
      x: 0.1, y: 0.2, width: 0.3, height: 0.4, type: 'obj', text: '', desc: 'a box', palette: [],
      locked: true, hidden: true,
    }
    const edited = await tools.moss_studio_edit.execute({ sessionId: 's1', patch: { boxes: [box] } }, exec())
    assertOutput(edited, tools.moss_studio_edit.output.schema)
    const state = await tools.moss_studio_state.execute({ sessionId: 's1' }, exec())
    assertOutput(state, tools.moss_studio_state.output.schema)
    assert.equal(state.params.boxes[0].locked, true)
    assert.equal(state.params.boxes[0].hidden, true)
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
    assertOutput(value, tools.moss_studio_generate.output.schema)
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
    assertOutput(list, tools.moss_studio_history.output.schema)

    const loaded = await tools.moss_studio_history.execute({ action: 'load', recordId: record.id, sessionId: 's1' }, exec())
    assert.equal(loaded.ok, true)
    assertOutput(loaded, tools.moss_studio_history.output.schema)
    assert.equal(loaded.record.params.prompt, 'from record')
    const draft = await store.draft('s1')
    assert.equal(draft.params.steps, 9)

    const removed = await tools.moss_studio_history.execute({ action: 'delete', recordId: record.id }, exec())
    assert.equal(removed.ok, true)
    assertOutput(removed, tools.moss_studio_history.output.schema)
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
test('state reports running jobs so an agent can see progress', async () => {
  await harness(async ({ tools }) => {
    const value = await tools.moss_studio_state.execute({ sessionId: 's1' }, exec())
    assert.deepEqual(value.generations.map((job) => job.recordId), ['rec-live'])
    assertOutput(value, tools.moss_studio_state.output.schema)
    assert.match(tools.moss_studio_state.output.render({}, value)[0].text, /运行中: rec-live\(40%\)/)
  })
})

test('history can cancel the running job and explains why it cannot', async () => {
  await harness(async ({ tools, cancelled }) => {
    const ok = await tools.moss_studio_history.execute({ action: 'cancel', recordId: 'rec-live' }, exec({ session: { id: 's1' } }))
    assert.equal(ok.ok, true)
    assert.equal(ok.recordId, 'rec-live')
    assert.deepEqual(cancelled, [{ sessionId: 's1', recordId: 'rec-live' }])
    assertOutput(ok, tools.moss_studio_history.output.schema)

    const missing = await tools.moss_studio_history.execute({ action: 'cancel', recordId: 'rec-gone' }, exec())
    assert.equal(missing.ok, false)
    assert.match(missing.note, /没有正在运行的任务/)
    assertOutput(missing, tools.moss_studio_history.output.schema)
  })
})

test('history can pin and archive a record', async () => {
  await harness(async ({ tools, store }) => {
    const record = await store.createRecord({ sessionId: 's1', params: { prompt: 'x' } })

    const pinned = await tools.moss_studio_history.execute({ action: 'pin', recordId: record.id }, exec())
    assert.equal(pinned.ok, true)
    assert.equal(pinned.record.pinned, true)
    assert.deepEqual(pinned.pinned.map((row) => row.id), [record.id])
    assertOutput(pinned, tools.moss_studio_history.output.schema)

    const archived = await tools.moss_studio_history.execute({ action: 'archive', recordId: record.id }, exec())
    assert.equal(archived.record.archived, true)
    assert.deepEqual(archived.pinned.map((row) => row.id), [])
    assertOutput(archived, tools.moss_studio_history.output.schema)

    const listed = await tools.moss_studio_history.execute({ action: 'list' }, exec())
    assert.deepEqual(listed.records.map((row) => row.id), [])
    assertOutput(listed, tools.moss_studio_history.output.schema)
    const withArchived = await tools.moss_studio_history.execute({ action: 'list', includeArchived: true }, exec())
    assert.deepEqual(withArchived.records.map((row) => row.id), [record.id])
    assertOutput(withArchived, tools.moss_studio_history.output.schema)
  })
})

test('generate refuses an override outside the parameter ranges', async () => {
  await harness(async ({ tools }) => {
    const result = await tools.moss_studio_generate.execute({ overrides: { size: '100x100' } }, exec())
    assert.equal(result.ok, false)
    assert.match(result.note, /multiples of 16|0.25/)
  })
})

test('invalid box geometry is rejected before edit persistence or generation', async () => {
  await harness(async ({ tools, store, calls }) => {
    const boxes = [{ x: 0.9, y: 0.1, width: 0.2, height: 0.2, type: 'obj', desc: 'thing', palette: [] }]
    await assert.rejects(
      tools.moss_studio_edit.execute({ sessionId: 's1', patch: { boxes } }, exec()),
      /right canvas edge/,
    )
    assert.equal((await store.draft('s1')).revision, 0)
    const generated = await tools.moss_studio_generate.execute({ sessionId: 's1', overrides: { boxes } }, exec())
    assert.equal(generated.ok, false)
    assert.match(generated.note, /right canvas edge/)
    assert.equal(calls.length, 0)
  })
})

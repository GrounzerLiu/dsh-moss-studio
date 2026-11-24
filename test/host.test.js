import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { apply } from '../index.js'

/**
 * Activate the host half against a minimal context.
 *
 * This is the cheapest way to catch a reference error inside apply(): such a
 * throw happens inside a ctx.effect callback, so the loader logs it and keeps
 * going while the routes it owns silently never exist. The panel then reports
 * 404 for every request.
 */
test('apply registers the route prefix and the four tools', async () => {
  const root = await mkdtemp(join(tmpdir(), 'moss-host-'))
  const effects = []
  const routes = []
  const tools = []
  const ctx = {
    effect(run, label) {
      try {
        return run()
      } catch (error) {
        effects.push(`${label}: ${error instanceof Error ? error.message : String(error)}`)
        return () => {}
      }
    },
    get() { return undefined },
    get fiber() { return undefined },
    logger: { info() {}, warn() {}, error() {} },
    webServer: { register: (route) => { routes.push(route); return () => {} } },
    tools: { register: (definition) => { tools.push(definition); return () => {} } },
  }

  try {
    apply(ctx, { dataDir: root, comfyUrl: 'http://127.0.0.1:8188' })
    // apply() starts creating the data directory asynchronously; removing it
    // underneath that work made this test flaky under the full suite.
    await new Promise((resolve) => setTimeout(resolve, 50))
  } finally {
    await rm(root, { recursive: true, force: true })
  }

  assert.deepEqual(effects, [], 'no effect may fail during activation')
  assert.equal(routes.length, 1)
  assert.equal(routes[0].kind, 'prefix')
  assert.equal(routes[0].path, '/plugins/dsh-moss-studio')
  assert.equal(typeof routes[0].handler, 'function')
  assert.deepEqual(
    tools.map((tool) => tool.name).sort(),
    ['moss_studio_edit', 'moss_studio_generate', 'moss_studio_history', 'moss_studio_state'],
  )
  for (const tool of tools) {
    assert.equal(typeof tool.output?.render, 'function', `${tool.name} must declare output.render`)
  }
})

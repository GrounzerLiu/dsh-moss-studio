import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const pkg = JSON.parse(readFileSync(fileURLToPath(new URL('../package.json', import.meta.url)), 'utf8'))

/**
 * `dsh.client.inject` may name only packages that ship a `dsh.client` manifest.
 * A library name (for example the slots package) is an unresolvable request and
 * the boot graph rejects the whole composition, which blanks the shell.
 */
const CLIENT_ROWS = new Set([
  '@deepseek-ai/dsh-client-ui-sidebar-right',
  '@deepseek-ai/dsh-client-ui-sidebar',
])

test('every declared client inject names a real client row', () => {
  for (const name of pkg.dsh.client.inject) {
    assert.ok(CLIENT_ROWS.has(name), `${name} is not a client row`)
  }
})

test('the client manifest points at the built bundle and the host entry', () => {
  assert.equal(pkg.exports['./client'], './client.js')
  assert.equal(pkg.dsh.bundle.patch, './cordis.patch.yml')
  assert.ok(pkg.files.includes('client.js'))
})

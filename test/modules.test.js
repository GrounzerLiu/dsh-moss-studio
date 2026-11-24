import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'

/**
 * Every module that calls t() must import it.
 *
 * api.js shipped without the import once: the ReferenceError only fired on an
 * error path, so it read as "读取失败：t is not defined" instead of the real
 * failure. A static check is cheaper than reproducing every error branch.
 */
test('modules that translate import the translator', () => {
  const offenders = []
  for (const file of readdirSync('src')) {
    if (!/\.(jsx|js)$/.test(file) || file === 'i18n.js') continue
    const source = readFileSync(`src/${file}`, 'utf8')
    if (/\bt\(/.test(source) && !source.includes("from './i18n.js'")) offenders.push(file)
  }
  assert.deepEqual(offenders, [], `missing i18n import: ${offenders.join(', ')}`)
})

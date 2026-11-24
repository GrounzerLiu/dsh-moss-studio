import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'

/**
 * Icons referenced by name must exist in the map, or the button renders empty.
 * The image viewer shipped two blank buttons that way: `keyboard_arrow_left`
 * and `keyboard_arrow_right` were never added.
 */
test('every icon referenced by name exists in the map', () => {
  const source = readFileSync('src/icons.jsx', 'utf8')
  const defined = new Set([...source.matchAll(/^\s{2}"([a-z0-9_]+)":/gm)].map((match) => match[1]))
  assert.ok(defined.size > 20, 'the map parsed')

  const missing = new Set()
  for (const file of readdirSync('src').filter((name) => /\.(jsx|js)$/.test(name))) {
    const text = readFileSync(`src/${file}`, 'utf8')
    for (const match of text.matchAll(/<Icon\s+name="([a-z0-9_]+)"/g)) {
      if (!defined.has(match[1])) missing.add(`${file}: ${match[1]}`)
    }
  }
  assert.deepEqual([...missing], [], `icons missing from the map: ${[...missing].join(', ')}`)
})

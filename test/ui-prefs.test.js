import test from 'node:test'
import assert from 'node:assert/strict'

import { DEFAULT_UI, loadUiPrefs, saveUiPrefs } from '../src/ui-prefs.js'

function fakeStorage(initial) {
  const data = { ...initial }
  return {
    getItem: (key) => (key in data ? data[key] : null),
    setItem: (key, value) => { data[key] = String(value) },
    dump: () => ({ ...data }),
  }
}

test('missing preferences fall back to the defaults', () => {
  assert.deepEqual(loadUiPrefs(fakeStorage()), { ...DEFAULT_UI, historyWidth: { ...DEFAULT_UI.historyWidth } })
  assert.deepEqual(loadUiPrefs(undefined).resultHeight, DEFAULT_UI.resultHeight)
})

test('saved preferences round-trip and merge', () => {
  const storage = fakeStorage()
  saveUiPrefs({ resultHeight: 320 }, storage)
  saveUiPrefs({ historyWidth: { narrow: 230, wide: 300 } }, storage)
  const prefs = loadUiPrefs(storage)
  assert.equal(prefs.resultHeight, 320)
  assert.equal(prefs.historyWidth.narrow, 230)
  assert.equal(prefs.historyWidth.wide, 300)
  assert.equal(prefs.resultCollapsed, false)
})

test('out-of-range and corrupt values are clamped or ignored', () => {
  const storage = fakeStorage({ 'moss-studio.ui': JSON.stringify({ resultHeight: 9999, historyWidth: { narrow: 10 } }) })
  const prefs = loadUiPrefs(storage)
  assert.equal(prefs.resultHeight, 720)
  assert.equal(prefs.historyWidth.narrow, 160)
  assert.equal(prefs.historyWidth.wide, DEFAULT_UI.historyWidth.wide)

  const broken = fakeStorage({ 'moss-studio.ui': '{not json' })
  assert.equal(loadUiPrefs(broken).resultHeight, DEFAULT_UI.resultHeight)
})

test('a storage that throws does not break the panel', () => {
  const throwing = { getItem() { throw new Error('blocked') }, setItem() { throw new Error('blocked') } }
  assert.equal(loadUiPrefs(throwing).resultHeight, DEFAULT_UI.resultHeight)
  assert.doesNotThrow(() => saveUiPrefs({ resultHeight: 200 }, throwing))
})

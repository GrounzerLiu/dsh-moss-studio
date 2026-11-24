import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'

import { NS, ZH, EN, attachLocale, currentLocale, getRevision, subscribe, t } from '../src/i18n.js'

/** A stand-in for the client locale service, with the same shape we rely on. */
function fakeLocale(active = 'zh') {
  const dicts = new Map()
  let revision = 0
  const listeners = new Set()
  const publish = () => {
    revision += 1
    for (const listener of listeners) listener()
  }
  const service = {
    register(ns, dictsByLocale) {
      if (dicts.has(ns)) throw new Error(`namespace ${ns} already registered`)
      dicts.set(ns, dictsByLocale)
      publish()
      return () => dicts.delete(ns)
    },
    bind(ns) {
      const table = dicts.get(ns)
      return (key, params) => {
        // Mirrors the service: the active locale first, then the en fallback.
        const template = table?.[active]?.[key] ?? table?.en?.[key] ?? key
        if (params === undefined) return template
        return template.replace(/\{(\w+)\}/g, (match, name) => (name in params ? String(params[name]) : match))
      }
    },
    getSnapshot: () => ({ active, revision }),
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    setActive(next) {
      active = next
      publish()
    },
  }
  return service
}

test('before the service is attached, copy falls back to chinese then the key', () => {
  assert.equal(t('action.delete'), '删除')
  assert.equal(t('history.boxCount', { count: 3 }), '3 框')
  assert.equal(t('no.such.key'), 'no.such.key', 'an unknown key stays visible instead of blank')
})

test('attaching registers the namespace and translates through the service', () => {
  const locale = fakeLocale('en')
  const detach = attachLocale(locale)
  try {
    assert.equal(t('action.delete'), 'Delete')
    assert.equal(t('generate.running', { seconds: 4 }), 'Generating 4s')
    assert.equal(currentLocale(), 'en')
    assert.equal(getRevision(), 1, 'registration published one revision')

    locale.setActive('zh')
    assert.equal(t('action.delete'), '删除')
    assert.equal(currentLocale(), 'zh')
    assert.equal(getRevision(), 2)
  } finally {
    detach()
  }
  assert.equal(t('action.delete'), '删除', 'detaching restores the local fallback')
  assert.equal(currentLocale(), 'zh')
})

test('a locale change notifies subscribers', () => {
  const locale = fakeLocale('zh')
  const detach = attachLocale(locale)
  let calls = 0
  const unsubscribe = subscribe(() => { calls += 1 })
  try {
    locale.setActive('en')
    assert.equal(calls, 1, 'the panel boundary re-renders once per change')
  } finally {
    unsubscribe()
    detach()
  }
})

test('attaching without a usable service is a no-op', () => {
  assert.equal(typeof attachLocale(undefined), 'function')
  assert.equal(t('action.delete'), '删除')
  assert.equal(typeof subscribe(() => {}), 'function')
})

test('both dictionaries carry the same keys and the same placeholders', () => {
  const zhKeys = Object.keys(ZH).sort()
  const enKeys = Object.keys(EN).sort()
  assert.deepEqual(zhKeys, enKeys, 'zh and en must stay aligned')

  const placeholders = (text) => [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort()
  for (const key of zhKeys) {
    assert.ok(ZH[key].trim() !== '', `empty zh text for ${key}`)
    assert.ok(EN[key].trim() !== '', `empty en text for ${key}`)
    assert.deepEqual(
      placeholders(EN[key]),
      placeholders(ZH[key]),
      `placeholder mismatch for ${key}`,
    )
  }
})

test('every key used by the panel exists in both dictionaries', () => {
  const files = readdirSync('src').filter((name) => /\.(jsx|js)$/.test(name) && name !== 'i18n.js')
  const used = new Set()
  for (const file of files) {
    const source = readFileSync(`src/${file}`, 'utf8')
    for (const match of source.matchAll(/(?<![\w.$])t\('([^']+)'/g)) used.add(match[1])
  }
  const missing = [...used].filter((key) => ZH[key] === undefined || EN[key] === undefined)
  assert.deepEqual(missing, [], `missing dictionary entries: ${missing.join(', ')}`)
  assert.ok(used.size > 100, `only ${used.size} keys found`)
})

test('keys are semantic identifiers, never chinese text', () => {
  const chinese = Object.keys(ZH).filter((key) => /[\u4e00-\u9fff]/.test(key))
  assert.deepEqual(chinese, [], 'a chinese literal leaked in as a key')
  const dotted = Object.keys(ZH).filter((key) => /^[a-z][a-zA-Z]*\.[a-z]/.test(key))
  assert.equal(dotted.length, Object.keys(ZH).length, 'keys follow group.name')
  assert.equal(NS, 'moss-studio')
})
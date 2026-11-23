import test from 'node:test'
import assert from 'node:assert/strict'

import { detectLocale, dictionary, getLocale, setLocale, t } from '../src/i18n.js'

test('chinese is the default and doubles as the key', () => {
  setLocale('zh')
  assert.equal(t('删除记录'), '删除记录')
  assert.equal(t('这条文案没有英文'), '这条文案没有英文', 'unknown keys degrade to the source text')
})

test('english comes from the dictionary and fills placeholders', () => {
  setLocale('en')
  assert.equal(t('删除记录'), 'Delete record')
  assert.equal(t('生成中 {seconds}s', { seconds: 7 }), 'Generating 7s')
  assert.equal(t('已完成：{width}×{height}，{seconds} 秒', { width: 512, height: 512, seconds: 2 }), 'Done: 512×512 in 2s')
})

test('language tags map to a supported locale', () => {
  assert.equal(detectLocale('en-US'), 'en')
  assert.equal(detectLocale('zh-CN'), 'zh')
  assert.equal(detectLocale(undefined), 'zh')
  assert.equal(getLocale(), 'zh')
})

test('the dictionary has no empty translations', () => {
  for (const [key, value] of Object.entries(dictionary)) {
    assert.equal(typeof value, 'string')
    assert.ok(value.trim() !== '', `empty translation for ${key}`)
  }
})

test('every CJK key used by the panel exists in the dictionary', async () => {
  const { readFileSync, readdirSync } = await import('node:fs')
  const used = new Set()
  for (const file of readdirSync('src').filter((name) => /\.(jsx|js)$/.test(name))) {
    if (file === 'i18n.js') continue
    const source = readFileSync(`src/${file}`, 'utf8')
    for (const match of source.matchAll(/t\('([^']*[\u4e00-\u9fff][^']*)'/g)) used.add(match[1])
  }
  const missing = [...used].filter((key) => dictionary[key] === undefined)
  assert.deepEqual(missing, [], `missing english entries: ${missing.join(' | ')}`)
})

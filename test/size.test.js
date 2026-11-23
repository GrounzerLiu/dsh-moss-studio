import test from 'node:test'
import assert from 'node:assert/strict'
import { SIZE_PRESETS, formatSize, sizeProblem, splitSize } from '../src/size.js'

test('presets are usable sizes', () => {
  for (const preset of SIZE_PRESETS) {
    const parts = splitSize(preset)
    assert.notEqual(parts, null, `${preset} parses`)
    assert.equal(sizeProblem(parts.width, parts.height, parts.width, parts.height), null, `${preset} is allowed`)
  }
})

test('sizes must be multiples of 16 inside the pixel window', () => {
  assert.match(sizeProblem(100, 100, 100, 100), /16/)
  assert.match(sizeProblem(256, 256, 256, 256), /0\.25 MP/)
  // 2048x2048 is exactly the cap, so the first size over it is wider.
  assert.equal(sizeProblem(2048, 2048, 2048, 2048), null)
  assert.match(sizeProblem(2304, 2048, 2304, 2048), /4 MP/)
  assert.equal(sizeProblem(1536, 640, 1536, 640), null)
})

test('empty input is reported before the number rules', () => {
  assert.match(sizeProblem(Number(''), Number(''), '', ''), /不能为空/)
  assert.match(sizeProblem(0, 0, 'abc', 'def'), /正整数/)
})

test('splitSize accepts the separators people actually type', () => {
  assert.deepEqual(splitSize('768x1024'), { width: 768, height: 1024 })
  assert.deepEqual(splitSize('768 × 1024'), { width: 768, height: 1024 })
  assert.deepEqual(splitSize('768 * 1024'), { width: 768, height: 1024 })
  assert.equal(splitSize('big'), null)
  assert.equal(formatSize(768, 1024), '768x1024')
})

test('download names carry a readable prompt slice', async () => {
  const { downloadName } = await import('../src/format.js')
  assert.equal(downloadName('rec-20261123T064925561Z-e887', 'Minimal poster: cream circle'), 'Minimal-poster-cream-circle-e887.png')
  assert.equal(downloadName('rec-20261123T064925561Z-e887', '海报：蓝圆与黄块'), '海报-蓝圆与黄块-e887.png')
  assert.equal(downloadName('rec-20261123T064925561Z-e887', ''), 'moss-e887.png')
  // Long prompts are cut, and the cut never ends with a separator.
  const long = downloadName('rec-20261123T064925561Z-e887', 'a '.repeat(60))
  assert.ok(long.length <= 48, long)
  assert.ok(!long.includes('-.png'), long)
})

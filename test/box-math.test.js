import test from 'node:test'
import assert from 'node:assert/strict'

import { MIN_SIZE, defaultBox, frameSize, labelMetrics, moveBox, parseRatio, resizeBox, updateBoxGeometry } from '../src/box-math.js'

const box = { x: 0.2, y: 0.2, width: 0.4, height: 0.4, type: 'obj', desc: 'x' }

test('moveBox shifts inside the frame and stops at the edges', () => {
  assert.deepEqual(
    { x: moveBox(box, 0.1, 0.05).x, y: moveBox(box, 0.1, 0.05).y },
    { x: 0.30000000000000004, y: 0.25 },
  )
  assert.equal(moveBox(box, 1, 1).x, 0.6)
  assert.equal(moveBox(box, -1, -1).x, 0)
  assert.equal(moveBox(box, -1, -1).y, 0)
})

test('resizeBox grows and shrinks but never past the edge or below the minimum', () => {
  assert.equal(resizeBox(box, 0.1, 0).width, 0.5)
  assert.equal(resizeBox(box, 5, 5).width, 0.8)
  assert.equal(resizeBox(box, 5, 5).height, 0.8)
  assert.equal(resizeBox(box, -5, -5).width, MIN_SIZE)
  assert.equal(resizeBox(box, -5, -5).height, MIN_SIZE)
})

test('parseRatio reads WIDTHxHEIGHT and falls back to square', () => {
  assert.equal(parseRatio('1024x1024'), 1)
  assert.equal(parseRatio('1024x768'), 1024 / 768)
  assert.equal(parseRatio('768 × 1024'), 0.75)
  assert.equal(parseRatio('nonsense'), 1)
  assert.equal(parseRatio(undefined), 1)
})

test('a default box sits inside the frame with valid fields', () => {
  const created = defaultBox()
  assert.ok(created.x + created.width <= 1)
  assert.ok(created.y + created.height <= 1)
  assert.equal(created.type, 'obj')
  assert.deepEqual(created.palette, [])
})

test('frameSize keeps the aspect ratio inside both budgets', () => {
  const square = frameSize(800, 1, 260)
  assert.deepEqual(square, { width: 260, height: 260 })

  const portrait = frameSize(800, 1024 / 1360, 260)
  assert.ok(Math.abs(portrait.height - 260) < 1e-9)
  assert.ok(portrait.width <= 260)

  const wide = frameSize(800, 16 / 9, 260)
  assert.equal(wide.height, 260)
  assert.ok(wide.width <= 800)

  const narrowColumn = frameSize(120, 1, 260)
  assert.deepEqual(narrowColumn, { width: 120, height: 120 })

  assert.equal(frameSize(0, 1, 260), undefined)
})

test('labelMetrics hides captions on tiny boxes and scales with size', () => {
  assert.equal(labelMetrics(20, 16).show, false)
  const small = labelMetrics(60, 40)
  assert.equal(small.show, true)
  assert.ok(small.fontSize >= 9 && small.fontSize <= 12)
  assert.equal(small.lines, 1)

  const large = labelMetrics(400, 300)
  assert.ok(large.fontSize <= 12)
  assert.ok(large.lines >= 3)
  assert.ok(large.lines <= 6)
})

test('updateBoxGeometry keeps the box inside the frame', () => {
  const box = { x: 0.2, y: 0.2, width: 0.4, height: 0.4 }
  assert.deepEqual(updateBoxGeometry(box, { x: 0.1 }), { ...box, x: 0.1 })
  assert.equal(updateBoxGeometry(box, { width: 0.9 }).width, 0.9)
  assert.ok(Math.abs(updateBoxGeometry(box, { width: 0.9 }).x - 0.1) < 1e-9)
  const wide = updateBoxGeometry(box, { width: 2 })
  assert.equal(wide.width, 1)
  assert.equal(wide.x, 0)
  const tiny = updateBoxGeometry(box, { width: 0, height: 0 })
  assert.equal(tiny.width, MIN_SIZE)
  assert.equal(tiny.height, MIN_SIZE)
  assert.equal(updateBoxGeometry(box, { x: -3 }).x, 0)
})

test('selectionFill answers a usable color with and without color-mix', async () => {
  const { selectionFill } = await import('../src/theme.js')
  const value = selectionFill(16)
  assert.equal(typeof value, 'string')
  assert.ok(value.includes('var(--dsw-alias-brand-primary') || value.includes('var(--dsw-alias-bg-layer-2'))
})

test('memory formatting reports gigabytes and usage', async () => {
  const { gigabytes, usedPercent } = await import('../src/format.js')
  assert.equal(gigabytes(8.5 * 1024 ** 3), '8.5')
  assert.equal(gigabytes(undefined), '—')
  assert.equal(usedPercent(100, 25), 75)
  assert.equal(usedPercent(undefined, 25, 0), 0)
  assert.equal(usedPercent(0, 0, 0), 0)
})

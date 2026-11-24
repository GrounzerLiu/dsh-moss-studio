import test from 'node:test'
import assert from 'node:assert/strict'

import {
  HANDLES,
  MIN_SIZE,
  alignBoxes,
  boxFromCorners,
  defaultBox,
  distributeBoxes,
  duplicateBoxes,
  frameSize,
  labelMetrics,
  moveBox,
  moveBoxes,
  parseRatio,
  resizeBox,
  resizeByHandle,
  selectionBounds,
  snapBox,
  updateBoxGeometry,
} from '../src/box-math.js'

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

  // Narrow boxes go one character per line, which is unreadable: below roughly
  // four characters' width the caption is dropped instead.
  assert.equal(labelMetrics(30, 120).show, false, 'too narrow to read')
  assert.equal(labelMetrics(56, 120).show, true, 'about four characters fits')

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

// --- selection, handles, snapping, alignment -------------------------------

const rect = (x, y, width, height) => ({ type: 'obj', x, y, width, height, desc: '' })

test('a group moves rigidly and stops at the frame edge', () => {
  const boxes = [rect(0.1, 0.1, 0.2, 0.2), rect(0.5, 0.4, 0.2, 0.2), rect(0.8, 0.8, 0.1, 0.1)]
  const moved = moveBoxes(boxes, [0, 1], 0.1, 0.05)
  assert.equal(moved[0].x, 0.2)
  assert.equal(moved[1].x, 0.6)
  assert.equal(moved[2].x, 0.8, 'unselected boxes stay put')

  // The group's right edge is 0.7, so it may travel 0.3 further at most.
  const pushed = moveBoxes(boxes, [0, 1], 0.9, 0)
  assert.ok(Math.abs(pushed[1].x + pushed[1].width - 1) < 1e-9)
  assert.ok(Math.abs((pushed[1].x - pushed[0].x) - 0.4) < 1e-9, 'spacing is preserved')
})

test('each handle resizes the edge it names', () => {
  const start = rect(0.2, 0.2, 0.4, 0.4)
  const east = resizeByHandle(start, 'e', 0.1, 0)
  assert.deepEqual({ x: east.x, width: east.width }, { x: 0.2, width: 0.5 })
  const west = resizeByHandle(start, 'w', 0.1, 0)
  assert.ok(Math.abs(west.x - 0.3) < 1e-9)
  assert.ok(Math.abs(west.width - 0.3) < 1e-9)
  const north = resizeByHandle(start, 'n', 0, 0.1)
  assert.ok(Math.abs(north.y - 0.3) < 1e-9)
  assert.ok(Math.abs(north.height - 0.3) < 1e-9)
  const south = resizeByHandle(start, 's', 0, -0.1)
  assert.ok(Math.abs(south.height - 0.3) < 1e-9)
})

test('a handle never crosses its opposite edge or leaves the frame', () => {
  const start = rect(0.2, 0.2, 0.4, 0.4)
  const collapsed = resizeByHandle(start, 'e', -0.9, 0)
  assert.ok(collapsed.width >= MIN_SIZE - 1e-9)
  const over = resizeByHandle(start, 'e', 5, 0)
  assert.ok(Math.abs(over.x + over.width - 1) < 1e-9, 'the right edge stops at 1')
  const up = resizeByHandle(start, 'n', 0, -5)
  assert.ok(Math.abs(up.y) < 1e-9)
})

test('corner drags can lock the aspect ratio', () => {
  const start = rect(0.2, 0.2, 0.4, 0.2)
  const free = resizeByHandle(start, 'se', 0.1, 0.1)
  const locked = resizeByHandle(start, 'se', 0.1, 0.1, { lockAspect: true })
  // A free drag moves each side by its own delta, so the 2:1 box becomes 5:3.
  assert.ok(Math.abs(free.width - 0.5) < 1e-9 && Math.abs(free.height - 0.3) < 1e-9)
  assert.ok(Math.abs(locked.width / locked.height - 2) < 1e-9, 'a locked drag keeps 2:1')
})

test('a selection has one bounding box', () => {
  const boxes = [rect(0.1, 0.2, 0.2, 0.2), rect(0.5, 0.4, 0.3, 0.3)]
  const bounds = selectionBounds(boxes, [0, 1])
  assert.ok(Math.abs(bounds.x - 0.1) < 1e-9 && Math.abs(bounds.y - 0.2) < 1e-9)
  assert.ok(Math.abs(bounds.width - 0.7) < 1e-9 && Math.abs(bounds.height - 0.5) < 1e-9)
  assert.equal(selectionBounds(boxes, []), undefined)
})

test('snapping aligns edges and centres and reports the guide', () => {
  const neighbour = rect(0.3, 0.3, 0.4, 0.2)
  // Left edges are 0.004 apart: inside the threshold.
  const near = snapBox(rect(0.304, 0.6, 0.2, 0.2), [neighbour])
  assert.ok(Math.abs(near.box.x - 0.3) < 1e-9)
  assert.deepEqual(near.guides, [{ axis: 'x', at: 0.3 }])

  // Centres line up: 0.4 + 0.1 = 0.5 is the neighbour's centre.
  const centred = snapBox(rect(0.395, 0.8, 0.2, 0.1), [neighbour])
  assert.ok(Math.abs(centred.box.x + centred.box.width / 2 - 0.5) < 1e-9)

  const far = snapBox(rect(0.05, 0.05, 0.1, 0.1), [neighbour])
  assert.deepEqual(far.guides, [], 'nothing within the threshold means no guide')
})

test('the frame edges are snap targets too', () => {
  const snapped = snapBox(rect(0.003, 0.6, 0.2, 0.2), [])
  assert.equal(snapped.box.x, 0, 'the left edge lands on the frame edge')
  assert.deepEqual(snapped.guides.filter((guide) => guide.axis === 'x'), [{ axis: 'x', at: 0 }])
  // The vertical centre line of the frame is a target as well.
  const centred = snapBox(rect(0.4, 0.3, 0.2, 0.1), [])
  assert.ok(Math.abs(centred.box.x + centred.box.width / 2 - 0.5) < 1e-9)
})

test('alignment uses the selection bounds, not the frame', () => {
  const boxes = [rect(0.1, 0.1, 0.2, 0.2), rect(0.5, 0.4, 0.3, 0.1), rect(0.9, 0.9, 0.1, 0.1)]
  const left = alignBoxes(boxes, [0, 1], 'left')
  assert.equal(left[0].x, 0.1)
  assert.equal(left[1].x, 0.1)
  const right = alignBoxes(boxes, [0, 1], 'right')
  assert.ok(Math.abs(right[1].x + right[1].width - 0.8) < 1e-9)
  const middle = alignBoxes(boxes, [0, 1], 'middleY')
  const bounds = selectionBounds(boxes, [0, 1])
  assert.ok(Math.abs(middle[0].y + middle[0].height / 2 - (bounds.y + bounds.height / 2)) < 1e-9)
})

test('distribution evens the gaps and leaves other boxes alone', () => {
  const boxes = [rect(0, 0, 0.1, 0.1), rect(0.2, 0, 0.1, 0.1), rect(0.9, 0, 0.1, 0.1), rect(0.4, 0.5, 0.1, 0.1)]
  const spread = distributeBoxes(boxes, [0, 1, 2], 'x')
  assert.ok(Math.abs(spread[0].x) < 1e-9)
  assert.ok(Math.abs(spread[2].x - 0.9) < 1e-9)
  const gaps = [spread[1].x - (spread[0].x + spread[0].width), spread[2].x - (spread[1].x + spread[1].width)]
  assert.ok(Math.abs(gaps[0] - gaps[1]) < 1e-9, 'the two gaps match')
  assert.equal(spread[3].x, 0.4, 'unselected boxes are untouched')
  assert.deepEqual(distributeBoxes(boxes, [0, 1], 'x'), boxes, 'two boxes have nothing to distribute')
})

test('duplicating offsets the copies so they are visible', () => {
  const boxes = [rect(0.1, 0.1, 0.2, 0.2), rect(0.5, 0.5, 0.2, 0.2)]
  const { boxes: next, added } = duplicateBoxes(boxes, [1])
  assert.equal(next.length, 3)
  assert.deepEqual(added, [2])
  assert.ok(Math.abs(next[2].x - 0.52) < 1e-9)
  assert.equal(next[0], boxes[0], 'originals keep their identity')

  // A copy near the edge is nudged inward rather than off the frame.
  const edge = duplicateBoxes([rect(0.85, 0.85, 0.15, 0.15)], [0])
  assert.ok(edge.boxes[1].x + edge.boxes[1].width <= 1 + 1e-9)
})

test('drawing from two corners works in any direction', () => {
  const forward = boxFromCorners(0.2, 0.2, 0.6, 0.5)
  const backward = boxFromCorners(0.6, 0.5, 0.2, 0.2)
  assert.deepEqual(forward, backward)
  assert.ok(Math.abs(forward.x - 0.2) < 1e-9 && Math.abs(forward.y - 0.2) < 1e-9)
  assert.ok(Math.abs(forward.width - 0.4) < 1e-9 && Math.abs(forward.height - 0.3) < 1e-9)
  const tiny = boxFromCorners(0.5, 0.5, 0.5, 0.5)
  assert.ok(tiny.width >= MIN_SIZE && tiny.height >= MIN_SIZE, 'a click still yields a usable box')
})

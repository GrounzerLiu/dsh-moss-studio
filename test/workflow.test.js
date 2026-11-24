import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { injectWorkflow, normalizeBoxes, remapCharacters } from '../lib/workflow.js'

const template = JSON.parse(readFileSync('workflow/moss_bbox_api.json', 'utf8'))

const box = (x, y, extra = {}) => ({ x, y, width: 0.2, height: 0.2, type: 'obj', desc: 'a thing', palette: [], ...extra })

function bboxCount(graph) {
  const raw = graph['25'].inputs.bboxes
  return raw === undefined ? 0 : JSON.parse(raw).length
}

test('a hidden box never reaches the graph', () => {
  const boxes = [box(0.1, 0.1), box(0.4, 0.4, { hidden: true }), box(0.7, 0.7)]
  const { graph } = injectWorkflow(template, {
    prompt: 'a poster',
    size: '512x512',
    boxes,
    seed: 1,
    steps: 4,
    cfg: 2,
  })
  assert.equal(bboxCount(graph), 2, 'only the visible boxes are sent')
})

test('hiding every box leaves the bboxes input out entirely', () => {
  const boxes = [box(0.1, 0.1, { hidden: true })]
  const { graph } = injectWorkflow(template, {
    prompt: 'a poster',
    size: '512x512',
    boxes,
    seed: 1,
    steps: 4,
    cfg: 2,
  })
  assert.equal(graph['25'].inputs.bboxes, undefined)
})

test('character marks follow the visible numbering', () => {
  const boxes = [box(0.1, 0.1, { hidden: true }), box(0.4, 0.4), box(0.7, 0.7)]
  const { graph } = injectWorkflow(template, {
    prompt: 'a poster',
    size: '512x512',
    boxes,
    characterBoxes: '2, 3',
    seed: 1,
    steps: 4,
    cfg: 2,
  })
  // Draft box 2 is now the first box in the request, and box 3 the second.
  assert.equal(graph['27'].inputs.character_boxes, '1,2')
})

test('a mark on a hidden box is dropped instead of pointing at another box', () => {
  const boxes = [box(0.1, 0.1), box(0.4, 0.4, { hidden: true }), box(0.7, 0.7)]
  assert.equal(remapCharacters('2', boxes), '')
  assert.equal(remapCharacters('1, 2', boxes), '1')
})

test('remapping without hidden boxes is the identity', () => {
  const boxes = [box(0.1, 0.1), box(0.4, 0.4)]
  assert.equal(remapCharacters('1, 2', boxes), '1,2')
  assert.equal(remapCharacters('', boxes), '')
})

test('a locked box is still sent: locking only guards the editor', () => {
  const boxes = [box(0.1, 0.1, { locked: true }), box(0.6, 0.6)]
  const { graph } = injectWorkflow(template, {
    prompt: 'a poster',
    size: '512x512',
    boxes,
    seed: 1,
    steps: 4,
    cfg: 2,
  })
  assert.equal(bboxCount(graph), 2)
})

test('normalizeBoxes keeps ignoring the editing flags', () => {
  const pixels = normalizeBoxes([box(0.1, 0.1, { locked: true, hidden: false })], { width: 100, height: 100 })
  assert.equal(pixels.length, 1)
  assert.equal(pixels[0].width, 20)
})
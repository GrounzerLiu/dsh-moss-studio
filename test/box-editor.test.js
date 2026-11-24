import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

import React from 'react'
import { JSDOM } from 'jsdom'

const require = createRequire(import.meta.url)
const bundlePath = fileURLToPath(new URL('../client.js', import.meta.url))

function loadPlugin(windowLike) {
  const source = readFileSync(bundlePath, 'utf8')
  let captured
  windowLike.__ModuleLoader__ = { load(entry) { captured = entry } }
  new Function('window', 'require', source)(windowLike, require)
  return captured.factory(require)
}

/** jsdom has no layout, so the canvas frame is faked at 400x400. */
const RECT = { left: 0, top: 0, right: 400, bottom: 400, width: 400, height: 400, x: 0, y: 0 }

function setup(t) {
  const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: 'http://127.0.0.1:57529/' })
  for (const key of ['window', 'document', 'HTMLElement', 'Node', 'MouseEvent', 'KeyboardEvent', 'getComputedStyle']) {
    Object.defineProperty(globalThis, key, { value: key === 'window' ? dom.window : dom.window[key], configurable: true, writable: true })
  }
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  const { createRoot } = require('react-dom/client')
  const { act } = require('react-dom/test-utils')
  const plugin = loadPlugin(dom.window)
  const root = createRoot(dom.window.document.getElementById('root'))
  t.after(async () => {
    await act(async () => { root.unmount() })
    dom.window.close()
  })
  return { dom, act, root, plugin, Editor: plugin.components.BoxEditor }
}

const baseParams = (boxes) => ({
  prompt: 'p',
  negative: 'x',
  size: '1024x1024',
  steps: 25,
  cfg: 2.5,
  seed: -1,
  characterBoxes: '',
  enhance: false,
  boxes,
})

const twoBoxes = () => [
  { type: 'obj', x: 0.1, y: 0.1, width: 0.3, height: 0.3, desc: 'a', palette: [] },
  { type: 'obj', x: 0.6, y: 0.6, width: 0.2, height: 0.2, desc: 'b', palette: [] },
]

/** Dispatch a pointer gesture at page coordinates. */
function gesture(dom, target, from, to = from) {
  const make = (type, point) => new dom.window.MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    clientX: point[0],
    clientY: point[1],
    button: 0,
  })
  target.dispatchEvent(make('pointerdown', from))
  dom.window.dispatchEvent(make('pointermove', to))
  dom.window.dispatchEvent(make('pointerup', to))
}

function canvasArea(dom) {
  const container = dom.window.document.getElementById('root')
  const area = [...container.querySelectorAll('div')].find((node) => node.style.cursor === 'crosshair')
  assert.ok(area !== undefined, 'the canvas frame renders')
  area.getBoundingClientRect = () => RECT
  return area
}

test('dragging on empty canvas draws a box and selects it', async (t) => {
  const { dom, act, root, Editor } = setup(t)
  const applied = []
  const added = []
  await act(async () => {
    root.render(React.createElement(Editor, {
      params: baseParams([]),
      onApply: (boxes) => applied.push(boxes),
      onAdd: (geometry) => { added.push(geometry); return 0 },
      onClose: () => {},
      onCancel: () => {},
    }))
  })

  const area = canvasArea(dom)
  await act(async () => { gesture(dom, area, [100, 100], [200, 250]) })

  assert.equal(added.length, 1, 'the host is asked to add one box')
  const geometry = added[0]
  assert.ok(Math.abs(geometry.x - 0.25) < 1e-9, `x came from the drag, got ${geometry.x}`)
  assert.ok(Math.abs(geometry.y - 0.25) < 1e-9)
  assert.ok(Math.abs(geometry.width - 0.25) < 1e-9)
  assert.ok(Math.abs(geometry.height - 0.375) < 1e-9)
})

test('a selected box shows eight resize handles', async (t) => {
  const { dom, act, root, Editor } = setup(t)
  await act(async () => {
    root.render(React.createElement(Editor, {
      params: baseParams(twoBoxes()),
      onApply: () => {},
      onAdd: () => 0,
      onClose: () => {},
      onCancel: () => {},
    }))
  })

  canvasArea(dom)
  const boxFrames = () => [...dom.window.document.querySelectorAll('#root div')]
    .filter((node) => node.style.position === 'absolute' && node.style.left !== '' && node.style.borderRadius === '4px')

  assert.equal(boxFrames().length, 2)
  const handlesBefore = [...dom.window.document.querySelectorAll('#root span')]
    .filter((node) => node.style.cursor.endsWith('-resize'))
  assert.equal(handlesBefore.length, 0, 'nothing is selected yet')

  await act(async () => { gesture(dom, boxFrames()[0], [80, 80]) })

  const handles = [...dom.window.document.querySelectorAll('#root span')]
    .filter((node) => node.style.cursor.endsWith('-resize'))
  assert.equal(handles.length, 8, 'four corners and four edges')
  assert.deepEqual(
    handles.map((node) => node.style.cursor).sort(),
    ['ew-resize', 'ew-resize', 'nesw-resize', 'nesw-resize', 'ns-resize', 'ns-resize', 'nwse-resize', 'nwse-resize'],
  )
})

test('dragging a handle resizes only the selected box', async (t) => {
  const { dom, act, root, Editor } = setup(t)
  const applied = []
  await act(async () => {
    root.render(React.createElement(Editor, {
      params: baseParams(twoBoxes()),
      onApply: (boxes) => applied.push(boxes),
      onAdd: () => 0,
      onClose: () => {},
      onCancel: () => {},
    }))
  })

  canvasArea(dom)
  const boxFrames = () => [...dom.window.document.querySelectorAll('#root div')]
    .filter((node) => node.style.position === 'absolute' && node.style.left !== '' && node.style.borderRadius === '4px')
  await act(async () => { gesture(dom, boxFrames()[0], [80, 80]) })

  const eastHandle = [...dom.window.document.querySelectorAll('#root span')]
    .find((node) => node.style.cursor === 'ew-resize' && node.style.left === '100%')
  assert.ok(eastHandle !== undefined, 'the east handle exists')
  await act(async () => { gesture(dom, eastHandle, [200, 120], [280, 120]) })

  const last = applied.at(-1)
  assert.ok(Math.abs(last[0].width - 0.5) < 1e-9, `width grew to 0.5, got ${last[0].width}`)
  assert.deepEqual(last[1], twoBoxes()[1], 'the other box is untouched')
})

test('delete removes the selection and undo brings it back', async (t) => {
  const { dom, act, root, Editor } = setup(t)
  const applied = []
  await act(async () => {
    root.render(React.createElement(Editor, {
      params: baseParams(twoBoxes()),
      onApply: (boxes) => applied.push(boxes),
      onAdd: () => 0,
      onClose: () => {},
      onCancel: () => {},
    }))
  })

  canvasArea(dom)
  const boxFrames = () => [...dom.window.document.querySelectorAll('#root div')]
    .filter((node) => node.style.position === 'absolute' && node.style.left !== '' && node.style.borderRadius === '4px')
  await act(async () => { gesture(dom, boxFrames()[1], [270, 270]) })

  await act(async () => {
    dom.window.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Delete', bubbles: true }))
  })
  assert.equal(applied.at(-1).length, 1, 'one box was removed')

  await act(async () => {
    dom.window.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'z', ctrlKey: true, bubbles: true }))
  })
  assert.equal(applied.at(-1).length, 2, 'undo restored it')
  assert.deepEqual(applied.at(-1), twoBoxes())
})

test('shift-click builds a multi-selection that can be aligned', async (t) => {
  const { dom, act, root, Editor } = setup(t)
  const applied = []
  await act(async () => {
    root.render(React.createElement(Editor, {
      params: baseParams(twoBoxes()),
      onApply: (boxes) => applied.push(boxes),
      onAdd: () => 0,
      onClose: () => {},
      onCancel: () => {},
    }))
  })

  canvasArea(dom)
  const boxFrames = () => [...dom.window.document.querySelectorAll('#root div')]
    .filter((node) => node.style.position === 'absolute' && node.style.left !== '' && node.style.borderRadius === '4px')

  await act(async () => { gesture(dom, boxFrames()[0], [80, 80]) })
  await act(async () => {
    const event = new dom.window.MouseEvent('pointerdown', { bubbles: true, cancelable: true, clientX: 270, clientY: 270, button: 0, shiftKey: true })
    boxFrames()[1].dispatchEvent(event)
    dom.window.dispatchEvent(new dom.window.MouseEvent('pointerup', { bubbles: true, clientX: 270, clientY: 270 }))
  })

  const alignLeft = dom.window.document.querySelector('[aria-label="左对齐"]')
  assert.ok(alignLeft !== null, 'the align controls appear for a multi-selection')
  await act(async () => {
    alignLeft.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }))
  })

  const last = applied.at(-1)
  assert.ok(Math.abs(last[0].x - last[1].x) < 1e-9, 'both boxes share the same left edge')
})
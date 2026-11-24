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
test('typing into a box description keeps the text, newlines included', async (t) => {
  const { dom, act, root, Editor } = setup(t)
  const applied = []
  const boxes = [{ type: 'obj', x: 0.1, y: 0.1, width: 0.4, height: 0.3, desc: 'old', palette: [] }]
  await act(async () => {
    root.render(React.createElement(Editor, {
      params: { prompt: 'p', negative: 'x', size: '1024x1024', steps: 25, cfg: 2.5, seed: -1, characterBoxes: '', enhance: false, boxes },
      onApply: (next) => applied.push(next),
      onAdd: () => 0,
      onClose: () => {},
      onCancel: () => {},
    }))
  })

  canvasArea(dom)
  const frames = () => [...dom.window.document.querySelectorAll('#root div')]
    .filter((node) => node.style.position === 'absolute' && node.style.left !== '' && node.style.borderRadius === '4px')
  await act(async () => { gesture(dom, frames()[0], [80, 80]) })

  const field = [...dom.window.document.querySelectorAll('#root textarea')]
    .find((node) => (node.getAttribute('aria-label') ?? '').includes('框内是什么'))
  assert.ok(field !== undefined, 'the description field appears once the box is selected')

  // `updateBoxGeometry` used to rebuild the box from its geometry and drop every
  // other field, so each keystroke was discarded on the way back.
  const setValue = Object.getOwnPropertyDescriptor(dom.window.HTMLTextAreaElement.prototype, 'value').set
  await act(async () => {
    setValue.call(field, 'a blue circle\nresting on a white wall')
    field.dispatchEvent(new dom.window.Event('input', { bubbles: true }))
  })

  assert.equal(applied.length > 0, true, 'the edit reached the host')
  assert.equal(applied.at(-1)[0].desc, 'a blue circle\nresting on a white wall')
})

test('the description field opts out of flex sizing so the resize grip works', () => {
  const source = readFileSync(new URL('../src/BoxEditor.jsx', import.meta.url), 'utf8')
  // Inside a column flex container the shared `input` style's flex:1 decides the
  // height, and the browser's own resize handle is ignored.
  const block = source.slice(source.indexOf('<textarea'))
  assert.match(block.slice(0, 1200), /flex: '0 0 auto'/)
  assert.match(block.slice(0, 1200), /resize: 'vertical'/)
})

test('a box can be locked and hidden from the list', async (t) => {
  const { dom, act, root, Editor } = setup(t)
  const applied = []
  const boxes = [
    { type: 'obj', x: 0.1, y: 0.1, width: 0.3, height: 0.3, desc: 'a', palette: [] },
    { type: 'obj', x: 0.6, y: 0.6, width: 0.2, height: 0.2, desc: 'b', palette: [] },
  ]
  await act(async () => {
    root.render(React.createElement(Editor, {
      params: { prompt: 'p', negative: 'x', size: '1024x1024', steps: 25, cfg: 2.5, seed: -1, characterBoxes: '', enhance: false, boxes },
      onApply: (next) => applied.push(next),
      onAdd: () => 0,
      onClose: () => {},
      onCancel: () => {},
    }))
  })

  const lockButtons = () => [...dom.window.document.querySelectorAll('#root button')]
    .filter((node) => (node.getAttribute('aria-label') ?? '').startsWith('锁定') || (node.getAttribute('aria-label') ?? '').startsWith('解锁'))
  const hideButtons = () => [...dom.window.document.querySelectorAll('#root button')]
    .filter((node) => (node.getAttribute('aria-label') ?? '').startsWith('隐藏') || (node.getAttribute('aria-label') ?? '').startsWith('显示'))

  assert.equal(lockButtons().length, 2, 'each row has a lock toggle')
  assert.equal(hideButtons().length, 2, 'each row has a visibility toggle')

  await act(async () => { lockButtons()[0].dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true })) })
  assert.equal(applied.at(-1)[0].locked, true, 'the first box is locked')
  assert.equal(applied.at(-1)[1].locked, false, 'the second is untouched')

  await act(async () => { hideButtons()[1].dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true })) })
  assert.equal(applied.at(-1)[1].hidden, true, 'the second box is hidden')
})

test('a locked box cannot be dragged, a hidden one is drawn dashed', async (t) => {
  const { dom, act, root, Editor } = setup(t)
  const applied = []
  const boxes = [
    { type: 'obj', x: 0.1, y: 0.1, width: 0.3, height: 0.3, desc: 'a', palette: [], locked: true },
    { type: 'obj', x: 0.6, y: 0.6, width: 0.2, height: 0.2, desc: 'b', palette: [], hidden: true },
  ]
  await act(async () => {
    root.render(React.createElement(Editor, {
      params: { prompt: 'p', negative: 'x', size: '1024x1024', steps: 25, cfg: 2.5, seed: -1, characterBoxes: '', enhance: false, boxes },
      onApply: (next) => applied.push(next),
      onAdd: () => 0,
      onClose: () => {},
      onCancel: () => {},
    }))
  })

  canvasArea(dom)
  const frames = () => [...dom.window.document.querySelectorAll('#root div')]
    .filter((node) => node.style.position === 'absolute' && node.style.left !== '' && node.style.borderRadius === '4px')

  // The hidden box is dashed, the visible one is not.
  assert.match(frames()[1].style.border, /dashed/)

  await act(async () => { gesture(dom, frames()[0], [80, 80], [200, 200]) })
  assert.equal(applied.length, 0, 'dragging a locked box changes nothing')
})

// --- undo, lock and keyboard ----------------------------------------------

const editorParams = (boxes, characters = '') => ({
  prompt: 'p',
  negative: 'x',
  size: '1024x1024',
  steps: 25,
  cfg: 2.5,
  seed: -1,
  characterBoxes: characters,
  enhance: false,
  boxes,
})

async function mountEditor(t, params, extra = {}) {
  const { dom, act, root, Editor } = setup(t)
  const calls = []
  await act(async () => {
    root.render(React.createElement(Editor, {
      params,
      onApply: (boxes, characters) => calls.push({ boxes, characters }),
      onAdd: () => undefined,
      onClose: () => {},
      onCancel: () => {},
      ...extra,
    }))
  })
  return { dom, act, root, calls, Editor }
}

test('undo after deleting a box restores the character marks too', async (t) => {
  const boxes = [
    { type: 'obj', x: 0.1, y: 0.1, width: 0.3, height: 0.3, desc: 'a', palette: [] },
    { type: 'obj', x: 0.6, y: 0.6, width: 0.2, height: 0.2, desc: 'b', palette: [] },
  ]
  const { dom, act, calls } = await mountEditor(t, editorParams(boxes, '2'))

  canvasArea(dom)
  const frames = () => [...dom.window.document.querySelectorAll('#root div')]
    .filter((node) => node.style.position === 'absolute' && node.style.left !== '' && node.style.borderRadius === '4px')

  await act(async () => { gesture(dom, frames()[0], [100, 100]) })
  await act(async () => {
    dom.window.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Delete', bubbles: true }))
  })
  const afterDelete = calls.at(-1)
  assert.equal(afterDelete.boxes.length, 1)
  assert.equal(afterDelete.characters, '1', 'the surviving mark is renumbered')

  await act(async () => {
    dom.window.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'z', ctrlKey: true, bubbles: true }))
  })
  const afterUndo = calls.at(-1)
  assert.equal(afterUndo.boxes.length, 2, 'the box comes back')
  assert.equal(afterUndo.characters, '2', 'and so does the mark that pointed at it')
})

test('a locked box has no grips and cannot be dragged', async (t) => {
  const boxes = [
    { type: 'obj', x: 0.2, y: 0.2, width: 0.3, height: 0.3, desc: 'a', palette: [], locked: true },
  ]
  const { dom, act, calls } = await mountEditor(t, editorParams(boxes))
  canvasArea(dom)

  const frames = () => [...dom.window.document.querySelectorAll('#root div')]
    .filter((node) => node.style.position === 'absolute' && node.style.left !== '' && node.style.borderRadius === '4px')
  await act(async () => { gesture(dom, frames()[0], [220, 220]) })

  const grips = [...dom.window.document.querySelectorAll('#root span')].filter((node) => node.style.cursor.endsWith('-resize'))
  assert.equal(grips.length, 0, 'no resize handles on a locked box')

  await act(async () => { gesture(dom, frames()[0], [220, 220], [320, 320]) })
  assert.equal(calls.length, 0, 'dragging a locked box changes nothing')
})

test('Ctrl+Z inside a description field does not undo the layout', async (t) => {
  const boxes = [{ type: 'obj', x: 0.1, y: 0.1, width: 0.4, height: 0.3, desc: 'old', palette: [] }]
  const { dom, act, calls } = await mountEditor(t, editorParams(boxes))
  canvasArea(dom)

  const frames = () => [...dom.window.document.querySelectorAll('#root div')]
    .filter((node) => node.style.position === 'absolute' && node.style.left !== '' && node.style.borderRadius === '4px')
  await act(async () => { gesture(dom, frames()[0], [100, 100]) })

  const field = [...dom.window.document.querySelectorAll('#root textarea')]
    .find((node) => (node.getAttribute('aria-label') ?? '').includes('框内是什么'))
  assert.ok(field !== undefined)
  const before = calls.length
  const event = new dom.window.KeyboardEvent('keydown', { key: 'z', ctrlKey: true, bubbles: true, cancelable: true })
  field.dispatchEvent(event)
  await act(async () => { await new Promise((resolve) => setTimeout(resolve, 10)) })

  assert.equal(calls.length, before, 'the editor left the keystroke to the field')
  assert.equal(event.defaultPrevented, false, 'and did not swallow the native text undo')
})

test('adding a box becomes one undo step', async (t) => {
  const boxes = [{ type: 'obj', x: 0.1, y: 0.1, width: 0.3, height: 0.3, desc: 'a', palette: [] }]
  const added = { type: 'obj', x: 0.5, y: 0.5, width: 0.2, height: 0.2, desc: '', palette: [] }
  const { dom, act, calls } = await mountEditor(t, editorParams(boxes), {
    onAdd: () => ({ index: 1, boxes: [...boxes, added], characters: '' }),
  })

  const add = [...dom.window.document.querySelectorAll('#root button')]
    .find((node) => node.getAttribute('aria-label') === '加框')
  assert.ok(add !== undefined)
  await act(async () => { add.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true })) })

  await act(async () => {
    dom.window.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'z', ctrlKey: true, bubbles: true }))
  })
  assert.equal(calls.length, 1, 'the undo reached the host')
  assert.equal(calls.at(-1).boxes.length, 1, 'and it went back to the list before the addition')
})

test('the twenty-fifth box is refused with a message', async (t) => {
  const boxes = Array.from({ length: 24 }, (_, index) => ({
    type: 'obj', x: 0.05 + (index % 6) * 0.15, y: 0.05 + Math.floor(index / 6) * 0.2,
    width: 0.1, height: 0.1, desc: `box ${index}`, palette: [],
  }))
  let adds = 0
  const { dom, act } = await mountEditor(t, editorParams(boxes), {
    onAdd: () => { adds += 1; return undefined },
  })

  const add = [...dom.window.document.querySelectorAll('#root button')]
    .find((node) => node.getAttribute('aria-label') === '加框')
  await act(async () => { add.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true })) })

  assert.equal(adds, 0, 'nothing is added past the limit')
  assert.match(dom.window.document.body.textContent, /最多 24 个框/)
})

test('the inspector aspect toggle reaches the canvas handles', async (t) => {
  const boxes = [{ type: 'obj', x: 0.2, y: 0.2, width: 0.4, height: 0.2, desc: 'a', palette: [] }]
  const { dom, act, calls } = await mountEditor(t, editorParams(boxes))
  canvasArea(dom)

  const frames = () => [...dom.window.document.querySelectorAll('#root div')]
    .filter((node) => node.style.position === 'absolute' && node.style.left !== '' && node.style.borderRadius === '4px')
  await act(async () => { gesture(dom, frames()[0], [120, 120]) })
  assert.equal(frames()[0].style.height, '20%')

  const toggle = [...dom.window.document.querySelectorAll('#root button')]
    .find((node) => node.getAttribute('aria-label') === '锁定宽高比')
  assert.ok(toggle !== undefined)
  await act(async () => { toggle.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true })) })

  const se = [...dom.window.document.querySelectorAll('#root span')]
    .find((node) => node.style.cursor === 'nwse-resize' && node.style.left === '100%' && node.style.top === '100%')
  assert.ok(se !== undefined)
  await act(async () => { gesture(dom, se, [240, 160], [280, 200]) })

  const box = calls.at(-1).boxes[0]
  assert.ok(Math.abs(box.width / box.height - 2) < 1e-6, `ratio held at 2, got ${(box.width / box.height).toFixed(3)}`)
  assert.ok(Math.abs(box.width - 0.6) < 1e-6, `width followed the longer axis, got ${box.width}`)
})

test('the right button does not drag a box or draw one', async (t) => {
  const boxes = [{ type: 'obj', x: 0.2, y: 0.2, width: 0.3, height: 0.3, desc: 'a', palette: [] }]
  const { dom, act, calls } = await mountEditor(t, editorParams(boxes))
  canvasArea(dom)

  const frames = () => [...dom.window.document.querySelectorAll('#root div')]
    .filter((node) => node.style.position === 'absolute' && node.style.left !== '' && node.style.borderRadius === '4px')
  const right = (type, init) => new dom.window.MouseEvent(type, { bubbles: true, cancelable: true, ...init })

  await act(async () => {
    frames()[0].dispatchEvent(right('pointerdown', { clientX: 220, clientY: 220, button: 2 }))
    dom.window.dispatchEvent(right('pointermove', { clientX: 320, clientY: 320 }))
    dom.window.dispatchEvent(right('pointerup', { clientX: 320, clientY: 320, button: 2 }))
  })
  assert.equal(calls.length, 0, 'a right drag moves nothing')

  const area = [...dom.window.document.querySelectorAll('#root div')].find((node) => node.style.cursor === 'crosshair')
  await act(async () => {
    area.dispatchEvent(right('pointerdown', { clientX: 20, clientY: 20, button: 2 }))
    dom.window.dispatchEvent(right('pointerup', { clientX: 120, clientY: 120, button: 2 }))
  })
  assert.equal(calls.length, 0, 'a right drag draws nothing')
})

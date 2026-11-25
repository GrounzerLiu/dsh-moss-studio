import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

import React from 'react'
import { JSDOM } from 'jsdom'
import { buildSync } from 'esbuild'

const require = createRequire(import.meta.url)
const clientSource = (() => {
  const built = buildSync({
    entryPoints: [fileURLToPath(new URL('../src/client.jsx', import.meta.url))],
    bundle: true,
    write: false,
    format: 'cjs',
    platform: 'browser',
    target: ['es2022'],
    jsx: 'transform',
    external: ['react', 'react-dom'],
    logLevel: 'warning',
  }).outputFiles[0].text
  return `window.__ModuleLoader__.load({ id: 'test', factory(require) { const module = { exports: {} }; const exports = module.exports; (function(module, exports, require) { ${built}\n })(module, exports, require); return module.exports.createPlugin(); } })`
})()

function loadPlugin(windowLike) {
  let captured
  windowLike.__ModuleLoader__ = { load(entry) { captured = entry } }
  new Function('window', 'require', clientSource)(windowLike, require)
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
  assert.deepEqual(Object.keys(geometry).sort(), ['height', 'width', 'x', 'y'], 'the canvas callback carries only geometry')
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

test('a locked box keeps geometry fixed in the inspector but its content stays editable', async (t) => {
  const boxes = [{ type: 'obj', x: 0.2, y: 0.2, width: 0.3, height: 0.3, desc: 'old', palette: [], locked: true }]
  const { dom, act, calls, getParams } = await mountControlledEditor(t, editorParams(boxes))
  canvasArea(dom)
  await act(async () => { selectBox(dom, 0) })

  const numbers = [...dom.window.document.querySelectorAll('input[type="number"]')]
  assert.equal(numbers.length, 4)
  assert.ok(numbers.every((node) => node.disabled), 'locked geometry inputs are disabled')
  await act(async () => { changeNumber(dom, numbers[0], 80) })
  assert.equal(calls.length, 0, 'the guarded patch ignores geometry changes')
  assert.equal(getParams().boxes[0].x, 0.2)

  const field = [...dom.window.document.querySelectorAll('textarea')]
    .find((node) => (node.getAttribute('aria-label') ?? '').includes('框内是什么'))
  const setValue = Object.getOwnPropertyDescriptor(dom.window.HTMLTextAreaElement.prototype, 'value').set
  await act(async () => {
    setValue.call(field, 'new content')
    field.dispatchEvent(new dom.window.Event('input', { bubbles: true }))
  })
  assert.equal(getParams().boxes[0].desc, 'new content')
  assert.equal(getParams().boxes[0].x, 0.2, 'content editing does not move the box')
})

test('a hidden box can be edited alone but stays out of group moves and snapping', async (t) => {
  const boxes = [
    { type: 'obj', x: 0.1, y: 0.1, width: 0.2, height: 0.2, desc: 'visible', palette: [] },
    { type: 'obj', x: 0.45, y: 0.1, width: 0.2, height: 0.2, desc: 'hidden', palette: [], hidden: true },
  ]
  const { dom, act, calls } = await mountEditor(t, editorParams(boxes))
  canvasArea(dom)
  const frames = () => canvasBoxes(dom)

  // Drag the visible box to within snapping distance of the hidden box.
  await act(async () => { gesture(dom, frames()[0], [80, 80], [218, 80]) })
  assert.ok(Math.abs(calls.at(-1).boxes[0].x - 0.445) < 1e-9, 'hidden boxes are not snap references')

  // Shift-select both, then drag the visible one: the hidden companion stays put.
  await act(async () => {
    const event = new dom.window.MouseEvent('pointerdown', { bubbles: true, cancelable: true, clientX: 260, clientY: 80, button: 0, shiftKey: true })
    frames()[1].dispatchEvent(event)
    dom.window.dispatchEvent(new dom.window.MouseEvent('pointerup', { bubbles: true, clientX: 260, clientY: 80 }))
  })
  await act(async () => { gesture(dom, frames()[0], [120, 80], [160, 80]) })
  assert.equal(calls.at(-1).boxes[1].x, 0.45, 'hidden companion does not join a group move')

  // Selected alone, the hidden box remains editable.
  await act(async () => { press(dom, 'Escape') })
  await act(async () => { gesture(dom, frames()[1], [260, 80], [300, 80]) })
  assert.ok(calls.at(-1).boxes[1].x > 0.45, 'explicit hidden-box editing still works')
})

test('canvas boxes and list rows are reachable and operable from the keyboard', async (t) => {
  const boxes = [
    { type: 'obj', x: 0.1, y: 0.1, width: 0.2, height: 0.2, desc: 'one', palette: [] },
    { type: 'obj', x: 0.6, y: 0.6, width: 0.2, height: 0.2, desc: 'two', palette: [] },
  ]
  const { dom, act, calls, getParams } = await mountControlledEditor(t, editorParams(boxes))
  canvasArea(dom)

  const first = canvasBoxes(dom)[0]
  assert.equal(first.getAttribute('role'), 'button')
  assert.equal(first.tabIndex, 0)
  await act(async () => { first.focus() })
  assert.equal(first.getAttribute('aria-pressed'), 'true')
  await act(async () => { press(dom, 'ArrowRight') })
  assert.ok(getParams().boxes[0].x > 0.1, 'arrow key nudges the focused box')
  await act(async () => { press(dom, 'Delete') })
  assert.equal(getParams().boxes.length, 1, 'Delete removes the selected box')

  const controls = [...dom.window.document.querySelectorAll('[role="group"][data-box-index]')]
  assert.equal(controls.length, 1)
  await act(async () => { controls[0].focus() })
  await act(async () => { press(dom, 'Enter') })
  assert.equal(controls[0].getAttribute('aria-current'), 'true')
  assert.ok(calls.length >= 2, 'keyboard selection and deletion reached the host')
})

test('list drag and Alt+Arrow reorder boxes while preserving character marks', async (t) => {
  const boxes = [
    { type: 'obj', x: 0.1, y: 0.1, width: 0.2, height: 0.2, desc: 'a', palette: [] },
    { type: 'obj', x: 0.4, y: 0.1, width: 0.2, height: 0.2, desc: 'b', palette: [] },
    { type: 'obj', x: 0.7, y: 0.1, width: 0.2, height: 0.2, desc: 'c', palette: [] },
  ]
  const { dom, act, calls, getParams } = await mountControlledEditor(t, editorParams(boxes, '1,3'))
  const handles = () => [...dom.window.document.querySelectorAll('span[data-drag-index]')]
  const rows = () => [...dom.window.document.querySelectorAll('[role="listitem"]')]
  const controls = () => [...dom.window.document.querySelectorAll('[role="group"][data-box-index]')]

  const transfer = { effectAllowed: '', dropEffect: '', setData() {} }
  assert.equal(handles()[0].tabIndex, -1, 'the visual drag handle is not a tab stop')
  assert.equal(handles()[0].getAttribute('aria-hidden'), 'true')
  assert.equal(handles()[0].closest('[role="group"]'), null, 'the drag handle is not inside the focusable row control')
  assert.equal(handles()[0].parentElement, controls()[0].parentElement, 'drag handle and focusable row content are siblings')
  assert.equal(controls().some((row) => row.getAttribute('aria-current') === 'true'), false)
  assert.equal(dom.window.document.querySelectorAll('textarea').length, 0)

  const dragStart = new dom.window.Event('dragstart', { bubbles: true, cancelable: true })
  Object.defineProperty(dragStart, 'dataTransfer', { value: transfer })
  await act(async () => { handles()[0].dispatchEvent(dragStart) })
  const drop = new dom.window.MouseEvent('drop', { bubbles: true, cancelable: true, clientY: 100 })
  Object.defineProperty(drop, 'dataTransfer', { value: transfer })
  await act(async () => { rows()[2].dispatchEvent(drop) })
  assert.deepEqual(getParams().boxes.map((entry) => entry.desc), ['b', 'c', 'a'])
  assert.equal(getParams().characterBoxes, '2,3')

  await act(async () => {
    controls()[0].dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'ArrowDown', altKey: true, bubbles: true, cancelable: true }))
  })
  assert.deepEqual(getParams().boxes.map((entry) => entry.desc), ['c', 'b', 'a'])
  assert.equal(getParams().characterBoxes, '1,3')
  assert.ok(calls.length >= 2, 'both reorder paths are undoable host commits')
  await act(async () => { press(dom, 'z', { ctrlKey: true }) })
  assert.deepEqual(getParams().boxes.map((entry) => entry.desc), ['b', 'c', 'a'])
  assert.equal(getParams().characterBoxes, '2,3', 'undo restores the marks with the previous order')
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

async function mountControlledEditor(t, initial) {
  const { dom, act, root, Editor } = setup(t)
  const calls = []
  let current = initial
  function Host() {
    const [value, setValue] = React.useState(initial)
    current = value
    return React.createElement(Editor, {
      params: value,
      onApply: (boxes, characters) => {
        calls.push({ boxes, characters })
        setValue((old) => ({ ...old, boxes, characterBoxes: characters ?? old.characterBoxes }))
      },
      onAdd: (geometry) => {
        const boxes = [...current.boxes, { type: 'obj', x: 0.35, y: 0.35, width: 0.3, height: 0.3, desc: '', palette: [], ...geometry }]
        const characters = current.characterBoxes ?? ''
        setValue((old) => ({ ...old, boxes }))
        return { boxes, index: boxes.length - 1, characters }
      },
      onClose: () => {},
      onCancel: () => {},
    })
  }
  await act(async () => { root.render(React.createElement(Host)) })
  return { dom, act, root, calls, getParams: () => current }
}

function canvasBoxes(dom) {
  return [...dom.window.document.querySelectorAll('#root div')]
    .filter((node) => node.style.position === 'absolute' && node.style.left !== '' && node.style.borderRadius === '4px')
}

function selectBox(dom, index) {
  const frame = canvasBoxes(dom)[index]
  frame.dispatchEvent(new dom.window.MouseEvent('pointerdown', { bubbles: true, cancelable: true, clientX: 100, clientY: 100, button: 0 }))
  dom.window.dispatchEvent(new dom.window.MouseEvent('pointerup', { bubbles: true, clientX: 100, clientY: 100, button: 0 }))
}

function press(dom, key, modifiers = {}) {
  dom.window.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...modifiers }))
}

function changeNumber(dom, input, value) {
  const propsKey = Object.keys(input).find((key) => key.startsWith('__reactProps$'))
  assert.ok(propsKey !== undefined, 'number input has a React change handler')
  input[propsKey].onChange({ target: { value: String(value) } })
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

test('the add button never forwards its click event as geometry', async (t) => {
  const seen = []
  const { dom, act } = await mountEditor(t, editorParams([]), {
    onAdd: (geometry) => {
      seen.push(geometry)
      return { boxes: [{ type: 'obj', x: 0.35, y: 0.35, width: 0.3, height: 0.3, desc: '', palette: [] }], index: 0 }
    },
  })
  const add = [...dom.window.document.querySelectorAll('button')].find((node) => node.getAttribute('aria-label') === '加框')
  await act(async () => { add.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true })) })
  assert.deepEqual(seen, [undefined], 'the host receives no SyntheticEvent')
})

test('duplicate refuses to exceed the box limit and reports the existing notice', async (t) => {
  const boxes = Array.from({ length: 24 }, (_, index) => ({
    type: 'obj', x: 0.05 + (index % 6) * 0.15, y: 0.05 + Math.floor(index / 6) * 0.2,
    width: 0.1, height: 0.1, desc: `box ${index}`, palette: [],
  }))
  const { dom, act, calls } = await mountEditor(t, editorParams(boxes))
  await act(async () => { selectBox(dom, 0) })
  await act(async () => { press(dom, 'd', { ctrlKey: true }) })
  assert.equal(calls.length, 0, 'no twenty-fifth box is committed')
  assert.match(dom.window.document.body.textContent, /最多 24 个框/)
})

test('duplicate still allows the last slot', async (t) => {
  const boxes = Array.from({ length: 23 }, (_, index) => ({
    type: 'obj', x: 0.05 + (index % 6) * 0.15, y: 0.05 + Math.floor(index / 6) * 0.2,
    width: 0.1, height: 0.1, desc: `box ${index}`, palette: [],
  }))
  const { dom, act, calls } = await mountEditor(t, editorParams(boxes))
  await act(async () => { selectBox(dom, 0) })
  await act(async () => { press(dom, 'd', { ctrlKey: true }) })
  assert.equal(calls.at(-1).boxes.length, 24)
})

test('hidden unfinished boxes do not contribute to the incomplete count', async (t) => {
  const boxes = [
    { type: 'obj', x: 0.1, y: 0.1, width: 0.2, height: 0.2, desc: 'ready', palette: [] },
    { type: 'obj', x: 0.5, y: 0.5, width: 0.2, height: 0.2, desc: '', palette: [], hidden: true },
  ]
  const { dom } = await mountEditor(t, editorParams(boxes))
  assert.doesNotMatch(dom.window.document.body.textContent, /个框还没写完/)
})

test('undo coalescing does not cross box targets', async (t) => {
  const { dom, act, getParams } = await mountControlledEditor(t, editorParams(twoBoxes()))
  await act(async () => { selectBox(dom, 0) })
  await act(async () => { press(dom, 'ArrowRight') })
  await act(async () => { selectBox(dom, 1) })
  await act(async () => { press(dom, 'ArrowRight') })
  await act(async () => { press(dom, 'z', { ctrlKey: true }) })
  const boxes = getParams().boxes
  assert.ok(Math.abs(boxes[0].x - 0.11) < 1e-9, 'the first box move remains')
  assert.ok(Math.abs(boxes[1].x - 0.6) < 1e-9, 'only the second box move is undone')
})

test('undo coalescing does not cross nudge axes', async (t) => {
  const { dom, act, getParams } = await mountControlledEditor(t, editorParams(twoBoxes()))
  await act(async () => { selectBox(dom, 0) })
  await act(async () => { press(dom, 'ArrowRight') })
  await act(async () => { press(dom, 'ArrowUp') })
  await act(async () => { press(dom, 'z', { ctrlKey: true }) })
  const box = getParams().boxes[0]
  assert.ok(Math.abs(box.x - 0.11) < 1e-9, 'the horizontal move remains')
  assert.ok(Math.abs(box.y - 0.1) < 1e-9, 'only the vertical move is undone')
})

test('same-target nudges still coalesce', async (t) => {
  const { dom, act, getParams } = await mountControlledEditor(t, editorParams(twoBoxes()))
  await act(async () => { selectBox(dom, 0) })
  await act(async () => { press(dom, 'ArrowRight') })
  await act(async () => { press(dom, 'ArrowRight') })
  await act(async () => { press(dom, 'z', { ctrlKey: true }) })
  assert.ok(Math.abs(getParams().boxes[0].x - 0.1) < 1e-9)
})

test('undo resets the coalescing window', async (t) => {
  const { dom, act, getParams } = await mountControlledEditor(t, editorParams(twoBoxes()))
  await act(async () => { selectBox(dom, 0) })
  await act(async () => { press(dom, 'ArrowRight') })
  await act(async () => { selectBox(dom, 1) })
  await act(async () => { press(dom, 'ArrowRight') })
  await act(async () => { press(dom, 'z', { ctrlKey: true }) })
  await act(async () => { selectBox(dom, 0) })
  await act(async () => { press(dom, 'ArrowRight') })
  await act(async () => { press(dom, 'z', { ctrlKey: true }) })
  const boxes = getParams().boxes
  assert.ok(Math.abs(boxes[0].x - 0.11) < 1e-9, 'undo returns to the previous edit, not the baseline')
  assert.ok(Math.abs(boxes[1].x - 0.6) < 1e-9)
})

test('a drag and a following nudge do not coalesce', async (t) => {
  const { dom, act, getParams } = await mountControlledEditor(t, editorParams(twoBoxes()))
  canvasArea(dom)
  await act(async () => { selectBox(dom, 0) })
  await act(async () => { gesture(dom, canvasBoxes(dom)[0], [80, 80], [120, 80]) })
  await act(async () => { press(dom, 'ArrowRight') })
  await act(async () => { press(dom, 'z', { ctrlKey: true }) })
  assert.ok(Math.abs(getParams().boxes[0].x - 0.2) < 1e-9, 'the drag remains after undoing the nudge')
})

test('an external layout update replaces dirty local history instead of leaving an old undo baseline', async (t) => {
  const boxes = [{ type: 'obj', x: 0.1, y: 0.1, width: 0.3, height: 0.3, desc: 'local', palette: [] }]
  const { dom, act, root, Editor, calls } = await mountEditor(t, editorParams(boxes))
  canvasArea(dom)
  await act(async () => { selectBox(dom, 0) })

  const setValue = Object.getOwnPropertyDescriptor(dom.window.HTMLTextAreaElement.prototype, 'value').set
  await act(async () => {
    setValue.call(dom.window.document.querySelector('#root textarea'), 'unsynced local edit')
    dom.window.document.querySelector('#root textarea').dispatchEvent(new dom.window.Event('input', { bubbles: true }))
  })
  assert.equal(calls.at(-1).boxes[0].desc, 'unsynced local edit')

  const external = [{ type: 'obj', x: 0.7, y: 0.2, width: 0.2, height: 0.2, desc: 'server', palette: [] }]
  await act(async () => {
    root.render(React.createElement(Editor, {
      params: editorParams(external, '1'),
      onApply: (next, characters) => calls.push({ boxes: next, characters }),
      onAdd: () => undefined,
      onClose: () => {},
      onCancel: () => {},
    }))
  })
  assert.match(dom.window.document.body.textContent, /server/)
  assert.match(dom.window.document.body.textContent, /已同步为最新参数/)

  const beforeUndo = calls.length
  await act(async () => { press(dom, 'z', { ctrlKey: true }) })
  assert.equal(calls.length, beforeUndo, 'undo cannot restore the discarded local baseline')

  await act(async () => { selectBox(dom, 0) })
  await act(async () => {
    setValue.call(dom.window.document.querySelector('#root textarea'), 'new local edit')
    dom.window.document.querySelector('#root textarea').dispatchEvent(new dom.window.Event('input', { bubbles: true }))
  })
  await act(async () => { press(dom, 'z', { ctrlKey: true }) })
  assert.equal(calls.at(-1).boxes[0].desc, 'server', 'the next undo returns to the external baseline')
})

test('a controlled echo acknowledges a local edit without resetting undo history', async (t) => {
  const boxes = [{ type: 'obj', x: 0.1, y: 0.1, width: 0.3, height: 0.3, desc: 'before', palette: [] }]
  const { dom, act, getParams } = await mountControlledEditor(t, editorParams(boxes))
  canvasArea(dom)
  await act(async () => { selectBox(dom, 0) })
  const setValue = Object.getOwnPropertyDescriptor(dom.window.HTMLTextAreaElement.prototype, 'value').set
  await act(async () => {
    setValue.call(dom.window.document.querySelector('#root textarea'), 'after')
    dom.window.document.querySelector('#root textarea').dispatchEvent(new dom.window.Event('input', { bubbles: true }))
  })
  assert.equal(getParams().boxes[0].desc, 'after')
  await act(async () => { press(dom, 'z', { ctrlKey: true }) })
  assert.equal(getParams().boxes[0].desc, 'before')
})

test('the aspect-locked inspector respects the ratio-aware minimum', async (t) => {
  const boxes = [{ type: 'obj', x: 0.2, y: 0.2, width: 0.4, height: 0.2, desc: 'a', palette: [] }]
  const { dom, act, getParams } = await mountControlledEditor(t, editorParams(boxes))
  await act(async () => { selectBox(dom, 0) })
  const toggle = [...dom.window.document.querySelectorAll('button')].find((node) => node.getAttribute('aria-label') === '锁定宽高比')
  await act(async () => { toggle.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true })) })
  const width = dom.window.document.querySelector('input[aria-label="宽"]')
  await act(async () => { changeNumber(dom, width, 1) })
  const box = getParams().boxes[0]
  assert.ok(Math.abs(box.width - 0.04) < 1e-9)
  assert.ok(Math.abs(box.height - 0.02) < 1e-9)
  assert.ok(Math.abs(box.width / box.height - 2) < 1e-9)
})

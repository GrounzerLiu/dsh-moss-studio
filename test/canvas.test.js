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
  windowLike.__ModuleLoader__ = {
    load(entry) { captured = entry },
  }
  new Function('window', 'require', source)(windowLike, require)
  return captured.factory(require)
}

const boxes = [
  { type: 'obj', x: 0.1, y: 0.2, width: 0.3, height: 0.4, desc: 'a kite' },
  { type: 'obj', x: 0.5, y: 0.5, width: 0.2, height: 0.2, desc: 'a stone' },
]

test('clicking a box selects it instead of clearing the selection', async (t) => {
  const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: 'http://127.0.0.1:57529/' })
  for (const key of ['window', 'document', 'HTMLElement', 'Node', 'MouseEvent', 'getComputedStyle']) {
    Object.defineProperty(globalThis, key, { value: key === 'window' ? dom.window : dom.window[key], configurable: true, writable: true })
  }
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  const { createRoot } = require('react-dom/client')
  const { act } = require('react-dom/test-utils')

  const plugin = loadPlugin(dom.window)
  const picked = []
  const root = createRoot(dom.window.document.getElementById('root'))
  t.after(async () => {
    await act(async () => { root.unmount() })
    dom.window.close()
  })

  await act(async () => {
    root.render(React.createElement(plugin.components.BoxCanvas, {
      boxes,
      size: '512x512',
      selected: -1,
      onSelect: (index) => picked.push(index),
      onChange: () => {},
    }))
  })

  const container = dom.window.document.getElementById('root')
  const frames = [...container.querySelectorAll('div')].filter((node) => node.style.position === 'absolute' && node.style.left !== '')
  assert.equal(frames.length, 2, 'both boxes render as frames')

  await act(async () => {
    frames[1].dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }))
  })
  assert.deepEqual(picked, [], 'the frame background clears, but a box click does not')

  await act(async () => {
    container.querySelector('div[style*="position: relative"]').dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }))
  })
  assert.deepEqual(picked, [-1], 'clicking the empty frame clears the selection')
})

test('a preview box lets its click reach the wrapper that opens the editor', async (t) => {
  const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: 'http://127.0.0.1:57529/' })
  for (const key of ['window', 'document', 'HTMLElement', 'Node', 'MouseEvent', 'getComputedStyle']) {
    Object.defineProperty(globalThis, key, { value: key === 'window' ? dom.window : dom.window[key], configurable: true, writable: true })
  }
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  const { createRoot } = require('react-dom/client')
  const { act } = require('react-dom/test-utils')
  const plugin = loadPlugin(dom.window)

  let opened = 0
  const root = createRoot(dom.window.document.getElementById('root'))
  t.after(async () => {
    await act(async () => { root.unmount() })
    dom.window.close()
  })

  await act(async () => {
    root.render(React.createElement(
      'div',
      { onClick: () => { opened += 1 } },
      React.createElement(plugin.components.BoxCanvas, {
        boxes,
        size: '512x512',
        selected: -1,
        onSelect: () => {},
        onChange: () => {},
        interactive: false,
      }),
    ))
  })

  const container = dom.window.document.getElementById('root')
  const frame = [...container.querySelectorAll('div')].find((node) => node.style.position === 'absolute' && node.style.left !== '')
  assert.ok(frame !== undefined)

  await act(async () => {
    frame.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }))
  })
  assert.equal(opened, 1, 'clicking a box in the preview opens the editor')
})

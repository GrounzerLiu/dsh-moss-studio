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

test('settings focus moves from a safe control to the URL input once it becomes editable', async (t) => {
  const dom = new JSDOM('<!doctype html><html><body><button id="opener">open</button><div id="root"></div></body></html>', { url: 'http://127.0.0.1:57529/' })
  const saved = {}
  for (const key of ['window', 'document', 'HTMLElement', 'Node', 'MouseEvent', 'KeyboardEvent', 'getComputedStyle', 'fetch']) {
    saved[key] = Object.getOwnPropertyDescriptor(globalThis, key)
    Object.defineProperty(globalThis, key, { value: key === 'window' ? dom.window : key === 'fetch' ? undefined : dom.window[key], configurable: true, writable: true })
  }
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  let resolveSettings
  const pending = new Promise((resolve) => { resolveSettings = resolve })
  globalThis.fetch = async () => pending
  const plugin = loadPlugin(dom.window)
  const { createRoot } = require('react-dom/client')
  const { act } = require('react-dom/test-utils')
  const root = createRoot(dom.window.document.getElementById('root'))
  t.after(async () => {
    await act(async () => { root.unmount() })
    for (const [key, descriptor] of Object.entries(saved)) {
      if (descriptor === undefined) delete globalThis[key]
      else Object.defineProperty(globalThis, key, descriptor)
    }
    dom.window.close()
  })

  const opener = dom.window.document.getElementById('opener')
  opener.focus()
  await act(async () => {
    root.render(React.createElement(plugin.components.SettingsDialog, { onClose: () => {}, onSaved: () => {} }))
  })
  const dialog = dom.window.document.querySelector('[role="dialog"]')
  assert.ok(dialog !== null)
  assert.ok(dialog.contains(dom.window.document.activeElement), 'focus starts inside the dialog, not on the disabled URL field')
  assert.notEqual(dom.window.document.activeElement, opener)

  await act(async () => {
    resolveSettings(new Response(JSON.stringify({
      settings: { comfyUrl: 'http://127.0.0.1:8188', editable: true, retention: 0, defaults: {} },
      wiring: {},
    }), { status: 200, headers: { 'content-type': 'application/json' } }))
    await pending
    await new Promise((resolve) => setTimeout(resolve, 10))
  })
  const url = dom.window.document.querySelector('input[aria-label="ComfyUI 地址"]')
  assert.ok(url !== null)
  assert.equal(url.disabled, false)
  assert.equal(dom.window.document.activeElement, url, 'the now-enabled URL field receives focus')
})

test('the delete confirmation is a labelled dialog that starts on cancel', async (t) => {
  const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: 'http://127.0.0.1:57529/' })
  for (const key of ['window', 'document', 'HTMLElement', 'Node', 'MouseEvent', 'KeyboardEvent', 'getComputedStyle']) {
    Object.defineProperty(globalThis, key, { value: key === 'window' ? dom.window : dom.window[key], configurable: true, writable: true })
  }
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  const { createRoot } = require('react-dom/client')
  const { act } = require('react-dom/test-utils')

  const plugin = loadPlugin(dom.window)
  let closed = false
  const root = createRoot(dom.window.document.getElementById('root'))
  t.after(async () => {
    await act(async () => { root.unmount() })
    dom.window.close()
  })

  await act(async () => {
    root.render(React.createElement(plugin.components.ConfirmDialog, {
      title: '删除这条记录？',
      message: '记录与图片会一起删除，无法恢复。',
      detail: 'a kite · rec-1234',
      onCancel: () => { closed = true },
      onConfirm: () => {},
    }))
  })

  const container = dom.window.document.getElementById('root')
  const dialog = container.querySelector('[role="dialog"]')
  assert.ok(dialog !== null, 'the confirmation renders as a dialog')
  assert.equal(dialog.getAttribute('aria-modal'), 'true')
  const active = dom.window.document.activeElement
  assert.equal(active?.textContent, '取消', 'focus starts on the safe choice')

  await act(async () => {
    dialog.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
  })
  assert.equal(closed, true, 'Escape cancels')
})

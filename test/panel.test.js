import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

import React from 'react'
import { JSDOM } from 'jsdom'

const require = createRequire(import.meta.url)
const bundlePath = fileURLToPath(new URL('../client.js', import.meta.url))

/**
 * Evaluate the built bundle against one window object, the way the Web client
 * does, and return the components it registered.
 */
function loadRegistration(windowLike) {
  const source = readFileSync(bundlePath, 'utf8')
  let captured
  windowLike.__ModuleLoader__ = {
    load(entry) {
      captured = entry
    },
  }
  new Function('window', 'require', source)(windowLike, require)
  const plugin = captured.factory(require)
  const registrations = []
  const ctx = {
    effect(fn) { fn() },
    slots: {
      inject(_owner, register) { return register() },
      register(definition, component) {
        registrations.push({ definition, component })
        return () => {}
      },
    },
    sidebarRightTabs: { register: () => () => {} },
    sidebarRight: { openTab: () => {} },
  }
  plugin.apply(ctx)
  return registrations
}

const now = Date.now()

const state = {
  ok: true,
  sessionId: 'sess-1',
  revision: 3,
  updatedAt: now,
  params: {
    prompt: '一张海报',
    negative: 'bad',
    boxes: [{ x: 0.1, y: 0.1, width: 0.3, height: 0.2, type: 'obj', text: '', desc: '红圈', palette: [] }],
    size: '1024x1024',
    steps: 25,
    cfg: 2.5,
    seed: 42,
    characterBoxes: '',
    enhance: false,
  },
  records: [{
    id: 'rec-1',
    createdAt: now,
    status: 'done',
    size: '1024x1024',
    steps: 25,
    seed: 42,
    boxCount: 1,
    prompt: '一张海报',
    width: 1024,
    height: 1024,
    seconds: 12.5,
    hasImage: true,
    error: null,
  }],
}

test('the panel renders history, parameters and the result image once state arrives', async (t) => {
  const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: 'http://127.0.0.1:57529/' })
  const saved = {}
  for (const key of ['window', 'document', 'HTMLElement', 'Node', 'getComputedStyle']) {
    saved[key] = Object.getOwnPropertyDescriptor(globalThis, key)
    Object.defineProperty(globalThis, key, {
      value: key === 'window' ? dom.window : dom.window[key],
      configurable: true,
      writable: true,
    })
  }
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  // jsdom has no ResizeObserver; the zoom viewer and the canvas both tolerate a no-op one.
  dom.window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  globalThis.ResizeObserver = dom.window.ResizeObserver
  const savedFetch = globalThis.fetch
  globalThis.fetch = async (url) => {
    const target = String(url)
    if (target.includes('/state')) {
      return new Response(JSON.stringify(state), { status: 200, headers: { 'content-type': 'application/json' } })
    }
    if (target.includes('/records/')) {
      return new Response(JSON.stringify({
        ok: true,
        record: {
          ...state.records[0],
          params: { ...state.params, prompt: '记录里的提示词', size: '768x1024', steps: 30 },
          result: { width: 1024, height: 1024, seconds: 12.5 },
        },
      }), { status: 200, headers: { 'content-type': 'application/json' } })
    }
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } })
  }

  let root
  t.after(async () => {
    try {
      const { act } = require('react-dom/test-utils')
      if (root !== undefined) await act(async () => { root.unmount() })
    } catch { /* already unmounted */ }
    globalThis.fetch = savedFetch
    for (const [key, descriptor] of Object.entries(saved)) {
      if (descriptor === undefined) delete globalThis[key]
      else Object.defineProperty(globalThis, key, descriptor)
    }
    dom.window.close()
  })

  const registrations = loadRegistration(dom.window)
  const Panel = registrations.find((entry) => entry.definition.name === 'sidebar.right.pane.tab').component
  const { createRoot } = require('react-dom/client')
  const { act } = require('react-dom/test-utils')

  const container = dom.window.document.getElementById('root')
  root = createRoot(container)
  await act(async () => {
    root.render(React.createElement(Panel, { sessionId: 'sess-1' }))
    await new Promise((resolve) => setTimeout(resolve, 50))
  })

  // Narrow panels start with the history column collapsed so the parameters get
  // the full width; the header toggle opens it.
  const openHistory = container.querySelector('[aria-label^="显示历史"]')
  assert.ok(openHistory !== null, 'the header offers a history toggle')
  await act(async () => {
    openHistory.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }))
  })

  const text = container.textContent
  assert.match(text, /历史 1/)
  assert.match(text, /布局框 1/)
  assert.match(text, /revision 3/)

  const images = [...container.querySelectorAll('img')]
  assert.ok(images.length >= 1, 'the result image should render')
  assert.match(images[0].getAttribute('src'), /\/plugins\/dsh-moss-studio\/image\/rec-1/)

  const buttons = [...container.querySelectorAll('button')].map((button) => button.textContent)
  const labels = [...container.querySelectorAll('button')].map((button) => button.getAttribute('aria-label') ?? button.textContent)
  assert.ok(buttons.some((label) => /生成/.test(label)), `expected a generate button, saw ${buttons.join('|')}`)
  assert.ok(labels.includes('新建草稿'), `the toolbar offers a new draft, saw ${labels.join('|')}`)
  assert.ok(!labels.includes('刷新'), 'data refresh is live now, so no manual refresh button')
  assert.ok(labels.includes('重新检测 ComfyUI'), 'the status pill probes on click')
  assert.ok(labels.includes('设置'), 'the toolbar offers settings')
  assert.ok(labels.includes('折叠预览'), 'the canvas preview can be collapsed')
  assert.ok(labels.includes('编辑布局'), 'the panel offers the layout editor')
  assert.ok(labels.includes('收起结果'), 'the result panel can be collapsed')
  assert.ok(container.querySelectorAll('svg').length > 0, 'buttons draw icons')
  assert.ok(container.querySelectorAll('input[type=checkbox]').length >= 1, 'checkboxes stay in the tree for accessibility')
  assert.ok(labels.includes('本会话'), 'the history header offers a scope chip')
  assert.ok(labels.includes('归档'), 'the history header offers an archive chip')
  // The history toggle is also a pressed button; the two chips are the rest.
  const chips = [...container.querySelectorAll('button[aria-pressed]')]
    .filter((button) => !(button.getAttribute('aria-label') ?? '').includes('历史'))
    .map((button) => button.getAttribute('aria-pressed'))
  assert.ok(chips.length >= 2 && chips.every((value) => value === 'false'), 'both chips start unselected')
  const rowDelete = [...container.querySelectorAll('button')].filter((button) => button.getAttribute('aria-label') === '删除记录')
  assert.equal(rowDelete[0].parentElement.style.opacity, '0', 'the row actions stay hidden until hover')
  assert.equal(rowDelete.length, 1, 'each history row can be deleted on its own')

  // Deleting asks first: a click opens a confirmation dialog rather than acting.
  await act(async () => {
    rowDelete[0].dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }))
  })
  const dialog = dom.window.document.querySelector('[role="dialog"][aria-label="删除这条记录？"]')
  assert.ok(dialog !== null, 'the delete button opens a confirmation dialog')
  await act(async () => {
    [...dialog.querySelectorAll('button')].find((button) => button.textContent === '取消')
      .dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }))
  })
  assert.ok(container.querySelector('img[alt="生成结果"]') !== null, 'the result frame renders an image element')
  const textareas = [...container.querySelectorAll('textarea')].map((area) => area.value)
  assert.ok(textareas.includes('一张海报'), 'the prompt is a textarea')
  assert.ok(textareas.includes('bad'), 'the negative prompt is a textarea too')

  // A running record has no image yet: while the panel is not pinned to a record it
  // follows the newest one, which must say "generating" instead of rendering a broken <img>.
  const doneRecords = state.records
  await act(async () => {
    state.records = [{ ...doneRecords[0], id: 'rec-running', status: 'running', hasImage: false }]
    await new Promise((resolve) => setTimeout(resolve, 1700))
  })
  assert.match(container.textContent, /正在生成/, 'a running record shows a generating placeholder')
  assert.equal(container.querySelector('img[alt="生成结果"]'), null, 'no broken image element while running')

  await act(async () => {
    state.records = doneRecords
    await new Promise((resolve) => setTimeout(resolve, 1700))
  })

  const resultImage = container.querySelector('img[alt="生成结果"]')
  await act(async () => {
    resultImage.parentElement.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }))
    await new Promise((resolve) => setTimeout(resolve, 30))
  })
  // The viewer is portaled to document.body, outside the panel container.
  const viewer = dom.window.document.body
  const viewerButtons = [...viewer.querySelectorAll('button')].map((button) => button.getAttribute('aria-label') ?? button.textContent)
  assert.ok(viewerButtons.includes('关闭'), `expected the viewer toolbar, saw ${viewerButtons.join('|')}`)
  assert.ok(viewerButtons.includes('放大'), 'the viewer offers zoom in')
  assert.ok(viewerButtons.includes('缩小'), 'the viewer offers zoom out')
  assert.ok(viewerButtons.includes('适应窗口'), 'the viewer offers fit-to-window')
  assert.ok(viewer.textContent.includes('滚轮缩放'), 'the viewer explains pan and zoom')
  await act(async () => {
    viewer.querySelectorAll('button').forEach((button) => {
      if (button.getAttribute('aria-label') === '关闭') button.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }))
    })
    await new Promise((resolve) => setTimeout(resolve, 10))
  })

  await act(async () => {
    const row = container.querySelector('[role="group"][aria-label]')
    row.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }))
    await new Promise((resolve) => setTimeout(resolve, 40))
  })
  const afterClick = [...container.querySelectorAll('textarea')].map((area) => area.value)
  assert.ok(afterClick.includes('一张海报'), 'clicking a record must not overwrite the draft prompt')

  await act(async () => {
    const load = [...container.querySelectorAll('button')].find((button) => button.getAttribute('aria-label') === '载入参数')
    load.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }))
    // Wait past the debounce so the loaded parameters are saved while the DOM still exists.
    await new Promise((resolve) => setTimeout(resolve, 700))
  })
  const afterLoad = [...container.querySelectorAll('textarea')].map((area) => area.value)
  assert.ok(afterLoad.includes('记录里的提示词'), 'the load button restores the record prompt')
  assert.equal(container.querySelector('select').value, '768x1024', 'the load button restores the record size')

  const search = container.querySelector('input[placeholder="搜索提示词或记录号"]')
  const more = [...container.querySelectorAll('button')].map((button) => button.textContent).filter((label) => /加载更多/.test(label))
  assert.ok(more.length <= 1, 'the history offers at most one load-more control')
  assert.ok(search !== null, 'the history has a search box')

  const download = container.querySelector('a[download]')
  assert.ok(download !== null, 'the result exposes a download link')
  assert.match(download.getAttribute('href'), /\/image\/rec-1/)
})

async function mountPanel(t, fetchImpl, globals = {}) {
  const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: 'http://127.0.0.1:57529/' })
  const saved = {}
  const keys = ['window', 'document', 'HTMLElement', 'Node', 'MouseEvent', 'KeyboardEvent', 'getComputedStyle', 'fetch', ...Object.keys(globals)]
  for (const key of new Set(keys)) {
    saved[key] = Object.getOwnPropertyDescriptor(globalThis, key)
    const value = Object.hasOwn(globals, key) ? globals[key] : key === 'window' ? dom.window : dom.window[key]
    Object.defineProperty(globalThis, key, { value, configurable: true, writable: true })
  }
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  dom.window.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} }
  globalThis.ResizeObserver = dom.window.ResizeObserver
  globalThis.fetch = fetchImpl

  let root
  t.after(async () => {
    try {
      const { act } = require('react-dom/test-utils')
      if (root !== undefined) await act(async () => { root.unmount() })
    } catch { /* already unmounted */ }
    for (const [key, descriptor] of Object.entries(saved)) {
      if (descriptor === undefined) delete globalThis[key]
      else Object.defineProperty(globalThis, key, descriptor)
    }
    dom.window.close()
  })

  const registrations = loadRegistration(dom.window)
  const Panel = registrations.find((entry) => entry.definition.name === 'sidebar.right.pane.tab').component
  const { createRoot } = require('react-dom/client')
  const { act } = require('react-dom/test-utils')
  const container = dom.window.document.getElementById('root')
  root = createRoot(container)
  await act(async () => {
    root.render(React.createElement(Panel, { sessionId: 'sess-1' }))
    await new Promise((resolve) => setTimeout(resolve, 80))
  })
  return { dom, container, act }
}

function panelState(params, revision = 1) {
  return { ok: true, sessionId: 'sess-1', revision, updatedAt: Date.now(), params, records: [], pinned: [], nextBefore: null }
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })
}

async function inputValue(dom, act, element, value) {
  const setter = element.tagName === 'TEXTAREA'
    ? Object.getOwnPropertyDescriptor(dom.window.HTMLTextAreaElement.prototype, 'value').set
    : Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype, 'value').set
  await act(async () => {
    setter.call(element, value)
    element.dispatchEvent(new dom.window.Event('input', { bubbles: true }))
  })
}

test('debounced saves accumulate edits to different fields', async (t) => {
  const server = { prompt: 'old', negative: 'bad', boxes: [], size: '1024x1024', steps: 25, cfg: 2.5, seed: 42, characterBoxes: '', enhance: false }
  let revision = 1
  const puts = []
  const { dom, container, act } = await mountPanel(t, async (url, init = {}) => {
    const target = String(url)
    if (target.includes('/state')) return jsonResponse(panelState(server, revision))
    if (target.includes('/health')) return jsonResponse({ ok: true, comfy: { ok: true, version: 'x', gpu: {}, ramTotal: 1, ramFree: 1 }, busy: false })
    if (target.endsWith('/draft') && init.method === 'PUT') {
      const body = JSON.parse(init.body)
      puts.push(body)
      Object.assign(server, body.patch)
      revision += 1
      return jsonResponse({ ok: true, revision })
    }
    return jsonResponse({ ok: true, records: [], nextBefore: null })
  })

  await inputValue(dom, act, container.querySelector('textarea'), 'new prompt')
  const steps = [...container.querySelectorAll('input[type=number]')].find((node) => node.value === '25')
  await inputValue(dom, act, steps, '30')
  await act(async () => { await new Promise((resolve) => setTimeout(resolve, 650)) })

  assert.equal(puts.length, 1, 'one debounced request carries both edits')
  assert.equal(puts[0].patch.prompt, 'new prompt')
  assert.equal(puts[0].patch.steps, 30)
  assert.equal(server.prompt, 'new prompt')
  assert.equal(server.steps, 30)
})

test('current-seed generation waits for the latest draft save', async (t) => {
  const server = { prompt: 'old', negative: 'bad', boxes: [], size: '1024x1024', steps: 25, cfg: 2.5, seed: 42, characterBoxes: '', enhance: false }
  let revision = 1
  const order = []
  const { dom, container, act } = await mountPanel(t, async (url, init = {}) => {
    const target = String(url)
    if (target.includes('/state')) return jsonResponse(panelState(server, revision))
    if (target.includes('/health')) return jsonResponse({ ok: true, comfy: { ok: true, version: 'x', gpu: {}, ramTotal: 1, ramFree: 1 }, busy: false })
    if (target.endsWith('/draft') && init.method === 'PUT') {
      order.push('save')
      Object.assign(server, JSON.parse(init.body).patch)
      revision += 1
      return jsonResponse({ ok: true, revision })
    }
    if (target.endsWith('/generate') && init.method === 'POST') {
      order.push({ generate: JSON.parse(init.body) })
      return jsonResponse({ ok: false, message: 'stop after capture' }, 400)
    }
    return jsonResponse({ ok: true, records: [], nextBefore: null })
  })

  await inputValue(dom, act, container.querySelector('textarea'), 'latest prompt')
  const button = [...container.querySelectorAll('button')].find((node) => node.textContent.includes('用当前 seed 生成'))
  await act(async () => {
    button.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }))
    await new Promise((resolve) => setTimeout(resolve, 100))
  })

  assert.equal(order[0], 'save', 'the draft is persisted before generation')
  assert.equal(order[1].generate.revision, 2, 'generation uses the acknowledged revision')
  assert.equal(server.prompt, 'latest prompt')
})

test('a server refresh while dirty cannot advance the revision used by autosave', async (t) => {
  const server = { prompt: 'old', negative: 'bad', boxes: [], size: '1024x1024', steps: 25, cfg: 2.5, seed: 42, characterBoxes: '', enhance: false }
  let revision = 1
  let source
  let conflicts = 1
  class FakeEventSource {
    constructor() { source = this }
    close() {}
  }
  const puts = []
  const { dom, container, act } = await mountPanel(t, async (url, init = {}) => {
    const target = String(url)
    if (target.includes('/state')) return jsonResponse(panelState(server, revision))
    if (target.includes('/health')) return jsonResponse({ ok: true, comfy: { ok: true, version: 'x', gpu: {}, ramTotal: 1, ramFree: 1 }, busy: false })
    if (target.endsWith('/draft') && init.method === 'PUT') {
      const body = JSON.parse(init.body)
      puts.push(body)
      if (conflicts > 0) {
        conflicts -= 1
        return jsonResponse({ ok: false, revision, params: server, message: 'conflict' }, 409)
      }
      Object.assign(server, body.patch)
      revision = body.revision + 1
      return jsonResponse({ ok: true, revision })
    }
    return jsonResponse({ ok: true, records: [], nextBefore: null })
  }, { EventSource: FakeEventSource })

  await inputValue(dom, act, container.querySelector('textarea'), 'local prompt')
  server.prompt = 'AI prompt'
  revision = 2
  await act(async () => {
    source.onmessage({ data: JSON.stringify({ kind: 'draft', sessionId: 'sess-1' }) })
    await new Promise((resolve) => setTimeout(resolve, 650))
  })

  assert.equal(puts.length, 1)
  assert.equal(puts[0].revision, 1, 'autosave still conflicts with the AI revision instead of overwriting it')
  assert.equal(puts[0].patch.prompt, 'local prompt')
  assert.equal(container.querySelector('textarea').value, 'local prompt', 'the local edit stays visible after the conflict')
  assert.equal(server.prompt, 'AI prompt')

  await inputValue(dom, act, container.querySelector('textarea'), 'local prompt resolved')
  await act(async () => { await new Promise((resolve) => setTimeout(resolve, 650)) })
  assert.equal(puts.length, 1, 'autosave stays stopped while the conflict is unresolved')

  const overwrite = [...container.querySelectorAll('button')].find((node) => node.textContent === '确认覆盖')
  assert.ok(overwrite !== undefined, 'the conflict banner offers an explicit overwrite action')
  await act(async () => {
    overwrite.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }))
    await new Promise((resolve) => setTimeout(resolve, 100))
  })
  assert.equal(puts.length, 2, 'overwrite saves the accumulated local patch')
  assert.equal(puts[1].revision, 2, 'overwrite uses the latest server revision')
  assert.equal(puts[1].patch.prompt, 'local prompt resolved')
  assert.equal(server.prompt, 'local prompt resolved')
  assert.equal([...container.querySelectorAll('[role="alert"]')].length, 0, 'the resolved banner disappears')
})

test('adopting the server draft discards local conflict edits without another save', async (t) => {
  const server = { prompt: 'AI prompt', negative: 'bad', boxes: [], size: '1024x1024', steps: 25, cfg: 2.5, seed: 42, characterBoxes: '', enhance: false }
  let revision = 1
  const puts = []
  const { dom, container, act } = await mountPanel(t, async (url, init = {}) => {
    const target = String(url)
    if (target.includes('/state')) return jsonResponse(panelState(server, revision))
    if (target.includes('/health')) return jsonResponse({ ok: true, comfy: { ok: true, version: 'x', gpu: {}, ramTotal: 1, ramFree: 1 }, busy: false })
    if (target.endsWith('/draft') && init.method === 'PUT') {
      puts.push(JSON.parse(init.body))
      return jsonResponse({ conflict: true, revision: 2, params: server }, 409)
    }
    return jsonResponse({ ok: true, records: [], nextBefore: null })
  })

  await inputValue(dom, act, container.querySelector('textarea'), 'local prompt')
  await act(async () => { await new Promise((resolve) => setTimeout(resolve, 650)) })
  assert.equal(puts.length, 1)

  const adopt = [...container.querySelectorAll('button')].find((node) => node.textContent === '采用服务器版本')
  assert.ok(adopt !== undefined)
  await act(async () => { adopt.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true })) })
  assert.equal(container.querySelector('textarea').value, 'AI prompt')
  assert.equal(puts.length, 1, 'adopting never writes over the server')
  assert.equal([...container.querySelectorAll('[role="alert"]')].length, 0)
  assert.match(container.textContent, /已采用服务器版本/)
})

test('cancelling the editor queues its snapshot after an in-flight save', async (t) => {
  const server = {
    prompt: 'p', negative: 'bad', size: '1024x1024', steps: 25, cfg: 2.5, seed: 42, characterBoxes: '', enhance: false,
    boxes: [{ x: 0.1, y: 0.1, width: 0.3, height: 0.3, type: 'obj', desc: 'a', palette: [], locked: false, hidden: false }],
  }
  let revision = 1
  let resolveFirst
  const firstResponse = new Promise((resolve) => { resolveFirst = resolve })
  const puts = []
  const { dom, container, act } = await mountPanel(t, async (url, init = {}) => {
    const target = String(url)
    if (target.includes('/state')) return jsonResponse(panelState(server, revision))
    if (target.includes('/health')) return jsonResponse({ ok: true, comfy: { ok: true, version: 'x', gpu: {}, ramTotal: 1, ramFree: 1 }, busy: false })
    if (target.endsWith('/draft') && init.method === 'PUT') {
      const body = JSON.parse(init.body)
      puts.push(body)
      if (puts.length === 1) return firstResponse
      Object.assign(server, body.patch)
      revision = body.revision + 1
      return jsonResponse({ ok: true, revision })
    }
    return jsonResponse({ ok: true, records: [], nextBefore: null })
  })

  const open = [...container.querySelectorAll('button')].find((node) => node.getAttribute('aria-label') === '编辑布局')
  await act(async () => { open.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true })) })
  const lock = [...dom.window.document.querySelectorAll('button')].find((node) => node.getAttribute('aria-label') === '锁定位置与大小（仍可编辑内容）')
  await act(async () => {
    lock.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }))
    await new Promise((resolve) => setTimeout(resolve, 650))
  })
  assert.equal(puts.length, 1, 'the layout edit has reached the server')

  const cancel = [...dom.window.document.querySelectorAll('button')].find((node) => node.getAttribute('aria-label') === '取消')
  await act(async () => { cancel.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true })) })
  await act(async () => {
    resolveFirst(jsonResponse({ ok: true, revision: 2 }))
    await new Promise((resolve) => setTimeout(resolve, 700))
  })

  assert.equal(puts.length, 2, 'the cancel snapshot is saved after the older request')
  assert.equal(puts[1].revision, 2, 'it uses the revision acknowledged by the first save')
  assert.equal(puts[1].patch.boxes[0].locked, false, 'the cancelled lock change is gone')
  assert.equal(server.boxes[0].locked, false)
})

test('generation waits for its own record even when another session has a newer finished record', async (t) => {
  const server = { prompt: 'p', negative: '', boxes: [], size: '512x512', steps: 1, cfg: 1, seed: 1, characterBoxes: '', enhance: false }
  const mine = { id: 'rec-mine', sessionId: 'sess-1', status: 'done', hasImage: true, prompt: 'p', size: '512x512', width: 512, height: 512, seconds: 2 }
  const other = { id: 'rec-other', sessionId: 'other', status: 'done', hasImage: true, prompt: 'other', size: '1024x1024', width: 1024, height: 1024, seconds: 1 }
  let records = []
  const { dom, container, act } = await mountPanel(t, async (url, init = {}) => {
    const target = String(url)
    if (target.includes('/state')) return jsonResponse({ ...panelState(server, 1), records })
    if (target.includes('/health')) return jsonResponse({ ok: true, comfy: { ok: true, version: 'x', gpu: {}, ramTotal: 1, ramFree: 1 }, busy: false })
    if (target.endsWith('/generate') && init.method === 'POST') {
      records = [other, { ...mine, status: 'running', hasImage: false }]
      return jsonResponse({ ok: true, started: true, recordId: 'rec-mine' }, 202)
    }
    if (target.includes('/records/rec-mine')) return jsonResponse({ ok: true, record: { ...mine, params: server, result: { width: 512, height: 512, seconds: 2 } } })
    return jsonResponse({ ok: true, records: [], nextBefore: null })
  })

  const button = [...container.querySelectorAll('button')].find((node) => node.textContent.includes('用当前 seed 生成'))
  await act(async () => {
    button.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }))
    await new Promise((resolve) => setTimeout(resolve, 1300))
  })
  records = [other, mine]
  await act(async () => { await new Promise((resolve) => setTimeout(resolve, 1300)) })

  assert.match(container.textContent, /已完成：512×512，2 秒/)
  assert.doesNotMatch(container.textContent, /已完成：1024×1024，1 秒/)
  assert.equal(container.querySelector('img[alt="生成结果"]')?.getAttribute('src'), '/plugins/dsh-moss-studio/image/rec-mine')
})

test('the cancel button sends the active record id and reports cancellation', async (t) => {
  const server = { prompt: 'p', negative: '', boxes: [], size: '512x512', steps: 1, cfg: 1, seed: 1, characterBoxes: '', enhance: false }
  let record = { id: 'rec-mine', sessionId: 'sess-1', status: 'running', hasImage: false, prompt: 'p', size: '512x512' }
  const cancellations = []
  const { dom, container, act } = await mountPanel(t, async (url, init = {}) => {
    const target = String(url)
    if (target.includes('/state')) return jsonResponse({ ...panelState(server, 1), records: [record] })
    if (target.includes('/health')) return jsonResponse({ ok: true, comfy: { ok: true, version: 'x', gpu: {}, ramTotal: 1, ramFree: 1 }, busy: false })
    if (target.endsWith('/generate') && init.method === 'POST') return jsonResponse({ ok: true, started: true, recordId: 'rec-mine' }, 202)
    if (target.endsWith('/generate/cancel') && init.method === 'POST') {
      cancellations.push(JSON.parse(init.body))
      record = { ...record, status: 'failed', error: { message: '已取消' } }
      return jsonResponse({ ok: true, cancelled: true })
    }
    return jsonResponse({ ok: true, records: [], nextBefore: null })
  })

  const generateButton = [...container.querySelectorAll('button')].find((node) => node.textContent.includes('用当前 seed 生成'))
  await act(async () => {
    generateButton.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }))
    await new Promise((resolve) => setTimeout(resolve, 80))
  })
  const cancel = [...container.querySelectorAll('button')].find((node) => node.textContent === '取消生成')
  assert.ok(cancel !== undefined, 'the active generation exposes a cancel button')
  await act(async () => {
    cancel.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }))
    await new Promise((resolve) => setTimeout(resolve, 1300))
  })

  assert.deepEqual(cancellations, [{ sessionId: 'sess-1', recordId: 'rec-mine' }])
  assert.match(container.textContent, /已取消生成/)
  assert.equal([...container.querySelectorAll('button')].some((node) => node.textContent === '取消生成'), false)
})

test('archived load-more keeps the archive filter and an exhausted cursor stays exhausted', async (t) => {
  const server = { prompt: 'p', negative: '', boxes: [], size: '512x512', steps: 1, cfg: 1, seed: 1, characterBoxes: '', enhance: false }
  const record = { id: 'rec-1', sessionId: 'sess-1', status: 'done', hasImage: false, prompt: 'p', size: '512x512', archived: true }
  let nextBefore = 'cursor-1'
  const requests = []
  let source
  class FakeEventSource {
    constructor() { source = this }
    close() {}
  }
  const { dom, container, act } = await mountPanel(t, async (url, init = {}) => {
    const target = String(url)
    if (target.includes('/state')) return jsonResponse({ ...panelState(server, 1), records: [record], nextBefore })
    if (target.includes('/health')) return jsonResponse({ ok: true, comfy: { ok: true, version: 'x', gpu: {}, ramTotal: 1, ramFree: 1 }, busy: false })
    if (target.includes('/records?')) {
      requests.push(target)
      return jsonResponse({ ok: true, records: [], nextBefore: null })
    }
    return jsonResponse({ ok: true, records: [], nextBefore: null })
  }, { EventSource: FakeEventSource })

  const openHistory = container.querySelector('[aria-label^="显示历史"]')
  await act(async () => { openHistory.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true })) })
  const archive = [...container.querySelectorAll('button')].find((node) => node.textContent === '归档')
  await act(async () => {
    archive.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }))
    await new Promise((resolve) => setTimeout(resolve, 100))
  })
  const more = [...container.querySelectorAll('button')].find((node) => node.textContent === '加载更多')
  assert.ok(more !== undefined)
  await act(async () => {
    more.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }))
    await new Promise((resolve) => setTimeout(resolve, 50))
  })
  assert.equal(requests.length, 1)
  assert.match(requests[0], /archived=1/)
  assert.match(requests[0], /before=cursor-1/)

  // A later state response may contain a fresh cursor; null is terminal until
  // the user explicitly changes filters.
  nextBefore = 'cursor-2'
  await act(async () => {
    source.onmessage({ data: JSON.stringify({ kind: 'records' }) })
    await new Promise((resolve) => setTimeout(resolve, 200))
  })
  assert.equal([...container.querySelectorAll('button')].some((node) => node.textContent === '加载更多'), false)
})

test('the wide layout puts the result in its own column', async (t) => {
  const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: 'http://127.0.0.1:57529/' })
  const saved = {}
  for (const key of ['window', 'document', 'HTMLElement', 'Node', 'getComputedStyle']) {
    saved[key] = Object.getOwnPropertyDescriptor(globalThis, key)
    Object.defineProperty(globalThis, key, { value: key === 'window' ? dom.window : dom.window[key], configurable: true, writable: true })
  }
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  const savedFetch = globalThis.fetch
  globalThis.fetch = async (url) => {
    const target = String(url)
    const body = target.includes('/state') ? state : target.includes('/records/')
      ? { ok: true, record: { ...state.records[0], params: state.params, result: { width: 1024, height: 1024, seconds: 12.5 } } }
      : { ok: true }
    return new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } })
  }

  let root
  t.after(async () => {
    try { const { act } = require('react-dom/test-utils'); if (root !== undefined) await act(async () => { root.unmount() }) } catch {}
    globalThis.fetch = savedFetch
    for (const [key, descriptor] of Object.entries(saved)) {
      if (descriptor === undefined) delete globalThis[key]
      else Object.defineProperty(globalThis, key, descriptor)
    }
    dom.window.close()
  })

  const registrations = loadRegistration(dom.window)
  const Panel = registrations.find((entry) => entry.definition.name === 'sidebar.right.pane.tab').component
  const { createRoot } = require('react-dom/client')
  const { act } = require('react-dom/test-utils')
  const container = dom.window.document.getElementById('root')
  root = createRoot(container)
  await act(async () => {
    root.render(React.createElement(Panel, { sessionId: 'root', wide: true }))
    await new Promise((resolve) => setTimeout(resolve, 50))
  })
  const text = container.textContent
  assert.match(text, /根草稿/, 'wide mode says which draft it edits')
  const img = container.querySelector('img[alt="生成结果"]')
  assert.ok(img !== null, 'wide mode still renders the result image')
})

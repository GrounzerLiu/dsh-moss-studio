import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

import React from 'react'
import { renderToString } from 'react-dom/server'

const require = createRequire(import.meta.url)
const bundlePath = fileURLToPath(new URL('../client.js', import.meta.url))

/**
 * Evaluate the built client bundle the way the Web client does: capture the
 * ModuleLoader registration, hand it `require`, and return the plugin.
 */
function loadPlugin() {
  const source = readFileSync(bundlePath, 'utf8')
  let captured
  const window = {
    __ModuleLoader__: {
      load(entry) {
        captured = entry
      },
    },
  }
  // eslint-disable-next-line no-new-func
  new Function('window', 'require', source)(window, require)
  assert.ok(captured !== undefined, 'bundle did not call __ModuleLoader__.load')
  assert.equal(captured.id, 'dsh-moss-studio')
  return captured.factory(require)
}

function fakeContext() {
  const calls = { tabTypes: [], slots: [], opened: [], effects: [], dictionaries: [] }
  // Stand-in for the client locale service: it must translate, because the
  // panel reads its copy through the bound translator after registration.
  const registered = new Map()
  // Stand-in for the client locale service: enough for registration to succeed.
  const locale = {
    register(ns, dicts) {
      calls.dictionaries.push({ ns, locales: Object.keys(dicts) })
      registered.set(ns, dicts)
      return () => registered.delete(ns)
    },
    bind: (ns) => (key, params) => {
      const template = registered.get(ns)?.zh?.[key] ?? key
      if (params === undefined) return template
      return template.replace(/\{(\w+)\}/g, (match, name) => (name in params ? String(params[name]) : match))
    },
    getSnapshot: () => ({ active: 'zh', revision: 0 }),
    subscribe: () => () => {},
  }
  const ctx = {
    get(name) {
      return name === 'locale' ? locale : undefined
    },
    effect(fn, label) {
      if (typeof label === 'string') calls.effects.push(label)
      const dispose = fn()
      return typeof dispose === 'function' ? dispose : () => {}
    },
    slots: {
      inject(owner, register) {
        calls.slots.push(owner)
        return register()
      },
      register(definition, component) {
        calls.registrations = calls.registrations ?? []
        calls.registrations.push({ definition, component })
        return () => {}
      },
    },
    sidebarRightTabs: {
      register(definition) {
        calls.tabTypes.push(definition)
        return () => {}
      },
    },
    sidebarRight: {
      openTab(kind) {
        calls.opened.push(kind)
        return kind
      },
    },
  }
  return { ctx, calls }
}

test('the bundle registers the tab, the main panel, and its sidebar launcher', () => {
  const plugin = loadPlugin()
  const { ctx, calls } = fakeContext()

  plugin.apply(ctx)

  assert.deepEqual(plugin.inject, ['locale', 'slots', 'sidebarRightTabs', 'sidebarRight'])

  // Dictionaries are registered through the locale service, not a private table.
  assert.ok(calls.effects.includes('moss-studio: locale dictionaries'), 'the locale effect runs')
  assert.equal(calls.tabTypes.length, 1)
  assert.equal(calls.tabTypes[0].id, 'dsh-moss-studio')
  assert.equal(calls.tabTypes[0].kind, 'moss-studio')
  assert.equal(calls.tabTypes[0].title(), 'Moss studio')
  const guide = calls.tabTypes[0].guide[0]
  assert.equal(guide.id, 'moss-studio')
  assert.equal(typeof guide.order, 'number')
  assert.equal(typeof guide.title, 'function')
  assert.equal(guide.title(), 'Moss studio')
  assert.equal(typeof guide.description, 'function')
  assert.equal(typeof guide.icon, 'function', 'the start page card needs a guide icon')

  const body = calls.registrations.find((entry) => entry.definition.name === 'sidebar.right.pane.tab')
  assert.equal(body.definition.key, 'dsh-moss-studio')
  // 0.2.3 supplies sessionId as a built-in prop, so the registration must not
  // duplicate it through inject(); the body reads the prop directly.
  assert.equal(body.definition.inject, undefined)

  const main = calls.registrations.find((entry) => entry.definition.name === 'main')
  assert.equal(main.definition.key, 'moss-studio')

  const launcher = calls.registrations.find((entry) => entry.definition.name === 'sidebar.panellist')
  assert.equal(launcher.definition.id, 'moss-studio')
  assert.equal(launcher.definition.label(), 'Moss studio')

  assert.equal(
    calls.registrations.find((entry) => entry.definition.name === 'sidebar.footer.action'),
    undefined,
    'the footer button is gone',
  )
})

test('the launcher icon renders and the main page falls back to the right tab', () => {
  const plugin = loadPlugin()
  const { ctx, calls } = fakeContext()
  plugin.apply(ctx)
  const launcher = calls.registrations.find((entry) => entry.definition.name === 'sidebar.panellist')
  const html = renderToString(React.createElement(launcher.component, { size: 18, active: true }))
  assert.match(html, /svg/, 'the launcher renders its glyph')
})

test('the panel renders its loading state before state arrives', () => {
  const plugin = loadPlugin()
  const { ctx, calls } = fakeContext()
  plugin.apply(ctx)
  const body = calls.registrations.find((entry) => entry.definition.name === 'sidebar.right.pane.tab')
  globalThis.fetch = async () => new Response(JSON.stringify({ ok: true, revision: 0, params: {}, records: [] }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  })
  const html = renderToString(React.createElement(body.component, { sessionId: 'sess-1' }))
  assert.match(html, /moss studio/i)
})
test('the layout editor modal renders its controls', () => {
  const plugin = loadPlugin()
  const Editor = plugin.components.BoxEditor
  const html = renderToString(React.createElement(Editor, {
    params: {
      prompt: 'p',
      negative: 'x',
      size: '768x1024',
      steps: 25,
      cfg: 2.5,
      seed: -1,
      characterBoxes: '1',
      enhance: false,
      boxes: [{ x: 0.1, y: 0.1, width: 0.3, height: 0.2, type: 'obj', text: '', desc: '红圈', palette: [] }],
    },
    selected: 0,
    onSelect: () => {},
    onChange: () => {},
    onAdd: () => {},
    onRemove: () => {},
    onToggleCharacter: () => {},
    onClose: () => {},
    onCancel: () => {},
  }))
  assert.match(html, /编辑布局/)
  assert.match(html, /768x1024/)
  assert.match(html, /红圈/)
  assert.match(html, /完成/)
})

test('a box draws its caption inside the frame', () => {
  const plugin = loadPlugin()
  const Editor = plugin.components.BoxEditor
  const boxes = [{ x: 0.1, y: 0.1, width: 0.6, height: 0.5, type: 'obj', text: '', desc: '红圈在左侧', palette: [] }]
  const html = renderToString(React.createElement(Editor, {
    params: { prompt: 'p', negative: 'x', size: '1024x1024', steps: 25, cfg: 2.5, seed: -1, characterBoxes: '', enhance: false, boxes },
    selected: -1,
    onSelect: () => {},
    onChange: () => {},
    onAdd: () => {},
    onRemove: () => {},
    onToggleCharacter: () => {},
    onClose: () => {},
    onCancel: () => {},
  }))
  assert.match(html, /红圈在左侧/)
})

test('the tab body reads the session from props or the tab record', () => {
  const plugin = loadPlugin()
  const { ctx, calls } = fakeContext()
  plugin.apply(ctx)
  const body = calls.registrations.find((entry) => entry.definition.name === 'sidebar.right.pane.tab')
  const render = (props) => body.component(props)

  assert.equal(render({ sessionId: 'sess-1' }).props.sessionId, 'sess-1')
  assert.equal(render({ useTabInfo: () => ({ tab: { sessionId: 'sess-2' } }) }).props.sessionId, 'sess-2')
  assert.equal(render({}).props.sessionId, 'global', 'a body without a session still renders')
})

test('the locale namespace is registered with both base languages', () => {
  const plugin = loadPlugin()
  const { ctx, calls } = fakeContext()
  plugin.apply(ctx)
  assert.equal(calls.dictionaries.length, 1)
  assert.equal(calls.dictionaries[0].ns, 'moss-studio')
  assert.deepEqual(calls.dictionaries[0].locales.sort(), ['en', 'zh'])
})

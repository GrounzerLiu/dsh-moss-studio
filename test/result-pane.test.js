import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const require = createRequire(import.meta.url)
const bundlePath = fileURLToPath(new URL('../client.js', import.meta.url))

function loadPlugin() {
  const source = readFileSync(bundlePath, 'utf8')
  let captured
  const windowLike = { __ModuleLoader__: { load(entry) { captured = entry } } }
  new Function('window', 'require', source)(windowLike, require)
  return captured.factory(require)
}

const record = {
  id: '20261123T064925561Z-e887',
  status: 'done',
  prompt: 'a stone',
  params: { seed: 7 },
  result: { width: 512, height: 512, seconds: 22 },
  hasImage: true,
}

function render(orientation) {
  const plugin = loadPlugin()
  return renderToStaticMarkup(React.createElement(plugin.components.ResultPane, {
    orientation,
    shownRecordId: record.id,
    shownHasImage: true,
    shownRunning: false,
    imageBroken: false,
    onImageError: () => {},
    activeRecord: record,
    activeRecordId: record.id,
    onZoom: () => {},
    onLoad: () => {},
    onRemove: () => {},
    onRetry: () => {},
    error: '',
  }))
}

/**
 * The picture must be constrained by its frame, never by its own intrinsic size.
 *
 * It used to rely on `max-height: 100%` against an auto-height flex box, so a
 * tall image kept its intrinsic height and the bottom was clipped as soon as the
 * result strip got short. Absolute positioning inside a relative frame plus
 * `object-fit: contain` removes that dependency.
 */
/**
 * The panel sets box-sizing: border-box for its whole subtree.
 *
 * Without it a `height: 100%` box with padding overflows its slot by exactly
 * the padding: measured in a real browser, the result picture ended 8px past
 * the panel's bottom edge in a 300px-tall sidebar.
 */
test('the panel applies border-box sizing to everything it renders', () => {
  const styles = readFileSync('src/ScopeStyles.jsx', 'utf8')
  assert.match(styles, /.moss-studio *[,{]/)
  assert.match(styles, /box-sizing: border-box/)
})

test('the result picture is constrained by its frame in both orientations', () => {
  for (const orientation of ['row', 'column']) {
    const html = render(orientation)
    const match = /<img[^>]*style="([^"]*)"/.exec(html)
    assert.ok(match !== null, `${orientation}: the picture renders`)
    const style = match[1]
    assert.match(style, /position:absolute/, `${orientation}: taken out of flow`)
    assert.match(style, /object-fit:contain/, `${orientation}: letterboxed, not cropped`)
    assert.match(style, /width:100%/, `${orientation}: fills the frame width`)
    assert.match(style, /height:100%/, `${orientation}: fills the frame height`)
    assert.doesNotMatch(style, /max-height/, `${orientation}: no percentage-against-auto dependency`)
  }
})
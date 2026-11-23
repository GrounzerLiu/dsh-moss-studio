import test from 'node:test'
import assert from 'node:assert/strict'

import { normalizeComfyUrl, settingsState } from '../lib/settings.js'

test('comfy urls are normalized and trimmed', () => {
  assert.equal(normalizeComfyUrl('http://127.0.0.1:8188'), 'http://127.0.0.1:8188')
  assert.equal(normalizeComfyUrl('  http://127.0.0.1:8188/  '), 'http://127.0.0.1:8188')
  assert.equal(normalizeComfyUrl('https://gpu.example.com//'), 'https://gpu.example.com')
  // A reverse proxy path is kept, its trailing slash is not.
  assert.equal(normalizeComfyUrl('http://box:8188/comfy/'), 'http://box:8188/comfy')
  // Query and hash carry no meaning for the API base.
  assert.equal(normalizeComfyUrl('http://box:8188/?x=1'), 'http://box:8188')
})

test('bad comfy urls are rejected with a reason', () => {
  assert.throws(() => normalizeComfyUrl(''), /请填写/)
  assert.throws(() => normalizeComfyUrl('ftp://box'), /http 或 https/)
  assert.throws(() => normalizeComfyUrl('nonsense'), /不是有效的地址/)
  assert.throws(() => normalizeComfyUrl('http://user:pass@box:8188'), /账号密码/)
})

test('settings state separates editable settings from wiring', () => {
  const state = settingsState({
    comfyUrl: 'http://127.0.0.1:8188',
    dataDir: 'C:/dsh/moss-studio',
    workflowPath: 'C:/dsh/moss-studio/workflow.json',
    timeoutMs: 600000,
    pollMs: 1000,
    steps: 25,
    cfg: 2.5,
    editable: true,
  })
  assert.equal(state.settings.comfyUrl, 'http://127.0.0.1:8188')
  assert.equal(state.settings.editable, true)
  assert.equal(state.wiring.defaults.steps, 25)
  assert.equal(state.wiring.dataDir, 'C:/dsh/moss-studio')
})

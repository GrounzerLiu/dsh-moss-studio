import test from 'node:test'
import assert from 'node:assert/strict'

import { normalizeComfyUrl, readSettingsPatch, settingsState } from '../lib/settings.js'

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
    retention: 100,
    defaultSize: '768x1024',
    defaultSteps: 30,
    defaultCfg: 3,
    defaultNegative: 'blurry',
    dataDir: 'C:/dsh/moss-studio',
    workflowPath: 'C:/dsh/moss-studio/workflow.json',
    timeoutMs: 600000,
    pollMs: 1000,
    editable: true,
  })
  assert.equal(state.settings.comfyUrl, 'http://127.0.0.1:8188')
  assert.equal(state.settings.retention, 100)
  assert.equal(state.settings.defaults.size, '768x1024')
  assert.equal(state.settings.defaults.steps, 30)
  assert.equal(state.settings.editable, true)
  assert.equal(state.wiring.dataDir, 'C:/dsh/moss-studio')
  assert.equal(state.wiring.workflowPath, 'C:/dsh/moss-studio/workflow.json')
})
test('settings patches are validated field by field', () => {
  assert.deepEqual(readSettingsPatch({ comfyUrl: 'http://box:8188/' }), { comfyUrl: 'http://box:8188' })
  assert.deepEqual(readSettingsPatch({ retention: 20 }), { retention: 20 })
  assert.deepEqual(
    readSettingsPatch({ defaults: { steps: 12, size: '512x512', cfg: 1.5, negative: 'x' } }),
    { defaults: { defaultSteps: 12, defaultSize: '512x512', defaultCfg: 1.5, defaultNegative: 'x' } },
  )

  assert.throws(() => readSettingsPatch({}), /没有需要保存/)
  assert.throws(() => readSettingsPatch({ nope: 1 }), /unknown setting/)
  assert.throws(() => readSettingsPatch({ retention: 1.5 }), /保留条数/)
  assert.throws(() => readSettingsPatch({ retention: 99999 }), /保留条数/)
  assert.throws(() => readSettingsPatch({ defaults: { steps: 0 } }), /默认步数/)
  assert.throws(() => readSettingsPatch({ defaults: { size: '100x100' } }), /16/)
  assert.throws(() => readSettingsPatch({ defaults: { cfg: 99 } }), /CFG/)
})

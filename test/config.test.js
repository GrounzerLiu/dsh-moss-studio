import test from 'node:test'
import assert from 'node:assert/strict'

import { Config, apply } from '../index.js'

test('the row schema rejects hand-edited numeric config outside the supported ranges', () => {
  const invalid = [
    [{ retention: 0.5 }, /retention/],
    [{ retention: -1 }, /retention/],
    [{ retention: 5001 }, /retention/],
    [{ defaultSteps: 0 }, /defaultSteps/],
    [{ defaultSteps: 1.5 }, /defaultSteps/],
    [{ defaultSteps: 201 }, /defaultSteps/],
    [{ defaultCfg: -0.1 }, /defaultCfg/],
    [{ defaultCfg: 30.1 }, /defaultCfg/],
    [{ timeoutMs: 0 }, /timeoutMs/],
    [{ pollMs: 10 }, /pollMs/],
    [{ pollMs: 60001 }, /pollMs/],
  ]
  for (const [value, message] of invalid) {
    assert.throws(() => Config(value), message)
  }
})

test('runtime normalization rejects invalid YAML values the schema cannot express', () => {
  const invalid = [
    [{ defaultSize: '100x100' }, /multiples of 16|minimum/],
    [{ defaultSize: 42 }, /defaultSize must be a string/],
    [{ comfyUrl: 'ftp://example.test' }, /http/],
    [{ comfyUrl: 'http://user:pass@example.test' }, /账号密码/],
    [{ retention: 0.5 }, /保留条数/],
    [{ defaultSteps: 0 }, /steps\/defaultSteps/],
    [{ defaultCfg: 31 }, /cfg\/defaultCfg/],
    [{ defaultNegative: 'x'.repeat(2001) }, /negative\/defaultNegative/],
    [{ timeoutMs: 0 }, /timeoutMs/],
    [{ pollMs: 10 }, /pollMs/],
  ]
  for (const [value, message] of invalid) {
    assert.throws(() => apply({}, value), message)
  }
})

test('valid boundary config values are accepted', () => {
  assert.doesNotThrow(() => Config({
    retention: 0,
    defaultSize: '512x512',
    defaultSteps: 1,
    defaultCfg: 0,
    defaultNegative: '',
    timeoutMs: 1000,
    pollMs: 20,
  }))
  assert.doesNotThrow(() => Config({
    retention: 5000,
    defaultSize: '2048x2048',
    defaultSteps: 200,
    defaultCfg: 30,
    timeoutMs: 600000,
    pollMs: 60000,
  }))
})

/**
 * Settings that belong to the plugin's own row: parsing and validation for the
 * values the panel may edit.
 */

import { StudioError } from './storage.js'

/**
 * Normalize a ComfyUI base URL.
 *
 * Only http/https is accepted, the value is trimmed and trailing slashes are
 * removed so `/prompt` never becomes `//prompt`. Anything with credentials is
 * rejected rather than stored in a config file that other tools read.
 *
 * @param {unknown} value
 * @returns {string}
 */
export function normalizeComfyUrl(value) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new StudioError('INVALID_URL', '请填写 ComfyUI 地址，例如 http://127.0.0.1:8188')
  }
  const text = value.trim().replace(/\/+$/, '')
  let url
  try {
    url = new URL(text)
  } catch {
    throw new StudioError('INVALID_URL', `不是有效的地址：${value}`)
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new StudioError('INVALID_URL', '只支持 http 或 https')
  }
  if (url.username !== '' || url.password !== '') {
    throw new StudioError('INVALID_URL', '地址里不能带账号密码')
  }
  if (url.hostname === '') {
    throw new StudioError('INVALID_URL', '地址缺少主机名')
  }
  // Keep any path prefix (ComfyUI behind a reverse proxy) but drop query/hash.
  const path = url.pathname === '/' ? '' : url.pathname.replace(/\/+$/, '')
  return `${url.protocol}//${url.host}${path}`
}

/**
 * Settings payload for the panel.
 *
 * @param {{ comfyUrl: string, dataDir: string, workflowPath: string, timeoutMs: number, pollMs: number, steps: number, cfg: number, editable: boolean }} input
 */
export function settingsState(input) {
  return {
    ok: true,
    settings: {
      comfyUrl: input.comfyUrl,
      editable: input.editable,
    },
    wiring: {
      // Read-only: these decide where the host writes and which graph it injects,
      // so they stay in the profile patch and only change on restart.
      dataDir: input.dataDir,
      workflowPath: input.workflowPath,
      timeoutMs: input.timeoutMs,
      pollMs: input.pollMs,
      defaults: { steps: input.steps, cfg: input.cfg },
    },
  }
}

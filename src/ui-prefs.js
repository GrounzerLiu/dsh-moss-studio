/**
 * Panel layout preferences.
 *
 * These are per-browser, not per-draft: they describe how this person likes the
 * columns arranged, so they live in localStorage rather than the host's config.
 * Every read is defensive — a corrupted or hand-edited value must fall back to
 * the defaults instead of breaking the panel on load.
 */

const KEY = 'moss-studio.ui'

export const DEFAULT_UI = Object.freeze({
  resultHeight: 240,
  resultCollapsed: false,
  historyWidth: { narrow: 196, wide: 280 },
})

function clamp(value, min, max, fallback) {
  return typeof value === 'number' && Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback
}

function memoryStorage() {
  if (typeof localStorage === 'undefined') return undefined
  return localStorage
}

/** @returns {{ resultHeight: number, resultCollapsed: boolean, historyWidth: { narrow: number, wide: number } }} */
export function loadUiPrefs(storage = memoryStorage()) {
  const defaults = { ...DEFAULT_UI, historyWidth: { ...DEFAULT_UI.historyWidth } }
  if (storage === undefined) return defaults
  let raw
  try {
    raw = JSON.parse(storage.getItem(KEY) ?? 'null')
  } catch {
    raw = null
  }
  if (raw === null || typeof raw !== 'object') return defaults
  return {
    resultHeight: clamp(raw.resultHeight, 120, 720, DEFAULT_UI.resultHeight),
    resultCollapsed: raw.resultCollapsed === true,
    historyWidth: {
      narrow: clamp(raw.historyWidth?.narrow, 160, 420, DEFAULT_UI.historyWidth.narrow),
      wide: clamp(raw.historyWidth?.wide, 160, 420, DEFAULT_UI.historyWidth.wide),
    },
  }
}

/** Merge one patch into the stored preferences; storage failures are not fatal. */
export function saveUiPrefs(patch, storage = memoryStorage()) {
  if (storage === undefined) return
  const next = { ...loadUiPrefs(storage), ...patch }
  try {
    storage.setItem(KEY, JSON.stringify(next))
  } catch {
    // A full or blocked quota only costs the preference, not the panel.
  }
}

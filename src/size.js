/**
 * Size validation for the panel.
 *
 * The host validates every size again before it reaches ComfyUI; this copy
 * exists so the inputs can answer while the user is still typing instead of
 * letting a debounced save fail with a 400.
 */

import { t } from './i18n.js'

export const MIN_PIXELS = 512 * 512
export const MAX_PIXELS = 2048 * 2048

/** Common shapes, offered as one-click presets. */
export const SIZE_PRESETS = ['1024x1024', '768x1024', '1024x768', '896x1152', '1152x896', '512x512']

/** @param {number} width @param {number} height */
export function formatSize(width, height) {
  return `${width}x${height}`
}

/** Split "768x1024" / "768×1024" / "768 * 1024" into numbers, or null. */
export function splitSize(text) {
  const match = /^\s*(\d+)\s*[x×*]\s*(\d+)\s*$/i.exec(String(text ?? ''))
  if (match === null) return null
  return { width: Number(match[1]), height: Number(match[2]) }
}

/**
 * Why a size cannot be used, or null when it can.
 * @param {number} width
 * @param {number} height
 * @returns {string | null}
 */
export function sizeProblem(width, height, widthText, heightText) {
  if (String(widthText).trim() === '' || String(heightText).trim() === '') return t('size.errorEmpty')
  if (!Number.isSafeInteger(width) || !Number.isSafeInteger(height) || width <= 0 || height <= 0) {
    return t('size.errorPositive')
  }
  if (width % 16 !== 0 || height % 16 !== 0) return t('size.errorMultiple')
  const pixels = width * height
  if (pixels < MIN_PIXELS) return t('size.errorTooSmall')
  if (pixels > MAX_PIXELS) return t('size.errorTooLarge')
  return null
}
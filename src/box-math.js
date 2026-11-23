/**
 * Pure geometry for the layout canvas: moving and resizing a box in fraction
 * space (0..1, top-left origin). Kept out of the component so it can be tested
 * without a DOM.
 */

export const MIN_SIZE = 0.02

export function clamp(value, low, high) {
  return Math.min(high, Math.max(low, value))
}

/** Ratio width/height for a `WIDTHxHEIGHT` string; square when unparsable. */
export function parseRatio(size) {
  const match = /^\s*(\d+)\s*[x×*]\s*(\d+)\s*$/i.exec(String(size ?? ''))
  if (match === null) return 1
  const width = Number(match[1])
  const height = Number(match[2])
  return width > 0 && height > 0 ? width / height : 1
}

/** Move a box by a fraction of the canvas, keeping it inside the frame. */
export function moveBox(box, dx, dy) {
  return {
    ...box,
    x: clamp(box.x + dx, 0, 1 - box.width),
    y: clamp(box.y + dy, 0, 1 - box.height),
  }
}

/** Resize from the lower-right corner, never below MIN_SIZE or past the edge. */
export function resizeBox(box, dx, dy) {
  return {
    ...box,
    width: clamp(box.width + dx, MIN_SIZE, 1 - box.x),
    height: clamp(box.height + dy, MIN_SIZE, 1 - box.y),
  }
}

/** New box dropped at the middle of the canvas. */
export function defaultBox() {
  return { x: 0.3, y: 0.3, width: 0.4, height: 0.3, type: 'obj', text: '', desc: '', palette: [] }
}
/**
 * The frame a ratio must occupy inside a width budget and a height budget: the
 * whole frame stays visible, never wider than `available` and never taller than
 * `budget`, and the ratio is never distorted.
 * @param available - the horizontal space in pixels.
 * @param ratio - width divided by height.
 * @param budget - the most height the frame may use.
 */
export function frameSize(available, ratio, budget) {
  if (!(available > 0) || !(ratio > 0) || !(budget > 0)) return undefined
  const width = Math.min(available, budget * ratio)
  return { width, height: width / ratio }
}

/**
 * How a box's caption should be drawn inside it: hidden on tiny boxes, a font
 * size that scales with the box, and a line count that fits the remaining
 * height under the index badge.
 * @param widthPx - the box's on-screen width.
 * @param heightPx - the box's on-screen height.
 */
export function labelMetrics(widthPx, heightPx) {
  if (!(widthPx >= 26) || !(heightPx >= 20)) return { show: false, fontSize: 0, lines: 0 }
  const fontSize = Math.max(9, Math.min(12, Math.round(Math.min(widthPx / 12, heightPx / 10))))
  const usable = heightPx - 18
  const lines = Math.max(1, Math.min(6, Math.floor(usable / (fontSize * 1.35))))
  return { show: lines >= 1, fontSize, lines }
}

/**
 * Apply a geometry patch to a box, keeping it a valid rectangle inside the
 * frame no matter which field the caller changed: size is clamped first, then
 * position, so typing a big width cannot push the box past the edge.
 * @param {object} box - any box carrying x, y, width, height in 0..1.
 * @param {{ x?: number, y?: number, width?: number, height?: number }} patch
 */
export function updateBoxGeometry(box, patch) {
  const width = clamp(Number.isFinite(patch.width) ? patch.width : box.width, MIN_SIZE, 1)
  const height = clamp(Number.isFinite(patch.height) ? patch.height : box.height, MIN_SIZE, 1)
  return {
    ...box,
    width,
    height,
    x: clamp(Number.isFinite(patch.x) ? patch.x : box.x, 0, 1 - width),
    y: clamp(Number.isFinite(patch.y) ? patch.y : box.y, 0, 1 - height),
  }
}

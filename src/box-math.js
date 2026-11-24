/**
 * Geometry for the layout boxes.
 *
 * Everything a box needs is a rectangle in 0..1 of the frame, so the whole
 * editing surface is plain arithmetic that can be tested without a DOM. The
 * canvas only converts pointer pixels into these arguments.
 */

export const MIN_SIZE = 0.02

/** The eight resize directions, clockwise from the top-left corner. */
export const HANDLES = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w']

export function clamp(value, low, high) {
  return Math.min(high, Math.max(low, value))
}

/** @returns {number} width divided by height, falling back to a square. */
export function parseRatio(size) {
  const match = /^\s*(\d+)\s*[x×*]\s*(\d+)\s*$/i.exec(String(size ?? ''))
  if (match === null) return 1
  const width = Number(match[1])
  const height = Number(match[2])
  if (!(width > 0) || !(height > 0)) return 1
  return width / height
}

/** Shift one box, keeping it inside the frame. */
export function moveBox(box, dx, dy) {
  return {
    ...box,
    x: clamp(box.x + dx, 0, 1 - box.width),
    y: clamp(box.y + dy, 0, 1 - box.height),
  }
}

/**
 * Shift a whole selection as one rigid group: the group stops when its leading
 * edge reaches the frame, so relative positions never drift.
 *
 * @param {object[]} boxes
 * @param {number[]} indices
 * @param {number} dx
 * @param {number} dy
 */
export function moveBoxes(boxes, indices, dx, dy) {
  const wanted = new Set(indices)
  const picked = boxes.filter((_, index) => wanted.has(index))
  if (picked.length === 0) return boxes
  const left = Math.min(...picked.map((box) => box.x))
  const top = Math.min(...picked.map((box) => box.y))
  const right = Math.max(...picked.map((box) => box.x + box.width))
  const bottom = Math.max(...picked.map((box) => box.y + box.height))
  const stepX = clamp(dx, -left, 1 - right)
  const stepY = clamp(dy, -top, 1 - bottom)
  return boxes.map((box, index) => (wanted.has(index) ? moveBox(box, stepX, stepY) : box))
}

/**
 * Resize from one of the eight handles.
 *
 * `start` is the box as it was when the drag began, and dx/dy are the total
 * movement since then, so repeated calls stay stable instead of accumulating
 * rounding error.
 *
 * @param {object} start - { x, y, width, height }
 * @param {'nw'|'n'|'ne'|'e'|'se'|'s'|'sw'|'w'} handle
 * @param {number} dx
 * @param {number} dy
 * @param {{ lockAspect?: boolean }} [options]
 */
export function resizeByHandle(start, handle, dx, dy, options = {}) {
  const movingLeft = handle.includes('w')
  const movingRight = handle.includes('e')
  const movingTop = handle.includes('n')
  const movingBottom = handle.includes('s')

  let left = start.x
  let top = start.y
  let right = start.x + start.width
  let bottom = start.y + start.height

  if (movingLeft) left = clamp(start.x + dx, 0, right - MIN_SIZE)
  if (movingRight) right = clamp(start.x + start.width + dx, left + MIN_SIZE, 1)
  if (movingTop) top = clamp(start.y + dy, 0, bottom - MIN_SIZE)
  if (movingBottom) bottom = clamp(start.y + start.height + dy, top + MIN_SIZE, 1)

  if (options.lockAspect === true && (movingLeft || movingRight) && (movingTop || movingBottom)) {
    const ratio = start.width / start.height
    let width = right - left
    let height = bottom - top
    // Grow along the axis that moved further, then derive the other side.
    if (Math.abs(width / ratio - height) < Math.abs(height * ratio - width)) {
      height = width / ratio
    } else {
      width = height * ratio
    }
    width = clamp(width, MIN_SIZE, 1)
    height = clamp(height, MIN_SIZE, 1)
    if (movingLeft) left = right - width
    else right = left + width
    if (movingTop) top = bottom - height
    else bottom = top + height
    // A clamp at the frame edge can push the derived side out; pull the moved
    // edges back inside and keep the ratio by shrinking the far side.
    if (left < 0) { left = 0; right = Math.min(1, left + width) }
    if (top < 0) { top = 0; bottom = Math.min(1, top + height) }
    if (right > 1) { right = 1; left = Math.max(0, right - (right - left)) }
    if (bottom > 1) { bottom = 1; top = Math.max(0, bottom - (bottom - top)) }
  }

  return { x: left, y: top, width: Math.max(MIN_SIZE, right - left), height: Math.max(MIN_SIZE, bottom - top) }
}

/** Resize from the lower-right corner; kept as the shorthand callers used before
 *  the other seven handles existed. */
export function resizeBox(box, dx, dy) {
  return resizeByHandle(box, 'se', dx, dy)
}

/** The smallest rectangle containing the given boxes. */
export function selectionBounds(boxes, indices) {
  const picked = boxes.filter((_, index) => indices.includes(index))
  if (picked.length === 0) return undefined
  const left = Math.min(...picked.map((box) => box.x))
  const top = Math.min(...picked.map((box) => box.y))
  const right = Math.max(...picked.map((box) => box.x + box.width))
  const bottom = Math.max(...picked.map((box) => box.y + box.height))
  return { x: left, y: top, width: right - left, height: bottom - top }
}

/**
 * Nudge a box until one of its edges or its centre lines up with a neighbour.
 *
 * Ties the three anchor points of the box (start, centre, end) to the same
 * three points of every other box and of the frame, so centre-to-centre and
 * edge-to-edge alignment both work without any modifier key.
 *
 * @param {object} box
 * @param {object[]} others - boxes to align against (the selection excluded)
 * @param {{ threshold?: number }} [options]
 * @returns {{ box: object, guides: { axis: 'x'|'y', at: number, span?: number }[] }}
 */
export function snapBox(box, others, options = {}) {
  const threshold = options.threshold ?? 0.008
  const axisTargets = { x: [0, 0.5, 1], y: [0, 0.5, 1] }
  for (const other of others) {
    axisTargets.x.push(other.x, other.x + other.width / 2, other.x + other.width)
    axisTargets.y.push(other.y, other.y + other.height / 2, other.y + other.height)
  }

  const anchorsX = [box.x, box.x + box.width / 2, box.x + box.width]
  const anchorsY = [box.y, box.y + box.height / 2, box.y + box.height]

  const best = (anchors, targets) => {
    let winner = undefined
    for (const anchor of anchors) {
      for (const target of targets) {
        const delta = target - anchor
        if (Math.abs(delta) > threshold) continue
        if (winner === undefined || Math.abs(delta) < Math.abs(winner.delta)) winner = { delta, at: target }
      }
    }
    return winner
  }

  const snapX = best(anchorsX, axisTargets.x)
  const snapY = best(anchorsY, axisTargets.y)
  const next = {
    ...box,
    x: clamp(box.x + (snapX?.delta ?? 0), 0, 1 - box.width),
    y: clamp(box.y + (snapY?.delta ?? 0), 0, 1 - box.height),
  }
  const guides = []
  if (snapX !== undefined) guides.push({ axis: 'x', at: snapX.at })
  if (snapY !== undefined) guides.push({ axis: 'y', at: snapY.at })
  return { box: next, guides }
}

/**
 * Line the selection up with its own bounding box, the way design tools align
 * to the selection rather than to the artboard.
 *
 * @param {object[]} boxes
 * @param {number[]} indices
 * @param {'left'|'centerX'|'right'|'top'|'middleY'|'bottom'} mode
 */
export function alignBoxes(boxes, indices, mode) {
  const bounds = selectionBounds(boxes, indices)
  if (bounds === undefined) return boxes
  const wanted = new Set(indices)
  return boxes.map((box, index) => {
    if (!wanted.has(index)) return box
    switch (mode) {
      case 'left': return { ...box, x: bounds.x }
      case 'centerX': return { ...box, x: bounds.x + (bounds.width - box.width) / 2 }
      case 'right': return { ...box, x: bounds.x + bounds.width - box.width }
      case 'top': return { ...box, y: bounds.y }
      case 'middleY': return { ...box, y: bounds.y + (bounds.height - box.height) / 2 }
      case 'bottom': return { ...box, y: bounds.y + bounds.height - box.height }
      default: return box
    }
  })
}

/**
 * Even out the gaps between three or more boxes along one axis.
 * Fewer than three have nothing to distribute, so the input is returned as is.
 *
 * @param {'x'|'y'} axis
 */
export function distributeBoxes(boxes, indices, axis) {
  const wanted = new Set(indices)
  const picked = boxes.map((box, index) => ({ box, index })).filter((entry) => wanted.has(entry.index))
  if (picked.length < 3) return boxes
  const startKey = axis === 'x' ? 'x' : 'y'
  const sizeKey = axis === 'x' ? 'width' : 'height'
  const ordered = [...picked].sort((a, b) => a.box[startKey] - b.box[startKey])
  const first = ordered[0].box
  const last = ordered[ordered.length - 1].box
  const span = last[startKey] + last[sizeKey] - first[startKey]
  const total = ordered.reduce((sum, entry) => sum + entry.box[sizeKey], 0)
  const gap = (span - total) / (ordered.length - 1)

  let cursor = first[startKey]
  const placed = new Map()
  for (const entry of ordered) {
    placed.set(entry.index, { ...entry.box, [startKey]: cursor })
    cursor += entry.box[sizeKey] + gap
  }
  return boxes.map((box, index) => placed.get(index) ?? box)
}

/**
 * Copy the selected boxes, nudged so the copies are visible instead of hidden
 * exactly underneath their originals.
 *
 * @returns {{ boxes: object[], added: number[] }} the new list and the indexes of the copies
 */
export function duplicateBoxes(boxes, indices, offset = 0.02) {
  const wanted = new Set(indices)
  const copies = []
  boxes.forEach((box, index) => {
    if (!wanted.has(index)) return
    copies.push({
      ...box,
      x: clamp(box.x + offset, 0, 1 - box.width),
      y: clamp(box.y + offset, 0, 1 - box.height),
    })
  })
  const added = copies.map((_, position) => boxes.length + position)
  return { boxes: [...boxes, ...copies], added }
}

/** Build a box out of two opposite corners while drawing; order-independent. */
export function boxFromCorners(ax, ay, bx, by) {
  const left = clamp(Math.min(ax, bx), 0, 1)
  const top = clamp(Math.min(ay, by), 0, 1)
  const right = clamp(Math.max(ax, bx), 0, 1)
  const bottom = clamp(Math.max(ay, by), 0, 1)
  return {
    x: left,
    y: top,
    width: Math.max(MIN_SIZE, right - left),
    height: Math.max(MIN_SIZE, bottom - top),
  }
}

/** A box drawn from the centre outwards, sized so a square stays square. */
export function defaultBox() {
  const width = 0.3
  const height = 0.3
  return { type: 'obj', x: (1 - width) / 2, y: (1 - height) / 2, width, height, desc: '', palette: [] }
}

/**
 * How tall the frame may get: never wider than `available`, never taller than
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
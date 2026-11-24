/**
 * Geometry for the layout boxes.
 *
 * Everything a box needs is a rectangle in 0..1 of the frame, so the whole
 * editing surface is plain arithmetic that can be tested without a DOM. The
 * canvas only converts pointer pixels into these arguments.
 */

export const MIN_SIZE = 0.02

/**
 * The workflow node refuses more than this, so the editor stops at the same
 * number instead of letting a layout be built that cannot be generated.
 * Kept in step with `lib/workflow.js` by a test.
 */
export const MAX_BOXES = 24

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

  if (options.lockAspect !== true) {
    return { x: left, y: top, width: Math.max(MIN_SIZE, right - left), height: Math.max(MIN_SIZE, bottom - top) }
  }

  const ratio = start.width / start.height
  const horizontal = movingLeft || movingRight
  const vertical = movingTop || movingBottom

  // Compare relative changes: |Δw|/w and |Δh|/h are the same kind of quantity.
  // The old comparison mixed pixels with ratios, which let a 4:1 box weight its
  // width side four times too heavily.
  const relW = (right - left - start.width) / start.width
  const relH = (bottom - top - start.height) / start.height
  const driver = horizontal && vertical
    ? (Math.abs(relW) >= Math.abs(relH) ? 'width' : 'height')
    : horizontal ? 'width' : 'height'

  // Room left on each axis by the edges that did not move, plus how much a
  // centred (edge-only) drag may grow around the box's own centre.
  const widthRoom = movingLeft ? right : movingRight ? 1 - left : 1
  const heightRoom = movingTop ? bottom : movingBottom ? 1 - top : 1
  const centre = (value, span) => 2 * Math.min(value + span / 2, 1 - (value + span / 2))
  const maxWidth = Math.min(widthRoom, horizontal ? 1 : centre(start.x, start.width))
  const maxHeight = Math.min(heightRoom, vertical ? 1 : centre(start.y, start.height))

  // Keeping the ratio means width = height * ratio, so the tighter axis bounds
  // both; solve for width, derive height from it, and never leave the frame.
  const ceiling = Math.max(1e-6, Math.min(maxWidth, maxHeight * ratio))
  const floor = Math.min(MIN_SIZE * Math.max(1, ratio), ceiling)
  const wanted = driver === 'width' ? right - left : (bottom - top) * ratio
  const width = clamp(wanted, floor, ceiling)
  const height = width / ratio

  let x
  if (movingLeft) x = right - width
  else if (movingRight) x = left
  else x = start.x + start.width / 2 - width / 2
  let y
  if (movingTop) y = bottom - height
  else if (movingBottom) y = top
  else y = start.y + start.height / 2 - height / 2

  return {
    x: clamp(x, 0, 1 - width),
    y: clamp(y, 0, 1 - height),
    width,
    height,
  }
}

/**
 * Snap the single edge a resize handle is dragging, leaving the opposite edge
 * where it is.
 *
 * Snapping a whole box while resizing (what `snapBox` does) would shift the box
 * instead of its edge; aligning the moving edge is what the eye is looking for.
 *
 * @param {object} box
 * @param {string} handle
 * @param {object[]} others
 * @param {{ threshold?: number }} [options]
 */
export function snapResized(box, handle, others, options = {}) {
  const threshold = options.threshold ?? 0.008
  const xs = [0, 0.5, 1]
  const ys = [0, 0.5, 1]
  for (const other of others) {
    xs.push(other.x, other.x + other.width / 2, other.x + other.width)
    ys.push(other.y, other.y + other.height / 2, other.y + other.height)
  }
  const nearest = (value, targets) => {
    let best
    for (const target of targets) {
      const delta = target - value
      if (Math.abs(delta) > threshold) continue
      if (best === undefined || Math.abs(delta) < Math.abs(best.delta)) best = { delta, target }
    }
    return best
  }

  let { x, y, width, height } = box
  const guides = []
  if (handle.includes('e')) {
    const snap = nearest(x + width, xs)
    if (snap !== undefined) {
      width = clamp(width + snap.delta, MIN_SIZE, 1 - x)
      guides.push({ axis: 'x', at: snap.target })
    }
  } else if (handle.includes('w')) {
    const snap = nearest(x, xs)
    if (snap !== undefined) {
      const right = x + width
      x = clamp(x + snap.delta, 0, right - MIN_SIZE)
      width = right - x
      guides.push({ axis: 'x', at: snap.target })
    }
  }
  if (handle.includes('s')) {
    const snap = nearest(y + height, ys)
    if (snap !== undefined) {
      height = clamp(height + snap.delta, MIN_SIZE, 1 - y)
      guides.push({ axis: 'y', at: snap.target })
    }
  } else if (handle.includes('n')) {
    const snap = nearest(y, ys)
    if (snap !== undefined) {
      const bottom = y + height
      y = clamp(y + snap.delta, 0, bottom - MIN_SIZE)
      height = bottom - y
      guides.push({ axis: 'y', at: snap.target })
    }
  }
  return { box: { ...box, x, y, width, height }, guides }
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
      // A copy is a box you are about to adjust, so it starts unlocked and
      // visible; inheriting those flags made duplicating a finished box produce
      // a copy that could not be moved.
      locked: false,
      hidden: false,
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

/**
 * What still has to be filled in before this box can be generated.
 *
 * The workflow needs a description for an object box and text for a text box;
 * without one it refuses the whole request. Checking here lets the editor say so
 * while the user is drawing instead of after a failed generation.
 *
 * @param {object} box
 * @returns {'desc'|'text'|undefined}
 */
export function boxProblem(box) {
  if (box === null || typeof box !== 'object') return 'desc'
  if (box.type === 'text') return (box.text ?? '').trim() === '' ? 'text' : undefined
  return (box.desc ?? '').trim() === '' ? 'desc' : undefined
}

/**
 * The first thing that stops this draft from generating, if any.
 *
 * Generating is the expensive step, so the checks belong in front of it: a box
 * with no description or a list past the node's limit is rejected here, where
 * the message can be shown in the user's language.
 *
 * @param {object[]} boxes
 * @param {number} [max]
 * @returns {{ reason: 'desc'|'text'|'count', index?: number } | undefined}
 */
export function boxesProblem(boxes, max = MAX_BOXES) {
  const list = Array.isArray(boxes) ? boxes : []
  const index = list.findIndex((box) => boxProblem(box) !== undefined)
  if (index >= 0) return { reason: boxProblem(list[index]), index }
  if (list.length > max) return { reason: 'count' }
  return undefined
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
  // Below about four characters of width the text wraps one letter per line and
  // reads as a vertical ribbon; the box list is the place to read it instead.
  if (!(widthPx >= 56) || !(heightPx >= 20)) return { show: false, fontSize: 0, lines: 0 }
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
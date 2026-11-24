import React, { useCallback, useEffect, useRef, useState } from 'react'
import { t } from './i18n.js'
import {
  HANDLES,
  MIN_SIZE,
  boxFromCorners,
  frameSize,
  labelMetrics,
  moveBoxes,
  parseRatio,
  resizeByHandle,
  selectionBounds,
  snapBox,
  snapResized,
} from './box-math.js'
import { selectionFill } from './theme.js'

const TALL = 260
const COMPACT = 120
/** Pointer travel, in pixels, below which a drag counts as a click. */
const CLICK_SLOP = 3
/** Marquee mode is the exception, not the default: this is a box annotator. */
const HANDLE_SIZE = 9

const HANDLE_CURSOR = {
  nw: 'nwse-resize',
  n: 'ns-resize',
  ne: 'nesw-resize',
  e: 'ew-resize',
  se: 'nwse-resize',
  s: 'ns-resize',
  sw: 'nesw-resize',
  w: 'ew-resize',
}

const HANDLE_POSITION = {
  nw: { left: 0, top: 0 },
  n: { left: '50%', top: 0 },
  ne: { left: '100%', top: 0 },
  e: { left: '100%', top: '50%' },
  se: { left: '100%', top: '100%' },
  s: { left: '50%', top: '100%' },
  sw: { left: 0, top: '100%' },
  w: { left: 0, top: '50%' },
}

/**
 * The layout canvas.
 *
 * The interaction model follows bounding-box annotators (LabelImg, CVAT) rather
 * than a vector editor, because that is what this surface is for:
 *
 *   drag on empty space   draw a new box
 *   shift + drag          marquee-select the boxes it touches
 *   drag a box            move the whole selection, with edge/centre snapping
 *   drag a handle         resize; the corner handles can keep the aspect ratio
 *   click a box           select it; shift-click toggles it in the selection
 *
 * `selected` accepts an array of indexes (older call sites pass a single index
 * or -1, which is normalised here).
 */
export function BoxCanvas({
  boxes,
  size,
  selected,
  onSelect,
  onChange,
  onCreate,
  compact = false,
  interactive = true,
  budget: budgetProp,
  snap = true,
  lockAspect = false,
}) {
  const wrapRef = useRef(null)
  const areaRef = useRef(null)
  const dragRef = useRef(null)
  const [draft, setDraft] = useState(null)
  // The pointer-up handler must see the latest geometry even if React has not
  // re-rendered yet: a fast drag can release before the state lands.
  const draftRef = useRef(null)
  const [guides, setGuides] = useState([])
  const [available, setAvailable] = useState(0)
  const [marquee, setMarquee] = useState(null)
  const [drawing, setDrawing] = useState(null)
  // Mirrors of the transient shapes, so the window listeners below can stay
  // registered for the whole drag instead of being torn down every frame.
  const drawingRef = useRef(null)
  const marqueeRef = useRef(null)
  const lockAspectRef = useRef(lockAspect)
  lockAspectRef.current = lockAspect

  const selection = Array.isArray(selected)
    ? selected.filter((index) => Number.isInteger(index) && index >= 0 && index < boxes.length)
    : Number.isInteger(selected) && selected >= 0 ? [selected] : []

  useEffect(() => {
    const element = wrapRef.current
    if (element === null || typeof ResizeObserver === 'undefined') return undefined
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) setAvailable(entry.contentRect.width)
    })
    observer.observe(element)
    setAvailable(element.clientWidth)
    return () => observer.disconnect()
  }, [])

  /** Pointer position as a fraction of the frame. */
  const pointOf = useCallback((event) => {
    const area = areaRef.current
    if (area === null) return undefined
    const rect = area.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return undefined
    return {
      x: Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)),
      y: Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height)),
      dx: (event.clientX - rect.left) / rect.width,
      dy: (event.clientY - rect.top) / rect.height,
    }
  }, [])

  useEffect(() => {
    function onMove(event) {
      const drag = dragRef.current
      if (drag === null) return
      const point = pointOf(event)
      if (point === undefined) return

      if (drag.kind === 'draw') {
        const box = boxFromCorners(drag.from.x, drag.from.y, point.x, point.y)
        drawingRef.current = box
        setDrawing(box)
        return
      }
      if (drag.kind === 'marquee') {
        const box = boxFromCorners(drag.from.x, drag.from.y, point.x, point.y)
        marqueeRef.current = box
        setMarquee(box)
        return
      }

      const dx = point.dx - drag.from.dx
      const dy = point.dy - drag.from.dy
      if (drag.kind === 'move') {
        const moved = moveBoxes(drag.boxes, drag.indices, dx, dy)
        if (snap && drag.indices.length === 1) {
          const others = drag.boxes.filter((_, index) => index !== drag.indices[0])
          const result = snapBox(moved[drag.indices[0]], others)
          const next = [...moved]
          next[drag.indices[0]] = result.box
          draftRef.current = next
          setDraft(next)
          setGuides(result.guides)
        } else {
          draftRef.current = moved
          setDraft(moved)
          setGuides([])
        }
        return
      }
      if (drag.kind === 'resize') {
        const locked = event.shiftKey || lockAspectRef.current
        const resized = resizeByHandle(drag.start, drag.handle, dx, dy, { lockAspect: locked })
        const next = [...drag.boxes]
        next[drag.index] = { ...drag.boxes[drag.index], ...resized }
        // A locked resize keeps its ratio, so the box may not be nudged sideways
        // to line up with a neighbour; a free one snaps the edge being dragged.
        if (snap && !locked) {
          const others = drag.boxes.filter((_, index) => index !== drag.index)
          const result = snapResized(next[drag.index], drag.handle, others)
          next[drag.index] = result.box
          setGuides(result.guides)
        } else {
          setGuides([])
        }
        draftRef.current = next
        setDraft(next)
      }
    }

    function onUp(event) {
      const drag = dragRef.current
      dragRef.current = null
      const point = pointOf(event)

      if (drag !== null && drag.kind === 'draw') {
        const box = point === undefined ? drawingRef.current : boxFromCorners(drag.from.x, drag.from.y, point.x, point.y)
        drawingRef.current = null
        setDrawing(null)
        // Below a couple of percent the gesture reads as a click, and a click on
        // empty space clears the selection instead of leaving a speck of a box.
        const tiny = box === null || (box.width <= MIN_SIZE * 1.5 && box.height <= MIN_SIZE * 1.5)
        if (tiny) {
          onSelect([])
          return
        }
        onCreate?.(box)
        return
      }

      if (drag !== null && drag.kind === 'marquee') {
        const region = point === undefined ? marqueeRef.current : boxFromCorners(drag.from.x, drag.from.y, point.x, point.y)
        marqueeRef.current = null
        setMarquee(null)
        if (region !== null) {
          const hits = boxes
            .map((box, index) => ({ box, index }))
            .filter(({ box }) => (
              box.x < region.x + region.width
              && box.x + box.width > region.x
              && box.y < region.y + region.height
              && box.y + box.height > region.y
            ))
            .map(({ index }) => index)
          onSelect(hits)
        }
        return
      }

      const settled = draftRef.current
      if (drag !== null && (drag.kind === 'move' || drag.kind === 'resize') && settled !== null) {
        onChange(settled)
      }
      draftRef.current = null
      setDraft(null)
      setGuides([])
    }

    /** A cancelled pointer (OS gesture, window switch) must not leave a drag open. */
    function onCancel() {
      dragRef.current = null
      draftRef.current = null
      drawingRef.current = null
      marqueeRef.current = null
      setDraft(null)
      setDrawing(null)
      setMarquee(null)
      setGuides([])
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onCancel)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onCancel)
    }
  }, [boxes, onSelect, onChange, onCreate, pointOf, snap])

  function beginDrag(event, kind, payload) {
    event.stopPropagation()
    event.preventDefault()
    const from = pointOf(event)
    if (from === undefined) return
    dragRef.current = { kind, from, ...payload }
  }

  function onBoxPointerDown(event, index) {
    if (!interactive) return
    // Only the primary button drags; a right-click keeps its context menu.
    if (event.button !== undefined && event.button !== 0) return
    const locked = boxes[index]?.locked === true
    const additive = event.shiftKey || event.metaKey || event.ctrlKey
    const nextSelection = additive
      ? (selection.includes(index) ? selection.filter((item) => item !== index) : [...selection, index])
      : (selection.includes(index) ? selection : [index])
    onSelect(nextSelection)
    // A locked box still selects — it just refuses to be moved.
    if (locked || additive) {
      // Neither is the start of a canvas gesture: without this the frame would
      // begin drawing a box underneath the click.
      event.stopPropagation()
      event.preventDefault()
      return
    }
    // Locked companions stay put even when the rest of the group moves.
    const movable = nextSelection.filter((item) => boxes[item]?.locked !== true)
    if (movable.length === 0) {
      event.stopPropagation()
      return
    }
    beginDrag(event, 'move', { boxes, indices: movable })
  }

  function onHandlePointerDown(event, index, handle) {
    if (!interactive) return
    if (boxes[index]?.locked === true) return
    if (event.button !== undefined && event.button !== 0) return
    beginDrag(event, 'resize', { boxes, index, start: boxes[index], handle })
  }

  function onAreaPointerDown(event) {
    if (!interactive) return
    if (event.button !== undefined && event.button !== 0) return
    const marqueeMode = event.shiftKey
    beginDrag(event, marqueeMode ? 'marquee' : 'draw', {})
    if (marqueeMode) {
      marqueeRef.current = { x: 0, y: 0, width: 0, height: 0 }
      setMarquee({ x: 0, y: 0, width: 0, height: 0 })
    }
  }

  const ratio = parseRatio(size)
  const budget = budgetProp ?? (compact ? COMPACT : TALL)
  const frame = frameSize(available, ratio, budget)
  const width = frame?.width
  const height = frame?.height

  const shown = draft ?? boxes
  const bounds = selection.length > 1 ? selectionBounds(shown, selection) : undefined

  const frameStyle = width !== undefined
    ? { width, height, ...(compact ? {} : { maxHeight: budget }) }
    : { width: '100%', aspectRatio: String(ratio), maxHeight: budget }

  const toPercent = (value) => `${value * 100}%`

  return (
    <div ref={wrapRef} style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <div
        ref={areaRef}
        onPointerDown={onAreaPointerDown}
        style={{
          position: 'relative',
          ...frameStyle,
          background: 'var(--dsw-alias-bg-layer-1, rgba(127,127,127,0.10))',
          borderRadius: 8,
          border: '1px solid var(--dsw-alias-border-l2, rgba(127,127,127,0.28))',
          overflow: 'hidden',
          touchAction: 'none',
          flexShrink: 0,
          cursor: interactive ? 'crosshair' : 'inherit',
          // A faint grid gives the eye something to align against while dragging.
          backgroundImage: interactive
            ? 'linear-gradient(to right, rgba(127,127,127,0.14) 1px, transparent 1px), linear-gradient(to bottom, rgba(127,127,127,0.14) 1px, transparent 1px)'
            : undefined,
          backgroundSize: interactive ? '10% 10%' : undefined,
        }}
      >
        {shown.map((box, index) => {
          const active = selection.includes(index)
          const caption = box.type === 'text' && (box.text ?? '').trim() !== '' ? box.text : (box.desc ?? '')
          const metrics = width !== undefined && height !== undefined
            ? labelMetrics(box.width * width, box.height * height)
            : { show: false, fontSize: 0, lines: 0 }
          return (
            <div
              key={index}
              onPointerDown={(event) => onBoxPointerDown(event, index)}
              style={{
                position: 'absolute',
                left: toPercent(box.x),
                top: toPercent(box.y),
                width: toPercent(box.width),
                height: toPercent(box.height),
                border: `${active ? 2 : 1}px ${box.hidden === true ? 'dashed' : 'solid'} ${active
                  ? 'var(--dsw-alias-brand-primary, rgba(120,200,150,0.95))'
                  : box.hidden === true ? 'rgba(190,190,190,0.4)' : 'rgba(190,190,190,0.75)'}`,
                background: box.hidden === true
                  ? 'rgba(120,120,120,0.05)'
                  : active ? selectionFill(16) : 'rgba(160,160,160,0.09)',
                opacity: box.hidden === true ? 0.55 : 1,
                borderRadius: 4,
                cursor: interactive ? 'move' : 'inherit',
                boxSizing: 'border-box',
                minWidth: `${MIN_SIZE * 100}%`,
                minHeight: `${MIN_SIZE * 100}%`,
              }}
            >
              {metrics.show && caption.trim() !== '' ? (
                <span
                  style={{
                    position: 'absolute',
                    top: 15,
                    left: 4,
                    right: 4,
                    bottom: 4,
                    fontSize: metrics.fontSize,
                    lineHeight: 1.35,
                    overflow: 'hidden',
                    color: 'var(--dsw-alias-label-primary, inherit)',
                    opacity: 0.85,
                    pointerEvents: 'none',
                    wordBreak: 'break-word',
                  }}
                >
                  {caption}
                </span>
              ) : null}
              <span
                style={{
                  position: 'absolute',
                  top: 1,
                  left: 1,
                  minWidth: 14,
                  padding: '0 3px',
                  fontSize: 9,
                  lineHeight: '13px',
                  textAlign: 'center',
                  borderRadius: 3,
                  background: active
                    ? 'var(--dsw-alias-brand-primary, rgba(120,200,150,0.95))'
                    : 'rgba(40,42,40,0.85)',
                  color: active ? 'var(--dsw-alias-label-primary-inverted, #0d120f)' : '#ddd',
                  pointerEvents: 'none',
                }}
              >
                {index + 1}
                {box.locked === true ? ' · L' : ''}
              </span>

              {/* Handles belong to the single selected box: a multi-selection is
                  moved as a group and resized from the inspector instead. */}
              {/* A locked box has no handles: it cannot be resized, so showing
                  grips that do nothing would be a lie. */}
              {interactive && active && selection.length === 1 && box.locked !== true ? (
                HANDLES.map((handle) => (
                  <span
                    key={handle}
                    onPointerDown={(event) => onHandlePointerDown(event, index, handle)}
                    role="presentation"
                    style={{
                      position: 'absolute',
                      ...HANDLE_POSITION[handle],
                      width: HANDLE_SIZE,
                      height: HANDLE_SIZE,
                      // Centre every handle on its corner or edge midpoint.
                      marginLeft: -HANDLE_SIZE / 2,
                      marginTop: -HANDLE_SIZE / 2,
                      background: 'var(--dsw-alias-bg-overlay, #fff)',
                      border: '1px solid var(--dsw-alias-brand-primary, rgba(120,200,150,0.95))',
                      borderRadius: 2,
                      cursor: HANDLE_CURSOR[handle],
                      boxSizing: 'border-box',
                    }}
                  />
                ))
              ) : null}
            </div>
          )
        })}

        {bounds !== undefined ? (
          <div
            style={{
              position: 'absolute',
              left: toPercent(bounds.x),
              top: toPercent(bounds.y),
              width: toPercent(bounds.width),
              height: toPercent(bounds.height),
              border: '1px dashed var(--dsw-alias-brand-primary, rgba(120,200,150,0.95))',
              pointerEvents: 'none',
              borderRadius: 2,
            }}
          />
        ) : null}

        {guides.map((guide, index) => (
          <div
            key={`${guide.axis}-${index}`}
            style={{
              position: 'absolute',
              pointerEvents: 'none',
              background: 'var(--dsw-alias-state-business-primary, #2f6fed)',
              ...(guide.axis === 'x'
                ? { left: toPercent(guide.at), top: 0, bottom: 0, width: 1 }
                : { top: toPercent(guide.at), left: 0, right: 0, height: 1 }),
            }}
          />
        ))}

        {drawing !== null ? (
          <div
            style={{
              position: 'absolute',
              left: toPercent(drawing.x),
              top: toPercent(drawing.y),
              width: toPercent(drawing.width),
              height: toPercent(drawing.height),
              border: '1px dashed var(--dsw-alias-brand-primary, rgba(120,200,150,0.95))',
              background: selectionFill(10),
              pointerEvents: 'none',
              borderRadius: 2,
            }}
          />
        ) : null}

        {marquee !== null ? (
          <div
            style={{
              position: 'absolute',
              left: toPercent(marquee.x),
              top: toPercent(marquee.y),
              width: toPercent(marquee.width),
              height: toPercent(marquee.height),
              border: '1px solid var(--dsw-alias-state-business-primary, #2f6fed)',
              background: 'rgba(47,111,237,0.12)',
              pointerEvents: 'none',
            }}
          />
        ) : null}

        {boxes.length === 0 && !interactive ? (
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: 12, opacity: 0.55 }}>
            {t('preview.empty')}
          </div>
        ) : null}

        {interactive && boxes.length === 0 && drawing === null ? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              placeItems: 'center',
              fontSize: 11,
              opacity: 0.5,
              pointerEvents: 'none',
              padding: 12,
              textAlign: 'center',
              lineHeight: 1.6,
            }}
          >
            {t('editor.drawHint')}
          </div>
        ) : null}
      </div>
    </div>
  )
}

import React, { useEffect, useRef, useState } from 'react'
import { MIN_SIZE, frameSize, labelMetrics, moveBox, parseRatio, resizeBox } from './box-math.js'
import { selectionFill } from './theme.js'

const TALL = 260
const COMPACT = 120

/**
 * The layout canvas: drag a box to move it, drag its lower-right corner to
 * resize. The frame always keeps the output's aspect ratio, sized to fit the
 * available width without exceeding the height budget, so a 2:3 poster never
 * renders as a wide letterbox.
 */
export function BoxCanvas({ boxes, size, selected, onSelect, onChange, compact = false, interactive = true, budget: budgetProp }) {
  const wrapRef = useRef(null)
  const areaRef = useRef(null)
  const dragRef = useRef(null)
  const [draft, setDraft] = useState(null)
  const [available, setAvailable] = useState(0)

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

  useEffect(() => {
    function onMove(event) {
      const drag = dragRef.current
      const area = areaRef.current
      if (drag === null || area === null) return
      const rect = area.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      const dx = (event.clientX - drag.startX) / rect.width
      const dy = (event.clientY - drag.startY) / rect.height
      setDraft(drag.mode === 'move' ? moveBox(drag.box, dx, dy) : resizeBox(drag.box, dx, dy))
    }
    function onUp() {
      const drag = dragRef.current
      dragRef.current = null
      if (drag !== null && draft !== null) {
        const next = [...boxes]
        next[drag.index] = draft
        onChange(next)
      }
      setDraft(null)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [boxes, draft, onChange])

  function startDrag(event, index, mode) {
    event.stopPropagation()
    event.preventDefault()
    onSelect(index)
    dragRef.current = { index, mode, box: boxes[index], startX: event.clientX, startY: event.clientY }
    setDraft(boxes[index])
  }

  const ratio = parseRatio(size)
  const budget = budgetProp ?? (compact ? COMPACT : TALL)
  const frame = frameSize(available, ratio, budget)
  const width = frame?.width
  const height = frame?.height

  const shown = draft === null ? boxes : boxes.map((box, index) => (index === dragRef.current?.index ? draft : box))

  const frameStyle = width !== undefined
    ? { width, height, ...(compact ? {} : { maxHeight: budget }) }
    : { width: '100%', aspectRatio: String(ratio), maxHeight: budget }

  return (
    <div ref={wrapRef} style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <div
        ref={areaRef}
        onClick={() => onSelect(-1)}
        style={{
          position: 'relative',
          ...frameStyle,
          background: 'var(--dsw-alias-bg-layer-1, rgba(127,127,127,0.10))',
          borderRadius: 8,
          border: '1px solid var(--dsw-alias-border-l2, rgba(127,127,127,0.28))',
          overflow: 'hidden',
          touchAction: 'none',
          flexShrink: 0,
        }}
      >
        {shown.map((box, index) => {
          const active = index === selected
          const caption = box.type === 'text' && (box.text ?? '').trim() !== '' ? box.text : (box.desc ?? '')
          const metrics = width !== undefined && height !== undefined
            ? labelMetrics(box.width * width, box.height * height)
            : { show: false, fontSize: 0, lines: 0 }
          return (
            <div
              key={index}
              onPointerDown={interactive ? (event) => startDrag(event, index, 'move') : undefined}
              // Inside the editor the frame's onClick clears the selection, so a click
              // on a box must not bubble or selecting would immediately undo itself.
              // In the preview there is no selection to protect: the click has to
              // reach the wrapper that opens the layout editor.
              onClick={interactive ? (event) => event.stopPropagation() : undefined}
              style={{
                position: 'absolute',
                left: `${box.x * 100}%`,
                top: `${box.y * 100}%`,
                width: `${box.width * 100}%`,
                height: `${box.height * 100}%`,
                border: `${active ? 2 : 1}px solid ${active
                  ? 'var(--dsw-alias-brand-primary, rgba(120,200,150,0.95))'
                  : 'rgba(190,190,190,0.75)'}`,
                background: active
                  ? selectionFill(16)
                  : 'rgba(160,160,160,0.09)',
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
                    color: '#f4f4f4',
                    background: 'rgba(0,0,0,0.42)',
                    borderRadius: 3,
                    padding: '1px 3px',
                    textShadow: '0 1px 2px rgba(0,0,0,0.75)',
                    overflow: 'hidden',
                    overflowWrap: 'anywhere',
                    wordBreak: 'break-word',
                    whiteSpace: 'normal',
                    display: '-webkit-box',
                    WebkitLineClamp: metrics.lines,
                    WebkitBoxOrient: 'vertical',
                    pointerEvents: 'none',
                    userSelect: 'none',
                  }}
                >
                  {caption}
                </span>
              ) : null}
              <span
                style={{
                  position: 'absolute',
                  top: -1,
                  left: -1,
                  padding: '0 4px',
                  fontSize: 10,
                  lineHeight: '14px',
                  borderRadius: '3px 0 3px 0',
                  background: active ? 'var(--dsw-alias-brand-primary, rgba(120,200,150,0.95))' : 'rgba(190,190,190,0.8)',
                  color: '#101010',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {index + 1}
                {box.type === 'text' ? 'T' : ''}
              </span>
              {interactive ? (
                <span
                  onPointerDown={(event) => startDrag(event, index, 'resize')}
                  style={{
                    position: 'absolute',
                    right: -4,
                    bottom: -4,
                    width: 12,
                    height: 12,
                    borderRadius: 3,
                    background: active ? 'var(--dsw-alias-brand-primary, rgba(120,200,150,0.95))' : 'rgba(190,190,190,0.85)',
                    cursor: 'nwse-resize',
                  }}
                />
              ) : null}
            </div>
          )
        })}
        {boxes.length === 0 ? (
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: 12, opacity: 0.55 }}>
            无框：整幅自由构图
          </div>
        ) : null}
      </div>
    </div>
  )
}
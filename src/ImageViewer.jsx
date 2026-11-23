import React, { useCallback, useEffect, useRef, useState } from 'react'
import { t } from './i18n.js'
import { createPortal } from 'react-dom'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import { imageUrl } from './api.js'
import { Icon } from './icons.jsx'

const chrome = {
  color: 'rgba(255,255,255,0.92)',
  background: 'rgba(255,255,255,0.12)',
  border: '1px solid rgba(255,255,255,0.22)',
  borderRadius: 6,
  padding: '3px 10px',
  fontSize: 12,
  cursor: 'pointer',
}
const chromeIcon = {
  ...chrome,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 28,
  height: 28,
  padding: 0,
}

/**
 * Image viewer as a large dialog, not a full-window overlay.
 *
 * Full-window looked like the app itself had changed chrome: the desktop shell's
 * own close button in the title bar stayed visible above it and read as this
 * viewer's control. A centered card keeps that button visually separate.
 *
 * Rendered through a portal on `document.body`: the panel lives inside columns
 * with their own stacking and overflow, where `position: fixed` may resolve
 * against an ancestor instead of the viewport.
 */
export function ImageViewer({ recordId, onClose, onNavigate, prevId, nextId }) {
  const [scale, setScale] = useState(1)
  /** The library exposes zoom commands on the wrapper instance, so the toolbar
      can live outside its render prop. */
  const zoomRef = useRef(null)
  const zoomBy = (method) => {
    const api = zoomRef.current
    if (api !== null && api !== undefined && typeof api[method] === 'function') api[method](0.2)
  }
  const fit = () => {
    const api = zoomRef.current
    if (api !== null && api !== undefined && typeof api.resetTransform === 'function') api.resetTransform()
  }

  useEffect(() => {
    function onKey(event) {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft' && prevId !== null && prevId !== undefined) onNavigate?.(prevId)
      if (event.key === 'ArrowRight' && nextId !== null && nextId !== undefined) onNavigate?.(nextId)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onNavigate, prevId, nextId])

  const onTransformed = useCallback((ref) => {
    const next = ref?.state?.scale
    if (typeof next === 'number') setScale(next)
  }, [])

  const node = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('查看生成结果')}
      onMouseDown={(event) => event.stopPropagation()}
      onClick={(event) => {
        event.stopPropagation()
        if (event.target === event.currentTarget) onClose()
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2147483000,
        background: 'rgba(0,0,0,0.62)',
        display: 'grid',
        placeItems: 'center',
        padding: '4vh 4vw',
        isolation: 'isolate',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: 'min(92vw, 1280px)',
          height: 'min(86vh, 900px)',
          background: '#0b0d0c',
          border: '1px solid rgba(255,255,255,0.14)',
          borderRadius: 12,
          boxShadow: '0 24px 72px rgba(0,0,0,0.55)',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: '#0b0d0c' }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>{recordId}</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>{Math.round(scale * 100)}%</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            滚轮缩放 · 拖动平移 · 双击切换 · Esc 关闭
          </span>
          <span style={{ flex: 1 }} />
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            <button
              type="button"
              style={{ ...chromeIcon, opacity: prevId === null || prevId === undefined ? 0.4 : 1 }}
              title={t('上一张（较新）')}
              aria-label={t('上一张')}
              disabled={prevId === null || prevId === undefined}
              onClick={() => onNavigate?.(prevId)}
            >
              <Icon name="keyboard_arrow_left" size={18} />
            </button>
            <button
              type="button"
              style={{ ...chromeIcon, opacity: nextId === null || nextId === undefined ? 0.4 : 1 }}
              title={t('下一张（较旧）')}
              aria-label={t('下一张')}
              disabled={nextId === null || nextId === undefined}
              onClick={() => onNavigate?.(nextId)}
            >
              <Icon name="keyboard_arrow_right" size={18} />
            </button>
          </div>
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            <button type="button" style={chromeIcon} title={t('缩小')} aria-label={t('缩小')} onClick={() => zoomBy('zoomOut')}>
              <Icon name="zoom_out" size={18} />
            </button>
            <button type="button" style={chromeIcon} title={t('放大')} aria-label={t('放大')} onClick={() => zoomBy('zoomIn')}>
              <Icon name="zoom_in" size={18} />
            </button>
            <button type="button" style={chromeIcon} title={t('适应窗口')} aria-label={t('适应窗口')} onClick={fit}>
              <Icon name="fit_screen" size={18} />
            </button>
            <button type="button" style={chromeIcon} title={t('关闭')} aria-label={t('关闭')} onClick={onClose}>
              <Icon name="close" size={18} />
            </button>
          </div>
        </div>

        <TransformWrapper
          minScale={0.5}
          maxScale={8}
          initialScale={1}
          fitOnInit
          centerOnInit
          limitToBounds={false}
          // With `smooth` on (default) the per-event step is multiplied by |deltaY|,
          // so this reads as "about 8% per wheel notch" instead of a jump.
          wheel={{ step: 0.0008 }}
          zoomAnimation={{ size: 0.2 }}
          doubleClick={{ mode: 'toggle', step: 0.7 }}
          panning={{ velocityDisabled: true }}
          onTransformed={onTransformed}
          ref={zoomRef}
        >
          {() => (
            <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
              <TransformComponent
                wrapperStyle={{ width: '100%', height: '100%' }}
                contentStyle={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <img
                  src={imageUrl(recordId)}
                  alt={t('放大查看')}
                  draggable={false}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', userSelect: 'none' }}
                />
              </TransformComponent>
            </div>
          )}
        </TransformWrapper>
      </div>
    </div>
  )

  if (typeof document === 'undefined') return node
  return createPortal(node, document.body)
}
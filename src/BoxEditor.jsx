import React, { useEffect, useId, useMemo, useRef, useState } from 'react'
import { t } from './i18n.js'
import { BoxCanvas } from './BoxCanvas.jsx'
import { Icon } from './icons.jsx'
import { IconCheckbox } from './IconCheckbox.jsx'
import { moveBox, updateBoxGeometry } from './box-math.js'
import { ScopeStyles } from './ScopeStyles.jsx'
import { useDialogFocus } from './useDialogFocus.js'
import { selectionFill } from './theme.js'

const row = { display: 'flex', alignItems: 'center', gap: 6 }
const dim = { color: 'var(--dsw-alias-label-secondary, inherit)' }
const label = { fontSize: 11, opacity: 0.68, minWidth: 44 }
const input = {
  flex: 1,
  minWidth: 0,
  boxSizing: 'border-box',
  padding: '4px 6px',
  fontSize: 12,
  color: 'inherit',
  background: 'var(--dsw-alias-bg-layer-1, rgba(127,127,127,0.10))',
  border: '1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.22))',
  borderRadius: 6,
  fontFamily: 'inherit',
}
const button = {
  padding: '4px 10px',
  fontSize: 12,
  color: 'inherit',
  background: 'var(--dsw-alias-bg-layer-2, rgba(127,127,127,0.14))',
  border: '1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.22))',
  borderRadius: 6,
  cursor: 'pointer',
}
const iconButton = { ...button, padding: '2px 8px', fontSize: 11 }
const iconOnly = {
  ...button,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 26,
  height: 26,
  padding: 0,
}
const iconDanger = { ...iconOnly, color: 'var(--dsw-alias-state-error-primary, #ff8f7a)' }
const optionStyle = { background: 'var(--dsw-alias-bg-overlay, #26282a)', color: 'var(--dsw-alias-label-primary, inherit)' }

function toSet(value) {
  return new Set((String(value ?? '').match(/\d+/g) ?? []).map(Number))
}

/**
 * The layout editor is a modal because the panel is too narrow to place boxes
 * comfortably. The panel keeps a read-only preview; every edit happens here and
 * writes back through the same debounced draft save.
 */
export function BoxEditor({ params, selected, onSelect, onChange, onAdd, onRemove, onToggleCharacter, onClose, onCancel }) {
  const boxes = params.boxes ?? []
  const [size] = useState(() => params.size)
  const characters = useMemo(() => toSet(params.characterBoxes), [params.characterBoxes])
  const budget = typeof window === 'undefined' ? 520 : Math.min(560, Math.max(260, Math.round(window.innerHeight * 0.58)))

  useEffect(() => {
    function onKey(event) {
      if (event.key === 'Escape') onCancel?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel])

  // Arrow keys nudge the selected box; Shift makes the step ten times larger.
  useEffect(() => {
    if (selected === undefined || selected < 0) return undefined
    function onKey(event) {
      const delta = event.shiftKey ? 0.1 : 0.01
      const moves = {
        ArrowLeft: [-delta, 0],
        ArrowRight: [delta, 0],
        ArrowUp: [0, -delta],
        ArrowDown: [0, delta],
      }
      const move = moves[event.key]
      if (move === undefined) return undefined
      const tag = event.target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return undefined
      const box = (params.boxes ?? [])[selected]
      if (box === undefined) return undefined
      event.preventDefault()
      onChange((params.boxes ?? []).map((item, position) => (position === selected ? moveBox(box, move[0], move[1]) : item)))
      return undefined
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected, params.boxes, onChange])

  const updateBox = (index, patch) => {
    onChange(boxes.map((box, position) => (position === index ? { ...box, ...patch } : box)))
  }

  const titleId = useId()
  const cardRef = useRef(null)
  useDialogFocus(cardRef)

  return (
    <div
      className="moss-studio"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 70,
        background: 'rgba(0,0,0,0.62)',
        display: 'grid',
        placeItems: 'center',
        padding: 24,
      }}
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}
    >
      <ScopeStyles />
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: 'min(92vw, 1040px)',
          height: 'min(88vh, 760px)',
          background: 'var(--dsw-alias-bg-overlay, Canvas)',
          color: 'var(--dsw-alias-label-primary, CanvasText)',
          border: '1px solid var(--dsw-alias-border-l2, rgba(127,127,127,0.28))',
          borderRadius: 12,
          boxShadow: '0 24px 64px rgba(0,0,0,0.45)',
          overflow: 'hidden',
          fontSize: 12,
        }}
      >
        <div style={{ ...row, justifyContent: 'space-between', padding: '8px 12px', borderBottom: '1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.22))' }}>
          <span id={titleId} style={{ fontSize: 13 }}>{t('editor.title', { count: boxes.length, size })}</span>
          <div style={{ ...row }}>
            <button type="button" style={iconOnly} title={t('editor.addBoxTitle')} aria-label={t('editor.addBox')} onClick={onAdd}>
              <Icon name="add_box" />
            </button>
            <button type="button" style={iconOnly} title={t('action.done')} aria-label={t('action.done')} onClick={onClose}>
              <Icon name="check" />
            </button>
            <button type="button" style={iconOnly} onClick={onCancel} aria-label={t('action.cancel')} title={t('editor.cancelTitle')}>
              <Icon name="close" />
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12, background: 'var(--dsw-alias-bg-layer-1, rgba(127,127,127,0.10))' }}>
            <BoxCanvas
              boxes={boxes}
              size={size}
              budget={budget}
              selected={selected}
              onSelect={onSelect}
              onChange={onChange}
            />
          </div>

          <div style={{ width: 300, flexShrink: 0, borderLeft: '1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.22))', overflowY: 'auto', padding: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {boxes.length === 0 ? (
              <div style={{ ...dim, padding: 8, lineHeight: 1.6 }}>
                {t('editor.empty')}
              </div>
            ) : null}
            {boxes.map((box, index) => (
              <div
                key={index}
                onClick={() => onSelect(index)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  padding: 6,
                  borderRadius: 8,
                  cursor: 'pointer',
                  background: index === selected
                    ? selectionFill(14)
                    : 'transparent',
                  border: `1px solid ${index === selected ? 'var(--dsw-alias-brand-primary, rgba(120,190,145,0.92))' : 'var(--dsw-alias-border-l1, rgba(127,127,127,0.22))'}`,
                }}
              >
                <div style={{ ...row }}>
                  <span style={{ width: 16, ...dim }}>{index + 1}</span>
                  <select
                    value={box.type ?? 'obj'}
                    onChange={(event) => updateBox(index, { type: event.target.value })}
                    style={{ ...input, flex: '0 0 64px', padding: '2px 2px' }}
                  >
                    <option value="obj" style={optionStyle}>obj</option>
                    <option value="text" style={optionStyle}>text</option>
                  </select>
                  {box.type === 'text' ? null : (
                    <IconCheckbox
                      checked={characters.has(index + 1)}
                      onChange={() => onToggleCharacter(index)}
                      label={t('editor.kindPerson')}
                    />
                  )}
                  <span style={{ flex: 1 }} />
                  <button
                    type="button"
                    style={iconDanger}
                    title={t('editor.deleteBoxTitle')}
                    aria-label={t('editor.deleteBox')}
                    onClick={(event) => { event.stopPropagation(); onRemove(index) }}
                  >
                    <Icon name="delete" />
                  </button>
                </div>
                {box.type === 'text' ? (
                  <label style={row}>
                    <span style={{ ...label, minWidth: 28 }}>{t('editor.kindText')}</span>
                    <input
                      value={box.text ?? ''}
                      onChange={(event) => updateBox(index, { text: event.target.value })}
                      placeholder={t('editor.kindTextHint')}
                      style={input}
                    />
                  </label>
                ) : null}
                <textarea
                  value={box.desc ?? ''}
                  onChange={(event) => updateBox(index, { desc: event.target.value })}
                  placeholder={t('editor.descPlaceholder')}
                  rows={3}
                  style={{ ...input, width: '100%', resize: 'vertical', lineHeight: 1.45 }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 4 }}>
                  {[
                    ['X', 'x', box.x],
                    ['Y', 'y', box.y],
                    [t('editor.widthShort'), 'width', box.width],
                    [t('editor.heightShort'), 'height', box.height],
                  ].map(([label, key, value]) => (
                    <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0, fontSize: 10, ...dim }}>
                      <span style={{ flexShrink: 0 }}>{label}</span>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step={1}
                        value={Math.round(value * 100)}
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) => {
                          const percent = Number(event.target.value)
                          if (!Number.isFinite(percent)) return
                          updateBox(index, updateBoxGeometry(box, { [key]: percent / 100 }))
                        }}
                        style={{ ...input, width: '100%', minWidth: 0, padding: '1px 3px', fontSize: 11, textAlign: 'right' }}
                      />
                      <span style={{ flexShrink: 0 }}>%</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
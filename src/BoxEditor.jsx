import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { t } from './i18n.js'
import { BoxCanvas } from './BoxCanvas.jsx'
import { Icon } from './icons.jsx'
import { IconCheckbox } from './IconCheckbox.jsx'
import {
  HANDLES,
  MIN_SIZE,
  alignBoxes,
  clamp,
  distributeBoxes,
  duplicateBoxes,
  moveBoxes,
  updateBoxGeometry,
} from './box-math.js'
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
const disabledLook = { opacity: 0.4, cursor: 'default' }
const optionStyle = { background: 'var(--dsw-alias-bg-overlay, #26282a)', color: 'var(--dsw-alias-label-primary, inherit)' }
const numberInput = { ...input, flex: '0 0 auto', width: 56, textAlign: 'right', padding: '3px 5px' }
const HANDLE_HISTORY = 60
/** Typing edits within this window fold into one undo step. */
const COALESCE_MS = 500

function toSet(value) {
  return new Set((String(value ?? '').match(/\d+/g) ?? []).map(Number))
}

function toText(set) {
  return [...set].sort((a, b) => a - b).join(',')
}

/**
 * The layout editor is a modal because the panel is too narrow to place boxes
 * comfortably. The panel keeps a read-only preview; every edit happens here and
 * writes back through the same debounced draft save.
 *
 * Interaction follows bounding-box annotators: drag on the canvas to draw a box,
 * drag a box to move it, drag a handle to resize, shift-click or shift-drag to
 * select several, and edit them together from the panel on the right.
 *
 * @param {object} props
 * @param {(boxes: object[], characters?: string) => void} props.onApply
 * @param {(geometry?: object) => number} props.onAdd - returns the new index
 */
export function BoxEditor({ params, onApply, onAdd, onClose, onCancel }) {
  const boxes = params.boxes ?? []
  const characters = useMemo(() => toSet(params.characterBoxes), [params.characterBoxes])
  const budget = typeof window === 'undefined' ? 520 : Math.min(560, Math.max(260, Math.round(window.innerHeight * 0.58)))

  const [selection, setSelection] = useState([])
  const [lockAspect, setLockAspect] = useState(false)
  const [history, setHistory] = useState(() => ({ stack: [boxes], index: 0 }))
  const lastCommitRef = useRef(0)

  /** Characters are stored as 1-based positions, so they follow deletions here. */
  const charactersAfter = useCallback((removed) => {
    const set = toSet(params.characterBoxes)
    const kept = new Set()
    for (const value of set) {
      if (removed.has(value - 1)) continue
      let shift = 0
      for (const index of removed) if (index < value - 1) shift += 1
      kept.add(value - shift)
    }
    return toText(kept)
  }, [params.characterBoxes])

  const commit = useCallback((nextBoxes, options = {}) => {
    const now = Date.now()
    const coalesce = options.coalesce === true && now - lastCommitRef.current < COALESCE_MS
    lastCommitRef.current = now
    onApply(nextBoxes, options.characters)
    setHistory((current) => {
      const stack = current.stack.slice(0, current.index + 1)
      if (coalesce) stack[stack.length - 1] = nextBoxes
      else stack.push(nextBoxes)
      while (stack.length > HANDLE_HISTORY) stack.shift()
      return { stack, index: stack.length - 1 }
    })
  }, [onApply])

  const undo = useCallback(() => {
    setHistory((current) => {
      if (current.index <= 0) return current
      const index = current.index - 1
      onApply(current.stack[index])
      return { ...current, index }
    })
  }, [onApply])

  const redo = useCallback(() => {
    setHistory((current) => {
      if (current.index >= current.stack.length - 1) return current
      const index = current.index + 1
      onApply(current.stack[index])
      return { ...current, index }
    })
  }, [onApply])

  const selectedBoxes = selection.map((index) => boxes[index]).filter(Boolean)
  const primaryIndex = selection.length > 0 ? selection[selection.length - 1] : -1
  const primary = boxes[primaryIndex]

  useEffect(() => {
    // Drop indexes that no longer exist after a deletion or an undo.
    setSelection((current) => current.filter((index) => index < boxes.length))
  }, [boxes.length])

  const remove = useCallback((indices) => {
    const removed = new Set(indices)
    if (removed.size === 0) return
    const next = boxes.filter((_, index) => !removed.has(index))
    commit(next, { characters: charactersAfter(removed) })
    setSelection([])
  }, [boxes, charactersAfter, commit])

  const duplicate = useCallback(() => {
    if (selection.length === 0) return
    const result = duplicateBoxes(boxes, selection)
    commit(result.boxes)
    setSelection(result.added)
  }, [boxes, commit, selection])

  const selectAll = useCallback(() => setSelection(boxes.map((_, index) => index)), [boxes])

  const addAt = useCallback(() => {
    const index = onAdd?.()
    if (typeof index === 'number' && index >= 0) setSelection([index])
  }, [onAdd])

  const createAt = useCallback((geometry) => {
    const index = onAdd?.(geometry)
    if (typeof index === 'number' && index >= 0) setSelection([index])
  }, [onAdd])

  const nudge = useCallback((dx, dy) => {
    if (selection.length === 0) return
    commit(moveBoxes(boxes, selection, dx, dy), { coalesce: true })
  }, [boxes, commit, selection])

  const move = useCallback((mode) => {
    if (selection.length === 0) return
    commit(alignBoxes(boxes, selection, mode))
  }, [boxes, commit, selection])

  const spread = useCallback((axis) => {
    if (selection.length < 3) return
    commit(distributeBoxes(boxes, selection, axis))
  }, [boxes, commit, selection])

  const patchBox = useCallback((index, patch, coalesce = false) => {
    const next = boxes.map((box, position) => (
      position === index ? updateBoxGeometry(box, patch) : box
    ))
    commit(next, { coalesce })
  }, [boxes, commit])

  const toggleCharacter = useCallback((index) => {
    const set = toSet(params.characterBoxes)
    if (set.has(index + 1)) set.delete(index + 1)
    else set.add(index + 1)
    onApply(boxes, toText(set))
  }, [boxes, onApply, params.characterBoxes])

  const cycle = useCallback((direction) => {
    if (boxes.length === 0) return
    const current = primaryIndex
    const next = current < 0
      ? (direction > 0 ? 0 : boxes.length - 1)
      : (current + direction + boxes.length) % boxes.length
    setSelection([next])
  }, [boxes.length, primaryIndex])

  useEffect(() => {
    function onKey(event) {
      const target = event.target
      const tag = target?.tagName
      const typing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target?.isContentEditable === true
      const mod = event.ctrlKey || event.metaKey
      const key = event.key

      if (key === 'Escape') {
        if (selection.length > 0) {
          event.preventDefault()
          setSelection([])
        } else {
          onCancel?.()
        }
        return
      }
      if (mod && (key === 'z' || key === 'Z')) {
        event.preventDefault()
        if (event.shiftKey) redo()
        else undo()
        return
      }
      if (mod && (key === 'y' || key === 'Y')) {
        event.preventDefault()
        redo()
        return
      }
      if (mod && (key === 'a' || key === 'A') && !typing) {
        event.preventDefault()
        selectAll()
        return
      }
      if (mod && (key === 'd' || key === 'D')) {
        event.preventDefault()
        duplicate()
        return
      }
      if ((key === 'Delete' || key === 'Backspace') && !typing) {
        event.preventDefault()
        remove(selection)
        return
      }
      if (key === 'Tab' && !typing) {
        event.preventDefault()
        cycle(event.shiftKey ? -1 : 1)
        return
      }
      if (typing) return
      const step = event.shiftKey ? 0.1 : 0.01
      const moves = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }
      const delta = moves[key]
      if (delta === undefined) return
      event.preventDefault()
      nudge(delta[0], delta[1])
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [cycle, duplicate, nudge, onCancel, redo, remove, selectAll, selection, undo])

  const titleId = useId()
  const cardRef = useRef(null)
  useDialogFocus(cardRef)

  const canUndo = history.index > 0
  const canRedo = history.index < history.stack.length - 1

  const alignButtons = [
    ['left', 'editor.alignLeft', 'align_horizontal_left'],
    ['centerX', 'editor.alignCenter', 'align_horizontal_center'],
    ['right', 'editor.alignRight', 'align_horizontal_right'],
    ['top', 'editor.alignTop', 'align_vertical_top'],
    ['middleY', 'editor.alignMiddle', 'align_vertical_center'],
    ['bottom', 'editor.alignBottom', 'align_vertical_bottom'],
  ]

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
          <span id={titleId} style={{ fontSize: 13 }}>{t('editor.title', { count: boxes.length, size: params.size })}</span>
          <div style={{ ...row }}>
            <button type="button" style={canUndo ? iconOnly : { ...iconOnly, ...disabledLook }} disabled={!canUndo} title={t('editor.undo')} aria-label={t('editor.undo')} onClick={undo}>
              <Icon name="undo" />
            </button>
            <button type="button" style={canRedo ? iconOnly : { ...iconOnly, ...disabledLook }} disabled={!canRedo} title={t('editor.redo')} aria-label={t('editor.redo')} onClick={redo}>
              <Icon name="redo" />
            </button>
            <button type="button" style={iconOnly} title={t('editor.addBoxTitle')} aria-label={t('editor.addBox')} onClick={addAt}>
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
              size={params.size}
              budget={budget}
              selected={selection}
              onSelect={setSelection}
              onChange={(next) => commit(next)}
              onCreate={createAt}
            />
          </div>

          <div style={{ width: 320, flexShrink: 0, borderLeft: '1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.22))', overflowY: 'auto', padding: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {selection.length > 1 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 8, borderRadius: 8, border: '1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.22))', background: 'var(--dsw-alias-bg-layer-1, rgba(127,127,127,0.08))' }}>
                <span style={{ fontSize: 11, ...dim }}>{t('editor.selectionCount', { count: selection.length })}</span>
                <div style={{ ...row, flexWrap: 'wrap', gap: 4 }}>
                  {alignButtons.map(([mode, key, icon]) => (
                    <button key={mode} type="button" style={iconButton} title={t(key)} aria-label={t(key)} onClick={() => move(mode)}>
                      <Icon name={icon} size={14} />
                    </button>
                  ))}
                </div>
                <div style={{ ...row, gap: 4 }}>
                  <button type="button" style={iconButton} title={t('editor.distributeX')} aria-label={t('editor.distributeX')} onClick={() => spread('x')}>
                    <Icon name="distribute_horizontal" size={14} />
                  </button>
                  <button type="button" style={iconButton} title={t('editor.distributeY')} aria-label={t('editor.distributeY')} onClick={() => spread('y')}>
                    <Icon name="distribute_vertical" size={14} />
                  </button>
                  <span style={{ flex: 1 }} />
                  <button type="button" style={iconOnly} title={t('editor.duplicate')} aria-label={t('editor.duplicate')} onClick={duplicate}>
                    <Icon name="content_copy" size={14} />
                  </button>
                  <button type="button" style={iconDanger} title={t('editor.deleteSelected')} aria-label={t('editor.deleteSelected')} onClick={() => remove(selection)}>
                    <Icon name="delete" size={14} />
                  </button>
                </div>
              </div>
            ) : null}

            {primary !== undefined ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 8, borderRadius: 8, border: '1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.22))' }}>
                <div style={{ ...row, justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, ...dim }}>{t('editor.geometry')}</span>
                  <button
                    type="button"
                    style={lockAspect ? { ...iconButton, borderColor: 'var(--dsw-alias-brand-primary, rgba(120,190,145,0.92))' } : iconButton}
                    title={t('editor.lockAspect')}
                    aria-label={t('editor.lockAspect')}
                    aria-pressed={lockAspect}
                    onClick={() => setLockAspect((value) => !value)}
                  >
                    <Icon name="aspect_ratio" size={14} />
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  {[
                    ['x', 'editor.x', primary.x * 100],
                    ['y', 'editor.y', primary.y * 100],
                    ['width', 'editor.width', primary.width * 100],
                    ['height', 'editor.height', primary.height * 100],
                  ].map(([field, key, value]) => (
                    <label key={field} style={{ ...row, gap: 4 }}>
                      <span style={{ ...dim, fontSize: 11, width: 14 }}>{t(key)}</span>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step={1}
                        value={Math.round(value * 10) / 10}
                        aria-label={t(key)}
                        onChange={(event) => {
                          const next = event.target.value === '' ? 0 : Number(event.target.value)
                          if (!Number.isFinite(next)) return
                          if (field === 'width' || field === 'height') {
                            if (lockAspect) {
                              const ratio = primary.width / primary.height
                              const scaled = field === 'width'
                                ? { width: next / 100, height: (next / 100) / ratio }
                                : { height: next / 100, width: (next / 100) * ratio }
                              patchBox(primaryIndex, scaled, true)
                            } else {
                              patchBox(primaryIndex, { [field]: next / 100 }, true)
                            }
                          } else {
                            patchBox(primaryIndex, { [field]: next / 100 }, true)
                          }
                        }}
                        style={numberInput}
                      />
                    </label>
                  ))}
                </div>
                <div style={{ ...row }}>
                  <select
                    value={primary.type ?? 'obj'}
                    onChange={(event) => patchBox(primaryIndex, { type: event.target.value })}
                    style={{ ...input, flex: '0 0 64px', padding: '2px 2px' }}
                    aria-label={t('editor.kind')}
                  >
                    <option value="obj" style={optionStyle}>obj</option>
                    <option value="text" style={optionStyle}>text</option>
                  </select>
                  <IconCheckbox
                    checked={characters.has(primaryIndex + 1)}
                    onChange={() => toggleCharacter(primaryIndex)}
                    label={t('editor.kindPerson')}
                  />
                  <span style={{ flex: 1 }} />
                  <button type="button" style={iconOnly} title={t('editor.duplicate')} aria-label={t('editor.duplicate')} onClick={duplicate}>
                    <Icon name="content_copy" size={14} />
                  </button>
                  <button type="button" style={iconDanger} title={t('editor.deleteBoxTitle')} aria-label={t('editor.deleteBox')} onClick={() => remove([primaryIndex])}>
                    <Icon name="delete" size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ ...dim, fontSize: 11, lineHeight: 1.6, padding: 4 }}>
                {t('editor.drawHint')}
              </div>
            )}

            {boxes.length === 0 ? (
              <div style={{ ...dim, padding: 8, lineHeight: 1.6 }}>
                {t('editor.empty')}
              </div>
            ) : null}

            {boxes.map((box, index) => (
              <div
                key={index}
                onClick={(event) => {
                  if (event.shiftKey || event.metaKey || event.ctrlKey) {
                    setSelection((current) => (
                      current.includes(index) ? current.filter((item) => item !== index) : [...current, index]
                    ))
                  } else {
                    setSelection([index])
                  }
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  padding: 6,
                  borderRadius: 8,
                  cursor: 'pointer',
                  background: selection.includes(index) ? selectionFill(14) : 'transparent',
                  border: `1px solid ${selection.includes(index) ? 'var(--dsw-alias-brand-primary, rgba(120,190,145,0.92))' : 'var(--dsw-alias-border-l1, rgba(127,127,127,0.22))'}`,
                }}
              >
                <div style={{ ...row }}>
                  <span style={{ width: 16, ...dim }}>{index + 1}</span>
                  <span style={{ ...input, flex: 1, padding: '2px 6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', background: 'transparent', border: 'none' }}>
                    {box.type === 'text' ? (box.text ?? t('editor.kindText')) : (box.desc || t('editor.noDesc'))}
                  </span>
                  <span style={{ ...dim, fontSize: 10, whiteSpace: 'nowrap' }}>
                    {Math.round(box.width * 100)}×{Math.round(box.height * 100)}
                  </span>
                </div>
                {selection.includes(index) && selection.length === 1 ? (
                  // A box's description is a sentence or two, so it gets the same
                  // kind of box as the prompt: multi-line, drag the corner taller.
                  <textarea
                    value={box.type === 'text' ? (box.text ?? '') : (box.desc ?? '')}
                    onChange={(event) => patchBox(
                      index,
                      box.type === 'text'
                        ? { text: event.target.value }
                        : { desc: event.target.value },
                      true,
                    )}
                    placeholder={box.type === 'text' ? t('editor.kindTextHint') : t('editor.descPlaceholder')}
                    aria-label={box.type === 'text' ? t('editor.kindTextHint') : t('editor.descPlaceholder')}
                    rows={3}
                    style={{
                      ...input,
                      display: 'block',
                      width: '100%',
                      minHeight: 64,
                      maxHeight: 260,
                      resize: 'vertical',
                      overflowY: 'auto',
                      lineHeight: 1.55,
                      fontFamily: 'inherit',
                    }}
                  />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
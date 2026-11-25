import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { t } from './i18n.js'
import { BoxCanvas } from './BoxCanvas.jsx'
import { Icon } from './icons.jsx'
import { IconCheckbox } from './IconCheckbox.jsx'
import {
  MAX_BOXES,
  alignBoxes,
  aspectSizePatch,
  boxProblem,
  distributeBoxes,
  duplicateBoxes,
  indexAfterReorder,
  moveBoxes,
  reorderLayout,
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
const GEOMETRY_KEYS = new Set(['x', 'y', 'width', 'height'])

/**
 * Hidden boxes stay editable when selected alone, but a multi-selection works on
 * visible boxes only. Locked boxes never change geometry.
 */
function geometryTargets(boxes, selection) {
  return selection.filter((index) => {
    const box = boxes[index]
    if (box === undefined || box.locked === true) return false
    return selection.length === 1 || box.hidden !== true
  })
}
const EMPTY_BOXES = []

function toSet(value) {
  return new Set((String(value ?? '').match(/\d+/g) ?? []).map(Number))
}

function toText(set) {
  return [...set].sort((a, b) => a - b).join(',')
}

/** Strip anything that is not a complete geometry object before it reaches the host. */
function geometryOnly(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return undefined
  const { x, y, width, height } = value
  return [x, y, width, height].every(Number.isFinite) ? { x, y, width, height } : undefined
}

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue)
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stableValue(value[key])]))
  }
  return value
}

/** Compare controlled echoes structurally, ignoring object property order. */
function layoutKey(boxes, characters) {
  return JSON.stringify([stableValue(boxes), characters])
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
 * @param {(geometry?: object) => ({ boxes: object[], index?: number, characters?: string } | void)} props.onAdd
 */
export function BoxEditor({ params, onApply, onAdd, onClose, onCancel }) {
  const boxes = params.boxes ?? EMPTY_BOXES
  const characterBoxes = params.characterBoxes ?? ''
  const characters = useMemo(() => toSet(characterBoxes), [characterBoxes])
  const incomingLayoutKey = layoutKey(boxes, characterBoxes)
  const viewportHeight = typeof window === 'undefined' ? 0 : window.innerHeight
  const budget = Number.isFinite(viewportHeight)
    ? Math.min(560, Math.max(260, Math.round(viewportHeight * 0.58)))
    : 520

  const [selection, setSelection] = useState([])
  const [draggingIndex, setDraggingIndex] = useState(null)
  const [dropTarget, setDropTarget] = useState(null)
  const pointerDragRef = useRef(false)
  const [lockAspect, setLockAspect] = useState(false)
  const [notice, setNotice] = useState('')
  /**
   * Character marks live beside the boxes, not inside them, so a history entry
   * has to carry both. Deleting a box renumbers the marks (see
   * `charactersAfter`); undoing that deletion without restoring the marks left
   * them pointing at whichever box had taken the freed position.
   */
  const charactersRef = useRef(characterBoxes)
  /**
   * The baseline is the last host-owned layout accepted through props. A local
   * apply stays dirty until the controlled host echoes that exact snapshot; the
   * echo must not be mistaken for an external AI/SSE replacement.
   */
  const baselineKeyRef = useRef(incomingLayoutKey)
  const localDirtyRef = useRef(false)
  const pendingLayoutKeyRef = useRef(null)
  const [history, setHistory] = useState(() => ({
    stack: [{ boxes, characters: characterBoxes }],
    index: 0,
  }))
  const lastCommitRef = useRef(0)
  const lastCoalesceKeyRef = useRef(null)

  const resetCoalesce = useCallback(() => {
    lastCommitRef.current = 0
    lastCoalesceKeyRef.current = null
  }, [])

  useEffect(() => {
    // A controlled host normally echoes a local apply immediately. That echo
    // acknowledges the edit; it must not replace the undo stack. A different
    // layout is an external AI/SSE update and becomes the new safe baseline.
    if (localDirtyRef.current && incomingLayoutKey === pendingLayoutKeyRef.current) {
      localDirtyRef.current = false
      pendingLayoutKeyRef.current = null
      baselineKeyRef.current = incomingLayoutKey
      charactersRef.current = characterBoxes
      return
    }
    if (incomingLayoutKey === baselineKeyRef.current) return

    const hadLocalEdits = localDirtyRef.current
    baselineKeyRef.current = incomingLayoutKey
    localDirtyRef.current = false
    pendingLayoutKeyRef.current = null
    charactersRef.current = characterBoxes
    resetCoalesce()
    setSelection([])
    setHistory({ stack: [{ boxes, characters: characterBoxes }], index: 0 })
    if (hadLocalEdits) setNotice(t('notice.draftSyncedFromAi'))
  }, [baselineKeyRef, boxes, characterBoxes, incomingLayoutKey, localDirtyRef, pendingLayoutKeyRef, resetCoalesce])

  const pushHistory = useCallback((snapshot, coalesce) => {
    setHistory((current) => {
      const stack = current.stack.slice(0, current.index + 1)
      // Never coalesce into the baseline entry: that would make the first edit
      // of a session impossible to undo.
      if (coalesce === true && stack.length > 1) stack[stack.length - 1] = snapshot
      else stack.push(snapshot)
      while (stack.length > HANDLE_HISTORY) stack.shift()
      return { stack, index: stack.length - 1 }
    })
  }, [])

  /** Characters are stored as 1-based positions, so they follow deletions here. */
  const charactersAfter = useCallback((removed) => {
    const set = toSet(charactersRef.current)
    const kept = new Set()
    for (const value of set) {
      if (removed.has(value - 1)) continue
      let shift = 0
      for (const index of removed) if (index < value - 1) shift += 1
      kept.add(value - shift)
    }
    return toText(kept)
  }, [])

  const applySnapshot = useCallback((snapshot) => {
    resetCoalesce()
    charactersRef.current = snapshot.characters
    const key = layoutKey(snapshot.boxes, snapshot.characters)
    localDirtyRef.current = key !== baselineKeyRef.current
    pendingLayoutKeyRef.current = localDirtyRef.current ? key : null
    onApply(snapshot.boxes, snapshot.characters)
  }, [onApply, resetCoalesce])

  const commit = useCallback((nextBoxes, options = {}) => {
    const now = Date.now()
    const key = options.coalesceKey
    const eligible = options.coalesce === true && typeof key === 'string' && key !== ''
    const coalesce = eligible && now - lastCommitRef.current < COALESCE_MS && lastCoalesceKeyRef.current === key
    lastCommitRef.current = now
    lastCoalesceKeyRef.current = eligible ? key : null
    const characters = options.characters ?? charactersRef.current
    charactersRef.current = characters
    const layout = layoutKey(nextBoxes, characters)
    localDirtyRef.current = layout !== baselineKeyRef.current
    pendingLayoutKeyRef.current = localDirtyRef.current ? layout : null
    onApply(nextBoxes, characters)
    pushHistory({ boxes: nextBoxes, characters }, coalesce)
  }, [onApply, pushHistory])

  const undo = useCallback(() => {
    const index = history.index - 1
    if (index < 0) return
    applySnapshot(history.stack[index])
    setHistory((current) => ({ ...current, index }))
  }, [applySnapshot, history])

  const redo = useCallback(() => {
    const index = history.index + 1
    if (index >= history.stack.length) return
    applySnapshot(history.stack[index])
    setHistory((current) => ({ ...current, index }))
  }, [applySnapshot, history])

  const primaryIndex = selection.length > 0 ? selection[selection.length - 1] : -1
  const primary = boxes[primaryIndex]
  const allLocked = selection.length > 0 && selection.every((index) => boxes[index]?.locked === true)
  const allHidden = selection.length > 0 && selection.every((index) => boxes[index]?.hidden === true)
  /** Locked boxes keep their place through moves, nudges, alignment and distribution. */
  const movable = geometryTargets(boxes, selection)
  const incomplete = boxes.filter((box) => box.hidden !== true && boxProblem(box) !== undefined).length

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
    const indices = [...new Set(selection.filter((index) => Number.isInteger(index) && index >= 0 && index < boxes.length))]
    if (indices.length === 0) return
    if (boxes.length + indices.length > MAX_BOXES) {
      setNotice(t('editor.limit', { max: MAX_BOXES }))
      return
    }
    setNotice('')
    const result = duplicateBoxes(boxes, indices)
    commit(result.boxes)
    setSelection(result.added)
  }, [boxes, commit, selection])

  const selectAll = useCallback(() => setSelection(boxes.map((_, index) => index)), [boxes])

  const reorder = useCallback((from, to) => {
    if (from === to || !Number.isInteger(from) || !Number.isInteger(to) || from < 0 || to < 0 || from >= boxes.length || to >= boxes.length) return
    const result = reorderLayout(boxes, charactersRef.current, from, to)
    commit(result.boxes, { characters: result.characters })
    setSelection((current) => [...new Set(current.map((index) => indexAfterReorder(index, from, to)))].sort((a, b) => a - b))
    setDraggingIndex(null)
    setDropTarget(null)
  }, [boxes, commit])

  /**
   * Adding a box happens in the panel, which owns the draft, so the new list
   * comes back from `onAdd`. Recording it here is what keeps undo honest: a
   * drawn box used to be invisible to the stack, so the first undo either did
   * nothing or reverted an unrelated earlier edit.
   */
  const record = useCallback((result) => {
    resetCoalesce()
    if (result === undefined || result === null || !Array.isArray(result.boxes)) return
    const characters = result.characters ?? charactersRef.current
    charactersRef.current = characters
    const key = layoutKey(result.boxes, characters)
    localDirtyRef.current = key !== baselineKeyRef.current
    pendingLayoutKeyRef.current = localDirtyRef.current ? key : null
    pushHistory({ boxes: result.boxes, characters }, false)
    if (typeof result.index === 'number' && result.index >= 0) setSelection([result.index])
  }, [pushHistory, resetCoalesce])

  const addAt = useCallback((geometry) => {
    if (boxes.length >= MAX_BOXES) {
      setNotice(t('editor.limit', { max: MAX_BOXES }))
      return
    }
    setNotice('')
    record(onAdd?.(geometryOnly(geometry)))
  }, [boxes.length, onAdd, record])

  const nudge = useCallback((dx, dy) => {
    if (movable.length === 0) return
    const axis = dx === 0 ? 'y' : 'x'
    commit(moveBoxes(boxes, movable, dx, dy), {
      coalesce: true,
      coalesceKey: `nudge:${movable.join(',')}:${axis}`,
    })
  }, [boxes, commit, movable])

  const move = useCallback((mode) => {
    if (movable.length === 0) return
    commit(alignBoxes(boxes, movable, mode))
  }, [boxes, commit, movable])

  const spread = useCallback((axis) => {
    if (movable.length < 3) return
    commit(distributeBoxes(boxes, movable, axis))
  }, [boxes, commit, movable])

  /**
   * Apply a partial box change.
   *
   * `updateBoxGeometry` only clamps the rectangle, so the patch is merged into
   * the box first: passing a `desc` straight to it silently dropped the text,
   * which made the description field look read-only.
   */
  const patchBox = useCallback((index, patch, options = {}) => {
    const current = boxes[index]
    if (current === undefined) return
    const safePatch = current.locked === true
      ? Object.fromEntries(Object.entries(patch).filter(([key]) => !GEOMETRY_KEYS.has(key)))
      : patch
    if (Object.keys(safePatch).length === 0) return
    const next = boxes.map((box, position) => (
      position === index
        ? updateBoxGeometry({ ...box, ...safePatch }, safePatch)
        // Normalise the editing flags so every box carries both explicitly.
        : { ...box, locked: box.locked === true, hidden: box.hidden === true },
    ))
    commit(next, options.coalesceKey === undefined ? options : { ...options, coalesce: true })
  }, [boxes, commit])

  /** Set a flag on every selected box, so the multi-selection controls act on all of them. */
  const setFlagFor = useCallback((key, value) => {
    commit(boxes.map((box, index) => (
      selection.includes(index) ? { ...box, [key]: value } : box
    )))
  }, [boxes, commit, selection])

  const toggleCharacter = useCallback((indices) => {
    const set = toSet(charactersRef.current)
    const list = Array.isArray(indices) ? indices : [indices]
    const allMarked = list.length > 0 && list.every((index) => set.has(index + 1))
    for (const index of list) {
      if (allMarked) set.delete(index + 1)
      else set.add(index + 1)
    }
    commit(boxes, { characters: toText(set) })
  }, [boxes, commit])

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
      const nativeControl = target?.closest?.('button, a[href], input, textarea, select') != null
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
      // While a field has focus its own editing has priority: Ctrl+Z has to undo
      // the typing, not the last box drag, and Ctrl+D must not duplicate boxes
      // from inside a textarea.
      if (typing) return
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
      if (mod && (key === 'a' || key === 'A')) {
        event.preventDefault()
        selectAll()
        return
      }
      if (mod && (key === 'd' || key === 'D')) {
        event.preventDefault()
        duplicate()
        return
      }
      if ((key === 'Delete' || key === 'Backspace') && !nativeControl) {
        event.preventDefault()
        remove(selection)
        return
      }
      // Tab belongs to the dialog's focus trap; boxes are cycled with the
      // bracket keys so keyboard users can still reach the inspector.
      if (key === '[' || key === ']') {
        event.preventDefault()
        cycle(key === ']' ? 1 : -1)
        return
      }
      if (typing || nativeControl) return
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
            <button type="button" style={iconOnly} title={t('editor.addBoxTitle')} aria-label={t('editor.addBox')} onClick={() => addAt()}>
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

        {notice !== '' ? (
          <div style={{ padding: '4px 12px', fontSize: 11, color: 'var(--dsw-alias-state-error-primary, #ff8f7a)', borderBottom: '1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.22))' }}>
            {notice}
          </div>
        ) : null}

        <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12, background: 'var(--dsw-alias-bg-layer-1, rgba(127,127,127,0.10))' }}>
            <BoxCanvas
              boxes={boxes}
              size={params.size}
              budget={budget}
              selected={selection}
              lockAspect={lockAspect}
              onSelect={setSelection}
              onChange={(next) => commit(next)}
              onCreate={addAt}
            />
          </div>

          <div style={{ width: 320, flexShrink: 0, borderLeft: '1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.22))', overflowY: 'auto', padding: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {incomplete > 0 ? (
              <div style={{ fontSize: 11, color: 'var(--dsw-alias-state-error-primary, #ff8f7a)', padding: '2px 4px' }}>
                {t('editor.incomplete', { count: incomplete })}
              </div>
            ) : null}

            {selection.length > 1 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 8, borderRadius: 8, border: '1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.22))', background: 'var(--dsw-alias-bg-layer-1, rgba(127,127,127,0.08))' }}>
                <span style={{ fontSize: 11, ...dim }}>{t('editor.selectionCount', { count: selection.length })}</span>
                <div style={{ ...row, flexWrap: 'wrap', gap: 4 }}>
                  {alignButtons.map(([mode, key, icon]) => (
                    <button key={mode} type="button" disabled={movable.length < 2} style={movable.length < 2 ? { ...iconButton, ...disabledLook } : iconButton} title={t(key)} aria-label={t(key)} onClick={() => move(mode)}>
                      <Icon name={icon} size={14} />
                    </button>
                  ))}
                </div>
                <div style={{ ...row, gap: 4 }}>
                  <button type="button" disabled={movable.length < 3} style={movable.length < 3 ? { ...iconButton, ...disabledLook } : iconButton} title={t('editor.distributeX')} aria-label={t('editor.distributeX')} onClick={() => spread('x')}>
                    <Icon name="distribute_horizontal" size={14} />
                  </button>
                  <button type="button" disabled={movable.length < 3} style={movable.length < 3 ? { ...iconButton, ...disabledLook } : iconButton} title={t('editor.distributeY')} aria-label={t('editor.distributeY')} onClick={() => spread('y')}>
                    <Icon name="distribute_vertical" size={14} />
                  </button>
                  <button
                    type="button"
                    style={allLocked ? iconOnly : { ...iconOnly, opacity: 0.6 }}
                    title={allLocked ? t('editor.unlockSelected') : t('editor.lockSelected')}
                    aria-label={allLocked ? t('editor.unlockSelected') : t('editor.lockSelected')}
                    aria-pressed={allLocked}
                    onClick={() => setFlagFor('locked', !allLocked)}
                  >
                    <Icon name={allLocked ? 'lock' : 'lock_open'} size={14} />
                  </button>
                  <button
                    type="button"
                    style={allHidden ? iconOnly : { ...iconOnly, opacity: 0.6 }}
                    title={allHidden ? t('editor.showSelected') : t('editor.hideSelected')}
                    aria-label={allHidden ? t('editor.showSelected') : t('editor.hideSelected')}
                    aria-pressed={allHidden}
                    onClick={() => setFlagFor('hidden', !allHidden)}
                  >
                    <Icon name={allHidden ? 'visibility_off' : 'visibility'} size={14} />
                  </button>
                  <button
                    type="button"
                    style={iconOnly}
                    title={t('editor.markPeople')}
                    aria-label={t('editor.markPeople')}
                    onClick={() => toggleCharacter(selection)}
                  >
                    <Icon name="person" size={14} />
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
                {primary.locked === true ? <span style={{ fontSize: 11, ...dim }}>{t('editor.lock')}</span> : null}
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
                        disabled={primary.locked === true}
                        value={Math.round(value * 10) / 10}
                        aria-label={t(key)}
                        onChange={(event) => {
                          const next = event.target.value === '' ? 0 : Number(event.target.value)
                          if (!Number.isFinite(next)) return
                          const patch = lockAspect && (field === 'width' || field === 'height')
                            ? aspectSizePatch(primary, field, next / 100)
                            : { [field]: next / 100 }
                          patchBox(primaryIndex, patch, { coalesceKey: `box:${primaryIndex}:${field}` })
                        }}
                        style={primary.locked === true ? { ...numberInput, ...disabledLook } : numberInput}
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
                <div style={{ marginTop: 4 }}>{t('editor.keyboardHint')}</div>
              </div>
            )}

            {boxes.length === 0 ? (
              <div style={{ ...dim, padding: 8, lineHeight: 1.6 }}>
                {t('editor.empty')}
              </div>
            ) : null}

            <div role="list" aria-label={t('editor.boxListLabel')} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {boxes.map((box, index) => (
              <div
                key={index}
                role="listitem"
                tabIndex={0}
                aria-label={t('editor.boxLabel', {
                  index: index + 1,
                  caption: box.type === 'text' ? (box.text ?? t('editor.kindText')) : (box.desc || t('editor.noDesc')),
                  flags: `${box.locked === true ? t('editor.lockedFlag') : ''}${box.hidden === true ? t('editor.hiddenFlag') : ''}`,
                })}
                aria-current={selection.includes(index) ? 'true' : undefined}
                onDragOver={(event) => {
                  if (draggingIndex === null) return
                  event.preventDefault()
                  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move'
                  const rect = event.currentTarget.getBoundingClientRect()
                  const after = event.clientY > rect.top + rect.height / 2
                  setDropTarget({ index, after })
                }}
                onDrop={(event) => {
                  if (draggingIndex === null) return
                  event.preventDefault()
                  const rect = event.currentTarget.getBoundingClientRect()
                  const after = event.clientY > rect.top + rect.height / 2
                  const target = after ? index + 1 : index
                  reorder(draggingIndex, target > draggingIndex ? target - 1 : target)
                }}
                onDragEnd={() => { pointerDragRef.current = false; setDraggingIndex(null); setDropTarget(null) }}
                onFocus={(event) => {
                  if (event.target !== event.currentTarget || pointerDragRef.current) return
                  if (!selection.includes(index)) setSelection([index])
                }}
                onKeyDown={(event) => {
                  if (event.target !== event.currentTarget) return
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    const additive = event.shiftKey || event.metaKey || event.ctrlKey
                    setSelection((current) => additive
                      ? (current.includes(index) ? current.filter((item) => item !== index) : [...current, index])
                      : [index])
                    return
                  }
                  if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return
                  event.preventDefault()
                  event.stopPropagation()
                  if (event.altKey) {
                    reorder(index, index + (event.key === 'ArrowDown' ? 1 : -1))
                    return
                  }
                  const rows = [...event.currentTarget.parentElement.querySelectorAll('[role="listitem"]')]
                  const position = rows.indexOf(event.currentTarget)
                  const next = position + (event.key === 'ArrowDown' ? 1 : -1)
                  if (next >= 0 && next < rows.length) rows[next].focus()
                }}
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
                  opacity: draggingIndex === null || draggingIndex === index ? 1 : 0.55,
                  boxShadow: dropTarget?.index === index
                    ? `inset 0 ${dropTarget.after ? -2 : 2}px 0 var(--dsw-alias-brand-primary, rgba(120,190,145,0.92))`
                    : undefined,
                }}
              >
                <div style={{ ...row }}>
                  <button
                    type="button"
                    draggable
                    tabIndex={0}
                    data-box-index={index}
                    onPointerDown={() => { pointerDragRef.current = true }}
                    onPointerUp={() => { pointerDragRef.current = false }}
                    onPointerCancel={() => { pointerDragRef.current = false }}
                    onBlur={() => { pointerDragRef.current = false }}
                    onFocus={(event) => {
                      if (pointerDragRef.current) event.currentTarget.blur()
                    }}
                    onClick={(event) => event.stopPropagation()}
                    onDragStart={(event) => {
                      if (!event.dataTransfer) return
                      event.dataTransfer.effectAllowed = 'move'
                      event.dataTransfer.setData('text/plain', String(index))
                      setDraggingIndex(index)
                    }}
                    onDragEnd={() => { setDraggingIndex(null); setDropTarget(null) }}
                    onKeyDown={(event) => {
                      if (!event.altKey || (event.key !== 'ArrowUp' && event.key !== 'ArrowDown')) return
                      event.preventDefault()
                      event.stopPropagation()
                      const next = index + (event.key === 'ArrowDown' ? 1 : -1)
                      const list = event.currentTarget.closest('[role="list"]')
                      reorder(index, next)
                      setTimeout(() => {
                        list?.querySelector(`[data-box-index="${next}"]`)?.focus()
                      }, 0)
                    }}
                    title={t('editor.reorder')}
                    aria-label={t('editor.reorder')}
                    style={{ ...iconButton, padding: 2, cursor: 'grab' }}
                  >
                    <Icon name="drag_indicator" size={14} />
                  </button>
                  <span style={{ width: 12, ...dim, opacity: box.hidden ? 0.4 : 1 }}>{index + 1}</span>
                  <span style={{ ...input, flex: 1, padding: '2px 6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', background: 'transparent', border: 'none', opacity: box.hidden ? 0.45 : 1, textDecoration: box.hidden ? 'line-through' : 'none' }}>
                    {box.type === 'text' ? (box.text ?? t('editor.kindText')) : (box.desc || t('editor.noDesc'))}
                  </span>
                  <span
                    title={boxProblem(box) === undefined ? undefined : t(boxProblem(box) === 'text' ? 'editor.needsText' : 'editor.needsDesc')}
                    style={{
                      ...dim,
                      fontSize: 10,
                      whiteSpace: 'nowrap',
                      color: boxProblem(box) === undefined ? undefined : 'var(--dsw-alias-state-error-primary, #ff8f7a)',
                    }}
                  >
                    {boxProblem(box) === undefined ? '' : '! '}
                    {Math.round(box.width * 100)}×{Math.round(box.height * 100)}
                  </span>
                  {/* Locking protects a finished box from accidental drags; hiding
                      keeps it in the draft but leaves it out of the request. */}
                  <button
                    type="button"
                    style={box.locked ? { ...iconButton, padding: 2, color: 'var(--dsw-alias-brand-primary, rgba(120,190,145,0.92))' } : { ...iconButton, padding: 2, opacity: 0.55 }}
                    title={box.locked ? t('editor.unlock') : t('editor.lock')}
                    aria-label={box.locked ? t('editor.unlock') : t('editor.lock')}
                    aria-pressed={box.locked === true}
                    onClick={(event) => {
                      event.stopPropagation()
                      patchBox(index, { locked: box.locked !== true })
                    }}
                  >
                    <Icon name={box.locked ? 'lock' : 'lock_open'} size={13} />
                  </button>
                  <button
                    type="button"
                    style={box.hidden ? { ...iconButton, padding: 2, color: 'var(--dsw-alias-state-error-primary, #ff8f7a)' } : { ...iconButton, padding: 2, opacity: 0.55 }}
                    title={box.hidden ? t('editor.show') : t('editor.hide')}
                    aria-label={box.hidden ? t('editor.show') : t('editor.hide')}
                    aria-pressed={box.hidden === true}
                    onClick={(event) => {
                      event.stopPropagation()
                      patchBox(index, { hidden: box.hidden !== true })
                    }}
                  >
                    <Icon name={box.hidden ? 'visibility_off' : 'visibility'} size={13} />
                  </button>
                </div>
                {selection.includes(index) && selection.length === 1 ? (
                  // A box's description is a sentence or two, so it gets the same
                  // kind of box as the prompt: multi-line, drag the corner taller.
                  <textarea
                    value={box.type === 'text' ? (box.text ?? '') : (box.desc ?? '')}
                    onChange={(event) => {
                      const field = box.type === 'text' ? 'text' : 'desc'
                      patchBox(index, { [field]: event.target.value }, { coalesceKey: `box:${index}:${field}` })
                    }}
                    placeholder={box.type === 'text' ? t('editor.kindTextHint') : t('editor.descPlaceholder')}
                    aria-label={box.type === 'text' ? t('editor.kindTextHint') : t('editor.descPlaceholder')}
                    rows={3}
                    style={{
                      ...input,
                      // `input` carries flex:1, and a flex item ignores the height the
                      // browser's resize grip writes; opt out so dragging works.
                      flex: '0 0 auto',
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
    </div>
  )
}
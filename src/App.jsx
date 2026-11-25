import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { cancelGeneration, deleteRecord, fetchHealth, fetchRecord, fetchRecords, fetchState, generate, imageUrl, patchRecord, putDraft } from './api.js'
import { BoxCanvas } from './BoxCanvas.jsx'
import { BoxEditor } from './BoxEditor.jsx'
import { useVirtualizer } from '@tanstack/react-virtual'
import { FilterChip } from './FilterChip.jsx'
import { currentLocale, t } from './i18n.js'
import { useLocaleRevision } from './useLocale.js'
import { Icon } from './icons.jsx'
import { IconCheckbox } from './IconCheckbox.jsx'
import { ResultPane } from './ResultPane.jsx'
import { ConfirmDialog } from './ConfirmDialog.jsx'
import { SettingsDialog } from './SettingsDialog.jsx'
import { DEFAULT_UI, loadUiPrefs, saveUiPrefs } from './ui-prefs.js'
import { SIZE_PRESETS, formatSize, sizeProblem } from './size.js'
import { MAX_BOXES, boxesProblem, defaultBox } from './box-math.js'
import { gigabytes, usedPercent } from './format.js'
import { ImageViewer } from './ImageViewer.jsx'
import { ScopeStyles } from './ScopeStyles.jsx'
import { selectionFill } from './theme.js'

const POLL_MS = 1500
const PHASE_KEY = { probe: 'phase.probe', submit: 'phase.submit', wait: 'phase.wait', download: 'phase.download' }
const SAVE_DELAY_MS = 500


const panel = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minHeight: 0,
  // Nothing may paint past the panel: on a short viewport the columns inside
  // have to fit, not spill into the host's scroller. Fixed-position dialogs are
  // unaffected by this.
  overflow: 'hidden',
  fontSize: 12,
  color: 'inherit',
}

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
const primary = {
  ...button,
  background: 'var(--dsw-alias-button-primary-fill, rgba(120,190,145,0.92))',
  borderColor: 'var(--dsw-alias-button-primary-fill, rgba(120,190,145,0.92))',
  color: 'var(--dsw-alias-label-primary-inverted, #0d120f)',
  fontWeight: 600,
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
/** The three row actions share one look so they read as a single group. */
const rowAction = {
  ...iconOnly,
  width: 22,
  height: 22,
  background: 'var(--dsw-alias-bg-layer-2, rgba(40,42,40,0.96))',
  boxShadow: '0 1px 4px rgba(0,0,0,0.35)',
}

/** One history entry: thumbnail, prompt summary, metrics, and its own delete button. */
function HistoryRow({ record, active, onSelect, onDelete, onPin, onArchive }) {
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const revealed = hovered || focused
  return (
    <div
      role="group"
      tabIndex={0}
      aria-label={record.prompt === '' ? t('history.untitled') : record.prompt}
      onClick={() => onSelect(record.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect(record.id)
        }
      }}
      style={{
        position: 'relative',
        display: 'flex',
        gap: 8,
        alignItems: 'flex-start',
        width: '100%',
        boxSizing: 'border-box',
        textAlign: 'left',
        padding: 5,
        borderRadius: 6,
        cursor: 'pointer',
        color: 'inherit',
        background: active ? selectionFill(16) : 'transparent',
        border: `1px solid ${active ? 'var(--dsw-alias-brand-primary, rgba(120,190,145,0.9))' : 'var(--dsw-alias-border-l1, rgba(127,127,127,0.18))'}`,
        opacity: record.archived ? 0.55 : 1,
      }}
    >
      <span
        style={{
          width: 38,
          height: 38,
          flexShrink: 0,
          borderRadius: 4,
          overflow: 'hidden',
          background: 'var(--dsw-alias-bg-layer-2, rgba(127,127,127,0.14))',
          display: 'grid',
          placeItems: 'center',
          fontSize: 9,
          ...(record.hasImage ? {} : dim),
        }}
      >
        {record.hasImage ? (
          <img src={imageUrl(record.id)} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : record.status}
      </span>
      <span style={{ minWidth: 0, flex: 1 }}>
        <span style={{ display: 'block', fontSize: 11, lineHeight: 1.35, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {record.prompt === '' ? t('history.noPrompt') : record.prompt}
        </span>
        <span style={{ display: 'block', fontSize: 10, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', ...dim }}>
          {timeOf(record.createdAt)} · {record.size} · {t('history.boxCount', { count: record.boxCount })}
        </span>
        <span style={{ display: 'block', fontSize: 10, ...dim }}>
          {record.status === 'done' ? `${record.seconds}s` : record.status}
        </span>
      </span>
      {/* Overlaid, not laid out: the row keeps its full width for the prompt and
          the buttons only take space while they are actually shown. */}
      <div
        style={{
          position: 'absolute',
          right: 4,
          top: 4,
          display: 'flex',
          gap: 2,
          opacity: revealed ? 1 : 0,
          pointerEvents: revealed ? 'auto' : 'none',
          transition: 'opacity 120ms ease',
        }}
      >
        <button
          type="button"
          style={{ ...rowAction, color: record.pinned ? 'var(--dsw-alias-brand-primary, rgba(120,190,145,0.95))' : 'inherit' }}
          title={record.pinned ? t('action.unpin') : t('action.pin')}
          aria-label={record.pinned ? t('action.unpin') : t('action.pin')}
          onClick={(event) => {
            event.stopPropagation()
            onPin?.(record)
          }}
        >
          {/* A crossed-out pin for the "already pinned" state, so the two states
              are not told apart by colour alone. */}
          <Icon name={record.pinned ? 'keep_off' : 'push_pin'} size={14} />
        </button>
        <button
          type="button"
          style={{ ...rowAction, color: record.archived ? 'var(--dsw-alias-brand-primary, rgba(120,190,145,0.95))' : 'inherit' }}
          title={record.archived ? t('action.unarchive') : t('action.archive')}
          aria-label={record.archived ? t('action.unarchive') : t('action.archive')}
          onClick={(event) => {
            event.stopPropagation()
            onArchive?.(record)
          }}
        >
          <Icon name={record.archived ? 'unarchive' : 'archive'} size={14} />
        </button>
        <button
          type="button"
          disabled={record.status === 'running'}
          style={{ ...rowAction, color: 'var(--dsw-alias-state-error-primary, #ff8f7a)', opacity: record.status === 'running' ? 0.45 : 1 }}
          title={record.status === 'running'
            ? t('history.deleteWhileRunning')
            : t('action.deleteRecordTitle')}
          aria-label={t('action.deleteRecord')}
          onClick={(event) => {
            event.stopPropagation()
            onDelete(record.id)
          }}
        >
          <Icon name="delete" size={14} />
        </button>
      </div>
    </div>
  )
}
const optionStyle = { background: 'var(--dsw-alias-bg-overlay, #26282a)', color: 'var(--dsw-alias-label-primary, inherit)' }


function timeOf(value) {
  if (typeof value !== 'number' || value === 0) return '—'
  const tag = currentLocale()
  return new Date(value).toLocaleTimeString(tag.startsWith('zh') ? 'zh-CN' : tag, { hour: '2-digit', minute: '2-digit' })
}

function toCharacterSet(value) {
  return new Set((String(value ?? '').match(/\d+/g) ?? []).map(Number))
}

function fromCharacterSet(set) {
  return [...set].sort((a, b) => a - b).join(', ')
}

export function StudioPanel({ sessionId = 'global', wide = false }) {
  // One subscription at the root: a language switch re-renders this subtree,
  // which is where every nested dialog renders too.
  useLocaleRevision()

  const [params, setParams] = useState(null)
  const [records, setRecords] = useState([])
  const [activeRecordId, setActiveRecordId] = useState(null)
  const [activeRecord, setActiveRecord] = useState(null)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [busy, setBusy] = useState(false)
  const [generationRecordId, setGenerationRecordId] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const [phase, setPhase] = useState('')
  const [flagLocalOnly, setLocalOnly] = useState(false)
  const [query, setQuery] = useState('')
  const [showArchived, setShowArchived] = useState(false)
  const [comfy, setComfy] = useState(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [queue, setQueue] = useState({ busy: false, sessionId: null })
  const [pinnedRecords, setPinnedRecords] = useState([])
  const [pinnedTruncated, setPinnedTruncated] = useState(false)
  const [matches, setMatches] = useState(null)
  const [older, setOlder] = useState([])
  const [nextBefore, setNextBefore] = useState(undefined)
  const [loadingMore, setLoadingMore] = useState(false)
  const historyRef = useRef(null)
  const [showCanvas, setShowCanvas] = useState(true)
  const [zoom, setZoom] = useState(false)
  const openViewer = useCallback(() => setZoom(true), [])
  const [editorOpen, setEditorOpen] = useState(false)

  // Layout preferences survive a reload: they describe the person, not the draft.
  const initialUiRef = useRef(null)
  if (initialUiRef.current === null) initialUiRef.current = loadUiPrefs()
  const initialUi = initialUiRef.current
  const [resultHeight, setResultHeight] = useState(initialUi.resultHeight)
  const [resultCollapsed, setResultCollapsed] = useState(initialUi.resultCollapsed)
  const [historyWidth, setHistoryWidth] = useState(wide ? initialUi.historyWidth.wide : initialUi.historyWidth.narrow)
  const [historyResizing, setHistoryResizing] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(wide ? initialUi.historyOpen.wide : initialUi.historyOpen.narrow)
  // The prompt box drags to whatever height the text needs, like a chat composer.
  const [promptHeight, setPromptHeight] = useState(initialUi.promptHeight)
  const promptRef = useRef(null)
  const historyResizeRef = useRef(null)
  const [resizing, setResizing] = useState(false)
  const resizeRef = useRef(null)

  const revisionRef = useRef(0)
  // The ref is what requests send; the state is what the strip shows, because a
  // ref write alone does not re-render.
  const [revision, setRevision] = useState(0)
  const dirtyRef = useRef(false)
  const saveTimer = useRef(null)
  /** All fields changed since the last acknowledged save; debouncing must not drop any of them. */
  const pendingPatchRef = useRef({})
  const savingRef = useRef(false)
  const savePromiseRef = useRef(null)
  /** A 409 keeps local edits visible but stops autosave from retrying over the server. */
  const conflictRef = useRef(false)
  const [conflict, setConflict] = useState(false)
  const conflictParamsRef = useRef(null)
  const latestServerRef = useRef(null)
  /** Incremented for every local edit so an older save response cannot clear newer dirt. */
  const localEpochRef = useRef(0)
  const paramsRef = useRef(null)
  /** Parameters as they were when the editor opened, so cancelling can undo the session. */
  const editorSnapshot = useRef(null)
  /** True once the user picks a record by hand: polling then stops following the newest one. */
  const pinnedRef = useRef(false)
  /** Set when an image URL fails, so the pane shows a placeholder instead of a broken icon. */
  const [imageBroken, setImageBroken] = useState(false)

  paramsRef.current = params

  const applyServerState = useCallback((state) => {
    // While the user has unsaved edits, the server revision belongs to a draft
    // we are not showing. Advancing revisionRef here would let the next save
    // overwrite an AI/tool change without a conflict.
    if (!dirtyRef.current) {
      revisionRef.current = state.revision
      paramsRef.current = state.params
      setParams(state.params)
    }
    setRevision(state.revision)
    latestServerRef.current = { revision: state.revision, params: state.params }
    setRecords(state.records)
    setPinnedRecords(state.pinned ?? [])
    setPinnedTruncated(state.pinnedTruncated === true)
    // undefined means the first page has not arrived; null means the list is
    // exhausted. Only an explicit filter reset may move an exhausted cursor.
    setNextBefore((current) => (current === null ? null : state.nextBefore ?? null))
    // Follow the newest finished record unless the user pinned one by clicking it,
    // so a generation started elsewhere (an AI tool call) still shows up here.
    // While the newest record is still running, follow that one to show progress.
    if (!pinnedRef.current) {
      const newest = state.records[0]
      const latestDone = state.records.find((record) => record.hasImage)
      const target = newest?.status === 'running' ? newest.id : latestDone?.id ?? null
      setActiveRecordId((current) => (current === target ? current : target))
    }
  }, [])

  const refresh = useCallback(async () => {
    try {
      const state = await fetchState(sessionId, 40, showArchived)
      applyServerState(state)
      setError('')
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : String(problem))
    }
  }, [sessionId, applyServerState, showArchived])

  useEffect(() => { void refresh() }, [refresh])

  /**
   * ComfyUI reachability for the status strip.
   *
   * Exposed as a callback as well as a timer: the status pill is itself the
   * "check now" control, which is where people look when it says offline.
   */
  const checkHealth = useCallback(async () => {
    try {
      const health = await fetchHealth()
      setComfy(health.comfy ?? { ok: false })
      setQueue({ busy: health.busy === true, sessionId: health.busySession ?? null })
    } catch {
      setComfy({ ok: false })
    }
  }, [])

  useEffect(() => {
    void checkHealth()
    const timer = setInterval(() => { void checkHealth() }, 5000)
    return () => clearInterval(timer)
  }, [checkHealth])

  /**
   * Live updates: the host streams every draft/record change over SSE. Polling
   * stays as the fallback — older clients, a closed stream, or a proxy that
   * buffers event streams all degrade to the 1.5 second cadence.
   */
  const [pushed, setPushed] = useState(() => typeof EventSource === 'function')
  useEffect(() => {
    if (!pushed) {
      const timer = setInterval(() => { void refresh() }, POLL_MS)
      return () => clearInterval(timer)
    }
    let source
    let pending
    let retry
    let disposed = false
    let failures = 0
    const open = () => {
      if (disposed) return
      try {
        source = new EventSource(`/plugins/dsh-moss-studio/events?sessionId=${encodeURIComponent(sessionId)}`)
      } catch {
        setPushed(false)
        return
      }
      source.onopen = () => { failures = 0 }
      source.onmessage = (event) => {
        let payload = null
        try {
          payload = JSON.parse(event.data)
        } catch { /* a heartbeat or a truncated frame */ }
        if (payload?.kind === 'progress' && typeof payload.phase === 'string') {
          if (payload.sessionId === undefined || payload.sessionId === sessionId) setPhase(payload.phase)
        }
        if (payload?.kind === 'error' && typeof payload.message === 'string') {
          if (payload.sessionId === undefined || payload.sessionId === sessionId) setError(payload.message)
        }
        if (pending !== undefined) return
        pending = setTimeout(() => {
          pending = undefined
          void refresh()
        }, 120)
      }
      source.onerror = () => {
        source?.close()
        if (disposed) return
        failures += 1
        // A dropped stream usually reconnects at once; only after several
        // consecutive failures is polling the cheaper option.
        if (failures >= 4) {
          setPushed(false)
          return
        }
        retry = setTimeout(open, Math.min(15_000, 1000 * 2 ** (failures - 1)))
      }
    }
    open()
    return () => {
      disposed = true
      if (pending !== undefined) clearTimeout(pending)
      if (retry !== undefined) clearTimeout(retry)
      source?.close()
    }
  }, [pushed, sessionId, refresh])

  useEffect(() => {
    if (!busy) {
      setElapsed(0)
      setPhase('')
      return undefined
    }
    const started = Date.now()
    const timer = setInterval(() => setElapsed(Math.round((Date.now() - started) / 1000)), 500)
    return () => clearInterval(timer)
  }, [busy])

  // Write the layout preferences back whenever they change.
  useEffect(() => {
    saveUiPrefs({
      resultHeight,
      resultCollapsed,
      historyOpen: wide
        ? { ...loadUiPrefs().historyOpen, wide: historyOpen }
        : { ...loadUiPrefs().historyOpen, narrow: historyOpen },
      promptHeight,
      historyWidth: wide
        ? { ...loadUiPrefs().historyWidth, wide: historyWidth }
        : { ...loadUiPrefs().historyWidth, narrow: historyWidth },
    })
  }, [resultHeight, resultCollapsed, historyWidth, historyOpen, promptHeight, wide])

  // The prompt box has the browser's own vertical resize grip; observing the box
  // is what remembers the height the user dragged to.
  useEffect(() => {
    const element = promptRef.current
    if (element === null || typeof ResizeObserver === 'undefined') return undefined
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const height = Math.round(entry.borderBoxSize?.[0]?.blockSize ?? entry.target.offsetHeight)
        if (height >= 72) setPromptHeight(height)
      }
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!historyResizing) return undefined
    function onMove(event) {
      const drag = historyResizeRef.current
      if (drag === null) return
      setHistoryWidth(Math.min(420, Math.max(160, drag.width + (event.clientX - drag.x))))
    }
    function onUp() {
      historyResizeRef.current = null
      setHistoryResizing(false)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [historyResizing])
  useEffect(() => {
    if (!resizing) return undefined
    function onMove(event) {
      const drag = resizeRef.current
      if (drag === null) return
      const next = Math.min(720, Math.max(120, drag.height - (event.clientY - drag.y)))
      setResultHeight(next)
    }
    function onUp() {
      resizeRef.current = null
      setResizing(false)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [resizing])

  /**
   * Save every field changed since the last acknowledged write.
   *
   * Only one request may be in flight. Updates made during it stay in
   * `pendingPatchRef`; a concurrent flush waits for the current request and then
   * sends those fields with the revision that request acknowledged.
   */
  const flush = useCallback(async () => {
    if (saveTimer.current !== null) {
      clearTimeout(saveTimer.current)
      saveTimer.current = null
    }
    if (conflictRef.current) return false
    if (savingRef.current) {
      const saved = await savePromiseRef.current
      if (!saved || conflictRef.current) return false
      return flush()
    }

    const patch = pendingPatchRef.current
    pendingPatchRef.current = {}
    if (Object.keys(patch).length === 0) return true
    const epoch = localEpochRef.current

    savingRef.current = true
    setSaving(true)
    const task = (async () => {
      try {
        const { status, body } = await putDraft(sessionId, patch, revisionRef.current)
        if (status === 409 && body !== null) {
          revisionRef.current = body.revision
          setRevision(body.revision)
          // Keep the user's edits visible and stop autosave. The conflict banner
          // offers two explicit choices: adopt this server draft or overwrite it.
          pendingPatchRef.current = { ...patch, ...pendingPatchRef.current }
          conflictParamsRef.current = body.params ?? null
          latestServerRef.current = { revision: body.revision, params: body.params }
          dirtyRef.current = true
          conflictRef.current = true
          setConflict(true)
          setNotice(t('notice.draftChanged'))
          return false
        }
        if (status === 200 && body !== null) {
          revisionRef.current = body.revision
          setRevision(body.revision)
          conflictRef.current = false
          conflictParamsRef.current = null
          setConflict(false)
          if (epoch === localEpochRef.current && Object.keys(pendingPatchRef.current).length === 0) {
            dirtyRef.current = false
            setError('')
          }
          return true
        }
        pendingPatchRef.current = { ...patch, ...pendingPatchRef.current }
        dirtyRef.current = true
        setError(body?.message ?? t('error.save', { status }))
        return false
      } catch (problem) {
        pendingPatchRef.current = { ...patch, ...pendingPatchRef.current }
        dirtyRef.current = true
        setError(problem instanceof Error ? problem.message : String(problem))
        return false
      }
    })()
    savePromiseRef.current = task
    try {
      return await task
    } finally {
      savingRef.current = false
      savePromiseRef.current = null
      setSaving(false)
    }
  }, [sessionId])

  /** Drain edits made while an earlier save was in flight before a dependent action. */
  const flushAll = useCallback(async () => {
    let saved = await flush()
    while (saved && Object.keys(pendingPatchRef.current).length > 0) saved = await flush()
    return saved
  }, [flush])

  /** Discard local edits and show the exact server draft returned by the 409. */
  const adoptServerDraft = useCallback(() => {
    const server = latestServerRef.current?.params ?? conflictParamsRef.current
    if (server === null || server === undefined) return
    if (saveTimer.current !== null) {
      clearTimeout(saveTimer.current)
      saveTimer.current = null
    }
    pendingPatchRef.current = {}
    localEpochRef.current += 1
    dirtyRef.current = false
    conflictRef.current = false
    conflictParamsRef.current = null
    revisionRef.current = latestServerRef.current?.revision ?? revisionRef.current
    setRevision(revisionRef.current)
    paramsRef.current = server
    setParams(server)
    setConflict(false)
    setError('')
    setNotice(t('notice.serverDraftAdopted'))
  }, [])

  /** Keep the visible local draft and explicitly save it over the newer server one. */
  const overwriteServerDraft = useCallback(async () => {
    if (!conflictRef.current) return
    conflictRef.current = false
    conflictParamsRef.current = null
    revisionRef.current = latestServerRef.current?.revision ?? revisionRef.current
    setRevision(revisionRef.current)
    setConflict(false)
    setError('')
    setNotice(t('notice.overwritingDraft'))
    const saved = await flushAll()
    if (saved) setNotice(t('notice.localDraftSaved'))
  }, [flushAll])

  const update = useCallback((patch) => {
    const next = { ...(paramsRef.current ?? {}), ...patch }
    paramsRef.current = next
    setParams(next)
    pendingPatchRef.current = { ...pendingPatchRef.current, ...patch }
    localEpochRef.current += 1
    dirtyRef.current = true
    // Further edits stay local while the conflict banner is open; autosave may
    // resume only after the user explicitly adopts or overwrites the server.
    if (!conflictRef.current && saveTimer.current !== null) clearTimeout(saveTimer.current)
    if (!conflictRef.current) saveTimer.current = setTimeout(() => { void flush() }, SAVE_DELAY_MS)
  }, [flush])

  /** Replace the whole local draft and queue one full-parameter save. */
  const replaceDraft = useCallback((next, message) => {
    paramsRef.current = next
    setParams(next)
    pendingPatchRef.current = { ...next }
    localEpochRef.current += 1
    dirtyRef.current = true
    conflictRef.current = false
    conflictParamsRef.current = null
    setConflict(false)
    if (saveTimer.current !== null) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => { void flush() }, SAVE_DELAY_MS)
    if (message !== undefined) setNotice(message)
  }, [flush])

  /**
   * Width and height are edited as text: a half-typed number must not be sent,
   * so the draft only changes once both sides form a usable size.
   */
  const [widthText, setWidthText] = useState('1024')
  const [heightText, setHeightText] = useState('1024')
  const [sizeHint, setSizeHint] = useState(null)

  // An AI edit or a loaded record can change the size behind our back.
  useEffect(() => {
    const parts = String(params?.size ?? '').split('x')
    if (parts.length !== 2) return
    setWidthText(parts[0])
    setHeightText(parts[1])
    setSizeHint(null)
  }, [params?.size])

  const commitSize = useCallback((widthSource, heightSource) => {
    const width = Number(widthSource)
    const height = Number(heightSource)
    const problem = sizeProblem(width, height, widthSource, heightSource)
    if (problem !== null) {
      // Keep what was typed and say what is wrong; nothing is saved.
      setSizeHint(problem)
      return
    }
    setSizeHint(null)
    const next = formatSize(width, height)
    if (next !== paramsRef.current?.size) update({ size: next })
  }, [update])

  /**
   * Append a box and hand the editor the result: it needs the new list and its
   * index so the addition becomes one undo step like every other edit.
   */
  const addBox = useCallback((geometry) => {
    const current = paramsRef.current ?? {}
    const boxes = [...(current.boxes ?? [])]
    boxes.push(geometry === undefined ? defaultBox() : { ...defaultBox(), ...geometry })
    update({ boxes })
    setShowCanvas(true)
    return { index: boxes.length - 1, boxes, characters: current.characterBoxes ?? '' }
  }, [update])

  /**
   * Replace the box list wholesale from the editor. Character marks are stored
   * as 1-based box numbers, so they have to follow every insertion and removal.
   */
  const applyBoxes = useCallback((nextBoxes, characters) => {
    const patch = { boxes: nextBoxes }
    if (characters !== undefined) patch.characterBoxes = characters
    update(patch)
  }, [update])

  const newDraft = useCallback(() => {
    update({ prompt: '', boxes: [], seed: -1, characterBoxes: '', enhance: false })
    setNotice(t('notice.newDraft'))
  }, [update])

  /** Opening the editor remembers the draft, which is what "取消" restores. */
  const openEditor = useCallback(() => {
    editorSnapshot.current = structuredClone(paramsRef.current ?? {})
    setZoom(false)
    setEditorOpen(true)
  }, [])

  const closeEditor = useCallback(() => setEditorOpen(false), [])

  const cancelEditor = useCallback(() => {
    const snapshot = editorSnapshot.current
    setEditorOpen(false)
    if (snapshot === null) return
    replaceDraft(snapshot, t('notice.layoutReverted'))
  }, [replaceDraft])

  /** Wait for one specific record, never another session's newest job. */
  const waitForCompletion = useCallback(async (recordId) => {
    const started = Date.now()
    while (Date.now() - started < 600_000) {
      await new Promise((resolve) => setTimeout(resolve, 1200))
      const state = await fetchState(sessionId)
      applyServerState(state)
      const record = typeof recordId === 'string'
        ? state.records.find((entry) => entry.id === recordId)
        : state.records.find((entry) => entry.sessionId === sessionId && entry.status === 'running')
          ?? state.records.find((entry) => entry.sessionId === sessionId)
      if (record !== undefined && record.status !== 'running') {
        if (record.status === 'failed') {
          if (record.error?.message === '已取消') {
            setError('')
            setNotice(t('notice.generationCancelled'))
          } else {
            setError(record.error?.message ?? t('error.generation'))
            setNotice('')
          }
        } else {
          pinnedRef.current = false
          setImageBroken(false)
          setActiveRecordId(record.id)
          setNotice(t('notice.generationDone', { width: record.width, height: record.height, seconds: record.seconds }))
        }
        return
      }
    }
    setNotice(t('notice.generationTimeout'))
  }, [sessionId, applyServerState])

  const runGenerate = useCallback(async () => {
    if (busy) return
    const problem = boxesProblem(paramsRef.current?.boxes)
    if (problem !== undefined) {
      // Say it here, in the user's language, instead of letting the workflow
      // reject the prompt with an English node error after a long wait.
      setError(problem.reason === 'count'
        ? t('error.tooManyBoxes', { max: MAX_BOXES })
        : t(problem.reason === 'text' ? 'error.emptyText' : 'error.emptyDesc', { index: problem.index + 1 }))
      setNotice('')
      return
    }
    setBusy(true)
    setError('')
    setNotice(t('notice.generationSubmitted'))
    try {
      // The request body carries only a revision, so the server must see the
      // latest local fields before it can generate what the panel is showing.
      const saved = await flushAll()
      if (!saved) return
      const { status, body } = await generate(sessionId, revisionRef.current)
      if (status === 409 && body !== null) {
        revisionRef.current = body.revision
        setRevision(body.revision)
        setParams(body.params)
        dirtyRef.current = false
        setNotice(t('notice.draftChanged'))
        return
      }
      if (status === 429) {
        setNotice(t('notice.generationBusy'))
        return
      }
      if (status !== 202) {
        setError(body?.message ?? t('error.generateRequest', { status }))
        return
      }
      setGenerationRecordId(body.recordId ?? null)
      await waitForCompletion(body.recordId)
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : String(problem))
    } finally {
      setBusy(false)
      setGenerationRecordId(null)
    }
  }, [busy, flushAll, sessionId, waitForCompletion])

  const cancelCurrentGeneration = useCallback(async () => {
    if (!busy || generationRecordId === null) return
    try {
      const { status, body } = await cancelGeneration(sessionId, generationRecordId)
      if (status !== 200) {
        setError(body?.message ?? t('error.cancelGeneration', { status }))
        return
      }
      setNotice(t('notice.generationCancelling'))
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : String(problem))
    }
  }, [busy, generationRecordId, sessionId])

  /** Re-run a failed record with the parameters it was created with. */
  const retryRecord = useCallback(async (record) => {
    if (busy || record === null || record === undefined) return
    setBusy(true)
    setError('')
    setNotice(t('notice.retrySubmitted'))
    try {
      // No revision: the point of a retry is the recorded parameters, not the
      // draft someone may have edited since.
      const { status, body } = await generate(sessionId, undefined, record.params)
      if (status === 429) {
        setNotice(t('notice.generationBusy'))
        return
      }
      if (status !== 202) {
        setError(body?.message ?? t('error.retry', { status }))
        return
      }
      setGenerationRecordId(body.recordId ?? null)
      await waitForCompletion(body.recordId)
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : String(problem))
    } finally {
      setBusy(false)
      setGenerationRecordId(null)
    }
  }, [busy, sessionId, waitForCompletion])

  const generateRandom = useCallback(() => {
    update({ seed: -1 })
    setTimeout(() => { void runGenerate() }, SAVE_DELAY_MS + 80)
  }, [update, runGenerate])

  /**
   * Selecting a record only switches what the result pane shows. Loading its
   * parameters into the draft is an explicit action, so a stray click cannot
   * overwrite work in progress.
   */
  const selectRecord = useCallback(async (id) => {
    pinnedRef.current = true
    setImageBroken(false)
    setActiveRecordId(id)
    try {
      setActiveRecord(await fetchRecord(id))
    } catch {
      setActiveRecord(null)
    }
  }, [])

  useEffect(() => {
    if (activeRecordId === null) {
      setActiveRecord(null)
      return undefined
    }
    let alive = true
    void fetchRecord(activeRecordId).then((record) => { if (alive) setActiveRecord(record) }).catch(() => {})
    return () => { alive = false }
  }, [activeRecordId])

  // A different record gets a different URL, so a previous load failure no longer applies.
  useEffect(() => { setImageBroken(false) }, [activeRecordId])

  const loadRecord = useCallback(() => {
    if (activeRecord === null) return
    replaceDraft(activeRecord.params, t('notice.recordLoaded', { id: activeRecord.id }))
  }, [activeRecord, replaceDraft])

  const removeRecordById = useCallback(async (id) => {
    try {
      const { status, body } = await deleteRecord(id)
      if (status === 409) {
        // The engine is still writing this record; deleting it would drop the image.
        setError(body?.message ?? t('history.deleteBlockedRunning'))
        return
      }
      if (status !== 200) {
        setError(body?.message ?? t('error.delete', { status }))
        return
      }
      setError('')
      if (id === activeRecordId) {
        setActiveRecordId(null)
        setActiveRecord(null)
      }
      await refresh()
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : String(problem))
    }
  }, [activeRecordId, refresh])

  /** Pin/unpin or archive/unarchive one record, then re-read the lists. */
  const toggleFlag = useCallback(async (record, flags) => {
    try {
      const { status, body } = await patchRecord(record.id, flags)
      if (status === 405) {
        // The browser half is newer than the running host: PATCH is not registered yet.
        setError(t('notice.flagsNeedNewHost'))
        return
      }
      if (status !== 200) {
        setError(body?.message ?? t('error.flag', { status }))
        return
      }
      setError('')
      await refresh()
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : String(problem))
    }
  }, [refresh])

  const removeRecord = useCallback(async () => {
    if (activeRecordId === null) return
    await removeRecordById(activeRecordId)
  }, [activeRecordId, removeRecordById])

  const characterSet = useMemo(() => toCharacterSet(params?.characterBoxes), [params?.characterBoxes])

  // Newest page from /state plus any pages fetched by scrolling, de-duplicated.
  const mergedRecords = (() => {
    const seen = new Set(records.map((record) => record.id))
    return [...records, ...older.filter((record) => !seen.has(record.id))]
  })()

  const needle = query.trim().toLowerCase()

  useEffect(() => {
    if (needle === '') {
      setMatches(null)
      return undefined
    }
    let alive = true
    const timer = setTimeout(() => {
      void (async () => {
        try {
          const page = await fetchRecords(50, undefined, showArchived, needle)
          if (alive) setMatches(page.records)
        } catch (problem) {
          if (alive) setError(problem instanceof Error ? problem.message : String(problem))
        }
      })()
    }, 220)
    return () => {
      alive = false
      clearTimeout(timer)
    }
  }, [needle, showArchived])
  const visibleRecords = (needle === '' ? mergedRecords : matches ?? [])
    .filter((record) => (flagLocalOnly ? record.sessionId === sessionId : true))

  /** One page further back; the cursor is the oldest id already shown. */
  const loadMore = useCallback(async () => {
    if (loadingMore || nextBefore === null || nextBefore === undefined || query.trim() !== '') return
    setLoadingMore(true)
    try {
      const page = await fetchRecords(40, nextBefore, showArchived)
      setOlder((current) => {
        const seen = new Set(current.map((record) => record.id))
        return [...current, ...page.records.filter((record) => !seen.has(record.id))]
      })
      setNextBefore(page.nextBefore)
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : String(problem))
    } finally {
      setLoadingMore(false)
    }
  }, [loadingMore, nextBefore, showArchived])

  // The virtualizer needs a measured viewport; without one (SSR, tests) the list
  // renders plainly instead of showing nothing.
  const rowVirtualizer = useVirtualizer({
    count: visibleRecords.length,
    getScrollElement: () => historyRef.current,
    estimateSize: () => 64,
    overscan: 6,
  })
  const virtualRows = rowVirtualizer.getVirtualItems()

  const onHistoryScroll = useCallback((event) => {
    const element = event.currentTarget
    if (element.scrollHeight - element.scrollTop - element.clientHeight < 120) void loadMore()
  }, [loadMore])

  /** Ask before deleting: the dialog shows which record is about to go. */
  const selectForDelete = useCallback((id) => {
    if (id === null || id === undefined) return
    const found = mergedRecords.find((record) => record.id === id)
      ?? (activeRecord?.id === id ? activeRecord : { id })
    setPendingDelete(found)
  }, [mergedRecords, activeRecord])

  if (params === null) {
    return (
      <div style={{ ...panel, padding: 16, ...dim }}>
        {error !== '' ? t('error.read', { error }) : t('status.loading')}
      </div>
    )
  }

  const boxes = params.boxes ?? []
  const shownRecordId = activeRecordId ?? records.find((record) => record.hasImage)?.id ?? null
  /** Where the shown record stands: a running one has no image yet, so it must not render an <img>. */
  const shownSummary = records.find((record) => record.id === shownRecordId)
  /** Records the viewer can step through: what is on screen, with an image. */
  const viewableIds = (needle === '' ? mergedRecords : matches ?? [])
    .filter((record) => record.hasImage)
    .map((record) => record.id)
  const viewIndex = shownRecordId === null ? -1 : viewableIds.indexOf(shownRecordId)
  const previousId = viewIndex > 0 ? viewableIds[viewIndex - 1] : null
  const followingId = viewIndex >= 0 && viewIndex + 1 < viewableIds.length ? viewableIds[viewIndex + 1] : null

const otherBusy = queue.busy && queue.sessionId !== null && queue.sessionId !== sessionId

  const shownHasImage = shownSummary === undefined ? shownRecordId !== null : shownSummary.hasImage
  const shownRunning = shownSummary?.status === 'running'
  const running = records.find((record) => record.status === 'running')

  return (
    <div className="moss-studio" style={panel}>
      <ScopeStyles />
      <div style={{ ...row, justifyContent: 'space-between', gap: 8, padding: '6px 8px', borderBottom: '1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.22))' }}>
        <div style={{ ...row, gap: 6, minWidth: 0 }}>
          <button type="button" style={iconOnly} title={t('action.newDraftTitle')} aria-label={t('action.newDraft')} onClick={newDraft}>
            <Icon name="add" />
          </button>
          <button
            type="button"
            title={`${comfy?.ok
              ? `${t('status.comfyVersion', { version: comfy.version })} · ${comfy.url ?? ''}`
              : `${t('status.comfyUnreachable')}${comfy?.error ? `：${comfy.error}` : ''}`}（${t('status.recheckHint')}）`}
            aria-label={t('status.recheck')}
            onClick={() => { setComfy(null); void checkHealth() }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '1px 6px',
              borderRadius: 10,
              fontSize: 10,
              font: 'inherit',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              background: 'transparent',
              border: '1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.28))',
              color: comfy?.ok ? 'inherit' : 'var(--dsw-alias-state-error-primary, #ff8f7a)',
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                background: comfy === null
                  ? 'var(--dsw-alias-label-secondary, #888)'
                  : comfy.ok
                    ? 'var(--dsw-alias-state-success-primary, #5fbf7f)'
                    : 'var(--dsw-alias-state-error-primary, #ff8f7a)',
              }}
            />
            {comfy === null ? t('status.connecting') : comfy.ok ? t('status.comfyVersion', { version: comfy.version }) : t('status.comfyOffline')}
          </button>
          {/* Session ids are long and meaningless at a glance; say which draft
              this is, and keep the exact id in the tooltip. */}
          <span style={{ fontSize: 10, ...dim, whiteSpace: 'nowrap' }} title={t('status.draftSession', { sessionId })}>
            {sessionId === 'root' ? t('status.draftRoot') : sessionId === 'global' ? t('status.draftUnbound') : t('status.draftConversation')}
          </span>
          {/* Live memory, not the draft summary: while a job runs, what matters is
              whether the model stack still fits. */}
          <span
            title={t('status.memoryTitle', { total: gigabytes(comfy?.gpu?.vramTotal), ram: gigabytes(comfy?.ramTotal) })}
            style={{
              fontSize: 10,
              whiteSpace: 'nowrap',
              display: 'inline-flex',
              gap: 8,
              color: comfy?.gpu !== undefined && usedPercent(comfy.gpu.vramTotal, comfy.gpu.vramFree) >= 90
                ? 'var(--dsw-alias-state-error-primary, #ff8f7a)'
                : 'var(--dsw-alias-label-secondary, inherit)',
            }}
          >
            <span>
              {t('status.vram', {
                used: gigabytes(comfy?.gpu?.vramTotal === undefined ? undefined : comfy.gpu.vramTotal - (comfy.gpu.vramFree ?? 0)),
                total: gigabytes(comfy?.gpu?.vramTotal),
              })}
            </span>
            <span>
              {t('status.ram', {
                used: gigabytes(comfy?.ramTotal === undefined ? undefined : comfy.ramTotal - (comfy.ramFree ?? 0)),
                total: gigabytes(comfy?.ramTotal),
              })}
            </span>
          </span>
        </div>
        <div style={{ ...row, gap: 4, flexShrink: 0 }}>
          <span style={{ fontSize: 10, ...dim }}>{saving ? t('status.saving') : `revision ${revision}`}</span>
          <button
            type="button"
            style={historyOpen ? iconOnly : { ...iconOnly, opacity: 0.65 }}
            title={historyOpen ? t('history.hide') : t('history.show', { count: mergedRecords.length })}
            aria-label={historyOpen ? t('history.hide') : t('history.show', { count: mergedRecords.length })}
            aria-pressed={historyOpen}
            onClick={() => setHistoryOpen((value) => !value)}
          >
            <Icon name="history" />
          </button>
          <button type="button" style={iconOnly} title={t('action.settings')} aria-label={t('action.settings')} onClick={() => setSettingsOpen(true)}>
            <Icon name="settings" />
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {historyOpen ? (
          <>
          <div
            className="moss-scroller"
            style={{
              width: historyWidth,
              flexShrink: 0,
              borderRight: '1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.22))',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0,
            }}
          >
            {/* One header for everything that filters the list: count on the left,
                scope and archived toggles on the right, search directly below. */}
            <div style={{ ...row, justifyContent: 'space-between', padding: '6px 6px 4px', gap: 4 }}>
              <span style={{ fontSize: 11, ...dim }}>
                {t('history.title', { count: visibleRecords.length })}
                {mergedRecords.length > visibleRecords.length ? ` / ${mergedRecords.length}` : ''}
              </span>
              <div style={{ ...row, gap: 4 }}>
                <FilterChip
                  selected={flagLocalOnly}
                  label={t('history.filterSession')}
                  title={flagLocalOnly ? t('history.showAllSessions') : t('history.onlyThisSession')}
                  onClick={() => setLocalOnly((value) => !value)}
                />
                <FilterChip
                  selected={showArchived}
                  label={t('action.archive')}
                  title={showArchived ? t('history.hideArchived') : t('history.showArchived')}
                  onClick={() => {
                    setShowArchived((value) => !value)
                    setOlder([])
                    setNextBefore(undefined)
                  }}
                />
              </div>
            </div>
            <div style={{ padding: '0 6px 6px' }}>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t('history.searchPlaceholder')}
                style={{ ...input, width: '100%', boxSizing: 'border-box', fontSize: 11 }}
              />
            </div>

            {pinnedRecords.length > 0 ? (
              <div style={{ padding: '0 6px 6px', borderBottom: '1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.22))', marginBottom: 6 }}>
                <div style={{ fontSize: 10, ...dim, marginBottom: 4 }} title={pinnedTruncated ? t('history.pinnedTruncated') : undefined}>
                {t('history.pinnedTitle', { count: pinnedRecords.length })}
                {pinnedTruncated ? ' +' : ''}
              </div>
                {pinnedRecords.map((record) => (
                  <div key={record.id} style={{ paddingBottom: 5 }}>
                    <HistoryRow
                      record={record}
                      active={record.id === activeRecordId}
                      onSelect={(id) => void selectRecord(id)}
                      onDelete={(id) => selectForDelete(id)}
                      onPin={(row) => void toggleFlag(row, { pinned: !row.pinned })}
                      onArchive={(row) => void toggleFlag(row, { archived: !row.archived })}
                    />
                  </div>
                ))}
              </div>
            ) : null}

            <div
              ref={historyRef}
              onScroll={onHistoryScroll}
              style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 6px' }}
            >
              {visibleRecords.length === 0 ? (
                <div style={{ ...dim, padding: 8, lineHeight: 1.6 }}>
                  {needle !== ''
                    ? t('history.noMatches', { query: query.trim() })
                    : flagLocalOnly
                      ? t('history.emptySession')
                      : t('history.empty')}
                </div>
              ) : null}

              {virtualRows.length === 0 ? (
                visibleRecords.map((record) => (
                  <div key={record.id} style={{ paddingBottom: 5 }}>
                    <HistoryRow
                      record={record}
                      active={record.id === activeRecordId}
                      onSelect={(id) => void selectRecord(id)}
                      onDelete={(id) => selectForDelete(id)}
                      onPin={(row) => void toggleFlag(row, { pinned: !row.pinned })}
                      onArchive={(row) => void toggleFlag(row, { archived: !row.archived })}
                    />
                  </div>
                ))
              ) : (
                <div style={{ height: rowVirtualizer.getTotalSize(), position: 'relative' }}>
                  {virtualRows.map((item) => {
                    const record = visibleRecords[item.index]
                    if (record === undefined) return null
                    return (
                      <div
                        key={record.id}
                        data-index={item.index}
                        ref={rowVirtualizer.measureElement}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', transform: `translateY(${item.start}px)`, paddingBottom: 5 }}
                      >
                        <HistoryRow
                          record={record}
                          active={record.id === activeRecordId}
                          onSelect={(id) => void selectRecord(id)}
                          onDelete={(id) => selectForDelete(id)}
                          onPin={(row) => void toggleFlag(row, { pinned: !row.pinned })}
                          onArchive={(row) => void toggleFlag(row, { archived: !row.archived })}
                        />
                      </div>
                    )
                  })}
                </div>
              )}

              {nextBefore !== null && nextBefore !== undefined && needle === '' ? (
                <div style={{ textAlign: 'center', padding: '4px 0 8px' }}>
                  <button type="button" style={iconButton} onClick={() => void loadMore()} disabled={loadingMore}>
                    {loadingMore ? t('history.loading') : t('history.loadMore')}
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          {/* Drag to resize the history column; the width is remembered. */}
          <div
            onPointerDown={(event) => {
              event.preventDefault()
              historyResizeRef.current = { x: event.clientX, width: historyWidth }
              setHistoryResizing(true)
            }}
            onDoubleClick={() => setHistoryWidth(wide ? 280 : 160)}
            title={t('history.resizeTitle')}
            style={{
              width: 5,
              flexShrink: 0,
              cursor: 'col-resize',
              background: historyResizing
                ? 'var(--dsw-alias-button-primary-fill, rgba(120,190,145,0.92))'
                : 'transparent',
            }}
          />
          </>
        ) : null}

        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div>
              <div style={{ ...row, justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={label}>{t('prompt.label')}</span>
              </div>
              <textarea
                ref={promptRef}
                value={params.prompt}
                onChange={(event) => update({ prompt: event.target.value })}
                placeholder={t('prompt.placeholder')}
                rows={4}
                // Height comes from the preference; the grip below the box and the
                // browser's own resize handle both write back to it.
                style={{
                  ...input,
                  width: '100%',
                  height: promptHeight,
                  minHeight: 72,
                  maxHeight: 520,
                  resize: 'vertical',
                  overflowY: 'auto',
                  lineHeight: 1.55,
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div>
              <div style={{ ...row, justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ ...label, minWidth: 0 }}>{t('preview.boxes', { count: boxes.length })}</span>
                <div style={{ ...row }}>
                  <button
                    type="button"
                    style={iconOnly}
                    title={showCanvas ? t('preview.collapse') : t('preview.expand')}
                    aria-label={showCanvas ? t('preview.collapse') : t('preview.expand')}
                    onClick={() => setShowCanvas((value) => !value)}
                  >
                    <Icon name={showCanvas ? 'unfold_less' : 'unfold_more'} />
                  </button>
                  <button
                    type="button"
                    style={iconOnly}
                    title={t('preview.editLayout')}
                    aria-label={t('preview.editLayout')}
                    onClick={openEditor}
                  >
                    <Icon name="dashboard_customize" />
                  </button>
                </div>
              </div>
              {showCanvas ? (
                <div
                  onClick={openEditor}
                  title={t('preview.openEditor')}
                  style={{ cursor: 'zoom-in' }}
                >
                  <BoxCanvas
                    boxes={boxes}
                    size={params.size}
                    selected={-1}
                    onSelect={() => {}}
                    onChange={() => {}}
                    interactive={false}
                    compact={boxes.length === 0}
                  />
                </div>
              ) : null}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ ...row, gap: 4, alignItems: 'center' }}>
                  <span style={label}>{t('size.label')}</span>
                  <input
                    type="number"
                    min={16}
                    step={16}
                    value={widthText}
                    onChange={(event) => setWidthText(event.target.value)}
                    onBlur={() => commitSize(widthText, heightText)}
                    aria-label={t('size.width')}
                    style={{ ...input, flex: '0 0 64px', width: 64, textAlign: 'right' }}
                  />
                  <span style={{ ...dim, fontSize: 11 }}>×</span>
                  <input
                    type="number"
                    min={16}
                    step={16}
                    value={heightText}
                    onChange={(event) => setHeightText(event.target.value)}
                    onBlur={() => commitSize(widthText, heightText)}
                    aria-label={t('size.height')}
                    style={{ ...input, flex: '0 0 64px', width: 64, textAlign: 'right' }}
                  />
                  <select
                    value={SIZE_PRESETS.includes(params.size) ? params.size : ''}
                    onChange={(event) => {
                      if (event.target.value === '') return
                      const [w, h] = event.target.value.split('x')
                      setWidthText(w)
                      setHeightText(h)
                      update({ size: event.target.value })
                    }}
                    aria-label={t('size.presets')}
                    style={{ ...input, flex: '0 0 96px', width: 96 }}
                  >
                    <option value="" style={optionStyle}>{t('size.presetPlaceholder')}</option>
                    {SIZE_PRESETS.map((size) => <option key={size} value={size} style={optionStyle}>{size}</option>)}
                  </select>
                </div>
                {sizeHint !== null ? (
                  <div style={{ fontSize: 10, color: 'var(--dsw-alias-state-error-primary, #ff8f7a)', margin: '2px 0 0 34px' }}>{sizeHint}</div>
                ) : null}
              </div>
              <label style={row}>
                <span style={label}>{t('params.steps')}</span>
                <input type="number" min={1} max={200} value={params.steps} onChange={(event) => update({ steps: Number(event.target.value) || 1 })} style={input} />
              </label>
              <label style={row}>
                <span style={label}>CFG</span>
                <input type="number" min={0} max={30} step={0.1} value={params.cfg} onChange={(event) => update({ cfg: Number(event.target.value) || 0 })} style={input} />
              </label>
              <label style={row}>
                <span style={label}>seed</span>
                <input type="number" value={params.seed} onChange={(event) => update({ seed: Number(event.target.value) })} style={input} />
              </label>
            </div>

            <div>
              <div style={{ ...row, justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={label}>{t('params.negative')}</span>
              </div>
              <textarea
                value={params.negative}
                onChange={(event) => update({ negative: event.target.value })}
                placeholder={t('params.negativePlaceholder')}
                rows={2}
                style={{ ...input, width: '100%', display: 'block', resize: 'vertical', lineHeight: 1.5 }}
              />
            </div>

            <IconCheckbox
              checked={params.enhance}
              disabled={boxes.length > 0}
              onChange={(event) => update({ enhance: event.target.checked })}
              label={t('params.enhanceHint')}
            />
          </div>

          <div style={{ borderTop: '1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.22))', padding: '6px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ ...row, flexWrap: 'wrap' }}>
              <button type="button" style={primary} disabled={busy || otherBusy || sizeHint !== null} onClick={generateRandom}>
                {busy ? `${t('generate.running', { seconds: elapsed })}${phase === '' ? '' : ` · ${t(PHASE_KEY[phase] ?? phase)}`}` : otherBusy ? t('generate.otherSession') : t('generate.random')}
              </button>
              <button type="button" style={button} disabled={busy || otherBusy || sizeHint !== null} onClick={() => void runGenerate()}>{t('generate.currentSeed')}</button>
              {busy && generationRecordId !== null ? (
                <button type="button" style={button} onClick={() => void cancelCurrentGeneration()}>{t('generate.cancel')}</button>
              ) : null}
              {running !== undefined && !busy ? <span style={{ fontSize: 11, ...dim }}>{t('generate.queued', { id: running.id.slice(-4) })}</span> : null}
              {sizeHint !== null ? <span style={{ fontSize: 11, color: 'var(--dsw-alias-state-error-primary, #ff8f7a)' }}>{t('size.invalidNotSaved')}</span> : null}
            </div>
            {conflict ? (
              <div role="alert" style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: 6, borderRadius: 8, border: '1px solid var(--dsw-alias-state-warning-primary, rgba(235,180,70,0.55))', background: 'var(--dsw-alias-bg-layer-2, rgba(127,127,127,0.12))' }}>
                <span style={{ fontSize: 11 }}>{t('notice.draftConflict')}</span>
                <div style={{ ...row, flexWrap: 'wrap', gap: 4 }}>
                  <button type="button" style={button} disabled={conflictParamsRef.current === null} onClick={adoptServerDraft}>{t('action.adoptServer')}</button>
                  <button type="button" style={primary} onClick={() => void overwriteServerDraft()}>{t('action.overwriteServer')}</button>
                </div>
              </div>
            ) : null}
            {notice !== '' ? <div style={{ fontSize: 11, ...dim }}>{notice}</div> : null}
            {error !== '' ? <div style={{ fontSize: 11, color: 'var(--dsw-alias-state-error-primary, #ff8f7a)' }}>{error}</div> : null}
          </div>
        </div>

        {/* The full-page surface has room sideways, so the result sits in its own
            column instead of stealing height from the parameters. */}
        {wide ? (
          <div
            style={{
              width: '38%',
              minWidth: 340,
              flexShrink: 0,
              borderLeft: '1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.22))',
              minHeight: 0,
              display: 'flex',
            }}
          >
            <ResultPane
              orientation="column"
              shownRecordId={shownRecordId}
              shownHasImage={shownHasImage}
              shownRunning={shownRunning}
              imageBroken={imageBroken}
              onImageError={() => setImageBroken(true)}
              activeRecord={activeRecord}
              activeRecordId={activeRecordId}
              onZoom={openViewer}
              onLoad={loadRecord}
              onRemove={() => selectForDelete(activeRecordId)}
              onRetry={(record) => void retryRecord(record)}
              error={error}
            />
          </div>
        ) : null}
      </div>

      {wide ? null : (
      <>
      <div
        onPointerDown={(event) => {
          event.preventDefault()
          resizeRef.current = { y: event.clientY, height: resultHeight }
          setResizing(true)
        }}
        onDoubleClick={() => setResultCollapsed((value) => !value)}
        title={t('result.resizeTitle')}
        style={{
          height: 6,
          flexShrink: 0,
          cursor: 'row-resize',
          background: resizing ? 'var(--dsw-alias-button-primary-fill, rgba(120,190,145,0.92))' : 'var(--dsw-alias-border-l1, rgba(127,127,127,0.22))',
          borderTop: '1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.22))',
        }}
      />

      <div
        style={{
          height: resultCollapsed ? 32 : resultHeight,
          // The strip states a preferred height, but it must yield when the
          // column is shorter: with `flexShrink: 0` it kept its full height and
          // pushed the picture past the bottom edge instead of fitting it.
          // The parameter column uses flex-basis 0, so every missing pixel comes
          // out of this strip first.
          flexShrink: 1,
          minHeight: resultCollapsed ? 32 : 88,
          // A stored pixel height can exceed a short sidebar; cap it to the share
          // of the column it may take, so the picture shrinks instead of being
          // pushed below the edge.
          maxHeight: resultCollapsed ? 32 : '55%',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          overflow: 'hidden',
          background: 'var(--dsw-alias-bg-layer-1, rgba(127,127,127,0.06))',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '2px 8px 0', flexShrink: 0 }}>
          <span style={{ fontSize: 11, ...dim }}>{t('result.label')}</span>
          <span style={{ flex: 1 }} />
          <button
            type="button"
            style={iconOnly}
            title={resultCollapsed ? t('result.expand') : t('result.collapse')}
            aria-label={resultCollapsed ? t('result.expand') : t('result.collapseShort')}
            onClick={() => setResultCollapsed((value) => !value)}
          >
            <Icon name={resultCollapsed ? 'keyboard_arrow_up' : 'keyboard_arrow_down'} />
          </button>
        </div>

        {resultCollapsed ? null : (
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResultPane
              orientation="row"
              shownRecordId={shownRecordId}
              shownHasImage={shownHasImage}
              shownRunning={shownRunning}
              imageBroken={imageBroken}
              onImageError={() => setImageBroken(true)}
              activeRecord={activeRecord}
              activeRecordId={activeRecordId}
              onZoom={openViewer}
              onLoad={loadRecord}
              onRemove={() => selectForDelete(activeRecordId)}
                            onRetry={(record) => void retryRecord(record)}
              error={error}
            />
          </div>
        )}
      </div>
      </>
      )}

      {editorOpen ? (
        <BoxEditor
          params={params}
          onApply={applyBoxes}
          onAdd={addBox}
          onClose={closeEditor}
          onCancel={cancelEditor}
        />
      ) : null}

      {pendingDelete !== null ? (
        <ConfirmDialog
          title={t('confirm.deleteTitle')}
          message={t('confirm.deleteMessage')}
          detail={[pendingDelete.prompt, pendingDelete.id].filter((part) => typeof part === 'string' && part !== '').join(' · ')}
          onCancel={() => setPendingDelete(null)}
          onConfirm={() => {
            const id = pendingDelete.id
            setPendingDelete(null)
            void removeRecordById(id)
          }}
        />
      ) : null}

      {settingsOpen ? (
        <SettingsDialog
          onClose={() => setSettingsOpen(false)}
          onSaved={() => {
            // The address changed: drop the cached verdict so the strip re-probes.
            setComfy(null)
          }}
        />
      ) : null}

      {zoom && shownRecordId !== null ? (
        <ImageViewer
          recordId={shownRecordId}
          prevId={previousId}
          nextId={followingId}
          onNavigate={(id) => { setImageBroken(false); setActiveRecordId(id); void selectRecord(id) }}
          onClose={() => setZoom(false)}
        />
      ) : null}

    </div>
  )
}
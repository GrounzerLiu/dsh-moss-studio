import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { deleteRecord, fetchHealth, fetchRecord, fetchRecords, fetchState, generate, imageUrl, patchRecord, putDraft } from './api.js'
import { BoxCanvas } from './BoxCanvas.jsx'
import { BoxEditor } from './BoxEditor.jsx'
import { useVirtualizer } from '@tanstack/react-virtual'
import { FilterChip } from './FilterChip.jsx'
import { Icon } from './icons.jsx'
import { IconCheckbox } from './IconCheckbox.jsx'
import { ResultPane } from './ResultPane.jsx'
import { ConfirmDialog } from './ConfirmDialog.jsx'
import { SettingsDialog } from './SettingsDialog.jsx'
import { SIZE_PRESETS, formatSize, sizeProblem } from './size.js'
import { gigabytes, usedPercent } from './format.js'
import { ImageViewer } from './ImageViewer.jsx'
import { ScopeStyles } from './ScopeStyles.jsx'
import { selectionFill } from './theme.js'
import { defaultBox } from './box-math.js'

const POLL_MS = 1500
const PHASE_LABEL = { probe: '探测', submit: '提交', wait: '排队', download: '下载' }
const SAVE_DELAY_MS = 500


const panel = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minHeight: 0,
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
      aria-label={record.prompt === '' ? '未命名记录' : record.prompt}
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
          {record.prompt === '' ? '(无提示词)' : record.prompt}
        </span>
        <span style={{ display: 'block', fontSize: 10, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', ...dim }}>
          {timeOf(record.createdAt)} · {record.size} · {record.boxCount} 框
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
          title={record.pinned ? '取消置顶' : '置顶'}
          aria-label={record.pinned ? '取消置顶' : '置顶'}
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
          title={record.archived ? '取消归档' : '归档'}
          aria-label={record.archived ? '取消归档' : '归档'}
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
            ? '生成中，结束后才能删除'
            : '删除这条记录'}
          aria-label="删除记录"
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
  return new Date(value).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

function toCharacterSet(value) {
  return new Set((String(value ?? '').match(/\d+/g) ?? []).map(Number))
}

function fromCharacterSet(set) {
  return [...set].sort((a, b) => a - b).join(', ')
}

export function StudioPanel({ sessionId = 'global', wide = false }) {
  const [params, setParams] = useState(null)
  const [records, setRecords] = useState([])
  const [selectedBox, setSelectedBox] = useState(-1)
  const [activeRecordId, setActiveRecordId] = useState(null)
  const [activeRecord, setActiveRecord] = useState(null)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [busy, setBusy] = useState(false)
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
  const [nextBefore, setNextBefore] = useState(null)
  const [loadingMore, setLoadingMore] = useState(false)
  const historyRef = useRef(null)
  const [showCanvas, setShowCanvas] = useState(true)
  const [zoom, setZoom] = useState(false)
  const openViewer = useCallback(() => setZoom(true), [])
  const [editorOpen, setEditorOpen] = useState(false)

  const [resultHeight, setResultHeight] = useState(240)
  const [resultCollapsed, setResultCollapsed] = useState(false)
  const [resizing, setResizing] = useState(false)
  const resizeRef = useRef(null)

  const revisionRef = useRef(0)
  // The ref is what requests send; the state is what the strip shows, because a
  // ref write alone does not re-render.
  const [revision, setRevision] = useState(0)
  const dirtyRef = useRef(false)
  const saveTimer = useRef(null)
  const paramsRef = useRef(null)
  /** Parameters as they were when the editor opened, so cancelling can undo the session. */
  const editorSnapshot = useRef(null)
  /** True once the user picks a record by hand: polling then stops following the newest one. */
  const pinnedRef = useRef(false)
  /** Set when an image URL fails, so the pane shows a placeholder instead of a broken icon. */
  const [imageBroken, setImageBroken] = useState(false)

  paramsRef.current = params

  const applyServerState = useCallback((state) => {
    revisionRef.current = state.revision
    setRevision(state.revision)
    if (!dirtyRef.current) setParams(state.params)
    setRecords(state.records)
    setPinnedRecords(state.pinned ?? [])
    setPinnedTruncated(state.pinnedTruncated === true)
    // The newest page also tells us where the next one starts; once the user has
    // scrolled further, keep that deeper cursor instead of resetting it.
    setNextBefore((current) => (current !== null ? current : state.nextBefore ?? null))
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
          setPhase(payload.phase)
        }
        if (payload?.kind === 'error' && typeof payload.message === 'string') {
          setError(payload.message)
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

  const flush = useCallback(async (patch) => {
    setSaving(true)
    try {
      const { status, body } = await putDraft(sessionId, patch, revisionRef.current)
      if (status === 409 && body !== null) {
        revisionRef.current = body.revision
        setRevision(body.revision)
        dirtyRef.current = false
        setParams(body.params)
        setNotice('草稿已被 AI 更新，已同步为最新参数')
      } else if (status === 200 && body !== null) {
        revisionRef.current = body.revision
        setRevision(body.revision)
        dirtyRef.current = false
        setError('')
      } else {
        setError(body?.message ?? `保存失败（${status}）`)
      }
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : String(problem))
    } finally {
      setSaving(false)
    }
  }, [sessionId])

  const update = useCallback((patch) => {
    setParams((current) => {
      const next = { ...current, ...patch }
      dirtyRef.current = true
      if (saveTimer.current !== null) clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(() => { void flush(patch) }, SAVE_DELAY_MS)
      return next
    })
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

  const updateBox = useCallback((index, patch) => {
    const boxes = (paramsRef.current?.boxes ?? []).map((box, position) => (position === index ? { ...box, ...patch } : box))
    update({ boxes })
  }, [update])

  const addBox = useCallback(() => {
    const boxes = [...(paramsRef.current?.boxes ?? [])]
    boxes.push(defaultBox())
    update({ boxes })
    setSelectedBox(boxes.length - 1)
    setShowCanvas(true)
  }, [update])

  const removeBox = useCallback((index) => {
    const boxes = (paramsRef.current?.boxes ?? []).filter((_, position) => position !== index)
    update({ boxes })
    setSelectedBox(-1)
  }, [update])

  const toggleCharacter = useCallback((index) => {
    const set = toCharacterSet(paramsRef.current?.characterBoxes)
    if (set.has(index + 1)) set.delete(index + 1)
    else set.add(index + 1)
    update({ characterBoxes: fromCharacterSet(set) })
  }, [update])

  const newDraft = useCallback(() => {
    update({ prompt: '', boxes: [], seed: -1, characterBoxes: '', enhance: false })
    setSelectedBox(-1)
    setNotice('已新建空草稿')
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
    dirtyRef.current = true
    setParams(snapshot)
    if (saveTimer.current !== null) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => { void flush(snapshot) }, SAVE_DELAY_MS)
    setNotice('已撤销本次布局修改')
  }, [flush])

  /** Wait for the newest record to leave `running`, then report its outcome. */
  const waitForCompletion = useCallback(async () => {
    const started = Date.now()
    while (Date.now() - started < 600_000) {
      await new Promise((resolve) => setTimeout(resolve, 1200))
      const state = await fetchState(sessionId)
      applyServerState(state)
      const newest = state.records[0]
      if (newest !== undefined && newest.status !== 'running') {
        if (newest.status === 'failed') {
          setError(newest.error?.message ?? '生成失败')
          setNotice('')
        } else {
          pinnedRef.current = false
          setImageBroken(false)
          setActiveRecordId(newest.id)
          setNotice(`已完成：${newest.width}×${newest.height}，${newest.seconds} 秒`)
        }
        return
      }
    }
    setNotice('等待超时，任务可能仍在 ComfyUI 队列中')
  }, [sessionId, applyServerState])

  const runGenerate = useCallback(async () => {
    if (busy) return
    setBusy(true)
    setError('')
    setNotice('已提交，等待 ComfyUI 出图…')
    try {
      const { status, body } = await generate(sessionId, revisionRef.current)
      if (status === 409 && body !== null) {
        revisionRef.current = body.revision
        setRevision(body.revision)
        setParams(body.params)
        dirtyRef.current = false
        setNotice('草稿已更新，请确认后再生成')
        return
      }
      if (status === 429) {
        setNotice('上一次生成还在进行')
        return
      }
      if (status !== 202) {
        setError(body?.message ?? `生成请求失败（${status}）`)
        return
      }
      await waitForCompletion()
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : String(problem))
    } finally {
      setBusy(false)
    }
  }, [busy, sessionId, waitForCompletion])

  /** Re-run a failed record with the parameters it was created with. */
  const retryRecord = useCallback(async (record) => {
    if (busy || record === null || record === undefined) return
    setBusy(true)
    setError('')
    setNotice('已按这条记录重试，等待出图…')
    try {
      // No revision: the point of a retry is the recorded parameters, not the
      // draft someone may have edited since.
      const { status, body } = await generate(sessionId, undefined, record.params)
      if (status === 429) {
        setNotice('上一次生成还在进行')
        return
      }
      if (status !== 202) {
        setError(body?.message ?? `重试失败（${status}）`)
        return
      }
      await waitForCompletion()
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : String(problem))
    } finally {
      setBusy(false)
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
    setParams(activeRecord.params)
    dirtyRef.current = true
    if (saveTimer.current !== null) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => { void flush(activeRecord.params) }, SAVE_DELAY_MS)
    setNotice(`已载入 ${activeRecord.id} 的参数`)
  }, [activeRecord, flush])

  const removeRecordById = useCallback(async (id) => {
    try {
      const { status, body } = await deleteRecord(id)
      if (status === 409) {
        // The engine is still writing this record; deleting it would drop the image.
        setError(body?.message ?? '这条记录还在生成，等它结束再删')
        return
      }
      if (status !== 200) {
        setError(body?.message ?? `删除失败（${status}）`)
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
        setError('置顶/归档需要新版宿主：重启应用后生效（当前进程还是旧版本）')
        return
      }
      if (status !== 200) {
        setError(body?.message ?? `标记失败（${status}）`)
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
    if (loadingMore || nextBefore === null || query.trim() !== '') return
    setLoadingMore(true)
    try {
      const page = await fetchRecords(40, nextBefore)
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
  }, [loadingMore, nextBefore])

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
        {error !== '' ? `读取失败：${error}` : '正在读取 moss studio 状态…'}
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
          <button type="button" style={iconOnly} title="新建空草稿" aria-label="新建草稿" onClick={newDraft}>
            <Icon name="add" />
          </button>
          <button
            type="button"
            title={`${comfy?.ok ? `ComfyUI ${comfy.version} · ${comfy.url ?? ''}` : `连不上 ComfyUI${comfy?.error ? `：${comfy.error}` : ''}`}（点击重新检测）`}
            aria-label="重新检测 ComfyUI"
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
            {comfy === null ? '连接中' : comfy.ok ? `ComfyUI ${comfy.version}` : 'ComfyUI 离线'}
          </button>
          {/* Session ids are long and meaningless at a glance; say which draft
              this is, and keep the exact id in the tooltip. */}
          <span style={{ fontSize: 10, ...dim, whiteSpace: 'nowrap' }} title={`草稿会话：${sessionId}`}>
            {sessionId === 'root' ? '根草稿' : sessionId === 'global' ? '未绑定会话' : '对话草稿'}
          </span>
          {/* Live memory, not the draft summary: while a job runs, what matters is
              whether the model stack still fits. */}
          <span
            title={`显存 ${gigabytes(comfy?.gpu?.vramTotal)} GB 总量，内存 ${gigabytes(comfy?.ramTotal)} GB 总量`}
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
              显存 {gigabytes(comfy?.gpu?.vramTotal === undefined ? undefined : comfy.gpu.vramTotal - (comfy.gpu.vramFree ?? 0))}
              /{gigabytes(comfy?.gpu?.vramTotal)} G
            </span>
            <span>
              内存 {gigabytes(comfy?.ramTotal === undefined ? undefined : comfy.ramTotal - (comfy.ramFree ?? 0))}
              /{gigabytes(comfy?.ramTotal)} G
            </span>
          </span>
        </div>
        <div style={{ ...row, gap: 4, flexShrink: 0 }}>
          <span style={{ fontSize: 10, ...dim }}>{saving ? '保存中…' : `revision ${revision}`}</span>
          <button type="button" style={iconOnly} title="设置" aria-label="设置" onClick={() => setSettingsOpen(true)}>
            <Icon name="settings" />
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <div
          className="moss-scroller"
          style={{
            width: wide ? 280 : 196,
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
              历史 {visibleRecords.length}
              {mergedRecords.length > visibleRecords.length ? ` / ${mergedRecords.length}` : ''}
            </span>
            <div style={{ ...row, gap: 4 }}>
              <FilterChip
                selected={flagLocalOnly}
                label="本会话"
                title={flagLocalOnly ? '显示全部会话的记录' : '只看本会话的记录'}
                onClick={() => setLocalOnly((value) => !value)}
              />
              <FilterChip
                selected={showArchived}
                label="归档"
                title={showArchived ? '隐藏已归档的记录' : '显示已归档的记录'}
                onClick={() => {
                  setShowArchived((value) => !value)
                  setOlder([])
                  setNextBefore(null)
                }}
              />
            </div>
          </div>
          <div style={{ padding: '0 6px 6px' }}>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索提示词或记录号"
              style={{ ...input, width: '100%', boxSizing: 'border-box', fontSize: 11 }}
            />
          </div>

          {pinnedRecords.length > 0 ? (
            <div style={{ padding: '0 6px 6px', borderBottom: '1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.22))', marginBottom: 6 }}>
              <div style={{ fontSize: 10, ...dim, marginBottom: 4 }} title={pinnedTruncated ? '置顶超过 50 条，只显示最近 50 条' : undefined}>
              置顶 {pinnedRecords.length}
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
                  ? `没有匹配「${query.trim()}」的记录`
                  : flagLocalOnly
                    ? '这个会话还没有记录（可以关掉「本会话」看全部）'
                    : '还没有记录'}
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

            {nextBefore !== null && needle === '' ? (
              <div style={{ textAlign: 'center', padding: '4px 0 8px' }}>
                <button type="button" style={iconButton} onClick={() => void loadMore()} disabled={loadingMore}>
                  {loadingMore ? '加载中…' : '加载更多'}
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div>
              <div style={{ ...row, justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={label}>提示词</span>
              </div>
              <textarea
                value={params.prompt}
                onChange={(event) => update({ prompt: event.target.value })}
                placeholder="整图描述；框内细节写在每个框的 desc 里"
                rows={4}
                style={{ ...input, width: '100%', resize: 'vertical', lineHeight: 1.5 }}
              />
            </div>

            <div>
              <div style={{ ...row, justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ ...label, minWidth: 0 }}>布局框 {boxes.length}</span>
                <div style={{ ...row }}>
                  <button
                    type="button"
                    style={iconOnly}
                    title={showCanvas ? '折叠预览' : '展开预览'}
                    aria-label={showCanvas ? '折叠预览' : '展开预览'}
                    onClick={() => setShowCanvas((value) => !value)}
                  >
                    <Icon name={showCanvas ? 'unfold_less' : 'unfold_more'} />
                  </button>
                  <button
                    type="button"
                    style={iconOnly}
                    title="编辑布局"
                    aria-label="编辑布局"
                    onClick={openEditor}
                  >
                    <Icon name="dashboard_customize" />
                  </button>
                </div>
              </div>
              {showCanvas ? (
                <div
                  onClick={openEditor}
                  title="点击打开布局编辑器"
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
                  <span style={label}>尺寸</span>
                  <input
                    type="number"
                    min={16}
                    step={16}
                    value={widthText}
                    onChange={(event) => setWidthText(event.target.value)}
                    onBlur={() => commitSize(widthText, heightText)}
                    aria-label="宽度"
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
                    aria-label="高度"
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
                    aria-label="常用尺寸"
                    style={{ ...input, flex: '0 0 96px', width: 96 }}
                  >
                    <option value="" style={optionStyle}>预设</option>
                    {SIZE_PRESETS.map((size) => <option key={size} value={size} style={optionStyle}>{size}</option>)}
                  </select>
                </div>
                {sizeHint !== null ? (
                  <div style={{ fontSize: 10, color: 'var(--dsw-alias-state-error-primary, #ff8f7a)', margin: '2px 0 0 34px' }}>{sizeHint}</div>
                ) : null}
              </div>
              <label style={row}>
                <span style={label}>步数</span>
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
                <span style={label}>负向提示词</span>
              </div>
              <textarea
                value={params.negative}
                onChange={(event) => update({ negative: event.target.value })}
                placeholder="不希望出现的内容，逗号分隔"
                rows={2}
                style={{ ...input, width: '100%', display: 'block', resize: 'vertical', lineHeight: 1.5 }}
              />
            </div>

            <IconCheckbox
              checked={params.enhance}
              disabled={boxes.length > 0}
              onChange={(event) => update({ enhance: event.target.checked })}
              label="先用本地 9B 扩写提示词（有框时不可用）"
            />
          </div>

          <div style={{ borderTop: '1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.22))', padding: '6px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ ...row, flexWrap: 'wrap' }}>
              <button type="button" style={primary} disabled={busy || otherBusy || sizeHint !== null} onClick={generateRandom}>
                {busy ? `生成中 ${elapsed}s${phase === '' ? '' : ` · ${PHASE_LABEL[phase] ?? phase}`}` : otherBusy ? '另一会话正在生成' : '随机 seed 生成'}
              </button>
              <button type="button" style={button} disabled={busy || otherBusy || sizeHint !== null} onClick={() => void runGenerate()}>用当前 seed 生成</button>
              {running !== undefined && !busy ? <span style={{ fontSize: 11, ...dim }}>队列中 · {running.id.slice(-4)}</span> : null}
              {sizeHint !== null ? <span style={{ fontSize: 11, color: 'var(--dsw-alias-state-error-primary, #ff8f7a)' }}>尺寸无效，未保存</span> : null}
            </div>
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
        title="拖动调整高度，双击收起/展开"
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
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          background: 'var(--dsw-alias-bg-layer-1, rgba(127,127,127,0.06))',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '2px 8px 0', flexShrink: 0 }}>
          <span style={{ fontSize: 11, ...dim }}>结果</span>
          <span style={{ flex: 1 }} />
          <button
            type="button"
            style={iconOnly}
            title={resultCollapsed ? '展开结果区' : '收起结果区'}
            aria-label={resultCollapsed ? '展开结果区' : '收起结果'}
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
          selected={selectedBox}
          onSelect={setSelectedBox}
          onChange={(next) => update({ boxes: next })}
          onAdd={addBox}
          onRemove={removeBox}
          onToggleCharacter={toggleCharacter}
          onClose={closeEditor}
          onCancel={cancelEditor}
        />
      ) : null}

      {pendingDelete !== null ? (
        <ConfirmDialog
          title="删除这条记录？"
          message="记录与图片会一起删除，无法恢复。"
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
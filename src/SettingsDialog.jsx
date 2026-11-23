import React, { useCallback, useEffect, useId, useRef, useState } from 'react'
import { fetchSettings, saveSettings } from './api.js'
import { Icon } from './icons.jsx'
import { ScopeStyles } from './ScopeStyles.jsx'
import { useDialogFocus } from './useDialogFocus.js'

const row = { display: 'flex', alignItems: 'center', gap: 6 }
const dim = { color: 'var(--dsw-alias-label-secondary, inherit)' }
const input = {
  flex: 1,
  minWidth: 0,
  boxSizing: 'border-box',
  padding: '5px 7px',
  fontSize: 12,
  color: 'inherit',
  background: 'var(--dsw-alias-bg-layer-1, rgba(127,127,127,0.10))',
  border: '1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.22))',
  borderRadius: 6,
  fontFamily: 'inherit',
}
const button = {
  padding: '4px 12px',
  fontSize: 12,
  color: 'inherit',
  background: 'var(--dsw-alias-bg-layer-2, rgba(127,127,127,0.14))',
  border: '1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.24))',
  borderRadius: 6,
  cursor: 'pointer',
}
const primary = {
  ...button,
  background: 'var(--dsw-alias-button-primary-fill, rgba(120,190,145,0.92))',
  borderColor: 'transparent',
  color: 'var(--dsw-alias-button-primary-label, #0d120f)',
  fontWeight: 600,
}

/**
 * Settings dialog.
 *
 * Only values that can take effect without a remount are editable here; the
 * wiring row (data directory, workflow template, timeouts) is shown read-only
 * because changing it means rebuilding host state on restart.
 */
export function SettingsDialog({ onClose, onSaved }) {
  const [loading, setLoading] = useState(true)
  const [comfyUrl, setComfyUrl] = useState('')
  const [retention, setRetention] = useState('0')
  const [defaults, setDefaults] = useState({ size: '1024x1024', steps: '25', cfg: '2.5', negative: '' })
  const [editable, setEditable] = useState(false)
  const [wiring, setWiring] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const titleId = useId()
  const cardRef = useRef(null)
  const urlRef = useRef(null)
  useDialogFocus(cardRef, { initialFocus: urlRef })

  useEffect(() => {
    let alive = true
    void (async () => {
      try {
        const state = await fetchSettings()
        if (!alive) return
        setComfyUrl(state.settings?.comfyUrl ?? '')
        setRetention(String(state.settings?.retention ?? 0))
        setDefaults({
          size: state.settings?.defaults?.size ?? '1024x1024',
          steps: String(state.settings?.defaults?.steps ?? 25),
          cfg: String(state.settings?.defaults?.cfg ?? 2.5),
          negative: state.settings?.defaults?.negative ?? '',
        })
        setEditable(state.settings?.editable === true)
        setWiring(state.wiring ?? null)
        setError('')
      } catch (problem) {
        if (alive) setError(problem instanceof Error ? problem.message : String(problem))
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [])

  useEffect(() => {
    function onKey(event) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const save = useCallback(async () => {
    setSaving(true)
    setError('')
    setNotice('')
    try {
      const result = await saveSettings({
        comfyUrl,
        retention: Number(retention) || 0,
        defaults: {
          size: defaults.size,
          steps: Number(defaults.steps),
          cfg: Number(defaults.cfg),
          negative: defaults.negative,
        },
      })
      if (result.status === 200) {
        const next = result.body?.settings ?? {}
        setComfyUrl(next.comfyUrl ?? comfyUrl)
        setNotice('已保存，下一次生成与新草稿就用新设置')
        onSaved?.(next.comfyUrl ?? comfyUrl)
      } else {
        setError(result.body?.message ?? `保存失败（${result.status}）`)
      }
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : String(problem))
    } finally {
      setSaving(false)
    }
  }, [comfyUrl, retention, defaults, onSaved])

  return (
    <div
      className="moss-studio"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 80,
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
          width: 'min(92vw, 520px)',
          maxHeight: 'min(88vh, 640px)',
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
          <span id={titleId} style={{ fontSize: 13 }}>Moss studio 设置</span>
          <button type="button" style={{ ...button, padding: 4, border: 'none', background: 'transparent' }} aria-label="关闭设置" title="关闭" onClick={onClose}>
            <Icon name="close" size={16} />
          </button>
        </div>

        <div style={{ padding: '10px 12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {loading ? <div style={{ ...dim }}>读取中…</div> : null}

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ ...dim, fontSize: 11 }}>ComfyUI 地址</span>
            <input
              ref={urlRef}
              value={comfyUrl}
              onChange={(event) => { setComfyUrl(event.target.value); setNotice('') }}
              onKeyDown={(event) => { if (event.key === 'Enter') void save() }}
              disabled={!editable || saving}
              placeholder="http://127.0.0.1:8188"
              aria-label="ComfyUI 地址"
              style={input}
            />
            <span style={{ ...dim, fontSize: 11 }}>
              {editable
                ? '保存后立即生效，下一次生成就用新地址；值会写进 profile 的 cordis.patch.yml。'
                : '当前 profile 没有配置编辑器，这一项只能改 cordis.patch.yml 后重启。'}
            </span>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ ...dim, fontSize: 11 }}>历史保留条数（0 = 不限制）</span>
            <input
              type="number"
              min={0}
              step={10}
              value={retention}
              onChange={(event) => { setRetention(event.target.value); setNotice('') }}
              disabled={!editable || saving}
              aria-label="历史保留条数"
              style={{ ...input, flex: '0 0 120px', width: 120 }}
            />
            <span style={{ ...dim, fontSize: 11 }}>超出时删最旧的；置顶与正在生成的记录不会被删。</span>
          </label>

          <div style={{ borderTop: '1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.22))', paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 11, ...dim }}>新草稿默认值（不影响已有草稿）</span>
            <div style={{ ...row, gap: 6 }}>
              <span style={{ ...dim, fontSize: 11, minWidth: 56 }}>尺寸</span>
              <input
                value={defaults.size}
                onChange={(event) => setDefaults((current) => ({ ...current, size: event.target.value }))}
                disabled={!editable || saving}
                aria-label="默认尺寸"
                style={{ ...input, flex: '0 0 120px', width: 120 }}
              />
              <span style={{ ...dim, fontSize: 11 }}>如 1024x1024</span>
            </div>
            <div style={{ ...row, gap: 6 }}>
              <span style={{ ...dim, fontSize: 11, minWidth: 56 }}>步数</span>
              <input
                type="number"
                min={1}
                max={200}
                value={defaults.steps}
                onChange={(event) => setDefaults((current) => ({ ...current, steps: event.target.value }))}
                disabled={!editable || saving}
                aria-label="默认步数"
                style={{ ...input, flex: '0 0 90px', width: 90 }}
              />
              <span style={{ ...dim, fontSize: 11, minWidth: 32 }}>CFG</span>
              <input
                type="number"
                min={0}
                max={30}
                step={0.1}
                value={defaults.cfg}
                onChange={(event) => setDefaults((current) => ({ ...current, cfg: event.target.value }))}
                disabled={!editable || saving}
                aria-label="默认 CFG"
                style={{ ...input, flex: '0 0 90px', width: 90 }}
              />
            </div>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ ...dim, fontSize: 11 }}>负向提示词</span>
              <textarea
                value={defaults.negative}
                onChange={(event) => setDefaults((current) => ({ ...current, negative: event.target.value }))}
                disabled={!editable || saving}
                rows={2}
                aria-label="默认负向提示词"
                style={{ ...input, resize: 'vertical', fontFamily: 'inherit' }}
              />
            </label>
          </div>

          {wiring !== null ? (
            <div style={{ borderTop: '1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.22))', paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 11, ...dim }}>以下由配置决定，需改 cordis.patch.yml 并重启</span>
              <ReadOnly label="数据目录" value={wiring.dataDir} />
              <ReadOnly label="工作流" value={wiring.workflowPath} />
              <ReadOnly label="超时 / 轮询" value={`${Math.round((wiring.timeoutMs ?? 0) / 1000)} 秒 / ${wiring.pollMs ?? 0} 毫秒`} />
            </div>
          ) : null}

          {notice !== '' ? <div style={{ fontSize: 11, color: 'var(--dsw-alias-state-success-primary, #5fbf7f)' }}>{notice}</div> : null}
          {error !== '' ? <div style={{ fontSize: 11, color: 'var(--dsw-alias-state-error-primary, #ff8f7a)' }}>{error}</div> : null}
        </div>

        <div style={{ ...row, justifyContent: 'flex-end', gap: 6, padding: '8px 12px', borderTop: '1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.22))' }}>
          <button type="button" style={button} onClick={onClose}>关闭</button>
          <button type="button" style={primary} disabled={!editable || saving} onClick={() => void save()}>
            {saving ? '保存中…' : '保存'}
          </button>
        </div>
      </div>
    </div>
  )
}

function ReadOnly({ label, value }) {
  return (
    <div style={{ ...row, alignItems: 'baseline' }}>
      <span style={{ ...dim, fontSize: 11, minWidth: 84 }}>{label}</span>
      <span style={{ fontSize: 11, wordBreak: 'break-all', opacity: 0.85 }}>{value ?? '—'}</span>
    </div>
  )
}

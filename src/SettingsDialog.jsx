import React, { useCallback, useEffect, useState } from 'react'
import { fetchSettings, saveComfyUrl } from './api.js'
import { Icon } from './icons.jsx'
import { ScopeStyles } from './ScopeStyles.jsx'

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
  const [editable, setEditable] = useState(false)
  const [wiring, setWiring] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    let alive = true
    void (async () => {
      try {
        const state = await fetchSettings()
        if (!alive) return
        setComfyUrl(state.settings?.comfyUrl ?? '')
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
      const result = await saveComfyUrl(comfyUrl)
      if (result.status === 200) {
        const next = result.body?.settings?.comfyUrl ?? comfyUrl
        setComfyUrl(next)
        setNotice('已保存，下一次生成就用新地址')
        onSaved?.(next)
      } else {
        setError(result.body?.message ?? `保存失败（${result.status}）`)
      }
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : String(problem))
    } finally {
      setSaving(false)
    }
  }, [comfyUrl, onSaved])

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
          <span style={{ fontSize: 13 }}>Moss studio 设置</span>
          <button type="button" style={{ ...button, padding: 4, border: 'none', background: 'transparent' }} aria-label="关闭设置" title="关闭" onClick={onClose}>
            <Icon name="close" size={16} />
          </button>
        </div>

        <div style={{ padding: '10px 12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {loading ? <div style={{ ...dim }}>读取中…</div> : null}

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ ...dim, fontSize: 11 }}>ComfyUI 地址</span>
            <input
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

          {wiring !== null ? (
            <div style={{ borderTop: '1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.22))', paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 11, ...dim }}>以下由配置决定，需改 cordis.patch.yml 并重启</span>
              <ReadOnly label="数据目录" value={wiring.dataDir} />
              <ReadOnly label="工作流" value={wiring.workflowPath} />
              <ReadOnly label="超时 / 轮询" value={`${Math.round((wiring.timeoutMs ?? 0) / 1000)} 秒 / ${wiring.pollMs ?? 0} 毫秒`} />
              <ReadOnly label="默认步数 / CFG" value={`${wiring.defaults?.steps} / ${wiring.defaults?.cfg}`} />
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

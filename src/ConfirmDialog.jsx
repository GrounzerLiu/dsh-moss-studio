import React, { useEffect, useRef } from 'react'
import { ScopeStyles } from './ScopeStyles.jsx'

const button = {
  padding: '5px 14px',
  fontSize: 12,
  color: 'inherit',
  background: 'var(--dsw-alias-bg-layer-2, rgba(127,127,127,0.14))',
  border: '1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.24))',
  borderRadius: 6,
  cursor: 'pointer',
}
const danger = {
  ...button,
  background: 'var(--dsw-alias-state-error-primary, #d9534f)',
  borderColor: 'transparent',
  color: '#fff',
  fontWeight: 600,
}

/**
 * Confirmation dialog for a destructive action.
 *
 * Deleting a record removes its JSON and its PNG together and there is no undo,
 * so the action goes through a modal instead of a second click: the dialog can
 * show what exactly is about to disappear.
 */
export function ConfirmDialog({ title, message, detail, confirmLabel = '删除', onConfirm, onCancel }) {
  const cancelRef = useRef(null)

  useEffect(() => {
    // Focus the safe choice; Enter on the dialog then cancels rather than deletes.
    cancelRef.current?.focus()
    function onKey(event) {
      if (event.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel])

  return (
    <div
      className="moss-studio"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 90,
        background: 'rgba(0,0,0,0.62)',
        display: 'grid',
        placeItems: 'center',
        padding: 24,
      }}
      onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel() }}
    >
      <ScopeStyles />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{
          width: 'min(92vw, 420px)',
          background: 'var(--dsw-alias-bg-overlay, Canvas)',
          color: 'var(--dsw-alias-label-primary, CanvasText)',
          border: '1px solid var(--dsw-alias-border-l2, rgba(127,127,127,0.28))',
          borderRadius: 12,
          boxShadow: '0 24px 64px rgba(0,0,0,0.45)',
          overflow: 'hidden',
          fontSize: 12,
        }}
      >
        <div style={{ padding: '12px 14px 4px', fontSize: 13 }}>{title}</div>
        <div style={{ padding: '0 14px', lineHeight: 1.7 }}>
          <div>{message}</div>
          {detail !== undefined && detail !== '' ? (
            <div
              style={{
                marginTop: 6,
                padding: '6px 8px',
                borderRadius: 6,
                background: 'var(--dsw-alias-bg-layer-1, rgba(127,127,127,0.10))',
                color: 'var(--dsw-alias-label-secondary, inherit)',
                maxHeight: 96,
                overflow: 'hidden',
                wordBreak: 'break-word',
              }}
            >
              {detail}
            </div>
          ) : null}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, padding: '12px 14px' }}>
          <button type="button" ref={cancelRef} style={button} onClick={onCancel}>取消</button>
          <button type="button" style={danger} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}

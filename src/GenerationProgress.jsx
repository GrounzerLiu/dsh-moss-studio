import React from 'react'
import { t } from './i18n.js'
import { Icon } from './icons.jsx'

const button = {
  padding: '2px 8px',
  fontSize: 11,
  color: 'inherit',
  background: 'var(--dsw-alias-bg-layer-2, rgba(127,127,127,0.14))',
  border: '1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.22))',
  borderRadius: 6,
  cursor: 'pointer',
}

export function generationText(progress) {
  if (progress === null || progress === undefined) return ''
  const position = typeof progress.queuePosition === 'number' && progress.queuePosition > 0
    ? progress.queuePosition
    : null
  if (position !== null) {
    return t('generate.queuePosition', { position, pending: progress.queuePending ?? position })
  }
  if (typeof progress.percent === 'number' && Number.isFinite(progress.percent)) {
    const percent = Math.min(100, Math.max(0, progress.percent))
    return t('generate.percent', { percent: Math.round(percent), step: progress.step ?? '—', maxStep: progress.maxStep ?? '—' })
  }
  const phase = progress.phase ?? 'wait'
  return t(`phase.${phase}`)
}

/** Live state for one record. Kept outside the generate buttons by design. */
export function GenerationProgress({ progress, onCancel, compact = false }) {
  if (progress === null || progress === undefined) return null
  const percent = typeof progress.percent === 'number' && Number.isFinite(progress.percent)
    ? Math.min(100, Math.max(0, progress.percent))
    : null
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0, width: compact ? undefined : '100%' }}>
      <span style={{ fontSize: 11, color: 'var(--dsw-alias-label-secondary, inherit)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {generationText(progress)}
      </span>
      {!compact && percent !== null ? (
        <div
          role="progressbar"
          aria-label={t('generate.progressLabel')}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(percent)}
          style={{ flex: 1, minWidth: 40, height: 4, borderRadius: 2, overflow: 'hidden', background: 'var(--dsw-alias-bg-layer-2, rgba(127,127,127,0.18))' }}
        >
          <div style={{ width: `${percent}%`, height: '100%', background: 'var(--dsw-alias-brand-primary, rgba(120,190,145,0.92))' }} />
        </div>
      ) : null}
      {typeof onCancel === 'function' ? (
        <button type="button" aria-label={t('generate.cancel')} title={t('generate.cancel')} style={{ ...button, padding: compact ? '1px 5px' : '2px 8px' }} onClick={onCancel}>
          {compact ? <Icon name="close" size={12} /> : t('generate.cancel')}
        </button>
      ) : null}
    </div>
  )
}

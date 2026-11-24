import React from 'react'
import { t } from './i18n.js'
import { Icon } from './icons.jsx'
import { imageUrl } from './api.js'
import { downloadName } from './format.js'
import { selectionFill } from './theme.js'

const dim = { color: 'var(--dsw-alias-label-secondary, inherit)' }
const button = {
  padding: '2px 8px',
  fontSize: 11,
  color: 'inherit',
  background: 'var(--dsw-alias-bg-layer-2, rgba(127,127,127,0.14))',
  border: '1px solid var(--dsw-alias-border-l1, rgba(127,127,127,0.22))',
  borderRadius: 6,
  cursor: 'pointer',
}
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

/**
 * The result area.
 *
 * `orientation="column"` is the full-page layout: metadata and actions on top,
 * the image filling the rest of a tall, narrow column. `orientation="row"` is
 * the bottom strip of the narrow sidebar, where width is the scarce axis.
 */
export function ResultPane({
  orientation = 'row',
  shownRecordId,
  shownHasImage,
  shownRunning,
  imageBroken,
  onImageError,
  activeRecord,
  activeRecordId,
  onZoom,
  onLoad,
  onRemove,
  onRetry,
  error,
}) {
  const meta = activeRecord?.result ?? null

  const actions = (
    <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
      {activeRecord?.status === 'failed' ? (
        <button type="button" style={iconOnly} title={t('result.retryTitle')} aria-label={t('result.retry')} onClick={() => onRetry?.(activeRecord)}>
          <Icon name="refresh" size={14} />
        </button>
      ) : null}
      <button type="button" style={iconOnly} title={t('result.loadTitle')} aria-label={t('result.load')} disabled={activeRecord === null} onClick={onLoad}>
        <Icon name="settings_backup_restore" size={14} />
      </button>
      <button
        type="button"
        style={iconDanger}
        title={t('result.deleteTitle')}
        aria-label={t('result.delete')}
        disabled={activeRecordId === null}
        onClick={onRemove}
      >
        <Icon name="delete" size={14} />
      </button>
      {shownRecordId !== null ? (
        <a
          href={imageUrl(shownRecordId)}
          download={downloadName(shownRecordId, activeRecord?.prompt ?? '')}
          title={t('result.downloadTitle')}
          aria-label={t('result.download')}
          style={{ ...iconOnly, textDecoration: 'none' }}
        >
          <Icon name="download" size={14} />
        </a>
      ) : null}
    </div>
  )

  const image = (
    <div
      onClick={() => { if (shownHasImage) onZoom() }}
      style={{
        // The frame is the constraint: the picture fills it and letterboxes
        // itself. Relying on `max-height: 100%` for the <img> meant a percentage
        // against an auto-height box, which left the bottom of tall images
        // clipped once the strip got short.
        position: 'relative',
        flex: 1,
        minHeight: 0,
        minWidth: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--dsw-alias-bg-layer-1, rgba(127,127,127,0.08))',
        borderRadius: 8,
        overflow: 'hidden',
        cursor: shownHasImage ? 'zoom-in' : 'default',
      }}
    >
      {shownRecordId !== null && shownHasImage && !imageBroken ? (
        <img
          src={imageUrl(shownRecordId)}
          alt={t('result.imageAlt')}
          onError={onImageError}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      ) : shownRunning ? (
        <span style={{ fontSize: 12, ...dim }}>{t('generate.pending', { id: shownRecordId.slice(-4) })}</span>
      ) : (
        <span style={{ fontSize: 11, ...dim }}>{imageBroken ? t('result.imageFailed') : t('result.empty')}</span>
      )}
    </div>
  )

  const metaLine = (
    <span style={{ fontSize: 11, ...dim, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
      {activeRecord?.id ?? t('result.noSelection')}
      {meta !== null ? ` · ${meta.width}×${meta.height} · ${meta.seconds}s · seed ${activeRecord?.params?.seed}` : ''}
    </span>
  )

  if (orientation === 'column') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, gap: 6, padding: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          {metaLine}
          <span style={{ flex: 1 }} />
          {actions}
        </div>
        {image}
        {error !== '' ? <div style={{ fontSize: 11, color: 'var(--dsw-alias-state-error-primary, #ff8f7a)' }}>{error}</div> : null}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', height: '100%', minHeight: 0, gap: 8, padding: 8 }}>
      {image}
      <div style={{ width: 168, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 4, fontSize: 11 }}>
        <span style={{ ...dim }}>{activeRecord?.id ?? t('result.noSelection')}</span>
        {meta !== null ? (
          <span style={{ ...dim }}>
            {meta.width}×{meta.height} · {meta.seconds}s · seed {activeRecord?.params?.seed}
          </span>
        ) : null}
        {/* Actions sit next to the metadata, not at the bottom: in a short strip
            the row's foot is the far corner from where the pointer enters. */}
        <div style={{ marginTop: 2 }}>{actions}</div>
        {activeRecord?.error?.message ? <span style={{ color: 'var(--dsw-alias-state-error-primary, #ff8f7a)' }}>{activeRecord.error.message}</span> : null}
        {error !== '' ? <div style={{ fontSize: 11, color: 'var(--dsw-alias-state-error-primary, #ff8f7a)' }}>{error}</div> : null}
      </div>
    </div>
  )
}
import React from 'react'
import { Icon } from './icons.jsx'
import { selectionFill } from './theme.js'

/**
 * A Material 3 style filter chip.
 *
 * Unselected: outlined, quiet text. Selected: tonal container, brand border,
 * leading check and stronger text — the same shape Compose gives FilterChip,
 * so "which filters are on" reads at a glance without a checkbox.
 */
export function FilterChip({ selected, label, onClick, title, disabled = false }) {
  return (
    <button
      type="button"
      title={title}
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 3,
        height: 24,
        padding: selected ? '0 8px 0 5px' : '0 9px',
        borderRadius: 8,
        fontSize: 11,
        lineHeight: 1,
        whiteSpace: 'nowrap',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        color: selected ? 'inherit' : 'var(--dsw-alias-label-secondary, rgba(200,200,200,0.75))',
        background: selected ? selectionFill(20) : 'transparent',
        border: `1px solid ${selected
          ? 'var(--dsw-alias-brand-primary, rgba(120,190,145,0.8))'
          : 'var(--dsw-alias-border-l1, rgba(127,127,127,0.28))'}`,
        transition: 'background 120ms ease, border-color 120ms ease',
      }}
    >
      {selected ? <Icon name="check" size={13} /> : null}
      {label}
    </button>
  )
}
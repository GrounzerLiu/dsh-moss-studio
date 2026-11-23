import React, { useState } from 'react'
import { Icon } from './icons.jsx'

/**
 * A checkbox drawn with Material Symbols instead of the platform control.
 *
 * The real `<input type="checkbox">` stays in the tree — focusable, labelled,
 * and the only thing a click toggles — but is visually hidden; the icon mirrors
 * its state so the control follows the theme and matches the icon buttons.
 */
export function IconCheckbox({ checked, onChange, label, disabled = false, title, style }) {
  const [focused, setFocused] = useState(false)

  return (
    <label
      title={title}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        position: 'relative',
        ...style,
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          margin: 0,
          padding: 0,
          opacity: 0,
          pointerEvents: 'none',
        }}
      />
      <span
        aria-hidden="true"
        style={{
          display: 'inline-flex',
          borderRadius: 4,
          outline: focused ? '2px solid var(--dsw-alias-brand-primary, rgba(120,190,145,0.9))' : 'none',
          outlineOffset: 1,
          color: checked
            ? 'var(--dsw-alias-brand-primary, rgba(120,190,145,0.92))'
            : 'var(--dsw-alias-label-secondary, rgba(127,127,127,0.9))',
        }}
      >
        <Icon name={checked ? 'check_box' : 'check_box_outline_blank'} size={16} />
      </span>
      {label === undefined ? null : <span style={{ fontSize: 11 }}>{label}</span>}
    </label>
  )
}
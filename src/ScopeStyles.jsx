import React from 'react'

/**
 * Focus styling for the studio surface.
 *
 * The host paints a 2px `:focus-visible` ring for every focused element, and a
 * read-write field keeps the business color. Inside a narrow panel that reads as
 * a box drawn around the whole column rather than around the field, so the
 * studio paints its own indicator instead: containers show nothing, fields show
 * a soft ring on their own border.
 *
 * Rendered as an element so unmounting the panel removes the rules with it.
 */
export function ScopeStyles() {
  return (
    <style>{`
/* The host paints a 2px :focus-visible outline on every focused element and
   keeps it for read-write fields. Combined with a field's own ring that reads
   as two concentric borders, and on a container it boxes the whole row. The
   studio therefore draws exactly one indicator: the field's own ring. */
/* Padding must never add to a stated height: a box with height 100% and padding
   otherwise overflows its slot by exactly the padding, which clipped the result
   picture at the bottom of a short strip. */
.moss-studio,
.moss-studio *,
.moss-studio *::before,
.moss-studio *::after {
  box-sizing: border-box;
}

.moss-studio:focus,
.moss-studio:focus-visible,
.moss-studio *:focus,
.moss-studio *:focus-visible,
.moss-studio *:focus-within,
.moss-studio *:has(:focus-visible) {
  outline: none !important;
}

/* Fields show a soft ring hugging their border, nothing else. */
.moss-studio input:focus,
.moss-studio textarea:focus,
.moss-studio select:focus,
.moss-studio input:focus-visible,
.moss-studio textarea:focus-visible,
.moss-studio select:focus-visible {
  outline: none !important;
  border-color: var(--dsw-alias-state-business-primary, #2f6fed);
  box-shadow: 0 0 0 2px rgba(47, 111, 237, 0.35);
}

/* Native spinners render as a dark box against the dark theme and sit where
   the caret wants to be; the fields are typed into, not stepped by hand. */
.moss-studio input[type=number]::-webkit-outer-spin-button,
.moss-studio input[type=number]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.moss-studio input[type=number] {
  appearance: textfield;
  -moz-appearance: textfield;
}

.moss-studio button:focus-visible {
  outline: none !important;
  box-shadow: 0 0 0 2px rgba(47, 111, 237, 0.35);
}

/* Layout boxes and list rows are keyboard controls too. */
.moss-studio [role="button"]:focus-visible,
.moss-studio [role="listitem"]:focus-visible {
  outline: none !important;
  box-shadow: 0 0 0 2px rgba(47, 111, 237, 0.55);
}
`}</style>
  )
}
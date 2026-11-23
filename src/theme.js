/**
 * Theme helpers shared by the panel, the editor and the canvas.
 *
 * Selection highlights tint the host's brand color. `color-mix()` needs
 * Chromium 111+, so the capability is checked once and a neutral layer color is
 * used instead — the highlight gets flatter, never invisible.
 */
const SUPPORTS_COLOR_MIX = typeof CSS !== 'undefined'
  && typeof CSS.supports === 'function'
  && CSS.supports('color', 'color-mix(in srgb, red 50%, white)')

/** The brand color, with a fallback for themes that do not declare one. */
export const BRAND = 'var(--dsw-alias-brand-primary, rgba(120,190,145,0.9))'

/**
 * A translucent brand fill for selection states.
 * @param {number} percent - how much brand color to keep, 0..100.
 */
export function selectionFill(percent) {
  if (SUPPORTS_COLOR_MIX) {
    return `color-mix(in srgb, var(--dsw-alias-brand-primary, #78be91) ${percent}%, transparent)`
  }
  return 'var(--dsw-alias-bg-layer-2, rgba(127,127,127,0.18))'
}
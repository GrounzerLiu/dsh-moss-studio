import { useEffect, useRef } from 'react'

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

/**
 * Keep keyboard focus inside a modal.
 *
 * A dialog that does not trap Tab lets focus walk into the panel behind it,
 * where the visible result no longer matches what Enter would activate. Focus
 * moves to the first control on open and returns to the opener on close.
 *
 * @param {import('react').RefObject<HTMLElement | null>} containerRef
 * @param {{ initialFocus?: import('react').RefObject<HTMLElement | null>, ready?: boolean }} [options]
 */
export function useDialogFocus(containerRef, options = {}) {
  const ready = options.ready !== false
  const previousRef = useRef(null)
  useEffect(() => {
    const container = containerRef.current
    if (container === null) return undefined
    if (previousRef.current === null && typeof document !== 'undefined') previousRef.current = document.activeElement
    const preferred = options.initialFocus?.current
    const target = ready && preferred?.matches?.(FOCUSABLE) === true
      ? preferred
      : container.querySelector(FOCUSABLE) ?? container
    target.focus?.()

    function onKey(event) {
      if (event.key !== 'Tab') return
      const items = [...(container.querySelectorAll(FOCUSABLE) ?? [])]
        .filter((node) => node.offsetParent !== null || node === document.activeElement)
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    container.addEventListener('keydown', onKey)
    return () => {
      container.removeEventListener('keydown', onKey)
    }
  }, [containerRef, options.initialFocus, ready])

  useEffect(() => () => {
    if (previousRef.current !== null && typeof previousRef.current.focus === 'function') previousRef.current.focus()
  }, [])
}

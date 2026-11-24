import { useSyncExternalStore } from 'react'

import { getRevision, subscribe } from './i18n.js'

/**
 * Re-render the calling component whenever the active language changes.
 *
 * Translation itself is a plain function call, so nothing would repaint on a
 * locale switch without this: the panel keeps whatever text it rendered last.
 * Subscribing at the panel root means one boundary covers every nested dialog,
 * because a state change re-renders the whole subtree.
 */
export function useLocaleRevision() {
  return useSyncExternalStore(subscribe, getRevision, getRevision)
}
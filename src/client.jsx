/**
 * Browser half of Moss studio.
 *
 * Three extension points, no footer button:
 *   - a main panel page (`main` slot, key = panel id) hosting the wide studio,
 *   - its launcher row in the left sidebar (`sidebar.panellist`),
 *   - the narrow right-Sidebar tab for in-conversation work.
 *
 * The panel reads and writes the host routes only; it never touches another
 * plugin's store.
 */
import React from 'react'
import { detectLocale, t } from './i18n.js'
import { StudioPanel } from './App.jsx'
import { BoxCanvas } from './BoxCanvas.jsx'
import { BoxEditor } from './BoxEditor.jsx'
import { ConfirmDialog } from './ConfirmDialog.jsx'
import { SettingsDialog } from './SettingsDialog.jsx'
import { Icon } from './icons.jsx'

const PANEL_ID = 'moss-studio'
const TAB_ID = 'dsh-moss-studio'
const TAB_KIND = 'moss-studio'

/**
 * Keep a panel crash inside the panel: an uncaught render error would cancel
 * the whole slot entry, so the pane would go blank with no explanation.
 */
class PanelBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error !== null) {
      return React.createElement(
        'div',
        { style: { padding: 16, fontSize: 12, opacity: 0.8, lineHeight: 1.6 } },
        React.createElement('div', null, t('Moss studio 面板出错')),
        React.createElement('div', { style: { opacity: 0.7, marginTop: 6 } }, String(this.state.error?.message ?? this.state.error)),
        React.createElement('div', { style: { opacity: 0.55, marginTop: 6 } }, t('刷新页面可重试；参数仍保存在 ~/.dsh/moss-studio。')),
      )
    }
    return this.props.children
  }
}

export function createPlugin() {
  /**
   * The launcher glyph: the plugin's own two-block mark, drawn inline so the
   * sidebar row and the landing cards show something identifiable rather than a
   * generic icon shared with other panels.
   */
  function PanelIcon({ size = 16, active = false }) {
    const edge = typeof size === 'number' && size > 0 ? size : 16
    const brand = active ? 'var(--dsw-alias-brand-primary, #78be91)' : 'currentColor'
    return React.createElement(
      'span',
      {
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: edge,
          height: edge,
          flexShrink: 0,
        },
      },
      React.createElement(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          viewBox: '0 0 24 24',
          width: edge,
          height: edge,
          fill: 'none',
          'aria-hidden': 'true',
          focusable: 'false',
          style: { display: 'block' },
        },
        React.createElement('rect', { x: 2, y: 3, width: 9, height: 18, rx: 2, fill: brand, opacity: 0.9 }),
        React.createElement('rect', { x: 13, y: 3, width: 9, height: 7, rx: 2, fill: brand, opacity: 0.55 }),
        React.createElement('rect', { x: 13, y: 12, width: 9, height: 9, rx: 2, fill: brand, opacity: 0.3 }),
      ),
    )
  }

  /**
   * The full-page studio.
   *
   * The `main` slot is root-scoped and carries no session, while drafts are
   * per-session. Rather than depend on another surface having mounted first,
   * the page owns a stable draft session of its own: "root". The right-Sidebar
   * tab keeps the conversation's session, and an agent can address the root
   * draft explicitly with sessionId: "root".
   */
  const ROOT_SESSION = 'root'
  function StudioMainPanel() {
    function Main() {
      return React.createElement(StudioPanel, { sessionId: ROOT_SESSION, wide: true })
    }
    return Main
  }
  return {
    // Internal seam for tests and embedding; the loader ignores it.
    components: { StudioPanel, BoxEditor, BoxCanvas, ConfirmDialog, SettingsDialog },
    inject: ['slots', 'sidebarRightTabs', 'sidebarRight'],
    apply(ctx) {
      // Follow the app language when it is available, then the document, then the
      // browser; anything that is not English falls back to Chinese.
      try {
        const locale = typeof ctx.get === 'function' ? ctx.get('locale') : ctx.locale
        const tag = locale?.current?.() ?? locale?.current ?? locale?.language
          ?? (typeof document === 'undefined' ? undefined : document.documentElement?.lang)
          ?? (typeof navigator === 'undefined' ? undefined : navigator.language)
        detectLocale(tag)
      } catch { /* a missing locale service must not block the panel */ }

      /**
       * Register one extension point in isolation.
       *
       * A single rejected registration used to abort the rest of `apply`, which
       * silently removed later surfaces (a missing sidebar icon was the visible
       * symptom). Each one now stands alone and reports its own failure.
       */
      const safe = (label, run) => {
        try {
          ctx.effect(run, label)
        } catch (error) {
          console.error(`[moss-studio] ${label} 注册失败`, error)
        }
      }

      // Slot owners appear later than apply(), so the registration itself runs
      // inside a callback: guard that callback too, or one failure still takes
      // down every registration queued after it.
      const injectInto = (owner, label, register) => safe(label, () => {
        if (typeof ctx.slots?.inject !== 'function') throw new Error('slots.inject unavailable')
        return ctx.slots.inject(owner, () => {
          try {
            return register()
          } catch (error) {
            console.error(`[moss-studio] ${label} 注册失败`, error)
            return () => {}
          }
        })
      })

      safe('moss-studio: tab type', () => ctx.sidebarRightTabs.register({
        id: TAB_ID,
        kind: TAB_KIND,
        priority: 'extension',
        // The contract reads `title(address)` and calls guide titles, so both are functions.
        title: () => 'Moss studio',
        guide: [{
          id: 'moss-studio',
          order: 100,
          title: () => 'Moss studio',
          description: () => t('本机 MOSS-Image 生图：历史、框位、参数'),
          // The start page cards render this; a guide entry without one is the only
          // card in the grid with a blank leading slot.
          icon: PanelIcon,
        }],
      }))

      injectInto('sidebar.right.pane.tab', 'moss-studio: panel body', () => ctx.slots.register(
        {
          name: 'sidebar.right.pane.tab',
          key: TAB_ID,
          inject: (sessionId) => ({ sessionId }),
        },
        StudioPanel,
      ))

      // Icon first: the sidebar row and the landing page both read it, and it must
      // not depend on the heavier surfaces below.
      injectInto('sidebar.panellist', 'moss-studio: sidebar icon', () => ctx.slots.register(
        { name: 'sidebar.panellist', id: PANEL_ID, order: 40, label: () => 'Moss studio' },
        PanelIcon,
      )) 

      const Main = StudioMainPanel()
      injectInto('main', 'moss-studio: main panel', () => ctx.slots.register(
        { name: 'main', key: PANEL_ID },
        Main,
      )) 
    },
  }
}
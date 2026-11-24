# Changelog

## 0.5.1

- Fix: the result picture was clipped at the bottom of a short panel. Measured
  in a real browser, the `height: 100%` result pane added its own 8px padding on
  top of the slot (content-box sizing), so the frame started 8px too low and the
  picture ended 8px past the panel edge. The panel now sets
  `box-sizing: border-box` for its whole subtree, the strip may shrink
  (`flex-shrink: 1`, `max-height: 55%`), and nothing paints outside the panel.
- The picture itself is absolutely positioned inside a relative frame with
  `object-fit: contain`, so its size never depends on a percentage against an
  auto-height box.
- Verified in headless Edge against the real component tree: the image's bottom
  edge stays inside the panel at 300, 220, 170 and 140px panel heights.

## 0.5.0

- i18n moved onto the client locale service: the panel registers a
  `moss-studio` namespace with `ctx.locale.register(NS, { zh, en })` and
  translates through `ctx.locale.bind(NS)`, instead of keeping a private table
  keyed by Chinese text.
- Keys are semantic identifiers (`action.delete`, `history.empty`,
  `settings.comfyUrl`, …) grouped by area, so rewording copy no longer risks a
  silent mapping break, and two meanings of one Chinese string can be
  translated differently.
- Switching the language in the app's settings now re-renders the panel
  immediately. `src/useLocale.js` subscribes with `useSyncExternalStore` once at
  the panel root; previously the language was read a single time when the plugin
  activated, so nothing changed until a reload.
- Fallback ladder is unchanged in spirit: the service's chain (English for an
  unregistered locale), then the Chinese text, then the key itself.
- Timestamps follow the active language instead of always using `zh-CN`.
- 13 multi-line JSX text nodes that the earlier regex pass had missed are
  translated too, so no Chinese copy remains outside the dictionaries.
- Tests: key parity, placeholder parity, full coverage, no Chinese keys, and
  four runtime cases (fallback, registration, subscription, no-service).

## 0.4.3

- Fix: the image viewer's previous/next buttons rendered empty because
  `keyboard_arrow_left` and `keyboard_arrow_right` were never added to the icon
  map. A test now fails when a referenced icon name is missing.
- Fix: clicking a box in the layout preview did nothing. The click handler that
  keeps selection from clearing itself in the editor also stopped the preview's
  click from reaching the wrapper that opens the editor; it is now editor-only,
  and preview boxes no longer show a pointer cursor.

## 0.4.2

- Fix: the host half referenced an undefined `busySession` when building the
  route handler. That throw happened inside a `ctx.effect` callback, so the
  loader only logged it and every studio route stayed unregistered — the panel
  answered every request with 404. `busySession()` is now defined next to
  `busy()`.
- New activation test calls `apply()` with a minimal context and asserts the
  prefix route plus the four tools are registered, so a reference error in
  apply fails the suite instead of the panel.

## 0.4.1

- Fix: `src/api.js` called `t()` without importing it, so any failed request
  surfaced as `t is not defined` instead of the real error. A static test now
  fails when a module translates without importing the translator.
- Error fallbacks use `||` rather than `??`, so an empty server message no
  longer produces a blank error line.

## 0.4.0

Compatibility release for DSH 0.2.3-alpha.2.

- Right-Sidebar tab bodies no longer duplicate `sessionId` through `inject`:
  the slot supplies it as a built-in prop, and the body also reads
  `useTabInfo().tab.sessionId` for hosts that only expose it there. A tab with
  no session still renders against the shared draft.
- `@deepseek-ai/schemastery` raised to `3.20.0-alpha.1` to match the release's
  own copy; the config schema still resolves `comfyUrl` as a volatile ref.
- Left sidebar launcher, main panel, guide entry, websocket-free routes, tools
  and image attachments were re-checked against the new contracts and needed
  no changes.

## 0.3.0

- The panel UI is translated. Chinese text doubles as the translation key, so a
  missing English entry still shows readable text; placeholders use `{name}`.
- Language follows the app locale when the client exposes one, then the document
  language, then the browser; anything that is not English falls back to Chinese.
- Timestamps use the matching locale format.
- Host-side validation messages (errors returned by routes and tools) are still
  Chinese; only the panel is translated so far.

## 0.2.0

First public release. Everything below is in this version.

### Panel

- History column with server-side search, pinning, archiving and a virtualised list that pages backwards.
- Prompt, negative prompt, layout boxes (drag/resize on the canvas, percentages in the editor), size, steps, CFG, seed and the prompt enhancer.
- Custom output sizes: width and height are typed in, validated against the workflow's rules (multiples of 16, 0.25–4 MP) before anything is sent.
- Result pane with load, retry, delete and download; downloads are named after the prompt.
- Image viewer dialog with prev/next, wheel zoom, drag pan and keyboard arrows.
- Status strip: ComfyUI health (click to re-probe), VRAM and RAM, which draft is open, revision.
- Settings dialog: the ComfyUI address, the history retention cap, and the defaults for new drafts. All are volatile config fields, so a change applies to the next generation without a restart.
- Layout preferences (result height, collapsed state, history column width) survive a reload.

### Data

- Records live under `~/.dsh/moss-studio/records/<id>/` as `record.json` plus `image.png`; drafts are per session; both are written atomically.
- Records carry `version: 1` so later shape changes have a migration anchor.
- A running record cannot be deleted, and deletion always asks first.

### Model interface

- `moss_studio_state`, `moss_studio_edit`, `moss_studio_generate`, `moss_studio_history` (list / load / delete / pin / unpin / archive / unarchive).
- Overrides are validated the same way the panel's parameters are; an invalid value is rejected before a record exists.

### Known limitations

- UI copy is Chinese only; `locale/*.json` carries display metadata for the plugin page.
- One generation at a time across all sessions; the panel says which session holds the pipeline.
- Thumbnails use the original image.
- The workflow template is fixed to the nodes its injector knows; changing it requires editing `cordis.patch.yml` and restarting.

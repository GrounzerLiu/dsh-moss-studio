# Changelog

## 0.7.0

Boxes can be locked and hidden — the two states a layout needs once some of it is
settled.

- **Hidden** leaves a box in the draft but out of the request: `injectWorkflow`
  filters it before building `bboxes`, and character marks are remapped to the
  numbering the workflow actually receives. A mark on a hidden box is dropped
  rather than silently pointing at a different box. Hiding every box removes the
  `bboxes` input entirely, which is what the graph expects for a free composition.
- **Locked** keeps a box visible and generatable but refuses to drag or resize it,
  so a finished shape cannot be nudged by accident. It still selects.
- Both toggles sit on every row of the box list and in the single-box inspector;
  hidden boxes are drawn dashed and dimmed on the canvas and struck through in the
  list, locked ones show a lock chip on the canvas badge.
- `sanitizeBox` keeps `locked` and `hidden` through a round trip, so a tool call
  cannot silently re-enable a box the user excluded, and every box carries both
  flags explicitly after any edit.
- Seven workflow tests cover the filtering, the character remap, the empty case
  and the guarantee that locking changes nothing about the request.

## 0.6.2

- Fix: typing in a box description was discarded. `patchBox` handed the patch to
  `updateBoxGeometry`, which rebuilds only x/y/width/height, so every keystroke
  came back as the old text — the field looked read-only and Enter appeared not
  to work. The patch is now merged into the box before the geometry is clamped.
- Fix: the description box ignored its resize grip. It inherited `flex: 1` from
  the shared input style, and in a column flex container that decides the height,
  so dragging the corner changed nothing. It opts out with `flex: 0 0 auto`.
- Two regression tests: an input event with a newline must reach the host, and
  the field must keep both `resize: vertical` and the flex opt-out.

## 0.6.1

Editing a box's description is the point of the layout editor, so it now has room:

- The per-box description (and a text box's text) is a multi-line textarea with
  the browser's own vertical resize grip, instead of a single-line input that
  scrolled a sentence through a 60px window. It starts at three rows and drags to
  at most 260px.
- The prompt in the main panel is a resizeable box too: it starts at 108px, drags
  between 72 and 520, and remembers the height like the other layout choices.
- The history column is now collapsible, and the narrow sidebar starts with it
  closed. At 360px wide the open column left the parameter column about 150px,
  which clipped inputs and squeezed the prompt box to 175px by 82px; with the
  column closed the parameters get the full width. The header gained a history
  toggle that shows the record count.
- A box caption is only drawn on the canvas when the box is wide enough to show
  about four characters. Narrower boxes used to render one letter per line, which
  read as a vertical ribbon.

## 0.6.0

The layout editor now follows the interaction model of bounding-box annotators
rather than a bare "add a box, then drag it" form.

- **Draw to create**: drag anywhere on empty canvas to draw a box; a plain click
  clears the selection. The canvas gained a faint grid to align against.
- **Eight resize handles**: corners and edges, each with its own cursor. Shift
  while dragging a corner keeps the aspect ratio, and the inspector has a lock
  toggle for the same thing.
- **Multi-selection**: shift-click toggles a box in the selection, shift-drag
  marquees everything it touches, and a group moves as one rigid block with a
  dashed bounding box.
- **Smart guides**: while moving, edges and centres snap to the other boxes, the
  frame edges and the canvas centre lines, within 0.8% of the frame; the guide
  line is drawn so the alignment is visible.
- **Align and distribute**: six alignment buttons (left / horizontal centre /
  right / top / vertical centre / bottom) and even spacing on either axis, all
  relative to the selection's own bounds.
- **Numeric inspector**: X, Y, width and height as percentages with a step of 1,
  plus an aspect lock that applies to both the inspector and the handles.
- **Undo / redo**: a 60-step stack with a toolbar pair; drags are one step and
  typing coalesces within 500 ms. `Ctrl+Z`, `Ctrl+Shift+Z` and `Ctrl+Y`.
- **Shortcuts**: `Delete` removes the selection, `Ctrl+D` duplicates it with a
  small offset, `Ctrl+A` selects all, `Tab` / `Shift+Tab` cycle boxes, arrow keys
  nudge by 1% (`Shift`: 10%), and `Esc` clears the selection before closing.
- Character marks follow deletions: removing box 2 renumbers the marks stored as
  1-based positions instead of leaving them pointing at the wrong boxes.
- Geometry work moved into `src/box-math.js` as pure functions (`resizeByHandle`,
  `moveBoxes`, `selectionBounds`, `snapBox`, `alignBoxes`, `distributeBoxes`,
  `duplicateBoxes`, `boxFromCorners`) with unit tests; five interaction tests
  drive the editor through synthetic pointer gestures.

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

# Changelog

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

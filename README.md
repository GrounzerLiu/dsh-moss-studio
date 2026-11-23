# dsh-moss-studio

A DSH sidebar workbench for the local ComfyUI MOSS-Image layout workflow: history on the left, prompt / boxes / parameters on the right, the result underneath. The panel and the model share one draft, so an edit from either side shows up on the other.

## Layout

```
index.js                 host: store, generation pipeline, tools, routes
lib/storage.js           drafts, records, settings under ~/.dsh/moss-studio
lib/engine.js            one generation with progress callbacks
lib/tools.js             moss_studio_state / edit / generate / history
lib/routes.js            same-origin HTTP surface for the panel
lib/workflow.js          size rules, box conversion, graph injection
lib/comfy.js             ComfyUI HTTP client
src/App.jsx              panel: history, parameters, result
src/BoxCanvas.jsx        drag/resize canvas
src/box-math.js          pure geometry (tested without a DOM)
src/client.jsx           main panel, sidebar launcher, right-Sidebar tab
src/SettingsDialog.jsx   settings dialog (ComfyUI address, read-only wiring)
src/size.js              width/height validation shared with the panel
src/ResultPane.jsx       result column (wide page) and bottom strip (narrow)
lib/settings.js          ComfyUI URL normalisation and settings payload
client.js                built bundle (run scripts/build-client.mjs)
scripts/build-client.mjs esbuild wrapper that emits the ModuleLoader shape
```

Only Node built-ins are imported by the host half. The plugin lives outside the profile tree, where bare `@deepseek-ai/*` specifiers do not resolve.

## What it does

- History with search, pinning and archiving; the list is virtualised and pages backwards.
- Prompt, negative prompt, boxes (drag/resize on the canvas or type percentages in the editor), size, steps, CFG, seed and the prompt enhancer.
- Custom sizes: type width and height (multiples of 16, 0.25–4 MP) or pick a preset.
- Result pane with load / retry / delete / download; download names carry a prompt slice.
- Image viewer with prev/next, wheel zoom, drag pan and keyboard arrows.
- Status strip: ComfyUI health (click the pill to re-probe), VRAM and RAM, draft scope, revision.
- Settings dialog: the ComfyUI address is a volatile config field, so a new address applies to the next generation without a restart.
- Settings also hold the history retention cap (0 = unlimited; pinned and running records are never pruned) and the defaults for new drafts (size, steps, CFG, negative prompt).
- Layout choices — result height, collapsed state, history column width — are remembered per browser.

## Build the client bundle

```bash
npm install
node scripts/build-client.mjs
```

The bundle wraps esbuild's CommonJS output in `window.__ModuleLoader__.load({ id, factory })`, with React taken from the loader's `require`.

## Test

```bash
node --test test/
```

Covers the store (revisions, conflicts, records), the tools, every route, the client registration, a jsdom render of the panel, and the canvas geometry. No test talks to ComfyUI.

## Install (manual)

1. Add `"dsh-moss-studio": "link:D:/dsh-plugins/dsh-moss-studio"` to the desktop profile's dependencies and `dsh-moss-studio` to `dsh.profile.bundles`.
2. Create the junction: `node -e 'require("fs").symlinkSync("D:/dsh-plugins/dsh-moss-studio", "<profile>/node_modules/dsh-moss-studio", "junction")'`.
3. Restart the app, or let the profile reload pick it up.

## Configuration

```yaml
- id: moss-studio
  name: dsh-moss-studio
  config:
    comfyUrl: http://127.0.0.1:8188
    steps: 25
    cfg: 2.5
    timeoutMs: 600000
    pollMs: 1000
```

`dataDir` and `workflowPath` are optional overrides; the defaults are `~/.dsh/moss-studio` and the bundled API workflow.

## Tool notes

`moss_studio_generate` merges its `overrides` into the current draft: a call that only passes `prompt` also inherits the draft's boxes, size, steps and seed. That is deliberate — the everyday flow is "keep the layout, ask the model for another caption" — so pass `boxes: []` when you want a plain text-to-image run.

## Limits

- The panel polls `/state` every 1.5 seconds; it is not push-based yet.
- One generation at a time.
- Thumbnails are the full images.
- Panel copy is hard-coded Chinese.

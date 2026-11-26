# dsh-moss-studio

A sidebar workbench for DeepSeek Harness (DSH) that drives the local ComfyUI MOSS-Image layout workflow: history on the left, prompt and layout boxes on the right, the result underneath. The panel and the model share one draft — edit the prompt in the UI and the agent sees it immediately; let the agent change the layout and the panel follows.

[中文版](README.md)

## What it needs

The plugin ships only Node code and a browser panel. No models, no binaries. Three prerequisites:

**1. DSH**  
A build that provides the `sidebar.panellist`, `main`, and `sidebar.right.pane.tab` slots, and the `ui-sidebar` / `ui-sidebar-right` client bundles to inject into. Verified end to end on **0.2.3-alpha.2**. Panel copy prefers the host's locale service and falls back to Chinese when there is none.

**2. ComfyUI that can run the official template**  
The plugin submits an API copy of ComfyUI's official **"MOSS-Image: 版式控制生图"** template (`image_moss_image_t2i_bboxes.json`): top level 9 SaveImage, 19 ResolutionSelector, 25 CreateBoundingBoxes, 27 MOSSImageLayoutPrompt, plus 18:7 KSampler and 18:16 ComfySwitchNode inside the subgraph.

So if a ComfyUI can open that template and render one image with its defaults, the nodes and all three models are in place and the plugin will work. Quick check:

```bash
for n in CreateBoundingBoxes MOSSImageLayoutPrompt ResolutionSelector; do
  echo "$n $(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8188/object_info/$n)"
done
```

Three 200s is all you need. Verified here on ComfyUI **0.46.2** with template package 0.11.114.

Note there is also `image_moss_image_base_t2i_bboxes` (the Base variant) with node ids 33/34/36 — not the one this plugin expects. Use the non-Base template.

**3. Hardware**  
Measured on this machine (RTX 5060 Laptop, 8 GB VRAM, 16 GB RAM): 512×512 at 6 steps ≈ 18 s; 1024×1024 at 25 steps ≈ 48 s; VRAM peaks around 6.6 GB. Less VRAM works with `--lowvram` and smaller sizes.

## Install

Published on npm as `dsh-moss-studio`.

**1. From npm (recommended)**

Use the host's plugin installation entry (in this repository, `plugin_manager`'s
`install_bundle`) and give it the package name; pin a version with
`dsh-moss-studio@0.8.3`.

Then add `dsh-moss-studio` to the profile's `dsh.profile.bundles` and restart the
app. The `dsh.bundle.patch`, `dsh.client.inject` and `dsh.engines.dsh` fields are
read by the host, so no slot wiring is done by hand.

**2. From an offline tarball** (air-gapped, or no registry access)

```bash
npm i ./dsh-moss-studio-0.8.3.tgz      # run inside the profile directory
```

Then add `dsh-moss-studio` to `dsh.profile.bundles` and restart.

**3. From a source checkout** (edits apply after a restart; for development)

1. Add `"dsh-moss-studio": "link:D:/dsh-plugins/dsh-moss-studio"` to the profile's dependencies and `dsh-moss-studio` to `dsh.profile.bundles`;
2. Run `npm install` once inside the plugin directory;
3. Create the junction: `node -e 'require("fs").symlinkSync("D:/dsh-plugins/dsh-moss-studio", "<profile>/node_modules/dsh-moss-studio", "junction")'`;
4. Restart the app.

Bundle or client changes always need an app restart — reloading the page is not enough, because the host snapshots `client.js` at startup.

## First run

The data directory defaults to `~/.dsh/moss-studio` and is created on demand; each machine keeps its own.

Open the gear in the panel's top-right and confirm the **ComfyUI address**. It is a volatile config field: a new value applies to the next generation and the next health probe without a restart.

The same dialog also holds:

- the history retention cap (0 = unlimited; pinned and running records are never pruned);
- defaults for new drafts (size, steps, CFG, negative prompt).

The wiring it only displays — data directory, workflow path, timeout, polling interval — needs `cordis.patch.yml` and a restart.

## Using it

**Entry points**: click the Moss studio icon in the left sidebar's panel list to open the full-width page (history / parameters / result). A right-sidebar tab with the same name binds to the current conversation session.

**Draft**: prompt, negative prompt, size, steps, CFG, seed, layout boxes, character marks and the prompt enhancer all live in the draft, isolated per session; history is shared. Edits are saved 500 ms later and persisted to disk.

**Sizes**: type width and height (multiples of 16, 0.25–4 MP) or pick a preset. An invalid pair is rejected before generation instead of reaching ComfyUI.

**Layout boxes**: "编辑布局" opens the editor. Drag on empty canvas to draw, eight handles to resize, shift-click and shift-drag to multi-select, edges and centres snap with guides; the list on the right edits descriptions, align/distribute, numeric X/Y/W/H, aspect lock, duplicate, undo/redo, and reorders by drag or `Alt+↑/↓` while keeping character marks attached. A box can be locked (geometry protected) or hidden (kept in the draft, left out of generation and snapping).

**Generating**: the buttons stay enabled; repeated clicks queue independent records, each with its own progress and cancel. Live progress comes from ComfyUI's websocket (sampler percentage and step count) and `/queue` (exact queue position), and the websocket reconnects on its own. A job's progress appears on its own history row and in the result pane; cancelling affects only that record.

**History**: search, pin, archive, paging, virtualised list. A running record cannot be deleted (409). Records left `running` by a crashed host are marked "宿主重启，任务中断" on the next start, so they can be deleted.

**Result pane**: load parameters, retry a failure, delete, download (file name carries a prompt slice), and a viewer with wheel zoom, drag pan and arrow-key paging.

**Status strip**: ComfyUI version pill (click to re-probe), VRAM and RAM, draft scope, revision.

## Agent tools

| Tool | What it does |
| --- | --- |
| `moss_studio_state` | Reads the draft (with revision), recent records, and **running jobs with progress** |
| `moss_studio_edit` | Patches draft parameters; returns the full draft and new revision; accepts a revision for conflict detection |
| `moss_studio_generate` | Generates from the current draft and returns record id, size, seed, seconds and the images |
| `moss_studio_history` | `list` / `load` / `delete` / `pin` / `unpin` / `archive` / `unarchive` / `cancel` |

`moss_studio_generate` merges `overrides` into the draft: passing only `prompt` inherits the draft's boxes, size, steps and seed — the everyday flow is "keep the layout, ask for another caption". Pass `boxes: []` for a plain text-to-image run.

`cancel` requires a `recordId` and only cancels a running job of the calling session; a finished job answers "没有正在运行的任务".

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

| Key | Default | Meaning |
| --- | --- | --- |
| `comfyUrl` | `http://127.0.0.1:8188` | ComfyUI base URL; editable in the panel |
| `workflowPath` | empty | Absolute path to a custom API workflow; empty uses the bundled template |
| `dataDir` | `~/.dsh/moss-studio` | Root for records and drafts |
| `steps` / `cfg` / `negative` | 25 / 2.5 / built in | Generation defaults |
| `retention` | 0 | Records to keep, 0 = unlimited |
| `defaultSize` / `defaultSteps` / `defaultCfg` / `defaultNegative` | 1024x1024 / 25 / 2.5 / built in | New-draft defaults; editable in the panel |
| `timeoutMs` | 600000 | Per-generation timeout; queue wait does not count, hard cap is four times the limit |
| `pollMs` | 1000 | ComfyUI polling interval |

Hand-edited YAML is validated too: steps 1–200, CFG 0–30, retention 0–5000, pollMs 20–60000, negative ≤2000 characters. Invalid values fail at load instead of being silently floored.

## Data

```
~/.dsh/moss-studio/
  records/<id>/record.json   parameters, status, result metadata
  records/<id>/image.png     the image itself
  drafts/<session>.json      per-session draft and revision
```

The HTTP surface lives under `/plugins/dsh-moss-studio` (same origin): `/state`, `/draft`, `/generate`, `/generate/cancel`, `/records`, `/image/:id`, `/health`, `/events` (SSE).

## Limits

- Injection points are eight fixed node ids; a structurally different workflow will not fit. `workflowPath` is an escape hatch, not a visual editor.
- At most 24 layout boxes; sizes must be multiples of 16 between 0.25 and 4 MP.
- Thumbnails are the original images (lazy-loaded), so a large history costs bandwidth.
- One ComfyUI endpoint per plugin row; any reachable http/https address is fine, but credentials in the URL are rejected.
- Panel copy follows the host locale (Chinese and English); host-side validation errors stay in the host's language.
- Draft conflicts require an explicit choice (use the server version or overwrite); nothing is merged automatically.

## Development

The npm package ships runtime files only (`client.js` is a build artifact); clone
the repository to change anything:

```bash
git clone https://github.com/GrounzerLiu/dsh-moss-studio.git
cd dsh-moss-studio
npm install
node scripts/build-client.mjs   # emit client.js
node --test test/               # 207 tests
```

Client changes must be rebuilt and the app restarted; `client.js` is a build artifact and ships with the package.

Release notes live in [CHANGELOG.md](CHANGELOG.md); implementation details in [docs/DETAIL.md](docs/DETAIL.md).
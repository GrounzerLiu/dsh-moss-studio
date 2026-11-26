# dsh-moss-studio

DeepSeek Harness（DSH）的侧栏生图工作台，跑本机的 ComfyUI MOSS-Image 版式控制工作流：左侧历史，右侧提示词与布局框，下方结果。面板和模型读写同一份草稿——在界面里改提示词，AI 立刻看到；让 AI 改布局，面板同步刷新。

[English version](README.en.md)

## 它依赖什么

插件本身只有 Node 代码和浏览器面板，不含模型、不含二进制。真正的前置条件只有三条：

**1. DSH**  
需要带 `sidebar.panellist`、`main`、`sidebar.right.pane.tab` 插槽的版本，并注入 `ui-sidebar`、`ui-sidebar-right` 两个客户端包。已在 **0.2.3-alpha.2** 上完整验证。国际化优先用宿主自带的 locale 服务，没有就回退中文。

**2. 能跑通官方模板的 ComfyUI**  
插件提交的就是 ComfyUI 官方模板 **「MOSS-Image: 版式控制生图」**（模板文件 `image_moss_image_t2i_bboxes.json`）的 API 副本：顶层 9 SaveImage、19 ResolutionSelector、25 CreateBoundingBoxes、27 MOSSImageLayoutPrompt，子图内 18:7 KSampler、18:16 ComfySwitchNode。

所以对方只要能在 ComfyUI 里打开这个模板、用默认设置出一张图，节点和三个模型就都到位了，插件也就能用。自查：

```bash
for n in CreateBoundingBoxes MOSSImageLayoutPrompt ResolutionSelector; do
  echo "$n $(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8188/object_info/$n)"
done
```

三个都返回 200 即可。本机在 ComfyUI **0.46.2**、模板包 0.11.114 上验证。

注意模板库里还有一个 `image_moss_image_base_t2i_bboxes`（Base 变体），节点 id 是 33/34/36，与插件期望的不同。**用的是非 Base 那个。**

**3. 硬件**  
本机实测参考（RTX 5060 Laptop，8 GB 显存 / 16 GB 内存）：512×512、6 步约 18 秒；1024×1024、25 步约 48 秒；出图时显存峰值约 6.6 GB。显存更小也能跑，但要 `--lowvram` 并降尺寸。

## 安装

已发布到 npm，包名 `dsh-moss-studio`。

**1. 从 npm 安装（推荐）**

用宿主的插件安装入口（本仓库对应 `plugin_manager` 的 `install_bundle`），目标填包名即可；要固定版本就写成 `dsh-moss-studio@0.8.3`。

装完把 `dsh-moss-studio` 加进 profile 的 `dsh.profile.bundles`，然后重启应用。包里的 `dsh.bundle.patch`、`dsh.client.inject`、`dsh.engines.dsh` 会被宿主读取，不需要手工配插槽。

**2. 从离线包安装**（内网、或不想连 registry）

```bash
npm i ./dsh-moss-studio-0.8.3.tgz      # 在 profile 目录下执行
```

再把 `dsh-moss-studio` 加进 `dsh.profile.bundles`，重启。

**3. 挂源码**（改代码即时生效，适合开发）

1. profile 的依赖里加 `"dsh-moss-studio": "link:D:/dsh-plugins/dsh-moss-studio"`，`dsh.profile.bundles` 里加 `dsh-moss-studio`；
2. 在插件目录先跑一次 `npm install`；
3. 建 junction：`node -e 'require("fs").symlinkSync("D:/dsh-plugins/dsh-moss-studio", "<profile>/node_modules/dsh-moss-studio", "junction")'`；
4. 重启应用。

改 bundles 或客户端代码后必须重启应用，刷新页面不够（宿主在启动时快照 `client.js`）。

## 首次配置

数据目录默认 `~/.dsh/moss-studio`，会自动创建，每台机器独立。

打开面板右上角齿轮，只需确认 **ComfyUI 地址**。它是 volatile 配置项，改完下一次生成、下一次健康探测就用新值，不用重启。

同一对话框里还能设：

- 历史保留条数（0 = 不限；置顶与生成中的记录永不被清理）；
- 新建草稿的默认尺寸、步数、CFG、负向提示词。

只读展示的是接线信息：数据目录、工作流路径、超时与轮询间隔。这些要改宿主状态，需要编辑 `cordis.patch.yml` 并重启。

## 用法

**入口**：左侧栏的面板列表里点 Moss studio 图标，打开全宽主面板（三列：历史 / 参数 / 结果）。右侧栏也有一个同名标签页，绑定当前对话会话。

**草稿**：提示词、负向、尺寸、步数、CFG、seed、布局框、人物标记、提示词增强都写在草稿里，按会话隔离；历史记录全局共享。改动 500ms 后自动保存，同时写入磁盘。

**尺寸**：直接填宽高（必须是 16 的倍数，0.25–4 MP）或选预设。非法组合会在生成前就报错，不会被送到 ComfyUI。

**布局框**：点「编辑布局」进入编辑器。画布上拖空白画框、八个手柄缩放、Shift 点选与框选多选、边与中线吸附并画参考线；右侧列表可改描述、对齐、分布、数值 X/Y/W/H、等比锁、复制、撤销/重做；列表支持拖拽调序与 `Alt+↑/↓`，人物标记跟着序号走。每个框可锁定（几何不可拖改）或隐藏（留在草稿、不送进工作流、不参与吸附）。

**生成**：按钮始终可用，连点会排多条任务，各自独立进度与取消。进度来自 ComfyUI 的 WebSocket（采样百分比与步数）与 `/queue`（精确排队位置），通道断开会自动重连。每个任务的进度显示在对应的历史行与结果区，取消只作用于那一条。

**历史**：搜索、置顶、归档、翻页，虚拟列表。运行中的记录不能删（返回 409）。上一次宿主异常退出留下的 `running` 记录，会在下次启动时标为「宿主重启，任务中断」，可以直接删。

**结果区**：载入参数、失败重试、删除、下载（文件名带提示词片段）、看图（滚轮缩放、拖动平移、左右键翻页）。

**状态带**：ComfyUI 版本胶囊（点一下重新探测）、显存与内存占用、草稿归属、revision。

## AI 工具

| 工具 | 作用 |
| --- | --- |
| `moss_studio_state` | 读草稿（含 revision）、最近记录、**运行中任务与进度** |
| `moss_studio_edit` | 改草稿参数；返回完整草稿与新 revision；可带 revision 做冲突检测 |
| `moss_studio_generate` | 用当前草稿出图，等结果后返回记录号、尺寸、seed、耗时与图片 |
| `moss_studio_history` | `list` / `load` / `delete` / `pin` / `unpin` / `archive` / `unarchive` / `cancel` |

`moss_studio_generate` 的 `overrides` 是局部合并：只传 `prompt` 会继承草稿里的框、尺寸、步数与 seed（日常就是「布局不变、再想一句提示词」）。要纯文生图，显式传 `boxes: []`。

`cancel` 需要 `recordId`，只能取消本会话正在运行的任务；对已结束的任务返回「没有正在运行的任务」。

## 配置项

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

| 键 | 默认 | 说明 |
| --- | --- | --- |
| `comfyUrl` | `http://127.0.0.1:8188` | ComfyUI 基址；面板可改 |
| `workflowPath` | 空 | 自定义 API 工作流绝对路径；留空用包内模板 |
| `dataDir` | `~/.dsh/moss-studio` | 记录与草稿根目录 |
| `steps` / `cfg` / `negative` | 25 / 2.5 / 内置 | 生成默认参数 |
| `retention` | 0 | 最多保留多少条记录，0 = 不限 |
| `defaultSize` / `defaultSteps` / `defaultCfg` / `defaultNegative` | 1024x1024 / 25 / 2.5 / 内置 | 新草稿的默认值；面板可改 |
| `timeoutMs` | 600000 | 单次生成超时；排队时间不计入，硬上限为四倍 |
| `pollMs` | 1000 | 轮询 ComfyUI 的间隔 |

手改 YAML 也会被校验：步数 1–200、CFG 0–30、保留条数 0–5000、pollMs 20–60000、负向 ≤2000 字，非法值会在加载时报错，不会被悄悄 floor 成 0。

## 数据

```
~/.dsh/moss-studio/
  records/<id>/record.json   参数、状态、结果元信息
  records/<id>/image.png     原图
  drafts/<会话>.json         每会话草稿与 revision
```

HTTP 面挂在 `/plugins/dsh-moss-studio` 下（同源访问）：`/state`、`/draft`、`/generate`、`/generate/cancel`、`/records`、`/image/:id`、`/health`、`/events`（SSE）。

## 限制

- 工作流注入点写死 8 个节点 id，换一份结构不同的工作流必然失配；`workflowPath` 只是逃生口，没有可视化编辑。
- 布局框最多 24 个；尺寸 16 的倍数、0.25–4 MP。
- 缩略图直接用原图（懒加载），历史很多时吃带宽。
- 只连一个 ComfyUI 端点；地址可达即可，但必须是 http/https 且不带账号密码。
- 面板文案跟随宿主语言（中英），宿主返回的校验错误保持宿主自己的语言。
- 草稿冲突需要显式选择（采用服务器版本 / 确认覆盖），不会自动合并。

## 开发

npm 包里只带运行时文件（`client.js` 是构建产物），改代码要从仓库拿源码：

```bash
git clone https://github.com/GrounzerLiu/dsh-moss-studio.git
cd dsh-moss-studio
npm install
node scripts/build-client.mjs   # 生成 client.js
node --test test/               # 207 项
```

客户端改动要重新打包并重启应用；`client.js` 是构建产物，随包发布。

版本与修复记录见 [CHANGELOG.md](CHANGELOG.md)，实现细节见 [docs/DETAIL.md](docs/DETAIL.md)。
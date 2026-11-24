# Moss studio — 设计说明

把本机 ComfyUI 的 MOSS-Image 生图做成一个右侧栏工作台：左边历史，右边参数与框，右下看结果。用户和 AI 操作的是同一份草稿，互相看得到。

## 位置

| 入口 | 说明 |
|---|---|
| 左侧栏面板列表「Moss studio」图标 | 打开全宽的主面板页面（与插件、任务管理等并列） |
| 右侧栏 ＋ → 引导页卡片 | 打开窄栏版本，随会话绑定草稿 |
| 模型工具 | `moss_studio_state` / `moss_studio_edit` / `moss_studio_generate` / `moss_studio_history` |

## 面板

```
┌─────────────────────────┬────────────────────────────────────┐
│ 历史                     │ 提示词                              │
│ ┌─────┐ 12:04  1024²    │ 布局框：画布拖拽 / 缩放 + 逐框编辑    │
│ │ 缩略 │ 25 步 1 框     │ 尺寸 步数 CFG seed 负向 增强         │
│ └─────┘                 │ [随机 seed 生成] [用当前 seed 生成] │
│                         ├────────────────────────────────────┤
│                         │ 结果图 + 尺寸/耗时/seed + 载入/删除  │
└─────────────────────────┴────────────────────────────────────┘
```

- 左列约 196px，缩略图直接取 `/plugins/dsh-moss-studio/image/<id>`。
- 点历史条目只切换结果区显示的图片，**不动草稿**；要套用某条记录的参数，点结果区标题行的「载入参数」。这样误点不会覆盖正在编辑的内容。
- 框在画布上拖动移动、右下角拖动缩放，坐标始终是 0-1 小数。
- 勾「人物」会把该框序号拼进 `character_boxes`，不用手输。

## 状态与并发

```
浏览器 ──PUT /draft（带 revision）──► host 草稿 ──► revision+1
   ▲                                      ▲
   └──── SSE /events（退回 1.5 秒轮询）───┘
                                          │
AI ── moss_studio_edit(patch, revision) ──┘
```

- 草稿按会话隔离，历史全局共享。
- 任何写入都带 revision；不匹配返回 409 + 当前值。面板会把界面同步到最新值并提示「草稿已被 AI 更新」，AI 会拿到 `conflict: true` 后重试。
- 用户正在输入（500ms 防抖窗口内）时不采用服务端回来的旧值，避免抢输入。

## 落盘

`C:\Users\grounzer\.dsh\moss-studio\`

```
settings.json
drafts/<sessionKey>.json          { revision, updatedAt, params }
records/<id>/record.json
records/<id>/image.png
```

- 记录先以 `running` 落盘，出图后改成 `done` 并写入图片；失败改成 `failed` 并保留错误原文，历史里能看到「为什么这张不对」。
- 写文件走临时文件 + rename，崩溃不会留下半个草稿。
- 同一时刻只允许一个生成任务（路由返回 429，工具直接拒绝）。

## 接口

| 路由 | 方法 | 作用 |
|---|---|---|
| `/plugins/dsh-moss-studio/state` | GET | 草稿 + revision + 历史摘要 |
| `/plugins/dsh-moss-studio/draft` | PUT | 保存草稿（带 revision） |
| `/plugins/dsh-moss-studio/generate` | POST | 触发生成（带 revision） |
| `/plugins/dsh-moss-studio/records` | GET | 历史分页 |
| `/plugins/dsh-moss-studio/records/<id>` | GET / DELETE | 单条记录 |
| `/plugins/dsh-moss-studio/image/<id>` | GET | 图片字节 |

跨源写请求返回 403；图片带 `private, max-age=31536000, immutable`。

## 工具

| 工具 | 作用 |
|---|---|
| `moss_studio_state` | 读草稿、revision、最近记录 |
| `moss_studio_edit` | 局部合并 patch，返回完整新状态 |
| `moss_studio_generate` | 按草稿出图，落一条记录，返回内联图片 |
| `moss_studio_history` | list / load / delete / pin / archive |

每个写操作都返回完整草稿，模型不需要再补一次读；revision 冲突返回 `conflict: true` 而不是抛错。

### generate 的 overrides 是局部覆盖

`moss_studio_generate({ overrides })` 只是把 overrides **合并**到草稿参数上，没出现的字段一律沿用草稿：

- 只传 `prompt` → 尺寸、步数、seed、负向、**以及草稿里的 boxes** 都会一起送进工作流
- 只想纯文生图 → 显式传 `boxes: []`，否则上一张留下的框会继续影响构图

这一点是有意保留的：日常用法是「在面板里摆好框，让 AI 反复换提示词」，继承框才是想要的行为。代价是「临时试一句提示词」时会带上旧框，所以写进工具描述也让模型知道。

## 与 dsh-moss-image 的关系

复用了同一套 `workflow.js`、`comfy.js` 和注入逻辑。`dsh-moss-image` 仍可并存：它提供一次性的 `moss_image` 工具，studio 提供工作台与记录。确认稳定后可以只留 studio。

## 交互细节

- 按钮统一用 Material Symbols（outlined）图标：新建、刷新、折叠预览、编辑布局、载入参数、删除、下载、收起结果、加框、关闭、放大、缩小、适应窗口。图标路径内联在 `src/icons.jsx`（来自 fonts.google.com/icons），不联网，`fill="currentColor"` 跟随按钮的文字色，因此自动适配深浅主题。图标按钮都带 `title` 与 `aria-label`。
- 勾选框也换成图标：真实 `input[type=checkbox]` 保留在树里（可聚焦、唯一切换源），视觉上是 `check_box` / `check_box_outline_blank`，选中时用品牌色，禁用时半透明；聚焦时图标外有描边，键盘操作不丢焦点提示。
- 焦点样式自带：宿主会给每个 `:focus-visible` 元素画 2px 主题色描边，窄面板里看起来像把整列框起来了，所以面板根节点（`.moss-studio`）内统一改为「容器不画、输入框自己画」——输入框/下拉/文本域聚焦时用自己的 `box-shadow` 与边框变色，容器不再出现大边框。
- 左下的 footer 按钮已移除；入口改为左侧栏面板列表里的图标（`sidebar.panellist`，order 40），点击进入主面板页面。侧栏行与「更多」菜单取图标的方式是：按面板 id 渲染 `sidebar.panellist` 里对应条目组件，并传入 `{ size, active }`——也就是说注册进 panellist 的那个组件就是图标本身，不需要额外注册别的槽（`sidebar.panel.icon` 是侧栏自己的工厂声明，不是插件注册点）。主面板是全宽版本（历史列 280px），窄栏版本仍是右侧栏标签。
- 主面板是 root 作用域、拿不到会话，因此它使用一个固定的草稿会话 `root`：打开就能用，不依赖右侧栏是否先挂载过。右侧栏标签仍然绑定对话所在的会话。两处各编辑各的草稿，顶部状态带只写这份草稿属于谁：`根草稿`、`对话草稿` 或 `未绑定会话`，完整的会话 id 放在悬停提示里——会话 id 又长又无意义，截断显示只会变成噪音。
- 想让 AI 操作主面板那份草稿，调用工具时显式传 `sessionId: "root"`。用 `moss_studio_state` 不带 sessionId 读到的是当前对话的草稿。
- 顶部工具条是一条状态带：新建草稿、ComfyUI 连接状态胶囊（在线显示版本，离线变红，15 秒刷新一次、宿主端 5 秒缓存）、实时显存与内存占用（已用/总量，来自 ComfyUI 的 `/system_stats`，每 5 秒刷新、宿主端 3 秒缓存；显存占用超过 90% 时这一组变红），右侧是保存状态、revision 与刷新。
- 历史列的过滤用 Material 3 风格的 FilterChip（`src/FilterChip.jsx`）：「本会话」「归档」。未选是描边 + 次要文字色，选中是品牌色淡化底 + 品牌色描边 + 前置对勾——和 Compose 的 FilterChip 一致，不用复选框也能一眼看出哪些筛选开着。
- 提示词与负向提示词都是多行输入框（负向默认 2 行），输入框统一 `box-sizing: border-box`，宽度不会顶出面板。
- 尺寸可自定义：宽度、高度是两个数字框（步长 16），旁边一个「预设」下拉一键填常见比例。校验在客户端先做（16 的倍数、0.25–4 MP），非法时下方红字说明并且两个生成按钮禁用——不会把一个半截数字发给宿主等 400 回包。宿主侧 `sanitizeParams` 仍会再校验一次。
- 生成按钮固定在参数列底部，滚动时始终可见；生成中显示已用时。
- 历史支持置顶与归档：悬停行右侧出现「置顶 / 归档 / 删除」三个按钮；置顶的记录单独显示在「置顶」区（不属于分页列表），归档默认隐藏、点标题栏的归档按钮显示（此时整行半透明）。归档会自动取消置顶。
- 记录字段：`pinned`（布尔）与 `archivedAt`（时间戳或 null），通过 `PATCH /records/<id>` 修改；`moss_studio_history` 也支持 `pin` / `unpin` / `archive` / `unarchive`。
- 历史是虚拟列表（`@tanstack/react-virtual`）：按行高实测定位，只渲染视口内的行；滚到底部自动加载下一页（游标为最旧一条的 id），也可点「加载更多」。视口高度为 0（SSR、测试）时退回普通列表，不会渲染空白。
- 主界面只做预览：画布按输出比例显示、不可编辑，点它或「编辑布局」打开编辑弹窗。
- 编辑弹窗接近全屏（最大 1040×760），左侧大画布拖动/缩放，右侧逐框编辑（类型、文字、人物、描述），写回同一份草稿。
- 每个框除了画布上拖拽，还能用四个数字框精确改位置与尺寸：X / Y / 宽 / 高，按百分比（0–100）输入。改动经过 `updateBoxGeometry` 夹取，先限尺寸再限位置，永远不会越出画布。四列用 `repeat(4, minmax(0, 1fr))`，窄栏里也会等分收缩，不会被内容撑破。
- 每个框在画布上显示自己的提示词（文本框优先显示文字），字号随框大小在 9–12px 间缩放，行数按框高截断，永远不越出框边界；框太小（<26×20px）时不显示。
- 全宽主面板改为三列：历史 | 参数 | 结果。结果列占 38%（最小 340px），元数据与「载入参数 / 删除 / 下载」在列顶，图片铺满其余高度。窄栏版本仍是「参数在上、结果在下」的可拖拽布局。
- 结果区与参数区之间有一条可拖动的分隔条，双击收起/展开；标题行始终显示记录号、尺寸、耗时与 seed。
- 生成中的记录在结果区显示「正在生成…」，不会出现破图；图片加载失败也会退回提示文字而不是浏览器的破图标。
- 面板默认跟随最新记录（包括 AI 工具触发的生成），点过某条记录后转为「钉住」，不再自动跳转；再次点该条或生成完成会解除。
- 结果图等比缩放并完整显示，不裁切；点击打开看图浮层。
- 看图浮层：滚轮每格约 8%、拖动平移、双击切换、Esc 关闭，缩放范围 0.5–8 倍，由 react-zoom-pan-pinch 提供。浮层通过 `createPortal` 挂到 `document.body`（面板在带 overflow 的列里，`fixed` 会相对祖先定位）。
- 对话框的按钮在卡片自己的顶栏右侧（缩小 / 放大 / 适应窗口 / 关闭），与窗口按钮不在同一位置，不会混淆。
- 结果区标题行有「载入参数」「删除」「下载」「收起」。
- 画布可折叠；没有框时自动变矮，只留一行提示。

## 主题与图标

- 颜色全部使用宿主主题 token（`--dsw-alias-bg-layer-*` / `--dsw-alias-border-l*` / `--dsw-alias-label-*` / `--dsw-alias-button-primary-fill` / `--dsw-alias-brand-primary`），下拉选项也显式套了背景与文字色；每个 token 带兜底值，缺 token 时退回半透明中性色。
- 选中态用 `color-mix(in srgb, var(--dsw-alias-brand-primary) 16%, transparent)`，跟随品牌色而不是写死的绿；`CSS.supports` 检测不到 `color-mix` 时退回 `--dsw-alias-bg-layer-2` 中性底。
- 图标来自 Material Symbols（outlined），路径内联在 `src/icons.jsx`，`fill="currentColor"` 跟随按钮文字色；勾选框同样用图标绘制，但保留真实 `input[type=checkbox]`。

## 已知限制

- 缩略图直接用原图（已懒加载），记录多了费带宽；未做服务端 256px 缓存。
- 生成过程只有「正在生成…」与按钮上的已用时，没有百分比，也不显示 ComfyUI 队列位置。
- 框画布用 pointer 事件拖动，未做双指缩放；方向键可微调位置（1% / Shift 10%），但不能改尺寸。
- 面板文字已接入 `src/i18n.js`：中文原文即键，英文缺失时回退中文；宿主返回的校验错误（路由与工具）仍是中文。
- 历史没有批量删除与分组，只有搜索与「仅本会话」筛选。
- SSE 需要页面与宿主同源直连；若前面的代理缓冲事件流，客户端会退回 1.5 秒轮询。

## 复查后修掉的 16 处

- 删除保护：`deleteRecord` 先读记录，`running` 状态直接抛 `BUSY`，路由映射 409，面板把它显示成「这条记录还在生成」，运行中的行删除按钮禁用——此前会删掉目录，让已经渲染好的图在 `finishRecord` 时丢失。
- 生成失败可见：`/generate` 返回 202 之后失败没有回信通道，现在以 `{kind:'error', message, sessionId}` 推到 SSE，面板遇到该帧直接写错误行。
- overrides 校验：路由与工具都先过 `sanitizeParams`，非法尺寸/步数立刻 400 或工具报错，不再留下一条 failed 记录。`sanitizeParams` 的 size 分支现在调用 `parseSize`。
- 置顶截断：`/state` 取 51 条、返回 50 条并带 `pinnedTruncated`，面板显示「置顶 50 +」。
- 搜索搬去服务端：`listRecords` 支持 `query`（匹配 prompt 或记录 id），`/records?q=`；面板 220ms 防抖后请求，搜索期间不再翻页。
- SSE 重连：断线按 1s/2s/4s 退避重连，连续 4 次失败才回落 1.5 秒轮询。
- 记录摘要索引：`StudioStore` 维护 id→摘要的内存表，首次列出时扫一次目录，增删改各自增量更新；`listRecords` 不再每次读盘。
- 结果区合流：窄栏底部改用 `ResultPane` 的 row 分支，图片/占位/错误只有一份实现。
- `dsh.client.immediately` 已移除：面板插件不需要启动期预取，去掉后客户端模块不再参与启动屏障。
- ARIA：历史行由 `role="button"` 改为 `role="group"`（行内本来就有三个按钮，按钮里套按钮不合法），仍保留 `tabIndex` 与回车选择。
- 异步注册兜底：`injectInto()` 既包住 `ctx.slots.inject` 的同步调用，也包住槽位回调本身，单个注册失败只打日志。
- 打包：`files` 只留运行时的 9 项（16 个文件），并补 `dsh.engines.dsh = ">=0.1.0"`。
- revision 上屏：由 `revisionRef` 改为 state，写入后立即显示新值。

## 设置（第一部分：ComfyUI 地址）

- 状态带右侧新增齿轮，点开是「Moss studio 设置」对话框。
- 可编辑项只有 **ComfyUI 地址**：`Config.comfyUrl` 声明为 `.volatile()`，修改后不重载插件，下一次生成、下一次健康探测就用新值。保存走 `configEditor.edit()` 写进 profile 的 `cordis.patch.yml`，因此重启也不会丢。
- 校验在客户端和服务端各一次：只接受 http/https、不能带账号密码、去掉尾斜杠但保留反代路径（`http://box:8188/comfy`）。
- 保存成功后宿主清空健康检查缓存，面板把 ComfyUI 状态胶囊重置为「连接中」并重新探测。
- 只读展示：数据目录、工作流路径、超时/轮询、默认步数/CFG——这些要改宿主状态，仍需编辑 `cordis.patch.yml` 并重启，所以不放进可编辑区。
- 没有配置编辑器或这一行没有 profile 条目时，输入框禁用，按钮给出明确原因；更高层固定该值时，`configEditor.edit` 的拒绝原因会原样显示。
- 依赖：运行时新增 `@deepseek-ai/schemastery`（声明 Config 用）；`react-zoom-pan-pinch` 与 `@tanstack/react-virtual` 已由 esbuild 打进 `client.js`，改列为 devDependencies。

## 第三批：细节打磨（10 条）

- 失败记录可重试：结果区在 `failed` 记录上出现「重试」，用记录自身参数直接生成（不带 revision，语义是复现当时那份参数），等待逻辑与正常生成共用 `waitForCompletion()`。
- 删除二次确认：历史行第一次点击变成红底「确认删除记录」，鼠标移出或失焦即复位；结果区删除按钮 4 秒后自动复位。运行中的记录仍禁用删除。
- 空状态分因：搜索无结果、只看本会话且为空、确实没有记录，三种文案分开。
- 生成阶段可见：按钮显示 `生成中 12s · 排队`，阶段来自 SSE 的 progress 事件（探测 / 提交 / 排队 / 下载）。
- 看图可翻页：按当前列表顺序（有图记录，新→旧）计算相邻 id，顶栏与键盘 ← → 均可切换，边界禁用。
- 下载命名：`downloadName()` 把提示词转成安全文件名（保留字母/数字/中文，最长 40 字符），例如 `海报-蓝圆与黄块-e887.png`。
- SSE 按会话过滤：只有携带 `sessionId` 的事件流会丢掉其它会话的 `draft` 事件；记录与进度仍全局推送。
- 忙碌会话可见：生成期间宿主记录 `runningSession`，`/health` 返回 `busySession`；别的会话占用时按钮禁用并显示「另一会话正在生成」。
- 记录带 `version: 1`：为后续结构迁移留锚点。
- 清理死代码：删除 `settings()`、`saveSettings()`、`invalidateIndex()`、`imageStat()`，`settings.json` 不再被读写（设置走 `configEditor`）。

## 第四批：布局持久化、保留策略、默认值、版本

- 布局偏好写入 `localStorage['moss-studio.ui']`：结果区高度（120–720）、折叠状态、历史列宽（窄栏/全宽各自记忆，160–420）。读取时做区间夹取，损坏的 JSON 或抛错的 storage 都回退默认值；历史列与参数列之间加了 5px 拖拽条，双击复位。
- 历史保留：`Config.retention`（volatile，默认 0 = 不限制）。每次生成成功后按上限清理最旧记录，跳过置顶与正在生成的；设置为 0 时完全不清理。
- 新草稿默认值：`defaultSize` / `defaultSteps` / `defaultCfg` / `defaultNegative` 四个 volatile 字段，`StudioStore` 通过 `defaults` 回调在新建草稿时读取，已有草稿不受影响。
- 设置对话框扩成三组：ComfyUI 地址、历史保留条数、新草稿默认值；只读的接线信息（数据目录、工作流、超时/轮询）放在最下方。
- `/settings` 的 PATCH 接受 `comfyUrl`、`retention`、`defaults` 的任意组合（至少一项），未知键与越界值返回 400；一次 `configEditor.edit` 写完。
- 无障碍：`useDialogFocus` 统一处理三个对话框的初始焦点、Tab 循环与关闭后焦点归还；设置与编辑布局补上 `role="dialog"`、`aria-modal`、`aria-labelledby`。
- 版本升到 0.2.0，新增 CHANGELOG.md。

## 第五批：国际化（0.5.0 起改用官方 locale 机制）

- 字典注册到 client locale 服务：`ctx.locale.register('moss-studio', { zh, en })`，读取用 `ctx.locale.bind(NS)`；`client` 的 inject 里声明 `locale`，注册包在 `ctx.effect` 里，随插件卸载自动撤销。
- 键名是稳定的英文语义标识（`action.delete`、`history.empty`、`settings.comfyUrl`…），改文案不必改键；中文只是 `ZH` 里的值。0.3.0 的中文当键方案已废弃——改名会静默断链，且同文不同义无法分叉。
- 语言切换即时生效：`src/useLocale.js` 用 `useSyncExternalStore` 订阅 `getRevision`/`subscribe`，在 `StudioPanel` 根调用一次，整个子树（含各对话框）随语言切换重渲染。
- 兜底三级：服务可用时走服务的回退链（未注册的语种回退英文）；服务缺失（单测、无 locale 插件的宿主）退回中文；两者都没有则显示键本身，不会是空白。
- 时间格式按当前语言取 `zh-CN` 或对应标签。
- 测试：键集对齐、占位符对齐、源码引用的键必须存在、键名不得为中文、注册/翻译/订阅/降级四条运行时用例；client 侧断言命名空间以 `zh`+`en` 注册。
- 尚未翻译：宿主侧 `lib/*.js` 返回的校验文案与工具描述。

## 兼容性（DSH 0.2.3-alpha.2）

- 右侧栏正文的插槽契约变化：`{sidebar, panel, tab}` 收进 `useTabInfo()`，不再作为平铺 owner props；`sessionId` 仍由 slot 的 built-in props 提供（`ui-session` 的 `BUILTIN_SOURCE.props` 包含它）。本插件改为不重复注入，并在正文里按 `props.sessionId` → `useTabInfo().tab.sessionId` → `global` 兜底。
- `sidebar.panellist` / `sidebar.panel.icon` / `main` / `sidebar.right.tab.guide` 的注册形状未变；`ctx.sidebarRightTabs.register` 的字段与旧版一致。
- `ctx.tools.register` 仍要求 `output: { schema, render }`；本插件四个工具早已带 `render`，且 schema 只使用受支持的 type/properties/required/items/enum 等关键字。
- `ctx.webServer.register({ kind: 'prefix', path, handler })` 与 `attachments.saveImage` 签名未变。
- 依赖从 `@deepseek-ai/schemastery ^3.19.0` 升到 `3.20.0-alpha.1`，与宿主内置版本一致。

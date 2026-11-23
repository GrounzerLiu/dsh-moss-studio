/**
 * UI copy in Chinese and English.
 *
 * The Chinese text doubles as the key: the panel was written in Chinese first,
 * and a missing English entry must still show something readable instead of a
 * dotted key. `t('删除记录')` therefore returns the Chinese string verbatim when
 * no translation exists, which also keeps every dictionary edit optional.
 *
 * Placeholders use `{name}` and are filled from the second argument.
 */

const EN = {
  '(无提示词)': '(no prompt)',
  'ComfyUI 地址': 'ComfyUI address',
  'ComfyUI 离线': 'ComfyUI offline',
  'Moss studio 面板出错': 'Moss studio panel failed',
  'Moss studio 设置': 'Moss studio settings',
  '上一张': 'Previous',
  '上一张（较新）': 'Previous (newer)',
  '上一次生成还在进行': 'A generation is already running',
  '下一张': 'Next',
  '下一张（较旧）': 'Next (older)',
  '下载': 'Download',
  '下载图片': 'Download image',
  '不希望出现的内容，逗号分隔': 'What to avoid, comma separated',
  '人物': 'Person',
  '低于 0.25 MP（512×512）': 'Below 0.25 MP (512×512)',
  '保存': 'Save',
  '保存中…': 'Saving…',
  '保存后立即生效，下一次生成就用新地址；值会写进 profile 的 cordis.patch.yml。':
    'Applies immediately to the next generation; the value is written to the profile\'s cordis.patch.yml.',
  '先用本地 9B 扩写提示词（有框时不可用）': 'Expand the prompt with the local 9B model (unavailable with boxes)',
  '关闭': 'Close',
  '关闭设置': 'Close settings',
  '删除': 'Delete',
  '删除框': 'Delete box',
  '删除记录': 'Delete record',
  '删除这个框': 'Delete this box',
  '删除这条记录': 'Delete this record',
  '删除这条记录？': 'Delete this record?',
  '删除选中的记录': 'Delete selected record',
  '删除选中记录': 'Delete selected record',
  '刷新页面可重试；参数仍保存在 ~/.dsh/moss-studio。': 'Reload to retry; parameters are still saved under ~/.dsh/moss-studio.',
  '加一个框': 'Add a box',
  '加框': 'Add box',
  '加载中…': 'Loading…',
  '加载更多': 'Load more',
  '历史': 'History',
  '历史保留条数': 'History retention',
  '历史保留条数（0 = 不限制）': 'History retention (0 = unlimited)',
  '取消': 'Cancel',
  '取消并撤销本次修改': 'Cancel and undo this edit',
  '取消归档': 'Unarchive',
  '取消置顶': 'Unpin',
  '另一会话正在生成': 'Another session is generating',
  '只看本会话的记录': 'Only records from this session',
  '图片加载失败，点「下载」重试或重新生成': 'Image failed to load; use Download to retry or generate again',
  '完成': 'Done',
  '宽': 'W',
  '宽度': 'Width',
  '宽高不能为空': 'Width and height are required',
  '宽高必须是 16 的倍数': 'Width and height must be multiples of 16',
  '宽高必须是正整数': 'Width and height must be positive integers',
  '对话草稿': 'Conversation draft',
  '展开结果区': 'Expand result area',
  '展开预览': 'Expand preview',
  '工作流': 'Workflow',
  '已保存，下一次生成与新草稿就用新设置': 'Saved; the next generation and new drafts use it',
  '已按这条记录重试，等待出图…': 'Retrying with this record, waiting for the image…',
  '已提交，等待 ComfyUI 出图…': 'Submitted, waiting for ComfyUI…',
  '已撤销本次布局修改': 'Layout changes reverted',
  '已新建空草稿': 'New empty draft',
  '常用尺寸': 'Preset size',
  '归档': 'Archive',
  '当前 profile 没有配置编辑器，这一项只能改 cordis.patch.yml 后重启。':
    'This profile has no config editor; change cordis.patch.yml and restart instead.',
  '把这条记录的参数载入草稿': 'Load this record\'s parameters into the draft',
  '折叠预览': 'Collapse preview',
  '拖动调整历史列宽，双击复位': 'Drag to resize the history column; double-click to reset',
  '拖动调整高度，双击收起/展开': 'Drag to resize; double-click to collapse or expand',
  '排队': 'queued',
  '探测': 'probing',
  '提交': 'submitting',
  '搜索提示词或记录号': 'Search prompt or record id',
  '收起结果': 'Collapse result',
  '收起结果区': 'Collapse result area',
  '放大': 'Zoom in',
  '放大查看': 'Zoomed view',
  '数据目录': 'Data directory',
  '整图描述；框内细节写在每个框的 desc 里': 'Whole-image description; per-box detail goes in each box\'s desc',
  '新建空草稿': 'New empty draft',
  '新建草稿': 'New draft',
  '显示全部会话的记录': 'Show records from every session',
  '显示已归档的记录': 'Show archived records',
  '未命名记录': 'Untitled record',
  '未绑定会话': 'No session bound',
  '未选中记录': 'No record selected',
  '本会话': 'This session',
  '本机 MOSS-Image 生图：历史、框位、参数': 'Local MOSS-Image generation: history, layout boxes, parameters',
  '查看生成结果': 'View the result',
  '根草稿': 'Root draft',
  '框内是什么：主体、姿态、材质、光线': 'What is in the box: subject, pose, material, lighting',
  '点击打开布局编辑器': 'Open the layout editor',
  '生成中，结束后才能删除': 'Generating; delete it once it finishes',
  '生成失败': 'Generation failed',
  '生成结果': 'Generated result',
  '用这条记录的参数重试': 'Retry with this record\'s parameters',
  '等待超时，任务可能仍在 ComfyUI 队列中': 'Timed out waiting; the job may still be queued in ComfyUI',
  '结果会显示在这里': 'The result appears here',
  '编辑布局': 'Edit layout',
  '缩小': 'Zoom out',
  '置顶': 'Pin',
  '置顶/归档需要新版宿主：重启应用后生效（当前进程还是旧版本）':
    'Pinning and archiving need the newer host: restart the app (this process is still the old version)',
  '置顶超过 50 条，只显示最近 50 条': 'More than 50 pinned; only the newest 50 are shown',
  '草稿已更新，请确认后再生成': 'The draft changed; review it before generating',
  '草稿已被 AI 更新，已同步为最新参数': 'The AI updated the draft; parameters synced',
  '记录与图片会一起删除，无法恢复。': 'The record and its image are deleted together. This cannot be undone.',
  '设置': 'Settings',
  '超时 / 轮询': 'Timeout / polling',
  '超过 4 MP（约 2048×2048）': 'Above 4 MP (about 2048×2048)',
  '载入参数': 'Load parameters',
  '还没有记录': 'No records yet',
  '这个会话还没有记录（可以关掉「本会话」看全部）': 'No records in this session (turn off This session to see all)',
  '这条记录还在生成，等它结束再删': 'This record is still generating; delete it after it finishes',
  '连接中': 'connecting',
  '适应窗口': 'Fit to window',
  '逐字渲染的文字': 'Text rendered verbatim',
  '重新检测': 'Check again',
  '重新检测 ComfyUI': 'Check ComfyUI again',
  '重试': 'Retry',
  '随机 seed 生成': 'Generate with a random seed',
  '隐藏已归档的记录': 'Hide archived records',
  '高': 'H',
  '高度': 'Height',
  '默认 CFG': 'Default CFG',
  '默认尺寸': 'Default size',
  '默认步数': 'Default steps',
  '默认负向提示词': 'Default negative prompt',
  '新草稿默认值（不影响已有草稿）': 'Defaults for new drafts (existing drafts are untouched)',
  '以下由配置决定，需改 cordis.patch.yml 并重启': 'Decided by configuration; change cordis.patch.yml and restart',
  '超出时删最旧的；置顶与正在生成的记录不会被删。':
    'The oldest are removed first; pinned and running records are kept.',
  '读取中…': 'Loading…',
  '读取失败：{error}': 'Failed to load: {error}',
  '草稿会话：{sessionId}': 'Draft session: {sessionId}',
  '没有匹配「{query}」的记录': 'No records match "{query}"',
  '生成中 {seconds}s': 'Generating {seconds}s',
  '正在生成…（{id}）': 'Generating… ({id})',
  '队列中 · {id}': 'Queued · {id}',
  '已完成：{width}×{height}，{seconds} 秒': 'Done: {width}×{height} in {seconds}s',
  '显存 {used}/{total} G': 'VRAM {used}/{total} G',
  '内存 {used}/{total} G': 'RAM {used}/{total} G',
  '显存 {total} GB 总量，内存 {ram} GB 总量': 'VRAM total {total} GB, RAM total {ram} GB',
  'revision {revision}': 'revision {revision}',
  '历史 {count}': 'History {count}',
  '连不上 ComfyUI': 'Cannot reach ComfyUI',
  'ComfyUI {version}': 'ComfyUI {version}',
  '编辑布局 · {count} 个框 · {size}': 'Edit layout · {count} boxes · {size}',
  '确认删除记录': 'Confirm deleting the record',
  '保存失败（{status}）': "Save failed ({status})",
  '生成请求失败（{status}）': "The generate request failed ({status})",
  '重试失败（{status}）': "Retry failed ({status})",
  '删除失败（{status}）': "Delete failed ({status})",
  '标记失败（{status}）': "Could not update the flag ({status})",
  '已载入 {id} 的参数': "Loaded the parameters of {id}",
  'state 请求失败（{status}）': "state request failed ({status})",
  'records 请求失败（{status}）': "records request failed ({status})",
  '记录请求失败（{status}）': "record request failed ({status})",
  'health 请求失败（{status}）': "health request failed ({status})",
  '设置读取失败（{status}）': "settings request failed ({status})",
  '{seconds} 秒 / {ms} 毫秒': "{seconds}s / {ms}ms",
  '点击重新检测': "Click to check again",
  '正在读取 moss studio 状态…': "Reading moss studio state…",  '提示词': "Prompt",
  '尺寸': "Size",
  '预设': "Preset",
  '步数': "Steps",
  '负向提示词': "Negative prompt",
  '用当前 seed 生成': "Generate with the current seed",
  '尺寸无效，未保存': "Invalid size, not saved",
  '结果': "Result",
  '文字': "Text",
  '如 1024x1024': "e.g. 1024x1024",
}

let current = 'zh'

/** @returns {'zh' | 'en'} */
export function getLocale() {
  return current
}

/** @param {unknown} value */
export function setLocale(value) {
  current = String(value ?? '').toLowerCase().startsWith('en') ? 'en' : 'zh'
  return current
}

/** Detect from a language tag such as `en-US`; anything unknown means Chinese. */
export function detectLocale(tag) {
  return setLocale(tag)
}

/**
 * Translate one UI string.
 * @param {string} text - Chinese source text, also the lookup key
 * @param {Record<string, string | number>} [params]
 */
export function t(text, params) {
  const source = String(text)
  let out = current === 'en' ? (EN[source] ?? source) : source
  if (params !== undefined) {
    for (const [key, value] of Object.entries(params)) {
      out = out.split(`{${key}}`).join(String(value))
    }
  }
  return out
}

/** Test seam: the dictionary the current locale would use. */
export const dictionary = EN

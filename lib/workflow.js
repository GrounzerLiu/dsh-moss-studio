/**
 * Pure workflow preparation for the MOSS-Image bounding-box graph.
 *
 * The shipped template is the API-format export of the official
 * `image_moss_image_t2i_bboxes` template. Everything this module changes is
 * limited to documented node inputs:
 *
 *   25 CreateBoundingBoxes      width, height, editor_state, bboxes
 *   27 MOSSImageLayoutPrompt    prompt, width, height, character_boxes
 *   18:7 KSampler               seed, steps, cfg
 *   18:5 CLIPTextEncode         negative prompt
 *   18:16 ComfySwitchNode       prompt-enhancer switch
 *    9 SaveImage                filename prefix
 *
 * Width and height are wired from node 19 (ResolutionSelector). That node can
 * only express an aspect ratio plus a megapixel target, so exact pixel sizes
 * are produced by replacing its two output links with integer literals.
 */

/** Node ids in the shipped API workflow. */
export const NODES = Object.freeze({
  save: '9',
  resolution: '19',
  boxes: '25',
  preview: '26',
  layout: '27',
  sampler: '18:7',
  negative: '18:5',
  enhancerSwitch: '18:16',
  decode: '18:8',
})

export const DEFAULT_NEGATIVE = 'nsfw, worst quality, bad anatomy, watermark, jpeg artifact'
export const DEFAULT_SIZE = Object.freeze({ width: 1024, height: 1024 })
export const MIN_PIXELS = 512 * 512
export const MAX_PIXELS = 2048 * 2048

const REQUIRED = [
  NODES.save,
  NODES.boxes,
  NODES.preview,
  NODES.layout,
  NODES.sampler,
  NODES.negative,
  NODES.enhancerSwitch,
  NODES.decode,
]

/** A user-facing preparation error; `message` is safe to show in the tool card. */
export class WorkflowError extends Error {
  constructor(message) {
    super(message)
    this.name = 'WorkflowError'
  }
}

function assertNumber(value, label) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new WorkflowError(`${label} must be a finite number`)
  }
}

/**
 * Parse `WIDTHxHEIGHT` into a pixel size accepted by MOSS-Image:
 * multiples of 16, between 0.25 MP and 4 MP.
 *
 * @param {unknown} value - e.g. "1024x1024" or "768 × 1024".
 * @returns {{ width: number, height: number }}
 */
export function parseSize(value) {
  if (value === undefined || value === null || value === '') return { ...DEFAULT_SIZE }
  if (typeof value !== 'string') throw new WorkflowError('size must be a string like "1024x1024"')
  const match = /^\s*(\d+)\s*[x×*]\s*(\d+)\s*$/i.exec(value)
  if (match === null) throw new WorkflowError(`size "${value}" is not WIDTHxHEIGHT, e.g. 1024x1024`)
  const width = Number(match[1])
  const height = Number(match[2])
  if (!Number.isSafeInteger(width) || !Number.isSafeInteger(height) || width <= 0 || height <= 0) {
    throw new WorkflowError('size must contain positive integers')
  }
  if (width % 16 !== 0 || height % 16 !== 0) {
    throw new WorkflowError('MOSS-Image requires width and height to be multiples of 16')
  }
  const pixels = width * height
  if (pixels < MIN_PIXELS) throw new WorkflowError('size is below the 0.25 MP minimum (512x512)')
  if (pixels > MAX_PIXELS) throw new WorkflowError('size is above the 4 MP maximum (~2048x2048)')
  return { width, height }
}

function clamp01(value, label) {
  assertNumber(value, label)
  if (value < -1e-6 || value > 1 + 1e-6) throw new WorkflowError(`${label} must be a 0..1 fraction`)
  return Math.min(1, Math.max(0, value))
}

function normalizePalette(palette, index) {
  if (palette === undefined || palette === null) return []
  if (!Array.isArray(palette)) throw new WorkflowError(`boxes[${index}].palette must be an array of hex colors`)
  return palette
    .filter((color) => typeof color === 'string' && /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(color.trim()))
    .slice(0, 5)
}

/**
 * Translate 1-based character marks from draft numbering to request numbering.
 *
 * Hiding a box removes it from the request but not from the draft, so a mark on
 * box 3 has to become box 2 when box 1 is hidden. Marks on hidden boxes are
 * dropped: the workflow has no such box to refer to.
 *
 * @param {string} text - "2" or "1, 3", already validated
 * @param {object[]} boxes - the draft boxes, in order
 * @returns {string}
 */
export function remapCharacters(text, boxes) {
  const marks = (text.match(/\d+/g) ?? []).map(Number)
  if (marks.length === 0) return ''
  const visible = boxes.map((box, index) => (box !== null && typeof box === 'object' && box.hidden === true ? undefined : index))
  const mapping = new Map()
  let next = 0
  for (const index of visible) {
    if (index === undefined) continue
    next += 1
    mapping.set(index + 1, next)
  }
  const kept = [...new Set(marks)].map((mark) => mapping.get(mark)).filter((value) => value !== undefined)
  return kept.sort((a, b) => a - b).join(',')
}

/**
 * Convert fraction boxes (top-left origin, 0..1) into the pixel boxes that
 * CreateBoundingBoxes accepts through its optional `bboxes` input.
 *
 * @param {unknown} boxes
 * @param {{ width: number, height: number }} size
 */
export function normalizeBoxes(boxes, size) {
  if (boxes === undefined || boxes === null) return []
  if (!Array.isArray(boxes)) throw new WorkflowError('boxes must be an array')
  if (boxes.length > 24) throw new WorkflowError('at most 24 boxes are supported')
  return boxes.map((box, index) => {
    if (box === null || typeof box !== 'object' || Array.isArray(box)) {
      throw new WorkflowError(`boxes[${index}] must be an object`)
    }
    const x = clamp01(box.x, `boxes[${index}].x`)
    const y = clamp01(box.y, `boxes[${index}].y`)
    const width = clamp01(box.width, `boxes[${index}].width`)
    const height = clamp01(box.height, `boxes[${index}].height`)
    if (width <= 0 || height <= 0) throw new WorkflowError(`boxes[${index}] has a zero width or height`)
    if (x + width > 1 + 1e-6 || y + height > 1 + 1e-6) {
      throw new WorkflowError(`boxes[${index}] extends past the canvas edge`)
    }
    const type = box.type === 'text' ? 'text' : 'obj'
    const text = typeof box.text === 'string' ? box.text : ''
    const desc = typeof box.desc === 'string' ? box.desc : ''
    if (desc.trim() === '' && !(type === 'text' && text.trim() !== '')) {
      throw new WorkflowError(`boxes[${index}] needs a desc (or text for a text box) so the model knows what to place`)
    }
    const palette = normalizePalette(box.palette, index)
    const px = Math.min(size.width - 1, Math.max(0, Math.round(x * size.width)))
    const py = Math.min(size.height - 1, Math.max(0, Math.round(y * size.height)))
    const pw = Math.max(1, Math.min(size.width - px, Math.round(width * size.width)))
    const ph = Math.max(1, Math.min(size.height - py, Math.round(height * size.height)))
    return {
      x: px,
      y: py,
      width: pw,
      height: ph,
      metadata: {
        type,
        text: type === 'text' ? text : '',
        desc,
        palette,
      },
    }
  })
}

/** Serialize pixel boxes the way the node's JSON-string input expects. */
export function boxesToJson(pixelBoxes) {
  return JSON.stringify(pixelBoxes)
}

function randomSeed() {
  const bytes = new Uint8Array(6)
  globalThis.crypto.getRandomValues(bytes)
  let value = 0
  for (const byte of bytes) value = value * 256 + byte
  return value % 2 ** 48
}

function replaceSizeLinks(value, width, height) {
  if (Array.isArray(value)) {
    if (value.length === 2 && value[0] === NODES.resolution && (value[1] === 0 || value[1] === 1)) {
      return value[1] === 0 ? width : height
    }
    return value.map((entry) => replaceSizeLinks(entry, width, height))
  }
  if (value !== null && typeof value === 'object') {
    for (const key of Object.keys(value)) value[key] = replaceSizeLinks(value[key], width, height)
    return value
  }
  return value
}

/**
 * Clone the template and inject one generation request.
 *
 * @param {Record<string, unknown>} template - parsed API-format workflow.
 * @param {object} options
 * @param {string} options.prompt - overall scene description.
 * @param {Array<object>} [options.boxes] - fraction boxes.
 * @param {{ width: number, height: number }} options.size
 * @param {number} [options.seed] - negative for a random seed.
 * @param {number} [options.steps]
 * @param {number} [options.cfg]
 * @param {string} [options.negative]
 * @param {string} [options.characterBoxes]
 * @param {boolean} [options.enhance]
 * @param {string} [options.filenamePrefix]
 * @returns {{ graph: Record<string, unknown>, meta: object }}
 */
export function injectWorkflow(template, options) {
  if (template === null || typeof template !== 'object' || Array.isArray(template)) {
    throw new WorkflowError('workflow template is not an API-format graph')
  }
  for (const id of REQUIRED) {
    if (template[id] === undefined) {
      throw new WorkflowError(`workflow template is missing node ${id}; re-export the API workflow`)
    }
  }

  const prompt = typeof options.prompt === 'string' ? options.prompt.trim() : ''
  if (prompt === '') throw new WorkflowError('prompt must not be empty')

  const size = typeof options.size === 'string'
    ? parseSize(options.size)
    : options.size ?? { ...DEFAULT_SIZE }
  if (!Number.isSafeInteger(size.width) || !Number.isSafeInteger(size.height) || size.width <= 0 || size.height <= 0) {
    throw new WorkflowError('size must be a WIDTHxHEIGHT string or a { width, height } object')
  }
  // A hidden box is excluded from the request but keeps its place in the draft,
  // so the panel's numbering and character marks stay stable while editing.
  const allBoxes = Array.isArray(options.boxes) ? options.boxes : []
  const visibleBoxes = allBoxes.filter((box) => box === null || typeof box !== 'object' || box.hidden !== true)
  const pixelBoxes = normalizeBoxes(visibleBoxes, size)

  let seed = options.seed
  if (seed === undefined || seed === null || seed < 0) seed = randomSeed()
  if (!Number.isSafeInteger(seed) || seed < 0) throw new WorkflowError('seed must be a non-negative integer or -1')

  const steps = options.steps ?? 25
  if (!Number.isInteger(steps) || steps < 1 || steps > 200) throw new WorkflowError('steps must be an integer between 1 and 200')
  const cfg = options.cfg ?? 2.5
  assertNumber(cfg, 'cfg')
  if (cfg < 0 || cfg > 30) throw new WorkflowError('cfg must be between 0 and 30')

  const negative = options.negative ?? DEFAULT_NEGATIVE
  if (typeof negative !== 'string') throw new WorkflowError('negative must be a string')
  const rawCharacters = options.characterBoxes ?? ''
  if (typeof rawCharacters !== 'string' || !/^\s*(?:\d+(?:\s*,\s*\d+)*)?\s*$/.test(rawCharacters)) {
    throw new WorkflowError('character_boxes must look like "2" or "1, 3"')
  }
  const characterBoxes = remapCharacters(rawCharacters, allBoxes)
  const enhance = options.enhance === true && pixelBoxes.length === 0
  const filenamePrefix = typeof options.filenamePrefix === 'string' && options.filenamePrefix.trim() !== ''
    ? options.filenamePrefix.trim().replace(/[^\w.-]+/g, '_')
    : 'moss_image'

  const graph = structuredClone(template)
  replaceSizeLinks(graph, size.width, size.height)

  const boxesNode = graph[NODES.boxes]
  boxesNode.inputs.width = size.width
  boxesNode.inputs.height = size.height
  // A list widget value must stay wrapped so the executor does not read it as
  // a [node_id, slot] link.
  boxesNode.inputs.editor_state = { __value__: [] }
  delete boxesNode.inputs.last_incoming
  if (pixelBoxes.length > 0) boxesNode.inputs.bboxes = boxesToJson(pixelBoxes)
  else delete boxesNode.inputs.bboxes

  const layoutNode = graph[NODES.layout]
  layoutNode.inputs.prompt = prompt
  layoutNode.inputs.width = size.width
  layoutNode.inputs.height = size.height
  layoutNode.inputs.character_boxes = characterBoxes

  const sampler = graph[NODES.sampler]
  sampler.inputs.seed = seed
  sampler.inputs.steps = steps
  sampler.inputs.cfg = cfg

  graph[NODES.negative].inputs.text = negative
  graph[NODES.enhancerSwitch].inputs.switch = enhance
  graph[NODES.save].inputs.filename_prefix = filenamePrefix

  return {
    graph,
    meta: {
      width: size.width,
      height: size.height,
      seed,
      steps,
      cfg,
      boxCount: pixelBoxes.length,
      enhance,
      characterBoxes,
    },
  }
}

/**
 * Read the first final image from a `/history/<prompt_id>` entry.
 *
 * @param {unknown} entry
 */
export function historyImage(entry) {
  if (entry === null || typeof entry !== 'object') return null
  const outputs = entry.outputs
  if (outputs === null || typeof outputs !== 'object') return null
  for (const output of Object.values(outputs)) {
    const images = output && typeof output === 'object' ? output.images : undefined
    if (!Array.isArray(images)) continue
    for (const image of images) {
      if (image && typeof image === 'object' && typeof image.filename === 'string') {
        return {
          filename: image.filename,
          subfolder: typeof image.subfolder === 'string' ? image.subfolder : '',
          type: typeof image.type === 'string' ? image.type : 'output',
        }
      }
    }
  }
  return null
}

/** Describe an execution failure recorded in a history entry. */
export function historyFailure(entry) {
  const status = entry && typeof entry === 'object' ? entry.status : undefined
  const messages = status && Array.isArray(status.messages) ? status.messages : []
  const lines = []
  for (const message of messages) {
    if (!Array.isArray(message) || message.length < 2) continue
    const [event, data] = message
    if (event !== 'execution_error' && event !== 'execution_interrupted') continue
    const text = data && typeof data === 'object'
      ? [data.node_type, data.node_id, data.exception_message].filter(Boolean).join(' ')
      : ''
    if (text) lines.push(text)
  }
  return lines.length > 0 ? lines.join('; ') : 'ComfyUI reported an execution error'
}

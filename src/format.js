/**
 * Human-facing numbers for the status strip.
 */

/**
 * Bytes to a one-decimal gigabyte string.
 * @param {number | undefined} bytes
 * @returns {string} e.g. "6.5", or an em dash when unknown
 */
export function gigabytes(bytes) {
  if (typeof bytes !== 'number' || !Number.isFinite(bytes) || bytes < 0) return '—'
  return (bytes / 1024 ** 3).toFixed(1)
}

/**
 * Percentage of a pool that is in use.
 * @param {number | undefined} total
 * @param {number | undefined} free
 * @param {number} [fallback] - used when either side is unknown
 */
export function usedPercent(total, free, fallback = 0) {
  if (typeof total !== 'number' || typeof free !== 'number' || total <= 0) return fallback
  return Math.round(((total - free) / total) * 100)
}

/**
 * File name for a downloaded result: a readable prompt slice plus the record
 * suffix, so a folder of downloads can be told apart.
 *
 * @param {string} recordId
 * @param {string} [prompt]
 * @param {number} [maxChars]
 */
export function downloadName(recordId, prompt = '', maxChars = 40) {
  const slug = String(prompt)
    // Keep letters, digits and CJK; everything else becomes a separator.
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, maxChars)
    .replace(/-+$/g, '')
  const suffix = String(recordId).slice(-4)
  return slug === '' ? `moss-${suffix}.png` : `${slug}-${suffix}.png`
}

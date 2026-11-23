/**
 * Bundle the browser half into the ModuleLoader shape the Web client expects.
 *
 * esbuild emits CommonJS with React left external; the wrapper below hands it
 * the loader's `require` and exposes `{ inject, apply }`.
 */
import { build } from 'esbuild'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const outfile = fileURLToPath(new URL('../client.js', import.meta.url))

const result = await build({
  entryPoints: [fileURLToPath(new URL('../src/client.jsx', import.meta.url))],
  bundle: true,
  write: false,
  format: 'cjs',
  platform: 'browser',
  target: ['es2022'],
  jsx: 'transform',
  external: ['react', 'react-dom'],
  logLevel: 'warning',
})

const code = result.outputFiles[0].text
const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))

const wrapped = `window.__ModuleLoader__.load({
  id: ${JSON.stringify(pkg.name)},
  factory(require) {
    const module = { exports: {} }
    const exports = module.exports
    ;(function (module, exports, require) {
${code}
    })(module, exports, require)
    const plugin = module.exports.createPlugin()
    return plugin
  },
})
`

await mkdir(root, { recursive: true })
await writeFile(outfile, wrapped, 'utf8')
console.log(`wrote ${outfile} (${wrapped.length} bytes)`)

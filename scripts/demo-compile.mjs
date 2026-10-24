// Builds each state of the demo project (demo/src/mock/scenario.ts) the way ColTex's compiler
// does (latexmk with the worker's flags, in its image, without network) and keeps the PDF and
// the diagnostics from ColTex's own log parser in demo/compiled/. Run by hand after changing
// the project or the scenario; the results are committed.
//   node scripts/demo-compile.mjs [image]
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { STATES, applyEdits, stateText } from '../demo/src/mock/scenario.ts'
import { parseBibLog, parseLatexLog } from '../.cache/coltex/packages/log-parser/src/index.ts'

const IMAGE = process.argv[2] ?? 'ghcr.io/lewen-cai/coltex-compiler:v0.0.4-standard'
const PROJECT = 'demo/project'
const OUT = 'demo/compiled'

const textFiles = Object.fromEntries(['main.tex', 'refs.bib'].map(p => [p, fs.readFileSync(path.join(PROJECT, p), 'utf8')]))
const uid = `${process.getuid()}:${process.getgid()}`
const index = {}
fs.rmSync(OUT, { recursive: true, force: true })
for (const state of STATES) {
  const files = applyEdits(textFiles, state.edits)
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'coltex-demo-'))
  fs.cpSync(PROJECT, dir, { recursive: true })
  for (const [p, text] of Object.entries(files)) fs.writeFileSync(path.join(dir, p), text)
  const started = Date.now()
  let exitCode = 0
  try {
    execFileSync('docker', ['run', '--rm', '--network', 'none', '--user', uid, '-v', `${dir}:/work`, '-w', '/work', '--entrypoint', 'latexmk', IMAGE,
      '-pdf', '-f', '-interaction=nonstopmode', '-file-line-error', '-synctex=1', '-jobname=output', '-outdir=.', '-auxdir=.', 'main.tex'], { stdio: 'pipe' })
  } catch (err) {
    exitCode = err.status ?? 1
  }
  const read = name => (fs.existsSync(path.join(dir, name)) ? fs.readFileSync(path.join(dir, name), 'utf8') : '')
  // Diagnostics name files by their path in the compile directory, as the worker's do.
  const diagnostics = [...parseLatexLog(read('output.log'), dir), ...parseBibLog(read('output.blg'), dir)]
  const target = path.join(OUT, state.id)
  fs.mkdirSync(target, { recursive: true })
  const outputFiles = []
  for (const name of ['output.pdf', 'output.log', 'output.synctex.gz', 'output.blg']) {
    if (!fs.existsSync(path.join(dir, name))) continue
    fs.copyFileSync(path.join(dir, name), path.join(target, name))
    outputFiles.push(name)
  }
  const result = { status: exitCode === 0 ? 'success' : 'failure', outputFiles, diagnostics, durationMs: Date.now() - started }
  fs.writeFileSync(path.join(target, 'result.json'), JSON.stringify(result, null, 2) + '\n')
  index[createHash('sha256').update(stateText(files)).digest('hex')] = state.id
  fs.rmSync(dir, { recursive: true, force: true })
  console.log(`${state.id}: ${result.status}, ${diagnostics.length} diagnostics, ${(result.durationMs / 1000).toFixed(1)} s`)
}
fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(index, null, 2) + '\n')

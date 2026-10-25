// Builds the demo into public/demo/: ColTex's web app at the version in demo/VERSION (a
// checkout in .cache/coltex), with demo/src (the in-browser stand-in for the server), the
// sample project and its builds copied in, bundled by the app's own Vite config plus
// demo/vite.config.ts. ColTex itself is never changed: the checkout is reset each time.
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const VERSION = fs.readFileSync('demo/VERSION', 'utf8').trim()
const REPO = process.env.COLTEX_REPO_URL ?? 'https://github.com/coltexeditor/coltex.git'
const CHECKOUT = '.cache/coltex'
const WEB = path.join(CHECKOUT, 'apps/web')
const run = (cmd, args, cwd = '.') => execFileSync(cmd, args, { cwd, stdio: 'inherit' })
const out = (cmd, args, cwd = '.') => execFileSync(cmd, args, { cwd, encoding: 'utf8' }).trim()

// The checkout, at exactly that tag and clean (node_modules is ignored there, so it stays).
const tagCommit = () => out('git', ['rev-parse', `${VERSION}^{commit}`], CHECKOUT)
if (fs.existsSync(CHECKOUT)) {
  let ok = false
  try {
    ok = tagCommit() === out('git', ['rev-parse', 'HEAD'], CHECKOUT)
  } catch {}
  if (!ok) fs.rmSync(CHECKOUT, { recursive: true, force: true })
}
if (!fs.existsSync(CHECKOUT)) {
  run('git', ['clone', '-q', '--depth', '1', '--branch', VERSION, REPO, CHECKOUT])
}
run('git', ['reset', '-q', '--hard'], CHECKOUT)
run('git', ['clean', '-q', '-fd'], CHECKOUT)
run('pnpm', ['install', '--frozen-lockfile', '--filter', '@coltex/web...'], CHECKOUT)

// The demo's own files.
const into = (from, to) => fs.cpSync(from, to, { recursive: true })
into('demo/src', path.join(WEB, 'src/demo'))
into('demo/project', path.join(WEB, 'src/demo/project'))
into('demo/compiled', path.join(WEB, 'src/demo/compiled'))
fs.copyFileSync('demo/vite.config.ts', path.join(WEB, 'vite.demo.config.ts'))
fs.copyFileSync('demo/index.html', path.join(WEB, 'index.html'))

run('node', ['scripts/dictionaries.ts'], WEB)
run('pnpm', ['exec', 'vite', 'build', '--config', 'vite.demo.config.ts', '--logLevel', 'warn'], WEB)
fs.rmSync('public/demo', { recursive: true, force: true })
into(path.join(WEB, 'dist-demo'), 'public/demo')
// Only the sample project's spell-check language (the full set is about 270 MB).
for (const name of fs.readdirSync('public/demo/dictionaries')) {
  if (!/^en_(US|GB)\.(aff|dic)$|^hunspell-en-(us|gb)\.copyright\.txt$/.test(name)) fs.rmSync(path.join('public/demo/dictionaries', name))
}
console.log(`demo of ColTex ${VERSION} in public/demo`)

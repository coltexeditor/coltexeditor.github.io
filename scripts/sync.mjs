// Fetches what the site shows from ColTex's latest release (the newest vX.Y.Z tag), with a
// sparse checkout of just these paths:
//   install.sh          served as /install.sh and read for the install replay's messages
//   help docs           the documentation pages (apps/web/src/pages/help: the sections and
//                       their Markdown in every language; titles from apps/web/src/locales)
//   docs/images         the editor screenshot
// Nothing fetched is ever run. Without a network the files from the last sync are kept.
import { execFile } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'

const REPO = process.env.COLTEX_REPO ?? 'Lewen-Cai/coltex'
const URL = process.env.COLTEX_REPO_URL ?? `https://github.com/${REPO}.git`
const CHECKOUT = '.cache/latest'
const PATHS = ['install.sh', 'docs/images', 'apps/web/src/pages/help', 'apps/web/src/locales']
const OUT = 'src/generated'

const run = promisify(execFile)
const sleep = ms => new Promise(r => setTimeout(r, ms))

// GitHub resets connections now and then; four tries, as the installer does.
async function git(args, cwd) {
  for (let i = 1; ; i++) {
    try {
      return (await run('git', args, { cwd, maxBuffer: 1 << 24 })).stdout
    } catch (err) {
      if (i === 4) throw new Error(`git ${args[0]}: ${err.stderr || err.message}`)
      await sleep(i * 1000)
    }
  }
}

async function latestRelease() {
  if (process.env.COLTEX_VERSION) return process.env.COLTEX_VERSION
  const tags = (await git(['ls-remote', '--tags', '--refs', URL, 'v*']))
    .split('\n')
    .map(l => l.replace(/.*refs\/tags\//, ''))
    .filter(t => /^v\d+\.\d+\.\d+$/.test(t))
  if (!tags.length) throw new Error(`no vX.Y.Z tag in ${REPO}`)
  const key = t => t.slice(1).split('.').map(Number)
  return tags.sort((a, b) => key(a)[0] - key(b)[0] || key(a)[1] - key(b)[1] || key(a)[2] - key(b)[2]).at(-1)
}

async function checkout(version) {
  await fs.rm(CHECKOUT, { recursive: true, force: true })
  await git(['clone', '-q', '--depth', '1', '--branch', version, '--filter=blob:none', '--sparse', URL, CHECKOUT])
  await git(['sparse-checkout', 'set', '--no-cone', ...PATHS.map(p => `/${p}`)], CHECKOUT)
}

/** The help sections in order, with their titles in each language (from nav.ts and the locales). */
async function sections(languages) {
  const nav = await fs.readFile(path.join(CHECKOUT, 'apps/web/src/pages/help/nav.ts'), 'utf8')
  const list = [...nav.matchAll(/\{ id: '([a-z-]+)', title: tk\('([^']+)'\)(, admin: true)? \}/g)].map(m => ({ id: m[1], title: m[2], admin: !!m[3] }))
  if (!list.length) throw new Error('help/nav.ts: no sections found')
  const titles = {}
  for (const lang of languages) {
    titles[lang] = {}
    // English is the keys themselves.
    const dir = path.join(CHECKOUT, 'apps/web/src/locales', lang)
    const files = lang === 'en' ? [] : await fs.readdir(dir)
    const text = (await Promise.all(files.map(f => fs.readFile(path.join(dir, f), 'utf8')))).join('\n')
    for (const s of list) {
      const quoted = s.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const m = text.match(new RegExp(`^\\s*(?:'${quoted}'|${quoted}): '((?:[^'\\\\]|\\\\.)*)'`, 'm'))
      if (m) titles[lang][s.id] = m[1].replace(/\\'/g, "'")
    }
  }
  return list.map(s => ({ ...s, titles: Object.fromEntries(languages.map(l => [l, titles[l][s.id] ?? s.title])) }))
}

try {
  const version = await latestRelease()
  await checkout(version)
  const from = p => path.join(CHECKOUT, p)
  await fs.rm(OUT, { recursive: true, force: true })
  await fs.mkdir(`${OUT}/docs`, { recursive: true })
  await fs.mkdir('public/images', { recursive: true })
  await fs.copyFile(from('install.sh'), `${OUT}/install.sh`)
  await fs.copyFile(from('install.sh'), 'public/install.sh')
  await fs.copyFile(from('docs/images/editor.png'), 'public/images/editor.png')
  const docs = from('apps/web/src/pages/help/docs')
  const languages = (await fs.readdir(docs)).filter(l => !l.startsWith('.'))
  await fs.cp(docs, `${OUT}/docs`, { recursive: true })
  await fs.writeFile(`${OUT}/sections.json`, JSON.stringify(await sections(['en', ...languages.filter(l => l !== 'en')]), null, 2) + '\n')
  await fs.writeFile(`${OUT}/release.json`, JSON.stringify({ repo: REPO, version }, null, 2) + '\n')
  // What the Pages workflow compares with the latest release.
  await fs.writeFile('public/version.txt', version)
  console.log(`synced ColTex ${version} from ${REPO}`)
} catch (err) {
  try {
    await fs.access(`${OUT}/release.json`)
  } catch {
    throw err
  }
  console.warn(`sync failed, keeping the last one: ${err.message}`)
}

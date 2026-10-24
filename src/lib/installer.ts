// The installer's own messages, read from the install.sh of the latest release (see
// scripts/sync.mjs), so the replay says exactly what the installer says, in its 14 languages.
import script from '../generated/install.sh?raw'
import release from '../generated/release.json'

const messages: Record<string, Record<string, string>> = {}
let lang = ''
for (const line of script.split('\n')) {
  const fn = line.match(/^msg_([A-Za-z_]+)\(\) \{$/)
  if (fn) {
    lang = fn[1].replace('_', '-')
    messages[lang] = {}
    continue
  }
  const m = lang && line.match(/^\s+([a-z_]+)\) M='(.*)' ;;$/)
  if (m) messages[lang][m[1]] = m[2]
  if (line.startsWith('# <<< messages')) break
}

/** The message `key` in `lang` (English when that language lacks it), {name}s filled in. */
export function installerText(lang: string, key: string, values: Record<string, string> = {}) {
  let text = messages[lang]?.[key] || messages.en?.[key]
  if (text === undefined) throw new Error(`install.sh has no message ${key}`)
  for (const [k, v] of Object.entries(values)) text = text.replaceAll(`{${k}}`, v)
  return text
}

export const version: string = release.version
export const repo: string = release.repo

// The mark as install.sh draws it: its pixel rows and the order the pen draws the sigma in.
const logoBlock = script.match(/^LOGO=\(\n([\s\S]*?)\n\)$/m)
const strokeLine = script.match(/^STROKE="([^"]+)"$/m)
if (!logoBlock || !strokeLine) throw new Error('install.sh: LOGO or STROKE not found')
export const logoPixels: string[] = logoBlock[1].split('\n').map(l => l.trim().slice(1, -1))
export const logoStroke = strokeLine[1].split(' ').map(p => p.split(',').map(Number) as [number, number])

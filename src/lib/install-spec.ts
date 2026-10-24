// What the replay shows: a fresh install with the standard edition from GitHub, in the page's
// language, every text from the installer itself.
import { installerText, logoPixels, logoStroke, version } from './installer.ts'
import type { Seg, Spec } from './replay.ts'

export const INSTALL_COMMAND = 'curl -fsSL https://coltexeditor.github.io/install.sh | bash'

const s = (t: string, c?: string): Seg => (c ? { t, c } : { t })

// "Standard: every package…" → name and details, as the installer splits them.
function option(text: string) {
  const name = text.split(/[:：]/)[0]
  return { name, detail: text.slice(name.length + 1).trim() }
}

export function installSpec(lang: string): Spec {
  const T = (key: string, values?: Record<string, string>) => installerText(lang, key, values)
  const address = (url: string, what: string): Seg[] => [s('    '), s(url, 'blue'), s('  '), s(what, 'd')]
  const command = (c: string): Seg[] => [s('    '), s(`coltex ${c}`.padEnd(15), 'b'), s(T(`cmd_${c}`), 'd')]
  return {
    logo: { pixels: logoPixels, stroke: logoStroke, name: 'ColTex', tagline: T('tagline') },
    steps: [
      { kind: 'type', prompt: '$ ', command: INSTALL_COMMAND },
      { kind: 'blank' },
      { kind: 'logo' },
      { kind: 'step', label: T('checking_docker'), ms: 700 },
      {
        kind: 'choose',
        title: T('edition_q'),
        options: [option(T('edition_standard')), option(T('edition_full'))],
        path: [0, 1, 0],
      },
      { kind: 'blank' },
      { kind: 'step', label: T('getting', { version }), ms: 1300 },
      { kind: 'step', label: T('writing_settings'), ms: 400 },
      { kind: 'note', text: T('download_github') },
      { kind: 'download', label: T('downloading'), total: 3.1e9, ms: 6000 },
      { kind: 'step', label: T('starting'), ms: 1500 },
      { kind: 'step', label: T('waiting'), ms: 1700 },
      {
        kind: 'print',
        lines: [
          [],
          [s('  '), s(T('running_fresh'), 'b')],
          [],
          address('http://localhost:3690', T('this_machine')),
          address('http://192.168.1.20:3690', T('your_network')),
          [],
          [s('  '), s(T('commands'), 'b')],
          command('status'),
          command('logs'),
          command('update'),
          command('help'),
          [],
          [s(`  ${T('remote_access')}`)],
          [s('  '), s(T('full_output', { log: '~/coltex/install.log' }), 'd')],
        ],
      },
    ],
  }
}

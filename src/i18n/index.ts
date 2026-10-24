import en from './en.ts'
import zhCN from './zh-CN.ts'
import zhTW from './zh-TW.ts'
import ja from './ja.ts'
import ko from './ko.ts'
import es from './es.ts'
import fr from './fr.ts'
import de from './de.ts'
import ptBR from './pt-BR.ts'
import it from './it.ts'
import ru from './ru.ts'
import tr from './tr.ts'
import vi from './vi.ts'
import id from './id.ts'

// The interface languages of ColTex (the same ids and labels, apps/web/src/lib/locales.ts).
// `path` is the folder each one lives under; English is at the root.
export const LANGUAGES = [
  { id: 'en', label: 'English', path: '', html: 'en' },
  { id: 'zh-CN', label: '简体中文', path: 'zh-cn', html: 'zh-Hans' },
  { id: 'zh-TW', label: '繁體中文', path: 'zh-tw', html: 'zh-Hant' },
  { id: 'ja', label: '日本語', path: 'ja', html: 'ja' },
  { id: 'ko', label: '한국어', path: 'ko', html: 'ko' },
  { id: 'es', label: 'Español', path: 'es', html: 'es' },
  { id: 'fr', label: 'Français', path: 'fr', html: 'fr' },
  { id: 'de', label: 'Deutsch', path: 'de', html: 'de' },
  { id: 'pt-BR', label: 'Português (Brasil)', path: 'pt-br', html: 'pt-BR' },
  { id: 'it', label: 'Italiano', path: 'it', html: 'it' },
  { id: 'ru', label: 'Русский', path: 'ru', html: 'ru' },
  { id: 'tr', label: 'Türkçe', path: 'tr', html: 'tr' },
  { id: 'vi', label: 'Tiếng Việt', path: 'vi', html: 'vi' },
  { id: 'id', label: 'Bahasa Indonesia', path: 'id', html: 'id' },
] as const

export type Lang = (typeof LANGUAGES)[number]['id']

const dictionaries: Record<Lang, typeof en> = { en, 'zh-CN': zhCN, 'zh-TW': zhTW, ja, ko, es, fr, de, 'pt-BR': ptBR, it, ru, tr, vi, id }

export const dictionary = (lang: Lang) => dictionaries[lang]

export const homeHref = (lang: Lang) => {
  const path = LANGUAGES.find(l => l.id === lang)!.path
  return path ? `/${path}/` : '/'
}

/** This page in another language: the same path under that language's folder. */
export function samePage(pathname: string, from: Lang, to: Lang) {
  const prefix = LANGUAGES.find(l => l.id === from)!.path
  const rest = prefix && pathname.startsWith(`/${prefix}/`) ? pathname.slice(prefix.length + 1) : pathname
  const target = LANGUAGES.find(l => l.id === to)!.path
  return target ? `/${target}${rest}` : rest
}

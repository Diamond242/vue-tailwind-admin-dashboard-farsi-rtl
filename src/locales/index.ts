import { createI18n } from 'vue-i18n'

const LOCALE_STORAGE_KEY = 'locale'
const RTL_LOCALES = new Set(['fa'])

export const SUPPORTED_LOCALES = ['en', 'fa'] as const
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

const localeLoaders = import.meta.glob('./*/**/*.json')

const normalizeLocale = (locale: string): SupportedLocale =>
  locale.startsWith('fa') ? 'fa' : 'en'

const getStoredLocale = (): SupportedLocale | null => {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
    return stored ? normalizeLocale(stored) : null
  } catch {
    return null
  }
}

const applyHtmlLocale = (locale: SupportedLocale) => {
  if (typeof document === 'undefined') {
    return
  }
  document.documentElement.lang = locale
  document.documentElement.dir = RTL_LOCALES.has(locale) ? 'rtl' : 'ltr'
}

const loadLocaleMessages = async (locale: SupportedLocale) => {
  const messages: Record<string, unknown> = {}
  const entries = Object.entries(localeLoaders).filter(([path]) =>
    path.startsWith(`./${locale}/`),
  )

  for (const [path, loader] of entries) {
    const module = (await loader()) as { default: unknown }
    const fileName = path.split('/').pop()?.replace('.json', '')
    if (fileName) {
      messages[fileName] = module.default
    }
  }

  return messages
}

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {},
  missingWarn: import.meta.env.DEV,
  fallbackWarn: import.meta.env.DEV,
})

export const setLocale = async (locale: SupportedLocale) => {
  const normalized = normalizeLocale(locale)

  if (!i18n.global.availableLocales.includes(normalized)) {
    const messages = await loadLocaleMessages(normalized)
    i18n.global.setLocaleMessage(normalized, messages)
  }

  i18n.global.locale.value = normalized
  applyHtmlLocale(normalized)
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, normalized)
  } catch {
    // Ignore storage errors (private mode, blocked storage, etc.).
  }
}

export const initI18n = async () => {
  const browserLocale =
    typeof navigator === 'undefined' ? 'en' : normalizeLocale(navigator.language)
  const initialLocale = getStoredLocale() ?? browserLocale
  await setLocale(initialLocale)
}

export default i18n

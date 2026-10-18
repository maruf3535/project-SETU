import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import bnBase from './bn'
import enBase from './en'
import government from './portals/government'
import publisher from './portals/publisher'
import teacher from './portals/teacher'

// Portal text lives in its own file per portal, mounted under the portal's name (t('teacher.…'))
const portalTexts = { teacher, government, publisher }
const en = { ...enBase, ...Object.fromEntries(Object.entries(portalTexts).map(([k, v]) => [k, v.en])) }
const bn = { ...bnBase, ...Object.fromEntries(Object.entries(portalTexts).map(([k, v]) => [k, v.bn])) }
const dictionaries = { en, bn }
const STORAGE_KEY = 'setu.lang'

const I18nContext = createContext(null)

function readStoredLang() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'bn' ? 'bn' : 'en'
  } catch {
    return 'en'
  }
}

function lookup(dict, key) {
  return key.split('.').reduce((node, part) => node?.[part], dict)
}

// Fills {placeholders} in a string; arrays and objects pass through untouched
function interpolate(value, vars) {
  if (!vars || typeof value !== 'string') return value
  return value.replace(/\{(\w+)\}/g, (match, name) => vars[name] ?? match)
}

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(readStoredLang)

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // storage can be blocked; the toggle still works for this visit
    }
  }, [lang])

  const value = useMemo(() => {
    // en-IN groups digits the Bangladeshi way (1,20,000), bn-BD also swaps in Bangla numerals
    const locale = lang === 'bn' ? 'bn-BD' : 'en-IN'
    const numberFormat = new Intl.NumberFormat(locale)
    return {
      lang,
      setLang,
      t: (key, vars) => interpolate(lookup(dictionaries[lang], key) ?? lookup(en, key) ?? key, vars),
      num: (n) => numberFormat.format(n),
      money: (n) => `৳${numberFormat.format(n)}`,
      date: (iso, options = { day: 'numeric', month: 'short', year: 'numeric' }) =>
        new Intl.DateTimeFormat(locale, options).format(new Date(iso)),
      // Demo records keep text as { en, bn }; text a user typed is a plain string
      L: (text) => (text && typeof text === 'object' && !Array.isArray(text) ? (text[lang] ?? text.en) : text),
    }
  }, [lang])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  return useContext(I18nContext)
}

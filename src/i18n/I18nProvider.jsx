import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import bn from './bn'
import en from './en'

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
    const numberFormat = new Intl.NumberFormat(lang === 'bn' ? 'bn-BD' : 'en-IN')
    return {
      lang,
      setLang,
      t: (key, vars) => interpolate(lookup(dictionaries[lang], key) ?? lookup(en, key) ?? key, vars),
      num: (n) => numberFormat.format(n),
    }
  }, [lang])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  return useContext(I18nContext)
}

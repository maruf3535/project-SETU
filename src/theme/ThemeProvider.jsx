import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'setu.theme'
const darkQuery = '(prefers-color-scheme: dark)'

const ThemeContext = createContext(null)

function readStoredTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'light' || stored === 'dark' ? stored : null
  } catch {
    return null
  }
}

export function ThemeProvider({ children }) {
  // null means "follow the system setting"
  const [theme, setTheme] = useState(readStoredTheme)
  const [systemDark, setSystemDark] = useState(() => window.matchMedia(darkQuery).matches)

  useEffect(() => {
    const media = window.matchMedia(darkQuery)
    const onChange = (event) => setSystemDark(event.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (theme) root.dataset.theme = theme
    else delete root.dataset.theme
    try {
      if (theme) localStorage.setItem(STORAGE_KEY, theme)
      else localStorage.removeItem(STORAGE_KEY)
    } catch {
      // storage can be blocked; the theme still applies for this visit
    }
  }, [theme])

  const value = useMemo(() => {
    const isDark = theme ? theme === 'dark' : systemDark
    return { isDark, toggleTheme: () => setTheme(isDark ? 'light' : 'dark') }
  }, [theme, systemDark])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}

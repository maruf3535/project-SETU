import { Moon, Sun } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'
import { useTheme } from '../theme/ThemeProvider'

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()
  const { t } = useI18n()
  const label = t(isDark ? 'shell.themeLight' : 'shell.themeDark')

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="grid size-9 place-items-center rounded-full border border-line bg-surface text-ink-2 transition-colors hover:text-ink"
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  )
}

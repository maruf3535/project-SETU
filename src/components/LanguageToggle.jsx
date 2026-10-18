import { useI18n } from '../i18n/I18nProvider'

const options = [
  { lang: 'en', label: 'EN' },
  { lang: 'bn', label: 'বাং' },
]

export default function LanguageToggle() {
  const { lang, setLang, t } = useI18n()

  return (
    <div role="group" aria-label={t('shell.language')} className="flex rounded-full border border-line bg-surface p-0.5">
      {options.map((option) => (
        <button
          key={option.lang}
          type="button"
          lang={option.lang}
          aria-pressed={lang === option.lang}
          onClick={() => setLang(option.lang)}
          className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
            lang === option.lang ? 'bg-brand text-brand-ink' : 'text-ink-2 hover:text-ink'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

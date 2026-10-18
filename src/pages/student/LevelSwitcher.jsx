import { useToast } from '../../components/Toast'
import { LEVELS, studentLevels } from '../../data/demo/studentLevels'
import { useI18n } from '../../i18n/I18nProvider'
import { useDemo } from '../../store/DemoStore'

// School / College / University. Each level signs in a different demo student.
export default function LevelSwitcher({ tone = 'light' }) {
  const { t } = useI18n()
  const { studentLevel, studentById, dispatch } = useDemo()
  const toast = useToast()
  const dark = tone === 'dark'

  function pick(level) {
    if (level === studentLevel) return
    dispatch({ type: 'setLevel', level })
    toast(t('student.levelSwitched', { level: t(`student.levels.${level}`), name: studentById[studentLevels[level].studentId].name }))
  }

  return (
    <div
      role="radiogroup"
      aria-label={t('student.levelLabel')}
      className={`grid grid-cols-3 gap-1 rounded-xl p-1 ${dark ? 'bg-brand-ink/[0.07]' : 'border border-line bg-surface'}`}
    >
      {LEVELS.map((level) => {
        const active = level === studentLevel
        return (
          <button
            key={level}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => pick(level)}
            className={`truncate rounded-lg px-2 py-1.5 text-xs font-semibold transition-colors ${
              active
                ? 'bg-accent text-accent-ink'
                : dark
                  ? 'text-brand-ink/70 hover:text-brand-ink'
                  : 'text-ink-2 hover:text-ink'
            }`}
          >
            {t(`student.levels.${level}`)}
          </button>
        )
      })}
    </div>
  )
}

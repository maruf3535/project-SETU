import { useToast } from '../../components/Toast'
import { TEACHER_LEVELS, teacherLevels } from '../../data/demo/teacher'
import { useI18n } from '../../i18n/I18nProvider'
import { useTeacher } from './useTeacher'

// School / College or University. Each level signs in a different demo teacher.
export default function LevelSwitcher({ tone = 'light' }) {
  const { t } = useI18n()
  const { level: current, save } = useTeacher()
  const toast = useToast()
  const dark = tone === 'dark'

  function pick(level) {
    if (level === current) return
    save('level', level)
    toast(t('teacher.levelSwitched', { level: t(`teacher.levels.${level}`), name: teacherLevels[level].name }))
  }

  return (
    <div
      role="radiogroup"
      aria-label={t('teacher.levelLabel')}
      className={`grid grid-cols-2 gap-1 rounded-xl p-1 ${dark ? 'bg-brand-ink/[0.07]' : 'border border-line bg-surface'}`}
    >
      {TEACHER_LEVELS.map((level) => {
        const active = level === current
        return (
          <button
            key={level}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => pick(level)}
            className={`truncate rounded-lg px-2 py-1.5 text-xs font-semibold transition-colors ${
              active ? 'bg-accent text-accent-ink' : dark ? 'text-brand-ink/70 hover:text-brand-ink' : 'text-ink-2 hover:text-ink'
            }`}
          >
            {t(`teacher.levels.${level}`)}
          </button>
        )
      })}
    </div>
  )
}

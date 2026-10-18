import { useI18n } from '../../i18n/I18nProvider'

const examStateStyles = {
  live: 'bg-accent text-accent-ink',
  scheduled: 'bg-[color-mix(in_oklab,var(--primary)_14%,transparent)] text-primary',
}

export function ExamStatePill({ state }) {
  const { t } = useI18n()
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${examStateStyles[state]}`}>
      <span className="size-1.5 rounded-full bg-current" />
      {t(`teacher.examState.${state}`)}
    </span>
  )
}

// Small uppercase label used above groups of content
export function Eyebrow({ children, className = '' }) {
  return <p className={`text-xs font-semibold tracking-[0.12em] text-ink-2 uppercase ${className}`}>{children}</p>
}

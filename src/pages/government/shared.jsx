import { useI18n } from '../../i18n/I18nProvider'

export function PriorityPill() {
  const { t } = useI18n()
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-bad-soft px-2.5 py-1 text-xs font-semibold whitespace-nowrap text-bad">
      <span className="size-1.5 rounded-full bg-current" />
      {t('government.priority')}
    </span>
  )
}

export function SectionLabel({ children }) {
  return <h3 className="text-xs font-semibold tracking-[0.12em] text-ink-2 uppercase">{children}</h3>
}

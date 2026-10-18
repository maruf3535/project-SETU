import { BadgeCheck, X } from 'lucide-react'
import { useEffect } from 'react'
import { useI18n } from '../i18n/I18nProvider'

// Challenge status → pill colours (state is encoded in form, not only in words)
const statusStyles = {
  review: 'bg-warn-soft text-warn',
  open: 'bg-[color-mix(in_oklab,var(--primary)_14%,transparent)] text-primary',
  in_progress: 'bg-surface-2 text-ink',
  submitted: 'bg-accent text-accent-ink',
  paid: 'bg-ok-soft text-ok',
  returned: 'bg-bad-soft text-bad',
}

const milestoneStyles = {
  paid: 'bg-ok-soft text-ok',
  submitted: 'bg-accent text-accent-ink',
  in_progress: 'bg-surface-2 text-ink',
  upcoming: 'bg-transparent text-ink-2 ring-1 ring-line ring-inset',
}

export function StatusPill({ status, kind = 'status' }) {
  const { t } = useI18n()
  const styles = kind === 'milestone' ? milestoneStyles : statusStyles
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${styles[status]}`}>
      <span className="size-1.5 rounded-full bg-current" />
      {t(`common.${kind}.${status}`)}
    </span>
  )
}

export function SkillChip({ name, verified, level }) {
  const { t } = useI18n()
  return (
    <span
      title={verified ? t('common.verified') : t('common.selfReported')}
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
        verified ? 'bg-[color-mix(in_oklab,var(--primary)_12%,transparent)] text-primary' : 'bg-surface-2 text-ink-2'
      }`}
    >
      {name}
      {level && <span className="font-normal opacity-75">· {t(`common.levels.${level}`)}</span>}
      {verified && <BadgeCheck className="size-3.5" />}
    </span>
  )
}

export function Stat({ label, value, note, tone = 'default' }) {
  return (
    <div className={`rounded-2xl p-5 ${tone === 'brand' ? 'bg-brand text-brand-ink' : 'border border-line bg-surface'}`}>
      <p className={`text-xs font-semibold tracking-[0.12em] uppercase ${tone === 'brand' ? 'text-brand-ink/60' : 'text-ink-2'}`}>{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold tabular-nums">{value}</p>
      {note && <p className={`mt-1 text-xs ${tone === 'brand' ? 'text-brand-ink/60' : 'text-ink-2'}`}>{note}</p>}
    </div>
  )
}

export function Panel({ title, action, children, className = '' }) {
  return (
    <section className={`rounded-2xl border border-line bg-surface ${className}`}>
      {(title || action) && (
        <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
          <h2 className="font-semibold">{title}</h2>
          {action}
        </header>
      )}
      {children}
    </section>
  )
}

export function PageIntro({ title, body, children }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <h2 className="font-display text-3xl font-semibold">{title}</h2>
        {body && <p className="mt-1.5 text-ink-2">{body}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  )
}

export function Dialog({ open, title, onClose, children }) {
  const { t } = useI18n()

  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 grid place-items-end p-0 sm:place-items-center sm:p-4" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" aria-label={t('common.close')} onClick={onClose} className="absolute inset-0 bg-black/45" />
      <div className="relative max-h-[90dvh] w-full overflow-y-auto rounded-t-3xl bg-surface p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl sm:max-w-md sm:rounded-3xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="font-display text-2xl font-semibold">{title}</h2>
          <button type="button" onClick={onClose} aria-label={t('common.close')} className="-mr-2 grid size-9 shrink-0 place-items-center rounded-full text-ink-2 hover:bg-surface-2">
            <X className="size-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export const buttonStyles = {
  primary: 'inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-ink transition-opacity hover:opacity-90 disabled:opacity-45',
  accent: 'inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink transition-opacity hover:opacity-90',
  ghost: 'inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-surface-2',
}

export const inputStyles =
  'w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-ink outline-none transition-colors placeholder:text-ink-2/70 focus:border-primary'

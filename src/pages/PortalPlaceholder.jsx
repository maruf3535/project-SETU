import { ArrowLeft, Construction } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/I18nProvider'

// Stand-in for portal pages that Phase 2 replaces with real screens
export default function PortalPlaceholder({ role, item }) {
  const { t } = useI18n()
  const Icon = item.icon

  return (
    <section className="mx-auto grid max-w-xl place-items-center gap-4 rounded-3xl border border-dashed border-line bg-surface px-6 py-14 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-[color-mix(in_oklab,var(--role)_14%,transparent)] text-role">
        <Icon className="size-7" />
      </span>
      <div className="grid gap-1.5">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-ink-2 uppercase">{t(`nav.${item.key}`)}</p>
        <h2 className="font-display text-2xl font-semibold">{t('placeholder.title')}</h2>
        <p className="text-sm text-ink-2">{t('placeholder.body')}</p>
      </div>
      <div className="flex items-center gap-2 text-xs text-ink-2">
        <Construction className="size-4 text-accent" />
        Phase 2
      </div>
      {item.path && (
        <Link to={`/${role}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
          <ArrowLeft className="size-4" />
          {t('placeholder.back')}
        </Link>
      )}
    </section>
  )
}

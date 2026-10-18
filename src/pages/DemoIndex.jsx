import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import LanguageToggle from '../components/LanguageToggle'
import SetuMark from '../components/SetuMark'
import ThemeToggle from '../components/ThemeToggle'
import { portals, ROLES } from '../data/portals'
import { useI18n } from '../i18n/I18nProvider'

// Temporary start page for Phase 0; Phase 1 replaces it with the landing page
export default function DemoIndex() {
  const { t } = useI18n()

  return (
    <div className="min-h-dvh bg-canvas">
      <div className="bg-brand text-brand-ink">
        <div className="mx-auto max-w-5xl pt-[max(1.5rem,env(safe-area-inset-top))] pr-[max(1rem,env(safe-area-inset-right))] pb-14 pl-[max(1rem,env(safe-area-inset-left))] sm:px-8">
          <div className="flex items-center gap-3">
            <SetuMark className="size-9" />
            <span className="flex-1 font-display text-2xl font-semibold">{t('brand.name')}</span>
            <LanguageToggle />
            <ThemeToggle />
          </div>
          <p className="mt-14 text-xs font-semibold tracking-[0.16em] text-accent uppercase">{t('demoIndex.eyebrow')}</p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl leading-[1.05] font-semibold sm:text-6xl">
            {t('demoIndex.title')}
          </h1>
          <p className="mt-4 max-w-xl text-brand-ink/70">{t('demoIndex.body')}</p>
        </div>
      </div>

      <div className="mx-auto -mt-8 grid max-w-5xl gap-3 pr-[max(1rem,env(safe-area-inset-right))] pb-12 pl-[max(1rem,env(safe-area-inset-left))] sm:grid-cols-2 sm:px-8 lg:grid-cols-3">
        {ROLES.map((role) => {
          const portal = portals[role]
          return (
            <Link
              key={role}
              to={`/${role}`}
              style={{ '--role': portal.color }}
              className="group flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-role"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[color-mix(in_oklab,var(--role)_14%,transparent)] text-role">
                <portal.icon className="size-6" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">{t(`portalTitles.${role}`)}</span>
                <span className="block truncate text-sm text-ink-2">{portal.user.name}</span>
              </span>
              <ArrowRight className="size-5 text-ink-2 transition-transform group-hover:translate-x-0.5 group-hover:text-role" />
            </Link>
          )
        })}
      </div>
    </div>
  )
}

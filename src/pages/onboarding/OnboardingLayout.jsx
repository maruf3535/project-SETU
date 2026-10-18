import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import LanguageToggle from '../../components/LanguageToggle'
import SetuMark from '../../components/SetuMark'
import ThemeToggle from '../../components/ThemeToggle'
import { portals } from '../../data/portals'
import { useI18n } from '../../i18n/I18nProvider'

const tierRoles = ['student', 'teacher', 'publisher', 'industry']

function SidePanel() {
  const { t } = useI18n()
  const tiers = t('landing.verify.tiers')

  return (
    <aside className="sticky top-0 hidden h-dvh flex-col bg-brand p-10 text-brand-ink lg:flex">
      <Link to="/" className="flex items-center gap-2.5">
        <SetuMark className="size-9" />
        <span className="font-display text-2xl font-semibold">{t('brand.name')}</span>
      </Link>
      <div className="my-auto max-w-sm">
        <span className="grid size-12 place-items-center rounded-full bg-accent text-accent-ink">
          <ShieldCheck className="size-6" />
        </span>
        <h2 className="mt-6 font-display text-3xl leading-tight font-semibold">{t('onboarding.sidePanelTitle')}</h2>
        <p className="mt-3 leading-relaxed text-brand-ink/70">{t('onboarding.sidePanelBody')}</p>
        <ul className="mt-8 grid gap-2">
          {tiers.map((tier, index) => {
            const role = tierRoles[index]
            const Icon = portals[role].icon
            return (
              <li key={tier.title} className="flex items-center gap-3 rounded-xl bg-brand-ink/[0.07] px-3 py-2.5 text-sm">
                <Icon className="size-4 text-accent" />
                <span className="font-semibold">{tier.title}</span>
                <span className="truncate text-brand-ink/60">{tier.body}</span>
              </li>
            )
          })}
        </ul>
      </div>
      <p lang="bn" className="font-display text-lg text-brand-ink/70">
        “শুধু শিক্ষাকেই না, স্কিলকেও মূল্যায়ন করা।”
      </p>
    </aside>
  )
}

// Split screen: brand panel on the left (desktop), the step on the right
export default function OnboardingLayout({ step, backTo, children }) {
  const { t, num } = useI18n()

  return (
    <div className="min-h-dvh bg-canvas text-ink lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <SidePanel />
      <div className="flex min-h-dvh flex-col pt-[max(1rem,env(safe-area-inset-top))] pr-[max(1rem,env(safe-area-inset-right))] pb-[max(1.5rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] sm:pr-[max(2rem,env(safe-area-inset-right))] sm:pl-[max(2rem,env(safe-area-inset-left))]">
        <div className="flex h-12 items-center gap-3">
          <Link to={backTo} className="-ml-2 inline-flex items-center gap-1.5 rounded-full px-2 py-1.5 text-sm font-medium text-ink-2 hover:text-ink">
            <ArrowLeft className="size-4" /> {t('onboarding.back')}
          </Link>
          <span className="flex-1 text-center text-sm text-ink-2 tabular-nums">{step ? t('onboarding.step', { n: num(step) }) : ''}</span>
          <LanguageToggle />
          <ThemeToggle />
        </div>
        {step && (
          <div className="mt-3 grid grid-cols-3 gap-1.5" aria-hidden="true">
            {[1, 2, 3].map((n) => (
              <span key={n} className={`h-1.5 rounded-full ${n <= step ? 'bg-primary' : 'bg-line'}`} />
            ))}
          </div>
        )}
        <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">{children}</main>
      </div>
    </div>
  )
}

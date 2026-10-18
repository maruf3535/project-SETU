import { BookOpen, GraduationCap, Landmark, Presentation } from 'lucide-react'
import { Link } from 'react-router-dom'
import { gutter } from '../../components/gutter'
import LanguageToggle from '../../components/LanguageToggle'
import SetuMark from '../../components/SetuMark'
import ThemeToggle from '../../components/ThemeToggle'
import { useI18n } from '../../i18n/I18nProvider'

// Screen 01 · Welcome: the four tiles stand for students, teachers, publishers and government
const tiles = [
  { icon: GraduationCap, className: 'bg-primary text-primary-ink' },
  { icon: Presentation, className: 'bg-accent text-accent-ink' },
  { icon: BookOpen, className: 'bg-brand-ink/90 text-brand' },
  { icon: Landmark, className: 'bg-primary text-primary-ink' },
]

export default function Welcome() {
  const { t } = useI18n()

  return (
    <div className={`flex min-h-dvh flex-col bg-brand text-brand-ink ${gutter} pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]`}>
      <div className="flex h-12 items-center justify-end gap-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>
      <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-8">
        <div className="flex items-center gap-2.5">
          <SetuMark className="size-10" />
          <span className="font-display text-2xl font-semibold">{t('brand.name')}</span>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3" aria-hidden="true">
          {tiles.map(({ icon: Icon, className }, index) => (
            <span key={index} className={`grid aspect-[4/3] place-items-center rounded-3xl ${className}`}>
              <Icon className="size-8" />
            </span>
          ))}
        </div>
        <h1 className="mt-10 font-display text-4xl leading-tight font-semibold">{t('onboarding.welcome.title')}</h1>
        <p className="mt-3 leading-relaxed text-brand-ink/70">{t('onboarding.welcome.body')}</p>
        <div className="mt-8 grid gap-3">
          <Link to="/onboarding" className="rounded-2xl bg-accent py-3.5 text-center font-semibold text-accent-ink transition-transform hover:-translate-y-px">
            {t('onboarding.welcome.create')}
          </Link>
          <Link to="/signin" className="rounded-2xl border border-brand-ink/25 py-3.5 text-center font-semibold text-brand-ink transition-colors hover:bg-brand-ink/10">
            {t('onboarding.welcome.signin')}
          </Link>
          <Link to="/" className="mt-2 text-center text-sm text-brand-ink/60 hover:text-brand-ink">
            {t('onboarding.welcome.website')}
          </Link>
        </div>
      </main>
    </div>
  )
}

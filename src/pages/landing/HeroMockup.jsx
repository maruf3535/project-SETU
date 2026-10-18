import { BadgeCheck, Bell, BookOpen, Briefcase, Flame, NotebookPen, Timer, TrendingUp, Video } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'

// A miniature of the student home screen (proposal Screen 04) with portfolio and job-match cards floating beside it
export default function HeroMockup() {
  const { t } = useI18n()

  const actions = [
    { icon: BookOpen, label: t('landing.mock.topic') },
    { icon: Timer, label: t('landing.mock.exam') },
    { icon: NotebookPen, label: t('landing.mock.notes') },
    { icon: Video, label: t('landing.mock.video') },
  ]

  return (
    <div className="relative mx-auto w-full max-w-[22rem] pb-6 lg:mr-0">
      <div className="rounded-[2.4rem] bg-[#0b1d21] p-2.5 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.6)]">
        <div className="overflow-hidden rounded-[1.9rem] bg-canvas text-ink" aria-hidden="true">
          <div className="flex items-center justify-between px-5 pt-3 text-[10px] font-semibold text-ink-2">
            <span>9:41</span>
            <span className="h-1.5 w-14 rounded-full bg-ink/15" />
          </div>
          <div className="flex items-center gap-2.5 px-4 pt-3">
            <span className="grid size-8 place-items-center rounded-full bg-accent text-[11px] font-bold text-accent-ink">NA</span>
            <div className="flex-1 leading-tight">
              <p className="text-[10px] text-ink-2">{t('landing.mock.greeting')}</p>
              <p className="flex items-center gap-1 text-[13px] font-semibold">
                Nusrat <BadgeCheck className="size-3.5 text-primary" />
              </p>
            </div>
            <span className="grid size-7 place-items-center rounded-full border border-line bg-surface">
              <Bell className="size-3.5" />
            </span>
          </div>

          <div className="mx-4 mt-3 rounded-2xl bg-brand p-3.5 text-brand-ink">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-semibold tracking-[0.12em] text-brand-ink/60 uppercase">{t('landing.mock.continue')}</p>
              <span className="flex items-center gap-1 rounded-full bg-accent-soft px-2 py-0.5 text-[9px] font-semibold text-warn">
                <Flame className="size-3" /> {t('landing.mock.streak')}
              </span>
            </div>
            <p className="mt-1.5 font-display text-[15px] font-semibold">{t('landing.mock.lesson')}</p>
            <p className="text-[10px] text-brand-ink/60">{t('landing.mock.progress')}</p>
            <div className="mt-2 h-1.5 rounded-full bg-brand-ink/15">
              <div className="h-full w-3/5 rounded-full bg-accent" />
            </div>
            <span className="mt-2.5 inline-block rounded-lg bg-accent px-3 py-1 text-[10px] font-semibold text-accent-ink">
              {t('landing.mock.resume')} →
            </span>
          </div>

          <div className="mx-4 mt-2.5 grid grid-cols-2 gap-2">
            {actions.map(({ icon: Icon, label }) => (
              <div key={label} className="rounded-xl border border-line bg-surface p-2.5">
                <Icon className="size-4 text-primary" />
                <p className="mt-1.5 text-[10px] leading-tight font-semibold">{label}</p>
              </div>
            ))}
          </div>

          <div className="mx-4 mt-2.5 mb-4 flex items-center gap-2.5 rounded-xl border border-line bg-surface p-2.5">
            <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-brand text-brand-ink">
              <TrendingUp className="size-3.5" />
            </span>
            <div className="min-w-0 leading-tight">
              <p className="text-[9px] font-semibold tracking-[0.1em] text-ink-2 uppercase">{t('landing.mock.alert')}</p>
              <p className="truncate text-[11px] font-semibold">{t('landing.mock.alertTitle')}</p>
              <p className="truncate text-[9px] text-ink-2">{t('landing.mock.alertBody')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-16 -left-6 hidden w-48 rounded-2xl border border-line bg-surface p-3 text-ink shadow-[0_20px_40px_-20px_rgb(0_0_0/0.5)] sm:block lg:-left-24" aria-hidden="true">
        <p className="text-[9px] font-semibold tracking-[0.12em] text-ink-2 uppercase">{t('landing.mock.skills')}</p>
        {[
          { skill: 'Python', level: t('landing.mock.advanced'), width: 'w-[85%]' },
          { skill: 'OpenCV', level: t('landing.mock.intermediate'), width: 'w-[60%]' },
        ].map((row) => (
          <div key={row.skill} className="mt-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1 font-semibold">
                {row.skill} <BadgeCheck className="size-3 text-primary" />
              </span>
              <span className="text-[9px] text-ink-2">{row.level}</span>
            </div>
            <div className="mt-1 h-1.5 rounded-full bg-surface-2">
              <div className={`h-full rounded-full bg-primary ${row.width}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="absolute -right-4 bottom-0 hidden w-52 rounded-2xl border border-line bg-surface p-3 text-ink shadow-[0_20px_40px_-20px_rgb(0_0_0/0.5)] sm:block lg:-right-8" aria-hidden="true">
        <div className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-lg bg-[color-mix(in_oklab,var(--role-industry)_16%,transparent)] text-[var(--role-industry)]">
            <Briefcase className="size-3.5" />
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-[11px] font-semibold">{t('landing.mock.job')}</p>
            <p className="truncate text-[9px] text-ink-2">{t('landing.mock.company')}</p>
          </div>
        </div>
        <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-ok-soft px-2 py-0.5 text-[10px] font-semibold text-ok">
          ✓ {t('landing.mock.match')}
        </span>
      </div>
    </div>
  )
}

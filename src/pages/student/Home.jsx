import { ArrowRight, BookOpen, Briefcase, Flame, NotebookPen, Sparkles, Timer, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Panel } from '../../components/ui'
import { FREE_BOOK_POINTS } from '../../data/demo/notes'
import { useI18n } from '../../i18n/I18nProvider'
import { useCurrentStudent } from '../../store/DemoStore'
import LevelSwitcher from './LevelSwitcher'
import { useMatchedOpportunities } from './useMatchedOpportunities'

export default function StudentHome() {
  const { t, L, num, money } = useI18n()
  const { level, config, student, points } = useCurrentStudent()
  const matches = useMatchedOpportunities().slice(0, 3)
  const progress = (config.continue.done / config.continue.total) * 100

  const actions = [
    { to: '/student/learn', icon: BookOpen, label: t('student.home.quick.topic') },
    { to: '/student/exam', icon: Timer, label: t('student.home.quick.exam') },
    { to: '/student/notes', icon: NotebookPen, label: t('student.home.quick.notes') },
    { to: '/student/tutor', icon: Sparkles, label: t('student.home.quick.tutor') },
  ]

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-5 lg:hidden">
        <LevelSwitcher />
      </div>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-ink-2">{L(config.curriculum)}</p>
          <h2 className="font-display text-3xl font-semibold">{t('student.home.greeting', { name: student.name.split(' ')[0] })}</h2>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1.5 text-sm font-semibold text-warn">
          <Flame className="size-4" /> {t('student.home.streak', { n: num(config.streak) })}
        </span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="grid content-start gap-6">
          <section className="rounded-3xl bg-brand p-6 text-brand-ink">
            <p className="text-xs font-semibold tracking-[0.14em] text-brand-ink/60 uppercase">{t('student.home.continue')}</p>
            <h3 className="mt-2 font-display text-2xl font-semibold">{L(config.continue.title)}</h3>
            <p className="mt-1 text-sm text-brand-ink/65">
              {t('student.home.progress', { done: num(config.continue.done), total: num(config.continue.total) })}
            </p>
            <div className="mt-4 h-2 rounded-full bg-brand-ink/15">
              <div className="h-full rounded-full bg-accent" style={{ width: `${progress}%` }} />
            </div>
            <Link to="/student/learn" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink">
              {t('student.home.resume')} <ArrowRight className="size-4" />
            </Link>
          </section>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {actions.map(({ to, icon: Icon, label }) => (
              <Link key={to} to={to} className="rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-primary">
                <Icon className="size-5 text-primary" />
                <p className="mt-3 text-sm font-semibold">{label}</p>
              </Link>
            ))}
          </div>

          <Link to="/student/learn" className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 hover:border-primary">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand text-brand-ink">
              <TrendingUp className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-semibold tracking-[0.12em] text-ink-2 uppercase">
                {level === 'university' ? t('student.home.courseAlert') : t('student.home.alert')}
              </span>
              <span className="block font-semibold">{L(config.alert.title)}</span>
              <span className="block text-sm text-ink-2">{L(config.alert.body)}</span>
            </span>
            <ArrowRight className="size-5 shrink-0 text-ink-2" />
          </Link>

          {config.resources && (
            <Panel title={t('student.home.resources')}>
              <ul className="divide-y divide-line">
                {config.resources.map((res) => (
                  <li key={L(res.title)} className="flex items-center gap-3 px-5 py-3.5">
                    <span className="rounded-md bg-surface-2 px-2 py-1 text-[11px] font-semibold text-ink-2">{t(`student.resourceKinds.${res.kind}`)}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{L(res.title)}</span>
                      <span className="block truncate text-xs text-ink-2">
                        {L(res.by)} · {t('student.notes.pages', { n: num(res.pages) })}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </Panel>
          )}
        </div>

        <div className="grid content-start gap-6">
          <section className="rounded-2xl bg-accent p-5 text-accent-ink">
            <p className="text-xs font-semibold tracking-[0.12em] uppercase opacity-70">{t('student.home.points')}</p>
            <p className="mt-1 font-display text-4xl font-semibold tabular-nums">{num(points)}</p>
            <div className="mt-3 h-2 rounded-full bg-accent-ink/15">
              <div className="h-full rounded-full bg-accent-ink" style={{ width: `${Math.min(100, (points / FREE_BOOK_POINTS) * 100)}%` }} />
            </div>
            <p className="mt-2 text-sm">{t('student.home.pointsNote', { n: num(Math.max(0, FREE_BOOK_POINTS - points)) })}</p>
          </section>

          <Panel
            title={t('student.home.matches')}
            action={
              <Link to="/student/opportunities" className="text-sm font-semibold text-primary hover:underline">
                {t('common.viewAll')}
              </Link>
            }
          >
            <ul className="divide-y divide-line">
              {matches.map((item) => (
                <li key={item.id}>
                  <Link to={`/student/opportunities/${item.id}`} className="flex items-center gap-3 px-5 py-3.5 hover:bg-surface-2/60">
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[color-mix(in_oklab,var(--role-industry)_14%,transparent)] text-[var(--role-industry)]">
                      <Briefcase className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{L(item.title)}</span>
                      <span className="block truncate text-xs text-ink-2">
                        {item.org} · {money(item.pay)}
                      </span>
                    </span>
                    <span className="rounded-full bg-ok-soft px-2 py-0.5 text-xs font-semibold text-ok tabular-nums">{num(item.match)}%</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  )
}

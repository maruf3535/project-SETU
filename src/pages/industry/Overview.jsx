import { ArrowRight, CircleCheck, Clock3, Inbox, Plus, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { buttonStyles, PageIntro, Panel, Stat } from '../../components/ui'
import { useI18n } from '../../i18n/I18nProvider'
import { ESCROW_STATUSES, useDemo } from '../../store/DemoStore'
import { ChallengeRow, useOwnChallenges } from './shared'

export default function IndustryOverview() {
  const { t, L, money, num } = useI18n()
  const { studentById } = useDemo()
  const mine = useOwnChallenges()

  const escrow = mine.filter((c) => ESCROW_STATUSES.includes(c.status)).reduce((sum, c) => sum + c.reward, 0)
  const paid = mine.filter((c) => c.status === 'paid').reduce((sum, c) => sum + c.reward, 0)
  const live = mine.filter((c) => ['open', 'in_progress', 'submitted'].includes(c.status)).length
  const waiting = mine.filter((c) => c.status === 'open').reduce((sum, c) => sum + c.applicants.length, 0)

  // What the company has to decide on, most urgent first
  const actions = [
    ...mine
      .filter((c) => c.status === 'submitted')
      .map((c) => ({ c, icon: Inbox, tone: 'bg-accent text-accent-ink', text: t('industry.actionSubmitted', { name: studentById[c.solver]?.name }), cta: t('industry.review') })),
    ...mine
      .filter((c) => c.status === 'open' && c.applicants.length)
      .map((c) => ({ c, icon: Users, tone: 'bg-[color-mix(in_oklab,var(--primary)_14%,transparent)] text-primary', text: t('industry.actionApplicants', { n: num(c.applicants.length) }), cta: t('industry.choose') })),
    ...mine
      .filter((c) => c.status === 'review')
      .map((c) => ({ c, icon: Clock3, tone: 'bg-warn-soft text-warn', text: t('industry.actionReview'), cta: null })),
  ]

  // How often each skill is asked for across this company's challenges
  const skillCounts = Object.entries(
    mine.flatMap((c) => c.skills).reduce((acc, skill) => ({ ...acc, [skill]: (acc[skill] ?? 0) + 1 }), {}),
  ).sort((a, b) => b[1] - a[1])
  const maxCount = skillCounts[0]?.[1] ?? 1

  return (
    <div className="mx-auto max-w-6xl">
      <PageIntro title={t('industry.greeting')} body={t('industry.overviewBody')}>
        <Link to="/industry/talent" className={buttonStyles.ghost}>
          <Users className="size-4" /> {t('industry.findCta')}
        </Link>
        <Link to="/industry/post" className={buttonStyles.accent}>
          <Plus className="size-4" /> {t('industry.postCta')}
        </Link>
      </PageIntro>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat tone="brand" label={t('industry.stats.escrow')} value={money(escrow)} note={t('industry.stats.escrowNote')} />
        <Stat label={t('industry.stats.open')} value={num(live)} />
        <Stat label={t('industry.stats.applicants')} value={num(waiting)} />
        <Stat label={t('industry.stats.paid')} value={money(paid)} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="grid content-start gap-6">
          <Panel title={t('industry.needsAction')}>
            {actions.length ? (
              <ul className="divide-y divide-line">
                {actions.map(({ c, icon: Icon, tone, text, cta }) => (
                  <li key={c.id}>
                    <Link to={`/industry/challenges/${c.id}`} className="flex items-center gap-4 px-5 py-4 hover:bg-surface-2/60">
                      <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${tone}`}>
                        <Icon className="size-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold">{L(c.title)}</span>
                        <span className="block text-sm text-ink-2">{text}</span>
                      </span>
                      {cta && (
                        <span className="hidden items-center gap-1 text-sm font-semibold text-primary sm:inline-flex">
                          {cta} <ArrowRight className="size-4" />
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="flex items-center gap-2 px-5 py-6 text-ink-2">
                <CircleCheck className="size-5 text-ok" /> {t('industry.nothingPending')}
              </p>
            )}
          </Panel>

          <Panel
            title={t('industry.yourChallenges')}
            action={
              <Link to="/industry/challenges" className="text-sm font-semibold text-primary hover:underline">
                {t('common.viewAll')}
              </Link>
            }
          >
            <div className="divide-y divide-line">
              {mine.slice(0, 4).map((challenge) => (
                <ChallengeRow key={challenge.id} challenge={challenge} />
              ))}
            </div>
          </Panel>
        </div>

        <Panel title={t('industry.skillsHired')} className="self-start">
          <p className="px-5 pt-4 text-sm text-ink-2">{t('industry.skillsHiredNote')}</p>
          <ul className="grid gap-3 p-5">
            {skillCounts.map(([skill, count]) => (
              <li key={skill} className="grid grid-cols-[8.5rem_minmax(0,1fr)_1.5rem] items-center gap-3 text-sm">
                <span className="truncate">{skill}</span>
                <span className="h-2 rounded-full bg-surface-2">
                  <span className="block h-full rounded-full bg-primary" style={{ width: `${(count / maxCount) * 100}%` }} />
                </span>
                <span className="text-right text-ink-2 tabular-nums">{num(count)}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  )
}

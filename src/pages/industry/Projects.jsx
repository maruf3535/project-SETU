import { CircleCheck, FlaskConical } from 'lucide-react'
import Avatar from '../../components/Avatar'
import { usePasscode } from '../../components/Passcode'
import { useToast } from '../../components/Toast'
import { buttonStyles, PageIntro, StatusPill } from '../../components/ui'
import { useI18n } from '../../i18n/I18nProvider'
import { useDemo } from '../../store/DemoStore'
import { MY_ORG } from './shared'

export default function Projects() {
  const { t, L, money, date, num } = useI18n()
  const { projects, studentById, dispatch } = useDemo()
  const toast = useToast()
  const confirmPasscode = usePasscode()
  const mine = projects.filter((p) => p.orgId === MY_ORG.id)

  async function release(project, index) {
    const milestone = project.milestones[index]
    if (!(await confirmPasscode(t('passcode.actions.releaseMilestone', { amount: money(milestone.amount), title: L(milestone.title) })))) return
    dispatch({ type: 'releaseMilestone', projectId: project.id, index })
    toast(t('industry.projects.releasedToast', { amount: money(project.milestones[index].amount) }))
  }

  return (
    <div className="mx-auto max-w-5xl">
      <PageIntro title={t('industry.projects.title')} body={t('industry.projects.body')} />

      <div className="grid gap-5">
        {mine.map((project) => {
          const released = project.milestones.filter((m) => m.status === 'paid').reduce((sum, m) => sum + m.amount, 0)
          return (
            <article key={project.id} className="rounded-2xl border border-line bg-surface">
              <header className="grid gap-4 border-b border-line p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:p-6">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-sm text-ink-2">
                    <FlaskConical className="size-4 shrink-0 text-primary" /> {L(project.lab)}
                  </p>
                  <h3 className="mt-1.5 font-display text-2xl font-semibold">{L(project.title)}</h3>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                    <span>
                      <span className="text-ink-2">{t('industry.projects.lead')}:</span> <span className="font-semibold">{project.lead}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="text-ink-2">{t('industry.projects.team')}:</span>
                      <span className="flex -space-x-2">
                        {project.members.map((sid) => (
                          <span key={sid} title={studentById[sid]?.name} className="rounded-full ring-2 ring-surface">
                            <Avatar initials={studentById[sid]?.initials} className="size-7 text-[10px]" />
                          </span>
                        ))}
                      </span>
                    </span>
                  </div>
                </div>
                <dl className="flex gap-6 sm:text-right">
                  <div>
                    <dt className="text-xs font-semibold tracking-[0.12em] text-ink-2 uppercase">{t('industry.projects.budget')}</dt>
                    <dd className="font-display text-2xl font-semibold tabular-nums">{money(project.budget)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold tracking-[0.12em] text-ink-2 uppercase">{t('industry.projects.released')}</dt>
                    <dd className="font-display text-2xl font-semibold text-ok tabular-nums">{money(released)}</dd>
                  </div>
                </dl>
                <div className="h-2 overflow-hidden rounded-full bg-surface-2 sm:col-span-2">
                  <div className="h-full rounded-full bg-ok transition-[width]" style={{ width: `${(released / project.budget) * 100}%` }} />
                </div>
              </header>

              <ol className="divide-y divide-line">
                {project.milestones.map((milestone, index) => (
                  <li key={L(milestone.title)} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:px-6">
                    <span
                      className={`grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold ${
                        milestone.status === 'paid' ? 'bg-ok-soft text-ok' : 'bg-surface-2 text-ink-2'
                      }`}
                    >
                      {milestone.status === 'paid' ? <CircleCheck className="size-4" /> : num(index + 1)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{L(milestone.title)}</p>
                      <p className="text-sm text-ink-2">{t('common.due', { date: date(milestone.due) })}</p>
                    </div>
                    <span className="font-semibold tabular-nums">{money(milestone.amount)}</span>
                    {milestone.status === 'submitted' ? (
                      <button type="button" onClick={() => release(project, index)} className={buttonStyles.accent}>
                        {t('industry.projects.release', { amount: money(milestone.amount) })}
                      </button>
                    ) : (
                      <StatusPill kind="milestone" status={milestone.status} />
                    )}
                  </li>
                ))}
              </ol>
            </article>
          )
        })}
      </div>
    </div>
  )
}

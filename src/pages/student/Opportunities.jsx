import { ArrowLeft, BadgeCheck, Briefcase, CalendarDays, Check, Circle, Clock3, FileUp, FlaskConical, Landmark, Mail, ShieldCheck, Target, Undo2 } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { usePasscode } from '../../components/Passcode'
import { useToast } from '../../components/Toast'
import { buttonStyles, Dialog, inputStyles, PageIntro, SkillChip, StatusPill } from '../../components/ui'
import { useI18n } from '../../i18n/I18nProvider'
import { useCurrentStudent, useDemo } from '../../store/DemoStore'
import { useMatchedOpportunities } from './useMatchedOpportunities'

const TABS = ['forYou', 'challenge', 'parttime', 'research', 'govt']
const kindIcons = { challenge: Target, parttime: Briefcase, research: FlaskConical, govt: Landmark }

function PayLabel({ item }) {
  const { t, money } = useI18n()
  return (
    <span className="font-semibold tabular-nums">
      {money(item.pay)} <span className="text-xs font-normal text-ink-2">{t(`student.opps.payUnits.${item.payUnit}`)}</span>
    </span>
  )
}

function SubmitDialog({ challenge, onClose }) {
  const { t, L } = useI18n()
  const { dispatch } = useDemo()
  const toast = useToast()
  const confirmPasscode = usePasscode()
  const [files, setFiles] = useState([])

  async function submit(event) {
    event.preventDefault()
    const note = new FormData(event.currentTarget).get('note').trim()
    if (!(await confirmPasscode(t('passcode.actions.submitWork', { title: L(challenge.title) })))) return
    dispatch({
      type: 'submit',
      id: challenge.id,
      submission: { note, files: files.length ? files : ['solution-report.pdf'], at: new Date().toISOString().slice(0, 10) },
    })
    toast(t('student.opps.submittedToast', { org: challenge.org }))
    onClose()
  }

  return (
    <Dialog open title={t('student.opps.submitTitle')} onClose={onClose}>
      <form onSubmit={submit} className="grid gap-4">
        <label htmlFor="submit-note" className="text-sm font-medium">
          {t('student.opps.submitNote')}
          <textarea
            id="submit-note"
            name="note"
            required
            rows={4}
            placeholder={t('student.opps.submitPlaceholder')}
            defaultValue="Model reaches 91% accuracy on 600 held-out photos from Rangpur and Dinajpur. The script labels a folder in under a minute on a laptop. Method note attached."
            className={`${inputStyles} mt-1.5`}
          />
        </label>
        <label htmlFor="submit-files" className="flex items-center gap-3 rounded-xl border-2 border-dashed border-line px-4 py-3 text-sm text-ink-2 hover:border-primary">
          <FileUp className="size-5 text-primary" />
          <span className="truncate">{files.length ? files.join(', ') : t('student.opps.attach')}</span>
          <input id="submit-files" type="file" multiple className="sr-only" onChange={(e) => setFiles([...e.target.files].map((f) => f.name))} />
        </label>
        <button type="submit" className={`${buttonStyles.accent} py-3`}>
          {t('student.opps.submitButton')}
        </button>
      </form>
    </Dialog>
  )
}

function ActiveWork() {
  const { t, L, money } = useI18n()
  const { challenges } = useDemo()
  const { student } = useCurrentStudent()
  const [submitting, setSubmitting] = useState(null)
  const mine = challenges.filter((c) => c.solver === student.id && ['in_progress', 'submitted'].includes(c.status))
  if (!mine.length) return null

  return (
    <section className="mb-6 rounded-2xl bg-brand p-5 text-brand-ink">
      <h3 className="text-xs font-semibold tracking-[0.12em] text-brand-ink/60 uppercase">{t('student.opps.active')}</h3>
      <ul className="mt-3 grid gap-3">
        {mine.map((c) => (
          <li key={c.id} className="flex flex-col gap-3 rounded-xl bg-brand-ink/[0.07] p-4 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
              <Link to={`/student/opportunities/${c.id}`} className="font-semibold hover:underline">
                {L(c.title)}
              </Link>
              <p className="text-sm text-brand-ink/65">
                {c.org} · {money(c.reward)}
              </p>
              {c.status === 'in_progress' && c.revisionNote && (
                <p className="mt-2 flex items-start gap-2 rounded-lg bg-accent-soft px-3 py-2 text-sm text-ink">
                  <Undo2 className="mt-0.5 size-4 shrink-0 text-warn" /> {t('student.opps.revision', { note: c.revisionNote })}
                </p>
              )}
            </div>
            {c.status === 'in_progress' ? (
              <button type="button" onClick={() => setSubmitting(c)} className={buttonStyles.accent}>
                {t('student.opps.submit')}
              </button>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-sm text-brand-ink/75">
                <Clock3 className="size-4 text-accent" /> {t('student.opps.waiting', { org: c.org })}
              </span>
            )}
          </li>
        ))}
      </ul>
      {submitting && <SubmitDialog challenge={submitting} onClose={() => setSubmitting(null)} />}
    </section>
  )
}

export default function Opportunities() {
  const { t, L, num } = useI18n()
  const [tab, setTab] = useState('forYou')
  const all = useMatchedOpportunities().filter((item) => item.kind !== 'challenge' || item.challenge.status === 'open')
  const shown = tab === 'forYou' ? all.filter((item) => item.match >= 50 || item.invited) : all.filter((item) => item.kind === tab)

  return (
    <div className="mx-auto max-w-5xl">
      <PageIntro title={t('nav.opportunities')} body={t('student.opps.body')} />
      <ActiveWork />

      <div className="-mx-1 mb-4 flex gap-2 overflow-x-auto px-1 pb-1">
        {TABS.map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={tab === key}
            onClick={() => setTab(key)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium ${tab === key ? 'border-brand bg-brand text-brand-ink' : 'border-line bg-surface text-ink-2 hover:text-ink'}`}
          >
            {t(`student.opps.tabs.${key}`)}
          </button>
        ))}
      </div>

      {shown.length ? (
        <ul className="grid gap-3">
          {shown.map((item) => {
            const Icon = kindIcons[item.kind]
            return (
              <li key={item.id}>
                <Link
                  to={`/student/opportunities/${item.id}`}
                  className={`flex flex-col gap-3 rounded-2xl border bg-surface p-5 transition-colors hover:border-primary sm:flex-row sm:items-center ${item.invited ? 'border-accent' : 'border-line'}`}
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[color-mix(in_oklab,var(--role-industry)_14%,transparent)] text-[var(--role-industry)]">
                    <Icon className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-ink-2">{t(`student.opps.kinds.${item.kind}`)}</span>
                      {item.invited && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-ink">
                          <Mail className="size-3" /> {t('student.opps.invited')}
                        </span>
                      )}
                      {item.applied && <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs font-semibold text-ink-2">{t('student.opps.applied')}</span>}
                    </div>
                    <p className="mt-1 font-semibold">{L(item.title)}</p>
                    <p className="text-sm text-ink-2">{item.org}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {item.skills.map((s) => (
                        <SkillChip key={s} name={s} />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                    <span className="rounded-full bg-ok-soft px-2.5 py-1 text-xs font-semibold text-ok tabular-nums">{t('common.match', { n: num(item.match) })}</span>
                    <PayLabel item={item} />
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="py-10 text-center text-ink-2">{t('student.opps.empty')}</p>
      )}
    </div>
  )
}

export function OpportunityDetail() {
  const { id } = useParams()
  const { t, L, num, date } = useI18n()
  const { dispatch } = useDemo()
  const { student } = useCurrentStudent()
  const toast = useToast()
  const confirmPasscode = usePasscode()
  const item = useMatchedOpportunities().find((o) => o.id === id)
  if (!item) return <Navigate to="/student/opportunities" replace />

  const challenge = item.challenge
  const canApply = !item.applied && (!challenge || challenge.status === 'open')
  const mine = challenge?.solver === student.id

  async function apply() {
    if (!(await confirmPasscode(t('passcode.actions.apply', { title: L(item.title), org: item.org })))) return
    dispatch(challenge ? { type: 'apply', id: challenge.id, studentId: student.id } : { type: 'applyRole', roleId: item.id, studentId: student.id })
    toast(t('student.opps.appliedToast', { org: item.org }))
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/student/opportunities" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 hover:text-ink">
        <ArrowLeft className="size-4" /> {t('student.opps.back')}
      </Link>

      <header className="mt-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-ink-2">{t(`student.opps.kinds.${item.kind}`)}</span>
          {challenge && <StatusPill status={challenge.status} />}
        </div>
        <h2 className="mt-2 font-display text-3xl font-semibold">{L(item.title)}</h2>
        <p className="mt-1 flex items-center gap-1.5 text-ink-2">
          {item.org} <BadgeCheck className="size-4 text-primary" />
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <span className="rounded-full border border-line bg-surface px-3 py-1.5">
            <PayLabel item={item} />
          </span>
          {item.where && <span className="rounded-full border border-line bg-surface px-3 py-1.5">{L(item.where)}</span>}
          {item.hours && <span className="rounded-full border border-line bg-surface px-3 py-1.5">{L(item.hours)}</span>}
          {item.deadline && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5">
              <CalendarDays className="size-4" /> {t('common.due', { date: date(item.deadline) })}
            </span>
          )}
        </div>
      </header>

      <section className="mt-6 rounded-2xl border border-line bg-surface p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold tracking-[0.12em] text-ink-2 uppercase">{t('student.opps.why')}</h3>
          <span className="rounded-full bg-ok-soft px-2.5 py-1 text-xs font-semibold text-ok tabular-nums">{t('common.match', { n: num(item.match) })}</span>
        </div>
        <ul className="mt-3 grid gap-2.5">
          {item.skills.map((skill) => {
            const held = student.skills.find((s) => s.name === skill)
            return (
              <li key={skill} className="flex items-center gap-2.5 text-sm">
                {held?.verified ? (
                  <BadgeCheck className="size-5 shrink-0 text-ok" />
                ) : held ? (
                  <Check className="size-5 shrink-0 text-warn" />
                ) : (
                  <Circle className="size-5 shrink-0 text-line" />
                )}
                <span className="font-semibold">{skill}</span>
                <span className="text-ink-2">
                  {held?.verified ? `${t('common.verified')} · ${t(`common.levels.${held.level}`)}` : held ? t('student.opps.selfReported') : t('student.opps.missing')}
                </span>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="mt-4 rounded-2xl border border-line bg-surface p-5">
        <h3 className="text-xs font-semibold tracking-[0.12em] text-ink-2 uppercase">{t('student.opps.task')}</h3>
        <p className="mt-2 leading-relaxed">{L(challenge ? challenge.summary : item.task)}</p>
        {challenge && (
          <>
            <h3 className="mt-4 text-xs font-semibold tracking-[0.12em] text-ink-2 uppercase">{t('student.opps.deliverables')}</h3>
            <ul className="mt-2 grid gap-1.5">
              {L(challenge.deliverables).map((d) => (
                <li key={d} className="flex gap-2 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" /> {d}
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <div className="mt-6 grid gap-2">
        {mine ? (
          <Link to="/student/opportunities" className={`${buttonStyles.primary} py-3`}>
            {t('student.opps.active')}
          </Link>
        ) : challenge && challenge.status === 'review' ? (
          <p className="rounded-2xl bg-warn-soft p-4 text-sm font-semibold text-warn">{t('student.opps.notOpen')}</p>
        ) : (
          <button type="button" disabled={!canApply} onClick={apply} className={`${buttonStyles.accent} py-3.5`}>
            {item.applied ? t('student.opps.applied') : t('student.opps.apply')}
          </button>
        )}
        <p className="flex items-center justify-center gap-1.5 text-center text-xs text-ink-2">
          <ShieldCheck className="size-4 text-primary" /> {t('student.opps.privacy')}
        </p>
      </div>
    </div>
  )
}

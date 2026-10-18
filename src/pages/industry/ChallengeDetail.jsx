import { ArrowLeft, BadgeCheck, Check, Clock3, FileText, Landmark, Lock, ShieldCheck, Star, Users } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import Avatar from '../../components/Avatar'
import { useToast } from '../../components/Toast'
import { buttonStyles, Dialog, inputStyles, Panel, SkillChip, StatusPill } from '../../components/ui'
import { useI18n } from '../../i18n/I18nProvider'
import { matchScore, useDemo } from '../../store/DemoStore'

// Lifecycle position of each status on the six-step tracker
const STEP_INDEX = { review: 1, open: 2, in_progress: 3, submitted: 4, paid: 6 }

function Lifecycle({ status }) {
  const { t } = useI18n()
  const steps = t('industry.detail.steps')
  const current = STEP_INDEX[status]

  return (
    <ol className="grid grid-cols-6 gap-1.5" aria-label={t('industry.detail.lifecycle')}>
      {steps.map((label, index) => {
        const done = index < current
        const active = index === current
        return (
          <li key={label} className="min-w-0">
            <span className={`block h-1.5 rounded-full ${done ? 'bg-primary' : active ? 'bg-accent' : 'bg-line'}`} />
            <span className={`mt-2 hidden text-xs sm:block ${done || active ? 'font-semibold text-ink' : 'text-ink-2'}`}>{label}</span>
          </li>
        )
      })}
    </ol>
  )
}

function StudentLine({ student, skills, action }) {
  const { t, L, num } = useI18n()
  return (
    <div className="flex items-center gap-3">
      <Avatar initials={student.initials} className="size-10 text-sm" />
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1 truncate font-semibold">
          {student.name} <BadgeCheck className="size-4 shrink-0 text-primary" />
        </p>
        <p className="truncate text-sm text-ink-2">
          {student.university} · {L(student.dept)}
        </p>
      </div>
      {skills && (
        <span className="hidden rounded-full bg-ok-soft px-2.5 py-1 text-xs font-semibold text-ok sm:inline">
          {t('common.match', { n: num(matchScore(student, skills)) })}
        </span>
      )}
      {action}
    </div>
  )
}

export default function ChallengeDetail() {
  const { id } = useParams()
  const { t, L, money, date } = useI18n()
  const { challenges, studentById, dispatch } = useDemo()
  const toast = useToast()
  const [rateOpen, setRateOpen] = useState(false)
  const [rating, setRating] = useState(5)
  const [revising, setRevising] = useState(false)
  const [revisionNote, setRevisionNote] = useState('')

  const challenge = challenges.find((c) => c.id === id)
  if (!challenge) return <Navigate to="/industry/challenges" replace />

  const solver = challenge.solver ? studentById[challenge.solver] : null
  const applicants = [...challenge.applicants]
    .map((sid) => studentById[sid])
    .filter(Boolean)
    .sort((a, b) => matchScore(b, challenge.skills) - matchScore(a, challenge.skills))
  const invited = challenge.invited.filter((sid) => !challenge.applicants.includes(sid)).map((sid) => studentById[sid])

  function approve() {
    dispatch({ type: 'approve', id: challenge.id })
    toast(t('industry.detail.approved'))
  }

  function assign(student) {
    dispatch({ type: 'assign', id: challenge.id, studentId: student.id })
    toast(t('industry.detail.assigned', { name: student.name }))
  }

  function pay() {
    dispatch({ type: 'accept', id: challenge.id, rating })
    setRateOpen(false)
    toast(t('industry.detail.paidToast', { amount: money(challenge.reward), name: solver.name }))
  }

  function sendRevision(event) {
    event.preventDefault()
    dispatch({ type: 'revise', id: challenge.id, note: revisionNote.trim() })
    setRevising(false)
    setRevisionNote('')
    toast(t('industry.detail.revisionToast'))
  }

  return (
    <div className="mx-auto max-w-6xl">
      <Link to="/industry/challenges" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 hover:text-ink">
        <ArrowLeft className="size-4" /> {t('industry.detail.back')}
      </Link>

      <header className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <StatusPill status={challenge.status} />
          <h2 className="mt-3 font-display text-3xl leading-tight font-semibold">{L(challenge.title)}</h2>
          <p className="mt-1 text-ink-2">
            {challenge.org} · {t('industry.posted', { date: date(challenge.postedAt) })}
          </p>
        </div>
        <div className="shrink-0 sm:text-right">
          <p className="text-xs font-semibold tracking-[0.12em] text-ink-2 uppercase">{t('industry.reward')}</p>
          <p className="font-display text-4xl font-semibold tabular-nums">{money(challenge.reward)}</p>
        </div>
      </header>

      <div className="mt-6">
        <Lifecycle status={challenge.status} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="grid content-start gap-6">
          <section>
            <h3 className="text-xs font-semibold tracking-[0.12em] text-ink-2 uppercase">{t('industry.detail.problem')}</h3>
            <p className="mt-2 text-lg leading-relaxed">{L(challenge.summary)}</p>
          </section>
          <section>
            <h3 className="text-xs font-semibold tracking-[0.12em] text-ink-2 uppercase">{t('industry.detail.deliverables')}</h3>
            <ul className="mt-3 grid gap-2">
              {L(challenge.deliverables).map((item) => (
                <li key={item} className="flex gap-2.5">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" /> {item}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="text-xs font-semibold tracking-[0.12em] text-ink-2 uppercase">{t('industry.detail.skills')}</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {challenge.skills.map((skill) => (
                <SkillChip key={skill} name={skill} />
              ))}
            </div>
          </section>
          <dl className="grid grid-cols-2 gap-4 rounded-2xl border border-line bg-surface p-5 text-sm">
            <div>
              <dt className="text-ink-2">{t('industry.deadline')}</dt>
              <dd className="mt-0.5 font-semibold">{date(challenge.deadline)}</dd>
            </div>
            <div>
              <dt className="text-ink-2">{t('industry.detail.format')}</dt>
              <dd className="mt-0.5 font-semibold">{(challenge.formats ?? [challenge.team]).map((f) => t(`common.${f}`)).join(' · ')}</dd>
            </div>
            {challenge.mentor && (
              <div className="col-span-2">
                <dt className="text-ink-2">{t('industry.detail.mentor')}</dt>
                <dd className="mt-0.5 font-semibold">{challenge.mentor}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="grid content-start gap-4">
          <p
            className={`flex items-center gap-2.5 rounded-2xl px-4 py-3 text-sm font-semibold ${
              challenge.status === 'paid' ? 'bg-ok-soft text-ok' : 'bg-brand text-brand-ink'
            }`}
          >
            {challenge.status === 'paid' ? <BadgeCheck className="size-5 shrink-0" /> : <Lock className="size-5 shrink-0 text-accent" />}
            {challenge.status === 'paid'
              ? t('industry.detail.escrowPaid', { amount: money(challenge.reward), name: solver?.name })
              : t('industry.detail.escrowHeld', { amount: money(challenge.reward) })}
          </p>

          {challenge.status === 'review' && (
            <Panel>
              <div className="p-5">
                <span className="grid size-10 place-items-center rounded-xl bg-warn-soft text-warn">
                  <Clock3 className="size-5" />
                </span>
                <h3 className="mt-3 font-semibold">{t('industry.detail.reviewTitle')}</h3>
                <p className="mt-1 text-sm text-ink-2">{t('industry.detail.reviewBody')}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" onClick={approve} className={buttonStyles.primary}>
                    <ShieldCheck className="size-4" /> {t('industry.detail.approveDemo')}
                    <span className="rounded-full bg-primary-ink/20 px-2 py-0.5 text-[10px] tracking-wide uppercase">{t('onboarding.verify.demoTag')}</span>
                  </button>
                  <Link to="/government" className={buttonStyles.ghost}>
                    <Landmark className="size-4" /> {t('industry.detail.openReviewDesk')}
                  </Link>
                </div>
              </div>
            </Panel>
          )}

          {challenge.status === 'open' && (
            <Panel title={`${t('industry.detail.applicants')} · ${applicants.length}`}>
              {applicants.length ? (
                <ul className="divide-y divide-line">
                  {applicants.map((student) => (
                    <li key={student.id} className="px-5 py-4">
                      <StudentLine
                        student={student}
                        skills={challenge.skills}
                        action={
                          <button type="button" onClick={() => assign(student)} className={buttonStyles.primary}>
                            {t('industry.detail.assign')}
                          </button>
                        }
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="flex gap-2.5 px-5 py-5 text-sm text-ink-2">
                  <Users className="size-4 shrink-0" /> {t('industry.detail.noApplicants')}
                </p>
              )}
              {invited.length > 0 && (
                <div className="border-t border-line px-5 py-4">
                  <p className="mb-3 text-xs font-semibold tracking-[0.12em] text-ink-2 uppercase">{t('industry.detail.invited')}</p>
                  <div className="grid gap-3">
                    {invited.map((student) => (
                      <StudentLine key={student.id} student={student} skills={challenge.skills} />
                    ))}
                  </div>
                </div>
              )}
            </Panel>
          )}

          {challenge.status === 'in_progress' && solver && (
            <Panel title={t('industry.detail.solver')}>
              <div className="grid gap-3 p-5">
                <StudentLine student={solver} skills={challenge.skills} />
                <p className="text-sm text-ink-2">{t('industry.detail.solving', { name: solver.name })}</p>
                {challenge.revisionNote && (
                  <p className="rounded-xl bg-warn-soft px-3 py-2.5 text-sm text-ink">{t('industry.detail.revisionAsked', { note: challenge.revisionNote })}</p>
                )}
              </div>
            </Panel>
          )}

          {challenge.status === 'submitted' && solver && (
            <Panel title={t('industry.detail.submission')}>
              <div className="grid gap-4 p-5">
                <StudentLine student={solver} skills={challenge.skills} />
                <p className="text-xs text-ink-2">{t('industry.detail.submittedOn', { date: date(challenge.submission.at) })}</p>
                <p className="leading-relaxed">{L(challenge.submission.note)}</p>
                <ul className="grid gap-2">
                  {challenge.submission.files.map((file) => (
                    <li key={file} className="flex items-center gap-2.5 rounded-xl border border-line px-3 py-2.5 text-sm">
                      <FileText className="size-4 text-primary" /> <span className="truncate">{file}</span>
                    </li>
                  ))}
                </ul>
                {revising ? (
                  <form onSubmit={sendRevision} className="grid gap-2">
                    <label htmlFor="revision-note" className="sr-only">
                      {t('industry.detail.revise')}
                    </label>
                    <textarea
                      id="revision-note"
                      required
                      rows={3}
                      value={revisionNote}
                      onChange={(event) => setRevisionNote(event.target.value)}
                      placeholder={t('industry.detail.revisePlaceholder')}
                      className={inputStyles}
                    />
                    <div className="flex gap-2">
                      <button type="submit" className={buttonStyles.primary}>
                        {t('industry.detail.sendRevision')}
                      </button>
                      <button type="button" onClick={() => setRevising(false)} className={buttonStyles.ghost}>
                        {t('common.cancel')}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2">
                    <button type="button" onClick={() => setRateOpen(true)} className={buttonStyles.accent}>
                      {t('industry.detail.accept', { amount: money(challenge.reward) })}
                    </button>
                    <button type="button" onClick={() => setRevising(true)} className={buttonStyles.ghost}>
                      {t('industry.detail.revise')}
                    </button>
                  </div>
                )}
              </div>
            </Panel>
          )}

          {challenge.status === 'paid' && solver && (
            <Panel title={t('industry.detail.solver')}>
              <div className="grid gap-3 p-5">
                <StudentLine student={solver} skills={challenge.skills} />
                {challenge.rating && (
                  <p className="flex items-center gap-2 text-sm">
                    <span className="text-ink-2">{t('industry.detail.rating')}</span>
                    <Stars value={challenge.rating} />
                  </p>
                )}
                <p className="rounded-xl bg-ok-soft px-3 py-2.5 text-sm text-ink">{t('industry.detail.portfolioNote', { name: solver.name })}</p>
              </div>
            </Panel>
          )}
        </div>
      </div>

      <Dialog open={rateOpen} title={solver ? t('industry.detail.rateTitle', { name: solver.name }) : ''} onClose={() => setRateOpen(false)}>
        <p className="text-ink-2">{t('industry.detail.rateBody')}</p>
        <div className="mt-5 flex justify-center gap-1" role="radiogroup" aria-label={t('industry.detail.rating')}>
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={rating === value}
              aria-label={`${value}`}
              onClick={() => setRating(value)}
              className="rounded-lg p-1"
            >
              <Star className={`size-9 ${value <= rating ? 'fill-accent text-accent' : 'text-line'}`} />
            </button>
          ))}
        </div>
        <button type="button" onClick={pay} className={`${buttonStyles.accent} mt-6 w-full py-3`}>
          {t('industry.detail.confirmPay', { amount: money(challenge.reward) })}
        </button>
      </Dialog>
    </div>
  )
}

function Stars({ value }) {
  return (
    <span className="inline-flex" aria-label={`${value} / 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`size-4 ${n <= value ? 'fill-accent text-accent' : 'text-line'}`} />
      ))}
    </span>
  )
}

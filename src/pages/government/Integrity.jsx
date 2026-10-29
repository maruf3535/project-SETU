import { ArrowLeft, ArrowRight, BadgeCheck, CircleCheck, Flag, Gavel, ShieldAlert, ShieldCheck, TriangleAlert, X } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import Avatar from '../../components/Avatar'
import PublicProfileLink from '../../components/PublicProfileLink'
import { usePasscode } from '../../components/Passcode'
import { useToast } from '../../components/Toast'
import { buttonStyles, inputStyles, PageIntro, Panel, SkillChip, Stat } from '../../components/ui'
import { QUALIFY_SCORE } from '../../data/demo/reviews'
import { useI18n } from '../../i18n/I18nProvider'
import { useDemo } from '../../store/DemoStore'
import { LevelBadge, PublisherRankingTable, ReviewCard } from '../reviews/components'
import { allReviewers, caseOf, favouredPublisher, nowIso, publisherName, qualification, reviewerInfo, reviewerStats, riskFlags, SUBJECT_NAMES } from '../reviews/reviewData'
import { useCountReview } from './review'

const TABS = ['reviewers', 'reported', 'cases']
const caseStyles = {
  suspended: 'bg-bad-soft text-bad',
  clarified: 'bg-warn-soft text-warn',
  cleared: 'bg-ok-soft text-ok',
  upheld: 'bg-bad text-white',
}

export function CasePill({ status }) {
  const { t } = useI18n()
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${caseStyles[status]}`}>
      <span className="size-1.5 rounded-full bg-current" />
      {t(`reviews.gov.case.${status}`)}
    </span>
  )
}

function FlagList({ flags }) {
  const { t, num } = useI18n()
  const demo = useDemo()
  if (!flags.length) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-ok">
        <CircleCheck className="size-3.5" /> {t('reviews.gov.noFlags')}
      </span>
    )
  }
  return (
    <ul className="flex flex-wrap gap-1.5">
      {flags.map((f) => (
        <li key={f.key} className="inline-flex items-center gap-1 rounded-full bg-bad-soft px-2 py-0.5 text-xs font-semibold text-bad">
          <TriangleAlert className="size-3.5" /> {t(`reviews.gov.flags.${f.key}`, { n: num(f.n), publisher: f.publisherId ? publisherName(demo, f.publisherId) : '' })}
        </li>
      ))}
    </ul>
  )
}

function ReportedReview({ review }) {
  const { t } = useI18n()
  const demo = useDemo()
  const { dispatch } = demo
  const toast = useToast()
  const confirmPasscode = usePasscode()
  const countReview = useCountReview()

  async function decide(keep) {
    const info = reviewerInfo(demo, review.reviewerId)
    const label = keep ? 'keepReview' : 'removeReview'
    if (!(await confirmPasscode(t(`passcode.actions.${label}`, { name: info?.name ?? '' })))) return
    dispatch({ type: 'decideReview', id: review.id, keep })
    countReview()
    toast(keep ? t('reviews.gov.keptToast') : t('reviews.gov.removedToast'))
  }

  return (
    <ReviewCard
      review={review}
      showBook
      actions={
        <>
          <span className="flex w-full items-center gap-1.5 text-sm">
            <Flag className="size-4 text-bad" /> {t('reviews.gov.reportedFor', { reason: t(`reviews.reasons.${review.report.reason}`) })}
          </span>
          {review.report.note && (
            <blockquote className="w-full rounded-xl border-l-2 border-bad bg-surface-2 px-3 py-2 text-sm text-ink-2">
              <span className="font-semibold text-ink">{t('reviews.gov.publisherNote')}:</span> {review.report.note}
            </blockquote>
          )}
          <button type="button" onClick={() => decide(true)} className={`${buttonStyles.ghost} py-2`}>
            <ShieldCheck className="size-4" /> {t('reviews.gov.keep')}
          </button>
          <button type="button" onClick={() => decide(false)} className={`${buttonStyles.primary} bg-bad py-2`}>
            <X className="size-4" /> {t('reviews.gov.remove')}
          </button>
          <Link to={`/government/integrity/${review.reviewerId}`} className="ml-auto self-center text-sm font-semibold text-primary hover:underline">
            {t('reviews.gov.audit')}
          </Link>
        </>
      }
    />
  )
}

export default function Integrity() {
  const { t, L, num } = useI18n()
  const demo = useDemo()
  const [params, setParams] = useSearchParams()
  const tab = TABS.includes(params.get('tab')) ? params.get('tab') : 'reviewers'

  const reviewers = allReviewers(demo)
    .map((info) => ({ info, flags: riskFlags(demo, info.id), stats: reviewerStats(demo, info.id), record: caseOf(demo, info.id) }))
    .sort((a, b) => b.flags.length - a.flags.length || b.stats.total - a.stats.total)
  const reported = demo.bookReviews.filter((r) => r.status === 'reported')
  const cases = reviewers.filter((r) => r.record)
  const flagged = reviewers.filter((r) => r.flags.length && !r.record)
  const counts = { reviewers: reviewers.length, reported: reported.length, cases: cases.length }

  return (
    <div className="mx-auto max-w-6xl">
      <PageIntro title={t('reviews.gov.title')} body={t('reviews.gov.body')} />

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat tone="brand" label={t('reviews.gov.statFlagged')} value={num(flagged.length)} note={t('reviews.gov.statFlaggedNote')} />
        <Stat label={t('reviews.gov.statReported')} value={num(reported.length)} />
        <Stat label={t('reviews.gov.statCases')} value={num(cases.filter((c) => ['suspended', 'clarified'].includes(c.record.status)).length)} note={t('reviews.gov.statCasesNote')} />
      </div>

      <Panel className="mt-6">
        <div role="tablist" aria-label={t('reviews.gov.title')} className="flex gap-1 overflow-x-auto border-b border-line px-3 pt-2">
          {TABS.map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              onClick={() => setParams(key === 'reviewers' ? {} : { tab: key }, { replace: true })}
              className={`-mb-px inline-flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-sm font-semibold transition-colors ${
                tab === key ? 'border-accent text-ink' : 'border-transparent text-ink-2 hover:text-ink'
              }`}
            >
              {t(`reviews.gov.tabs.${key}`)}
              <span className={`rounded-full px-2 py-0.5 text-xs tabular-nums ${tab === key ? 'bg-accent text-accent-ink' : 'bg-surface-2'}`}>{num(counts[key])}</span>
            </button>
          ))}
        </div>

        {tab === 'reported' ? (
          reported.length ? (
            <div className="grid gap-4 p-5">
              {reported.map((review) => (
                <ReportedReview key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <p className="flex items-center gap-2 px-5 py-8 text-ink-2">
              <CircleCheck className="size-5 text-ok" /> {t('reviews.gov.noReported')}
            </p>
          )
        ) : (
          <ul className="divide-y divide-line">
            {(tab === 'cases' ? cases : reviewers).map(({ info, flags, stats, record }) => (
              <li key={info.id}>
                <Link to={`/government/integrity/${info.id}`} className="group flex flex-wrap items-start gap-4 px-5 py-4 hover:bg-surface-2/60 sm:items-center">
                  <Avatar initials={info.initials} className="size-10 text-sm" />
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2 font-semibold group-hover:text-primary">
                      {info.name} <LevelBadge level={stats.level} /> {record && <CasePill status={record.status} />}
                    </span>
                    <span className="block text-xs text-ink-2">
                      {t(`reviews.role.${info.role}`)} · {L(info.org)} · {t('reviews.gov.reviewsN', { n: num(stats.reviews.length) })}
                    </span>
                    <span className="mt-2 block">
                      <FlagList flags={flags} />
                    </span>
                  </span>
                  <span className="hidden items-center gap-1 text-sm font-semibold text-primary sm:inline-flex">
                    {t('reviews.gov.audit')} <ArrowRight className="size-4" />
                  </span>
                </Link>
              </li>
            ))}
            {tab === 'cases' && !cases.length && <li className="px-5 py-8 text-ink-2">{t('reviews.gov.noCases')}</li>}
          </ul>
        )}
      </Panel>

      <Panel title={t('reviews.ranking.title')} className="mt-6">
        <PublisherRankingTable />
      </Panel>
    </div>
  )
}

// Full audit of one reviewer: verified profile, qualifications, review pattern, and the case decision
export function ReviewerAudit() {
  const { id } = useParams()
  const { t, L, num, date } = useI18n()
  const demo = useDemo()
  const { dispatch, books } = demo
  const toast = useToast()
  const confirmPasscode = usePasscode()
  const countReview = useCountReview()
  const info = reviewerInfo(demo, id)
  const [reason, setReason] = useState('')
  const [publisherId, setPublisherId] = useState(() => favouredPublisher(demo, id) ?? '')

  if (!info) return <Navigate to="/government/integrity" replace />

  const stats = reviewerStats(demo, id)
  const flags = riskFlags(demo, id)
  const record = caseOf(demo, id)
  const bookById = Object.fromEntries(books.map((b) => [b.id, b]))
  const publishers = [...new Map(books.map((b) => [b.publisherId, b.publisher])).entries()]
  const subjects = info.role === 'teacher' ? info.teaches.map((s) => [s, null]) : Object.entries(info.scores ?? {})

  async function penalise() {
    if (!(await confirmPasscode(t('passcode.actions.penalise', { name: info.name })))) return
    dispatch({ type: 'reviewerCase', reviewerId: id, changes: { status: 'suspended', reason: reason.trim(), publisherId: publisherId || null, at: nowIso(), clarification: null } })
    countReview()
    toast(t('reviews.gov.penalisedToast', { name: info.name }))
    setReason('')
  }

  async function close(status) {
    if (!(await confirmPasscode(t(`passcode.actions.${status === 'cleared' ? 'clearReviewer' : 'upholdPenalty'}`, { name: info.name })))) return
    dispatch({ type: 'reviewerCase', reviewerId: id, changes: { status, closedAt: nowIso() } })
    countReview()
    toast(t(`reviews.gov.${status}Toast`, { name: info.name }))
  }

  const open = record && ['suspended', 'clarified'].includes(record.status)

  return (
    <div className="mx-auto max-w-5xl">
      <Link to="/government/integrity" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 hover:text-ink">
        <ArrowLeft className="size-4" /> {t('reviews.gov.back')}
      </Link>

      <section className="mt-4 flex flex-wrap items-center gap-4 rounded-3xl bg-brand p-6 text-brand-ink">
        <Avatar initials={info.initials} className="size-16 text-xl ring-4 ring-brand-ink/15" />
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-2 font-display text-2xl font-semibold">
            {info.name} <LevelBadge level={stats.level} /> {record && <CasePill status={record.status} />}
          </p>
          <p className="text-sm text-brand-ink/70">
            {t(`reviews.role.${info.role}`)} · {L(info.org)} · {t(`common.divisions.${info.division}`)}
          </p>
        </div>
        {info.hasProfile && <PublicProfileLink name={info.name} />}
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title={t('reviews.gov.qualifications')}>
          <div className="grid gap-4 p-5">
            <ul className="grid gap-2">
              {subjects.map(([subject, pct]) => (
                <li key={subject} className="flex items-center justify-between gap-3 text-sm">
                  <span>{L(SUBJECT_NAMES[subject])}</span>
                  <span className={`font-semibold tabular-nums ${pct === null || pct >= QUALIFY_SCORE ? 'text-ok' : 'text-ink-2'}`}>
                    {pct === null ? t('reviews.gov.teachesVerified') : t('reviews.gov.practiceAvg', { pct: num(pct) })}
                  </span>
                </li>
              ))}
            </ul>
            {info.skills?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {info.skills.map((s) => (
                  <SkillChip key={s.name} name={s.name} level={s.level} verified={s.verified} />
                ))}
              </div>
            )}
            <p className="text-xs text-ink-2">{t('reviews.gov.qualifyRule', { pct: num(QUALIFY_SCORE) })}</p>
          </div>
        </Panel>

        <Panel title={t('reviews.gov.riskTitle')}>
          <div className="grid gap-3 p-5">
            <FlagList flags={flags} />
            <p className="text-xs text-ink-2">{t('reviews.gov.riskNote')}</p>
          </div>
        </Panel>
      </div>

      <Panel title={t('reviews.gov.pattern')} className="mt-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] text-sm">
            <thead className="text-left text-xs text-ink-2">
              <tr className="border-b border-line">
                <th className="px-5 py-2 font-semibold">{t('reviews.gov.col.book')}</th>
                <th className="px-3 py-2 font-semibold">{t('reviews.gov.col.match')}</th>
                <th className="px-3 py-2 font-semibold">{t('reviews.gov.col.stars')}</th>
                <th className="px-3 py-2 font-semibold">{t('reviews.gov.col.read')}</th>
                <th className="px-3 py-2 font-semibold">{t('reviews.gov.col.time')}</th>
                <th className="px-5 py-2 font-semibold">{t('reviews.gov.col.date')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {demo.bookReviews
                .filter((r) => r.reviewerId === id)
                .map((r) => {
                  const book = bookById[r.bookId]
                  const match = qualification(info, book)
                  return (
                    <tr key={r.id} className={r.status === 'removed' ? 'opacity-50' : ''}>
                      <td className="px-5 py-3">
                        <span className="block font-semibold">{L(book?.title)}</span>
                        <span className="text-xs text-ink-2">{book?.publisher}</span>
                      </td>
                      <td className="px-3 py-3">
                        {match ? (
                          <BadgeCheck className="size-4 text-ok" aria-label={t('reviews.gov.inSubject')} />
                        ) : (
                          <span className="text-xs font-semibold text-bad">{t('reviews.gov.outSubject')}</span>
                        )}
                      </td>
                      <td className="px-3 py-3 tabular-nums">★ {num(r.stars)}</td>
                      <td className={`px-3 py-3 tabular-nums ${r.readPct <= 50 ? 'font-semibold text-bad' : ''}`}>{num(r.readPct)}%</td>
                      <td className={`px-3 py-3 tabular-nums ${r.readHours < 6 ? 'font-semibold text-bad' : ''}`}>{t('reviews.gov.hours', { n: num(r.readHours) })}</td>
                      <td className="px-5 py-3 text-ink-2">{date(r.at)}</td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title={t('reviews.gov.decision')} className="mt-6">
        <div className="grid gap-4 p-5">
          {record && (
            <div className="grid gap-2 rounded-xl bg-surface-2/70 p-4 text-sm">
              <p>
                <span className="font-semibold">{t('reviews.gov.reasonLabel')}</span> {L(record.reason)} · <span className="text-ink-2">{date(record.at)}</span>
              </p>
              {record.publisherId && (
                <p>
                  <span className="font-semibold">{t('reviews.gov.linkedPublisher')}</span> {publisherName(demo, record.publisherId)}
                </p>
              )}
              {record.clarification && (
                <p>
                  <span className="font-semibold">{t('reviews.gov.clarification')}</span> “{record.clarification}”
                </p>
              )}
            </div>
          )}

          {open ? (
            <>
              <p className="text-sm text-ink-2">{record.status === 'clarified' ? t('reviews.gov.clarifiedNote') : t('reviews.gov.waitingClarify')}</p>
              <div className="flex flex-wrap gap-2">
                <button type="button" disabled={record.status !== 'clarified'} onClick={() => close('cleared')} className={buttonStyles.primary}>
                  <ShieldCheck className="size-4" /> {t('reviews.gov.clear')}
                </button>
                <button type="button" onClick={() => close('upheld')} className={`${buttonStyles.primary} bg-bad`}>
                  <Gavel className="size-4" /> {t('reviews.gov.uphold')}
                </button>
              </div>
            </>
          ) : record?.status === 'upheld' ? (
            <p className="flex items-center gap-2 text-sm font-semibold text-bad">
              <ShieldAlert className="size-4" /> {t('reviews.gov.upheldNote')}
            </p>
          ) : (
            <>
              <p className="text-sm text-ink-2">{t('reviews.gov.penaliseNote')}</p>
              <label className="grid gap-1 text-sm">
                <span className="font-semibold">{t('reviews.gov.reasonLabel')}</span>
                <textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder={t('reviews.gov.reasonPlaceholder')} className={inputStyles} />
              </label>
              <label className="grid gap-1 text-sm">
                <span className="font-semibold">{t('reviews.gov.linkedPublisher')}</span>
                <select value={publisherId} onChange={(e) => setPublisherId(e.target.value)} className={inputStyles}>
                  <option value="">{t('reviews.gov.noPublisher')}</option>
                  {publishers.map(([pid, name]) => (
                    <option key={pid} value={pid}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>
              <button type="button" disabled={reason.trim().length < 10} onClick={penalise} className={`${buttonStyles.primary} bg-bad self-start`}>
                <Gavel className="size-4" /> {t('reviews.gov.penalise')}
              </button>
            </>
          )}
        </div>
      </Panel>

      <section className="mt-6 grid gap-4">
        {stats.reviews.map((review) => (
          <ReviewCard key={review.id} review={review} showBook />
        ))}
      </section>
    </div>
  )
}

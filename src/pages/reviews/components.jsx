import { BadgeCheck, Flag, Gift, Medal, Reply, ShieldAlert, Star, TriangleAlert, Trophy } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Avatar from '../../components/Avatar'
import PublicProfileLink from '../../components/PublicProfileLink'
import { buttonStyles, Dialog, inputStyles } from '../../components/ui'
import { CRITERIA, REPORT_REASONS } from '../../data/demo/reviews'
import { useI18n } from '../../i18n/I18nProvider'
import { useDemo } from '../../store/DemoStore'
import { bookSummary, isUnderAudit, publisherRanking, reviewerInfo, reviewerStats, round1, visibleReviews } from './reviewData'

export function Stars({ value, className = 'size-4' }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`${className} ${value >= n - 0.25 ? 'fill-accent text-accent' : 'text-line'}`} />
      ))}
    </span>
  )
}

// Five tappable stars
export function StarInput({ value, onChange, label, size = 'size-7' }) {
  const { t, num } = useI18n()
  return (
    <div role="radiogroup" aria-label={label} className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={t('reviews.form.starsN', { n: num(n) })}
          onClick={() => onChange(n)}
          className="rounded-md p-0.5 transition-transform hover:scale-110"
        >
          <Star className={`${size} ${value >= n ? 'fill-accent text-accent' : 'text-line'}`} />
        </button>
      ))}
    </div>
  )
}

const levelStyles = {
  gold: 'bg-accent text-accent-ink',
  silver: 'bg-surface-2 text-ink ring-1 ring-line ring-inset',
  bronze: 'bg-[color-mix(in_oklab,var(--accent)_22%,transparent)] text-warn',
}

export function LevelBadge({ level }) {
  const { t } = useI18n()
  return (
    <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap ${levelStyles[level]}`}>
      <Medal className="size-3.5" /> {t(`reviews.levels.${level}`)}
    </span>
  )
}

export function AuditPill() {
  const { t } = useI18n()
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-bad-soft px-2 py-0.5 text-xs font-semibold whitespace-nowrap text-bad">
      <ShieldAlert className="size-3.5" /> {t('reviews.underAudit')}
    </span>
  )
}

// One review: reviewer, scores, text, honesty disclosure, publisher reply
export function ReviewCard({ review, actions, showBook = false }) {
  const { t, L, num, date } = useI18n()
  const demo = useDemo()
  const info = reviewerInfo(demo, review.reviewerId)
  const stats = reviewerStats(demo, review.reviewerId)
  const audit = isUnderAudit(demo, review.reviewerId)
  const book = showBook ? demo.books.find((b) => b.id === review.bookId) : null

  return (
    <article className={`rounded-2xl border bg-surface p-5 ${audit ? 'border-bad/40' : 'border-line'}`}>
      <header className="flex items-start gap-3">
        <Avatar initials={info?.initials ?? '?'} className="size-10 text-sm" />
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1 font-semibold">
            {info?.name}
            <BadgeCheck className="size-4 text-primary" aria-label={t('reviews.verifiedReviewer')} />
            {info?.hasProfile && <PublicProfileLink name={info.name} />}
            <LevelBadge level={stats.level} />
            {audit && <AuditPill />}
          </p>
          <p className="text-xs text-ink-2">
            {t(`reviews.role.${info?.role}`)} · {L(info?.org)}
          </p>
        </div>
        <span className="shrink-0 text-xs text-ink-2">{date(review.at)}</span>
      </header>

      {book && <p className="mt-3 text-sm font-semibold text-primary">{L(book.title)}</p>}

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="inline-flex items-center gap-2">
          <Stars value={review.stars} />
          <span className="text-sm font-semibold tabular-nums">{num(review.stars)}</span>
        </span>
        <dl className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-2">
          {CRITERIA.map((key) => (
            <div key={key} className="inline-flex gap-1">
              <dt>{t(`reviews.criteria.${key}`)}</dt>
              <dd className="font-semibold text-ink tabular-nums">{num(review.criteria[key])}/{num(5)}</dd>
            </div>
          ))}
        </dl>
      </div>

      <p className="mt-3 leading-relaxed">{L(review.text)}</p>

      <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2 py-0.5 font-semibold text-warn">
          <Gift className="size-3.5" /> {t('reviews.freeCopy')}
        </span>
        <span className="tabular-nums">{t('reviews.readShare', { pct: num(review.readPct) })}</span>
        {review.status === 'reported' && (
          <span className="inline-flex items-center gap-1 font-semibold text-bad">
            <Flag className="size-3.5" /> {t('reviews.reportedPending')}
          </span>
        )}
      </p>

      {review.reply && (
        <div className="mt-4 rounded-xl border-l-4 border-primary bg-surface-2/70 px-4 py-3 text-sm">
          <p className="flex items-center gap-1.5 font-semibold">
            <Reply className="size-4 text-primary" /> {t('reviews.publisherReply')} · <span className="font-normal text-ink-2">{date(review.reply.at)}</span>
          </p>
          <p className="mt-1">{L(review.reply.text)}</p>
        </div>
      )}

      {actions && <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-3">{actions}</div>}
    </article>
  )
}

// Average reviewer score and per-criterion bars for one book
export function ReviewSummary({ bookId }) {
  const { t, num } = useI18n()
  const demo = useDemo()
  const summary = bookSummary(demo, bookId)
  if (!summary.n) return null
  return (
    <div className="grid gap-5 rounded-2xl border border-line bg-surface p-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
      <div className="text-center sm:pr-6 sm:text-left">
        <p className="font-display text-5xl font-semibold tabular-nums">{num(round1(summary.stars))}</p>
        <Stars value={summary.stars} />
        <p className="mt-1 text-xs text-ink-2">{t('reviews.fromN', { n: num(summary.n) })}</p>
      </div>
      <dl className="grid gap-2">
        {summary.criteria.map(([key, value]) => (
          <div key={key} className="grid grid-cols-[8rem_minmax(0,1fr)_2rem] items-center gap-3 text-sm">
            <dt className="text-ink-2">{t(`reviews.criteria.${key}`)}</dt>
            <dd className="h-2 rounded-full bg-surface-2">
              <span className="block h-full rounded-full bg-primary" style={{ width: `${(value / 5) * 100}%` }} />
            </dd>
            <dd className="text-right font-semibold tabular-nums">{num(round1(value))}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

// The public reviews of one book; the publisher view adds reply and report actions
export function BookReviews({ bookId, renderActions }) {
  const { t } = useI18n()
  const demo = useDemo()
  const reviews = visibleReviews(demo, bookId)

  return (
    <div className="grid gap-4">
      <p className="flex items-start gap-2.5 rounded-2xl bg-brand px-4 py-3 text-sm text-brand-ink">
        <BadgeCheck className="mt-0.5 size-4 shrink-0 text-accent" /> {t('reviews.howItWorks')}
      </p>
      <ReviewSummary bookId={bookId} />
      {reviews.length ? (
        reviews.map((review) => <ReviewCard key={review.id} review={review} actions={renderActions?.(review)} />)
      ) : (
        <p className="rounded-2xl border border-dashed border-line bg-surface px-6 py-10 text-center text-ink-2">{t('reviews.none')}</p>
      )}
    </div>
  )
}

// Reply and report buttons for the publisher's own books
export function PublisherReviewActions({ review }) {
  const { t, L } = useI18n()
  const { dispatch } = useDemo()
  const [mode, setMode] = useState(null)
  const [text, setText] = useState('')
  const [reason, setReason] = useState(REPORT_REASONS[0])
  const [note, setNote] = useState('')

  return (
    <>
      {!review.reply && (
        <button type="button" onClick={() => setMode('reply')} className={`${buttonStyles.ghost} py-2`}>
          <Reply className="size-4" /> {t('reviews.reply')}
        </button>
      )}
      {review.status === 'public' && (
        <button type="button" onClick={() => setMode('report')} className={`${buttonStyles.ghost} py-2 text-bad`}>
          <Flag className="size-4" /> {t('reviews.report')}
        </button>
      )}
      {review.report?.decision && <span className="self-center text-xs text-ink-2">{t(`reviews.decision.${review.report.decision}`)}</span>}

      <Dialog open={mode === 'reply'} title={t('reviews.replyTitle')} onClose={() => setMode(null)}>
        <p className="text-sm text-ink-2">{t('reviews.replyNote')}</p>
        <label htmlFor="reply-text" className="sr-only">
          {t('reviews.reply')}
        </label>
        <textarea id="reply-text" rows={4} value={text} onChange={(e) => setText(e.target.value)} className={`${inputStyles} mt-3`} />
        <button
          type="button"
          disabled={!text.trim()}
          onClick={() => {
            dispatch({ type: 'replyReview', id: review.id, text: text.trim() })
            setMode(null)
          }}
          className={`${buttonStyles.primary} mt-4 w-full`}
        >
          {t('reviews.postReply')}
        </button>
      </Dialog>

      <Dialog open={mode === 'report'} title={t('reviews.reportTitle')} onClose={() => setMode(null)}>
        <p className="text-sm text-ink-2">{t('reviews.reportNote')}</p>
        <fieldset className="mt-4 grid gap-2">
          <legend className="sr-only">{t('reviews.reportReason')}</legend>
          {REPORT_REASONS.map((key) => (
            <label key={key} className={`flex items-center gap-3 rounded-xl border p-3 text-sm ${reason === key ? 'border-primary' : 'border-line'}`}>
              <input type="radio" name="report-reason" checked={reason === key} onChange={() => setReason(key)} className="accent-[var(--primary)]" />
              {t(`reviews.reasons.${key}`)}
            </label>
          ))}
        </fieldset>
        <label htmlFor="report-note" className="mt-4 block text-sm font-semibold">
          {t('reviews.reportDetails')} <span className="font-normal text-ink-2">({t('reviews.optional')})</span>
        </label>
        <textarea
          id="report-note"
          rows={3}
          maxLength={500}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={t('reviews.reportDetailsHint')}
          className={`${inputStyles} mt-2`}
        />
        <p className="mt-3 text-xs text-ink-2">{L(review.text).slice(0, 120)}…</p>
        <button
          type="button"
          onClick={() => {
            dispatch({ type: 'reportReview', id: review.id, reason, note: note.trim() })
            setMode(null)
          }}
          className={`${buttonStyles.primary} mt-4 w-full`}
        >
          <Flag className="size-4" /> {t('reviews.sendReport')}
        </button>
      </Dialog>
    </>
  )
}

const rankStyles = ['bg-accent text-accent-ink', 'bg-surface-2 text-ink ring-1 ring-line ring-inset', 'bg-[color-mix(in_oklab,var(--accent)_22%,transparent)] text-warn']

// League table of publishers by reviewer score. `highlight` marks one publisher's row.
export function PublisherRankingTable({ highlight, limit }) {
  const { t, num } = useI18n()
  const demo = useDemo()
  const rows = publisherRanking(demo).slice(0, limit)

  return (
    <ol className="divide-y divide-line">
      {rows.map((row) => (
        <li key={row.id} className={`flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4 ${row.id === highlight ? 'bg-accent-soft/60' : ''}`}>
          <span className={`grid size-10 shrink-0 place-items-center rounded-full font-display text-lg font-semibold tabular-nums ${rankStyles[row.rank - 1] ?? 'bg-surface-2 text-ink-2'}`}>
            {row.rank === 1 ? <Trophy className="size-5" aria-label="1" /> : num(row.rank)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="flex flex-wrap items-center gap-2 font-semibold">
              {row.name}
              {row.id === highlight && <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-ink">{t('reviews.ranking.you')}</span>}
              {row.warning && (
                <span className="inline-flex items-center gap-1 rounded-full bg-bad-soft px-2 py-0.5 text-xs font-semibold text-bad">
                  <TriangleAlert className="size-3.5" /> {t('reviews.ranking.warning')}
                </span>
              )}
            </p>
            <p className="text-xs text-ink-2">
              {t('reviews.ranking.meta', { books: num(row.books.length), reviews: num(row.n), reviewers: num(row.reviewers) })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-right sm:block">
              <span className="block text-xs text-ink-2">{t('reviews.ranking.average')}</span>
              <span className="inline-flex items-center gap-1 font-semibold tabular-nums">
                <Star className="size-3.5 fill-accent text-accent" /> {row.n ? num(round1(row.average)) : '–'}
              </span>
            </span>
            <span className="text-right">
              <span className="block text-xs text-ink-2">{t('reviews.ranking.score')}</span>
              <span className="font-display text-2xl font-semibold tabular-nums">{num(Math.round(row.score * 100) / 100)}</span>
            </span>
          </div>
        </li>
      ))}
    </ol>
  )
}

export function RankingExplainer() {
  const { t } = useI18n()
  return (
    <details className="group rounded-2xl border border-line bg-surface px-5 py-4 text-sm">
      <summary className="cursor-pointer font-semibold">{t('reviews.ranking.howTitle')}</summary>
      <ul className="mt-3 grid list-disc gap-1.5 pl-5 text-ink-2">
        {t('reviews.ranking.how').map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </details>
  )
}

export function PublicRankingLink({ className = '' }) {
  const { t } = useI18n()
  return (
    <Link to="/rankings" target="_blank" rel="noreferrer" className={`inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline ${className}`}>
      <Trophy className="size-4" /> {t('reviews.ranking.publicLink')}
    </Link>
  )
}

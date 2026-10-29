import { Check, Megaphone, Send, ShieldAlert, Trophy, UserCheck, X } from 'lucide-react'
import { useState } from 'react'
import Avatar from '../../components/Avatar'
import PublicProfileLink from '../../components/PublicProfileLink'
import { usePasscode } from '../../components/Passcode'
import { useToast } from '../../components/Toast'
import { buttonStyles, inputStyles, PageIntro, Panel } from '../../components/ui'
import { DEFAULT_HONORARIUM } from '../../data/demo/reviews'
import { MY_PUBLISHER } from '../../data/demo/publisher'
import { useI18n } from '../../i18n/I18nProvider'
import { useDemo } from '../../store/DemoStore'
import { BookReviews, LevelBadge, PublicRankingLink, PublisherReviewActions } from '../reviews/components'
import { QualificationNote } from '../reviews/ReviewerDesk'
import { allReviewers, isBlocked, newId, nowIso, pagesNeeded, publisherRanking, qualification, reviewerInfo, reviewerStats } from '../reviews/reviewData'
import { BookCover, useMyBooks } from './shared'

const DIVISIONS = ['dhaka', 'chattogram', 'rajshahi', 'khulna', 'barishal', 'sylhet', 'rangpur', 'mymensingh']

function ReviewerLine({ info, children }) {
  const { t, L } = useI18n()
  const demo = useDemo()
  const stats = reviewerStats(demo, info.id)
  return (
    <li className="flex flex-wrap items-start gap-3 px-5 py-4">
      <Avatar initials={info.initials} className="size-10 text-sm" />
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-1.5 font-semibold">
          {info.name} {info.hasProfile && <PublicProfileLink name={info.name} />}
          <LevelBadge level={stats.level} />
        </p>
        <p className="text-xs text-ink-2">
          {t(`reviews.role.${info.role}`)} · {L(info.org)} · {t(`common.divisions.${info.division}`)}
        </p>
        {children}
      </div>
    </li>
  )
}

// Opens or closes a review call: qualified reviewers can then request a copy
function CallCard({ book }) {
  const { t, num, money, date } = useI18n()
  const { reviewCalls, reviewCopies, dispatch } = useDemo()
  const toast = useToast()
  const call = reviewCalls.find((c) => c.bookId === book.id)
  const [seats, setSeats] = useState(10)
  const [honorarium, setHonorarium] = useState(DEFAULT_HONORARIUM)
  const [deadline, setDeadline] = useState('2026-11-30')
  const used = reviewCopies.filter((c) => c.bookId === book.id && c.status !== 'declined').length

  if (call) {
    return (
      <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-brand p-5 text-brand-ink">
        <Megaphone className="size-6 text-accent" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{t('reviews.pub.callOpen')}</p>
          <p className="text-sm text-brand-ink/70">
            {t('reviews.pub.callMeta', { used: num(used), seats: num(call.seats), amount: money(call.honorarium), date: date(call.deadline) })}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            dispatch({ type: 'closeReviewCall', bookId: book.id })
            toast(t('reviews.pub.callClosed'))
          }}
          className="rounded-xl border border-brand-ink/25 px-4 py-2 text-sm font-semibold hover:bg-brand-ink/10"
        >
          {t('reviews.pub.closeCall')}
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <p className="font-semibold">{t('reviews.pub.openCallTitle')}</p>
      <p className="mt-1 text-sm text-ink-2">{t('reviews.pub.openCallBody')}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <label className="grid gap-1 text-sm">
          <span className="text-ink-2">{t('reviews.pub.seats')}</span>
          <input type="number" min={1} max={50} value={seats} onChange={(e) => setSeats(Number(e.target.value))} className={inputStyles} />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-ink-2">{t('reviews.pub.honorarium')}</span>
          <input type="number" min={0} step={50} value={honorarium} onChange={(e) => setHonorarium(Number(e.target.value))} className={inputStyles} />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-ink-2">{t('reviews.pub.deadline')}</span>
          <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className={inputStyles} />
        </label>
      </div>
      <button
        type="button"
        disabled={seats < 1 || !deadline}
        onClick={() => {
          dispatch({ type: 'openReviewCall', call: { bookId: book.id, publisherId: MY_PUBLISHER.id, seats, honorarium, deadline } })
          toast(t('reviews.pub.callOpened'))
        }}
        className={`${buttonStyles.accent} mt-4`}
      >
        <Megaphone className="size-4" /> {t('reviews.pub.openCall')}
      </button>
    </div>
  )
}

export default function Reviewers() {
  const { t, L, num, money } = useI18n()
  const demo = useDemo()
  const { reviewCopies, reviewCalls, dispatch } = demo
  const toast = useToast()
  const confirmPasscode = usePasscode()
  const myBooks = useMyBooks().filter((b) => b.status === 'live')
  const [bookId, setBookId] = useState(myBooks[0]?.id ?? '')
  const [roleFilter, setRoleFilter] = useState('all')
  const [division, setDivision] = useState('')
  const book = myBooks.find((b) => b.id === bookId)

  const ranking = publisherRanking(demo)
  const mine = ranking.find((r) => r.id === MY_PUBLISHER.id)

  if (!book) return <PageIntro title={t('reviews.pub.title')} body={t('reviews.pub.noBooks')} />

  const copies = reviewCopies.filter((c) => c.bookId === book.id)
  const requests = copies.filter((c) => c.status === 'requested')
  const out = copies.filter((c) => ['invited', 'reading', 'reviewed'].includes(c.status))
  const taken = new Set(copies.filter((c) => c.status !== 'declined').map((c) => c.reviewerId))
  const honorarium = reviewCalls.find((c) => c.bookId === book.id)?.honorarium ?? DEFAULT_HONORARIUM

  const candidates = allReviewers(demo)
    .map((info) => ({ info, q: qualification(info, book) }))
    .filter(({ info, q }) => q && !taken.has(info.id) && (roleFilter === 'all' || info.role === roleFilter) && (!division || info.division === division))

  async function invite(info) {
    if (!(await confirmPasscode(t('passcode.actions.sendCopy', { title: L(book.title), name: info.name })))) return
    dispatch({
      type: 'addReviewCopy',
      copy: { id: newId('rc'), bookId: book.id, reviewerId: info.id, via: 'invite', status: 'invited', honorarium, at: nowIso(), pagesSeen: [] },
    })
    toast(t('reviews.pub.invitedToast', { name: info.name }))
  }

  async function approve(copy) {
    const info = reviewerInfo(demo, copy.reviewerId)
    if (!(await confirmPasscode(t('passcode.actions.sendCopy', { title: L(book.title), name: info.name })))) return
    dispatch({ type: 'setReviewCopy', id: copy.id, status: 'reading' })
    toast(t('reviews.pub.sentToast', { name: info.name }))
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageIntro title={t('reviews.pub.title')} body={t('reviews.pub.body')}>
        <PublicRankingLink />
      </PageIntro>

      {mine && (
        <section className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-surface p-5">
          <span className="grid size-14 place-items-center rounded-2xl bg-accent text-accent-ink">
            <Trophy className="size-7" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-2xl font-semibold">{t('reviews.pub.rank', { rank: num(mine.rank), total: num(ranking.length) })}</p>
            <p className="text-sm text-ink-2">{t('reviews.pub.rankNote', { score: num(Math.round(mine.score * 100) / 100), n: num(mine.n) })}</p>
          </div>
          {mine.warning && (
            <p className="flex items-center gap-2 rounded-xl bg-bad-soft px-3 py-2 text-sm font-semibold text-bad">
              <ShieldAlert className="size-4" /> {t('reviews.pub.warning')}
            </p>
          )}
        </section>
      )}

      <div className="mb-6 flex flex-wrap gap-3">
        {myBooks.map((b) => (
          <button
            key={b.id}
            type="button"
            aria-pressed={b.id === bookId}
            onClick={() => setBookId(b.id)}
            className={`flex items-center gap-3 rounded-2xl border p-2 pr-4 text-left transition-colors ${b.id === bookId ? 'border-primary bg-surface' : 'border-line bg-surface/60 hover:border-primary'}`}
          >
            <BookCover book={b} className="w-10 text-sm" />
            <span>
              <span className="block text-sm font-semibold">{L(b.title)}</span>
              <span className="block text-xs text-ink-2">{L(b.cls)}</span>
            </span>
          </button>
        ))}
      </div>

      <CallCard book={book} />

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title={t('reviews.pub.requests', { n: num(requests.length) })}>
          {requests.length ? (
            <ul className="divide-y divide-line">
              {requests.map((copy) => {
                const info = reviewerInfo(demo, copy.reviewerId)
                return (
                  <ReviewerLine key={copy.id} info={info}>
                    <QualificationNote q={qualification(info, book)} />
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button type="button" disabled={isBlocked(demo, info.id)} onClick={() => approve(copy)} className={`${buttonStyles.primary} py-2`}>
                        <Check className="size-4" /> {t('reviews.pub.approve')}
                      </button>
                      <button type="button" onClick={() => dispatch({ type: 'setReviewCopy', id: copy.id, status: 'declined' })} className={`${buttonStyles.ghost} py-2`}>
                        <X className="size-4" /> {t('reviews.desk.decline')}
                      </button>
                    </div>
                  </ReviewerLine>
                )
              })}
            </ul>
          ) : (
            <p className="px-5 py-6 text-sm text-ink-2">{t('reviews.pub.noRequests')}</p>
          )}
        </Panel>

        <Panel title={t('reviews.pub.out', { n: num(out.length) })}>
          {out.length ? (
            <ul className="divide-y divide-line">
              {out.map((copy) => {
                const info = reviewerInfo(demo, copy.reviewerId)
                const need = pagesNeeded(book.id)
                return (
                  <ReviewerLine key={copy.id} info={info}>
                    <p className="mt-1 text-xs font-semibold">
                      {t(`reviews.pub.copyStatus.${copy.status}`)}
                      {copy.status === 'reading' && <span className="font-normal text-ink-2"> · {t('reviews.desk.progress', { seen: num(copy.pagesSeen.length), need: num(need) })}</span>}
                    </p>
                  </ReviewerLine>
                )
              })}
            </ul>
          ) : (
            <p className="px-5 py-6 text-sm text-ink-2">{t('reviews.pub.noOut')}</p>
          )}
        </Panel>
      </div>

      <Panel title={t('reviews.pub.find')} className="mt-6">
        <div className="flex flex-wrap items-center gap-3 border-b border-line px-5 py-3">
          <div className="inline-flex rounded-xl border border-line p-1">
            {['all', 'teacher', 'student'].map((key) => (
              <button
                key={key}
                type="button"
                aria-pressed={roleFilter === key}
                onClick={() => setRoleFilter(key)}
                className={`rounded-lg px-3 py-1 text-sm font-semibold ${roleFilter === key ? 'bg-brand text-brand-ink' : 'text-ink-2'}`}
              >
                {t(`reviews.pub.roles.${key}`)}
              </button>
            ))}
          </div>
          <label className="min-w-40">
            <span className="sr-only">{t('industry.talent.division')}</span>
            <select value={division} onChange={(e) => setDivision(e.target.value)} className={`${inputStyles} py-2`}>
              <option value="">{t('industry.talent.allDivisions')}</option>
              {DIVISIONS.map((key) => (
                <option key={key} value={key}>
                  {t(`common.divisions.${key}`)}
                </option>
              ))}
            </select>
          </label>
          <span className="text-sm text-ink-2">{t('reviews.pub.inviteHonorarium', { amount: money(honorarium) })}</span>
        </div>
        {candidates.length ? (
          <ul className="grid divide-y divide-line md:grid-cols-2 md:divide-y-0">
            {candidates.map(({ info, q }) => {
              const blocked = isBlocked(demo, info.id)
              return (
                <ReviewerLine key={info.id} info={info}>
                  <QualificationNote q={q} />
                  <div className="mt-2">
                    {blocked ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-bad">
                        <ShieldAlert className="size-3.5" /> {t('reviews.pub.suspended')}
                      </span>
                    ) : (
                      <button type="button" onClick={() => invite(info)} className={`${buttonStyles.primary} py-2`}>
                        <Send className="size-4" /> {t('reviews.pub.invite')}
                      </button>
                    )}
                  </div>
                </ReviewerLine>
              )
            })}
          </ul>
        ) : (
          <p className="flex items-center gap-2 px-5 py-6 text-sm text-ink-2">
            <UserCheck className="size-4" /> {t('reviews.pub.noCandidates')}
          </p>
        )}
      </Panel>

      <section className="mt-6">
        <h3 className="mb-3 font-semibold">{t('reviews.pub.reviewsTitle')}</h3>
        <BookReviews bookId={book.id} renderActions={(review) => <PublisherReviewActions review={review} />} />
      </section>
    </div>
  )
}

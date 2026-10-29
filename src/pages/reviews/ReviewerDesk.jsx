import { BadgeCheck, BookOpenText, Check, Clock3, HandCoins, Inbox, Lock, LockOpen, Medal, MessageSquareText, Send, ShieldAlert, X } from 'lucide-react'
import { useState } from 'react'
import { useReader } from '../../components/pdf/useReader'
import { bookPdf } from '../../components/pdf/pdfSources'
import { usePasscode } from '../../components/Passcode'
import { useToast } from '../../components/Toast'
import { buttonStyles, Dialog, inputStyles, PageIntro, Panel, Stat } from '../../components/ui'
import { CRITERIA, REVIEW_POINTS } from '../../data/demo/reviews'
import { useI18n } from '../../i18n/I18nProvider'
import { useCurrentStudent, useDemo } from '../../store/DemoStore'
import { useTeacher } from '../teacher/useTeacher'
import { BookCover } from '../publisher/shared'
import { LevelBadge, ReviewCard, StarInput } from './components'
import { caseOf, hoursSince, isBlocked, newId, nowIso, pagesNeeded, qualification, reviewerInfo, reviewerStats, SUBJECT_NAMES } from './reviewData'

// Qualification line, e.g. "Physics teacher (verified ID)" or "Physics practice average 88%"
export function QualificationNote({ q }) {
  const { t, L, num } = useI18n()
  if (!q) return null
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-ok">
      <BadgeCheck className="size-3.5" />
      {t(`reviews.qualify.${q.kind}`, { subject: L(SUBJECT_NAMES[q.subject] ?? SUBJECT_NAMES.all), pct: num(q.pct ?? 0) })}
    </span>
  )
}

// Suspension notice with the clarification form
function SuspendedPanel({ reviewerId }) {
  const { t, L, date } = useI18n()
  const demo = useDemo()
  const toast = useToast()
  const record = caseOf(demo, reviewerId)
  const [text, setText] = useState('')

  if (!record) return null
  const sent = record.status === 'clarified'
  const upheld = record.status === 'upheld'

  function send() {
    demo.dispatch({ type: 'reviewerCase', reviewerId, changes: { status: 'clarified', clarification: text.trim(), clarifiedAt: nowIso() } })
    toast(t('reviews.desk.clarifySent'))
    setText('')
  }

  return (
    <section className="mb-6 rounded-2xl border-2 border-bad bg-bad-soft p-5">
      <p className="flex items-center gap-2 font-semibold text-bad">
        <ShieldAlert className="size-5" /> {upheld ? t('reviews.desk.upheldTitle') : t('reviews.desk.suspendedTitle')}
      </p>
      <p className="mt-2 text-sm">{upheld ? t('reviews.desk.upheldBody') : t('reviews.desk.suspendedBody')}</p>
      <p className="mt-3 rounded-xl bg-surface px-4 py-3 text-sm">
        <span className="font-semibold">{t('reviews.desk.govNote')}</span> {L(record.reason)} <span className="text-ink-2">· {date(record.at)}</span>
      </p>
      {sent ? (
        <p className="mt-3 flex items-center gap-2 text-sm font-semibold">
          <Clock3 className="size-4" /> {t('reviews.desk.clarifyWaiting')}
        </p>
      ) : (
        <div className="mt-4">
          <label htmlFor="clarify" className="text-sm font-semibold">
            {t('reviews.desk.clarifyLabel')}
          </label>
          <textarea
            id="clarify"
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('reviews.desk.clarifyPlaceholder')}
            className={`${inputStyles} mt-2`}
          />
          <button type="button" disabled={text.trim().length < 20} onClick={send} className={`${buttonStyles.primary} mt-3`}>
            <Send className="size-4" /> {t('reviews.desk.clarifySend')}
          </button>
        </div>
      )}
    </section>
  )
}

function ReviewForm({ copy, book, onClose }) {
  const { t, L, money } = useI18n()
  const { dispatch } = useDemo()
  const toast = useToast()
  const confirmPasscode = usePasscode()
  const [stars, setStars] = useState(0)
  const [criteria, setCriteria] = useState({})
  const [text, setText] = useState('')
  const ready = stars && CRITERIA.every((key) => criteria[key]) && text.trim().length >= 40

  async function submit() {
    if (!(await confirmPasscode(t('passcode.actions.submitReview', { title: L(book.title) })))) return
    const pages = bookPdf(book.id).pages
    dispatch({
      type: 'submitBookReview',
      copyId: copy.id,
      review: {
        id: newId('rv'),
        bookId: book.id,
        reviewerId: copy.reviewerId,
        stars,
        criteria,
        text: text.trim(),
        at: nowIso(),
        readPct: Math.round((copy.pagesSeen.length / pages) * 100),
        readHours: hoursSince(copy.at),
        status: 'public',
      },
    })
    toast(t('reviews.desk.submittedToast', { amount: money(copy.honorarium) }))
    onClose()
  }

  return (
    <Dialog open title={t('reviews.form.title', { title: L(book.title) })} onClose={onClose}>
      <div className="grid gap-5">
        <div>
          <p className="text-sm font-semibold">{t('reviews.form.overall')}</p>
          <div className="mt-2">
            <StarInput value={stars} onChange={setStars} label={t('reviews.form.overall')} />
          </div>
        </div>
        <div className="grid gap-3">
          <p className="text-sm font-semibold">{t('reviews.form.criteria')}</p>
          {CRITERIA.map((key) => (
            <div key={key} className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm text-ink-2">{t(`reviews.criteria.${key}`)}</span>
              <StarInput size="size-5" value={criteria[key] ?? 0} onChange={(n) => setCriteria((c) => ({ ...c, [key]: n }))} label={t(`reviews.criteria.${key}`)} />
            </div>
          ))}
        </div>
        <div>
          <label htmlFor="review-text" className="text-sm font-semibold">
            {t('reviews.form.text')}
          </label>
          <textarea id="review-text" rows={5} value={text} onChange={(e) => setText(e.target.value)} placeholder={t('reviews.form.placeholder')} className={`${inputStyles} mt-2`} />
          <p className="mt-1 text-xs text-ink-2">{t('reviews.form.min')}</p>
        </div>
        <p className="rounded-xl bg-accent-soft px-4 py-3 text-xs">{t('reviews.form.disclosure')}</p>
        <button type="button" disabled={!ready} onClick={submit} className={`${buttonStyles.primary} w-full py-3`}>
          <Send className="size-4" /> {t('reviews.form.submit')}
        </button>
      </div>
    </Dialog>
  )
}

function CopyRow({ copy, children }) {
  const { t, L, money, date } = useI18n()
  const demo = useDemo()
  const book = demo.books.find((b) => b.id === copy.bookId)
  if (!book) return null
  return (
    <li className="flex gap-4 px-5 py-4">
      <BookCover book={book} className="w-14 text-base" />
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{L(book.title)}</p>
        <p className="text-xs text-ink-2">
          {L(book.cls)} · {book.publisher}
        </p>
        <p className="mt-1 flex flex-wrap gap-x-3 text-xs text-ink-2">
          <span className="inline-flex items-center gap-1">
            <HandCoins className="size-3.5" /> {t('reviews.honorarium', { amount: money(copy.honorarium) })}
          </span>
          <span>{t(`reviews.desk.via.${copy.via}`, { date: date(copy.at) })}</span>
        </p>
        <div className="mt-3">{children}</div>
      </div>
    </li>
  )
}

export default function ReviewerDesk({ reviewerId }) {
  const { t, L, num, money, date } = useI18n()
  const demo = useDemo()
  const { dispatch, books, reviewCopies, reviewCalls } = demo
  const toast = useToast()
  const confirmPasscode = usePasscode()
  const [openReader, reader] = useReader()
  const [writing, setWriting] = useState(null)

  const info = reviewerInfo(demo, reviewerId)
  const stats = reviewerStats(demo, reviewerId)
  const blocked = isBlocked(demo, reviewerId)
  const bookById = Object.fromEntries(books.map((b) => [b.id, b]))
  const mine = reviewCopies.filter((c) => c.reviewerId === reviewerId && bookById[c.bookId])
  const invites = mine.filter((c) => c.status === 'invited')
  const requested = mine.filter((c) => c.status === 'requested')
  const reading = mine.filter((c) => c.status === 'reading')
  const takenBooks = new Set(mine.filter((c) => c.status !== 'declined').map((c) => c.bookId))

  // Open calls this reviewer qualifies for and hasn't joined yet
  const calls = reviewCalls
    .map((call) => {
      const book = bookById[call.bookId]
      const used = reviewCopies.filter((c) => c.bookId === call.bookId && c.status !== 'declined').length
      return { ...call, book, left: call.seats - used, q: qualification(info, book) }
    })
    .filter((c) => c.book?.status === 'live' && c.q && !takenBooks.has(c.bookId) && c.left > 0)

  function read(copy) {
    const book = bookById[copy.bookId]
    const pdf = bookPdf(book.id)
    openReader({
      src: pdf.file,
      title: L(book.title),
      initialPage: 1,
      pageLabels: pdf.pageLabels,
      note: t('reviews.desk.readerNote', { n: num(pagesNeeded(book.id)) }),
      onPageChange: (page) => dispatch({ type: 'reviewCopyRead', id: copy.id, page }),
    })
  }

  async function request(call) {
    if (!(await confirmPasscode(t('passcode.actions.requestCopy', { title: L(call.book.title) })))) return
    dispatch({
      type: 'addReviewCopy',
      copy: { id: newId('rc'), bookId: call.bookId, reviewerId, via: 'request', status: 'requested', honorarium: call.honorarium, at: nowIso(), pagesSeen: [] },
    })
    toast(t('reviews.desk.requestedToast', { publisher: call.book.publisher }))
  }

  function answer(copy, accept) {
    dispatch({ type: 'setReviewCopy', id: copy.id, status: accept ? 'reading' : 'declined' })
    toast(accept ? t('reviews.desk.acceptedToast') : t('reviews.desk.declinedToast'))
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageIntro title={t('reviews.desk.title')} body={t('reviews.desk.body')}>
        <LevelBadge level={stats.level} />
      </PageIntro>

      <SuspendedPanel reviewerId={reviewerId} />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat tone="brand" label={t('reviews.desk.statLevel')} value={t(`reviews.levels.${stats.level}`)} note={t('reviews.desk.statLevelNote')} />
        <Stat label={t('reviews.desk.statReviews')} value={num(stats.total)} />
        <Stat label={t('reviews.desk.statPoints')} value={num(stats.points)} note={t('reviews.desk.statPointsNote', { n: num(REVIEW_POINTS) })} />
        <Stat label={t('reviews.desk.statEarned')} value={money(stats.honorarium)} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title={t('reviews.desk.invites')} action={<Inbox className="size-5 text-ink-2" />}>
          {invites.length ? (
            <ul className="divide-y divide-line">
              {invites.map((copy) => (
                <CopyRow key={copy.id} copy={copy}>
                  <QualificationNote q={qualification(info, bookById[copy.bookId])} />
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button type="button" disabled={blocked} onClick={() => answer(copy, true)} className={`${buttonStyles.primary} py-2`}>
                      <Check className="size-4" /> {t('reviews.desk.accept')}
                    </button>
                    <button type="button" onClick={() => answer(copy, false)} className={`${buttonStyles.ghost} py-2`}>
                      <X className="size-4" /> {t('reviews.desk.decline')}
                    </button>
                  </div>
                </CopyRow>
              ))}
            </ul>
          ) : (
            <p className="px-5 py-6 text-sm text-ink-2">{t('reviews.desk.noInvites')}</p>
          )}
          {requested.length > 0 && (
            <ul className="divide-y divide-line border-t border-line">
              {requested.map((copy) => (
                <CopyRow key={copy.id} copy={copy}>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-warn-soft px-2.5 py-1 text-xs font-semibold text-warn">
                    <Clock3 className="size-3.5" /> {t('reviews.desk.awaiting')}
                  </span>
                </CopyRow>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title={t('reviews.desk.calls')} action={<Medal className="size-5 text-ink-2" />}>
          {calls.length ? (
            <ul className="divide-y divide-line">
              {calls.map((call) => (
                <CopyRow key={call.bookId} copy={{ id: call.bookId, bookId: call.bookId, honorarium: call.honorarium, via: 'call', at: call.deadline }}>
                  <QualificationNote q={call.q} />
                  <p className="mt-1 text-xs text-ink-2">{t('reviews.desk.seatsLeft', { n: num(call.left), date: date(call.deadline) })}</p>
                  <button type="button" disabled={blocked} onClick={() => request(call)} className={`${buttonStyles.primary} mt-2 py-2`}>
                    <Send className="size-4" /> {t('reviews.desk.request')}
                  </button>
                </CopyRow>
              ))}
            </ul>
          ) : (
            <p className="px-5 py-6 text-sm text-ink-2">{t('reviews.desk.noCalls')}</p>
          )}
        </Panel>
      </div>

      <Panel title={t('reviews.desk.reading')} className="mt-6">
        {reading.length ? (
          <ul className="divide-y divide-line">
            {reading.map((copy) => {
              const need = pagesNeeded(copy.bookId)
              const seen = copy.pagesSeen.length
              const unlocked = seen >= need
              return (
                <CopyRow key={copy.id} copy={copy}>
                  <div className="h-1.5 max-w-sm rounded-full bg-surface-2">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, (seen / need) * 100)}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-ink-2 tabular-nums">{t('reviews.desk.progress', { seen: num(seen), need: num(need) })}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button type="button" onClick={() => read(copy)} className={`${buttonStyles.accent} py-2`}>
                      <BookOpenText className="size-4" /> {t('reviews.desk.read')}
                    </button>
                    <button type="button" disabled={!unlocked || blocked} onClick={() => setWriting(copy)} className={`${buttonStyles.primary} py-2`}>
                      {unlocked ? <LockOpen className="size-4" /> : <Lock className="size-4" />} {t('reviews.desk.write')}
                    </button>
                  </div>
                </CopyRow>
              )
            })}
          </ul>
        ) : (
          <p className="px-5 py-6 text-sm text-ink-2">{t('reviews.desk.noReading')}</p>
        )}
      </Panel>

      <section className="mt-6">
        <h3 className="mb-3 flex items-center gap-2 font-semibold">
          <MessageSquareText className="size-5 text-primary" /> {t('reviews.desk.mine', { n: num(stats.reviews.length) })}
        </h3>
        {stats.reviews.length ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {stats.reviews.map((review) => (
              <ReviewCard key={review.id} review={review} showBook />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-line bg-surface px-6 py-8 text-center text-sm text-ink-2">{t('reviews.desk.noReviews')}</p>
        )}
      </section>

      {writing && <ReviewForm copy={writing} book={bookById[writing.bookId]} onClose={() => setWriting(null)} />}
      {reader}
    </div>
  )
}

export function StudentReviewerDesk() {
  const { student } = useCurrentStudent()
  return <ReviewerDesk key={student.id} reviewerId={student.id} />
}

export function TeacherReviewerDesk() {
  const { persona } = useTeacher()
  return <ReviewerDesk key={persona.id} reviewerId={persona.id} />
}

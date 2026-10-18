import { ArrowLeft, Check, ChevronLeft, ChevronRight, CircleCheck, Clock3, Lock, ShieldCheck, TriangleAlert, Undo2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useToast } from '../../components/Toast'
import { buttonStyles, inputStyles, Panel, SkillChip } from '../../components/ui'
import { bookChecks, challengeFlags } from '../../data/demo/government'
import { useI18n } from '../../i18n/I18nProvider'
import { useDemo } from '../../store/DemoStore'
import { useCountReview, useReviewQueue, useWaitLabel } from './review'
import { PriorityPill, SectionLabel } from './shared'

// Who reads the reviewer's note, per item kind
const RECIPIENT = { challenge: 'poster', book: 'publisher', note: 'student', exam: 'teacher' }

// Bar widths for the drawn page thumbnails, so each page looks a little different
const LINE_SETS = [
  [92, 78, 85, 60, 88, 70],
  [70, 90, 82, 94, 55, 80],
  [86, 64, 90, 76, 84, 48],
]

function PageThumb({ label, flagged, handwritten }) {
  const { t } = useI18n()
  const lines = LINE_SETS[label.length % LINE_SETS.length]
  return (
    <figure className="min-w-0">
      <div
        className={`relative aspect-[3/4] rounded-lg border bg-surface p-2.5 shadow-sm ${flagged ? 'border-warn ring-2 ring-warn' : 'border-line'}`}
        aria-hidden="true"
      >
        {!handwritten && <span className="mb-2 block h-1.5 w-1/2 rounded-full bg-ink/70" />}
        <span className="grid gap-1.5">
          {lines.map((w, i) => (
            <span
              key={i}
              className={`block rounded-full ${handwritten ? 'h-[3px] -rotate-1 bg-primary/55' : 'h-1 bg-ink-2/35'}`}
              style={{ width: `${w}%` }}
            />
          ))}
        </span>
        {flagged && (
          <span className="absolute inset-x-2 bottom-2 rounded-md bg-warn-soft px-1.5 py-1 text-center text-[10px] font-semibold text-warn">
            {t('government.review.flagged')}
          </span>
        )}
      </div>
      <figcaption className="mt-1.5 text-center text-xs text-ink-2 tabular-nums">{label}</figcaption>
    </figure>
  )
}

function ChallengePreview({ challenge }) {
  const { t, L, money, date } = useI18n()
  return (
    <div className="grid gap-6 p-5">
      <section>
        <SectionLabel>{t('government.review.problem')}</SectionLabel>
        <p className="mt-2 text-lg leading-relaxed">{L(challenge.summary)}</p>
      </section>
      <section>
        <SectionLabel>{t('government.review.deliverables')}</SectionLabel>
        <ul className="mt-3 grid gap-2">
          {L(challenge.deliverables).map((item) => (
            <li key={item} className="flex gap-2.5">
              <Check className="mt-0.5 size-4 shrink-0 text-primary" /> {item}
            </li>
          ))}
        </ul>
      </section>
      <p className="flex items-center gap-2.5 rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-brand-ink">
        <Lock className="size-5 shrink-0 text-accent" /> {t('government.review.escrow', { amount: money(challenge.reward) })}
      </p>
      <section>
        <SectionLabel>{t('government.review.skills')}</SectionLabel>
        <div className="mt-3 flex flex-wrap gap-2">
          {challenge.skills.map((skill) => (
            <SkillChip key={skill} name={skill} />
          ))}
        </div>
      </section>
      <dl className="grid grid-cols-2 gap-4 rounded-2xl bg-surface-2 p-4 text-sm">
        <div>
          <dt className="text-ink-2">{t('government.review.deadline')}</dt>
          <dd className="mt-0.5 font-semibold">{date(challenge.deadline)}</dd>
        </div>
        <div>
          <dt className="text-ink-2">{t('government.review.format')}</dt>
          <dd className="mt-0.5 font-semibold">{(challenge.formats ?? [challenge.team]).filter(Boolean).map((f) => t(`common.${f}`)).join(' · ')}</dd>
        </div>
      </dl>
    </div>
  )
}

const COVER_STYLES = { teal: 'bg-brand text-brand-ink', amber: 'bg-accent text-accent-ink', mist: 'bg-surface-2 text-ink' }

function BookPreview({ book }) {
  const { t, L, money, num } = useI18n()
  const flaggedPage = bookChecks[book.id]?.flaggedPage
  const samplePages = [...new Set([1, 12, 45, flaggedPage, 132, 200].filter((p) => p && p <= book.pages))].sort((a, b) => a - b)

  return (
    <div className="grid gap-6 p-5">
      <div className="grid gap-5 sm:grid-cols-[9rem_minmax(0,1fr)]">
        <div className={`flex aspect-[3/4] w-36 flex-col justify-between rounded-xl p-3.5 shadow-md ${COVER_STYLES[book.cover] ?? COVER_STYLES.teal}`}>
          <span className="text-[10px] font-semibold tracking-[0.14em] uppercase opacity-75">{L(book.cls)}</span>
          <span className="font-display text-lg leading-tight font-semibold">{L(book.title)}</span>
          <span className="text-[10px] opacity-75">{book.publisher}</span>
        </div>
        <div className="min-w-0">
          <p className="leading-relaxed">{L(book.about)}</p>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-ink-2">{t('government.review.price')}</dt>
              <dd className="font-semibold tabular-nums">{money(book.price)}</dd>
            </div>
            <div>
              <dt className="text-ink-2">{t('government.review.pagesLabel')}</dt>
              <dd className="font-semibold tabular-nums">{num(book.pages)}</dd>
            </div>
            <div>
              <dt className="text-ink-2">{t('government.review.syllabus')}</dt>
              <dd className="font-semibold">{t('government.review.syllabusYear', { year: num(book.syllabus).replace(/[,،]/g, '') })}</dd>
            </div>
            <div>
              <dt className="text-ink-2">{t('government.review.class')}</dt>
              <dd className="font-semibold">{L(book.cls)}</dd>
            </div>
          </dl>
        </div>
      </div>
      <section>
        <SectionLabel>{t('government.review.samplePages')}</SectionLabel>
        <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {samplePages.map((page) => (
            <PageThumb key={page} label={t('government.review.page', { n: num(page) })} flagged={page === flaggedPage} />
          ))}
        </div>
      </section>
    </div>
  )
}

function NotePreview({ note }) {
  const { t, L, num } = useI18n()
  const shown = Math.min(note.pages, 6)
  return (
    <div className="grid gap-5 p-5">
      <p className="text-ink-2">
        {L(note.subject)} · {note.author}
      </p>
      <section>
        <SectionLabel>{t('government.review.pages', { n: num(note.pages) })}</SectionLabel>
        <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {Array.from({ length: shown }, (_, i) => (
            <PageThumb key={i} label={t('government.review.page', { n: num(i + 1) })} handwritten />
          ))}
        </div>
        {note.pages > shown && <p className="mt-2 text-sm text-ink-2">{t('government.review.morePages', { n: num(note.pages - shown) })}</p>}
      </section>
    </div>
  )
}

function ExamPreview({ exam }) {
  const { t, L, num } = useI18n()
  return (
    <div className="grid gap-5 p-5">
      <p className="text-ink-2">
        {L(exam.subject)} · {L(exam.school)}
      </p>
      <ul className="flex flex-wrap gap-2 text-sm">
        {exam.mix.mcq > 0 && <li className="rounded-full bg-surface-2 px-3 py-1 tabular-nums">{t('government.review.mcq', { n: num(exam.mix.mcq) })}</li>}
        {exam.mix.written > 0 && <li className="rounded-full bg-surface-2 px-3 py-1 tabular-nums">{t('government.review.written', { n: num(exam.mix.written) })}</li>}
      </ul>
      <section>
        <SectionLabel>{t('government.review.sampleQuestions')}</SectionLabel>
        <ol className="mt-3 grid gap-3">
          {exam.sample.map((q, i) => (
            <li key={i} className="flex gap-3 rounded-xl border border-line p-3.5">
              <span className="font-display font-semibold text-ink-2 tabular-nums">{num(i + 1)}.</span>
              <span className="min-w-0">{L(q)}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}

// AI pre-check results for an item: { result: pass | flag, label, tag, detail? }
function useChecks(item) {
  const { t, L, money, num } = useI18n()
  const r = item.record
  const pass = (label, tag, detail) => ({ result: 'pass', label, tag, detail })
  const flag = (label, tag, detail) => ({ result: 'flag', label, tag, detail })
  const aiCheck = t('government.review.aiCheck')
  const aiScan = t('government.review.aiScan')

  if (item.kind === 'challenge') {
    const parts = r.deliverables?.en?.length || 1
    const risk = challengeFlags[r.id]?.safe
    return [
      pass(t('government.checks.scope'), aiCheck, t('government.checks.scopeDetail', { n: num(parts) })),
      // Fair means at least ৳1,000 per deliverable
      r.reward / parts >= 1000
        ? pass(t('government.checks.reward', { amount: money(r.reward) }), aiCheck)
        : flag(t('government.checks.reward', { amount: money(r.reward) }), t('government.review.flagged'), t('government.checks.rewardLow')),
      risk ? flag(t('government.checks.safe'), t('government.review.flagged'), L(risk)) : pass(t('government.checks.safe'), aiScan),
    ]
  }
  if (item.kind === 'book') {
    const custom = bookChecks[r.id]?.checks
    if (custom) return custom.map((c) => ({ result: c.result, label: L(c.label), tag: L(c.tag) }))
    return [pass(t('government.checks.syllabus'), aiCheck), pass(t('government.checks.copied'), aiScan), pass(t('government.checks.answerKey'), aiCheck)]
  }
  if (item.kind === 'exam') return r.checks.map((c) => ({ result: c.result, label: L(c.label), tag: L(c.tag) }))
  return [pass(t('government.checks.noteSubject'), aiCheck), pass(t('government.checks.readable'), aiCheck), pass(t('government.checks.copied'), aiScan), pass(t('government.checks.personal'), aiScan)]
}

function Checklist({ checks }) {
  const { t, num } = useI18n()
  const passed = checks.filter((c) => c.result === 'pass').length
  const flagged = checks.length - passed
  return (
    <Panel title={t('government.review.checklist')}>
      <p className="px-5 pt-4 text-sm text-ink-2">
        {t('government.review.checkSummary', { passed: num(passed), total: num(checks.length) })}
        {flagged > 0 && <span className="font-semibold text-warn"> · {t('government.review.flagCount', { n: num(flagged) })}</span>}
      </p>
      <ul className="grid gap-1 p-3">
        {checks.map((c) => (
          <li key={c.label} className={`flex gap-3 rounded-xl px-2.5 py-2.5 ${c.result === 'flag' ? 'bg-warn-soft' : ''}`}>
            {c.result === 'pass' ? <CircleCheck className="mt-0.5 size-5 shrink-0 text-ok" /> : <TriangleAlert className="mt-0.5 size-5 shrink-0 text-warn" />}
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold">{c.label}</span>
              {c.detail && <span className="mt-0.5 block text-sm text-ink-2">{c.detail}</span>}
            </span>
            <span
              className={`h-fit shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap ${
                c.result === 'pass' ? 'bg-ok-soft text-ok' : 'bg-surface text-warn'
              }`}
            >
              {c.tag}
            </span>
          </li>
        ))}
      </ul>
      <p className="border-t border-line px-5 py-3 text-xs text-ink-2">{t('government.review.aiNote')}</p>
    </Panel>
  )
}

function Decision({ item, queue }) {
  const { t, L, num } = useI18n()
  const { dispatch, portalState } = useDemo()
  const toast = useToast()
  const navigate = useNavigate()
  const countReview = useCountReview()
  const waitLabel = useWaitLabel()
  const [note, setNote] = useState('')
  const [noteError, setNoteError] = useState(false)
  const noteRef = useRef(null)
  const checks = useChecks(item)

  const index = queue.findIndex((i) => i.kind === item.kind && i.id === item.id)
  const prev = queue[index - 1]
  const next = queue[index + 1]
  const link = (i) => `/government/review/${i.kind}/${i.id}`
  const recipient = RECIPIENT[item.kind]
  const title = L(item.title)

  function setContentDecision(status) {
    const current = portalState?.['government.content'] ?? {}
    dispatch({ type: 'setPortalState', key: 'government.content', value: { ...current, [item.id]: { status, note: note.trim() } } })
  }

  function finish(message) {
    countReview()
    toast(message)
    navigate(next ? link(next) : '/government', { replace: true })
  }

  function approve() {
    if (item.kind === 'challenge') dispatch({ type: 'approve', id: item.id })
    if (item.kind === 'book') dispatch({ type: 'reviewBook', bookId: item.id, status: 'live' })
    if (item.kind === 'note') dispatch({ type: 'reviewNote', noteId: item.id, status: 'reviewed' })
    if (item.kind === 'exam') setContentDecision('approved')
    finish(t(`government.review.approved.${item.kind}`, { title }))
  }

  function sendBack() {
    const text = note.trim()
    if (!text) {
      setNoteError(true)
      noteRef.current?.focus()
      return
    }
    if (item.kind === 'challenge') dispatch({ type: 'returnChallenge', id: item.id, note: text })
    if (item.kind === 'book') dispatch({ type: 'reviewBook', bookId: item.id, status: 'fix', note: text })
    if (item.kind === 'note') dispatch({ type: 'reviewNote', noteId: item.id, status: 'rejected', note: text })
    if (item.kind === 'exam') setContentDecision('returned')
    finish(t('government.review.returned', { name: item.by }))
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to={item.tab === 'notes' ? '/government?tab=notes' : '/government'} className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 hover:text-ink">
          <ArrowLeft className="size-4" /> {t('government.review.back')}
        </Link>
        <nav aria-label={t('government.review.queueNav')} className="flex items-center gap-1">
          {prev ? (
            <Link to={link(prev)} className="grid size-9 place-items-center rounded-full border border-line hover:bg-surface-2" aria-label={t('government.review.prev')}>
              <ChevronLeft className="size-4" />
            </Link>
          ) : (
            <span className="grid size-9 place-items-center rounded-full border border-line text-ink-2/40" aria-hidden="true">
              <ChevronLeft className="size-4" />
            </span>
          )}
          <span className="px-2 text-sm font-semibold tabular-nums">{t('government.review.counter', { n: num(index + 1), total: num(queue.length) })}</span>
          {next ? (
            <Link to={link(next)} className="grid size-9 place-items-center rounded-full border border-line hover:bg-surface-2" aria-label={t('government.review.next')}>
              <ChevronRight className="size-4" />
            </Link>
          ) : (
            <span className="grid size-9 place-items-center rounded-full border border-line text-ink-2/40" aria-hidden="true">
              <ChevronRight className="size-4" />
            </span>
          )}
        </nav>
      </div>

      <header className="mt-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-surface-2 px-2.5 py-1 text-xs font-semibold">{t(`government.kinds.${item.kind}`)}</span>
          {item.priority && <PriorityPill />}
          <span className={`inline-flex items-center gap-1.5 text-sm ${item.priority ? 'font-semibold text-bad' : 'text-ink-2'}`}>
            <Clock3 className="size-4" /> {t('government.review.waiting', { wait: waitLabel(item.hours) })}
          </span>
        </div>
        <h2 className="mt-3 font-display text-3xl leading-tight font-semibold">{title}</h2>
        <p className="mt-1 text-ink-2">
          {t(`government.sources.${item.source}`)} · {item.by} · {t(`government.sizes.${item.size.key}`, { n: num(item.size.n) })}
        </p>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Panel title={t('government.review.preview')} className="self-start">
          {item.kind === 'challenge' && <ChallengePreview challenge={item.record} />}
          {item.kind === 'book' && <BookPreview book={item.record} />}
          {item.kind === 'note' && <NotePreview note={item.record} />}
          {item.kind === 'exam' && <ExamPreview exam={item.record} />}
        </Panel>

        <div className="grid content-start gap-4">
          <Checklist checks={checks} />

          <Panel title={t('government.review.decision')}>
            <div className="grid gap-3 p-5">
              <label htmlFor="review-note" className="text-sm font-semibold">
                {t(`government.review.noteLabel.${recipient}`)}
              </label>
              <textarea
                id="review-note"
                ref={noteRef}
                rows={4}
                value={note}
                onChange={(event) => {
                  setNote(event.target.value)
                  if (event.target.value.trim()) setNoteError(false)
                }}
                placeholder={t(`government.review.notePlaceholder.${recipient}`)}
                aria-invalid={noteError}
                aria-describedby="review-note-help"
                className={`${inputStyles} ${noteError ? 'border-bad' : ''}`}
              />
              <p id="review-note-help" className={`text-xs ${noteError ? 'font-semibold text-bad' : 'text-ink-2'}`}>
                {noteError ? t('government.review.noteRequired') : t('government.review.noteHelp')}
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                <button type="button" onClick={approve} className={buttonStyles.accent}>
                  <ShieldCheck className="size-4" /> {t('government.review.approve')}
                </button>
                <button type="button" onClick={sendBack} className={buttonStyles.ghost}>
                  <Undo2 className="size-4" /> {t('government.review.sendBack')}
                </button>
              </div>
              <p className="text-xs text-ink-2">{t(`government.review.approveHint.${item.kind}`)}</p>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}

export default function ReviewDecision() {
  const { kind, id } = useParams()
  const queue = useReviewQueue()
  const item = queue.find((i) => i.kind === kind && i.id === id)
  if (!item) return <Navigate to="/government" replace />
  // Keyed so the note field starts empty for each item
  return <Decision key={`${kind}-${id}`} item={item} queue={queue} />
}

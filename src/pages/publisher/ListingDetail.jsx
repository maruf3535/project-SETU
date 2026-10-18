import { ArrowLeft, BookOpenText, Check, CircleAlert, CircleCheck, Clock3, FileUp, Send, Star, Undo2 } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { bookPdf } from '../../components/pdf/pdfSources'
import { useReader } from '../../components/pdf/useReader'
import { useToast } from '../../components/Toast'
import { buttonStyles, Panel } from '../../components/ui'
import { SAMPLE_PAGES } from '../../data/demo/books'
import { useI18n } from '../../i18n/I18nProvider'
import { useDemo } from '../../store/DemoStore'
import { BookCover, BookStatusPill, useReviewTrail } from './shared'

const eventIcons = {
  submitted: { icon: Send, tone: 'bg-surface-2 text-ink' },
  resubmitted: { icon: FileUp, tone: 'bg-surface-2 text-ink' },
  returned: { icon: Undo2, tone: 'bg-bad-soft text-bad' },
  approved: { icon: Check, tone: 'bg-ok-soft text-ok' },
}

// A drawn page: running head, a few text lines, page number. Opens the PDF reader at that page.
function SamplePage({ n, total, onOpen }) {
  const { t, num } = useI18n()
  return (
    <li className="w-24 shrink-0">
      <button type="button" onClick={onOpen} aria-label={t('pdf.openPage', { n: num(n) })} className="group block w-full">
        <div className="flex aspect-[3/4] flex-col gap-1.5 rounded-md border border-line bg-surface p-2.5 shadow-sm transition-colors group-hover:border-primary">
          <span className="h-1.5 w-1/2 rounded-full bg-primary/40" />
          {[90, 100, 80, 95, 70, 100, 60].map((w, i) => (
            <span key={i} className="h-1 rounded-full bg-line" style={{ width: `${w}%` }} />
          ))}
          <span className="mt-auto self-center text-[0.6rem] text-ink-2 tabular-nums">{num(n)}</span>
        </div>
        <p className="mt-1.5 text-center text-xs text-ink-2 group-hover:text-primary">{t('publisher.detail.pageN', { n: num(n), total: num(total) })}</p>
      </button>
    </li>
  )
}

export default function ListingDetail() {
  const { id } = useParams()
  const { t, L, money, num, date } = useI18n()
  const { books, portalState, dispatch } = useDemo()
  const toast = useToast()
  const [openReader, reader] = useReader()
  const book = books.find((b) => b.id === id && b.publisherId === 'brightpage')
  const trail = useReviewTrail(book ?? { id })
  if (!book) return <Navigate to="/publisher/listings" replace />

  const samples = book.samplePages ?? SAMPLE_PAGES
  const lastReturned = trail.map((e) => e.kind).lastIndexOf('returned')
  const pdf = bookPdf(book.id)

  function readAt(page) {
    openReader({
      src: pdf.file,
      title: L(book.title),
      initialPage: Math.min(page, pdf.pages),
      pageLabels: pdf.pageLabels,
      note: pdf.placeholder ? t('pdf.placeholderNote') : t('pdf.sampleNote', { n: num(pdf.pages) }),
    })
  }

  function uploadCorrected() {
    const events = portalState?.['publisher.events'] ?? []
    dispatch({ type: 'reviewBook', bookId: book.id, status: 'review' })
    dispatch({ type: 'setPortalState', key: 'publisher.events', value: [...events, { bookId: book.id, kind: 'resubmitted', at: new Date().toISOString(), answers: book.reviewNote }] })
    toast(t('publisher.detail.resubmitted'))
  }

  const facts = [
    [t('publisher.price'), money(book.price)],
    [t('publisher.pages'), num(book.pages)],
    [t('publisher.syllabus'), num(book.syllabus).replace(/,/g, '')],
    [t('publisher.sold'), num(book.sold)],
    [t('publisher.readers'), num(book.readers)],
    [t('publisher.rating'), book.rating ? num(book.rating) : '–'],
  ]

  return (
    <div className="mx-auto max-w-6xl">
      <Link to="/publisher/listings" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 hover:text-ink">
        <ArrowLeft className="size-4" /> {t('publisher.detail.back')}
      </Link>

      <header className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-start">
        <BookCover book={book} className="w-28 text-xl sm:w-36 sm:text-2xl" />
        <div className="min-w-0 flex-1">
          <BookStatusPill status={book.status} />
          <h2 className="mt-3 font-display text-3xl leading-tight font-semibold">{L(book.title)}</h2>
          <p className="mt-1 text-ink-2">
            {L(book.cls)} · {book.publisher}
          </p>
          <dl className="mt-4 grid grid-cols-3 gap-x-4 gap-y-3 sm:grid-cols-6">
            {facts.map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs text-ink-2">{label}</dt>
                <dd className="mt-0.5 inline-flex items-center gap-1 font-semibold tabular-nums">
                  {label === t('publisher.rating') && book.rating > 0 && <Star className="size-3.5 fill-accent text-accent" />}
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="grid min-w-0 content-start gap-6">
          <section>
            <h3 className="text-xs font-semibold tracking-[0.12em] text-ink-2 uppercase">{t('publisher.detail.contents')}</h3>
            <p className="mt-2 text-lg leading-relaxed">{L(book.about)}</p>
            {book.inside?.length > 0 && (
              <ul className="mt-3 grid gap-2">
                {book.inside.map((item) => (
                  <li key={L(item)} className="flex gap-2.5">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" /> {L(item)}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="min-w-0">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h3 className="text-xs font-semibold tracking-[0.12em] text-ink-2 uppercase">{t('publisher.detail.samples', { n: num(samples) })}</h3>
                <p className="mt-1 text-sm text-ink-2">{t('publisher.detail.samplesNote')}</p>
              </div>
              <button type="button" onClick={() => readAt(1)} className={buttonStyles.ghost}>
                <BookOpenText className="size-4" /> {t('pdf.openPdf')}
              </button>
            </div>
            <ol className="mt-3 flex gap-3 overflow-x-auto pb-2" aria-label={t('publisher.detail.samples', { n: num(samples) })}>
              {Array.from({ length: samples }, (_, i) => (
                <SamplePage key={i} n={i + 1} total={samples} onOpen={() => readAt(i + 1)} />
              ))}
            </ol>
          </section>
        </div>

        <div className="grid content-start gap-6">
          <Panel title={t('publisher.detail.reviewTitle')}>
            <div className="p-5">
              {book.status === 'fix' && (
                <>
                  <p className="flex items-start gap-2 font-semibold">
                    <CircleAlert className="mt-0.5 size-5 shrink-0 text-bad" /> {t('publisher.detail.fixHead')}
                  </p>
                  {book.reviewNote && (
                    <blockquote className="mt-3 rounded-xl bg-bad-soft px-3.5 py-2.5 text-sm">
                      <span className="block text-xs font-semibold text-bad">{t('publisher.reviewerNote')}</span>
                      {L(book.reviewNote)}
                    </blockquote>
                  )}
                  <button type="button" onClick={uploadCorrected} className={`${buttonStyles.accent} mt-4 w-full`}>
                    <FileUp className="size-4" /> {t('publisher.detail.uploadCorrected')}
                  </button>
                </>
              )}
              {book.status === 'review' && (
                <p className="flex items-start gap-2 text-sm">
                  <Clock3 className="mt-0.5 size-5 shrink-0 text-warn" /> {t('publisher.detail.reviewHead')}
                </p>
              )}
              {book.status === 'live' && (
                <p className="flex items-start gap-2 text-sm">
                  <CircleCheck className="mt-0.5 size-5 shrink-0 text-ok" /> {t('publisher.detail.liveHead')}
                </p>
              )}
            </div>
            <h4 className="border-t border-line px-5 pt-4 text-xs font-semibold tracking-[0.12em] text-ink-2 uppercase">{t('publisher.detail.history')}</h4>
            <ol className="grid gap-4 p-5">
              {trail.map((event, index) => {
                const { icon: Icon, tone } = eventIcons[event.kind]
                // A returned step shows its own note, else the note the next upload answered, else the current note
                const note = event.note ?? trail[index + 1]?.answers ?? (index === lastReturned ? book.reviewNote : null)
                return (
                  <li key={index} className="flex gap-3">
                    <span className={`grid size-8 shrink-0 place-items-center rounded-full ${tone}`}>
                      <Icon className="size-4" />
                    </span>
                    <div className="min-w-0 text-sm">
                      <p className="font-semibold">{t(`publisher.events.${event.kind}`)}</p>
                      <p className="text-xs text-ink-2">{event.at ? date(event.at) : t('publisher.detail.justNow')}</p>
                      {note && <p className="mt-1 text-ink-2">“{L(note)}”</p>}
                    </div>
                  </li>
                )
              })}
            </ol>
          </Panel>
        </div>
      </div>
      {reader}
    </div>
  )
}

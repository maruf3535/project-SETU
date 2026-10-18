import { ArrowLeft, BadgeCheck, BookOpen, BookOpenText, Check, Search, ShoppingBag, Star, Tag } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import { bookPdf } from '../../components/pdf/pdfSources'
import { useReader } from '../../components/pdf/useReader'
import { usePasscode } from '../../components/Passcode'
import { useToast } from '../../components/Toast'
import { buttonStyles, Dialog, inputStyles, PageIntro } from '../../components/ui'
import { POINTS_DISCOUNT } from '../../data/demo/books'
import { useI18n } from '../../i18n/I18nProvider'
import { useCurrentStudent, useDemo } from '../../store/DemoStore'

const coverStyles = {
  teal: 'bg-primary text-primary-ink',
  amber: 'bg-accent text-accent-ink',
  mist: 'bg-surface-2 text-ink',
}

export function BookCover({ book, className = '' }) {
  const { L } = useI18n()
  return (
    <div className={`flex aspect-[3/4] flex-col justify-end rounded-xl p-3 ${coverStyles[book.cover]} ${className}`} aria-hidden="true">
      <span className="text-[10px] font-semibold tracking-wide uppercase opacity-70">{L(book.cls)}</span>
      <span className="font-display text-lg leading-tight font-semibold">{L(book.title)}</span>
    </div>
  )
}

// Bought books and free copies from teachers both count as the student's own
function useOwned() {
  const { purchases, freeCopies = [] } = useDemo()
  const { student } = useCurrentStudent()
  return (bookId) => purchases.includes(`${student.id}:${bookId}`) || freeCopies.some((f) => f.studentId === student.id && f.bookId === bookId)
}

// Opens a book in the PDF reader. An owned copy resumes at, and remembers, the last page read.
function useBookReader() {
  const { t, L, num } = useI18n()
  const { reading = {}, dispatch } = useDemo()
  const { student } = useCurrentStudent()
  const [openReader, reader] = useReader()

  function read(book, { page, full = false } = {}) {
    const pdf = bookPdf(book.id)
    const key = `${student.id}:${book.id}`
    const start = page ?? (full ? (reading[key]?.page ?? 1) : 1)
    openReader({
      src: pdf.file,
      title: L(book.title),
      initialPage: Math.min(start, pdf.pages),
      pageLabels: pdf.pageLabels,
      note: full ? t('pdf.fullNote', { n: num(pdf.pages) }) : t('pdf.sampleNote', { n: num(pdf.pages) }),
      onPageChange: full ? (p, total) => dispatch({ type: 'readPage', key, page: p, pages: total }) : undefined,
    })
  }
  return [read, reader]
}

// "2 days ago" in the current language
function useRelativeTime() {
  const { lang } = useI18n()
  const format = new Intl.RelativeTimeFormat(lang === 'bn' ? 'bn-BD' : 'en', { numeric: 'auto' })
  return (iso) => {
    const minutes = Math.round((new Date(iso).getTime() - Date.now()) / 60000)
    if (Math.abs(minutes) < 60) return format.format(minutes, 'minute')
    const hours = Math.round(minutes / 60)
    if (Math.abs(hours) < 24) return format.format(hours, 'hour')
    return format.format(Math.round(hours / 24), 'day')
  }
}

function Library() {
  const { t, L, num, money, date } = useI18n()
  const { books, purchases, purchaseLog = [], freeCopies = [], reading = {} } = useDemo()
  const { student } = useCurrentStudent()
  const [read, reader] = useBookReader()
  const ago = useRelativeTime()
  const byId = Object.fromEntries(books.map((b) => [b.id, b]))

  // Purchases (latest detail per book; older purchases may have no detail), then free copies
  const bought = purchases
    .filter((p) => p.startsWith(`${student.id}:`))
    .map((p) => p.split(':')[1])
    .map((bookId) => ({ bookId, source: 'bought', log: [...purchaseLog].reverse().find((l) => l.studentId === student.id && l.bookId === bookId) }))
  const free = freeCopies
    .filter((f) => f.studentId === student.id && !bought.some((b) => b.bookId === f.bookId))
    .map((f) => ({ bookId: f.bookId, source: 'free', from: f.from, at: f.at }))
  const items = [...bought, ...free].filter((item) => byId[item.bookId])

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-surface px-6 py-12 text-center">
        <BookOpen className="mx-auto size-8 text-primary" />
        <p className="mt-3 text-ink-2">{t('student.library.empty')}</p>
        <Link to="/student/store" className={`${buttonStyles.primary} mt-5`}>
          {t('student.library.browse')}
        </Link>
      </div>
    )
  }

  return (
    <>
      <ul className="grid gap-4 md:grid-cols-2">
        {items.map((item) => {
          const book = byId[item.bookId]
          const progress = reading[`${student.id}:${book.id}`]
          const origin =
            item.source === 'free'
              ? t('student.library.free', { from: item.from })
              : item.log
                ? item.log.pointsUsed
                  ? t('student.library.boughtPoints', { date: date(item.log.at), amount: money(item.log.paid), points: num(item.log.pointsUsed) })
                  : t('student.library.bought', { date: date(item.log.at), amount: money(item.log.paid) })
                : t('student.library.boughtEarlier')
          return (
            <li key={book.id} className="flex gap-4 rounded-2xl border border-line bg-surface p-4">
              <Link to={`/student/store/${book.id}`} className="w-24 shrink-0">
                <BookCover book={book} className="!p-2 [&>span:last-child]:text-sm" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className={`self-start rounded-full px-2.5 py-0.5 text-xs font-semibold ${item.source === 'free' ? 'bg-accent-soft text-warn' : 'bg-ok-soft text-ok'}`}>
                  {item.source === 'free' ? t('student.library.freeTag') : t('student.library.boughtTag')}
                </span>
                <p className="mt-2 font-semibold">{L(book.title)}</p>
                <p className="text-xs text-ink-2">
                  {L(book.cls)} · {book.publisher}
                </p>
                <p className="mt-1 text-xs text-ink-2">{origin}</p>

                <div className="mt-3">
                  <div className="h-1.5 rounded-full bg-surface-2">
                    <div className="h-full rounded-full bg-primary" style={{ width: progress ? `${(progress.page / progress.pages) * 100}%` : '0%' }} />
                  </div>
                  <p className="mt-1 text-xs text-ink-2 tabular-nums">
                    {progress
                      ? `${t('student.library.progress', { page: num(progress.page), total: num(progress.pages) })} · ${t('student.library.lastRead', { when: ago(progress.at) })}`
                      : t('student.library.notStarted')}
                  </p>
                </div>

                <button type="button" onClick={() => read(book, { full: true })} className={`${buttonStyles.accent} mt-3 self-start py-2`}>
                  <BookOpenText className="size-4" /> {progress ? t('student.library.continue') : t('student.library.read')}
                </button>
              </div>
            </li>
          )
        })}
      </ul>
      {reader}
    </>
  )
}

export default function Store() {
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') === 'library' ? 'library' : 'store'
  const { t, num } = useI18n()
  const { purchases, freeCopies = [] } = useDemo()
  const { student } = useCurrentStudent()
  const libraryCount = new Set([
    ...purchases.filter((p) => p.startsWith(`${student.id}:`)).map((p) => p.split(':')[1]),
    ...freeCopies.filter((f) => f.studentId === student.id).map((f) => f.bookId),
  ]).size

  return (
    <div className="mx-auto max-w-6xl">
      <PageIntro title={t('nav.store')} body={t('student.store.body')} />
      <div role="tablist" aria-label={t('nav.store')} className="mb-5 inline-flex rounded-xl border border-line bg-surface p-1">
        {['store', 'library'].map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            onClick={() => setParams(key === 'library' ? { tab: 'library' } : {}, { replace: true })}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-1.5 text-sm font-semibold ${tab === key ? 'bg-brand text-brand-ink' : 'text-ink-2 hover:text-ink'}`}
          >
            {key === 'library' ? <BookOpen className="size-4" /> : <ShoppingBag className="size-4" />}
            {t(`student.library.tabs.${key}`)}
            {key === 'library' && libraryCount > 0 && (
              <span className={`rounded-full px-1.5 text-xs tabular-nums ${tab === key ? 'bg-brand-ink/15' : 'bg-surface-2'}`}>{num(libraryCount)}</span>
            )}
          </button>
        ))}
      </div>
      {tab === 'library' ? <Library /> : <StoreShelf />}
    </div>
  )
}

function StoreShelf() {
  const { t, L, money, num } = useI18n()
  const { books } = useDemo()
  const { level } = useCurrentStudent()
  const owned = useOwned()
  const [scope, setScope] = useState('level')
  const [query, setQuery] = useState('')

  const q = query.trim().toLowerCase()
  const shown = books.filter(
    (b) =>
      b.status === 'live' &&
      (scope === 'all' || b.level === (scope === 'admission' ? 'admission' : level)) &&
      (!q || [b.title.en, b.title.bn, b.publisher, b.cls.en].some((text) => text.toLowerCase().includes(q))),
  )

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <label htmlFor="store-search" className="relative min-w-0 flex-1 sm:max-w-sm">
          <span className="sr-only">{t('student.store.search')}</span>
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-2" />
          <input id="store-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('student.store.search')} className={`${inputStyles} pl-10`} />
        </label>
        <div className="inline-flex rounded-xl border border-line bg-surface p-1">
          {['level', 'admission', 'all'].map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={scope === key}
              onClick={() => setScope(key)}
              className={`rounded-lg px-3.5 py-1.5 text-sm font-semibold ${scope === key ? 'bg-brand text-brand-ink' : 'text-ink-2'}`}
            >
              {t(`student.store.scopes.${key}`)}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-5 flex items-center gap-2.5 rounded-2xl bg-accent-soft px-4 py-3 text-sm">
        <Tag className="size-4 shrink-0 text-warn" /> {t('student.store.deal', { points: num(POINTS_DISCOUNT.points), percent: num(POINTS_DISCOUNT.percent) })}
      </p>

      {shown.length ? (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {shown.map((book) => (
            <li key={book.id}>
              <Link to={`/student/store/${book.id}`} className="group block">
                <BookCover book={book} className="transition-transform group-hover:-translate-y-0.5" />
                <p className="mt-2.5 text-sm leading-snug font-semibold group-hover:text-primary">{L(book.title)}</p>
                <p className="truncate text-xs text-ink-2">{book.publisher}</p>
                <div className="mt-1 flex items-center justify-between text-sm">
                  <span className="font-semibold tabular-nums">{money(book.price)}</span>
                  <span className="inline-flex items-center gap-1 text-xs text-ink-2">
                    <Star className="size-3.5 fill-accent text-accent" /> {num(book.rating)}
                  </span>
                </div>
                {owned(book.id) && <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-ok"><Check className="size-3.5" /> {t('student.store.owned')}</span>}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-10 text-center text-ink-2">{t('student.store.empty')}</p>
      )}
    </div>
  )
}

export function BookDetail() {
  const { id } = useParams()
  const { t, L, money, num } = useI18n()
  const { books, dispatch } = useDemo()
  const { student, points } = useCurrentStudent()
  const owned = useOwned()
  const toast = useToast()
  const [buying, setBuying] = useState(false)
  const [readBook, reader] = useBookReader()
  const confirmPasscode = usePasscode()

  const book = books.find((b) => b.id === id && b.status === 'live')
  if (!book) return <Navigate to="/student/store" replace />

  const discounted = Math.round(book.price * (1 - POINTS_DISCOUNT.percent / 100))
  const canUsePoints = points >= POINTS_DISCOUNT.points
  const pdf = bookPdf(book.id)

  // Before purchase only the free sample is offered; after purchase the demo still ships the same sample pages.
  // The main Read button resumes where the student left off; a page tile opens that exact page.
  function read(page, full) {
    readBook(book, { page: page ?? undefined, full })
  }

  async function buy(usePoints) {
    const amount = money(usePoints ? discounted : book.price)
    if (!(await confirmPasscode(t('passcode.actions.buyBook', { amount, title: L(book.title) })))) return
    dispatch({
      type: 'buyBook',
      bookId: book.id,
      studentId: student.id,
      pointsUsed: usePoints ? POINTS_DISCOUNT.points : 0,
      paid: usePoints ? discounted : book.price,
    })
    setBuying(false)
    toast(t('student.store.boughtToast', { title: L(book.title) }))
  }

  return (
    <div className="mx-auto max-w-5xl">
      <Link to="/student/store" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 hover:text-ink">
        <ArrowLeft className="size-4" /> {t('student.store.back')}
      </Link>

      <div className="mt-5 grid gap-8 md:grid-cols-[14rem_minmax(0,1fr)]">
        <BookCover book={book} className="mx-auto w-44 md:w-full" />
        <div className="min-w-0">
          <span className="inline-flex items-center gap-1 rounded-full bg-ok-soft px-2.5 py-1 text-xs font-semibold text-ok">
            <BadgeCheck className="size-3.5" /> {t('student.store.verified')}
          </span>
          <h2 className="mt-3 font-display text-3xl font-semibold">{L(book.title)}</h2>
          <p className="mt-1 text-ink-2">
            {L(book.cls)} · {t('student.store.by', { publisher: book.publisher })}
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-sm">
            <Star className="size-4 fill-accent text-accent" /> <span className="font-semibold">{num(book.rating)}</span>
            <span className="text-ink-2">· {t('student.store.readers', { n: num(book.readers) })}</span>
          </p>

          <dl className="mt-5 grid grid-cols-3 divide-x divide-line rounded-2xl border border-line bg-surface text-center">
            <div className="flex flex-col-reverse p-3">
              <dt className="text-xs text-ink-2">{t('student.store.pagesLabel')}</dt>
              <dd className="font-display text-xl font-semibold tabular-nums">{num(book.pages)}</dd>
            </div>
            <div className="flex flex-col-reverse p-3">
              <dt className="text-xs text-ink-2">{t('student.store.syllabusLabel')}</dt>
              <dd className="font-display text-xl font-semibold tabular-nums">{num(book.syllabus).replace(/,/g, '')}</dd>
            </div>
            <div className="flex flex-col-reverse p-3">
              <dt className="text-xs text-ink-2">{t('student.store.soft')}</dt>
              <dd className="font-display text-xl font-semibold">PDF</dd>
            </div>
          </dl>

          <p className="mt-5 leading-relaxed">{L(book.about)}</p>
          <h3 className="mt-5 text-xs font-semibold tracking-[0.12em] text-ink-2 uppercase">{t('student.store.inside')}</h3>
          <ul className="mt-2 grid gap-1.5">
            {book.inside.map((item) => (
              <li key={L(item)} className="flex gap-2 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" /> {L(item)}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl bg-brand p-4 text-brand-ink">
            <div className="flex-1">
              <p className="text-xs text-brand-ink/60">{t('student.store.soft')}</p>
              <p className="font-display text-3xl font-semibold tabular-nums">{money(book.price)}</p>
            </div>
            {owned(book.id) ? (
              <>
                <Link to="/student/store?tab=library" className="inline-flex items-center gap-2 rounded-xl bg-ok-soft px-4 py-2.5 text-sm font-semibold text-ok hover:underline">
                  <BookOpen className="size-4" /> {t('student.store.owned')}
                </Link>
                <button type="button" onClick={() => read(1, true)} className={buttonStyles.accent}>
                  <BookOpenText className="size-4" /> {t('student.store.read')}
                </button>
              </>
            ) : (
              <>
                <button type="button" onClick={() => read(1, false)} className="inline-flex items-center gap-2 rounded-xl border border-brand-ink/25 px-4 py-2.5 text-sm font-semibold hover:bg-brand-ink/10">
                  <BookOpenText className="size-4" /> {t('pdf.readSample')}
                </button>
                <button type="button" onClick={() => setBuying(true)} className={buttonStyles.accent}>
                  {t('student.store.buy')}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <section className="mt-10">
        <h3 className="text-xs font-semibold tracking-[0.12em] text-ink-2 uppercase">{t('student.store.sample', { n: num(pdf.pages) })}</h3>
        {/* Drawn page tiles; each opens the sample PDF at that page */}
        <div className="-mx-1 mt-3 flex gap-3 overflow-x-auto px-1 pb-2">
          {Array.from({ length: pdf.pages }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => read(i + 1, owned(book.id))}
              aria-label={t('pdf.openPage', { n: num(i + 1) })}
              className="w-36 shrink-0 rounded-lg border border-line bg-surface p-3 text-left transition-colors hover:border-primary"
            >
              <div className="h-2 w-2/3 rounded-full bg-ink/20" />
              {Array.from({ length: 9 }, (__, l) => (
                <div key={l} className="mt-2 h-1.5 rounded-full bg-ink/10" style={{ width: `${60 + ((i * 7 + l * 13) % 40)}%` }} />
              ))}
              <p className="mt-3 text-right text-[10px] text-ink-2 tabular-nums">{pdf.pageLabels?.[i] ?? num(i + 1)}</p>
            </button>
          ))}
        </div>
      </section>
      {reader}

      <Dialog open={buying} title={t('student.store.buyTitle', { title: L(book.title) })} onClose={() => setBuying(false)}>
        <div className="grid gap-3">
          <button
            type="button"
            disabled={!canUsePoints}
            onClick={() => buy(true)}
            className="flex items-center justify-between gap-3 rounded-2xl border border-line p-4 text-left hover:border-primary disabled:opacity-50"
          >
            <span>
              <span className="block font-semibold">
                {t('student.store.payWithPoints', { points: num(POINTS_DISCOUNT.points), amount: money(discounted) })}
              </span>
              <span className="block text-sm text-ink-2">
                {canUsePoints ? `${num(points)} pts` : t('student.store.notEnough', { n: num(POINTS_DISCOUNT.points - points) })}
              </span>
            </span>
            <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-ink">−{num(POINTS_DISCOUNT.percent)}%</span>
          </button>
          <button type="button" onClick={() => buy(false)} className={`${buttonStyles.primary} py-3`}>
            {t('student.store.payFull', { amount: money(book.price) })}
          </button>
        </div>
      </Dialog>
    </div>
  )
}

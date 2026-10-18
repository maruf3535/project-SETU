import { Plus, Star } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { buttonStyles, PageIntro } from '../../components/ui'
import { useI18n } from '../../i18n/I18nProvider'
import { BOOK_STATUSES, BookCover, BookStatusPill, useMyBooks } from './shared'

export default function Listings() {
  const { t, L, money, num } = useI18n()
  const books = useMyBooks()
  const [filter, setFilter] = useState('all')
  const shown = filter === 'all' ? books : books.filter((b) => b.status === filter)

  return (
    <div className="mx-auto max-w-6xl">
      <PageIntro title={t('publisher.listings.title')} body={t('publisher.listings.body')}>
        <Link to="/publisher/new" className={buttonStyles.accent}>
          <Plus className="size-4" /> {t('publisher.overview.addCta')}
        </Link>
      </PageIntro>

      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label={t('publisher.listings.filter')}>
        {['all', ...BOOK_STATUSES].map((s) => {
          const count = s === 'all' ? books.length : books.filter((b) => b.status === s).length
          const active = filter === s
          return (
            <button
              key={s}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(s)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                active ? 'bg-ink text-canvas' : 'border border-line bg-surface text-ink-2 hover:text-ink'
              }`}
            >
              {s === 'all' ? t('publisher.listings.all') : t(`publisher.status.${s}`)} <span className="tabular-nums opacity-70">{num(count)}</span>
            </button>
          )
        })}
      </div>

      {shown.length ? (
        <ul className="grid gap-3">
          {shown.map((book) => (
            <li key={book.id}>
              <Link
                to={`/publisher/listings/${book.id}`}
                className="group grid grid-cols-[auto_minmax(0,1fr)] gap-4 rounded-2xl border border-line bg-surface p-4 transition-colors hover:bg-surface-2/50 md:grid-cols-[auto_minmax(0,1fr)_auto]"
              >
                <BookCover book={book} className="w-16 text-[0.95rem] sm:w-20" />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <BookStatusPill status={book.status} />
                    <span className="text-xs text-ink-2">{t('publisher.syllabusYear', { year: num(book.syllabus).replace(/,/g, '') })}</span>
                  </div>
                  <p className="mt-2 font-semibold group-hover:text-primary">{L(book.title)}</p>
                  <p className="mt-0.5 text-sm text-ink-2">
                    {L(book.cls)} · {t('publisher.pagesN', { n: num(book.pages) })}
                  </p>
                  {book.status === 'fix' && book.reviewNote && (
                    <p className="mt-2 line-clamp-2 text-sm text-bad">{L(book.reviewNote)}</p>
                  )}
                </div>
                <dl className="col-span-2 grid grid-cols-3 gap-3 border-t border-line pt-3 text-sm md:col-span-1 md:min-w-64 md:border-t-0 md:border-l md:pt-0 md:pl-5">
                  <div>
                    <dt className="text-xs text-ink-2">{t('publisher.price')}</dt>
                    <dd className="mt-0.5 font-semibold tabular-nums">{money(book.price)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-2">{t('publisher.sold')}</dt>
                    <dd className="mt-0.5 font-semibold tabular-nums">{num(book.sold)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-2">{t('publisher.rating')}</dt>
                    <dd className="mt-0.5 inline-flex items-center gap-1 font-semibold tabular-nums">
                      {book.rating ? (
                        <>
                          <Star className="size-3.5 fill-accent text-accent" /> {num(book.rating)}
                        </>
                      ) : (
                        <span className="font-normal text-ink-2">–</span>
                      )}
                    </dd>
                  </div>
                </dl>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed border-line px-5 py-10 text-center text-ink-2">{t('publisher.listings.empty')}</p>
      )}
    </div>
  )
}

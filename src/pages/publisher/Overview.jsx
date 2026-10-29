import { ArrowRight, BadgeCheck, CircleAlert, CircleCheck, Plus, ShieldAlert, TrendingDown, TrendingUp, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { buttonStyles, PageIntro, Panel, Stat } from '../../components/ui'
import { MY_PUBLISHER, monthlySales } from '../../data/demo/publisher'
import { useI18n } from '../../i18n/I18nProvider'
import { useDemo } from '../../store/DemoStore'
import { BookCover, BookStatusPill, useMyBooks } from './shared'
import { publisherRanking } from '../reviews/reviewData'

// Seeded months plus every store purchase of our books. All demo purchases count towards the latest month.
// A sale paid below list price was discounted with reward points; the gap is the points share.
function useSalesByMonth() {
  const { sales } = useDemo()
  const mine = useMyBooks()
  const byId = Object.fromEntries(mine.map((b) => [b.id, b]))
  const live = (sales ?? []).filter((s) => byId[s.bookId])
  const liveCash = live.reduce((sum, s) => sum + s.amount, 0)
  const livePoints = live.reduce((sum, s) => sum + Math.max(0, byId[s.bookId].price - s.amount), 0)
  return monthlySales.map((m, i) =>
    i === monthlySales.length - 1 ? { ...m, cash: m.cash + liveCash, points: m.points + livePoints, liveCount: live.length } : m,
  )
}

function SalesTooltip({ active, payload }) {
  const { money, date } = useI18n()
  if (!active || !payload?.length) return null
  const row = payload[0].payload
  return (
    <div className="rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink shadow-lg">
      <p className="text-xs text-ink-2">{date(row.month, { month: 'long', year: 'numeric' })}</p>
      <p className="font-semibold tabular-nums">{money(row.cash)}</p>
    </div>
  )
}

// Where this publisher stands in the reviewer-based ranking, and how to climb it
function RankCard() {
  const { t, num } = useI18n()
  const demo = useDemo()
  const ranking = publisherRanking(demo)
  const mine = ranking.find((r) => r.id === MY_PUBLISHER.id)
  if (!mine) return null
  const ahead = ranking[mine.rank - 2]
  return (
    <section className="mt-4 flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-surface p-5">
      <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-accent text-accent-ink">
        <Trophy className="size-7" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold tracking-[0.12em] text-ink-2 uppercase">{t('reviews.ranking.title')}</p>
        <p className="font-display text-2xl font-semibold">{t('reviews.pub.rank', { rank: num(mine.rank), total: num(ranking.length) })}</p>
        <p className="text-sm text-ink-2">
          {ahead ? t('reviews.pub.gap', { name: ahead.name, gap: num(Math.round((ahead.score - mine.score) * 100) / 100) }) : t('reviews.pub.top')}
        </p>
        {mine.warning && (
          <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-bad">
            <ShieldAlert className="size-4" /> {t('reviews.pub.warning')}
          </p>
        )}
      </div>
      <Link to="/publisher/reviewers" className={buttonStyles.primary}>
        {t('reviews.pub.improve')} <ArrowRight className="size-4" />
      </Link>
    </section>
  )
}

export default function PublisherOverview() {
  const { t, L, money, num, date } = useI18n()
  const books = useMyBooks()
  const months = useSalesByMonth()

  const current = months.at(-1)
  const previous = months.at(-2)
  const growth = Math.round((current.cash / previous.cash - 1) * 100)
  const chartData = months.map((m) => ({ ...m, label: date(m.month, { month: 'short' }) }))

  const copies = books.reduce((sum, b) => sum + b.sold, 0)
  const readers = books.reduce((sum, b) => sum + b.readers, 0)
  const rated = books.filter((b) => b.rating > 0)
  const avgRating = rated.length ? rated.reduce((sum, b) => sum + b.rating, 0) / rated.length : 0
  const gross = current.cash + current.points
  const cashShare = Math.round((current.cash / gross) * 100)

  const needsFix = books.filter((b) => b.status === 'fix')
  const counts = Object.fromEntries(['live', 'review', 'fix'].map((s) => [s, books.filter((b) => b.status === s).length]))

  return (
    <div className="mx-auto max-w-6xl">
      <PageIntro
        title={t('publisher.overview.title')}
        body={
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            {MY_PUBLISHER.name} · {t('publisher.pubIdLabel')} {MY_PUBLISHER.publicationId}
            <span className="inline-flex items-center gap-1 font-semibold text-ok">
              <BadgeCheck className="size-4" /> {t('publisher.verifiedId')}
            </span>
          </span>
        }
      >
        <Link to="/publisher/promote" className={buttonStyles.ghost}>
          {t('publisher.overview.promoteCta')}
        </Link>
        <Link to="/publisher/new" className={buttonStyles.accent}>
          <Plus className="size-4" /> {t('publisher.overview.addCta')}
        </Link>
      </PageIntro>

      <section className="grid gap-6 rounded-3xl bg-brand p-6 text-brand-ink md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] md:items-end">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-[0.12em] text-brand-ink/60 uppercase">{t('publisher.overview.salesMonth')}</p>
          <p className="mt-2 text-5xl font-semibold tracking-tight">{money(current.cash)}</p>
          <p className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 font-semibold text-accent-ink">
              {growth >= 0 ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
              {growth >= 0 ? '+' : '−'}
              {num(Math.abs(growth))}%
            </span>
            <span className="text-brand-ink/70">{t('publisher.overview.vsLast', { amount: money(previous.cash) })}</span>
          </p>
          {current.liveCount > 0 && (
            <p className="mt-2 text-xs text-brand-ink/60">{t('publisher.overview.liveSales', { n: num(current.liveCount) })}</p>
          )}
        </div>
        <figure className="min-w-0">
          <figcaption className="mb-1 text-xs text-brand-ink/60">{t('publisher.overview.chartCaption')}</figcaption>
          <div className="h-36" aria-hidden="true">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 4, right: 0, bottom: 0, left: 0 }} barCategoryGap="22%">
                <XAxis
                  dataKey="label"
                  axisLine={{ stroke: 'color-mix(in oklab, var(--brand-ink) 25%, transparent)' }}
                  tickLine={false}
                  tick={{ fill: 'var(--brand-ink)', fillOpacity: 0.65, fontSize: 12 }}
                />
                <Tooltip content={<SalesTooltip />} cursor={{ fill: 'color-mix(in oklab, var(--brand-ink) 8%, transparent)' }} />
                <Bar dataKey="cash" maxBarSize={24} radius={[4, 4, 0, 0]} isAnimationActive={false}>
                  {chartData.map((m, i) => (
                    // This month in the accent; earlier months recede
                    <Cell key={m.month} fill={i === chartData.length - 1 ? 'var(--accent)' : 'color-mix(in oklab, var(--brand-ink) 38%, transparent)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <table className="sr-only">
            <caption>{t('publisher.overview.chartCaption')}</caption>
            <tbody>
              {chartData.map((m) => (
                <tr key={m.month}>
                  <th scope="row">{date(m.month, { month: 'long', year: 'numeric' })}</th>
                  <td>{money(m.cash)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </figure>
      </section>

      <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <Stat label={t('publisher.overview.copies')} value={num(copies)} note={t('publisher.overview.copiesNote')} />
        <Stat label={t('publisher.overview.readers')} value={num(readers)} />
        <Stat
          label={t('publisher.overview.rating')}
          value={avgRating ? num(Math.round(avgRating * 10) / 10) : '–'}
          note={t('publisher.overview.ratingNote', { n: num(rated.length) })}
        />
        <div className="rounded-2xl border border-line bg-surface p-5 sm:col-span-3 lg:col-span-1">
          <p className="text-xs font-semibold tracking-[0.12em] text-ink-2 uppercase">{t('publisher.overview.split')}</p>
          <div className="mt-4 flex h-2.5 gap-0.5 overflow-hidden rounded-full" role="img" aria-label={t('publisher.overview.splitAria', { cash: num(cashShare), points: num(100 - cashShare) })}>
            <span className="h-full rounded-l-full bg-primary" style={{ width: `${cashShare}%` }} />
            <span className="h-full flex-1 rounded-r-full bg-accent" />
          </div>
          <dl className="mt-3 grid gap-1.5 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="flex items-center gap-2 text-ink-2">
                <span className="size-2.5 rounded-sm bg-primary" /> {t('publisher.overview.cash')}
              </dt>
              <dd className="font-semibold tabular-nums">{money(current.cash)}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="flex items-center gap-2 text-ink-2">
                <span className="size-2.5 rounded-sm bg-accent" /> {t('publisher.overview.points')}
              </dt>
              <dd className="font-semibold tabular-nums">{money(current.points)}</dd>
            </div>
          </dl>
          <p className="mt-2 text-xs text-ink-2">{t('publisher.overview.pointsNote')}</p>
        </div>
      </div>

      <RankCard />

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Panel
          title={t('publisher.overview.yourListings')}
          action={
            <Link to="/publisher/listings" className="text-sm font-semibold text-primary hover:underline">
              {t('common.viewAll')}
            </Link>
          }
        >
          <p className="flex flex-wrap gap-x-4 gap-y-1 border-b border-line px-5 py-3 text-sm text-ink-2">
            {['live', 'review', 'fix'].map((s) => (
              <span key={s}>
                {t(`publisher.status.${s}`)}: <strong className="text-ink tabular-nums">{num(counts[s])}</strong>
              </span>
            ))}
          </p>
          <ul className="divide-y divide-line">
            {books.map((book) => (
              <li key={book.id}>
                <Link to={`/publisher/listings/${book.id}`} className="group flex items-center gap-4 px-5 py-3.5 hover:bg-surface-2/60">
                  <BookCover book={book} className="w-11 text-[0.8rem]" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold group-hover:text-primary">{L(book.title)}</span>
                    <span className="block truncate text-sm text-ink-2">
                      {L(book.cls)} · {money(book.price)} · {t('publisher.soldN', { n: num(book.sold) })}
                    </span>
                  </span>
                  <BookStatusPill status={book.status} />
                </Link>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title={t('publisher.overview.attention')} className="self-start">
          {needsFix.length ? (
            <ul className="divide-y divide-line">
              {needsFix.map((book) => (
                <li key={book.id} className="px-5 py-4">
                  <p className="flex items-center gap-2 font-semibold">
                    <CircleAlert className="size-5 shrink-0 text-bad" />
                    <span className="min-w-0 truncate">{L(book.title)}</span>
                  </p>
                  {book.reviewNote && (
                    <blockquote className="mt-2 rounded-xl bg-bad-soft px-3.5 py-2.5 text-sm">
                      <span className="block text-xs font-semibold text-bad">{t('publisher.reviewerNote')}</span>
                      {L(book.reviewNote)}
                    </blockquote>
                  )}
                  <Link to={`/publisher/listings/${book.id}`} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                    {t('publisher.overview.fixCta')} <ArrowRight className="size-4" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="flex items-center gap-2 px-5 py-6 text-ink-2">
              <CircleCheck className="size-5 text-ok" /> {t('publisher.overview.allClear')}
            </p>
          )}
        </Panel>
      </div>
    </div>
  )
}

import { Megaphone, Users } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePasscode } from '../../components/Passcode'
import { useToast } from '../../components/Toast'
import { buttonStyles, inputStyles, PageIntro, Panel } from '../../components/ui'
import { audienceByClass, channels, classOptions, COST_PER_STUDENT, divisionShare } from '../../data/demo/publisher'
import { useI18n } from '../../i18n/I18nProvider'
import { useDemo } from '../../store/DemoStore'
import { BookCover, useMyBooks, usePromotions } from './shared'

const PERIODS = [7, 14, 30]
const DAY = 24 * 60 * 60 * 1000

// Estimated reach ≈ budget / ৳2 per student, capped by the number of verified students in the chosen class and division
function estimateReach(budget, cls, division) {
  const audience = Math.round(audienceByClass[cls] * (division === 'all' ? 1 : divisionShare[division]))
  return { reach: Math.min(Math.floor(budget / COST_PER_STUDENT), audience), audience }
}

// Best-guess default target for a book: its own class, else its store level
function defaultClass(book) {
  const match = classOptions.find((c) => c.label.en === book?.cls?.en)
  if (match) return match.id
  return { university: 'university', admission: 'admission', college: 'class11_12' }[book?.level] ?? 'class9_10'
}

function TargetLabel({ target }) {
  const { t, L } = useI18n()
  const option = classOptions.find((c) => c.id === target.cls)
  return (
    <>
      {L(option?.label)} · {target.division === 'all' ? t('publisher.promote.allDivisions') : t(`common.divisions.${target.division}`)}
    </>
  )
}

export default function Promote() {
  const { t, L, num, money, date } = useI18n()
  const { dispatch } = useDemo()
  const toast = useToast()
  const confirmPasscode = usePasscode()
  const books = useMyBooks()
  const promotions = usePromotions()
  const live = books.filter((b) => b.status === 'live')
  const byId = Object.fromEntries(books.map((b) => [b.id, b]))

  const [bookId, setBookId] = useState(live[0]?.id ?? '')
  const [cls, setCls] = useState(defaultClass(live[0]))
  const [division, setDivision] = useState('all')
  const [days, setDays] = useState(14)
  const [budget, setBudget] = useState(5000)
  const [now] = useState(() => Date.now())
  const { reach, audience } = estimateReach(budget, cls, division)

  function chooseBook(id) {
    setBookId(id)
    setCls(defaultClass(byId[id]))
  }

  async function submit(event) {
    event.preventDefault()
    if (!(await confirmPasscode(t('passcode.actions.promote', { amount: money(budget), title: L(byId[bookId].title) })))) return
    const promotion ={ id: `promo-${Date.now()}`, bookId, target: { cls, division }, days, budget, reach, startedAt: new Date().toISOString() }
    dispatch({ type: 'promoteBook', promotion })
    toast(t('publisher.promote.started', { title: L(byId[bookId].title), n: num(reach) }))
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageIntro title={t('publisher.promote.title')} body={t('publisher.promote.body')} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <Panel title={t('publisher.promote.newTitle')}>
          {live.length ? (
            <form onSubmit={submit} className="grid gap-5 p-5">
              <div className="grid gap-1.5">
                <label htmlFor="promo-book" className="text-sm font-semibold">
                  {t('publisher.promote.book')}
                </label>
                <select id="promo-book" value={bookId} onChange={(e) => chooseBook(e.target.value)} className={inputStyles}>
                  {live.map((b) => (
                    <option key={b.id} value={b.id}>
                      {L(b.title)}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-ink-2">{t('publisher.promote.liveOnly')}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <label htmlFor="promo-class" className="text-sm font-semibold">
                    {t('publisher.promote.cls')}
                  </label>
                  <select id="promo-class" value={cls} onChange={(e) => setCls(e.target.value)} className={inputStyles}>
                    {classOptions.map((c) => (
                      <option key={c.id} value={c.id}>
                        {L(c.label)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-1.5">
                  <label htmlFor="promo-division" className="text-sm font-semibold">
                    {t('publisher.promote.division')}
                  </label>
                  <select id="promo-division" value={division} onChange={(e) => setDivision(e.target.value)} className={inputStyles}>
                    <option value="all">{t('publisher.promote.allDivisions')}</option>
                    {Object.keys(divisionShare).map((d) => (
                      <option key={d} value={d}>
                        {t(`common.divisions.${d}`)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <span id="promo-days-label" className="text-sm font-semibold">
                  {t('publisher.promote.period')}
                </span>
                <div className="mt-1.5 grid grid-cols-3 gap-2" role="group" aria-labelledby="promo-days-label">
                  {PERIODS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      aria-pressed={days === d}
                      onClick={() => setDays(d)}
                      className={`rounded-xl px-3 py-2.5 text-sm font-semibold ${days === d ? 'bg-ink text-canvas' : 'border border-line hover:bg-surface-2'}`}
                    >
                      {t('publisher.promote.daysN', { n: num(d) })}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-1.5">
                <div className="flex items-baseline justify-between gap-3">
                  <label htmlFor="promo-budget" className="text-sm font-semibold">
                    {t('publisher.promote.budget')}
                  </label>
                  <span className="font-display text-xl font-semibold tabular-nums">{money(budget)}</span>
                </div>
                <input
                  id="promo-budget"
                  type="range"
                  min="1000"
                  max="30000"
                  step="500"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full accent-[var(--accent)]"
                />
                <div className="flex justify-between text-xs text-ink-2 tabular-nums">
                  <span>{money(1000)}</span>
                  <span>{money(30000)}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl bg-brand p-4 text-brand-ink">
                <Users className="size-8 shrink-0 text-accent" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold tracking-[0.12em] text-brand-ink/60 uppercase">{t('publisher.promote.reach')}</p>
                  <p className="text-3xl font-semibold tabular-nums" aria-live="polite">
                    {t('publisher.promote.reachN', { n: num(reach) })}
                  </p>
                  <p className="text-xs text-brand-ink/70">
                    {reach >= audience
                      ? t('publisher.promote.capped', { n: num(audience) })
                      : t('publisher.promote.formula', { cost: money(COST_PER_STUDENT), n: num(audience) })}
                  </p>
                </div>
              </div>

              <button type="submit" className={`${buttonStyles.accent} w-full py-3`}>
                <Megaphone className="size-4" /> {t('publisher.promote.submit', { amount: money(budget) })}
              </button>
            </form>
          ) : (
            <p className="px-5 py-6 text-ink-2">{t('publisher.promote.noLive')}</p>
          )}
        </Panel>

        <Panel title={t('publisher.promote.active')} className="self-start">
          {promotions.length ? (
            <ul className="divide-y divide-line">
              {promotions.map((p) => {
                const book = byId[p.bookId]
                if (!book) return null
                const elapsed = Math.min(p.days, Math.max(0, Math.floor((now - new Date(p.startedAt)) / DAY)))
                const ended = elapsed >= p.days
                return (
                  <li key={p.id} className="flex gap-3 px-5 py-4">
                    <Link to={`/publisher/listings/${book.id}`} className="shrink-0" aria-label={L(book.title)}>
                      <BookCover book={book} className="w-11 text-[0.8rem]" />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{L(book.title)}</p>
                      <p className="text-sm text-ink-2">
                        <TargetLabel target={p.target} />
                      </p>
                      <div className="mt-2 h-1.5 rounded-full bg-surface-2">
                        <span className="block h-full rounded-full bg-primary" style={{ width: `${(Math.max(elapsed, 0.3) / p.days) * 100}%` }} />
                      </div>
                      <p className="mt-1.5 flex flex-wrap justify-between gap-x-3 text-xs text-ink-2">
                        <span>
                          {ended ? t('publisher.promote.ended') : t('publisher.promote.dayOf', { n: num(elapsed + 1), total: num(p.days) })} ·{' '}
                          {t('publisher.promote.since', { date: date(p.startedAt, { day: 'numeric', month: 'short' }) })}
                        </span>
                        <span className="tabular-nums">
                          {money(p.budget)} · {t('publisher.promote.reachN', { n: num(p.reach) })}
                        </span>
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="px-5 py-6 text-ink-2">{t('publisher.promote.noneActive')}</p>
          )}
        </Panel>
      </div>

      <Panel title={t('publisher.promote.channelsTitle')} className="mt-6">
        <p className="px-5 pt-4 text-sm text-ink-2">{t('publisher.promote.channelsBody')}</p>
        <div className="p-5">
          <div className="hidden grid-cols-4 gap-4 border-b border-line pb-2 text-xs font-semibold tracking-[0.12em] text-ink-2 uppercase md:grid">
            <span>{t('publisher.promote.cols.channel')}</span>
            <span>{t('publisher.promote.cols.audience')}</span>
            <span>{t('publisher.promote.cols.pricing')}</span>
            <span>{t('publisher.promote.cols.review')}</span>
          </div>
          <ul className="divide-y divide-line">
            {channels.map((c) => (
              <li key={c.id} className={`grid gap-1 py-3.5 md:grid-cols-4 md:gap-4 ${c.mine ? '-mx-3 rounded-xl bg-accent-soft px-3' : ''}`}>
                <p className="font-semibold">
                  {L(c.name)}
                  {c.mine && <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-xs text-accent-ink">{t('publisher.promote.yours')}</span>}
                </p>
                {['audience', 'pricing', 'review'].map((key) => (
                  <p key={key} className="text-sm">
                    <span className="text-ink-2 md:hidden">{t(`publisher.promote.cols.${key}`)}: </span>
                    {L(c[key])}
                  </p>
                ))}
              </li>
            ))}
          </ul>
        </div>
      </Panel>
    </div>
  )
}

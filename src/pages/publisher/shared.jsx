import { useI18n } from '../../i18n/I18nProvider'
import { MY_PUBLISHER, reviewHistory, seedPromotions } from '../../data/demo/publisher'
import { useDemo } from '../../store/DemoStore'

export const BOOK_STATUSES = ['live', 'review', 'fix']

const statusStyles = {
  live: 'bg-ok-soft text-ok',
  review: 'bg-warn-soft text-warn',
  fix: 'bg-bad-soft text-bad',
}

export function BookStatusPill({ status }) {
  const { t } = useI18n()
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${statusStyles[status]}`}>
      <span className="size-1.5 rounded-full bg-current" />
      {t(`publisher.status.${status}`)}
    </span>
  )
}

const coverStyles = {
  teal: 'bg-primary text-primary-ink',
  amber: 'bg-accent text-accent-ink',
  mist: 'bg-surface-2 text-ink',
}

// Generated cover: a coloured block with the title set in the display face
export function BookCover({ book, className = 'w-16' }) {
  const { L } = useI18n()
  return (
    <div
      aria-hidden="true"
      className={`relative flex aspect-[3/4] shrink-0 flex-col justify-between overflow-hidden rounded-md p-2 shadow-sm ring-1 ring-black/5 ${coverStyles[book.cover] ?? coverStyles.mist} ${className}`}
    >
      <span className="absolute inset-y-0 left-0 w-1 bg-black/10" />
      <span className="line-clamp-4 font-display text-[0.7em] leading-tight font-semibold">{L(book.title)}</span>
      <span className="text-[0.5em] font-semibold tracking-wider uppercase opacity-70">Brightpage</span>
    </div>
  )
}

export function useMyBooks() {
  const { books } = useDemo()
  return books.filter((b) => b.publisherId === MY_PUBLISHER.id)
}

// Promotions started in this demo session first, then the seeded one
export function usePromotions() {
  const { promotions } = useDemo()
  return [...(promotions ?? []), ...seedPromotions]
}

// Review trail: seeded events, events this portal recorded, then the latest government decision if not yet in the trail
export function useReviewTrail(book) {
  const { portalState } = useDemo()
  const local = (portalState?.['publisher.events'] ?? []).filter((e) => e.bookId === book.id)
  const trail = [...(reviewHistory[book.id] ?? []), ...(book.submittedAt ? [{ kind: 'submitted', at: book.submittedAt }] : []), ...local]
  const last = trail.at(-1)?.kind
  if (book.status === 'live' && last !== 'approved') trail.push({ kind: 'approved' })
  if (book.status === 'fix' && last !== 'returned') trail.push({ kind: 'returned' })
  return trail
}

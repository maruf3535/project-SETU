import { profiles } from '../../data/demo/profiles'
import {
  CONFIDENCE,
  INTEGRITY_PENALTY,
  QUALIFY_SCORE,
  READ_TO_UNLOCK,
  REVIEW_POINTS,
  REVIEWER_LEVELS,
  reviewerPool,
} from '../../data/demo/reviews'
import { teacherLevels } from '../../data/demo/teacher'
import { bookPdf } from '../../components/pdf/pdfSources'

// Subject names for the book subjects reviewers qualify in
export const SUBJECT_NAMES = {
  physics: { en: 'Physics', bn: 'পদার্থবিজ্ঞান' },
  math: { en: 'Mathematics', bn: 'গণিত' },
  chemistry: { en: 'Chemistry', bn: 'রসায়ন' },
  biology: { en: 'Biology', bn: 'জীববিজ্ঞান' },
  bangla: { en: 'Bangla', bn: 'বাংলা' },
  ict: { en: 'ICT', bn: 'আইসিটি' },
  algorithms: { en: 'Algorithms', bn: 'অ্যালগরিদম' },
  all: { en: 'All subjects', bn: 'সব বিষয়' },
}

const poolById = Object.fromEntries(reviewerPool.map((r) => [r.id, r]))

// Display facts for a reviewer: pool entry + the live student record or teacher profile
export function reviewerInfo(demo, id) {
  const entry = poolById[id]
  if (!entry) return null
  if (entry.role === 'student') {
    const st = demo.studentById[id]
    if (!st) return { ...entry, subjects: Object.keys(entry.scores) }
    return {
      ...entry,
      name: st.name,
      initials: st.initials,
      division: st.division,
      org: { en: `${st.dept.en} · ${st.university}`, bn: `${st.dept.bn} · ${st.university}` },
      skills: st.skills,
      subjects: Object.keys(entry.scores),
      hasProfile: true,
    }
  }
  const persona = Object.values(teacherLevels).find((p) => p.id === id)
  const name = demo.profiles?.[id]?.fields?.name ?? profiles[id]?.fields?.name ?? entry.name
  return { ...entry, name, subjects: entry.teaches, hasProfile: Boolean(persona) }
}

export function allReviewers(demo) {
  return reviewerPool.map((r) => reviewerInfo(demo, r.id))
}

// Why a reviewer may review this book, or null. kind: teacher | score | notes
export function qualification(entry, book) {
  if (!entry || !book) return null
  const subject = book.subject
  if (entry.role === 'teacher') {
    return subject === 'all' || entry.teaches.includes(subject) ? { kind: 'teacher', subject: subject === 'all' ? entry.teaches[0] : subject } : null
  }
  const scores = entry.scores ?? {}
  if (subject === 'all') {
    const [best, pct] = Object.entries(scores).sort((a, b) => b[1] - a[1])[0] ?? []
    return pct >= QUALIFY_SCORE ? { kind: 'score', subject: best, pct } : null
  }
  if ((scores[subject] ?? 0) >= QUALIFY_SCORE) return { kind: 'score', subject, pct: scores[subject] }
  if (entry.topNotes?.includes(subject)) return { kind: 'notes', subject }
  return null
}

// Case states that stop a reviewer from taking new copies or writing reviews
export const BLOCKING = ['suspended', 'clarified', 'upheld']
// Case states that put the reviewer's reviews under audit (labelled, left out of the ranking)
export const AUDITING = ['suspended', 'clarified']

export function caseOf(demo, reviewerId) {
  return demo.reviewerCases?.[reviewerId] ?? null
}

export function isBlocked(demo, reviewerId) {
  return BLOCKING.includes(caseOf(demo, reviewerId)?.status)
}

export function isUnderAudit(demo, reviewerId) {
  return AUDITING.includes(caseOf(demo, reviewerId)?.status)
}

// Reviews anyone can see on the book page (removed ones are gone)
export function visibleReviews(demo, bookId) {
  return demo.bookReviews.filter((r) => r.status !== 'removed' && (!bookId || r.bookId === bookId))
}

// Reviews that count towards scores: visible and not under a government audit
export function countedReviews(demo) {
  return visibleReviews(demo).filter((r) => !isUnderAudit(demo, r.reviewerId))
}

export function levelFor(count) {
  return REVIEWER_LEVELS.find((l) => count >= l.min).key
}

export function reviewerStats(demo, reviewerId) {
  const entry = poolById[reviewerId]
  const reviews = demo.bookReviews.filter((r) => r.reviewerId === reviewerId && r.status !== 'removed')
  const total = (entry?.pastReviews ?? 0) + reviews.length
  const honorarium = demo.reviewCopies.filter((c) => c.reviewerId === reviewerId && c.status === 'reviewed').reduce((sum, c) => sum + c.honorarium, 0)
  return { reviews, total, level: levelFor(total), points: total * REVIEW_POINTS, honorarium }
}

const avg = (list) => (list.length ? list.reduce((a, b) => a + b, 0) / list.length : 0)
export const round1 = (n) => Math.round(n * 10) / 10

// Summary for one book's reviews: average stars and average per criterion
export function bookSummary(demo, bookId) {
  const reviews = countedReviews(demo).filter((r) => r.bookId === bookId)
  const criteria = ['syllabus', 'clarity', 'questions', 'value'].map((key) => [key, avg(reviews.map((r) => r.criteria[key]))])
  return { n: reviews.length, stars: avg(reviews.map((r) => r.stars)), criteria }
}

// Pages a reviewer must open before the review form unlocks
export function pagesNeeded(bookId) {
  return Math.ceil(bookPdf(bookId).pages * READ_TO_UNLOCK)
}

// Publishers with an open government case about reviewers who favoured them
export function publishersUnderWarning(demo) {
  return new Set(
    Object.values(demo.reviewerCases ?? {})
      .filter((c) => AUDITING.includes(c.status) && c.publisherId)
      .map((c) => c.publisherId),
  )
}

// Publisher ranking from reviewer reviews across every live book. Bayesian average:
// (CONFIDENCE × platform mean + sum of stars) / (CONFIDENCE + number of reviews), minus a penalty during an integrity case.
export function publisherRanking(demo) {
  const live = demo.books.filter((b) => b.status === 'live')
  const bookById = Object.fromEntries(live.map((b) => [b.id, b]))
  const counted = countedReviews(demo).filter((r) => bookById[r.bookId])
  const mean = avg(counted.map((r) => r.stars)) || 4
  const warned = publishersUnderWarning(demo)

  const publishers = new Map()
  for (const book of live) {
    if (!publishers.has(book.publisherId)) publishers.set(book.publisherId, { id: book.publisherId, name: book.publisher, books: [], reviews: [] })
    publishers.get(book.publisherId).books.push(book)
  }
  for (const r of counted) publishers.get(bookById[r.bookId].publisherId).reviews.push(r)

  const rows = [...publishers.values()].map((p) => {
    const n = p.reviews.length
    const sum = p.reviews.reduce((a, r) => a + r.stars, 0)
    const warning = warned.has(p.id)
    const score = (CONFIDENCE * mean + sum) / (CONFIDENCE + n) - (warning ? INTEGRITY_PENALTY : 0)
    const criteria = ['syllabus', 'clarity', 'questions', 'value'].map((key) => [key, avg(p.reviews.map((r) => r.criteria[key]))])
    const reviewers = new Set(p.reviews.map((r) => r.reviewerId)).size
    return { ...p, n, reviewers, average: avg(p.reviews.map((r) => r.stars)), score, criteria, warning }
  })
  rows.sort((a, b) => b.score - a.score || b.n - a.n)
  return rows.map((row, i) => ({ ...row, rank: i + 1 }))
}

// Automatic warning signs on a reviewer's pattern, for the government audit
export function riskFlags(demo, reviewerId) {
  const entry = reviewerInfo(demo, reviewerId)
  const reviews = demo.bookReviews.filter((r) => r.reviewerId === reviewerId && r.status !== 'removed')
  const bookById = Object.fromEntries(demo.books.map((b) => [b.id, b]))
  const flags = []

  const outside = reviews.filter((r) => !qualification(entry, bookById[r.bookId]))
  if (outside.length) flags.push({ key: 'outsideSubject', n: outside.length })

  const fast = reviews.filter((r) => (r.readHours ?? 99) < 6)
  if (fast.length) flags.push({ key: 'fastRead', n: fast.length })

  const fiveByPublisher = {}
  for (const r of reviews) if (r.stars === 5) fiveByPublisher[bookById[r.bookId]?.publisherId] = (fiveByPublisher[bookById[r.bookId]?.publisherId] ?? 0) + 1
  const favoured = Object.entries(fiveByPublisher).find(([, n]) => n >= 2 && reviews.every((r) => r.stars === 5))
  if (favoured) flags.push({ key: 'onePublisher', n: favoured[1], publisherId: favoured[0] })

  const others = demo.bookReviews.filter((r) => r.status !== 'removed')
  const copied = reviews.filter((r) => others.some((o) => o.id !== r.id && o.text.en.trim() === r.text.en.trim()))
  if (copied.length) flags.push({ key: 'copiedText', n: copied.length })

  const reported = reviews.filter((r) => r.status === 'reported')
  if (reported.length) flags.push({ key: 'reported', n: reported.length })

  return flags
}

// The publisher who gained most from a reviewer's reviews (most 5-star reviews), for linking a case
export function favouredPublisher(demo, reviewerId) {
  const bookById = Object.fromEntries(demo.books.map((b) => [b.id, b]))
  const counts = {}
  for (const r of demo.bookReviews.filter((x) => x.reviewerId === reviewerId && x.stars >= 4)) {
    const id = bookById[r.bookId]?.publisherId
    if (id) counts[id] = (counts[id] ?? 0) + r.stars
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null
}

export function publisherName(demo, publisherId) {
  return demo.books.find((b) => b.publisherId === publisherId)?.publisher ?? publisherId
}

// Timestamps and ids for records created by a click
export function nowIso() {
  return new Date().toISOString()
}

export function hoursSince(iso) {
  return Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 36e5))
}

export function newId(prefix) {
  return `${prefix}-${Date.now()}`
}

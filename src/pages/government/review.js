import { BookOpen, ClipboardList, FileText, Target } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import { useDemo } from '../../store/DemoStore'
import { bookSubmittedAt, DEMO_NOW, posterTypes, PRIORITY_HOURS, REVIEWED_TODAY_BASE, teacherContent } from '../../data/demo/government'

export const KIND_ICONS = { challenge: Target, book: BookOpen, note: FileText, exam: ClipboardList }

// Date-only stamps (e.g. a challenge posted today) count from the start of office hours
function parseStamp(stamp) {
  if (!stamp) return null
  return new Date(stamp.length === 10 ? `${stamp}T09:00:00` : stamp)
}

export function hoursWaiting(stamp) {
  const at = parseStamp(stamp)
  if (!at) return 0
  return Math.max(0, Math.floor((new Date(DEMO_NOW) - at) / 36e5))
}

// "Just now" / "5 h" / "3 days"
export function useWaitLabel() {
  const { t, num } = useI18n()
  return (hours) => {
    if (hours < 1) return t('government.wait.now')
    if (hours < 24) return t('government.wait.hours', { n: num(hours) })
    if (hours < 48) return t('government.wait.day')
    return t('government.wait.days', { n: num(Math.floor(hours / 24)) })
  }
}

// Every item waiting for this desk, longest wait first
export function useReviewQueue() {
  const { challenges, books, notes, portalState } = useDemo()
  const decided = portalState?.['government.content'] ?? {}

  const items = [
    ...challenges
      .filter((c) => c.status === 'review')
      .map((c) => ({
        kind: 'challenge',
        id: c.id,
        title: c.title,
        source: posterTypes[c.orgId] ?? 'industry',
        by: c.org,
        size: { key: 'deliverables', n: c.deliverables?.en?.length ?? 0 },
        stamp: c.postedAt,
        record: c,
      })),
    ...books
      .filter((b) => b.status === 'review')
      .map((b) => ({
        kind: 'book',
        id: b.id,
        title: b.title,
        source: 'publisher',
        by: b.publisher,
        size: { key: 'pages', n: b.pages },
        stamp: b.submittedAt ?? bookSubmittedAt[b.id] ?? b.createdAt,
        record: b,
      })),
    ...teacherContent
      .filter((x) => !decided[x.id])
      .map((x) => ({
        kind: 'exam',
        id: x.id,
        title: x.title,
        source: 'teacher',
        by: x.teacher,
        size: { key: 'questions', n: x.questions },
        stamp: x.submittedAt,
        record: x,
      })),
    ...notes
      .filter((n) => n.status === 'in_review')
      .map((n) => ({
        kind: 'note',
        id: n.id,
        title: n.title,
        // Teacher uploads carry authorRole 'teacher'
        source: n.authorRole === 'teacher' || n.role === 'teacher' ? 'teacher' : 'studentNote',
        by: n.author,
        size: { key: 'pages', n: n.pages },
        stamp: n.createdAt,
        record: n,
      })),
  ].map((item) => {
    const hours = hoursWaiting(item.stamp)
    return { ...item, hours, priority: hours >= PRIORITY_HOURS, tab: item.kind === 'note' ? 'notes' : 'content' }
  })

  // Content first, then notes, each longest-waiting first, so "next" follows the tabs
  const byWait = (a, b) => b.hours - a.hours
  return [...items.filter((i) => i.tab === 'content').sort(byWait), ...items.filter((i) => i.tab === 'notes').sort(byWait)]
}

export function useReviewedToday() {
  const { portalState } = useDemo()
  return REVIEWED_TODAY_BASE + (portalState?.['government.reviewed'] ?? 0)
}

// Counts one more decision for "You reviewed N items today"
export function useCountReview() {
  const { portalState, dispatch } = useDemo()
  return () => dispatch({ type: 'setPortalState', key: 'government.reviewed', value: (portalState?.['government.reviewed'] ?? 0) + 1 })
}

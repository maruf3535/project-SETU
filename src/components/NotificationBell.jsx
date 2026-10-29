import { Banknote, Bell, BookOpen, CircleCheck, Clock3, Inbox, Mail, MonitorPlay, PenLine, ScanLine, Undo2, Users } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { studentLevels } from '../data/demo/studentLevels'
import { useI18n } from '../i18n/I18nProvider'
import { useCourses } from '../store/CoursesStore'
import { useDemo } from '../store/DemoStore'
import { useRecommendations } from '../pages/courses/courseUtils'
import { useDismiss } from './useDismiss'

// Builds the signed-in role's notifications from the shared demo data, newest decisions first
function useNotifications(role) {
  const { t, L, money, num } = useI18n()
  const { challenges, projects, notes, books, studentById, studentLevel } = useDemo()
  const { courses } = useCourses()
  // Courses the current demo student's teacher recommended to their section
  const recommended = useRecommendations({ role: 'student', id: studentLevels[studentLevel].studentId })
  const items = []

  if (role === 'industry') {
    const mine = challenges.filter((c) => c.orgId === 'agrosense')
    mine.filter((c) => c.status === 'submitted').forEach((c) =>
      items.push({ id: `sub-${c.id}`, icon: Inbox, tone: 'accent', to: `/industry/challenges/${c.id}`, text: t('notify.submitted', { name: studentById[c.solver]?.name, title: L(c.title) }) }),
    )
    projects.forEach((p) =>
      p.milestones.forEach((m, i) => {
        if (m.status === 'submitted')
          items.push({ id: `ms-${p.id}-${i}`, icon: CircleCheck, tone: 'accent', to: '/industry/projects', text: t('notify.milestone', { team: p.lead, title: L(m.title) }) })
      }),
    )
    mine.filter((c) => c.status === 'open' && c.applicants.length).forEach((c) =>
      items.push({ id: `app-${c.id}-${c.applicants.length}`, icon: Users, tone: 'primary', to: `/industry/challenges/${c.id}`, text: t('notify.applicants', { n: num(c.applicants.length), title: L(c.title) }) }),
    )
    mine.filter((c) => c.status === 'review').forEach((c) =>
      items.push({ id: `rev-${c.id}`, icon: Clock3, tone: 'warn', to: `/industry/challenges/${c.id}`, text: t('notify.inReview', { title: L(c.title) }) }),
    )
  }

  if (role === 'student') {
    const me = studentLevels[studentLevel].studentId
    challenges.filter((c) => c.solver === me && c.status === 'in_progress' && c.revisionNote).forEach((c) =>
      items.push({ id: `revise-${c.id}`, icon: Undo2, tone: 'warn', to: `/student/opportunities/${c.id}`, text: t('notify.revision', { org: c.org, title: L(c.title) }) }),
    )
    challenges.filter((c) => c.solver === me && c.status === 'paid').forEach((c) =>
      items.push({ id: `paid-${c.id}`, icon: Banknote, tone: 'ok', to: '/student/portfolio', text: t('notify.paid', { amount: money(c.reward), title: L(c.title) }) }),
    )
    challenges.filter((c) => c.status === 'open' && c.invited.includes(me)).forEach((c) =>
      items.push({ id: `inv-${c.id}`, icon: Mail, tone: 'primary', to: `/student/opportunities/${c.id}`, text: t('notify.invited', { org: c.org, title: L(c.title) }) }),
    )
    notes.filter((n) => n.authorId === me).forEach((n) =>
      items.push({
        id: `note-${n.id}-${n.status}`,
        icon: n.status === 'reviewed' ? CircleCheck : Clock3,
        tone: n.status === 'reviewed' ? 'ok' : 'warn',
        to: '/student/notes',
        text: t(n.status === 'reviewed' ? 'notify.noteLive' : 'notify.noteReview', { title: L(n.title) }),
      }),
    )
    courses
      .filter((c) => c.status === 'live' && recommended[c.id])
      .forEach((c) =>
        items.push({
          id: `rec-${c.id}`,
          icon: MonitorPlay,
          tone: 'primary',
          to: `/student/courses/${c.id}`,
          text: t('notify.courseRecommended', { teacher: recommended[c.id].teacherName, title: L(c.title) }),
        }),
      )
  }

  if (role === 'government') {
    challenges.filter((c) => c.status === 'review').forEach((c) =>
      items.push({ id: `gq-${c.id}`, icon: Inbox, tone: 'accent', to: '/government', text: t('notify.toReview', { title: L(c.title) }) }),
    )
    notes.filter((n) => n.status === 'in_review').forEach((n) =>
      items.push({ id: `gn-${n.id}`, icon: PenLine, tone: 'primary', to: '/government', text: t('notify.noteToReview', { title: L(n.title) }) }),
    )
  }

  if (role === 'publisher') {
    books.filter((b) => b.publisherId === 'brightpage' && b.status !== 'live').forEach((b) =>
      items.push({
        id: `bk-${b.id}-${b.status}`,
        icon: b.status === 'fix' ? Undo2 : Clock3,
        tone: 'warn',
        to: '/publisher/listings',
        text: t(b.status === 'fix' ? 'notify.bookFix' : 'notify.bookReview', { title: L(b.title) }),
      }),
    )
  }

  if (role === 'teacher') {
    items.push({ id: 'omr-batch', icon: ScanLine, tone: 'primary', to: '/teacher/omr', text: t('notify.omr') })
    items.push({ id: 'books-free', icon: BookOpen, tone: 'ok', to: '/teacher', text: t('notify.teacherBook') })
  }

  return items
}

const tones = {
  accent: 'bg-accent text-accent-ink',
  primary: 'bg-[color-mix(in_oklab,var(--primary)_14%,transparent)] text-primary',
  warn: 'bg-warn-soft text-warn',
  ok: 'bg-ok-soft text-ok',
}

export default function NotificationBell({ role }) {
  const { t } = useI18n()
  const { seen = [], dispatch } = useDemo()
  const [open, setOpen] = useState(false)
  const dismissRef = useDismiss(open, () => setOpen(false))
  const items = useNotifications(role)
  const unseen = items.filter((item) => !seen.includes(item.id))

  function toggle() {
    if (!open && unseen.length) dispatch({ type: 'markSeen', ids: unseen.map((item) => item.id) })
    setOpen((value) => !value)
  }

  return (
    <div ref={dismissRef} className="relative">
      <button
        type="button"
        aria-label={t('shell.notifications')}
        aria-expanded={open}
        onClick={toggle}
        className="relative grid size-9 place-items-center rounded-full border border-line bg-surface text-ink-2 hover:text-ink"
      >
        <Bell className="size-4" />
        {unseen.length > 0 && <span className="absolute top-2 right-2.5 size-1.5 rounded-full bg-accent" />}
      </button>

      {open && (
        <>
          <div className="fixed inset-x-3 top-[calc(4.5rem+env(safe-area-inset-top))] z-50 rounded-2xl border border-line bg-surface shadow-[0_16px_40px_-12px_rgb(0_0_0/0.4)] sm:absolute sm:inset-x-auto sm:top-auto sm:right-0 sm:mt-2 sm:w-96">
            <p className="border-b border-line px-4 py-3 font-semibold">{t('notify.title')}</p>
            {items.length ? (
              <ul className="max-h-[60dvh] divide-y divide-line overflow-y-auto">
                {items.map(({ id, icon: Icon, tone, to, text }) => (
                  <li key={id}>
                    <Link to={to} onClick={() => setOpen(false)} className="flex items-start gap-3 px-4 py-3 text-sm hover:bg-surface-2/70">
                      <span className={`grid size-8 shrink-0 place-items-center rounded-lg ${tones[tone]}`}>
                        <Icon className="size-4" />
                      </span>
                      <span className="pt-1.5 leading-snug">{text}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="flex items-center gap-2 px-4 py-6 text-sm text-ink-2">
                <CircleCheck className="size-4 text-ok" /> {t('notify.empty')}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  )
}

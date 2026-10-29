import { ArrowLeft, ArrowRight, CircleCheck, CirclePlay, Clock3, PencilLine, ShieldCheck, TriangleAlert, Undo2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import Avatar from '../../components/Avatar'
import { usePasscode } from '../../components/Passcode'
import { useToast } from '../../components/Toast'
import { buttonStyles, inputStyles, PageIntro, Panel, Stat } from '../../components/ui'
import { MAX_PREVIEWS } from '../../data/demo/courses'
import { useI18n } from '../../i18n/I18nProvider'
import { useCourses } from '../../store/CoursesStore'
import { useDemo } from '../../store/DemoStore'
import { coursesAwaitingReview, qualificationFor, revisionChanges, topicLabel, totalMinutes, useCreatorName, useDuration, useQualificationText, withRevision } from './courseUtils'
import { CourseCover, CourseStatusPill, DemoVideoNote, RoleTag } from './shared'
import VideoPlayer from './VideoPlayer'

const BASE = '/government/courses'
// Lectures outside this length get a second look
const SHORT_MINUTES = 3
const LONG_MINUTES = 60

// "2 days ago" in the current language
function useAgo() {
  const { lang } = useI18n()
  const format = new Intl.RelativeTimeFormat(lang === 'bn' ? 'bn-BD' : 'en', { numeric: 'auto' })
  return (iso) => {
    const hours = Math.round((new Date(iso).getTime() - Date.now()) / 3600000)
    return Math.abs(hours) < 24 ? format.format(hours, 'hour') : format.format(Math.round(hours / 24), 'day')
  }
}

// New courses and edits to live ones, oldest first, so nothing waits too long
function useWaiting() {
  const { courses, courseById } = useCourses()
  return coursesAwaitingReview(courses).map((item) => courseById[item.id])
}

function UpdateTag() {
  const { t } = useI18n()
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-semibold text-warn">
      <PencilLine className="size-3" /> {t('courses.gov.update')}
    </span>
  )
}

function CourseRow({ course: stored, note }) {
  const { t, L, num } = useI18n()
  const isRevision = stored.status === 'live' && Boolean(stored.revision)
  const course = withRevision(stored)
  const when = isRevision
    ? stored.revision.submittedAt
    : stored.status === 'returned' ? stored.reviewedAt : stored.submittedAt
  const waiting = stored.status === 'review' || stored.revision?.status === 'review'
  const creatorName = useCreatorName()
  const duration = useDuration()
  const ago = useAgo()
  return (
    <Link to={`${BASE}/${course.id}`} className="group flex items-start gap-4 px-5 py-4 transition-colors hover:bg-surface-2/60 sm:items-center">
      <CourseCover course={course} className="hidden w-28 shrink-0 !p-2 sm:flex [&>span:nth-child(2)]:text-xs" />
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold tracking-wide text-ink-2 uppercase">{t(`courses.levels.${course.level}`)}</span>
          <RoleTag role={course.creatorRole} />
          {isRevision && <UpdateTag />}
        </span>
        <span className="mt-1 block font-semibold group-hover:text-primary">{L(course.title)}</span>
        <span className="mt-1 block text-sm text-ink-2">
          {creatorName(course)} · {t('courses.lecturesN', { n: num(course.lectures.length) })} · {duration(totalMinutes(course))}
        </span>
        {note && <span className="mt-1 block text-sm text-bad">{note}</span>}
      </span>
      <span className="flex shrink-0 flex-col items-end gap-1 text-sm">
        <span className="inline-flex items-center gap-1.5 text-ink-2">
          <Clock3 className="size-4" /> {ago(when)}
        </span>
        {waiting && (
          <span className="hidden items-center gap-1 font-semibold text-primary sm:inline-flex">
            {t('courses.gov.open')} <ArrowRight className="size-4" />
          </span>
        )}
      </span>
    </Link>
  )
}

// Government: courses waiting for review, plus the ones sent back to their creators
export default function GovernmentCourseReview() {
  const { t, L, num } = useI18n()
  const { courses } = useCourses()
  const waiting = useWaiting()
  const returned = courses.filter((c) => c.status === 'returned' || (c.status === 'live' && c.revision?.status === 'returned'))
  const live = courses.filter((c) => c.status === 'live')

  return (
    <div className="mx-auto max-w-6xl">
      <PageIntro title={t('courses.gov.title')} body={t('courses.gov.body')} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat tone="brand" label={t('courses.gov.waiting')} value={num(waiting.length)} />
        <Stat label={t('courses.gov.returned')} value={num(returned.length)} note={t('courses.gov.returnedNote')} />
        <Stat label={t('courses.gov.live')} value={num(live.length)} />
      </div>

      <Panel title={t('courses.gov.waiting')} className="mt-6">
        {waiting.length ? (
          <ul className="divide-y divide-line">
            {waiting.map((c) => (
              <li key={c.id}>
                <CourseRow course={c} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="flex items-center gap-2 px-5 py-8 text-ink-2">
            <CircleCheck className="size-5 text-ok" /> {t('courses.gov.empty')}
          </p>
        )}
      </Panel>

      {returned.length > 0 && (
        <Panel title={t('courses.gov.returned')} className="mt-6">
          <ul className="divide-y divide-line">
            {returned.map((c) => (
              <li key={c.id}>
                <CourseRow course={c} note={L(c.status === 'returned' ? c.reviewNote : c.revision.reviewNote)} />
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </div>
  )
}

// Automatic pre-checks: { result: pass | flag, label, detail? }
function useChecks(course) {
  const { t, num } = useI18n()
  const { studentById } = useDemo()
  const qualificationText = useQualificationText()
  const q = qualificationFor(course, studentById)
  const previews = course.lectures.filter((l) => l.preview).length
  const odd = course.lectures.filter((l) => l.minutes < SHORT_MINUTES || l.minutes > LONG_MINUTES).length
  const hasBangla = typeof course.title === 'object' && course.title.bn && course.title.bn !== course.title.en
  return [
    { result: q.ok ? 'pass' : 'flag', label: t('courses.gov.checks.creator'), detail: qualificationText(q) },
    { result: hasBangla ? 'pass' : 'flag', label: t('courses.gov.checks.bangla'), detail: hasBangla ? null : t('courses.gov.checks.banglaMissing') },
    course.price > 0
      ? { result: previews <= MAX_PREVIEWS ? 'pass' : 'flag', label: t('courses.gov.checks.previews', { n: num(previews), max: num(MAX_PREVIEWS) }) }
      : { result: 'pass', label: t('courses.gov.checks.free') },
    { result: odd ? 'flag' : 'pass', label: t('courses.gov.checks.lengths'), detail: odd ? t('courses.gov.checks.lengthsOdd', { n: num(odd), min: num(SHORT_MINUTES), max: num(LONG_MINUTES) }) : null },
  ]
}

// A readable "from → to" line for each change a revision makes
function useChangeLines() {
  const { t, L, money } = useI18n()
  const duration = useDuration()
  const price = (n) => (n > 0 ? money(n) : t('courses.free'))
  return (c) => {
    const lecture = c.lecture && L(c.lecture.title)
    switch (c.key) {
      case 'title':
        return t('courses.gov.changes.title', { from: L(c.from), to: L(c.to) })
      case 'price':
        return t('courses.gov.changes.price', { from: price(c.from), to: price(c.to) })
      case 'level':
        return t('courses.gov.changes.level', { from: t(`courses.levels.${c.from}`), to: t(`courses.levels.${c.to}`) })
      case 'topic':
        return t('courses.gov.changes.topic', { from: L(topicLabel(c.from)), to: L(topicLabel(c.to)) })
      case 'lectureRenamed':
        return t('courses.gov.changes.lectureRenamed', { from: L(c.from), to: L(c.to) })
      case 'lectureMinutes':
        return t('courses.gov.changes.lectureMinutes', { lecture, from: duration(Number(c.from)), to: duration(Number(c.to)) })
      default:
        // about, cover, lectureOrder, lectureAdded, lectureRemoved, previewOn, previewOff
        return t(`courses.gov.changes.${c.key}`, { lecture })
    }
  }
}

function Decision({ course: stored }) {
  const isRevision = stored.status === 'live' && Boolean(stored.revision)
  // The reviewer sees the course as it would look after approval
  const course = withRevision(stored)
  const changes = revisionChanges(stored)
  const changeLine = useChangeLines()
  const { t, L, num, money, date } = useI18n()
  const { dispatch } = useCourses()
  const waiting = useWaiting()
  const toast = useToast()
  const confirmPasscode = usePasscode()
  const navigate = useNavigate()
  const creatorName = useCreatorName()
  const duration = useDuration()
  const checks = useChecks(course)
  const [lectureId, setLectureId] = useState(course.lectures[0].id)
  const [note, setNote] = useState('')
  const [noteError, setNoteError] = useState(false)
  const noteRef = useRef(null)
  const lecture = course.lectures.find((l) => l.id === lectureId) ?? course.lectures[0]
  const title = L(course.title)
  const pending = stored.status === 'review' || stored.revision?.status === 'review'
  const submittedAt = isRevision ? stored.revision.submittedAt : stored.submittedAt

  function finish(message) {
    toast(message)
    const next = waiting.find((c) => c.id !== course.id)
    navigate(next ? `${BASE}/${next.id}` : BASE, { replace: true })
  }

  async function approve() {
    if (!(await confirmPasscode(t('courses.passcode.approve', { title })))) return
    dispatch({ type: 'reviewCourse', id: course.id, status: 'live' })
    finish(isRevision ? t('courses.gov.revisionApprovedToast', { title }) : t('courses.gov.approvedToast', { title }))
  }

  async function sendBack() {
    const text = note.trim()
    if (!text) {
      setNoteError(true)
      noteRef.current?.focus()
      return
    }
    if (!(await confirmPasscode(t('courses.passcode.sendBack', { title })))) return
    dispatch({ type: 'reviewCourse', id: course.id, status: 'returned', note: text })
    finish(t('courses.gov.returnedToast', { name: creatorName(course) }))
  }

  return (
    <div className="mx-auto max-w-6xl">
      <Link to={BASE} className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 hover:text-ink">
        <ArrowLeft className="size-4" /> {t('courses.gov.back')}
      </Link>

      <header className="mt-4">
        <div className="flex flex-wrap items-center gap-2">
          <CourseStatusPill status={isRevision ? (stored.revision.status === 'returned' ? 'revisionReturned' : 'revisionReview') : course.status} />
          {isRevision && <UpdateTag />}
          <span className="rounded-full bg-surface-2 px-2.5 py-1 text-xs font-semibold">
            {t(`courses.levels.${course.level}`)} · {L(topicLabel(course.topic))}
          </span>
        </div>
        <h2 className="mt-3 font-display text-3xl leading-tight font-semibold">{title}</h2>
        <p className="mt-1 text-ink-2">
          {t('courses.gov.submitted', { date: date(submittedAt) })} · {course.price > 0 ? money(course.price) : t('courses.free')} · {duration(totalMinutes(course))}
        </p>
      </header>

      {isRevision && (
        <section className="mt-5 rounded-2xl bg-accent-soft p-4 text-sm" aria-labelledby="course-changes">
          <h3 id="course-changes" className="flex items-center gap-2 font-semibold">
            <PencilLine className="size-4 text-warn" /> {t('courses.gov.revisionHead', { date: date(stored.reviewedAt ?? stored.submittedAt) })}
          </h3>
          <p className="mt-1 text-ink-2">{t('courses.gov.revisionBody')}</p>
          {changes.length ? (
            <ul className="mt-3 grid gap-1.5">
              {changes.map((c, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-warn" aria-hidden="true" />
                  <span>{changeLine(c)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2">{t('courses.gov.noChanges')}</p>
          )}
        </section>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Panel title={t('courses.gov.preview')} className="self-start">
          <div className="grid gap-5 p-5">
            <div>
              <VideoPlayer key={lecture.id} lecture={lecture} courseTitle={course.title} onWatched={() => {}} />
              <DemoVideoNote className="mt-3" />
            </div>
            <p className="leading-relaxed">{L(course.about)}</p>
            <ol className="divide-y divide-line rounded-2xl border border-line">
              {course.lectures.map((l, i) => (
                <li key={l.id}>
                  <button
                    type="button"
                    onClick={() => setLectureId(l.id)}
                    aria-current={l.id === lecture.id ? 'true' : undefined}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left ${l.id === lecture.id ? 'bg-surface-2' : 'hover:bg-surface-2/60'}`}
                  >
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-surface-2 text-xs font-semibold tabular-nums">{num(i + 1)}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold">{L(l.title)}</span>
                      <span className="text-xs text-ink-2 tabular-nums">
                        {duration(Number(l.minutes))}
                        {l.preview && course.price > 0 && ` · ${t('courses.preview')}`}
                        {l.fileName && ` · ${l.fileName}`}
                      </span>
                    </span>
                    <CirclePlay className="size-4 shrink-0 text-primary" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </Panel>

        <div className="grid content-start gap-4">
          <Panel title={t('courses.gov.creator')}>
            <div className="flex items-center gap-3 p-5">
              <Avatar initials={course.creatorInitials} />
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-2 font-semibold">
                  {creatorName(course)} <RoleTag role={course.creatorRole} />
                </p>
                <p className="text-sm text-ink-2">{t('courses.gov.idVerified')}</p>
              </div>
            </div>
          </Panel>

          <Panel title={t('courses.gov.checklist')}>
            <ul className="grid gap-1 p-3">
              {checks.map((c) => (
                <li key={c.label} className={`flex gap-3 rounded-xl px-2.5 py-2.5 ${c.result === 'flag' ? 'bg-warn-soft' : ''}`}>
                  {c.result === 'pass' ? <CircleCheck className="mt-0.5 size-5 shrink-0 text-ok" /> : <TriangleAlert className="mt-0.5 size-5 shrink-0 text-warn" />}
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{c.label}</span>
                    {c.detail && <span className="mt-0.5 block text-sm text-ink-2">{c.detail}</span>}
                  </span>
                </li>
              ))}
            </ul>
            <p className="border-t border-line px-5 py-3 text-xs text-ink-2">{t('courses.gov.checksNote')}</p>
          </Panel>

          {stored.history?.some((h) => h.status !== 'review') && (
            <Panel title={t('courses.gov.history')}>
              <ol className="grid gap-2 p-5 text-sm">
                {stored.history.map((h, i) => (
                  <li key={i} className="flex flex-wrap gap-x-2">
                    <span className="font-semibold">{t(`courses.gov.events.${h.status}`)}</span>
                    <span className="text-ink-2">{date(h.at)}</span>
                    {h.note && <span className="w-full text-ink-2">{L(h.note)}</span>}
                  </li>
                ))}
              </ol>
            </Panel>
          )}

          {pending ? (
            <Panel title={t('courses.gov.decision')}>
              <div className="grid gap-3 p-5">
                <label htmlFor="course-review-note" className="text-sm font-semibold">
                  {t('courses.gov.noteLabel')}
                </label>
                <textarea
                  id="course-review-note"
                  ref={noteRef}
                  rows={4}
                  value={note}
                  onChange={(event) => {
                    setNote(event.target.value)
                    if (event.target.value.trim()) setNoteError(false)
                  }}
                  placeholder={t('courses.gov.notePlaceholder')}
                  aria-invalid={noteError}
                  aria-describedby="course-review-note-help"
                  className={`${inputStyles} ${noteError ? 'border-bad' : ''}`}
                />
                <p id="course-review-note-help" className={`text-xs ${noteError ? 'font-semibold text-bad' : 'text-ink-2'}`}>
                  {noteError ? t('courses.gov.noteRequired') : t('courses.gov.noteHelp')}
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <button type="button" onClick={approve} className={buttonStyles.accent}>
                    <ShieldCheck className="size-4" /> {t('courses.gov.approve')}
                  </button>
                  <button type="button" onClick={sendBack} className={buttonStyles.ghost}>
                    <Undo2 className="size-4" /> {t('courses.gov.sendBack')}
                  </button>
                </div>
                <p className="text-xs text-ink-2">{isRevision ? t('courses.gov.revisionApproveHint') : t('courses.gov.approveHint')}</p>
              </div>
            </Panel>
          ) : (
            <p className="rounded-2xl bg-surface-2 px-4 py-3 text-sm text-ink-2">{t('courses.gov.decided')}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export function GovernmentCourseDecision() {
  const { id } = useParams()
  const { courseById } = useCourses()
  const course = courseById[id]
  if (!course) return <Navigate to={BASE} replace />
  // Keyed so the note and the player start fresh for each course
  return <Decision key={course.id} course={course} />
}

import { ArrowLeft, Check, ChevronLeft, ChevronRight, CircleCheck, CirclePlay, Lock, Star } from 'lucide-react'
import { useCallback } from 'react'
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import { useToast } from '../../components/Toast'
import { buttonStyles } from '../../components/ui'
import { useI18n } from '../../i18n/I18nProvider'
import { useCourses } from '../../store/CoursesStore'
import { useCourseAccess, useCourseRole, useCourseUser, useCreatorName, useDuration } from './courseUtils'
import { DemoVideoNote, ProgressBar } from './shared'
import VideoPlayer from './VideoPlayer'

export default function CoursePlayer({ role: roleProp }) {
  const { id } = useParams()
  const [params] = useSearchParams()
  const { t, L, num } = useI18n()
  const { role, base } = useCourseRole(roleProp)
  const user = useCourseUser(role)
  const { courseById, dispatch } = useCourses()
  const course = courseById[id]
  const access = useCourseAccess(course, user)
  const creatorName = useCreatorName()
  const duration = useDuration()
  const toast = useToast()

  const lectureId = params.get('l')
  const index = Math.max(0, course?.lectures.findIndex((l) => l.id === lectureId) ?? 0)
  const lecture = course?.lectures[index]
  // Progress is saved for enrolled learners; previews and the creator's own checks are not counted
  const tracks = Boolean(access?.enrolled)

  const markWatched = useCallback(() => {
    if (!tracks || !lecture) return
    dispatch({ type: 'watchLecture', userId: user.id, courseId: course.id, lectureId: lecture.id })
  }, [tracks, lecture, dispatch, user, course])

  if (!course || (course.status !== 'live' && !access.isCreator)) return <Navigate to={base} replace />

  const detail = `${base}/${course.id}`
  const prev = course.lectures[index - 1]
  const next = course.lectures[index + 1]
  const open = access.canWatch(lecture)
  const done = access.seen.includes(lecture.id)
  const watchLink = (l) => `${detail}/watch?l=${l.id}`

  function markClick() {
    markWatched()
    toast(t('courses.player.markedToast', { title: L(lecture.title) }))
  }

  return (
    <div className="mx-auto max-w-6xl">
      <Link to={detail} className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 hover:text-ink">
        <ArrowLeft className="size-4" /> {t('courses.player.back')}
      </Link>

      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0">
          {open ? (
            <VideoPlayer key={lecture.id} lecture={lecture} courseTitle={course.title} onWatched={markWatched} />
          ) : (
            <div className="grid aspect-video place-items-center rounded-2xl border border-dashed border-line bg-surface p-6 text-center">
              <div>
                <Lock className="mx-auto size-8 text-ink-2" />
                <p className="mt-3 font-semibold">{t('courses.player.lockedTitle')}</p>
                <p className="mt-1 text-sm text-ink-2">{course.price > 0 ? t('courses.player.lockedPaid') : t('courses.player.lockedFree')}</p>
                <Link to={detail} className={`${buttonStyles.accent} mt-4`}>
                  {course.price > 0 ? t('courses.detail.buy') : t('courses.detail.enrollFree')}
                </Link>
              </div>
            </div>
          )}
          <DemoVideoNote className="mt-3" />

          <p className="mt-4 text-xs font-semibold tracking-[0.12em] text-ink-2 uppercase">
            {t('courses.player.lectureOf', { n: num(index + 1), total: num(course.lectures.length) })}
          </p>
          <h2 className="mt-1 font-display text-2xl leading-tight font-semibold">{L(lecture.title)}</h2>
          <p className="mt-1 text-sm text-ink-2">
            {L(course.title)} · {creatorName(course)}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {prev && (
              <Link to={watchLink(prev)} className={`${buttonStyles.ghost} py-2`}>
                <ChevronLeft className="size-4" /> {t('courses.player.prev')}
              </Link>
            )}
            {open && tracks && (
              <button type="button" onClick={markClick} disabled={done} className={`${buttonStyles.primary} py-2`}>
                {done ? <CircleCheck className="size-4" /> : <Check className="size-4" />} {done ? t('courses.player.watched') : t('courses.player.markWatched')}
              </button>
            )}
            {next && (
              <Link to={watchLink(next)} className={`${buttonStyles.ghost} py-2`}>
                {t('courses.player.next')} <ChevronRight className="size-4" />
              </Link>
            )}
          </div>
          {open && !tracks && !access.isCreator && <p className="mt-3 text-sm text-ink-2">{t('courses.player.previewNote')}</p>}
          {access.isCreator && <p className="mt-3 text-sm text-ink-2">{t('courses.player.creatorNote')}</p>}
          {access.canRate && (
            <Link to={`${detail}?rate=1`} className="mt-4 flex items-center gap-2 rounded-2xl bg-accent-soft px-4 py-3 text-sm font-semibold hover:underline">
              <Star className="size-4 shrink-0 text-warn" /> {t('courses.player.rateNow')}
            </Link>
          )}
        </div>

        <aside className="min-w-0 self-start rounded-2xl border border-line bg-surface lg:sticky lg:top-24">
          <div className="border-b border-line p-4">
            <p className="font-semibold">{L(course.title)}</p>
            {tracks && (
              <div className="mt-3">
                <ProgressBar value={access.progress} label={t('courses.learning.progressLabel')} />
                <p className="mt-1 text-xs text-ink-2 tabular-nums">{t('courses.learning.progress', { n: num(access.watchedCount), total: num(course.lectures.length) })}</p>
              </div>
            )}
          </div>
          <nav aria-label={t('courses.player.playlist')}>
            <ol className="max-h-[60dvh] overflow-y-auto p-2">
              {course.lectures.map((l, i) => {
                const can = access.canWatch(l)
                const seen = access.seen.includes(l.id)
                const current = l.id === lecture.id
                const inner = (
                  <>
                    <span className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold tabular-nums ${seen ? 'bg-ok-soft text-ok' : current ? 'bg-accent text-accent-ink' : 'bg-surface-2 text-ink-2'}`}>
                      {seen ? <Check className="size-3.5" aria-label={t('courses.player.watched')} /> : num(i + 1)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm leading-snug font-semibold">{L(l.title)}</span>
                      <span className="text-xs text-ink-2 tabular-nums">{duration(Number(l.minutes))}</span>
                    </span>
                    {can ? current ? <CirclePlay className="size-4 shrink-0 text-primary" aria-hidden="true" /> : null : <Lock className="size-4 shrink-0 text-ink-2" aria-label={t('courses.detail.locked')} />}
                  </>
                )
                return (
                  <li key={l.id}>
                    {can ? (
                      <Link to={watchLink(l)} aria-current={current ? 'true' : undefined} className={`flex items-center gap-3 rounded-xl px-2.5 py-2.5 ${current ? 'bg-surface-2' : 'hover:bg-surface-2/60'}`}>
                        {inner}
                      </Link>
                    ) : (
                      <div className="flex items-center gap-3 rounded-xl px-2.5 py-2.5 opacity-70">{inner}</div>
                    )}
                  </li>
                )
              })}
            </ol>
          </nav>
        </aside>
      </div>
    </div>
  )
}

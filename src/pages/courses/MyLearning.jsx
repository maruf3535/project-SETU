import { CirclePlay, ListVideo, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { buttonStyles } from '../../components/ui'
import { useI18n } from '../../i18n/I18nProvider'
import { useCourses } from '../../store/CoursesStore'
import { useCourseAccess, useCreatorName } from './courseUtils'
import { CourseCover, EmptyState, ProgressBar } from './shared'

function LearningRow({ course, base, user }) {
  const { t, L, num, money, date } = useI18n()
  const access = useCourseAccess(course, user)
  const creatorName = useCreatorName()
  const next = course.lectures.find((l) => !access.seen.includes(l.id)) ?? course.lectures[0]
  const { enrollment } = access
  const origin = enrollment.paid || enrollment.pointsUsed
    ? enrollment.pointsUsed
      ? t('courses.learning.boughtPoints', { date: date(enrollment.at), amount: money(enrollment.paid), points: num(enrollment.pointsUsed) })
      : t('courses.learning.bought', { date: date(enrollment.at), amount: money(enrollment.paid) })
    : t('courses.learning.joinedFree', { date: date(enrollment.at) })

  return (
    <li className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4 sm:flex-row">
      <Link to={`${base}/${course.id}`} className="shrink-0 sm:w-44">
        <CourseCover course={course} />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <Link to={`${base}/${course.id}`} className="font-semibold hover:text-primary">
          {L(course.title)}
        </Link>
        <p className="text-xs text-ink-2">{creatorName(course)}</p>
        <p className="mt-1 text-xs text-ink-2">{origin}</p>
        <div className="mt-3">
          <ProgressBar value={access.progress} label={t('courses.learning.progressLabel')} />
          <p className="mt-1 text-xs text-ink-2 tabular-nums">
            {t('courses.learning.progress', { n: num(access.watchedCount), total: num(course.lectures.length) })}
          </p>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Link to={`${base}/${course.id}/watch?l=${next.id}`} className={`${buttonStyles.accent} py-2`}>
            <CirclePlay className="size-4" /> {access.watchedCount ? t('courses.learning.continue') : t('courses.learning.start')}
          </Link>
          {access.canRate && (
            <Link to={`${base}/${course.id}?rate=1`} className={`${buttonStyles.ghost} py-2`}>
              <Star className="size-4" /> {t('courses.rate.cta')}
            </Link>
          )}
        </div>
      </div>
    </li>
  )
}

export default function MyLearning({ base, user, onBrowse }) {
  const { t } = useI18n()
  const { enrollments, courseById } = useCourses()
  const mine = enrollments.filter((e) => e.userId === user.id && courseById[e.courseId]?.status === 'live').reverse()

  if (!mine.length) {
    return (
      <EmptyState
        icon={ListVideo}
        action={
          <button type="button" onClick={onBrowse} className={buttonStyles.primary}>
            {t('courses.learning.browse')}
          </button>
        }
      >
        {t('courses.learning.empty')}
      </EmptyState>
    )
  }

  return (
    <ul className="grid gap-4">
      {mine.map((e) => (
        <LearningRow key={e.courseId} course={courseById[e.courseId]} base={base} user={user} />
      ))}
    </ul>
  )
}

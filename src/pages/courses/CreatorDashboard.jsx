import { CirclePlus, Pencil, Presentation, Star, Undo2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { buttonStyles, Panel, Stat } from '../../components/ui'
import { PLATFORM_FEE_PERCENT } from '../../data/demo/courses'
import { useI18n } from '../../i18n/I18nProvider'
import { useCourses } from '../../store/CoursesStore'
import { courseStats, totalMinutes, useDuration } from './courseUtils'
import { CourseCover, CourseStatusPill, EmptyState, PriceLabel } from './shared'

function CourseRow({ course, base, stats }) {
  const { t, L, num, money, date } = useI18n()
  const duration = useDuration()
  const revision = course.status === 'live' ? course.revision : null
  const sentBack = course.status === 'returned' || revision?.status === 'returned'
  const note = course.status === 'returned' ? course.reviewNote : revision?.reviewNote

  return (
    <li className="grid gap-4 p-4 sm:grid-cols-[10rem_minmax(0,1fr)] sm:p-5">
      <Link to={`${base}/${course.id}`} className="w-40 max-w-full">
        <CourseCover course={course} />
      </Link>
      <div className="min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <Link to={`${base}/${course.id}`} className="min-w-0 font-semibold hover:text-primary">
            {L(course.title)}
          </Link>
          <span className="flex flex-wrap gap-1.5">
            <CourseStatusPill status={course.status} />
            {revision && <CourseStatusPill status={revision.status === 'returned' ? 'revisionReturned' : 'revisionReview'} />}
          </span>
        </div>
        <p className="mt-1 text-xs text-ink-2">
          {t('courses.lecturesN', { n: num(course.lectures.length) })} · {duration(totalMinutes(course))} · <PriceLabel price={course.price} className="text-ink" />
        </p>

        {course.status === 'live' && (
          <dl className="mt-3 grid grid-cols-2 gap-3 rounded-xl bg-surface-2 p-3 text-sm sm:grid-cols-4">
            <div>
              <dt className="text-xs text-ink-2">{t('courses.dashboard.enrolled')}</dt>
              <dd className="font-semibold tabular-nums">{num(stats.enrolled)}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-2">{t('courses.dashboard.sales')}</dt>
              <dd className="font-semibold tabular-nums">{course.price > 0 ? num(stats.sales) : '—'}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-2">{t('courses.dashboard.earnings')}</dt>
              <dd className="font-semibold tabular-nums">{course.price > 0 ? money(stats.earnings) : '—'}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-2">{t('courses.dashboard.rating')}</dt>
              <dd className="inline-flex items-center gap-1 font-semibold tabular-nums">
                {stats.ratingCount ? (
                  <>
                    <Star className="size-3.5 fill-accent text-accent" aria-hidden="true" /> {num(stats.rating)}
                  </>
                ) : (
                  '—'
                )}
              </dd>
            </div>
          </dl>
        )}

        {course.status === 'review' && <p className="mt-3 text-sm text-ink-2">{t('courses.dashboard.inReview', { date: date(course.submittedAt) })}</p>}

        {revision?.status === 'review' && <p className="mt-3 text-sm text-ink-2">{t('courses.dashboard.revisionInReview', { date: date(revision.submittedAt) })}</p>}

        {sentBack && note && (
          <div className="mt-3 rounded-xl bg-bad-soft p-3 text-sm">
            <p className="inline-flex items-center gap-1.5 font-semibold text-bad">
              <Undo2 className="size-4" /> {t('courses.dashboard.returnedNote')}
            </p>
            <p className="mt-1">{L(note)}</p>
          </div>
        )}

        <Link to={`${base}/${course.id}/edit`} className={`${sentBack ? buttonStyles.accent : buttonStyles.ghost} mt-3 py-2`}>
          <Pencil className="size-4" /> {sentBack ? t('courses.dashboard.fix') : revision ? t('courses.dashboard.editRevision') : t('courses.dashboard.edit')}
        </Link>
      </div>
    </li>
  )
}

export default function CreatorDashboard({ base, user }) {
  const { t, num, money } = useI18n()
  const store = useCourses()
  const mine = store.courses.filter((c) => c.creatorId === user.id)
  const stats = Object.fromEntries(mine.map((c) => [c.id, courseStats(c, store)]))
  const live = mine.filter((c) => c.status === 'live')
  const total = (key) => live.reduce((sum, c) => sum + stats[c.id][key], 0)

  const newCourse = (
    <Link to={`${base}/new`} className={buttonStyles.accent}>
      <CirclePlus className="size-4" /> {t('courses.dashboard.create')}
    </Link>
  )

  if (!mine.length) {
    return (
      <EmptyState icon={Presentation} action={newCourse}>
        {t('courses.dashboard.empty')}
      </EmptyState>
    )
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-2">{t('courses.dashboard.body')}</p>
        {newCourse}
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat tone="brand" label={t('courses.dashboard.earnings')} value={money(total('earnings'))} note={t('courses.dashboard.earningsNote', { percent: num(PLATFORM_FEE_PERCENT) })} />
        <Stat label={t('courses.dashboard.enrolled')} value={num(total('enrolled'))} />
        <Stat label={t('courses.dashboard.sales')} value={num(total('sales'))} note={t('courses.dashboard.salesNote', { amount: money(total('gross')) })} />
        <Stat label={t('courses.dashboard.liveCourses')} value={num(live.length)} note={t('courses.dashboard.liveNote', { n: num(mine.length - live.length) })} />
      </div>
      <Panel title={t('courses.dashboard.yourCourses')}>
        <ul className="divide-y divide-line">
          {mine.map((course) => (
            <CourseRow key={course.id} course={course} base={base} stats={stats[course.id]} />
          ))}
        </ul>
        <p className="border-t border-line px-5 py-3 text-xs text-ink-2">{t('courses.dashboard.feeNote', { percent: num(PLATFORM_FEE_PERCENT) })}</p>
      </Panel>
    </div>
  )
}

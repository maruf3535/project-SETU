import { BadgeCheck, Check, CirclePlay, Clock3, School, Star, Undo2, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useI18n } from '../../i18n/I18nProvider'
import { useCourses } from '../../store/CoursesStore'
import { courseStats, totalMinutes, useCreatorName, useDuration } from './courseUtils'

const coverStyles = {
  teal: 'bg-primary text-primary-ink',
  amber: 'bg-accent text-accent-ink',
  mist: 'bg-surface-2 text-ink',
}

// A drawn 16:9 cover: level, title and a play mark
export function CourseCover({ course, className = '' }) {
  const { t, L, num } = useI18n()
  return (
    <div className={`relative flex aspect-video flex-col justify-between overflow-hidden rounded-xl p-3.5 ${coverStyles[course.cover] ?? coverStyles.teal} ${className}`} aria-hidden="true">
      <span className="text-[10px] font-semibold tracking-wide uppercase opacity-70">{t(`courses.levels.${course.level}`)}</span>
      <span className="line-clamp-2 pr-10 font-display text-lg leading-tight font-semibold">{L(course.title)}</span>
      <CirclePlay className="absolute right-3 bottom-3 size-8 opacity-80" strokeWidth={1.5} />
      <span className="absolute top-3 right-3 rounded-full bg-black/25 px-2 py-0.5 text-[10px] font-semibold text-white tabular-nums">
        {t('courses.lecturesN', { n: num(course.lectures.length) })}
      </span>
    </div>
  )
}

export function Stars({ value, className = 'size-4' }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`${className} ${value >= n - 0.25 ? 'fill-accent text-accent' : 'text-line'}`} />
      ))}
    </span>
  )
}

// Five tappable stars
export function StarInput({ value, onChange }) {
  const { t, num } = useI18n()
  return (
    <div role="radiogroup" aria-label={t('courses.rate.question')} className="flex justify-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={t('courses.rate.starsN', { n: num(n) })}
          onClick={() => onChange(n)}
          className="rounded-lg p-1 transition-transform hover:scale-110"
        >
          <Star className={`size-9 ${value >= n ? 'fill-accent text-accent' : 'text-line'}`} />
        </button>
      ))}
    </div>
  )
}

export function PriceLabel({ price, className = '' }) {
  const { t, money } = useI18n()
  return price > 0 ? (
    <span className={`font-semibold tabular-nums ${className}`}>{money(price)}</span>
  ) : (
    <span className={`font-semibold text-ok ${className}`}>{t('courses.free')}</span>
  )
}

export function RatingLine({ stats, className = '' }) {
  const { t, num } = useI18n()
  return (
    <span className={`inline-flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-ink-2 ${className}`}>
      {stats.ratingCount > 0 ? (
        <span className="inline-flex items-center gap-1">
          <Star className="size-3.5 fill-accent text-accent" aria-hidden="true" />
          <span className="font-semibold text-ink">{num(stats.rating)}</span>
          <span>({t('courses.ratingsN', { n: num(stats.ratingCount) })})</span>
        </span>
      ) : (
        <span>{t('courses.noRatings')}</span>
      )}
      <span className="inline-flex items-center gap-1">
        <Users className="size-3.5" aria-hidden="true" /> {t('courses.enrolledN', { n: num(stats.enrolled) })}
      </span>
    </span>
  )
}

const statusStyles = {
  live: { className: 'bg-ok-soft text-ok', icon: BadgeCheck },
  review: { className: 'bg-warn-soft text-warn', icon: Clock3 },
  returned: { className: 'bg-bad-soft text-bad', icon: Undo2 },
  // An edit to a live course
  revisionReview: { className: 'bg-warn-soft text-warn', icon: Clock3 },
  revisionReturned: { className: 'bg-bad-soft text-bad', icon: Undo2 },
}

export function CourseStatusPill({ status }) {
  const { t } = useI18n()
  const { className, icon: Icon } = statusStyles[status] ?? statusStyles.review
  return (
    <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${className}`}>
      <Icon className="size-3.5" /> {t(`courses.status.${status}`)}
    </span>
  )
}

export function RoleTag({ role }) {
  const { t } = useI18n()
  return <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-semibold text-ink-2">{t(`courses.roles.${role}`)}</span>
}

// Shown under every player: the demo plays one shared sample file
export function DemoVideoNote({ className = '' }) {
  const { t } = useI18n()
  return (
    <p className={`inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-warn ${className}`}>
      <CirclePlay className="size-3.5" /> {t('courses.player.demoTag')}
    </p>
  )
}

export function CourseCard({ course, to, enrolled, recommended }) {
  const { t, L } = useI18n()
  const store = useCourses()
  const creatorName = useCreatorName()
  const duration = useDuration()
  const stats = courseStats(course, store)
  return (
    <Link to={to} className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-3 transition-colors hover:border-primary">
      <CourseCover course={course} className="transition-transform group-hover:-translate-y-0.5" />
      <p className="mt-3 leading-snug font-semibold group-hover:text-primary">{L(course.title)}</p>
      <p className="mt-1 flex min-w-0 items-center gap-1.5 text-xs text-ink-2">
        <span className="truncate">{creatorName(course)}</span>
        <RoleTag role={course.creatorRole} />
      </p>
      <RatingLine stats={stats} className="mt-2" />
      <div className="mt-auto flex items-center justify-between gap-2 pt-3 text-sm">
        <PriceLabel price={course.price} />
        <span className="inline-flex items-center gap-1 text-xs text-ink-2 tabular-nums">
          <Clock3 className="size-3.5" aria-hidden="true" /> {duration(totalMinutes(course))}
        </span>
      </div>
      {recommended && (
        <span className="mt-2 inline-flex items-start gap-1 text-xs font-semibold text-primary">
          <School className="mt-px size-3.5 shrink-0" /> {t('courses.recommended.by', { name: recommended.teacherName })}
        </span>
      )}
      {enrolled && (
        <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-ok">
          <Check className="size-3.5" /> {t('courses.enrolledTag')}
        </span>
      )}
    </Link>
  )
}

export function EmptyState({ icon: Icon, children, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-surface px-6 py-12 text-center">
      <Icon className="mx-auto size-8 text-primary" />
      <p className="mt-3 text-ink-2">{children}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function ProgressBar({ value, label }) {
  return (
    <div className="h-1.5 rounded-full bg-surface-2" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value * 100)}>
      <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${Math.round(value * 100)}%` }} />
    </div>
  )
}

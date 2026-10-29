import { School, Search, Tag } from 'lucide-react'
import { useState } from 'react'
import { inputStyles } from '../../components/ui'
import { POINTS_DISCOUNT } from '../../data/demo/books'
import { COURSE_LEVELS } from '../../data/demo/courses'
import { useI18n } from '../../i18n/I18nProvider'
import { useCourses, useLiveCourses } from '../../store/CoursesStore'
import { topicLabel, useCreatorName, useRecommendations } from './courseUtils'
import { CourseCard } from './shared'

const PRICES = ['all', 'free', 'paid']

// Live courses only. Anyone can browse; only students get the reward-points deal.
export default function Catalog({ base, user }) {
  const { t, L, num } = useI18n()
  const { enrollments } = useCourses()
  const live = useLiveCourses()
  const creatorName = useCreatorName()
  const recommendations = useRecommendations(user)
  const recommended = live.filter((c) => recommendations[c.id])
  const [level, setLevel] = useState('all')
  const [price, setPrice] = useState('all')
  const [query, setQuery] = useState('')

  const q = query.trim().toLowerCase()
  const shown = live.filter((c) => {
    const topic = topicLabel(c.topic)
    const text = [c.title.en, c.title.bn, creatorName(c), typeof topic === 'string' ? topic : `${topic.en} ${topic.bn}`]
    return (
      (level === 'all' || c.level === level) &&
      (price === 'all' || (price === 'free' ? c.price === 0 : c.price > 0)) &&
      (!q || text.some((s) => s.toLowerCase().includes(q)))
    )
  })
  const enrolled = (id) => enrollments.some((e) => e.courseId === id && e.userId === user?.id)

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label htmlFor="course-search" className="relative min-w-0 flex-1 sm:max-w-sm">
          <span className="sr-only">{t('courses.catalog.search')}</span>
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-2" />
          <input id="course-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('courses.catalog.search')} className={`${inputStyles} pl-10`} />
        </label>
        <div className="inline-flex rounded-xl border border-line bg-surface p-1" role="group" aria-label={t('courses.catalog.priceFilter')}>
          {PRICES.map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={price === key}
              onClick={() => setPrice(key)}
              className={`rounded-lg px-3.5 py-1.5 text-sm font-semibold ${price === key ? 'bg-brand text-brand-ink' : 'text-ink-2'}`}
            >
              {t(`courses.catalog.prices.${key}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="-mx-1 mb-5 flex gap-2 overflow-x-auto px-1 pb-1" role="group" aria-label={t('courses.catalog.levelFilter')}>
        {['all', ...COURSE_LEVELS].map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={level === key}
            onClick={() => setLevel(key)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-semibold ${level === key ? 'border-brand bg-brand text-brand-ink' : 'border-line bg-surface text-ink-2 hover:text-ink'}`}
          >
            {key === 'all' ? t('courses.catalog.allLevels') : t(`courses.levels.${key}`)}
          </button>
        ))}
      </div>

      {user?.role === 'student' && (
        <p className="mb-5 flex items-center gap-2.5 rounded-2xl bg-accent-soft px-4 py-3 text-sm">
          <Tag className="size-4 shrink-0 text-warn" /> {t('courses.catalog.deal', { points: num(POINTS_DISCOUNT.points), percent: num(POINTS_DISCOUNT.percent) })}
        </p>
      )}

      {recommended.length > 0 && (
        <section className="mb-6 rounded-2xl border border-line bg-surface-2/50 p-4" aria-labelledby="course-recommended">
          <h3 id="course-recommended" className="flex items-center gap-2 font-semibold">
            <School className="size-5 text-primary" /> {t('courses.recommended.heading')}
          </h3>
          <p className="mt-0.5 text-sm text-ink-2">
            {t('courses.recommended.body', { name: recommendations[recommended[0].id].teacherName, section: L(recommendations[recommended[0].id].section) })}
          </p>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recommended.map((course) => (
              <li key={course.id}>
                <CourseCard course={course} to={`${base}/${course.id}`} enrolled={enrolled(course.id)} recommended={recommendations[course.id]} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {shown.length ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((course) => (
            <li key={course.id}>
              <CourseCard course={course} to={`${base}/${course.id}`} enrolled={enrolled(course.id)} recommended={recommendations[course.id]} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-10 text-center text-ink-2">{t('courses.catalog.empty')}</p>
      )}
    </div>
  )
}

import { ListVideo } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import { useLiveCourses } from '../../store/CoursesStore'
import { CourseCard } from './shared'

// A creator's live courses for their public profile. Renders nothing when they have none.
// `linkBase` is where a card opens; public profiles sit outside the portals, so it defaults to the student catalog.
export default function CreatorCoursesSection({ creatorId, linkBase = '/student/courses', className = '' }) {
  const { t, num } = useI18n()
  const mine = useLiveCourses().filter((c) => c.creatorId === creatorId)
  if (!mine.length) return null

  return (
    <section className={className} aria-labelledby={`creator-courses-${creatorId}`}>
      <h3 id={`creator-courses-${creatorId}`} className="flex items-center gap-2 text-xs font-semibold tracking-[0.12em] text-ink-2 uppercase">
        <ListVideo className="size-4" /> {t('courses.profile.heading', { n: num(mine.length) })}
      </h3>
      <ul className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mine.map((course) => (
          <li key={course.id}>
            <CourseCard course={course} to={`${linkBase}/${course.id}`} />
          </li>
        ))}
      </ul>
    </section>
  )
}

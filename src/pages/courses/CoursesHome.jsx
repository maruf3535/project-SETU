import { LayoutGrid, ListVideo, Presentation } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { PageIntro } from '../../components/ui'
import { useI18n } from '../../i18n/I18nProvider'
import { useCourses } from '../../store/CoursesStore'
import Catalog from './Catalog'
import { useCourseRole, useCourseUser } from './courseUtils'
import CreatorDashboard from './CreatorDashboard'
import MyLearning from './MyLearning'

// Industry mainly teaches, so its page opens on its own courses
const TABS = {
  student: ['browse', 'learning', 'teaching'],
  teacher: ['browse', 'learning', 'teaching'],
  industry: ['teaching', 'browse'],
}
const TAB_ICONS = { browse: LayoutGrid, learning: ListVideo, teaching: Presentation }

function CoursesHome({ role: roleProp }) {
  const { t, num } = useI18n()
  const { role, base } = useCourseRole(roleProp)
  const user = useCourseUser(role)
  const { enrollments, courses } = useCourses()
  const [params, setParams] = useSearchParams()
  const tabs = TABS[role] ?? TABS.student
  const tab = tabs.includes(params.get('tab')) ? params.get('tab') : tabs[0]
  const show = (key) => setParams(key === tabs[0] ? {} : { tab: key }, { replace: true })

  const counts = {
    learning: enrollments.filter((e) => e.userId === user?.id).length,
    teaching: courses.filter((c) => c.creatorId === user?.id).length,
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageIntro title={t('courses.title')} body={t(`courses.body.${role === 'industry' ? 'industry' : 'default'}`)} />
      <div role="tablist" aria-label={t('courses.title')} className="mb-5 flex max-w-full overflow-x-auto">
        <div className="inline-flex rounded-xl border border-line bg-surface p-1">
          {tabs.map((key) => {
            const Icon = TAB_ICONS[key]
            return (
              <button
                key={key}
                type="button"
                role="tab"
                id={`courses-tab-${key}`}
                aria-selected={tab === key}
                aria-controls="courses-panel"
                onClick={() => show(key)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-1.5 text-sm font-semibold whitespace-nowrap ${tab === key ? 'bg-brand text-brand-ink' : 'text-ink-2 hover:text-ink'}`}
              >
                <Icon className="size-4" />
                {t(`courses.tabs.${key}`)}
                {counts[key] > 0 && (
                  <span className={`rounded-full px-1.5 text-xs tabular-nums ${tab === key ? 'bg-brand-ink/15' : 'bg-surface-2'}`}>{num(counts[key])}</span>
                )}
              </button>
            )
          })}
        </div>
      </div>
      <div id="courses-panel" role="tabpanel" aria-labelledby={`courses-tab-${tab}`}>
        {tab === 'browse' && <Catalog base={base} user={user} />}
        {tab === 'learning' && <MyLearning base={base} user={user} onBrowse={() => show('browse')} />}
        {tab === 'teaching' && <CreatorDashboard base={base} user={user} />}
      </div>
    </div>
  )
}

export function StudentCourses() {
  return <CoursesHome role="student" />
}

export function TeacherCourses() {
  return <CoursesHome role="teacher" />
}

export function IndustryCourses() {
  return <CoursesHome role="industry" />
}

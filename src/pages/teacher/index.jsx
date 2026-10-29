import { teacherLevels } from '../../data/demo/teacher'
import ClassNotes from './ClassNotes'
import Generator from './Generator'
import Home from './Home'
import LevelSwitcher from './LevelSwitcher'
import Omr from './Omr'
import Research from './Research'
import { teacherLevelOf } from './useTeacher'
import Written from './Written'
import { TeacherReviewerDesk } from '../reviews/ReviewerDesk'
import { CourseDetail, CoursePlayer, CreateCourse, TeacherCourses } from '../courses'
import WrittenDetail from './WrittenDetail'

// Built pages of the teacher portal, keyed by nav key from src/data/portals.js
export const pages = {
  home: Home,
  generator: Generator,
  omr: Omr,
  written: Written,
  classNotes: ClassNotes,
  reviewCopies: TeacherReviewerDesk,
  courses: TeacherCourses,
  research: Research,
}

// Pages reached from inside the portal but not listed in its navigation
export const extraRoutes = [
  { path: 'written/:id', element: WrittenDetail },
  { path: 'courses/new', element: CreateCourse },
  { path: 'courses/:id', element: CourseDetail },
  { path: 'courses/:id/edit', element: CreateCourse },
  { path: 'courses/:id/watch', element: CoursePlayer },
]

export function SidebarExtra() {
  return <LevelSwitcher tone="dark" />
}

// The signed-in teacher changes with the level switcher
export function getSidebarUser({ demo, i18n }) {
  const persona = teacherLevels[teacherLevelOf(demo.portalState)]
  return { name: persona.name, initials: persona.initials, detail: i18n.L(persona.detail) }
}

import { studentLevels } from '../../data/demo/studentLevels'
import Exam from './Exam'
import ExamResult from './ExamResult'
import Home from './Home'
import Learn from './Learn'
import LevelSwitcher from './LevelSwitcher'
import Notes from './Notes'
import Opportunities, { OpportunityDetail } from './Opportunities'
import Portfolio from './Portfolio'
import Store, { BookDetail } from './Store'
import Tutor from './Tutor'

// Built pages of the student portal, keyed by nav key from src/data/portals.js
export const pages = {
  home: Home,
  learn: Learn,
  exam: Exam,
  notes: Notes,
  store: Store,
  tutor: Tutor,
  portfolio: Portfolio,
  opportunities: Opportunities,
}

// Pages reached from inside the portal but not listed in its navigation
export const extraRoutes = [
  { path: 'exam/result', element: ExamResult },
  { path: 'store/:id', element: BookDetail },
  { path: 'opportunities/:id', element: OpportunityDetail },
]

export function SidebarExtra() {
  return <LevelSwitcher tone="dark" />
}

// The signed-in student changes with the level switcher
export function getSidebarUser({ demo, i18n }) {
  const student = demo.studentById[studentLevels[demo.studentLevel].studentId]
  return { name: student.name, initials: student.initials, detail: `${i18n.L(student.dept)} · ${student.university}` }
}

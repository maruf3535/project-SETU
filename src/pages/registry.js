import * as government from './government/index.jsx'
import ChallengeDetail from './industry/ChallengeDetail'
import IndustryChallenges from './industry/Challenges'
import IndustryOverview from './industry/Overview'
import PostChallenge from './industry/PostChallenge'
import Projects from './industry/Projects'
import Talent from './industry/Talent'
import { CourseDetail, CoursePlayer, CreateCourse, IndustryCourses } from './courses'
import * as publisher from './publisher/index.jsx'
import * as student from './student/index.jsx'
import * as teacher from './teacher/index.jsx'

const portalModules = { student, teacher, government, publisher }

// Built portal pages, keyed by `${role}:${nav key}`. Anything missing falls back to the placeholder.
export const pages = {
  'industry:overview': IndustryOverview,
  'industry:challenges': IndustryChallenges,
  'industry:postChallenge': PostChallenge,
  'industry:talent': Talent,
  'industry:projects': Projects,
  'industry:courses': IndustryCourses,
  ...Object.fromEntries(
    Object.entries(portalModules).flatMap(([role, mod]) => Object.entries(mod.pages).map(([key, page]) => [`${role}:${key}`, page])),
  ),
}

// Optional per-portal sidebar additions: a component under the user card (e.g. a level switcher)
// and a plain function ({ demo, i18n }) => ({ name, initials, detail }) for the signed-in user
export const sidebarExtras = Object.fromEntries(Object.entries(portalModules).map(([role, mod]) => [role, mod.SidebarExtra]))
export const sidebarUsers = Object.fromEntries(Object.entries(portalModules).map(([role, mod]) => [role, mod.getSidebarUser]))

// Pages reached from inside a portal but not shown in its navigation
export const extraRoutes = {
  industry: [
    { path: 'challenges/:id', element: ChallengeDetail },
    { path: 'courses/new', element: CreateCourse },
    { path: 'courses/:id', element: CourseDetail },
    { path: 'courses/:id/edit', element: CreateCourse },
    { path: 'courses/:id/watch', element: CoursePlayer },
  ],
  ...Object.fromEntries(Object.entries(portalModules).map(([role, mod]) => [role, mod.extraRoutes])),
}

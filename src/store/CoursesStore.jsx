import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { assignments, courses, enrollments, ratings, watched } from '../data/demo/courses'

// Courses and video lectures keep their own browser-only store, next to the shared demo store.
// Reward points still live in the demo store: a points purchase also dispatches addPoints there.
// Bump the version whenever the seed data changes, so browsers drop their old copy
const STORAGE_KEY = 'setu.courses.v2'

function seed() {
  return structuredClone({
    courses,
    // { courseId, userId, paid, pointsUsed, at }
    enrollments,
    // Lecture ids watched per `${userId}:${courseId}`
    watched,
    // { id, courseId, userId, name, initials, role, stars, comment, at }
    ratings,
    // Teachers pointing a class section to a course: { courseId, teacherId, sectionId, at }
    assignments,
  })
}

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    // Keys added to the seed after a browser saved its copy are filled in from the seed
    return raw ? { ...seed(), ...JSON.parse(raw) } : seed()
  } catch {
    return seed()
  }
}

// Seeded courses carry no history; rebuild their first steps from their dates
function historyOf(c) {
  if (c.history) return c.history
  const submitted = [{ status: 'review', at: c.submittedAt }]
  if (c.status === 'returned') return [...submitted, { status: 'returned', note: c.reviewNote, at: c.reviewedAt }]
  if (c.status === 'live' && c.reviewedAt) return [...submitted, { status: 'live', at: c.reviewedAt }]
  return submitted
}

function updateCourse(state, id, change) {
  return { ...state, courses: state.courses.map((c) => (c.id === id ? { ...c, ...change(c) } : c)) }
}

function reducer(state, action) {
  switch (action.type) {
    // A new course always starts in government review
    case 'addCourse':
      return { ...state, courses: [{ ...action.course, status: 'review', history: [{ status: 'review', at: action.course.submittedAt }] }, ...state.courses] }
    // The creator's edits; a returned course goes back into review
    case 'editCourse':
      return updateCourse(state, action.id, (c) => {
        const now = new Date().toISOString()
        return {
          ...action.changes,
          status: 'review',
          submittedAt: c.status === 'returned' ? now : c.submittedAt,
          history: [...historyOf(c), { status: c.status === 'returned' ? 'resubmitted' : 'edited', at: now }],
        }
      })
    // An edit to a live course waits as a revision; the live version stays on show until it is approved.
    // revision: the edited fields plus { status: review | returned, submittedAt, reviewNote }
    case 'reviseCourse':
      return updateCourse(state, action.id, (c) => {
        const now = new Date().toISOString()
        const event = c.revision?.status === 'returned' ? 'revisionResubmitted' : c.revision ? 'revisionEdited' : 'revision'
        return {
          revision: { ...action.changes, status: 'review', submittedAt: c.revision?.status === 'review' ? c.revision.submittedAt : now, reviewNote: null },
          history: [...historyOf(c), { status: event, at: now }],
        }
      })
    // Government decision: status live | returned, with the reviewer's note when sent back.
    // On a live course with a revision, the decision is about the revision.
    case 'reviewCourse':
      return updateCourse(state, action.id, (c) => {
        const now = new Date().toISOString()
        const event = { note: action.note || undefined, at: now }
        if (c.status === 'live' && c.revision) {
          if (action.status === 'live') {
            const { status: _status, submittedAt: _submitted, reviewNote: _note, ...fields } = c.revision
            return { ...fields, revision: null, reviewedAt: now, history: [...historyOf(c), { ...event, status: 'revisionLive' }] }
          }
          return { revision: { ...c.revision, status: 'returned', reviewNote: action.note }, history: [...historyOf(c), { ...event, status: 'revisionReturned' }] }
        }
        return {
          status: action.status,
          reviewNote: action.status === 'returned' ? action.note : null,
          reviewedAt: now,
          history: [...historyOf(c), { ...event, status: action.status }],
        }
      })
    case 'enroll':
      if (state.enrollments.some((e) => e.courseId === action.courseId && e.userId === action.userId)) return state
      return {
        ...state,
        enrollments: [
          ...state.enrollments,
          { courseId: action.courseId, userId: action.userId, paid: action.paid ?? 0, pointsUsed: action.pointsUsed ?? 0, at: new Date().toISOString() },
        ],
      }
    case 'watchLecture': {
      const key = `${action.userId}:${action.courseId}`
      const seen = state.watched[key] ?? []
      if (seen.includes(action.lectureId)) return state
      return { ...state, watched: { ...state.watched, [key]: [...seen, action.lectureId] } }
    }
    case 'rateCourse':
      if (state.ratings.some((r) => r.courseId === action.rating.courseId && r.userId === action.rating.userId)) return state
      return { ...state, ratings: [action.rating, ...state.ratings] }
    // Replaces this teacher's sections for the course
    case 'assignCourse':
      return {
        ...state,
        assignments: [
          ...state.assignments.filter((a) => !(a.courseId === action.courseId && a.teacherId === action.teacherId)),
          ...action.sectionIds.map((sectionId) => ({ courseId: action.courseId, teacherId: action.teacherId, sectionId, at: new Date().toISOString() })),
        ],
      }
    case 'reset':
      return seed()
    default:
      return state
  }
}

const CoursesContext = createContext(null)

export function CoursesStoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, readStored)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // storage can be blocked; the demo still works until the page reloads
    }
  }, [state])

  const value = useMemo(() => {
    const courseById = Object.fromEntries(state.courses.map((c) => [c.id, c]))
    return { ...state, dispatch, courseById }
  }, [state])

  return <CoursesContext.Provider value={value}>{children}</CoursesContext.Provider>
}

export function useCourses() {
  return useContext(CoursesContext)
}

// Live courses only: what the catalog and public profiles show
export function useLiveCourses() {
  const { courses: list } = useCourses()
  return list.filter((c) => c.status === 'live')
}


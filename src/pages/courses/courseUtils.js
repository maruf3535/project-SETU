import { useLocation } from 'react-router-dom'
import { subjectLabel } from '../../data/curriculum'
import { COURSE_QUALIFY_SCORE, PLATFORM_FEE_PERCENT, RATE_AFTER, studentSections, SUBJECT_LABELS } from '../../data/demo/courses'
import { reviewerPool } from '../../data/demo/reviews'
import { teacherLevels } from '../../data/demo/teacher'
import { useI18n } from '../../i18n/I18nProvider'
import { useCourses } from '../../store/CoursesStore'
import { useCurrentStudent, useDemo } from '../../store/DemoStore'
import { useTeacher } from '../teacher/useTeacher'

export const CREATOR_ROLES = ['student', 'teacher', 'industry']
export const INDUSTRY_USER = { id: 'agrosense', name: 'AgroSense Ltd.', initials: 'AS' }

// The portal these pages are mounted under, from the first part of the path (/student/courses → student)
export function useCourseRole(roleProp) {
  const { pathname } = useLocation()
  const role = roleProp ?? pathname.split('/')[1]
  return { role, base: `/${role}/courses` }
}

// Who is signed in, for the portal: the level's demo student, the level's teacher, or the industry account
export function useCourseUser(role) {
  const { student } = useCurrentStudent()
  const { persona } = useTeacher()
  if (role === 'student') return { id: student.id, name: student.name, initials: student.initials, role }
  if (role === 'teacher') return { id: persona.id, name: persona.name, initials: persona.initials, role, sections: persona.sections }
  if (role === 'industry') return { ...INDUSTRY_USER, role }
  return null
}

export function topicLabel(topic) {
  if (topic.kind === 'skill') return topic.skill
  return (topic.classId && subjectLabel(topic.classId, topic.subject)) || SUBJECT_LABELS[topic.subject] || topic.subject
}

export function sameTopic(a, b) {
  return a.kind === b.kind && (a.kind === 'skill' ? a.skill.toLowerCase() === b.skill.toLowerCase() : a.subject === b.subject)
}

// What a student may teach: every verified skill, and every subject with a practice score at or above the bar.
// Each entry: { topic, reason: { kind: 'skill' } | { kind: 'score', score } }
export function studentTopics(student) {
  const skills = (student?.skills ?? []).filter((s) => s.verified).map((s) => ({ topic: { kind: 'skill', skill: s.name }, reason: { kind: 'skill', level: s.level } }))
  const scores = Object.entries(reviewerPool.find((r) => r.id === student?.id)?.scores ?? {})
    .filter(([, score]) => score >= COURSE_QUALIFY_SCORE)
    .map(([subject, score]) => ({ topic: { kind: 'subject', subject }, reason: { kind: 'score', score } }))
  return [...scores, ...skills]
}

// Why this creator may teach this course: { ok, kind: teacher | industry | skill | score | none, ... }
export function qualificationFor(course, studentById) {
  if (course.creatorRole === 'teacher') {
    const persona = Object.values(teacherLevels).find((p) => p.id === course.creatorId)
    return { ok: true, kind: 'teacher', detail: persona?.detail }
  }
  if (course.creatorRole === 'industry') return { ok: true, kind: 'industry' }
  const match = studentTopics(studentById[course.creatorId]).find((q) => sameTopic(q.topic, course.topic))
  return match ? { ok: true, kind: match.reason.kind, score: match.reason.score, topic: course.topic } : { ok: false, kind: 'none', topic: course.topic }
}

// One line of text for a qualification
export function useQualificationText() {
  const { t, L, num } = useI18n()
  return (q) => {
    if (q.kind === 'teacher') return q.detail ? t('courses.qualify.teacherAt', { detail: L(q.detail) }) : t('courses.qualify.teacher')
    if (q.kind === 'industry') return t('courses.qualify.industry')
    const topic = L(topicLabel(q.topic))
    if (q.kind === 'skill') return t('courses.qualify.skill', { topic })
    if (q.kind === 'score') return t('courses.qualify.score', { score: num(q.score), topic })
    return t('courses.qualify.none', { topic })
  }
}

export function totalMinutes(course) {
  return course.lectures.reduce((sum, l) => sum + Number(l.minutes || 0), 0)
}

// "1 h 24 min" / "18 min"
export function useDuration() {
  const { t, num } = useI18n()
  return (minutes) => {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    if (!h) return t('courses.minutes', { n: num(m) })
    return m ? t('courses.hoursMinutes', { h: num(h), m: num(m) }) : t('courses.hours', { h: num(h) })
  }
}

// Enrollment count, rating and sales: numbers from before the demo plus what happened in it.
// Earnings use the list price: like the book store, SETU settles reward-point discounts with the creator.
export function courseStats(course, { enrollments, ratings }) {
  const joined = enrollments.filter((e) => e.courseId === course.id)
  // Seeded written ratings (rt-…) are already part of baseRating
  const added = ratings.filter((r) => r.courseId === course.id && !r.id.startsWith('rt-'))
  const count = course.baseRating.count + added.length
  const sum = course.baseRating.avg * course.baseRating.count + added.reduce((total, r) => total + r.stars, 0)
  const sales = course.price > 0 ? course.baseSales + joined.filter((e) => e.paid > 0 || e.pointsUsed > 0).length : 0
  const gross = sales * course.price
  const fee = Math.round((gross * PLATFORM_FEE_PERCENT) / 100)
  return {
    enrolled: course.baseEnrolled + joined.length,
    rating: count ? Math.round((sum / count) * 10) / 10 : 0,
    ratingCount: count,
    sales,
    gross,
    fee,
    earnings: gross - fee,
  }
}

// Everything about one course for the signed-in user
export function useCourseAccess(course, user) {
  const store = useCourses()
  const { studentById } = useDemo()
  if (!course) return null
  const enrollment = user && store.enrollments.find((e) => e.courseId === course.id && e.userId === user.id)
  const isCreator = Boolean(user && course.creatorId === user.id)
  const seen = (user && store.watched[`${user.id}:${course.id}`]) ?? []
  const watchedCount = course.lectures.filter((l) => seen.includes(l.id)).length
  const myRating = user && store.ratings.find((r) => r.courseId === course.id && r.userId === user.id)
  return {
    enrolled: Boolean(enrollment),
    enrollment,
    isCreator,
    // Creators and enrolled learners open every lecture; anyone else only the free previews
    canWatch: (lecture) => isCreator || Boolean(enrollment) || lecture.preview,
    seen,
    watchedCount,
    progress: course.lectures.length ? watchedCount / course.lectures.length : 0,
    myRating,
    canRate: Boolean(enrollment) && !isCreator && !myRating && watchedCount / course.lectures.length >= RATE_AFTER,
    stats: courseStats(course, store),
    qualification: qualificationFor(course, studentById),
  }
}

// The creator's current name: a student's renamed profile shows here too
export function useCreatorName() {
  const { studentById } = useDemo()
  return (course) => (course.creatorRole === 'student' ? (studentById[course.creatorId]?.name ?? course.creatorName) : course.creatorName)
}

// Everything waiting for the government review team: new courses and edits to live courses, oldest first.
// Pure, so other review screens can list them: coursesAwaitingReview(useCourses().courses)
// → [{ id, kind: 'new' | 'revision', title: { en, bn }, creatorName, creatorRole, lectures, submittedAt }]
// Each id opens at /government/courses/:id
export function coursesAwaitingReview(courses) {
  return courses
    .map((c) => {
      const revision = c.status === 'live' && c.revision?.status === 'review'
      if (c.status !== 'review' && !revision) return null
      const shown = revision ? c.revision : c
      const title = typeof shown.title === 'string' ? { en: shown.title, bn: shown.title } : shown.title
      return { id: c.id, kind: revision ? 'revision' : 'new', title, creatorName: c.creatorName, creatorRole: c.creatorRole, lectures: shown.lectures.length, submittedAt: shown.submittedAt }
    })
    .filter(Boolean)
    .sort((a, b) => a.submittedAt.localeCompare(b.submittedAt))
}

// The course as it would look once its pending revision is approved
export function withRevision(course) {
  if (!course.revision) return course
  const { status: _status, submittedAt: _submitted, reviewNote: _note, ...fields } = course.revision
  return { ...course, ...fields }
}

// What a revision changes, for the reviewer: [{ key, from?, to?, lecture? }] where from/to are raw values
export function revisionChanges(course) {
  if (!course.revision) return []
  const next = course.revision
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)
  const changes = []
  for (const key of ['title', 'about', 'price', 'level', 'topic', 'cover']) {
    if (!same(course[key], next[key])) changes.push({ key, from: course[key], to: next[key] })
  }
  const before = Object.fromEntries(course.lectures.map((l) => [l.id, l]))
  const after = Object.fromEntries(next.lectures.map((l) => [l.id, l]))
  for (const l of next.lectures) {
    const old = before[l.id]
    if (!old) changes.push({ key: 'lectureAdded', lecture: l })
    else {
      if (!same(old.title, l.title)) changes.push({ key: 'lectureRenamed', from: old.title, to: l.title })
      if (Number(old.minutes) !== Number(l.minutes)) changes.push({ key: 'lectureMinutes', lecture: l, from: old.minutes, to: l.minutes })
      if (Boolean(old.preview) !== Boolean(l.preview)) changes.push({ key: l.preview ? 'previewOn' : 'previewOff', lecture: l })
    }
  }
  for (const l of course.lectures) if (!after[l.id]) changes.push({ key: 'lectureRemoved', lecture: l })
  const order = (list) => list.map((l) => l.id).filter((id) => before[id] && after[id])
  if (!same(order(course.lectures), order(next.lectures))) changes.push({ key: 'lectureOrder' })
  return changes
}

// Courses the signed-in student's teacher assigned to their section: courseId → { teacherName, section }
export function useRecommendations(user) {
  const { assignments } = useCourses()
  const seat = user?.role === 'student' ? studentSections[user.id] : null
  if (!seat) return {}
  const teacher = Object.values(teacherLevels).find((p) => p.id === seat.teacherId)
  const section = teacher?.sections.find((s) => s.id === seat.sectionId)
  return Object.fromEntries(
    assignments
      .filter((a) => a.teacherId === seat.teacherId && a.sectionId === seat.sectionId)
      .map((a) => [a.courseId, { teacherName: teacher?.name ?? a.teacherId, section: section?.label ?? a.sectionId }]),
  )
}

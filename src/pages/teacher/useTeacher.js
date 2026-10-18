import { teacherLevels, writtenQuestions } from '../../data/demo/teacher'
import { useDemo } from '../../store/DemoStore'

export const LEVEL_KEY = 'teacher.level'

// Reads the level from the demo store; 'school' until the switcher is used
export function teacherLevelOf(portalState) {
  return portalState?.[LEVEL_KEY] === 'university' ? 'university' : 'school'
}

// The signed-in teacher for the current level, plus a reader/writer for this portal's saved state
export function useTeacher() {
  const { portalState, dispatch } = useDemo()
  const level = teacherLevelOf(portalState)
  return {
    level,
    persona: teacherLevels[level],
    saved: (name, fallback) => portalState?.[`teacher.${name}`] ?? fallback,
    save: (name, value) => dispatch({ type: 'setPortalState', key: `teacher.${name}`, value }),
  }
}

// Exams for the current level: the seeded ones plus anything published from the generator
export function useExams() {
  const { level, persona, saved } = useTeacher()
  const published = saved('published', []).filter((e) => e.level === level)
  return [...published, ...persona.exams]
}

// Written-answer checking progress: the seeded count plus scripts confirmed in this demo
export function useWrittenProgress() {
  const { level, persona, saved } = useTeacher()
  const confirmed = saved('written', {})
  const scripts = writtenQuestions[level].scripts
  const done = scripts.filter((s) => confirmed[s.id]).length
  return { total: persona.stats.scriptsTotal, checked: persona.stats.scriptsChecked + done, confirmed, scripts }
}

export function sectionLabel(persona, id) {
  return persona.sections.find((s) => s.id === id)?.label ?? id
}

// Ids and timestamps for records created by a click
export function newId(prefix) {
  return `${prefix}-${Date.now()}`
}

export function nowIso() {
  return new Date().toISOString()
}

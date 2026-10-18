import { questionBank } from '../../data/demo/questions'
import { studentLevels } from '../../data/demo/studentLevels'

// Optional data modules: the extra subjects and the subject → chapter → topic catalog.
// Until they exist the page falls back to the original one-subject bank with chapters only.
const catalogModule = Object.values(import.meta.glob('../../data/demo/questionCatalog.js', { eager: true }))[0] ?? {}
const extraModule = Object.values(import.meta.glob('../../data/demo/questionsExtra.js', { eager: true }))[0] ?? {}

export const boards = catalogModule.boards ?? {}

// Subject → { label, chapters: { key: { label, topics: { key: label } } } } for a level
export function catalogFor(level) {
  if (catalogModule.catalog?.[level]) return catalogModule.catalog[level]
  const config = studentLevels[level]
  const [subjectKey, label] = Object.entries(config.subjects)[0]
  return {
    [subjectKey]: { label, chapters: Object.fromEntries(Object.entries(config.chapters).map(([k, l]) => [k, { label: l, topics: {} }])) },
  }
}

// Every question for a level, with topic / board / year filled in for the original bank
export function questionsFor(level) {
  const meta = catalogModule.existingMeta ?? {}
  const base = questionBank[level].map((q) => ({ ...q, ...(meta[q.id] ?? {}) }))
  return [...base, ...(extraModule.extraQuestions?.[level] ?? [])]
}

// Difficulty from the share of students who answered correctly
export function difficultyOf(question) {
  if (question.solved >= 80) return 'easy'
  if (question.solved >= 60) return 'medium'
  return 'hard'
}

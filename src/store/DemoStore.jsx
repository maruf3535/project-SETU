import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { challenges } from '../data/demo/challenges'
import { projects } from '../data/demo/projects'
import { students } from '../data/demo/talent'

// One shared, browser-only store so an action in one portal shows up in the others
// (industry posts → government approves → student applies → industry pays).
// Bump the version whenever the seed data changes, so browsers drop their old copy
const STORAGE_KEY = 'setu.demo.v2'

function seed() {
  return structuredClone({ challenges, projects, students })
}

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : seed()
  } catch {
    return seed()
  }
}

function updateChallenge(state, id, change) {
  return { ...state, challenges: state.challenges.map((c) => (c.id === id ? { ...c, ...change(c) } : c)) }
}

function reducer(state, action) {
  switch (action.type) {
    case 'post':
      return { ...state, challenges: [action.challenge, ...state.challenges] }
    case 'approve':
      return updateChallenge(state, action.id, () => ({ status: 'open' }))
    case 'apply':
      return updateChallenge(state, action.id, (c) => ({ applicants: [...new Set([...c.applicants, action.studentId])] }))
    case 'invite':
      return updateChallenge(state, action.id, (c) => ({ invited: [...new Set([...c.invited, action.studentId])] }))
    case 'assign':
      return updateChallenge(state, action.id, () => ({ status: 'in_progress', solver: action.studentId, revisionNote: null }))
    case 'submit':
      return updateChallenge(state, action.id, () => ({ status: 'submitted', submission: action.submission }))
    case 'revise':
      return updateChallenge(state, action.id, () => ({ status: 'in_progress', revisionNote: action.note }))
    case 'accept': {
      // Escrow pays the solver and the delivery becomes verified evidence in their portfolio
      const challenge = state.challenges.find((c) => c.id === action.id)
      const next = updateChallenge(state, action.id, () => ({ status: 'paid', rating: action.rating }))
      return {
        ...next,
        students: next.students.map((s) =>
          s.id === challenge.solver
            ? {
                ...s,
                completed: s.completed + 1,
                earned: s.earned + challenge.reward,
                evidence: [
                  { title: challenge.title, kind: 'challenge', by: { en: `Paid challenge · ${challenge.org}`, bn: `পেইড চ্যালেঞ্জ · ${challenge.org}` } },
                  ...s.evidence,
                ],
              }
            : s,
        ),
      }
    }
    case 'releaseMilestone':
      return {
        ...state,
        projects: state.projects.map((p) => {
          if (p.id !== action.projectId) return p
          const milestones = p.milestones.map((m, i) => {
            if (i === action.index) return { ...m, status: 'paid' }
            if (i === action.index + 1 && m.status === 'upcoming') return { ...m, status: 'in_progress' }
            return m
          })
          return { ...p, milestones }
        }),
      }
    case 'reset':
      return seed()
    default:
      return state
  }
}

const DemoContext = createContext(null)

export function DemoStoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, readStored)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // storage can be blocked; the demo still works until the page reloads
    }
  }, [state])

  const value = useMemo(() => {
    const studentById = Object.fromEntries(state.students.map((s) => [s.id, s]))
    return { ...state, dispatch, studentById }
  }, [state])

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemo() {
  return useContext(DemoContext)
}

// Share of a challenge's skills the student holds: verified counts fully, self-reported counts half
export function matchScore(student, skills) {
  if (!skills.length) return 0
  const score = skills.reduce((sum, skill) => {
    const held = student.skills.find((s) => s.name === skill)
    return sum + (held ? (held.verified ? 1 : 0.5) : 0)
  }, 0)
  return Math.round((score / skills.length) * 100)
}

export const ESCROW_STATUSES = ['review', 'open', 'in_progress', 'submitted']

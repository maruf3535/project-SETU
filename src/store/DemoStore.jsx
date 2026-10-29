import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { books } from '../data/demo/books'
import { challenges } from '../data/demo/challenges'
import { notes } from '../data/demo/notes'
import { projects } from '../data/demo/projects'
import { bookReviews, reviewCalls, reviewCopies, reviewerCases } from '../data/demo/reviews'
import { studentLevels } from '../data/demo/studentLevels'
import { students } from '../data/demo/talent'

// One shared, browser-only store so an action in one portal shows up in the others
// (industry posts → government approves → student applies → industry pays).
// Bump the version whenever the seed data changes, so browsers drop their old copy
const STORAGE_KEY = 'setu.demo.v6'

function seed() {
  return structuredClone({
    challenges,
    projects,
    students,
    notes,
    books,
    studentLevel: 'university',
    // Reward points per demo student, keyed by student id
    points: Object.fromEntries(Object.values(studentLevels).map((l) => [l.studentId, l.points])),
    ratedNotes: [],
    purchases: [],
    roleApplications: [],
    lastExam: null,
    sales: [],
    promotions: [],
    profiles: {},
    portalState: {},
    seen: [],
    // Purchase details for My library: { studentId, bookId, paid, pointsUsed, at }
    purchaseLog: [],
    // Free copies given to students by their teachers
    freeCopies: [
      { studentId: 'st-rahim', bookId: 'bk-physics', from: 'Md. Kamrul Hasan', at: '2026-10-08' },
      { studentId: 'st-tasnim', bookId: 'bk-hsc-chem', from: 'Mymensingh Govt. College, Chemistry dept.', at: '2026-09-21' },
    ],
    // Last page read per `${studentId}:${bookId}`: { page, pages, at }
    reading: {},
    // Book reviewers: open calls, copies sent to reviewers, published reviews, government cases on reviewers
    reviewCalls,
    reviewCopies,
    bookReviews,
    reviewerCases,
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
    // Government review: send a challenge back to its poster with a note
    case 'returnChallenge':
      return updateChallenge(state, action.id, () => ({ status: 'returned', reviewNote: action.note }))
    // Government review of a guide book listing; status: live | review | fix
    case 'reviewBook':
      return { ...state, books: state.books.map((b) => (b.id === action.bookId ? { ...b, status: action.status, reviewNote: action.note ?? b.reviewNote } : b)) }
    case 'addBook':
      return { ...state, books: [action.book, ...state.books] }
    case 'promoteBook':
      return { ...state, promotions: [action.promotion, ...(state.promotions ?? [])] }
    // Free-form, persisted state a portal can keep without its own reducer case, e.g. key 'teacher.research'
    case 'setPortalState':
      return { ...state, portalState: { ...(state.portalState ?? {}), [action.key]: action.value } }
    // Saved profile edits; a student's new name also shows wherever other portals list that student
    case 'updateProfile': {
      const profiles = { ...(state.profiles ?? {}), [action.id]: { ...(state.profiles?.[action.id] ?? {}), ...action.changes } }
      const students = action.changes.name
        ? state.students.map((s) => (s.id === action.id ? { ...s, name: action.changes.name, initials: action.changes.initials ?? s.initials } : s))
        : state.students
      return { ...state, profiles, students }
    }
    case 'markSeen':
      return { ...state, seen: [...new Set([...(state.seen ?? []), ...action.ids])] }
    case 'setLevel':
      return { ...state, studentLevel: action.level }
    case 'addPoints':
      return { ...state, points: { ...state.points, [action.studentId]: (state.points[action.studentId] ?? 0) + action.amount } }
    case 'finishExam':
      return {
        ...state,
        lastExam: action.result,
        points: { ...state.points, [action.result.studentId]: (state.points[action.result.studentId] ?? 0) + action.result.earned },
      }
    case 'rateNote': {
      // A new rating moves the note's average and pays the rater 5 points
      const notes = state.notes.map((n) =>
        n.id === action.noteId
          ? { ...n, rating: Math.round(((n.rating * n.ratings + action.stars) / (n.ratings + 1)) * 10) / 10, ratings: n.ratings + 1 }
          : n,
      )
      return {
        ...state,
        notes,
        ratedNotes: [...state.ratedNotes, `${action.studentId}:${action.noteId}`],
        points: { ...state.points, [action.studentId]: (state.points[action.studentId] ?? 0) + 5 },
      }
    }
    case 'uploadNote':
      return { ...state, notes: [action.note, ...state.notes] }
    // status: reviewed | in_review | rejected
    case 'reviewNote':
      return { ...state, notes: state.notes.map((n) => (n.id === action.noteId ? { ...n, status: action.status, reviewNote: action.note ?? n.reviewNote } : n)) }
    case 'buyBook': {
      const book = state.books.find((b) => b.id === action.bookId)
      return {
        ...state,
        purchases: [...state.purchases, `${action.studentId}:${action.bookId}`],
        books: state.books.map((b) => (b.id === action.bookId ? { ...b, sold: b.sold + 1, readers: b.readers + 1 } : b)),
        points: action.pointsUsed
          ? { ...state.points, [action.studentId]: state.points[action.studentId] - action.pointsUsed }
          : state.points,
        sales: [...(state.sales ?? []), { bookId: book.id, amount: action.paid, at: new Date().toISOString() }],
        purchaseLog: [
          ...(state.purchaseLog ?? []),
          { studentId: action.studentId, bookId: book.id, paid: action.paid, pointsUsed: action.pointsUsed, at: new Date().toISOString() },
        ],
      }
    }
    case 'readPage':
      return { ...state, reading: { ...(state.reading ?? {}), [action.key]: { page: action.page, pages: action.pages, at: new Date().toISOString() } } }
    case 'applyRole':
      return { ...state, roleApplications: [...new Set([...state.roleApplications, `${action.studentId}:${action.roleId}`])] }
    case 'addSkill':
      return {
        ...state,
        students: state.students.map((s) =>
          s.id === action.studentId && !s.skills.some((x) => x.name === action.skill)
            ? { ...s, skills: [...s.skills, { name: action.skill, level: 'beginner', verified: false }] }
            : s,
        ),
      }
    // Book reviewers
    case 'openReviewCall':
      return { ...state, reviewCalls: [action.call, ...state.reviewCalls.filter((c) => c.bookId !== action.call.bookId)] }
    case 'closeReviewCall':
      return { ...state, reviewCalls: state.reviewCalls.filter((c) => c.bookId !== action.bookId) }
    case 'addReviewCopy':
      return { ...state, reviewCopies: [action.copy, ...state.reviewCopies] }
    // invited → reading (reviewer accepts), requested → reading (publisher sends the copy), or → declined.
    // A student reviewer keeps the book in My library for free.
    case 'setReviewCopy': {
      const copy = state.reviewCopies.find((c) => c.id === action.id)
      const book = state.books.find((b) => b.id === copy.bookId)
      const gift =
        action.status === 'reading' && copy.reviewerId.startsWith('st-') && !state.freeCopies.some((f) => f.studentId === copy.reviewerId && f.bookId === copy.bookId)
      return {
        ...state,
        reviewCopies: state.reviewCopies.map((c) => (c.id === action.id ? { ...c, status: action.status, at: new Date().toISOString() } : c)),
        freeCopies: gift
          ? [...state.freeCopies, { studentId: copy.reviewerId, bookId: copy.bookId, from: { en: `${book.publisher} · review copy`, bn: `${book.publisher} · রিভিউ কপি` }, at: new Date().toISOString() }]
          : state.freeCopies,
      }
    }
    case 'reviewCopyRead':
      return {
        ...state,
        reviewCopies: state.reviewCopies.map((c) => (c.id === action.id && !c.pagesSeen.includes(action.page) ? { ...c, pagesSeen: [...c.pagesSeen, action.page] } : c)),
      }
    // Publishes the review, pays the honorarium and, for students, adds portfolio evidence
    case 'submitBookReview': {
      const copy = state.reviewCopies.find((c) => c.id === action.copyId)
      const book = state.books.find((b) => b.id === copy.bookId)
      return {
        ...state,
        bookReviews: [action.review, ...state.bookReviews],
        reviewCopies: state.reviewCopies.map((c) => (c.id === copy.id ? { ...c, status: 'reviewed' } : c)),
        students: state.students.map((st) =>
          st.id === copy.reviewerId
            ? {
                ...st,
                earned: st.earned + copy.honorarium,
                evidence: [
                  { title: { en: `Book review: ${book.title.en}`, bn: `বই রিভিউ: ${book.title.bn}` }, kind: 'review', by: { en: `Review copy · ${book.publisher}`, bn: `রিভিউ কপি · ${book.publisher}` } },
                  ...st.evidence,
                ],
              }
            : st,
        ),
      }
    }
    case 'replyReview':
      return { ...state, bookReviews: state.bookReviews.map((r) => (r.id === action.id ? { ...r, reply: { text: action.text, at: new Date().toISOString() } } : r)) }
    case 'reportReview':
      return { ...state, bookReviews: state.bookReviews.map((r) => (r.id === action.id ? { ...r, status: 'reported', report: { reason: action.reason, note: action.note || undefined, at: new Date().toISOString() } } : r)) }
    // Government decision on a reported review: keep it public or remove it
    case 'decideReview':
      return {
        ...state,
        bookReviews: state.bookReviews.map((r) => (r.id === action.id ? { ...r, status: action.keep ? 'public' : 'removed', report: r.report && { ...r.report, decision: action.keep ? 'kept' : 'removed' } } : r)),
      }
    // Government case on a reviewer. suspended → (reviewer clarifies) clarified → cleared | upheld.
    // Upheld removes the reviewer's reviews and keeps them suspended.
    case 'reviewerCase': {
      const prev = state.reviewerCases[action.reviewerId] ?? {}
      const next = { ...prev, ...action.changes, history: [...(prev.history ?? []), { status: action.changes.status, at: new Date().toISOString() }] }
      return {
        ...state,
        reviewerCases: { ...state.reviewerCases, [action.reviewerId]: next },
        bookReviews:
          action.changes.status === 'upheld'
            ? state.bookReviews.map((r) => (r.reviewerId === action.reviewerId ? { ...r, status: 'removed' } : r))
            : state.bookReviews,
      }
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

// The demo student for the current level of the student portal
export function useCurrentStudent() {
  const { studentLevel, studentById, points } = useDemo()
  const level = studentLevels[studentLevel]
  const student = studentById[level.studentId]
  return { level: studentLevel, config: level, student, points: points[student.id] ?? 0 }
}

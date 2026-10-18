import { initialsOf, profiles } from '../../data/demo/profiles'
import { students as seedStudents } from '../../data/demo/talent'
import { researchTopics, teacherLevels } from '../../data/demo/teacher'

// Public, government-verified pages live at /#/u/<slug>. Anyone can open them without signing in.

export const slugify = (name) =>
  name
    .toLowerCase()
    .replace(/^(md|dr|mr|mrs|ms)\.?\s+/i, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const ROLE_CODE = { student: 'ST', teacher: 'TC', publisher: 'PB', industry: 'IN', government: 'GV' }
const reviewTeam = { en: 'Dhaka Division Review Team', bn: 'ঢাকা বিভাগ পর্যালোচনা টিম' }
const divisionTeam = (division) => ({
  en: `${division[0].toUpperCase()}${division.slice(1)} Division Review Team`,
  bn: 'বিভাগীয় পর্যালোচনা টিম',
})

// A stable, certificate-style number shown on the page, e.g. SETU-ST-2026-0412
function setuId(role, key) {
  const n = [...key].reduce((sum, ch) => (sum * 31 + ch.charCodeAt(0)) % 9000, 7) + 1000
  return `SETU-${ROLE_CODE[role]}-2026-${n}`
}

// Default privacy: organisations show contact details; individuals keep them private until they choose to share.
// Students' earnings are private by default too.
export function defaultPrivacy(role) {
  const person = role === 'student' || role === 'teacher'
  return { public: true, contact: !person, rating: true, earnings: role !== 'student' }
}

export const slugForProfile = (profileId, name) => (profileId === 'gov-dhaka' ? 'dhaka-review-team' : slugify(name))

// Every public record, merged with any saved profile edits
export function publicDirectory(demo) {
  const saved = demo.profiles ?? {}
  const seedFacts = Object.fromEntries(seedStudents.map((s) => [s.id, s]))
  const withEdits = (id, base) => {
    const edit = saved[id] ?? {}
    const fields = { ...(base.fields ?? {}), ...(edit.fields ?? {}) }
    return { ...base, ...edit, fields, privacy: { ...defaultPrivacy(base.role), ...(edit.privacy ?? {}) } }
  }

  const studentRecords = demo.students.map((s) => {
    const seed = profiles[s.id]
    const facts = seedFacts[s.id] ?? {}
    const base = withEdits(s.id, {
      role: 'student',
      email: seed?.email,
      phone: seed?.phone,
      bio: seed?.bio,
      verifiedBy: seed?.verifiedBy ?? divisionTeam(s.division),
      verifiedAt: seed?.verifiedAt ?? '2026-08-15',
    })
    return {
      ...base,
      id: s.id,
      slug: slugify(s.name),
      name: s.name,
      initials: s.initials,
      setuId: setuId('student', s.id),
      headline: s.dept,
      org: s.university,
      division: s.division,
      district: facts.district,
      student: s,
    }
  })

  const teacherRecords = Object.values(teacherLevels).map((persona) => {
    const record = withEdits(persona.id, profiles[persona.id])
    const name = record.fields.name
    return {
      ...record,
      id: persona.id,
      slug: slugify(name),
      name,
      initials: initialsOf(name),
      setuId: setuId('teacher', persona.id),
      headline: { en: `${record.fields.subject} teacher`, bn: `${record.fields.subject} শিক্ষক` },
      org: record.fields.institution,
      teacher: {
        persona,
        // Research topics are posted from the university level of the teacher portal
        topics: persona.id === teacherLevels.university.id ? (demo.portalState?.['teacher.research'] ?? researchTopics) : [],
        mentored: demo.challenges.filter((c) => c.mentor?.includes(persona.name.replace(/^Dr\.\s*/, ''))),
        projects: demo.projects.filter((p) => p.lead === persona.name),
      },
    }
  })

  const orgRecord = (id, role, extra) => {
    const record = withEdits(id, profiles[id])
    const name = record.fields.org ?? record.fields.office ?? record.fields.name
    return { ...record, id, slug: slugForProfile(id, name), name, initials: initialsOf(name), setuId: setuId(role, id), ...extra(record) }
  }

  const publisher = orgRecord('brightpage', 'publisher', () => ({
    headline: { en: 'Verified publisher', bn: 'যাচাইকৃত প্রকাশক' },
    publisher: { books: demo.books.filter((b) => b.publisherId === 'brightpage' && b.status === 'live') },
  }))
  const industry = orgRecord('agrosense', 'industry', () => {
    const posted = demo.challenges.filter((c) => c.orgId === 'agrosense')
    return {
      headline: { en: 'Verified organisation', bn: 'যাচাইকৃত প্রতিষ্ঠান' },
      industry: {
        posted,
        paid: posted.filter((c) => c.status === 'paid').reduce((sum, c) => sum + c.reward, 0),
        solvers: new Set(posted.filter((c) => c.solver).map((c) => c.solver)).size,
      },
    }
  })
  const government = orgRecord('gov-dhaka', 'government', (record) => ({
    name: record.fields.office,
    initials: 'DR',
    headline: { en: 'Government review & verification team', bn: 'সরকারি পর্যালোচনা ও যাচাই টিম' },
    government: { lead: record.fields.name, reviewed: 8430 + (demo.portalState?.['government.reviewed'] ?? 0) },
  }))

  return [...studentRecords, ...teacherRecords, publisher, industry, { ...government, slug: 'dhaka-review-team' }]
}

export function publicPathFor(record) {
  return `/u/${record.slug}`
}

// Absolute link for sharing (hash routing, so it works on GitHub Pages and Vercel alike)
export function publicUrlFor(record) {
  return `${window.location.origin}${window.location.pathname}#/u/${record.slug}`
}

export { reviewTeam }

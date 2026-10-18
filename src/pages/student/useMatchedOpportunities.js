import { roles } from '../../data/demo/opportunities'
import { matchScore, useCurrentStudent, useDemo } from '../../store/DemoStore'

// Paid challenges and roles in one list, scored against the current student's skills.
// Open challenges, invitations and the student's own work are all included.
export function useMatchedOpportunities() {
  const { challenges, roleApplications } = useDemo()
  const { student } = useCurrentStudent()

  const fromChallenges = challenges
    .filter((c) => c.status === 'open' || c.solver === student.id || c.invited.includes(student.id))
    .map((c) => ({
      id: c.id,
      kind: 'challenge',
      title: c.title,
      org: c.org,
      skills: c.skills,
      pay: c.reward,
      payUnit: 'total',
      deadline: c.deadline,
      challenge: c,
      invited: c.invited.includes(student.id),
      applied: c.applicants.includes(student.id),
      match: matchScore(student, c.skills),
    }))

  const fromRoles = roles.map((r) => ({
    ...r,
    applied: roleApplications.includes(`${student.id}:${r.id}`),
    match: matchScore(student, r.skills),
  }))

  return [...fromChallenges, ...fromRoles].sort((a, b) => Number(b.invited ?? false) - Number(a.invited ?? false) || b.match - a.match)
}

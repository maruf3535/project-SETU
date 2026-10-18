import { CalendarDays, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SkillChip, StatusPill } from '../../components/ui'
import { useI18n } from '../../i18n/I18nProvider'
import { useDemo } from '../../store/DemoStore'

// The signed-in organisation in the Industry portal
export const MY_ORG = { id: 'agrosense', name: 'AgroSense Ltd.' }

export function useOwnChallenges() {
  const { challenges } = useDemo()
  return challenges.filter((c) => c.orgId === MY_ORG.id)
}

export function ChallengeRow({ challenge }) {
  const { t, L, money, date, num } = useI18n()

  return (
    <Link
      to={`/industry/challenges/${challenge.id}`}
      className="group grid gap-3 px-5 py-4 transition-colors hover:bg-surface-2/60 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <StatusPill status={challenge.status} />
          <span className="text-xs text-ink-2">{t('industry.posted', { date: date(challenge.postedAt) })}</span>
        </div>
        <p className="mt-2 font-semibold group-hover:text-primary">{L(challenge.title)}</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-2">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-4" /> {t('common.due', { date: date(challenge.deadline, { day: 'numeric', month: 'short' }) })}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="size-4" /> {t('industry.applicantsCount', { n: num(challenge.applicants.length) })}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3 sm:flex-col sm:items-end">
        <span className="font-display text-xl font-semibold tabular-nums">{money(challenge.reward)}</span>
        <div className="hidden flex-wrap justify-end gap-1.5 sm:flex">
          {challenge.skills.slice(0, 2).map((skill) => (
            <SkillChip key={skill} name={skill} />
          ))}
        </div>
      </div>
    </Link>
  )
}

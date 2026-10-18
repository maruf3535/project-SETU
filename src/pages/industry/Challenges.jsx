import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { buttonStyles, PageIntro, Panel } from '../../components/ui'
import { useI18n } from '../../i18n/I18nProvider'
import { ChallengeRow, useOwnChallenges } from './shared'

const FILTERS = ['all', 'review', 'open', 'in_progress', 'submitted', 'paid']

export default function IndustryChallenges() {
  const { t, num } = useI18n()
  const mine = useOwnChallenges()
  const [filter, setFilter] = useState('all')
  const shown = filter === 'all' ? mine : mine.filter((c) => c.status === filter)

  return (
    <div className="mx-auto max-w-5xl">
      <PageIntro title={t('nav.challenges')}>
        <Link to="/industry/post" className={buttonStyles.accent}>
          <Plus className="size-4" /> {t('industry.postCta')}
        </Link>
      </PageIntro>

      <div className="-mx-1 mb-4 flex gap-2 overflow-x-auto px-1 pb-1">
        {FILTERS.map((key) => {
          const count = key === 'all' ? mine.length : mine.filter((c) => c.status === key).length
          const active = key === filter
          return (
            <button
              key={key}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(key)}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                active ? 'border-brand bg-brand text-brand-ink' : 'border-line bg-surface text-ink-2 hover:text-ink'
              }`}
            >
              {key === 'all' ? t('industry.filters.all') : t(`common.status.${key}`)}
              <span className="ml-1.5 tabular-nums opacity-70">{num(count)}</span>
            </button>
          )
        })}
      </div>

      <Panel>
        {shown.length ? (
          <div className="divide-y divide-line">
            {shown.map((challenge) => (
              <ChallengeRow key={challenge.id} challenge={challenge} />
            ))}
          </div>
        ) : (
          <p className="px-5 py-10 text-center text-ink-2">{t('industry.emptyFilter')}</p>
        )}
      </Panel>
    </div>
  )
}

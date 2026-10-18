import { ArrowRight, CircleCheck, Clock3, IdCard, Lock } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { buttonStyles, PageIntro, Panel, Stat } from '../../components/ui'
import { idRequests } from '../../data/demo/government'
import { useI18n } from '../../i18n/I18nProvider'
import { useDemo } from '../../store/DemoStore'
import { hoursWaiting, KIND_ICONS, useReviewedToday, useReviewQueue, useWaitLabel } from './review'
import { PriorityPill } from './shared'

const TABS = ['content', 'ids', 'notes']

export function QueueRow({ item }) {
  const { t, L, num } = useI18n()
  const waitLabel = useWaitLabel()
  const Icon = KIND_ICONS[item.kind]

  return (
    <Link
      to={`/government/review/${item.kind}/${item.id}`}
      className="group flex items-start gap-4 px-5 py-4 transition-colors hover:bg-surface-2/60 sm:items-center"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface-2 text-primary">
        <Icon className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold tracking-wide text-ink-2 uppercase">{t(`government.kinds.${item.kind}`)}</span>
          {item.priority && <PriorityPill />}
        </span>
        <span className="mt-1 block font-semibold group-hover:text-primary">{L(item.title)}</span>
        <span className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-sm text-ink-2">
          <span className="min-w-0">
            {t(`government.sources.${item.source}`)} · {item.by}
          </span>
          <span className="tabular-nums">{t(`government.sizes.${item.size.key}`, { n: num(item.size.n) })}</span>
        </span>
      </span>
      <span className="flex shrink-0 flex-col items-end gap-1 text-sm">
        <span className={`inline-flex items-center gap-1.5 tabular-nums ${item.priority ? 'font-semibold text-bad' : 'text-ink-2'}`}>
          <Clock3 className="size-4" /> {waitLabel(item.hours)}
        </span>
        <span className="hidden items-center gap-1 font-semibold text-primary sm:inline-flex">
          {t('government.queue.open')} <ArrowRight className="size-4" />
        </span>
      </span>
    </Link>
  )
}

function IdSummary({ pending }) {
  const { t, num } = useI18n()
  const waitLabel = useWaitLabel()
  const byRole = ['student', 'teacher', 'publisher', 'industry']
    .map((role) => [role, pending.filter((r) => r.role === role).length])
    .filter(([, n]) => n)
  const oldest = Math.max(0, ...pending.map((r) => hoursWaiting(r.submittedAt)))

  return (
    <div className="grid gap-5 p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
      <div className="min-w-0">
        <p className="font-display text-2xl font-semibold">{t('government.queue.idsPending', { n: num(pending.length) })}</p>
        {pending.length > 0 && (
          <>
            <ul className="mt-3 flex flex-wrap gap-2">
              {byRole.map(([role, n]) => (
                <li key={role} className="rounded-full bg-surface-2 px-3 py-1 text-sm">
                  {t(`roles.${role}`)} · <span className="tabular-nums">{num(n)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-ink-2">{t('government.queue.idsOldest', { wait: waitLabel(oldest) })}</p>
          </>
        )}
        <p className="mt-3 flex items-center gap-2 text-sm text-ink-2">
          <Lock className="size-4 shrink-0" /> {t('government.ids.privacy')}
        </p>
      </div>
      <Link to="/government/ids" className={buttonStyles.accent}>
        <IdCard className="size-4" /> {t('government.queue.openIds')}
      </Link>
    </div>
  )
}

export default function Queue() {
  const { t, num } = useI18n()
  const { portalState } = useDemo()
  const [params, setParams] = useSearchParams()
  const queue = useReviewQueue()
  const reviewed = useReviewedToday()

  const idDecisions = portalState?.['government.ids'] ?? {}
  const pendingIds = idRequests.filter((r) => !idDecisions[r.id])
  const tab = TABS.includes(params.get('tab')) ? params.get('tab') : 'content'
  const counts = {
    content: queue.filter((i) => i.tab === 'content').length,
    notes: queue.filter((i) => i.tab === 'notes').length,
    ids: pendingIds.length,
  }
  const rows = queue.filter((i) => i.tab === tab)
  const priority = queue.filter((i) => i.priority).length

  return (
    <div className="mx-auto max-w-6xl">
      <PageIntro title={t('government.queue.title')} body={t('government.queue.body')}>
        <span className="inline-flex items-center gap-2 rounded-full bg-ok-soft px-3.5 py-2 text-sm font-semibold text-ok">
          <CircleCheck className="size-4" /> {t('government.queue.reviewedToday', { n: num(reviewed) })}
        </span>
      </PageIntro>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat tone="brand" label={t('government.queue.statWaiting')} value={num(queue.length + pendingIds.length)} note={t('government.queue.statWaitingNote')} />
        <Stat label={t('government.queue.statPriority')} value={num(priority)} note={t('government.queue.statPriorityNote')} />
        <Stat label={t('government.queue.statReviewed')} value={num(reviewed)} />
      </div>

      <Panel className="mt-6">
        <div role="tablist" aria-label={t('government.queue.title')} className="flex gap-1 overflow-x-auto border-b border-line px-3 pt-2">
          {TABS.map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              id={`queue-tab-${key}`}
              aria-selected={tab === key}
              aria-controls="queue-panel"
              onClick={() => setParams(key === 'content' ? {} : { tab: key }, { replace: true })}
              className={`-mb-px inline-flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-sm font-semibold transition-colors ${
                tab === key ? 'border-accent text-ink' : 'border-transparent text-ink-2 hover:text-ink'
              }`}
            >
              {t(`government.queue.tabs.${key}`)}
              <span className={`rounded-full px-2 py-0.5 text-xs tabular-nums ${tab === key ? 'bg-accent text-accent-ink' : 'bg-surface-2'}`}>{num(counts[key])}</span>
            </button>
          ))}
        </div>

        <div id="queue-panel" role="tabpanel" aria-labelledby={`queue-tab-${tab}`}>
          {tab === 'ids' ? (
            <IdSummary pending={pendingIds} />
          ) : rows.length ? (
            <ul className="divide-y divide-line">
              {rows.map((item) => (
                <li key={`${item.kind}-${item.id}`}>
                  <QueueRow item={item} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="flex items-center gap-2 px-5 py-8 text-ink-2">
              <CircleCheck className="size-5 text-ok" /> {t('government.queue.empty')}
            </p>
          )}
        </div>
      </Panel>
    </div>
  )
}

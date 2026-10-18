import { BadgeCheck, CircleCheck, Clock3, Lock, TriangleAlert, X } from 'lucide-react'
import { useState } from 'react'
import Avatar from '../../components/Avatar'
import { usePasscode } from '../../components/Passcode'
import { useToast } from '../../components/Toast'
import { buttonStyles, Dialog, inputStyles, PageIntro } from '../../components/ui'
import { idRequests } from '../../data/demo/government'
import { useI18n } from '../../i18n/I18nProvider'
import { useDemo } from '../../store/DemoStore'
import { hoursWaiting, useCountReview, useWaitLabel } from './review'

const FILTERS = ['pending', 'done']

// Drawn document previews: an ID card, a letter, a certificate and a licence form
function DocPreview({ request }) {
  const { t, L, date } = useI18n()
  const { doc, name, initials, docNumber } = request
  const blurry = request.checks.includes('photoUnclear')
  const lines = (widths) =>
    widths.map((w, i) => <span key={i} className="block h-1 rounded-full bg-ink-2/30" style={{ width: `${w}%` }} />)

  if (doc === 'card') {
    return (
      <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-sm">
        <div className="flex items-center justify-between gap-2 bg-brand px-3 py-2 text-brand-ink">
          <span className="truncate text-[11px] font-semibold">{L(request.institution)}</span>
          <span className="shrink-0 text-[10px] tracking-[0.12em] uppercase opacity-70">{t('government.ids.docId')}</span>
        </div>
        <div className="flex gap-3 p-3">
          <span
            className={`grid h-20 w-16 shrink-0 place-items-center rounded-md bg-surface-2 font-display text-lg font-semibold text-ink-2 ${blurry ? 'blur-[2px]' : ''}`}
          >
            {initials}
          </span>
          <div className="min-w-0 flex-1 text-[11px] leading-snug">
            <p className="truncate font-semibold text-ink">{name}</p>
            <p className="truncate text-ink-2">{L(request.detail)}</p>
            <p className="mt-1.5 truncate text-ink-2 tabular-nums">{docNumber}</p>
            <span className="mt-2 flex h-4 gap-[2px]" aria-hidden="true">
              {[2, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 3, 1, 2, 1, 2].map((w, i) => (
                <span key={i} className="h-full bg-ink/70" style={{ width: `${w}px` }} />
              ))}
            </span>
          </div>
        </div>
      </div>
    )
  }

  if (doc === 'letter') {
    return (
      <div className="rounded-xl border border-line bg-surface p-3.5 shadow-sm">
        <p className="text-center text-[10px] font-semibold tracking-[0.1em] text-ink-2 uppercase">{t('government.ids.docLetterhead')}</p>
        <p className="mt-0.5 text-center text-[10px] text-ink-2 tabular-nums">{docNumber}</p>
        <p className="mt-2.5 text-[11px] font-semibold">{t('government.ids.docLetterSubject', { name })}</p>
        <div className="mt-2 grid gap-1.5">{lines([95, 88, 92, 60])}</div>
        <div className="mt-3 flex items-end justify-between">
          <span className="grid size-9 place-items-center rounded-full border-2 border-primary/60 text-[8px] font-bold text-primary/80">{t('government.ids.docSeal')}</span>
          <span className="w-20 border-t border-ink-2/50 pt-0.5 text-center text-[9px] text-ink-2">{t('government.ids.docSigned')}</span>
        </div>
      </div>
    )
  }

  if (doc === 'certificate') {
    return (
      <div className="rounded-xl border border-line bg-surface p-1.5 shadow-sm">
        <div className="rounded-lg border-2 border-double border-accent/70 px-3 py-3 text-center">
          <p className="text-[10px] tracking-[0.14em] text-ink-2 uppercase">{t('government.ids.docCertHead')}</p>
          <p className="mt-1 font-display text-base font-semibold">{L(request.docTitle)}</p>
          <p className="mt-1 text-[11px]">{name}</p>
          <p className="text-[10px] text-ink-2 tabular-nums">{docNumber}</p>
          <span className="mx-auto mt-2 grid size-8 place-items-center rounded-full bg-accent-soft text-accent">
            <BadgeCheck className="size-4" />
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-line bg-surface p-3 shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b border-line pb-2">
        <span className="text-[11px] font-semibold">{L(request.docTitle)}</span>
        <span className="text-[10px] text-ink-2 tabular-nums">{docNumber}</span>
      </div>
      <dl className="mt-2 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 text-[11px]">
        <dt className="text-ink-2">{t('government.ids.docBusiness')}</dt>
        <dd className="truncate font-semibold">{name}</dd>
        <dt className="text-ink-2">{t('government.ids.docAddress')}</dt>
        <dd className="truncate">{L(request.institution)}</dd>
        <dt className="text-ink-2">{t('government.ids.docValid')}</dt>
        <dd className="tabular-nums">{date('2027-06-30')}</dd>
      </dl>
      <div className="mt-2 grid gap-1.5">{lines([80, 65])}</div>
    </div>
  )
}

function PreCheck({ checks }) {
  const { t } = useI18n()
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label={t('government.ids.precheck')}>
      {checks.map((key) => {
        const flagged = key === 'photoUnclear'
        return (
          <li
            key={key}
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${flagged ? 'bg-warn-soft text-warn' : 'bg-ok-soft text-ok'}`}
          >
            {flagged ? <TriangleAlert className="size-3.5" /> : <CircleCheck className="size-3.5" />}
            {t(`government.ids.checks.${key}`)}
          </li>
        )
      })}
    </ul>
  )
}

function RequestCard({ request, decision, onApprove, onReject }) {
  const { t, L } = useI18n()
  const waitLabel = useWaitLabel()

  return (
    <li className="grid gap-4 rounded-2xl border border-line bg-surface p-5 md:grid-cols-[minmax(0,1fr)_17rem]">
      <div className="flex min-w-0 flex-col gap-3">
        <div className="flex items-start gap-3">
          <Avatar initials={request.initials} className="size-11 text-sm" />
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 font-semibold">
              <span className="truncate">{request.name}</span>
              {decision?.status === 'approved' && <BadgeCheck className="size-4 shrink-0 text-primary" aria-label={t('common.verified')} />}
            </p>
            <p className="text-sm text-ink-2">
              {t(`roles.${request.role}`)} · {L(request.detail)}
            </p>
            <p className="text-sm text-ink-2">
              {L(request.institution)} · {t(`common.divisions.${request.division}`)}
            </p>
          </div>
        </div>
        <p className="flex items-center gap-1.5 text-xs text-ink-2">
          <Clock3 className="size-3.5" />{' '}
          {hoursWaiting(request.submittedAt) < 1 ? t('government.wait.now') : t('government.ids.submitted', { wait: waitLabel(hoursWaiting(request.submittedAt)) })} ·{' '}
          {L(request.docTitle)}
        </p>
        <div>
          <p className="mb-1.5 text-xs font-semibold tracking-[0.12em] text-ink-2 uppercase">{t('government.ids.precheck')}</p>
          <PreCheck checks={request.checks} />
        </div>

        <div className="mt-auto pt-1">
          {!decision && (
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => onApprove(request)} className={buttonStyles.accent}>
                <BadgeCheck className="size-4" /> {t('government.ids.approve')}
              </button>
              <button type="button" onClick={() => onReject(request)} className={buttonStyles.ghost}>
                <X className="size-4" /> {t('government.ids.reject')}
              </button>
            </div>
          )}
          {decision?.status === 'approved' && (
            <p className="inline-flex items-center gap-2 rounded-full bg-ok-soft px-3 py-1.5 text-sm font-semibold text-ok">
              <BadgeCheck className="size-4" /> {t('government.ids.approvedState')}
            </p>
          )}
          {decision?.status === 'rejected' && (
            <p className="rounded-xl bg-bad-soft px-3 py-2 text-sm text-ink">
              <span className="font-semibold text-bad">{t('government.ids.rejectedState')}</span> {decision.reason}
            </p>
          )}
        </div>
      </div>
      <div className="min-w-0">
        <p className="mb-1.5 text-xs font-semibold tracking-[0.12em] text-ink-2 uppercase">{t('government.ids.document')}</p>
        <DocPreview request={request} />
      </div>
    </li>
  )
}

export default function Ids() {
  const { t, L, num } = useI18n()
  const { portalState, dispatch } = useDemo()
  const toast = useToast()
  const confirmPasscode = usePasscode()
  const countReview = useCountReview()
  const [filter, setFilter] = useState('pending')
  const [rejecting, setRejecting] = useState(null)
  const [reason, setReason] = useState('')

  const decisions = portalState?.['government.ids'] ?? {}
  const pending = idRequests.filter((r) => !decisions[r.id]).sort((a, b) => hoursWaiting(b.submittedAt) - hoursWaiting(a.submittedAt))
  const done = idRequests.filter((r) => decisions[r.id])
  const shown = filter === 'pending' ? pending : done
  const quickReasons = t('government.ids.quickReasons')

  function decide(request, value) {
    dispatch({ type: 'setPortalState', key: 'government.ids', value: { ...decisions, [request.id]: value } })
    countReview()
  }

  async function approve(request) {
    if (!(await confirmPasscode(t('passcode.actions.approveId', { name: request.name })))) return
    decide(request, { status: 'approved' })
    toast(t('government.ids.approvedToast', { name: request.name }))
  }

  async function confirmReject(event) {
    event.preventDefault()
    if (!(await confirmPasscode(t('passcode.actions.rejectId', { name: rejecting.name })))) return
    decide(rejecting, { status: 'rejected', reason: reason.trim() })
    toast(t('government.ids.rejectedToast', { name: rejecting.name }))
    setRejecting(null)
    setReason('')
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageIntro title={t('government.ids.title')} body={t('government.ids.body')} />

      <p className="mb-5 flex items-start gap-2.5 rounded-2xl bg-brand px-4 py-3 text-sm text-brand-ink">
        <Lock className="mt-0.5 size-4 shrink-0 text-accent" /> {t('government.ids.privacy')}
      </p>

      <div className="mb-4 flex gap-2" role="group" aria-label={t('government.ids.filterLabel')}>
        {FILTERS.map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={filter === key}
            onClick={() => setFilter(key)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
              filter === key ? 'bg-ink text-canvas' : 'border border-line bg-surface text-ink-2 hover:text-ink'
            }`}
          >
            {t(`government.ids.filters.${key}`)} <span className="tabular-nums">· {num(key === 'pending' ? pending.length : done.length)}</span>
          </button>
        ))}
      </div>

      {shown.length ? (
        <ul className="grid gap-4">
          {shown.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              decision={decisions[request.id]}
              onApprove={approve}
              onReject={(r) => {
                setRejecting(r)
                setReason('')
              }}
            />
          ))}
        </ul>
      ) : (
        <p className="flex items-center gap-2 rounded-2xl border border-line bg-surface px-5 py-8 text-ink-2">
          <CircleCheck className="size-5 text-ok" /> {filter === 'pending' ? t('government.ids.emptyPending') : t('government.ids.emptyDone')}
        </p>
      )}

      <Dialog open={Boolean(rejecting)} title={rejecting ? t('government.ids.rejectTitle', { name: rejecting.name }) : ''} onClose={() => setRejecting(null)}>
        {rejecting && (
          <form onSubmit={confirmReject} className="grid gap-3">
            <p className="text-sm text-ink-2">{t('government.ids.rejectBody', { doc: L(rejecting.docTitle) })}</p>
            <div className="flex flex-wrap gap-2">
              {quickReasons.map((text) => (
                <button
                  key={text}
                  type="button"
                  aria-pressed={reason === text}
                  onClick={() => setReason(text)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${reason === text ? 'bg-ink text-canvas' : 'bg-surface-2 text-ink'}`}
                >
                  {text}
                </button>
              ))}
            </div>
            <label htmlFor="reject-reason" className="text-sm font-semibold">
              {t('government.ids.reasonLabel')}
            </label>
            <textarea
              id="reject-reason"
              required
              rows={3}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder={t('government.ids.reasonPlaceholder')}
              className={inputStyles}
            />
            <div className="flex flex-wrap gap-2">
              <button type="submit" disabled={!reason.trim()} className={buttonStyles.primary}>
                {t('government.ids.confirmReject')}
              </button>
              <button type="button" onClick={() => setRejecting(null)} className={buttonStyles.ghost}>
                {t('common.cancel')}
              </button>
            </div>
          </form>
        )}
      </Dialog>
    </div>
  )
}

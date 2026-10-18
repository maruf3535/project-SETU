import { BadgeCheck, Check, CircleCheck, ImageUp, Info, LoaderCircle, ShieldCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { signupFields } from '../../data/onboarding'
import { portals, ROLES } from '../../data/portals'
import { useI18n } from '../../i18n/I18nProvider'
import OnboardingLayout from './OnboardingLayout'

// Screen 03 · Verify your ID. phase: idle → review → approving → verified
export default function Verify() {
  const { role } = useParams()
  const { t, lang } = useI18n()
  const [phase, setPhase] = useState('idle')
  const [upload, setUpload] = useState(null)
  const [submittedAt, setSubmittedAt] = useState(null)

  useEffect(() => {
    if (phase !== 'approving') return undefined
    const timer = setTimeout(() => setPhase('verified'), 1600)
    return () => clearTimeout(timer)
  }, [phase])

  useEffect(() => () => upload?.url && URL.revokeObjectURL(upload.url), [upload])

  if (!ROLES.includes(role)) return <Navigate to="/onboarding" replace />

  const holderName = signupFields[role][0].value

  function submit(nextUpload) {
    setUpload(nextUpload)
    setSubmittedAt(new Date())
    setPhase('review')
  }

  function handleFile(event) {
    const file = event.target.files?.[0]
    if (file) submit({ name: file.name, url: URL.createObjectURL(file) })
  }

  const time = submittedAt?.toLocaleTimeString(lang === 'bn' ? 'bn-BD' : 'en-US', { hour: 'numeric', minute: '2-digit' })
  const verified = phase === 'verified'

  // Each step: done / current / upcoming
  const steps = [
    {
      title: t('onboarding.verify.submitted'),
      note: upload ? t('onboarding.verify.submittedAt', { time }) : t('onboarding.verify.waiting'),
      state: upload ? 'done' : 'current',
    },
    {
      title: t('onboarding.verify.review'),
      note: verified
        ? t('onboarding.verify.approvedNote')
        : phase === 'approving'
          ? t('onboarding.verify.reviewing')
          : t('onboarding.verify.reviewNote'),
      state: verified ? 'done' : upload ? 'current' : 'upcoming',
      busy: phase === 'approving',
    },
    {
      title: t('onboarding.verify.badge'),
      note: t(`onboarding.verify.unlocks.${role}`),
      state: verified ? 'done' : 'upcoming',
    },
  ]

  return (
    <OnboardingLayout step={3} backTo={`/onboarding/${role}/details`}>
      <h1 className="font-display text-3xl font-semibold">{t('onboarding.verify.title')}</h1>
      <p className="mt-2 text-ink-2">{t('onboarding.verify.body', { doc: t(`onboarding.verify.docs.${role}`) })}</p>

      {upload ? (
        <div className="mt-8 flex items-center gap-4 rounded-2xl border border-line bg-surface p-4">
          {upload.url ? (
            <img src={upload.url} alt="" className="h-16 w-24 shrink-0 rounded-lg object-cover" />
          ) : (
            <SampleCard role={role} name={holderName} />
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold">{upload.name}</p>
            <p className="mt-0.5 inline-flex items-center gap-1 text-sm font-medium text-ok">
              <Check className="size-4" /> {t('onboarding.verify.uploaded')}
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-3 rounded-2xl border-2 border-dashed border-line bg-surface p-6 text-center">
          <ImageUp className="mx-auto size-8 text-primary" />
          <label className="cursor-pointer rounded-xl bg-primary py-3 font-semibold text-primary-ink">
            {t('onboarding.verify.choose')}
            <input id="verify-upload" type="file" accept="image/*" onChange={handleFile} className="sr-only" />
          </label>
          <button
            type="button"
            onClick={() => submit({ name: `${t(`onboarding.verify.docs.${role}`)} · ${holderName}` })}
            className="rounded-xl border border-line py-3 font-semibold text-ink hover:bg-surface-2"
          >
            {t('onboarding.verify.sample')}
          </button>
        </div>
      )}

      <section className="mt-5 rounded-2xl border border-line bg-surface p-5">
        <h2 className="text-xs font-semibold tracking-[0.14em] text-ink-2 uppercase">{t('onboarding.verify.statusTitle')}</h2>
        <ol className="mt-4">
          {steps.map((step, index) => (
            <li key={step.title} className="relative flex gap-3 pb-5 last:pb-0">
              {index < steps.length - 1 && (
                <span className={`absolute top-7 bottom-0 left-[13px] w-0.5 ${step.state === 'done' ? 'bg-primary' : 'bg-line'}`} />
              )}
              <StepDot state={step.state} busy={step.busy} />
              <div className="pt-0.5">
                <p className={`font-semibold ${step.state === 'upcoming' ? 'text-ink-2' : ''}`}>{step.title}</p>
                <p className="text-sm text-ink-2">{step.note}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {verified ? (
        <>
          <p className="mt-5 flex items-center gap-2 rounded-2xl bg-ok-soft p-4 font-semibold text-ok">
            <BadgeCheck className="size-5 shrink-0" /> {t('onboarding.verify.done')}
          </p>
          <Link to={`/${role}`} className="mt-5 rounded-2xl bg-accent py-3.5 text-center font-semibold text-accent-ink transition-transform hover:-translate-y-px">
            {t('onboarding.verify.enter')}
          </Link>
        </>
      ) : (
        <>
          <p className="mt-5 flex gap-2.5 rounded-2xl bg-accent-soft p-4 text-sm text-ink">
            <Info className="mt-0.5 size-4 shrink-0 text-warn" /> {t('onboarding.verify.info')}
          </p>
          <div className="mt-5 grid gap-3">
            <button
              type="button"
              disabled={phase !== 'review'}
              onClick={() => setPhase('approving')}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 font-semibold text-primary-ink transition-opacity disabled:opacity-45"
            >
              {phase === 'approving' ? <LoaderCircle className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
              {t('onboarding.verify.simulate')}
              <span className="rounded-full bg-primary-ink/20 px-2 py-0.5 text-[11px] tracking-wide uppercase">{t('onboarding.verify.demoTag')}</span>
            </button>
            <Link to={`/${role}`} className="rounded-2xl border border-line py-3.5 text-center font-semibold text-ink hover:bg-surface-2">
              {t('onboarding.verify.explore')}
            </Link>
          </div>
        </>
      )}
    </OnboardingLayout>
  )
}

function StepDot({ state, busy }) {
  if (state === 'done') {
    return (
      <span className="relative grid size-7 shrink-0 place-items-center rounded-full bg-primary text-primary-ink">
        <CircleCheck className="size-4" />
      </span>
    )
  }
  if (state === 'current') {
    return (
      <span className="relative grid size-7 shrink-0 place-items-center rounded-full bg-accent text-accent-ink">
        {busy ? <LoaderCircle className="size-4 animate-spin" /> : <span className="size-2 rounded-full bg-accent-ink" />}
      </span>
    )
  }
  return <span className="relative size-7 shrink-0 rounded-full border-2 border-line bg-surface" />
}

// A drawn stand-in for an ID card when the presenter uses the sample instead of a real photo
function SampleCard({ role, name }) {
  const Icon = portals[role].icon
  return (
    <span
      style={{ '--role': portals[role].color }}
      className="flex h-16 w-24 shrink-0 flex-col justify-between rounded-lg bg-[color-mix(in_oklab,var(--role)_14%,var(--surface))] p-2"
      aria-hidden="true"
    >
      <span className="flex items-center gap-1">
        <Icon className="size-3 text-role" />
        <span className="h-1 flex-1 rounded-full bg-role/40" />
      </span>
      <span className="flex items-end gap-1.5">
        <span className="size-6 rounded bg-role/30" />
        <span className="grid flex-1 gap-1">
          <span className="truncate text-[7px] leading-none font-semibold text-ink">{name}</span>
          <span className="h-1 w-3/4 rounded-full bg-ink/15" />
        </span>
      </span>
    </span>
  )
}

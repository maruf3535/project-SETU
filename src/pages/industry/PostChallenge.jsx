import { Lock, Send, ShieldCheck, Users } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../components/Toast'
import { buttonStyles, inputStyles, PageIntro } from '../../components/ui'
import { SKILLS } from '../../data/demo/challenges'
import { useI18n } from '../../i18n/I18nProvider'
import { useDemo } from '../../store/DemoStore'
import { MY_ORG } from './shared'

const summaryIcons = [ShieldCheck, Lock, Users]

function Field({ id, label, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {hint && <span className="ml-2 text-xs text-ink-2">{hint}</span>}
      <div className="mt-1.5">{children}</div>
    </div>
  )
}

export default function PostChallenge() {
  const { t, money } = useI18n()
  const { dispatch } = useDemo()
  const toast = useToast()
  const navigate = useNavigate()
  const [skills, setSkills] = useState(['Bangla translation', 'Technical writing'])
  const [reward, setReward] = useState(4000)
  const [team, setTeam] = useState('solo')

  function toggleSkill(skill) {
    setSkills((current) => (current.includes(skill) ? current.filter((s) => s !== skill) : [...current, skill]))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const id = `ch-${Date.now()}`
    dispatch({
      type: 'post',
      challenge: {
        id,
        orgId: MY_ORG.id,
        org: MY_ORG.name,
        title: form.get('title').trim(),
        summary: form.get('problem').trim(),
        deliverables: form.get('deliverables').split('\n').map((line) => line.trim()).filter(Boolean),
        skills,
        reward: Number(reward),
        deadline: form.get('deadline'),
        postedAt: new Date().toISOString().slice(0, 10),
        team,
        mentor: form.get('mentor') ? 'Open to a teacher mentor' : null,
        status: 'review',
        applicants: [],
        invited: [],
        solver: null,
      },
    })
    toast(t('industry.post.sent'))
    navigate(`/industry/challenges/${id}`)
  }

  const summarySteps = t('industry.post.summarySteps')

  return (
    <div className="mx-auto max-w-5xl">
      <PageIntro title={t('industry.post.title')} body={t('industry.post.body')} />

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="grid content-start gap-5 rounded-2xl border border-line bg-surface p-5 sm:p-6">
          <Field id="post-title" label={t('industry.post.fields.title')}>
            <input
              id="post-title"
              name="title"
              required
              defaultValue="Seed storage guide in plain Bangla"
              placeholder={t('industry.post.fields.titlePlaceholder')}
              className={inputStyles}
            />
          </Field>
          <Field id="post-problem" label={t('industry.post.fields.problem')}>
            <textarea
              id="post-problem"
              name="problem"
              required
              rows={3}
              defaultValue="Farmers lose part of their seed to damp and pests because our storage guide is written in technical English. We need a short Bangla version they can follow."
              placeholder={t('industry.post.fields.problemPlaceholder')}
              className={inputStyles}
            />
          </Field>
          <Field id="post-deliverables" label={t('industry.post.fields.deliverables')} hint={t('industry.post.fields.deliverablesHint')}>
            <textarea
              id="post-deliverables"
              name="deliverables"
              required
              rows={3}
              defaultValue={'One-page illustrated guide\nEditable source file'}
              className={inputStyles}
            />
          </Field>
          <fieldset>
            <legend className="text-sm font-medium">{t('industry.post.fields.skills')}</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {SKILLS.map((skill) => {
                const on = skills.includes(skill)
                return (
                  <button
                    key={skill}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleSkill(skill)}
                    className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                      on ? 'border-primary bg-[color-mix(in_oklab,var(--primary)_12%,transparent)] font-semibold text-primary' : 'border-line text-ink-2 hover:text-ink'
                    }`}
                  >
                    {skill}
                  </button>
                )
              })}
            </div>
          </fieldset>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="post-reward" label={t('industry.post.fields.reward')}>
              <input
                id="post-reward"
                name="reward"
                type="number"
                min="500"
                step="500"
                required
                value={reward}
                onChange={(event) => setReward(event.target.value)}
                className={`${inputStyles} tabular-nums`}
              />
              <p className="mt-1.5 text-xs text-ink-2">{t('industry.post.fields.rewardHint')}</p>
            </Field>
            <Field id="post-deadline" label={t('industry.post.fields.deadline')}>
              <input id="post-deadline" name="deadline" type="date" required defaultValue="2026-11-30" className={inputStyles} />
            </Field>
          </div>
          <fieldset>
            <legend className="text-sm font-medium">{t('industry.post.fields.format')}</legend>
            <div className="mt-2 inline-flex rounded-xl border border-line p-1">
              {['solo', 'team'].map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={team === option}
                  onClick={() => setTeam(option)}
                  className={`rounded-lg px-4 py-1.5 text-sm font-semibold ${team === option ? 'bg-brand text-brand-ink' : 'text-ink-2'}`}
                >
                  {t(`common.${option}`)}
                </button>
              ))}
            </div>
          </fieldset>
          <label htmlFor="post-mentor" className="flex items-center gap-3 text-sm">
            <input id="post-mentor" name="mentor" type="checkbox" defaultChecked className="size-4 accent-[var(--primary)]" />
            {t('industry.post.fields.mentor')}
          </label>
        </div>

        <aside className="grid content-start gap-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl bg-brand p-5 text-brand-ink">
            <p className="text-xs font-semibold tracking-[0.12em] text-brand-ink/60 uppercase">{t('industry.post.summary')}</p>
            <ol className="mt-4 grid gap-3">
              {summarySteps.map((step, index) => {
                const Icon = summaryIcons[index]
                return (
                  <li key={step} className="flex gap-3 text-sm">
                    <Icon className="mt-0.5 size-4 shrink-0 text-accent" /> {step}
                  </li>
                )
              })}
            </ol>
            <p className="mt-5 border-t border-brand-ink/15 pt-4 font-display text-xl font-semibold tabular-nums">
              {t('industry.post.escrowLine', { amount: money(Number(reward) || 0) })}
            </p>
          </div>
          <button type="submit" disabled={!skills.length} className={`${buttonStyles.accent} py-3`}>
            <Send className="size-4" /> {t('industry.post.submit')}
          </button>
        </aside>
      </form>
    </div>
  )
}

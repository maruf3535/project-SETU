import { Award, BadgeCheck, BookCheck, FlaskConical, FolderGit2, Plus, Share2, ShieldCheck, Star, Target } from 'lucide-react'
import { useState } from 'react'
import Avatar from '../../components/Avatar'
import { useToast } from '../../components/Toast'
import { buttonStyles, Dialog, inputStyles } from '../../components/ui'
import { SKILLS } from '../../data/demo/challenges'
import { useI18n } from '../../i18n/I18nProvider'
import { useCurrentStudent, useDemo } from '../../store/DemoStore'
import { slugify } from '../public/publicProfiles'

const evidenceIcons = { project: FolderGit2, award: Award, challenge: Target, research: FlaskConical, review: BookCheck }
const levelWidth = { beginner: '35%', intermediate: '65%', advanced: '90%' }

export default function Portfolio() {
  const { t, L, num, money } = useI18n()
  const { dispatch } = useDemo()
  const { student } = useCurrentStudent()
  const toast = useToast()
  const [adding, setAdding] = useState(false)
  const [skill, setSkill] = useState('')

  const available = SKILLS.filter((s) => !student.skills.some((x) => x.name === s))
  const skills = [...student.skills].sort((a, b) => Number(b.verified) - Number(a.verified))

  async function share() {
    const link = `${window.location.origin}${window.location.pathname}#/u/${slugify(student.name)}`
    try {
      await navigator.clipboard.writeText(link)
    } catch {
      // clipboard can be blocked; the toast still tells the presenter what would happen
    }
    toast(t('student.portfolio.shared'))
  }

  function add(event) {
    event.preventDefault()
    if (!skill) return
    dispatch({ type: 'addSkill', studentId: student.id, skill })
    toast(t('student.portfolio.added', { skill }))
    setSkill('')
    setAdding(false)
  }

  return (
    <div className="mx-auto max-w-5xl">
      <section className="flex flex-col gap-5 rounded-3xl border border-line bg-surface p-6 sm:flex-row sm:items-center">
        <Avatar initials={student.initials} className="size-20 text-2xl" />
        <div className="min-w-0 flex-1">
          <h2 className="flex items-center gap-2 font-display text-3xl font-semibold">
            {student.name} <BadgeCheck className="size-6 text-primary" />
          </h2>
          <p className="text-ink-2">
            {L(student.dept)} · {student.university} · {t(`common.divisions.${student.division}`)}
          </p>
          {student.rating >= 4.8 && (
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-warn">
              <Star className="size-3.5 fill-current" /> {t('student.portfolio.topContributor')}
            </span>
          )}
        </div>
        <button type="button" onClick={share} className={buttonStyles.ghost}>
          <Share2 className="size-4" /> {t('student.portfolio.share')}
        </button>
      </section>

      <dl className="mt-4 grid grid-cols-3 gap-3">
        {[
          [t('student.portfolio.rating'), `★ ${num(student.rating)}`],
          [t('student.portfolio.completed'), num(student.completed)],
          [t('student.portfolio.earned'), money(student.earned)],
        ].map(([label, value]) => (
          <div key={label} className="flex flex-col-reverse rounded-2xl border border-line bg-surface p-4">
            <dt className="text-xs text-ink-2">{label}</dt>
            <dd className="font-display text-2xl font-semibold tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-line bg-surface p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold tracking-[0.12em] text-ink-2 uppercase">{t('student.portfolio.skills')}</h3>
            <button type="button" onClick={() => setAdding(true)} className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              <Plus className="size-4" /> {t('student.portfolio.add')}
            </button>
          </div>
          <ul className="mt-4 grid gap-4">
            {skills.map((s) => (
              <li key={s.name}>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 font-semibold">
                    {s.name} {s.verified && <BadgeCheck className="size-4 text-primary" />}
                  </span>
                  <span className="text-xs text-ink-2">
                    {t(`common.levels.${s.level}`)}
                    {!s.verified && ` · ${t('common.selfReported')}`}
                  </span>
                </div>
                <div className="mt-1.5 h-2 rounded-full bg-surface-2">
                  <div className={`h-full rounded-full ${s.verified ? 'bg-primary' : 'bg-accent'}`} style={{ width: levelWidth[s.level] }} />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-line bg-surface p-5">
          <h3 className="text-xs font-semibold tracking-[0.12em] text-ink-2 uppercase">{t('student.portfolio.evidence')}</h3>
          <ul className="mt-4 grid gap-3">
            {student.evidence.map((item, i) => {
              const Icon = evidenceIcons[item.kind]
              return (
                <li key={`${L(item.title)}-${i}`} className="flex items-start gap-3 rounded-xl bg-surface-2/60 p-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-surface text-primary">
                    <Icon className="size-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold">{L(item.title)}</span>
                    <span className="block text-sm text-ink-2">
                      {L(item.by).startsWith(t(`common.evidenceKinds.${item.kind}`)) ? L(item.by) : `${t(`common.evidenceKinds.${item.kind}`)} · ${L(item.by)}`}
                    </span>
                  </span>
                </li>
              )
            })}
          </ul>
        </section>
      </div>

      <p className="mt-6 flex items-center gap-2 text-sm text-ink-2">
        <ShieldCheck className="size-4 shrink-0 text-primary" /> {t('student.portfolio.privacy')}
      </p>

      <Dialog open={adding} title={t('student.portfolio.addTitle')} onClose={() => setAdding(false)}>
        <p className="text-sm text-ink-2">{t('student.portfolio.addBody')}</p>
        <form onSubmit={add} className="mt-4 grid gap-3">
          <label htmlFor="add-skill" className="sr-only">
            {t('student.portfolio.addTitle')}
          </label>
          <select id="add-skill" required value={skill} onChange={(e) => setSkill(e.target.value)} className={inputStyles}>
            <option value="">—</option>
            {available.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button type="submit" className={`${buttonStyles.primary} py-3`}>
            {t('student.portfolio.addButton')}
          </button>
        </form>
      </Dialog>
    </div>
  )
}

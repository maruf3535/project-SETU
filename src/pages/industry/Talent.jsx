import { Award, BadgeCheck, BookCheck, FlaskConical, FolderGit2, MapPin, Search, Send, Star, Target } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Avatar from '../../components/Avatar'
import { useToast } from '../../components/Toast'
import { buttonStyles, Dialog, inputStyles, PageIntro, SkillChip } from '../../components/ui'
import { SKILLS } from '../../data/demo/challenges'
import { useI18n } from '../../i18n/I18nProvider'
import { useDemo } from '../../store/DemoStore'
import { useOwnChallenges } from './shared'
import PublicProfileLink from '../../components/PublicProfileLink'

const DIVISIONS = ['dhaka', 'chattogram', 'rajshahi', 'khulna', 'barishal', 'sylhet', 'rangpur', 'mymensingh']
const evidenceIcons = { project: FolderGit2, award: Award, challenge: Target, research: FlaskConical, review: BookCheck }

export default function Talent() {
  const { t, L, money, num } = useI18n()
  const { students, dispatch } = useDemo()
  const toast = useToast()
  const openChallenges = useOwnChallenges().filter((c) => c.status === 'open')
  const [query, setQuery] = useState('')
  const [skill, setSkill] = useState('')
  const [division, setDivision] = useState('')
  const [verifiedOnly, setVerifiedOnly] = useState(true)
  const [inviting, setInviting] = useState(null)

  const q = query.trim().toLowerCase()
  const results = students.filter((s) => {
    const skillPool = verifiedOnly ? s.skills.filter((x) => x.verified) : s.skills
    if (skill && !skillPool.some((x) => x.name === skill)) return false
    if (division && s.division !== division) return false
    if (!q) return true
    return [s.name, s.university, ...s.skills.map((x) => x.name)].some((text) => text.toLowerCase().includes(q))
  })

  function invite(challenge) {
    dispatch({ type: 'invite', id: challenge.id, studentId: inviting.id })
    toast(t('industry.talent.invitedToast', { name: inviting.name, title: L(challenge.title) }))
    setInviting(null)
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageIntro title={t('industry.talent.title')} body={t('industry.talent.body')} />

      <div className="grid gap-3 rounded-2xl border border-line bg-surface p-4 sm:grid-cols-[minmax(0,1fr)_12rem_12rem]">
        <label htmlFor="talent-search" className="relative">
          <span className="sr-only">{t('industry.talent.search')}</span>
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-2" />
          <input
            id="talent-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('industry.talent.search')}
            className={`${inputStyles} pl-10`}
          />
        </label>
        <label htmlFor="talent-skill">
          <span className="sr-only">{t('industry.detail.skills')}</span>
          <select id="talent-skill" value={skill} onChange={(event) => setSkill(event.target.value)} className={inputStyles}>
            <option value="">{t('industry.detail.skills')}</option>
            {SKILLS.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="talent-division">
          <span className="sr-only">{t('industry.talent.division')}</span>
          <select id="talent-division" value={division} onChange={(event) => setDivision(event.target.value)} className={inputStyles}>
            <option value="">{t('industry.talent.allDivisions')}</option>
            {DIVISIONS.map((key) => (
              <option key={key} value={key}>
                {t(`common.divisions.${key}`)}
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-center justify-between gap-3 sm:col-span-3">
          <label htmlFor="talent-verified" className="flex items-center gap-2.5 text-sm">
            <input
              id="talent-verified"
              type="checkbox"
              checked={verifiedOnly}
              onChange={(event) => setVerifiedOnly(event.target.checked)}
              className="size-4 accent-[var(--primary)]"
            />
            {t('industry.talent.verifiedOnly')}
          </label>
          <span className="text-sm text-ink-2 tabular-nums">{t('industry.talent.results', { n: num(results.length) })}</span>
        </div>
      </div>

      {results.length ? (
        <ul className="mt-5 grid gap-4 md:grid-cols-2">
          {results.map((student) => {
            const alreadyInvited = openChallenges.length > 0 && openChallenges.every((c) => c.invited.includes(student.id))
            return (
              <li key={student.id} className="flex flex-col rounded-2xl border border-line bg-surface p-5">
                <div className="flex items-start gap-3">
                  <Avatar initials={student.initials} className="size-12 text-base" />
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1 font-semibold">
                      {student.name} <BadgeCheck className="size-4 text-primary" />
                      <PublicProfileLink name={student.name} />
                    </p>
                    <p className="text-sm text-ink-2">
                      {student.university} · {L(student.dept)}
                    </p>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-2">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="size-3.5" /> {t(`common.divisions.${student.division}`)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Star className="size-3.5 fill-accent text-accent" /> {num(student.rating)}
                      </span>
                      <span>{t('common.completed', { n: num(student.completed) })}</span>
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {student.skills.map((s) => (
                    <SkillChip key={s.name} name={s.name} level={s.level} verified={s.verified} />
                  ))}
                </div>

                <div className="mt-4 border-t border-line pt-3">
                  <p className="text-xs font-semibold tracking-[0.12em] text-ink-2 uppercase">{t('industry.talent.evidence')}</p>
                  <ul className="mt-2 grid gap-2">
                    {student.evidence.slice(0, 2).map((item) => {
                      const Icon = evidenceIcons[item.kind]
                      return (
                        <li key={L(item.title)} className="flex items-start gap-2.5 text-sm">
                          <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
                          <span className="min-w-0">
                            <span className="block font-medium">{L(item.title)}</span>
                            <span className="block text-xs text-ink-2">{L(item.by)}</span>
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </div>

                <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                  <span className="text-xs text-ink-2">{t('industry.talent.earned', { amount: money(student.earned) })}</span>
                  <button type="button" disabled={alreadyInvited} onClick={() => setInviting(student)} className={buttonStyles.primary}>
                    <Send className="size-4" />
                    {alreadyInvited ? t('industry.talent.alreadyInvited') : t('industry.talent.invite')}
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="mt-10 text-center text-ink-2">{t('industry.talent.empty')}</p>
      )}

      <Dialog open={Boolean(inviting)} title={inviting ? t('industry.talent.inviteTitle', { name: inviting.name }) : ''} onClose={() => setInviting(null)}>
        {openChallenges.length ? (
          <>
            <p className="text-ink-2">{t('industry.talent.inviteBody')}</p>
            <ul className="mt-4 grid gap-2">
              {openChallenges.map((challenge) => {
                const done = inviting && challenge.invited.includes(inviting.id)
                return (
                  <li key={challenge.id}>
                    <button
                      type="button"
                      disabled={done}
                      onClick={() => invite(challenge)}
                      className="flex w-full items-center gap-3 rounded-xl border border-line p-3 text-left transition-colors hover:border-primary disabled:opacity-50"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold">{L(challenge.title)}</span>
                        <span className="block text-sm text-ink-2 tabular-nums">{money(challenge.reward)}</span>
                      </span>
                      {done && <span className="text-xs font-semibold text-ok">{t('industry.talent.alreadyInvited')}</span>}
                    </button>
                  </li>
                )
              })}
            </ul>
          </>
        ) : (
          <div className="grid gap-4">
            <p className="text-ink-2">{t('industry.talent.noOpen')}</p>
            <Link to="/industry/post" className={buttonStyles.accent}>
              {t('industry.postCta')}
            </Link>
          </div>
        )}
      </Dialog>
    </div>
  )
}

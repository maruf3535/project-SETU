import { BadgeCheck, Check, MapPin, RotateCcw, Search, Send, SlidersHorizontal, Star } from 'lucide-react'
import { useMemo, useState } from 'react'
import Avatar from '../../components/Avatar'
import { buttonStyles, Dialog, inputStyles, Panel, SkillChip } from '../../components/ui'
import { SKILLS } from '../../data/demo/challenges'
import { students as seedStudents } from '../../data/demo/talent'
import { useI18n } from '../../i18n/I18nProvider'
import { useDemo } from '../../store/DemoStore'
import PublicProfileLink from '../../components/PublicProfileLink'

const DIVISIONS = ['dhaka', 'chattogram', 'rajshahi', 'khulna', 'barishal', 'sylhet', 'rangpur', 'mymensingh']
const LEVELS = ['school', 'college', 'university']
// Filter facts (level, field, year, district, availability) come from the seed, so older saved demo data still filters
const facts = Object.fromEntries(seedStudents.map((s) => [s.id, s]))

const EMPTY = { query: '', skills: [], verifiedOnly: true, division: '', district: '', institution: '', level: '', field: '', year: '', minRating: 0, minWork: 0, availableOnly: false, sort: 'match' }

function Select({ id, label, value, onChange, children }) {
  return (
    <label htmlFor={id} className="grid gap-1.5 text-xs font-semibold text-ink-2">
      {label}
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={`${inputStyles} py-2 text-sm font-normal text-ink`}>
        {children}
      </select>
    </label>
  )
}

// Share of the chosen skills a student holds; verified skills count fully, self-reported half (or not at all when verified-only)
function skillMatch(student, skills, verifiedOnly) {
  if (!skills.length) return null
  const score = skills.reduce((sum, name) => {
    const held = student.skills.find((x) => x.name === name)
    if (!held) return sum
    return sum + (held.verified ? 1 : verifiedOnly ? 0 : 0.5)
  }, 0)
  return Math.round((score / skills.length) * 100)
}

export default function FindStudents({ topics, onInvite }) {
  const { t, L, num } = useI18n()
  const { students } = useDemo()
  const [f, setF] = useState(EMPTY)
  const [showFilters, setShowFilters] = useState(false)
  const [inviting, setInviting] = useState(null)
  const set = (key) => (value) => setF((current) => ({ ...current, [key]: value }))

  const pool = useMemo(() => students.map((s) => ({ ...facts[s.id], ...s, ...pick(facts[s.id]) })), [students])
  const institutions = [...new Set(pool.map((s) => s.university))].sort()
  const districts = [...new Set(pool.filter((s) => !f.division || s.division === f.division).map((s) => s.district).filter(Boolean))].sort()
  const fields = [...new Set(pool.filter((s) => !f.level || s.level === f.level).map((s) => s.field).filter(Boolean))].sort()
  const years = [...new Set(pool.filter((s) => !f.level || s.level === f.level).map((s) => s.year).filter(Boolean))].sort((a, b) => a - b)

  const q = f.query.trim().toLowerCase()
  const results = pool
    .map((s) => ({ student: s, match: skillMatch(s, f.skills, f.verifiedOnly) }))
    .filter(({ student: s, match }) => {
      if (q && ![s.name, s.university, s.field ?? ''].some((x) => x.toLowerCase().includes(q))) return false
      if (f.skills.length && match === 0) return false
      if (f.division && s.division !== f.division) return false
      if (f.district && s.district !== f.district) return false
      if (f.institution && s.university !== f.institution) return false
      if (f.level && s.level !== f.level) return false
      if (f.field && s.field !== f.field) return false
      if (f.year && String(s.year) !== f.year) return false
      if (s.rating < f.minRating) return false
      if (s.completed < f.minWork) return false
      if (f.availableOnly && s.available === false) return false
      return true
    })
    .sort((a, b) => {
      if (f.sort === 'rating') return b.student.rating - a.student.rating
      if (f.sort === 'work') return b.student.completed - a.student.completed
      return (b.match ?? 0) - (a.match ?? 0) || b.student.rating - a.student.rating
    })

  const active = Object.entries(f).filter(([k, v]) => k !== 'sort' && k !== 'verifiedOnly' && (Array.isArray(v) ? v.length : Boolean(v))).length
  const yearLabel = (level, year) =>
    level === 'university' ? t('teacher.find.yearN', { n: num(year) }) : t('teacher.find.classN', { n: num(year) })

  function toggleSkill(name) {
    setF((current) => ({ ...current, skills: current.skills.includes(name) ? current.skills.filter((x) => x !== name) : [...current.skills, name] }))
  }

  return (
    <Panel
      title={t('teacher.find.title')}
      action={<span className="text-sm text-ink-2 tabular-nums">{t('teacher.find.results', { n: num(results.length) })}</span>}
    >
      <div className="grid gap-4 border-b border-line p-5">
        <div className="flex flex-wrap gap-2">
          <label htmlFor="find-query" className="relative min-w-0 flex-1 basis-60">
            <span className="sr-only">{t('teacher.find.search')}</span>
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-2" />
            <input id="find-query" type="search" value={f.query} onChange={(e) => set('query')(e.target.value)} placeholder={t('teacher.find.search')} className={`${inputStyles} pl-10`} />
          </label>
          <button type="button" onClick={() => setShowFilters((v) => !v)} aria-expanded={showFilters} aria-controls="find-filters" className={buttonStyles.ghost}>
            <SlidersHorizontal className="size-4" /> {t('teacher.find.filters')}
            {active > 0 && <span className="rounded-full bg-accent px-1.5 text-xs text-accent-ink tabular-nums">{num(active)}</span>}
          </button>
          <Select id="find-sort" label={<span className="sr-only">{t('teacher.find.sort')}</span>} value={f.sort} onChange={set('sort')}>
            <option value="match">{t('teacher.find.sorts.match')}</option>
            <option value="rating">{t('teacher.find.sorts.rating')}</option>
            <option value="work">{t('teacher.find.sorts.work')}</option>
          </Select>
        </div>

        <fieldset>
          <legend className="mb-2 flex w-full flex-wrap items-center justify-between gap-2 text-xs font-semibold text-ink-2">
            {t('teacher.find.skills')}
            <label htmlFor="find-verified" className="inline-flex items-center gap-2 font-normal text-ink">
              <input id="find-verified" type="checkbox" checked={f.verifiedOnly} onChange={(e) => set('verifiedOnly')(e.target.checked)} className="size-4 accent-[var(--primary)]" />
              {t('teacher.find.verifiedOnly')}
            </label>
          </legend>
          <div className="flex flex-wrap gap-1.5">
            {SKILLS.map((name) => {
              const on = f.skills.includes(name)
              return (
                <button
                  key={name}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleSkill(name)}
                  className={`rounded-full border px-3 py-1 text-sm transition-colors ${on ? 'border-primary bg-[color-mix(in_oklab,var(--primary)_12%,transparent)] font-semibold text-primary' : 'border-line text-ink-2 hover:text-ink'}`}
                >
                  {name}
                </button>
              )
            })}
          </div>
        </fieldset>

        {showFilters && (
          <div id="find-filters" className="grid gap-3 rounded-2xl bg-surface-2/60 p-4 sm:grid-cols-2 lg:grid-cols-4">
            <Select id="find-division" label={t('teacher.find.division')} value={f.division} onChange={(v) => setF((c) => ({ ...c, division: v, district: '' }))}>
              <option value="">{t('teacher.find.any')}</option>
              {DIVISIONS.map((d) => (
                <option key={d} value={d}>
                  {t(`common.divisions.${d}`)}
                </option>
              ))}
            </Select>
            <Select id="find-district" label={t('teacher.find.district')} value={f.district} onChange={set('district')}>
              <option value="">{t('teacher.find.any')}</option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Select>
            <Select id="find-institution" label={t('teacher.find.institution')} value={f.institution} onChange={set('institution')}>
              <option value="">{t('teacher.find.any')}</option>
              {institutions.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </Select>
            <Select id="find-level" label={t('teacher.find.level')} value={f.level} onChange={(v) => setF((c) => ({ ...c, level: v, field: '', year: '' }))}>
              <option value="">{t('teacher.find.any')}</option>
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {t(`student.levels.${l}`)}
                </option>
              ))}
            </Select>
            <Select id="find-field" label={t('teacher.find.field')} value={f.field} onChange={set('field')}>
              <option value="">{t('teacher.find.any')}</option>
              {fields.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </Select>
            <Select id="find-year" label={t('teacher.find.year')} value={f.year} onChange={set('year')}>
              <option value="">{t('teacher.find.any')}</option>
              {years.map((y) => (
                <option key={y} value={String(y)}>
                  {yearLabel(y > 6 ? (y === 12 ? 'college' : 'school') : 'university', y)}
                </option>
              ))}
            </Select>
            <Select id="find-rating" label={t('teacher.find.minRating')} value={String(f.minRating)} onChange={(v) => set('minRating')(Number(v))}>
              <option value="0">{t('teacher.find.any')}</option>
              {[4.5, 4.7, 4.8].map((r) => (
                <option key={r} value={String(r)}>
                  ★ {num(r)}+
                </option>
              ))}
            </Select>
            <Select id="find-work" label={t('teacher.find.minWork')} value={String(f.minWork)} onChange={(v) => set('minWork')(Number(v))}>
              <option value="0">{t('teacher.find.any')}</option>
              {[1, 3, 5].map((n) => (
                <option key={n} value={String(n)}>
                  {t('teacher.find.workN', { n: num(n) })}
                </option>
              ))}
            </Select>
            <div className="flex flex-wrap items-center justify-between gap-3 sm:col-span-2 lg:col-span-4">
              <label htmlFor="find-available" className="inline-flex items-center gap-2 text-sm">
                <input id="find-available" type="checkbox" checked={f.availableOnly} onChange={(e) => set('availableOnly')(e.target.checked)} className="size-4 accent-[var(--primary)]" />
                {t('teacher.find.availableOnly')}
              </label>
              <button type="button" onClick={() => setF(EMPTY)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                <RotateCcw className="size-4" /> {t('teacher.find.reset')}
              </button>
            </div>
          </div>
        )}
      </div>

      {results.length ? (
        <ul className="grid gap-3 p-5 md:grid-cols-2">
          {results.map(({ student: s, match }) => (
            <li key={s.id} className="flex flex-col rounded-2xl border border-line p-4">
              <div className="flex items-start gap-3">
                <Avatar initials={s.initials} className="size-11 text-sm" />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1 font-semibold">
                    {s.name} <BadgeCheck className="size-4 shrink-0 text-primary" />
                    <PublicProfileLink name={s.name} />
                  </p>
                  <p className="truncate text-sm text-ink-2">
                    {s.university} · {L(s.dept)}
                  </p>
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-2">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3.5" /> {s.district ? `${s.district}, ` : ''}
                      {t(`common.divisions.${s.division}`)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Star className="size-3.5 fill-accent text-accent" /> {num(s.rating)}
                    </span>
                    <span>{t('common.completed', { n: num(s.completed) })}</span>
                  </p>
                </div>
                {match !== null && <span className="shrink-0 rounded-full bg-ok-soft px-2 py-0.5 text-xs font-semibold text-ok tabular-nums">{t('common.match', { n: num(match) })}</span>}
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {s.skills.map((x) => (
                  <SkillChip key={x.name} name={x.name} level={f.skills.includes(x.name) ? x.level : undefined} verified={x.verified} />
                ))}
              </div>
              <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                <span className={`text-xs font-semibold ${s.available === false ? 'text-warn' : 'text-ok'}`}>
                  {s.available === false ? t('teacher.find.busy') : t('teacher.find.available')}
                </span>
                <button type="button" onClick={() => setInviting(s)} className={buttonStyles.primary}>
                  <Send className="size-4" /> {t('teacher.find.invite')}
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="px-5 py-10 text-center text-ink-2">{t('teacher.find.empty')}</p>
      )}

      <Dialog open={Boolean(inviting)} title={inviting ? t('teacher.find.inviteTitle', { name: inviting.name }) : ''} onClose={() => setInviting(null)}>
        <p className="text-sm text-ink-2">{t('teacher.find.inviteBody')}</p>
        <ul className="mt-4 grid gap-2">
          {topics.map((topic) => {
            const done = inviting && topic.invited.includes(inviting.id)
            return (
              <li key={topic.id}>
                <button
                  type="button"
                  disabled={done}
                  onClick={() => {
                    onInvite(topic, inviting)
                    setInviting(null)
                  }}
                  className="flex w-full items-center gap-3 rounded-xl border border-line p-3 text-left hover:border-primary disabled:opacity-50"
                >
                  <span className="min-w-0 flex-1 truncate font-semibold">{L(topic.title)}</span>
                  {done && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-ok">
                      <Check className="size-3.5" /> {t('teacher.find.alreadyInvited')}
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </Dialog>
    </Panel>
  )
}

// Only the structured facts are taken from the seed; names, skills and ratings stay live from the store
function pick(seed) {
  if (!seed) return {}
  const { level, field, year, district, available } = seed
  return { level, field, year, district, available }
}

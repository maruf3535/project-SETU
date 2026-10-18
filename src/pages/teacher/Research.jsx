import { BadgeCheck, Check, FlaskConical, GraduationCap, Plus, Send, Target } from 'lucide-react'
import { useState } from 'react'
import Avatar from '../../components/Avatar'
import { useToast } from '../../components/Toast'
import { buttonStyles, inputStyles, PageIntro, Panel, SkillChip, Stat, StatusPill } from '../../components/ui'
import { SKILLS } from '../../data/demo/challenges'
import { researchTopics, teacherLevels } from '../../data/demo/teacher'
import { useI18n } from '../../i18n/I18nProvider'
import { matchScore, useDemo } from '../../store/DemoStore'
import { Eyebrow } from './shared'
import FindStudents from './FindStudents'
import { newId, nowIso, useTeacher } from './useTeacher'
import PublicProfileLink from '../../components/PublicProfileLink'

export default function Research() {
  const { level } = useTeacher()
  return level === 'university' ? <ResearchDesk /> : <SchoolNote />
}

function SchoolNote() {
  const { t } = useI18n()
  const { save } = useTeacher()
  const toast = useToast()

  function switchLevel() {
    save('level', 'university')
    toast(t('teacher.levelSwitched', { level: t('teacher.levels.university'), name: teacherLevels.university.name }))
  }

  return (
    <div className="mx-auto grid max-w-xl place-items-center py-10 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-[color-mix(in_oklab,var(--role)_16%,transparent)] text-role">
        <FlaskConical className="size-7" />
      </span>
      <h2 className="mt-4 font-display text-2xl font-semibold">{t('teacher.research.schoolTitle')}</h2>
      <p className="mt-2 text-ink-2">{t('teacher.research.schoolBody')}</p>
      <button type="button" onClick={switchLevel} className={`${buttonStyles.accent} mt-5`}>
        <GraduationCap className="size-4" /> {t('teacher.research.switch')}
      </button>
    </div>
  )
}

function ResearchDesk() {
  const { t, L, num, money, date } = useI18n()
  const { persona, saved, save } = useTeacher()
  const { challenges, projects, students, studentById } = useDemo()
  const toast = useToast()
  const topics = saved('research', researchTopics)
  const mentored = challenges.filter((c) => c.mentor?.startsWith(persona.name))
  const project = projects.find((p) => p.lead === persona.name)
  const applicants = topics.reduce((sum, topic) => sum + topic.applicants.length, 0)

  function invite(topic, student) {
    save(
      'research',
      topics.map((x) => (x.id === topic.id ? { ...x, invited: [...new Set([...x.invited, student.id])] } : x)),
    )
    toast(t('teacher.research.invitedToast', { name: student.name, title: L(topic.title) }))
  }

  function post(topic) {
    save('research', [topic, ...topics])
    toast(t('teacher.research.postedToast', { title: topic.title }))
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageIntro title={t('teacher.research.title')} body={t('teacher.research.body')} />
      <div className="mb-6">
        <FindStudents topics={topics} onInvite={invite} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat tone="brand" label={t('teacher.research.stats.topics')} value={num(topics.length)} />
        <Stat label={t('teacher.research.stats.applicants')} value={num(applicants)} />
        <Stat label={t('teacher.research.stats.challenges')} value={num(mentored.length)} />
        <Stat label={t('teacher.research.stats.project')} value={project ? money(project.budget) : '—'} note={project ? L(project.title) : undefined} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
        <div className="grid content-start gap-4">
          <h2 className="font-semibold">{t('teacher.research.topics')}</h2>
          {topics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} students={students} studentById={studentById} onInvite={invite} />
          ))}
        </div>
        <PostTopic onPost={post} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title={t('teacher.research.mentoring')} className="self-start">
          {mentored.length ? (
            <ul className="divide-y divide-line">
              {mentored.map((c) => (
                <li key={c.id} className="px-5 py-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="min-w-0 flex-1 font-semibold">{L(c.title)}</p>
                    <StatusPill status={c.status} />
                  </div>
                  <p className="mt-1 text-sm text-ink-2">
                    {c.org} · {money(c.reward)} · {t('common.due', { date: date(c.deadline) })}
                  </p>
                  {c.solver && (
                    <p className="mt-2 flex items-center gap-2 text-sm">
                      <Avatar initials={studentById[c.solver]?.initials} className="size-7 text-[11px]" />
                      {t('teacher.research.solver', { name: studentById[c.solver]?.name })}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {c.skills.map((s) => (
                      <span key={s} className="rounded-full bg-surface-2 px-2.5 py-1 text-xs font-semibold text-ink-2">
                        {s}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-5 py-6 text-ink-2">{t('teacher.research.noMentoring')}</p>
          )}
        </Panel>

        {project && (
          <Panel title={t('teacher.research.project')} className="self-start">
            <div className="px-5 pt-4">
              <p className="font-semibold">{L(project.title)}</p>
              <p className="text-sm text-ink-2">
                {L(project.lab)} · {money(project.budget)}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.members.map((id) => (
                  <span key={id} className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 py-1 pr-3 pl-1 text-xs font-semibold">
                    <Avatar initials={studentById[id]?.initials} className="size-6 text-[10px]" />
                    {studentById[id]?.name}
                  </span>
                ))}
              </div>
              <Eyebrow className="mt-4">{t('teacher.research.milestones')}</Eyebrow>
            </div>
            <ol className="mt-2 divide-y divide-line border-t border-line">
              {project.milestones.map((m, i) => (
                <li key={i} className="flex flex-col gap-2 px-5 py-3.5 sm:flex-row sm:items-center sm:gap-3">
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">
                      {num(i + 1)}. {L(m.title)}
                    </span>
                    <span className="block text-xs text-ink-2 tabular-nums">
                      {money(m.amount)} · {t('common.due', { date: date(m.due) })}
                    </span>
                  </span>
                  <StatusPill kind="milestone" status={m.status} />
                </li>
              ))}
            </ol>
            <p className="border-t border-line px-5 py-3 text-xs text-ink-2">{t('teacher.research.projectNote')}</p>
          </Panel>
        )}
      </div>
    </div>
  )
}

function TopicCard({ topic, students, studentById, onInvite }) {
  const { t, L, num, money, date } = useI18n()
  // Students who applied; a new topic shows the best skill matches instead
  const applied = topic.applicants.map((id) => studentById[id]).filter(Boolean)
  const suggested = applied.length
    ? []
    : students
        .map((s) => ({ s, score: matchScore(s, topic.skills) }))
        .filter((x) => x.score >= 50)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map((x) => x.s)
  const list = applied.length ? applied : suggested

  return (
    <article className="rounded-2xl border border-line bg-surface">
      <div className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="min-w-0 flex-1 font-semibold">{L(topic.title)}</h3>
          <span className="shrink-0 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-warn tabular-nums">
            {t('teacher.research.stipendShort', { amount: money(topic.stipend) })}
          </span>
        </div>
        <p className="mt-1.5 text-sm text-ink-2">{L(topic.description)}</p>
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {topic.skills.map((s) => (
            <span key={s} className="rounded-full bg-surface-2 px-2.5 py-1 text-xs font-semibold text-ink-2">
              {s}
            </span>
          ))}
        </div>
        <p className="mt-3 text-xs text-ink-2">
          {t('teacher.research.seats', { n: num(topic.seats) })} · {t('teacher.research.posted', { date: date(topic.postedAt) })}
        </p>
      </div>
      <div className="border-t border-line px-5 py-4">
        <Eyebrow>{applied.length ? t('teacher.research.applied', { n: num(applied.length) }) : t('teacher.research.suggested')}</Eyebrow>
        {list.length ? (
          <ul className="mt-3 grid gap-3">
            {list.map((student) => {
              const invited = topic.invited.includes(student.id)
              const matched = student.skills.filter((s) => topic.skills.includes(s.name))
              return (
                <li key={student.id} className="flex flex-col gap-3 rounded-xl bg-surface-2/60 p-3 sm:flex-row sm:items-center">
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <Avatar initials={student.initials} className="size-10 text-sm" />
                    <div className="min-w-0">
                      <p className="flex flex-wrap items-center gap-x-2 font-semibold">
                        <span className="inline-flex items-center gap-1">
                          {student.name} <BadgeCheck className="size-4 text-primary" />
                          <PublicProfileLink name={student.name} />
                        </span>
                        <span className="text-xs font-semibold text-ok tabular-nums">{t('common.match', { n: num(matchScore(student, topic.skills)) })}</span>
                      </p>
                      <p className="truncate text-xs text-ink-2">
                        {student.university} · {L(student.dept)}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {matched.map((s) => (
                          <SkillChip key={s.name} name={s.name} level={s.level} verified={s.verified} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <button type="button" disabled={invited} onClick={() => onInvite(topic, student)} className={`${buttonStyles.primary} shrink-0`}>
                    {invited ? <Check className="size-4" /> : <Send className="size-4" />}
                    {invited ? t('teacher.research.invited') : t('teacher.research.invite')}
                  </button>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-ink-2">{t('teacher.research.noMatches')}</p>
        )}
      </div>
    </article>
  )
}


function PostTopic({ onPost }) {
  const { t } = useI18n()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [skills, setSkills] = useState([])
  const [seats, setSeats] = useState('2')
  const [stipend, setStipend] = useState('6000')

  function toggle(skill) {
    setSkills((list) => (list.includes(skill) ? list.filter((s) => s !== skill) : [...list, skill]))
  }

  function submit(event) {
    event.preventDefault()
    if (!title.trim() || !description.trim() || !skills.length) return
    onPost({
      id: newId('rt'),
      title: title.trim(),
      description: description.trim(),
      skills,
      seats: Math.max(1, Number(seats) || 1),
      stipend: Math.max(0, Number(stipend) || 0),
      postedAt: nowIso().slice(0, 10),
      applicants: [],
      invited: [],
    })
    setTitle('')
    setDescription('')
    setSkills([])
  }

  return (
    <Panel title={t('teacher.research.post')} className="self-start">
      <form onSubmit={submit} className="grid gap-4 p-5">
        <label htmlFor="rt-title" className="grid gap-1.5 text-sm font-semibold">
          {t('teacher.research.form.title')}
          <input id="rt-title" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('teacher.research.form.titlePlaceholder')} className={`${inputStyles} font-normal`} />
        </label>
        <label htmlFor="rt-desc" className="grid gap-1.5 text-sm font-semibold">
          {t('teacher.research.form.description')}
          <textarea id="rt-desc" required rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className={`${inputStyles} font-normal`} />
        </label>
        <fieldset>
          <legend className="text-sm font-semibold">{t('teacher.research.form.skills')}</legend>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {SKILLS.map((skill) => {
              const on = skills.includes(skill)
              return (
                <button
                  key={skill}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(skill)}
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
                    on ? 'bg-primary text-primary-ink' : 'border border-line text-ink-2 hover:text-ink'
                  }`}
                >
                  {on && <Check className="size-3" />}
                  {skill}
                </button>
              )
            })}
          </div>
          {!skills.length && <p className="mt-1.5 text-xs text-ink-2">{t('teacher.research.form.skillsHint')}</p>}
        </fieldset>
        <div className="grid grid-cols-2 gap-3">
          <label htmlFor="rt-seats" className="grid gap-1.5 text-sm font-semibold">
            {t('teacher.research.form.seats')}
            <input id="rt-seats" type="number" min="1" max="10" inputMode="numeric" value={seats} onChange={(e) => setSeats(e.target.value)} className={`${inputStyles} font-normal`} />
          </label>
          <label htmlFor="rt-stipend" className="grid gap-1.5 text-sm font-semibold">
            {t('teacher.research.form.stipend')}
            <input id="rt-stipend" type="number" min="0" step="500" inputMode="numeric" value={stipend} onChange={(e) => setStipend(e.target.value)} className={`${inputStyles} font-normal`} />
          </label>
        </div>
        <button type="submit" disabled={!skills.length} className={buttonStyles.accent + ' disabled:opacity-45'}>
          <Plus className="size-4" /> {t('teacher.research.form.submit')}
        </button>
        <p className="flex items-start gap-2 text-xs text-ink-2">
          <Target className="mt-0.5 size-3.5 shrink-0" /> {t('teacher.research.form.note')}
        </p>
      </form>
    </Panel>
  )
}

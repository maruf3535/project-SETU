import { ArrowRight, FileText, FlaskConical, PenLine, ScanLine, TriangleAlert, Users, WandSparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageIntro, Panel, Stat, StatusPill } from '../../components/ui'
import { omrBatches, researchTopics } from '../../data/demo/teacher'
import { useI18n } from '../../i18n/I18nProvider'
import { useDemo } from '../../store/DemoStore'
import LevelSwitcher from './LevelSwitcher'
import { ExamStatePill, Eyebrow } from './shared'
import { sectionLabel, useExams, useWrittenProgress, useTeacher } from './useTeacher'

export default function TeacherHome() {
  const { t, L, num, date } = useI18n()
  const { level, persona, saved } = useTeacher()
  const { challenges, projects, studentById } = useDemo()
  const exams = useExams()
  const written = useWrittenProgress()
  const uni = level === 'university'
  const live = exams.filter((e) => e.state === 'live').length

  const actions = [
    { to: '/teacher/generator', icon: WandSparkles, label: t('teacher.home.quick.generate') },
    { to: '/teacher/omr', icon: ScanLine, label: t('teacher.home.quick.omr') },
    { to: '/teacher/written', icon: PenLine, label: t('teacher.home.quick.written') },
    { to: '/teacher/notes', icon: FileText, label: t('teacher.home.quick.notes') },
  ]

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-5 lg:hidden">
        <LevelSwitcher />
      </div>

      <p className="text-sm text-ink-2">{L(persona.curriculum)}</p>
      <PageIntro title={t('teacher.home.greeting', { name: persona.name })} body={uni ? t('teacher.home.bodyUni') : t('teacher.home.body')} />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {uni ? (
          <>
            <Stat tone="brand" label={t('teacher.home.stats.toCheck')} value={num(written.total - written.checked)} note={t('teacher.home.stats.checkedNote', { n: num(written.checked), total: num(written.total) })} />
            <Stat label={t('teacher.home.stats.courses')} value={num(persona.stats.courses)} note={persona.courses.map((c) => c.code).join(' · ')} />
            <Stat label={t('teacher.home.stats.supervised')} value={num(persona.stats.supervised)} note={t('teacher.home.stats.supervisedNote')} />
            <Stat label={t('teacher.home.stats.average')} value={`${num(persona.stats.average)}%`} note={t('teacher.home.stats.averageNoteUni')} />
          </>
        ) : (
          <>
            <Stat tone="brand" label={t('teacher.home.stats.liveExams')} value={num(live)} note={t('teacher.home.stats.liveNote')} />
            {/* Queue size with checked progress, matching "12 of 128 checked" on Written answers */}
            <Stat label={t('teacher.home.stats.scripts')} value={num(written.total)} note={t('teacher.home.stats.checkedNote', { n: num(written.checked), total: num(written.total) })} />
            <Stat label={t('teacher.home.stats.average')} value={`${num(persona.stats.average)}%`} note={t('teacher.home.stats.averageNote')} />
            <Stat label={t('teacher.home.stats.students')} value={num(persona.sections.reduce((sum, s) => sum + s.students, 0))} note={t('teacher.home.stats.sectionsNote', { n: num(persona.sections.length) })} />
          </>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {actions.map(({ to, icon: Icon, label }) => (
          <Link key={to} to={to} className="group rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-primary">
            <span className="grid size-10 place-items-center rounded-xl bg-[color-mix(in_oklab,var(--role)_16%,transparent)] text-role">
              <Icon className="size-5" />
            </span>
            <p className="mt-3 flex items-center justify-between gap-2 text-sm font-semibold">
              {label} <ArrowRight className="size-4 shrink-0 text-ink-2 transition-transform group-hover:translate-x-0.5" />
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <Panel
          title={t('teacher.home.exams')}
          className="self-start"
          action={
            <Link to="/teacher/generator" className="text-sm font-semibold text-primary hover:underline">
              {t('teacher.home.newExam')}
            </Link>
          }
        >
          <ul className="divide-y divide-line">
            {exams.map((exam) => (
              <li key={exam.id} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:gap-4">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{L(exam.title)}</p>
                  <p className="text-sm text-ink-2">
                    {L(sectionLabel(persona, exam.section))}
                    {' · '}
                    {exam.state === 'live'
                      ? t('teacher.home.liveDetail', {
                          n: num(exam.submitted),
                          total: num(persona.sections.find((s) => s.id === exam.section)?.students ?? 0),
                          time: date(exam.closes, { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }),
                        })
                      : t('teacher.home.opensAt', { time: date(exam.opens, { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }) })}
                  </p>
                </div>
                <ExamStatePill state={exam.state} />
              </li>
            ))}
          </ul>
        </Panel>

        {uni ? <ResearchGlance persona={persona} saved={saved} challenges={challenges} projects={projects} studentById={studentById} /> : <SchoolSide persona={persona} />}
      </div>
    </div>
  )
}

function SchoolSide({ persona }) {
  const { t, L, num } = useI18n()
  const batch = omrBatches.school
  return (
    <div className="grid content-start gap-6">
      <Link to="/teacher/omr" className="flex items-start gap-4 rounded-2xl border border-line bg-surface p-4 hover:border-primary">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-warn-soft text-warn">
          <TriangleAlert className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <Eyebrow>{t('teacher.home.insight')}</Eyebrow>
          <span className="mt-1 block font-semibold">{t('teacher.omr.hardest', { q: num(batch.hardest.q), n: num(batch.hardest.missed) })}</span>
          <span className="block text-sm text-ink-2">{L(batch.title)}</span>
        </span>
        <ArrowRight className="mt-1 size-5 shrink-0 text-ink-2" />
      </Link>

      <Panel title={t('teacher.home.sections')}>
        <ul className="divide-y divide-line">
          {persona.sections.map((s) => (
            <li key={s.id} className="flex items-center gap-3 px-5 py-3">
              <Users className="size-4 shrink-0 text-ink-2" />
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{L(s.label)}</span>
              <span className="text-sm text-ink-2 tabular-nums">{t('teacher.home.studentsN', { n: num(s.students) })}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  )
}

function ResearchGlance({ persona, saved, challenges, projects, studentById }) {
  const { t, L, num, date } = useI18n()
  const topics = saved('research', researchTopics)
  const applicants = topics.reduce((sum, topic) => sum + topic.applicants.length, 0)
  const mentored = challenges.filter((c) => c.mentor?.startsWith(persona.name))
  const project = projects.find((p) => p.lead === persona.name)
  const next = project?.milestones.find((m) => m.status !== 'paid')

  return (
    <Panel
      title={t('teacher.home.researchGlance')}
      className="self-start"
      action={
        <Link to="/teacher/research" className="text-sm font-semibold text-primary hover:underline">
          {t('common.viewAll')}
        </Link>
      }
    >
      <div className="grid grid-cols-2 gap-px border-b border-line bg-line">
        <div className="bg-surface px-5 py-4">
          <Eyebrow>{t('teacher.home.openTopics')}</Eyebrow>
          <p className="mt-1 font-display text-2xl font-semibold tabular-nums">{num(topics.length)}</p>
        </div>
        <div className="bg-surface px-5 py-4">
          <Eyebrow>{t('teacher.home.applicants')}</Eyebrow>
          <p className="mt-1 font-display text-2xl font-semibold tabular-nums">{num(applicants)}</p>
        </div>
      </div>
      <ul className="divide-y divide-line">
        {mentored.map((c) => (
          <li key={c.id} className="px-5 py-4">
            <Eyebrow>{t('teacher.research.mentoring')}</Eyebrow>
            <p className="mt-1 font-semibold">{L(c.title)}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-ink-2">
              <StatusPill status={c.status} />
              {c.solver && <span>{t('teacher.research.solver', { name: studentById[c.solver]?.name })}</span>}
            </div>
          </li>
        ))}
        {project && (
          <li className="px-5 py-4">
            <Eyebrow>{t('teacher.research.project')}</Eyebrow>
            <p className="mt-1 flex items-center gap-2 font-semibold">
              <FlaskConical className="size-4 shrink-0 text-role" /> <span className="min-w-0">{L(project.title)}</span>
            </p>
            {next && (
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-ink-2">
                <StatusPill kind="milestone" status={next.status} />
                <span>
                  {L(next.title)} · {t('common.due', { date: date(next.due) })}
                </span>
              </div>
            )}
          </li>
        )}
      </ul>
    </Panel>
  )
}

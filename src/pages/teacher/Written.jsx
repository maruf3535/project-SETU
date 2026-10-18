import { ArrowRight, CircleCheck, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import Avatar from '../../components/Avatar'
import { PageIntro, Panel } from '../../components/ui'
import { writtenQuestions } from '../../data/demo/teacher'
import { useI18n } from '../../i18n/I18nProvider'
import { Eyebrow } from './shared'
import { sectionLabel, useWrittenProgress, useTeacher } from './useTeacher'

function totalOf(marks) {
  return marks.reduce((a, b) => a + b, 0)
}

export function WrittenProgress() {
  const { t, num } = useI18n()
  const { total, checked } = useWrittenProgress()
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-display text-2xl font-semibold tabular-nums">{t('teacher.written.progress', { n: num(checked), total: num(total) })}</p>
        <p className="text-sm text-ink-2 tabular-nums">{t('teacher.written.left', { n: num(total - checked) })}</p>
      </div>
      <div className="mt-3 h-2 rounded-full bg-surface-2" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={checked} aria-label={t('teacher.written.progressLabel')}>
        <div className="h-full rounded-full bg-primary" style={{ width: `${(checked / total) * 100}%` }} />
      </div>
    </div>
  )
}

export default function Written() {
  const { t, L, num } = useI18n()
  const { level, persona } = useTeacher()
  const { confirmed, scripts } = useWrittenProgress()
  const question = writtenQuestions[level]
  const max = totalOf(question.parts.map((p) => p.max))

  return (
    <div className="mx-auto max-w-6xl">
      <PageIntro title={t('teacher.written.title')} body={level === 'university' ? t('teacher.written.bodyUni') : t('teacher.written.body')} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
        <div className="grid content-start gap-6">
          <WrittenProgress />

          <Panel title={t('teacher.written.queue')}>
            <ul className="divide-y divide-line">
              {scripts.map((script) => {
                const done = confirmed[script.id]
                const suggested = totalOf(script.answers.map((a) => a.ai))
                return (
                  <li key={script.id}>
                    <Link to={`/teacher/written/${script.id}`} className="flex items-center gap-3 px-5 py-4 hover:bg-surface-2/60">
                      <Avatar initials={script.initials} className="size-10 text-sm" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold">{script.name}</span>
                        <span className="block truncate text-sm text-ink-2">
                          {t(`teacher.omr.${level === 'university' ? 'studentId' : 'roll'}`)} {script.roll} · {L(sectionLabel(persona, script.section))}
                        </span>
                      </span>
                      {done ? (
                        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-ok-soft px-2.5 py-1 text-xs font-semibold text-ok tabular-nums">
                          <CircleCheck className="size-3.5" /> {t('teacher.written.checked', { n: num(totalOf(done.marks)), max: num(max) })}
                        </span>
                      ) : (
                        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-warn tabular-nums">
                          <Sparkles className="size-3.5" /> {t('teacher.written.suggested', { n: num(suggested), max: num(max) })}
                        </span>
                      )}
                      <ArrowRight className="hidden size-4 shrink-0 text-ink-2 sm:block" />
                    </Link>
                  </li>
                )
              })}
            </ul>
          </Panel>
        </div>

        <Panel title={t('teacher.written.question')} className="self-start">
          <div className="p-5">
            <p className="font-semibold">{L(question.title)}</p>
            <p className="mt-2 text-sm text-ink-2">{L(question.stem)}</p>
            <ol className="mt-4 grid gap-2.5">
              {question.parts.map((part) => (
                <li key={part.kind} className="grid grid-cols-[1.5rem_minmax(0,1fr)_auto] gap-2 text-sm">
                  <span className="font-semibold">{L(part.label)}.</span>
                  <span className="min-w-0">{L(part.prompt)}</span>
                  <span className="text-ink-2 tabular-nums">{num(part.max)}</span>
                </li>
              ))}
            </ol>
            <Eyebrow className="mt-5">{t('teacher.written.rubric')}</Eyebrow>
            <p className="mt-1 text-sm text-ink-2">
              {question.parts.map((p) => `${t(`teacher.written.kinds.${p.kind}`)} ${num(p.max)}`).join(' + ')} = {num(max)}
            </p>
          </div>
        </Panel>
      </div>
    </div>
  )
}

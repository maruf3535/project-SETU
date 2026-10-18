import { ArrowLeft, CircleCheck, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Avatar from '../../components/Avatar'
import { useToast } from '../../components/Toast'
import { buttonStyles, Panel } from '../../components/ui'
import { writtenQuestions } from '../../data/demo/teacher'
import { useI18n } from '../../i18n/I18nProvider'
import { Eyebrow } from './shared'
import { sectionLabel, useWrittenProgress, useTeacher, nowIso } from './useTeacher'
import { WrittenProgress } from './Written'

const sum = (list) => list.reduce((a, b) => a + b, 0)

export default function WrittenDetail() {
  const { id } = useParams()
  const { t } = useI18n()
  const { level } = useTeacher()
  const script = writtenQuestions[level].scripts.find((s) => s.id === id)

  if (!script) {
    return (
      <div className="mx-auto max-w-xl py-10 text-center">
        <p className="font-semibold">{t('teacher.written.notFound')}</p>
        <Link to="/teacher/written" className={`${buttonStyles.ghost} mt-4`}>
          <ArrowLeft className="size-4" /> {t('teacher.written.back')}
        </Link>
      </div>
    )
  }
  return <ScriptMarking key={script.id} script={script} />
}

function ScriptMarking({ script }) {
  const { t, L, num } = useI18n()
  const { level, persona, saved, save } = useTeacher()
  const { confirmed, scripts } = useWrittenProgress()
  const toast = useToast()
  const navigate = useNavigate()
  const question = writtenQuestions[level]
  const previous = confirmed[script.id]
  const [marks, setMarks] = useState(previous?.marks ?? script.answers.map((a) => a.ai))
  const max = sum(question.parts.map((p) => p.max))
  const total = sum(marks)

  function setPart(index, value) {
    setMarks((list) => list.map((m, i) => (i === index ? value : m)))
  }

  function confirm() {
    save('written', { ...saved('written', {}), [script.id]: { marks, at: nowIso() } })
    toast(t('teacher.written.confirmedToast', { name: script.name, n: num(total), max: num(max) }))
    const next = scripts.find((s) => s.id !== script.id && !confirmed[s.id])
    navigate(next ? `/teacher/written/${next.id}` : '/teacher/written')
  }

  return (
    <div className="mx-auto max-w-6xl">
      <Link to="/teacher/written" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
        <ArrowLeft className="size-4" /> {t('teacher.written.back')}
      </Link>

      <div className="flex items-center gap-3">
        <Avatar initials={script.initials} className="size-12 text-base" />
        <div className="min-w-0">
          <h2 className="font-display text-2xl font-semibold">{script.name}</h2>
          <p className="text-sm text-ink-2">
            {t(`teacher.omr.${level === 'university' ? 'studentId' : 'roll'}`)} {script.roll} · {L(sectionLabel(persona, script.section))} · {L(question.title)}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
        <div className="grid content-start gap-4">
          <section className="rounded-2xl bg-surface-2 p-5">
            <Eyebrow>{t('teacher.written.stem')}</Eyebrow>
            <p className="mt-1.5">{L(question.stem)}</p>
          </section>

          {question.parts.map((part, i) => {
            const answer = script.answers[i]
            const text = L(answer.text)
            const adjusted = marks[i] !== answer.ai
            return (
              <section key={part.kind} className="rounded-2xl border border-line bg-surface">
                <header className="flex flex-wrap items-start justify-between gap-2 border-b border-line px-5 py-3.5">
                  <p className="min-w-0 flex-1 font-semibold">
                    {L(part.label)}. {L(part.prompt)}
                  </p>
                  <span className="shrink-0 rounded-full bg-surface-2 px-2.5 py-1 text-xs font-semibold text-ink-2">
                    {t(`teacher.written.kinds.${part.kind}`)} · {t('teacher.written.marksN', { n: num(part.max) })}
                  </span>
                </header>
                <div className="p-5">
                  <Eyebrow>{t('teacher.written.studentAnswer')}</Eyebrow>
                  {text ? (
                    <p className="mt-1.5 border-l-2 border-role pl-3 font-display text-lg leading-relaxed italic">{text}</p>
                  ) : (
                    <p className="mt-1.5 text-sm text-ink-2 italic">{t('teacher.written.blank')}</p>
                  )}

                  <p className="mt-4 flex items-start gap-2 rounded-xl bg-accent-soft p-3 text-sm">
                    <Sparkles className="mt-0.5 size-4 shrink-0 text-warn" />
                    <span>
                      <span className="font-semibold tabular-nums">{t('teacher.written.aiSuggests', { n: num(answer.ai), max: num(part.max) })}</span>{' '}
                      {L(answer.reason)}
                    </span>
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <span id={`mark-${part.kind}`} className="text-sm font-semibold">
                      {t('teacher.written.yourMark')}
                    </span>
                    <div role="radiogroup" aria-labelledby={`mark-${part.kind}`} className="inline-flex gap-1 rounded-xl border border-line bg-surface p-1">
                      {Array.from({ length: part.max + 1 }, (_, v) => (
                        <button
                          key={v}
                          type="button"
                          role="radio"
                          aria-checked={marks[i] === v}
                          onClick={() => setPart(i, v)}
                          className={`grid size-9 place-items-center rounded-lg text-sm font-semibold tabular-nums ${marks[i] === v ? 'bg-primary text-primary-ink' : 'text-ink-2 hover:bg-surface-2 hover:text-ink'}`}
                        >
                          {num(v)}
                        </button>
                      ))}
                    </div>
                    {adjusted && <span className="rounded-full bg-surface-2 px-2.5 py-1 text-xs font-semibold text-ink">{t('teacher.written.adjusted')}</span>}
                  </div>
                </div>
              </section>
            )
          })}
        </div>

        <div className="grid content-start gap-4 lg:sticky lg:top-6 lg:self-start">
          <Panel title={t('teacher.written.rubric')}>
            <ul className="divide-y divide-line">
              {question.parts.map((part, i) => (
                <li key={part.kind} className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
                  <span className="min-w-0">
                    <span className="font-semibold">{L(part.label)}.</span> {t(`teacher.written.kinds.${part.kind}`)}
                  </span>
                  <span className="tabular-nums">
                    <span className="font-semibold">{num(marks[i])}</span>
                    <span className="text-ink-2">/{num(part.max)}</span>
                  </span>
                </li>
              ))}
              <li className="flex items-center justify-between gap-3 px-5 py-4">
                <span className="font-semibold">{t('teacher.written.total')}</span>
                <span className="font-display text-3xl font-semibold tabular-nums">
                  {num(total)}
                  <span className="text-lg text-ink-2">/{num(max)}</span>
                </span>
              </li>
            </ul>
            <div className="border-t border-line p-5">
              <button type="button" onClick={confirm} className={`${buttonStyles.accent} w-full`}>
                <CircleCheck className="size-4" /> {previous ? t('teacher.written.update') : t('teacher.written.confirm')}
              </button>
              <p className="mt-2 text-xs text-ink-2">{t('teacher.written.confirmNote')}</p>
            </div>
          </Panel>
          <WrittenProgress />
        </div>
      </div>
    </div>
  )
}

import { Clock3, Lightbulb, Timer, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { buttonStyles } from '../../components/ui'
import { questionBank } from '../../data/demo/questions'
import { useI18n } from '../../i18n/I18nProvider'
import { useCurrentStudent, useDemo } from '../../store/DemoStore'

const DURATION = 10 * 60
const HINT_COST = 5

function shuffle(list) {
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function Running({ questions, onFinish, onQuit }) {
  const { t, L, num } = useI18n()
  const { student } = useCurrentStudent()
  const { dispatch } = useDemo()
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [hints, setHints] = useState({})
  const [left, setLeft] = useState(DURATION)

  useEffect(() => {
    const timer = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (left === 0) onFinish(answers)
  }, [left, answers, onFinish])

  const question = questions[index]
  const hinted = hints[question.id]
  const minutes = String(Math.floor(left / 60)).padStart(2, '0')
  const seconds = String(left % 60).padStart(2, '0')
  const unanswered = questions.filter((q) => answers[q.id] === undefined).length
  const last = index === questions.length - 1

  function takeHint() {
    // Cross out one wrong option, chosen once per question
    const wrong = question.options.map((_, i) => i).filter((i) => i !== question.answer)
    setHints((h) => ({ ...h, [question.id]: wrong[Math.floor(Math.random() * wrong.length)] }))
    dispatch({ type: 'addPoints', studentId: student.id, amount: -HINT_COST })
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between gap-3">
        <button type="button" onClick={onQuit} aria-label={t('student.exam.quit')} className="grid size-9 place-items-center rounded-full border border-line bg-surface text-ink-2 hover:text-ink">
          <X className="size-4" />
        </button>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold tabular-nums ${left < 60 ? 'bg-bad-soft text-bad' : 'bg-accent-soft text-warn'}`}>
          <Clock3 className="size-4" /> {t('student.exam.left', { time: `${num(Number(minutes)).padStart(2, num(0))}:${num(Number(seconds)).padStart(2, num(0))}` })}
        </span>
      </div>

      <div className="mt-5 flex items-center justify-between text-sm text-ink-2">
        <span className="tabular-nums">{t('student.exam.question', { n: num(index + 1), total: num(questions.length) })}</span>
        <span>{L(question.source)}</span>
      </div>
      <div className="mt-2 grid grid-cols-10 gap-1" aria-hidden="true">
        {questions.map((q, i) => (
          <button
            key={q.id}
            type="button"
            tabIndex={-1}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full ${i === index ? 'bg-accent' : answers[q.id] !== undefined ? 'bg-primary' : 'bg-line'}`}
          />
        ))}
      </div>

      <h2 className="mt-6 font-display text-2xl leading-snug font-semibold">{L(question.q)}</h2>

      <div role="radiogroup" aria-label={L(question.q)} className="mt-6 grid gap-2.5">
        {question.options.map((option, i) => {
          const chosen = answers[question.id] === i
          const struck = hinted === i
          return (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={chosen}
              disabled={struck}
              onClick={() => setAnswers((a) => ({ ...a, [question.id]: i }))}
              className={`flex items-center gap-3 rounded-2xl border bg-surface px-4 py-3.5 text-left transition-colors ${
                chosen ? 'border-primary ring-1 ring-primary' : 'border-line hover:border-ink-2'
              } ${struck ? 'opacity-40 line-through' : ''}`}
            >
              <span className={`grid size-7 shrink-0 place-items-center rounded-full text-sm font-bold ${chosen ? 'bg-primary text-primary-ink' : 'bg-surface-2 text-ink-2'}`}>
                {String.fromCharCode(65 + i)}
              </span>
              {L(option)}
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={takeHint}
        disabled={hinted !== undefined}
        className="mt-4 inline-flex items-center gap-2 text-sm text-ink-2 hover:text-ink disabled:text-primary"
      >
        <Lightbulb className="size-4" /> {hinted !== undefined ? t('student.exam.hintUsed') : t('student.exam.hint')}
      </button>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
        <button type="button" disabled={index === 0} onClick={() => setIndex((i) => i - 1)} className={`${buttonStyles.ghost} disabled:opacity-40`}>
          {t('student.exam.prev')}
        </button>
        <span className="text-sm text-ink-2 tabular-nums">{t('student.exam.unanswered', { n: num(unanswered) })}</span>
        {last ? (
          <button type="button" onClick={() => onFinish(answers)} className={buttonStyles.accent}>
            {t('student.exam.finish')}
          </button>
        ) : (
          <button type="button" onClick={() => setIndex((i) => i + 1)} className={buttonStyles.primary}>
            {t('student.exam.next')}
          </button>
        )}
      </div>
    </div>
  )
}

export default function Exam() {
  const { t, L, num } = useI18n()
  const { level, config, student } = useCurrentStudent()
  const { dispatch } = useDemo()
  const navigate = useNavigate()
  const [attempt, setAttempt] = useState(0)
  const [running, setRunning] = useState(false)
  const pool = useMemo(() => questionBank[level].filter((q) => q.type === 'mcq'), [level])
  // A fresh random order for every attempt
  const questions = useMemo(() => (attempt ? shuffle(pool) : pool), [pool, attempt])

  function start() {
    setAttempt((n) => n + 1)
    setRunning(true)
  }

  function finish(answers) {
    const byChapter = {}
    let correct = 0
    questions.forEach((q) => {
      const ok = answers[q.id] === q.answer
      if (ok) correct++
      byChapter[q.chapter] = byChapter[q.chapter] ?? [0, 0]
      byChapter[q.chapter][0] += ok ? 1 : 0
      byChapter[q.chapter][1] += 1
    })
    dispatch({
      type: 'finishExam',
      result: {
        studentId: student.id,
        level,
        total: questions.length,
        correct,
        answers,
        order: questions.map((q) => q.id),
        byChapter,
        earned: correct * 4,
        betterThan: Math.min(97, 30 + correct * 6),
        at: new Date().toISOString(),
      },
    })
    navigate('/student/exam/result')
  }

  if (running) return <Running key={attempt} questions={questions} onFinish={finish} onQuit={() => setRunning(false)} />

  return (
    <div className="mx-auto max-w-xl">
      <section className="rounded-3xl bg-brand p-7 text-brand-ink">
        <span className="grid size-12 place-items-center rounded-2xl bg-accent text-accent-ink">
          <Timer className="size-6" />
        </span>
        <p className="mt-5 text-sm text-brand-ink/65">{L(config.curriculum)}</p>
        <h2 className="mt-1 font-display text-3xl font-semibold">{L(config.exam.title)}</h2>
        <p className="mt-2 font-semibold text-accent">{t('student.exam.intro', { n: num(pool.length), m: num(DURATION / 60) })}</p>
        <p className="mt-3 text-sm leading-relaxed text-brand-ink/70">{t('student.exam.introBody')}</p>
        <button type="button" onClick={start} className="mt-6 w-full rounded-2xl bg-accent py-3.5 font-semibold text-accent-ink transition-transform hover:-translate-y-px">
          {t('student.exam.start')}
        </button>
      </section>
    </div>
  )
}

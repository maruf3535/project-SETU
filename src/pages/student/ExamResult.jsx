import { CirclePlay, ListChecks, Pause, Play, RotateCcw, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { buttonStyles, Dialog } from '../../components/ui'
import { questionBank } from '../../data/demo/questions'
import { studentLevels } from '../../data/demo/studentLevels'
import { useI18n } from '../../i18n/I18nProvider'
import { useDemo } from '../../store/DemoStore'

function ScoreRing({ correct, total }) {
  const { num } = useI18n()
  const r = 52
  const c = 2 * Math.PI * r
  const pct = correct / total
  return (
    <div className="relative size-36 shrink-0">
      <svg viewBox="0 0 120 120" className="size-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--brand-ink)" strokeOpacity="0.15" strokeWidth="10" />
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--accent)" strokeWidth="10" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct)} />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="font-display text-3xl font-semibold tabular-nums">
            {num(correct)}/{num(total)}
          </p>
          <p className="text-xs text-brand-ink/60 tabular-nums">{num(Math.round(pct * 100))}%</p>
        </div>
      </div>
    </div>
  )
}

// A stand-in for the generated explainer video: three captioned steps that play through
function VideoPlayer({ topic }) {
  const { t } = useI18n()
  const steps = t('student.result.videoSteps')
  const [playing, setPlaying] = useState(true)
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!playing) return undefined
    const timer = setInterval(() => setStep((s) => (s + 1) % steps.length), 2600)
    return () => clearInterval(timer)
  }, [playing, steps.length])

  return (
    <div>
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-brand text-brand-ink">
        <div className="absolute inset-0 grid place-items-center p-6 text-center">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-accent uppercase">{topic}</p>
            <p key={step} className="mt-2 font-display text-2xl font-semibold">{steps[step]}</p>
          </div>
        </div>
        <div className="absolute inset-x-4 bottom-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? t('student.result.pause') : t('student.result.play')}
            className="grid size-9 place-items-center rounded-full bg-accent text-accent-ink"
          >
            {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
          </button>
          <div className="h-1 flex-1 rounded-full bg-brand-ink/20">
            <div className="h-full rounded-full bg-accent transition-[width] duration-500" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
          </div>
        </div>
      </div>
      <p className="mt-3 text-sm text-ink-2">{t('student.result.videoCaption')}</p>
    </div>
  )
}

export default function ExamResult() {
  const { t, L, num } = useI18n()
  const { lastExam } = useDemo()
  const [video, setVideo] = useState(false)
  const [reviewOpen, setReviewOpen] = useState(false)

  if (!lastExam) {
    return (
      <div className="mx-auto max-w-md py-10 text-center">
        <p className="text-ink-2">{t('student.result.none')}</p>
        <Link to="/student/exam" className={`${buttonStyles.primary} mt-5`}>
          {t('student.exam.start')}
        </Link>
      </div>
    )
  }

  const config = studentLevels[lastExam.level]
  const bank = Object.fromEntries(questionBank[lastExam.level].map((q) => [q.id, q]))
  const chapters = Object.entries(lastExam.byChapter)
  const weakest = [...chapters].sort((a, b) => a[1][0] / a[1][1] - b[1][0] / b[1][1])[0]
  const weakestName = L(config.chapters[weakest[0]])
  const wrong = lastExam.order.map((id) => bank[id]).filter((q) => lastExam.answers[q.id] !== q.answer)
  const pct = lastExam.correct / lastExam.total
  const headline = pct >= 0.8 ? t('student.result.great') : pct >= 0.5 ? t('student.result.good') : t('student.result.keep')

  return (
    <div className="mx-auto max-w-3xl">
      <section className="flex flex-col items-center gap-6 rounded-3xl bg-brand p-7 text-brand-ink sm:flex-row">
        <ScoreRing correct={lastExam.correct} total={lastExam.total} />
        <div className="text-center sm:text-left">
          <p className="text-sm text-brand-ink/65">{L(config.exam.title)}</p>
          <h2 className="mt-1 font-display text-3xl font-semibold">{headline}</h2>
          <p className="mt-1 text-brand-ink/70">{t('student.result.better', { n: num(lastExam.betterThan) })}</p>
          <span className="mt-3 inline-block rounded-full bg-accent px-3 py-1 text-sm font-semibold text-accent-ink">
            {t('student.result.earned', { n: num(lastExam.earned) })}
          </span>
        </div>
      </section>

      <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <section className="rounded-2xl border border-line bg-surface p-5">
          <h3 className="text-xs font-semibold tracking-[0.12em] text-ink-2 uppercase">{t('student.result.byTopic')}</h3>
          <ul className="mt-4 grid gap-4">
            {chapters.map(([key, [right, total]]) => {
              const ratio = right / total
              return (
                <li key={key}>
                  <div className="flex items-center justify-between text-sm">
                    <span>{L(config.chapters[key])}</span>
                    <span className="font-semibold tabular-nums">
                      {num(right)}/{num(total)}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 rounded-full bg-surface-2">
                    <div className={`h-full rounded-full ${ratio >= 0.7 ? 'bg-primary' : 'bg-accent'}`} style={{ width: `${ratio * 100}%` }} />
                  </div>
                </li>
              )
            })}
          </ul>
        </section>

        <div className="grid content-start gap-3">
          <button type="button" onClick={() => setVideo(true)} className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 text-left hover:border-primary">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent text-accent-ink">
              <CirclePlay className="size-6" />
            </span>
            <span className="min-w-0">
              <span className="block font-semibold">{t('student.result.watch', { topic: weakestName })}</span>
              <span className="block text-sm text-ink-2">{t('student.result.watchNote')}</span>
            </span>
          </button>
          {wrong.length > 0 ? (
            <button type="button" onClick={() => setReviewOpen((v) => !v)} aria-expanded={reviewOpen} className={buttonStyles.ghost}>
              {reviewOpen ? <X className="size-4" /> : <ListChecks className="size-4" />} {t('student.result.reviewTitle')} · {num(wrong.length)}
            </button>
          ) : (
            <p className="rounded-2xl bg-ok-soft p-4 text-sm font-semibold text-ok">{t('student.result.perfect')}</p>
          )}
          <Link to="/student/exam" className={buttonStyles.primary}>
            <RotateCcw className="size-4" /> {t('student.result.retake')}
          </Link>
        </div>
      </div>

      {reviewOpen && (
        <ol className="mt-6 grid gap-3">
          {wrong.map((q) => {
            const chosen = lastExam.answers[q.id]
            return (
              <li key={q.id} className="rounded-2xl border border-line bg-surface p-5">
                <p className="font-medium">{L(q.q)}</p>
                <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                  <div className="rounded-xl bg-bad-soft px-3 py-2">
                    <dt className="text-xs text-bad">{t('student.result.yourAnswer')}</dt>
                    <dd className="font-semibold">{chosen === undefined ? t('student.result.noAnswer') : L(q.options[chosen])}</dd>
                  </div>
                  <div className="rounded-xl bg-ok-soft px-3 py-2">
                    <dt className="text-xs text-ok">{t('student.result.correct')}</dt>
                    <dd className="font-semibold">{L(q.options[q.answer])}</dd>
                  </div>
                </dl>
                <p className="mt-3 text-sm text-ink-2">{L(q.explain)}</p>
              </li>
            )
          })}
        </ol>
      )}

      <Dialog open={video} title={t('student.result.watch', { topic: weakestName })} onClose={() => setVideo(false)}>
        <VideoPlayer topic={weakestName} />
      </Dialog>
    </div>
  )
}

import { Camera, CircleCheck, CircleMinus, CircleX, ImageUp, RotateCcw, ScanLine, SkipForward, TriangleAlert } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useToast } from '../../components/Toast'
import { buttonStyles, PageIntro, Panel } from '../../components/ui'
import { omrBatches } from '../../data/demo/teacher'
import { useI18n } from '../../i18n/I18nProvider'
import OmrSheet from './OmrSheet'
import { Eyebrow } from './shared'
import { useTeacher } from './useTeacher'

const SCAN_MS = 1300

function grade(sheet, key) {
  const correct = sheet.answers.filter((a, i) => a === key[i]).length
  const blank = sheet.answers.filter((a) => a === null).length
  return { correct, blank, wrong: key.length - correct - blank }
}

function reducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

export default function Omr() {
  const { level } = useTeacher()
  return <OmrScanner key={level} />
}

function OmrScanner() {
  const { t, L, num, lang } = useI18n()
  const { level } = useTeacher()
  const toast = useToast()
  const batch = omrBatches[level]
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState('idle')
  const [linePos, setLinePos] = useState(0)
  const [savedScores, setSavedScores] = useState([])
  const [photo, setPhoto] = useState('')

  const done = index >= batch.sheets.length
  const sheet = batch.sheets[Math.min(index, batch.sheets.length - 1)]
  const result = grade(sheet, batch.key)
  const scored = phase === 'done' && !done

  // Batch totals include the sheet on screen once it is graded
  const count = batch.before.count + savedScores.length + (scored ? 1 : 0)
  const sum = batch.before.sum + savedScores.reduce((a, b) => a + b, 0) + (scored ? result.correct : 0)
  const average = Math.round((sum / count) * 10) / 10

  useEffect(() => {
    if (phase !== 'scanning') return undefined
    const reduce = reducedMotion()
    const frame = requestAnimationFrame(() => setLinePos(100))
    const timer = setTimeout(() => setPhase('done'), reduce ? 150 : SCAN_MS)
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(timer)
    }
  }, [phase])

  function scan() {
    setLinePos(0)
    setPhase('scanning')
  }

  function saveNext() {
    setSavedScores((list) => [...list, result.correct])
    toast(t('teacher.omr.savedToast', { roll: sheet.roll, name: sheet.name, score: num(result.correct), total: num(batch.key.length) }))
    setIndex((i) => i + 1)
    setPhase('idle')
    setPhoto('')
  }

  function choosePhoto(event) {
    const file = event.target.files?.[0]
    if (!file) return
    setPhoto(file.name)
    scan()
    event.target.value = ''
  }

  function restart() {
    setIndex(0)
    setSavedScores([])
    setPhase('idle')
    setPhoto('')
  }

  const optionLabels = t('teacher.generator.optionLabels')
  const misses = batch.key
    .map((k, i) => ({ q: i + 1, mark: sheet.answers[i], key: k }))
    .filter((m) => m.mark !== m.key)

  const sheetLabels = {
    aria: t('teacher.omr.sheetAria', { name: sheet.name }),
    brand: t('teacher.omr.sheetBrand'),
    exam: L(batch.title),
    roll: t(`teacher.omr.${batch.idLabel}`),
    name: t('teacher.omr.name'),
    set: t('teacher.omr.setCode'),
    setNames: ['A', 'B', 'C'].map((s) => t(`teacher.generator.setNames.${s}`)),
    instructions: t('teacher.omr.instructions'),
    options: optionLabels,
    number: (n) => (lang === 'bn' ? num(n) : String(n)),
  }

  const status = {
    idle: t('teacher.omr.align'),
    scanning: t('teacher.omr.reading'),
    done: t('teacher.omr.detected', { s: num(sheet.seconds) }),
  }[phase]

  return (
    <div className="mx-auto max-w-6xl">
      <PageIntro title={t('teacher.omr.title')} body={t('teacher.omr.body')} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
        <div className="min-w-0">
          {/* Camera viewfinder */}
          <div className="relative overflow-hidden rounded-3xl bg-brand p-5 sm:p-8">
            <p className="mb-4 flex items-center justify-center gap-2 text-sm font-semibold text-brand-ink" aria-live="polite">
              {phase === 'done' ? <CircleCheck className="size-4 text-accent" /> : <Camera className="size-4 text-brand-ink/70" />}
              {status}
            </p>
            <div className="relative mx-auto max-w-sm">
              {['top-0 left-0 border-t-4 border-l-4 rounded-tl-xl', 'top-0 right-0 border-t-4 border-r-4 rounded-tr-xl', 'bottom-0 left-0 border-b-4 border-l-4 rounded-bl-xl', 'bottom-0 right-0 border-b-4 border-r-4 rounded-br-xl'].map((pos) => (
                <span key={pos} aria-hidden="true" className={`absolute z-10 size-8 border-accent ${pos}`} />
              ))}
              <div className="relative p-3">
                {done ? (
                  <div className="grid aspect-[300/410] place-items-center rounded-md bg-surface p-6 text-center">
                    <div>
                      <CircleCheck className="mx-auto size-10 text-ok" />
                      <p className="mt-3 font-semibold">{t('teacher.omr.endTitle')}</p>
                      <p className="mt-1 text-sm text-ink-2">{t('teacher.omr.endBody')}</p>
                      <button type="button" onClick={restart} className={`${buttonStyles.ghost} mt-4`}>
                        <RotateCcw className="size-4" /> {t('teacher.omr.restart')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={`relative transition-opacity ${phase === 'scanning' ? 'opacity-90' : ''}`}>
                    <OmrSheet sheet={sheet} answerKey={batch.key} graded={phase === 'done'} labels={sheetLabels} className="rounded-md shadow-[0_18px_40px_-18px_rgb(0_0_0/0.6)]" />
                    {phase === 'scanning' && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 h-1 rounded-full bg-accent shadow-[0_0_18px_4px_var(--accent)] transition-[top] ease-linear"
                        style={{ top: `${linePos}%`, transitionDuration: reducedMotion() ? '0ms' : `${SCAN_MS}ms` }}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>

            {!done && (
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                <button type="button" onClick={scan} disabled={phase === 'scanning'} className={`${buttonStyles.accent} disabled:opacity-45`}>
                  <ScanLine className="size-4" />
                  {phase === 'done' ? t('teacher.omr.rescan') : t('teacher.omr.scan')}
                </button>
                <label htmlFor="omr-photo" className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-ink/10 px-4 py-2.5 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-ink/15">
                  <ImageUp className="size-4" /> {t('teacher.omr.choosePhoto')}
                  <input id="omr-photo" type="file" accept="image/*" capture="environment" onChange={choosePhoto} className="sr-only" />
                </label>
              </div>
            )}
            <p className="mx-auto mt-3 max-w-sm text-center text-xs text-brand-ink/60">
              {photo ? t('teacher.omr.photoNote', { file: photo }) : t('teacher.omr.demoNote')}
            </p>
          </div>
        </div>

        <div className="grid content-start gap-6">
          {phase === 'done' && !done ? (
            <section className="rounded-2xl border border-line bg-surface p-5" aria-live="polite">
              <Eyebrow>{t(`teacher.omr.${batch.idLabel}`)} {sheet.roll}</Eyebrow>
              <div className="mt-1 flex items-end justify-between gap-3">
                <p className="min-w-0 truncate text-lg font-semibold">{sheet.name}</p>
                <p className="font-display text-4xl font-semibold tabular-nums">
                  {num(result.correct)}
                  <span className="text-xl text-ink-2">/{num(batch.key.length)}</span>
                </p>
              </div>
              <p className="mt-1 text-sm text-ink-2">{t('teacher.omr.detected', { s: num(sheet.seconds) })}</p>
              <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                {[
                  { k: 'correct', n: result.correct, icon: CircleCheck, tone: 'bg-ok-soft text-ok' },
                  { k: 'wrong', n: result.wrong, icon: CircleX, tone: 'bg-bad-soft text-bad' },
                  { k: 'blank', n: result.blank, icon: CircleMinus, tone: 'bg-surface-2 text-ink-2' },
                ].map(({ k, n, icon: Icon, tone }) => (
                  <div key={k} className={`rounded-xl p-2.5 ${tone}`}>
                    <dt className="flex items-center justify-center gap-1 text-xs font-semibold">
                      <Icon className="size-3.5" /> {t(`teacher.omr.${k}`)}
                    </dt>
                    <dd className="mt-0.5 font-display text-2xl font-semibold tabular-nums">{num(n)}</dd>
                  </div>
                ))}
              </dl>
              {misses.length > 0 && (
                <ul className="mt-4 grid gap-1.5 text-sm">
                  {misses.map((m) => (
                    <li key={m.q} className="flex items-center justify-between gap-3 rounded-lg bg-surface-2 px-3 py-1.5">
                      <span className="font-semibold tabular-nums">{t('teacher.omr.q', { n: num(m.q) })}</span>
                      <span className="text-ink-2">
                        {m.mark === null ? t('teacher.omr.leftBlank') : t('teacher.omr.marked', { a: optionLabels[m.mark] })} · {t('teacher.omr.answer', { a: optionLabels[m.key] })}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-5 grid grid-cols-2 gap-2">
                <button type="button" onClick={scan} className={buttonStyles.ghost}>
                  <RotateCcw className="size-4" /> {t('teacher.omr.rescan')}
                </button>
                <button type="button" onClick={saveNext} className={buttonStyles.primary}>
                  <SkipForward className="size-4" /> {t('teacher.omr.saveNext')}
                </button>
              </div>
            </section>
          ) : (
            <section className="rounded-2xl border border-dashed border-line p-5 text-sm text-ink-2">
              {done ? t('teacher.omr.endBody') : t('teacher.omr.waiting', { roll: sheet.roll })}
            </section>
          )}

          <Panel title={t('teacher.omr.batch')}>
            <div className="p-5">
              <p className="text-sm text-ink-2">{L(batch.title)}</p>
              <p className="mt-3 flex items-baseline justify-between gap-2">
                <span className="font-display text-2xl font-semibold tabular-nums">{t('teacher.omr.sheetsOf', { n: num(count), total: num(batch.total) })}</span>
              </p>
              <div className="mt-2 h-2 rounded-full bg-surface-2" role="progressbar" aria-valuemin={0} aria-valuemax={batch.total} aria-valuenow={count} aria-label={t('teacher.omr.batch')}>
                <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${(count / batch.total) * 100}%` }} />
              </div>
              <dl className="mt-5">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-sm text-ink-2">{t('teacher.omr.average')}</dt>
                  <dd className="font-semibold tabular-nums">
                    {num(average)}/{num(batch.key.length)}
                  </dd>
                </div>
              </dl>
              <p className="mt-3 flex items-start gap-3 rounded-xl bg-warn-soft p-3 text-sm">
                <TriangleAlert className="mt-0.5 size-4 shrink-0 text-warn" />
                <span>
                  <span className="block font-semibold">{t('teacher.omr.hardest', { q: num(batch.hardest.q), n: num(batch.hardest.missed) })}</span>
                  <span className="block text-ink-2">{t('teacher.omr.hardestNote')}</span>
                </span>
              </p>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}

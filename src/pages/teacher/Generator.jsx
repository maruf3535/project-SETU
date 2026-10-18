import { Check, Info, Loader2, Minus, Plus, RotateCcw, Send, WandSparkles } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePasscode } from '../../components/Passcode'
import { useToast } from '../../components/Toast'
import { buttonStyles, inputStyles, PageIntro, Panel } from '../../components/ui'
import { questionBank } from '../../data/demo/questions'
import { extraQuestions } from '../../data/demo/teacher'
import { useI18n } from '../../i18n/I18nProvider'
import { Eyebrow } from './shared'
import { newId, useTeacher } from './useTeacher'

const DIFFICULTIES = ['easy', 'board', 'hard']
const SETS = ['A', 'B', 'C']
const CREATIVE_MARKS = 10
// SSC creative format: knowledge 1, comprehension 2, application 3, higher-order 4
const PART_MARKS = { knowledge: 1, comprehension: 2, application: 3, higherOrder: 4 }

// Small deterministic random generator, so Set A always looks the same for the same paper
function seeded(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let x = Math.imul(a ^ (a >>> 15), 1 | a)
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}

function shuffle(list, rand) {
  const out = [...list]
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

// Easy papers lean on questions most students solved, hard ones on the least solved
function pick(pool, n, difficulty) {
  const order = {
    easy: (a, b) => b.solved - a.solved,
    hard: (a, b) => a.solved - b.solved,
    board: (a, b) => Math.abs(a.solved - 70) - Math.abs(b.solved - 70),
  }[difficulty]
  return [...pool].sort(order).slice(0, n)
}

// Each set shuffles question order and MCQ options; the answer key follows the options
function buildSet(mcqs, creatives, setIndex, round) {
  const rand = seeded((setIndex + 1) * 7919 + round * 104729)
  const mcq = shuffle(mcqs, rand).map((q) => {
    const order = setIndex === 0 ? q.options.map((_, i) => i) : shuffle(q.options.map((_, i) => i), rand)
    return { ...q, options: order.map((i) => q.options[i]), answer: order.indexOf(q.answer) }
  })
  return { mcq, creative: shuffle(creatives, rand) }
}

function Stepper({ id, label, value, min, max, onChange, note }) {
  const { t, num } = useI18n()
  return (
    <div>
      <p id={id} className="text-sm font-semibold">
        {label}
      </p>
      <div role="group" aria-labelledby={id} className="mt-2 inline-flex items-center rounded-xl border border-line bg-surface">
        <button type="button" onClick={() => onChange(value - 1)} disabled={value <= min} aria-label={t('teacher.generator.less')} className="grid size-10 place-items-center rounded-l-xl text-ink-2 hover:bg-surface-2 disabled:opacity-40">
          <Minus className="size-4" />
        </button>
        <output aria-live="polite" className="w-12 text-center font-display text-xl font-semibold tabular-nums">
          {num(value)}
        </output>
        <button type="button" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label={t('teacher.generator.more')} className="grid size-10 place-items-center rounded-r-xl text-ink-2 hover:bg-surface-2 disabled:opacity-40">
          <Plus className="size-4" />
        </button>
      </div>
      {note && <p className="mt-1.5 text-xs text-ink-2">{note}</p>}
    </div>
  )
}

export default function Generator() {
  const { level } = useTeacher()
  // Fresh form whenever the level changes
  return <GeneratorForm key={level} />
}

function GeneratorForm() {
  const { t, L, num } = useI18n()
  const { level, persona, saved, save } = useTeacher()
  const toast = useToast()
  const confirmPasscode = usePasscode()
  const [subject, setSubject] = useState(persona.subjects[0].id)
  const [cls, setCls] = useState(persona.classes[0].id)
  const [topics, setTopics] = useState(persona.topics.map((x) => x.id))
  const [mcqCount, setMcqCount] = useState(persona.defaults.mcq)
  const [creativeCount, setCreativeCount] = useState(persona.defaults.creative)
  const [difficulty, setDifficulty] = useState('board')
  const [phase, setPhase] = useState('form')
  const [round, setRound] = useState(0)
  const [setIndex, setSetIndex] = useState(0)
  const [showKey, setShowKey] = useState(true)
  const [target, setTarget] = useState(persona.sections[0].id)
  const [published, setPublished] = useState(null)

  const pool = useMemo(
    () => [...questionBank[level], ...extraQuestions[level]].filter((q) => q.subject === subject && topics.includes(q.chapter)),
    [level, subject, topics],
  )
  const mcqPool = pool.filter((q) => q.type === 'mcq')
  const creativePool = pool.filter((q) => q.type === 'creative')
  // Counts are capped by the bank: all four school chapters give a full SSC paper (25 MCQ + 8 creative)
  const mcqN = Math.min(mcqCount, mcqPool.length)
  const creativeN = Math.min(creativeCount, creativePool.length)

  const paper = buildSet(pick(mcqPool, mcqN, difficulty), pick(creativePool, creativeN, difficulty), setIndex, round)

  useEffect(() => {
    if (phase !== 'generating') return undefined
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const timer = setTimeout(() => setPhase('preview'), reduce ? 150 : 1400)
    return () => clearTimeout(timer)
  }, [phase])

  function toggleTopic(id) {
    setTopics((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]))
    setPhase('form')
  }

  async function generate() {
    const action = t('passcode.actions.generatePaper', { subject: L(subjectLabel), mcq: num(mcqN), creative: num(creativeN) })
    if (!(await confirmPasscode(action))) return
    setRound((r) => r + 1)
    setSetIndex(0)
    setPublished(null)
    setPhase('generating')
  }

  const subjectLabel = persona.subjects.find((s) => s.id === subject).label
  const clsLabel = persona.classes.find((c) => c.id === cls).label
  const section = persona.sections.find((s) => s.id === target)
  const chosenTopics = persona.topics.filter((x) => topics.includes(x.id))
  const fullMarks = mcqN + creativeN * CREATIVE_MARKS
  const optionLabels = t('teacher.generator.optionLabels')

  async function publish() {
    const opens = new Date('2026-10-19T10:00:00').toISOString()
    const title = {
      en: `${subjectLabel.en} · ${chosenTopics.map((x) => x.label.en).join(', ')}`,
      bn: `${subjectLabel.bn} · ${chosenTopics.map((x) => x.label.bn).join(', ')}`,
    }
    if (!(await confirmPasscode(t('passcode.actions.publishPaper', { title: L(title), section: L(section.label) })))) return
    const exam = { id: newId('ex-gen'), level, title, section: target, state: 'scheduled', opens }
    save('published', [exam, ...saved('published', [])])
    setPublished(target)
    toast(t('teacher.generator.publishedToast', { section: L(section.label), n: num(section.students) }))
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageIntro title={t('teacher.generator.title')} body={t('teacher.generator.body')} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        <Panel title={t('teacher.generator.settings')} className="self-start">
          <div className="grid gap-5 p-5">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <label htmlFor="gen-subject" className="grid gap-1.5 text-sm font-semibold">
                {level === 'university' ? t('teacher.generator.course') : t('teacher.generator.subject')}
                <select id="gen-subject" value={subject} onChange={(e) => setSubject(e.target.value)} className={`${inputStyles} font-normal`}>
                  {persona.subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {L(s.label)}
                    </option>
                  ))}
                </select>
              </label>
              <label htmlFor="gen-class" className="grid gap-1.5 text-sm font-semibold">
                {level === 'university' ? t('teacher.generator.term') : t('teacher.generator.class')}
                <select id="gen-class" value={cls} onChange={(e) => setCls(e.target.value)} className={`${inputStyles} font-normal`}>
                  {persona.classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {L(c.label)}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <fieldset>
              <legend className="text-sm font-semibold">{level === 'university' ? t('teacher.generator.topics') : t('teacher.generator.chapters')}</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {persona.topics.map((topic) => {
                  const on = topics.includes(topic.id)
                  return (
                    <button
                      key={topic.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggleTopic(topic.id)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
                        on ? 'bg-primary text-primary-ink' : 'border border-line bg-surface text-ink-2 hover:text-ink'
                      }`}
                    >
                      {on && <Check className="size-3.5" />}
                      {L(topic.label)}
                    </button>
                  )
                })}
              </div>
            </fieldset>

            <div className="grid grid-cols-2 gap-4">
              <Stepper id="gen-mcq" label={t('teacher.generator.mcq')} value={mcqN} min={1} max={mcqPool.length} onChange={setMcqCount} note={t('teacher.generator.inBank', { n: num(mcqPool.length) })} />
              <Stepper id="gen-cq" label={t('teacher.generator.creative')} value={creativeN} min={0} max={creativePool.length} onChange={setCreativeCount} note={t('teacher.generator.inBank', { n: num(creativePool.length) })} />
            </div>

            <fieldset>
              <legend className="text-sm font-semibold">{t('teacher.generator.difficulty')}</legend>
              <div role="radiogroup" aria-label={t('teacher.generator.difficulty')} className="mt-2 grid grid-cols-3 gap-1 rounded-xl border border-line bg-surface p-1">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d}
                    type="button"
                    role="radio"
                    aria-checked={difficulty === d}
                    onClick={() => setDifficulty(d)}
                    className={`rounded-lg px-2 py-2 text-xs font-semibold transition-colors ${difficulty === d ? 'bg-brand text-brand-ink' : 'text-ink-2 hover:text-ink'}`}
                  >
                    {t(`teacher.generator.levels.${d}`)}
                  </button>
                ))}
              </div>
            </fieldset>

            <p className="flex gap-2 rounded-xl bg-accent-soft p-3 text-sm">
              <Info className="mt-0.5 size-4 shrink-0 text-warn" />
              <span>{level === 'university' ? t('teacher.generator.weightedUni') : t('teacher.generator.weighted')}</span>
            </p>

            <button type="button" onClick={generate} disabled={!topics.length || phase === 'generating'} className={`${buttonStyles.accent} disabled:opacity-45`}>
              <WandSparkles className="size-4" />
              {phase === 'preview' ? t('teacher.generator.regenerate') : t('teacher.generator.generate')}
            </button>
            {!topics.length && <p className="-mt-3 text-xs text-bad">{t('teacher.generator.pickTopic')}</p>}
          </div>
        </Panel>

        <section aria-live="polite" className="min-w-0">
          {phase === 'form' && (
            <div className="grid min-h-72 place-items-center rounded-2xl border border-dashed border-line p-8 text-center">
              <div className="max-w-sm">
                <WandSparkles className="mx-auto size-8 text-role" />
                <p className="mt-3 font-semibold">{t('teacher.generator.emptyTitle')}</p>
                <p className="mt-1 text-sm text-ink-2">{t('teacher.generator.emptyBody')}</p>
              </div>
            </div>
          )}

          {phase === 'generating' && (
            <div className="grid min-h-72 place-items-center rounded-2xl border border-line bg-surface p-8 text-center">
              <div>
                <Loader2 className="mx-auto size-8 animate-spin text-role" />
                <p className="mt-3 font-semibold">{t('teacher.generator.generating')}</p>
                <p className="mt-1 text-sm text-ink-2">{t('teacher.generator.generatingNote', { n: num(pool.length) })}</p>
              </div>
            </div>
          )}

          {phase === 'preview' && (
            <div className="grid gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div role="radiogroup" aria-label={t('teacher.generator.setLabel')} className="inline-flex gap-1 rounded-xl border border-line bg-surface p-1">
                  {SETS.map((s, i) => (
                    <button
                      key={s}
                      type="button"
                      role="radio"
                      aria-checked={setIndex === i}
                      onClick={() => setSetIndex(i)}
                      className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${setIndex === i ? 'bg-brand text-brand-ink' : 'text-ink-2 hover:text-ink'}`}
                    >
                      {t('teacher.generator.set', { s: t(`teacher.generator.setNames.${s}`) })}
                    </button>
                  ))}
                </div>
                <label htmlFor="gen-key" className="flex items-center gap-2 text-sm">
                  <input id="gen-key" type="checkbox" checked={showKey} onChange={(e) => setShowKey(e.target.checked)} className="size-4 accent-[var(--primary)]" />
                  {t('teacher.generator.showKey')}
                </label>
              </div>

              <article className="rounded-2xl border border-line bg-surface">
                <header className="border-b border-line px-5 py-4 text-center">
                  <p className="text-xs font-semibold tracking-[0.12em] text-ink-2 uppercase">{L(persona.detail)}</p>
                  <h3 className="mt-1 font-display text-xl font-semibold">
                    {L(subjectLabel)} · {L(clsLabel)}
                  </h3>
                  <p className="mt-1 text-sm text-ink-2">
                    {chosenTopics.map((x) => L(x.label)).join(' · ')} · {t(`teacher.generator.levels.${difficulty}`)}
                  </p>
                  <p className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-ink-2 tabular-nums">
                    <span className="font-semibold text-ink">{t('teacher.generator.set', { s: t(`teacher.generator.setNames.${SETS[setIndex]}`) })}</span>
                    <span>{t('teacher.generator.marksLine', { mcq: num(mcqN), cq: num(creativeN), total: num(fullMarks) })}</span>
                  </p>
                </header>

                <div className="p-5">
                  <Eyebrow>{t('teacher.generator.partMcq', { n: num(mcqN) })}</Eyebrow>
                  <ol className="mt-3 grid gap-4">
                    {paper.mcq.map((q, i) => (
                      <li key={q.id} className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-2">
                        <span className="font-semibold text-ink-2 tabular-nums">{num(i + 1)}.</span>
                        <div className="min-w-0">
                          <p className="font-medium">{L(q.q)}</p>
                          <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                            {q.options.map((opt, oi) => {
                              const correct = showKey && oi === q.answer
                              return (
                                <li key={oi} className={`flex items-center gap-2 rounded-lg px-2 py-1 text-sm ${correct ? 'bg-ok-soft font-semibold text-ok' : ''}`}>
                                  <span className={`grid size-5 shrink-0 place-items-center rounded-full border text-[11px] ${correct ? 'border-ok' : 'border-line'}`}>{optionLabels[oi]}</span>
                                  <span className="min-w-0">{L(opt)}</span>
                                </li>
                              )
                            })}
                          </ul>
                          <p className="mt-1.5 text-xs text-ink-2">{L(q.source)}</p>
                        </div>
                      </li>
                    ))}
                  </ol>

                  {creativeN > 0 && (
                    <>
                      <Eyebrow className="mt-6 border-t border-line pt-5">{t('teacher.generator.partCreative', { n: num(creativeN), marks: num(CREATIVE_MARKS) })}</Eyebrow>
                      <ol className="mt-3 grid gap-4">
                        {paper.creative.map((q, i) => (
                          <li key={q.id} className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-2">
                            <span className="font-semibold text-ink-2 tabular-nums">{num(i + 1)}.</span>
                            <div className="min-w-0">
                              <p className="font-medium">{L(q.q)}</p>
                              {q.parts && (
                                <ol className="mt-2 grid gap-2">
                                  {q.parts.map((part, pi) => (
                                    <li key={part.kind} className="grid grid-cols-[1.25rem_minmax(0,1fr)_auto] gap-x-2 text-sm">
                                      <span className="font-semibold">{t('teacher.generator.partLabels')[pi]}.</span>
                                      <span className="min-w-0">{L(part.q)}</span>
                                      <span className="text-ink-2 tabular-nums" title={t(`teacher.written.kinds.${part.kind}`)}>
                                        {num(PART_MARKS[part.kind])}
                                      </span>
                                      {showKey && (
                                        <p className="col-start-2 col-end-4 mt-1 rounded-lg bg-ok-soft px-2.5 py-1.5 text-xs text-ink">
                                          <span className="font-semibold text-ok">{t('teacher.generator.modelAnswer')}</span> {L(part.answer)}
                                        </p>
                                      )}
                                    </li>
                                  ))}
                                </ol>
                              )}
                              <p className="mt-1.5 text-xs text-ink-2">{L(q.source)}</p>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </>
                  )}
                </div>
              </article>

              <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4 sm:flex-row sm:items-end">
                <label htmlFor="gen-target" className="grid min-w-0 flex-1 gap-1.5 text-sm font-semibold">
                  {t('teacher.generator.target')}
                  <select id="gen-target" value={target} onChange={(e) => setTarget(e.target.value)} className={`${inputStyles} font-normal`}>
                    {persona.sections.map((s) => (
                      <option key={s.id} value={s.id}>
                        {L(s.label)} · {t('teacher.home.studentsN', { n: num(s.students) })}
                      </option>
                    ))}
                  </select>
                </label>
                <button type="button" onClick={generate} className={buttonStyles.ghost}>
                  <RotateCcw className="size-4" /> {t('teacher.generator.regenerate')}
                </button>
                <button type="button" onClick={publish} disabled={published === target} className={buttonStyles.primary}>
                  <Send className="size-4" />
                  {published === target ? t('teacher.generator.published') : t('teacher.generator.publish', { section: L(section.label) })}
                </button>
              </div>
              {published && (
                <p className="text-sm text-ink-2">
                  {t('teacher.generator.publishedNote')}{' '}
                  <Link to="/teacher" className="font-semibold text-primary hover:underline">
                    {t('teacher.generator.seeHome')}
                  </Link>
                </p>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

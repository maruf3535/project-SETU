import { Bookmark, Check, RotateCcw, Search, SlidersHorizontal, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { inputStyles, PageIntro } from '../../components/ui'
import { useI18n } from '../../i18n/I18nProvider'
import { useCurrentStudent, useDemo } from '../../store/DemoStore'
import { boards, catalogFor, difficultyOf, questionsFor } from './questionPool'

const TYPES = ['all', 'mcq', 'creative']
const DIFFICULTIES = ['all', 'easy', 'medium', 'hard']
const difficultyStyles = { easy: 'bg-ok-soft text-ok', medium: 'bg-warn-soft text-warn', hard: 'bg-bad-soft text-bad' }

function Chip({ on, onClick, children }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors ${
        on ? 'border-primary bg-[color-mix(in_oklab,var(--primary)_12%,transparent)] font-semibold text-primary' : 'border-line text-ink-2 hover:text-ink'
      }`}
    >
      {on && <Check className="size-3.5" strokeWidth={3} />}
      {children}
    </button>
  )
}

function Segmented({ label, options, value, onChange, render }) {
  return (
    <div role="group" aria-label={label} className="inline-flex flex-wrap rounded-xl border border-line bg-surface p-1">
      {options.map((key) => (
        <button
          key={key}
          type="button"
          aria-pressed={value === key}
          onClick={() => onChange(key)}
          className={`rounded-lg px-3 py-1 text-sm font-medium ${value === key ? 'bg-brand text-brand-ink' : 'text-ink-2 hover:text-ink'}`}
        >
          {render(key)}
        </button>
      ))}
    </div>
  )
}

function QuestionCard({ question, chapterLabel, topicLabel, saved, onToggleSave }) {
  const { t, L, num } = useI18n()
  const [open, setOpen] = useState(false)
  const difficulty = difficultyOf(question)
  const sourceLabel = question.board && boards[question.board] ? `${L(boards[question.board])}${question.board === 'ai' ? '' : ` ${num(question.year).replace(/,/g, '')}`}` : L(question.source)

  return (
    <li className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {question.ai || question.board === 'ai' ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[color-mix(in_oklab,var(--primary)_14%,transparent)] px-2.5 py-1 text-xs font-semibold text-primary">
              <Sparkles className="size-3.5" /> {t('student.learn.ai')}
            </span>
          ) : (
            <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-warn">{sourceLabel}</span>
          )}
          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${difficultyStyles[difficulty]}`}>{t(`student.learn.difficulty.${difficulty}`)}</span>
          <span className="text-xs text-ink-2">
            {chapterLabel}
            {topicLabel && ` · ${topicLabel}`}
          </span>
        </div>
        <button type="button" aria-pressed={saved} aria-label={t('student.learn.save')} onClick={onToggleSave} className="-m-1 rounded-lg p-1 text-ink-2 hover:text-ink">
          <Bookmark className={`size-5 ${saved ? 'fill-accent text-accent' : ''}`} />
        </button>
      </div>

      <p className="mt-3 leading-relaxed font-medium whitespace-pre-line">{L(question.q)}</p>

      {question.type === 'mcq' && (
        <ol className="mt-3 grid gap-2 sm:grid-cols-2">
          {question.options.map((option, index) => {
            const correct = open && index === question.answer
            return (
              <li key={index} className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 text-sm ${correct ? 'border-ok bg-ok-soft font-semibold text-ok' : 'border-line'}`}>
                <span className={`grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold ${correct ? 'bg-ok text-surface' : 'bg-surface-2 text-ink-2'}`}>
                  {correct ? <Check className="size-3.5" strokeWidth={3} /> : String.fromCharCode(65 + index)}
                </span>
                {L(option)}
              </li>
            )
          })}
        </ol>
      )}

      {open && <p className="mt-3 rounded-xl bg-surface-2 px-4 py-3 text-sm leading-relaxed whitespace-pre-line">{L(question.explain)}</p>}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-ink-2">
        <span>
          {t(`student.learn.types.${question.type}`)} · {t('student.learn.solved', { n: num(question.solved) })}
        </span>
        <button type="button" onClick={() => setOpen((value) => !value)} className="text-sm font-semibold text-primary hover:underline">
          {open ? t('student.learn.hide') : t('student.learn.show')}
        </button>
      </div>
    </li>
  )
}

const EMPTY = { chapters: [], topics: [], query: '', type: 'all', board: '', year: '', difficulty: 'all', savedOnly: false }

// Keyed by level in the page below, so switching level starts from fresh filters
function LearnLevel({ level }) {
  const { t, L, num } = useI18n()
  const { student, config } = useCurrentStudent()
  const { portalState, dispatch } = useDemo()
  const catalog = catalogFor(level)
  const subjectKeys = Object.keys(catalog)
  const [subject, setSubject] = useState(subjectKeys[0])
  const [f, setF] = useState(EMPTY)
  const [more, setMore] = useState(false)
  const set = (key) => (value) => setF((current) => ({ ...current, [key]: value }))

  const all = useMemo(() => questionsFor(level), [level])
  const chapters = catalog[subject]?.chapters ?? {}
  // Topics come from the chosen chapters, or from every chapter when none is chosen
  const topicChapters = f.chapters.length ? f.chapters : Object.keys(chapters)
  const topics = topicChapters.flatMap((ch) => Object.entries(chapters[ch]?.topics ?? {}).map(([key, label]) => ({ key, label, chapter: ch })))

  const savedKey = 'student.saved'
  const savedIds = portalState?.[savedKey]?.[student.id] ?? []
  function toggleSave(id) {
    const all = portalState?.[savedKey] ?? {}
    const mine = all[student.id] ?? []
    dispatch({ type: 'setPortalState', key: savedKey, value: { ...all, [student.id]: mine.includes(id) ? mine.filter((x) => x !== id) : [...mine, id] } })
  }

  const inSubject = all.filter((q) => q.subject === subject)
  const boardOptions = [...new Set(inSubject.map((q) => q.board).filter((b) => b && boards[b]))]
  const yearOptions = [...new Set(inSubject.map((q) => q.year).filter(Boolean))].sort((a, b) => b - a)

  const q = f.query.trim().toLowerCase()
  const shown = inSubject.filter((item) => {
    if (f.chapters.length && !f.chapters.includes(item.chapter)) return false
    if (f.topics.length && !f.topics.includes(item.topic)) return false
    if (f.type !== 'all' && item.type !== f.type) return false
    if (f.board && item.board !== f.board) return false
    if (f.year && String(item.year) !== f.year) return false
    if (f.difficulty !== 'all' && difficultyOf(item) !== f.difficulty) return false
    if (f.savedOnly && !savedIds.includes(item.id)) return false
    if (q && ![L(item.q), ...(item.options ?? []).map((o) => L(o))].some((text) => text.toLowerCase().includes(q))) return false
    return true
  })

  function chooseSubject(value) {
    setSubject(value)
    setF((current) => ({ ...current, chapters: [], topics: [], board: '', year: '' }))
  }

  function toggleChapter(key) {
    setF((current) => {
      const chosen = current.chapters.includes(key) ? current.chapters.filter((x) => x !== key) : [...current.chapters, key]
      // Drop topics that no longer belong to a chosen chapter
      const allowed = (chosen.length ? chosen : Object.keys(chapters)).flatMap((ch) => Object.keys(chapters[ch]?.topics ?? {}))
      return { ...current, chapters: chosen, topics: current.topics.filter((tp) => allowed.includes(tp)) }
    })
  }

  function toggleTopic(key) {
    setF((current) => ({ ...current, topics: current.topics.includes(key) ? current.topics.filter((x) => x !== key) : [...current.topics, key] }))
  }

  const activeMore = [f.type !== 'all', f.board, f.year, f.difficulty !== 'all', f.savedOnly].filter(Boolean).length
  const anyFilter = f.chapters.length || f.topics.length || f.query || activeMore

  return (
    <div className="mx-auto max-w-4xl">
      <PageIntro title={L(catalog[subject]?.label)} body={L(config.curriculum)} />

      <section className="mb-5 grid gap-4 rounded-2xl border border-line bg-surface p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]">
          <label htmlFor="learn-subject" className="grid gap-1.5 text-xs font-semibold text-ink-2">
            {t('student.learn.subject')}
            <select id="learn-subject" value={subject} onChange={(e) => chooseSubject(e.target.value)} className={`${inputStyles} text-sm font-normal text-ink`}>
              {subjectKeys.map((key) => (
                <option key={key} value={key}>
                  {L(catalog[key].label)}
                </option>
              ))}
            </select>
          </label>
          <label htmlFor="learn-search" className="grid gap-1.5 text-xs font-semibold text-ink-2">
            {t('student.learn.search')}
            <span className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-2" />
              <input id="learn-search" type="search" value={f.query} onChange={(e) => set('query')(e.target.value)} placeholder={t('student.learn.searchPlaceholder')} className={`${inputStyles} pl-10 text-sm font-normal text-ink`} />
            </span>
          </label>
        </div>

        <fieldset>
          <legend className="mb-2 text-xs font-semibold text-ink-2">
            {t('student.learn.chapters')} <span className="font-normal">· {t('student.learn.pickMany')}</span>
          </legend>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(chapters).map(([key, ch]) => (
              <Chip key={key} on={f.chapters.includes(key)} onClick={() => toggleChapter(key)}>
                {L(ch.label)}
              </Chip>
            ))}
          </div>
        </fieldset>

        {topics.length > 0 && (
          <fieldset>
            <legend className="mb-2 text-xs font-semibold text-ink-2">
              {t('student.learn.topics')} <span className="font-normal">· {t('student.learn.pickMany')}</span>
            </legend>
            <div className="flex flex-wrap gap-1.5">
              {topics.map((topic) => (
                <Chip key={`${topic.chapter}-${topic.key}`} on={f.topics.includes(topic.key)} onClick={() => toggleTopic(topic.key)}>
                  {L(topic.label)}
                </Chip>
              ))}
            </div>
          </fieldset>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
          <button type="button" onClick={() => setMore((v) => !v)} aria-expanded={more} aria-controls="learn-more" className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
            <SlidersHorizontal className="size-4" /> {t('student.learn.moreFilters')}
            {activeMore > 0 && <span className="rounded-full bg-accent px-1.5 text-xs text-accent-ink tabular-nums">{num(activeMore)}</span>}
          </button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-ink-2 tabular-nums">{t('student.learn.count', { n: num(shown.length) })}</span>
            {anyFilter ? (
              <button type="button" onClick={() => setF(EMPTY)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                <RotateCcw className="size-4" /> {t('student.learn.clear')}
              </button>
            ) : null}
          </div>
        </div>

        {more && (
          <div id="learn-more" className="grid gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <Segmented label={t('student.learn.type')} options={TYPES} value={f.type} onChange={set('type')} render={(k) => t(`student.learn.types.${k}`)} />
              <Segmented label={t('student.learn.difficultyLabel')} options={DIFFICULTIES} value={f.difficulty} onChange={set('difficulty')} render={(k) => t(`student.learn.difficulty.${k}`)} />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <label htmlFor="learn-board" className="grid gap-1.5 text-xs font-semibold text-ink-2">
                {t('student.learn.board')}
                <select id="learn-board" value={f.board} onChange={(e) => set('board')(e.target.value)} className={`${inputStyles} text-sm font-normal text-ink`}>
                  <option value="">{t('student.learn.any')}</option>
                  {boardOptions.map((b) => (
                    <option key={b} value={b}>
                      {L(boards[b])}
                    </option>
                  ))}
                </select>
              </label>
              <label htmlFor="learn-year" className="grid gap-1.5 text-xs font-semibold text-ink-2">
                {t('student.learn.year')}
                <select id="learn-year" value={f.year} onChange={(e) => set('year')(e.target.value)} className={`${inputStyles} text-sm font-normal text-ink`}>
                  <option value="">{t('student.learn.any')}</option>
                  {yearOptions.map((y) => (
                    <option key={y} value={String(y)}>
                      {num(y).replace(/,/g, '')}
                    </option>
                  ))}
                </select>
              </label>
              <label htmlFor="learn-saved" className="flex items-center gap-2.5 self-end rounded-xl border border-line px-4 py-2.5 text-sm">
                <input id="learn-saved" type="checkbox" checked={f.savedOnly} onChange={(e) => set('savedOnly')(e.target.checked)} className="size-4 accent-[var(--primary)]" />
                <Bookmark className="size-4 text-accent" /> {t('student.learn.savedOnly', { n: num(savedIds.length) })}
              </label>
            </div>
          </div>
        )}
      </section>

      {shown.length ? (
        <ul className="grid gap-3">
          {shown.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              chapterLabel={L(chapters[question.chapter]?.label)}
              topicLabel={question.topic ? L(chapters[question.chapter]?.topics?.[question.topic]) : ''}
              saved={savedIds.includes(question.id)}
              onToggleSave={() => toggleSave(question.id)}
            />
          ))}
        </ul>
      ) : (
        <p className="py-10 text-center text-ink-2">{t('student.learn.empty')}</p>
      )}
    </div>
  )
}

export default function Learn() {
  const { level } = useCurrentStudent()
  return <LearnLevel key={level} level={level} />
}

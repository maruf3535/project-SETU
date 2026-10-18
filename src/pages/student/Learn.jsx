import { Bookmark, Check, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { inputStyles, PageIntro } from '../../components/ui'
import { questionBank } from '../../data/demo/questions'
import { useI18n } from '../../i18n/I18nProvider'
import { useCurrentStudent } from '../../store/DemoStore'

const TYPES = ['all', 'mcq', 'creative']

function QuestionCard({ question, config }) {
  const { t, L, num } = useI18n()
  const [open, setOpen] = useState(false)
  const [saved, setSaved] = useState(false)

  return (
    <li className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {question.ai ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[color-mix(in_oklab,var(--primary)_14%,transparent)] px-2.5 py-1 text-xs font-semibold text-primary">
              <Sparkles className="size-3.5" /> {t('student.learn.ai')}
            </span>
          ) : (
            <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-warn">{L(question.source)}</span>
          )}
          <span className="text-xs text-ink-2">{L(config.chapters[question.chapter])}</span>
        </div>
        <button
          type="button"
          aria-pressed={saved}
          aria-label={t('student.learn.save')}
          onClick={() => setSaved((value) => !value)}
          className="-m-1 rounded-lg p-1 text-ink-2 hover:text-ink"
        >
          <Bookmark className={`size-5 ${saved ? 'fill-accent text-accent' : ''}`} />
        </button>
      </div>

      <p className="mt-3 leading-relaxed font-medium">{L(question.q)}</p>

      {question.type === 'mcq' && (
        <ol className="mt-3 grid gap-2 sm:grid-cols-2">
          {question.options.map((option, index) => {
            const correct = open && index === question.answer
            return (
              <li
                key={index}
                className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 text-sm ${
                  correct ? 'border-ok bg-ok-soft font-semibold text-ok' : 'border-line'
                }`}
              >
                <span className={`grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold ${correct ? 'bg-ok text-surface' : 'bg-surface-2 text-ink-2'}`}>
                  {correct ? <Check className="size-3.5" strokeWidth={3} /> : String.fromCharCode(65 + index)}
                </span>
                {L(option)}
              </li>
            )
          })}
        </ol>
      )}

      {open && <p className="mt-3 rounded-xl bg-surface-2 px-4 py-3 text-sm leading-relaxed">{L(question.explain)}</p>}

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

export default function Learn() {
  const { t, L, num } = useI18n()
  const { level, config } = useCurrentStudent()
  const [chapter, setChapter] = useState('')
  const [type, setType] = useState('all')

  const questions = questionBank[level].filter((q) => (!chapter || q.chapter === chapter) && (type === 'all' || q.type === type))
  const subject = Object.values(config.subjects)[0]

  return (
    <div className="mx-auto max-w-4xl">
      <PageIntro title={L(subject)} body={L(config.curriculum)} />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <label htmlFor="learn-chapter" className="min-w-0 flex-1 sm:max-w-xs">
          <span className="sr-only">{t('student.learn.chapter')}</span>
          <select
            key={level}
            id="learn-chapter"
            value={chapter}
            onChange={(event) => setChapter(event.target.value)}
            className={inputStyles}
          >
            <option value="">{t('student.learn.allChapters')}</option>
            {Object.entries(config.chapters).map(([key, name]) => (
              <option key={key} value={key}>
                {L(name)}
              </option>
            ))}
          </select>
        </label>
        <div className="flex gap-1.5">
          {TYPES.map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={type === key}
              onClick={() => setType(key)}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium ${
                type === key ? 'border-brand bg-brand text-brand-ink' : 'border-line bg-surface text-ink-2 hover:text-ink'
              }`}
            >
              {t(`student.learn.types.${key}`)}
            </button>
          ))}
        </div>
        <span className="text-sm text-ink-2 tabular-nums">{t('student.learn.count', { n: num(questions.length) })}</span>
      </div>

      {questions.length ? (
        <ul key={level} className="grid gap-3">
          {questions.map((question) => (
            <QuestionCard key={question.id} question={question} config={config} />
          ))}
        </ul>
      ) : (
        <p className="py-10 text-center text-ink-2">{t('student.learn.empty')}</p>
      )}
    </div>
  )
}

import { BookMarked, LoaderCircle, Send, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import Avatar from '../../components/Avatar'
import { inputStyles } from '../../components/ui'
import { useI18n } from '../../i18n/I18nProvider'
import { useCurrentStudent } from '../../store/DemoStore'

// Reveals a scripted answer a few words at a time, the way a streamed reply would arrive
function Typing({ text, onDone }) {
  const words = text.split(/(\s+)/)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (count >= words.length) {
      onDone()
      return undefined
    }
    const timer = setTimeout(() => setCount((c) => Math.min(words.length, c + 3)), 40)
    return () => clearTimeout(timer)
  }, [count, words.length, onDone])

  return <>{words.slice(0, count).join('')}</>
}

export default function Tutor() {
  const { t, L } = useI18n()
  const { level, config, student } = useCurrentStudent()
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const endRef = useRef(null)

  // A new level means a different student and syllabus, so start a fresh conversation
  useEffect(() => setMessages([]), [level])

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [messages])

  function ask(question, scripted) {
    if (busy) return
    setBusy(true)
    setMessages((m) => [...m, { from: 'me', text: question }, { from: 'ai', pending: true, scripted }])
    setTimeout(() => {
      setMessages((m) => m.map((msg, i) => (i === m.length - 1 ? { ...msg, pending: false, typing: true } : msg)))
    }, 900)
  }

  function submit(event) {
    event.preventDefault()
    const text = draft.trim()
    if (!text) return
    setDraft('')
    const match = config.tutor.find((item) => [item.q.en, item.q.bn].some((q) => q.toLowerCase() === text.toLowerCase()))
    ask(text, match ?? null)
  }

  function finishTyping() {
    setBusy(false)
    setMessages((m) => m.map((msg) => (msg.typing ? { ...msg, typing: false } : msg)))
  }

  const asked = new Set(messages.filter((m) => m.scripted).map((m) => m.scripted.q.en))

  return (
    <div className="mx-auto flex max-w-3xl flex-col">
      <div className="flex items-start gap-3 rounded-2xl bg-brand p-5 text-brand-ink">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-ink">
          <Sparkles className="size-5" />
        </span>
        <div>
          <p className="font-semibold">{t('student.tutor.grounded', { curriculum: L(config.curriculum) })}</p>
          <p className="mt-0.5 text-sm text-brand-ink/70">{t('student.tutor.body')}</p>
        </div>
      </div>

      <ol className="mt-6 grid gap-5" aria-live="polite">
        {messages.map((msg, i) =>
          msg.from === 'me' ? (
            <li key={i} className="flex justify-end gap-3">
              <p className="max-w-[85%] rounded-2xl rounded-tr-md bg-primary px-4 py-3 text-primary-ink">{msg.text}</p>
              <Avatar initials={student.initials} className="size-8 text-xs" />
            </li>
          ) : (
            <li key={i} className="flex gap-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent text-accent-ink">
                <Sparkles className="size-4" />
              </span>
              <div className="max-w-[85%] min-w-0 rounded-2xl rounded-tl-md border border-line bg-surface px-4 py-3">
                {msg.pending ? (
                  <p className="flex items-center gap-2 text-sm text-ink-2">
                    <LoaderCircle className="size-4 animate-spin" /> {t('student.tutor.thinking')}
                  </p>
                ) : (
                  <>
                    <p className="leading-relaxed whitespace-pre-line">
                      {msg.typing ? <Typing text={msg.scripted ? L(msg.scripted.a) : t('student.tutor.fallback')} onDone={finishTyping} /> : msg.scripted ? L(msg.scripted.a) : t('student.tutor.fallback')}
                    </p>
                    {msg.scripted && !msg.typing && (
                      <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-surface-2 px-2.5 py-1.5 text-xs text-ink-2">
                        <BookMarked className="size-3.5 text-primary" /> {t('student.tutor.source')}: {L(msg.scripted.cite)}
                      </p>
                    )}
                  </>
                )}
              </div>
            </li>
          ),
        )}
      </ol>
      <div ref={endRef} />

      <div className="mt-6">
        <p className="text-xs font-semibold tracking-[0.12em] text-ink-2 uppercase">{t('student.tutor.suggested')}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {config.tutor
            .filter((item) => !asked.has(item.q.en))
            .map((item) => (
              <button
                key={item.q.en}
                type="button"
                disabled={busy}
                onClick={() => ask(L(item.q), item)}
                className="rounded-full border border-line bg-surface px-3.5 py-2 text-left text-sm hover:border-primary disabled:opacity-50"
              >
                {L(item.q)}
              </button>
            ))}
        </div>
      </div>

      <form onSubmit={submit} className="sticky bottom-24 mt-5 flex gap-2 rounded-2xl border border-line bg-surface p-2 lg:bottom-6">
        <label htmlFor="tutor-input" className="sr-only">
          {t('student.tutor.placeholder')}
        </label>
        <input
          id="tutor-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={t('student.tutor.placeholder')}
          className={`${inputStyles} border-0 focus:border-0`}
        />
        <button type="submit" disabled={busy || !draft.trim()} aria-label={t('student.tutor.send')} className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-ink disabled:opacity-45">
          <Send className="size-4" />
        </button>
      </form>
    </div>
  )
}

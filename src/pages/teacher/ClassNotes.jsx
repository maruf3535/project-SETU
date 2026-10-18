import { BookOpen, CircleCheck, Clock3, FileUp, Gift, Star, Undo2, Upload } from 'lucide-react'
import { useState } from 'react'
import { useToast } from '../../components/Toast'
import { buttonStyles, inputStyles, PageIntro, Panel } from '../../components/ui'
import { teacherCopies, teacherNotes } from '../../data/demo/teacher'
import { useI18n } from '../../i18n/I18nProvider'
import { useDemo } from '../../store/DemoStore'
import { Eyebrow } from './shared'
import { newId, nowIso, useTeacher } from './useTeacher'

const statusStyles = {
  reviewed: { className: 'bg-ok-soft text-ok', icon: CircleCheck },
  in_review: { className: 'bg-warn-soft text-warn', icon: Clock3 },
  rejected: { className: 'bg-bad-soft text-bad', icon: Undo2 },
}
const COVER_STYLES = { teal: 'bg-brand text-brand-ink', amber: 'bg-accent text-accent-ink', mist: 'bg-surface-2 text-ink' }

export default function ClassNotes() {
  const { level } = useTeacher()
  return <ClassNotesPage key={level} />
}

function ClassNotesPage() {
  const { t, L, num, date } = useI18n()
  const { level, persona } = useTeacher()
  const { notes, books, dispatch } = useDemo()
  const toast = useToast()
  const defaultSubject = L(persona.subjects[0].label) + (level === 'school' ? ` · ${L(persona.classes[0].label)}` : '')
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState(defaultSubject)
  const [pages, setPages] = useState('4')
  const [file, setFile] = useState('')

  // Uploaded notes live in the shared store; seeded ones come from the teacher data unless the store already has them
  const fromStore = notes.filter((n) => n.authorId === persona.id)
  const mine = [...fromStore, ...teacherNotes.filter((n) => n.authorId === persona.id && !fromStore.some((s) => s.id === n.id))]
  const copies = books.filter((b) => teacherCopies[level].includes(b.id))

  function upload(event) {
    event.preventDefault()
    if (!title.trim() || !subject.trim()) return
    dispatch({
      type: 'uploadNote',
      note: {
        id: newId(`nt-${persona.id}`),
        level,
        authorId: persona.id,
        authorRole: 'teacher',
        author: persona.name,
        initials: persona.initials,
        title: title.trim(),
        subject: subject.trim(),
        pages: Math.max(1, Number(pages) || 1),
        rating: 0,
        ratings: 0,
        status: 'in_review',
        createdAt: nowIso().slice(0, 10),
      },
    })
    toast(t('teacher.notes.sentToast', { title: title.trim() }))
    setTitle('')
    setFile('')
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageIntro title={t('teacher.notes.title')} body={t('teacher.notes.body')} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
        <div className="grid content-start gap-6">
          <Panel title={t('teacher.notes.mine', { n: num(mine.length) })}>
            {mine.length ? (
              <ul className="divide-y divide-line">
                {mine.map((note) => {
                  const status = statusStyles[note.status] ?? statusStyles.in_review
                  const Icon = status.icon
                  return (
                    <li key={note.id} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold">{L(note.title)}</p>
                        <p className="text-sm text-ink-2">
                          {L(note.subject)} · {t('teacher.notes.pages', { n: num(note.pages) })} · {date(note.createdAt)}
                        </p>
                        {note.status === 'reviewed' && note.ratings > 0 && (
                          <p className="mt-1 inline-flex items-center gap-1 text-xs text-ink-2 tabular-nums">
                            <Star className="size-3.5 fill-accent text-accent" /> {num(note.rating)} · {t('teacher.notes.ratings', { n: num(note.ratings) })}
                          </p>
                        )}
                        {note.status === 'rejected' && note.reviewNote && <p className="mt-2 rounded-xl bg-bad-soft px-3 py-2 text-sm">{L(note.reviewNote)}</p>}
                      </div>
                      <span className={`inline-flex shrink-0 items-center gap-1.5 self-start rounded-full px-2.5 py-1 text-xs font-semibold sm:self-center ${status.className}`}>
                        <Icon className="size-3.5" /> {t(`teacher.notes.status.${note.status}`)}
                      </span>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="px-5 py-6 text-ink-2">{t('teacher.notes.empty')}</p>
            )}
          </Panel>

          <section>
            <h2 className="flex items-center gap-2 font-semibold">
              <Gift className="size-4 text-role" /> {t('teacher.notes.copies')}
            </h2>
            <p className="mt-1 text-sm text-ink-2">{t('teacher.notes.copiesBody')}</p>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {copies.map((book) => (
                <li key={book.id} className="flex gap-4 rounded-2xl border border-line bg-surface p-4">
                  <div className={`flex aspect-[3/4] w-20 shrink-0 flex-col justify-between rounded-lg p-2 shadow-sm ${COVER_STYLES[book.cover] ?? COVER_STYLES.teal}`}>
                    <BookOpen className="size-4 opacity-70" />
                    <span className="font-display text-[11px] leading-tight font-semibold">{L(book.title)}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="inline-flex items-center gap-1 rounded-full bg-ok-soft px-2 py-0.5 text-[11px] font-semibold text-ok">
                      <Gift className="size-3" /> {t('teacher.notes.freeCopy')}
                    </span>
                    <p className="mt-1.5 font-semibold">{L(book.title)}</p>
                    <p className="text-sm text-ink-2">
                      {book.publisher} · {L(book.cls)}
                    </p>
                    <p className="mt-1 text-xs text-ink-2 tabular-nums">
                      {t('teacher.notes.pages', { n: num(book.pages) })} · {t('teacher.notes.syllabus', { year: num(book.syllabus) })}
                    </p>
                    <button
                      type="button"
                      onClick={() => toast(t('teacher.notes.recommendedToast', { title: L(book.title), section: L(persona.sections[0].label) }))}
                      className="mt-3 text-sm font-semibold text-primary hover:underline"
                    >
                      {t('teacher.notes.recommend', { section: L(persona.sections[0].label) })}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <Panel title={t('teacher.notes.upload')} className="self-start">
          <form onSubmit={upload} className="grid gap-4 p-5">
            <label htmlFor="note-title" className="grid gap-1.5 text-sm font-semibold">
              {t('teacher.notes.noteTitle')}
              <input id="note-title" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('teacher.notes.titlePlaceholder')} className={`${inputStyles} font-normal`} />
            </label>
            <label htmlFor="note-subject" className="grid gap-1.5 text-sm font-semibold">
              {t('teacher.notes.subject')}
              <input id="note-subject" required value={subject} onChange={(e) => setSubject(e.target.value)} className={`${inputStyles} font-normal`} />
            </label>
            <label htmlFor="note-pages" className="grid gap-1.5 text-sm font-semibold">
              {t('teacher.notes.pagesLabel')}
              <input id="note-pages" type="number" min="1" max="200" inputMode="numeric" value={pages} onChange={(e) => setPages(e.target.value)} className={`${inputStyles} font-normal`} />
            </label>
            <div>
              <Eyebrow>{t('teacher.notes.file')}</Eyebrow>
              <label htmlFor="note-file" className="mt-1.5 flex items-center gap-3 rounded-xl border border-dashed border-line px-4 py-3 text-sm hover:border-primary">
                <FileUp className="size-5 shrink-0 text-ink-2" />
                <span className="min-w-0 truncate">{file || t('teacher.notes.choose')}</span>
                <input id="note-file" type="file" accept=".pdf,image/*" onChange={(e) => setFile(e.target.files?.[0]?.name ?? '')} className="sr-only" />
              </label>
            </div>
            <button type="submit" className={buttonStyles.accent}>
              <Upload className="size-4" /> {t('teacher.notes.submit')}
            </button>
            <p className="text-xs text-ink-2">{t('teacher.notes.reviewNote')}</p>
          </form>
        </Panel>
      </div>
    </div>
  )
}

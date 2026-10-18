import { CircleCheck, Clock3, FileUp, Gift, Plus, Star, Undo2 } from 'lucide-react'
import { useState } from 'react'
import Avatar from '../../components/Avatar'
import { useToast } from '../../components/Toast'
import { buttonStyles, Dialog, inputStyles, PageIntro } from '../../components/ui'
import { FREE_BOOK_POINTS } from '../../data/demo/notes'
import { useI18n } from '../../i18n/I18nProvider'
import { useCurrentStudent, useDemo } from '../../store/DemoStore'

const TABS = ['top', 'newest', 'mine']
const statusStyles = {
  reviewed: { className: 'bg-ok-soft text-ok', icon: CircleCheck },
  in_review: { className: 'bg-warn-soft text-warn', icon: Clock3 },
  rejected: { className: 'bg-bad-soft text-bad', icon: Undo2 },
}

function Stars({ value, size = 'size-4' }) {
  return (
    <span className="inline-flex" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`${size} ${n <= Math.round(value) ? 'fill-accent text-accent' : 'text-line'}`} />
      ))}
    </span>
  )
}

function RateDialog({ note, onClose }) {
  const { t, L } = useI18n()
  const { dispatch } = useDemo()
  const { student } = useCurrentStudent()
  const toast = useToast()
  const [stars, setStars] = useState(4)
  const [tags, setTags] = useState([0, 1])
  const tagLabels = t('student.notes.tags')

  function submit() {
    dispatch({ type: 'rateNote', noteId: note.id, stars, studentId: student.id })
    toast(t('student.notes.ratedToast'))
    onClose()
  }

  return (
    <Dialog open title={t('student.notes.rateTitle')} onClose={onClose}>
      <p className="font-semibold">{L(note.title)}</p>
      <p className="text-sm text-ink-2">
        {note.author} · {t('student.notes.pages', { n: note.pages })}
      </p>
      <p className="mt-5 text-center text-sm text-ink-2">{t('student.notes.rateQuestion')}</p>
      <div className="mt-2 flex justify-center gap-1" role="radiogroup" aria-label={t('student.notes.rateQuestion')}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" role="radio" aria-checked={stars === n} aria-label={`${n}`} onClick={() => setStars(n)} className="rounded-lg p-1">
            <Star className={`size-9 ${n <= stars ? 'fill-accent text-accent' : 'text-line'}`} />
          </button>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {tagLabels.map((label, i) => {
          const on = tags.includes(i)
          return (
            <button
              key={label}
              type="button"
              aria-pressed={on}
              onClick={() => setTags((current) => (on ? current.filter((x) => x !== i) : [...current, i]))}
              className={`rounded-full border px-3 py-1 text-sm ${on ? 'border-primary bg-primary text-primary-ink' : 'border-line text-ink-2'}`}
            >
              {label}
            </button>
          )
        })}
      </div>
      <button type="button" onClick={submit} className={`${buttonStyles.primary} mt-6 w-full py-3`}>
        {t('student.notes.submitRating')}
      </button>
    </Dialog>
  )
}

function UploadDialog({ onClose }) {
  const { t } = useI18n()
  const { dispatch } = useDemo()
  const { student, level, config } = useCurrentStudent()
  const toast = useToast()
  const [file, setFile] = useState('')

  function submit(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    dispatch({
      type: 'uploadNote',
      note: {
        id: `nt-${Date.now()}`,
        level,
        authorId: student.id,
        author: student.name,
        initials: student.initials,
        title: form.get('title').trim(),
        subject: form.get('subject').trim(),
        pages: 3,
        rating: 0,
        ratings: 0,
        status: 'in_review',
        createdAt: new Date().toISOString().slice(0, 10),
      },
    })
    toast(t('student.notes.sentToast'))
    onClose()
  }

  const subject = Object.values(config.subjects)[0]

  return (
    <Dialog open title={t('student.notes.share')} onClose={onClose}>
      <p className="text-sm text-ink-2">{t('student.notes.uploadBody')}</p>
      <form onSubmit={submit} className="mt-5 grid gap-4">
        <label htmlFor="note-title" className="text-sm font-medium">
          {t('student.notes.fieldTitle')}
          <input id="note-title" name="title" required defaultValue={level === 'university' ? 'Dynamic programming, solved past questions' : 'Important board questions, solved'} className={`${inputStyles} mt-1.5`} />
        </label>
        <label htmlFor="note-subject" className="text-sm font-medium">
          {t('student.notes.fieldSubject')}
          <input id="note-subject" name="subject" required defaultValue={subject.en} className={`${inputStyles} mt-1.5`} />
        </label>
        <div>
          <p className="text-sm font-medium">{t('student.notes.fieldFile')}</p>
          <label htmlFor="note-file" className="mt-1.5 flex items-center gap-3 rounded-xl border-2 border-dashed border-line px-4 py-3 text-sm text-ink-2 hover:border-primary">
            <FileUp className="size-5 text-primary" />
            <span className="truncate">{file || t('student.notes.choose')}</span>
            <input id="note-file" type="file" accept="application/pdf,image/*" className="sr-only" onChange={(e) => setFile(e.target.files?.[0]?.name ?? '')} />
          </label>
        </div>
        <button type="submit" className={`${buttonStyles.primary} py-3`}>
          {t('student.notes.send')}
        </button>
      </form>
    </Dialog>
  )
}

export default function Notes() {
  const { t, L, num, date } = useI18n()
  const { notes, ratedNotes } = useDemo()
  const { level, student, points } = useCurrentStudent()
  const [tab, setTab] = useState('top')
  const [rating, setRating] = useState(null)
  const [uploading, setUploading] = useState(false)

  const forLevel = notes.filter((n) => n.level === level)
  const shown =
    tab === 'mine'
      ? forLevel.filter((n) => n.authorId === student.id)
      : [...forLevel.filter((n) => n.status === 'reviewed' || n.authorId === student.id)].sort((a, b) =>
          tab === 'top' ? b.rating - a.rating : b.createdAt.localeCompare(a.createdAt),
        )

  return (
    <div className="mx-auto max-w-6xl">
      <PageIntro title={t('nav.notes')}>
        <button type="button" onClick={() => setUploading(true)} className={buttonStyles.accent}>
          <Plus className="size-4" /> {t('student.notes.share')}
        </button>
      </PageIntro>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div>
          <div className="mb-4 inline-flex rounded-xl border border-line bg-surface p-1">
            {TABS.map((key) => (
              <button
                key={key}
                type="button"
                aria-pressed={tab === key}
                onClick={() => setTab(key)}
                className={`rounded-lg px-4 py-1.5 text-sm font-semibold ${tab === key ? 'bg-brand text-brand-ink' : 'text-ink-2 hover:text-ink'}`}
              >
                {t(`student.notes.tabs.${key}`)}
              </button>
            ))}
          </div>

          {shown.length ? (
            <ul className="grid gap-3">
              {shown.map((note) => {
                const own = note.authorId === student.id
                const rated = ratedNotes.includes(`${student.id}:${note.id}`)
                const status = statusStyles[note.status]
                return (
                  <li key={note.id} className="rounded-2xl border border-line bg-surface p-5">
                    <div className="flex items-start gap-3">
                      <Avatar initials={note.initials} className="size-10 text-sm" />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold">{L(note.title)}</p>
                        <p className="text-sm text-ink-2">
                          {note.author} · {L(note.subject)} · {t('student.notes.pages', { n: num(note.pages) })}
                        </p>
                      </div>
                      <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}>
                        <status.icon className="size-3.5" /> {t(`student.notes.status.${note.status}`)}
                      </span>
                    </div>
                    {/* Drawn page thumbnails stand in for the uploaded pages */}
                    <div className="mt-4 grid grid-cols-3 gap-2" aria-hidden="true">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="aspect-[4/3] rounded-lg bg-surface-2 p-2.5">
                          <div className="h-1.5 w-3/4 rounded-full bg-ink/15" />
                          <div className="mt-1.5 h-1.5 w-1/2 rounded-full bg-ink/10" />
                          <div className="mt-1.5 h-1.5 w-2/3 rounded-full bg-ink/10" />
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
                      <span className="flex items-center gap-2 text-ink-2">
                        {note.ratings ? (
                          <>
                            <Stars value={note.rating} />
                            <span className="font-semibold text-ink tabular-nums">{num(note.rating)}</span>
                            <span className="tabular-nums">({num(note.ratings)})</span>
                          </>
                        ) : (
                          t('student.notes.noRatings')
                        )}
                        <span>· {date(note.createdAt, { day: 'numeric', month: 'short' })}</span>
                      </span>
                      {own ? (
                        <span className="text-xs font-semibold text-primary">{t('student.notes.own')}</span>
                      ) : note.status === 'reviewed' && (
                        <button type="button" disabled={rated} onClick={() => setRating(note)} className={`${buttonStyles.ghost} py-1.5`}>
                          <Star className="size-4" /> {rated ? t('student.notes.rated') : t('student.notes.rate')}
                        </button>
                      )}
                    </div>
                    {note.reviewNote && note.status === 'rejected' && own && <p className="mt-3 rounded-xl bg-bad-soft px-3 py-2 text-sm">{L(note.reviewNote)}</p>}
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="py-10 text-center text-ink-2">{t('student.notes.emptyMine')}</p>
          )}
        </div>

        <aside className="grid content-start gap-4">
          <section className="rounded-2xl bg-accent p-5 text-accent-ink">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold tracking-[0.12em] uppercase opacity-70">{t('student.notes.yourPoints')}</p>
              <Gift className="size-5" />
            </div>
            <p className="mt-1 font-display text-4xl font-semibold tabular-nums">{num(points)}</p>
            <div className="mt-3 h-2 rounded-full bg-accent-ink/15">
              <div className="h-full rounded-full bg-accent-ink" style={{ width: `${Math.min(100, (points / FREE_BOOK_POINTS) * 100)}%` }} />
            </div>
            <p className="mt-2 text-sm">{t('student.home.pointsNote', { n: num(Math.max(0, FREE_BOOK_POINTS - points)) })}</p>
          </section>
          <section className="rounded-2xl border border-line bg-surface p-5">
            <h3 className="text-xs font-semibold tracking-[0.12em] text-ink-2 uppercase">{t('student.notes.tiersTitle')}</h3>
            <ul className="mt-3 grid gap-3">
              {['master', 'senior', 'active'].map((tier) => (
                <li key={tier} className="flex items-center gap-3">
                  <Star className={`size-5 shrink-0 ${tier === 'master' ? 'fill-accent text-accent' : 'text-accent'}`} />
                  <span>
                    <span className="block text-sm font-semibold">{t(`student.notes.tiers.${tier}`)}</span>
                    <span className="block text-xs text-ink-2">{t(`student.notes.tierBody.${tier}`)}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>

      {rating && <RateDialog note={rating} onClose={() => setRating(null)} />}
      {uploading && <UploadDialog onClose={() => setUploading(false)} />}
    </div>
  )
}

import { BadgeCheck, FileText, Minus, Plus, Send, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePasscode } from '../../components/Passcode'
import { useToast } from '../../components/Toast'
import { buttonStyles, inputStyles, PageIntro, Panel } from '../../components/ui'
import { classOptions, MY_PUBLISHER, subjects } from '../../data/demo/publisher'
import { useI18n } from '../../i18n/I18nProvider'
import { useDemo } from '../../store/DemoStore'
import { BookCover } from './shared'

const MIN_SAMPLES = 10
const MAX_SAMPLES = 15
const COVERS = ['teal', 'amber', 'mist']
const coverSwatch = { teal: 'bg-primary', amber: 'bg-accent', mist: 'bg-surface-2' }

function Field({ id, label, hint, children }) {
  return (
    <div className="grid content-start gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-ink-2">{hint}</p>}
    </div>
  )
}

export default function NewListing() {
  const { t, L, num, money } = useI18n()
  const { dispatch } = useDemo()
  const toast = useToast()
  const confirmPasscode = usePasscode()
  const navigate = useNavigate()

  // Prefilled so the demo can be submitted in one click
  const [form, setForm] = useState({
    titleEn: 'Biology Board Question Bank',
    titleBn: 'জীববিজ্ঞান বোর্ড প্রশ্ন ব্যাংক',
    cls: 'class9_10',
    subject: 'biology',
    price: 150,
    pages: 280,
    syllabus: 2026,
    samples: 12,
    cover: 'amber',
    about: 'Solved board questions from all eight education boards, 2018–2025, arranged chapter by chapter.',
    aboutBn: '',
    fileName: 'biology-board-qbank-2026.pdf',
  })
  const set = (key) => (event) => setForm((f) => ({ ...f, [key]: event.target.value }))
  const setSamples = (n) => setForm((f) => ({ ...f, samples: Math.min(MAX_SAMPLES, Math.max(MIN_SAMPLES, n)) }))

  const valid = form.titleEn.trim() && Number(form.price) > 0 && Number(form.pages) > form.samples && form.fileName
  const option = classOptions.find((c) => c.id === form.cls)
  const preview = { title: { en: form.titleEn || '…', bn: form.titleBn || form.titleEn || '…' }, cover: form.cover }

  async function submit(event) {
    event.preventDefault()
    if (!valid) return
    const titleEn = form.titleEn.trim()
    if (!(await confirmPasscode(t('passcode.actions.uploadBook', { title: titleEn })))) return
    const id = `bk-${Date.now()}`
    const aboutEn = form.about.trim()
    const aboutBn = form.aboutBn.trim()
    dispatch({
      type: 'addBook',
      book: {
        id,
        publisherId: MY_PUBLISHER.id,
        publisher: MY_PUBLISHER.name,
        level: option.level,
        title: { en: titleEn, bn: form.titleBn.trim() || titleEn },
        cls: option.label,
        subject: form.subject,
        price: Number(form.price),
        pages: Number(form.pages),
        syllabus: Number(form.syllabus),
        rating: 0,
        readers: 0,
        sold: 0,
        status: 'review',
        cover: form.cover,
        // Plain English text unless a Bangla description was given; the Bangla view falls back to English
        about: aboutBn ? { en: aboutEn, bn: aboutBn } : aboutEn,
        inside: [],
        // Extra fields this portal reads back: free sample pages and the submission date for the review trail
        samplePages: form.samples,
        submittedAt: new Date().toISOString(),
      },
    })
    toast(t('publisher.new.sent'))
    navigate(`/publisher/listings/${id}`)
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageIntro title={t('publisher.new.title')} body={t('publisher.new.body')} />

      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="grid content-start gap-6">
          <Panel title={t('publisher.new.bookSection')}>
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field id="pub-title-en" label={t('publisher.new.titleEn')}>
                  <input id="pub-title-en" required value={form.titleEn} onChange={set('titleEn')} className={inputStyles} />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field id="pub-title-bn" label={t('publisher.new.titleBn')} hint={t('publisher.new.titleBnHint')}>
                  <input id="pub-title-bn" lang="bn" value={form.titleBn} onChange={set('titleBn')} className={inputStyles} />
                </Field>
              </div>
              <Field id="pub-class" label={t('publisher.new.cls')}>
                <select id="pub-class" value={form.cls} onChange={set('cls')} className={inputStyles}>
                  {classOptions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {L(c.label)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id="pub-subject" label={t('publisher.new.subject')}>
                <select id="pub-subject" value={form.subject} onChange={set('subject')} className={inputStyles}>
                  {Object.entries(subjects).map(([key, label]) => (
                    <option key={key} value={key}>
                      {L(label)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id="pub-price" label={t('publisher.new.price')} hint={t('publisher.new.priceHint', { amount: money(Math.round(Number(form.price || 0) * 0.8)) })}>
                <input id="pub-price" type="number" min="1" inputMode="numeric" required value={form.price} onChange={set('price')} className={`${inputStyles} tabular-nums`} />
              </Field>
              <Field id="pub-pages" label={t('publisher.pages')}>
                <input id="pub-pages" type="number" min={MAX_SAMPLES + 1} inputMode="numeric" required value={form.pages} onChange={set('pages')} className={`${inputStyles} tabular-nums`} />
              </Field>
              <Field id="pub-syllabus" label={t('publisher.syllabus')}>
                <input id="pub-syllabus" type="number" min="2025" max="2027" value={form.syllabus} onChange={set('syllabus')} className={`${inputStyles} tabular-nums`} />
              </Field>
              <Field id="pub-id" label={t('publisher.pubIdLabel')}>
                <div className="relative">
                  <input id="pub-id" readOnly value={MY_PUBLISHER.publicationId} className={`${inputStyles} bg-surface-2 pr-28 font-semibold`} />
                  <span className="absolute inset-y-0 right-3 inline-flex items-center gap-1 text-xs font-semibold text-ok">
                    <BadgeCheck className="size-4" /> {t('publisher.verifiedId')}
                  </span>
                </div>
              </Field>
              <div className="sm:col-span-2">
                <Field id="pub-about" label={t('publisher.new.about')}>
                  <textarea id="pub-about" rows={3} value={form.about} onChange={set('about')} className={inputStyles} />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field id="pub-about-bn" label={t('publisher.new.aboutBn')} hint={t('publisher.new.aboutBnHint')}>
                  <textarea id="pub-about-bn" lang="bn" rows={3} value={form.aboutBn} onChange={set('aboutBn')} className={inputStyles} />
                </Field>
              </div>
            </div>
          </Panel>

          <Panel title={t('publisher.new.fileSection')}>
            <div className="grid gap-5 p-5 sm:grid-cols-2">
              <div className="grid content-start gap-1.5">
                <label htmlFor="pub-file" className="text-sm font-semibold">
                  {t('publisher.new.file')}
                </label>
                <label
                  htmlFor="pub-file"
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-line bg-surface-2/50 px-4 py-3 hover:border-primary"
                >
                  <FileText className="size-5 shrink-0 text-primary" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{form.fileName || t('publisher.new.noFile')}</span>
                    <span className="block text-xs text-ink-2">{t('publisher.new.fileHint')}</span>
                  </span>
                </label>
                <input
                  id="pub-file"
                  type="file"
                  accept="application/pdf,.pdf"
                  className="sr-only"
                  onChange={(e) => e.target.files?.[0] && setForm((f) => ({ ...f, fileName: e.target.files[0].name }))}
                />
              </div>

              <div className="grid content-start gap-1.5">
                <span id="pub-samples-label" className="text-sm font-semibold">
                  {t('publisher.new.samples')}
                </span>
                <div className="flex items-center gap-2" role="group" aria-labelledby="pub-samples-label">
                  <button
                    type="button"
                    onClick={() => setSamples(form.samples - 1)}
                    disabled={form.samples <= MIN_SAMPLES}
                    aria-label={t('publisher.new.fewer')}
                    className="grid size-10 place-items-center rounded-xl border border-line hover:bg-surface-2 disabled:opacity-40"
                  >
                    <Minus className="size-4" />
                  </button>
                  <output aria-live="polite" className="min-w-16 text-center font-display text-2xl font-semibold tabular-nums">
                    {num(form.samples)}
                  </output>
                  <button
                    type="button"
                    onClick={() => setSamples(form.samples + 1)}
                    disabled={form.samples >= MAX_SAMPLES}
                    aria-label={t('publisher.new.more')}
                    className="grid size-10 place-items-center rounded-xl border border-line hover:bg-surface-2 disabled:opacity-40"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
                <p className="text-xs text-ink-2">{t('publisher.new.samplesHint', { min: num(MIN_SAMPLES), max: num(MAX_SAMPLES) })}</p>
              </div>

              <fieldset className="sm:col-span-2">
                <legend className="text-sm font-semibold">{t('publisher.new.cover')}</legend>
                <div className="mt-2 flex flex-wrap gap-2" role="radiogroup">
                  {COVERS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      role="radio"
                      aria-checked={form.cover === c}
                      onClick={() => setForm((f) => ({ ...f, cover: c }))}
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold ${
                        form.cover === c ? 'border-ink bg-surface-2' : 'border-line hover:bg-surface-2'
                      }`}
                    >
                      <span className={`size-4 rounded-full ring-1 ring-line ${coverSwatch[c]}`} /> {t(`publisher.new.covers.${c}`)}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
          </Panel>
        </div>

        <aside className="grid content-start gap-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-line bg-surface p-5">
            <p className="text-xs font-semibold tracking-[0.12em] text-ink-2 uppercase">{t('publisher.new.preview')}</p>
            <div className="mt-4 flex gap-4">
              <BookCover book={preview} className="w-24 text-base" />
              <div className="min-w-0 text-sm">
                <p className="font-semibold break-words">{L(preview.title)}</p>
                <p className="mt-1 text-ink-2">{L(option.label)} · {L(subjects[form.subject])}</p>
                <p className="mt-2 font-display text-xl font-semibold tabular-nums">{money(Number(form.price || 0))}</p>
                <p className="text-xs text-ink-2">{t('publisher.new.previewSamples', { n: num(form.samples), pages: num(Number(form.pages || 0)) })}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 rounded-2xl bg-accent-soft p-4 text-sm">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-warn" />
            <p>{t('publisher.new.rule')}</p>
          </div>
          <button type="submit" disabled={!valid} className={`${buttonStyles.accent} w-full py-3 disabled:opacity-45`}>
            <Send className="size-4" /> {t('publisher.new.submit')}
          </button>
        </aside>
      </form>
    </div>
  )
}

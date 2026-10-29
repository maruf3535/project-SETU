import { ArrowDown, ArrowLeft, ArrowUp, Eye, FileVideo, Plus, Send, ShieldCheck, Trash2, TriangleAlert, Undo2 } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { usePasscode } from '../../components/Passcode'
import { useToast } from '../../components/Toast'
import { buttonStyles, inputStyles, PageIntro, Panel } from '../../components/ui'
import { classById, classes, firstSubject, subjectGroups, subjectLabel } from '../../data/curriculum'
import { COURSE_LEVELS, COURSE_QUALIFY_SCORE, MAX_LECTURES, MAX_PREVIEWS, MIN_LECTURES, MIN_PRICE, PLATFORM_FEE_PERCENT, SKILL_SUGGESTIONS } from '../../data/demo/courses'
import { useI18n } from '../../i18n/I18nProvider'
import { useCourses } from '../../store/CoursesStore'
import { useDemo } from '../../store/DemoStore'
import { useTeacher } from '../teacher/useTeacher'
import { sameTopic, studentTopics, topicLabel, useCourseRole, useCourseUser, useQualificationText, withRevision } from './courseUtils'
import { CourseCover } from './shared'

const COVERS = ['teal', 'amber', 'mist']
const coverSwatch = { teal: 'bg-primary', amber: 'bg-accent', mist: 'bg-surface-2' }
const SUBJECT_LEVELS = COURSE_LEVELS.filter((l) => l !== 'skills')

const topicKey = (topic) => (topic.kind === 'skill' ? `skill:${topic.skill}` : `subject:${topic.subject}`)
const en = (text) => (typeof text === 'string' ? text : (text?.en ?? ''))
// A Bangla text that only repeats the English one counts as not given
const bn = (text) => (typeof text === 'string' || !text || text.bn === text.en ? '' : text.bn)

// Ids and timestamps for records created by a click
const newId = (prefix) => `${prefix}-${Date.now()}`
const nowIso = () => new Date().toISOString()

let lectureSeq = 0
const blankLecture = (titleEn = '', titleBn = '', minutes = 10) => ({ key: `new-${(lectureSeq += 1)}`, titleEn, titleBn, minutes, preview: false, fileName: '' })

function Field({ id, label, hint, children, className = '' }) {
  return (
    <div className={`grid content-start gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-ink-2">{hint}</p>}
    </div>
  )
}

// Starting values: the course being edited, or a prefilled draft so the demo can be submitted in one click
function initialForm({ course, role, studentOptions, studentLevel, teacherLevel }) {
  if (course) {
    const topic = course.topic
    return {
      titleEn: en(course.title),
      titleBn: bn(course.title),
      aboutEn: en(course.about),
      aboutBn: bn(course.about),
      topicKind: topic.kind,
      studentTopic: topicKey(topic),
      classId: topic.classId ?? 'class9_10',
      subject: topic.subject ?? firstSubject('class9_10'),
      skill: topic.skill ?? '',
      level: course.level,
      pricing: course.price > 0 ? 'paid' : 'free',
      price: course.price || 100,
      cover: course.cover,
      lectures: course.lectures.map((l) => ({ key: l.id, id: l.id, titleEn: en(l.title), titleBn: bn(l.title), minutes: l.minutes, preview: l.preview, fileName: l.fileName ?? '' })),
    }
  }
  const first = studentOptions[0]?.topic
  const teacherTopic = teacherLevel === 'university' ? { classId: 'university', subject: 'cse' } : { classId: 'class9_10', subject: 'physics' }
  const topic =
    role === 'student' ? first : role === 'teacher' ? { kind: 'subject', ...teacherTopic } : { kind: 'skill', skill: 'Data cleaning' }
  const label = topic ? topicLabel(topic) : ''
  const labelEn = en(label)
  const labelBn = typeof label === 'string' ? label : label.bn
  return {
    titleEn: labelEn ? `${labelEn} for beginners` : '',
    titleBn: labelEn ? `নতুনদের জন্য ${labelBn}` : '',
    aboutEn: labelEn ? `Short lessons that take you from the basics of ${labelEn} to a small task you can finish on your own.` : '',
    aboutBn: labelEn ? `${labelBn}-এর মূল ধারণা থেকে শুরু করে নিজে শেষ করার মতো একটি ছোট কাজ পর্যন্ত ছোট ছোট পাঠ।` : '',
    topicKind: topic?.kind ?? 'skill',
    studentTopic: topic ? topicKey(topic) : '',
    classId: topic?.classId ?? 'class9_10',
    subject: topic?.subject ?? firstSubject('class9_10'),
    skill: topic?.skill ?? '',
    level: topic?.kind === 'skill' ? 'skills' : topic?.classId ? classById(topic.classId).level : studentLevel,
    pricing: 'paid',
    price: 100,
    cover: 'teal',
    lectures: [
      blankLecture('Introduction and what you will make', 'পরিচিতি ও যা বানাবে', 8),
      blankLecture('Core ideas with examples', 'উদাহরণসহ মূল ধারণা', 15),
      blankLecture('Practice task and next steps', 'অনুশীলনের কাজ ও পরের ধাপ', 12),
    ].map((l, i) => ({ ...l, preview: i === 0 })),
  }
}

function LectureEditor({ lecture, index, count, paid, previewsFull, onChange, onMove, onRemove }) {
  const { t, num } = useI18n()
  const id = `lec-${lecture.key}`
  const set = (key) => (event) => onChange({ [key]: event.target.value })
  return (
    <li className="rounded-2xl border border-line p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold tracking-[0.12em] text-ink-2 uppercase">{t('courses.create.lectureN', { n: num(index + 1) })}</span>
        <div className="flex gap-1">
          <button type="button" onClick={() => onMove(-1)} disabled={index === 0} aria-label={t('courses.create.moveUp')} className="grid size-9 place-items-center rounded-lg border border-line hover:bg-surface-2 disabled:opacity-40">
            <ArrowUp className="size-4" />
          </button>
          <button type="button" onClick={() => onMove(1)} disabled={index === count - 1} aria-label={t('courses.create.moveDown')} className="grid size-9 place-items-center rounded-lg border border-line hover:bg-surface-2 disabled:opacity-40">
            <ArrowDown className="size-4" />
          </button>
          <button type="button" onClick={onRemove} disabled={count <= MIN_LECTURES} aria-label={t('courses.create.remove')} className="grid size-9 place-items-center rounded-lg border border-line text-bad hover:bg-bad-soft disabled:opacity-40">
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,1fr)_7rem]">
        <Field id={`${id}-en`} label={t('courses.create.lectureTitle')}>
          <input id={`${id}-en`} required value={lecture.titleEn} onChange={set('titleEn')} className={inputStyles} />
        </Field>
        <Field id={`${id}-min`} label={t('courses.create.minutes')}>
          <input id={`${id}-min`} type="number" min="1" max="180" required inputMode="numeric" value={lecture.minutes} onChange={set('minutes')} className={`${inputStyles} tabular-nums`} />
        </Field>
        <Field id={`${id}-bn`} label={t('courses.create.lectureTitleBn')} className="sm:col-span-2">
          <input id={`${id}-bn`} lang="bn" value={lecture.titleBn} onChange={set('titleBn')} className={inputStyles} />
        </Field>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label htmlFor={`${id}-file`} className="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5 rounded-xl border border-dashed border-line bg-surface-2/50 px-3 py-2 hover:border-primary">
          <FileVideo className="size-5 shrink-0 text-primary" />
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold">{lecture.fileName || t('courses.create.chooseVideo')}</span>
            <span className="block text-xs text-ink-2">{t('courses.create.videoHint')}</span>
          </span>
        </label>
        <input
          id={`${id}-file`}
          type="file"
          accept="video/*"
          className="sr-only"
          onChange={(e) => e.target.files?.[0] && onChange({ fileName: e.target.files[0].name })}
        />
        {paid && (
          <label className={`inline-flex items-center gap-2 text-sm font-semibold ${!lecture.preview && previewsFull ? 'opacity-50' : ''}`}>
            <input
              type="checkbox"
              checked={lecture.preview}
              disabled={!lecture.preview && previewsFull}
              onChange={(e) => onChange({ preview: e.target.checked })}
              className="size-4 accent-[var(--primary)]"
            />
            <Eye className="size-4 text-ink-2" /> {t('courses.create.freePreview')}
          </label>
        )}
      </div>
    </li>
  )
}

export default function CreateCourse({ role: roleProp }) {
  const { id } = useParams()
  const { t, L, num, money } = useI18n()
  const { role, base } = useCourseRole(roleProp)
  const user = useCourseUser(role)
  const { courseById, dispatch } = useCourses()
  const { studentById } = useDemo()
  const { level: teacherLevel, persona } = useTeacher()
  const toast = useToast()
  const confirmPasscode = usePasscode()
  const navigate = useNavigate()
  const qualificationText = useQualificationText()

  const editing = id ? courseById[id] : null
  // Editing a live course makes (or updates) a revision; the live version stays until it is approved
  const live = editing?.status === 'live'
  const revision = live ? editing.revision : null
  // Sent back: a returned new course, or a returned revision of a live one
  const sentBack = editing?.status === 'returned' || revision?.status === 'returned'
  const note = editing?.status === 'returned' ? editing.reviewNote : revision?.reviewNote
  const student = role === 'student' ? studentById[user.id] : null
  const studentOptions = role === 'student' ? studentTopics(student) : []
  const [form, setForm] = useState(() =>
    initialForm({ course: editing && withRevision(editing), role, studentOptions, studentLevel: student?.level === 'college' ? 'college' : student?.level === 'school' ? 'school' : 'university', teacherLevel }),
  )

  // Only the creator edits, and only before the course is live
  if (id && (!editing || editing.creatorId !== user?.id)) return <Navigate to={id && editing ? `${base}/${id}` : base} replace />
  if (!user) return <Navigate to={base} replace />

  const set = (key) => (event) => setForm((f) => ({ ...f, [key]: event.target.value }))
  const chooseClass = (event) => {
    const classId = event.target.value
    setForm((f) => ({ ...f, classId, subject: subjectLabel(classId, f.subject) ? f.subject : firstSubject(classId), level: classById(classId).level }))
  }
  const chooseStudentTopic = (event) => {
    const option = studentOptions.find((o) => topicKey(o.topic) === event.target.value)
    setForm((f) => ({ ...f, studentTopic: event.target.value, level: option.topic.kind === 'skill' ? 'skills' : f.level === 'skills' ? 'school' : f.level }))
  }
  const updateLecture = (index, change) => setForm((f) => ({ ...f, lectures: f.lectures.map((l, i) => (i === index ? { ...l, ...change } : l)) }))
  const moveLecture = (index, by) =>
    setForm((f) => {
      const lectures = [...f.lectures]
      ;[lectures[index], lectures[index + by]] = [lectures[index + by], lectures[index]]
      return { ...f, lectures }
    })
  const removeLecture = (index) => setForm((f) => ({ ...f, lectures: f.lectures.filter((_, i) => i !== index) }))
  const addLecture = () => setForm((f) => ({ ...f, lectures: [...f.lectures, blankLecture()] }))

  // The topic the form describes, in the shape stored on a course
  const topic =
    role === 'student'
      ? studentOptions.find((o) => topicKey(o.topic) === form.studentTopic)?.topic
      : role === 'teacher' && form.topicKind === 'subject'
        ? { kind: 'subject', classId: form.classId, subject: form.subject }
        : form.skill.trim() && { kind: 'skill', skill: form.skill.trim() }
  const level = topic?.kind === 'skill' ? 'skills' : topic?.classId ? classById(topic.classId).level : form.level
  const paid = form.pricing === 'paid'
  const price = paid ? Number(form.price || 0) : 0
  const previews = paid ? form.lectures.filter((l) => l.preview).length : 0
  const qualification =
    role === 'teacher' ? { ok: true, kind: 'teacher', detail: persona.detail } : role === 'industry' ? { ok: true, kind: 'industry' } : topic && studentOptions.find((o) => sameTopic(o.topic, topic))

  const problems = [
    !form.titleEn.trim() && 'title',
    !topic && 'topic',
    form.lectures.length < MIN_LECTURES && 'lectures',
    form.lectures.some((l) => !l.titleEn.trim() || !(Number(l.minutes) > 0)) && 'lectureFields',
    paid && price < MIN_PRICE && 'price',
  ].filter(Boolean)
  const valid = problems.length === 0

  const preview = { title: { en: form.titleEn || '…', bn: form.titleBn || form.titleEn || '…' }, cover: form.cover, level, lectures: form.lectures }

  async function submit(event) {
    event.preventDefault()
    if (!valid) return
    const titleEn = form.titleEn.trim()
    const label = sentBack ? 'courses.passcode.resubmit' : live && !revision ? 'courses.passcode.revise' : editing ? 'courses.passcode.save' : 'courses.passcode.submit'
    if (!(await confirmPasscode(t(label, { title: titleEn })))) return
    const courseId = editing?.id ?? newId('crs')
    const aboutEn = form.aboutEn.trim()
    const aboutBn = form.aboutBn.trim()
    const fields = {
      level,
      topic,
      title: { en: titleEn, bn: form.titleBn.trim() || titleEn },
      // Plain English text unless a Bangla description was given; the Bangla view falls back to English
      about: aboutBn ? { en: aboutEn, bn: aboutBn } : aboutEn,
      price,
      cover: form.cover,
      lectures: form.lectures.map((l, i) => ({
        id: l.id ?? newId(`${courseId}-l${i + 1}`),
        title: { en: l.titleEn.trim(), bn: l.titleBn.trim() || l.titleEn.trim() },
        minutes: Number(l.minutes),
        preview: paid && l.preview,
        fileName: l.fileName || undefined,
      })),
    }
    if (live) {
      dispatch({ type: 'reviseCourse', id: courseId, changes: fields })
      toast(sentBack ? t('courses.create.resubmitted') : t('courses.create.revisionSent'))
    } else if (editing) {
      dispatch({ type: 'editCourse', id: courseId, changes: fields })
      toast(sentBack ? t('courses.create.resubmitted') : t('courses.create.saved'))
    } else {
      dispatch({
        type: 'addCourse',
        course: {
          id: courseId,
          creatorId: user.id,
          creatorRole: role,
          creatorName: user.name,
          creatorInitials: user.initials,
          ...fields,
          submittedAt: nowIso(),
          baseEnrolled: 0,
          baseSales: 0,
          baseRating: { avg: 0, count: 0 },
        },
      })
      toast(t('courses.create.sent'))
    }
    navigate(`${base}/${courseId}`)
  }

  // A student with nothing to teach yet sees the rule instead of the form
  if (role === 'student' && !studentOptions.length) {
    return (
      <div className="mx-auto max-w-3xl">
        <PageIntro title={t('courses.create.title')} />
        <div className="rounded-2xl border border-dashed border-line bg-surface p-6">
          <p className="font-semibold">{t('courses.create.notYet')}</p>
          <p className="mt-1 text-sm text-ink-2">{t('courses.create.studentRule', { score: num(COURSE_QUALIFY_SCORE) })}</p>
          <Link to={base} className={`${buttonStyles.ghost} mt-4`}>
            {t('courses.detail.back')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl">
      <Link to={editing ? `${base}/${editing.id}` : `${base}?tab=teaching`} className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 hover:text-ink">
        <ArrowLeft className="size-4" /> {editing ? t('courses.create.backCourse') : t('courses.detail.backTeaching')}
      </Link>
      <div className="mt-4">
        <PageIntro title={editing ? t('courses.create.editTitle') : t('courses.create.title')} body={live ? t('courses.create.revisionBody') : t('courses.create.body')} />
      </div>

      {sentBack && note && (
        <div className="mb-6 flex gap-3 rounded-2xl bg-bad-soft p-4 text-sm">
          <Undo2 className="mt-0.5 size-5 shrink-0 text-bad" />
          <div>
            <p className="font-semibold">{t('courses.dashboard.returnedNote')}</p>
            <p className="mt-1">{L(note)}</p>
          </div>
        </div>
      )}

      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="grid content-start gap-6">
          <Panel title={t('courses.create.aboutSection')}>
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <Field id="crs-title-en" label={t('courses.create.titleEn')} className="sm:col-span-2">
                <input id="crs-title-en" required value={form.titleEn} onChange={set('titleEn')} className={inputStyles} />
              </Field>
              <Field id="crs-title-bn" label={t('courses.create.titleBn')} hint={t('courses.create.bnHint')} className="sm:col-span-2">
                <input id="crs-title-bn" lang="bn" value={form.titleBn} onChange={set('titleBn')} className={inputStyles} />
              </Field>

              {role === 'student' && (
                <>
                  <Field id="crs-topic" label={t('courses.create.topic')} hint={t('courses.create.studentTopicHint')} className="sm:col-span-2">
                    <select id="crs-topic" value={form.studentTopic} onChange={chooseStudentTopic} className={inputStyles}>
                      {studentOptions.map((o) => (
                        <option key={topicKey(o.topic)} value={topicKey(o.topic)}>
                          {L(topicLabel(o.topic))} · {o.reason.kind === 'skill' ? t('courses.create.reasonSkill') : t('courses.create.reasonScore', { score: num(o.reason.score) })}
                        </option>
                      ))}
                    </select>
                  </Field>
                  {topic?.kind === 'subject' && (
                    <Field id="crs-level" label={t('courses.create.level')}>
                      <select id="crs-level" value={form.level} onChange={set('level')} className={inputStyles}>
                        {SUBJECT_LEVELS.map((l) => (
                          <option key={l} value={l}>
                            {t(`courses.levels.${l}`)}
                          </option>
                        ))}
                      </select>
                    </Field>
                  )}
                </>
              )}

              {role === 'teacher' && (
                <fieldset className="sm:col-span-2">
                  <legend className="text-sm font-semibold">{t('courses.create.topicKind')}</legend>
                  <div className="mt-2 inline-flex rounded-xl border border-line bg-surface p-1" role="radiogroup" aria-label={t('courses.create.topicKind')}>
                    {['subject', 'skill'].map((k) => (
                      <button
                        key={k}
                        type="button"
                        role="radio"
                        aria-checked={form.topicKind === k}
                        onClick={() => setForm((f) => ({ ...f, topicKind: k }))}
                        className={`rounded-lg px-3.5 py-1.5 text-sm font-semibold ${form.topicKind === k ? 'bg-brand text-brand-ink' : 'text-ink-2'}`}
                      >
                        {t(`courses.create.kinds.${k}`)}
                      </button>
                    ))}
                  </div>
                </fieldset>
              )}

              {role === 'teacher' && form.topicKind === 'subject' && (
                <>
                  <Field id="crs-class" label={t('courses.create.cls')}>
                    <select id="crs-class" value={form.classId} onChange={chooseClass} className={inputStyles}>
                      {classes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {L(c.label)}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field id="crs-subject" label={t('courses.create.subject')}>
                    <select id="crs-subject" value={form.subject} onChange={set('subject')} className={inputStyles}>
                      {Object.entries(classById(form.classId)?.subjects ?? {}).map(([group, list]) => (
                        <optgroup key={group} label={L(subjectGroups[group])}>
                          {Object.entries(list).map(([key, label]) => (
                            <option key={`${group}-${key}`} value={key}>
                              {L(label)}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </Field>
                </>
              )}

              {(role === 'industry' || (role === 'teacher' && form.topicKind === 'skill')) && (
                <Field id="crs-skill" label={t('courses.create.skill')} hint={t('courses.create.skillHint')} className="sm:col-span-2">
                  <input id="crs-skill" required list="crs-skill-list" value={form.skill} onChange={set('skill')} className={inputStyles} />
                  <datalist id="crs-skill-list">
                    {SKILL_SUGGESTIONS.map((s) => (
                      <option key={s} value={s} />
                    ))}
                  </datalist>
                </Field>
              )}

              <Field id="crs-about" label={t('courses.create.about')} className="sm:col-span-2">
                <textarea id="crs-about" rows={3} value={form.aboutEn} onChange={set('aboutEn')} className={inputStyles} />
              </Field>
              <Field id="crs-about-bn" label={t('courses.create.aboutBn')} hint={t('courses.create.bnHint')} className="sm:col-span-2">
                <textarea id="crs-about-bn" lang="bn" rows={3} value={form.aboutBn} onChange={set('aboutBn')} className={inputStyles} />
              </Field>

              <fieldset className="sm:col-span-2">
                <legend className="text-sm font-semibold">{t('courses.create.cover')}</legend>
                <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label={t('courses.create.cover')}>
                  {COVERS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      role="radio"
                      aria-checked={form.cover === c}
                      onClick={() => setForm((f) => ({ ...f, cover: c }))}
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold ${form.cover === c ? 'border-ink bg-surface-2' : 'border-line hover:bg-surface-2'}`}
                    >
                      <span className={`size-4 rounded-full ring-1 ring-line ${coverSwatch[c]}`} /> {t(`courses.create.covers.${c}`)}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
          </Panel>

          <Panel title={t('courses.create.priceSection')}>
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <fieldset className="sm:col-span-2">
                <legend className="sr-only">{t('courses.create.priceSection')}</legend>
                <div className="inline-flex rounded-xl border border-line bg-surface p-1" role="radiogroup" aria-label={t('courses.create.priceSection')}>
                  {['free', 'paid'].map((k) => (
                    <button
                      key={k}
                      type="button"
                      role="radio"
                      aria-checked={form.pricing === k}
                      onClick={() => setForm((f) => ({ ...f, pricing: k }))}
                      className={`rounded-lg px-4 py-1.5 text-sm font-semibold ${form.pricing === k ? 'bg-brand text-brand-ink' : 'text-ink-2'}`}
                    >
                      {t(`courses.create.pricing.${k}`)}
                    </button>
                  ))}
                </div>
              </fieldset>
              {paid ? (
                <Field
                  id="crs-price"
                  label={t('courses.create.price')}
                  hint={t('courses.create.priceHint', { amount: money(Math.round(price * (1 - PLATFORM_FEE_PERCENT / 100))), percent: num(PLATFORM_FEE_PERCENT) })}
                >
                  <input id="crs-price" type="number" min={MIN_PRICE} inputMode="numeric" required value={form.price} onChange={set('price')} className={`${inputStyles} tabular-nums`} />
                </Field>
              ) : (
                <p className="text-sm text-ink-2 sm:col-span-2">{t('courses.create.freeHint')}</p>
              )}
              {paid && <p className="self-end text-sm text-ink-2">{t('courses.create.previewRule', { n: num(MAX_PREVIEWS) })}</p>}
            </div>
          </Panel>

          <Panel
            title={t('courses.create.lecturesSection', { n: num(form.lectures.length) })}
            action={
              <button type="button" onClick={addLecture} disabled={form.lectures.length >= MAX_LECTURES} className={`${buttonStyles.ghost} py-1.5 disabled:opacity-45`}>
                <Plus className="size-4" /> {t('courses.create.addLecture')}
              </button>
            }
          >
            <ol className="grid gap-3 p-5">
              {form.lectures.map((l, i) => (
                <LectureEditor
                  key={l.key}
                  lecture={l}
                  index={i}
                  count={form.lectures.length}
                  paid={paid}
                  previewsFull={previews >= MAX_PREVIEWS}
                  onChange={(change) => updateLecture(i, change)}
                  onMove={(by) => moveLecture(i, by)}
                  onRemove={() => removeLecture(i)}
                />
              ))}
            </ol>
            <p className="border-t border-line px-5 py-3 text-xs text-ink-2">{t('courses.create.sampleNote')}</p>
          </Panel>
        </div>

        <aside className="grid content-start gap-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-line bg-surface p-5">
            <p className="text-xs font-semibold tracking-[0.12em] text-ink-2 uppercase">{t('courses.create.preview')}</p>
            <CourseCover course={preview} className="mt-3" />
            <p className="mt-3 font-semibold break-words">{L(preview.title)}</p>
            <p className="mt-1 text-sm text-ink-2">
              {t(`courses.levels.${level}`)}
              {topic && ` · ${L(topicLabel(topic))}`}
            </p>
            <p className="mt-2 font-display text-xl font-semibold tabular-nums">{paid ? money(price) : t('courses.free')}</p>
            {paid && <p className="text-xs text-ink-2">{t('courses.create.previewCount', { n: num(previews), max: num(MAX_PREVIEWS) })}</p>}
          </div>

          <div className={`flex gap-3 rounded-2xl p-4 text-sm ${qualification ? 'bg-ok-soft' : 'bg-warn-soft'}`}>
            {qualification ? <ShieldCheck className="mt-0.5 size-5 shrink-0 text-ok" /> : <TriangleAlert className="mt-0.5 size-5 shrink-0 text-warn" />}
            <div>
              <p className="font-semibold">{t('courses.create.whyYou')}</p>
              <p className="mt-0.5">
                {qualification
                  ? qualificationText(role === 'student' ? { ...qualification.reason, topic: qualification.topic } : qualification)
                  : t('courses.create.pickTopic')}
              </p>
              {role === 'student' && <p className="mt-2 text-xs text-ink-2">{t('courses.create.studentRule', { score: num(COURSE_QUALIFY_SCORE) })}</p>}
            </div>
          </div>

          <div className="flex gap-3 rounded-2xl bg-accent-soft p-4 text-sm">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-warn" />
            <p>{t('courses.create.reviewRule')}</p>
          </div>

          {!valid && (
            <ul className="grid gap-1 text-sm text-bad" aria-live="polite">
              {problems.map((p) => (
                <li key={p}>{t(`courses.create.problems.${p}`, { n: num(MIN_LECTURES), min: money(MIN_PRICE) })}</li>
              ))}
            </ul>
          )}
          <button type="submit" disabled={!valid} className={`${buttonStyles.accent} w-full py-3 disabled:opacity-45`}>
            <Send className="size-4" /> {sentBack ? t('courses.create.resubmit') : live && !revision ? t('courses.create.submitRevision') : editing ? t('courses.create.save') : t('courses.create.submit')}
          </button>
        </aside>
      </form>
    </div>
  )
}

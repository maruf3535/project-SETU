import { ArrowLeft, BadgeCheck, Check, CirclePlay, Clock3, Eye, ListVideo, Lock, Pencil, School, ShieldCheck, Star, Undo2 } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Avatar from '../../components/Avatar'
import { usePasscode } from '../../components/Passcode'
import { useToast } from '../../components/Toast'
import { buttonStyles, Dialog, inputStyles } from '../../components/ui'
import { POINTS_DISCOUNT } from '../../data/demo/books'
import { RATE_AFTER } from '../../data/demo/courses'
import { useI18n } from '../../i18n/I18nProvider'
import { useCourses } from '../../store/CoursesStore'
import { useCurrentStudent, useDemo } from '../../store/DemoStore'
import { topicLabel, totalMinutes, useCourseAccess, useCourseRole, useCourseUser, useCreatorName, useDuration, useQualificationText, useRecommendations } from './courseUtils'
import { CourseCover, CourseStatusPill, RatingLine, RoleTag, Stars, StarInput } from './shared'

const COMMENT_MAX = 240

function BuyDialog({ course, user, onClose }) {
  const { t, L, money, num } = useI18n()
  const { dispatch: demoDispatch } = useDemo()
  const { dispatch } = useCourses()
  const { points } = useCurrentStudent()
  const toast = useToast()
  const confirmPasscode = usePasscode()
  // Reward points belong to students; other buyers pay the full price
  const pointsOffer = user.role === 'student'
  const discounted = Math.round(course.price * (1 - POINTS_DISCOUNT.percent / 100))
  const canUsePoints = pointsOffer && points >= POINTS_DISCOUNT.points

  async function buy(usePoints) {
    const paid = usePoints ? discounted : course.price
    if (!(await confirmPasscode(t('courses.passcode.buy', { amount: money(paid), title: L(course.title) })))) return
    if (usePoints) demoDispatch({ type: 'addPoints', studentId: user.id, amount: -POINTS_DISCOUNT.points })
    dispatch({ type: 'enroll', courseId: course.id, userId: user.id, paid, pointsUsed: usePoints ? POINTS_DISCOUNT.points : 0 })
    onClose()
    toast(t('courses.detail.boughtToast', { title: L(course.title) }))
  }

  return (
    <Dialog open title={t('courses.detail.buyTitle', { title: L(course.title) })} onClose={onClose}>
      <div className="grid gap-3">
        {pointsOffer && (
          <button
            type="button"
            disabled={!canUsePoints}
            onClick={() => buy(true)}
            className="flex items-center justify-between gap-3 rounded-2xl border border-line p-4 text-left hover:border-primary disabled:opacity-50"
          >
            <span>
              <span className="block font-semibold">{t('courses.detail.payWithPoints', { points: num(POINTS_DISCOUNT.points), amount: money(discounted) })}</span>
              <span className="block text-sm text-ink-2">
                {canUsePoints ? t('courses.detail.yourPoints', { n: num(points) }) : t('courses.detail.notEnough', { n: num(POINTS_DISCOUNT.points - points) })}
              </span>
            </span>
            <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-ink">−{num(POINTS_DISCOUNT.percent)}%</span>
          </button>
        )}
        <button type="button" onClick={() => buy(false)} className={`${buttonStyles.primary} py-3`}>
          {t('courses.detail.payFull', { amount: money(course.price) })}
        </button>
        <p className="text-xs text-ink-2">{t('courses.detail.buyNote')}</p>
      </div>
    </Dialog>
  )
}

// Rating pays a student RATE_POINTS reward points, like rating notes
const RATE_POINTS = 5

function RateDialog({ course, user, onClose }) {
  const { t, L, num } = useI18n()
  const { dispatch } = useCourses()
  const { dispatch: demoDispatch } = useDemo()
  const toast = useToast()
  const [stars, setStars] = useState(5)
  const [comment, setComment] = useState('')

  function submit(event) {
    event.preventDefault()
    dispatch({
      type: 'rateCourse',
      rating: { id: `rc-${Date.now()}`, courseId: course.id, userId: user.id, name: user.name, initials: user.initials, role: user.role, stars, comment: comment.trim(), at: new Date().toISOString() },
    })
    if (user.role === 'student') demoDispatch({ type: 'addPoints', studentId: user.id, amount: RATE_POINTS })
    onClose()
    toast(user.role === 'student' ? t('courses.rate.thanksPoints', { n: num(RATE_POINTS) }) : t('courses.rate.thanks'))
  }

  return (
    <Dialog open title={t('courses.rate.title')} onClose={onClose}>
      <form onSubmit={submit}>
        <p className="font-semibold">{L(course.title)}</p>
        {user.role === 'student' && <p className="mt-1 text-sm text-ink-2">{t('courses.rate.pointsNote', { n: num(RATE_POINTS) })}</p>}
        <p className="mt-4 text-center text-sm text-ink-2">{t('courses.rate.question')}</p>
        <div className="mt-2">
          <StarInput value={stars} onChange={setStars} />
        </div>
        <label htmlFor="course-comment" className="mt-5 block text-sm font-semibold">
          {t('courses.rate.comment')}
        </label>
        <textarea
          id="course-comment"
          rows={3}
          maxLength={COMMENT_MAX}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={t('courses.rate.placeholder')}
          className={`${inputStyles} mt-1.5`}
        />
        <button type="submit" className={`${buttonStyles.primary} mt-5 w-full py-3`}>
          {t('courses.rate.submit')}
        </button>
      </form>
    </Dialog>
  )
}

// Teachers can point one or more of their class sections to a course
function AssignDialog({ course, user, onClose }) {
  const { t, L, num } = useI18n()
  const { assignments, dispatch } = useCourses()
  const toast = useToast()
  const [picked, setPicked] = useState(() => assignments.filter((a) => a.courseId === course.id && a.teacherId === user.id).map((a) => a.sectionId))
  const toggle = (id) => setPicked((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]))

  function save() {
    dispatch({ type: 'assignCourse', courseId: course.id, teacherId: user.id, sectionIds: picked })
    onClose()
    toast(picked.length ? t('courses.assign.saved', { n: num(picked.length) }) : t('courses.assign.cleared'))
  }

  return (
    <Dialog open title={t('courses.assign.title')} onClose={onClose}>
      <p className="text-sm text-ink-2">{t('courses.assign.body', { title: L(course.title) })}</p>
      <fieldset className="mt-4 grid gap-2">
        <legend className="sr-only">{t('courses.assign.sections')}</legend>
        {user.sections.map((s) => (
          <label key={s.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-line px-4 py-3 hover:bg-surface-2">
            <input type="checkbox" checked={picked.includes(s.id)} onChange={() => toggle(s.id)} className="size-4 accent-[var(--primary)]" />
            <span className="flex-1 font-semibold">{L(s.label)}</span>
            <span className="text-xs text-ink-2 tabular-nums">{t('courses.assign.students', { n: num(s.students) })}</span>
          </label>
        ))}
      </fieldset>
      <button type="button" onClick={save} className={`${buttonStyles.primary} mt-5 w-full py-3`}>
        {t('courses.assign.save')}
      </button>
    </Dialog>
  )
}

function Ratings({ course, access, onRate }) {
  const { t, L, num, date } = useI18n()
  const { ratings } = useCourses()
  const list = ratings.filter((r) => r.courseId === course.id)
  const needed = Math.ceil(course.lectures.length * RATE_AFTER)

  return (
    <section className="mt-10" aria-labelledby="course-ratings">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 id="course-ratings" className="text-xs font-semibold tracking-[0.12em] text-ink-2 uppercase">
          {t('courses.rate.heading')}
        </h3>
        {access.canRate && (
          <button type="button" onClick={onRate} className={`${buttonStyles.accent} py-2`}>
            <Star className="size-4" /> {t('courses.rate.cta')}
          </button>
        )}
      </div>
      {access.stats.ratingCount > 0 && (
        <p className="mt-2 flex items-center gap-2">
          <Stars value={access.stats.rating} />
          <span className="font-display text-2xl font-semibold tabular-nums">{num(access.stats.rating)}</span>
          <span className="text-sm text-ink-2">{t('courses.ratingsN', { n: num(access.stats.ratingCount) })}</span>
        </p>
      )}
      {access.enrolled && !access.isCreator && !access.myRating && !access.canRate && (
        <p className="mt-3 rounded-xl bg-surface-2 px-4 py-3 text-sm text-ink-2">
          {t('courses.rate.locked', { n: num(needed), watched: num(access.watchedCount) })}
        </p>
      )}
      {list.length ? (
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {list.map((r) => (
            <li key={r.id} className="rounded-2xl border border-line bg-surface p-4">
              <div className="flex items-center gap-3">
                <Avatar initials={r.initials} className="size-9 text-xs" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{r.name}</p>
                  <p className="text-xs text-ink-2">{date(r.at)}</p>
                </div>
                <Stars value={r.stars} className="size-3.5" />
                <span className="sr-only">{t('courses.rate.starsN', { n: num(r.stars) })}</span>
              </div>
              {L(r.comment) && <p className="mt-3 text-sm leading-relaxed">{L(r.comment)}</p>}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-ink-2">{t('courses.rate.none')}</p>
      )}
    </section>
  )
}

function LectureList({ course, access, base }) {
  const { t, L, num } = useI18n()
  const duration = useDuration()
  return (
    <ol className="mt-3 divide-y divide-line rounded-2xl border border-line bg-surface">
      {course.lectures.map((lecture, i) => {
        const open = access.canWatch(lecture)
        const done = access.seen.includes(lecture.id)
        const body = (
          <>
            <span className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-semibold tabular-nums ${done ? 'bg-ok-soft text-ok' : 'bg-surface-2 text-ink-2'}`}>
              {done ? <Check className="size-4" aria-label={t('courses.player.watched')} /> : num(i + 1)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold">{L(lecture.title)}</span>
              <span className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-ink-2">
                <span className="inline-flex items-center gap-1 tabular-nums">
                  <Clock3 className="size-3.5" aria-hidden="true" /> {duration(Number(lecture.minutes))}
                </span>
                {lecture.preview && course.price > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2 py-0.5 font-semibold text-warn">
                    <Eye className="size-3" /> {t('courses.preview')}
                  </span>
                )}
              </span>
            </span>
            {open ? <CirclePlay className="size-5 shrink-0 text-primary" aria-hidden="true" /> : <Lock className="size-4 shrink-0 text-ink-2" aria-label={t('courses.detail.locked')} />}
          </>
        )
        return (
          <li key={lecture.id}>
            {open ? (
              <Link to={`${base}/${course.id}/watch?l=${lecture.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-surface-2/60">
                {body}
              </Link>
            ) : (
              <div className="flex items-center gap-3 px-4 py-3 opacity-75">{body}</div>
            )}
          </li>
        )
      })}
    </ol>
  )
}

export default function CourseDetail({ role: roleProp }) {
  const { id } = useParams()
  const { t, L, num, money, date } = useI18n()
  const { role, base } = useCourseRole(roleProp)
  const user = useCourseUser(role)
  const { courseById, assignments, dispatch } = useCourses()
  const course = courseById[id]
  const access = useCourseAccess(course, user)
  const creatorName = useCreatorName()
  const qualificationText = useQualificationText()
  const duration = useDuration()
  const recommendation = useRecommendations(user)[id]
  const toast = useToast()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const [dialog, setDialog] = useState(params.get('rate') === '1' ? 'rate' : null)

  // Courses that are not live yet are visible only to their creator
  if (!course || (course.status !== 'live' && !access.isCreator)) return <Navigate to={base} replace />

  const firstOpen = course.lectures.find((l) => access.canWatch(l))
  const nextUnwatched = course.lectures.find((l) => !access.seen.includes(l.id)) ?? course.lectures[0]
  const previews = course.price > 0 ? course.lectures.filter((l) => l.preview).length : 0
  const myAssigned = role === 'teacher' ? assignments.filter((a) => a.courseId === course.id && a.teacherId === user.id) : []
  const closeDialog = () => {
    setDialog(null)
    if (params.get('rate')) setParams({}, { replace: true })
  }

  function enrollFree() {
    dispatch({ type: 'enroll', courseId: course.id, userId: user.id, paid: 0, pointsUsed: 0 })
    toast(t('courses.detail.enrolledToast', { title: L(course.title) }))
    navigate(`${base}/${course.id}/watch?l=${course.lectures[0].id}`)
  }

  return (
    <div className="mx-auto max-w-5xl">
      <Link to={access.isCreator ? `${base}?tab=teaching` : base} className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 hover:text-ink">
        <ArrowLeft className="size-4" /> {access.isCreator ? t('courses.detail.backTeaching') : t('courses.detail.back')}
      </Link>

      {access.isCreator && course.status !== 'live' && (
        <div className={`mt-5 flex flex-wrap items-start gap-3 rounded-2xl p-4 text-sm ${course.status === 'returned' ? 'bg-bad-soft' : 'bg-warn-soft'}`}>
          {course.status === 'returned' ? <Undo2 className="mt-0.5 size-5 shrink-0 text-bad" /> : <Clock3 className="mt-0.5 size-5 shrink-0 text-warn" />}
          <div className="min-w-0 flex-1">
            <p className="font-semibold">{course.status === 'returned' ? t('courses.detail.returnedHead') : t('courses.detail.reviewHead')}</p>
            {course.status === 'returned' && course.reviewNote && <p className="mt-1">{L(course.reviewNote)}</p>}
          </div>
          <Link to={`${base}/${course.id}/edit`} className={`${buttonStyles.ghost} py-2`}>
            <Pencil className="size-4" /> {course.status === 'returned' ? t('courses.dashboard.fix') : t('courses.dashboard.edit')}
          </Link>
        </div>
      )}

      {access.isCreator && course.status === 'live' && course.revision && (
        <div className={`mt-5 flex flex-wrap items-start gap-3 rounded-2xl p-4 text-sm ${course.revision.status === 'returned' ? 'bg-bad-soft' : 'bg-warn-soft'}`}>
          {course.revision.status === 'returned' ? <Undo2 className="mt-0.5 size-5 shrink-0 text-bad" /> : <Clock3 className="mt-0.5 size-5 shrink-0 text-warn" />}
          <div className="min-w-0 flex-1">
            <p className="font-semibold">{course.revision.status === 'returned' ? t('courses.detail.revisionReturnedHead') : t('courses.detail.revisionHead')}</p>
            {course.revision.status === 'returned' && course.revision.reviewNote && <p className="mt-1">{L(course.revision.reviewNote)}</p>}
          </div>
          <Link to={`${base}/${course.id}/edit`} className={`${buttonStyles.ghost} py-2`}>
            <Pencil className="size-4" /> {course.revision.status === 'returned' ? t('courses.dashboard.fix') : t('courses.dashboard.editRevision')}
          </Link>
        </div>
      )}

      {recommendation && !access?.isCreator && (
        <p className="mt-5 flex items-start gap-2.5 rounded-2xl bg-surface-2 px-4 py-3 text-sm">
          <School className="mt-0.5 size-4 shrink-0 text-primary" />
          <span>{t('courses.recommended.detail', { name: recommendation.teacherName, section: L(recommendation.section) })}</span>
        </p>
      )}

      <div className="mt-5 grid gap-8 md:grid-cols-[18rem_minmax(0,1fr)]">
        <CourseCover course={course} className="w-full self-start" />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {course.status === 'live' ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-ok-soft px-2.5 py-1 text-xs font-semibold text-ok">
                <BadgeCheck className="size-3.5" /> {t('courses.detail.reviewed')}
              </span>
            ) : (
              <CourseStatusPill status={course.status} />
            )}
            <span className="rounded-full bg-surface-2 px-2.5 py-1 text-xs font-semibold">
              {t(`courses.levels.${course.level}`)} · {L(topicLabel(course.topic))}
            </span>
          </div>
          <h2 className="mt-3 font-display text-3xl leading-tight font-semibold">{L(course.title)}</h2>

          <div className="mt-3 flex items-center gap-3">
            <Avatar initials={course.creatorInitials} className="size-10 text-sm" />
            <div className="min-w-0">
              <p className="flex flex-wrap items-center gap-2 font-semibold">
                {creatorName(course)} <RoleTag role={course.creatorRole} />
              </p>
              <p className={`flex items-start gap-1 text-xs ${access.qualification.ok ? 'text-ok' : 'text-warn'}`}>
                <ShieldCheck className="mt-px size-3.5 shrink-0" /> {qualificationText(access.qualification)}
              </p>
            </div>
          </div>
          <RatingLine stats={access.stats} className="mt-3 text-sm" />

          <dl className="mt-5 grid grid-cols-3 divide-x divide-line rounded-2xl border border-line bg-surface text-center">
            <div className="flex flex-col-reverse p-3">
              <dt className="text-xs text-ink-2">{t('courses.detail.lectures')}</dt>
              <dd className="font-display text-xl font-semibold tabular-nums">{num(course.lectures.length)}</dd>
            </div>
            <div className="flex flex-col-reverse p-3">
              <dt className="text-xs text-ink-2">{t('courses.detail.length')}</dt>
              <dd className="font-display text-xl font-semibold tabular-nums">{duration(totalMinutes(course))}</dd>
            </div>
            <div className="flex flex-col-reverse p-3">
              <dt className="text-xs text-ink-2">{t('courses.detail.previews')}</dt>
              <dd className="font-display text-xl font-semibold tabular-nums">{course.price > 0 ? num(previews) : t('courses.detail.allFree')}</dd>
            </div>
          </dl>

          <p className="mt-5 leading-relaxed">{L(course.about)}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl bg-brand p-4 text-brand-ink">
            <div className="flex-1">
              <p className="text-xs text-brand-ink/60">{t('courses.detail.priceLabel')}</p>
              <p className="font-display text-3xl font-semibold tabular-nums">{course.price > 0 ? money(course.price) : t('courses.free')}</p>
            </div>
            {access.isCreator ? (
              <>
                <span className="inline-flex items-center gap-2 rounded-xl bg-brand-ink/10 px-3 py-2 text-sm font-semibold">{t('courses.detail.yours')}</span>
                <Link to={`${base}/${course.id}/watch?l=${course.lectures[0].id}`} className={buttonStyles.accent}>
                  <CirclePlay className="size-4" /> {t('courses.detail.watch')}
                </Link>
                {course.status === 'live' && !course.revision && (
                  <Link to={`${base}/${course.id}/edit`} className="inline-flex items-center gap-2 rounded-xl border border-brand-ink/25 px-4 py-2.5 text-sm font-semibold hover:bg-brand-ink/10">
                    <Pencil className="size-4" /> {t('courses.dashboard.edit')}
                  </Link>
                )}
              </>
            ) : access.enrolled ? (
              <>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-ok-soft px-3 py-2 text-sm font-semibold text-ok">
                  <Check className="size-4" /> {t('courses.enrolledTag')}
                </span>
                <Link to={`${base}/${course.id}/watch?l=${nextUnwatched.id}`} className={buttonStyles.accent}>
                  <CirclePlay className="size-4" /> {access.watchedCount ? t('courses.learning.continue') : t('courses.learning.start')}
                </Link>
              </>
            ) : course.price > 0 ? (
              <>
                {firstOpen && (
                  <Link
                    to={`${base}/${course.id}/watch?l=${firstOpen.id}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-brand-ink/25 px-4 py-2.5 text-sm font-semibold hover:bg-brand-ink/10"
                  >
                    <Eye className="size-4" /> {t('courses.detail.watchPreview')}
                  </Link>
                )}
                <button type="button" onClick={() => setDialog('buy')} className={buttonStyles.accent}>
                  {t('courses.detail.buy')}
                </button>
              </>
            ) : (
              <button type="button" onClick={enrollFree} className={buttonStyles.accent}>
                <CirclePlay className="size-4" /> {t('courses.detail.enrollFree')}
              </button>
            )}
          </div>

          {role === 'teacher' && course.status === 'live' && (
            <div className="mt-3 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-surface p-4 text-sm">
              <School className="size-5 shrink-0 text-primary" />
              <p className="min-w-0 flex-1">
                {myAssigned.length
                  ? t('courses.assign.current', { sections: myAssigned.map((a) => L(user.sections.find((s) => s.id === a.sectionId)?.label ?? a.sectionId)).join(', ') })
                  : t('courses.assign.hint')}
              </p>
              <button type="button" onClick={() => setDialog('assign')} className={`${buttonStyles.ghost} py-2`}>
                {t('courses.assign.cta')}
              </button>
            </div>
          )}
        </div>
      </div>

      <section className="mt-10">
        <h3 className="flex items-center gap-2 text-xs font-semibold tracking-[0.12em] text-ink-2 uppercase">
          <ListVideo className="size-4" /> {t('courses.detail.playlist', { n: num(course.lectures.length) })}
        </h3>
        <LectureList course={course} access={access} base={base} />
        {course.status === 'live' && course.reviewedAt && <p className="mt-2 text-xs text-ink-2">{t('courses.detail.approvedOn', { date: date(course.reviewedAt) })}</p>}
      </section>

      {course.status === 'live' && <Ratings course={course} access={access} onRate={() => setDialog('rate')} />}

      {dialog === 'buy' && <BuyDialog course={course} user={user} onClose={closeDialog} />}
      {dialog === 'rate' && access.canRate && <RateDialog course={course} user={user} onClose={closeDialog} />}
      {dialog === 'assign' && <AssignDialog course={course} user={user} onClose={closeDialog} />}
    </div>
  )
}

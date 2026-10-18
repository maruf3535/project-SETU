import { Award, BadgeCheck, Camera, Lock, PencilLine, ShieldCheck, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Avatar from '../../components/Avatar'
import { useToast } from '../../components/Toast'
import { buttonStyles, inputStyles } from '../../components/ui'
import { signupFields } from '../../data/onboarding'
import { initialsOf } from '../../data/demo/profiles'
import { useI18n } from '../../i18n/I18nProvider'
import { useProfile } from './useProfile'

const DIVISIONS = ['dhaka', 'chattogram', 'rajshahi', 'khulna', 'barishal', 'sylhet', 'rangpur', 'mymensingh']
// IDs a review team has verified can't be edited here; changing them needs a fresh review
const LOCKED = ['pubId', 'license', 'employeeId']

// Square-crops and shrinks a chosen photo so it stays small in browser storage
function readPhoto(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => {
      const img = new Image()
      img.onerror = reject
      img.onload = () => {
        const size = 192
        const side = Math.min(img.width, img.height)
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        canvas.getContext('2d').drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size)
        resolve(canvas.toDataURL('image/jpeg', 0.85))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

function Row({ label, children }) {
  return (
    <div className="grid gap-1 py-3 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-4">
      <dt className="text-sm text-ink-2">{label}</dt>
      <dd className="min-w-0 font-medium break-words">{children}</dd>
    </div>
  )
}

function ProfileForm({ role }) {
  const { t, L, date } = useI18n()
  const location = useLocation()
  const toast = useToast()
  const profile = useProfile(role)
  const [editing, setEditing] = useState(Boolean(location.state?.edit))
  const [photo, setPhoto] = useState(profile.photo ?? null)

  const detailFields = signupFields[role].filter((f) => f.id !== 'phone')
  const fieldValue = (field) =>
    field.type === 'select' ? t(`onboarding.details.levels.${profile.fields[field.id]}`) : profile.fields[field.id]

  async function pickPhoto(event) {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      setPhoto(await readPhoto(file))
    } catch {
      toast(t('profile.photoError'))
    }
  }

  function save(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const fields = Object.fromEntries(detailFields.filter((f) => !LOCKED.includes(f.id)).map((f) => [f.id, form.get(f.id).trim()]))
    const name = fields.name ?? fields.org ?? profile.name
    profile.dispatch({
      type: 'updateProfile',
      id: profile.id,
      changes: {
        fields,
        name: profile.id.startsWith('st-') ? name : undefined,
        initials: initialsOf(name),
        email: form.get('email').trim(),
        phone: form.get('phone').trim(),
        division: form.get('division'),
        district: form.get('district').trim(),
        bio: form.get('bio').trim(),
        photo,
      },
    })
    setEditing(false)
    toast(t('profile.saved'))
  }

  function cancel() {
    setPhoto(profile.photo ?? null)
    setEditing(false)
  }

  return (
    <div className="mx-auto max-w-4xl">
      <form onSubmit={save}>
        <section className="flex flex-col gap-5 rounded-3xl bg-brand p-6 text-brand-ink sm:flex-row sm:items-center">
          <div className="relative self-start">
            <Avatar initials={profile.initials} photo={editing ? photo : profile.photo} className="size-24 text-3xl ring-4 ring-brand-ink/15" />
            {editing && (
              <label htmlFor="profile-photo" className="absolute -right-1 -bottom-1 grid size-9 cursor-pointer place-items-center rounded-full bg-accent text-accent-ink shadow" title={t('profile.changePhoto')}>
                <Camera className="size-4" />
                <span className="sr-only">{t('profile.changePhoto')}</span>
                <input id="profile-photo" type="file" accept="image/*" onChange={pickPhoto} className="sr-only" />
              </label>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold tracking-[0.14em] text-accent uppercase">{t(`roles.${role}`)}</p>
            <h2 className="mt-1 flex flex-wrap items-center gap-2 font-display text-3xl font-semibold">
              {profile.name} <BadgeCheck className="size-6 text-accent" aria-label={t('shell.verified')} />
            </h2>
            <p className="mt-1 text-sm text-brand-ink/70">
              {t('profile.verifiedBy', { by: L(profile.verifiedBy), date: date(profile.verifiedAt) })}
            </p>
            {editing && photo && (
              <button type="button" onClick={() => setPhoto(null)} className="mt-2 inline-flex items-center gap-1.5 text-xs text-brand-ink/70 hover:text-brand-ink">
                <Trash2 className="size-3.5" /> {t('profile.removePhoto')}
              </button>
            )}
          </div>
          {!editing && (
            <button type="button" onClick={() => setEditing(true)} className={buttonStyles.accent}>
              <PencilLine className="size-4" /> {t('profile.edit')}
            </button>
          )}
        </section>

        <div className="mt-6 grid gap-6">
          <section className="rounded-2xl border border-line bg-surface px-5 py-2">
            <h3 className="pt-3 text-xs font-semibold tracking-[0.12em] text-ink-2 uppercase">{t('profile.details')}</h3>
            {editing ? (
              <div className="grid gap-4 py-4 sm:grid-cols-2">
                {detailFields.map((field) => {
                  const id = `profile-${field.id}`
                  const locked = LOCKED.includes(field.id)
                  return (
                    <label key={field.id} htmlFor={id} className="text-sm font-medium">
                      <span className="flex items-center gap-1.5">
                        {t(`onboarding.details.fields.${field.label}`)} {locked && <Lock className="size-3.5 text-ink-2" />}
                      </span>
                      {field.type === 'select' ? (
                        <select id={id} name={field.id} defaultValue={profile.fields[field.id]} className={`${inputStyles} mt-1.5`}>
                          {field.options.map((o) => (
                            <option key={o} value={o}>
                              {t(`onboarding.details.levels.${o}`)}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input id={id} name={field.id} required disabled={locked} defaultValue={profile.fields[field.id]} className={`${inputStyles} mt-1.5 disabled:opacity-60`} />
                      )}
                      {locked && <span className="mt-1 block text-xs font-normal text-ink-2">{t('profile.lockedNote')}</span>}
                    </label>
                  )
                })}
              </div>
            ) : (
              <dl className="divide-y divide-line">
                {detailFields.map((field) => (
                  <Row key={field.id} label={t(`onboarding.details.fields.${field.label}`)}>
                    {fieldValue(field)}
                  </Row>
                ))}
              </dl>
            )}
          </section>

          <section className="rounded-2xl border border-line bg-surface px-5 py-2">
            <h3 className="pt-3 text-xs font-semibold tracking-[0.12em] text-ink-2 uppercase">{t('profile.contact')}</h3>
            {editing ? (
              <div className="grid gap-4 py-4 sm:grid-cols-2">
                <label htmlFor="profile-email" className="text-sm font-medium">
                  {t('profile.email')}
                  <input id="profile-email" name="email" type="email" required defaultValue={profile.email} className={`${inputStyles} mt-1.5`} />
                </label>
                <label htmlFor="profile-phone" className="text-sm font-medium">
                  {t('profile.phone')}
                  <input id="profile-phone" name="phone" type="tel" required defaultValue={profile.phone} className={`${inputStyles} mt-1.5`} />
                </label>
                <label htmlFor="profile-division" className="text-sm font-medium">
                  {t('profile.division')}
                  <select id="profile-division" name="division" defaultValue={profile.division} className={`${inputStyles} mt-1.5`}>
                    {DIVISIONS.map((d) => (
                      <option key={d} value={d}>
                        {t(`common.divisions.${d}`)}
                      </option>
                    ))}
                  </select>
                </label>
                <label htmlFor="profile-district" className="text-sm font-medium">
                  {t('profile.district')}
                  <input id="profile-district" name="district" defaultValue={profile.district} className={`${inputStyles} mt-1.5`} />
                </label>
              </div>
            ) : (
              <dl className="divide-y divide-line">
                <Row label={t('profile.email')}>{profile.email}</Row>
                <Row label={t('profile.phone')}>{profile.phone}</Row>
                <Row label={t('profile.division')}>
                  {t(`common.divisions.${profile.division}`)}
                  {profile.district && ` · ${profile.district}`}
                </Row>
              </dl>
            )}
          </section>

          <section className="rounded-2xl border border-line bg-surface p-5">
            <h3 className="text-xs font-semibold tracking-[0.12em] text-ink-2 uppercase">{t('profile.about')}</h3>
            {editing ? (
              <>
                <label htmlFor="profile-bio" className="sr-only">
                  {t('profile.bio')}
                </label>
                <textarea id="profile-bio" name="bio" rows={3} defaultValue={L(profile.bio)} placeholder={t('profile.bioPlaceholder')} className={`${inputStyles} mt-3`} />
              </>
            ) : (
              <p className="mt-2 leading-relaxed">{L(profile.bio)}</p>
            )}
          </section>

          <p className="flex items-center gap-2 text-sm text-ink-2">
            <ShieldCheck className="size-4 shrink-0 text-primary" /> {t('profile.idPrivate')}
          </p>

          {role === 'student' && !editing && (
            <Link to="/student/portfolio" className={`${buttonStyles.ghost} justify-self-start`}>
              <Award className="size-4" /> {t('profile.portfolio')}
            </Link>
          )}
        </div>

        {editing && (
          <div className="sticky bottom-24 mt-6 flex flex-wrap items-center justify-end gap-2 rounded-2xl border border-line bg-surface p-3 shadow-[0_12px_32px_-16px_rgb(0_0_0/0.4)] lg:bottom-6">
            <span className="mr-auto text-xs text-ink-2">{t('profile.photoNote')}</span>
            <button type="button" onClick={cancel} className={buttonStyles.ghost}>
              {t('common.cancel')}
            </button>
            <button type="submit" className={buttonStyles.accent}>
              {t('profile.save')}
            </button>
          </div>
        )}
      </form>
    </div>
  )
}

// Keyed by profile id so switching level (a different person) starts from that person's saved details
export default function Profile({ role }) {
  const { id } = useProfile(role)
  return <ProfileForm key={id} role={role} />
}

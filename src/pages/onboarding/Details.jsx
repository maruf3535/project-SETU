import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { signupFields } from '../../data/onboarding'
import { ROLES } from '../../data/portals'
import { useI18n } from '../../i18n/I18nProvider'
import OnboardingLayout from './OnboardingLayout'

const inputClass =
  'mt-1.5 w-full rounded-xl border border-line bg-surface px-4 py-3 text-ink outline-none transition-colors focus:border-primary'

// Step 2: prefilled details for the chosen role; fields are uncontrolled because nothing is saved
export default function Details() {
  const { role } = useParams()
  const { t } = useI18n()
  const navigate = useNavigate()

  if (!ROLES.includes(role)) return <Navigate to="/onboarding" replace />

  function handleSubmit(event) {
    event.preventDefault()
    navigate(`/onboarding/${role}/verify`)
  }

  return (
    <OnboardingLayout step={2} backTo="/onboarding">
      <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">{t(`roles.${role}`)}</p>
      <h1 className="mt-1 font-display text-3xl font-semibold">{t('onboarding.details.title')}</h1>
      <p className="mt-2 text-ink-2">{t('onboarding.details.body')}</p>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
        {signupFields[role].map((field) => {
          const id = `signup-${role}-${field.id}`
          return (
            <label key={field.id} htmlFor={id} className="block text-sm font-medium">
              {t(`onboarding.details.fields.${field.label}`)}
              {field.type === 'select' ? (
                <select id={id} defaultValue={field.value} className={inputClass}>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {t(`onboarding.details.levels.${option}`)}
                    </option>
                  ))}
                </select>
              ) : (
                <input id={id} type={field.type ?? 'text'} required defaultValue={field.value} className={inputClass} />
              )}
            </label>
          )
        })}
        <button type="submit" className="mt-3 rounded-2xl bg-primary py-3.5 font-semibold text-primary-ink transition-transform hover:-translate-y-px">
          {t('onboarding.continue')}
        </button>
      </form>
    </OnboardingLayout>
  )
}

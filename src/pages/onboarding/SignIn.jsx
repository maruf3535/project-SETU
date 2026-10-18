import { Eye, EyeOff, LoaderCircle } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { demoAccounts } from '../../data/onboarding'
import { portals, ROLES } from '../../data/portals'
import { useI18n } from '../../i18n/I18nProvider'
import OnboardingLayout from './OnboardingLayout'

const inputClass =
  'mt-1.5 w-full rounded-xl border border-line bg-surface px-4 py-3 text-ink outline-none transition-colors focus:border-primary'

export default function SignIn() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const [role, setRole] = useState('student')
  const [email, setEmail] = useState(demoAccounts.student)
  const [password, setPassword] = useState('demo1234')
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)

  function pickRole(next) {
    setRole(next)
    setEmail(demoAccounts[next])
  }

  function handleSubmit(event) {
    event.preventDefault()
    setBusy(true)
    // Any details work in the demo; the short pause just makes the sign-in feel real
    setTimeout(() => navigate(`/${role}`), 700)
  }

  return (
    <OnboardingLayout backTo="/welcome">
      <h1 className="font-display text-3xl font-semibold">{t('onboarding.signin.title')}</h1>
      <p className="mt-2 text-ink-2">{t('onboarding.signin.body')}</p>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
        <fieldset>
          <legend className="text-sm font-medium">{t('onboarding.signin.role')}</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {ROLES.map((option) => {
              const Icon = portals[option].icon
              const selected = option === role
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => pickRole(option)}
                  style={{ '--role': portals[option].color }}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                    selected ? 'border-role bg-[color-mix(in_oklab,var(--role)_12%,transparent)] text-ink' : 'border-line bg-surface text-ink-2 hover:text-ink'
                  }`}
                >
                  <Icon className="size-4 text-role" />
                  {t(`roles.${option}`)}
                </button>
              )
            })}
          </div>
        </fieldset>

        <label className="block text-sm font-medium" htmlFor="signin-email">
          {t('onboarding.signin.email')}
          <input
            id="signin-email"
            type="text"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={inputClass}
          />
        </label>

        <div>
          <div className="flex items-center justify-between text-sm font-medium">
            <label htmlFor="signin-password">{t('onboarding.signin.password')}</label>
            <button type="button" className="text-primary hover:underline">
              {t('onboarding.signin.forgot')}
            </button>
          </div>
          <div className="relative">
            <input
              id="signin-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={`${inputClass} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={t('onboarding.signin.password')}
              className="absolute top-1/2 right-3 mt-0.75 grid size-8 -translate-y-1/2 place-items-center rounded-full text-ink-2 hover:text-ink"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={busy}
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 font-semibold text-primary-ink transition-opacity disabled:opacity-80"
        >
          {busy && <LoaderCircle className="size-4 animate-spin" />}
          {busy ? t('onboarding.signin.signingIn') : t('onboarding.signin.submit')}
        </button>
      </form>

      <Link to="/onboarding" className="mt-6 text-center text-sm font-semibold text-primary hover:underline">
        {t('onboarding.signin.create')}
      </Link>
    </OnboardingLayout>
  )
}

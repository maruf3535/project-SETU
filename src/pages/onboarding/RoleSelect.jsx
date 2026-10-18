import { Check } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { portals, ROLES } from '../../data/portals'
import { useI18n } from '../../i18n/I18nProvider'
import OnboardingLayout from './OnboardingLayout'

// Screen 02 · Choose your role
export default function RoleSelect() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const [role, setRole] = useState('student')

  return (
    <OnboardingLayout step={1} backTo="/welcome">
      <h1 className="font-display text-3xl font-semibold">{t('onboarding.role.title')}</h1>
      <p className="mt-2 text-ink-2">{t('onboarding.role.body')}</p>

      <div role="radiogroup" aria-label={t('onboarding.role.title')} className="mt-8 grid gap-2.5">
        {ROLES.map((option) => {
          const Icon = portals[option].icon
          const selected = option === role
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setRole(option)}
              style={{ '--role': portals[option].color }}
              className={`flex items-center gap-4 rounded-2xl border bg-surface p-4 text-left transition-colors ${
                selected ? 'border-primary ring-1 ring-primary' : 'border-line hover:border-ink-2'
              }`}
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[color-mix(in_oklab,var(--role)_15%,transparent)] text-role">
                <Icon className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">{t(`roles.${option}`)}</span>
                <span className="block text-sm text-ink-2">{t(`onboarding.role.options.${option}`)}</span>
              </span>
              <span
                className={`grid size-6 shrink-0 place-items-center rounded-full border ${
                  selected ? 'border-primary bg-primary text-primary-ink' : 'border-line'
                }`}
              >
                {selected && <Check className="size-3.5" strokeWidth={3} />}
              </span>
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={() => navigate(`/onboarding/${role}/details`)}
        className="mt-8 rounded-2xl bg-primary py-3.5 font-semibold text-primary-ink transition-transform hover:-translate-y-px"
      >
        {t('onboarding.continue')}
      </button>
    </OnboardingLayout>
  )
}

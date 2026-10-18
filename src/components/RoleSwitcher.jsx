import { ChevronDown, LogOut, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { portals, ROLES } from '../data/portals'
import { useI18n } from '../i18n/I18nProvider'
import { useDemo } from '../store/DemoStore'
import { useToast } from './Toast'
import { useDismiss } from './useDismiss'

// Demo-only control: jump between the five portals without signing in again
export default function RoleSwitcher({ current }) {
  const [open, setOpen] = useState(false)
  const dismissRef = useDismiss(open, () => setOpen(false))
  const { t } = useI18n()
  const { dispatch } = useDemo()
  const toast = useToast()
  const CurrentIcon = portals[current].icon

  return (
    <div ref={dismissRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t('shell.switchRole')}
        onClick={() => setOpen((value) => !value)}
        className="flex h-9 items-center gap-2 rounded-full border border-line bg-surface pr-2.5 pl-1 text-sm font-medium text-ink"
      >
        <span className="grid size-7 place-items-center rounded-full bg-[color-mix(in_oklab,var(--role)_16%,transparent)] text-role">
          <CurrentIcon className="size-4" />
        </span>
        <span className="hidden sm:inline">{t(`roles.${current}`)}</span>
        <ChevronDown className="size-4 text-ink-2" />
      </button>

      {open && (
        <>
          <div
            role="menu"
            className="absolute right-0 z-50 mt-2 w-60 rounded-2xl border border-line bg-surface p-1.5 shadow-[0_12px_32px_-12px_rgb(0_0_0/0.35)]"
          >
            <p className="px-3 pt-2 pb-1 text-[11px] font-semibold tracking-[0.12em] text-ink-2 uppercase">
              {t('shell.switchRole')}
            </p>
            {ROLES.map((role) => {
              const Icon = portals[role].icon
              return (
                <Link
                  key={role}
                  to={`/${role}`}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  style={{ '--role': portals[role].color }}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm ${
                    role === current ? 'bg-surface-2 font-semibold text-ink' : 'text-ink hover:bg-surface-2'
                  }`}
                >
                  <Icon className="size-4 text-role" />
                  {t(`roles.${role}`)}
                </Link>
              )
            })}
            <div className="my-1 border-t border-line" />
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                dispatch({ type: 'reset' })
                toast(t('common.resetDone'))
                setOpen(false)
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-ink-2 hover:bg-surface-2 hover:text-ink"
            >
              <RotateCcw className="size-4" />
              {t('common.resetDemo')}
            </button>
            <Link
              to="/"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-ink-2 hover:bg-surface-2 hover:text-ink"
            >
              <LogOut className="size-4" />
              {t('shell.exitDemo')}
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

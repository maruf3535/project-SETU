import { LogOut, PencilLine, UserRound } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/I18nProvider'
import { useProfile } from '../pages/profile/useProfile'
import Avatar from './Avatar'
import { useDismiss } from './useDismiss'

// Top-right avatar: view or edit the signed-in user's profile, or sign out
export default function ProfileMenu({ role }) {
  const { t } = useI18n()
  const profile = useProfile(role)
  const [open, setOpen] = useState(false)
  const dismissRef = useDismiss(open, () => setOpen(false))
  const close = () => setOpen(false)

  return (
    <div ref={dismissRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t('profile.menu', { name: profile.name })}
        onClick={() => setOpen((v) => !v)}
        className="grid size-9 place-items-center rounded-full ring-2 ring-transparent transition-shadow hover:ring-line"
      >
        <Avatar initials={profile.initials} photo={profile.photo} className="size-9 text-xs" />
      </button>

      {open && (
        <>
          <div role="menu" className="absolute right-0 z-50 mt-2 w-64 rounded-2xl border border-line bg-surface p-1.5 shadow-[0_12px_32px_-12px_rgb(0_0_0/0.35)]">
            <div className="flex items-center gap-3 px-3 py-2.5">
              <Avatar initials={profile.initials} photo={profile.photo} className="size-10 text-sm" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{profile.name}</p>
                <p className="truncate text-xs text-ink-2">{profile.email}</p>
              </div>
            </div>
            <div className="my-1 border-t border-line" />
            <Link to={`/${role}/profile`} role="menuitem" onClick={close} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-surface-2">
              <UserRound className="size-4 text-ink-2" /> {t('profile.view')}
            </Link>
            <Link to={`/${role}/profile`} state={{ edit: true }} role="menuitem" onClick={close} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-surface-2">
              <PencilLine className="size-4 text-ink-2" /> {t('profile.edit')}
            </Link>
            <div className="my-1 border-t border-line" />
            <Link to="/signin" role="menuitem" onClick={close} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-ink-2 hover:bg-surface-2 hover:text-ink">
              <LogOut className="size-4" /> {t('profile.signOut')}
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

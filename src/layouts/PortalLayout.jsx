import { BadgeCheck, Bell, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import Avatar from '../components/Avatar'
import LanguageToggle from '../components/LanguageToggle'
import RoleSwitcher from '../components/RoleSwitcher'
import SetuMark from '../components/SetuMark'
import ThemeToggle from '../components/ThemeToggle'
import { currentNavItem, portalPath, portals } from '../data/portals'
import { useI18n } from '../i18n/I18nProvider'

function Sidebar({ role, onNavigate }) {
  const { t } = useI18n()
  const portal = portals[role]

  return (
    <>
      <Link to="/" onClick={onNavigate} className="flex h-16 shrink-0 items-center gap-2.5 px-5">
        <SetuMark className="size-8" />
        <span className="font-display text-2xl font-semibold tracking-tight">{t('brand.name')}</span>
      </Link>

      <div className="mx-3 flex items-center gap-3 rounded-2xl bg-brand-ink/[0.07] p-3">
        <Avatar initials={portal.user.initials} />
        <div className="min-w-0">
          <p className="flex items-center gap-1 truncate text-sm font-semibold">
            <span className="truncate">{portal.user.name}</span>
            <BadgeCheck className="size-4 shrink-0 text-accent" aria-label={t('shell.verified')} />
          </p>
          <p className="truncate text-xs text-brand-ink/65">{t(`users.${role}`)}</p>
        </div>
      </div>

      <p className="mt-7 mb-2 px-5 text-[11px] font-semibold tracking-[0.14em] text-brand-ink/45 uppercase">
        {t(`portalTitles.${role}`)}
      </p>
      <nav className="flex flex-col gap-0.5 overflow-y-auto px-3 pb-4">
        {portal.nav.map((item) => (
          <NavLink
            key={item.key}
            to={portalPath(role, item)}
            end={!item.path}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? 'bg-brand-ink/[0.1] font-semibold text-brand-ink'
                  : 'text-brand-ink/70 hover:bg-brand-ink/[0.05] hover:text-brand-ink'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`size-[18px] shrink-0 ${isActive ? 'text-accent' : ''}`} />
                {t(`nav.${item.key}`)}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <p className="mt-auto px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-xs leading-relaxed text-brand-ink/50">
        {t('shell.demoData')}
      </p>
    </>
  )
}

export default function PortalLayout({ role }) {
  const { t } = useI18n()
  const { pathname } = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const portal = portals[role]
  const current = currentNavItem(role, pathname)
  const tabs = portal.nav.filter((item) => item.tab)

  return (
    <div style={{ '--role': portal.color }} className="min-h-dvh bg-canvas text-ink lg:grid lg:grid-cols-[16.5rem_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-dvh flex-col bg-brand text-brand-ink lg:flex">
        <Sidebar role={role} />
      </aside>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label={t('shell.closeMenu')}
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-black/45"
          />
          <aside className="relative flex h-full w-72 max-w-[85vw] flex-col bg-brand pt-[env(safe-area-inset-top)] pl-[env(safe-area-inset-left)] text-brand-ink">
            <button
              type="button"
              aria-label={t('shell.closeMenu')}
              onClick={() => setDrawerOpen(false)}
              className="absolute top-[calc(env(safe-area-inset-top)+0.75rem)] right-3 grid size-9 place-items-center rounded-full text-brand-ink/70 hover:bg-brand-ink/10"
            >
              <X className="size-5" />
            </button>
            <Sidebar role={role} onNavigate={() => setDrawerOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 border-b border-line bg-canvas/85 pt-[env(safe-area-inset-top)] backdrop-blur-md">
          <div className="flex h-16 items-center gap-2 pr-[max(1rem,env(safe-area-inset-right))] pl-[max(1rem,env(safe-area-inset-left))] sm:gap-3 sm:px-6 lg:px-10">
            <button
              type="button"
              aria-label={t('shell.openMenu')}
              onClick={() => setDrawerOpen(true)}
              className="-ml-1.5 grid size-9 place-items-center rounded-full text-ink hover:bg-surface-2 lg:hidden"
            >
              <Menu className="size-5" />
            </button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-semibold tracking-[0.14em] text-role uppercase">
                {t(`portalTitles.${role}`)}
              </p>
              <h1 className="truncate font-display text-xl leading-tight font-semibold">{t(`nav.${current.key}`)}</h1>
            </div>
            <LanguageToggle />
            <span className="hidden sm:block">
              <ThemeToggle />
            </span>
            <button
              type="button"
              aria-label={t('shell.notifications')}
              className="relative hidden size-9 place-items-center rounded-full border border-line bg-surface text-ink-2 hover:text-ink sm:grid"
            >
              <Bell className="size-4" />
              <span className="absolute top-2 right-2.5 size-1.5 rounded-full bg-accent" />
            </button>
            <RoleSwitcher current={role} />
          </div>
        </header>

        <main className="flex-1 pt-6 pr-[max(1rem,env(safe-area-inset-right))] pb-28 pl-[max(1rem,env(safe-area-inset-left))] sm:px-6 lg:px-10 lg:pb-12">
          <Outlet />
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] lg:hidden">
        <div className="mx-auto flex max-w-lg">
          {tabs.map((item) => (
            <NavLink
              key={item.key}
              to={portalPath(role, item)}
              end={!item.path}
              className={({ isActive }) =>
                `flex min-w-0 flex-1 flex-col items-center gap-1 pt-2.5 pb-2 text-[11px] font-medium ${
                  isActive ? 'text-primary' : 'text-ink-2'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`grid h-7 w-12 place-items-center rounded-full ${isActive ? 'bg-surface-2' : ''}`}>
                    <item.icon className="size-5" />
                  </span>
                  <span className="max-w-full truncate px-1">{t(`navShort.${item.key}`)}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}

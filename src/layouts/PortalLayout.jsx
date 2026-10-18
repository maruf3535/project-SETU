import { BadgeCheck, Menu, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import Avatar from '../components/Avatar'
import LanguageToggle from '../components/LanguageToggle'
import NotificationBell from '../components/NotificationBell'
import ProfileMenu from '../components/ProfileMenu'
import RoleSwitcher from '../components/RoleSwitcher'
import SetuMark from '../components/SetuMark'
import ThemeToggle from '../components/ThemeToggle'
import { currentNavItem, portalPath, portals } from '../data/portals'
import { useI18n } from '../i18n/I18nProvider'
import { useProfile } from '../pages/profile/useProfile'
import { sidebarExtras, sidebarUsers } from '../pages/registry'
import { useDemo } from '../store/DemoStore'

// A portal can show a different user (e.g. per level) by exporting getSidebarUser; otherwise its fixed user shows
// Saved profile edits (name, photo) win over the portal's demo identity
function usePortalUser(role) {
  const i18n = useI18n()
  const demo = useDemo()
  const profile = useProfile(role)
  const user = sidebarUsers[role]?.({ demo, i18n }) ?? { ...portals[role].user, detail: i18n.t(`users.${role}`) }
  return profile.edited ? { ...user, name: profile.name, initials: profile.initials, photo: profile.photo } : user
}

// `collapsed` shrinks the desktop sidebar to an icon rail; labels move into tooltips
function Sidebar({ role, onNavigate, collapsed = false }) {
  const { t } = useI18n()
  const portal = portals[role]
  const user = usePortalUser(role)
  const SidebarExtra = sidebarExtras[role]

  return (
    <>
      <Link to="/" onClick={onNavigate} title={collapsed ? t('brand.name') : undefined} className={`flex h-16 shrink-0 items-center gap-2.5 ${collapsed ? 'justify-center' : 'px-5'}`}>
        <SetuMark className="size-8" />
        {!collapsed && <span className="font-display text-2xl font-semibold tracking-tight">{t('brand.name')}</span>}
      </Link>

      {collapsed ? (
        <Link to={`/${role}/profile`} onClick={onNavigate} className="flex justify-center" title={`${user.name} · ${user.detail}`}>
          <Avatar initials={user.initials} photo={user.photo} />
        </Link>
      ) : (
        <>
          <Link to={`/${role}/profile`} onClick={onNavigate} className="mx-3 flex items-center gap-3 rounded-2xl bg-brand-ink/[0.07] p-3 transition-colors hover:bg-brand-ink/[0.11]">
            <Avatar initials={user.initials} photo={user.photo} />
            <div className="min-w-0">
              <p className="flex items-center gap-1 truncate text-sm font-semibold">
                <span className="truncate">{user.name}</span>
                <BadgeCheck className="size-4 shrink-0 text-accent" aria-label={t('shell.verified')} />
              </p>
              <p className="truncate text-xs text-brand-ink/65">{user.detail}</p>
            </div>
          </Link>
          {SidebarExtra && (
            <div className="mx-3 mt-2">
              <SidebarExtra />
            </div>
          )}
        </>
      )}

      {collapsed ? (
        <span className="mx-auto mt-6 mb-3 h-px w-8 bg-brand-ink/15" />
      ) : (
        <p className="mt-7 mb-2 px-5 text-[11px] font-semibold tracking-[0.14em] text-brand-ink/45 uppercase">{t(`portalTitles.${role}`)}</p>
      )}
      <nav className={`flex flex-col gap-0.5 overflow-y-auto pb-4 ${collapsed ? 'items-center px-2' : 'px-3'}`}>
        {portal.nav.map((item) => (
          <NavLink
            key={item.key}
            to={portalPath(role, item)}
            end={!item.path}
            onClick={onNavigate}
            title={collapsed ? t(`nav.${item.key}`) : undefined}
            aria-label={collapsed ? t(`nav.${item.key}`) : undefined}
            className={({ isActive }) =>
              `flex items-center rounded-xl text-sm transition-colors ${collapsed ? 'size-11 justify-center' : 'gap-3 px-3 py-2.5'} ${
                isActive
                  ? 'bg-brand-ink/[0.1] font-semibold text-brand-ink'
                  : 'text-brand-ink/70 hover:bg-brand-ink/[0.05] hover:text-brand-ink'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`size-[18px] shrink-0 ${isActive ? 'text-accent' : ''}`} />
                {!collapsed && t(`nav.${item.key}`)}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {!collapsed && (
        <p className="mt-auto px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-xs leading-relaxed text-brand-ink/50">
          {t('shell.demoData')}
        </p>
      )}
    </>
  )
}

const SIDEBAR_KEY = 'setu.sidebarCollapsed'

function readCollapsed() {
  try {
    return localStorage.getItem(SIDEBAR_KEY) === '1'
  } catch {
    return false
  }
}

export default function PortalLayout({ role }) {
  const { t } = useI18n()
  const { pathname } = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(readCollapsed)
  const portal = portals[role]
  const current = currentNavItem(role, pathname)
  const tabs = portal.nav.filter((item) => item.tab)

  function toggleSidebar() {
    setCollapsed((value) => {
      try {
        localStorage.setItem(SIDEBAR_KEY, value ? '0' : '1')
      } catch {
        // storage can be blocked; the toggle still works for this visit
      }
      return !value
    })
  }

  return (
    <div
      style={{ '--role': portal.color }}
      className={`min-h-dvh bg-canvas text-ink lg:grid ${collapsed ? 'lg:grid-cols-[4.75rem_minmax(0,1fr)]' : 'lg:grid-cols-[16.5rem_minmax(0,1fr)]'}`}
    >
      <aside className="sticky top-0 hidden h-dvh flex-col bg-brand text-brand-ink lg:flex">
        <Sidebar role={role} collapsed={collapsed} />
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
            <button
              type="button"
              aria-label={t(collapsed ? 'shell.expandSidebar' : 'shell.collapseSidebar')}
              title={t(collapsed ? 'shell.expandSidebar' : 'shell.collapseSidebar')}
              aria-pressed={!collapsed}
              onClick={toggleSidebar}
              className="-ml-2 hidden size-9 place-items-center rounded-full text-ink-2 hover:bg-surface-2 hover:text-ink lg:grid"
            >
              {collapsed ? <PanelLeftOpen className="size-5" /> : <PanelLeftClose className="size-5" />}
            </button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-semibold tracking-[0.14em] text-role uppercase">
                {t(`portalTitles.${role}`)}
              </p>
              <h1 className="truncate font-display text-xl leading-tight font-semibold">
                {pathname === `/${role}/profile` ? t('profile.title') : t(`nav.${current.key}`)}
              </h1>
            </div>
            <LanguageToggle />
            <span className="hidden sm:block">
              <ThemeToggle />
            </span>
            <NotificationBell role={role} />
            <RoleSwitcher current={role} />
            <ProfileMenu role={role} />
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

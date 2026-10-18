import { ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ROLES } from '../data/portals'
import { useI18n } from '../i18n/I18nProvider'

// Appears after the reader has scrolled a screen's worth; inside portals it clears the phone tab bar
export default function ScrollTopButton() {
  const { t } = useI18n()
  const { pathname } = useLocation()
  const [visible, setVisible] = useState(false)
  const inPortal = ROLES.some((role) => pathname === `/${role}` || pathname.startsWith(`/${role}/`))

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0 })}
      aria-label={t('shell.toTop')}
      title={t('shell.toTop')}
      className={`fixed right-[max(1rem,env(safe-area-inset-right))] z-40 grid size-12 place-items-center rounded-full bg-accent text-accent-ink shadow-[0_12px_28px_-10px_rgb(0_0_0/0.55)] transition-transform hover:-translate-y-0.5 ${
        inPortal ? 'bottom-[calc(5.5rem+env(safe-area-inset-bottom))] lg:bottom-8' : 'bottom-[max(1.5rem,env(safe-area-inset-bottom))]'
      }`}
    >
      <ArrowUp className="size-5" strokeWidth={2.5} />
    </button>
  )
}

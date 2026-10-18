import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

// Closes a dropdown when the user clicks or taps outside it, scrolls, presses Escape or navigates.
// Returns a ref for the dropdown's wrapper (trigger + menu).
export function useDismiss(open, close) {
  const ref = useRef(null)
  const { pathname } = useLocation()
  const closeRef = useRef(close)
  closeRef.current = close

  useEffect(() => {
    closeRef.current()
  }, [pathname])

  useEffect(() => {
    if (!open) return undefined
    const onPointer = (event) => {
      if (!ref.current?.contains(event.target)) closeRef.current()
    }
    // Scrolling inside the menu itself (e.g. a long notification list) keeps it open
    const onScroll = (event) => {
      if (!ref.current?.contains(event.target)) closeRef.current()
    }
    const onKey = (event) => event.key === 'Escape' && closeRef.current()
    document.addEventListener('pointerdown', onPointer)
    window.addEventListener('scroll', onScroll, { capture: true, passive: true })
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      window.removeEventListener('scroll', onScroll, { capture: true })
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return ref
}

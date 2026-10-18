import { CircleCheck } from 'lucide-react'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const ToastContext = createContext(() => {})

// A single short confirmation that names what just happened, e.g. "৳3,500 released to Anika"
export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)

  const show = useCallback((message) => setToast({ message, id: Date.now() }), [])

  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => setToast(null), 3800)
    return () => clearTimeout(timer)
  }, [toast])

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-[60] flex justify-center px-4 lg:bottom-8"
      >
        {toast && (
          <p
            key={toast.id}
            className="flex max-w-md items-center gap-2.5 rounded-2xl bg-brand px-4 py-3 text-sm font-medium text-brand-ink shadow-[0_16px_40px_-12px_rgb(0_0_0/0.5)]"
          >
            <CircleCheck className="size-5 shrink-0 text-accent" />
            {toast.message}
          </p>
        )}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}

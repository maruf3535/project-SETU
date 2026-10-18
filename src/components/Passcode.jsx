import { KeyRound, ShieldCheck, Sparkles, X } from 'lucide-react'
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useI18n } from '../i18n/I18nProvider'

const LENGTH = 6
const MAX_TRIES = 3

const PasscodeContext = createContext(async () => true)

// Demo only: a fresh random code each time, shown on screen instead of being sent by SMS
function newCode() {
  return String(Math.floor(Math.random() * 10 ** LENGTH)).padStart(LENGTH, '0')
}

function PasscodeDialog({ request, onDone }) {
  const { t, num } = useI18n()
  const [code, setCode] = useState(newCode)
  const [digits, setDigits] = useState('')
  const [tries, setTries] = useState(0)
  const [error, setError] = useState('')
  const [shake, setShake] = useState(0)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [code])

  useEffect(() => {
    const onKey = (event) => event.key === 'Escape' && onDone(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onDone])

  function check(value) {
    if (value === code) {
      onDone(true)
      return
    }
    const used = tries + 1
    setShake((n) => n + 1)
    setDigits('')
    if (used >= MAX_TRIES) {
      setCode(newCode())
      setTries(0)
      setError(t('passcode.newCode'))
    } else {
      setTries(used)
      setError(t('passcode.wrong', { n: num(MAX_TRIES - used) }))
    }
  }

  function onChange(event) {
    const value = event.target.value.replace(/\D/g, '').slice(0, LENGTH)
    setDigits(value)
    setError('')
    if (value.length === LENGTH) check(value)
  }

  const shown = `${code.slice(0, 3)} ${code.slice(3)}`

  return (
    <div className="fixed inset-0 z-[80] grid place-items-end p-0 sm:place-items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="passcode-title">
      <button type="button" aria-label={t('common.cancel')} onClick={() => onDone(false)} className="absolute inset-0 bg-black/55" />
      <div className="relative w-full rounded-t-3xl bg-surface p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl sm:max-w-sm sm:rounded-3xl">
        <div className="flex items-start justify-between gap-3">
          <span className="grid size-11 place-items-center rounded-2xl bg-brand text-accent">
            <KeyRound className="size-5" />
          </span>
          <button type="button" onClick={() => onDone(false)} aria-label={t('common.cancel')} className="-mr-2 grid size-9 place-items-center rounded-full text-ink-2 hover:bg-surface-2">
            <X className="size-5" />
          </button>
        </div>
        <h2 id="passcode-title" className="mt-4 font-display text-2xl font-semibold">
          {t('passcode.title')}
        </h2>
        <p className="mt-1 text-sm text-ink-2">{t('passcode.body')}</p>
        {request.action && <p className="mt-3 rounded-xl bg-surface-2 px-3 py-2.5 text-sm font-semibold">{request.action}</p>}

        {/* One real input drives six display boxes, so paste, autofill and phone keypads all work */}
        <label htmlFor="passcode-input" className="sr-only">
          {t('passcode.label')}
        </label>
        <div key={shake} className={`relative mt-5 grid grid-cols-6 gap-2 ${shake ? 'setu-shake' : ''}`} onClick={() => inputRef.current?.focus()}>
          {Array.from({ length: LENGTH }, (_, i) => {
            const filled = i < digits.length
            const active = i === digits.length
            return (
              <span
                key={i}
                aria-hidden="true"
                className={`grid aspect-[4/5] place-items-center rounded-xl border-2 font-display text-2xl font-semibold tabular-nums ${
                  error ? 'border-bad' : active ? 'border-primary' : filled ? 'border-ink-2' : 'border-line'
                }`}
              >
                {filled ? num(Number(digits[i])) : ''}
              </span>
            )
          })}
          <input
            ref={inputRef}
            id="passcode-input"
            value={digits}
            onChange={onChange}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={LENGTH}
            aria-invalid={Boolean(error)}
            aria-describedby="passcode-error"
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </div>
        <p id="passcode-error" role="alert" className="mt-2 min-h-5 text-sm font-medium text-bad">
          {error}
        </p>

        <div className="mt-2 rounded-2xl border border-dashed border-accent bg-accent-soft p-4">
          <p className="text-xs font-semibold tracking-[0.12em] text-warn uppercase">{t('passcode.demoLabel')}</p>
          <p className="mt-1 font-display text-3xl font-semibold tracking-[0.18em] tabular-nums">{shown}</p>
          <p className="mt-1.5 text-xs leading-relaxed text-ink-2">{t('passcode.demoNote')}</p>
          <button
            type="button"
            onClick={() => {
              setDigits(code)
              check(code)
            }}
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-accent-ink"
          >
            <Sparkles className="size-4" /> {t('passcode.fill')}
          </button>
        </div>

        <p className="mt-4 flex items-center gap-1.5 text-xs text-ink-2">
          <ShieldCheck className="size-4 shrink-0 text-primary" /> {t('passcode.footer')}
        </p>
      </div>
    </div>
  )
}

export function PasscodeProvider({ children }) {
  const [request, setRequest] = useState(null)

  const confirm = useCallback(
    (action) =>
      new Promise((resolve) => {
        setRequest({ action, resolve, id: Date.now() })
      }),
    [],
  )

  function done(ok) {
    request?.resolve(ok)
    setRequest(null)
  }

  return (
    <PasscodeContext.Provider value={confirm}>
      {children}
      {request && <PasscodeDialog key={request.id} request={request} onDone={done} />}
    </PasscodeContext.Provider>
  )
}

// const confirm = usePasscode(); if (!(await confirm('Pay ৳120 for Physics Complete Guide'))) return
export function usePasscode() {
  return useContext(PasscodeContext)
}

// Not dismissible on purpose: this notice stays until the project owner asks to remove it.
import { Construction } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'

const copy = {
  en: {
    label: 'Under Development',
    body: 'This is an early demo of Setu. Features and content are still being built.',
  },
  bn: {
    label: 'নির্মাণাধীন',
    body: 'এটি সেতুর একটি প্রাথমিক ডেমো। ফিচার ও কনটেন্ট এখনো তৈরি হচ্ছে।',
  },
}

export default function UnderDevelopmentBanner() {
  const { lang } = useI18n()
  const text = copy[lang] ?? copy.en

  return (
    <div
      role="status"
      lang={lang}
      className="flex w-full flex-wrap items-center justify-center gap-x-2 gap-y-0.5 bg-accent py-2 pt-[max(0.5rem,env(safe-area-inset-top))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] text-center text-sm text-accent-ink"
    >
      <span className="inline-flex items-center gap-1.5 font-bold">
        <Construction aria-hidden="true" className="size-4 shrink-0" />
        {text.label}
      </span>
      <span>{text.body}</span>
    </div>
  )
}

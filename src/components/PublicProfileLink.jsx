import { ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/I18nProvider'
import { slugify } from '../pages/public/publicProfiles'

// Small icon link from a student card to that student's public, government-verified page
export default function PublicProfileLink({ name }) {
  const { t } = useI18n()
  const label = t('publicProfile.openFor', { name })
  return (
    <Link
      to={`/u/${slugify(name)}`}
      target="_blank"
      rel="noreferrer"
      title={label}
      aria-label={label}
      className="grid size-6 shrink-0 place-items-center rounded-md text-ink-2 hover:bg-surface-2 hover:text-primary"
    >
      <ExternalLink className="size-3.5" />
    </Link>
  )
}

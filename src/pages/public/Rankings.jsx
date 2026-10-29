import { BadgeCheck, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'
import { gutter } from '../../components/gutter'
import LanguageToggle from '../../components/LanguageToggle'
import SetuMark from '../../components/SetuMark'
import ThemeToggle from '../../components/ThemeToggle'
import { useI18n } from '../../i18n/I18nProvider'
import { useDemo } from '../../store/DemoStore'
import { PublisherRankingTable, RankingExplainer, ReviewCard } from '../reviews/components'
import { visibleReviews } from '../reviews/reviewData'

// Open page: publishers ranked by verified reviewers, plus the latest reviews
export default function Rankings() {
  const { t } = useI18n()
  const demo = useDemo()
  const latest = [...visibleReviews(demo)].sort((a, b) => b.at.localeCompare(a.at)).slice(0, 4)

  return (
    <div className="min-h-dvh bg-canvas text-ink">
      <header className={`${gutter} border-b border-line bg-surface`}>
        <div className="mx-auto flex h-16 max-w-4xl items-center gap-3">
          <Link to="/" className="flex flex-1 items-center gap-2.5">
            <SetuMark className="size-8" />
            <span className="font-display text-xl font-semibold">{t('brand.name')}</span>
            <span className="hidden text-sm text-ink-2 sm:inline">· {t('reviews.ranking.title')}</span>
          </Link>
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      <main className={`${gutter} py-8`}>
        <div className="mx-auto grid max-w-4xl gap-5">
          <section className="rounded-3xl bg-brand p-6 text-brand-ink sm:p-8">
            <Trophy className="size-8 text-accent" />
            <h1 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">{t('reviews.ranking.title')}</h1>
            <p className="mt-2 max-w-2xl text-brand-ink/75">{t('reviews.ranking.body')}</p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-ink/10 px-3 py-1.5 text-sm font-semibold">
              <BadgeCheck className="size-4 text-accent" /> {t('reviews.ranking.live')}
            </p>
          </section>

          <section className="rounded-2xl border border-line bg-surface">
            <PublisherRankingTable />
          </section>

          <RankingExplainer />

          <h2 className="mt-4 font-display text-2xl font-semibold">{t('reviews.ranking.latest')}</h2>
          <div className="grid gap-4">
            {latest.map((review) => (
              <ReviewCard key={review.id} review={review} showBook />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

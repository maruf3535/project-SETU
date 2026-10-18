import {
  ArrowRight,
  Banknote,
  BookX,
  Bot,
  Briefcase,
  Clock,
  Coins,
  ExternalLink,
  Globe,
  IdCard,
  Mail,
  Map,
  Medal,
  Pencil,
  Phone,
  Scale,
  ShieldCheck,
  Store,
  TriangleAlert,
  UserX,
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Avatar from '../../components/Avatar'
import { gutter } from '../../components/gutter'
import LanguageToggle from '../../components/LanguageToggle'
import SetuMark from '../../components/SetuMark'
import ThemeToggle from '../../components/ThemeToggle'
import { portals, ROLES } from '../../data/portals'
import { team } from '../../data/team'
import { useI18n } from '../../i18n/I18nProvider'
import HeroBridge from './HeroBridge'
import HeroMockup from './HeroMockup'

const REPO_URL = 'https://github.com/maruf3535/project-SETU'
const problemIcons = [TriangleAlert, Pencil, Map, Medal, UserX, BookX]
const solutionIcons = [ShieldCheck, Bot, Globe, IdCard, Banknote, Store]
const impactIcons = [Scale, Clock, Briefcase, Coins]
const tierRoles = ['student', 'teacher', 'publisher', 'industry']

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView()
}

function Eyebrow({ children, className = 'text-primary' }) {
  return <p className={`text-xs font-semibold tracking-[0.16em] uppercase ${className}`}>{children}</p>
}

function SectionHeading({ eyebrow, title, body, inverted = false }) {
  return (
    <div className="max-w-2xl">
      {eyebrow && <Eyebrow className={inverted ? 'text-accent' : 'text-primary'}>{eyebrow}</Eyebrow>}
      <h2 className="mt-2 font-display text-3xl leading-tight font-semibold sm:text-4xl">{title}</h2>
      {body && <p className={`mt-3 text-base leading-relaxed ${inverted ? 'text-brand-ink/70' : 'text-ink-2'}`}>{body}</p>}
    </div>
  )
}

function Header() {
  const { t } = useI18n()
  const links = [
    ['how', 'how'],
    ['portals', 'portals'],
    ['impact', 'impact'],
    ['team', 'team'],
  ]

  return (
    <header className={`relative z-10 ${gutter} pt-[max(1.25rem,env(safe-area-inset-top))]`}>
      <div className="mx-auto flex max-w-6xl items-center gap-3">
        <Link to="/" className="flex flex-1 items-center gap-2.5">
          <SetuMark className="size-9" />
          <span className="font-display text-2xl font-semibold tracking-tight">{t('brand.name')}</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map(([id, key]) => (
            <button
              key={id}
              type="button"
              onClick={() => scrollToId(id)}
              className="rounded-full px-3 py-1.5 text-sm text-brand-ink/75 transition-colors hover:bg-brand-ink/10 hover:text-brand-ink"
            >
              {t(`landing.nav.${key}`)}
            </button>
          ))}
        </nav>
        <LanguageToggle />
        <span className="hidden sm:block">
          <ThemeToggle />
        </span>
        <Link
          to="/welcome"
          className="hidden rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-ink transition-transform hover:-translate-y-px sm:inline-block"
        >
          {t('landing.nav.demo')}
        </Link>
      </div>
    </header>
  )
}

function Hero() {
  const { t } = useI18n()

  return (
    <section className="relative overflow-hidden bg-brand text-brand-ink">
      <Header />
      <div className={`${gutter} pt-12 pb-10 sm:pt-16`}>
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="min-w-0">
            <Eyebrow className="text-accent">{t('landing.hero.eyebrow')}</Eyebrow>
            <h1 className="mt-4 font-display text-5xl leading-[1.02] font-semibold tracking-tight sm:text-7xl">
              {t('landing.hero.title')}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-ink/75">{t('landing.hero.body')}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/welcome"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-accent-ink transition-transform hover:-translate-y-px"
              >
                {t('landing.hero.primary')} <ArrowRight className="size-4" />
              </Link>
              <button
                type="button"
                onClick={() => scrollToId('how')}
                className="rounded-full border border-brand-ink/25 px-6 py-3 font-semibold text-brand-ink transition-colors hover:bg-brand-ink/10"
              >
                {t('landing.hero.secondary')}
              </button>
            </div>
          </div>
          <HeroMockup />
        </div>

        <div className="mx-auto mt-16 max-w-6xl">
          <figure className="mx-auto mb-6 max-w-xl text-center">
            <blockquote lang="bn" className="font-display text-2xl leading-snug text-brand-ink sm:text-3xl">
              “শুধু শিক্ষাকেই না, স্কিলকেও মূল্যায়ন করা।”
            </blockquote>
            <figcaption className="mt-2 text-sm text-brand-ink/60">{t('landing.hero.quoteNote')}</figcaption>
          </figure>
          <HeroBridge />
        </div>
      </div>
    </section>
  )
}

function Stats() {
  const { t, num } = useI18n()
  const items = t('landing.stats.items')
  const values = [num(906000), `${num(67)}/${num(81)}`, `${num(15.9)}%`, `${num(29)}%`]

  return (
    <section className={`${gutter} py-20`}>
      <div className="mx-auto max-w-6xl">
        <SectionHeading title={t('landing.stats.title')} body={t('landing.stats.body')} />
        <dl className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <div key={item.source} className="border-t-2 border-ink pt-4">
              <dt className="sr-only">{item.source}</dt>
              <dd className="font-display text-5xl font-semibold tracking-tight tabular-nums">{values[index]}</dd>
              <dd className="mt-3 text-sm leading-relaxed text-ink">
                {index === 2 ? t(`landing.stats.items.2.label`, { urban: `${num(28.7)}%` }) : item.label}
              </dd>
              <dd className="mt-2 text-xs font-medium tracking-wide text-ink-2 uppercase">{item.source}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

function Problems() {
  const { t } = useI18n()
  const rows = t('landing.problems.rows')

  return (
    <section id="how" className={`${gutter} bg-surface py-20`}>
      <div className="mx-auto max-w-6xl">
        <SectionHeading title={t('landing.problems.title')} />
        <div className="mt-10 hidden grid-cols-[minmax(0,1fr)_3rem_minmax(0,1fr)] gap-4 pb-3 text-xs font-semibold tracking-[0.14em] uppercase md:grid">
          <span className="text-bad">{t('landing.problems.problemLabel')}</span>
          <span />
          <span className="text-primary">{t('landing.problems.solutionLabel')}</span>
        </div>
        <ul className="divide-y divide-line border-y border-line max-md:mt-10">
          {rows.map((row, index) => {
            const ProblemIcon = problemIcons[index]
            const SolutionIcon = solutionIcons[index]
            return (
              <li key={row.problem} className="grid items-center gap-4 py-5 md:grid-cols-[minmax(0,1fr)_3rem_minmax(0,1fr)]">
                <div className="flex items-center gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-bad-soft text-bad">
                    <ProblemIcon className="size-5" />
                  </span>
                  <p className="text-ink-2">{row.problem}</p>
                </div>
                <ArrowRight className="size-5 text-accent max-md:ml-3.5 max-md:rotate-90" />
                <div className="flex items-center gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand text-brand-ink">
                    <SolutionIcon className="size-5" />
                  </span>
                  <p className="font-semibold">{row.solution}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

function Portals() {
  const { t } = useI18n()

  return (
    <section id="portals" className={`${gutter} py-20`}>
      <div className="mx-auto max-w-6xl">
        <SectionHeading title={t('landing.portals.title')} body={t('landing.portals.body')} />
        <ul className="mt-10 grid gap-3">
          {ROLES.map((role) => {
            const portal = portals[role]
            const item = t(`landing.portals.items.${role}`)
            return (
              <li
                key={role}
                style={{ '--role': portal.color }}
                className="grid gap-5 rounded-2xl border border-line bg-surface p-5 sm:p-6 lg:grid-cols-[16rem_minmax(0,1fr)_auto] lg:items-center"
              >
                <div className="flex items-center gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[color-mix(in_oklab,var(--role)_15%,transparent)] text-role">
                    <portal.icon className="size-6" />
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-semibold">{t(`roles.${role}`)}</h3>
                    <p className="text-sm text-ink-2">{item.who}</p>
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="leading-relaxed text-ink-2">{item.desc}</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {item.features.map((feature) => (
                      <li key={feature} className="rounded-full bg-surface-2 px-3 py-1 text-xs font-semibold text-ink">
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  to={`/${role}`}
                  className="inline-flex items-center gap-1.5 justify-self-start rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-role hover:text-role"
                >
                  {t('landing.portals.open')} <ArrowRight className="size-4" />
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

function Challenge() {
  const { t, num } = useI18n()
  const steps = t('landing.challenge.steps')

  return (
    <section className={`${gutter} bg-brand py-20 text-brand-ink`}>
      <div className="mx-auto max-w-6xl">
        <SectionHeading inverted eyebrow={t('landing.challenge.eyebrow')} title={t('landing.challenge.title')} body={t('landing.challenge.body')} />
        <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-ink">
          <Coins className="size-4" /> {t('landing.challenge.note')}
        </p>
        <ol className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
          {steps.map((step, index) => {
            const isPayment = index === 5
            return (
              <li
                key={step.title}
                className={`rounded-2xl p-4 ${isPayment ? 'bg-accent text-accent-ink' : 'bg-brand-ink/[0.07]'}`}
              >
                <span
                  className={`grid size-7 place-items-center rounded-full text-xs font-bold tabular-nums ${
                    isPayment ? 'bg-accent-ink text-accent' : 'bg-brand-ink/15 text-brand-ink'
                  }`}
                >
                  {num(index + 1)}
                </span>
                <h3 className="mt-3 font-semibold">{step.title}</h3>
                <p className={`mt-1 text-sm leading-relaxed ${isPayment ? 'text-accent-ink/80' : 'text-brand-ink/65'}`}>{step.body}</p>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

function Verification() {
  const { t, num } = useI18n()
  const tiers = t('landing.verify.tiers')
  const steps = t('landing.verify.steps')

  return (
    <section className={`${gutter} py-20`}>
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow={t('landing.verify.eyebrow')} title={t('landing.verify.title')} body={t('landing.verify.body')} />
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((tier, index) => {
            const role = tierRoles[index]
            const Icon = portals[role].icon
            return (
              <li key={tier.title} style={{ '--role': portals[role].color }} className="rounded-2xl border border-line bg-surface p-5">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-[color-mix(in_oklab,var(--role)_15%,transparent)] text-role">
                    <Icon className="size-5" />
                  </span>
                  <span className="text-xs font-semibold tracking-wide text-role uppercase">{t('landing.verify.tier', { n: num(index + 1) })}</span>
                </div>
                <h3 className="mt-4 font-semibold">{tier.title}</h3>
                <p className="mt-1 text-sm text-ink-2">{tier.body}</p>
              </li>
            )
          })}
        </ul>
        <div className="mt-3 grid gap-5 rounded-2xl bg-brand p-6 text-brand-ink lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
          <div className="flex items-center gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-accent text-accent-ink">
              <ShieldCheck className="size-6" />
            </span>
            <div>
              <h3 className="font-display text-xl font-semibold">{t('landing.verify.team')}</h3>
              <p className="text-sm text-brand-ink/65">{t('landing.verify.teamBody')}</p>
            </div>
          </div>
          <ol className="grid gap-2 sm:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step} className="flex items-center gap-2.5 rounded-xl bg-brand-ink/[0.08] px-3 py-2.5 text-sm font-medium">
                <span className="text-xs font-bold text-accent tabular-nums">{num(index + 1).padStart(2, num(0))}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

function Impact() {
  const { t } = useI18n()
  const items = t('landing.impact.items')

  return (
    <section id="impact" className={`${gutter} bg-surface py-20`}>
      <div className="mx-auto max-w-6xl">
        <SectionHeading title={t('landing.impact.title')} />
        <ul className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {items.map((item, index) => {
            const Icon = impactIcons[index]
            return (
              <li key={item.title} className="flex gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-warn">
                  <Icon className="size-5" />
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold">{item.title}</h3>
                  <p className="mt-1 leading-relaxed text-ink-2">{item.body}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

// Shows public/team/<photo> when the file exists, otherwise the member's initials
function MemberPhoto({ member }) {
  const [failed, setFailed] = useState(false)
  if (failed || !member.photo) return <Avatar initials={member.initials} className="size-28 text-3xl" />
  return (
    <img
      src={`${import.meta.env.BASE_URL}team/${member.photo}`}
      alt={member.name}
      onError={() => setFailed(true)}
      className="size-28 rounded-full object-cover ring-4 ring-accent/30"
    />
  )
}

function Team() {
  const { t } = useI18n()

  return (
    <section id="team" className={`${gutter} py-20`}>
      <div className="mx-auto max-w-6xl">
        <SectionHeading title={t('landing.team.title')} body={t('landing.team.body')} />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <li key={member.name} className="flex flex-col items-center rounded-3xl border border-line bg-surface px-5 pt-7 pb-6 text-center">
              <MemberPhoto member={member} />
              <p className="mt-4 font-display text-xl leading-tight font-semibold">{member.name}</p>
              <p className="mt-1 text-sm text-ink-2">{t(`landing.team.${member.level}`)}</p>
              <p className="mt-0.5 text-xs font-semibold tracking-[0.14em] text-primary uppercase">BUET</p>
              <div className="mt-4 grid w-full gap-1.5 border-t border-line pt-4 text-sm">
                <a href={`mailto:${member.email}`} className="inline-flex min-w-0 items-center justify-center gap-2 text-ink hover:text-primary">
                  <Mail className="size-4 shrink-0 text-ink-2" />
                  <span className="truncate select-all">{member.email}</span>
                </a>
                {member.mobile && (
                  <a href={`tel:${member.mobile.replace(/[^\d+]/g, '')}`} className="inline-flex items-center justify-center gap-2 text-ink hover:text-primary">
                    <Phone className="size-4 shrink-0 text-ink-2" />
                    <span className="select-all tabular-nums">{member.mobile}</span>
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Closing() {
  const { t } = useI18n()

  return (
    <>
      <section className={`${gutter} pb-20`}>
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 rounded-3xl bg-brand p-8 text-brand-ink sm:p-12 lg:flex-row lg:items-center">
          <div className="flex-1">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">{t('landing.cta.title')}</h2>
            <p className="mt-2 max-w-xl text-brand-ink/70">{t('landing.cta.body')}</p>
          </div>
          <Link
            to="/welcome"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-accent-ink transition-transform hover:-translate-y-px"
          >
            {t('landing.cta.button')} <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
      <footer className={`${gutter} border-t border-line pt-8 pb-[max(2rem,env(safe-area-inset-bottom))]`}>
        <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm text-ink-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5">
            <SetuMark className="size-7" />
            <span className="font-display text-lg font-semibold text-ink">{t('brand.name')}</span>
          </div>
          <p className="flex-1 sm:px-6">{t('landing.footer.demo')}</p>
          <a href={REPO_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline">
            {t('landing.footer.code')} <ExternalLink className="size-4" />
          </a>
        </div>
      </footer>
    </>
  )
}

export default function Landing() {
  return (
    <div className="min-h-dvh bg-canvas text-ink">
      <Hero />
      <Stats />
      <Problems />
      <Portals />
      <Challenge />
      <Verification />
      <Impact />
      <Team />
      <Closing />
    </div>
  )
}

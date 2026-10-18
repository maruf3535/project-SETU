import { Award, BadgeCheck, BookOpen, Copy, FlaskConical, FolderGit2, Lock, Mail, MapPin, Phone, ShieldCheck, Star, Target } from 'lucide-react'
import QRCode from 'qrcode'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Avatar from '../../components/Avatar'
import { gutter } from '../../components/gutter'
import LanguageToggle from '../../components/LanguageToggle'
import SetuMark from '../../components/SetuMark'
import ThemeToggle from '../../components/ThemeToggle'
import { useToast } from '../../components/Toast'
import { buttonStyles, SkillChip, StatusPill } from '../../components/ui'
import { useI18n } from '../../i18n/I18nProvider'
import { useDemo } from '../../store/DemoStore'
import { publicDirectory, publicUrlFor } from './publicProfiles'

const evidenceIcons = { project: FolderGit2, award: Award, challenge: Target, research: FlaskConical }

function QrCode({ url }) {
  const { t } = useI18n()
  const [svg, setSvg] = useState('')
  useEffect(() => {
    let live = true
    QRCode.toString(url, { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: '#16363d', light: '#ffffff' } }).then((s) => live && setSvg(s))
    return () => {
      live = false
    }
  }, [url])
  // The QR code stays dark-on-white in both themes so phone cameras can read it
  return (
    <figure className="grid justify-items-center gap-2">
      <div className="size-36 rounded-xl bg-white p-2.5" role="img" aria-label={t('publicProfile.qrLabel')} dangerouslySetInnerHTML={{ __html: svg }} />
      <figcaption className="text-center text-xs text-ink-2">{t('publicProfile.qrNote')}</figcaption>
    </figure>
  )
}

function Section({ title, children }) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-5">
      <h2 className="text-xs font-semibold tracking-[0.12em] text-ink-2 uppercase">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function StudentDetails({ record }) {
  const { t, L, num, money } = useI18n()
  const s = record.student
  const verified = s.skills.filter((x) => x.verified)
  const self = s.skills.filter((x) => !x.verified)
  return (
    <>
      <dl className="grid grid-cols-3 gap-3">
        {[
          record.privacy.rating && [t('publicProfile.rating'), `★ ${num(s.rating)}`],
          [t('publicProfile.paidWork'), num(s.completed)],
          record.privacy.earnings && [t('publicProfile.earned'), money(s.earned)],
        ]
          .filter(Boolean)
          .map(([label, value]) => (
            <div key={label} className="flex flex-col-reverse rounded-2xl border border-line bg-surface p-4">
              <dt className="text-xs text-ink-2">{label}</dt>
              <dd className="font-display text-2xl font-semibold tabular-nums">{value}</dd>
            </div>
          ))}
      </dl>
      <Section title={t('publicProfile.verifiedSkills')}>
        <div className="flex flex-wrap gap-2">
          {verified.map((x) => (
            <SkillChip key={x.name} name={x.name} level={x.level} verified />
          ))}
        </div>
        {self.length > 0 && (
          <>
            <p className="mt-4 text-xs text-ink-2">{t('publicProfile.selfReported')}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {self.map((x) => (
                <SkillChip key={x.name} name={x.name} level={x.level} />
              ))}
            </div>
          </>
        )}
      </Section>
      <Section title={t('publicProfile.evidence')}>
        <ul className="grid gap-3">
          {s.evidence.map((item, i) => {
            const Icon = evidenceIcons[item.kind]
            return (
              <li key={`${L(item.title)}-${i}`} className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-surface-2 text-primary">
                  <Icon className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold">{L(item.title)}</span>
                  <span className="block text-sm text-ink-2">{L(item.by)}</span>
                </span>
              </li>
            )
          })}
        </ul>
      </Section>
    </>
  )
}

function TeacherDetails({ record }) {
  const { t, L, num, money } = useI18n()
  const { persona, topics, mentored, projects } = record.teacher
  return (
    <>
      <Section title={t('publicProfile.teaches')}>
        <div className="flex flex-wrap gap-2">
          {persona.subjects.map((x) => (
            <span key={x.id} className="rounded-full bg-surface-2 px-3 py-1 text-sm font-semibold">
              {L(x.label)}
            </span>
          ))}
        </div>
      </Section>
      {topics.length > 0 && (
        <Section title={t('publicProfile.research')}>
          <ul className="grid gap-3">
            {topics.map((topic) => (
              <li key={topic.id}>
                <p className="font-semibold">{L(topic.title)}</p>
                <p className="text-sm text-ink-2">
                  {topic.skills.join(' · ')} · {t('publicProfile.stipend', { amount: money(topic.stipend) })}
                </p>
              </li>
            ))}
          </ul>
        </Section>
      )}
      {(mentored.length > 0 || projects.length > 0) && (
        <Section title={t('publicProfile.mentoring')}>
          <ul className="grid gap-3">
            {mentored.map((c) => (
              <li key={c.id} className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold">{L(c.title)}</span>
                <StatusPill status={c.status} />
              </li>
            ))}
            {projects.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold">{L(p.title)}</span>
                <span className="text-sm text-ink-2 tabular-nums">{t('publicProfile.teamProject', { n: num(p.members.length), amount: money(p.budget) })}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  )
}

function PublisherDetails({ record }) {
  const { t, L, money } = useI18n()
  return (
    <Section title={t('publicProfile.liveBooks')}>
      <ul className="grid gap-3 sm:grid-cols-2">
        {record.publisher.books.map((b) => (
          <li key={b.id} className="flex items-center gap-3 rounded-xl bg-surface-2/60 p-3">
            <BookOpen className="size-5 shrink-0 text-primary" />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-semibold">{L(b.title)}</span>
              <span className="block text-xs text-ink-2">{L(b.cls)}</span>
            </span>
            <span className="text-sm font-semibold tabular-nums">{money(b.price)}</span>
          </li>
        ))}
      </ul>
    </Section>
  )
}

function IndustryDetails({ record }) {
  const { t, L, num, money } = useI18n()
  const { posted, paid, solvers } = record.industry
  return (
    <>
      <dl className="grid grid-cols-3 gap-3">
        {[
          [t('publicProfile.challengesPosted'), num(posted.length)],
          [t('publicProfile.paidStudents'), money(paid)],
          [t('publicProfile.studentsHired'), num(solvers)],
        ].map(([label, value]) => (
          <div key={label} className="flex flex-col-reverse rounded-2xl border border-line bg-surface p-4">
            <dt className="text-xs text-ink-2">{label}</dt>
            <dd className="font-display text-2xl font-semibold tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
      <Section title={t('publicProfile.challenges')}>
        <ul className="grid gap-3">
          {posted.map((c) => (
            <li key={c.id} className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-semibold">{L(c.title)}</span>
              <StatusPill status={c.status} />
            </li>
          ))}
        </ul>
      </Section>
    </>
  )
}

function GovernmentDetails({ record }) {
  const { t, num } = useI18n()
  return (
    <Section title={t('publicProfile.team')}>
      <dl className="grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-xs text-ink-2">{t('publicProfile.lead')}</dt>
          <dd className="font-semibold">{record.government.lead}</dd>
        </div>
        <div>
          <dt className="text-xs text-ink-2">{t('publicProfile.itemsReviewed')}</dt>
          <dd className="font-semibold tabular-nums">{num(record.government.reviewed)}</dd>
        </div>
      </dl>
    </Section>
  )
}

export default function PublicProfile() {
  const { slug } = useParams()
  const { t, L, date } = useI18n()
  const demo = useDemo()
  const toast = useToast()
  const record = publicDirectory(demo).find((r) => r.slug === slug)

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(publicUrlFor(record))
    } catch {
      // clipboard can be blocked; the toast still confirms what the link is for
    }
    toast(t('publicProfile.copied'))
  }

  return (
    <div className="min-h-dvh bg-canvas text-ink">
      <header className={`${gutter} border-b border-line bg-surface`}>
        <div className="mx-auto flex h-16 max-w-4xl items-center gap-3">
          <Link to="/" className="flex flex-1 items-center gap-2.5">
            <SetuMark className="size-8" />
            <span className="font-display text-xl font-semibold">{t('brand.name')}</span>
            <span className="hidden text-sm text-ink-2 sm:inline">· {t('publicProfile.registry')}</span>
          </Link>
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      <main className={`${gutter} py-8`}>
        <div className="mx-auto grid max-w-4xl gap-5">
          {!record || !record.privacy.public ? (
            <div className="rounded-3xl border border-line bg-surface px-6 py-14 text-center">
              <Lock className="mx-auto size-8 text-ink-2" />
              <h1 className="mt-4 font-display text-2xl font-semibold">{record ? t('publicProfile.private') : t('publicProfile.notFound')}</h1>
              <p className="mt-2 text-ink-2">{record ? t('publicProfile.privateBody') : t('publicProfile.notFoundBody')}</p>
              <Link to="/" className={`${buttonStyles.primary} mt-6`}>
                {t('publicProfile.home')}
              </Link>
            </div>
          ) : (
            <>
              <section className="grid gap-6 rounded-3xl bg-brand p-6 text-brand-ink sm:grid-cols-[minmax(0,1fr)_auto] sm:p-8">
                <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
                  <Avatar initials={record.initials} photo={record.photo} className="size-24 text-3xl ring-4 ring-brand-ink/15" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold tracking-[0.14em] text-accent uppercase">{t(`roles.${record.role}`)}</p>
                    <h1 className="mt-1 flex flex-wrap items-center gap-2 font-display text-3xl font-semibold sm:text-4xl">
                      {record.name} <BadgeCheck className="size-7 text-accent" aria-label={t('shell.verified')} />
                    </h1>
                    <p className="mt-1 text-brand-ink/75">
                      {L(record.headline)}
                      {record.org && ` · ${record.org}`}
                    </p>
                    {record.division && (
                      <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-brand-ink/70">
                        <MapPin className="size-4" /> {record.district ? `${record.district}, ` : ''}
                        {t(`common.divisions.${record.division}`)}
                      </p>
                    )}
                  </div>
                </div>
                <QrCode url={publicUrlFor(record)} />
              </section>

              {/* The verification seal: who checked this person or organisation, and when */}
              <section className="flex flex-col gap-4 rounded-2xl border-2 border-ok bg-ok-soft p-5 sm:flex-row sm:items-center">
                <span className="grid size-14 shrink-0 place-items-center rounded-full bg-ok text-surface">
                  <ShieldCheck className="size-7" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-ok">{t('publicProfile.sealTitle')}</p>
                  <p className="mt-0.5 text-sm text-ink">{t('publicProfile.sealBody', { by: L(record.verifiedBy), date: date(record.verifiedAt) })}</p>
                  <p className="mt-1 text-xs text-ink-2">
                    {t('publicProfile.setuId')}: <span className="font-mono font-semibold text-ink">{record.setuId}</span> · {t('publicProfile.status')}:{' '}
                    <span className="font-semibold text-ok">{t('publicProfile.active')}</span> · {t('publicProfile.checked', { date: date('2026-10-18') })}
                  </p>
                </div>
                <button type="button" onClick={copyLink} className={`${buttonStyles.ghost} shrink-0`}>
                  <Copy className="size-4" /> {t('publicProfile.copy')}
                </button>
              </section>

              {L(record.bio) && (
                <Section title={t('publicProfile.about')}>
                  <p className="leading-relaxed">{L(record.bio)}</p>
                </Section>
              )}

              {record.role === 'student' && <StudentDetails record={record} />}
              {record.role === 'teacher' && <TeacherDetails record={record} />}
              {record.role === 'publisher' && <PublisherDetails record={record} />}
              {record.role === 'industry' && <IndustryDetails record={record} />}
              {record.role === 'government' && <GovernmentDetails record={record} />}

              {record.privacy.contact && (record.email || record.phone) && (
                <Section title={t('publicProfile.contact')}>
                  <ul className="grid gap-2 text-sm">
                    {record.email && (
                      <li className="flex items-center gap-2.5">
                        <Mail className="size-4 text-primary" /> <span className="select-all">{record.email}</span>
                      </li>
                    )}
                    {record.phone && (
                      <li className="flex items-center gap-2.5">
                        <Phone className="size-4 text-primary" /> <span className="select-all">{record.phone}</span>
                      </li>
                    )}
                  </ul>
                </Section>
              )}

              <p className="flex items-start gap-2 text-xs text-ink-2">
                <Star className="mt-0.5 size-3.5 shrink-0" /> {t('publicProfile.footer')}
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

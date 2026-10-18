import { ChartColumn, ShieldCheck, Table2 } from 'lucide-react'
import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { PageIntro, Stat } from '../../components/ui'
import { insightTiles, participation, turnaround, weakTopics } from '../../data/demo/government'
import { useI18n } from '../../i18n/I18nProvider'
import { useDemo } from '../../store/DemoStore'

// Chart colours come from theme tokens, so light and dark both work
const C = { primary: 'var(--primary)', accent: 'var(--accent)', grid: 'var(--line)', axis: 'var(--ink-2)', ink: 'var(--ink)', surface: 'var(--surface)' }
const AXIS_TICK = { fill: C.axis, fontSize: 12 }
const WEAK_BELOW = 50

function ChartTooltip({ active, payload, label, render }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink shadow-lg">
      {render(payload, label)}
    </div>
  )
}

function Swatch({ color, line }) {
  return <span className={`inline-block shrink-0 ${line ? 'h-0.5 w-3.5 rounded-full' : 'size-2.5 rounded-sm'}`} style={{ background: color }} aria-hidden="true" />
}

function Legend({ items }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 px-5 text-xs text-ink-2">
      {items.map(({ color, label }) => (
        <li key={label} className="inline-flex items-center gap-1.5">
          <Swatch color={color} /> {label}
        </li>
      ))}
    </ul>
  )
}

function DataTable({ columns, rows }) {
  return (
    <div className="overflow-x-auto px-5 pb-5">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-line text-left text-ink-2">
            {columns.map((col, i) => (
              <th key={col} scope="col" className={`py-2 font-semibold ${i ? 'text-right' : ''}`}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]} className="border-b border-line last:border-0">
              {row.map((cell, i) => (
                <td key={i} className={`py-2 ${i ? 'text-right tabular-nums' : ''}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// One chart with its title, data source tag and a chart/table switch
function ChartCard({ id, title, note, live, legend, table, children }) {
  const { t } = useI18n()
  const [view, setView] = useState('chart')
  return (
    <section className="min-w-0 rounded-2xl border border-line bg-surface" aria-labelledby={`${id}-title`}>
      <header className="flex flex-wrap items-start justify-between gap-3 px-5 pt-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 id={`${id}-title`} className="font-semibold">
              {title}
            </h2>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                live ? 'bg-[color-mix(in_oklab,var(--primary)_14%,transparent)] text-primary' : 'bg-surface-2 text-ink-2'
              }`}
            >
              {live ? t('government.insights.live') : t('government.insights.sample')}
            </span>
          </div>
          <p className="mt-0.5 text-sm text-ink-2">{note}</p>
        </div>
        <div className="flex rounded-lg border border-line p-0.5" role="group" aria-label={t('government.insights.viewLabel')}>
          {[
            ['chart', ChartColumn],
            ['table', Table2],
          ].map(([key, Icon]) => (
            <button
              key={key}
              type="button"
              aria-pressed={view === key}
              onClick={() => setView(key)}
              className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold ${view === key ? 'bg-surface-2 text-ink' : 'text-ink-2'}`}
            >
              <Icon className="size-3.5" /> {t(`government.insights.views.${key}`)}
            </button>
          ))}
        </div>
      </header>
      <div className="pt-3">
        {view === 'chart' ? (
          <>
            {legend && <Legend items={legend} />}
            <div className="px-2 pt-2 pb-4">{children}</div>
          </>
        ) : (
          table
        )}
      </div>
    </section>
  )
}

// Two-line axis label: division in ink, topic below in muted ink
function DivisionTick({ x, y, payload, rows }) {
  const row = rows[payload.index]
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={-8} y={-3} textAnchor="end" fill={C.ink} fontSize={12} fontWeight={600}>
        {row.division}
      </text>
      <text x={-8} y={12} textAnchor="end" fill={C.axis} fontSize={11}>
        {row.topic}
      </text>
    </g>
  )
}

function WeakTopics() {
  const { t, L, num } = useI18n()
  const rows = [...weakTopics]
    .sort((a, b) => a.score - b.score)
    .map((r) => ({ division: t(`common.divisions.${r.division}`), topic: L(r.topic), score: r.score }))
  const pct = (v) => `${num(v)}%`

  return (
    <ChartCard
      id="weak-topics"
      title={t('government.insights.weakTitle')}
      note={t('government.insights.weakNote')}
      legend={[
        { color: C.accent, label: t('government.insights.weakBelow', { n: num(WEAK_BELOW) }) },
        { color: C.primary, label: t('government.insights.weakAbove', { n: num(WEAK_BELOW) }) },
      ]}
      table={<DataTable columns={[t('government.insights.colDivision'), t('government.insights.colTopic'), t('government.insights.colScore')]} rows={rows.map((r) => [r.division, r.topic, pct(r.score)])} />}
    >
      <ResponsiveContainer width="100%" height={rows.length * 44 + 30}>
        <BarChart data={rows} layout="vertical" margin={{ top: 4, right: 40, bottom: 0, left: 0 }}>
          <CartesianGrid horizontal={false} stroke={C.grid} />
          <XAxis type="number" domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickFormatter={pct} tick={AXIS_TICK} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="division" width={112} tick={<DivisionTick rows={rows} />} axisLine={{ stroke: C.grid }} tickLine={false} interval={0} />
          <Tooltip
            cursor={{ fill: 'var(--surface-2)' }}
            content={
              <ChartTooltip
                render={(payload) => (
                  <>
                    <p className="font-semibold tabular-nums">{pct(payload[0].value)}</p>
                    <p className="text-ink-2">
                      {payload[0].payload.division} · {payload[0].payload.topic}
                    </p>
                  </>
                )}
              />
            }
          />
          <Bar dataKey="score" barSize={18} radius={[0, 4, 4, 0]} isAnimationActive={false}>
            {rows.map((r) => (
              <Cell key={r.division} fill={r.score < WEAK_BELOW ? C.accent : C.primary} />
            ))}
            <LabelList dataKey="score" position="right" formatter={pct} fill={C.ink} fontSize={12} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

function SkillsDemand() {
  const { t, num } = useI18n()
  const { challenges } = useDemo()
  const counts = challenges.flatMap((c) => c.skills).reduce((acc, skill) => ({ ...acc, [skill]: (acc[skill] ?? 0) + 1 }), {})
  const rows = Object.entries(counts)
    .map(([skill, n]) => ({ skill, n }))
    .sort((a, b) => b.n - a.n || a.skill.localeCompare(b.skill))
    .slice(0, 8)

  return (
    <ChartCard
      id="skills"
      live
      title={t('government.insights.skillsTitle')}
      note={t('government.insights.skillsNote', { n: num(challenges.length) })}
      table={<DataTable columns={[t('government.insights.colSkill'), t('government.insights.colChallenges')]} rows={rows.map((r) => [r.skill, num(r.n)])} />}
    >
      <ResponsiveContainer width="100%" height={rows.length * 36 + 30}>
        <BarChart data={rows} layout="vertical" margin={{ top: 4, right: 32, bottom: 0, left: 0 }}>
          <CartesianGrid horizontal={false} stroke={C.grid} />
          <XAxis type="number" allowDecimals={false} tickFormatter={num} tick={AXIS_TICK} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="skill" width={118} tick={AXIS_TICK} axisLine={{ stroke: C.grid }} tickLine={false} interval={0} />
          <Tooltip
            cursor={{ fill: 'var(--surface-2)' }}
            content={
              <ChartTooltip
                render={(payload) => (
                  <>
                    <p className="font-semibold tabular-nums">{t('government.insights.inChallenges', { n: num(payload[0].value) })}</p>
                    <p className="text-ink-2">{payload[0].payload.skill}</p>
                  </>
                )}
              />
            }
          />
          <Bar dataKey="n" fill={C.primary} barSize={16} radius={[0, 4, 4, 0]} isAnimationActive={false}>
            <LabelList dataKey="n" position="right" formatter={num} fill={C.ink} fontSize={12} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

function Participation() {
  const { t, num } = useI18n()
  const rows = participation.map((r) => ({ ...r, name: t(`common.divisions.${r.division}`) }))
  const pct = (v) => `${num(v)}%`
  const labels = { urban: t('government.insights.urban'), rural: t('government.insights.rural') }

  return (
    <ChartCard
      id="participation"
      title={t('government.insights.partTitle')}
      note={t('government.insights.partNote')}
      legend={[
        { color: C.primary, label: labels.urban },
        { color: C.accent, label: labels.rural },
      ]}
      table={
        <DataTable
          columns={[t('government.insights.colDivision'), labels.urban, labels.rural, t('government.insights.colGap')]}
          rows={rows.map((r) => [r.name, pct(r.urban), pct(r.rural), t('government.insights.points', { n: num(r.urban - r.rural) })])}
        />
      }
    >
      <ResponsiveContainer width="100%" height={rows.length * 48 + 30}>
        <BarChart data={rows} layout="vertical" margin={{ top: 4, right: 40, bottom: 0, left: 0 }} barGap={2}>
          <CartesianGrid horizontal={false} stroke={C.grid} />
          <XAxis type="number" domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickFormatter={pct} tick={AXIS_TICK} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" width={92} tick={AXIS_TICK} axisLine={{ stroke: C.grid }} tickLine={false} interval={0} />
          <Tooltip
            cursor={{ fill: 'var(--surface-2)' }}
            content={
              <ChartTooltip
                render={(payload, label) => (
                  <>
                    <p className="mb-1 text-ink-2">{label}</p>
                    {payload.map((p) => (
                      <p key={p.dataKey} className="flex items-center gap-2">
                        <Swatch color={p.dataKey === 'urban' ? C.primary : C.accent} line />
                        <span className="font-semibold tabular-nums">{pct(p.value)}</span>
                        <span className="text-ink-2">{labels[p.dataKey]}</span>
                      </p>
                    ))}
                  </>
                )}
              />
            }
          />
          <Bar dataKey="urban" fill={C.primary} barSize={12} radius={[0, 4, 4, 0]} isAnimationActive={false}>
            <LabelList dataKey="urban" position="right" formatter={pct} fill={C.axis} fontSize={11} />
          </Bar>
          <Bar dataKey="rural" fill={C.accent} barSize={12} radius={[0, 4, 4, 0]} isAnimationActive={false}>
            <LabelList dataKey="rural" position="right" formatter={pct} fill={C.ink} fontSize={11} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

function Turnaround() {
  const { t, num, date } = useI18n()
  const short = (iso) => date(iso, { day: 'numeric', month: 'short' })
  const hours = (v) => t('government.wait.hours', { n: num(v) })
  const last = turnaround.length - 1

  return (
    <ChartCard
      id="turnaround"
      title={t('government.insights.turnTitle')}
      note={t('government.insights.turnNote')}
      table={<DataTable columns={[t('government.insights.colWeek'), t('government.insights.colHours')]} rows={turnaround.map((r) => [short(r.week), hours(r.hours)])} />}
    >
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={turnaround} margin={{ top: 16, right: 36, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} stroke={C.grid} />
          <XAxis dataKey="week" tickFormatter={short} tick={AXIS_TICK} axisLine={{ stroke: C.grid }} tickLine={false} minTickGap={16} />
          <YAxis domain={[0, 48]} ticks={[0, 12, 24, 36, 48]} tickFormatter={num} tick={AXIS_TICK} axisLine={false} tickLine={false} width={32} />
          <Tooltip
            cursor={{ stroke: C.axis, strokeWidth: 1 }}
            content={
              <ChartTooltip
                render={(payload, label) => (
                  <>
                    <p className="font-semibold tabular-nums">{hours(payload[0].value)}</p>
                    <p className="text-ink-2">{t('government.insights.weekOf', { date: short(label) })}</p>
                  </>
                )}
              />
            }
          />
          <Line
            type="monotone"
            dataKey="hours"
            stroke={C.primary}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            dot={false}
            activeDot={{ r: 5, fill: C.primary, stroke: C.surface, strokeWidth: 2 }}
            isAnimationActive={false}
          >
            <LabelList
              dataKey="hours"
              content={({ x, y, value, index }) =>
                index === last ? (
                  <g>
                    <circle cx={x} cy={y} r={4} fill={C.primary} stroke={C.surface} strokeWidth={2} />
                    <text x={x + 8} y={y + 4} fill={C.ink} fontSize={12} fontWeight={600}>
                      {hours(value)}
                    </text>
                  </g>
                ) : null
              }
            />
          </Line>
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

export default function Insights() {
  const { t, num } = useI18n()
  const { challenges } = useDemo()
  const open = challenges.filter((c) => c.status === 'open').length
  const lastWeek = turnaround.at(-1).hours
  const change = (n) => t('government.insights.change', { n: `${n > 0 ? '+' : '−'}${num(Math.abs(n))}` })

  return (
    <div className="mx-auto max-w-6xl">
      <PageIntro title={t('government.insights.title')} body={t('government.insights.body')} />

      <p className="mb-5 flex items-start gap-2.5 rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-brand-ink">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-accent" /> {t('government.insights.privacy')}
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat tone="brand" label={t('government.insights.activeStudents')} value={t('government.insights.lakh', { n: num(insightTiles.activeStudents.lakh) })} note={change(insightTiles.activeStudents.change)} />
        <Stat label={t('government.insights.itemsVerified')} value={num(insightTiles.itemsVerified.value)} note={change(insightTiles.itemsVerified.change)} />
        <Stat label={t('government.insights.medianTurnaround')} value={t('government.wait.hours', { n: num(lastWeek) })} note={t('government.insights.medianNote')} />
        <Stat label={t('government.insights.openChallenges')} value={num(open)} note={t('government.insights.openNote')} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <WeakTopics />
        <SkillsDemand />
        <Participation />
        <Turnaround />
      </div>

      <p className="mt-6 text-xs text-ink-2">{t('government.insights.footnote')}</p>
    </div>
  )
}

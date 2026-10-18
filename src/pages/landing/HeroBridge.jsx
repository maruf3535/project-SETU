import { useI18n } from '../../i18n/I18nProvider'

// The arch is the quadratic curve (60,200) → control (500,-20) → (940,200) in a 1000×240 box.
// On that curve x grows linearly with t, so stages sit at even spacing.
const archX = (t) => 60 + 880 * t
const archY = (t) => 200 - 440 * t + 440 * t * t
const DECK_Y = 228
const stageTs = [0, 0.2, 0.4, 0.6, 0.8, 1]
const hangerTs = Array.from({ length: 19 }, (_, i) => (i + 1) / 20)

export default function HeroBridge() {
  const { t } = useI18n()
  const stages = t('landing.hero.path')

  return (
    <div className="relative">
      <div className="relative aspect-[1000/240] w-full">
        <svg viewBox="0 0 1000 240" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden="true">
          {hangerTs.map((ht) => (
            <line
              key={ht}
              x1={archX(ht)}
              x2={archX(ht)}
              y1={archY(ht)}
              y2={DECK_Y}
              stroke="var(--brand-ink)"
              strokeOpacity="0.18"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <line x1="20" x2="980" y1={DECK_Y} y2={DECK_Y} stroke="var(--brand-ink)" strokeOpacity="0.4" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          <path
            d="M60 200 Q500 -20 940 200"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="3"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            pathLength="1"
            className="setu-arch"
          />
        </svg>

        {stageTs.map((st, index) => {
          const last = index === stageTs.length - 1
          return (
            <span
              key={st}
              style={{ left: `${archX(st) / 10}%`, top: `${(archY(st) / 240) * 100}%`, animationDelay: `${0.25 + index * 0.18}s` }}
              className={`setu-node absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4 sm:size-4 ${
                last ? 'bg-accent ring-accent/30' : 'bg-brand ring-accent'
              }`}
            />
          )
        })}
      </div>

      <ol className="relative mt-3 h-10 sm:h-8">
        {stageTs.map((st, index) => (
          <li
            key={st}
            style={{ left: `${archX(st) / 10}%` }}
            className={`absolute w-[16%] -translate-x-1/2 text-center text-[10px] leading-tight font-semibold sm:text-sm ${
              index === stageTs.length - 1 ? 'text-accent' : 'text-brand-ink/80'
            }`}
          >
            {stages[index]}
          </li>
        ))}
      </ol>
    </div>
  )
}

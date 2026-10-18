// A drawn OMR answer sheet: roll grid, set code and 20 four-option questions in two columns.
// With `graded`, rings show correct (ok), wrong (bad) and the right answer for misses (dashed).
const ROW_H = 17.5
const BUBBLE_GAP = 20

function bubblePos(i, opt) {
  const col = i < 10 ? 0 : 1
  const row = i % 10
  return { x: 54 + col * 138 + opt * BUBBLE_GAP, y: 222 + row * ROW_H }
}

export default function OmrSheet({ sheet, answerKey, graded, labels, className = '' }) {
  const digits = sheet.roll.split('')
  const rollX = (d) => 28 + d * 13

  return (
    <svg viewBox="0 0 300 410" role="img" aria-label={labels.aria} className={`h-auto w-full ${className}`}>
      <rect x="1" y="1" width="298" height="408" rx="6" className="fill-surface stroke-line" strokeWidth="1" />
      {/* Registration marks the scanner aligns on */}
      {[
        [8, 8],
        [282, 8],
        [8, 392],
        [282, 392],
      ].map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="10" height="10" className="fill-ink" />
      ))}

      <text x="26" y="30" className="fill-ink" fontSize="11" fontWeight="700">
        {labels.brand}
      </text>
      <text x="26" y="43" className="fill-ink-2" fontSize="7">
        {labels.exam}
      </text>
      <line x1="26" y1="50" x2="274" y2="50" className="stroke-line" strokeWidth="1" />

      {/* Roll / ID: written digits on top, filled bubble per column */}
      <text x="26" y="62" className="fill-ink-2" fontSize="6.5" fontWeight="600">
        {labels.roll}
      </text>
      {digits.map((digit, d) => (
        <g key={d}>
          <rect x={rollX(d) - 5.5} y="66" width="11" height="12" rx="1.5" className="fill-none stroke-ink-2" strokeWidth="0.6" />
          <text x={rollX(d)} y="75.5" textAnchor="middle" className="fill-ink" fontSize="8" fontWeight="600" fontStyle="italic">
            {digit}
          </text>
          {Array.from({ length: 10 }, (_, n) => {
            const filled = String(n) === digit
            return (
              <g key={n}>
                <circle cx={rollX(d)} cy={86 + n * 10.5} r="4" className={filled ? 'fill-ink stroke-ink' : 'fill-none stroke-ink-2'} strokeWidth="0.6" />
                {!filled && (
                  <text x={rollX(d)} y={88 + n * 10.5} textAnchor="middle" className="fill-ink-2" fontSize="4.5">
                    {n}
                  </text>
                )}
              </g>
            )
          })}
        </g>
      ))}

      {/* Name and set code */}
      <text x="150" y="62" className="fill-ink-2" fontSize="6.5" fontWeight="600">
        {labels.name}
      </text>
      <line x1="150" y1="80" x2="274" y2="80" className="stroke-ink-2" strokeWidth="0.6" />
      <text x="152" y="77" className="fill-ink" fontSize="9" fontStyle="italic">
        {sheet.name}
      </text>
      <text x="150" y="100" className="fill-ink-2" fontSize="6.5" fontWeight="600">
        {labels.set}
      </text>
      {labels.setNames.map((s, i) => (
        <g key={s}>
          <circle cx={156 + i * 16} cy="112" r="5" className={i === 0 ? 'fill-ink stroke-ink' : 'fill-none stroke-ink-2'} strokeWidth="0.6" />
          {i !== 0 && (
            <text x={156 + i * 16} y="114" textAnchor="middle" className="fill-ink-2" fontSize="5">
              {s}
            </text>
          )}
        </g>
      ))}
      <text x="150" y="140" className="fill-ink-2" fontSize="6">
        {labels.instructions}
      </text>

      <line x1="26" y1="200" x2="274" y2="200" className="stroke-line" strokeWidth="1" />

      {/* Answers */}
      {answerKey.map((key, i) => {
        const mark = sheet.answers[i]
        const { x: x0, y } = bubblePos(i, 0)
        return (
          <g key={i}>
            <text x={x0 - 14} y={y + 2.5} textAnchor="end" className="fill-ink" fontSize="7" fontWeight="600">
              {labels.number(i + 1)}
            </text>
            {[0, 1, 2, 3].map((opt) => {
              const { x } = bubblePos(i, opt)
              const filled = mark === opt
              return (
                <g key={opt}>
                  <circle cx={x} cy={y} r="5.5" className={filled ? 'fill-ink stroke-ink' : 'fill-none stroke-ink-2'} strokeWidth="0.6" />
                  {!filled && (
                    <text x={x} y={y + 2} textAnchor="middle" className="fill-ink-2" fontSize="5.5">
                      {labels.options[opt]}
                    </text>
                  )}
                </g>
              )
            })}
            {graded && mark === key && <circle cx={bubblePos(i, key).x} cy={y} r="8" className="fill-none stroke-ok" strokeWidth="1.8" />}
            {graded && mark !== null && mark !== key && <circle cx={bubblePos(i, mark).x} cy={y} r="8" className="fill-none stroke-bad" strokeWidth="1.8" />}
            {graded && mark !== key && <circle cx={bubblePos(i, key).x} cy={y} r="8" className="fill-none stroke-ok" strokeWidth="1.4" strokeDasharray="2 1.5" />}
          </g>
        )
      })}
    </svg>
  )
}

// The Setu mark: two halves of a link joined by a span, drawn to match public/favicon.svg
export default function SetuMark({ className = 'size-9' }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={`shrink-0 ${className}`}>
      <rect width="32" height="32" rx="8" fill="var(--accent)" />
      <g fill="none" stroke="var(--accent-ink)" strokeWidth="2.6" strokeLinecap="round">
        <path d="M13 20h-2.5a4 4 0 0 1 0-8H13" />
        <path d="M19 12h2.5a4 4 0 0 1 0 8H19" />
        <path d="M12.5 16h7" />
      </g>
    </svg>
  )
}

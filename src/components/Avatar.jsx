export default function Avatar({ initials, className = 'size-10 text-sm' }) {
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-full bg-accent font-semibold text-accent-ink ${className}`}
    >
      {initials}
    </span>
  )
}

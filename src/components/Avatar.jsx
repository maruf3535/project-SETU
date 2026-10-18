// Initials on amber, or the user's photo when they have uploaded one
export default function Avatar({ initials, photo, className = 'size-10 text-sm' }) {
  if (photo) return <img src={photo} alt="" className={`shrink-0 rounded-full object-cover ${className}`} />
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-full bg-accent font-semibold text-accent-ink ${className}`}
    >
      {initials}
    </span>
  )
}

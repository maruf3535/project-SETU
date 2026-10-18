// The Setu logo on a white tile, so its dark teal leaves stay visible on the dark brand surfaces
export default function SetuMark({ className = 'size-9' }) {
  return (
    <span className={`grid shrink-0 place-items-center rounded-[28%] bg-white ${className}`}>
      <img src={`${import.meta.env.BASE_URL}logo-mark.png`} alt="" className="size-[78%] object-contain" />
    </span>
  )
}

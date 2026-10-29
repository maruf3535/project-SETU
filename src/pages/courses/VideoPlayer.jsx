import { CirclePlay, Pause, Play, RotateCcw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { SAMPLE_VIDEO } from '../../data/demo/courses'
import { useI18n } from '../../i18n/I18nProvider'

const SAMPLE_SRC = `${import.meta.env.BASE_URL}${SAMPLE_VIDEO}`
// The stand-in player runs a whole lecture in this many seconds
const SIMULATED_SECONDS = 12
const TICK_MS = 250
// A real video counts as watched near the end, so skipping the credits still counts
const WATCHED_AT = 0.9
// Once the file has failed to load, later lectures go straight to the stand-in
let sampleMissing = false

function clock(seconds, num) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${num(m)}:${num(s).padStart(2, num(0))}`
}

// Stand-in shown while the sample file is missing: a poster with a simulated play bar, so watch progress still works
function Placeholder({ lecture, courseTitle, onWatched }) {
  const { t, L, num } = useI18n()
  const [progress, setProgress] = useState(0)
  const [playing, setPlaying] = useState(false)
  const reported = useRef(false)
  const total = Number(lecture.minutes) * 60

  // Playing stops by itself at the end
  const running = playing && progress < 1

  useEffect(() => {
    if (!running) return undefined
    const timer = setInterval(() => {
      setProgress((p) => Math.min(1, p + TICK_MS / 1000 / SIMULATED_SECONDS))
    }, TICK_MS)
    return () => clearInterval(timer)
  }, [running])

  useEffect(() => {
    if (progress < 1 || reported.current) return
    reported.current = true
    onWatched()
  }, [progress, onWatched])

  function toggle() {
    if (progress >= 1) {
      setProgress(0)
      setPlaying(true)
    } else {
      setPlaying(!playing)
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-brand text-brand-ink">
      <div className="relative grid aspect-video place-items-center p-5 text-center sm:p-8">
        <div className="max-w-md">
          <p className="text-xs font-semibold tracking-[0.12em] text-brand-ink/60 uppercase">{L(courseTitle)}</p>
          <p className="mt-2 font-display text-xl leading-tight font-semibold sm:text-3xl">{L(lecture.title)}</p>
          <p className="mt-2 text-sm text-brand-ink/70 tabular-nums">{t('courses.minutes', { n: num(Number(lecture.minutes)) })}</p>
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-ink">
            <CirclePlay className="size-3.5" /> {t('courses.player.placeholder')}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 border-t border-brand-ink/15 px-4 py-3">
        <button
          type="button"
          onClick={toggle}
          aria-label={running ? t('courses.player.pause') : progress >= 1 ? t('courses.player.replay') : t('courses.player.play')}
          className="grid size-10 shrink-0 place-items-center rounded-full bg-accent text-accent-ink"
        >
          {running ? <Pause className="size-5" /> : progress >= 1 ? <RotateCcw className="size-5" /> : <Play className="size-5" />}
        </button>
        <label className="min-w-0 flex-1">
          <span className="sr-only">{t('courses.player.seek')}</span>
          <input
            type="range"
            min="0"
            max="100"
            value={Math.round(progress * 100)}
            onChange={(e) => setProgress(Number(e.target.value) / 100)}
            className="w-full accent-[var(--accent)]"
          />
        </label>
        <span className="shrink-0 text-xs text-brand-ink/70 tabular-nums">
          {clock(progress * total, num)} / {clock(total, num)}
        </span>
      </div>
    </div>
  )
}

// Plays the shared sample video for every lecture; falls back to the stand-in when the file is not there
export default function VideoPlayer({ lecture, courseTitle, onWatched }) {
  const { t } = useI18n()
  const [missing, setMissing] = useState(() => sampleMissing)
  const reported = useRef(false)

  function onTime(event) {
    const video = event.currentTarget
    if (!reported.current && video.duration && video.currentTime / video.duration >= WATCHED_AT) {
      reported.current = true
      onWatched()
    }
  }

  if (missing) return <Placeholder lecture={lecture} courseTitle={courseTitle} onWatched={onWatched} />

  return (
    // The sample file has no captions; real lectures would ship a caption track
    <video
      src={SAMPLE_SRC}
      controls
      playsInline
      preload="metadata"
      aria-label={t('courses.player.videoLabel')}
      onError={() => {
        sampleMissing = true
        setMissing(true)
      }}
      onTimeUpdate={onTime}
      onEnded={() => {
        if (!reported.current) {
          reported.current = true
          onWatched()
        }
      }}
      className="aspect-video w-full rounded-2xl bg-black"
    />
  )
}

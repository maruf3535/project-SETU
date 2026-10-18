import { ChevronLeft, ChevronRight, LoaderCircle, Maximize, Minimize, MoveHorizontal, PanelLeft, TriangleAlert, X, ZoomIn, ZoomOut } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useI18n } from '../../i18n/I18nProvider'

// pdf.js is large, so it loads only when a reader first opens
let pdfjsPromise = null
function loadPdfjs() {
  pdfjsPromise ??= Promise.all([import('pdfjs-dist'), import('pdfjs-dist/build/pdf.worker.min.mjs?url')]).then(([lib, worker]) => {
    lib.GlobalWorkerOptions.workerSrc = worker.default
    return lib
  })
  return pdfjsPromise
}

const ZOOMS = [0.5, 0.75, 1, 1.25, 1.5, 2, 3]

// Draws one page into a canvas at the given CSS width, sharp on high-density screens
function PageCanvas({ doc, number, width, className = '' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!doc || !width) return undefined
    let task = null
    let cancelled = false
    doc.getPage(number).then((page) => {
      if (cancelled) return
      const base = page.getViewport({ scale: 1 })
      const ratio = window.devicePixelRatio || 1
      const viewport = page.getViewport({ scale: (width / base.width) * ratio })
      const canvas = canvasRef.current
      if (!canvas) return
      canvas.width = viewport.width
      canvas.height = viewport.height
      canvas.style.width = `${width}px`
      canvas.style.height = `${viewport.height / ratio}px`
      task = page.render({ canvas, canvasContext: canvas.getContext('2d'), viewport })
      task.promise.catch(() => {})
    })
    return () => {
      cancelled = true
      task?.cancel()
    }
  }, [doc, number, width])

  return <canvas ref={canvasRef} className={`block bg-white ${className}`} />
}

export default function PdfReader({ open, onClose, src, title, initialPage = 1, pageLabels, note }) {
  const { t, num } = useI18n()
  const [doc, setDoc] = useState(null)
  const [error, setError] = useState(false)
  const [page, setPage] = useState(initialPage)
  const [zoom, setZoom] = useState(null) // null = fit to width
  const [thumbs, setThumbs] = useState(true)
  const [stageWidth, setStageWidth] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const rootRef = useRef(null)
  const stageRef = useRef(null)

  useEffect(() => {
    if (!open || !src) return undefined
    let cancelled = false
    let loaded = null
    setDoc(null)
    setError(false)
    setPage(initialPage)
    loadPdfjs()
      .then((lib) => lib.getDocument({ url: `${import.meta.env.BASE_URL}${src}` }).promise)
      .then((pdf) => {
        loaded = pdf
        if (cancelled) pdf.destroy()
        else setDoc(pdf)
      })
      .catch(() => !cancelled && setError(true))
    return () => {
      cancelled = true
      loaded?.destroy()
    }
  }, [open, src, initialPage])

  // Track the reading area's width so "fit width" follows window and sidebar changes
  useEffect(() => {
    if (!open || !stageRef.current) return undefined
    const observer = new ResizeObserver(([entry]) => setStageWidth(entry.contentRect.width))
    observer.observe(stageRef.current)
    return () => observer.disconnect()
  }, [open, thumbs])

  const total = doc?.numPages ?? 0
  const go = useCallback((n) => setPage((p) => Math.min(Math.max(1, typeof n === 'function' ? n(p) : n), total || 1)), [total])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => {
      if (event.target.closest?.('input')) return
      if (event.key === 'Escape' && !document.fullscreenElement) onClose()
      if (event.key === 'ArrowRight' || event.key === 'PageDown') go((p) => p + 1)
      if (event.key === 'ArrowLeft' || event.key === 'PageUp') go((p) => p - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, go])

  useEffect(() => {
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  useEffect(() => {
    if (!open) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  if (!open) return null

  const fitWidth = Math.max(240, Math.min(stageWidth - 32, 900))
  const pageWidth = zoom ? Math.round(Math.min(stageWidth - 32, 900) * zoom) : fitWidth
  const label = (n) => pageLabels?.[n - 1] ?? String(n)

  function changeZoom(direction) {
    const current = zoom ?? 1
    const index = ZOOMS.findIndex((z) => z >= current - 0.001)
    const next = ZOOMS[Math.min(ZOOMS.length - 1, Math.max(0, (index === -1 ? 2 : index) + direction))]
    setZoom(next)
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await rootRef.current?.requestFullscreen()
    } catch {
      // fullscreen can be refused (some phones, embedded views); the reader still fills the window
    }
  }

  const tool = 'grid size-9 shrink-0 place-items-center rounded-lg text-brand-ink/80 hover:bg-brand-ink/10 hover:text-brand-ink disabled:opacity-35'

  return (
    <div ref={rootRef} role="dialog" aria-modal="true" aria-label={title} className="fixed inset-0 z-[70] flex flex-col bg-[#0b1618] text-brand-ink">
      <header className="flex flex-wrap items-center gap-1 border-b border-brand-ink/10 bg-brand pt-[max(0.5rem,env(safe-area-inset-top))] pr-[max(0.5rem,env(safe-area-inset-right))] pb-2 pl-[max(0.5rem,env(safe-area-inset-left))]">
        <button type="button" onClick={() => setThumbs((v) => !v)} aria-pressed={thumbs} aria-label={t('pdf.thumbnails')} title={t('pdf.thumbnails')} className={`${tool} hidden md:grid`}>
          <PanelLeft className="size-4" />
        </button>
        <p className="min-w-0 flex-1 truncate px-2 text-sm font-semibold">{title}</p>

        <div className="flex items-center gap-1">
          <button type="button" onClick={() => go((p) => p - 1)} disabled={page <= 1} aria-label={t('pdf.prev')} className={tool}>
            <ChevronLeft className="size-5" />
          </button>
          <span className="px-1 text-sm whitespace-nowrap tabular-nums">
            {total ? t('pdf.page', { n: num(page), total: num(total) }) : '…'}
            {pageLabels && total > 0 && <span className="ml-1.5 text-brand-ink/55">({t('pdf.printed', { label: label(page) })})</span>}
          </span>
          <button type="button" onClick={() => go((p) => p + 1)} disabled={!total || page >= total} aria-label={t('pdf.next')} className={tool}>
            <ChevronRight className="size-5" />
          </button>
        </div>

        <span className="mx-1 hidden h-6 w-px bg-brand-ink/15 sm:block" />
        <button type="button" onClick={() => changeZoom(-1)} aria-label={t('pdf.zoomOut')} title={t('pdf.zoomOut')} className={tool}>
          <ZoomOut className="size-4" />
        </button>
        <span className="hidden w-12 text-center text-xs text-brand-ink/70 tabular-nums sm:block">{zoom ? `${num(Math.round(zoom * 100))}%` : t('pdf.fit')}</span>
        <button type="button" onClick={() => changeZoom(1)} aria-label={t('pdf.zoomIn')} title={t('pdf.zoomIn')} className={tool}>
          <ZoomIn className="size-4" />
        </button>
        <button type="button" onClick={() => setZoom(null)} aria-pressed={zoom === null} aria-label={t('pdf.fitWidth')} title={t('pdf.fitWidth')} className={tool}>
          <MoveHorizontal className="size-4" />
        </button>
        <button type="button" onClick={toggleFullscreen} aria-label={fullscreen ? t('pdf.exitFullscreen') : t('pdf.fullscreen')} title={fullscreen ? t('pdf.exitFullscreen') : t('pdf.fullscreen')} className={tool}>
          {fullscreen ? <Minimize className="size-4" /> : <Maximize className="size-4" />}
        </button>
        <button type="button" onClick={onClose} aria-label={t('pdf.close')} title={t('pdf.close')} className={`${tool} ml-1 bg-brand-ink/10`}>
          <X className="size-5" />
        </button>
      </header>

      {note && <p className="bg-accent px-4 py-2 text-center text-xs font-semibold text-accent-ink">{note}</p>}

      <div className="flex min-h-0 flex-1">
        {thumbs && doc && (
          <nav aria-label={t('pdf.thumbnails')} className="hidden w-36 shrink-0 overflow-y-auto border-r border-brand-ink/10 p-3 md:block">
            <ol className="grid gap-3">
              {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
                <li key={n}>
                  <button
                    type="button"
                    onClick={() => setPage(n)}
                    aria-current={n === page ? 'page' : undefined}
                    className={`block w-full rounded-md p-1 ${n === page ? 'bg-accent/90' : 'hover:bg-brand-ink/10'}`}
                  >
                    <PageCanvas doc={doc} number={n} width={104} className="mx-auto rounded-sm shadow" />
                    <span className={`mt-1 block text-center text-[11px] tabular-nums ${n === page ? 'font-semibold text-accent-ink' : 'text-brand-ink/60'}`}>{label(n)}</span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div ref={stageRef} className="min-w-0 flex-1 overflow-auto pb-[env(safe-area-inset-bottom)]">
          {error ? (
            <p className="m-auto flex max-w-sm flex-col items-center gap-3 p-10 text-center text-sm text-brand-ink/75">
              <TriangleAlert className="size-8 text-accent" /> {t('pdf.error')}
            </p>
          ) : !doc ? (
            <p className="flex items-center justify-center gap-2 p-16 text-sm text-brand-ink/70">
              <LoaderCircle className="size-5 animate-spin" /> {t('pdf.loading')}
            </p>
          ) : (
            <div className="flex min-w-fit justify-center p-4">
              <PageCanvas key={`${page}-${pageWidth}`} doc={doc} number={page} width={pageWidth} className="rounded-sm shadow-2xl" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

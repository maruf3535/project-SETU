// Looks up the sample PDF for a book or note. The manifest is optional at build time,
// so anything without its own file (e.g. uploaded during the demo) falls back to the placeholder.
const manifest = Object.values(import.meta.glob('../../data/demo/pdfs.js', { eager: true }))[0] ?? {}

const placeholder = manifest.placeholderPdf ?? { file: 'pdfs/placeholder.pdf', pages: 2 }

export function bookPdf(bookId) {
  const entry = manifest.bookPdfs?.[bookId]
  return entry ? { ...entry, placeholder: false } : { ...placeholder, placeholder: true }
}

export function notePdf(noteId) {
  const entry = manifest.notePdfs?.[noteId]
  return entry ? { ...entry, placeholder: false } : { ...placeholder, placeholder: true }
}

// The PDF page to open when a reviewer jumps to an AI-flagged problem
export function reviewPage(itemId) {
  return manifest.reviewPages?.[itemId] ?? 1
}

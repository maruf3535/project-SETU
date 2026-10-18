// The demo uses one shared 20-page sample PDF for every book, note and review file.
// Swap in real files later by returning a different { file, pages } per id.
const SAMPLE = { file: 'pdfs/sample.pdf', pages: 20, placeholder: false }

// PDF page to open when a reviewer jumps to an AI-flagged problem (kept within the sample's 20 pages)
const REVIEW_PAGES = { 'bk-highermath': 12, 'bk-chemlab': 4 }

export function bookPdf() {
  return SAMPLE
}

export function notePdf() {
  return SAMPLE
}

export function reviewPage(itemId) {
  return REVIEW_PAGES[itemId] ?? 1
}

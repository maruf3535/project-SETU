import { useState } from 'react'
import PdfReader from './PdfReader'

// const [openReader, reader] = useReader(); openReader({ src, title, initialPage, pageLabels, note }); render {reader}
export function useReader() {
  const [options, setOptions] = useState(null)
  const reader = <PdfReader open={Boolean(options)} onClose={() => setOptions(null)} {...(options ?? {})} />
  return [setOptions, reader]
}

interface BibliographyEntryProps {
  id: string
  author: string
  title: string
  year: number
  publisher: string
  url: string
  type: string
}

export function BibliographyEntry(props: BibliographyEntryProps) {
  // This component is primarily for MDX parsing
  // The actual rendering is handled by the Bibliography component
  return null
}


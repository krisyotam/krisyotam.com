export interface Report {
  id: string
  title: string
  abstract?: string
  importance: number | string
  confidence?: string
  authors: string[]
  subject?: string
  keywords?: string[]
  postedBy: string
  postedOn: string
  dateStarted: string
  tags: string[]
  img?: string
  status: string
  pdfLink?: string
  sourceLink?: string
  category: string
}
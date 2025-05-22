export interface NoteMeta {
  title: string
  date: string
  slug: string
  tags: string[]
  category: string
  status: "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished"
  confidence: "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain"
  importance: number
} 
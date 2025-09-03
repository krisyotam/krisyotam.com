// /types/progymnasmata.ts

export interface ProgymnasmataEntry {
    title: string
    slug: string
    type: string
    start_date: string
    end_date?: string
    description: string
    paragraphs: string[]
    image?: string
    importance: number
    tags?: string[]
    status?: "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished"
    certainty?: "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain"
  }
  
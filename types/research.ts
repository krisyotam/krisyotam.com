export interface ResearchImage {
  title: string
  img_url: string
}

export interface Research {
  name: string
  description: string
  status: string
  start_date: string
  imgs?: ResearchImage[]
  are_na_link?: string
}

export type ViewMode = "grid" | "list"

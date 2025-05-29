export interface PhilanthropyCause {
  id: string
  title: string
  dateStarted: string
  year: number
  type: string
  category: string
  description: string
  slug: string
  website: string
  impact: "Low" | "Medium" | "High" | "Very High"
  tags: string[]
  status: "Active" | "Completed" | "Paused" | "Planning"
  confidence?: 
    | "impossible"
    | "remote"
    | "highly unlikely"
    | "unlikely"
    | "possible"
    | "likely"
    | "highly likely"
    | "certain"
  importance?: number
  longDescription: string
  goals: string[]
  achievements: string[]
}

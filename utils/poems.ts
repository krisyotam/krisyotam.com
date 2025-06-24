export interface Poem {
    id: string
    title: string
    dateCreated: string
    year: number
    type: string
    collection?: string
    description?: string
    headerDescription?: string
    slug: string
    image: string
    content?: string
    stanza1: string
    stanza2?: string
    stanza3?: string
    stanza4?: string
    stanza5?: string
    stanza6?: string
    stanza7?: string
    stanza8?: string
    tags?: string[]
    status?: "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished"
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
  }
  
  
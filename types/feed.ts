export interface Post {
  title: string
  subtitle?: string
  preview: string
  start_date: string
  end_date?: string
  tags: string[]
  category: string
  slug: string
  cover_image: string
  status: string
  confidence?: string
  importance: number
  state?: string // Make optional to match utils/posts.ts
  customPath?: string
}

export interface Feed {
  essays: Post[]
}
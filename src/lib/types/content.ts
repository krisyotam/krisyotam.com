/**
 * =============================================================================
 * content.ts                                                                   
 * =============================================================================
 *
 * Shared types for content system.
 *
 * These types are used by both lib/data.ts and lib/posts.ts to avoid
 * circular dependencies.
 *
 * Author: Kris Yotam
 * =============================================================================
 */
                                                                                
// =============================================================================
// Post Types
// =============================================================================

export interface Post {
  title: string
  subtitle?: string
  preview: string
  start_date: string
  end_date?: string
  tags: string[]
  category: string
  slug: string
  state?: string
  status?: string
  confidence?: string
  importance?: number
  headings?: string[]
  marginNotes?: string[]
  cover_image?: string
  cover?: string
  path?: string
  publication_year?: number
  author?: string
}

export interface PostsData {
  posts: Post[]
}

// =============================================================================
// Category Types
// =============================================================================

export interface CategoryData {
  slug: string
  title: string
  subtitle?: string
  preview?: string
  date: string
  'show-status': 'active' | 'hidden'
  status: string
  confidence?: 'certain' | 'unlikely' | 'likely' | 'impossible' | 'remote' | 'highly unlikely' | 'possible' | 'highly likely'
  importance?: number
}

export interface CategoriesData {
  categories: CategoryData[]
}

// =============================================================================
// Tag Types
// =============================================================================

export interface TagData {
  id?: number
  slug: string
  title: string
  preview?: string | null
  importance?: number
  state?: string
}

export interface TagsData {
  tags: TagData[]
}

// =============================================================================
// Sequence Types
// =============================================================================

export interface SequencePost {
  content_type: string
  content_slug: string
  position: number
  section_title: string | null
  section_order: number | null
  title?: string
  preview?: string
  status?: string
  slug?: string
  type?: string
  order?: number
}

export interface SequenceSection {
  title: string
  posts: SequencePost[]
}

export interface Sequence {
  slug: string
  title: string
  preview: string | null
  'cover-url': string | null
  category: string | null
  status: string | null
  confidence: string | null
  importance: number | null
  start_date: string | null
  end_date: string | null
  state: string
  tags: string[]
  posts: SequencePost[]
  sections?: SequenceSection[]
}

export interface SequencesData {
  sequences: Sequence[]
}

/**
 * TYPES: CONTENT
 * File:  content.ts
 *
 * Contains:
 *   - Status: editorial completion status
 *   - Confidence: epistemic confidence levels
 *   - ContentState: visibility toggle
 *   - Verse / Poem: poetry content
 *   - Sequence types: ordered series of posts
 *   - Skill types: skills display components
 *   - Library types: book collection
 *
 * Notes:
 *   Content-route types (blog, essays, notes, papers, etc.) use the
 *   unified Post interface from @/lib/types/content — NOT this file.
 *   This file holds domain-specific types for non-standard routes
 *   (verse, sequences) and standalone UI components (skills, library).
 */


/* =============================================================================
 * SHARED ENUMS
 * ============================================================================= */

/** Standard content status values */
export type Status =
  | "Abandoned"
  | "Notes"
  | "Draft"
  | "In Progress"
  | "Finished"

/** Standard confidence levels for claims/content */
export type Confidence =
  | "impossible"
  | "remote"
  | "highly unlikely"
  | "unlikely"
  | "possible"
  | "likely"
  | "highly likely"
  | "certain"

/** Content visibility state */
export type ContentState = "active" | "hidden"


/* =============================================================================
 * VERSE (Poetry)
 * ============================================================================= */

export interface Verse {
  id?: string
  title?: string
  start_date?: string
  end_date?: string
  dateCreated?: string
  type?: string
  collection?: string
  description?: string
  headerDescription?: string
  slug?: string
  image?: string
  content?: string
  stanza1?: string
  stanza2?: string
  stanza3?: string
  stanza4?: string
  stanza5?: string
  stanza6?: string
  stanza7?: string
  stanza8?: string
  tags?: string[]
  status?: Status
  confidence?: Confidence
  importance?: number
}

/** Alias: existing components reference Poem */
export type Poem = Verse


/* =============================================================================
 * SEQUENCES
 * ============================================================================= */

export type PostType =
  | "essay"
  | "note"
  | "paper"
  | "review"
  | "fiction"
  | "case"
  | "dossier"
  | "conspiracy"
  | "liber"
  | "proof"
  | "lecture-note"
  | "verse"

export interface SequencePost {
  slug: string
  order: number
  type: PostType
}

export interface SequenceSection {
  title: string
  posts: SequencePost[]
}

export interface Sequence {
  slug: string
  title: string
  preview: string
  start_date: string
  end_date?: string
  "cover-url": string
  state: ContentState
  status: Status | "Planned"
  confidence: Confidence
  importance: number
  category?: string
  tags: string[]
  posts?: SequencePost[]
  sections?: SequenceSection[]
}

export interface SequencesData {
  sequences: Sequence[]
}


/* =============================================================================
 * SKILLS
 * ============================================================================= */

export interface SkillColor {
  bg: string
  border: string
  text: string
  hover: string
}

export interface SkillCategory {
  id: string
  name: string
  color: SkillColor
  skills: string[]
}

export interface SkillsData {
  skillCategories: SkillCategory[]
}

export interface SkillItem {
  skill: string
  categoryId: string
  categoryName: string
  color: SkillColor
}

export interface CoreSkillsProps {
  data?: SkillsData
  className?: string
}

export type SkillViewType = "bento" | "category"

/** Alias for backwards compatibility */
export type ViewType = SkillViewType


/* =============================================================================
 * LIBRARY
 * ============================================================================= */

export interface Author {
  slug: string
  name: string
  fullName: string
  degrees: string[]
  university: string
  currentAffiliation: string
  previousAffiliations: string[]
  fieldOfExpertise: string[]
  notableAchievements: string[]
  bio: string
}

export interface Book {
  id: string
  title: string
  author?: string
  authors?: string[]
  authorName?: string
  authorNames?: string[]
  authorInfo?: Author
  authorsInfo?: Author[]
  series?: string
  edition?: string
  publisher: string
  yearPublished: string
  copyright?: string
  isbn?: string
  isbn10?: string
  isbn13?: string
  coverUrl: string
  classification: string
  subClassification: string
  editors?: string
  editor?: string
}

export interface LibraryData {
  books: Book[]
}

export interface AuthorsData {
  authors: Author[]
}

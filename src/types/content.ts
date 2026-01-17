/* =============================================================================
 * CONTENT TYPES
 * =============================================================================
 *
 * Unified type definitions for all content routes under app/(content)/.
 * Each content type follows a consistent pattern with metadata interfaces,
 * status/confidence enums, and optional category/full content interfaces.
 *
 * -----------------------------------------------------------------------------
 * @file        content.ts
 * @author      Kris Yotam
 * @created     2026-01-01
 * @license     MIT
 * -----------------------------------------------------------------------------
 *
 * CONTENTS
 * --------
 *   1. Shared Types (Status, Confidence)
 *   2. Essays
 *   3. Blog
 *   4. Notes
 *   5. Papers
 *   6. Reviews
 *   7. News
 *   8. OCS (Original Characters)
 *   9. Verse (Poetry)
 *  10. Research
 *  11. Progymnasmata
 *  12. Sequences
 *  13. Skills
 *  14. Library
 *
 * ============================================================================= */


/* =============================================================================
 * SHARED TYPES
 * =============================================================================
 * Common enums used across multiple content types for consistency.
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

/** Extended confidence for academic/research content */
export type ExtendedConfidence =
  | Confidence
  | "ambiguous"
  | "uncertain"
  | "developing"
  | "moderate"
  | "speculative"
  | "tentative"
  | "evidential"
  | "theoretical"
  | "controversial"
  | "debated"
  | "philosophical"

/** Content visibility state */
export type ContentState = "active" | "hidden"


/* =============================================================================
 * ESSAYS
 * =============================================================================
 * Long-form written pieces, typically academic or philosophical in nature.
 * ============================================================================= */

export interface Essay {
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
  customPath?: string
}


/* =============================================================================
 * BLOG
 * =============================================================================
 * General blog posts - shorter, more casual content.
 * ============================================================================= */

export type BlogStatus = Status
export type BlogConfidence = Confidence

export interface BlogMeta {
  title: string
  subtitle?: string
  preview?: string
  start_date: string
  end_date?: string
  slug: string
  tags: string[]
  category: string
  status?: BlogStatus
  confidence?: BlogConfidence
  importance?: number
  cover_image?: string
  state?: ContentState
}


/* =============================================================================
 * NOTES
 * =============================================================================
 * Study notes, learning materials, and reference documentation.
 * ============================================================================= */

export type NoteStatus = Status
export type NoteConfidence = Confidence

export interface NoteMeta {
  title: string
  start_date: string
  end_date?: string
  slug: string
  tags: string[]
  category: string
  status: NoteStatus
  confidence: NoteConfidence
  importance: number
  preview?: string
  cover_image?: string
  subtitle?: string
  framework?: string
  author?: string
  license?: string
}

/** Alias for backwards compatibility */
export type NotesMeta = NoteMeta


/* =============================================================================
 * PAPERS
 * =============================================================================
 * Academic papers, research documents, and formal publications.
 * ============================================================================= */

export type PaperStatus = "Draft" | "Published" | "Archived" | "Active" | "Notes"
export type PaperConfidence = ExtendedConfidence

export interface PaperMeta {
  title: string
  subtitle?: string
  preview?: string
  start_date: string
  end_date?: string
  slug: string
  tags: string[]
  category: string
  status?: PaperStatus
  confidence?: PaperConfidence
  importance?: number
  state?: string
  cover_image?: string
  publication_year?: number
  author?: string
}

export interface PaperCategory {
  slug: string
  title: string
  description?: string
  start_date: string
  end_date?: string
  preview?: string
  status?: PaperStatus
  confidence?: PaperConfidence
  importance?: number
  "show-status"?: string
}

export interface Paper extends PaperMeta {
  content: string
}


/* =============================================================================
 * REVIEWS
 * =============================================================================
 * Reviews of literature, cinema, verse, and other content.
 * ============================================================================= */

export type ReviewStatus = Status
export type ReviewConfidence = Confidence

export interface ReviewMeta {
  title: string
  subtitle?: string
  preview?: string
  start_date: string
  end_date?: string
  slug: string
  tags: string[]
  category: string
  status?: ReviewStatus
  confidence?: ReviewConfidence
  importance?: number
  cover_image?: string
  state?: ContentState
}

export interface ReviewCategory {
  slug: string
  title: string
  description?: string
  date: string
  preview?: string
  status?: ReviewStatus
  confidence?: ReviewConfidence
  importance?: number
}

export interface Review extends ReviewMeta {
  content: string
}

/** Alias for backwards compatibility */
export type ReviewsMeta = ReviewMeta


/* =============================================================================
 * NEWS
 * =============================================================================
 * News articles and time-sensitive content.
 * ============================================================================= */

export type NewsStatus = "Draft" | "Published" | "Archived" | "Breaking" | "Developing"
export type NewsConfidence = Confidence

export interface NewsMeta {
  title: string
  subtitle?: string
  preview?: string
  start_date: string
  end_date?: string
  slug: string
  tags: string[]
  category: string
  status?: NewsStatus
  confidence?: NewsConfidence
  importance?: number
}

export interface NewsCategory {
  slug: string
  title: string
  description?: string
  start_date: string
  end_date?: string
  preview?: string
  status?: NewsStatus
  confidence?: NewsConfidence
  importance?: number
}

export interface News extends NewsMeta {
  content: string
}


/* =============================================================================
 * OCS (Original Characters)
 * =============================================================================
 * Original character profiles and documentation.
 * ============================================================================= */

export type OCSStatus = Status
export type OCSConfidence = Confidence

export interface OCSMeta {
  title: string
  subtitle?: string
  preview?: string
  start_date: string
  end_date?: string
  slug: string
  tags: string[]
  category: string
  book: string
  status?: OCSStatus
  confidence?: OCSConfidence
  importance?: number
  cover_image?: string
  state?: ContentState
}

export interface OCSCategory {
  slug: string
  title: string
  description?: string
  start_date: string
  end_date?: string
  preview?: string
  status?: OCSStatus
  confidence?: OCSConfidence
  importance?: number
}


/* =============================================================================
 * VERSE (Poetry)
 * =============================================================================
 * Poetry, verse, and lyrical content.
 * ============================================================================= */

export type VerseStatus = Status
export type VerseConfidence = Confidence

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
  status?: VerseStatus
  confidence?: VerseConfidence
  importance?: number
}

/** Alias for backwards compatibility with existing code using Poem */
export type Poem = Verse


/* =============================================================================
 * RESEARCH
 * =============================================================================
 * Research projects, investigations, and ongoing explorations.
 * ============================================================================= */

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

export type ResearchViewMode = "grid" | "list"


/* =============================================================================
 * PROGYMNASMATA
 * =============================================================================
 * Classical rhetorical exercises in the progymnasmata tradition.
 * ============================================================================= */

export type ProgymnasmataStatus = Status
export type ProgymnasmataConfidence = Confidence

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
  status?: ProgymnasmataStatus
  certainty?: ProgymnasmataConfidence
}


/* =============================================================================
 * SEQUENCES
 * =============================================================================
 * Ordered collections of related posts forming a coherent series.
 * ============================================================================= */

export type SequenceStatus = Status | "Planned"
export type SequenceConfidence = Confidence
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
  status: SequenceStatus
  confidence: SequenceConfidence
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
 * =============================================================================
 * Technical skills and expertise categories for display components.
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
 * =============================================================================
 * Personal book collection and author information.
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

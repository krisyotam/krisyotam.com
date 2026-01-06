/**
 * =============================================================================
 * data.ts
 * =============================================================================
 *
 * Server-side data fetching functions.
 *
 * Reads from content.db SQLite database for all content types.
 * Provides typed access to posts, categories, tags, and sequences.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import Database from 'better-sqlite3'
import path from 'path'
import type { Post, PostsData, CategoryData, CategoriesData, TagData } from '@/lib/types/content'

// Re-export types for external use
export type { Post, PostsData, CategoryData, CategoriesData, TagData }

// =============================================================================
// Database Connection
// =============================================================================

const DB_PATH = path.join(process.cwd(), 'public', 'data', 'content.db')

function getDb(): Database.Database {
  return new Database(DB_PATH, { readonly: true })
}

// =============================================================================
// Types
// =============================================================================

export interface TilEntry {
  title: string
  preview: string
  date: string
  tags: string[]
  category: string
  slug: string
  cover_image: string
  status: string
  confidence: string
  importance: number
  state: string
}

export interface TilData {
  til: TilEntry[]
}

export interface NowEntry {
  title: string
  preview: string
  date: string
  tags: string[]
  category: string
  slug: string
  cover_image: string
  status: string
  confidence: string
  importance: number
  state: string
}

export interface NowData {
  now: NowEntry[]
}

interface DbContentRow {
  id: number
  slug: string
  title: string
  preview: string | null
  cover_image: string | null
  category_slug: string | null
  status: string | null
  confidence: string | null
  importance: number | null
  start_date: string | null
  end_date: string | null
  state: string
  verse_type?: string | null
  collection?: string | null
}

interface DbCategoryRow {
  id: number
  slug: string
  title: string
  preview: string | null
  importance: number
  state: string
  created_at: string
}

interface DbTagRow {
  id: number
  slug: string
  title: string
  preview: string | null
  importance: number
  state: string
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Get tags for a content item by type and ID from universal content_tags table
 */
function getTagsForContentId(db: Database.Database, type: string, contentId: number): string[] {
  const rows = db.prepare(`
    SELECT t.title FROM tags t
    INNER JOIN content_tags ct ON t.id = ct.tag_id
    WHERE ct.content_type = ? AND ct.content_id = ?
  `).all(type, contentId) as { title: string }[]

  return rows.map(r => r.title)
}

/**
 * Convert database row to Post format
 */
function dbRowToPost(db: Database.Database, type: string, row: DbContentRow): Post {
  return {
    title: row.title,
    preview: row.preview || '',
    start_date: row.start_date || '',
    end_date: row.end_date || undefined,
    tags: getTagsForContentId(db, type, row.id),
    category: row.category_slug || '',
    slug: row.slug,
    cover_image: row.cover_image || undefined,
    status: row.status || undefined,
    confidence: row.confidence || undefined,
    importance: row.importance || undefined,
    state: row.state
  }
}

/**
 * Convert database category row to CategoryData format
 */
function dbRowToCategory(row: DbCategoryRow): CategoryData {
  return {
    slug: row.slug,
    title: row.title,
    preview: row.preview || undefined,
    date: row.created_at,
    'show-status': row.state as 'active' | 'hidden',
    status: 'Finished',
    confidence: 'certain',
    importance: row.importance
  }
}

// =============================================================================
// Content Fetching Functions
// =============================================================================

/**
 * Get content by type from database (type-specific table)
 */
export function getContentByType(type: string): Post[] {
  const db = getDb()
  try {
    const rows = db.prepare(`
      SELECT * FROM ${type}
      ORDER BY start_date DESC, title ASC
    `).all() as DbContentRow[]

    return rows.map(row => dbRowToPost(db, type, row))
  } finally {
    db.close()
  }
}

/**
 * Get active content by type
 */
export function getActiveContentByType(type: string): Post[] {
  const db = getDb()
  try {
    const rows = db.prepare(`
      SELECT * FROM ${type}
      WHERE state = 'active'
      ORDER BY start_date DESC, title ASC
    `).all() as DbContentRow[]

    return rows.map(row => dbRowToPost(db, type, row))
  } finally {
    db.close()
  }
}

/**
 * Get essays data
 */
export async function getEssaysData(): Promise<PostsData> {
  return { posts: getContentByType('essays') }
}

/**
 * Get blog data
 */
export async function getBlogData(): Promise<Post[]> {
  return getContentByType('blog')
}

/**
 * Get notes data
 */
export async function getNotesData(): Promise<Post[]> {
  return getContentByType('notes')
}

/**
 * Get papers data
 */
export async function getPapersData(): Promise<Post[]> {
  return getContentByType('papers')
}

/**
 * Get reviews data
 */
export async function getReviewsData(): Promise<Post[]> {
  return getContentByType('reviews')
}

/**
 * Get fiction data
 */
export async function getFictionData(): Promise<Post[]> {
  return getContentByType('fiction')
}

/**
 * Get verse data
 */
export async function getVerseData(): Promise<Post[]> {
  return getContentByType('verse')
}

// =============================================================================
// Verse Type Functions
// =============================================================================

export interface VerseType {
  slug: string
  title: string
  preview: string
  date: string
  status: string
  confidence: string
  importance: number
}

/**
 * Get all verse types (distinct verse_type values from verse table)
 * Returns categories/types used in verse content
 */
export function getVerseTypes(): VerseType[] {
  const db = getDb()
  try {
    // Get distinct verse types with their first occurrence metadata
    const rows = db.prepare(`
      SELECT DISTINCT verse_type, MIN(start_date) as date
      FROM verse
      WHERE verse_type IS NOT NULL AND state = 'active'
      GROUP BY verse_type
      ORDER BY verse_type ASC
    `).all() as { verse_type: string; date: string }[]

    return rows.map(row => ({
      slug: row.verse_type.toLowerCase().replace(/\s+/g, '-'),
      title: row.verse_type,
      preview: `A collection of ${row.verse_type.toLowerCase()} poems`,
      date: row.date || new Date().toISOString().split('T')[0],
      status: 'In Progress',
      confidence: 'likely',
      importance: 7
    }))
  } finally {
    db.close()
  }
}

/**
 * Get verse content by verse_type
 */
export function getVerseByType(verseType: string): Post[] {
  const db = getDb()
  try {
    const rows = db.prepare(`
      SELECT * FROM verse
      WHERE LOWER(REPLACE(verse_type, ' ', '-')) = ? AND state = 'active'
      ORDER BY start_date DESC, title ASC
    `).all(verseType.toLowerCase()) as DbContentRow[]

    return rows.map(row => dbRowToPost(db, 'verse', row))
  } finally {
    db.close()
  }
}

/**
 * Get a single verse item by type and slug
 */
export function getVerseByTypeAndSlug(verseType: string, slug: string): Post | null {
  const db = getDb()
  try {
    const row = db.prepare(`
      SELECT * FROM verse
      WHERE LOWER(REPLACE(verse_type, ' ', '-')) = ?
        AND slug = ?
    `).get(verseType.toLowerCase(), slug) as DbContentRow | undefined

    if (!row) return null
    return dbRowToPost(db, 'verse', row)
  } finally {
    db.close()
  }
}

/**
 * Get verse item with full details including verse_type and collection
 */
export interface VersePost extends Post {
  verse_type: string | null
  collection: string | null
  description?: string
  image?: string
}

export function getVerseContentByTypeAndSlug(verseType: string, slug: string): VersePost | null {
  const db = getDb()
  try {
    const row = db.prepare(`
      SELECT * FROM verse
      WHERE LOWER(REPLACE(verse_type, ' ', '-')) = ?
        AND slug = ?
    `).get(verseType.toLowerCase(), slug) as DbContentRow | undefined

    if (!row) return null

    const post = dbRowToPost(db, 'verse', row)
    return {
      ...post,
      verse_type: row.verse_type || null,
      collection: row.collection || null,
      description: row.preview || undefined,
      image: row.cover_image || undefined
    }
  } finally {
    db.close()
  }
}

/**
 * Get all verse content with verse_type field
 */
export function getAllVerseContent(): VersePost[] {
  const db = getDb()
  try {
    const rows = db.prepare(`
      SELECT * FROM verse
      WHERE state = 'active'
      ORDER BY start_date DESC, title ASC
    `).all() as DbContentRow[]

    return rows.map(row => {
      const post = dbRowToPost(db, 'verse', row)
      return {
        ...post,
        verse_type: row.verse_type || null,
        collection: row.collection || null,
        description: row.preview || undefined,
        image: row.cover_image || undefined
      }
    })
  } finally {
    db.close()
  }
}

/**
 * Get news data
 */
export async function getNewsData(): Promise<Post[]> {
  return getContentByType('news')
}

/**
 * Get progymnasmata data
 */
export async function getProgymnasmataData(): Promise<Post[]> {
  return getContentByType('progymnasmata')
}

/**
 * Get OCs data
 */
export async function getOcsData(): Promise<Post[]> {
  return getContentByType('ocs')
}

// =============================================================================
// Category Functions
// =============================================================================

/**
 * Get all categories
 */
export async function getCategoriesData(): Promise<CategoriesData> {
  const db = getDb()
  try {
    const rows = db.prepare(`
      SELECT * FROM categories
      WHERE state = 'active'
      ORDER BY title ASC
    `).all() as DbCategoryRow[]

    return {
      categories: rows.map(dbRowToCategory)
    }
  } finally {
    db.close()
  }
}

/**
 * Get categories used by a specific content type
 */
export function getCategoriesByContentType(type: string): CategoryData[] {
  const db = getDb()
  try {
    const rows = db.prepare(`
      SELECT DISTINCT c.* FROM categories c
      INNER JOIN ${type} ct ON c.slug = ct.category_slug
      WHERE c.state = 'active'
      ORDER BY c.title ASC
    `).all() as DbCategoryRow[]

    return rows.map(dbRowToCategory)
  } finally {
    db.close()
  }
}

// =============================================================================
// Tag Functions
// =============================================================================

/**
 * Get all tags
 */
export async function getTagsData(): Promise<{ tags: DbTagRow[] }> {
  const db = getDb()
  try {
    const rows = db.prepare(`
      SELECT * FROM tags
      WHERE state = 'active'
      ORDER BY title ASC
    `).all() as DbTagRow[]

    return { tags: rows }
  } finally {
    db.close()
  }
}

/**
 * Get tags used by a specific content type
 */
export function getTagsByContentType(type: string): DbTagRow[] {
  const db = getDb()
  try {
    return db.prepare(`
      SELECT DISTINCT t.* FROM tags t
      INNER JOIN content_tags ct ON t.id = ct.tag_id
      WHERE ct.content_type = ? AND t.state = 'active'
      ORDER BY t.title ASC
    `).all(type) as DbTagRow[]
  } finally {
    db.close()
  }
}

// =============================================================================
// Sequence Functions
// =============================================================================

interface DbSequenceRow {
  id: number
  slug: string
  title: string
  preview: string | null
  cover_url: string | null
  category_slug: string | null
  status: string | null
  confidence: string | null
  importance: number | null
  start_date: string | null
  end_date: string | null
  state: string
}

interface SequencePost {
  content_type: string
  content_slug: string
  position: number
  section_title: string | null
  section_order: number | null
  title?: string
  preview?: string
  status?: string
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
  sections?: { title: string; posts: SequencePost[] }[]
}

/**
 * Helper to get content details from type-specific table
 */
function getContentDetails(db: Database.Database, contentType: string, contentSlug: string): { title?: string; preview?: string; status?: string } {
  try {
    const row = db.prepare(`
      SELECT title, preview, status FROM ${contentType} WHERE slug = ?
    `).get(contentSlug) as { title: string; preview: string | null; status: string | null } | undefined

    if (row) {
      return {
        title: row.title,
        preview: row.preview || undefined,
        status: row.status || undefined
      }
    }
  } catch {
    // Table might not exist for this type
  }
  return {}
}

/**
 * Get all sequences
 */
export async function getSequencesData(): Promise<{ sequences: Sequence[] }> {
  const db = getDb()
  try {
    const rows = db.prepare(`
      SELECT * FROM sequences
      ORDER BY start_date DESC, title ASC
    `).all() as DbSequenceRow[]

    const sequences = rows.map(row => {
      // Get tags
      const tagRows = db.prepare(`
        SELECT t.slug FROM tags t
        INNER JOIN sequence_tags st ON t.id = st.tag_id
        WHERE st.sequence_id = ?
      `).all(row.id) as { slug: string }[]

      // Get posts (basic info from sequence_content)
      const postRows = db.prepare(`
        SELECT
          sc.content_type,
          sc.content_slug,
          sc.position,
          sc.section_title,
          sc.section_order
        FROM sequence_content sc
        WHERE sc.sequence_id = ?
        ORDER BY sc.section_order NULLS FIRST, sc.position ASC
      `).all(row.id) as { content_type: string; content_slug: string; position: number; section_title: string | null; section_order: number | null }[]

      // Enrich posts with content details from type-specific tables
      const enrichedPosts: SequencePost[] = postRows.map(post => {
        const details = getContentDetails(db, post.content_type, post.content_slug)
        return {
          content_type: post.content_type,
          content_slug: post.content_slug,
          position: post.position,
          section_title: post.section_title,
          section_order: post.section_order,
          ...details
        }
      })

      // Check if this is a sectioned sequence
      const hasSections = enrichedPosts.some(p => p.section_title !== null)

      let sections: { title: string; posts: SequencePost[] }[] | undefined
      let flatPosts: SequencePost[] = enrichedPosts

      if (hasSections) {
        // Group posts by section
        const sectionMap = new Map<string, SequencePost[]>()
        for (const post of enrichedPosts) {
          const key = post.section_title || ''
          if (!sectionMap.has(key)) {
            sectionMap.set(key, [])
          }
          sectionMap.get(key)!.push(post)
        }

        sections = Array.from(sectionMap.entries())
          .filter(([title]) => title !== '')
          .map(([title, posts]) => ({ title, posts }))

        flatPosts = [] // Clear flat posts for sectioned sequences
      }

      return {
        slug: row.slug,
        title: row.title,
        preview: row.preview,
        'cover-url': row.cover_url,
        category: row.category_slug,
        status: row.status,
        confidence: row.confidence,
        importance: row.importance,
        start_date: row.start_date,
        end_date: row.end_date,
        state: row.state,
        tags: tagRows.map(t => t.slug),
        posts: flatPosts,
        sections
      }
    })

    return { sequences }
  } finally {
    db.close()
  }
}

/**
 * Get sequence by slug
 */
export async function getSequenceBySlug(slug: string): Promise<Sequence | null> {
  const data = await getSequencesData()
  return data.sequences.find(s => s.slug === slug) || null
}

// =============================================================================
// TIL and Now Functions (from system.db)
// =============================================================================

import {
  getAllTilEntries,
  getAllNowEntries,
  type TilEntry as SystemTilEntry,
  type NowEntry as SystemNowEntry
} from '@/lib/system-db'

/**
 * Get TIL data from system.db
 */
export async function getTilData(): Promise<TilData> {
  try {
    const entries = getAllTilEntries()
    return {
      til: entries.map((e: SystemTilEntry) => ({
        title: e.title,
        preview: e.preview || '',
        date: e.date || '',
        tags: e.tags,
        category: e.category,
        slug: e.slug,
        cover_image: e.coverImage || '',
        status: e.status,
        confidence: e.confidence || '',
        importance: parseInt(String(e.importance)) || 0,
        state: e.state || ''
      }))
    }
  } catch (error) {
    console.error('Error reading TIL from system.db:', error)
    return { til: [] }
  }
}

/**
 * Get Now data from system.db
 */
export async function getNowData(): Promise<NowData> {
  try {
    const entries = getAllNowEntries()
    return {
      now: entries.map((e: SystemNowEntry) => ({
        title: e.title,
        preview: e.preview || '',
        date: e.date || '',
        tags: e.tags,
        category: e.category,
        slug: e.slug,
        cover_image: e.coverImage || '',
        status: e.status,
        confidence: e.confidence || '',
        importance: parseInt(String(e.importance)) || 0,
        state: e.state || ''
      }))
    }
  } catch (error) {
    console.error('Error reading Now from system.db:', error)
    return { now: [] }
  }
}

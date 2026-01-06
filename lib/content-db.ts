/**
 * =============================================================================
 * content-db.ts
 * =============================================================================
 *
 * Database access layer for content.db
 *
 * Provides typed access to all content, categories, tags, and sequences
 * stored in the SQLite database.
 *
 * Usage:
 *   import { getContent, getCategories, getTags } from '@/lib/content-db'
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import Database from 'better-sqlite3'
import path from 'path'

// =============================================================================
// Types
// =============================================================================

export interface Category {
  id: number
  slug: string
  title: string
  preview: string | null
  importance: number
  state: string
  created_at: string
}

export interface Tag {
  id: number
  slug: string
  title: string
  preview: string | null
  importance: number
  state: string
  created_at: string
}

export interface ContentItem {
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
  created_at: string
  updated_at: string
  tags?: Tag[]
}

// Content types with their own tables
const CONTENT_TYPES = [
  'blog', 'essays', 'fiction', 'news', 'notes',
  'ocs', 'papers', 'progymnasmata', 'reviews', 'verse'
]

export interface Sequence {
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
  created_at: string
  updated_at: string
  tags?: Tag[]
  posts?: SequencePost[]
}

export interface SequencePost {
  content_type: string
  content_slug: string
  position: number
  section_title: string | null
  section_order: number | null
  title?: string
  preview?: string
  status?: string
}

// =============================================================================
// Database Connection
// =============================================================================

const DB_PATH = path.join(process.cwd(), 'public', 'data', 'content.db')

function getDb(): Database.Database {
  return new Database(DB_PATH, { readonly: true })
}

// =============================================================================
// Categories
// =============================================================================

/**
 * Get all categories
 */
export function getCategories(): Category[] {
  const db = getDb()
  try {
    return db.prepare(`
      SELECT * FROM categories
      WHERE state = 'active'
      ORDER BY title ASC
    `).all() as Category[]
  } finally {
    db.close()
  }
}

/**
 * Get a category by slug
 */
export function getCategoryBySlug(slug: string): Category | null {
  const db = getDb()
  try {
    return db.prepare(`
      SELECT * FROM categories WHERE slug = ?
    `).get(slug) as Category | null
  } finally {
    db.close()
  }
}

/**
 * Get categories used by a specific content type
 */
export function getCategoriesByContentType(type: string): Category[] {
  const db = getDb()
  try {
    return db.prepare(`
      SELECT DISTINCT c.* FROM categories c
      INNER JOIN ${type} ct ON c.slug = ct.category_slug
      WHERE c.state = 'active'
      ORDER BY c.title ASC
    `).all() as Category[]
  } finally {
    db.close()
  }
}

// =============================================================================
// Tags
// =============================================================================

/**
 * Get all tags
 */
export function getTags(): Tag[] {
  const db = getDb()
  try {
    return db.prepare(`
      SELECT * FROM tags
      WHERE state = 'active'
      ORDER BY title ASC
    `).all() as Tag[]
  } finally {
    db.close()
  }
}

/**
 * Get a tag by slug
 */
export function getTagBySlug(slug: string): Tag | null {
  const db = getDb()
  try {
    return db.prepare(`
      SELECT * FROM tags WHERE slug = ?
    `).get(slug) as Tag | null
  } finally {
    db.close()
  }
}

/**
 * Get tags used by a specific content type
 */
export function getTagsByContentType(type: string): Tag[] {
  const db = getDb()
  try {
    return db.prepare(`
      SELECT DISTINCT t.* FROM tags t
      INNER JOIN content_tags ct ON t.id = ct.tag_id
      WHERE ct.content_type = ? AND t.state = 'active'
      ORDER BY t.title ASC
    `).all(type) as Tag[]
  } finally {
    db.close()
  }
}

/**
 * Get tags for a specific content item by type and id
 */
export function getTagsForContent(type: string, contentId: number): Tag[] {
  const db = getDb()
  try {
    return db.prepare(`
      SELECT t.* FROM tags t
      INNER JOIN content_tags ct ON t.id = ct.tag_id
      WHERE ct.content_type = ? AND ct.content_id = ?
      ORDER BY t.title ASC
    `).all(type, contentId) as Tag[]
  } finally {
    db.close()
  }
}

// =============================================================================
// Content
// =============================================================================

/**
 * Get all content of a specific type (from type-specific table)
 */
export function getContent(type: string): ContentItem[] {
  const db = getDb()
  try {
    const items = db.prepare(`
      SELECT * FROM ${type}
      ORDER BY start_date DESC, title ASC
    `).all() as ContentItem[]

    // Attach tags to each item using universal content_tags table
    const tagStmt = db.prepare(`
      SELECT t.* FROM tags t
      INNER JOIN content_tags ct ON t.id = ct.tag_id
      WHERE ct.content_type = ? AND ct.content_id = ?
    `)

    return items.map(item => ({
      ...item,
      tags: tagStmt.all(type, item.id) as Tag[]
    }))
  } finally {
    db.close()
  }
}

/**
 * Get all active content of a specific type
 */
export function getActiveContent(type: string): ContentItem[] {
  const db = getDb()
  try {
    const items = db.prepare(`
      SELECT * FROM ${type}
      WHERE state = 'active'
      ORDER BY start_date DESC, title ASC
    `).all() as ContentItem[]

    const tagStmt = db.prepare(`
      SELECT t.* FROM tags t
      INNER JOIN content_tags ct ON t.id = ct.tag_id
      WHERE ct.content_type = ? AND ct.content_id = ?
    `)

    return items.map(item => ({
      ...item,
      tags: tagStmt.all(type, item.id) as Tag[]
    }))
  } finally {
    db.close()
  }
}

/**
 * Get content by slug (from type-specific table)
 */
export function getContentBySlug(type: string, slug: string): ContentItem | null {
  const db = getDb()
  try {
    const item = db.prepare(`
      SELECT * FROM ${type} WHERE slug = ?
    `).get(slug) as ContentItem | null

    if (!item) return null

    const tags = db.prepare(`
      SELECT t.* FROM tags t
      INNER JOIN content_tags ct ON t.id = ct.tag_id
      WHERE ct.content_type = ? AND ct.content_id = ?
    `).all(type, item.id) as Tag[]

    return { ...item, tags }
  } finally {
    db.close()
  }
}

/**
 * Get content by category
 */
export function getContentByCategory(type: string, categorySlug: string): ContentItem[] {
  const db = getDb()
  try {
    const items = db.prepare(`
      SELECT * FROM ${type}
      WHERE category_slug = ?
      ORDER BY start_date DESC, title ASC
    `).all(categorySlug) as ContentItem[]

    const tagStmt = db.prepare(`
      SELECT t.* FROM tags t
      INNER JOIN content_tags ct ON t.id = ct.tag_id
      WHERE ct.content_type = ? AND ct.content_id = ?
    `)

    return items.map(item => ({
      ...item,
      tags: tagStmt.all(type, item.id) as Tag[]
    }))
  } finally {
    db.close()
  }
}

/**
 * Get content by tag
 */
export function getContentByTag(type: string, tagSlug: string): ContentItem[] {
  const db = getDb()
  try {
    const items = db.prepare(`
      SELECT c.* FROM ${type} c
      INNER JOIN content_tags ct ON c.id = ct.content_id AND ct.content_type = ?
      INNER JOIN tags t ON ct.tag_id = t.id
      WHERE t.slug = ?
      ORDER BY c.start_date DESC, c.title ASC
    `).all(type, tagSlug) as ContentItem[]

    const tagStmt = db.prepare(`
      SELECT t.* FROM tags t
      INNER JOIN content_tags ct ON t.id = ct.tag_id
      WHERE ct.content_type = ? AND ct.content_id = ?
    `)

    return items.map(item => ({
      ...item,
      tags: tagStmt.all(type, item.id) as Tag[]
    }))
  } finally {
    db.close()
  }
}

/**
 * Get all content (across all types by querying each table)
 */
export function getAllContent(): ContentItem[] {
  const db = getDb()
  try {
    const allItems: ContentItem[] = []

    for (const type of CONTENT_TYPES) {
      const items = db.prepare(`
        SELECT * FROM ${type}
        ORDER BY start_date DESC, title ASC
      `).all() as ContentItem[]

      const tagStmt = db.prepare(`
        SELECT t.* FROM tags t
        INNER JOIN content_tags ct ON t.id = ct.tag_id
        WHERE ct.content_type = ? AND ct.content_id = ?
      `)

      for (const item of items) {
        allItems.push({
          ...item,
          tags: tagStmt.all(type, item.id) as Tag[]
        })
      }
    }

    // Sort by start_date DESC
    return allItems.sort((a, b) => {
      const dateA = a.start_date || ''
      const dateB = b.start_date || ''
      return dateB.localeCompare(dateA)
    })
  } finally {
    db.close()
  }
}

// =============================================================================
// Sequences
// =============================================================================

/**
 * Get all sequences
 */
export function getSequences(): Sequence[] {
  const db = getDb()
  try {
    return db.prepare(`
      SELECT * FROM sequences
      ORDER BY start_date DESC, title ASC
    `).all() as Sequence[]
  } finally {
    db.close()
  }
}

/**
 * Get active sequences
 */
export function getActiveSequences(): Sequence[] {
  const db = getDb()
  try {
    return db.prepare(`
      SELECT * FROM sequences
      WHERE state = 'active'
      ORDER BY start_date DESC, title ASC
    `).all() as Sequence[]
  } finally {
    db.close()
  }
}

/**
 * Helper to get content details from type-specific table
 */
function getContentDetailsForSequence(db: Database.Database, contentType: string, contentSlug: string): { title?: string; preview?: string; status?: string } {
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
 * Get a sequence by slug with its posts
 */
export function getSequenceBySlug(slug: string): Sequence | null {
  const db = getDb()
  try {
    const sequence = db.prepare(`
      SELECT * FROM sequences WHERE slug = ?
    `).get(slug) as Sequence | null

    if (!sequence) return null

    // Get sequence tags
    const tags = db.prepare(`
      SELECT t.* FROM tags t
      INNER JOIN sequence_tags st ON t.id = st.tag_id
      WHERE st.sequence_id = ?
    `).all(sequence.id) as Tag[]

    // Get sequence posts (basic info)
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
    `).all(sequence.id) as { content_type: string; content_slug: string; position: number; section_title: string | null; section_order: number | null }[]

    // Enrich posts with content details from type-specific tables
    const posts: SequencePost[] = postRows.map(post => {
      const details = getContentDetailsForSequence(db, post.content_type, post.content_slug)
      return {
        content_type: post.content_type,
        content_slug: post.content_slug,
        position: post.position,
        section_title: post.section_title,
        section_order: post.section_order,
        ...details
      }
    })

    return { ...sequence, tags, posts }
  } finally {
    db.close()
  }
}

/**
 * Get sequences by category
 */
export function getSequencesByCategory(categorySlug: string): Sequence[] {
  const db = getDb()
  try {
    return db.prepare(`
      SELECT * FROM sequences
      WHERE category_slug = ?
      ORDER BY start_date DESC, title ASC
    `).all(categorySlug) as Sequence[]
  } finally {
    db.close()
  }
}

// =============================================================================
// Statistics
// =============================================================================

/**
 * Get content counts by type (from type-specific tables)
 */
export function getContentCounts(): Record<string, number> {
  const db = getDb()
  try {
    const counts: Record<string, number> = {}

    for (const type of CONTENT_TYPES) {
      const result = db.prepare(`SELECT COUNT(*) as count FROM ${type}`).get() as { count: number }
      counts[type] = result.count
    }

    return counts
  } finally {
    db.close()
  }
}

/**
 * Get total counts
 */
export function getTotalCounts(): { categories: number; tags: number; content: number; sequences: number } {
  const db = getDb()
  try {
    // Sum content from all type-specific tables
    let totalContent = 0
    for (const type of CONTENT_TYPES) {
      const result = db.prepare(`SELECT COUNT(*) as n FROM ${type}`).get() as { n: number }
      totalContent += result.n
    }

    return {
      categories: (db.prepare('SELECT COUNT(*) as n FROM categories').get() as { n: number }).n,
      tags: (db.prepare('SELECT COUNT(*) as n FROM tags').get() as { n: number }).n,
      content: totalContent,
      sequences: (db.prepare('SELECT COUNT(*) as n FROM sequences').get() as { n: number }).n
    }
  } finally {
    db.close()
  }
}

// =============================================================================
// Art Types and Queries
// =============================================================================

export interface ArtItem {
  id: number
  title: string
  description: string | null
  image_url: string | null
  dimension: string | null
  start_date: string | null
  end_date: string | null
  category_slug: string | null
  status: string | null
  confidence: string | null
  importance: number | null
  bio: string | null
  state: string
}

export function getArt(): ArtItem[] {
  const db = getDb()
  try {
    return db.prepare('SELECT * FROM art WHERE state = ? ORDER BY start_date DESC').all('active') as ArtItem[]
  } finally {
    db.close()
  }
}

export function getArtByCategory(categorySlug: string): ArtItem[] {
  const db = getDb()
  try {
    return db.prepare('SELECT * FROM art WHERE category_slug = ? AND state = ? ORDER BY start_date DESC').all(categorySlug, 'active') as ArtItem[]
  } finally {
    db.close()
  }
}

export function getArtById(id: number): ArtItem | null {
  const db = getDb()
  try {
    return db.prepare('SELECT * FROM art WHERE id = ?').get(id) as ArtItem | null
  } finally {
    db.close()
  }
}

// =============================================================================
// Gallery Types and Queries
// =============================================================================

export interface GalleryItem {
  id: number
  title: string
  description: string | null
  image_url: string | null
  dimension: string | null
  start_date: string | null
  end_date: string | null
  category_slug: string | null
  status: string | null
  confidence: string | null
  importance: number | null
  bio: string | null
  state: string
}

export function getGallery(): GalleryItem[] {
  const db = getDb()
  try {
    return db.prepare('SELECT * FROM gallery WHERE state = ? ORDER BY start_date DESC').all('active') as GalleryItem[]
  } finally {
    db.close()
  }
}

export function getGalleryByCategory(categorySlug: string): GalleryItem[] {
  const db = getDb()
  try {
    return db.prepare('SELECT * FROM gallery WHERE category_slug = ? AND state = ? ORDER BY start_date DESC').all(categorySlug, 'active') as GalleryItem[]
  } finally {
    db.close()
  }
}

export function getGalleryById(id: number): GalleryItem | null {
  const db = getDb()
  try {
    return db.prepare('SELECT * FROM gallery WHERE id = ?').get(id) as GalleryItem | null
  } finally {
    db.close()
  }
}

// =============================================================================
// Legacy Compatibility Helpers
// =============================================================================

/**
 * Format content for legacy JSON structure compatibility
 * Converts database fields to match old JSON format
 */
export function formatForLegacy(item: ContentItem): Record<string, unknown> {
  return {
    title: item.title,
    preview: item.preview,
    start_date: item.start_date,
    end_date: item.end_date,
    tags: item.tags?.map(t => t.title) || [],
    category: item.category_slug,
    slug: item.slug,
    cover_image: item.cover_image,
    status: item.status,
    confidence: item.confidence,
    importance: item.importance,
    state: item.state,
    // Verse-specific
    verse_type: item.verse_type,
    collection: item.collection
  }
}

/**
 * Format category for legacy JSON structure
 */
export function formatCategoryForLegacy(cat: Category): Record<string, unknown> {
  return {
    slug: cat.slug,
    title: cat.title,
    preview: cat.preview,
    importance: cat.importance,
    'show-status': cat.state,
    state: cat.state
  }
}

/**
 * Format tag for legacy JSON structure
 */
export function formatTagForLegacy(tag: Tag): Record<string, unknown> {
  return {
    slug: tag.slug,
    title: tag.title,
    preview: tag.preview,
    importance: tag.importance,
    'show-status': tag.state,
    state: tag.state
  }
}

// =============================================================================
// Videos Types and Queries
// =============================================================================

export interface VideoItem {
  id: number
  slug: string
  title: string
  subtitle: string | null
  preview: string | null
  image: string | null
  video: string | null
  category_slug: string | null
  status: string | null
  confidence: string | null
  importance: number | null
  date: string | null
  state: string
  created_at: string
  updated_at: string
  tags?: Tag[]
}

/**
 * Get all videos
 */
export function getVideos(): VideoItem[] {
  const db = getDb()
  try {
    const items = db.prepare(`
      SELECT * FROM videos
      ORDER BY date DESC, title ASC
    `).all() as VideoItem[]

    const tagStmt = db.prepare(`
      SELECT t.* FROM tags t
      INNER JOIN video_tags vt ON t.id = vt.tag_id
      WHERE vt.video_id = ?
    `)

    return items.map(item => ({
      ...item,
      tags: tagStmt.all(item.id) as Tag[]
    }))
  } finally {
    db.close()
  }
}

/**
 * Get active videos
 */
export function getActiveVideos(): VideoItem[] {
  const db = getDb()
  try {
    const items = db.prepare(`
      SELECT * FROM videos
      WHERE state = 'active'
      ORDER BY date DESC, title ASC
    `).all() as VideoItem[]

    const tagStmt = db.prepare(`
      SELECT t.* FROM tags t
      INNER JOIN video_tags vt ON t.id = vt.tag_id
      WHERE vt.video_id = ?
    `)

    return items.map(item => ({
      ...item,
      tags: tagStmt.all(item.id) as Tag[]
    }))
  } finally {
    db.close()
  }
}

/**
 * Get video by slug
 */
export function getVideoBySlug(slug: string): VideoItem | null {
  const db = getDb()
  try {
    const item = db.prepare(`
      SELECT * FROM videos WHERE slug = ?
    `).get(slug) as VideoItem | null

    if (!item) return null

    const tags = db.prepare(`
      SELECT t.* FROM tags t
      INNER JOIN video_tags vt ON t.id = vt.tag_id
      WHERE vt.video_id = ?
    `).all(item.id) as Tag[]

    return { ...item, tags }
  } finally {
    db.close()
  }
}

/**
 * Get videos by category
 */
export function getVideosByCategory(categorySlug: string): VideoItem[] {
  const db = getDb()
  try {
    const items = db.prepare(`
      SELECT * FROM videos
      WHERE category_slug = ? AND state = 'active'
      ORDER BY date DESC, title ASC
    `).all(categorySlug) as VideoItem[]

    const tagStmt = db.prepare(`
      SELECT t.* FROM tags t
      INNER JOIN video_tags vt ON t.id = vt.tag_id
      WHERE vt.video_id = ?
    `)

    return items.map(item => ({
      ...item,
      tags: tagStmt.all(item.id) as Tag[]
    }))
  } finally {
    db.close()
  }
}

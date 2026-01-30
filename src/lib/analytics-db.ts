/**
 * =============================================================================
 * analytics-db.ts
 * =============================================================================
 *
 * Database access layer for analytics.db (likes, comments, views)
 *
 * Unlike other *-db.ts files, this one supports WRITE operations.
 * The database file is mounted from the server via Docker volume.
 *
 * Usage:
 *   import { getLikeCount, addLike, getComments } from '@/lib/analytics-db'
 *
 * @type lib
 * @path src/lib/analytics-db.ts
 * @author Kris Yotam
 * @date 2026-01-29
 * =============================================================================
 */

import Database from 'better-sqlite3'
import path from 'path'
import crypto from 'crypto'

// =============================================================================
// Types
// =============================================================================

export interface Like {
  id: number
  slug: string
  created_at: string
  region: string | null
  ip_hash: string | null
}

export interface Comment {
  id: string
  page_slug: string
  content: string
  user_id: string
  username: string
  avatar_url: string | null
  created_at: string
  edited_at: string | null
  deleted_at: string | null
  parent_id: string | null
}

export interface CommentReaction {
  id: string
  comment_id: string
  user_id: string
  reaction_type: string
}

export interface View {
  id: number
  slug: string
  created_at: string
  region: string | null
  referrer: string | null
}

// =============================================================================
// Database Connection
// =============================================================================

const DB_PATH = path.join(process.cwd(), 'public', 'data', 'analytics.db')

// Check if we're in a valid database state (file exists and has tables)
let dbAvailable: boolean | null = null

function isDatabaseAvailable(): boolean {
  if (dbAvailable !== null) return dbAvailable

  try {
    const fs = require('fs')
    const stats = fs.statSync(DB_PATH)
    if (stats.size === 0) {
      dbAvailable = false
      return false
    }
    // Try to open and check for tables
    const db = new Database(DB_PATH, { readonly: true })
    try {
      db.prepare("SELECT 1 FROM views LIMIT 1").get()
      dbAvailable = true
    } catch {
      dbAvailable = false
    } finally {
      db.close()
    }
  } catch {
    dbAvailable = false
  }
  return dbAvailable
}

function getDb(): Database.Database {
  return new Database(DB_PATH)
}

// =============================================================================
// Likes
// =============================================================================

/**
 * Get total like count for a slug
 */
export function getLikeCount(slug: string): number {
  if (!isDatabaseAvailable()) return 0

  const db = getDb()
  try {
    const result = db.prepare('SELECT COUNT(*) as count FROM likes WHERE slug = ?').get(slug) as { count: number }
    return result.count
  } finally {
    db.close()
  }
}

/**
 * Add a like
 */
export function addLike(slug: string, region?: string | null, ip?: string | null): number {
  if (!isDatabaseAvailable()) return 0

  const db = getDb()
  try {
    const ipHash = ip ? crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16) : null
    db.prepare('INSERT INTO likes (slug, region, ip_hash) VALUES (?, ?, ?)').run(slug, region || null, ipHash)
    const result = db.prepare('SELECT COUNT(*) as count FROM likes WHERE slug = ?').get(slug) as { count: number }
    return result.count
  } finally {
    db.close()
  }
}

/**
 * Check if IP has already liked (using hash)
 */
export function hasLiked(slug: string, ip: string): boolean {
  if (!isDatabaseAvailable()) return false

  const db = getDb()
  try {
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16)
    const result = db.prepare('SELECT 1 FROM likes WHERE slug = ? AND ip_hash = ?').get(slug, ipHash)
    return !!result
  } finally {
    db.close()
  }
}

// =============================================================================
// Comments
// =============================================================================

/**
 * Get paginated comments for a page
 */
export function getComments(pageSlug: string, page: number = 1, perPage: number = 10): {
  comments: Comment[]
  total: number
} {
  if (!isDatabaseAvailable()) return { comments: [], total: 0 }

  const db = getDb()
  try {
    const offset = (page - 1) * perPage

    // Get top-level comments (no parent, not deleted)
    const comments = db.prepare(`
      SELECT * FROM comments
      WHERE page_slug = ? AND parent_id IS NULL AND deleted_at IS NULL
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `).all(pageSlug, perPage, offset) as Comment[]

    // Get total count
    const countResult = db.prepare(`
      SELECT COUNT(*) as count FROM comments
      WHERE page_slug = ? AND parent_id IS NULL AND deleted_at IS NULL
    `).get(pageSlug) as { count: number }

    return { comments, total: countResult.count }
  } finally {
    db.close()
  }
}

/**
 * Get replies for a comment
 */
export function getReplies(parentId: string): Comment[] {
  if (!isDatabaseAvailable()) return []

  const db = getDb()
  try {
    return db.prepare(`
      SELECT * FROM comments
      WHERE parent_id = ? AND deleted_at IS NULL
      ORDER BY created_at ASC
    `).all(parentId) as Comment[]
  } finally {
    db.close()
  }
}

/**
 * Create a comment
 */
export function createComment(data: {
  pageSlug: string
  content: string
  userId: string
  username: string
  avatarUrl?: string | null
  parentId?: string | null
}): Comment | null {
  if (!isDatabaseAvailable()) return null

  const db = getDb()
  try {
    const id = crypto.randomUUID()
    db.prepare(`
      INSERT INTO comments (id, page_slug, content, user_id, username, avatar_url, parent_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, data.pageSlug, data.content, data.userId, data.username, data.avatarUrl || null, data.parentId || null)

    return db.prepare('SELECT * FROM comments WHERE id = ?').get(id) as Comment
  } finally {
    db.close()
  }
}

/**
 * Update a comment
 */
export function updateComment(commentId: string, content: string): Comment | null {
  if (!isDatabaseAvailable()) return null

  const db = getDb()
  try {
    db.prepare(`
      UPDATE comments SET content = ?, edited_at = datetime('now') WHERE id = ?
    `).run(content, commentId)

    return db.prepare('SELECT * FROM comments WHERE id = ?').get(commentId) as Comment | null
  } finally {
    db.close()
  }
}

/**
 * Soft delete a comment
 */
export function deleteComment(commentId: string): boolean {
  if (!isDatabaseAvailable()) return false

  const db = getDb()
  try {
    const result = db.prepare(`
      UPDATE comments SET deleted_at = datetime('now') WHERE id = ?
    `).run(commentId)
    return result.changes > 0
  } finally {
    db.close()
  }
}

/**
 * Get a single comment by ID
 */
export function getComment(commentId: string): Comment | null {
  if (!isDatabaseAvailable()) return null

  const db = getDb()
  try {
    return db.prepare('SELECT * FROM comments WHERE id = ?').get(commentId) as Comment | null
  } finally {
    db.close()
  }
}

// =============================================================================
// Comment Reactions
// =============================================================================

/**
 * Get reactions for comments
 */
export function getCommentReactions(commentIds: string[]): Record<string, Record<string, number>> {
  if (commentIds.length === 0) return {}
  if (!isDatabaseAvailable()) return {}

  const db = getDb()
  try {
    const placeholders = commentIds.map(() => '?').join(',')
    const reactions = db.prepare(`
      SELECT comment_id, reaction_type, COUNT(*) as count
      FROM comment_reactions
      WHERE comment_id IN (${placeholders})
      GROUP BY comment_id, reaction_type
    `).all(...commentIds) as { comment_id: string; reaction_type: string; count: number }[]

    const result: Record<string, Record<string, number>> = {}
    for (const r of reactions) {
      if (!result[r.comment_id]) result[r.comment_id] = {}
      result[r.comment_id][r.reaction_type] = r.count
    }
    return result
  } finally {
    db.close()
  }
}

/**
 * Get user's reactions on comments
 */
export function getUserCommentReactions(commentIds: string[], userId: string): Record<string, string[]> {
  if (commentIds.length === 0) return {}
  if (!isDatabaseAvailable()) return {}

  const db = getDb()
  try {
    const placeholders = commentIds.map(() => '?').join(',')
    const reactions = db.prepare(`
      SELECT comment_id, reaction_type
      FROM comment_reactions
      WHERE comment_id IN (${placeholders}) AND user_id = ?
    `).all(...commentIds, userId) as { comment_id: string; reaction_type: string }[]

    const result: Record<string, string[]> = {}
    for (const r of reactions) {
      if (!result[r.comment_id]) result[r.comment_id] = []
      result[r.comment_id].push(r.reaction_type)
    }
    return result
  } finally {
    db.close()
  }
}

/**
 * Toggle a reaction (add if not exists, remove if exists)
 */
export function toggleCommentReaction(commentId: string, userId: string, reactionType: string): 'added' | 'removed' | null {
  if (!isDatabaseAvailable()) return null

  const db = getDb()
  try {
    const existing = db.prepare(`
      SELECT id FROM comment_reactions WHERE comment_id = ? AND user_id = ? AND reaction_type = ?
    `).get(commentId, userId, reactionType)

    if (existing) {
      db.prepare('DELETE FROM comment_reactions WHERE comment_id = ? AND user_id = ? AND reaction_type = ?')
        .run(commentId, userId, reactionType)
      return 'removed'
    } else {
      const id = crypto.randomUUID()
      db.prepare('INSERT INTO comment_reactions (id, comment_id, user_id, reaction_type) VALUES (?, ?, ?, ?)')
        .run(id, commentId, userId, reactionType)
      return 'added'
    }
  } finally {
    db.close()
  }
}

// =============================================================================
// Views
// =============================================================================

/**
 * Record a page view
 */
export function recordView(slug: string, region?: string | null, referrer?: string | null): void {
  if (!isDatabaseAvailable()) return

  const db = getDb()
  try {
    db.prepare('INSERT INTO views (slug, region, referrer) VALUES (?, ?, ?)').run(slug, region || null, referrer || null)
  } finally {
    db.close()
  }
}

/**
 * Get view count for a slug
 */
export function getViewCount(slug: string): number {
  if (!isDatabaseAvailable()) return 0

  const db = getDb()
  try {
    const result = db.prepare('SELECT COUNT(*) as count FROM views WHERE slug = ?').get(slug) as { count: number }
    return result.count
  } finally {
    db.close()
  }
}

/**
 * Get view counts for multiple slugs
 */
export function getViewCounts(slugs: string[]): Record<string, number> {
  if (slugs.length === 0) return {}

  // Return zeros if database not available (local dev without db)
  if (!isDatabaseAvailable()) {
    const counts: Record<string, number> = {}
    for (const slug of slugs) counts[slug] = 0
    return counts
  }

  const db = getDb()
  try {
    const placeholders = slugs.map(() => '?').join(',')
    const results = db.prepare(`
      SELECT slug, COUNT(*) as count FROM views WHERE slug IN (${placeholders}) GROUP BY slug
    `).all(...slugs) as { slug: string; count: number }[]

    const counts: Record<string, number> = {}
    for (const slug of slugs) counts[slug] = 0
    for (const r of results) counts[r.slug] = r.count
    return counts
  } finally {
    db.close()
  }
}

/**
 * =============================================================================
 * analytics-db.ts
 * =============================================================================
 *
 * Database access layer for analytics (likes, comments, views)
 * Uses Neon Postgres serverless driver for edge-compatible connections.
 *
 * @type lib
 * @path src/lib/analytics-db.ts
 * @author Kris Yotam
 * @date 2026-01-30
 * =============================================================================
 */

import { neon } from '@neondatabase/serverless'
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

function getDb() {
  const url = process.env.NEON_DATABASE_URL
  if (!url) {
    throw new Error('NEON_DATABASE_URL environment variable is not set')
  }
  return neon(url)
}

function isDatabaseAvailable(): boolean {
  return !!process.env.NEON_DATABASE_URL
}

// =============================================================================
// Likes
// =============================================================================

/**
 * Get total like count for a slug
 */
export async function getLikeCount(slug: string): Promise<number> {
  if (!isDatabaseAvailable()) return 0

  const sql = getDb()
  const result = await sql`SELECT COUNT(*)::int as count FROM likes WHERE slug = ${slug}`
  return result[0]?.count ?? 0
}

/**
 * Add a like
 */
export async function addLike(slug: string, region?: string | null, ip?: string | null): Promise<number> {
  if (!isDatabaseAvailable()) return 0

  const sql = getDb()
  const ipHash = ip ? crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16) : null

  await sql`INSERT INTO likes (slug, region, ip_hash) VALUES (${slug}, ${region || null}, ${ipHash})`

  const result = await sql`SELECT COUNT(*)::int as count FROM likes WHERE slug = ${slug}`
  return result[0]?.count ?? 0
}

/**
 * Check if IP has already liked (using hash)
 */
export async function hasLiked(slug: string, ip: string): Promise<boolean> {
  if (!isDatabaseAvailable()) return false

  const sql = getDb()
  const ipHash = crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16)
  const result = await sql`SELECT 1 FROM likes WHERE slug = ${slug} AND ip_hash = ${ipHash} LIMIT 1`
  return result.length > 0
}

// =============================================================================
// Comments
// =============================================================================

/**
 * Get paginated comments for a page
 */
export async function getComments(pageSlug: string, page: number = 1, perPage: number = 10): Promise<{
  comments: Comment[]
  total: number
}> {
  if (!isDatabaseAvailable()) return { comments: [], total: 0 }

  const sql = getDb()
  const offset = (page - 1) * perPage

  const comments = await sql`
    SELECT * FROM comments
    WHERE page_slug = ${pageSlug} AND parent_id IS NULL AND deleted_at IS NULL
    ORDER BY created_at DESC
    LIMIT ${perPage} OFFSET ${offset}
  ` as Comment[]

  const countResult = await sql`
    SELECT COUNT(*)::int as count FROM comments
    WHERE page_slug = ${pageSlug} AND parent_id IS NULL AND deleted_at IS NULL
  `

  return { comments, total: countResult[0]?.count ?? 0 }
}

/**
 * Get replies for a comment
 */
export async function getReplies(parentId: string): Promise<Comment[]> {
  if (!isDatabaseAvailable()) return []

  const sql = getDb()
  return await sql`
    SELECT * FROM comments
    WHERE parent_id = ${parentId} AND deleted_at IS NULL
    ORDER BY created_at ASC
  ` as Comment[]
}

/**
 * Create a comment
 */
export async function createComment(data: {
  pageSlug: string
  content: string
  userId: string
  username: string
  avatarUrl?: string | null
  parentId?: string | null
}): Promise<Comment | null> {
  if (!isDatabaseAvailable()) return null

  const sql = getDb()
  const id = crypto.randomUUID()

  await sql`
    INSERT INTO comments (id, page_slug, content, user_id, username, avatar_url, parent_id)
    VALUES (${id}, ${data.pageSlug}, ${data.content}, ${data.userId}, ${data.username}, ${data.avatarUrl || null}, ${data.parentId || null})
  `

  const result = await sql`SELECT * FROM comments WHERE id = ${id}`
  return result[0] as Comment | null
}

/**
 * Update a comment
 */
export async function updateComment(commentId: string, content: string): Promise<Comment | null> {
  if (!isDatabaseAvailable()) return null

  const sql = getDb()
  await sql`UPDATE comments SET content = ${content}, edited_at = NOW() WHERE id = ${commentId}`

  const result = await sql`SELECT * FROM comments WHERE id = ${commentId}`
  return result[0] as Comment | null
}

/**
 * Soft delete a comment
 */
export async function deleteComment(commentId: string): Promise<boolean> {
  if (!isDatabaseAvailable()) return false

  const sql = getDb()
  const result = await sql`UPDATE comments SET deleted_at = NOW() WHERE id = ${commentId}`
  return (result as any).count > 0
}

/**
 * Get a single comment by ID
 */
export async function getComment(commentId: string): Promise<Comment | null> {
  if (!isDatabaseAvailable()) return null

  const sql = getDb()
  const result = await sql`SELECT * FROM comments WHERE id = ${commentId}`
  return result[0] as Comment | null
}

// =============================================================================
// Comment Reactions
// =============================================================================

/**
 * Get reactions for comments
 */
export async function getCommentReactions(commentIds: string[]): Promise<Record<string, Record<string, number>>> {
  if (commentIds.length === 0 || !isDatabaseAvailable()) return {}

  const sql = getDb()
  const reactions = await sql`
    SELECT comment_id, reaction_type, COUNT(*)::int as count
    FROM comment_reactions
    WHERE comment_id = ANY(${commentIds})
    GROUP BY comment_id, reaction_type
  ` as { comment_id: string; reaction_type: string; count: number }[]

  const result: Record<string, Record<string, number>> = {}
  for (const r of reactions) {
    if (!result[r.comment_id]) result[r.comment_id] = {}
    result[r.comment_id][r.reaction_type] = r.count
  }
  return result
}

/**
 * Get user's reactions on comments
 */
export async function getUserCommentReactions(commentIds: string[], userId: string): Promise<Record<string, string[]>> {
  if (commentIds.length === 0 || !isDatabaseAvailable()) return {}

  const sql = getDb()
  const reactions = await sql`
    SELECT comment_id, reaction_type
    FROM comment_reactions
    WHERE comment_id = ANY(${commentIds}) AND user_id = ${userId}
  ` as { comment_id: string; reaction_type: string }[]

  const result: Record<string, string[]> = {}
  for (const r of reactions) {
    if (!result[r.comment_id]) result[r.comment_id] = []
    result[r.comment_id].push(r.reaction_type)
  }
  return result
}

/**
 * Toggle a reaction (add if not exists, remove if exists)
 */
export async function toggleCommentReaction(commentId: string, userId: string, reactionType: string): Promise<'added' | 'removed' | null> {
  if (!isDatabaseAvailable()) return null

  const sql = getDb()
  const existing = await sql`
    SELECT id FROM comment_reactions
    WHERE comment_id = ${commentId} AND user_id = ${userId} AND reaction_type = ${reactionType}
  `

  if (existing.length > 0) {
    await sql`
      DELETE FROM comment_reactions
      WHERE comment_id = ${commentId} AND user_id = ${userId} AND reaction_type = ${reactionType}
    `
    return 'removed'
  } else {
    const id = crypto.randomUUID()
    await sql`
      INSERT INTO comment_reactions (id, comment_id, user_id, reaction_type)
      VALUES (${id}, ${commentId}, ${userId}, ${reactionType})
    `
    return 'added'
  }
}

// =============================================================================
// Views
// =============================================================================

/**
 * Record a page view
 */
export async function recordView(slug: string, region?: string | null, referrer?: string | null): Promise<void> {
  if (!isDatabaseAvailable()) return

  const sql = getDb()
  await sql`INSERT INTO views (slug, region, referrer) VALUES (${slug}, ${region || null}, ${referrer || null})`
}

/**
 * Get view count for a slug
 */
export async function getViewCount(slug: string): Promise<number> {
  if (!isDatabaseAvailable()) return 0

  const sql = getDb()
  const result = await sql`SELECT COUNT(*)::int as count FROM views WHERE slug = ${slug}`
  return result[0]?.count ?? 0
}

/**
 * Get view counts for multiple slugs
 */
export async function getViewCounts(slugs: string[]): Promise<Record<string, number>> {
  if (slugs.length === 0) return {}
  if (!isDatabaseAvailable()) {
    const counts: Record<string, number> = {}
    for (const slug of slugs) counts[slug] = 0
    return counts
  }

  const sql = getDb()
  const results = await sql`
    SELECT slug, COUNT(*)::int as count
    FROM views
    WHERE slug = ANY(${slugs})
    GROUP BY slug
  ` as { slug: string; count: number }[]

  const counts: Record<string, number> = {}
  for (const slug of slugs) counts[slug] = 0
  for (const r of results) counts[r.slug] = r.count
  return counts
}

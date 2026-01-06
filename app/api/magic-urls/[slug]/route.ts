/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                                                                           ║
 * ║               M A G I C   U R L S   A P I                                 ║
 * ║                                                                           ║
 * ║        Transmuting Bare Slugs into Canonical Paths                        ║
 * ║                                                                           ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║                                                                           ║
 * ║  Author:      Kris Yotam                                                  ║
 * ║  License:     CC-0                                                        ║
 * ║  Created:     2026-01-06                                                  ║
 * ║                                                                           ║
 * ║  Description:                                                             ║
 * ║  This API endpoint receives a bare slug and returns a redirect to the     ║
 * ║  full canonical path if the slug exists in the content database.          ║
 * ║                                                                           ║
 * ║  Usage:                                                                   ║
 * ║    GET /api/magic-urls/my-slug                                            ║
 * ║    → 307 Redirect to /essays/philosophy/my-slug (if found)                ║
 * ║    → 404 Not Found (if not found)                                         ║
 * ║                                                                           ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

/* ═══════════════════════════════════════════════════════════════════════════
 * CONFIGURATION
 * ═══════════════════════════════════════════════════════════════════════════ */

/** Path to the content database */
const DB_PATH = path.join(process.cwd(), 'public', 'data', 'content.db')

/** Content types to search (in priority order) */
const CONTENT_TYPES = [
  'blog',
  'essays',
  'fiction',
  'news',
  'notes',
  'ocs',
  'papers',
  'progymnasmata',
  'reviews',
  'verse',
] as const

/* ═══════════════════════════════════════════════════════════════════════════
 * TYPE DEFINITIONS
 * ═══════════════════════════════════════════════════════════════════════════ */

interface ContentRow {
  slug: string
  category_slug: string | null
  verse_type?: string | null
}

interface RouteParams {
  params: Promise<{ slug: string }>
}

/* ═══════════════════════════════════════════════════════════════════════════
 * SLUG LOOKUP
 * ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Looks up a slug in the content database and returns the full path
 */
function lookupSlug(slug: string): { type: string; category: string; path: string } | null {
  if (!fs.existsSync(DB_PATH)) {
    console.error('Magic URLs API: Database not found at', DB_PATH)
    return null
  }

  let db: Database.Database | null = null

  try {
    db = new Database(DB_PATH, { readonly: true })

    for (const type of CONTENT_TYPES) {
      try {
        // Verse uses verse_type for the URL path, other types use category_slug
        const query = type === 'verse'
          ? `SELECT slug, category_slug, verse_type FROM ${type} WHERE slug = ? LIMIT 1`
          : `SELECT slug, category_slug FROM ${type} WHERE slug = ? LIMIT 1`

        const row = db.prepare(query).get(slug) as ContentRow | undefined

        if (row) {
          // For verse, use verse_type; for others, use category_slug
          const category = type === 'verse'
            ? (row.verse_type || 'uncategorized')
            : (row.category_slug || 'uncategorized')

          return {
            type,
            category,
            path: `/${type}/${category}/${row.slug}`,
          }
        }
      } catch {
        // Table might not exist, continue to next type
      }
    }

    return null
  } catch (err) {
    console.error('Magic URLs API: Error querying database', err)
    return null
  } finally {
    db?.close()
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
 * ROUTE HANDLER
 * ═══════════════════════════════════════════════════════════════════════════ */

export async function GET(
  request: Request,
  { params }: RouteParams
): Promise<NextResponse> {
  const { slug } = await params

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
  }

  const result = lookupSlug(slug)

  if (result) {
    // Found - redirect to the canonical path
    const url = new URL(request.url)
    url.pathname = result.path
    return NextResponse.redirect(url, 307)
  }

  // Not found - redirect to 404 page so not-found.tsx and 404.js take over
  const url = new URL(request.url)
  url.pathname = `/${slug}`
  // Use 307 to preserve the original path for 404.js suggestions
  return NextResponse.redirect(url, 307)
}

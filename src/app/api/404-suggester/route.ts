/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                                                                           ║
 * ║               4 0 4   S U G G E S T E R   A P I                           ║
 * ║                                                                           ║
 * ║        Server-Side Path Collection for the Lost & Wayward                 ║
 * ║                                                                           ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║                                                                           ║
 * ║  Author:      Kris Yotam                                                  ║
 * ║  License:     CC-0                                                        ║
 * ║  Created:     2023-08-20                                                  ║
 * ║  Refactored:  2026-01-06                                                  ║
 * ║                                                                           ║
 * ║  Description:                                                             ║
 * ║  This API endpoint collects all valid paths from the content database     ║
 * ║  and returns them to the client-side 404 suggester script. The paths      ║
 * ║  are used to compute similarity scores and suggest alternatives when      ║
 * ║  a visitor encounters a 404 error.                                        ║
 * ║                                                                           ║
 * ║  Data Sources:                                                            ║
 * ║    • content.db (all content type tables)                                 ║
 * ║    • Static JSON files in /data directory                                 ║
 * ║                                                                           ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import fs from 'fs'
import path from 'path'

/* ═══════════════════════════════════════════════════════════════════════════
 * CONFIGURATION
 * ═══════════════════════════════════════════════════════════════════════════ */

export const dynamic = 'force-dynamic'

/** Path to the content database */
const DB_PATH = path.join(process.cwd(), 'public', 'data', 'content.db')

/** Content types stored in the database */
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

/** A content row from the database */
interface ContentRow {
  slug: string
  category_slug: string | null
}

/** A folder's metadata in the site map */
interface FolderMeta {
  files: string[]
  hasPosts: boolean
  hasTags: boolean
  hasCategories: boolean
}

/** The site map structure */
interface SiteMap {
  rootFiles: string[]
  folders: Record<string, FolderMeta>
}

/** API response structure */
interface ApiResponse {
  paths: string[]
  map: SiteMap
  error?: string
}

/* ═══════════════════════════════════════════════════════════════════════════
 * UTILITY FUNCTIONS
 * ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Converts a string to a URL-safe slug
 */
function slugify(input: string): string {
  return String(input || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/**
 * Safely reads and parses a JSON file
 */
function readJsonSync(filePath: string): unknown {
  try {
    const raw = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(raw)
  } catch {
    return null
  }
}

/**
 * Pushes a path to the array if it's a valid internal path
 */
function pushIfInternal(arr: string[], candidate: string): void {
  if (!candidate || typeof candidate !== 'string') return
  if (candidate.startsWith('/')) {
    arr.push(candidate)
  } else if (/^[a-z0-9\-_/]+$/i.test(candidate)) {
    arr.push(`/${candidate}`)
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
 * DATABASE PATH EXTRACTION
 * ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Extracts paths from the content database
 */
function extractPathsFromDatabase(out: string[]): void {
  if (!fs.existsSync(DB_PATH)) {
    console.warn('404 Suggester API: content.db not found at', DB_PATH)
    return
  }

  let db: Database.Database | null = null

  try {
    db = new Database(DB_PATH, { readonly: true })

    for (const type of CONTENT_TYPES) {
      try {
        const rows = db.prepare(`
          SELECT slug, category_slug
          FROM ${type}
          WHERE slug IS NOT NULL AND slug != ''
        `).all() as ContentRow[]

        for (const row of rows) {
          const slug = row.slug
          const category = row.category_slug || 'uncategorized'

          // Full canonical path: /type/category/slug
          out.push(`/${type}/${category}/${slug}`)

          // Also include type/slug path for convenience
          out.push(`/${type}/${slug}`)

          // And bare slug for magic URL resolution
          out.push(`/${slug}`)
        }
      } catch {
        // Table might not exist, skip silently
      }
    }

    // Extract categories
    try {
      const categories = db.prepare(`
        SELECT slug, title FROM categories WHERE slug IS NOT NULL
      `).all() as { slug: string; title: string }[]

      for (const cat of categories) {
        out.push(`/category/${cat.slug}`)
        out.push(`/categories/${cat.slug}`)
      }
    } catch {
      // Categories table might not exist
    }

    // Extract tags
    try {
      const tags = db.prepare(`
        SELECT slug, title FROM tags WHERE slug IS NOT NULL
      `).all() as { slug: string; title: string }[]

      for (const tag of tags) {
        out.push(`/tag/${tag.slug}`)
        out.push(`/tags/${tag.slug}`)
      }
    } catch {
      // Tags table might not exist
    }
  } catch (err) {
    console.error('404 Suggester API: Error reading database', err)
  } finally {
    db?.close()
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
 * JSON FILE PATH EXTRACTION
 * ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Extracts paths from arbitrary JSON data structures
 */
function extractPathsFromData(
  data: unknown,
  folderName: string | null,
  out: string[]
): void {
  if (!data) return

  const obj = data as Record<string, unknown>

  // Page directory style
  if (Array.isArray(obj.pages)) {
    obj.pages.forEach((p: unknown) => {
      const page = p as Record<string, unknown>
      if (page?.path && typeof page.path === 'string') {
        out.push(page.path)
      }
    })
  }

  // Posts-like structure
  if (Array.isArray(obj.posts)) {
    obj.posts.forEach((post: unknown) => {
      const p = post as Record<string, unknown>
      if (!p) return

      if (p.path && typeof p.path === 'string') {
        pushIfInternal(out, p.path)
      } else if (p.permalink && typeof p.permalink === 'string') {
        pushIfInternal(out, p.permalink)
      } else if (p.slug && typeof p.slug === 'string') {
        const prefix = folderName ? `/${folderName}` : '/blog'
        if (p.category && typeof p.category === 'string') {
          out.push(`${prefix}/${slugify(p.category)}/${p.slug}`)
          out.push(`${prefix}/${p.slug}`)
        } else {
          out.push(`${prefix}/${p.slug}`)
        }
      }
    })
  }

  // Top-level slug/path
  if (obj.slug && typeof obj.slug === 'string') {
    const prefix = folderName ? `/${folderName}` : '/blog'
    if (obj.category && typeof obj.category === 'string') {
      out.push(`${prefix}/${slugify(obj.category)}/${obj.slug}`)
      out.push(`${prefix}/${obj.slug}`)
    } else {
      out.push(`${prefix}/${obj.slug}`)
    }
  }

  if (obj.path && typeof obj.path === 'string') {
    pushIfInternal(out, obj.path)
  }

  // Arrays of generic items
  if (Array.isArray(data)) {
    data.forEach((item: unknown) => {
      const i = item as Record<string, unknown>
      if (!i || typeof i !== 'object') return

      if (i.path && typeof i.path === 'string') {
        pushIfInternal(out, i.path)
      } else if (i.url && typeof i.url === 'string') {
        pushIfInternal(out, i.url)
      } else if (i.permalink && typeof i.permalink === 'string') {
        pushIfInternal(out, i.permalink)
      } else if (i.slug && typeof i.slug === 'string') {
        const prefix = folderName ? `/${folderName}` : '/content'
        if (i.category && typeof i.category === 'string') {
          out.push(`${prefix}/${slugify(i.category)}/${i.slug}`)
          out.push(`${prefix}/${i.slug}`)
        } else {
          out.push(`${prefix}/${i.slug}`)
        }
      }

      if (i.category && typeof i.category === 'string') {
        out.push(`/category/${slugify(i.category)}`)
        if (folderName) out.push(`/${folderName}/category/${slugify(i.category)}`)
      }

      if (i.tags && Array.isArray(i.tags)) {
        i.tags.forEach((t: unknown) => {
          if (typeof t === 'string') {
            out.push(`/tag/${slugify(t)}`)
            if (folderName) out.push(`/${folderName}/tag/${slugify(t)}`)
          }
        })
      }
    })
  }

  // Tags/categories lists
  if (Array.isArray(obj.tags)) {
    obj.tags.forEach((tag: unknown) => {
      const t = tag as Record<string, unknown> | string
      const slug = typeof t === 'string' ? t : (t?.slug || t?.name) as string | undefined
      if (slug) {
        const s = slugify(slug)
        out.push(`/tag/${s}`)
        if (folderName) out.push(`/${folderName}/tag/${s}`)
      }
    })
  }

  if (Array.isArray(obj.categories)) {
    obj.categories.forEach((cat: unknown) => {
      const c = cat as Record<string, unknown> | string
      const slug = typeof c === 'string' ? c : (c?.slug || c?.name) as string | undefined
      if (slug) {
        const s = slugify(slug)
        out.push(`/category/${s}`)
        if (folderName) out.push(`/${folderName}/category/${s}`)
      }
    })
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
 * ROUTE HANDLER
 * ═══════════════════════════════════════════════════════════════════════════ */

export async function GET(): Promise<NextResponse<ApiResponse>> {
  const dataDir = path.join(process.cwd(), 'data')
  const collected: string[] = []

  try {
    // ─────────────────────────────────────────────────────────────────────────
    // Phase I: Extract paths from content.db
    // ─────────────────────────────────────────────────────────────────────────
    extractPathsFromDatabase(collected)

    // ─────────────────────────────────────────────────────────────────────────
    // Phase II: Extract paths from JSON files
    // ─────────────────────────────────────────────────────────────────────────
    const map: SiteMap = { rootFiles: [], folders: {} }

    if (fs.existsSync(dataDir)) {
      const entries = fs.readdirSync(dataDir, { withFileTypes: true })

      // Root-level JSON files
      for (const ent of entries) {
        if (ent.isFile() && ent.name.endsWith('.json')) {
          const filePath = path.join(dataDir, ent.name)
          map.rootFiles.push(ent.name)
          const data = readJsonSync(filePath)
          try {
            extractPathsFromData(data, null, collected)
          } catch {
            // Skip invalid files
          }
        }
      }

      // Subdirectories
      for (const ent of entries) {
        if (!ent.isDirectory()) continue

        const folderName = ent.name
        const folderPath = path.join(dataDir, folderName)
        const subFiles = fs.readdirSync(folderPath, { withFileTypes: true })

        map.folders[folderName] = {
          files: [],
          hasPosts: false,
          hasTags: false,
          hasCategories: false,
        }

        for (const sf of subFiles) {
          if (sf.isFile() && sf.name.endsWith('.json')) {
            map.folders[folderName].files.push(sf.name)

            const lower = sf.name.toLowerCase()
            if (lower.includes('tag')) map.folders[folderName].hasTags = true
            if (lower.includes('category')) map.folders[folderName].hasCategories = true
            if (/post|essay|feed|entries|news|writing|notes|libers/.test(lower)) {
              map.folders[folderName].hasPosts = true
            }

            const filePath = path.join(folderPath, sf.name)
            const data = readJsonSync(filePath)
            try {
              extractPathsFromData(data, folderName, collected)
            } catch {
              // Skip invalid files
            }
          }
        }
      }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Phase III: Deduplicate and normalize
    // ─────────────────────────────────────────────────────────────────────────
    const seen = new Set<string>()
    const unique = collected
      .filter((p) => {
        if (!p || typeof p !== 'string') return false
        const normalized = p.startsWith('/') ? p : `/${p}`
        if (seen.has(normalized)) return false
        seen.add(normalized)
        return true
      })
      .map((s) => (s.startsWith('/') ? s : `/${s}`))

    return NextResponse.json({ paths: unique, map })
  } catch (err) {
    console.error('404 Suggester API: Error', err)
    return NextResponse.json(
      { paths: [], map: { rootFiles: [], folders: {} }, error: String(err) },
      { status: 500 }
    )
  }
}

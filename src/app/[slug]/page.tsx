/**
 * Catch-All Slug Handler
 *
 * With sexy URLs handled by next.config.mjs rewrites and vanity URLs
 * also handled there, this page serves as a fallback:
 * 1. Magic URL redirect (DB lookup) for any slug not in sexy-urls.json
 * 2. 404 for unknown slugs
 */

import { redirect, notFound } from 'next/navigation'
import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const DB_PATH = path.join(process.cwd(), 'public', 'data', 'content.db')

const CONTENT_TYPES = [
  'blog', 'diary', 'essays', 'fiction', 'news', 'notes', 'ocs',
  'papers', 'progymnasmata', 'reviews', 'verse',
] as const

interface ContentRow {
  slug: string
  category_slug: string | null
  verse_type?: string | null
}

function lookupSlug(slug: string): { type: string; category: string; path: string } | null {
  if (!fs.existsSync(DB_PATH)) return null

  let db: Database.Database | null = null
  try {
    db = new Database(DB_PATH, { readonly: true })

    for (const type of CONTENT_TYPES) {
      try {
        const query = type === 'verse'
          ? `SELECT slug, category_slug, verse_type FROM ${type} WHERE slug = ? LIMIT 1`
          : `SELECT slug, category_slug FROM ${type} WHERE slug = ? LIMIT 1`

        const row = db.prepare(query).get(slug) as ContentRow | undefined
        if (row) {
          const category = type === 'verse'
            ? (row.verse_type || 'uncategorized')
            : (row.category_slug || 'uncategorized')
          return { type, category, path: `/${type}/${category}/${row.slug}` }
        }
      } catch { /* table might not exist */ }
    }
    return null
  } catch {
    return null
  } finally {
    db?.close()
  }
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function SlugPage({ params }: PageProps) {
  const { slug } = await params

  // Try magic URL redirect as fallback
  const result = lookupSlug(slug)
  if (result) {
    redirect(result.path)
  }

  notFound()
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params

  const result = lookupSlug(slug)
  if (result) return {}

  return { title: 'Page Not Found' }
}

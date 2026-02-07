/**
 * =============================================================================
 * Dynamic Sitemap
 * =============================================================================
 *
 * Generates a dynamic sitemap from content.db for all content types.
 * Served at /sitemap.xml
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import { MetadataRoute } from 'next'
import Database from 'better-sqlite3'
import path from 'path'
import { siteConfig, contentTypes, type ContentType } from '@/lib/seo'

interface ContentItem {
  slug: string
  category_slug: string | null
  start_date: string | null
  updated_at: string | null
  state: string | null
}

function getContentDb() {
  const dbPath = path.join(process.cwd(), 'public', 'data', 'content.db')
  return new Database(dbPath, { readonly: true })
}

function getContentItems(db: Database.Database, table: string): ContentItem[] {
  try {
    const stmt = db.prepare(`
      SELECT slug, category_slug, start_date, updated_at, state
      FROM ${table}
      WHERE state = 'active'
      ORDER BY start_date DESC
    `)
    return stmt.all() as ContentItem[]
  } catch {
    return []
  }
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return new Date().toISOString()
  try {
    return new Date(dateStr).toISOString()
  } catch {
    return new Date().toISOString()
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const db = getContentDb()
  const entries: MetadataRoute.Sitemap = []

  // Static pages
  const staticPages = [
    { url: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { url: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/now', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: '/essays', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: '/blog', priority: 0.9, changeFrequency: 'daily' as const },
    { url: '/notes', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/papers', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/fiction', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/verse', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/reviews', priority: 0.7, changeFrequency: 'weekly' as const },
    { url: '/library', priority: 0.6, changeFrequency: 'weekly' as const },
    { url: '/film', priority: 0.6, changeFrequency: 'weekly' as const },
    { url: '/anime', priority: 0.6, changeFrequency: 'weekly' as const },
    { url: '/manga', priority: 0.6, changeFrequency: 'weekly' as const },
    { url: '/music', priority: 0.6, changeFrequency: 'weekly' as const },
    { url: '/portfolio', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/contact', priority: 0.5, changeFrequency: 'yearly' as const },
  ]

  for (const page of staticPages) {
    entries.push({
      url: `${siteConfig.url}${page.url}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })
  }

  // Content type index pages
  for (const type of contentTypes) {
    entries.push({
      url: `${siteConfig.url}/${type}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  }

  // Dynamic content from database
  const contentPriorities: Record<ContentType, number> = {
    essays: 0.9,
    blog: 0.8,
    diary: 0.7,
    papers: 0.8,
    notes: 0.7,
    fiction: 0.7,
    verse: 0.7,
    reviews: 0.7,
    news: 0.6,
    ocs: 0.5,
    progymnasmata: 0.6,
  }

  for (const type of contentTypes) {
    const items = getContentItems(db, type)

    for (const item of items) {
      let url: string

      // Handle different URL structures
      if (item.category_slug) {
        url = `${siteConfig.url}/${type}/${item.category_slug}/${item.slug}`
      } else {
        url = `${siteConfig.url}/${type}/${item.slug}`
      }

      entries.push({
        url,
        lastModified: formatDate(item.updated_at || item.start_date),
        changeFrequency: 'monthly',
        priority: contentPriorities[type] || 0.5,
      })
    }
  }

  db.close()

  return entries
}

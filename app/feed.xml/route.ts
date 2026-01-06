/**
 * =============================================================================
 * RSS Feed
 * =============================================================================
 *
 * Generates an RSS feed for content syndication.
 * Served at /feed.xml
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import { NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'
import { siteConfig, contentTypes } from '@/lib/seo'

interface ContentItem {
  slug: string
  title: string
  preview: string | null
  category_slug: string | null
  start_date: string | null
  state: string | null
  content_type: string
}

function getContentDb() {
  const dbPath = path.join(process.cwd(), 'public', 'data', 'content.db')
  return new Database(dbPath, { readonly: true })
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function formatRfc822Date(dateStr: string | null): string {
  if (!dateStr) return new Date().toUTCString()
  try {
    return new Date(dateStr).toUTCString()
  } catch {
    return new Date().toUTCString()
  }
}

export async function GET() {
  const db = getContentDb()
  const items: ContentItem[] = []

  // Fetch recent content from all types
  for (const type of contentTypes) {
    try {
      const stmt = db.prepare(`
        SELECT slug, title, preview, category_slug, start_date, state, '${type}' as content_type
        FROM ${type}
        WHERE state = 'active'
        ORDER BY start_date DESC
        LIMIT 20
      `)
      const typeItems = stmt.all() as ContentItem[]
      items.push(...typeItems)
    } catch {
      // Table might not exist, skip
    }
  }

  db.close()

  // Sort all items by date
  items.sort((a, b) => {
    const dateA = a.start_date ? new Date(a.start_date).getTime() : 0
    const dateB = b.start_date ? new Date(b.start_date).getTime() : 0
    return dateB - dateA
  })

  // Take top 50
  const recentItems = items.slice(0, 50)

  // Build RSS XML
  const rssItems = recentItems.map(item => {
    let url: string
    if (item.category_slug) {
      url = `${siteConfig.url}/${item.content_type}/${item.category_slug}/${item.slug}`
    } else {
      url = `${siteConfig.url}/${item.content_type}/${item.slug}`
    }

    return `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(item.preview || '')}</description>
      <pubDate>${formatRfc822Date(item.start_date)}</pubDate>
      <category>${escapeXml(item.content_type)}</category>
    </item>`
  }).join('\n')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${siteConfig.url}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteConfig.url}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${siteConfig.url}/favicon.png</url>
      <title>${escapeXml(siteConfig.name)}</title>
      <link>${siteConfig.url}</link>
    </image>
    ${rssItems}
  </channel>
</rss>`

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}

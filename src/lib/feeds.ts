/**
 * =============================================================================
 * Feed Generation Library
 * =============================================================================
 *
 * Generates RSS 2.0, Atom 1.0, and JSON Feed 1.1 formats for all content types.
 * Supports both full feeds and scoped feeds per content type.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import Database from 'better-sqlite3'
import path from 'path'
import { siteConfig, contentTypes, type ContentType, getContentTypeLabel } from '@/lib/seo'

// =============================================================================
// Types
// =============================================================================

export interface FeedItem {
  title: string
  link: string
  id: string
  description: string
  pubDate: Date
  type: ContentType
}

interface ContentRow {
  title: string
  slug: string
  category_slug: string | null
  preview: string | null
  start_date: string | null
  state: string | null
}

export type FeedFormat = 'rss' | 'atom' | 'json'

// =============================================================================
// Database Helpers
// =============================================================================

function getContentDb() {
  const dbPath = path.join(process.cwd(), 'public', 'data', 'content.db')
  return new Database(dbPath, { readonly: true })
}

function getContentItems(db: Database.Database, table: string): ContentRow[] {
  try {
    const stmt = db.prepare(`
      SELECT title, slug, category_slug, preview, start_date, state
      FROM ${table}
      WHERE state = 'active'
      ORDER BY start_date DESC
    `)
    return stmt.all() as ContentRow[]
  } catch {
    return []
  }
}

// =============================================================================
// URL Building
// =============================================================================

function buildItemUrl(type: ContentType, item: ContentRow): string {
  if (item.category_slug) {
    return `${siteConfig.url}/${type}/${item.category_slug}/${item.slug}.md`
  }
  return `${siteConfig.url}/${type}/${item.slug}.md`
}

// =============================================================================
// XML Helpers
// =============================================================================

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function formatRfc822(date: Date): string {
  return date.toUTCString()
}

function formatIso8601(date: Date): string {
  return date.toISOString()
}

// =============================================================================
// Feed Data Fetching
// =============================================================================

export function getFeedItems(scope?: ContentType): FeedItem[] {
  const db = getContentDb()
  const items: FeedItem[] = []

  const typesToFetch = scope ? [scope] : contentTypes

  for (const type of typesToFetch) {
    const rows = getContentItems(db, type)

    for (const row of rows) {
      const link = buildItemUrl(type, row)
      items.push({
        title: row.title,
        link,
        id: link,
        description: row.preview || '',
        pubDate: row.start_date ? new Date(row.start_date) : new Date(),
        type,
      })
    }
  }

  db.close()

  // Sort by date descending
  items.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())

  return items
}

// =============================================================================
// RSS 2.0 Generator
// =============================================================================

export function generateRss(items: FeedItem[], scope?: ContentType): string {
  const title = scope
    ? `${siteConfig.name} — ${getContentTypeLabel(scope)}`
    : siteConfig.name
  const description = scope
    ? `${getContentTypeLabel(scope)} from ${siteConfig.name}`
    : siteConfig.description
  const feedUrl = scope
    ? `${siteConfig.url}/feeds/${scope}/rss.xml`
    : `${siteConfig.url}/feeds/rss.xml`

  const rssItems = items
    .map(item => `  <item>
    <title>${escapeXml(item.title)}</title>
    <link>${escapeXml(item.link)}</link>
    <guid isPermaLink="true">${escapeXml(item.id)}</guid>
    <pubDate>${formatRfc822(item.pubDate)}</pubDate>
    <description>${escapeXml(item.description)}</description>
    <category>${escapeXml(item.type)}</category>
  </item>`)
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${escapeXml(title)}</title>
  <link>${siteConfig.url}</link>
  <description>${escapeXml(description)}</description>
  <language>en-us</language>
  <lastBuildDate>${formatRfc822(new Date())}</lastBuildDate>
  <atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>
${rssItems}
</channel>
</rss>`
}

// =============================================================================
// Atom 1.0 Generator
// =============================================================================

export function generateAtom(items: FeedItem[], scope?: ContentType): string {
  const title = scope
    ? `${siteConfig.name} — ${getContentTypeLabel(scope)}`
    : siteConfig.name
  const subtitle = scope
    ? `${getContentTypeLabel(scope)} from ${siteConfig.name}`
    : siteConfig.description
  const feedUrl = scope
    ? `${siteConfig.url}/feeds/${scope}/atom.xml`
    : `${siteConfig.url}/feeds/atom.xml`
  const feedId = scope
    ? `${siteConfig.url}/feeds/${scope}/`
    : `${siteConfig.url}/`

  const atomEntries = items
    .map(item => `  <entry>
    <title>${escapeXml(item.title)}</title>
    <link href="${escapeXml(item.link)}" rel="alternate" type="text/markdown"/>
    <id>${escapeXml(item.id)}</id>
    <published>${formatIso8601(item.pubDate)}</published>
    <updated>${formatIso8601(item.pubDate)}</updated>
    <summary>${escapeXml(item.description)}</summary>
    <category term="${escapeXml(item.type)}" label="${escapeXml(getContentTypeLabel(item.type))}"/>
    <author>
      <name>${escapeXml(siteConfig.author.name)}</name>
      <uri>${siteConfig.author.url}</uri>
    </author>
  </entry>`)
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(title)}</title>
  <subtitle>${escapeXml(subtitle)}</subtitle>
  <link href="${feedUrl}" rel="self" type="application/atom+xml"/>
  <link href="${siteConfig.url}" rel="alternate" type="text/html"/>
  <id>${feedId}</id>
  <updated>${formatIso8601(new Date())}</updated>
  <author>
    <name>${escapeXml(siteConfig.author.name)}</name>
    <uri>${siteConfig.author.url}</uri>
    <email>${siteConfig.author.email}</email>
  </author>
  <generator>Kris Yotam Feed Generator</generator>
${atomEntries}
</feed>`
}

// =============================================================================
// JSON Feed 1.1 Generator
// =============================================================================

export function generateJsonFeed(items: FeedItem[], scope?: ContentType): string {
  const title = scope
    ? `${siteConfig.name} — ${getContentTypeLabel(scope)}`
    : siteConfig.name
  const description = scope
    ? `${getContentTypeLabel(scope)} from ${siteConfig.name}`
    : siteConfig.description
  const feedUrl = scope
    ? `${siteConfig.url}/feeds/${scope}/feed.json`
    : `${siteConfig.url}/feeds/feed.json`

  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title,
    home_page_url: siteConfig.url,
    feed_url: feedUrl,
    description,
    language: 'en-US',
    authors: [
      {
        name: siteConfig.author.name,
        url: siteConfig.author.url,
      },
    ],
    items: items.map(item => ({
      id: item.id,
      url: item.link,
      title: item.title,
      summary: item.description,
      date_published: formatIso8601(item.pubDate),
      tags: [item.type],
      authors: [
        {
          name: siteConfig.author.name,
          url: siteConfig.author.url,
        },
      ],
    })),
  }

  return JSON.stringify(feed, null, 2)
}

// =============================================================================
// Content Type Validation
// =============================================================================

export function isValidContentType(type: string): type is ContentType {
  return (contentTypes as readonly string[]).includes(type)
}

export { contentTypes }

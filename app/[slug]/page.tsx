/**
 * Magic URL & Vanity URL Handler
 *
 * This catch-all route handles:
 * 1. Vanity URLs (/me, /about, etc.) - renders content directly
 * 2. Magic URLs (/my-essay-slug) - redirects to canonical path
 * 3. Unknown slugs - shows 404 page
 */

import { redirect, notFound } from 'next/navigation'
import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

// Import the notes page components for rendering vanity URLs
import NotePageClient from '@/app/(content)/notes/[category]/[slug]/NotePageClient'
import { TOC } from '@/components/core/toc'
import { Sidenotes } from '@/components/core/sidenotes'
import { extractHeadingsFromMDX } from '@/lib/mdx'
import { getContentByType } from '@/lib/data'
import type { NoteMeta } from '@/types/content'

const DB_PATH = path.join(process.cwd(), 'public', 'data', 'content.db')

// Vanity URL mappings - these render content directly (URL stays the same)
const VANITY_URLS: Record<string, { category: string; noteSlug: string }> = {
  'me':     { category: 'on-myself', noteSlug: 'about-kris' },
  'logo':   { category: 'on-myself', noteSlug: 'about-my-logo' },
  'about':  { category: 'website', noteSlug: 'about-this-website' },
  'design': { category: 'website', noteSlug: 'design-of-this-website' },
  'donate': { category: 'website', noteSlug: 'donate' },
  'faq':    { category: 'website', noteSlug: 'faq' },
}

const CONTENT_TYPES = [
  'blog', 'essays', 'fiction', 'news', 'notes', 'ocs',
  'papers', 'progymnasmata', 'reviews', 'verse',
] as const

interface ContentRow {
  slug: string
  category_slug: string | null
  verse_type?: string | null
}

type Status = 'Abandoned' | 'Notes' | 'Draft' | 'In Progress' | 'Finished'
type Confidence = 'impossible' | 'remote' | 'highly unlikely' | 'unlikely' | 'possible' | 'likely' | 'highly likely' | 'certain'

function slugifyCategory(category: string) {
  return category.toLowerCase().replace(/\s+/g, '-')
}

function lookupSlug(slug: string): { type: string; category: string; path: string } | null {
  if (!fs.existsSync(DB_PATH)) {
    return null
  }

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

          return {
            type,
            category,
            path: `/${type}/${category}/${row.slug}`,
          }
        }
      } catch {
        // Table might not exist
      }
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

  // 1. Check if it's a vanity URL - render the note content directly
  const vanity = VANITY_URLS[slug]
  if (vanity) {
    const allNotes = getContentByType('notes')
    const noteData = allNotes.find(n =>
      slugifyCategory(n.category) === vanity.category && n.slug === vanity.noteSlug
    )

    if (noteData) {
      const note: NoteMeta = {
        ...noteData,
        status: (noteData.status || 'Notes') as Status,
        confidence: (noteData.confidence || 'certain') as Confidence,
        importance: noteData.importance ?? 5,
        tags: noteData.tags || []
      }

      const notes: NoteMeta[] = allNotes.map(n => ({
        ...n,
        status: (n.status || 'Notes') as Status,
        confidence: (n.confidence || 'certain') as Confidence,
        importance: n.importance ?? 5,
        tags: n.tags || []
      }))

      const headings = await extractHeadingsFromMDX('notes', vanity.noteSlug, vanity.category)

      const Note = (
        await import(`@/app/(content)/notes/content/${vanity.category}/${vanity.noteSlug}.mdx`)
      ).default

      return (
        <div className="relative min-h-screen bg-background text-foreground pt-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="mb-8">
              <NotePageClient note={note} allNotes={notes} headerOnly={true} />
            </div>
            <main id="content" className="container max-w-[672px] mx-auto px-4">
              {headings.length > 0 && <TOC headings={headings} />}
              <div className="note-content">
                <Note />
              </div>
              <NotePageClient note={note} allNotes={notes} contentOnly={true} />
            </main>
            <Sidenotes containerSelector="#content" />
          </div>
        </div>
      )
    }
  }

  // 2. Check if it's a magic URL - redirect to canonical path
  const result = lookupSlug(slug)
  if (result) {
    redirect(result.path)
  }

  // 3. Not found - show 404 page
  notFound()
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params

  // Vanity URL metadata
  const vanity = VANITY_URLS[slug]
  if (vanity) {
    const allNotes = getContentByType('notes')
    const note = allNotes.find(n =>
      slugifyCategory(n.category) === vanity.category && n.slug === vanity.noteSlug
    )
    if (note) {
      return {
        title: `${note.title} | Kris Yotam`,
        description: note.preview || note.title,
      }
    }
  }

  // Magic URL - metadata won't be used since we redirect
  const result = lookupSlug(slug)
  if (result) {
    return {}
  }

  // 404
  return {
    title: 'Page Not Found | Kris Yotam',
  }
}

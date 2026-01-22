/**
 * =============================================================================
 * populate-frontmatter.ts
 * =============================================================================
 *
 * Script to populate all MDX files with comment headers and YAML frontmatter.
 * Reads metadata from content.db and writes to corresponding MDX files.
 *
 * Usage: npx ts-node scripts/populate-frontmatter.ts
 *
 * @author Kris Yotam
 * @type script
 * @path scripts/populate-frontmatter.ts
 * =============================================================================
 */

import Database from 'better-sqlite3'
import * as fs from 'fs'
import * as path from 'path'

// =============================================================================
// Configuration
// =============================================================================

const DB_PATH = path.join(process.cwd(), 'public', 'data', 'content.db')
const CONTENT_BASE = path.join(process.cwd(), 'src', 'app', '(content)')

const DELIMITER = '# =============================================================================='

// Content types and their directory structures
// Most use category_slug, verse uses verse_type
const CONTENT_TYPES = [
  'essays',
  'blog',
  'notes',
  'papers',
  'reviews',
  'fiction',
  'news',
  'ocs',
  'progymnasmata',
  'verse',
] as const

type ContentType = typeof CONTENT_TYPES[number]

// =============================================================================
// Database Types
// =============================================================================

interface ContentRow {
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
  updated_at: string | null
}

// =============================================================================
// Database Functions
// =============================================================================

function getDb(): Database.Database {
  return new Database(DB_PATH, { readonly: true })
}

function getTagsForContent(db: Database.Database, type: string, contentId: number): string[] {
  const rows = db.prepare(`
    SELECT t.title FROM tags t
    INNER JOIN content_tags ct ON t.id = ct.tag_id
    WHERE ct.content_type = ? AND ct.content_id = ?
  `).all(type, contentId) as { title: string }[]

  return rows.map(r => r.title)
}

function getSequencesForContent(db: Database.Database, type: string, slug: string): string[] {
  const rows = db.prepare(`
    SELECT s.slug FROM sequences s
    INNER JOIN sequence_content sc ON s.id = sc.sequence_id
    WHERE sc.content_type = ? AND sc.content_slug = ?
  `).all(type, slug) as { slug: string }[]

  return rows.map(r => r.slug)
}

function getAllContent(db: Database.Database, type: ContentType): ContentRow[] {
  return db.prepare(`SELECT * FROM ${type}`).all() as ContentRow[]
}

// =============================================================================
// Path Resolution
// =============================================================================

function getSubdirectory(type: ContentType, row: ContentRow): string {
  if (type === 'verse') {
    // Verse uses verse_type, lowercased and hyphenated
    return (row.verse_type ?? '').toLowerCase().replace(/\s+/g, '-')
  }
  // All others use category_slug
  return row.category_slug ?? ''
}

function getMdxFilePath(type: ContentType, row: ContentRow): string {
  const subdir = getSubdirectory(type, row)
  return path.join(CONTENT_BASE, type, 'content', subdir, `${row.slug}.mdx`)
}

function getRelativePath(type: ContentType, row: ContentRow): string {
  const subdir = getSubdirectory(type, row)
  return `src/app/(content)/${type}/content/${subdir}/${row.slug}.mdx`
}

// =============================================================================
// Header & Frontmatter Generation
// =============================================================================

function generateHeader(type: ContentType, row: ContentRow): string {
  const filename = `${row.slug}.mdx`
  const typeName = type.toUpperCase()
  const relativePath = getRelativePath(type, row)

  return `${DELIMITER}
# DOCUMENT: ${filename}
# TYPE:     ${typeName}
#
# RATIONALE:
#   This document uses human-readable YAML front matter as a durable metadata
#   layer. In the event of database loss or corruption, content and metadata
#   can be reconstructed directly from source files.
#
# REQUIREMENTS:
#   - YAML front matter MUST be present
#   - @type @author, and @path MUST be defined
#
# @author Kris Yotam
# @type ${type}
# @path ${relativePath}
${DELIMITER}`
}

function generateFrontmatter(
  type: ContentType,
  row: ContentRow,
  tags: string[],
  sequences: string[]
): string {
  const title = row.title ? `"${row.title.replace(/"/g, '\\"')}"` : '""'
  const description = row.preview ? `"${row.preview.replace(/"/g, '\\"')}"` : ''
  const date = row.start_date ?? ''
  const updated = row.end_date ?? row.updated_at ?? ''
  const status = row.status ?? ''
  const certainty = row.confidence ?? ''
  const importance = row.importance ?? ''
  const category = type === 'verse' ? (row.verse_type ?? '') : (row.category_slug ?? '')
  const cover = row.cover_image ?? ''

  const tagsStr = tags.length > 0 ? `[${tags.join(', ')}]` : '[]'
  const sequencesStr = sequences.length > 0 ? `[${sequences.join(', ')}]` : '[]'

  return `${DELIMITER}
title: ${title}
slug: ${row.slug}
date: ${date}
updated: ${updated}
status: ${status}
certainty: ${certainty}
importance: ${importance}
author: "Kris Yotam"
description: ${description}
tags: ${tagsStr}
category: ${category}
sequences: ${sequencesStr}
cover: ${cover}
${DELIMITER}`
}

// =============================================================================
// File Operations
// =============================================================================

function readExistingContent(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, 'utf-8')
  } catch {
    return null
  }
}

function stripExistingFrontmatter(content: string): string {
  const lines = content.split('\n')
  let delimiterCount = 0
  let contentStartIndex = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    if (line === DELIMITER) {
      delimiterCount++

      if (delimiterCount === 4) {
        contentStartIndex = i + 1
        break
      }
    }
  }

  // If we found all 4 delimiters, strip them
  if (delimiterCount === 4) {
    return lines.slice(contentStartIndex).join('\n').trim()
  }

  // Otherwise return original content (no existing frontmatter)
  return content.trim()
}

function writeFile(filePath: string, content: string): void {
  // Ensure directory exists
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  fs.writeFileSync(filePath, content, 'utf-8')
}

// =============================================================================
// Main Process
// =============================================================================

function processContentType(db: Database.Database, type: ContentType): { success: number; skipped: number; errors: string[] } {
  const rows = getAllContent(db, type)
  let success = 0
  let skipped = 0
  const errors: string[] = []

  for (const row of rows) {
    const filePath = getMdxFilePath(type, row)
    const existingContent = readExistingContent(filePath)

    if (existingContent === null) {
      errors.push(`File not found: ${filePath}`)
      skipped++
      continue
    }

    // Strip any existing frontmatter to get pure content
    const pureContent = stripExistingFrontmatter(existingContent)

    // Get tags and sequences
    const tags = getTagsForContent(db, type, row.id)
    const sequences = getSequencesForContent(db, type, row.slug)

    // Generate header and frontmatter
    const header = generateHeader(type, row)
    const frontmatter = generateFrontmatter(type, row, tags, sequences)

    // Combine: header + blank line + frontmatter + blank line + content
    const fullContent = `${header}\n\n${frontmatter}\n\n${pureContent}\n`

    // Write back
    try {
      writeFile(filePath, fullContent)
      success++
    } catch (err) {
      errors.push(`Failed to write ${filePath}: ${err}`)
    }
  }

  return { success, skipped, errors }
}

function main(): void {
  console.log('='.repeat(78))
  console.log('MDX Frontmatter Population Script')
  console.log('='.repeat(78))
  console.log('')

  const db = getDb()
  let totalSuccess = 0
  let totalSkipped = 0
  const allErrors: string[] = []

  try {
    for (const type of CONTENT_TYPES) {
      console.log(`Processing ${type}...`)
      const result = processContentType(db, type)

      console.log(`  ✓ ${result.success} files updated`)
      if (result.skipped > 0) {
        console.log(`  ⚠ ${result.skipped} files skipped (not found)`)
      }
      if (result.errors.length > 0) {
        result.errors.forEach(e => console.log(`  ✗ ${e}`))
      }

      totalSuccess += result.success
      totalSkipped += result.skipped
      allErrors.push(...result.errors)
    }
  } finally {
    db.close()
  }

  console.log('')
  console.log('='.repeat(78))
  console.log(`COMPLETE: ${totalSuccess} files updated, ${totalSkipped} skipped`)
  if (allErrors.length > 0) {
    console.log(`ERRORS: ${allErrors.length}`)
  }
  console.log('='.repeat(78))
}

// Run
main()

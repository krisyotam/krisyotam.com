#!/usr/bin/env node
/**
 * =============================================================================
 * Register Document Script
 * =============================================================================
 *
 * CLI utility for registering documents (PDFs, EPUBs, ZIPs, CSVs) into the
 * documents table in content.db. Documents live on stargate at /mnt/storage/doc/
 * and are served via nginx at krisyotam.com/doc/*.
 *
 * Usage:
 *   node public/scripts/keep/registerDoc.js [options]
 *
 * Required Options:
 *   --title TITLE          Document title
 *   --file-path PATH       Path relative to /doc/ root (e.g., "media/documents/putnam/2024/putnam-problems-2024.pdf")
 *   --category SLUG        Category slug (e.g., mathematics, military)
 *
 * Optional:
 *   --slug SLUG            URL slug (auto-generated from title if not provided)
 *   --tags TAG1,TAG2       Comma-separated tag slugs
 *   --author NAME          Document author(s)
 *   --source-url URL       Original source URL
 *   --date YYYY-MM-DD      Document date (defaults to today)
 *   --preview TEXT          Short description
 *   --status STATUS        One of: Abandoned, Notes, Draft, In Progress, Finished (default: Finished)
 *   --confidence CERT      One of: certain, highly likely, likely, possible, etc. (default: certain)
 *   --importance N          Number 1-10 (default: 5)
 *   --dry-run              Show what would be inserted without writing
 *   --help                 Show this help message
 *
 * Examples:
 *   node public/scripts/keep/registerDoc.js \
 *     --title "Putnam Problems 2025" \
 *     --file-path "media/documents/putnam/2025/putnam-problems-2025.pdf" \
 *     --category mathematics \
 *     --tags "putnam,competition-mathematics" \
 *     --author "Mathematical Association of America" \
 *     --date "2025-12-01"
 *
 * @type script
 * @path public/scripts/keep/registerDoc.js
 * @data content
 */

const Database = require('better-sqlite3')
const path = require('path')

const DB_PATH = path.join(__dirname, '..', '..', 'data', 'content.db')

// =============================================================================
// Argument parsing
// =============================================================================

function parseArgs(argv) {
  const args = {}
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--help') { args.help = true; continue }
    if (arg === '--dry-run') { args.dryRun = true; continue }
    if (arg.startsWith('--')) {
      const key = arg.slice(2)
      const val = argv[++i]
      if (!val || val.startsWith('--')) {
        console.error(`Missing value for ${arg}`)
        process.exit(1)
      }
      args[key] = val
    }
  }
  return args
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function showHelp() {
  console.log(`
registerDoc.js — Register a document in content.db

Required:
  --title TEXT          Document title
  --file-path PATH     Path relative to /doc/ root
  --category SLUG      Category slug

Optional:
  --slug SLUG          URL slug (auto-generated from title)
  --tags TAG1,TAG2     Comma-separated tag slugs
  --author NAME        Document author(s)
  --source-url URL     Original source URL
  --date YYYY-MM-DD    Document date (default: today)
  --preview TEXT       Short description
  --status STATUS      Editorial status (default: Finished)
  --confidence CERT    Epistemic confidence (default: certain)
  --importance N       Importance 1-10 (default: 5)
  --dry-run            Preview without writing
  --help               Show this message
`)
}

// =============================================================================
// Main
// =============================================================================

function main() {
  const args = parseArgs(process.argv)

  if (args.help) { showHelp(); return }

  // Validate required args
  if (!args.title) { console.error('--title is required'); process.exit(1) }
  if (!args['file-path']) { console.error('--file-path is required'); process.exit(1) }
  if (!args.category) { console.error('--category is required'); process.exit(1) }

  const slug = args.slug || slugify(args.title)
  const filePath = args['file-path']
  const fileType = path.extname(filePath).slice(1).toLowerCase() || 'pdf'
  const title = args.title
  const preview = args.preview || ''
  const category = args.category
  const status = args.status || 'Finished'
  const confidence = args.confidence || 'certain'
  const importance = parseInt(args.importance || '5', 10)
  const startDate = args.date || new Date().toISOString().split('T')[0]
  const author = args.author || null
  const sourceUrl = args['source-url'] || null
  const tags = args.tags ? args.tags.split(',').map(t => t.trim()) : []

  if (args.dryRun) {
    console.log('\n[DRY RUN] Would insert:')
    console.log(`  slug:       ${slug}`)
    console.log(`  title:      ${title}`)
    console.log(`  preview:    ${preview}`)
    console.log(`  category:   ${category}`)
    console.log(`  file_path:  ${filePath}`)
    console.log(`  file_type:  ${fileType}`)
    console.log(`  author:     ${author}`)
    console.log(`  source_url: ${sourceUrl}`)
    console.log(`  start_date: ${startDate}`)
    console.log(`  status:     ${status}`)
    console.log(`  confidence: ${confidence}`)
    console.log(`  importance: ${importance}`)
    console.log(`  tags:       ${tags.join(', ') || '(none)'}`)
    return
  }

  const db = new Database(DB_PATH)

  try {
    // Check slug uniqueness
    const existing = db.prepare('SELECT id FROM documents WHERE slug = ?').get(slug)
    if (existing) {
      console.error(`Document with slug "${slug}" already exists (id: ${existing.id})`)
      process.exit(1)
    }

    // Verify category exists
    const cat = db.prepare('SELECT id FROM categories WHERE slug = ?').get(category)
    if (!cat) {
      console.error(`Category "${category}" not found. Create it first.`)
      process.exit(1)
    }

    // Insert document
    const result = db.prepare(`
      INSERT INTO documents (slug, title, preview, category_slug, status, confidence, importance, start_date, state, file_path, file_type, author, source_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?, ?, ?)
    `).run(slug, title, preview, category, status, confidence, importance, startDate, filePath, fileType, author, sourceUrl)

    const docId = result.lastInsertRowid
    console.log(`Inserted document: ${slug} (id: ${docId})`)

    // Add tags
    for (const tagSlug of tags) {
      const tag = db.prepare('SELECT id FROM tags WHERE slug = ?').get(tagSlug)
      if (!tag) {
        console.warn(`  Warning: tag "${tagSlug}" not found, skipping`)
        continue
      }
      db.prepare('INSERT OR IGNORE INTO content_tags (content_type, content_id, tag_id) VALUES (?, ?, ?)').run('documents', docId, tag.id)
      console.log(`  Tagged: ${tagSlug}`)
    }

    console.log(`\nDone. View at: https://krisyotam.com/${slug}`)
  } finally {
    db.close()
  }
}

main()

#!/usr/bin/env node
/**
 * =============================================================================
 * Sync Content (prebuild)
 * =============================================================================
 *
 * Scans all *.mdx files in src/content/{type}/, parses YAML frontmatter with
 * gray-matter, and upserts into content.db. Runs before every dev/build.
 *
 * - UPDATE existing rows by slug, INSERT new ones
 * - Re-links tags via content_tags join table
 * - Logs orphaned DB entries (rows with no matching file)
 * - Wrapped in a single SQLite transaction for speed
 *
 * Usage:
 *   node public/scripts/keep/syncContent.js [--verbose]
 *
 * @type script
 * @path public/scripts/keep/syncContent.js
 * =============================================================================
 */

const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const matter = require('gray-matter');

const PROJECT_ROOT = path.resolve(__dirname, '..', '..', '..');
const CONTENT_DB = path.join(PROJECT_ROOT, 'public', 'data', 'content.db');
const CONTENT_DIR = path.join(PROJECT_ROOT, 'src', 'content');

const VERBOSE = process.argv.includes('--verbose');

// Content types that live in src/content/ and map to content.db tables
const CONTENT_TYPES = [
  'blog', 'diary', 'essays', 'fiction', 'news',
  'notes', 'ocs', 'papers', 'progymnasmata', 'reviews', 'verse',
];

// Types without status/confidence/importance
const NO_RATINGS_TYPES = ['diary'];

function main() {
  if (!fs.existsSync(CONTENT_DB)) {
    console.error(`[sync] Database not found: ${CONTENT_DB}`);
    process.exit(1);
  }

  const db = new Database(CONTENT_DB);

  // Run everything in a single transaction
  const syncAll = db.transaction(() => {
    let totalUpserted = 0;
    let totalInserted = 0;
    let totalOrphaned = 0;

    for (const type of CONTENT_TYPES) {
      const typeDir = path.join(CONTENT_DIR, type);
      if (!fs.existsSync(typeDir)) {
        if (VERBOSE) console.log(`[sync] No directory for ${type}, skipping`);
        continue;
      }

      // Gather all MDX files for this type
      const files = fs.readdirSync(typeDir).filter(f => f.endsWith('.mdx'));
      const fileSlugs = new Set();

      for (const file of files) {
        const slug = file.replace(/\.mdx$/, '');
        fileSlugs.add(slug);

        const filePath = path.join(typeDir, file);
        const raw = fs.readFileSync(filePath, 'utf8');

        // Parse frontmatter
        const { data: fm } = matter(raw);

        // Skip files with no frontmatter (empty data object)
        if (!fm || Object.keys(fm).length === 0) {
          if (VERBOSE) console.log(`[sync] No frontmatter in ${type}/${slug}, skipping`);
          continue;
        }

        // Check if row exists
        const existing = db.prepare(`SELECT id FROM ${type} WHERE slug = ?`).get(slug);

        if (existing) {
          // UPDATE
          updateRow(db, type, slug, fm);
          totalUpserted++;
        } else {
          // INSERT
          insertRow(db, type, slug, fm);
          totalInserted++;
        }

        // Re-link tags
        if (existing) {
          syncTags(db, type, existing.id, fm.tags || []);
        } else {
          const newRow = db.prepare(`SELECT id FROM ${type} WHERE slug = ?`).get(slug);
          if (newRow) syncTags(db, type, newRow.id, fm.tags || []);
        }
      }

      // Detect orphaned DB entries (in DB but no file)
      try {
        const dbSlugs = db.prepare(`SELECT slug FROM ${type}`).all().map(r => r.slug);
        for (const dbSlug of dbSlugs) {
          if (!fileSlugs.has(dbSlug)) {
            console.log(`[sync] ORPHAN: ${type}/${dbSlug} (in DB but no MDX file)`);
            totalOrphaned++;
          }
        }
      } catch (err) {
        // table might not exist
      }
    }

    console.log(`[sync] Upserted: ${totalUpserted}, Inserted: ${totalInserted}, Orphaned: ${totalOrphaned}`);
  });

  try {
    syncAll();
  } catch (err) {
    console.error(`[sync] Error: ${err.message}`);
    process.exit(1);
  } finally {
    db.close();
  }
}

/**
 * UPDATE an existing row from frontmatter data.
 */
function updateRow(db, type, slug, fm) {
  const sets = [];
  const values = [];

  // Common fields
  if (fm.title !== undefined) { sets.push('title = ?'); values.push(fm.title); }
  if (fm.preview !== undefined) { sets.push('preview = ?'); values.push(fm.preview); }
  if (fm.cover_image !== undefined) { sets.push('cover_image = ?'); values.push(fm.cover_image); }
  if (fm.category !== undefined) { sets.push('category_slug = ?'); values.push(fm.category); }
  if (fm.start_date !== undefined) { sets.push('start_date = ?'); values.push(fm.start_date); }
  if (fm.end_date !== undefined) { sets.push('end_date = ?'); values.push(fm.end_date); }
  if (fm.state !== undefined) { sets.push('state = ?'); values.push(fm.state); }

  // Quality ratings (not for diary)
  if (!NO_RATINGS_TYPES.includes(type)) {
    if (fm.status !== undefined) { sets.push('status = ?'); values.push(fm.status); }
    if (fm.confidence !== undefined) { sets.push('confidence = ?'); values.push(fm.confidence); }
    if (fm.importance !== undefined) { sets.push('importance = ?'); values.push(fm.importance); }
  }

  // Verse-specific
  if (type === 'verse') {
    if (fm.verse_type !== undefined) { sets.push('verse_type = ?'); values.push(fm.verse_type); }
    if (fm.collection !== undefined) { sets.push('collection = ?'); values.push(fm.collection); }
  }

  // Fiction-specific
  if (type === 'fiction') {
    if (fm.collection !== undefined) { sets.push('collection = ?'); values.push(fm.collection); }
  }

  // Always touch updated_at
  sets.push("updated_at = datetime('now')");

  if (sets.length === 0) return;

  values.push(slug);
  db.prepare(`UPDATE ${type} SET ${sets.join(', ')} WHERE slug = ?`).run(...values);

  if (VERBOSE) console.log(`[sync] Updated ${type}/${slug}`);
}

/**
 * INSERT a new row from frontmatter data.
 */
function insertRow(db, type, slug, fm) {
  const columns = ['slug', 'title', 'preview', 'category_slug', 'start_date', 'end_date', 'state'];
  const values = [
    slug,
    fm.title || slug,
    fm.preview || '',
    fm.category || '',
    fm.start_date || '',
    fm.end_date || '',
    fm.state || 'active',
  ];

  // Cover image
  if (fm.cover_image) {
    columns.push('cover_image');
    values.push(fm.cover_image);
  }

  // Quality ratings
  if (!NO_RATINGS_TYPES.includes(type)) {
    columns.push('status', 'confidence', 'importance');
    values.push(fm.status || 'Draft', fm.confidence || 'possible', fm.importance ?? 5);
  }

  // Verse-specific
  if (type === 'verse') {
    if (fm.verse_type) { columns.push('verse_type'); values.push(fm.verse_type); }
    if (fm.collection) { columns.push('collection'); values.push(fm.collection); }
  }

  // Fiction-specific
  if (type === 'fiction') {
    if (fm.collection) { columns.push('collection'); values.push(fm.collection); }
  }

  const placeholders = columns.map(() => '?').join(', ');
  db.prepare(`INSERT INTO ${type} (${columns.join(', ')}) VALUES (${placeholders})`).run(...values);

  console.log(`[sync] Inserted ${type}/${slug}`);
}

/**
 * Sync tags for a content entry: delete old links, insert new ones.
 */
function syncTags(db, contentType, contentId, tags) {
  // Remove existing tag links
  db.prepare('DELETE FROM content_tags WHERE content_type = ? AND content_id = ?')
    .run(contentType, contentId);

  if (!tags || tags.length === 0) return;

  for (const tagSlug of tags) {
    // Find or create the tag
    let tag = db.prepare('SELECT id FROM tags WHERE slug = ?').get(tagSlug);
    if (!tag) {
      const title = tagSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c); // keep lowercase per convention
      db.prepare('INSERT INTO tags (slug, title) VALUES (?, ?)').run(tagSlug, tagSlug);
      tag = db.prepare('SELECT id FROM tags WHERE slug = ?').get(tagSlug);
    }

    if (tag) {
      db.prepare('INSERT OR IGNORE INTO content_tags (content_type, content_id, tag_id) VALUES (?, ?, ?)')
        .run(contentType, contentId, tag.id);
    }
  }
}

main();

#!/usr/bin/env node
/**
 * =============================================================================
 * Generate Metadata Script
 * =============================================================================
 *
 * A CLI utility for applying metadata to content entries. Called by Claude
 * after analyzing content to determine appropriate categories, tags, and
 * quality ratings.
 *
 * Usage:
 *   node public/scripts/keep/generateMetadata.js [options]
 *
 * Required Options:
 *   --type TYPE          Content type (papers, blog, essays, notes, diary,
 *                        progymnasmata, reviews, til, now)
 *   --title TITLE        Post title
 *   --slug SLUG          URL slug (auto-generated if not provided)
 *
 * Content Options:
 *   --preview TEXT       Preview/description text
 *   --category CAT       Category slug
 *   --tags TAG1,TAG2     Comma-separated tags
 *   --date YYYY-MM-DD    Publication date (defaults to today)
 *
 * Quality Ratings (for non-diary types):
 *   --status STATUS      One of: Abandoned, Notes, Draft, In Progress, Finished
 *   --certainty CERT     One of: certain, highly likely, likely, possible,
 *                        unlikely, highly unlikely, remote, impossible
 *   --importance N       Number 1-10
 *
 * Review-specific:
 *   --rating N           Rating 1-10 (for reviews only)
 *
 * Content Body:
 *   --content TEXT       Full content for TIL/Now entries
 *   --content-file PATH  Read content from file
 *
 * Flags:
 *   --state STATE        active or hidden (default: active)
 *   --dry-run            Show what would be created without writing
 *   --help               Show this help message
 *
 * Examples:
 *   # Create a blog post
 *   node generateMetadata.js --type blog --title "My Post" \
 *     --category philosophy --tags "ethics,virtue" \
 *     --status Draft --certainty likely --importance 7
 *
 *   # Create a diary entry (no quality ratings)
 *   node generateMetadata.js --type diary --title "Daily Reflection" \
 *     --category on-myself --tags "reflection,daily"
 *
 *   # Create a TIL entry with content
 *   node generateMetadata.js --type til --title "Git Bisect" \
 *     --content "Today I learned about git bisect..."
 *
 * Author: Kris Yotam
 * =============================================================================
 */

const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

// =============================================================================
// Configuration
// =============================================================================

const PROJECT_ROOT = '/home/krisyotam/dev/krisyotam.com';
const CONTENT_DB = path.join(PROJECT_ROOT, 'public/data/content.db');
const SYSTEM_DB = path.join(PROJECT_ROOT, 'public/data/system.db');
const CONTENT_REPO_DIR = path.join(PROJECT_ROOT, 'src', 'content');

// Valid values for validation
const VALID_TYPES = [
  'papers', 'blog', 'essays', 'notes', 'diary',
  'progymnasmata', 'reviews', 'til', 'now'
];

const VALID_STATES = ['active', 'hidden'];

const VALID_STATUSES = ['Abandoned', 'Notes', 'Draft', 'In Progress', 'Finished'];

const VALID_CERTAINTIES = [
  'certain', 'highly likely', 'likely', 'possible',
  'unlikely', 'highly unlikely', 'remote', 'impossible'
];

// Global categories from CLAUDE.md
const GLOBAL_CATEGORIES = [
  'culture', 'film', 'history', 'literature', 'philosophy',
  'psychology', 'science', 'technology', 'theology',
  'on-myself', 'manuals-of-style', 'website'
];

// Fixed categories for specific types
const PROGYMNASMATA_CATEGORIES = [
  'chreia', 'commonplace', 'comparison', 'confirmation', 'description',
  'encomium', 'fable', 'impersonation', 'introduction-of-a-law', 'maxim',
  'narrative', 'refutation', 'thesis', 'vituperation'
];

const REVIEWS_CATEGORIES = [
  'anime', 'book', 'bookstores', 'film', 'manga', 'television'
];

// Types that use system.db instead of content.db
const SYSTEM_DB_TYPES = ['til', 'now'];

// Types that don't have quality ratings
const NO_RATINGS_TYPES = ['diary', 'til', 'now'];

// =============================================================================
// Helpers
// =============================================================================

/**
 * Convert title to URL-safe slug
 */
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Check if a slug exists in any content table (for global uniqueness)
 * @param {string} slug - The slug to check
 * @returns {object|null} - { type, title } if exists, null if unique
 */
function checkSlugExists(slug) {
  // Check content.db tables
  const contentDb = new Database(CONTENT_DB);
  const contentTables = ['papers', 'blog', 'essays', 'notes', 'diary', 'progymnasmata', 'reviews'];

  for (const table of contentTables) {
    try {
      const row = contentDb.prepare(`SELECT title FROM ${table} WHERE slug = ?`).get(slug);
      if (row) {
        contentDb.close();
        return { type: table, title: row.title };
      }
    } catch (err) {
      // Table might not exist, skip
    }
  }
  contentDb.close();

  // Check system.db tables
  const systemDb = new Database(SYSTEM_DB);
  const systemTables = ['til', 'now'];

  for (const table of systemTables) {
    try {
      const row = systemDb.prepare(`SELECT * FROM ${table} WHERE slug = ?`).get(slug);
      if (row) {
        systemDb.close();
        return { type: table, title: row.title || `${table} entry` };
      }
    } catch (err) {
      // Table might not exist, skip
    }
  }
  systemDb.close();

  return null;
}

/**
 * Get today's date in YYYY-MM-DD format
 */
function getToday() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Get today in MM-DD-YYYY format (for TIL filenames)
 */
function getTodayFormatted() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  return `${month}-${day}-${year}`;
}

/**
 * Get current month in MM-YYYY format (for Now filenames)
 */
function getCurrentMonth() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${month}-${year}`;
}

/**
 * Parse command line arguments into an object
 */
function parseArgs(args) {
  const result = {
    type: null,
    title: null,
    slug: null,
    preview: null,
    category: null,
    tags: [],
    date: getToday(),
    status: null,
    certainty: null,
    importance: null,
    rating: null,
    content: null,
    contentFile: null,
    state: 'active',
    dryRun: false,
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const next = args[i + 1];

    switch (arg) {
      case '--type':
        result.type = next;
        i++;
        break;
      case '--title':
        result.title = next;
        i++;
        break;
      case '--slug':
        result.slug = next;
        i++;
        break;
      case '--preview':
        result.preview = next;
        i++;
        break;
      case '--category':
        result.category = next;
        i++;
        break;
      case '--tags':
        result.tags = next ? next.split(',').map(t => t.trim()).filter(t => t) : [];
        i++;
        break;
      case '--date':
        result.date = next;
        i++;
        break;
      case '--status':
        result.status = next;
        i++;
        break;
      case '--certainty':
        result.certainty = next;
        i++;
        break;
      case '--importance':
        result.importance = parseInt(next, 10);
        i++;
        break;
      case '--rating':
        result.rating = parseInt(next, 10);
        i++;
        break;
      case '--content':
        result.content = next;
        i++;
        break;
      case '--content-file':
        result.contentFile = next;
        i++;
        break;
      case '--state':
        result.state = next;
        i++;
        break;
      case '--dry-run':
        result.dryRun = true;
        break;
      case '--help':
        result.help = true;
        break;
    }
  }

  return result;
}

/**
 * Validate parsed arguments
 */
function validateArgs(args) {
  const errors = [];

  // Required fields
  if (!args.type) {
    errors.push('--type is required');
  } else if (!VALID_TYPES.includes(args.type)) {
    errors.push(`Invalid type "${args.type}". Must be one of: ${VALID_TYPES.join(', ')}`);
  }

  // Title required for most types
  if (!args.title && args.type !== 'now') {
    errors.push('--title is required');
  }

  // Validate state
  if (!VALID_STATES.includes(args.state)) {
    errors.push(`Invalid state "${args.state}". Must be one of: ${VALID_STATES.join(', ')}`);
  }

  // Validate category based on type
  if (args.category) {
    if (args.type === 'progymnasmata' && !PROGYMNASMATA_CATEGORIES.includes(args.category)) {
      errors.push(`Invalid progymnasmata category "${args.category}". Must be one of: ${PROGYMNASMATA_CATEGORIES.join(', ')}`);
    } else if (args.type === 'reviews' && !REVIEWS_CATEGORIES.includes(args.category)) {
      errors.push(`Invalid reviews category "${args.category}". Must be one of: ${REVIEWS_CATEGORIES.join(', ')}`);
    } else if (!['progymnasmata', 'reviews', 'til', 'now'].includes(args.type) && !GLOBAL_CATEGORIES.includes(args.category)) {
      errors.push(`Invalid category "${args.category}". Must be one of: ${GLOBAL_CATEGORIES.join(', ')}`);
    }
  }

  // Validate quality ratings for types that need them
  if (!NO_RATINGS_TYPES.includes(args.type)) {
    if (args.status && !VALID_STATUSES.includes(args.status)) {
      errors.push(`Invalid status "${args.status}". Must be one of: ${VALID_STATUSES.join(', ')}`);
    }
    if (args.certainty && !VALID_CERTAINTIES.includes(args.certainty)) {
      errors.push(`Invalid certainty "${args.certainty}". Must be one of: ${VALID_CERTAINTIES.join(', ')}`);
    }
    if (args.importance !== null && (args.importance < 1 || args.importance > 10)) {
      errors.push('Importance must be between 1 and 10');
    }
  }

  // Validate rating for reviews
  if (args.type === 'reviews' && args.rating !== null && (args.rating < 1 || args.rating > 10)) {
    errors.push('Rating must be between 1 and 10');
  }

  return errors;
}

/**
 * Show help message
 */
function showHelp() {
  console.log(`
Generate Metadata Script
========================

Usage: node generateMetadata.js [options]

Required:
  --type TYPE          Content type (papers, blog, essays, notes, diary,
                       progymnasmata, reviews, til, now)
  --title TITLE        Post title (not required for 'now')

Content:
  --preview TEXT       Preview/description text
  --category CAT       Category slug
  --tags TAG1,TAG2     Comma-separated tags
  --date YYYY-MM-DD    Publication date (default: today)
  --slug SLUG          URL slug (auto-generated from title if not provided)

Quality Ratings (for papers, blog, essays, notes, progymnasmata, reviews):
  --status STATUS      Abandoned | Notes | Draft | In Progress | Finished
  --certainty CERT     certain | highly likely | likely | possible |
                       unlikely | highly unlikely | remote | impossible
  --importance N       1-10

Reviews Only:
  --rating N           Rating 1-10

TIL/Now Only:
  --content TEXT       Full content body
  --content-file PATH  Read content from file

Flags:
  --state STATE        active | hidden (default: active)
  --dry-run            Preview without writing
  --help               Show this help

Categories:
  Global: ${GLOBAL_CATEGORIES.join(', ')}
  Progymnasmata: ${PROGYMNASMATA_CATEGORIES.join(', ')}
  Reviews: ${REVIEWS_CATEGORIES.join(', ')}
`);
}

// =============================================================================
// Database Operations
// =============================================================================

/**
 * Get or create a tag, returning its ID
 * @param {Database} db - Database connection
 * @param {string} tagName - Tag name (will be slugified)
 * @param {boolean} dryRun - If true, don't actually insert
 * @returns {number|null} Tag ID or null for dry run
 */
function getOrCreateTag(db, tagName, dryRun) {
  const slug = slugify(tagName);
  const title = tagName.trim();

  // Check if tag exists
  const existing = db.prepare('SELECT id FROM tags WHERE slug = ?').get(slug);
  if (existing) {
    return existing.id;
  }

  if (dryRun) {
    console.log(`[DRY RUN] Would create tag: "${title}" (${slug})`);
    return null;
  }

  // Create the tag
  const result = db.prepare('INSERT INTO tags (slug, title) VALUES (?, ?)').run(slug, title);
  console.log(`  ✓ Created tag: "${title}"`);
  return result.lastInsertRowid;
}

/**
 * Link content to tags via content_tags join table
 * @param {Database} db - Database connection
 * @param {string} contentType - Type of content (blog, notes, etc.)
 * @param {number} contentId - ID of the content entry
 * @param {string[]} tags - Array of tag names
 * @param {boolean} dryRun - If true, don't actually insert
 */
function linkTags(db, contentType, contentId, tags, dryRun) {
  if (!tags || tags.length === 0) return;

  for (const tag of tags) {
    const tagId = getOrCreateTag(db, tag, dryRun);
    if (tagId === null && !dryRun) continue;

    if (dryRun) {
      console.log(`[DRY RUN] Would link ${contentType}:${contentId} to tag "${tag}"`);
    } else {
      try {
        db.prepare('INSERT OR IGNORE INTO content_tags (content_type, content_id, tag_id) VALUES (?, ?, ?)')
          .run(contentType, contentId, tagId);
      } catch (err) {
        console.error(`  Warning: Could not link tag "${tag}": ${err.message}`);
      }
    }
  }
}

/**
 * Insert entry into content.db
 */
function insertContentEntry(args) {
  const db = new Database(CONTENT_DB);

  try {
    // Build column list based on type (tags are handled separately via join table)
    const columns = ['title', 'slug', 'preview', 'category_slug', 'start_date', 'end_date', 'state'];
    const values = [
      args.title,
      args.slug,
      args.preview || '',
      args.category || '',
      args.date,
      args.date,
      args.state,
    ];

    // Add quality ratings for non-diary types
    if (!['diary'].includes(args.type)) {
      columns.push('status', 'confidence', 'importance');
      values.push(args.status || 'Draft', args.certainty || 'possible', args.importance || 5);
    }

    // Add rating for reviews
    if (args.type === 'reviews') {
      columns.push('rating');
      values.push(args.rating || 5);
    }

    const placeholders = columns.map(() => '?').join(', ');
    const sql = `INSERT INTO ${args.type} (${columns.join(', ')}) VALUES (${placeholders})`;

    if (args.dryRun) {
      console.log('[DRY RUN] Would execute:', sql);
      console.log('[DRY RUN] With values:', values);
      // Still show tag operations in dry run
      if (args.tags && args.tags.length > 0) {
        linkTags(db, args.type, 0, args.tags, true);
      }
      return true;
    }

    const result = db.prepare(sql).run(...values);
    const contentId = result.lastInsertRowid;
    console.log(`✓ Inserted entry into ${args.type} table (id: ${contentId})`);

    // Link tags via join table
    if (args.tags && args.tags.length > 0) {
      linkTags(db, args.type, contentId, args.tags, false);
      console.log(`✓ Linked ${args.tags.length} tags`);
    }

    return true;
  } catch (err) {
    console.error(`✗ Database error: ${err.message}`);
    return false;
  } finally {
    db.close();
  }
}

/**
 * Insert entry into system.db (for TIL/Now)
 */
function insertSystemEntry(args) {
  const db = new Database(SYSTEM_DB);

  try {
    let sql, values;

    if (args.type === 'til') {
      sql = 'INSERT INTO til (title, date, slug) VALUES (?, ?, ?)';
      values = [args.title, args.date, args.slug];
    } else if (args.type === 'now') {
      sql = 'INSERT INTO now (date, slug) VALUES (?, ?)';
      values = [args.date, args.slug];
    }

    if (args.dryRun) {
      console.log('[DRY RUN] Would execute:', sql);
      console.log('[DRY RUN] With values:', values);
      return true;
    }

    db.prepare(sql).run(...values);
    console.log(`✓ Inserted entry into ${args.type} table (system.db)`);
    return true;
  } catch (err) {
    console.error(`✗ Database error: ${err.message}`);
    return false;
  } finally {
    db.close();
  }
}

// =============================================================================
// File Operations
// =============================================================================

/**
 * Generate MDX frontmatter
 */
function generateFrontmatter(args) {
  // Frontmatter no longer stored in MDX files — metadata lives in content.db.
  // Use public/scripts/keep/export.sh to reconstruct full files from DB when needed.
  return null;
}

/**
 * Create MDX file
 */
function createMdxFile(args) {
  let filePath;
  let content;

  if (args.type === 'til') {
    // TIL: date-based filename, no frontmatter (til lives in site repo, not content repos)
    filePath = path.join(PROJECT_ROOT, 'src/app/(content)/til/content', `${args.slug}.mdx`);
    content = `# ${args.title}\n\n${args.content || 'Content goes here...'}`;
  } else if (args.type === 'now') {
    // Now: month-based filename, no frontmatter (now lives in site repo, not content repos)
    filePath = path.join(PROJECT_ROOT, 'src/app/(content)/now/content', `${args.slug}.mdx`);
    content = args.content || 'Update content goes here...';
  } else {
    // Standard types: flat in src/content/{type}/
    filePath = path.join(CONTENT_REPO_DIR, args.type, `${args.slug}.mdx`);

    content = 'Content goes here...\n';
  }

  if (args.dryRun) {
    console.log('[DRY RUN] Would create file:', filePath);
    console.log('[DRY RUN] Content preview:', content.slice(0, 200) + '...');
    return true;
  }

  // Ensure directory exists
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✓ Created directory: ${dir}`);
  }

  // Write file
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ Created MDX file: ${filePath}`);
  return true;
}

// =============================================================================
// Main
// =============================================================================

function main() {
  const args = parseArgs(process.argv.slice(2));

  // Show help if requested
  if (args.help) {
    showHelp();
    process.exit(0);
  }

  // Validate arguments
  const errors = validateArgs(args);
  if (errors.length > 0) {
    console.error('Validation errors:');
    errors.forEach(e => console.error(`  - ${e}`));
    console.error('\nRun with --help for usage information.');
    process.exit(1);
  }

  // Generate slug if not provided
  if (!args.slug) {
    if (args.type === 'til') {
      args.slug = getTodayFormatted();
    } else if (args.type === 'now') {
      args.slug = getCurrentMonth();
    } else {
      args.slug = slugify(args.title);
    }
  }

  // Check slug uniqueness across all content types
  const existing = checkSlugExists(args.slug);
  if (existing && !args.dryRun) {
    console.error(`\n✗ Slug "${args.slug}" already exists!`);
    console.error(`  Found in: ${existing.type}`);
    console.error(`  Title: "${existing.title}"`);
    console.error('\nSlugs must be globally unique. Please use a more specific slug.');
    console.error('Example: --slug "' + args.slug + '-diary" or similar\n');
    process.exit(1);
  } else if (existing && args.dryRun) {
    console.log(`[DRY RUN] Warning: Slug "${args.slug}" already exists in ${existing.type}`);
  }

  // Load content from file if specified
  if (args.contentFile) {
    try {
      args.content = fs.readFileSync(args.contentFile, 'utf8');
    } catch (err) {
      console.error(`Error reading content file: ${err.message}`);
      process.exit(1);
    }
  }

  console.log('\n=== Generating Metadata ===\n');
  console.log(`Type: ${args.type}`);
  console.log(`Title: ${args.title || '(none)'}`);
  console.log(`Slug: ${args.slug}`);
  console.log(`Category: ${args.category || '(none)'}`);
  console.log(`Tags: ${args.tags.length > 0 ? args.tags.join(', ') : '(none)'}`);
  if (!NO_RATINGS_TYPES.includes(args.type)) {
    console.log(`Status: ${args.status || 'Draft'}`);
    console.log(`Certainty: ${args.certainty || 'possible'}`);
    console.log(`Importance: ${args.importance || 5}`);
  }
  if (args.type === 'reviews') {
    console.log(`Rating: ${args.rating || 5}`);
  }
  console.log(`State: ${args.state}`);
  console.log(`Date: ${args.date}`);
  console.log('');

  // Insert into database
  let dbSuccess;
  if (SYSTEM_DB_TYPES.includes(args.type)) {
    dbSuccess = insertSystemEntry(args);
  } else {
    dbSuccess = insertContentEntry(args);
  }

  if (!dbSuccess && !args.dryRun) {
    console.error('Failed to insert database entry. Aborting.');
    process.exit(1);
  }

  // Create MDX file
  const fileSuccess = createMdxFile(args);

  if (!fileSuccess && !args.dryRun) {
    console.error('Failed to create MDX file.');
    process.exit(1);
  }

  console.log('\n=== Done ===\n');
  if (args.dryRun) {
    console.log('(Dry run - no changes were made)');
  }
}

main();

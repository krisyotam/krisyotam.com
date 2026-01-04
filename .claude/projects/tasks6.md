# content.db Consolidation Plan

## Goal

Consolidate all content JSON files into a single SQLite database (`content.db`) with universal categories and tags.

---

## Current State (from complications.md)

| Metric | Count |
|--------|-------|
| categories.json files | 25 |
| Unique category slugs | 136 |
| **Duplicate category slugs** | 29 |
| tags.json files | 12 |
| Unique tag slugs | 17 |
| **Duplicate tag slugs** | 1 |
| Content files | 20 |
| Content slugs | 226 |
| **Duplicate content slugs** | 0 ✓ |
| Tags used but not defined | 275 |
| Categories used but not defined | 6 |

**Key Finding:** No content slug collisions exist, so content can be consolidated without renaming.

---

## Database Schema

### Table 1: `content`

All posts from all type.json files collapse into one table.

```sql
CREATE TABLE content (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,              -- 'essay', 'blog', 'note', 'paper', 'verse', etc.
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  preview TEXT,
  cover_image TEXT,
  category_slug TEXT,              -- FK to categories.slug
  status TEXT,                     -- 'Finished', 'Notes', 'Draft', 'In Progress'
  confidence TEXT,                 -- 'certain', 'likely', 'possible', 'speculative'
  importance INTEGER,
  start_date TEXT,                 -- ISO date string
  end_date TEXT,
  state TEXT DEFAULT 'active',     -- 'active', 'hidden', 'archived'

  -- Type-specific fields (nullable)
  verse_type TEXT,                 -- For verse: 'haiku', 'sonnet', 'free-verse', etc.
  collection TEXT,                 -- For verse: collection name

  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),

  UNIQUE(type, slug)               -- Slug unique within type
);

CREATE INDEX idx_content_type ON content(type);
CREATE INDEX idx_content_category ON content(category_slug);
CREATE INDEX idx_content_state ON content(state);
CREATE INDEX idx_content_date ON content(start_date DESC);
```

### Table 2: `categories`

Universal categories table. All 25 categories.json files merge into one.

```sql
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  preview TEXT,
  importance INTEGER DEFAULT 5,
  state TEXT DEFAULT 'active',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_categories_slug ON categories(slug);
```

### Table 3: `tags`

Universal tags table. All inline tags and tags.json definitions merge here.

```sql
CREATE TABLE tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  preview TEXT,
  importance INTEGER DEFAULT 5,
  state TEXT DEFAULT 'active',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_tags_slug ON tags(slug);
```

### Table 4: `content_tags`

Many-to-many junction table for content ↔ tags.

```sql
CREATE TABLE content_tags (
  content_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  PRIMARY KEY (content_id, tag_id),
  FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

CREATE INDEX idx_content_tags_content ON content_tags(content_id);
CREATE INDEX idx_content_tags_tag ON content_tags(tag_id);
```

### Table 5: `sequences`

Sequences are curated series of posts with ordering. They reference the universal categories and tags.

```sql
CREATE TABLE sequences (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  preview TEXT,
  cover_url TEXT,
  category_slug TEXT,              -- FK to categories.slug
  status TEXT,
  confidence TEXT,
  importance INTEGER,
  start_date TEXT,
  end_date TEXT,
  state TEXT DEFAULT 'active',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_sequences_slug ON sequences(slug);
CREATE INDEX idx_sequences_category ON sequences(category_slug);
```

### Table 6: `sequence_tags`

Many-to-many junction for sequences ↔ tags.

```sql
CREATE TABLE sequence_tags (
  sequence_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  PRIMARY KEY (sequence_id, tag_id),
  FOREIGN KEY (sequence_id) REFERENCES sequences(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
```

### Table 7: `sequence_content`

Junction table tracking which content belongs to which sequence, with ordering.
Supports both flat sequences and sectioned sequences.

```sql
CREATE TABLE sequence_content (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sequence_id INTEGER NOT NULL,
  content_type TEXT NOT NULL,       -- 'essay', 'note', 'paper', etc. (for lookup)
  content_slug TEXT NOT NULL,       -- Slug of the content item
  position INTEGER NOT NULL,        -- Order within sequence (or section)
  section_title TEXT,               -- NULL for flat sequences, section name for sectioned
  section_order INTEGER,            -- Order of section within sequence (NULL if flat)

  FOREIGN KEY (sequence_id) REFERENCES sequences(id) ON DELETE CASCADE,
  UNIQUE(sequence_id, content_type, content_slug)
);

CREATE INDEX idx_sequence_content_seq ON sequence_content(sequence_id);
CREATE INDEX idx_sequence_content_lookup ON sequence_content(content_type, content_slug);
```

**Why this design for sequence_content:**
- `content_type` + `content_slug` allows referencing content that may not exist yet (planned posts)
- `position` handles ordering within flat sequences or within a section
- `section_title` + `section_order` handles sectioned sequences (like "Higher Order Reason" which has "FOUNDATIONS OF RATIONAL DISCOURSE", "DECISION THEORY AND PRACTICE", etc.)
- Can query "all posts in sequence X" or "all posts in section Y of sequence X"

---

## Migration Strategy

### Phase 1: Create Schema

```bash
sqlite3 data/content.db < schema.sql
```

### Phase 2: Migrate Categories

1. Load all 25 categories.json files
2. For duplicates (29 slugs appear in multiple files):
   - Keep the most complete definition (longest preview, has importance)
   - Log which file was chosen as canonical
3. Insert into `categories` table

### Phase 3: Migrate Tags

1. Collect all tags from:
   - 12 tags.json files (defined tags)
   - All inline tags from content files (275 undefined)
2. Dedupe by slug (normalize: lowercase, hyphenate spaces)
3. For defined tags: use their title/preview
4. For undefined tags: generate title from slug (capitalize, replace hyphens with spaces)
5. Insert into `tags` table

### Phase 4: Migrate Content

For each content file:
1. Load the JSON array
2. For each post:
   - Insert into `content` table with appropriate `type`
   - For each tag in post's `tags` array:
     - Find or create tag in `tags` table
     - Insert into `content_tags` junction

### Phase 5: Migrate Sequences

1. Load sequences.json
2. For each sequence:
   - Insert into `sequences` table
   - Insert sequence tags into `sequence_tags`
   - For flat sequences (have `posts` array):
     - Insert each post into `sequence_content` with `section_title = NULL`
   - For sectioned sequences (have `sections` array):
     - For each section, insert posts with `section_title` and `section_order`

### Phase 6: Validate

Run validation queries:
```sql
-- Orphaned content_tags
SELECT * FROM content_tags WHERE content_id NOT IN (SELECT id FROM content);

-- Orphaned sequence_content
SELECT * FROM sequence_content
WHERE NOT EXISTS (
  SELECT 1 FROM content
  WHERE content.type = sequence_content.content_type
  AND content.slug = sequence_content.content_slug
);

-- Categories referenced but not defined
SELECT DISTINCT category_slug FROM content
WHERE category_slug NOT IN (SELECT slug FROM categories);
```

---

## Handling Duplicates

### Duplicate Categories (29 slugs)

Strategy: **Merge with best definition**

| Duplicate Slug | Files | Resolution |
|---------------|-------|------------|
| `philosophy` | essays, papers, blog, notes, sequences | Keep essays/categories.json (most complete) |
| `mathematics` | blog, notes, sequences | Keep sequences/categories.json (best preview) |
| `on-myself` | blog, notes | Keep blog/categories.json |
| `culture`, `design`, `health`, `lifestyle` | blog, notes | Keep blog/categories.json |
| `internet-mysteries`, `digital-art`, etc. | art, gallery | Keep art/categories.json |
| ... | ... | ... |

Full list in complications.md.

### Duplicate Tags (1 slug)

| Duplicate Slug | Files | Resolution |
|---------------|-------|------------|
| `philosophy` | blog/tags.json, papers/tags.json | Keep papers/tags.json (better preview) |

### Undefined Tags (275)

Strategy: **Auto-generate definitions**

```javascript
function generateTagDefinition(slug) {
  return {
    slug: slug,
    title: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    preview: null,
    importance: 5
  };
}
```

### Undefined Categories (6)

| Category | Used In | Resolution |
|----------|---------|------------|
| photography | gallery | Create new category |
| education | prompts | Create new category |
| gender-studies | sequences | Create new category |
| soul, jazz, fitness | music | Create new categories |

---

## Data Access Layer Changes

### Before (JSON)

```typescript
// lib/essays.ts
export async function getEssays() {
  const data = await import('@/data/essays/essays.json');
  return data.essays;
}

export async function getEssayCategories() {
  const data = await import('@/data/essays/categories.json');
  return data.categories;
}
```

### After (SQLite)

```typescript
// lib/content.ts
import Database from 'better-sqlite3';

const db = new Database('data/content.db', { readonly: true });

export function getContent(type: string) {
  return db.prepare(`
    SELECT c.*, cat.title as category_title
    FROM content c
    LEFT JOIN categories cat ON c.category_slug = cat.slug
    WHERE c.type = ? AND c.state = 'active'
    ORDER BY c.start_date DESC
  `).all(type);
}

export function getContentWithTags(type: string) {
  const content = getContent(type);
  const tagsStmt = db.prepare(`
    SELECT t.slug, t.title FROM tags t
    JOIN content_tags ct ON t.id = ct.tag_id
    WHERE ct.content_id = ?
  `);

  return content.map(item => ({
    ...item,
    tags: tagsStmt.all(item.id)
  }));
}

export function getCategories() {
  return db.prepare(`
    SELECT * FROM categories WHERE state = 'active' ORDER BY title
  `).all();
}

export function getTags() {
  return db.prepare(`
    SELECT * FROM tags WHERE state = 'active' ORDER BY title
  `).all();
}

export function getSequence(slug: string) {
  const seq = db.prepare(`SELECT * FROM sequences WHERE slug = ?`).get(slug);
  if (!seq) return null;

  const posts = db.prepare(`
    SELECT sc.*, c.title, c.preview, c.status
    FROM sequence_content sc
    LEFT JOIN content c ON c.type = sc.content_type AND c.slug = sc.content_slug
    WHERE sc.sequence_id = ?
    ORDER BY sc.section_order NULLS FIRST, sc.position
  `).all(seq.id);

  return { ...seq, posts };
}
```

---

## File Cleanup

### Files to Delete (after migration)

```
data/
├── blog/blog.json          → content table (type='blog')
├── blog/categories.json    → categories table
├── blog/tags.json          → tags table
├── essays/essays.json      → content table (type='essay')
├── essays/categories.json  → categories table
├── essays/tags.json        → tags table
... (all 20 content dirs)
```

### Files to Keep

```
data/
├── content.db              # NEW: All content
├── about/                  # Profile/config (stays JSON)
├── reference/              # Static reference (stays JSON)
├── billboard/              # Year-sharded (stays JSON)
├── family-trees/           # Graph data (stays JSON)
```

---

## Migration Script Outline

```javascript
// scripts/migrate-to-content-db.js

const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const db = new Database('data/content.db');

// 1. Create tables
db.exec(fs.readFileSync('scripts/content-schema.sql', 'utf8'));

// 2. Migrate categories (handling duplicates)
const categoryFiles = glob('data/**/categories.json');
const categoryMap = new Map(); // slug -> best definition

for (const file of categoryFiles) {
  const data = JSON.parse(fs.readFileSync(file));
  for (const cat of data.categories) {
    if (!categoryMap.has(cat.slug) || isBetterDefinition(cat, categoryMap.get(cat.slug))) {
      categoryMap.set(cat.slug, cat);
    }
  }
}

const insertCategory = db.prepare(`
  INSERT INTO categories (slug, title, preview, importance) VALUES (?, ?, ?, ?)
`);

for (const [slug, cat] of categoryMap) {
  insertCategory.run(slug, cat.title, cat.preview, cat.importance || 5);
}

// 3. Migrate tags (defined + undefined)
// ...

// 4. Migrate content
// ...

// 5. Migrate sequences
// ...

db.close();
```

---

## Queries Made Easy

```sql
-- All content tagged "philosophy"
SELECT c.* FROM content c
JOIN content_tags ct ON c.id = ct.content_id
JOIN tags t ON ct.tag_id = t.id
WHERE t.slug = 'philosophy'
ORDER BY c.start_date DESC;

-- Content stats by type
SELECT type, COUNT(*) as count, AVG(importance) as avg_importance
FROM content
GROUP BY type
ORDER BY count DESC;

-- All sequences in "Mathematics" category
SELECT * FROM sequences WHERE category_slug = 'mathematics';

-- Full sequence with posts
SELECT s.title as sequence_title, sc.section_title, sc.position, c.title, c.type
FROM sequences s
JOIN sequence_content sc ON s.id = sc.sequence_id
LEFT JOIN content c ON c.type = sc.content_type AND c.slug = sc.content_slug
WHERE s.slug = 'higher-order-reason'
ORDER BY sc.section_order, sc.position;

-- Tags used across multiple content types
SELECT t.slug, GROUP_CONCAT(DISTINCT c.type) as types, COUNT(*) as usage
FROM tags t
JOIN content_tags ct ON t.id = ct.tag_id
JOIN content c ON ct.content_id = c.id
GROUP BY t.slug
HAVING COUNT(DISTINCT c.type) > 1
ORDER BY usage DESC;
```

---

## Implementation Order

1. **Create schema.sql** with all table definitions
2. **Write migration script** (migrate-to-content-db.js)
3. **Run migration** and generate report
4. **Update data access layer** (lib/content.ts)
5. **Update all page components** to use new API
6. **Test thoroughly**
7. **Delete old JSON files**
8. **Update .gitignore** to track/ignore content.db as needed

---

## Notes on Sequences

The `sequence_content` table design handles both patterns found in sequences.json:

**Flat sequence:**
```json
{
  "slug": "metaethics",
  "posts": [
    { "slug": "is-morality-objective", "order": 1, "type": "essay" },
    { "slug": "emotivism-vs-cognitivism", "order": 2, "type": "essay" }
  ]
}
```
→ Stored with `section_title = NULL`, `section_order = NULL`

**Sectioned sequence:**
```json
{
  "slug": "higher-order-reason",
  "sections": [
    {
      "title": "FOUNDATIONS OF RATIONAL DISCOURSE",
      "posts": [
        { "slug": "steelmanning-and-charity", "order": 1, "type": "essay" }
      ]
    },
    {
      "title": "DECISION THEORY AND PRACTICE",
      "posts": [
        { "slug": "decision-theory-and-altruism", "order": 3, "type": "paper" }
      ]
    }
  ]
}
```
→ Stored with `section_title = "FOUNDATIONS OF RATIONAL DISCOURSE"`, `section_order = 0`, etc.

This allows querying:
- All posts in a sequence (flat view)
- Posts grouped by section (structured view)
- Which sequences contain a given post

# Content Database Migration: JSON → SQLite

## The Problem

Currently, content metadata is scattered across multiple JSON files:

```
data/
├── blog/
│   ├── blog.json        # Array of all blog posts
│   ├── categories.json  # Blog categories
│   └── tags.json        # Blog tags
├── essays/
│   ├── essays.json
│   ├── categories.json
│   └── tags.json
├── notes/
│   ├── notes.json
│   ├── categories.json
│   └── tags.json
... (repeated for every content type)
```

**Why this breaks at scale:**
- `blog.json` with 2000 posts = 1MB+ file loaded entirely into memory
- No indexing: filtering by category means scanning every post
- Duplicate tags/categories across content types
- Adding a new content type means creating 3 new JSON files
- No relational queries: "all posts tagged X across all types" requires loading everything

---

## The Solution: Single SQLite Database

```
data/
└── content.db    # Everything in one file (~5MB for 10,000 posts)
```

SQLite is:
- A single file (git-trackable, portable, backupable)
- Zero configuration, no server
- Handles millions of rows with millisecond queries
- Built-in indexing for fast lookups
- Full SQL power for complex queries

---

## Database Schema

```sql
-- ===========================================
-- POSTS: All content types in one table
-- ===========================================
CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  -- Content type discriminator
  type TEXT NOT NULL,              -- 'blog', 'essay', 'note', 'paper', 'verse', 'fiction', etc.

  -- Core fields (shared across all types)
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  preview TEXT,
  cover_image TEXT,

  -- Dates
  start_date TEXT,                 -- ISO format: '2025-06-23'
  end_date TEXT,

  -- Classification
  category_slug TEXT,              -- FK to categories.slug
  status TEXT,                     -- 'Finished', 'Notes', 'Draft', etc.
  confidence TEXT,                 -- 'certain', 'likely', 'possible', etc.
  importance INTEGER DEFAULT 5,    -- 1-10 scale
  state TEXT DEFAULT 'active'      -- 'active', 'archived', 'hidden'
);

-- Index for common queries
CREATE INDEX idx_posts_type ON posts(type);
CREATE INDEX idx_posts_category ON posts(category_slug);
CREATE INDEX idx_posts_date ON posts(start_date DESC);
CREATE INDEX idx_posts_type_category ON posts(type, category_slug);

-- ===========================================
-- CATEGORIES: Unified across content types
-- ===========================================
CREATE TABLE categories (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  preview TEXT,

  -- Which content type(s) use this category
  -- NULL = universal, 'blog' = blog-only, etc.
  content_type TEXT,

  status TEXT DEFAULT 'Finished',
  confidence TEXT DEFAULT 'certain',
  importance INTEGER DEFAULT 5,
  created_date TEXT
);

CREATE INDEX idx_categories_type ON categories(content_type);

-- ===========================================
-- TAGS: Universal tag registry
-- ===========================================
CREATE TABLE tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL
);

-- ===========================================
-- POST_TAGS: Many-to-many relationship
-- ===========================================
CREATE TABLE post_tags (
  post_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  PRIMARY KEY (post_id, tag_id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

CREATE INDEX idx_post_tags_tag ON post_tags(tag_id);
```

---

## How It Functions

### 1. Reading Content (Build Time or Runtime)

```typescript
import Database from 'better-sqlite3';

const db = new Database('data/content.db', { readonly: true });

// Get all blog posts, sorted by date
const blogPosts = db.prepare(`
  SELECT * FROM posts
  WHERE type = 'blog' AND state = 'active'
  ORDER BY start_date DESC
`).all();

// Get essays in "philosophy" category
const philosophyEssays = db.prepare(`
  SELECT * FROM posts
  WHERE type = 'essay' AND category_slug = 'philosophy'
  ORDER BY importance DESC
`).all();

// Get all content tagged "Ethics" (across ALL types)
const ethicsContent = db.prepare(`
  SELECT p.*, GROUP_CONCAT(t.name) as tags
  FROM posts p
  JOIN post_tags pt ON p.id = pt.post_id
  JOIN tags t ON pt.tag_id = t.id
  WHERE t.name = 'Ethics'
  GROUP BY p.id
`).all();

// Paginated blog listing (page 3, 20 per page)
const page3 = db.prepare(`
  SELECT * FROM posts
  WHERE type = 'blog' AND state = 'active'
  ORDER BY start_date DESC
  LIMIT 20 OFFSET 40
`).all();
```

### 2. Getting Tags for a Post

```typescript
function getPostWithTags(slug: string) {
  const post = db.prepare(`SELECT * FROM posts WHERE slug = ?`).get(slug);

  const tags = db.prepare(`
    SELECT t.name FROM tags t
    JOIN post_tags pt ON t.id = pt.tag_id
    WHERE pt.post_id = ?
  `).all(post.id);

  return { ...post, tags: tags.map(t => t.name) };
}
```

### 3. Category Listings

```typescript
// Get all categories for essays
const essayCategories = db.prepare(`
  SELECT * FROM categories
  WHERE content_type = 'essay' OR content_type IS NULL
  ORDER BY importance DESC
`).all();

// Get category with post count
const categoriesWithCounts = db.prepare(`
  SELECT c.*, COUNT(p.id) as post_count
  FROM categories c
  LEFT JOIN posts p ON p.category_slug = c.slug AND p.type = 'blog'
  WHERE c.content_type = 'blog' OR c.content_type IS NULL
  GROUP BY c.slug
`).all();
```

### 4. Search & Discovery

```typescript
// Full-text search on titles and previews
const results = db.prepare(`
  SELECT * FROM posts
  WHERE (title LIKE ? OR preview LIKE ?)
  AND state = 'active'
  ORDER BY importance DESC
  LIMIT 20
`).all(`%${query}%`, `%${query}%`);

// Related posts (same category, similar tags)
const related = db.prepare(`
  SELECT p2.*, COUNT(pt2.tag_id) as shared_tags
  FROM posts p1
  JOIN post_tags pt1 ON p1.id = pt1.post_id
  JOIN post_tags pt2 ON pt1.tag_id = pt2.tag_id
  JOIN posts p2 ON pt2.post_id = p2.id
  WHERE p1.slug = ? AND p2.slug != ? AND p2.state = 'active'
  GROUP BY p2.id
  ORDER BY shared_tags DESC, p2.importance DESC
  LIMIT 5
`).all(currentSlug, currentSlug);
```

---

## What This Makes Effortless

| Task | Before (JSON) | After (SQLite) |
|------|---------------|----------------|
| List all blog posts | Load entire `blog.json` into memory | `SELECT * FROM posts WHERE type = 'blog'` (indexed, instant) |
| Filter by category | Load JSON, `.filter()` in JS | `WHERE category_slug = 'philosophy'` (indexed) |
| Paginate 2000 posts | Load all, slice in memory | `LIMIT 20 OFFSET 40` (only fetches 20 rows) |
| Cross-type tag search | Load ALL JSON files, merge, filter | Single query with JOIN |
| "Related posts" | Manual, error-prone | SQL query on shared tags |
| Add new content type | Create 3 new JSON files, update code | Just insert with `type = 'newtype'` |
| Count posts by type | Load everything, count | `SELECT type, COUNT(*) GROUP BY type` |
| Find orphaned tags | Impossible without scripting | `SELECT * FROM tags WHERE id NOT IN (SELECT tag_id FROM post_tags)` |

---

## Migration Path

### Step 1: Create migration script

```typescript
// scripts/migrate-to-sqlite.ts
import Database from 'better-sqlite3';
import blogPosts from '../data/blog/blog.json';
import blogCategories from '../data/blog/categories.json';
// ... import all JSON files

const db = new Database('data/content.db');

// Create tables (run schema above)
db.exec(SCHEMA);

// Migrate posts
const insertPost = db.prepare(`
  INSERT INTO posts (type, slug, title, category_slug, status, confidence, importance, preview, cover_image, start_date, end_date, state)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const post of blogPosts) {
  insertPost.run('blog', post.slug, post.title, post.category, post.status, post.confidence, post.importance, post.preview, post.cover_image, post.start_date, post.end_date, post.state);
}

// Migrate tags (deduplicate across all content types)
// ... etc
```

### Step 2: Create data access layer

```typescript
// lib/db.ts
import Database from 'better-sqlite3';

const db = new Database('data/content.db', { readonly: true });

export function getPostsByType(type: string) {
  return db.prepare(`SELECT * FROM posts WHERE type = ? AND state = 'active' ORDER BY start_date DESC`).all(type);
}

export function getPostBySlug(slug: string) {
  return db.prepare(`SELECT * FROM posts WHERE slug = ?`).get(slug);
}

export function getTagsForPost(postId: number) {
  return db.prepare(`SELECT t.name FROM tags t JOIN post_tags pt ON t.id = pt.tag_id WHERE pt.post_id = ?`).all(postId);
}

// ... more helpers
```

### Step 3: Update components to use new data layer

Replace:
```typescript
import posts from '@/data/blog/blog.json';
const filtered = posts.filter(p => p.category === 'philosophy');
```

With:
```typescript
import { getPostsByTypeAndCategory } from '@/lib/db';
const filtered = getPostsByTypeAndCategory('blog', 'philosophy');
```

---

## File Structure After Migration

```
data/
├── content.db              # All structured data (posts, categories, tags)
└── [other non-content JSON files stay as-is]

lib/
└── db.ts                   # Data access layer

scripts/
└── migrate-to-sqlite.ts    # One-time migration script
```

---

## Dependencies

```bash
npm install better-sqlite3
npm install -D @types/better-sqlite3
```

`better-sqlite3` is synchronous (no async/await needed), compiles to native code, and is extremely fast. It works perfectly with Next.js at build time.

---

## Summary

- **One database file** replaces dozens of JSON files
- **Unified content types** via `type` column - no more duplicate structures
- **Instant queries** on 10,000+ posts with proper indexing
- **Relational power** for tags, categories, related posts
- **Zero infrastructure** - still just a file, still git-trackable
- **Type-safe** with TypeScript definitions matching your schema
- **Future-proof** - handles your 2-year prolific writing goal effortlessly

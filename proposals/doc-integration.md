# Proposal: /doc Route Integration with Global Categories & Tags

**Author:** Kris Yotam
**Date:** 2026-02-16
**Status:** Draft
**Route:** `/doc`

---

## Problem

The `/doc` route currently serves as a dumb file server — nginx directory listing of static files on the server at `/mnt/storage/doc/`. PDFs, images, datasets, and other documents live there with no metadata, no discoverability, and no connection to the site's existing taxonomy system. A visitor has no way to find a document unless they know the exact path.

Meanwhile, the site has a robust global categories and tags system (`/categories`, `/tags`, `/category/[slug]`, `/tag/[slug]`) that aggregates all MDX content (notes, essays, papers, blog, etc.) — but documents stored in `/doc` are completely invisible to it.

The Gwern-style directory/clusters proposal (`.agenda/clusters.md`) addressed this but introduced too much complexity: embeddings pipelines, GPT-powered cluster labeling, similarity indices, backlinks, and bibliography systems. That's six phases of infrastructure for what is fundamentally a simpler problem.

## Goal

Make documents in `/doc` first-class citizens of the taxonomy. Tag a PDF with `philosophy` + `ethics` and it appears on `/category/philosophy` and `/tag/ethics` alongside essays, notes, and papers — with no new build pipelines, no embeddings, no AI. Just metadata in the database.

---

## Design Principles

1. **Use what exists** — The categories, tags, content_tags tables, and global aggregation queries already work. Extend, don't rebuild.
2. **Metadata in the database, files on disk** — Same pattern as MDX content (no frontmatter in files, all metadata in `content.db`).
3. **Documents are not posts** — They don't have MDX bodies, TOCs, or sidenotes. They have a file path, file type, size, and optionally a description. Render them differently.
4. **Minimal new routes** — One index page (`/doc`), one detail page (`/doc/[slug]`). Everything else flows through existing global category/tag pages.

---

## Database Schema

### New table: `documents`

```sql
CREATE TABLE documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,           -- URL-safe identifier
  title TEXT NOT NULL,                 -- human-readable title
  preview TEXT,                        -- short description
  file_path TEXT NOT NULL,             -- path relative to /doc root, e.g. "papers/godel-1931.pdf"
  file_type TEXT NOT NULL,             -- mime category: pdf, image, dataset, audio, video, archive, other
  file_size INTEGER,                   -- bytes (for display: "2.4 MB")
  category_slug TEXT,                  -- FK to categories.slug
  source_url TEXT,                     -- original URL if downloaded from elsewhere
  author TEXT,                         -- document author (not necessarily site owner)
  date TEXT,                           -- document date (publication date, not upload date)
  status TEXT DEFAULT 'Finished',      -- editorial status (same vocabulary as posts)
  confidence TEXT DEFAULT 'certain',   -- epistemic confidence
  importance INTEGER DEFAULT 5,        -- 1-10 scale
  state TEXT DEFAULT 'active',         -- active/hidden visibility toggle
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_documents_slug ON documents(slug);
CREATE INDEX idx_documents_category ON documents(category_slug);
CREATE INDEX idx_documents_state ON documents(state);
CREATE INDEX idx_documents_file_type ON documents(file_type);
```

### Tags via existing junction table

Documents use the same `content_tags` table with `content_type = 'documents'`:

```sql
-- Tag a document
INSERT INTO content_tags (content_type, content_id, tag_id)
VALUES ('documents', 42, 7);
```

No schema changes needed to `content_tags`, `categories`, or `tags`.

---

## How Documents Appear on Global Pages

### `/category/[slug]` (e.g. `/category/philosophy`)

The `getUniversalPostsByCategory()` function in `src/lib/content.ts` currently queries each content type table (notes, essays, blog, papers, etc.) and merges results. Add `documents` to the list.

Documents render differently in the content table:
- **Type badge:** "doc" instead of "essay" or "note"
- **Icon:** File type icon (PDF icon, image icon, etc.) instead of nothing
- **Link behavior:** Clicking goes to `/doc/[slug]` (detail page with metadata + download/view link), NOT directly to the raw file

Example row on `/category/philosophy`:

```
┌─────────────────────────────────────────────────────┐
│ 📄 Gödel's Incompleteness Theorems (1931)    [doc] │
│    Original paper — Kurt Gödel                      │
│    philosophy · logic · mathematics     2.4 MB  PDF │
└─────────────────────────────────────────────────────┘
```

### `/tag/[slug]` (e.g. `/tag/ethics`)

Same integration. Documents with that tag appear in the universal tag results alongside posts.

### `/tags` and `/categories`

Document counts are included in the totals. If `ethics` has 4 essays + 2 notes + 3 documents = 9 items total.

---

## New Routes

### `/doc` — Document Index

Lists all active documents. Supports the same navigation pattern as other content routes:

- Search by title, tags, category
- Filter by category (dropdown)
- Filter by file type (PDF, image, dataset, etc.)
- Sort by date, title, importance

**Route group:** `(content)` — same group as other content types.

**Directory structure:**

```
src/app/(content)/doc/
├── page.tsx                    # Server: fetch all documents
├── DocClientPage.tsx           # Client: list with search/filter
├── [category]/
│   ├── page.tsx                # Server: category-filtered view
│   └── [slug]/
│       ├── page.tsx            # Server: document detail page
│       └── DocPageClient.tsx   # Client: header + metadata + viewer
├── categories/
│   ├── page.tsx
│   └── DocCategoriesClientPage.tsx
├── tags/
│   ├── page.tsx
│   └── DocTagsClientPage.tsx
└── tag/
    └── [slug]/
        ├── page.tsx
        └── DocTaggedPage.tsx
```

This follows the exact same Canonical Content Route pattern from CLAUDE.md.

### `/doc/[category]/[slug]` — Document Detail Page

NOT an MDX page (no content body). Instead renders:

1. **PostHeader** — title, date, category, tags, status, confidence, importance (reuses existing component)
2. **Document metadata card:**
   - File type + size
   - Author (if not site owner)
   - Source URL (if external)
   - Direct download link
   - Inline viewer (for PDFs: embedded `<iframe>` or `<object>`; for images: `<img>`)
3. **Description** — the `preview` field rendered as a paragraph
4. **Citation** — auto-generated BibTeX for the document
5. **Related content** — other posts/documents sharing the same tags (simple query, no embeddings needed)

### Sexy URLs

Documents get sexy URLs like everything else. A document with slug `godel-incompleteness-1931` is accessible at:

```
krisyotam.com/godel-incompleteness-1931
```

Add `'documents'` to the `CONTENT_TYPES` array in `next.config.mjs`'s `buildSexyUrls()` function. The query pattern is identical — select slug + category_slug from documents where state = active.

---

## File Organization on Disk

The actual files at `/mnt/storage/doc/` can stay flat or organized however you want — the database `file_path` column stores the relative path. But a recommended convention:

```
/mnt/storage/doc/
├── assets/              # existing: post images/bundles (unchanged)
│   └── bundle/
│       └── blog/...
├── papers/              # academic papers, research
│   ├── godel-1931.pdf
│   └── turing-1936.pdf
├── books/               # full books, textbooks
│   └── principia-mathematica.pdf
├── sheets/              # cheat sheets, reference cards
│   └── vim-cheatsheet.pdf
├── datasets/            # CSVs, JSON datasets
├── slides/              # presentations
├── audio/               # lectures, recordings
└── misc/                # everything else
```

The `/doc/assets/bundle/` directory (used for post images) is excluded from the documents table — those are internal to posts and shouldn't appear as standalone documents.

---

## Registration Workflow

### Option A: CLI Script (Recommended)

Script: `public/scripts/keep/registerDoc.js`

```bash
node public/scripts/keep/registerDoc.js \
  --title "Gödel's Incompleteness Theorems" \
  --file "papers/godel-1931.pdf" \
  --category philosophy \
  --tags "logic,mathematics,foundations" \
  --author "Kurt Gödel" \
  --date "1931-01-01" \
  --importance 9 \
  --source "https://doi.org/10.1007/BF01700692"
```

The script:
1. Validates the file exists at `/mnt/storage/doc/{file_path}` (or via HTTP check against `krisyotam.com/doc/{file_path}`)
2. Auto-detects file type from extension
3. Gets file size
4. Generates slug from title (same rules as post slugs)
5. Checks slug uniqueness across ALL content types
6. Inserts into `documents` table
7. Creates/reuses tags, inserts into `content_tags`
8. Prints confirmation with the sexy URL

### Option B: Batch Import

Script: `public/scripts/keep/importDocs.js`

Reads a YAML or JSON manifest:

```yaml
documents:
  - title: "Gödel's Incompleteness Theorems"
    file: "papers/godel-1931.pdf"
    category: philosophy
    tags: [logic, mathematics, foundations]
    author: "Kurt Gödel"
    date: "1931-01-01"
    importance: 9

  - title: "Computing Machinery and Intelligence"
    file: "papers/turing-1950.pdf"
    category: technology
    tags: [artificial-intelligence, philosophy-of-mind]
    author: "Alan Turing"
    date: "1950-10-01"
    importance: 8
```

Useful for bulk-registering an existing collection.

### Option C: Scan + Prompt

Script: `public/scripts/keep/scanDocs.js`

Walks `/mnt/storage/doc/` recursively, finds files not yet in the database, and either:
- Auto-generates metadata (title from filename, category from parent directory)
- Prompts interactively for each unregistered file
- Outputs a manifest YAML for review before import

---

## Integration Points

### 1. `src/lib/content.ts` — `getUniversalPostsByCategory()`

Add documents to the union query. Currently this function queries ~12 content type tables. Add:

```typescript
// In the content types loop:
const CONTENT_TYPES = [
  'blog', 'diary', 'essays', 'fiction', 'news', 'notes',
  'ocs', 'papers', 'progymnasmata', 'reviews', 'verse',
  'documents'  // <-- add
];
```

Documents need a slight transform since they don't have `start_date`/`end_date` — map `date` to `start_date` and set `end_date` to null.

### 2. `src/lib/content.ts` — `getUniversalPostsByTag()`

Same addition — include documents in tag queries.

### 3. `src/lib/content.ts` — `getAllUniversalCategories()` / `getAllUniversalTags()`

Include document counts in category/tag totals.

### 4. `next.config.mjs` — `buildSexyUrls()`

Add `'documents'` to the `CONTENT_TYPES` array (already shown above).

### 5. `ContentTable` component

Add a `type` column or badge so documents are visually distinct from posts. A small file-type icon (📄 PDF, 🖼 Image, 📊 Dataset) makes them scannable.

### 6. Category/Tag page client components

`CategoryPageClient.tsx` and tag equivalents need no changes if documents conform to the `UniversalPost` interface shape. Just ensure the type field reads `"doc"` or `"documents"` so the link routes to `/doc/[category]/[slug]` instead of `/notes/[category]/[slug]`.

---

## What This Does NOT Include

Deliberately excluded (can be added later independently):

- **Embeddings / similarity** — No AI. Related documents are found by shared tags.
- **Backlinks** — No link scanning. Documents are standalone files.
- **Bibliography generation** — No auto-citation extraction from PDFs.
- **Directory tree navigation** — No Gwern-style hierarchical directory pages. The `/doc` index with category/tag filtering is sufficient.
- **Full-text search inside PDFs** — Out of scope. Search is by title/tags/category only.
- **Auto-tagging** — Documents are manually registered with metadata. No NLP.

Each of these could be added as independent features later without changing this foundation.

---

## Implementation Order

1. **Schema** — Add `documents` table to `content.db`
2. **registerDoc.js** — CLI for registering documents with metadata
3. **Data layer** — Add document queries to `src/lib/data.ts` and `src/lib/content.ts`
4. **Global integration** — Include documents in universal category/tag queries
5. **`/doc` route** — Index page + client page following canonical content route pattern
6. **`/doc/[category]/[slug]`** — Detail page with metadata card + inline viewer
7. **Sexy URLs** — Add documents to `buildSexyUrls()`
8. **Batch import** — `importDocs.js` for bulk registration
9. **Scanner** — `scanDocs.js` for discovering unregistered files

Steps 1-7 are the core. Steps 8-9 are convenience tooling.

---

## Example: End-to-End Flow

1. Upload a PDF to the server:
   ```bash
   scp godel-1931.pdf server:/mnt/storage/doc/papers/
   ```

2. Register it:
   ```bash
   node public/scripts/keep/registerDoc.js \
     --title "On Formally Undecidable Propositions" \
     --file "papers/godel-1931.pdf" \
     --category philosophy \
     --tags "logic,mathematics,incompleteness" \
     --author "Kurt Gödel" \
     --date "1931-01-01" \
     --importance 9
   ```

3. The document now appears on:
   - `krisyotam.com/doc` (document index)
   - `krisyotam.com/doc/philosophy` (category filter)
   - `krisyotam.com/category/philosophy` (global category page, alongside essays/notes/papers)
   - `krisyotam.com/tag/logic` (global tag page)
   - `krisyotam.com/tag/mathematics` (global tag page)
   - `krisyotam.com/on-formally-undecidable-propositions` (sexy URL → detail page)

4. The detail page at `/doc/philosophy/on-formally-undecidable-propositions` shows:
   - Title, author, date, category, tags, importance
   - Embedded PDF viewer
   - Direct download link
   - File size: 1.2 MB
   - Source DOI link
   - BibTeX citation block

---

## Cost

Zero API costs. Zero new dependencies. Just SQLite queries and React components following existing patterns. The entire feature is a database table, a CLI script, a few query additions, and one new route.

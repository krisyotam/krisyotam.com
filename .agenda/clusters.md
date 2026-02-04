# Clusters, Directories, Indexes & Similarity System

## Overview

Implementation plan for Gwern-style directory layouts, index pages, similarity ratings, backlinks, and bibliography system.

---

## Phase 1: Directory Layouts

**Goal:** Auto-generate beautiful directory pages that show hierarchical navigation, child items, and related tags.

### Steps:

1. **Create directory data schema** - Define TypeScript types for directory metadata (children, siblings, parent, related tags, item counts)

2. **Build directory scanner utility** - Script that scans content folders (`/notes`, `/essays`, `/blog`, etc.) and generates a directory tree JSON

3. **Create DirectoryIndex component** - React component that renders:
   - Breadcrumb navigation (upward links)
   - Subdirectory grid (downward links with ↘ icons)
   - Related categories (sideways links with → icons)
   - Item listings grouped by type

4. **Add directory page routes** - Dynamic `[...path]/page.tsx` routes that render directory views

5. **Style with CSS** - Add directional icons, column layouts, consistent spacing matching site aesthetic

---

## Phase 2: Index Pages

**Goal:** Auto-generate index pages for each category/tag with smart grouping, thumbnails, and metadata.

### Steps:

1. **Extend content metadata** - Ensure all MDX files have consistent frontmatter (title, date, tags, thumbnail, author)

2. **Build index generator script** - Scans content and generates index data:
   - Groups by author (Kris vs external/quotes)
   - Sorts by date
   - Extracts first image as thumbnail
   - Counts items per section

3. **Create IndexPage component** - Renders:
   - Header with item counts
   - Thumbnail grid or list view
   - Titled sections (grouped by first letter, year, or topic)
   - "See Also" cross-links

4. **Auto-generate YAML metadata** - Created/modified dates, child counts, description

5. **Add to existing category pages** - Integrate with `/blog`, `/essays`, `/notes`, etc.

---

## Phase 3: Similarity Ratings ("Sort By Magic")

**Goal:** Show related posts using AI embeddings + clustering with auto-generated section labels.

### Steps:

1. **Create embeddings pipeline:**
   - Build script to extract text from all posts (title, tags, abstract, content preview)
   - Call OpenAI `text-embedding-3-small` API
   - Store embeddings in `public/data/embeddings.json` or SQLite

2. **Build similarity index:**
   - Implement approximate nearest neighbor search (use `hnswlib` via WASM or pre-compute all pairs)
   - Store top-k similar posts per item in JSON

3. **Create clustering algorithm:**
   - Implement greedy nearest-neighbor walk
   - Detect distance jumps to form clusters
   - Target `sqrt(n) - 1` clusters per section

4. **Add GPT auto-labeling:**
   - Send cluster titles to GPT-4o-mini
   - Generate 1-2 word topic labels
   - Cache results to avoid repeated API calls

5. **Create SimilarPosts component:**
   - "Related Posts" section on each post page
   - "Sort By Magic" clustered view on index pages

6. **Build regeneration script:**
   - `npm run generate:embeddings` - regenerates when content changes
   - Add to build pipeline or run manually

---

## Phase 4: Backlinks System

**Goal:** Track and display all pages that link TO a given page.

### Steps:

1. **Build link extractor** - Parse all MDX/content files for internal links

2. **Create backlinks index** - JSON mapping: `{ targetUrl: [sourceUrls...] }`

3. **Generate on build** - Script runs during build to update backlinks

4. **Create Backlinks component** - Displays list of pages linking to current page

5. **Add to post metadata** - Include backlink count in header

---

## Phase 5: Bibliography System

**Goal:** Centralized reference management with citation links.

### Steps:

1. **Create bibliography database** - JSON/SQLite with citation entries (author, title, year, URL, etc.)

2. **Build Citation component** - Inline citations that link to bibliography

3. **Create Bibliography page** - Master list of all references

4. **Auto-extract citations** - Script to find and index all citations in content

5. **Link bidirectionally** - Bibliography entries show which posts cite them

---

## Phase 6: Header Metadata Row

**Goal:** Add backlinks, similar, bibliography counts to post headers.

### New metadata row with Gwern-style symbols:
- **Backlinks** - `⁂` (asterism) - pages linking to this post
- **Similar** - `≈` (approximately equal) - related posts count
- **Bibliography** - `†` (dagger) - citations in this post

### Implementation:
1. Update `PageHeader` component to accept these new props
2. Display as clickable links that scroll to/open respective sections
3. Style consistently with existing header metadata

---

## Files to Create

```
src/
├── lib/
│   ├── directory.ts        # Directory tree scanner
│   ├── indexer.ts          # Index page generator
│   ├── embeddings.ts       # OpenAI embedding API wrapper
│   ├── similarity.ts       # KNN + clustering logic
│   ├── cluster-labeler.ts  # GPT auto-tagging
│   ├── backlinks.ts        # Backlink extractor & indexer
│   └── bibliography.ts     # Citation management
├── components/
│   ├── directory/
│   │   ├── DirectoryIndex.tsx
│   │   ├── DirectoryNav.tsx
│   │   └── DirectoryGrid.tsx
│   ├── index/
│   │   ├── IndexPage.tsx
│   │   ├── IndexSection.tsx
│   │   └── IndexThumbnail.tsx
│   ├── similar/
│   │   ├── SimilarPosts.tsx
│   │   └── SortByMagic.tsx
│   ├── backlinks/
│   │   └── Backlinks.tsx
│   └── bibliography/
│       ├── Citation.tsx
│       └── Bibliography.tsx
scripts/
├── generate-directories.ts
├── generate-indexes.ts
├── generate-embeddings.ts
├── generate-similarity.ts
├── generate-backlinks.ts
└── generate-bibliography.ts
public/data/
├── directory-tree.json
├── indexes/
│   └── [category].json
├── embeddings.bin
├── similarity.json
├── backlinks.json
└── bibliography.json
```

---

## API Costs Estimate

| Task | API | Est. Cost |
|------|-----|-----------|
| Embeddings (~500 posts) | OpenAI text-embedding-3-small | ~$0.10 |
| Cluster labels (~50 clusters) | GPT-4o-mini | ~$0.05 |
| **Total one-time** | | **~$0.15** |
| Incremental updates | Per new post | ~$0.001 |

---

## CLI Commands

```bash
npm run generate:directories   # Scan and build directory tree
npm run generate:indexes       # Generate index page data
npm run generate:embeddings    # Create/update embeddings
npm run generate:similarity    # Compute similar posts
npm run generate:backlinks     # Extract and index backlinks
npm run generate:bibliography  # Build citation database
npm run generate:all           # Run all generators
```

---

## Priority Order

1. **Backlinks** - Foundation for cross-referencing
2. **Bibliography** - Citation system
3. **Directory Layouts** - Navigation structure
4. **Index Pages** - Content organization
5. **Similarity** - AI-powered recommendations (most complex)

---

## Research Notes

### Gwern's Implementation References:
- `build/generateDirectory.hs` - Directory generation
- `build/GenerateSimilar.hs` - Similarity/embeddings
- `build/generateBacklinks.hs` - Backlink generation
- `build/generateLinkBibliography.hs` - Bibliography generation
- `build/tagguesser.py` - GPT cluster labeling
- `css/links.css` - Directory & icon styling
- `template/default.html` - Header template

---

## Detailed Implementation Notes (from Gwern)

### Backlinks System

**How it works:**
1. Parse all Markdown/HTML files for outgoing links
2. Build bidirectional map: `Map URL [(AnchorFragment, [CallingSources])]`
3. Store in `/metadata/backlinks.hs`
4. Generate HTML fragments per page: `/metadata/annotation/backlink/[url-encoded].html`

**Display format:**
- Bulleted list of pages linking to target
- Sorted by date (newest first)
- Optional transcluded context snippet
- Count shown as: `Backlinks (N)` or `Backlink:` for single

**Exclusions:**
- `.backlink-not` class
- Blacklisted URLs
- Self-references

---

### Bibliography System

**How it works:**
1. Extract all links from each page
2. Deduplicate while preserving order
3. Store citation metadata: `(title, author, date, DOI, tags, size, abstract)`
4. Generate HTML fragments: `/metadata/annotation/link-bibliography/[url-encoded].html`

**Display format:**
- Link title (or code if no title)
- "Original context in page" link
- Transcluded context for local links with anchors
- Full annotation for external links
- Count shown as: `Bibliography (N)` when N >= 2

---

### Header Symbols (EXACT from Gwern)

| Feature | Icon Type | Value | CSS Class |
|---------|-----------|-------|-----------|
| **Backlinks** | SVG | `arrows-pointing-inwards-to-dot` | `.backlinks` |
| **Similar** | Text | `≈` (U+2248) | `.similars` |
| **Bibliography** | SVG | `bibliography` | `.link-bibliography` |

**HTML Template Pattern:**
```html
<span class="page-backlinks">
  <a class="backlinks" href="#backlinks"
     data-link-icon="arrows-pointing-inwards-to-dot"
     data-link-icon-type="svg">backlinks</a>
</span>

<span class="page-similars">
  <a class="similars" href="#similars"
     data-link-icon="≈"
     data-link-icon-type="text">similar</a>
</span>

<span class="page-link-bibliography">
  <a class="link-bibliography" href="#link-bibliography"
     data-link-icon="bibliography"
     data-link-icon-type="svg">bibliography</a>
</span>
```

**CSS Icon Sizing:**
```css
/* Backlinks */
a[data-link-icon='arrows-pointing-inwards-to-dot'] {
    --link-icon-size: 0.90em;
    --link-icon-offset-y: 0.25em;
    --link-icon-opacity: 0.70;
}

/* Similar */
a[data-link-icon='≈'] {
    --link-icon-size: 1em;
    --link-icon-offset-x: 0.15em;
    --link-icon-opacity: 0.75;
}

/* Bibliography */
a[data-link-icon='bibliography'] {
    --link-icon-size: 0.69em;
    --link-icon-offset-y: 0.12em;
    --link-icon-opacity: 0.60;
}
```

---

## Data Storage Structure

```
public/data/
├── directory-tree.json          # Directory hierarchy
├── indexes/
│   └── [category].json          # Index page data per category
├── embeddings.bin               # OpenAI embeddings (binary)
├── similarity.json              # Pre-computed similar posts
├── backlinks.json               # Backlink map
├── bibliography.json            # Citation database
└── annotations/
    ├── backlink/
    │   └── [url-encoded].html   # Backlink HTML fragments
    ├── similar/
    │   └── [url-encoded].html   # Similar posts HTML fragments
    └── bibliography/
        └── [url-encoded].html   # Bibliography HTML fragments
```

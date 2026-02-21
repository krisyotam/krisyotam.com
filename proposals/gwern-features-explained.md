# Proposal: Gwern-Style Features — Full Breakdown

**Author:** Kris Yotam
**Date:** 2026-02-16
**Status:** Draft
**Reference:** `.agenda/clusters.md` (original proposal)

---

## What This Proposal Is

The original `clusters.md` proposal described six interconnected features inspired by Gwern Branwen's website (gwern.net). Gwern's site is widely regarded as one of the best-organized personal knowledge bases on the internet. These features make a site feel like a living, cross-referenced research archive rather than a flat blog.

This document re-explains every feature in plain language: what it is, why it matters, exactly how it works, what it costs, and what it adds to the tech stack.

---

## Table of Contents

1. [Directory Layouts](#1-directory-layouts)
2. [Index Pages](#2-index-pages)
3. [Similarity Ratings ("Sort By Magic")](#3-similarity-ratings)
4. [Backlinks](#4-backlinks)
5. [Bibliography](#5-bibliography)
6. [Header Metadata Row](#6-header-metadata-row)
7. [Full Stack Impact](#7-full-stack-impact)
8. [Cost Breakdown](#8-cost-breakdown)
9. [Implementation Timeline](#9-implementation-timeline)
10. [Decision Matrix](#10-decision-matrix)

---

## 1. Directory Layouts

### What It Is

A directory layout is a page that shows everything under a particular section of your site, organized hierarchically — like a folder view in a file manager. Instead of just listing posts chronologically, it shows the structure: parent sections, child sections, and sibling sections.

On Gwern's site, visiting `/psychology` shows:
- A breadcrumb trail: Home → Psychology
- Subdirectories: /psychology/spaced-repetition, /psychology/dnb, etc.
- Items in the current directory (essays, notes)
- Related categories (links sideways to related topics)

### What It Looks Like

```
krisyotam.com/philosophy/

↑  Home
├── ethics/           (7 items)
├── epistemology/     (4 items)
├── metaphysics/      (3 items)
├── stoicism/         (12 items)
└── philosophy-of-mind/ (2 items)

→  Related: psychology, theology, literature

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

 Items in philosophy/
 ┌──────────────────────────────────────────┐
 │ On the Examined Life          [essay]    │
 │ Notes on Wittgenstein         [notes]    │
 │ Gödel's Theorems (1931)       [doc]      │
 │ A Defense of Moral Realism    [paper]    │
 └──────────────────────────────────────────┘
```

### Why It Matters

Right now, the site has flat category pages (`/category/philosophy`) that list every post tagged with `philosophy` in a single chronological list. As content grows past 50-100 items per category, this becomes unwieldy. Directory layouts impose navigable structure.

It also creates a sense of depth — the reader can drill down from broad topics to specific sub-topics without relying on search.

### How It Works Technically

1. **A build-time script** (`scripts/generate-directories.ts`) reads all content from the database — every post, note, essay, paper, document — and their categories and tags.

2. The script constructs a **tree data structure** representing the hierarchy:
   ```
   root
   ├── philosophy
   │   ├── ethics
   │   ├── epistemology
   │   └── stoicism
   ├── technology
   │   ├── programming
   │   └── web-development
   └── ...
   ```

3. It outputs a JSON file (`public/data/directory-tree.json`) with this structure:
   ```json
   {
     "philosophy": {
       "children": ["ethics", "epistemology", "metaphysics"],
       "siblings": ["psychology", "theology"],
       "items": [
         { "slug": "examined-life", "title": "On the Examined Life", "type": "essays" }
       ],
       "item_count": 28
     }
   }
   ```

4. A **React component** (`DirectoryIndex.tsx`) reads this JSON and renders the directory page with:
   - Upward navigation (breadcrumbs)
   - Downward navigation (subdirectory grid with item counts)
   - Sideways navigation (related categories)
   - Item listing (posts/documents in this section)

5. **Dynamic routes** (`/[...path]/page.tsx`) match any path and render the directory view if a matching directory exists in the tree.

### What It Adds to the Stack

| Addition | Details |
|----------|---------|
| Build script | `scripts/generate-directories.ts` (~200 lines TypeScript) |
| JSON data file | `public/data/directory-tree.json` (generated at build time) |
| React components | `DirectoryIndex.tsx`, `DirectoryNav.tsx`, `DirectoryGrid.tsx` (~400 lines total) |
| Route | Catch-all `[...path]/page.tsx` or integration into existing category routes |

**New dependencies:** None. Uses existing SQLite + React.

### Cost

$0. Pure computation at build time.

---

## 2. Index Pages

### What It Is

An index page is an enhanced landing page for a category or tag that goes beyond a simple chronological list. It groups content intelligently: by year, by sub-topic, by author, or alphabetically. It can show thumbnails, item counts per section, and cross-links to related sections.

Think of it as the table of contents for a category — the page you'd print out if you wanted an overview of everything the site contains about a subject.

### What It Looks Like

```
krisyotam.com/category/philosophy/

Philosophy  (28 items)

  Ethics (12)
  ├── A Defense of Moral Realism          [paper]   2026-01
  ├── Notes on the Trolley Problem        [notes]   2025-11
  └── Virtue Ethics in Daily Practice     [essay]   2025-09

  Epistemology (7)
  ├── What Can We Know?                   [essay]   2026-02
  └── Notes on Descartes' Meditations     [notes]   2025-08

  Logic & Foundations (5)
  ├── Gödel's Incompleteness Theorems     [doc]     PDF
  └── On Formal Systems                   [paper]   2025-06

  See Also → psychology, theology, mathematics
```

### How It Works Technically

1. **A build script** (`scripts/generate-indexes.ts`) queries all content grouped by category.

2. For each category, it:
   - Groups items by their most specific tag (creating sub-sections)
   - Sorts within groups by date
   - Extracts a thumbnail (first image in the post, or cover_image)
   - Counts items per sub-group

3. Outputs per-category JSON files (`public/data/indexes/philosophy.json`, etc.)

4. The existing category page components are enhanced to use this data when available, falling back to flat chronological listing if the index data doesn't exist.

### What It Adds to the Stack

| Addition | Details |
|----------|---------|
| Build script | `scripts/generate-indexes.ts` (~150 lines) |
| JSON data files | `public/data/indexes/[category].json` (one per category) |
| Component enhancement | Modify `CategoryPageClient.tsx` to render grouped view |

**New dependencies:** None.

### Cost

$0. Pure computation at build time.

---

## 3. Similarity Ratings ("Sort By Magic")

### What It Is

This is the most technically interesting feature. It answers the question: "What other posts on this site are most similar to this one?" — not by shared tags (which is crude), but by the actual meaning of the content.

It works using **embeddings** — a technique from machine learning where text is converted into a list of numbers (a "vector") that captures its meaning. Texts with similar meaning have similar vectors. By comparing vectors, you can find which posts are most related even if they share zero tags.

### What Are Embeddings (Plain English)

Imagine you could place every post on your site as a dot on a map. Posts about similar topics would cluster together: all the ethics essays near each other, all the programming notes in another cluster, etc. An embedding is the coordinates of each post on that map.

The "map" has 1536 dimensions (not 2 like a real map), so you can't visualize it, but mathematically you can measure the distance between any two dots. Posts with small distances between them are similar.

### What "Sort By Magic" Means

On an index page, instead of sorting by date or title, the user can click "Sort By Magic." This groups posts into auto-detected clusters based on their content similarity, with each cluster getting an auto-generated label.

Example: Clicking "Sort By Magic" on `/notes` might produce:

```
  Programming & Systems
  ├── Why I Use Vim
  ├── Notes on Shell Scripting
  └── Terminal Workflow

  Philosophy of Mind
  ├── Consciousness and Computation
  ├── Notes on Searle's Chinese Room
  └── What Can Machines Know?

  Personal & Reflections
  ├── On Solitude
  ├── Reading as Practice
  └── What I Learned This Year
```

The cluster labels ("Programming & Systems", "Philosophy of Mind") are generated by an LLM (GPT-4o-mini) looking at the titles in each cluster and summarizing them in 1-2 words.

### How It Works Technically

**Step 1: Generate Embeddings**

A build script extracts text from each post (title + tags + first 500 words of content) and sends it to OpenAI's embedding API:

```
POST https://api.openai.com/v1/embeddings
{
  "model": "text-embedding-3-small",
  "input": "On the Examined Life. Tags: philosophy, ethics, stoicism. Socrates famously said that the unexamined life..."
}
```

Response: a vector of 1536 floating-point numbers like `[0.0123, -0.0456, 0.0789, ...]`

This vector is stored. One vector per post.

**Step 2: Compute Similarities**

For each post, find the K nearest neighbors (most similar posts) by computing cosine similarity between their vectors:

```
similarity(A, B) = dot(A, B) / (|A| × |B|)
```

Result: a ranked list of the most similar posts for each post.

**Step 3: Cluster for "Sort By Magic"**

When rendering a category page with magic sort:

1. Take all posts in the category
2. Start with the first post, find its nearest neighbor, then that post's nearest neighbor, and so on (greedy walk)
3. When the distance between consecutive posts jumps significantly, start a new cluster
4. Target approximately √n clusters (for 100 posts → ~10 clusters)

**Step 4: Label Clusters**

Send the titles of each cluster to GPT-4o-mini:

```
Prompt: "Given these post titles, provide a 1-2 word topic label:
- Why I Use Vim
- Notes on Shell Scripting
- Terminal Workflow"

Response: "Programming Tools"
```

**Step 5: Cache Everything**

All results are pre-computed and stored as JSON. No API calls happen at page load time.

### Data Flow

```
Content (MDX + DB)
    ↓
Extract text (title + tags + preview + body snippet)
    ↓
OpenAI text-embedding-3-small API  ← costs money (once)
    ↓
Vectors stored in public/data/embeddings.json
    ↓
Compute pairwise similarities (local math, free)
    ↓
Store in public/data/similarity.json
    ↓
Cluster via greedy walk (local math, free)
    ↓
GPT-4o-mini labels clusters  ← costs money (once)
    ↓
Store in public/data/cluster-labels.json
    ↓
React component reads JSON at page load (free)
```

### What It Adds to the Stack

| Addition | Details |
|----------|---------|
| Build script | `scripts/generate-embeddings.ts` (~100 lines) |
| Build script | `scripts/generate-similarity.ts` (~200 lines, KNN + clustering) |
| Data files | `public/data/embeddings.json` (~2-5 MB for 500 posts) |
| Data files | `public/data/similarity.json` (~100 KB) |
| Data files | `public/data/cluster-labels.json` (~5 KB) |
| React components | `SimilarPosts.tsx`, `SortByMagic.tsx` (~200 lines) |
| Environment variable | `OPENAI_API_KEY` (for embedding + labeling scripts) |

**New dependency:** `openai` npm package (for the build script only, not shipped to the browser).

### Cost

This is the only feature that costs real money, and it's minimal:

| Operation | Model | Input | Cost |
|-----------|-------|-------|------|
| Embed 500 posts | text-embedding-3-small | ~250K tokens | **$0.005** |
| Embed 1000 posts | text-embedding-3-small | ~500K tokens | **$0.010** |
| Label 50 clusters | GPT-4o-mini | ~5K tokens | **$0.002** |
| Label 100 clusters | GPT-4o-mini | ~10K tokens | **$0.004** |

**Total for 500 posts: ~$0.01 (one cent)**
**Total for 1000 posts: ~$0.02 (two cents)**

This cost is incurred once when you run the generation script. It's only re-run when you add new content (and even then, you can do incremental updates — only embed new posts, not re-embed everything).

### Incremental Updates

When you add a new post:
- Embed only the new post (~$0.00001)
- Recompute similarity only for the new post vs. all existing posts (free, local math)
- Re-cluster only the affected category (free)
- Re-label only if a new cluster forms (~$0.00004)

Cost per new post: effectively $0.

---

## 4. Backlinks

### What It Is

A backlink is a reverse reference. If Essay A contains a link to Note B, then Note B has a backlink from Essay A. A backlinks section on Note B shows: "The following pages link to this page: Essay A."

This is one of the most powerful features for a knowledge base. It turns one-way links into two-way connections, creating a web of ideas. You never have to manually maintain "related posts" lists — the system discovers relationships automatically from the links you naturally write.

### What It Looks Like

At the bottom of a post:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Backlinks (3)

 • On the Examined Life [essay]
   "...as I discussed in my notes on Wittgenstein..."

 • Reading List: Philosophy [notes]
   "...recommended: Notes on Wittgenstein for beginners..."

 • 2025 Year in Review [blog]
   "...one of my most-read pieces was Notes on Wittgenstein..."
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Each backlink shows:
- The title of the linking page
- A context snippet (the sentence containing the link)

### How It Works Technically

1. **A build script** (`scripts/generate-backlinks.ts`) reads every piece of content on the site (MDX files + database entries).

2. For each piece of content, it extracts all internal links:
   ```
   Found in "On the Examined Life":
     - /notes/philosophy/notes-on-wittgenstein
     - /tag/stoicism
     - /essays/philosophy/virtue-ethics
   ```

3. It builds a reverse map:
   ```json
   {
     "/notes/philosophy/notes-on-wittgenstein": [
       {
         "source": "/essays/philosophy/examined-life",
         "title": "On the Examined Life",
         "context": "...as I discussed in my notes on Wittgenstein..."
       }
     ]
   }
   ```

4. This map is stored as `public/data/backlinks.json`.

5. A **React component** (`Backlinks.tsx`) reads this JSON and renders the backlinks section at the bottom of each post (after comments, before footer).

6. The **PostHeader** component shows a backlink count (e.g., "⁂ 3") that links down to the backlinks section.

### What It Adds to the Stack

| Addition | Details |
|----------|---------|
| Build script | `scripts/generate-backlinks.ts` (~150 lines) |
| Data file | `public/data/backlinks.json` (~50-200 KB depending on link density) |
| React component | `Backlinks.tsx` (~80 lines) |
| Header integration | Small addition to `PostHeader` for backlink count |

**New dependencies:** None. The script parses MDX files with regex or a markdown parser (remark, which is already in the stack).

### Cost

$0. Pure file parsing at build time.

---

## 5. Bibliography

### What It Is

A bibliography is a list of every external source (URL, book, paper, DOI) that a post links to or cites. It's the flip side of backlinks: backlinks show who links TO you, bibliography shows what YOU link to.

This isn't about manually creating BibTeX entries. The system automatically extracts every link from a post, resolves its metadata (title, author, date), and presents a formatted reference list at the bottom of the page.

### What It Looks Like

At the bottom of a post, after backlinks:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Bibliography (7)

 1. "Attention Is All You Need" — Vaswani et al., 2017
    https://arxiv.org/abs/1706.03762
    Cited in: §2 Transformer Architecture

 2. "The Bitter Lesson" — Rich Sutton, 2019
    http://www.incompleteideas.net/IncIdeas/BitterLesson.html
    Cited in: §4 Scaling Laws

 3. Stanford Encyclopedia of Philosophy: Epistemology
    https://plato.stanford.edu/entries/epistemology/
    Cited in: §1 Introduction

 4. krisyotam.com/notes-on-wittgenstein [internal]
    Cited in: §3 Language Games
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### How It Works Technically

1. **A build script** (`scripts/generate-bibliography.ts`) reads each post and extracts all links (both internal and external).

2. For each link, it attempts to resolve metadata:
   - **Internal links:** Look up title + author from the database
   - **External links:** Check a local cache first, then fetch the page and extract `<title>`, Open Graph tags, or schema.org metadata
   - **DOIs:** Resolve via CrossRef API (free, no key needed)
   - **arXiv links:** Resolve via arXiv API (free)

3. The script deduplicates links (same URL appearing multiple times in a post = one bibliography entry) while preserving the order of first appearance.

4. Output: per-post bibliography files in `public/data/bibliography/[slug].json`

5. A **React component** (`Bibliography.tsx`) renders the formatted reference list.

6. The **PostHeader** shows a bibliography count (e.g., "† 7").

### What It Adds to the Stack

| Addition | Details |
|----------|---------|
| Build script | `scripts/generate-bibliography.ts` (~250 lines) |
| Data files | `public/data/bibliography/[slug].json` (one per post with external links) |
| Metadata cache | `public/data/link-metadata-cache.json` (cached external link titles/authors) |
| React component | `Bibliography.tsx` (~100 lines) |
| Header integration | Small addition to `PostHeader` for bibliography count |

**New dependencies:** None. HTTP fetches use built-in `fetch`. Metadata parsing uses regex or a lightweight HTML parser.

### Cost

$0. External metadata is fetched once and cached locally. CrossRef and arXiv APIs are free. Regular web pages are fetched with a simple HTTP request to extract the `<title>` tag.

The only "cost" is build time — if you have 500 posts each averaging 10 external links, that's 5000 HTTP requests on first run. With rate limiting at 10 requests/second, that's ~8 minutes. Subsequent runs only fetch metadata for new links (incremental).

---

## 6. Header Metadata Row

### What It Is

A small addition to the post header that shows three new data points at a glance: how many pages link to this page (backlinks), how many related pages exist (similar), and how many sources this page cites (bibliography).

### What It Looks Like

In the post header, after the existing metadata (date, category, tags, status, confidence, importance):

```
On the Examined Life
2026-01-15 · philosophy · ethics, stoicism, virtue
Status: Finished · Confidence: likely · Importance: 7

⁂ 3 backlinks   ≈ 8 similar   † 7 bibliography
```

Each is clickable — scrolls to the respective section on the page.

### Symbols

| Feature | Symbol | Meaning |
|---------|--------|---------|
| Backlinks | ⁂ (asterism) | Pages pointing inward to this one |
| Similar | ≈ (approximately equal) | Conceptually related pages |
| Bibliography | † (dagger) | Sources this page cites outward |

### How It Works

The `PostHeader` component receives three new optional props:

```typescript
interface PostHeaderProps {
  // ... existing props ...
  backlinkCount?: number;
  similarCount?: number;
  bibliographyCount?: number;
}
```

The detail page (`page.tsx`) reads the pre-computed JSON files to get the counts and passes them to the header. If a count is 0 or the data doesn't exist, the symbol is hidden.

### What It Adds to the Stack

| Addition | Details |
|----------|---------|
| Component modification | ~20 lines added to `PostHeader.tsx` |

**New dependencies:** None.

### Cost

$0.

---

## 7. Full Stack Impact

### Current Stack (Before)

```
Next.js 16 + React + TypeScript
SQLite (content.db) via better-sqlite3
MDX content pipeline (remark + rehype)
Tailwind CSS
Vercel (preview) / Dokploy (production)
```

### What Changes (After)

```
Added build scripts:     5 TypeScript files (~900 lines total)
Added data files:        ~5-10 MB of pre-computed JSON
Added components:        6 React components (~800 lines total)
Added npm dependency:    openai (dev dependency only, for embeddings script)
Added env variable:      OPENAI_API_KEY (used only in build scripts)
```

### What Does NOT Change

- No new databases (everything stays in SQLite + JSON)
- No new server-side runtime dependencies (all computation is at build time)
- No new API routes (all data is static JSON read by client components)
- No changes to the MDX pipeline
- No changes to the content creation workflow (createPost.js, generateMetadata.js)
- No changes to how posts are written or structured
- No changes to the deployment pipeline

### Build Time Impact

| Script | Time (500 posts) | Time (1000 posts) | Frequency |
|--------|-------------------|--------------------|-----------|
| generate-directories | ~2s | ~3s | Every build |
| generate-indexes | ~3s | ~5s | Every build |
| generate-embeddings | ~30s (API) | ~60s (API) | First run only, then incremental |
| generate-similarity | ~5s (math) | ~15s (math) | Every build |
| generate-backlinks | ~10s (file parsing) | ~20s | Every build |
| generate-bibliography | ~8 min (first run, HTTP) | ~15 min | First run only, then incremental |

After the first run, incremental builds add ~20-30 seconds to build time.

### File Size Impact

| File | Size (500 posts) | Size (1000 posts) |
|------|-------------------|--------------------|
| directory-tree.json | ~50 KB | ~100 KB |
| indexes/*.json | ~200 KB total | ~400 KB |
| embeddings.json | ~3 MB | ~6 MB |
| similarity.json | ~100 KB | ~200 KB |
| cluster-labels.json | ~5 KB | ~10 KB |
| backlinks.json | ~100 KB | ~200 KB |
| bibliography/*.json | ~500 KB total | ~1 MB |
| **Total** | **~4 MB** | **~8 MB** |

This is served as static JSON — it doesn't increase JavaScript bundle size. The data is fetched on demand when a user visits a relevant page.

---

## 8. Cost Breakdown

### One-Time Costs

| Item | Cost |
|------|------|
| OpenAI text-embedding-3-small (500 posts) | $0.005 |
| GPT-4o-mini cluster labels (50 clusters) | $0.002 |
| **Total one-time** | **$0.007** |

### Per New Post (Incremental)

| Item | Cost |
|------|------|
| Embed 1 new post | $0.00001 |
| Re-label 1 cluster (if needed) | $0.00004 |
| **Total per post** | **~$0.00005** |

### Annual Cost Estimate

Assuming 200 new posts/year:

| Item | Cost |
|------|------|
| Embeddings for 200 posts | $0.002 |
| Cluster re-labeling (~20 times) | $0.001 |
| **Annual total** | **~$0.003** |

### For Comparison

- A single ChatGPT message costs more than this entire system per year
- A cup of coffee costs ~50,000x more than running this annually
- The OPENAI_API_KEY is already in the stack (used elsewhere), so no new billing setup

---

## 9. Implementation Timeline

### Phase 1: Backlinks (Simplest, highest value)

**Effort:** 1-2 sessions
**Files:** 1 build script + 1 component + header mod
**Result:** Every post shows what links to it

This is the single highest-value feature per unit of effort. It requires no external APIs, no new dependencies, and creates the richest cross-referencing.

### Phase 2: Bibliography

**Effort:** 2-3 sessions
**Files:** 1 build script + 1 component + metadata cache
**Result:** Every post shows its sources

Builds on the same link-parsing infrastructure as backlinks. The extra work is resolving external link metadata (HTTP fetches + caching).

### Phase 3: Directory Layouts

**Effort:** 2-3 sessions
**Files:** 1 build script + 3 components + route integration
**Result:** Hierarchical category navigation

Requires thinking about the desired information architecture — how should categories nest? This is more of a design decision than a technical challenge.

### Phase 4: Index Pages

**Effort:** 1-2 sessions
**Files:** 1 build script + category page enhancement
**Result:** Smart-grouped category pages

Quick to build since it enhances existing category pages rather than creating new routes.

### Phase 5: Similarity / "Sort By Magic"

**Effort:** 3-4 sessions
**Files:** 2 build scripts + 2 components + OpenAI integration
**Result:** AI-powered related posts + magic sorting

The most complex feature. Should be done last since it's the most independent and the least critical.

### Phase 6: Header Metadata Row

**Effort:** 30 minutes
**Files:** PostHeader.tsx modification
**Result:** Backlink/similar/bibliography counts in headers

Trivial once the data exists. Do this alongside or right after each feature is built.

### Total Effort

~10-14 working sessions spread over 2-4 weeks. Each phase is independently useful — you don't have to do all six to benefit. Backlinks alone (Phase 1) would be a significant upgrade.

---

## 10. Decision Matrix

### Feature Independence

Each feature can be adopted independently. Here's which ones depend on others:

```
Backlinks         → standalone (no dependencies)
Bibliography      → standalone (no dependencies)
Directory Layouts → standalone (no dependencies)
Index Pages       → standalone (enhanced by directories but works without)
Similarity        → standalone (no dependencies)
Header Row        → requires at least one of: backlinks, similarity, bibliography
```

### Value vs. Effort

| Feature | Value | Effort | Ratio |
|---------|-------|--------|-------|
| Backlinks | ★★★★★ | ★★☆☆☆ | Highest |
| Bibliography | ★★★★☆ | ★★★☆☆ | High |
| Directory Layouts | ★★★☆☆ | ★★★☆☆ | Medium |
| Index Pages | ★★★☆☆ | ★★☆☆☆ | High |
| Similarity | ★★★★☆ | ★★★★☆ | Medium |
| Header Row | ★★☆☆☆ | ★☆☆☆☆ | High |

### Recommended Adoption Order

1. **Backlinks** — Immediate, highest ROI
2. **Header Row** — Trivial once backlinks exist
3. **Index Pages** — Quick win for better category navigation
4. **Bibliography** — Natural extension of backlinks
5. **Directory Layouts** — Valuable once content volume is high
6. **Similarity** — The "wow factor" feature, do when ready

### What If I Only Want Some Features?

**Minimal (just cross-referencing):** Backlinks + Header Row. 2 sessions. $0.

**Medium (organized knowledge base):** Backlinks + Index Pages + Directory Layouts + Header Row. 6 sessions. $0.

**Full (Gwern-level):** All six features. 12 sessions. $0.01.

---

## Appendix: Glossary

| Term | Meaning |
|------|---------|
| **Embedding** | A list of numbers (vector) that represents the meaning of a text. Texts with similar meanings have similar vectors. Generated by an AI model. |
| **Cosine similarity** | A math formula that measures how similar two vectors are. Returns a number from -1 (opposite) to 1 (identical). Used to find related posts. |
| **KNN (K-Nearest Neighbors)** | Algorithm that finds the K most similar items to a given item. Here, the K most similar posts to a given post. |
| **Clustering** | Grouping similar items together. Used for "Sort By Magic" to create labeled sections of related posts. |
| **Backlink** | A reverse reference. If page A links to page B, then B has a backlink from A. |
| **Bibliography** | A list of all sources (links) cited in a post, with resolved metadata (title, author). |
| **Build-time computation** | Processing that happens when the site is built/deployed, not when a user visits. Results are saved as static files. Zero runtime cost. |
| **Incremental update** | Only processing new or changed content instead of reprocessing everything. Saves time and money. |
| **Directory layout** | A page that shows the hierarchical structure of content, like a file manager view. |
| **Index page** | An enhanced category/tag page with smart grouping, thumbnails, and cross-references. |
| **Static JSON** | Pre-computed data files served as-is to the browser. No server computation needed at request time. |
| **Junction table** | A database table that connects two other tables (e.g., `content_tags` connects content to tags). |
| **GPT-4o-mini** | A small, fast, cheap OpenAI language model used here only for generating 1-2 word labels for content clusters. |
| **text-embedding-3-small** | OpenAI's embedding model. Converts text into 1536-dimensional vectors. Cheapest embedding model available. |

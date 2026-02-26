# Suckless Revision: Progressive Philosophy Alignment for krisyotam.com

## Context

This site follows the suckless/cat-v/werc/Plan 9 philosophy and should progressively embody those principles: simplicity, filesystem-as-truth, minimal abstraction, no bloat, each piece does one thing. The focus has been on deletion. This plan is the roadmap for what comes after — organized into phases to tackle over time.

The audit found **3 systemic issues** and a long tail of bloat.

---

## Phase 1: Delete Dead Weight (Immediate)

Things that serve no purpose. Pure deletion, no refactoring needed.

### 1a. Remove unused dependencies from package.json

```
firebase                    # 0 imports in active code
@supabase/supabase-js       # 0 imports in active code
@apollo/client              # only in /archive (excluded from tsconfig)
graphql                     # only used by apollo
graphql-ws                  # only used by apollo
msgpack-lite                # redundant with @msgpack/msgpack
```

Estimated savings: ~650KB from node_modules, faster installs.

### 1b. Delete 37 unused UI components from src/components/ui/

These are never imported anywhere in the codebase:

```
accordion, alert, alert-dialog, aspect-ratio, avatar, badge-alt, breadcrumb,
button-alt, calendar, carousel, chart, checkbox, collapsible, command, compare,
context-menu, dialog-alt, drawer, dropdown-menu, form, HeadlessSelect,
input-otp, marquee, menubar, navigation-menu, pagination, popover,
radio-group, resizable, select, sheet, skeleton, slider, sonner,
switch, toggle-group, use-mobile
```

Then remove corresponding unused Radix packages from package.json (any `@radix-ui/*` package only imported by deleted components).

### 1c. Delete the /archive directory or move to a branch

`src/components/archive/` — 75 files, 576KB, excluded from tsconfig compilation. It's dead code in the repo that every clone pulls down.

### 1d. Audit MDX component registry

`src/mdx-components.tsx` registers 47+ components. Grep `~/content/` for actual usage of each. Delete registrations (and their component files) for any unused ones. Known redundancies:
- `Movie` and `Film` are both aliases for `Frame`
- `Img` is registered twice

---

## Phase 2: Consolidate the Content Route Explosion (The Big Win)

This is the single largest violation of suckless philosophy in the codebase. **14 content types × 6+ near-identical files = 84+ files** where ~12 could do the job.

### The Problem

Every content route (blog, essays, notes, papers, fiction, diary, reviews, verse, ocs, progymnasmata, news, sequences) has:
```
[type]/
  page.tsx                    # ~95% identical across types
  [Type]ClientPage.tsx        # Same structure, different prop names
  [category]/
    page.tsx                  # ~90% identical
    [slug]/
      page.tsx                # ~85% identical
      [Type]PageClient.tsx    # Same header/footer pattern
  categories/page.tsx         # Nearly identical
  tags/page.tsx               # Nearly identical
  tag/[slug]/page.tsx         # Nearly identical
```

### The Fix: Shared Content Route

Create a single dynamic content route system:

**`src/app/(content)/[type]/page.tsx`** — One index page that reads `type` from params:
```tsx
export default async function ContentIndex({ params }) {
  const { type } = await params
  const posts = getActiveContentByType(type)
  const categories = getCategoriesByContentType(type)
  return <ContentListPage type={type} posts={posts} categories={categories} />
}
```

**`src/app/(content)/[type]/[category]/[slug]/page.tsx`** — One detail page:
```tsx
export default async function ContentDetail({ params }) {
  const { type, category, slug } = await params
  const Content = (await import(`@/content/${type}/${slug}.mdx`)).default
  // ... same pattern, parameterized by type
}
```

**One shared `ContentListPage.tsx`** client component replaces 14 `[Type]ClientPage.tsx` files.
**One shared `ContentDetailClient.tsx`** replaces 14 `[Type]PageClient.tsx` files.

**Result**: ~84 files → ~12 files. Same functionality.

### Files to modify
- `src/app/(content)/` — restructure to use `[type]` dynamic segment
- `src/lib/data.ts` — already has `getActiveContentByType(type)`, just use it everywhere
- `src/components/content/` — make `ContentListPage` and `ContentDetailClient` accept `type` as a prop
- Delete all 14 type-specific directories and their duplicate files

---

## Phase 3: Unify the Type System

### The Problem

`src/types/content.ts` (592 lines) defines 14+ nearly identical interfaces:
- `BlogMeta`, `NoteMeta`, `PaperMeta`, `ReviewMeta`, `OCSMeta`, etc.
- All share: title, slug, tags, category, status, confidence, importance, dates, cover_image
- 11 backward-compatibility aliases add noise
- Multiple `Confidence` enum variants (`Confidence`, `ExtendedConfidence`, `BlogConfidence`)

### The Fix

One interface with a type discriminant:
```typescript
interface ContentMeta {
  type: ContentType
  slug: string
  title: string
  preview?: string
  cover_image?: string
  category: string
  tags: string[]
  status?: Status
  confidence?: Confidence
  importance?: number
  start_date: string
  end_date?: string
  state: 'active' | 'hidden'
}

type ContentType = 'blog' | 'essays' | 'notes' | 'papers' | 'reviews' |
  'fiction' | 'verse' | 'diary' | 'ocs' | 'progymnasmata' | 'news'
```

One `Confidence` type. One `Status` type. Delete the rest.

### Files to modify
- `src/types/content.ts` — rewrite to single interface
- `src/lib/data.ts` — update return types
- All components that reference type-specific interfaces

---

## Phase 4: Centralize Data Fetching

### The Problem

`src/lib/data.ts` (730 lines) exports 35+ functions with subtle variations:
- `getEssaysData()`, `getBlogData()`, `getNotesData()` — all do the same thing with different table names
- `getActiveContentByType(type)` already exists but is duplicated by these wrappers

### The Fix

Keep only the generic functions:
```typescript
getActiveContentByType(type: string): ContentMeta[]
getContentBySlug(type: string, slug: string): ContentMeta | null
getCategoriesByContentType(type: string): Category[]
getTagsByContentType(type: string): Tag[]
getTagsForContent(type: string, id: number): string[]
```

Delete all type-specific wrappers. ~730 lines → ~200 lines.

### Files to modify
- `src/lib/data.ts` — delete redundant functions
- All imports of deleted functions — update to use generic versions

---

## Phase 5: Make the Filesystem the Source of Truth (Philosophical Core)

This is the werc/Plan 9 principle: the file IS the content, complete and self-describing.

### The Problem

Currently, a post is split across two systems:
- **Filesystem**: MDX file (content body only, no metadata)
- **Database**: content.db (all metadata: title, category, tags, status, dates)

If the database is lost, posts exist but are invisible. The database is the source of truth, which fights the filesystem.

### The Fix: Add Frontmatter to MDX Files

Make each MDX file self-contained:
```mdx
---
title: "Boy, Interrupted"
category: philosophy
tags: [autobiography, development, interruption]
status: Notes
confidence: certain
importance: 9
start_date: "2025-07-14"
preview: "a meditation on interrupted boyhood..."
---

<Excerpt title="The Fire Next Time" author="James Baldwin" year="1963">
...
```

Then **derive the database from files** at build time (invert the flow):
```
CURRENT:  createPost.js → INSERT INTO db → build reads db
PROPOSED: write .mdx with frontmatter → build scans files → generates db
```

The database becomes a **cache/index** for fast queries, not the source of truth. If it's deleted, rebuild from files.

### Migration script
- Query content.db for all metadata
- For each row, prepend YAML frontmatter to the matching .mdx file
- Update build pipeline to scan frontmatter → populate db
- Update `generateMetadata.js` to write frontmatter instead of INSERT

### Files to modify
- All `~/content/**/*.mdx` files — add frontmatter
- `src/lib/data.ts` — add frontmatter scanning option
- `public/scripts/keep/generateMetadata.js` — write frontmatter
- `next.config.mjs` — sexy URLs could scan files instead of db

---

## Phase 6: Simplify CSS

### The Problem
- `globals.css`: 1,748 lines with conflicting `!important` declarations
- 19 scattered component CSS files
- Tailwind config has a 90-line safelist of dark mode classes (brittle)

### The Fix
- Audit globals.css — remove dead rules, resolve `!important` conflicts
- Move component-specific CSS into the components themselves (CSS modules or inline)
- Replace the Tailwind safelist with dynamic class generation or just use the CSS custom property theme system directly (it already works standalone, as proven by the werc POC)
- `content.css` and `default.css` are clean and well-structured — keep as-is

---

## Phase 7: Database Consolidation

### The Problem
6 SQLite databases where 2-3 would suffice:
- `content.db` (652KB) — posts, categories, tags
- `system.db` (488KB) — TIL, Now, quotes, changelog
- `media.db` (568KB) — films, anime, music
- `reference.db` (46MB) — dictionaries, KJV (investigate why so large)
- `lab.db` (28KB) — could merge into system.db
- `storage.db` (40KB) — could merge into system.db

### The Fix
- Merge `lab.db` and `storage.db` into `system.db`
- Audit `reference.db` — 46MB is suspicious; trim or move to external storage
- Keep `content.db`, `system.db`, `media.db` as the three domains

---

## Phase 8: Reduce Heavy Dependencies (When Convenient)

Lower priority — address when touching these areas:

| Dependency | Size | Used In | Alternative |
|-----------|------|---------|-------------|
| mapbox-gl | 600KB+ | 1 page (/globe) | Leaflet (100KB) or remove feature |
| tsparticles | 100KB | 1 component (sparkles) | CSS animation or remove |
| framer-motion | 150KB | 18 components | CSS transitions for most cases |
| recharts | 150KB | 4 stat charts | Keep if stats are core; else native SVG |
| marked + react-markdown | both installed | Pick one | Consolidate to one markdown lib |

---

## Execution Order

The phases are ordered by impact and independence:

1. **Phase 1** (Delete dead weight) — Do now, no risk, immediate cleanup
2. **Phase 2** (Content route consolidation) — The biggest structural win; do during the refactoring phase
3. **Phase 3 + 4** (Types + data fetching) — Natural follow-up to Phase 2; do together
4. **Phase 5** (Frontmatter as source of truth) — The philosophical core; do when ready for the migration script
5. **Phase 6-8** — Polish; do opportunistically

---

## Verification

After each phase:
- `npm run build` should succeed
- All pages render correctly
- `wc -l src/**/*.tsx | tail -1` should show decreasing line count
- `du -sh node_modules` should shrink after Phase 1
- `find src/app -name "page.tsx" | wc -l` should drop significantly after Phase 2

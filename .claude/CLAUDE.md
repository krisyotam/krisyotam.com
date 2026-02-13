#################################################################################
#                                                                               #
#   ██████╗██╗      █████╗ ██╗   ██╗██████╗ ███████╗   ███╗   ███╗██████╗       #
#  ██╔════╝██║     ██╔══██╗██║   ██║██╔══██╗██╔════╝   ████╗ ████║██╔══██╗      #
#  ██║     ██║     ███████║██║   ██║██║  ██║█████╗     ██╔████╔██║██║  ██║      #
#  ██║     ██║     ██╔══██║██║   ██║██║  ██║██╔══╝     ██║╚██╔╝██║██║  ██║      #
#  ╚██████╗███████╗██║  ██║╚██████╔╝██████╔╝███████╗   ██║ ╚═╝ ██║██████╔╝      #
#   ╚═════╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝   ╚═╝     ╚═╝╚═════╝       #
#                                                                               #
#  File      : CLAUDE.md                                                        #
#  Project   : krisyotam.com                                                    #
#  Author    : Kris Yotam                                                       #
#  Date      : 2026-02-04                                                       #
#  Purpose   : Claude guidance + project-specific conventions for krisyotam.com #
#                                                                               #
#################################################################################

# Taxonomy: Categories, Tags
  [ Categories ]
  Categories are Top-level tags, stable, general, and intentionally limited. 
  They function as primary entry points for navigation and retrieval.
    - Use as few as possible
      - Categories should be rare and durable. Adding a new one shoudl feel expensive.
    - Categories must not overlap
      - Ex. "philosophy" & "ethics" cannot both be categories, since philosophy is more general "ethics" is demoted to a tag. 
    - Categories are plural by convention
      - Ex. books, films, ideas
      - Special Case: a category that is obviouslly referred to in the singular i.e. software, hardware
    - Categories are lower-case
      - In the database categories are lowercase, the site can manipulate the data when a change in format is needed aesthetically. "Avant-Garde" is to be submitted as "avant-garde" and "Philosophy" as "philsophy" 
    - Categories are single words
      - i.e. most field names are singular, and in the case they are plural like "Marine Biology" it is a subset of the category "Biology"
      - Special Case: some field names at top level require two words i.e. "Computer Science" which is a top level field and thus a category.
    - Keep Categories on a general level.
      - i.e. It is preferred to have "Sports" over "Soccer" or "Weightlifting" as a Category. The other's as less general and tags. 
    - Omit Categories that are obvious
      - If it has a top level route in my site i.e. (papers, essays, blog, til, notes) it is obvious. Also things such as "Post" or "2026" ect. are to obvious and communicated via other formats. 
    - Keep one true language.
      - i.e. all tags are in english, "Philosophy" is taken over "Filosofia" in all cases
      - Special Case: the category is a field like "fiqh", "tafsir", ect. with no clean english alternative at all or well known. Other examples include: Otaku, Leitmotif, Ennui, "Avant-Garde"
    - Explain Categories
      - i.e. the description of a category should be to the point, specific. The following are key pairs in the fomrat [Category] [Description]
        - "software" "Programs, tools, and systems used to perform computational tasks or manage inforamtion"
        - "hardware" "Physical computing equipment, components, and peripherals."
        - "philosophy" "Notes and writings on metaphysics, epistemology, ethics, logic, and related fields"
        - "security" "Topics related to privacy, cryptography, threat models, and defensive computing practices"
        - "history" "Analyis and documentation of past events, periods, and historical narratives"
      - Categories should have Metadata
        - Status: includes one of the following {Abandoned, Notes, Draft, In Progress, Finished}, Tag pages are always "In Progress"
        - Confidence: includes {certain, highley likely, likely, possible, unlikely, highly unlikely, remote, impossible} Categories where the information is very verifiable and highly professionally sourced skews towards "certain" where a tag like "Conspiracies" would skew toward unlikely or even "impossible" on the major side. 
        - Importance: rank the content from 0-10 with it's potential impact on {The Reader, The intended audience, the world at large} For help with importance rankings use "Reader Avatar" section below for proper profiling. 
  [ Tags ]
  Tags exist under categories, one level deep. They refine, not replace categories.
    - Tags should be in relation to top level categories
      - i.e. where "sports" is a category sports (soccer, golf, ping-pong) is the relationship between 3 tgags and a category
    - Use few new tags as possible per item. 
      - i.e. the value of a tag increases the more it is used so rather than "jogging, sprinting, distance" prefer "running" which can class under "sports" as a category but also holds anything related to topics: distance running, sprinting, marathons, ect. 
      - Tags should remain stable
        - i.e. "soccer" is to be preferred to "world-cup-2022". for things that need classification this deep they have their own internal system for there route for ex. /reviews
      - Tags should be specific
        - "Marine Biology" is preferred to "Biology" as biology is to general and therefor considered a category
      - 3 Tags per piece of content
        - 3 is a minimum for the amount of tags I want used for a piece of content. Try to reuse as many that make sense as possible and be scarce with creation of new tags only if needed. 
        - Special Case: if a post is trule only explained by one or two tags that is fine. if a post needs more than 3 that is fine. 
    - Apply from [Categories] the following: "Are Lowercase", "One True Language", "Metadata"

# Applying Categories / Tags

When creating content via createPost.js, Claude must determine metadata automatically.
Use this guidance to make consistent, thoughtful decisions.

## Metadata Determination Guide

### Status (Completion Level)
Assess based on the content's apparent completeness:

| Status | When to Use |
|--------|-------------|
| Notes | Raw thoughts, bullet points, unstructured ideas |
| Draft | Has structure but incomplete arguments or missing sections |
| In Progress | Substantially complete, being actively refined |
| Finished | Complete, polished, ready for readers |
| Abandoned | Explicitly marked as no longer being developed |

Default: "Draft" for new entries (user will develop the content)

### Certainty (Epistemic Confidence)
Assess based on verifiability and source quality:

| Certainty | When to Use |
|-----------|-------------|
| certain | Mathematical proofs, well-documented facts, primary sources |
| highly likely | Peer-reviewed research, expert consensus, strong evidence |
| likely | Well-reasoned analysis, reputable secondary sources |
| possible | Informed speculation, interpretive work, philosophical arguments |
| unlikely | Contrarian positions, minority views with some merit |
| highly unlikely | Speculative theories with limited support |
| remote | Highly speculative, little evidence |
| impossible | For cataloging purposes only (e.g., analyzing conspiracy theories) |

Default: "possible" for opinion/analysis, "likely" for factual content

### Importance (1-10 Scale)
Rate based on potential impact on the target reader (see Reader Avatar below):

| Range | Criteria |
|-------|----------|
| 1-3 | Niche interest, personal notes, limited audience appeal |
| 4-5 | Moderate interest, useful for specific domains |
| 6-7 | Broad appeal, significant insight or synthesis |
| 8-9 | Essential reading, major contribution to understanding |
| 10 | Rare - paradigm-shifting, foundational work |

Default: 5 (moderate importance)

### Category Selection
Choose the MOST RELEVANT single category from the global pool:
- culture, film, history, literature, philosophy, psychology, science, technology, theology
- Exceptions: on-myself (personal reflections), manuals-of-style (meta/process), website (site-related)

For type-specific categories:
- Progymnasmata: chreia, commonplace, comparison, confirmation, description, encomium, fable, impersonation, introduction-of-a-law, maxim, narrative, refutation, thesis, vituperation
- Reviews: anime, book, bookstores, film, manga, television

### Tag Selection
Select 3+ tags that:
1. Are lowercase and stable (not event-specific)
2. Refine rather than duplicate the category
3. Maximize reuse of existing tags
4. Are specific but not overly narrow

Examples:
- Category "philosophy" + tags: ethics, virtue, stoicism
- Category "technology" + tags: programming, web-development, javascript
- Category "literature" + tags: poetry, modernism, translation

# Reader Avatar 
{
  "avatar_id": "polymath_reader_v1",
  "label": "The Serious Generalist",
  "core_identity": {
    "orientation": ["intellectually curious", "polymathic", "autodidactic", "analytical", "aesthetically literate"],
    "self_concept": ["sees learning as lifelong", "rejects shallow consensus", "values synthesis over specialization", "derives identity from taste and discernment"]
  },
  "domains_of_interest": {
    "primary": ["philosophy", "mathematics", "literary fiction", "film theory", "fine arts", "history", "political economy"],
    "secondary": ["theology", "systems theory", "technology criticism", "media studies", "ethics", "aesthetics"]
  },
  "intellectual_style": {
    "thinking_mode": ["first-principles reasoning", "comparative analysis", "historical contextualization", "cross-domain synthesis"],
    "preferred_signal": ["primary sources", "long-form argumentation", "formal structure", "conceptual rigor"],
    "disliked_signal": ["content marketing tone", "motivational abstraction", "simplified explainers", "performative certainty"]
  },
  "aesthetic_sensibility": {
    "values": ["restraint", "precision", "intentionality", "negative space"],
    "attracted_to": ["monochrome design", "dense but navigable text", "footnotes and marginalia", "archival presentation"]
  },
  "media_relationship": {
    "consumption_pattern": ["slow reading", "re-reading", "annotation-heavy", "offline or semi-offline workflows"],
    "output_modes": ["essays", "criticism", "research notes", "private archives"]
  },
  "psychological_profile": {
    "motivations": ["truth-seeking", "taste formation", "intellectual self-sovereignty", "coherence of worldview"],
    "frictions": ["distrust of mass culture", "fatigue with algorithmic feeds", "impatience with superficial discourse"]
  },
  "social_positioning": {
    "roles": ["critic", "analyst", "writer", "researcher", "archivist"],
    "community_preference": ["small, high-signal audiences", "asynchronous discussion", "written over spoken debate"]
  },
  "expectations_from_author": {
    "minimum": ["intellectual honesty", "clear epistemic boundaries", "non-patronizing tone"],
    "ideal": ["original synthesis", "willingness to be unfinished", "documented thinking over conclusions"]
  },
  "implicit_assumptions": ["intelligence is cultivated, not innate", "taste is a form of ethics", "clarity is a moral obligation", "archives outlast opinions"]
}







# Creating Posts

When the user asks to create a new post (blog, essay, note, diary entry, paper, review, TIL, now update, or progymnasmata), use the createPost.js workflow:

## Slug URL Rules

Slugs are URL-safe identifiers derived from titles. They MUST be:

1. **Explanative** — The slug should clearly indicate the content
   - Good: `girl-interrupted` for a review of Girl Interrupted
   - Bad: `review-1` or `gi-2026`

2. **Simple** — Keep it minimal, no unnecessary words
   - Good: `girl-interrupted`
   - Bad: `my-review-of-the-movie-girl-interrupted-1999`

3. **Globally Unique** — No two pieces of content across ANY route can share the same slug
   - This is required for magic-urls to function properly
   - Before creating, verify the slug doesn't exist in: papers, blog, essays, notes, diary, progymnasmata, reviews, til, now
   - If a conflict exists, make the slug more specific (e.g., `stoicism` → `stoicism-daily-practice`)

4. **Lowercase with hyphens** — No spaces, underscores, or special characters
   - Good: `a-room-of-my-own`
   - Bad: `A_Room_Of_My_Own` or `a room of my own`

Examples:
| Title | Slug |
|-------|------|
| Girl Interrupted | `girl-interrupted` |
| A Room of My Own | `a-room-of-my-own` |
| Why I Use Vim | `why-i-use-vim` |
| The Brothers Karamazov (Review) | `the-brothers-karamazov` |

## Workflow

1. **Ask the user** for the required information based on post type:

   | Post Type | Ask For |
   |-----------|---------|
   | papers, blog, essays, notes, diary, progymnasmata | Title, Preview/description |
   | reviews | Title, Preview/description, Rating (1-10) |
   | til | Title, Full content |
   | now | Full content only |

2. **Call generateMetadata.js** with the collected info plus your metadata decisions:

   ```bash
   node public/scripts/keep/generateMetadata.js --type TYPE --title "TITLE" --preview "PREVIEW" --category CATEGORY --tags "tag1,tag2,tag3" [--status STATUS] [--certainty CERTAINTY] [--importance N]
   ```

3. **Determine metadata** following the rules in "Applying Categories / Tags" section:
   - Category: Choose from global pool or type-specific categories
   - Tags: Select 3+ relevant tags (lowercase, stable, specific)
   - Status/Certainty/Importance: Use the Metadata Determination Guide

## Example

User: "Create a new blog post about functional programming"

Claude asks: "What's the title and a brief preview/description?"

User: "Title: Why I Switched to Haskell. Preview: My journey from imperative to functional programming."

Claude runs:
```bash
node public/scripts/keep/generateMetadata.js --type blog --title "Why I Switched to Haskell" --preview "My journey from imperative to functional programming" --category technology --tags "functional-programming,haskell,programming" --status Draft --certainty likely --importance 6
```

## Important Notes

- Do NOT ask the user for category, tags, status, certainty, or importance — determine these yourself
- For reviews, the user MUST provide the rating (it's their subjective opinion)
- Always use generateMetadata.js directly; do not manually create database entries or MDX files

## Diary Route Restrictions

The `/diary` route has special restrictions to prevent tag/category sprawl:

- **NO NEW TAGS** — Diary entries must use only existing tags from the database
- **NO NEW CATEGORIES** — Diary entries must use only existing global categories

Before creating a diary entry, query existing tags:
```bash
sqlite3 public/data/content.db "SELECT slug FROM tags ORDER BY slug"
```

Pick 3 relevant tags from the existing pool. If no perfect match exists, use the closest general tags (e.g., use `personal` instead of creating `personal-reflection`).


# Git Commits

All commits for this repository MUST be made using the git.js script:

```bash
# Interactive mode
node public/scripts/keep/git.js

# Headless mode (for automation)
node public/scripts/keep/git.js --headless --content "content entry" --kind daily
node public/scripts/keep/git.js --headless --infra "infrastructure entry" --kind daily
node public/scripts/keep/git.js --headless --content "content" --infra "infra" --kind reflection
node public/scripts/keep/git.js --headless --message "regular commit message"
```

Options:
- `--headless` - Run without prompts
- `--content "text"` - Content changelog entry (essays, blog posts, etc.)
- `--infra "text"` - Infrastructure changelog entry (code changes, bug fixes, etc.)
- `--kind TYPE` - Entry type: daily, reflection, milestone (default: daily)
- `--message "text"` - Regular commit message (skips changelog)
- `--no-push` - Skip pushing to remote

The script automatically updates the changelog database (public/data/system.db) and formats commit messages.

Do NOT use raw git commands for commits. If git.js is missing functionality, update it first then use it.


# Builds

## CRITICAL: Build Commands
- **ALWAYS** use `npm run build` for local and production builds
- **NEVER** use `npm run build:lowmem` - this is deprecated and should not be used
- Docker/Dokploy uses `npm run build` (see .config/docker/Dockerfile line 89)

## Local Build
```bash
npm run build
```

## Vercel (Preview Only)
- Project: krisyotam.com (offlinedevs/krisyotam.com)
- Production is self-hosted via Dokploy, Vercel is used for preview builds only

```bash
# Preview deployment (creates a unique URL for testing)
vercel

# Check deployment status
vercel ls

# View deployment logs
vercel logs <deployment-url>
```

## Environment Variables
```bash
# List all env vars
vercel env list

# Add a new env var (must add to each environment separately)
echo "value" | vercel env add VAR_NAME production
echo "value" | vercel env add VAR_NAME preview
echo "value" | vercel env add VAR_NAME development

# Remove an env var
vercel env rm VAR_NAME -y

# Pull env vars to local .env.local
vercel env pull
```

## Workflow
1. Make code changes locally
2. Run `vercel` to create a preview deployment
3. Check the preview URL for errors
4. If build passes, commit and push to trigger Dokploy production deploy


# MDX Content
MDX files are content-only — no frontmatter. All metadata lives in `content.db`.
To reconstruct full MDX files with frontmatter (for archival or migration), run:
```bash
bash public/scripts/keep/export.sh
```
This exports to `~/export/` with the original comment header + YAML frontmatter prepended.


# Constants
 [] any owner var will always be set to Kris Yotam, as I am the primary sole developer even though occasionally friends or a prof. might look at a code base all creations within it are assumed to be mine. 
 [] 


# Metadata Type Standard 

@type --> file type, ex.: @type type, @type utils @type component, @type styles
@data --> in public/data what database does this file pull from if any: ex. @data content, @data media --> the value is the database name without ".db" tacked on to it so @data media evaluates to public/data/media.db
@path --> points to exact file path from root
@origin --> if needed to give credit to another person it will evaluate to a value of name and url for persons site 
for ex.: @origin project:<name> <url> or @origin person:Chris P. <https://ch1p.io>, for another origin in the same file 
please do not comma seperate instead add a second @origin beneat the first one 

if a specific type of metadata for ex. origin is not needed it does not need to be included with the exception of @type, and 
@path which must be in every file. 
@date --> the date the file was created 
@updated --> the date the file was last touched 




# Components 

/*
+------------------+----------------------------------------------------------+
| FILE             | {FILE} # Full File Name i.e. this-file.tsx               |
| ROLE             | {ROLE}                                                   |
| OWNER            | {OWNER, i.e Kris Yotam}                                  |
| CREATED          | {YYYY-MM-DD}                                             |
| UPDATED          | {YYYY-MM-DD}                                             |
+------------------+----------------------------------------------------------+
| @type component                                                             |
| @path <path-to-file>                                                        | 
| @origin                                                                     | 
+------------------+----------------------------------------------------------+
| SUMMARY                                                                     |
| {2-5 lines summary}                                                         |
+-----------------------------------------------------------------------------+
*/


# Layout 

/* ============================================================================
 * {FILE} — {DESC}
 * {AUTHOR} | Created: {YYYY-MM-DD} | Updated: {YYYY-MM-DD}
 * @type layout
 * @path path-to-file
 * ========================================================================== */



# Types

/**
 * TYPES: {DOMAIN}
 * File:  {FILE}
 *
 * Contains:
 *   - {TypeA}: {meaning}
 *   - {TypeB}: {meaning}
 *
 * Notes:
 *   {e.g., keep runtime-free, no imports from server-only modules}
 */


# Page Description

When adding a "page description" to any page, use the `PageDescription` component from `@/components/core`.

```tsx
import { PageDescription } from "@/components/core"

<PageDescription
  title="About this page"
  description="Brief, articulate explanation of the page's purpose."
/>
```

Props:
- `title`: Header text for the description modal
- `description`: The page explanation text
- `icons`: Optional array of `{ slug: string, url: string }` for icon links

The component renders as a help button (?) in the bottom-left corner that opens a modal with the description.


# Canonical Content Routes

Content routes are routes in `src/app/(content)/` whose primary content is MDX files stored in a `content/` subdirectory.
Not all routes in `(content)` are "content routes" — only those with MDX content qualify (e.g., /notes, /essays, /papers, /blog, /diary).
Routes like /til that exist in (content) but don't use MDX content subdirectories are NOT canonical content routes.

## Directory Structure

Each canonical content route follows this structure:

```
src/app/(content)/[route]/
├── page.tsx                      # Server: Index page (fetches data, passes to client)
├── [Route]ClientPage.tsx         # Client: List view with search/filter/navigation
├── [category]/
│   ├── page.tsx                  # Server: Category-filtered view
│   └── [slug]/
│       ├── page.tsx              # Server: Detail page (imports MDX, extracts headings)
│       └── [Route]PageClient.tsx # Client: Header + footer sections
├── categories/
│   ├── page.tsx                  # Server: List categories for this route
│   └── [Route]CategoriesClientPage.tsx
├── tags/
│   ├── page.tsx                  # Server: List tags for this route
│   └── [Route]TagsClientPage.tsx
├── tag/
│   └── [slug]/
│       ├── page.tsx              # Server: Filter by tag within this route
│       └── [Route]TaggedPage.tsx
└── content/
    └── [category]/
        └── *.mdx                 # MDX content files with YAML frontmatter
```

**NOTE**: Route-specific category/tag pages exist for filtering within each route, but they MUST use
categories and tags from the GLOBAL pool (see Categories & Tags section below).

## Index Page Pattern (`/[route]/page.tsx`)

Server component responsibilities:
1. Fetch all active content via `getActiveContentByType('[route]')`
2. Fetch categories via `getCategoriesByContentType('[route]')` — MUST use global categories
3. Optionally fetch view counts for analytics
4. Sort by date (newest first)
5. Pass data to client component

```tsx
export default async function RoutePage() {
  const items = getActiveContentByType('route');
  const categories = getCategoriesByContentType('route');  // Global categories
  return <RouteClientPage items={items} categories={categories} />;
}
```

## Client List Page Pattern (`[Route]ClientPage.tsx`)

Components used:
- `PageHeader` — Title and metadata display
- `Navigation` — Search bar, category dropdown, view toggle (from `@/components/content/navigation`)
- `ContentTable` — Sortable list view (from `@/components/content/content-table`)
- `PageDescription` — Help modal (bottom-left "?")

Features:
- Search: Filters by title, tags, category (case-insensitive)
- Category filter: Dropdown using global categories
- View toggle: List/Grid modes
- URL sync: Category selection updates URL to `/[route]/[category]`

## Detail Page Pattern (`/[route]/[category]/[slug]/page.tsx`)

Server component responsibilities:
1. `generateStaticParams()` — Generate all slug combinations
2. `generateMetadata()` — OG/Twitter meta tags
3. Dynamically import MDX file
4. Extract headings for TOC via `extractHeadingsFromMDX()`
5. Render with ViewTracker for analytics

```tsx
export default async function DetailPage({ params }) {
  const { category, slug } = await params;
  const item = findItem(category, slug);
  const headings = await extractHeadingsFromMDX('route', slug, category);
  const Content = (await import(`@/app/(content)/route/content/${category}/${slug}.mdx`)).default;

  return (
    <div className="relative min-h-screen pt-16">
      <ViewTracker slug={`route/${category}/${slug}`} />

      {/* Header section */}
      <RoutePageClient item={item} headerOnly={true} />

      {/* Main content */}
      <main id="content" className="container max-w-[672px] mx-auto px-4">
        {headings.length > 0 && <TOC headings={headings} />}
        <div className="content"><Content /></div>
        <RoutePageClient item={item} contentOnly={true} />
      </main>

      <Sidenotes containerSelector="#content" />
    </div>
  );
}
```

## Client Detail Page Pattern (`[Route]PageClient.tsx`)

Two rendering modes controlled by props:
- `headerOnly={true}` — Renders `PostHeader` with title, dates, tags, category, status, confidence, importance
- `contentOnly={true}` — Renders footer section: Comments, Citation, LiveClock, Footer

Standard metadata displayed in header:
- Title, subtitle
- Start date, end date (or updated date)
- Category (linked)
- Tags (linked)
- Status, Confidence, Importance (for most routes)
- Back button to index

## Categories & Tags (GLOBAL POOL)

All content routes share a GLOBAL pool of categories and tags. This means:
- The same categories and tags are available across all content types
- Categories and tags must follow the rules in the Taxonomy section above
- Route-specific pages (`/notes/categories`, `/notes/tags`) filter content within that route but use global data

**Data Sources:**
- Categories: `getCategoriesByContentType('[route]')` from `@/lib/data`
- Tags: `getTagsByContentType('[route]')` from `@/lib/data`

**Global Navigation Routes (cross-type):**
- `/categories` — Lists all categories across all content types
- `/category/[slug]` — Shows all content from any type in this category
- `/tags` — Lists all tags across all content types
- `/tag/[slug]` — Shows all content with this tag across types

**Route-Specific Pages (within-type filtering):**
- `/[route]/categories` — Lists categories used by this content type
- `/[route]/tags` — Lists tags used by this content type
- `/[route]/tag/[slug]` — Shows content of this type with the tag

**Allowed Exception Categories:** `on-myself`, `manuals-of-style`, `website`

The `PostHeader` component links tags to `/tag/[slug]` and categories to `/category/[slug]` (global).
The Navigation component's category dropdown filters WITHIN the current route (`/notes/[category]`).

## MDX Content Files

MDX files are content-only (no frontmatter). All metadata lives in `content.db`.
To reconstruct full files with frontmatter for archival, run `bash public/scripts/keep/export.sh`.

## URL Patterns

### Route-Specific URLs
| Pattern | Purpose |
|---------|---------|
| `/[route]` | Index — all content |
| `/[route]/[category]` | Filter by category (within route) |
| `/[route]/[category]/[slug]` | Detail page |
| `/[route]/categories` | List categories for this route |
| `/[route]/tags` | List tags for this route |
| `/[route]/tag/[slug]` | Filter by tag (within route) |

### Global Category/Tag URLs
| Pattern | Purpose |
|---------|---------|
| `/categories` | List all categories (global) |
| `/category/[slug]` | All content in category (global) |
| `/tags` | List all tags (global) |
| `/tag/[slug]` | All content with tag (global) |

## Key Components

From `@/components/core/`:
- `PageHeader` / `PostHeader` — Unified header
- `TOC` — Table of contents from headings
- `ViewTracker` — Analytics
- `Sidenotes` — Footnote rendering
- `PageDescription` — Help modal
- `Citation` — BibTeX block
- `Comments` — Discussion section
- `Footer` — Site footer

From `@/components/content/`:
- `Navigation` — Search + category filter + view toggle
- `ContentTable` — Sortable list view


# Styles

/* ============================================================================
 * FILE:  {FILE}
 * ROLE:  STYLESHEET
 *
 * PURPOSE:
 *   {single sentence}
 *
 * @type styles
 * @path {path-to-file}
 *
 * @date {YYYY-MM-DD}
 * @updated {YYYY-MM-DD}
 * ========================================================================== */

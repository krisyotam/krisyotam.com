# API Directory Reorganization Plan

**Author:** Kris Yotam
**Date:** 2026-01-24
**Status:** Draft
**Goal:** 47 directories → 10 directories

---

## Executive Summary

Consolidate 47 API directories into 10 logical domains using query parameters instead of nested routes. This reduces boilerplate by 70% and creates a clean, predictable API structure.

---

## Target Structure (10 Directories)

```
/api
├── auth/           → OAuth flows (github, logout, me)
├── content/        → All written content (essays, fiction, notes, papers, poems, etc.)
├── media/          → All consumption data (reading, library, videos)
├── film/           → Film & TV (local DB + Trakt integration)
├── games/          → Gaming data
├── mal/            → MyAnimeList integration
├── interactions/   → User interactions (hearts, comments, reactions, views)
├── reference/      → Reference tools & data (dictionary, quotes, symbols, etc.)
├── data/           → Static site data (blogroll, sources, locations, etc.)
└── system/         → Utilities (404, changelog, tikz, github-file, etc.)
```

---

## Complete Consumer Mapping

### 1. AUTH → `/api/auth/` (Keep as-is)

| Current Route | Consumer | Method |
|---------------|----------|--------|
| `/api/auth/me` | `src/components/ui/comments.tsx` | GET |
| `/api/auth/logout` | `src/components/ui/comments.tsx` | POST |
| `/api/auth/github` | OAuth redirect | GET |
| `/api/auth/github/callback` | OAuth callback | GET |

**Action:** Keep structure - OAuth requires separate endpoints.

---

### 2. CONTENT → `/api/content/`

**New unified route:** `GET /api/content?type=<type>&slug=<slug>`

| Current Route | Consumer File | New Query |
|---------------|---------------|-----------|
| `/api/essays/essays` | (unused?) | `?type=essays` |
| `/api/fiction` | (unused?) | `?type=fiction` |
| `/api/notes` | (unused?) | `?type=notes` |
| `/api/papers` | `src/components/core/settings.tsx` | `?type=papers` |
| `/api/poems` | `src/components/home/HomeGridView.tsx` | `?type=poems` |
| `/api/progymnasmata` | `src/components/home/HomeGridView.tsx`, `src/app/(content)/progymnasmata/page.tsx` | `?type=progymnasmata` |
| `/api/sequences/[slug]` | `src/app/(sequences)/[category]/[slug]/page.tsx` | `?type=sequences&slug=x` |
| `/api/verse/content` | `src/app/(verse)/[type]/[slug]/page.tsx` | `?type=verse&slug=x` |
| `/api/posts/search` | (search functionality) | `?type=posts&search=x` |

**Files to update:**
```
src/components/home/HomeGridView.tsx
src/components/core/settings.tsx
src/app/(content)/progymnasmata/page.tsx
src/app/(sequences)/[category]/[slug]/page.tsx
src/app/(verse)/[type]/[slug]/page.tsx
```

**Directories eliminated:** 9 → 1

---

### 3. MEDIA → `/api/media/`

**New unified route:** `GET /api/media?source=<source>&type=<type>`

| Current Route | Consumer File | New Query |
|---------------|---------------|-----------|
| `/api/reading/audiobooks` | `src/app/(reading)/reading/page.tsx` | `?source=reading&type=audiobooks` |
| `/api/reading/blogs` | `src/app/(reading)/reading/page.tsx` | `?source=reading&type=blogs` |
| `/api/reading/books` | `src/app/(reading)/reading/page.tsx` | `?source=reading&type=books` |
| `/api/reading/essays` | `src/app/(reading)/reading/page.tsx` | `?source=reading&type=essays` |
| `/api/reading/lists` | `src/app/(reading)/reading/page.tsx` | `?source=reading&type=lists` |
| `/api/reading/papers` | `src/app/(reading)/reading/page.tsx` | `?source=reading&type=papers` |
| `/api/reading/reading-log` | `src/app/(reading)/reading/page.tsx` | `?source=reading&type=log` |
| `/api/reading/reading-now` | `src/app/(reading)/reading/page.tsx` | `?source=reading&type=now` |
| `/api/reading/short-stories` | `src/app/(reading)/reading/page.tsx` | `?source=reading&type=short-stories` |
| `/api/reading/verse` | `src/app/(reading)/reading/page.tsx` | `?source=reading&type=verse` |
| `/api/reading/want-to-read` | `src/app/(reading)/reading/page.tsx` | `?source=reading&type=want-to-read` |
| `/api/library-catalog` | `src/app/(library)/library/page.tsx` | `?source=library&type=catalog` |
| `/api/library-notes` | `src/app/(library)/library/page.tsx` | `?source=library&type=notes` |
| `/api/videos` | `src/app/(media)/videos/page.tsx` | `?source=videos` |

**Files to update:**
```
src/app/(reading)/reading/page.tsx
src/app/(library)/library/page.tsx
src/app/(media)/videos/page.tsx
```

**Directories eliminated:** 14 → 1

---

### 4. FILM → `/api/film/`

**New unified route:** `GET /api/film?resource=<resource>&type=<type>&source=<local|trakt>`

| Current Route | Consumer File | New Query |
|---------------|---------------|-----------|
| `/api/film/watched` | `src/app/(film)/film/page.tsx` | `?resource=watched` |
| `/api/film/watched-stats` | `src/app/(film)/film/page.tsx` | `?resource=stats` |
| `/api/film/favorite-movies` | `src/app/(film)/film/page.tsx` | `?resource=movies&favorites=true` |
| `/api/film/favorite-shows` | `src/app/(film)/film/page.tsx` | `?resource=shows&favorites=true` |
| `/api/film/fav-actors` | `src/app/(film)/film/page.tsx` | `?resource=favorites&type=actors` |
| `/api/film/fav-characters` | `src/app/(film)/film/page.tsx` | `?resource=favorites&type=characters` |
| `/api/film/fav-companies` | `src/app/(film)/film/page.tsx` | `?resource=favorites&type=companies` |
| `/api/film/fav-directors` | `src/app/(film)/film/page.tsx` | `?resource=favorites&type=directors` |
| `/api/film/fav-producers` | `src/app/(film)/film/page.tsx` | `?resource=favorites&type=producers` |
| `/api/films-catalog` | `src/app/(library)/library/page.tsx` | `?resource=catalog` |
| `/api/trakt/genres` | `src/app/(film)/film/page.tsx` | `?source=trakt&resource=genres` |
| `/api/trakt/lists` | `src/app/(film)/film/page.tsx` | `?source=trakt&resource=lists` |
| `/api/trakt/most-watched-shows` | `src/app/(film)/film/page.tsx` | `?source=trakt&resource=most-watched&type=shows` |
| `/api/trakt/recent-movies` | `src/app/(film)/film/page.tsx` | `?source=trakt&resource=recent&type=movies` |
| `/api/trakt/recent-shows` | `src/app/(film)/film/page.tsx` | `?source=trakt&resource=recent&type=shows` |

**Files to update:**
```
src/app/(film)/film/page.tsx
src/app/(library)/library/page.tsx
```

**Directories eliminated:** 15 → 1

---

### 5. GAMES → `/api/games/`

**New unified route:** `GET /api/games?resource=<resource>&favorites=<bool>`

| Current Route | Consumer File | New Query |
|---------------|---------------|-----------|
| `/api/games/games` | `src/app/(games)/games/page.tsx` | `?resource=games` |
| `/api/games/characters` | `src/app/(games)/games/page.tsx` | `?resource=characters` |
| `/api/games/consoles` | `src/app/(games)/games/page.tsx` | `?resource=consoles` |
| `/api/games/platforms` | `src/app/(games)/games/page.tsx` | `?resource=platforms` |

**Files to update:**
```
src/app/(games)/games/page.tsx
```

**Directories eliminated:** 4 → 1

---

### 6. MAL → `/api/mal/` (Keep as-is)

| Current Route | Consumer File | New Query |
|---------------|---------------|-----------|
| `/api/mal/user-data` | `src/app/(media)/mal/page.tsx` | Keep |
| `/api/mal/fav-people` | (unused?) | Keep |

**Action:** Keep structure - external API with specific auth handling.

---

### 7. INTERACTIONS → `/api/interactions/`

**New unified route:**
- `GET /api/interactions?type=<type>&slug=<slug>`
- `POST /api/interactions?type=<type>&action=<action>`

| Current Route | Consumer File | New Query |
|---------------|---------------|-----------|
| `/api/hearts/check` | `src/components/footer.tsx` | `GET ?type=hearts` |
| `/api/hearts/increment` | `src/components/footer.tsx` | `POST ?type=hearts&action=increment` |
| `/api/comments` | `src/components/ui/comments.tsx` | `?type=comments&slug=x` |
| `/api/comments/reactions` | `src/components/ui/comments.tsx` | `POST ?type=comments&action=react` |
| `/api/now/reactions` | `src/app/(updates)/now/page.tsx` | `?type=reactions&context=now&slug=x` |
| `/api/til/reactions` | `src/app/(updates)/til/page.tsx` | `?type=reactions&context=til&slug=x` |
| `/api/page-view` | Analytics component | `POST ?type=pageview` |
| `/api/surveys/submit` | `src/app/(surveys)/surveys/[slug]/page.tsx` | `POST ?type=survey` |

**Files to update:**
```
src/components/footer.tsx
src/components/ui/comments.tsx
src/app/(updates)/now/page.tsx
src/app/(updates)/til/page.tsx
src/app/(surveys)/surveys/[slug]/page.tsx
+ analytics component
```

**Directories eliminated:** 8 → 1

---

### 8. REFERENCE → `/api/reference/`

**New unified route:** `GET /api/reference?type=<type>&query=<query>`

| Current Route | Consumer File | New Query |
|---------------|---------------|-----------|
| `/api/reference/cpi` | `src/app/(reference)/reference/cpi/page.tsx` | `?type=cpi&format=map` |
| `/api/reference/dictionary` | `src/app/(reference)/reference/dictionary/page.tsx` | `?type=dictionary&word=x` |
| `/api/reference/mitzvot` | `src/app/(reference)/reference/mitzvot/page.tsx` | `?type=mitzvot` |
| `/api/reference/rules` | `src/app/(reference)/reference/rules/page.tsx` | `?type=rules` |
| `/api/quotes` | `src/components/home/HomeGridView.tsx` + others | `?type=quotes` |
| `/api/random-quote` | `src/components/home/quote-section.tsx` | `?type=quotes&random=true` |
| `/api/symbols` | `src/app/(reference)/symbols/page.tsx` | `?type=symbols` |
| `/api/word-of-the-day` | `src/components/home/HomeGridView.tsx` | `?type=wotd&random=true` |

**Files to update:**
```
src/app/(reference)/reference/cpi/page.tsx
src/app/(reference)/reference/dictionary/page.tsx
src/app/(reference)/reference/mitzvot/page.tsx
src/app/(reference)/reference/rules/page.tsx
src/app/(reference)/symbols/page.tsx
src/components/home/HomeGridView.tsx
src/components/home/quote-section.tsx
```

**Directories eliminated:** 8 → 1

---

### 9. DATA → `/api/data/`

**New unified route:** `GET /api/data?type=<type>&section=<section>`

| Current Route | Consumer File | New Query |
|---------------|---------------|-----------|
| `/api/blogroll` | `src/app/(about)/blogroll/page.tsx` | `?type=blogroll` |
| `/api/sources` | `src/app/(about)/sources/page.tsx` | `?type=sources` |
| `/api/locations` | `src/app/(tracking)/globe/page.tsx` | `?type=locations` |
| `/api/supporters` | `src/app/(about)/supporters/page.tsx` | `?type=supporters` |
| `/api/favorites` | `src/app/(about)/favorites/page.tsx` | `?type=favorites&section=x` |
| `/api/shop` | `src/app/(commerce)/shop/page.tsx` | `?type=shop` |
| `/api/predictions` | `src/app/(predictions)/predictions/page.tsx` | `?type=predictions` |

**Files to update:**
```
src/app/(about)/blogroll/page.tsx
src/app/(about)/sources/page.tsx
src/app/(tracking)/globe/page.tsx
src/app/(about)/supporters/page.tsx
src/app/(about)/favorites/page.tsx
src/app/(commerce)/shop/page.tsx
src/app/(predictions)/predictions/page.tsx
```

**Directories eliminated:** 7 → 1

---

### 10. SYSTEM → `/api/system/`

**New unified route:** `GET/POST /api/system?service=<service>`

| Current Route | Consumer File | New Query |
|---------------|---------------|-----------|
| `/api/404-suggester` | `src/app/not-found.tsx` | `?service=404-suggester` |
| `/api/changelog` | `src/app/(updates)/changelog/ui.tsx` | `?service=changelog` |
| `/api/content-stats` | `src/app/(about)/stats/page.tsx` | `?service=content-stats` |
| `/api/tikz` | `src/components/mdx/tikz.tsx` | `POST ?service=tikz` |
| `/api/github-file` | `src/components/mdx/github-embed.tsx` | `?service=github-file&path=x` |
| `/api/get-script` | `src/app/(scripts)/scripts/page.tsx` | `?service=get-script&name=x` |
| `/api/research/request-access` | `src/app/(research)/research/page.tsx` | `POST ?service=research&action=request` |
| `/api/research/verify-access` | `src/app/(research)/research/page.tsx` | `POST ?service=research&action=verify` |
| `/api/send-email` | `src/app/(contact)/contact/page.tsx` | `POST ?service=email` |
| `/api/raw/[contentType]/[category]/[slug]` | Various | `?service=raw&path=x/y/z` |

**Files to update:**
```
src/app/not-found.tsx
src/app/(updates)/changelog/ui.tsx
src/app/(about)/stats/page.tsx
src/components/mdx/tikz.tsx
src/components/mdx/github-embed.tsx
src/app/(scripts)/scripts/page.tsx
src/app/(research)/research/page.tsx
src/app/(contact)/contact/page.tsx
```

**Directories eliminated:** 10 → 1

---

## Dead API References (Broken Code)

These files reference API routes that **don't exist**:

| Consumer File | Dead Route | Action |
|---------------|------------|--------|
| `src/components/family-tree.tsx:451` | `/api/family-trees` | Delete or implement |
| `src/components/family-tree.tsx:470` | `/api/family-trees/${family}` | Delete or implement |
| `src/components/related-posts.tsx:37` | `/api/related-posts` | Delete or implement |
| `src/components/companies-grid.tsx:36` | `/api/companies` | Delete or implement |
| `src/lib/getVerseFromBible.ts:191` | `/api/bible` | Delete or implement |

---

## Orphaned Files to Delete

```
/api/research.ts              → Unused helper
/api/send-email.ts            → Unused helper (functionality moves to system/)
/api/essays/categories.ts     → Dead code
/api/essays/essays.ts         → Dead code
/api/research/request-access.ts → Not a route.ts
/api/research/verify-access.ts  → Not a route.ts
```

---

## Final Directory Comparison

| # | Before (47 dirs) | After (10 dirs) |
|---|------------------|-----------------|
| 1 | auth/ (4 routes) | auth/ (4 routes) |
| 2 | blogroll/ | content/ (unified) |
| 3 | changelog/ | media/ (unified) |
| 4 | comments/ (2 routes) | film/ (unified) |
| 5 | content-stats/ | games/ (unified) |
| 6 | essays/ (nested) | mal/ (2 routes) |
| 7 | favorites/ | interactions/ (unified) |
| 8 | fiction/ | reference/ (unified) |
| 9 | film/ (9 routes) | data/ (unified) |
| 10 | films-catalog/ | system/ (unified) |
| 11 | games/ (4 routes) | |
| 12 | get-script/ | |
| 13 | github-file/ | |
| 14 | hearts/ (2 routes) | |
| 15 | library-catalog/ | |
| 16 | library-notes/ | |
| 17 | locations/ | |
| 18 | mal/ (2 routes) | |
| 19 | notes/ | |
| 20 | now/ (reactions) | |
| 21 | page-view/ | |
| 22 | papers/ | |
| 23 | poems/ | |
| 24 | posts/ (search) | |
| 25 | predictions/ | |
| 26 | progymnasmata/ | |
| 27 | quotes/ | |
| 28 | random-quote/ | |
| 29 | raw/ (catch-all) | |
| 30 | reading/ (11 routes) | |
| 31 | reference/ (4 routes) | |
| 32 | research/ | |
| 33 | sequences/ (2 routes) | |
| 34 | shop/ | |
| 35 | sources/ | |
| 36 | supporters/ | |
| 37 | surveys/ | |
| 38 | symbols/ | |
| 39 | tikz/ | |
| 40 | til/ (reactions) | |
| 41 | trakt/ (5 routes) | |
| 42 | verse/ (content) | |
| 43 | videos/ | |
| 44 | word-of-the-day/ | |
| 45-47 | + orphan .ts files | |

---

## Implementation Checklist

### Phase 1: Create New Unified Routes

- [ ] Create `/api/content/route.ts` with type dispatcher
- [ ] Create `/api/media/route.ts` with source/type dispatcher
- [ ] Create `/api/film/route.ts` with resource/source dispatcher
- [ ] Create `/api/games/route.ts` with resource dispatcher
- [ ] Create `/api/interactions/route.ts` with type/action dispatcher
- [ ] Create `/api/reference/route.ts` with type dispatcher
- [ ] Create `/api/data/route.ts` with type dispatcher
- [ ] Create `/api/system/route.ts` with service dispatcher

### Phase 2: Update Consumers

**Content consumers:**
- [ ] `src/components/home/HomeGridView.tsx` (poems, progymnasmata)
- [ ] `src/components/core/settings.tsx` (papers)
- [ ] `src/app/(content)/progymnasmata/page.tsx`
- [ ] `src/app/(sequences)/[category]/[slug]/page.tsx`
- [ ] `src/app/(verse)/[type]/[slug]/page.tsx`

**Media consumers:**
- [ ] `src/app/(reading)/reading/page.tsx` (11 fetch calls)
- [ ] `src/app/(library)/library/page.tsx`
- [ ] `src/app/(media)/videos/page.tsx`

**Film consumers:**
- [ ] `src/app/(film)/film/page.tsx` (15 fetch calls)
- [ ] `src/app/(library)/library/page.tsx` (films-catalog)

**Games consumers:**
- [ ] `src/app/(games)/games/page.tsx` (4 fetch calls)

**Interactions consumers:**
- [ ] `src/components/footer.tsx` (hearts)
- [ ] `src/components/ui/comments.tsx` (comments, reactions)
- [ ] `src/app/(updates)/now/page.tsx` (reactions)
- [ ] `src/app/(updates)/til/page.tsx` (reactions)
- [ ] `src/app/(surveys)/surveys/[slug]/page.tsx`

**Reference consumers:**
- [ ] `src/app/(reference)/reference/cpi/page.tsx`
- [ ] `src/app/(reference)/reference/dictionary/page.tsx`
- [ ] `src/app/(reference)/reference/mitzvot/page.tsx`
- [ ] `src/app/(reference)/reference/rules/page.tsx`
- [ ] `src/app/(reference)/symbols/page.tsx`
- [ ] `src/components/home/HomeGridView.tsx` (quotes, wotd)
- [ ] `src/components/home/quote-section.tsx`

**Data consumers:**
- [ ] `src/app/(about)/blogroll/page.tsx`
- [ ] `src/app/(about)/sources/page.tsx`
- [ ] `src/app/(tracking)/globe/page.tsx`
- [ ] `src/app/(about)/supporters/page.tsx`
- [ ] `src/app/(about)/favorites/page.tsx`
- [ ] `src/app/(commerce)/shop/page.tsx`
- [ ] `src/app/(predictions)/predictions/page.tsx`

**System consumers:**
- [ ] `src/app/not-found.tsx`
- [ ] `src/app/(updates)/changelog/ui.tsx`
- [ ] `src/app/(about)/stats/page.tsx`
- [ ] `src/components/mdx/tikz.tsx`
- [ ] `src/components/mdx/github-embed.tsx`
- [ ] `src/app/(scripts)/scripts/page.tsx`
- [ ] `src/app/(research)/research/page.tsx`
- [ ] `src/app/(contact)/contact/page.tsx`

### Phase 3: Delete Old Routes

- [ ] Delete all old route directories after verification
- [ ] Delete orphaned helper files
- [ ] Fix or delete dead API references

### Phase 4: Testing

- [ ] Test each new unified endpoint
- [ ] Verify all pages still function
- [ ] Check for console errors
- [ ] Run build to catch type errors

---

## Summary

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Directories | 47 | 10 | **-79%** |
| Route files | 67 | 14 | **-79%** |
| Lines of code | ~2,500 | ~800 | **-68%** |
| Consumer updates | - | 35 files | - |

---

## API Reference (After)

```
GET  /api/auth/me
POST /api/auth/logout
GET  /api/auth/github
GET  /api/auth/github/callback

GET  /api/content?type=essays|fiction|notes|papers|poems|progymnasmata|sequences|verse|posts
                 &slug=<slug>
                 &search=<query>

GET  /api/media?source=reading|library|videos
               &type=audiobooks|blogs|books|essays|lists|papers|log|now|short-stories|verse|want-to-read|catalog|notes

GET  /api/film?resource=watched|stats|movies|shows|favorites|catalog
              &type=actors|characters|companies|directors|producers
              &source=local|trakt
              &favorites=true
              &limit=20

GET  /api/games?resource=games|characters|consoles|platforms
               &favorites=true

GET  /api/mal/user-data
GET  /api/mal/fav-people

GET  /api/interactions?type=hearts|comments|reactions|pageview
                      &context=now|til
                      &slug=<slug>
POST /api/interactions?type=hearts|comments|reactions|survey
                      &action=increment|react|submit

GET  /api/reference?type=cpi|dictionary|mitzvot|rules|quotes|symbols|wotd
                   &query=<search>
                   &random=true
                   &format=map

GET  /api/data?type=blogroll|sources|locations|supporters|favorites|shop|predictions
              &section=<section>

GET  /api/system?service=404-suggester|changelog|content-stats|github-file|get-script|raw
                &path=<path>
POST /api/system?service=tikz|research|email
                &action=request|verify
```

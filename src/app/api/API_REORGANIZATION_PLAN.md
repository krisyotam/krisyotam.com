# API Directory Reorganization Plan

**Author:** Kris Yotam
**Date:** 2026-01-24
**Status:** In Progress
**Goal:** 47 directories → ~12 directories

---

## Current Progress

### Unified Routes Created

| Route | Status | Consolidates |
|-------|--------|--------------|
| `/api/games/route.ts` | Done | games, characters, consoles, platforms |
| `/api/reference/route.ts` | Done | cpi, dictionary, mitzvot, rules, quotes, symbols, wotd |
| `/api/data/route.ts` | Done | blogroll, sources, locations, supporters, favorites, shop, predictions |
| `/api/media/route.ts` | Done | reading (11 types), library (2 types), videos |
| `/api/content/route.ts` | Done | essays, fiction, notes, papers, poems, progymnasmata, sequences, verse, blog |
| `/api/film/route.ts` | Done | film (watched, stats, favorites), trakt (genres, lists, recent, most-watched), films-catalog |
| `/api/interactions/route.ts` | Done | hearts, now/til reactions, page-view |

### Consumers Updated

| Consumer | Status |
|----------|--------|
| `games-client-page.tsx` | Done |
| Others | Pending |

---

## New API Reference

### Games
```
GET /api/games?resource=games
GET /api/games?resource=games&favorites=true
GET /api/games?resource=characters
GET /api/games?resource=consoles
GET /api/games?resource=consoles&manufacturer=Nintendo
GET /api/games?resource=platforms
```

### Reference
```
GET /api/reference?type=cpi
GET /api/reference?type=cpi&format=map
GET /api/reference?type=cpi&amount=100&from=1990&to=2025
GET /api/reference?type=dictionary&word=hello
GET /api/reference?type=dictionary&q=hel&source=oed
GET /api/reference?type=mitzvot
GET /api/reference?type=mitzvot&q=sabbath
GET /api/reference?type=rules
GET /api/reference?type=quotes
GET /api/reference?type=quotes&random=true
GET /api/reference?type=symbols
GET /api/reference?type=wotd
GET /api/reference?type=wotd&random=true
```

### Data
```
GET /api/data?type=blogroll
GET /api/data?type=sources
GET /api/data?type=locations
GET /api/data?type=supporters
GET /api/data?type=favorites&section=film
GET /api/data?type=shop
GET /api/data?type=predictions
```

### Media
```
GET /api/media?source=reading&type=audiobooks
GET /api/media?source=reading&type=blogs
GET /api/media?source=reading&type=books
GET /api/media?source=reading&type=essays
GET /api/media?source=reading&type=papers
GET /api/media?source=reading&type=lists
GET /api/media?source=reading&type=log
GET /api/media?source=reading&type=now
GET /api/media?source=reading&type=short-stories
GET /api/media?source=reading&type=verse
GET /api/media?source=reading&type=want-to-read
GET /api/media?source=library&type=catalog
GET /api/media?source=library&type=notes
GET /api/media?source=videos
```

### Content
```
GET /api/content?type=essays
GET /api/content?type=fiction
GET /api/content?type=notes
GET /api/content?type=papers
GET /api/content?type=poems
GET /api/content?type=progymnasmata
GET /api/content?type=blog
GET /api/content?type=sequences
GET /api/content?type=sequences&slug=my-sequence
GET /api/content?type=verse&category=poetry&slug=my-poem
```

### Film
```
GET /api/film?resource=watched
GET /api/film?resource=watched&limit=20
GET /api/film?resource=stats
GET /api/film?resource=catalog
GET /api/film?resource=favorites&type=actors
GET /api/film?resource=favorites&type=characters
GET /api/film?resource=favorites&type=companies
GET /api/film?resource=favorites&type=directors
GET /api/film?resource=favorites&type=producers
GET /api/film?resource=favorites&type=movies&limit=20
GET /api/film?resource=favorites&type=shows&limit=20
GET /api/film?source=trakt&resource=genres
GET /api/film?source=trakt&resource=lists
GET /api/film?source=trakt&resource=recent&type=movies&limit=20
GET /api/film?source=trakt&resource=recent&type=shows&limit=20
GET /api/film?source=trakt&resource=most-watched&type=shows&limit=20
```

### Interactions
```
GET  /api/interactions?type=hearts
POST /api/interactions?type=hearts
GET  /api/interactions?type=reactions&context=now&slug=my-slug
POST /api/interactions?type=reactions&context=now  (body: {slug, reactionType})
GET  /api/interactions?type=reactions&context=til&slug=my-slug
POST /api/interactions?type=reactions&context=til  (body: {slug, reactionType})
POST /api/interactions?type=pageview  (body: {path, referrer})
```

---

## Remaining Consumer Updates

Run these commands to find consumers that need updating:

```bash
# Games
grep -r "api/games/games\|api/games/characters\|api/games/consoles\|api/games/platforms" src --include="*.tsx" --include="*.ts"

# Reading
grep -r "api/reading/" src --include="*.tsx" --include="*.ts"

# Film
grep -r "api/film/\|api/trakt/\|api/films-catalog" src --include="*.tsx" --include="*.ts"

# Reference
grep -r "api/reference/\|api/quotes\|api/random-quote\|api/symbols\|api/word-of-the-day" src --include="*.tsx" --include="*.ts"

# Data
grep -r "api/blogroll\|api/sources\|api/locations\|api/supporters\|api/favorites\|api/shop\|api/predictions" src --include="*.tsx" --include="*.ts"

# Interactions
grep -r "api/hearts/\|api/now/reactions\|api/til/reactions\|api/page-view" src --include="*.tsx" --include="*.ts"

# Content
grep -r "api/essays/\|api/fiction\|api/notes\|api/papers\|api/poems\|api/progymnasmata\|api/sequences\|api/verse/content\|api/posts/search" src --include="*.tsx" --include="*.ts"

# Library
grep -r "api/library-catalog\|api/library-notes" src --include="*.tsx" --include="*.ts"
```

---

## Routes to Keep As-Is

| Route | Reason |
|-------|--------|
| `/api/auth/*` | OAuth flows require separate endpoints |
| `/api/comments/*` | Complex CRUD with 325 lines |
| `/api/mal/*` | External API integration |
| `/api/404-suggester` | Complex standalone (426 lines) |
| `/api/changelog` | Standalone utility |
| `/api/content-stats` | Standalone utility |
| `/api/tikz` | Complex LaTeX renderer (204 lines) |
| `/api/github-file` | External API integration |
| `/api/get-script` | Standalone utility |
| `/api/surveys/submit` | Standalone utility |
| `/api/raw/[...]` | Dynamic catch-all |

---

## Directories to Delete After Consumer Updates

```bash
# Games subdirectories
rm -rf src/app/api/games/characters
rm -rf src/app/api/games/consoles
rm -rf src/app/api/games/games
rm -rf src/app/api/games/platforms

# Reading subdirectories
rm -rf src/app/api/reading/audiobooks
rm -rf src/app/api/reading/blogs
rm -rf src/app/api/reading/books
rm -rf src/app/api/reading/essays
rm -rf src/app/api/reading/lists
rm -rf src/app/api/reading/papers
rm -rf src/app/api/reading/reading-log
rm -rf src/app/api/reading/reading-now
rm -rf src/app/api/reading/short-stories
rm -rf src/app/api/reading/verse
rm -rf src/app/api/reading/want-to-read

# Library
rm -rf src/app/api/library-catalog
rm -rf src/app/api/library-notes

# Film subdirectories
rm -rf src/app/api/film/fav-actors
rm -rf src/app/api/film/fav-characters
rm -rf src/app/api/film/fav-companies
rm -rf src/app/api/film/fav-directors
rm -rf src/app/api/film/fav-producers
rm -rf src/app/api/film/favorite-movies
rm -rf src/app/api/film/favorite-shows
rm -rf src/app/api/film/watched
rm -rf src/app/api/film/watched-stats
rm -rf src/app/api/films-catalog
rm -rf src/app/api/trakt

# Reference subdirectories
rm -rf src/app/api/reference/cpi
rm -rf src/app/api/reference/dictionary
rm -rf src/app/api/reference/mitzvot
rm -rf src/app/api/reference/rules
rm -rf src/app/api/quotes
rm -rf src/app/api/random-quote
rm -rf src/app/api/symbols
rm -rf src/app/api/word-of-the-day

# Data
rm -rf src/app/api/blogroll
rm -rf src/app/api/sources
rm -rf src/app/api/locations
rm -rf src/app/api/supporters
rm -rf src/app/api/favorites
rm -rf src/app/api/shop
rm -rf src/app/api/predictions

# Interactions
rm -rf src/app/api/hearts
rm -rf src/app/api/now
rm -rf src/app/api/til
rm -rf src/app/api/page-view

# Content
rm -rf src/app/api/essays
rm -rf src/app/api/fiction
rm -rf src/app/api/notes
rm -rf src/app/api/papers
rm -rf src/app/api/poems
rm -rf src/app/api/progymnasmata
rm -rf src/app/api/sequences
rm -rf src/app/api/verse
rm -rf src/app/api/posts
rm -rf src/app/api/videos

# Orphaned files
rm src/app/api/research.ts
rm src/app/api/send-email.ts
```

---

## Final Structure (Target)

```
/api
├── auth/            (4 routes - OAuth)
├── content/         (unified - all written content)
├── media/           (unified - reading, library, videos)
├── film/            (unified - film + trakt)
├── games/           (unified)
├── interactions/    (unified - hearts, reactions, pageview)
├── reference/       (unified - reference tools + quotes + symbols)
├── data/            (unified - static data)
├── mal/             (2 routes - external API)
├── comments/        (2 routes - complex CRUD)
├── 404-suggester/   (standalone)
├── changelog/       (standalone)
├── content-stats/   (standalone)
├── tikz/            (standalone)
├── github-file/     (standalone)
├── get-script/      (standalone)
├── surveys/         (standalone)
├── research/        (standalone)
├── raw/             (catch-all)
└── send-email.ts    (utility - consider moving)
```

**Result: 47 directories → ~19 directories (60% reduction)**

---

## Testing Checklist

After updating all consumers:

- [ ] Run `npm run build` to check for type errors
- [ ] Test games page
- [ ] Test reading page
- [ ] Test film page
- [ ] Test reference pages (CPI, dictionary, etc.)
- [ ] Test data pages (blogroll, sources, etc.)
- [ ] Test interactions (hearts, reactions)
- [ ] Test content pages

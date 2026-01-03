# Data Architecture Audit: JSON → Minimal Databases

## Current State: 200+ JSON Files

After analyzing every JSON file in `/data`, here's the reality:

```
Total JSON files: ~200+
Content types with posts/categories/tags pattern: 17+
Separate tag files: 15+
Separate category files: 20+
```

This is unsustainable for a prolific writer.

---

## Proposed Architecture: 2 Databases + Static JSON

### The Minimal Setup

```
data/
├── content.db          # All your written content
├── media.db            # Everything you consume/track
├── reference/          # Static reference data (stays JSON)
├── about/              # Profile config (stays JSON)
├── billboard/          # Already sharded by year (stays JSON)
└── family-trees/       # Graph data (stays JSON)
```

---

## Database 1: `content.db`

**Purpose:** Everything you write, all in one place.

### What goes in:

| Current Files | → Table |
|---------------|---------|
| blog/blog.json | posts (type='blog') |
| essays/essays.json | posts (type='essay') |
| notes/notes.json | posts (type='note') |
| papers/papers.json | posts (type='paper') |
| reviews/reviews.json | posts (type='review') |
| research/research.json | posts (type='research') |
| fiction/fiction.json | posts (type='fiction') |
| verse/verse.json | posts (type='verse') |
| news/news.json | posts (type='news') |
| progymnasmata/progymnasmata.json | posts (type='progymnasmata') |
| prompts/prompts.json | posts (type='prompt') |
| scripts/scripts.json | posts (type='script') |
| sequences/sequences.json | posts (type='sequence') |
| til/til.json | posts (type='til') |
| ocs/ocs.json | posts (type='oc') |
| lecture-notes/lecture-notes.json | posts (type='lecture') |
| music/music.json | posts (type='music') |
| flashcards/flashcards.json | posts (type='flashcard') |
| art/art.json | posts (type='art') |
| gallery/gallery.json | posts (type='gallery') |
| All */categories.json | categories |
| All */tags.json | tags |

### Schema:

```sql
-- Unified posts table
CREATE TABLE posts (
  id INTEGER PRIMARY KEY,
  type TEXT NOT NULL,           -- 'blog', 'essay', 'note', 'paper', etc.
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  preview TEXT,
  cover_image TEXT,
  category_slug TEXT,
  status TEXT,                  -- 'Finished', 'Notes', 'Draft'
  confidence TEXT,              -- 'certain', 'likely', 'possible'
  importance INTEGER,
  start_date TEXT,
  end_date TEXT,
  state TEXT DEFAULT 'active',
  -- Verse-specific (nullable for other types)
  verse_type TEXT,              -- 'haiku', 'sonnet', etc.
  collection TEXT
);

CREATE INDEX idx_posts_type ON posts(type);
CREATE INDEX idx_posts_type_category ON posts(type, category_slug);
CREATE INDEX idx_posts_date ON posts(start_date DESC);

-- Unified categories
CREATE TABLE categories (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  preview TEXT,
  content_type TEXT,            -- Which post types use this
  importance INTEGER
);

-- Unified tags
CREATE TABLE tags (
  id INTEGER PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

-- Many-to-many
CREATE TABLE post_tags (
  post_id INTEGER,
  tag_id INTEGER,
  PRIMARY KEY (post_id, tag_id)
);

-- Quotes (separate table, different structure)
CREATE TABLE quotes (
  id INTEGER PRIMARY KEY,
  text TEXT NOT NULL,
  author TEXT,
  source TEXT
);

-- Social posts archive
CREATE TABLE social_posts (
  id INTEGER PRIMARY KEY,
  platform TEXT,                -- 'twitter', 'reddit', 'mastodon', etc.
  title TEXT,
  content TEXT,
  date TEXT,
  url TEXT,
  author TEXT
);

-- Shop products
CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT,
  slug TEXT UNIQUE,
  category TEXT,
  price REAL,
  currency TEXT,
  payment_url TEXT,
  image TEXT,
  description TEXT,
  date TEXT,
  status TEXT,
  importance INTEGER,
  state TEXT
);

-- Wishlist (similar to products)
CREATE TABLE wishlist (
  id INTEGER PRIMARY KEY,
  name TEXT,
  image_url TEXT,
  link TEXT,
  category TEXT
);

CREATE TABLE wishlist_tags (
  wishlist_id INTEGER,
  tag TEXT,
  PRIMARY KEY (wishlist_id, tag)
);
```

### Consolidation:

**Before:** 17 post files + 20 category files + 15 tag files = 52 files
**After:** 1 database with 4 core tables

---

## Database 2: `media.db`

**Purpose:** Everything you consume, watch, read, play.

### What goes in:

| Current Files | → Table |
|---------------|---------|
| film/movies.json | media (type='movie') |
| film/shows.json | media (type='show') |
| film/watched.json | watch_log |
| film/watchlist.json | watchlist |
| databases/anime.json | media (type='anime') |
| databases/manga.json | media (type='manga') |
| databases/books.json | media (type='book') |
| databases/movies.json | media (type='movie') |
| databases/light-novels.json | media (type='light-novel') |
| games/games.json | media (type='game') |
| reading/books.json | reading_list |
| reading/audiobooks.json | reading_list |
| reading/reading-log.json | reading_log |
| reading/want-to-read.json | reading_list (status='want') |
| library/library.json | library |
| favorites/*.json | favorites |

### Schema:

```sql
-- All media items
CREATE TABLE media (
  id INTEGER PRIMARY KEY,
  type TEXT NOT NULL,           -- 'movie', 'show', 'anime', 'manga', 'game', 'book'
  title TEXT NOT NULL,
  year INTEGER,
  cover_url TEXT,
  director TEXT,                -- For films
  author TEXT,                  -- For books
  developer TEXT,               -- For games
  publisher TEXT,
  runtime INTEGER,              -- Minutes for film, NULL for others
  rating INTEGER,               -- Your rating 1-5
  favorite BOOLEAN DEFAULT 0,
  favorite_weight REAL,
  overview TEXT,
  times_consumed INTEGER DEFAULT 0,
  last_consumed_at TEXT,
  hours_played INTEGER,         -- For games
  -- Book-specific
  isbn TEXT,
  series TEXT,
  edition TEXT
);

CREATE INDEX idx_media_type ON media(type);
CREATE INDEX idx_media_favorite ON media(favorite);

CREATE TABLE media_genres (
  media_id INTEGER,
  genre TEXT,
  PRIMARY KEY (media_id, genre)
);

-- Reading tracking
CREATE TABLE reading_log (
  id INTEGER PRIMARY KEY,
  media_id INTEGER,             -- FK to media
  title TEXT,                   -- Denormalized for convenience
  author TEXT,
  start_date TEXT,
  end_date TEXT,
  status TEXT,                  -- 'reading', 'completed', 'abandoned'
  format TEXT                   -- 'physical', 'ebook', 'audiobook'
);

-- Library (physical books you own)
CREATE TABLE library (
  id INTEGER PRIMARY KEY,
  slug TEXT UNIQUE,
  title TEXT,
  author TEXT,
  series TEXT,
  edition TEXT,
  publisher TEXT,
  year_published TEXT,
  isbn TEXT,
  cover_url TEXT,
  classification TEXT,          -- LOC classification
  sub_classification TEXT
);

-- People you admire/track
CREATE TABLE people (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT,                    -- 'writer', 'artist', 'director', 'actor', etc.
  image TEXT,
  wikipedia_url TEXT
);

-- Favorites (unified)
CREATE TABLE favorites (
  id INTEGER PRIMARY KEY,
  category TEXT,                -- 'anime', 'film', 'book', 'art', 'music', etc.
  name TEXT,
  image TEXT,
  link TEXT,
  description TEXT,
  rank INTEGER
);
```

### Consolidation:

**Before:** ~25 media/consumption files
**After:** 1 database with 6 tables

---

## Keep as JSON (Static/Config Data)

These files should STAY as JSON because they're:
- Static reference data (won't grow)
- Config/profile data (rarely queried)
- Already well-organized

### Static Reference (Never Changes)
```
data/
├── mitzvah.json                    # 613 commandments (fixed)
├── 42-laws-of-maat.json            # 42 laws (fixed)
├── symbols.json                    # Greek letters, math symbols (fixed)
├── rules-of-the-internet.json      # Static
├── reference/
│   ├── merriam-webster.json
│   ├── oed.json
│   └── source-data/1611kjv.json    # Bible (static)
├── law/
│   └── united-states/constitution.json
```

### Profile/Config (Single Objects)
```
data/
├── about/
│   ├── about-me.json               # Single bio string
│   ├── about-profile.json          # Profile data
│   ├── core-values.json            # Small list
│   ├── personality-assessments.json
│   ├── uses.json                   # What you use
│   └── ... (all about/* files)
├── profile.json
├── contact.json
├── pgp.json
├── website-preview.json
├── banned-domains.json
```

### Already Sharded/Special Structure
```
data/
├── billboard/                      # Already sharded by year (66 files)
│   ├── 1959.json                   # Keep as-is, rarely query across years
│   ├── 1960.json
│   └── ...
├── family-trees/                   # Graph data, special structure
│   ├── index.json
│   ├── rothschild.json
│   └── ...
```

---

## Files That Could Go Either Way

These are judgment calls:

| File | Recommendation | Reason |
|------|----------------|--------|
| `quotes.json` | → content.db | Will grow as you collect more |
| `locations.json` | → media.db OR JSON | Depends on how much you travel |
| `blogroll/*.json` | → media.db (people table) | If you want to query by type |
| `playlists/*.json` | → media.db | If you want unified music tracking |
| `supporters.json` | JSON | Small, static list |
| `projects.json` | → content.db | If projects are like posts |
| `keynotes.json` | JSON | Small, static |
| `speeches.json` | JSON | Small, static |

---

## Summary: Before vs After

### Before
```
data/
├── 52+ content/category/tag files
├── 25+ media/consumption files
├── 20+ about/profile files
├── 66 billboard files
├── 14 family tree files
├── 30+ misc files
─────────────────────
≈ 200+ JSON files
```

### After
```
data/
├── content.db         # 1 file replaces 52+
├── media.db           # 1 file replaces 25+
├── about/             # Keep as JSON (config)
├── reference/         # Keep as JSON (static)
├── billboard/         # Keep as JSON (sharded)
├── family-trees/      # Keep as JSON (graph)
─────────────────────
2 databases + organized JSON
```

---

## Migration Priority

### Phase 1: content.db (Highest Impact)
This is where your growth is. Consolidate all written content first:
1. Create content.db with schema
2. Migrate blog.json, essays.json, notes.json, etc.
3. Unify all categories and tags
4. Update data access layer

### Phase 2: media.db (Medium Impact)
Once content is stable:
1. Create media.db
2. Migrate film, games, reading data
3. Consolidate favorites

### Phase 3: Cleanup
1. Archive old JSON files
2. Document what stays as JSON and why

---

## Queries That Become Trivial

```sql
-- All content I've written, any type, tagged "Philosophy"
SELECT p.* FROM posts p
JOIN post_tags pt ON p.id = pt.post_id
JOIN tags t ON pt.tag_id = t.id
WHERE t.name = 'Philosophy'
ORDER BY p.start_date DESC;

-- Content stats by type
SELECT type, COUNT(*) as count,
       AVG(importance) as avg_importance
FROM posts
GROUP BY type;

-- Everything I consumed in 2024
SELECT * FROM media
WHERE last_consumed_at LIKE '2024%'
ORDER BY last_consumed_at DESC;

-- My top-rated films
SELECT * FROM media
WHERE type = 'movie' AND rating = 5
ORDER BY favorite_weight DESC;

-- Cross-reference: posts about films I've watched
SELECT p.title as post_title, m.title as film_title
FROM posts p
JOIN media m ON p.title LIKE '%' || m.title || '%'
WHERE p.type = 'review' AND m.type = 'movie';
```

---

## Final Recommendation

**2 databases is optimal for your use case:**

1. **content.db** - Your intellectual output (will grow fast)
2. **media.db** - Your intellectual input (will grow steadily)

This separation makes sense because:
- Different access patterns (writing vs. consumption)
- Different growth rates
- Clear mental model
- Can backup/version independently

You could also do **1 database** (site.db) with all tables if you prefer maximum simplicity. The queries would be identical, just one file to manage.

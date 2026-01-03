# Data Architecture: Complete Specification

## Overview: 4 Databases

| Database | Tables | Purpose |
|----------|--------|---------|
| `content.db` | 4 | All written content + taxonomies |
| `media.db` | 5 | Media consumption + tracking |
| `archive.db` | 5 | Static reference data (rarely changes) |
| `hetzner.db` | 3 | Object storage file index |

---

# 1. content.db (4 tables)

## Tables

1. **posts** - All written content
2. **categories** - All categories
3. **tags** - All tags
4. **post_tags** - Junction table

## Files → posts table

All these files merge into ONE `posts` table with a `type` column:

```
data/blog/blog.json              → type = 'blog'
data/essays/essays.json          → type = 'essay'
data/notes/notes.json            → type = 'note'
data/papers/papers.json          → type = 'paper'
data/reviews/reviews.json        → type = 'review'
data/research/research.json      → type = 'research'
data/fiction/fiction.json        → type = 'fiction'
data/verse/verse.json            → type = 'verse'
data/news/news.json              → type = 'news'
data/progymnasmata/progymnasmata.json → type = 'progymnasmata'
data/prompts/prompts.json        → type = 'prompt'
data/scripts/scripts.json        → type = 'script'
data/sequences/sequences.json    → type = 'sequence'
data/til/til.json                → type = 'til'
data/ocs/ocs.json                → type = 'oc'
data/lecture-notes/lecture-notes.json → type = 'lecture'
data/music/music.json            → type = 'music'
data/flashcards/flashcards.json  → type = 'flashcard'
data/art/art.json                → type = 'art'
data/gallery/gallery.json        → type = 'gallery'
data/now/now.json                → type = 'now'
data/content/videos.json         → type = 'video'
data/surveys/surveys.json        → type = 'survey'
data/refer/refer.json            → type = 'referral'
data/shop/shop.json              → type = 'product'
data/portfolio/projects.json     → type = 'project'
```

**Total: 26 post files → 1 table**

## Files → categories table

All these files merge into ONE `categories` table:

```
data/blog/categories.json        → content_type = 'blog'
data/essays/categories.json      → content_type = 'essay'
data/notes/categories.json       → content_type = 'note'
data/papers/categories.json      → content_type = 'paper'
data/fiction/categories.json     → content_type = 'fiction'
data/verse/categories.json       → content_type = 'verse'
data/news/categories.json        → content_type = 'news'
data/progymnasmata/categories.json → content_type = 'progymnasmata'
data/prompts/categories.json     → content_type = 'prompt'
data/scripts/categories.json     → content_type = 'script'
data/sequences/categories.json   → content_type = 'sequence'
data/til/categories.json         → content_type = 'til'
data/ocs/categories.json         → content_type = 'oc'
data/lecture-notes/categories.json → content_type = 'lecture'
data/music/categories.json       → content_type = 'music'
data/flashcards/categories.json  → content_type = 'flashcard'
data/art/categories.json         → content_type = 'art'
data/gallery/categories.json     → content_type = 'gallery'
data/reviews/categories.json     → content_type = 'review'
data/research/categories.json    → content_type = 'research'
data/playlists/categories.json   → content_type = 'playlist'
data/shop/categories.json        → content_type = 'product'
data/portfolio/categories.json   → content_type = 'project'
data/refer/categories.json       → content_type = 'referral'
```

**Total: 24 category files → 1 table**

## Files → tags table

All these files merge into ONE `tags` table (deduplicated):

```
data/blog/tags.json
data/essays/tags.json
data/notes/tags.json
data/papers/tags.json
data/reviews/tags.json
data/research/tags.json
data/news/tags.json
data/progymnasmata/tags.json
data/sequences/tags.json
data/ocs/tags.json
data/music/tags.json
data/flashcards/tags.json
```

**Total: 12 tag files → 1 table**

## Schema

```sql
CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  preview TEXT,
  cover_image TEXT,
  category_slug TEXT,
  status TEXT,
  confidence TEXT,
  importance INTEGER DEFAULT 5,
  start_date TEXT,
  end_date TEXT,
  state TEXT DEFAULT 'active',
  -- Type-specific fields (nullable)
  verse_type TEXT,           -- For verse: 'haiku', 'sonnet', etc.
  collection TEXT,           -- For verse/fiction
  price REAL,                -- For products
  currency TEXT,             -- For products
  payment_url TEXT,          -- For products
  url TEXT,                  -- For referrals
  reward TEXT,               -- For referrals
  video_url TEXT,            -- For videos

  UNIQUE(slug)               -- GLOBAL UNIQUE SLUG
);

-- Indexes
CREATE INDEX idx_posts_type ON posts(type);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_category ON posts(category_slug);
CREATE INDEX idx_posts_date ON posts(start_date DESC);
CREATE INDEX idx_posts_type_category ON posts(type, category_slug);
CREATE INDEX idx_posts_state ON posts(state);

CREATE TABLE categories (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  preview TEXT,
  content_type TEXT,          -- Which post type uses this
  status TEXT,
  confidence TEXT,
  importance INTEGER DEFAULT 5,
  date TEXT
);

CREATE INDEX idx_categories_type ON categories(content_type);

CREATE TABLE tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE post_tags (
  post_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  PRIMARY KEY (post_id, tag_id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

CREATE INDEX idx_post_tags_tag ON post_tags(tag_id);
```

## Magic URL Support

The `UNIQUE(slug)` constraint ensures no duplicate slugs across ANY content type.

```
krisyotam.com/reply-to-mephisto
    ↓ lookup slug in posts table
    ↓ get type='blog', category_slug='thought-experiments'
    → redirect to krisyotam.com/blog/thought-experiments/reply-to-mephisto
```

**Conflict Resolution:** If migrating and slugs collide, append type prefix:
- `on-suicide` (note) → keep as-is (first wins)
- `on-suicide` (essay) → `essay-on-suicide`
Kris's Note: Instead of appending a type prefix, before migration you will simply create a list of all the duplicate slugs and I'll correct it so there are no duplicates 

---

# 2. media.db (5 tables)

## Tables

1. **media** - All consumable media (films, anime, games, books)
2. **reading_log** - Reading/watching activity tracking
3. **library** - Physical books owned
4. **people** - Writers, directors, artists you track
5. **favorites** - Unified favorites list

## Files → media table

```
data/film/movies.json            → type = 'movie'
data/film/shows.json             → type = 'show'
data/film/watchlist.json         → type = 'movie', status = 'watchlist'
data/databases/anime.json        → type = 'anime'
data/databases/manga.json        → type = 'manga'
data/databases/books.json        → type = 'book'
data/databases/movies.json       → type = 'movie' (merge with film/movies)
data/databases/light-novels.json → type = 'light-novel'
data/games/games.json            → type = 'game'
data/games/consoles.json         → type = 'console'
data/games/platforms.json        → type = 'platform'
data/anime-list.json             → type = 'anime'
data/manga-list.json             → type = 'manga'
data/manga.json                  → type = 'manga' (merge/dedupe)
data/playlists/playlists.json    → type = 'playlist'
data/playlists.json              → type = 'playlist' (merge)
```
Kris's Note: make sure before merging files that they are not actually for seperate uses in the site, find out where they are used. I will make the final decision in instances like this. 


**Total: 16 media files → 1 table**

## Files → reading_log table

```
data/reading/books.json          → format = 'book'
data/reading/audiobooks.json     → format = 'audiobook'
data/reading/blogs.json          → format = 'blog'
data/reading/essays.json         → format = 'essay'
data/reading/papers.json         → format = 'paper'
data/reading/short-stories.json  → format = 'short-story'
data/reading/verse.json          → format = 'verse'
data/reading/reading-lists.json  → (lists of books)
data/reading/reading-log.json    → (activity log)
data/reading/reading-now.json    → status = 'reading'
data/reading/want-to-read.json   → status = 'want-to-read'
data/film/watched.json           → (watch log, type = 'movie')
```

**Total: 12 reading files → 1 table**

## Files → library table

```
data/library/library.json        → Main library
data/library/library-notes.json  → Notes on books
data/library/authors.json        → (merge into people)
data/library/films.json          → (merge into media)
data/mybooks.json                → (merge with library)
data/books.json                  → (merge with library)
```

**Total: 6 library files → 1 table**

## Files → people table

```
data/people/writers.json         → type = 'writer'
data/people/artists.json         → type = 'artist'
data/people/designers.json       → type = 'designer'
data/people/journalists.json     → type = 'journalist'
data/people/mathematicians.json  → type = 'mathematician'
data/film/fav-actors.json        → type = 'actor'
data/film/fav-directors.json     → type = 'director'
data/film/fav-producers.json     → type = 'producer'
data/film/fav-film-characters.json → type = 'character'
data/film/fav-film-companies.json → type = 'company'
data/games/characters.json       → type = 'game-character'
data/library/authors.json        → type = 'author'
data/blogroll/blogroll.json      → type = 'blogger'
data/blogroll/researchers.json   → type = 'researcher'
data/fav_people.json             → (merge by type)
```
Kris's Note: I think this is actually a brilliant idea so that anything that uses people can query this db but blogroll is royalty it must stay a seperate 
table itself it's a core function that should not be mixed. 

**Total: 15 people files → 1 table**

## Files → favorites table

```
data/favorites/anime.json        → category = 'anime'
data/favorites/art.json          → category = 'art'
data/favorites/ballet.json       → category = 'ballet'
data/favorites/books.json        → category = 'book'
data/favorites/film.json         → category = 'film'
data/favorites/manga.json        → category = 'manga'
data/favorites/meals.json        → category = 'meal'
data/favorites/music.json        → category = 'music'
data/favorites/plays.json        → category = 'play'
data/favs.json                   → (merge by category)
data/fav_chars.json              → category = 'character'
data/fav_companies.json          → category = 'company'
data/animanga-lists.json         → (lists, different structure)
```
Kris's Note: the script that will handle updating this should have rules ie.e specifically for data/favs.json, data/favs.json, data/fav_companies.json, and 
data/animanga-lists.json don't fit here they will have to go somewhere else. the other favorites will have the rule 4 max per category since only one 
component uses them. if 4 are already detected in a type it will ask which to replace. or rather i can add more but only 4 can be active at a time. 

**Total: 13 favorites files → 1 table**

## Schema

```sql
CREATE TABLE media (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,           -- 'movie', 'show', 'anime', 'manga', 'game', 'book', 'playlist'
  title TEXT NOT NULL,
  slug TEXT,
  year INTEGER,
  cover_url TEXT,
  director TEXT,
  author TEXT,
  developer TEXT,
  publisher TEXT,
  runtime INTEGER,
  rating INTEGER,
  favorite BOOLEAN DEFAULT 0,
  favorite_weight REAL,
  overview TEXT,
  times_consumed INTEGER DEFAULT 0,
  last_consumed_at TEXT,
  hours_played INTEGER,
  isbn TEXT,
  series TEXT,
  edition TEXT,
  status TEXT                   -- 'watched', 'watching', 'watchlist', etc.
);

CREATE INDEX idx_media_type ON media(type);
CREATE INDEX idx_media_favorite ON media(favorite);
CREATE INDEX idx_media_rating ON media(rating);

CREATE TABLE media_genres (
  media_id INTEGER,
  genre TEXT,
  PRIMARY KEY (media_id, genre)
);

CREATE TABLE reading_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  author TEXT,
  format TEXT,                  -- 'book', 'audiobook', 'blog', 'essay', 'paper'
  start_date TEXT,
  end_date TEXT,
  status TEXT,                  -- 'reading', 'completed', 'abandoned', 'want-to-read'
  rating INTEGER,
  notes TEXT
);

CREATE INDEX idx_reading_status ON reading_log(status);

CREATE TABLE library (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE,
  title TEXT NOT NULL,
  author TEXT,
  series TEXT,
  edition TEXT,
  publisher TEXT,
  year_published TEXT,
  isbn TEXT,
  cover_url TEXT,
  classification TEXT,
  sub_classification TEXT
);

CREATE TABLE people (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT,                    -- 'writer', 'artist', 'director', 'actor', etc.
  image TEXT,
  url TEXT,
  description TEXT
);

CREATE INDEX idx_people_type ON people(type);

CREATE TABLE favorites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL,       -- 'anime', 'film', 'book', 'meal', etc.
  name TEXT NOT NULL,
  image TEXT,
  link TEXT,
  description TEXT,
  rank INTEGER
);

CREATE INDEX idx_favorites_category ON favorites(category);
```

---

# 3. archive.db (5 tables)

Static reference data that rarely/never changes.

## Tables

1. **commandments** - mitzvah.json (613 items)
2. **laws_of_maat** - 42-laws-of-maat.json (42 items)
3. **internet_rules** - rules-of-the-internet.json
4. **symbols** - symbols.json (math/Greek symbols)
5. **quotes** - quotes.json (will grow, but slowly)

## Files → tables

```
data/mitzvah.json                → commandments table
data/42-laws-of-maat.json        → laws_of_maat table
data/rules-of-the-internet.json  → internet_rules table
data/symbols.json                → symbols table
data/quotes.json                 → quotes table
```

**Total: 5 files → 5 tables**

## Schema

```sql
CREATE TABLE commandments (
  id INTEGER PRIMARY KEY,
  law TEXT NOT NULL,
  scripture TEXT
);

CREATE TABLE laws_of_maat (
  id INTEGER PRIMARY KEY,
  law TEXT NOT NULL,
  description TEXT
);

CREATE TABLE internet_rules (
  id INTEGER PRIMARY KEY,
  rule TEXT NOT NULL,
  description TEXT
);

CREATE TABLE symbols (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  symbol TEXT NOT NULL,
  category TEXT,
  description TEXT,
  unicode_value TEXT,
  html_entity TEXT,
  contexts TEXT,                -- JSON array as text
  common_uses TEXT,             -- JSON array as text
  related TEXT,                 -- JSON array as text
  examples TEXT                 -- JSON array as text
);

CREATE INDEX idx_symbols_category ON symbols(category);

CREATE TABLE quotes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT NOT NULL,
  author TEXT,
  source TEXT
);

CREATE INDEX idx_quotes_author ON quotes(author);
```

---

# 4. hetzner.db (3 tables)

Object storage file index for your Hetzner buckets.

## Tables

1. **doc** - doc bucket objects
2. **src** - src bucket objects    
3. **archive** - public-archive bucket objects

## Files → tables

```
data/doc/doc.json                → doc table
data/doc/src.json                → src table
data/doc/archive.json            → archive table
```

**Total: 3 files → 3 tables**

## Schema

```sql
CREATE TABLE doc (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE NOT NULL,     -- Full path: 'book/math/calculus-spivak.pdf'
  size INTEGER,
  last_modified TEXT,
  original_url TEXT,
  public_url TEXT
);

CREATE INDEX idx_doc_key ON doc(key);

CREATE TABLE src (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE NOT NULL,
  size INTEGER,
  last_modified TEXT,
  original_url TEXT,
  public_url TEXT
);

CREATE INDEX idx_src_key ON src(key);

CREATE TABLE archive (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE NOT NULL,
  size INTEGER,
  last_modified TEXT,
  original_url TEXT,
  public_url TEXT
);

CREATE INDEX idx_archive_key ON archive(key);
```

## Usage

```sql
-- Find all PDFs in doc bucket
SELECT * FROM doc WHERE key LIKE '%.pdf';

-- Find all files in a directory
SELECT * FROM doc WHERE key LIKE 'book/math/%';

-- Get total size of src bucket
SELECT SUM(size) as total_bytes FROM src;
```

---

# Files to Keep as JSON

These stay as JSON because they're config/profile data or special structures:

## Profile/Config (single objects, rarely queried)
```
data/about/about-me.json
data/about/about-predictions.json
data/about/about-profile.json
data/about/areas-of-interest.json
data/about/certifications.json
data/about/companies.json
data/about/core-skills.json
data/about/core-values.json
data/about/experience.json
data/about/iq-assessments.json
data/about/mission.json
data/about/my-methods.json
data/about/my-sites.json
data/about/other-sites.json
data/about/personality-assessments.json
data/about/personality-morals.json
data/about/personal-philosophy.json
data/about/recommended-blogs.json
data/about/site-info.json
data/about/testimonials.json
data/about/theme-song-caption.json
data/about/uses.json
data/about-sections.json
data/profile.json
data/contact.json
data/contact-form-info.json
data/pgp.json
data/website-preview.json
data/banned-domains.json
data/page-directory.json
```

## Special Structures (keep as-is)
```
data/billboard/*.json            # 66 files, already sharded by year
data/family-trees/*.json         # Graph data, tree structure
data/weeks/weeks.json            # Life calendar, nested structure
data/icons/icons.json            # Simple lookup table
data/reference/merriam-webster.json
data/reference/oed.json
data/reference/source-data/1611kjv.json
data/law/united-states/constitution.json
```
Kris's Note: billboard.*.json will go into a database, and one table that filter's by the year for better organization
Also now that I think about it instead of archive let's rename that database to reference it makes more sense. We will add to that database 
oed as a table that pulls oed.json, 1611kjv table 1611kjv.json, and merriam-webster.json becomes a merriam-webster table as well. the rest can stay in .json 
form

## Social Archives (could go to media.db later)
```
data/social/twitter.json
data/social/reddit.json
data/social/mastodon.json
data/social/lesswrong.json
data/social/instagram.json
```
The social page already needs a massive reform as I need to rebuild the social component from the ground up in the likeness of the comment compoonent. 
after that however i will be creating a social table in media.db


---

# Unused/Questionable Files

Review these - they appear empty, duplicate, or unclear:

| File | Status | Notes |
|------|--------|-------|
| `data/hashes.json` | EMPTY | Just whitespace |
| `data/donate.json` | EMPTY | 0 bytes |
| `data/questions.json` | EMPTY | 0 bytes |
| `data/blogs.json` | UNCLEAR | Duplicate of blog/blog.json? Only 5 items, no slugs |
| `data/others.json` | DUPLICATE? | Contains blogroll-like data, overlaps with blogroll/ |
| `data/now-posts.json` | DUPLICATE? | May overlap with now/now.json |
| `data/questions/questions.json` | CHECK | May overlap with questions.json |
| `data/research.json` | DUPLICATE? | May overlap with research/research.json |
| `data/projects.json` | DUPLICATE? | May overlap with portfolio/projects.json |
| `data/archive.json` | DIFFERENT | Archive page items, not object storage |
| `data/accreditations.json` | UNCLEAR | Where is this used? |
| `data/art-bio.json` | UNCLEAR | Single bio, maybe merge with about/ |
| `data/art-texts.json` | UNCLEAR | Check usage |
| `data/auction-goals.json` | UNCLEAR | Check usage |
| `data/cpi.json` | UNCLEAR | Consumer price index? Check usage |
| `data/cryptocurrencies.json` | UNCLEAR | Check usage |
| `data/indie-companies.json` | UNCLEAR | Check usage |
| `data/inspirations.json` | UNCLEAR | Merge with favorites? |
| `data/keynotes.json` | UNCLEAR | Check usage |
| `data/learning-content.json` | UNCLEAR | Check usage |
| `data/local-collections.json` | UNCLEAR | Check usage |
| `data/locations.json` | KEEP | Places visited, could go to media.db |
| `data/map/map.json` | CHECK | Overlaps with locations.json? |
| `data/mochi.json` | UNCLEAR | Flashcard app export? |
| `data/newsletters.json` | UNCLEAR | Check usage |
| `data/references.json` | UNCLEAR | Check usage |
| `data/related-posts.json` | UNCLEAR | Auto-generated? |
| `data/research-bounties.json` | UNCLEAR | Check usage |
| `data/research-interests.json` | UNCLEAR | Merge with about/? |
| `data/resources-archives.json` | UNCLEAR | Check usage |
| `data/sources.json` | UNCLEAR | Check usage |
| `data/speeches.json` | UNCLEAR | Check usage |
| `data/supporters.json` | UNCLEAR | Check usage |
| `data/support-them.json` | UNCLEAR | Check usage |
| `data/surveys/data/contact-form.json` | CHECK | Submissions data? |
| `data/theories.json` | UNCLEAR | Check usage |
| `data/updates.json` | UNCLEAR | Changelog? |
| `data/wiki-pages.json` | UNCLEAR | Check usage |
| `data/wikipedia.json` | UNCLEAR | Check usage |
| `data/wishlist.json` | KEEP | Goes to media.db or content.db |
| `data/words.json` | UNCLEAR | Vocabulary? |
| `data/worlds.json` | UNCLEAR | Worldbuilding? Goes to content.db? |
| `data/writing-content.json` | UNCLEAR | Check usage |
| `data/changelog/content.json` | KEEP | Site changelog |
| `data/changelog/infra.json` | KEEP | Infra changelog |

---

# Summary

## Final Count

| Database | Tables | Files Consolidated |
|----------|--------|-------------------|
| content.db | 4 | 62 files |
| media.db | 5 | 62 files |
| archive.db | 5 | 5 files |
| hetzner.db | 3 | 3 files |
| **Total** | **17** | **132 files** |

## Remaining as JSON

- ~30 profile/config files (about/, contact, etc.)
- ~66 billboard files (sharded by year)
- ~14 family tree files
- ~10 special structure files
- ~5 social archive files
- ~40 questionable files (review needed)

## Migration Order

1. **content.db** - Your writing, most important
2. **hetzner.db** - Simple, low risk, high utility
3. **archive.db** - Static data, easy win
4. **media.db** - Most complex, do last

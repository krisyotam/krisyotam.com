# Hardcover API Integration Plan for krisyotam.com

## 1. Architecture Overview

Dual-table pattern (active + archive) ensures resilience: active tables are populated from live Hardcover API calls, archive tables from periodic CSV/JSON exports as a cumulative backup. If the API fails at build/sync time, the site falls back to archive data seamlessly.

```
Hardcover GraphQL API (api.hardcover.app/v1/graphql)
        |
        v
scripts/hardcover-sync.ts (sync script)
        |
        v
public/data/media.db (active tables) <--- fallback ---> public/data/media.db (archive tables)
        |                                                         ^
        v                                                         |
src/lib/media-db.ts (query functions)                  CSV/JSON import script
        |
        v
src/app/api/media/route.ts (API route, source=hardcover)
        |
        v
ReadingDataProvider context --> reading page components
```

---

## 2. Environment Variables

Add to `.env.local`:

```bash
HARDCOVER_API_TOKEN=Bearer <token-from-hardcover.app/account/api>
HARDCOVER_USER_ID=<your-numeric-user-id>
HARDCOVER_USERNAME=<your-hardcover-username>
```

Token from https://hardcover.app/account/api. Get user ID via:

```graphql
query { me { id username } }
```

---

## 3. SQLite Schema Design

All tables in `public/data/media.db`.

### 3.1 Active Tables (API-populated)

#### `hc_user_books`

```sql
CREATE TABLE IF NOT EXISTS hc_user_books (
  id INTEGER PRIMARY KEY,
  book_id INTEGER NOT NULL,
  status_id INTEGER NOT NULL,                -- 1=want-to-read, 2=currently-reading, 3=read, 5=dnf
  rating REAL,
  review_raw TEXT,
  review_html TEXT,
  date_added TEXT,
  started_at TEXT,
  finished_at TEXT,
  reviewed_at TEXT,
  has_review INTEGER DEFAULT 0,
  book_title TEXT NOT NULL,
  book_subtitle TEXT,
  book_slug TEXT,
  book_pages INTEGER,
  book_release_year INTEGER,
  book_rating REAL,
  book_cached_image TEXT,
  book_cached_contributors TEXT,             -- JSON array
  book_cached_tags TEXT,                     -- JSON array
  edition_isbn_13 TEXT,
  edition_pages INTEGER,
  edition_format TEXT,
  edition_publisher TEXT,
  edition_language TEXT,
  synced_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_hc_user_books_status ON hc_user_books(status_id);
CREATE INDEX IF NOT EXISTS idx_hc_user_books_book_id ON hc_user_books(book_id);
```

#### `hc_user_book_reads`

```sql
CREATE TABLE IF NOT EXISTS hc_user_book_reads (
  id INTEGER PRIMARY KEY,
  user_book_id INTEGER NOT NULL,
  book_id INTEGER NOT NULL,
  started_at TEXT,
  finished_at TEXT,
  progress REAL,
  progress_pages INTEGER,
  progress_seconds INTEGER,
  edition_id INTEGER,
  book_title TEXT,
  book_cached_image TEXT,
  synced_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_book_id) REFERENCES hc_user_books(id)
);

CREATE INDEX IF NOT EXISTS idx_hc_reads_user_book ON hc_user_book_reads(user_book_id);
CREATE INDEX IF NOT EXISTS idx_hc_reads_started ON hc_user_book_reads(started_at);
```

#### `hc_reading_journals`

```sql
CREATE TABLE IF NOT EXISTS hc_reading_journals (
  id INTEGER PRIMARY KEY,
  user_book_read_id INTEGER,
  user_book_id INTEGER,
  book_id INTEGER,
  event_type TEXT,
  entry TEXT,
  action_at TEXT,
  progress REAL,
  progress_pages INTEGER,
  metadata TEXT,                              -- JSON
  book_title TEXT,
  book_cached_image TEXT,
  synced_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_hc_journals_action ON hc_reading_journals(action_at);
CREATE INDEX IF NOT EXISTS idx_hc_journals_event ON hc_reading_journals(event_type);
CREATE INDEX IF NOT EXISTS idx_hc_journals_book ON hc_reading_journals(book_id);
```

#### `hc_goals`

```sql
CREATE TABLE IF NOT EXISTS hc_goals (
  id INTEGER PRIMARY KEY,
  goal_type TEXT,
  target INTEGER,
  progress INTEGER,
  year INTEGER,
  start_date TEXT,
  end_date TEXT,
  completed INTEGER DEFAULT 0,
  synced_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

#### `hc_currently_reading`

```sql
CREATE TABLE IF NOT EXISTS hc_currently_reading (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_book_id INTEGER NOT NULL,
  book_id INTEGER NOT NULL,
  book_title TEXT NOT NULL,
  book_subtitle TEXT,
  book_slug TEXT,
  book_cached_image TEXT,
  book_cached_contributors TEXT,
  book_pages INTEGER,
  started_at TEXT,
  progress REAL DEFAULT 0,
  progress_pages INTEGER DEFAULT 0,
  edition_format TEXT,
  synced_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

#### `hc_stats_cache`

```sql
CREATE TABLE IF NOT EXISTS hc_stats_cache (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  stat_key TEXT NOT NULL UNIQUE,
  stat_value TEXT NOT NULL,                  -- JSON
  computed_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

### 3.2 Archive Tables (CSV/JSON import)

Mirror structure of active tables with `_archive` suffix:

```sql
CREATE TABLE IF NOT EXISTS hc_user_books_archive ( /* same cols as hc_user_books, imported_at instead of synced_at */ );
CREATE TABLE IF NOT EXISTS hc_reading_journals_archive ( /* same cols as hc_reading_journals */ );
CREATE TABLE IF NOT EXISTS hc_user_book_reads_archive ( /* same cols as hc_user_book_reads */ );
```

---

## 4. Hardcover API Client Library

### File: `src/lib/hardcover-api.ts`

Raw `fetch()` with `JSON.stringify({ query, variables })`. No Apollo. Rate limiting: batch queries, respect 60 req/min.

Key queries:

```graphql
# User books by status
query GetUserBooks($userId: Int!, $statusId: Int!, $limit: Int!, $offset: Int!) {
  user_books(
    where: { user_id: { _eq: $userId }, status_id: { _eq: $statusId } }
    limit: $limit offset: $offset order_by: { date_added: desc }
  ) {
    id book_id status_id rating review_raw review_html
    date_added started_at finished_at reviewed_at has_review
    book {
      id title subtitle slug pages release_year rating
      cached_image cached_contributors cached_tags
      contributions { author { name } }
      default_edition { isbn_13 pages edition_format publisher { name } language { language } }
    }
  }
}

# User book reads (progress)
query GetUserBookReads($userId: Int!, $limit: Int!, $offset: Int!) {
  user_book_reads(
    where: { user_book: { user_id: { _eq: $userId } } }
    limit: $limit offset: $offset order_by: { started_at: desc_nulls_last }
  ) {
    id user_book_id started_at finished_at progress progress_pages progress_seconds edition_id
    user_book { book_id book { title cached_image } }
  }
}

# Reading journals
query GetReadingJournals($userId: Int!, $limit: Int!, $offset: Int!) {
  reading_journals(
    where: { user_book_read: { user_book: { user_id: { _eq: $userId } } } }
    limit: $limit offset: $offset order_by: { action_at: desc }
  ) {
    id user_book_read_id event_type entry action_at progress progress_pages metadata
    user_book_read { user_book_id user_book { book_id book { title cached_image } } }
  }
}

# Goals
query GetGoals($userId: Int!) {
  goals(where: { user_id: { _eq: $userId } }) {
    id goal_type target progress year start_date end_date completed
  }
}
```

---

## 5. Sync Script

### File: `scripts/hardcover-sync.ts`

```bash
npx tsx scripts/hardcover-sync.ts              # Full sync
npx tsx scripts/hardcover-sync.ts --active     # Active tables only
npx tsx scripts/hardcover-sync.ts --archive    # CSV/JSON import only
npx tsx scripts/hardcover-sync.ts --stats      # Recompute stats only
```

Process:
1. Open media.db read-write
2. Create tables if needed
3. Fetch all user_books (paginated, 100/page), user_book_reads, reading_journals, goals
4. Transaction: delete active rows → insert fresh → rebuild hc_currently_reading → recompute hc_stats_cache
5. Commit + log summary

Stats to compute:
- `books_read_total`, `books_read_YYYY`
- `pages_read_total`, `pages_read_YYYY_MM`
- `avg_rating`, `rating_distribution` (JSON)
- `genre_breakdown` (JSON from cached_tags)
- `reading_pace_pages_day`
- `goals_YYYY` (JSON)
- `currently_reading_count`, `want_to_read_count`

### Archive Import: `scripts/hardcover-archive-import.ts`

```bash
npx tsx scripts/hardcover-archive-import.ts --file ~/Downloads/hardcover-export.csv
```

---

## 6. Database Access Layer

### File: `src/lib/media-db.ts` (additions)

```typescript
// Fallback helper: try active, fall back to archive
function queryWithFallback<T>(activeQuery: string, archiveQuery: string, params?: any[]): T[]

// Query functions:
export function getHcCurrentlyReading(): HcCurrentlyReading[]
export function getHcReadBooks(): HcUserBook[]
export function getHcWantToRead(): HcUserBook[]
export function getHcReadingJournals(limit?: number, offset?: number): HcReadingJournal[]
export function getHcGoals(year?: number): HcGoal[]
export function getHcStat(key: string): any
export function getHcAllStats(): Record<string, any>
export function getHcUserBookReads(bookId?: number): HcUserBookRead[]
```

---

## 7. API Route Updates

### File: `src/app/api/media/route.ts`

Add `hardcover` source case:

```
/api/media?source=hardcover&type=currently-reading
/api/media?source=hardcover&type=read
/api/media?source=hardcover&type=want-to-read
/api/media?source=hardcover&type=journals&limit=50&offset=0
/api/media?source=hardcover&type=stats
/api/media?source=hardcover&type=goals&year=2026
/api/media?source=hardcover&type=reads&bookId=123
```

---

## 8. Reading Data Context Update

### File: `src/app/(reading)/reading-data-context.tsx`

Add to ReadingData interface:

```typescript
hcCurrentlyReading: HcCurrentlyReadingItem[]
hcReadBooks: HcReadBookItem[]
hcWantToRead: HcWantToReadItem[]
hcJournals: HcJournalItem[]
hcStats: Record<string, any>
hcGoals: HcGoalItem[]
```

Fetch in parallel with existing calls in `loadAllData()`.

---

## 9. Component Updates

### Currently Reading (`/reading`)
- Replace hardcoded `CURRENT_BOOK` with `hcCurrentlyReading` data
- Add progress bars (percentage, page count)
- Show started_at date, cover from `book_cached_image`

### Reading Log (`/reading-log`)
- Display `hc_reading_journals` as cards (already designed with NormalJournalCard + RichJournalCard)
- Replace faux data with live journal data
- Filter by event type, search by title/author/text

### Reading Stats (`/reading-stats`)
- Compute from `hcStats` cache + raw `hcReadBooks`
- Overview cards: books/year, pages/month, pace, avg rating
- Charts: books per year, pages per month, genre breakdown, rating distribution
- Goals progress from `hcGoals`

### Want to Read (`/want-to-read`)
- Use `hcWantToRead` with Hardcover covers

### Read (`/read` Books tab)
- Show completed books from `hcReadBooks` with ratings, finish dates, review previews

---

## 10. Image Domain Config

### File: `next.config.mjs`

```javascript
{ protocol: 'https', hostname: '*.hardcover.app', pathname: '/**' },
{ protocol: 'https', hostname: 'hardcover.app', pathname: '/**' },
{ protocol: 'https', hostname: '*.amazonaws.com', pathname: '/**' },
{ protocol: 'https', hostname: '*.cloudfront.net', pathname: '/**' },
```

---

## 11. Migration Strategy

Existing tables (`reading_books`, `reading_log`, etc.) are NOT deleted. They handle non-book content (blogs, essays, verse, papers, short stories) that Hardcover doesn't track.

- Hardcover (`hc_*`): books, audiobooks, currently reading, want to read, journals, goals
- Existing tables: blog posts, short stories, verse, essays, papers, reading lists
- `/reading-log` merges `hc_reading_journals` with `reading_log`

---

## 12. Implementation Sequence

### Phase 1: Foundation
1. Add env vars
2. Run schema DDL against media.db
3. Create `src/lib/hardcover-api.ts`
4. Create `scripts/hardcover-sync.ts`
5. Run first sync, verify with sqlite3

### Phase 2: Data Access
6. Add interfaces + query functions to `src/lib/media-db.ts`
7. Add `hardcover` source to API route
8. Test: `curl localhost:3000/api/media?source=hardcover&type=currently-reading`

### Phase 3: Components
9. Update `reading-data-context.tsx`
10. Update Currently Reading with progress bars
11. Wire Reading Log cards to live journal data
12. Revamp Reading Stats with computed charts
13. Update `next.config.mjs` image domains

### Phase 4: Archive + Polish
14. Create `scripts/hardcover-archive-import.ts`
15. Add fallback logic to query functions
16. Test fallback by emptying active tables
17. Add npm scripts to package.json

### Phase 5: Deploy
18. Commit and push
19. Add env vars to Dokploy/Docker
20. Set up cron: `0 */6 * * * cd /path && npx tsx scripts/hardcover-sync.ts`

---

## 13. npm Scripts

```json
{
  "hardcover:sync": "tsx scripts/hardcover-sync.ts",
  "hardcover:sync:archive": "tsx scripts/hardcover-sync.ts --archive",
  "hardcover:import": "tsx scripts/hardcover-archive-import.ts"
}
```

---

## 14. Rate Limit Strategy

- 60 req/min, 30s query timeout
- Typical sync: ~13 requests total (well within limit)
- 1-second delay between requests as safety
- Zero API calls at runtime — all data served from SQLite

---

## 15. Token Management

- Tokens expire annually, no programmatic refresh
- On 401: log clear error, fall back to archive tables
- Set calendar reminder for annual renewal at https://hardcover.app/account/api

---

## 16. Critical Files

| File | Purpose |
|------|---------|
| `src/lib/media-db.ts` | Add all Hardcover query functions |
| `src/app/api/media/route.ts` | Add `hardcover` source case |
| `src/components/media/reading/reading.tsx` | Update all reading page components |
| `src/app/(reading)/reading-data-context.tsx` | Extend context with Hardcover data |
| `src/lib/hardcover-api.ts` | NEW: GraphQL client library |
| `scripts/hardcover-sync.ts` | NEW: Sync script |
| `scripts/hardcover-archive-import.ts` | NEW: CSV archive importer |

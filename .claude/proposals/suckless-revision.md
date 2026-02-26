# Suckless Revision: Remaining Work

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

### Verification
- `npm run build` should succeed
- All pages render correctly
- Only 3 databases remain in `public/data/`

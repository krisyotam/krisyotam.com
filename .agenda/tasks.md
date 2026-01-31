# Component Extraction Tasks

Post-cleanup tasks for extracting inline designs into reusable components.

---

## 1. UnifiedStatsBar Component

**Priority:** High
**Location to create:** `src/components/ui/unified-stats-bar.tsx`

**Description:**
A compact, single-row stats display bar with an industrial/aerospace aesthetic. Currently implemented inline in multiple tracking pages.

**Current inline implementations:**
- `src/app/(tracking)/film/film-client-page.tsx` (lines ~129-163)
- `src/components/anime/stats-section.tsx`
- `src/components/posts/gaming/GameStats.tsx`

**Design specifications:**
- Container: `border border-border bg-muted/30 dark:bg-[hsl(var(--popover))]`
- Inner wrapper: `flex flex-wrap items-center justify-between px-4 py-3 gap-x-6 gap-y-2`
- Stat items: Large number (`text-xl font-semibold`) + muted label (`text-muted-foreground`)
- Vertical dividers between stats: `w-px h-4 bg-border`
- Responsive: Stats hide progressively on smaller screens (`hidden sm:flex`, `hidden md:flex`, etc.)

**Proposed interface:**
```tsx
interface StatItem {
  value: string | number
  label: string
  hideBelow?: 'sm' | 'md' | 'lg' | 'xl'  // responsive breakpoint to hide
}

interface UnifiedStatsBarProps {
  stats: StatItem[]
  rightContent?: React.ReactNode  // optional content on right (e.g., top genres)
}
```

---

## 2. SectionHeader Component

**Priority:** High
**Location:** `src/components/core/section-header.tsx` (already exists, but should be documented)

**Description:**
Industrial/aerospace aesthetic section header with accent bar, uppercase title, horizontal divider line, and optional count.

**Current implementation:**
`src/components/core/section-header.tsx`

**Design specifications:**
- Container: `flex items-center gap-3 mb-4`
- Accent bar: `w-1 h-5 bg-foreground/80` (vertical indicator line)
- Title: `text-sm font-medium uppercase tracking-wide text-foreground`
- Divider line: `flex-1 h-px bg-border`
- Count: `text-xs font-mono text-muted-foreground tabular-nums`

**Visual representation:**
```
│ SECTION TITLE ─────────────────────── 42
```

**Current interface:**
```tsx
interface SectionHeaderProps {
  title: string
  count?: number
}
```

**Notes:**
- Already a component, but ensure it's properly exported from components index
- Consider adding optional icon slot before title
- Consider adding optional subtitle or description

---

## Usage Locations

Pages using both components:
- `/film` - Film tracking overview
- `/film/watched` - Watched films grid
- `/anime` - Anime tracking
- `/manga` - Manga tracking
- `/games` - Games tracking

---

## Completion Checklist

- [ ] Extract UnifiedStatsBar from inline implementations
- [ ] Update film-client-page.tsx to use UnifiedStatsBar
- [ ] Update stats-section.tsx (anime/manga) to use UnifiedStatsBar
- [ ] Update GameStats.tsx to use UnifiedStatsBar
- [ ] Ensure SectionHeader is exported from components/index.ts
- [ ] Add Storybook stories for both components (if applicable)
- [ ] Update any CSS files that have redundant styles

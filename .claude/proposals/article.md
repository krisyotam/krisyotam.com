# Proposal: Newspaper-Style Article Component

**Author:** Claude
**Date:** 2026-01-22
**Status:** Draft
**Route:** `/news`

---

## Overview

Create a newspaper-style article rendering system that allows content to be written in MDX/Markdown while being displayed with a traditional newspaper aesthetic (mastheads, multi-column layouts, bylines, sidebars, quote boxes, etc.).

---

## Goals

1. **Markdown-first authoring** - Writers create content in familiar markdown syntax
2. **Newspaper aesthetic** - Rendered output looks like a traditional broadsheet newspaper
3. **Single component architecture** - One `NewspaperArticle.tsx` component handles all rendering
4. **Flexible layouts** - Support weekly reviews, single articles, breaking news formats
5. **Responsive design** - Graceful degradation on mobile (single column)

---

## Proposed Directory Structure

```
src/
├── components/
│   └── newspaper/
│       ├── index.ts                 # Barrel exports
│       ├── NewspaperLayout.tsx      # Main wrapper component
│       ├── Masthead.tsx             # Header with title, tagline, date
│       ├── Headline.tsx             # Main article headlines
│       ├── Article.tsx              # Individual article blocks
│       ├── Sidebar.tsx              # Sidebar highlights/summaries
│       ├── Section.tsx              # Section headers with columns
│       ├── Quote.tsx                # Pull quotes with attribution
│       ├── PhotoPlaceholder.tsx     # Image containers
│       └── newspaper.css            # All newspaper styles
│
├── app/(content)/news/
│   ├── content/
│   │   └── weekly/                  # Weekly newspaper editions
│   │       └── 2025-05-10.mdx       # Example edition
│   └── [slug]/
│       └── page.tsx                 # Dynamic route for editions
```

---

## MDX Component API

### NewspaperLayout

The root wrapper that provides the newspaper container and CSS variables.

```tsx
interface NewspaperLayoutProps {
  masthead: string;           // e.g., "THE WEEKLY CHRONICLE"
  tagline?: string;           // e.g., "Your Personal Week in Review"
  date: string;               // e.g., "Week of May 3-10, 2025"
  volume?: number;
  issue?: number;
  children: React.ReactNode;
}
```

### Headline

For main article headlines with byline support.

```tsx
interface HeadlineProps {
  level?: 1 | 2 | 3;          // Maps to headline size
  author?: string;
  date?: string;
  children: React.ReactNode;  // Markdown content
}
```

### Sidebar

For highlights, summaries, or quick facts.

```tsx
interface SidebarProps {
  title: string;
  children: React.ReactNode;  // List items or short content
}
```

### Section

For thematic sections with optional multi-column layout.

```tsx
interface SectionProps {
  title: string;
  columns?: 1 | 2 | 3;        // Grid columns
  children: React.ReactNode;
}
```

### Quote

For pull quotes with attribution.

```tsx
interface QuoteProps {
  author?: string;
  children: React.ReactNode;  // Quote text
}
```

---

## Example MDX Content

```mdx
---
title: "Weekly Chronicle - May 10, 2025"
type: newspaper
date: 2025-05-10
volume: 1
issue: 1
---

import {
  NewspaperLayout,
  Headline,
  Sidebar,
  Section,
  Quote,
  Article
} from '@/components/newspaper'

<NewspaperLayout
  masthead="THE WEEKLY CHRONICLE"
  tagline="Your Personal Week in Review"
  date="Week of May 3-10, 2025"
  volume={1}
  issue={1}
>

<div className="main-content">
  <div className="main-articles">
    <Headline author="Kris Yotam" date="Monday, May 5, 2025">
      ## Major Milestone Achieved at Work

      In what could be described as a pivotal moment in our professional
      journey, this week marked the successful completion of the quarterly
      project that has consumed much of our resources over the past three
      months.

      ![Project milestone](/images/milestone.jpg)

      This achievement represents not just a professional victory, but a
      testament to the dedication and late nights invested in ensuring
      quality deliverables.
    </Headline>

    <Article subheading author="Kris Yotam" date="Saturday, May 9, 2025">
      ## Weekend Adventures Rejuvenate Spirits

      Weekend activities proved to be the perfect antidote to a busy week,
      with outdoor adventures taking center stage.
    </Article>
  </div>

  <Sidebar title="This Week's Highlights">
    - **Accomplishment:** Successfully completed Q2 project ahead of schedule
    - **Social:** Reconnected with college friend over coffee
    - **Health:** Maintained 5-day workout streak
    - **Learning:** Finished online course on data visualization
    - **Personal:** Started reading "The Midnight Library"
  </Sidebar>
</div>

<Section title="Home & Family" columns={3}>
  <Article>
    ### Kitchen Renovation Update

    The kitchen renovation project entered its third week with significant
    progress on cabinet installation.
  </Article>

  <Article>
    ### Family Game Night Revival

    Wednesday evening's board game session brought laughter and friendly
    competition back to our living room.
  </Article>

  <Article>
    ### Garden Update

    Spring planting continues with the addition of heirloom tomatoes and herbs.
  </Article>
</Section>

<Section title="Health & Wellness">
  <Headline level={3} author="Kris Yotam" date="Thursday, May 7, 2025">
    ### New Fitness Routine Yields Results

    The recently adopted morning workout routine continues to show promising
    results. This week marked the fifth consecutive day of 6 AM gym sessions.
  </Headline>

  <Quote author="Morning Workout Revelation">
    The hardest part is always getting started, but once you're in the gym,
    everything flows naturally.
  </Quote>

  Nutrition tracking has also become more consistent, with meal prep Sundays
  proving instrumental in maintaining healthy eating habits.
</Section>

</NewspaperLayout>
```

---

## CSS Architecture

### Design Tokens

```css
:root {
  /* Typography */
  --newspaper-font-serif: 'Merriweather', Georgia, serif;
  --newspaper-font-sans: 'Open Sans', system-ui, sans-serif;

  /* Spacing */
  --newspaper-gutter: 30px;
  --newspaper-section-gap: 40px;

  /* Colors */
  --newspaper-bg: #ffffff;
  --newspaper-text: #333333;
  --newspaper-border: #333333;
  --newspaper-muted: #666666;

  /* Borders */
  --newspaper-border-thick: 3px double var(--newspaper-border);
  --newspaper-border-thin: 1px solid #ddd;
}
```

### Key Classes

```css
.newspaper {
  max-width: 1200px;
  margin: 0 auto;
  background: var(--newspaper-bg);
  padding: 40px;
  box-shadow: 0 0 20px rgba(0,0,0,0.1);
}

.masthead {
  font-family: var(--newspaper-font-serif);
  font-size: 3em;
  font-weight: 700;
  text-align: center;
  letter-spacing: 2px;
}

.main-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--newspaper-gutter);
}

.three-column {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--newspaper-gutter);
}

.headline {
  font-family: var(--newspaper-font-serif);
  font-size: 1.8em;
  font-weight: 700;
  line-height: 1.2;
}

.byline {
  font-style: italic;
  color: var(--newspaper-muted);
  font-size: 0.9em;
}

.article-text {
  text-align: justify;
  line-height: 1.6;
}

.sidebar {
  background: #f9f9f9;
  padding: 20px;
  border: var(--newspaper-border-thin);
}

.quote-box {
  background: #f5f5f5;
  border-left: 4px solid var(--newspaper-border);
  padding: 20px;
  margin: 20px 0;
  font-style: italic;
}

.section-header {
  font-family: var(--newspaper-font-serif);
  font-size: 1.5em;
  font-weight: 700;
  text-transform: uppercase;
  border-bottom: 2px solid var(--newspaper-border);
  padding-bottom: 10px;
  margin: 40px 0 20px;
}

/* Responsive */
@media (max-width: 768px) {
  .main-content,
  .three-column {
    grid-template-columns: 1fr;
  }

  .masthead {
    font-size: 2em;
  }
}
```

---

## Implementation Steps

### Phase 1: Core Components
1. Create `NewspaperLayout.tsx` with masthead rendering
2. Create `newspaper.css` with all base styles
3. Create `Headline.tsx` and `Article.tsx`
4. Test with simple MDX file

### Phase 2: Layout Components
1. Create `Sidebar.tsx`
2. Create `Section.tsx` with column support
3. Create `Quote.tsx`
4. Add responsive breakpoints

### Phase 3: Integration
1. Add MDX component mapping to news route
2. Create example weekly edition MDX file
3. Add route handling for `/news/weekly/[date]`
4. Test full rendering pipeline

### Phase 4: Polish
1. Add print styles for physical printing
2. Add dark mode support (sepia tones?)
3. Add transition animations
4. Consider i18n support (like the HTML example showed)

---

## Alternative Approaches Considered

### 1. Custom Remark Plugin
**Pros:** Pure markdown syntax like `:::headline`
**Cons:** More complex to implement, harder to debug

### 2. YAML-only Configuration
**Pros:** Very structured data
**Cons:** Less flexible for long-form content, not markdown

### 3. Separate JSON + Markdown
**Pros:** Clean separation of layout and content
**Cons:** Two files per article, harder to maintain

**Decision:** MDX components offer the best balance of markdown simplicity and layout flexibility.

---

## Questions to Resolve

1. **Content source:** Should weekly editions live in `/news/content/weekly/` or a separate `/editions/` directory?

2. **Database integration:** Should newspaper metadata go into `content.db` or remain MDX-only?

3. **Layout variants:** How many layout types needed?
   - Weekly review (multi-section, sidebar)
   - Single article (focused, no sidebar)
   - Breaking news (minimal, urgent styling)

4. **Image handling:** Use existing image pipeline or add newspaper-specific image components (captions, credits)?

5. **Print support:** Priority for print stylesheet?

---

## References

- Original HTML mockup provided by user (full newspaper layout with translations)
- Current news route: `src/app/(content)/news/`
- Existing MDX setup in the codebase
- Merriweather + Open Sans font pairing (Google Fonts)

---

## Next Steps

When ready to implement:
1. Confirm layout variants needed
2. Create component files
3. Build out CSS
4. Create example MDX content
5. Test rendering
6. Integrate with existing news route or create new `/editions` route

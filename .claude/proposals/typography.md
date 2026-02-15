# Typography Proposal: Gwern.net vs Krisyotam.com

Comprehensive formatting comparison between gwern.net and krisyotam.com, with recommendations on what to adopt.

---

## 1. BODY TEXT

| Feature | Gwern | Krisyotam | Recommendation |
|---------|-------|-----------|----------------|
| Font | Source Serif 4 | IBM Plex Serif | **Keep yours** — both excellent serifs, Plex is more modern |
| Base size | 20px (desktop), 18px (mobile) | 18px (1.125rem) fixed | **Adopt gwern's** — responsive sizing is better. 20px on desktop, 18px on mobile |
| Line height | Responsive: 1.45 (mobile) → 1.60 (desktop) | 1.7 fixed | **Adopt gwern's** — responsive line-height adapts to reading distance |
| Text indent | 2.5em (desktop), 1.75em (mobile); first paragraph none | None (uses margin-bottom spacing) | **Keep yours** — indent style is a strong aesthetic preference; your margin approach is cleaner for web |
| Hyphenation | `hyphens: auto` | `hyphens: auto` | Same |
| Paragraph spacing | No margin, uses text-indent | `margin: 0 0 1.25rem 0` | **Keep yours** |
| Font features | `oldstyle-nums` globally | `kern, liga, calt` | **Consider adding** `oldstyle-nums` — elegant for body text numerals |
| Max width | 935px | 672px (`max-w-[672px]`) | **Keep yours** — 672px is excellent for readability |

## 2. HEADINGS

| Feature | Gwern | Krisyotam | Recommendation |
|---------|-------|-----------|----------------|
| H1 | Right-aligned, small-caps, 2em, solid bottom border | Left, 1.625rem, solid bottom border | **Keep yours** — right-aligned headings are very gwern-specific |
| H2 | Uppercase, 1.4em, dotted bottom border | 1.5rem, dotted bottom border | **Keep yours** — you already have the dotted border. Uppercase H2 is worth considering |
| H3 | 1.35em, bold, no border | 1.25rem, dotted border (0.4 opacity) | **Keep yours** — the subtle dotted border is nice |
| H4 | 1.2em | 1.125rem, no border | Same approach |
| H5/H6 | H6: italic, normal weight | Not styled in content CSS | **Consider adding** H6 italic for visual hierarchy |
| Letter spacing | -0.75px (H1) | -0.02em | Similar |
| Small caps | Used in H1, H2 | Not used | **Optional** — small-caps headings are elegant but change the character significantly |

## 3. LINKS

| Feature | Gwern | Krisyotam | Recommendation |
|---------|-------|-----------|----------------|
| Underline style | Complex text-shadow trick to skip descenders + background gradient | Dotted underline, solid on hover | **Keep yours** — gwern's method is fragile and has accessibility trade-offs; your dotted→solid transition is clean and accessible |
| Color | #333 (light), #dcdcdc (dark) | `hsl(var(--foreground))` | Similar — both use near-body-text color |
| Visited | #666 (light), #b4b4b4 (dark) | No visited style | **Consider adding** visited link color — helps readers track what they've read |
| Hover | Color change to #888 | Decoration style change | **Keep yours** — decoration change is subtler |

## 4. LISTS

| Feature | Gwern | Krisyotam | Recommendation |
|---------|-------|-----------|----------------|
| UL bullets | Custom SVG stars (3 levels: filled, empty, rotated) | Standard `disc` | **Keep yours** — custom star bullets are very gwern-specific and complex to maintain |
| OL numbers | Counter-based with multiple formats (alpha, roman, etc.) | Standard `decimal` | **Keep yours** unless you need roman/alpha variants |
| Padding | 2.5em (desktop), 1.5em (mobile) | 1.5rem | **Keep yours** — gwern's 2.5em feels excessive |
| Multi-column | `column-width: 18em` available | Not available | **Consider adding** — useful for long reference lists |

## 5. TABLES

| Feature | Gwern | Krisyotam | Recommendation |
|---------|-------|-----------|----------------|
| Font size | 0.75em (compact) | 0.95em | **Adopt gwern's** — smaller table text prevents tables from dominating |
| Header | Sticky, with box-shadow | 2px solid bottom border | **Adopt gwern's** sticky headers — very useful for long tables |
| Zebra striping | Odd rows: #f6f6f6 | Even rows: `hsl(var(--muted) / 0.2)` | Same concept, both fine |
| Cell padding | 7px 10px | 0.75rem | Similar |
| Sortable | Yes (tablesorter.js) | No | **Consider** — sortable tables are very useful for data-heavy content |
| Captions | Italic, 1.25em, border-bottom | No caption styling | **Add** caption styling — `font-style: italic; font-size: 1.1em` |
| Scrollable | `max-height: calc(100vh - 8rem)` | `overflow-x: auto` wrapper | **Adopt** max-height constraint — prevents endless vertical tables |
| Border style | Minimal — only horizontal separators + vertical between columns | Full grid borders | **Consider gwern's** — minimal borders look cleaner |

## 6. CODE

| Feature | Gwern | Krisyotam | Recommendation |
|---------|-------|-----------|----------------|
| Inline font | IBM Plex Mono | IBM Plex Mono | Same |
| Inline border | 1px solid | None (background only) | **Consider gwern's** — subtle border helps inline code stand out |
| Inline bg | #fafafa / #1d1d1d | `hsl(var(--muted))` | Similar |
| Block border-radius | Not specified (effectively 0) | 0 | Same |
| Block max-height | `calc(100vh - 8rem)` | None | **Adopt** — prevents massive code blocks from eating the page |
| Syntax highlighting | Custom Pandoc/Skylighting vars | Basic | **Adopt** more token colors — dark blue keywords, muted green comments is a nice palette |
| Line highlighting | Hover highlight on lines | Not available | **Nice to have** but not critical |
| Font features | `ss02, ss03` (single-story g, slashed zero) | None | **Adopt** — `font-feature-settings: 'ss02', 'ss03'` makes code more readable in Plex Mono |

## 7. BLOCKQUOTES

| Feature | Gwern | Krisyotam | Recommendation |
|---------|-------|-----------|----------------|
| 3-level nesting | Yes, cycling colors | Yes (already implemented) | **Done** |
| Level 1 bg | #f8f8f8 / #212121 | `hsl(var(--muted) / 0.25)` | Similar approach |
| Font scaling | 0.95x per level (compounds) | 0.95em at base, no compound | **Consider** compound scaling per level |
| Border | 1px solid, all sides | 1px solid, all sides | Same |

## 8. HORIZONTAL RULES

| Feature | Gwern | Krisyotam | Recommendation |
|---------|-------|-----------|----------------|
| Style | No line — decorative cycling icons (sun, moon, stars) | `1px solid` line in CSS; fleuron `﹡﹡﹡` in component | **Keep yours** — the fleuron is elegant and simpler |
| Icon cycling | 3 different astronomical icons cycle | Single fleuron ornament | **Keep yours** |

## 9. IMAGES & FIGURES

| Feature | Gwern | Krisyotam | Recommendation |
|---------|-------|-----------|----------------|
| Outline | 1px solid #888 | No outline | **Consider gwern's** — `outline: 1px solid hsl(var(--border))` gives images clean framing |
| Float support | `.float-right`, `.float-left` with 50% max-width | Not in CSS | **Adopt** — floated figures are useful for embedding images in text flow |
| Caption | Bold first paragraph, small-caps strong | Italic, centered, 0.9em | **Keep yours** — simpler and clean |
| Max height | `calc(100vh - 8rem)` | None | **Adopt** — prevents oversized images from breaking flow |

## 10. FOOTNOTES

| Feature | Gwern | Krisyotam | Recommendation |
|---------|-------|-----------|----------------|
| Ref style | Super, bold (600), complex hover states | Super, 0.75em, no decoration | **Consider** bolder footnote refs — makes them easier to click |
| Section HR | Custom ornamental circle | 1px solid top border | **Keep yours** — simpler |
| Numbering | Dotted-border numbered boxes | Standard | **Keep yours** — gwern's is over-designed for most sites |
| Sidenotes | Yes — dynamic positioning | Yes — already implemented | Same |

## 11. ADMONITIONS / CALLOUTS

| Feature | Gwern | Krisyotam | Recommendation |
|---------|-------|-----------|----------------|
| Types | tip, note, warning, error (grayscale gradient) | info, warning, danger, success (colored) | **Keep yours** — colored callouts are more intuitive |
| Font | Sans-serif | Mixed | **Keep yours** |
| Left border | 2.875em thick with icon | Standard border | **Consider** gwern's thick left-border-with-icon pattern — very clear visual |
| Icons | Font Awesome SVGs (info, hand, triangle, skull) | Lucide icons | **Keep yours** |

## 12. DROP CAPS

| Feature | Gwern | Krisyotam | Recommendation |
|---------|-------|-----------|----------------|
| Implementation | Multiple ornamental fonts (Goudy, Yinit, etc.), 5-7em | Image-based dropcap wrapper | **Keep yours** — ornamental font drop caps require loading extra fonts |

## 13. TABLE OF CONTENTS

| Feature | Gwern | Krisyotam | Recommendation |
|---------|-------|-----------|----------------|
| Position | Float left (desktop), centered (mobile) | Already implemented (TOC component) | **Keep yours** |
| Numbering | Wikipedia-style counters (1, 1.1, 1.1.1) | Not numbered | **Consider** — numbered TOC entries help reference specific sections |
| Hover effect | Background highlight + right-edge indicator bar | Not specified | **Nice to have** |
| Collapsible | Yes, with `[Contents]` label | Already handled by TOC component | Same |

## 14. EPIGRAPHS

| Feature | Gwern | Krisyotam | Recommendation |
|---------|-------|-----------|----------------|
| Style | Centered, italic, decorative quotation marks (::before/::after), attribution right-aligned | No dedicated epigraph style | **Consider adding** — epigraphs are useful for essays. A simple version: italic blockquote with no border, centered, smaller padding |

## 15. SELECTION

| Feature | Gwern | Krisyotam | Recommendation |
|---------|-------|-----------|----------------|
| Style | #333 bg / #fff text (light); #dcdcdc bg / #000 text (dark) | Browser default | **Adopt** — custom selection colors maintain the monochrome aesthetic |

---

## Top Priority Recommendations

These are the changes that would have the highest impact for the least effort:

1. **Responsive font size** — 20px desktop, 18px mobile
2. **Responsive line-height** — 1.45 mobile → 1.60 desktop
3. **`oldstyle-nums`** — add `font-variant-numeric: oldstyle-nums` to body
4. **Code block max-height** — `max-height: calc(100vh - 8rem)`
5. **Plex Mono features** — `font-feature-settings: 'ss02', 'ss03'`
6. **Sticky table headers** — `position: sticky; top: 0`
7. **Smaller table font** — drop to 0.85em
8. **Image outline** — `outline: 1px solid hsl(var(--border))`
9. **Custom selection colors** — match your monochrome theme
10. **Visited link color** — subtle distinction for read links

---

## Gwern Features NOT Recommended

- **Right-aligned H1** — too idiosyncratic
- **Text-shadow link underlines** — fragile, accessibility concerns
- **Custom SVG star bullets** — high maintenance, very gwern-specific
- **Ornamental HR cycling icons** — your fleurons are cleaner
- **Dotted-border footnote number boxes** — over-designed
- **Multiple ornamental drop cap fonts** — extra font loading cost
- **Text-indent paragraphs** — your margin-bottom approach is standard for web

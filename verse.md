# verse.tsx - Poetry Component Plan

Based on Gwern's poetry typesetting research and existing PoemBox/PoemDisplay components.

---

## Component Location

`components/posts/typography/verse.tsx`

---

## Core Philosophy

Poetry requires precise whitespace and layout control that HTML naturally destroys. The solution is a three-tier system with monospace serif typography, progressive enhancement, and semantic structure that degrades gracefully.

---

## Props Interface

```typescript
interface VerseProps {
  children: React.ReactNode
  className?: string

  // Display mode
  mode?: "inline" | "block" | "concrete"

  // Metadata (optional)
  title?: string
  author?: string
  year?: number

  // Analysis annotations (optional)
  rhymeScheme?: string[]
  meter?: string
  form?: string  // "sonnet", "villanelle", "haiku", etc.

  // Layout options
  align?: "left" | "center" | "right"
  numbered?: boolean  // line numbers

  // Interaction
  disableHover?: boolean
  disableOrphanPrevention?: boolean
}
```

---

## Three Display Modes

### 1. Inline Mode (`mode="inline"`)

For quoting poetry within prose paragraphs.

**Behavior:**
- Renders as `<span class="verse verse-inline">`
- Uses monospace serif font
- "/" marks rendered at 40% opacity (caesura indication)
- "||" marks styled subtly for strong caesura

**Example usage:**
```mdx
As Eliot writes, <Verse mode="inline">April is the cruellest month / breeding lilacs</Verse>, we see...
```

**Output:**
```html
<span class="verse verse-inline">April is the cruellest month <span class="slash">/</span> breeding lilacs</span>
```

---

### 2. Block Mode (`mode="block"`) - Default

Standard poetry display with stanza support.

**Behavior:**
- Renders as `<div class="verse verse-block">`
- Paragraphs (`<p>`) become stanzas
- Line breaks (`<br>`) or newlines separate lines within stanzas
- Empty lines between paragraphs create stanza breaks
- Enjambment via " / " syntax creates staircase indentation
- Orphan prevention (non-breaking space before last word)

**Stanza Structure:**
```html
<div class="verse verse-block">
  <div class="stanza">
    <p class="line first-line">First line of stanza</p>
    <p class="line">Second line</p>
    <p class="line last-line">Third line</p>
  </div>
  <div class="stanza-break"></div>
  <div class="stanza">
    <p class="line first-line">First line of next stanza</p>
    ...
  </div>
</div>
```

**Enjambment Example:**

Input:
```mdx
<Verse>
I have measured out my life / with coffee spoons
</Verse>
```

Output (visual):
```
I have measured out my life
                          with coffee spoons
```

The continuation line indents by the width of the previous line segment.

---

### 3. Concrete Mode (`mode="concrete"`)

For shaped/concrete poetry where exact character positioning matters.

**Behavior:**
- Renders as `<div class="verse verse-concrete">`
- Uses `white-space: pre` for exact WYSIWYG layout
- Author controls spacing by counting characters
- HTML tag compensation: JS injects padding equal to stripped tag widths
- Preserves all whitespace exactly as written

**Example usage:**
```mdx
<Verse mode="concrete">
{`
       *
      ***
     *****
    *******
   *********
       |
`}
</Verse>
```

**HTML Compensation:**
When author writes `<em>word</em>` in concrete mode, the component pads for the 9 characters of markup (`<em></em>`) so visual alignment is preserved.

---

## Typography

### Font Stack

```css
--verse-font: "Nimbus Mono", "Free Mono", "Courier New", monospace;
```

Monospace serif is essential because:
- Predictable character widths for alignment
- Literary appearance (less "code-like" than sans mono)
- Readable italics for emphasis
- Works with enjambment calculations

### Font Fallback Strategy

1. Nimbus Mono (preferred - has good italics)
2. Free Mono (Linux fallback)
3. Courier New (universal fallback)
4. Generic monospace

---

## Special Syntax Processing

### Caesura Marks

**Slash (`/`)** - Light caesura
- Input: `word / word`
- Rendered at 40% opacity
- Indicates pause or breath

**Double Pipe (`||`)** - Strong caesura (alliterative verse)
- Input: `word || word`
- Rendered at 20% opacity
- Tight letter-spacing
- In centered poems, these align vertically via flexbox

### Enjambment (`/` with staircase)

- Input: `first part / second part`
- Creates visual staircase continuation
- Each step indented by `--enjambment-step * 0.5ch`
- Multiple enjambments stack: `a / b / c` creates three-step staircase

---

## Orphan Prevention

Prevents single words from appearing alone after line wrap.

**Method:**
- Insert non-breaking space (`\u00A0`) before the last word of each line
- Ensures minimum two words stay together on wrap

**Example:**
```
The quick brown fox jumps over the lazy dog
```
Becomes internally:
```
The quick brown fox jumps over the lazy\u00A0dog
```

Can be disabled with `disableOrphanPrevention={true}`.

---

## Optional Features

### Line Numbers (`numbered={true}`)

```html
<div class="verse verse-block verse-numbered">
  <div class="stanza">
    <p class="line" data-line="1">First line</p>
    <p class="line" data-line="2">Second line</p>
    ...
  </div>
</div>
```

CSS displays line numbers in margin via `::before` pseudo-element.

### Rhyme Scheme Annotations (`rhymeScheme={["A", "B", "A", "B"]}`)

Displays rhyme scheme letters in right margin aligned with each line.

```html
<p class="line" data-rhyme="A">...</p>
```

### Meter Display (`meter="iambic pentameter"`)

Shown in footer below poem.

### Form Label (`form="villanelle"`)

Shown in header or footer as subtle label.

---

## Header/Footer Structure

When metadata is provided:

```html
<figure class="verse-container">
  <header class="verse-header">
    <h3 class="verse-title">Title</h3>
    <p class="verse-author">By Author, Year</p>
  </header>

  <div class="verse verse-block">
    <!-- poem content -->
  </div>

  <footer class="verse-footer">
    <span class="verse-form">Villanelle</span>
    <span class="verse-meter">Iambic pentameter</span>
    <span class="verse-rhyme">Rhyme: ABA ABA ABA ABA ABA ABAA</span>
  </footer>
</figure>
```

---

## CSS Architecture

### CSS Variables

```css
.verse {
  --verse-font: "Nimbus Mono", "Free Mono", "Courier New", monospace;
  --verse-line-height: 1.6;
  --verse-stanza-gap: 1.5em;
  --verse-indent: 2ch;
  --verse-slash-opacity: 0.4;
  --verse-caesura-opacity: 0.2;
  --verse-line-number-color: var(--muted-foreground);
}
```

### Base Styles

```css
.verse {
  font-family: var(--verse-font);
  line-height: var(--verse-line-height);
  overflow-x: auto;
}

.verse-inline {
  /* inline display, no block formatting */
}

.verse-block {
  /* block display with stanza structure */
}

.verse-concrete {
  white-space: pre;
}

.verse .stanza {
  margin-bottom: var(--verse-stanza-gap);
}

.verse .stanza:last-child {
  margin-bottom: 0;
}

.verse .line {
  text-indent: calc(-1 * var(--verse-indent));
  padding-left: var(--verse-indent);
}

.verse .slash {
  opacity: var(--verse-slash-opacity);
}

.verse .caesura-mark {
  opacity: var(--verse-caesura-opacity);
  letter-spacing: -0.3em;
}

/* Enjambment */
.verse .enjambed-line {
  white-space: pre;
}

.verse .enjambment-spacer {
  padding-right: calc(var(--enjambment-step) * 0.5ch);
}
```

### Centered Poem Special Layout

For poems with `align="center"` containing caesura marks:

```css
.verse-center .stanza.has-caesura .line {
  display: flex;
  justify-content: center;
}

.verse-center .stanza.has-caesura .segment {
  flex: 1 1 50%;
}

.verse-center .stanza.has-caesura .segment:first-child {
  text-align: right;
}

.verse-center .stanza.has-caesura .segment:last-child {
  text-align: left;
}

.verse-center .stanza.has-caesura .caesura-mark {
  flex: 0 0 3ch;
  text-align: center;
}
```

---

## Hover Interaction

Optional line highlighting on hover (matches current PoemBox behavior).

```css
.verse:not(.verse-no-hover) .line:hover {
  background-color: hsl(var(--muted) / 0.5);
}
```

Disabled with `disableHover={true}`.

---

## Scrollbar Styling

For long lines that overflow:

```css
.verse::-webkit-scrollbar {
  height: 12px;
  background-color: var(--scrollbar-track);
}

.verse::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-thumb);
}

/* Firefox */
@supports (-moz-appearance: none) {
  .verse {
    scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
  }
}
```

---

## Processing Pipeline

### Client-Side Processing Steps

1. **Parse children** - Extract lines and stanzas from React children
2. **Process enjambment** - Find " / " patterns, calculate indentation
3. **Wrap caesura marks** - `||` in `<span class="caesura-mark">`
4. **Wrap slashes** - `/` in `<span class="slash">`
5. **Prevent orphans** - Insert non-breaking spaces
6. **Apply line classes** - `.first-line`, `.last-line`
7. **Compensate HTML** (concrete mode) - Pad for tag widths

### Order of Operations

```
Input → Parse → Enjambment → Caesura → Slash → Orphans → Classes → Render
```

---

## Backward Compatibility

### Migration from PoemBox

`<PoemBox>` should be aliased to `<Verse mode="block">` with:
- `disableHover` maps to `disableHover`
- `author` maps to `author`
- `title` maps to `title`

### Migration from PoemDisplay

`<PoemDisplay>` functionality absorbed via:
- `rhymeScheme` prop
- `meter` prop
- `year` prop combined with `author`

---

## Export Structure

```typescript
// Main component
export function Verse(props: VerseProps): JSX.Element

// Backward compatibility aliases
export { Verse as PoemBox }
export { Verse as Poem }

// Sub-components for advanced composition
export function VerseStanza(props: StanzaProps): JSX.Element
export function VerseLine(props: LineProps): JSX.Element
```

---

## MDX Registration

In `mdx-components.tsx`:

```typescript
import { Verse } from "@/components/posts/typography/verse"

export const mdxComponents = {
  Verse,
  PoemBox: Verse,  // backward compat
  // ...
}
```

---

## Usage Examples

### Simple Block Poem

```mdx
<Verse title="The Road Not Taken" author="Robert Frost">
Two roads diverged in a yellow wood,
And sorry I could not travel both
And be one traveler, long I stood
And looked down one as far as I could
To where it bent in the undergrowth;
</Verse>
```

### Inline Quote

```mdx
Frost's famous line <Verse mode="inline">Two roads diverged in a yellow wood</Verse> opens the poem.
```

### With Enjambment

```mdx
<Verse>
I have measured out my life / with coffee spoons
</Verse>
```

### Concrete Poetry

```mdx
<Verse mode="concrete">
{`
    l
   e a
  v   f
 e     s

f
 a
  l
   l
    i
     n
      g
`}
</Verse>
```

### With Full Metadata

```mdx
<Verse
  title="Sonnet 18"
  author="William Shakespeare"
  year={1609}
  form="sonnet"
  meter="iambic pentameter"
  rhymeScheme={["A","B","A","B","C","D","C","D","E","F","E","F","G","G"]}
  numbered
>
Shall I compare thee to a summer's day?
Thou art more lovely and more temperate:
...
</Verse>
```

### Alliterative Verse with Caesura

```mdx
<Verse align="center">
Hwæt! We Gardena || in geardagum
þeodcyninga || þrym gefrunon
</Verse>
```

---

## Rejected Approaches (from Gwern's research)

1. **PDF/PNG images** - Unmaintainable, unsearchable, non-responsive
2. **`&nbsp;` spacing** - Breaks across font sizes, proportional fonts destroy alignment
3. **Heavy semantic markup** - Authoring nightmare, too much boilerplate
4. **Standard `<pre><code>`** - Wrong typography (code aesthetics), loses formatting capability
5. **Non-monospace fonts** - Impossible to maintain alignment for concrete poetry

---

## Future Considerations

- Copy-paste cleaning (strip non-breaking spaces from clipboard)
- Print stylesheet optimization
- Annotations/footnotes within poems
- Audio integration (for spoken word recordings)
- Scansion markup (stress patterns)

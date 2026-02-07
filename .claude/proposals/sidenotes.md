# Sidenotes: Left/Right Alternating Columns

## Current State
- Sidenotes only appear in the right column
- Config in `src/components/core/sidenotes.tsx`:
  ```typescript
  useLeftColumn: false,
  useRightColumn: true,
  ```

## Proposed Change
Enable alternating left/right columns like UMT.world and Gwern.net:
- Odd-numbered footnotes → right column
- Even-numbered footnotes → left column

## Files to Modify

### 1. `src/components/core/sidenotes.tsx`
Change config:
```typescript
useLeftColumn: true,
useRightColumn: true,
```

The positioning logic already handles this (lines 197-203):
```typescript
if (CONFIG.useLeftColumn && CONFIG.useRightColumn) {
  column = note.number % 2 === 0 ? "left" : "right"
}
```

### 2. `src/app/globals.css`
CSS already supports both columns (lines 1467-1484). No changes needed.

## Benefits
- Better use of screen real estate on wide monitors
- Matches Gwern's canonical implementation
- Reduces vertical stacking/collision of sidenotes

## Considerations
- May want to also increase breakpoint from 1400px to 1760px to ensure enough margin space for both columns
- Test on various content to ensure left column doesn't collide with TOC or other left-side elements

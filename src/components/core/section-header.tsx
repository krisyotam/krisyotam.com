/**
 * SectionHeader
 *
 * Industrial/aerospace aesthetic section header that matches the unified stats bar.
 * Displays a title with optional count in a minimal, technical design.
 *
 * @example
 * <SectionHeader title="Favorite Films" count={24} />
 * <CardGrid>...</CardGrid>
 */

interface SectionHeaderProps {
  title: string
  count?: number
}

export function SectionHeader({ title, count }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-4">
      {/* Accent line */}
      <div className="w-1 h-5 bg-foreground/80" />
      {/* Title */}
      <h2 className="text-sm font-medium uppercase tracking-wide text-foreground">{title}</h2>
      {/* Divider line */}
      <div className="flex-1 h-px bg-border" />
      {/* Count */}
      {count !== undefined && (
        <span className="text-xs font-mono text-muted-foreground tabular-nums">{count.toLocaleString()}</span>
      )}
    </div>
  )
}

// Legacy alias for backwards compatibility
export const TraktSectionHeader = SectionHeader

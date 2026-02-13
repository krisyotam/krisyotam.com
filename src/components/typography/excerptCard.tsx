/**
 * =============================================================================
 * ExcerptCard Component
 * =============================================================================
 *
 * Displays a single excerpt with author attribution and source.
 * Designed for longer passages than quotes.
 *
 * @type component
 * @path src/components/excerpts/excerpt-card.tsx
 * =============================================================================
 */

interface ExcerptCardProps {
  text: string
  author?: string
  source?: string
}

export function ExcerptCard({ text, author, source }: ExcerptCardProps) {
  return (
    <div className="relative bg-white border border-border text-foreground shadow-sm flex flex-col overflow-hidden dark:bg-card dark:text-card-foreground">
      <div className="p-6 flex flex-col">
        {/* Opening quote mark */}
        <div className="text-3xl text-muted-foreground mb-3 leading-none">"</div>

        {/* Excerpt text - preserves paragraph breaks */}
        <div className="text-sm font-medium mb-4 leading-relaxed whitespace-pre-wrap">
          {text}
        </div>

        {/* Attribution */}
        <div className="flex items-start justify-between text-xs text-muted-foreground border-t border-border pt-4 mt-auto">
          <div>
            {author && (
              <div className="font-medium text-[13px] text-foreground">
                — {author}
              </div>
            )}
            {source && (
              <div className="italic mt-1 text-muted-foreground">
                {source}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

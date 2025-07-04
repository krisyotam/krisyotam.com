"use client"

import { cn } from "@/lib/utils"
import { formatDate } from "@/utils/date-formatter"
import Link from "next/link"
import { ArrowLeft, Info } from "lucide-react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Badge } from "@/components/ui/badge"

interface DocsHeaderProps {
  title: string
  subtitle?: string
  date: string | Date
  tags?: string[]
  category?: string
  preview?: string
  status?: string
  confidence?: string
  importance?: number
}

export function DocsHeader({
  title,
  subtitle,
  date,
  tags,
  category,
  preview,
  status,
  confidence,
  importance,
}: DocsHeaderProps) {
  return (
    <header className="mb-2 relative">
      {/* Back to docs link */}
      <Link
        href="/docs"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 group font-serif italic"
      >
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Return to Docs
      </Link>

      {/* Academic bento container */}
      <div className="border border-border bg-card text-card-foreground p-6 rounded-sm shadow-sm">
        {/* Responsive title that gets smaller based on length */}
        <h1
          className={cn(
            "font-serif font-medium tracking-tight mb-2 text-center uppercase",
            title.length > 50 ? "text-2xl" : title.length > 30 ? "text-3xl" : "text-4xl",
          )}
        >
          {title}
        </h1>

        {/* AI Model subtitle */}
        {subtitle && (
          <p className="text-center font-serif text-sm text-muted-foreground italic mb-4 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}

        {/* Date above other metadata */}
        <div className="text-center mb-4">
          <time
            dateTime={typeof date === "string" ? date : date.toISOString()}
            className="font-mono text-sm text-muted-foreground"
          >
            {formatDate((typeof date === "string" ? new Date(date) : date).toISOString())}
          </time>
        </div>

        {/* Preview/description text */}
        {preview && (
          <p className="text-center font-serif text-sm text-muted-foreground mb-4 max-w-2xl mx-auto">
            {preview}
          </p>
        )}

        {/* Tags with academic styling */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="bg-secondary/40 text-xs font-mono hover:bg-secondary transition-colors rounded-none"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Category link with academic styling */}
        {category && (
          <div className="text-center mt-4">
            <Link
              href={`/docs/${encodeURIComponent(category.toLowerCase().replace(/\s+/g, "-"))}`}
              className="text-sm font-serif italic text-muted-foreground hover:text-foreground transition-colors"
            >
              Filed under: {category}
            </Link>
          </div>
        )}

        {/* Document metadata */}
        {(status || confidence || importance !== undefined) && (
          <div className="flex justify-center items-center gap-4 mt-4 text-xs text-muted-foreground">
            {status && (
              <div className="flex items-center">
                <span className="font-medium">Status:</span>
                <span className="ml-1">{status}</span>
              </div>
            )}
            {confidence && (
              <div className="flex items-center">
                <span className="font-medium">Confidence:</span>
                <span className="ml-1">{confidence}</span>
              </div>
            )}
            {importance !== undefined && (
              <div className="flex items-center">
                <span className="font-medium">Importance:</span>
                <span className="ml-1">{importance}/10</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Decorative bottom border */}
      <div className="mt-2 border-b border-border"></div>
    </header>
  )
} 
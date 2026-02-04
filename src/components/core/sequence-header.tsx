/*
+------------------+----------------------------------------------------------+
| FILE             | sequence-header.tsx                                      |
| ROLE             | Sequence-specific header with cover image + metadata     |
| OWNER            | Kris Yotam                                               |
| CREATED          | 2026-02-04                                               |
| UPDATED          | 2026-02-04                                               |
+------------------+----------------------------------------------------------+
| @type component                                                             |
| @path src/components/core/sequence-header.tsx                               |
+------------------+----------------------------------------------------------+
| SUMMARY                                                                     |
| A bento-style header for sequences featuring a prominent cover image        |
| alongside metadata. Uses square corners and grid-based layout.              |
+-----------------------------------------------------------------------------+
*/

import { formatYMDRange, getTodayISO } from "@/lib/date"
import Link from "next/link"
import { ArrowLeft, Info } from "lucide-react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { cn } from "@/lib/utils"

/* ═══════════════════════════════════════════════════════════════════════════
 * TYPE DEFINITIONS
 * ═══════════════════════════════════════════════════════════════════════════ */

export type SequenceStatus =
  | "Abandoned"
  | "Notes"
  | "Draft"
  | "In Progress"
  | "Finished"
  | "Published"
  | "Planned"
  | "Active"

export type SequenceConfidence =
  | "impossible"
  | "remote"
  | "highly unlikely"
  | "unlikely"
  | "possible"
  | "likely"
  | "highly likely"
  | "certain"

export interface SequenceHeaderProps {
  title: string
  preview?: string
  coverUrl?: string
  start_date?: string
  end_date?: string
  status?: SequenceStatus
  confidence?: SequenceConfidence
  importance?: number
  tags?: string[]
  category?: string
  categoryHref?: string
  backText?: string
  backHref?: string
  className?: string
}

/* ═══════════════════════════════════════════════════════════════════════════
 * EXPLANATION TEXTS
 * ═══════════════════════════════════════════════════════════════════════════ */

const CONFIDENCE_EXPLANATION = `The confidence tag expresses how well-supported the content is, or how likely its overall ideas are right. This uses a scale from "impossible" to "certain", based on the Kesselman List of Estimative Words:

1. "certain"
2. "highly likely"
3. "likely"
4. "possible"
5. "unlikely"
6. "highly unlikely"
7. "remote"
8. "impossible"

Even ideas that seem unlikely may be worth exploring if their potential impact is significant enough.`

const IMPORTANCE_EXPLANATION = `The importance rating distinguishes between trivial topics and those which might change your life. Using a scale from 0-10, content is ranked based on its potential impact on:

- the reader
- the intended audience
- the world at large

For example, topics about fundamental research or transformative technologies would rank 9-10, while personal reflections or minor experiments might rank 0-1.`

const STATUS_EXPLANATION = `The status indicator reflects the current state of the work:

- Abandoned: Work that has been discontinued
- Notes: Initial collections of thoughts and references
- Draft: Early structured version with a central thesis
- In Progress: Well-developed work actively being refined
- Finished: Completed work with no planned major changes

This helps readers understand the maturity and completeness of the content.`

/* ═══════════════════════════════════════════════════════════════════════════
 * COLOR UTILITIES
 * ═══════════════════════════════════════════════════════════════════════════ */

function getConfidenceColor(confidence: string): string {
  const colors: Record<string, string> = {
    certain: "text-gray-900 dark:text-gray-100",
    "highly likely": "text-gray-800 dark:text-gray-200",
    likely: "text-gray-700 dark:text-gray-300",
    possible: "text-gray-600 dark:text-gray-400",
    unlikely: "text-gray-500 dark:text-gray-500",
    "highly unlikely": "text-gray-400 dark:text-gray-600",
    remote: "text-gray-300 dark:text-gray-700",
    impossible: "text-gray-200 dark:text-gray-800",
  }
  return colors[confidence] || "text-gray-600 dark:text-gray-400"
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    Finished: "text-gray-900 dark:text-gray-100",
    Published: "text-gray-900 dark:text-gray-100",
    Active: "text-gray-900 dark:text-gray-100",
    "In Progress": "text-gray-800 dark:text-gray-200",
    Draft: "text-gray-700 dark:text-gray-300",
    Planned: "text-gray-600 dark:text-gray-400",
    Notes: "text-gray-500 dark:text-gray-500",
    Abandoned: "text-gray-400 dark:text-gray-600",
  }
  return colors[status] || "text-gray-600 dark:text-gray-400"
}

function getImportanceColor(importance: number): string {
  if (importance >= 8) return "text-gray-900 dark:text-gray-100"
  if (importance >= 6) return "text-gray-800 dark:text-gray-200"
  if (importance >= 4) return "text-gray-600 dark:text-gray-400"
  if (importance >= 2) return "text-gray-500 dark:text-gray-500"
  return "text-gray-400 dark:text-gray-600"
}

/* ═══════════════════════════════════════════════════════════════════════════
 * MAIN COMPONENT
 * ═══════════════════════════════════════════════════════════════════════════ */

export function SequenceHeader({
  title,
  preview,
  coverUrl,
  start_date,
  end_date,
  status = "Draft",
  confidence = "possible",
  importance = 5,
  tags,
  category,
  categoryHref,
  backText = "Sequences",
  backHref = "/sequences",
  className,
}: SequenceHeaderProps) {
  const formattedDate = start_date
    ? formatYMDRange(start_date, end_date?.trim() || getTodayISO())
    : null

  return (
    <header className={cn("mb-8 relative", className)}>
      {/* Back Navigation */}
      <Link
        href={backHref}
        data-no-preview="true"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 group font-serif italic"
      >
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Return to {backText}
      </Link>

      {/* Bento Container */}
      <div className="border border-border bg-card">
        {/* Cover Image - Full Width Top */}
        {coverUrl?.trim() ? (
          <div className="aspect-[21/9] border-b border-border bg-muted/30">
            <img
              src={coverUrl.trim()}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="aspect-[21/9] border-b border-border bg-muted/30 flex items-center justify-center">
            <span className="text-muted-foreground text-sm font-mono">
              {title}
            </span>
          </div>
        )}

        {/* Content Section - Full Width */}
        <div className="p-6">
          {/* Title */}
          <h1 className="font-serif font-medium tracking-tight text-2xl md:text-3xl uppercase mb-3">
            {title}
          </h1>

          {/* Preview */}
          {preview && (
            <p className="font-serif text-sm text-muted-foreground italic mb-4 hyphens-auto" style={{ textAlign: 'justify' }}>
              {preview}
            </p>
          )}

          {/* Date */}
          {formattedDate && (
            <div className="font-mono text-sm text-muted-foreground mb-3">
              {formattedDate}
            </div>
          )}

          {/* Tags - comma separated */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.slice(0, 3).map((tag) => (
                <Link
                  key={tag}
                  href={`/tag/${encodeURIComponent(tag.toLowerCase().replace(/\s+/g, "-"))}`}
                  className="border border-border bg-secondary/40 px-2 py-1 text-xs font-mono hover:bg-secondary transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}

          {/* Category */}
          {category && (
            <div className="text-sm font-serif italic text-muted-foreground">
              <Link
                href={categoryHref || `/sequences/category/${encodeURIComponent(category.toLowerCase().replace(/\s+/g, "-"))}`}
                className="hover:text-foreground transition-colors"
              >
                Filed under: {category}
              </Link>
            </div>
          )}
        </div>

        {/* Bottom Metadata Row - Status, Certainty, Importance */}
        <div className="grid grid-cols-3 border-t border-border divide-x divide-border">
          {/* Status */}
          <div className="py-4 px-3 text-center">
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className={cn("flex items-center justify-center gap-1 cursor-help", getStatusColor(status))}>
                  <Info className="h-3 w-3" />
                  <span className="font-mono text-sm font-medium">status: {status}</span>
                </div>
              </HoverCardTrigger>
              <HoverCardContent side="bottom" avoidCollisions={false} className="w-80 text-sm bg-card text-card-foreground border-border p-4 font-serif">
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Status Indicator</h4>
                  <p className="text-muted-foreground whitespace-pre-wrap">{STATUS_EXPLANATION}</p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>

          {/* Certainty */}
          <div className="py-4 px-3 text-center">
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className={cn("flex items-center justify-center gap-1 cursor-help", getConfidenceColor(confidence))}>
                  <Info className="h-3 w-3" />
                  <span className="font-mono text-sm font-medium">certainty: {confidence}</span>
                </div>
              </HoverCardTrigger>
              <HoverCardContent side="bottom" avoidCollisions={false} className="w-80 text-sm bg-card text-card-foreground border-border p-4 font-serif">
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Confidence Rating</h4>
                  <p className="text-muted-foreground whitespace-pre-wrap">{CONFIDENCE_EXPLANATION}</p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>

          {/* Importance */}
          <div className="py-4 px-3 text-center">
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className={cn("flex items-center justify-center gap-1 cursor-help", getImportanceColor(importance))}>
                  <Info className="h-3 w-3" />
                  <span className="font-mono text-sm font-medium">importance: {importance}/10</span>
                </div>
              </HoverCardTrigger>
              <HoverCardContent side="bottom" avoidCollisions={false} className="w-80 text-sm bg-card text-card-foreground border-border p-4 font-serif">
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Importance Rating</h4>
                  <p className="text-muted-foreground whitespace-pre-wrap">{IMPORTANCE_EXPLANATION}</p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>
      </div>
    </header>
  )
}

export default SequenceHeader

/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                                                                           ║
 * ║                    U N I F I E D   H E A D E R                            ║
 * ║                                                                           ║
 * ║           A Singular Header for Pages, Posts, and Categories              ║
 * ║                                                                           ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║                                                                           ║
 * ║  Author:      Kris Yotam                                                  ║
 * ║  License:     MIT                                                         ║
 * ║  Created:     2026-01-06                                                  ║
 * ║                                                                           ║
 * ║  Description:                                                             ║
 * ║  This component serves as the unified header for all content types.       ║
 * ║  Through the `variant` prop, it adapts its presentation for pages,        ║
 * ║  posts (with tags and categories), or category listings.                  ║
 * ║                                                                           ║
 * ║  Variants:                                                                ║
 * ║    • page     - Standard page header (no tags/category)                   ║
 * ║    • post     - Full post header with tags and "Filed under"              ║
 * ║    • category - Category listing header                                   ║
 * ║                                                                           ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { formatDate, formatDateRange, getTodayISO } from "@/lib/date"
import Link from "next/link"
import { ArrowLeft, Info } from "lucide-react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { cn } from "@/lib/utils"

/* ═══════════════════════════════════════════════════════════════════════════
 * TYPE DEFINITIONS
 * ═══════════════════════════════════════════════════════════════════════════ */

/** Available header variants */
export type HeaderVariant = "page" | "post" | "category"

/** Status values for content */
export type HeaderStatus =
  | "Abandoned"
  | "Notes"
  | "Draft"
  | "In Progress"
  | "Finished"
  | "Published"
  | "Planned"
  | "Active"

/** Confidence levels based on Kesselman List of Estimative Words */
export type HeaderConfidence =
  | "impossible"
  | "remote"
  | "highly unlikely"
  | "unlikely"
  | "possible"
  | "likely"
  | "highly likely"
  | "certain"
  | "speculative"

/** Props for the unified Header component */
export interface HeaderProps {
  /** The variant determines which features are displayed */
  variant?: HeaderVariant

  /** The main title */
  title: string

  /** Optional subtitle */
  subtitle?: string

  /** Preview or description text */
  preview?: string

  /** Alias for preview (backwards compatibility) */
  description?: string

  /* ─────────────────────────────────────────────────────────────────────────
   * Date Props - Flexible date handling
   * ───────────────────────────────────────────────────────────────────────── */

  /** Single date (used by category variant) */
  date?: string

  /** Start date for date ranges */
  start_date?: string

  /** End date for date ranges */
  end_date?: string

  /* ─────────────────────────────────────────────────────────────────────────
   * Metadata Props
   * ───────────────────────────────────────────────────────────────────────── */

  /** Content status */
  status?: HeaderStatus

  /** Confidence level */
  confidence?: HeaderConfidence

  /** Importance rating (0-10) */
  importance?: number

  /* ─────────────────────────────────────────────────────────────────────────
   * Post-specific Props (only rendered when variant="post")
   * ───────────────────────────────────────────────────────────────────────── */

  /** Tags for the post (max 3 displayed) */
  tags?: string[]

  /** Category for "Filed under" link */
  category?: string

  /** Custom href for category link (defaults to /category/{slug}) */
  categoryHref?: string

  /** Secondary info line (e.g., "From collection: X") */
  secondaryInfo?: string

  /* ─────────────────────────────────────────────────────────────────────────
   * Display Options
   * ───────────────────────────────────────────────────────────────────────── */

  /** Hide the status/confidence/importance metadata section */
  hideStatus?: boolean

  /* ─────────────────────────────────────────────────────────────────────────
   * Navigation Props
   * ───────────────────────────────────────────────────────────────────────── */

  /** Text for the back link */
  backText?: string

  /** Href for the back link */
  backHref?: string

  /** Additional CSS classes */
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

/**
 * Returns the appropriate color class for a confidence level
 */
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

/**
 * Returns the appropriate color class for a status
 */
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

/**
 * Returns the appropriate color class for an importance rating
 */
function getImportanceColor(importance: number): string {
  if (importance >= 8) return "text-gray-900 dark:text-gray-100"
  if (importance >= 6) return "text-gray-800 dark:text-gray-200"
  if (importance >= 4) return "text-gray-600 dark:text-gray-400"
  if (importance >= 2) return "text-gray-500 dark:text-gray-500"
  return "text-gray-400 dark:text-gray-600"
}

/* ═══════════════════════════════════════════════════════════════════════════
 * HELPER FUNCTIONS
 * ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Determines the title size class based on variant and title length
 */
function getTitleClass(variant: HeaderVariant, titleLength: number): string {
  if (variant === "page") {
    return "text-4xl"
  }
  // Responsive sizing for post and category variants
  if (titleLength > 50) return "text-2xl"
  if (titleLength > 30) return "text-3xl"
  return "text-4xl"
}

/**
 * Formats the back link text based on variant
 */
function getBackLinkText(variant: HeaderVariant, backText: string): string {
  if (variant === "category") {
    return backText
  }
  return `Return to ${backText}`
}

/* ═══════════════════════════════════════════════════════════════════════════
 * MAIN COMPONENT
 * ═══════════════════════════════════════════════════════════════════════════ */

export function Header({
  variant = "page",
  title,
  subtitle,
  preview,
  description,
  date,
  start_date,
  end_date,
  status = "Draft",
  confidence = "possible",
  importance = 5,
  tags,
  category,
  categoryHref,
  secondaryInfo,
  hideStatus = false,
  backText,
  backHref,
  className,
}: HeaderProps) {
  /* ─────────────────────────────────────────────────────────────────────────
   * Default Values Based on Variant
   * ───────────────────────────────────────────────────────────────────────── */

  const resolvedBackText = backText || (variant === "category" ? "Categories" : "Home")
  const resolvedBackHref = backHref || (variant === "category" ? "/categories" : "/")
  const displayPreview = preview || description

  /* ─────────────────────────────────────────────────────────────────────────
   * Date Formatting
   * ───────────────────────────────────────────────────────────────────────── */

  const renderDate = () => {
    // For category variant with single date
    if (variant === "category" && date) {
      return (
        <time dateTime={date} className="font-mono text-sm text-muted-foreground">
          {formatDate(date)}
        </time>
      )
    }

    // For page/post variants with date range
    if (start_date || end_date) {
      const dateTime = start_date || end_date
      let formattedDate = ""

      if (start_date) {
        // Always show both dates - if end_date is empty, use current date (means ongoing)
        const effectiveEndDate = end_date?.trim() || getTodayISO()
        formattedDate = formatDateRange(start_date, effectiveEndDate)
      } else if (end_date) {
        formattedDate = formatDate(end_date.split("T")[0])
      }

      return (
        <time dateTime={dateTime} className="font-mono text-sm text-muted-foreground">
          {formattedDate}
        </time>
      )
    }

    return null
  }

  /* ─────────────────────────────────────────────────────────────────────────
   * Render
   * ───────────────────────────────────────────────────────────────────────── */

  return (
    <header className={cn("mb-4 relative", className)}>
      {/* ─────────────────────────────────────────────────────────────────────
       * Back Navigation Link
       * ───────────────────────────────────────────────────────────────────── */}
      <Link
        href={resolvedBackHref}
        data-no-preview="true"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 group font-serif italic"
      >
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        {getBackLinkText(variant, resolvedBackText)}
      </Link>

      {/* ─────────────────────────────────────────────────────────────────────
       * Main Content Container
       * ───────────────────────────────────────────────────────────────────── */}
      <div className="border border-border bg-card text-card-foreground p-6 rounded-sm shadow-sm">
        {/* Title */}
        <h1
          className={cn(
            "font-serif font-medium tracking-tight mb-2 text-center uppercase",
            getTitleClass(variant, title.length)
          )}
        >
          {title}
        </h1>

        {/* Preview/Description */}
        {displayPreview && (
          <p className="text-center font-serif text-sm text-muted-foreground italic mb-6 max-w-2xl mx-auto">
            {displayPreview}
          </p>
        )}

        {/* Date Display */}
        {(date || start_date || end_date) && (
          <div className="text-center mb-4">{renderDate()}</div>
        )}

        {/* ─────────────────────────────────────────────────────────────────────
         * Metadata Section (Status, Confidence, Importance)
         * Hidden when hideStatus is true (e.g., for diary entries)
         * ───────────────────────────────────────────────────────────────────── */}
        {!hideStatus && (
          <div className="flex flex-wrap justify-center items-center gap-x-3 text-sm font-mono mb-6">
            {/* Status */}
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className={cn("flex items-center gap-1 cursor-help", getStatusColor(status))}>
                  <Info className="h-3 w-3" />
                  <span className="font-medium">status: {status}</span>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 text-sm bg-card text-card-foreground border-border p-4 font-serif">
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Status Indicator</h4>
                  <p className="text-muted-foreground whitespace-pre-wrap">{STATUS_EXPLANATION}</p>
                </div>
              </HoverCardContent>
            </HoverCard>

            <span className="text-muted-foreground">·</span>

            {/* Confidence */}
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className={cn("flex items-center gap-1 cursor-help", getConfidenceColor(confidence))}>
                  <Info className="h-3 w-3" />
                  <span className="font-medium">certainty: {confidence}</span>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 text-sm bg-card text-card-foreground border-border p-4 font-serif">
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Confidence Rating</h4>
                  <p className="text-muted-foreground whitespace-pre-wrap">{CONFIDENCE_EXPLANATION}</p>
                </div>
              </HoverCardContent>
            </HoverCard>

            <span className="text-muted-foreground">·</span>

            {/* Importance */}
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className={cn("flex items-center gap-1 cursor-help", getImportanceColor(importance))}>
                  <Info className="h-3 w-3" />
                  <span className="font-medium">importance: {importance}/10</span>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 text-sm bg-card text-card-foreground border-border p-4 font-serif">
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Importance Rating</h4>
                  <p className="text-muted-foreground whitespace-pre-wrap">{IMPORTANCE_EXPLANATION}</p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────────────
         * Post-specific Elements (Tags & Category)
         * ───────────────────────────────────────────────────────────────────── */}
        {variant === "post" && (
          <>
            {/* Tags (max 3) */}
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {tags.slice(0, 3).map((tag) => (
                  <Link
                    key={tag}
                    href={`/tag/${encodeURIComponent(tag.toLowerCase().replace(/\s+/g, "-"))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-border bg-secondary/40 px-2 py-1 text-xs font-mono hover:bg-secondary transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Category "Filed under" link */}
            {category && (
              <div className="text-center mt-4">
                <Link
                  href={categoryHref || `/category/${encodeURIComponent(category.toLowerCase().replace(/\s+/g, "-"))}`}
                  className="text-sm font-serif italic text-muted-foreground hover:text-foreground transition-colors"
                >
                  Filed under: {category}
                </Link>
              </div>
            )}

            {/* Secondary info (e.g., collection) */}
            {secondaryInfo && (
              <div className="text-center mt-2">
                <span className="text-sm font-serif italic text-muted-foreground">
                  {secondaryInfo}
                </span>
              </div>
            )}
          </>
        )}

        {/* Decorative inner border */}
        {variant === "page" && <div className="mt-4 border-b border-border"></div>}
      </div>

      {/* Decorative bottom border */}
      <div className="mt-6 border-b border-border"></div>
    </header>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 * BACKWARDS COMPATIBILITY ALIASES
 * ═══════════════════════════════════════════════════════════════════════════
 * These exports maintain backwards compatibility with existing code that
 * imports PageHeader, PostHeader, or CategoryHeader directly.
 * ═══════════════════════════════════════════════════════════════════════════ */

/** @deprecated Use `<Header variant="page" />` instead */
export const PageHeader = (props: Omit<HeaderProps, "variant">) => (
  <Header {...props} variant="page" />
)

/** @deprecated Use `<Header variant="post" />` instead */
export const PostHeader = (props: Omit<HeaderProps, "variant">) => (
  <Header {...props} variant="post" />
)

/** @deprecated Use `<Header variant="category" />` instead */
export const CategoryHeader = (props: Omit<HeaderProps, "variant">) => (
  <Header {...props} variant="category" />
)

/* ═══════════════════════════════════════════════════════════════════════════
 * TYPE ALIASES FOR BACKWARDS COMPATIBILITY
 * ═══════════════════════════════════════════════════════════════════════════ */

/** @deprecated Use `HeaderProps` instead */
export type PageHeaderProps = Omit<HeaderProps, "variant">

/** @deprecated Use `HeaderProps` instead */
export type PostHeaderProps = Omit<HeaderProps, "variant">

/** @deprecated Use `HeaderProps` instead */
export type CategoryHeaderProps = Omit<HeaderProps, "variant">

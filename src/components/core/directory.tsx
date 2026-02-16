/*
+------------------+----------------------------------------------------------+
| FILE             | directory.tsx                                             |
| ROLE             | Collapsible directory listing component                   |
| OWNER            | Kris Yotam                                               |
| CREATED          | 2026-02-16                                               |
| UPDATED          | 2026-02-16                                               |
+------------------+----------------------------------------------------------+
| @type component                                                             |
| @path src/components/core/directory.tsx                                     |
+------------------+----------------------------------------------------------+
| SUMMARY                                                                     |
| A collapsible directory component for listing content items. Each entry     |
| displays post metadata in a rich header block. When expanded, it embeds    |
| the full post via same-origin iframe in a PDF-like viewer. Uses the        |
| sideways-U structure from collapse.tsx. Intended as a richer alternative   |
| to ContentTable for tag pages, category pages, and similar listing         |
| contexts.                                                                  |
+-----------------------------------------------------------------------------+
*/

"use client"

import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronRight, ChevronUp, ExternalLink } from "lucide-react"
import { formatYMD, formatYMDRange } from "@/lib/date"
import Link from "next/link"

// =============================================================================
// Types
// =============================================================================

export interface DirectoryItem {
  title: string
  subtitle?: string
  start_date: string
  end_date?: string
  slug: string
  tags: string[]
  category: string
  status?: string
  confidence?: string
  importance?: number
  preview?: string
  type?: string
  route?: string
  cover_image?: string
  state?: string
  views?: number
}

export interface DirectoryProps {
  items: DirectoryItem[]
  /** Allow only one entry open at a time (default: false) */
  accordion?: boolean
  /** Height of the iframe viewer in pixels (default: 600) */
  iframeHeight?: number
  /** Show content type badge (default: false) */
  showType?: boolean
  /** External search query for filtering (managed by parent) */
  searchQuery?: string
  /** Additional CSS classes for the outer wrapper */
  className?: string
  /** Custom empty state message */
  emptyMessage?: string
}

// =============================================================================
// Color Utilities (from header.tsx)
// =============================================================================

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

// =============================================================================
// Date Helper
// =============================================================================

function formatItemDate(startDate?: string, endDate?: string): string {
  if (!startDate) return ""
  const effectiveEnd = endDate?.trim() || undefined
  if (effectiveEnd) {
    return formatYMDRange(startDate, effectiveEnd)
  }
  return formatYMD(startDate)
}

// =============================================================================
// Directory Entry
// =============================================================================

interface DirectoryEntryProps {
  item: DirectoryItem
  index: number
  showType: boolean
  iframeHeight: number
  accordion: boolean
  isOpenAccordion?: boolean
  onToggleAccordion?: () => void
}

function DirectoryEntry({
  item,
  index,
  showType,
  iframeHeight,
  accordion,
  isOpenAccordion,
  onToggleAccordion,
}: DirectoryEntryProps) {
  const [localOpen, setLocalOpen] = useState(false)

  const isOpen = accordion ? (isOpenAccordion ?? false) : localOpen
  const toggle = accordion ? (onToggleAccordion ?? (() => {})) : () => setLocalOpen(!localOpen)

  const itemUrl = `/${item.slug}`
  const dateDisplay = formatItemDate(item.start_date, item.end_date)

  // ── Collapsed: thick card with side bar, full metadata ──────────────
  if (!isOpen) {
    return (
      <div className="border-b border-border">
        <div className="flex">
          {/* Left accent bar */}
          <div className="w-1.5 bg-muted flex-shrink-0" />

          {/* Main content */}
          <div
            role="button"
            tabIndex={0}
            className={cn(
              "flex-1 cursor-pointer select-none px-4 py-4",
              "transition-colors hover:bg-muted/40",
              index % 2 === 0 ? "bg-transparent" : "bg-muted/5"
            )}
            onClick={toggle}
            onKeyDown={(e) => e.key === "Enter" && toggle()}
          >
            {/* Row 1: chevron + title + type badge + date */}
            <div className="flex items-center gap-2.5 mb-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 transition-transform duration-150" />
              <span className="font-serif text-sm font-medium truncate">
                {item.title}
              </span>
              {showType && item.type && (
                <span className="text-[10px] font-mono text-muted-foreground border border-border px-1.5 py-0.5 flex-shrink-0 uppercase tracking-wide">
                  {item.type}
                </span>
              )}
              <span className="flex-1" />
              {dateDisplay && (
                <span className="text-[11px] font-mono text-muted-foreground whitespace-nowrap flex-shrink-0">
                  {dateDisplay}
                </span>
              )}
            </div>

            {/* Row 2: metadata — status · certainty · importance */}
            <div className="flex items-center gap-2 ml-6 text-[11px] font-mono">
              {item.status && (
                <span className={getStatusColor(item.status)}>
                  status: {item.status}
                </span>
              )}
              {item.status && item.confidence && (
                <span className="text-muted-foreground">·</span>
              )}
              {item.confidence && (
                <span className={getConfidenceColor(item.confidence)}>
                  certainty: {item.confidence}
                </span>
              )}
              {(item.status || item.confidence) && item.importance !== undefined && (
                <span className="text-muted-foreground">·</span>
              )}
              {item.importance !== undefined && (
                <span className={getImportanceColor(item.importance)}>
                  importance: {item.importance}/10
                </span>
              )}
            </div>

            {/* Row 3: preview/description */}
            {item.preview && (
              <p className="text-xs font-serif italic text-muted-foreground mt-1.5 ml-6 line-clamp-1">
                {item.preview}
              </p>
            )}

            {/* Row 4: tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex items-center gap-1.5 mt-1.5 ml-6 flex-wrap">
                {item.tags.slice(0, 5).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono text-muted-foreground bg-muted/60 px-1.5 py-0.5"
                  >
                    {tag}
                  </span>
                ))}
                {item.tags.length > 5 && (
                  <span className="text-[10px] font-mono text-muted-foreground">
                    +{item.tags.length - 5}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Right accent bar */}
          <div className="w-1.5 bg-muted flex-shrink-0" />
        </div>
      </div>
    )
  }

  // ── Expanded: sideways-U with slim top bar ──────────────────────────
  return (
    <div className="border-b border-border">
      {/* Top bar — slim, labeled metadata */}
      <div
        role="button"
        tabIndex={0}
        className="flex items-center gap-3 w-full cursor-pointer select-none bg-muted px-4 py-3 transition-colors hover:bg-muted/80"
        onClick={toggle}
        onKeyDown={(e) => e.key === "Enter" && toggle()}
      >
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 rotate-90 transition-transform duration-150" />

        <span className="font-serif text-sm font-medium truncate min-w-0 max-w-[35%]">
          {item.title}
        </span>

        {/* Labeled metadata cluster */}
        <span className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono flex-shrink-0">
          {item.status && (
            <span className={getStatusColor(item.status)}>status: {item.status}</span>
          )}
          {item.status && item.confidence && (
            <span className="text-muted-foreground">·</span>
          )}
          {item.confidence && (
            <span className={getConfidenceColor(item.confidence)}>certainty: {item.confidence}</span>
          )}
          {(item.status || item.confidence) && item.importance !== undefined && (
            <span className="text-muted-foreground">·</span>
          )}
          {item.importance !== undefined && (
            <span className={getImportanceColor(item.importance)}>importance: {item.importance}/10</span>
          )}
        </span>

        {showType && item.type && (
          <span className="hidden md:inline-block text-[10px] font-mono text-muted-foreground border border-border px-1.5 py-0.5 flex-shrink-0 uppercase tracking-wide">
            {item.type}
          </span>
        )}

        <span className="flex-1" />

        {/* External link */}
        <Link
          href={itemUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors z-10"
          onClick={(e) => e.stopPropagation()}
          aria-label={`Open ${item.title} in new tab`}
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {dateDisplay && (
          <span className="text-[11px] font-mono text-muted-foreground whitespace-nowrap flex-shrink-0 ml-1">
            {dateDisplay}
          </span>
        )}
      </div>

      {/* Content area with left accent strip */}
      <div className="flex">
        <div className="w-2 bg-muted flex-shrink-0" />
        <div className="flex-1 p-4">
          {item.preview && (
            <p className="text-xs font-serif italic text-muted-foreground mb-3 line-clamp-2">
              {item.preview}
            </p>
          )}
          <div className="border border-border bg-background shadow-sm overflow-hidden">
            <iframe
              src={itemUrl}
              title={item.title}
              className="w-full border-0"
              style={{ height: `${iframeHeight}px` }}
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        role="button"
        tabIndex={0}
        className="flex items-center justify-center bg-muted py-2.5 cursor-pointer select-none transition-colors hover:bg-muted/80"
        onClick={toggle}
        onKeyDown={(e) => e.key === "Enter" && toggle()}
      >
        <ChevronUp className="w-4 h-4 text-muted-foreground" />
      </div>
    </div>
  )
}

// =============================================================================
// Directory Component
// =============================================================================

export function Directory({
  items,
  accordion = false,
  iframeHeight = 800,
  showType = false,
  searchQuery = "",
  className,
  emptyMessage = "No items found.",
}: DirectoryProps) {
  const [openIndex, setOpenIndex] = useState<number>(-1)

  const filteredItems = items.filter((item) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      item.title.toLowerCase().includes(q) ||
      item.tags.some((t) => t.toLowerCase().includes(q)) ||
      item.category.toLowerCase().includes(q) ||
      (item.preview && item.preview.toLowerCase().includes(q)) ||
      (item.type && item.type.toLowerCase().includes(q))
    )
  })

  return (
    <div className={className}>
      {filteredItems.length === 0 ? (
        <p className="text-center py-10 text-sm text-muted-foreground border-x border-b border-border">
          {emptyMessage}
        </p>
      ) : (
        <div className="border-t-0">
          {filteredItems.map((item, index) => (
            <DirectoryEntry
              key={`${item.slug}-${index}`}
              item={item}
              index={index}
              showType={showType}
              iframeHeight={iframeHeight}
              accordion={accordion}
              isOpenAccordion={accordion ? openIndex === index : undefined}
              onToggleAccordion={
                accordion
                  ? () => setOpenIndex(openIndex === index ? -1 : index)
                  : undefined
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Directory

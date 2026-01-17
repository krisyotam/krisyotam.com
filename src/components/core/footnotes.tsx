"use client"
/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                             FOOTNOTES.TSX                                 ║
 * ║                      Collapsible Footnotes Section                        ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║  @author   Kris Yotam                                                     ║
 * ║  @date     2026-01-02                                                     ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║                                                                           ║
 * ║  Collapsible footnotes section with styled number badges.                 ║
 * ║                                                                           ║
 * ║  Features:                                                                ║
 * ║  • Horizontal rule with centered box at top                               ║
 * ║  • Boxed numbers with dotted borders on left                              ║
 * ║  • Back-to-citation arrows (↑) with hover effects                         ║
 * ║  • Collapsible list (shows 3 by default)                                  ║
 * ║  • Smooth scroll to citation on backref click                             ║
 * ║                                                                           ║
 * ║  Based on: gwern.net/static/css/default.css                               ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════ */

interface Footnote {
  id: string
  number: number
  content: string
  backrefId: string
}

interface FootnotesProps {
  containerSelector?: string
  className?: string
}

/* ═══════════════════════════════════════════════════════════════════════════
   CONFIGURATION
   ═══════════════════════════════════════════════════════════════════════════ */

const CONFIG = {
  parseDelay: 300,
  defaultVisibleCount: 3,
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

export function Footnotes({ containerSelector = "#content, article, main", className }: FootnotesProps) {
  const [footnotes, setFootnotes] = useState<Footnote[]>([])
  const [ready, setReady] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  // ─── Parse footnotes from DOM ─────────────────────────────────────────────
  const parseFootnotes = useCallback(() => {
    const container = document.querySelector(containerSelector) as HTMLElement
    if (!container) return []

    const footnoteSection = container.querySelector(
      "section[data-footnotes], .footnotes, section.footnotes"
    ) as HTMLElement
    if (!footnoteSection) return []

    const footnoteList = footnoteSection.querySelector("ol")
    if (!footnoteList) return []

    const items = footnoteList.querySelectorAll(":scope > li")
    const parsed: Footnote[] = []

    items.forEach((item, index) => {
      const number = index + 1
      const id = item.id || `fn-${number}`

      // Find backref link
      const backrefLink = item.querySelector("a[href*='fnref'], a[data-footnote-backref]") as HTMLAnchorElement
      const backrefId = backrefLink?.getAttribute("href")?.replace("#", "") || `fnref-${number}`

      // Clone and clean content (remove backref links)
      const clone = item.cloneNode(true) as HTMLElement
      clone.querySelectorAll("a[href*='fnref'], .footnote-backref, a[data-footnote-backref]")
        .forEach(link => link.remove())

      parsed.push({
        id,
        number,
        content: clone.innerHTML,
        backrefId,
      })
    })

    return parsed
  }, [containerSelector])

  // ─── Initialize ───────────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      const parsed = parseFootnotes()
      setFootnotes(parsed)
      setReady(true)

      // Hide original footnotes section
      const container = document.querySelector(containerSelector) as HTMLElement
      if (container) {
        const section = container.querySelector(
          "section[data-footnotes], .footnotes, section.footnotes"
        ) as HTMLElement
        if (section) section.style.display = "none"
      }
    }, CONFIG.parseDelay)

    return () => clearTimeout(timer)
  }, [parseFootnotes, containerSelector])

  // ─── Back to citation click handler ───────────────────────────────────────
  const handleBackrefClick = useCallback((e: React.MouseEvent, backrefId: string) => {
    e.preventDefault()
    const citation = document.getElementById(backrefId)
    if (citation) {
      citation.scrollIntoView({ behavior: "smooth", block: "center" })
      // Highlight the citation briefly
      citation.classList.add("footnote-citation-highlight")
      setTimeout(() => citation.classList.remove("footnote-citation-highlight"), 2000)
    }
  }, [])

  // ─── Footnote hover handlers ──────────────────────────────────────────────
  const handleFootnoteEnter = (id: string) => setActiveId(id)
  const handleFootnoteLeave = () => setActiveId(null)

  // ─── Early return ─────────────────────────────────────────────────────────
  if (!ready || footnotes.length === 0) return null

  /* ═════════════════════════════════════════════════════════════════════════
     RENDER
     ═════════════════════════════════════════════════════════════════════════ */

  const visibleFootnotes = isExpanded
    ? footnotes
    : footnotes.slice(0, CONFIG.defaultVisibleCount)
  const hasMore = footnotes.length > CONFIG.defaultVisibleCount
  const hiddenCount = footnotes.length - CONFIG.defaultVisibleCount

  return (
    <section
      className={cn("footnotes-section relative mt-12", className)}
      aria-label="Footnotes"
    >
      {/* ─── Horizontal Rule with Centered Box ─────────────────────────────── */}
      <div className="footnotes-divider relative flex justify-center items-center h-8 mb-6">
        {/* Line */}
        <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
        {/* Centered Box */}
        <div
          className={cn(
            "relative z-10 w-8 h-8",
            "border border-border bg-background",
            "flex items-center justify-center"
          )}
          style={{
            boxShadow: `
              inset 0 0 0 3px hsl(var(--background)),
              inset 0 0 0 4px hsl(var(--border))
            `
          }}
        />
      </div>

      {/* ─── Footnotes List ────────────────────────────────────────────────── */}
      <ol className="footnotes-list list-none m-0 p-0 pl-10 space-y-4">
        {visibleFootnotes.map((footnote) => {
          const isActive = activeId === footnote.id

          return (
            <li
              key={footnote.id}
              id={footnote.id}
              className={cn(
                "footnote-item relative",
                "min-h-[2rem] py-1.5",
                "transition-colors duration-150"
              )}
              onMouseEnter={() => handleFootnoteEnter(footnote.id)}
              onMouseLeave={handleFootnoteLeave}
            >
              {/* ─── Number Badge ──────────────────────────────────────────── */}
              <span
                className={cn(
                  "footnote-number",
                  "absolute right-full mr-3",
                  "w-7 h-7 flex items-center justify-center",
                  "text-sm font-medium tabular-nums",
                  "border border-dotted",
                  "transition-all duration-150",
                  isActive
                    ? "border-foreground border-solid shadow-[inset_0_0_0_1px_hsl(var(--background)),inset_0_0_0_2px_hsl(var(--foreground))]"
                    : "border-muted-foreground/50 border-r-transparent"
                )}
                style={{ top: "calc(-0.125em + 5px)" }}
              >
                {footnote.number}
              </span>

              {/* ─── Content ───────────────────────────────────────────────── */}
              <div
                className="footnote-content prose prose-sm dark:prose-invert max-w-none inline"
                dangerouslySetInnerHTML={{ __html: footnote.content }}
              />

              {/* ─── Back to Citation Link ─────────────────────────────────── */}
              <a
                href={`#${footnote.backrefId}`}
                onClick={(e) => handleBackrefClick(e, footnote.backrefId)}
                className={cn(
                  "footnote-backref",
                  "inline-flex items-center justify-center",
                  "ml-2 px-1.5 py-0.5",
                  "text-sm leading-none",
                  "border border-dotted border-foreground",
                  "hover:border-solid hover:shadow-[inset_0_0_0_1px_hsl(var(--background)),inset_0_0_0_2px_hsl(var(--foreground))]",
                  "transition-all duration-150"
                )}
                title="Back to citation"
                aria-label={`Back to citation ${footnote.number}`}
              >
                ↑
              </a>
            </li>
          )
        })}
      </ol>

      {/* ─── Expand/Collapse Button ────────────────────────────────────────── */}
      {hasMore && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "mt-4 ml-10",
            "text-sm text-muted-foreground hover:text-foreground",
            "transition-colors duration-150"
          )}
        >
          {isExpanded
            ? "Show less"
            : `Show ${hiddenCount} more footnote${hiddenCount > 1 ? "s" : ""}`}
        </button>
      )}
    </section>
  )
}

export default Footnotes

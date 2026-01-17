"use client"
/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                             SIDENOTES.TSX                                 ║
 * ║                    Margin Sidenotes for Wide Viewports                    ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║  @author   Kris Yotam                                                     ║
 * ║  @date     2026-01-02                                                     ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║                                                                           ║
 * ║  Transforms footnotes into margin sidenotes on wide viewports.            ║
 * ║                                                                           ║
 * ║  Features:                                                                ║
 * ║  • Dotted top/bottom borders on sidenote content                          ║
 * ║  • Boxed number badge with connecting line on hover                       ║
 * ║  • Bidirectional highlighting (citation ↔ sidenote)                       ║
 * ║  • Smart positioning to avoid overlaps                                    ║
 * ║  • Responsive: sidenotes on desktop, footnotes on mobile                  ║
 * ║  • User-configurable via settings menu (default: off)                     ║
 * ║                                                                           ║
 * ║  Based on: gwern.net/static/css/default.css                               ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { useState, useEffect, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"

/* ═══════════════════════════════════════════════════════════════════════════
   CONFIGURATION
   ═══════════════════════════════════════════════════════════════════════════ */

const CONFIG = {
  minWidth: 1200,
  sidenoteSpacing: 60,
  maxHeight: 500,
  contentWidth: 672,     // Match your content max-width
  gapFromContent: 16,    // Small aesthetic gap from content
  headerOffset: 380,     // Start sidenotes below the header bottom
}

const STORAGE_KEY = "settings_sidenotesEnabled"

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════ */

interface Sidenote {
  id: string
  number: number
  content: string
  citationElement: HTMLElement | null
}

interface SidenotesProps {
  containerSelector?: string
  enabled?: boolean
}

/* ═══════════════════════════════════════════════════════════════════════════
   UTILITIES
   ═══════════════════════════════════════════════════════════════════════════ */

const sidenoteId = (num: number) => `sn-${num}`

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

export function Sidenotes({ containerSelector = "#content, article, main", enabled = true }: SidenotesProps) {
  const [sidenotes, setSidenotes] = useState<Sidenote[]>([])
  const [isWideViewport, setIsWideViewport] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const [userEnabled, setUserEnabled] = useState(false) // Default OFF

  const columnRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLElement | null>(null)

  // ─── Load User Setting ────────────────────────────────────────────────────
  useEffect(() => {
    // Load from localStorage (default: off)
    const stored = localStorage.getItem(STORAGE_KEY)
    setUserEnabled(stored === "true")

    // Listen for settings changes from the settings menu
    const handleSettingChange = (e: CustomEvent<{ enabled: boolean }>) => {
      setUserEnabled(e.detail.enabled)
    }

    window.addEventListener("sidenotesSettingChanged", handleSettingChange as EventListener)
    return () => {
      window.removeEventListener("sidenotesSettingChanged", handleSettingChange as EventListener)
    }
  }, [])

  // ─── Viewport Detection ────────────────────────────────────────────────────
  useEffect(() => {
    const checkWidth = () => setIsWideViewport(window.innerWidth >= CONFIG.minWidth)
    checkWidth()
    window.addEventListener("resize", checkWidth)
    return () => window.removeEventListener("resize", checkWidth)
  }, [])

  // ─── Parse Footnotes ───────────────────────────────────────────────────────
  const parseFootnotes = useCallback(() => {
    const container = document.querySelector(containerSelector) as HTMLElement
    if (!container) return []
    containerRef.current = container

    const footnoteSection = container.querySelector(
      "section[data-footnotes], .footnotes, section.footnotes"
    )
    if (!footnoteSection) return []

    const footnoteList = footnoteSection.querySelector("ol")
    if (!footnoteList) return []

    const items = footnoteList.querySelectorAll(":scope > li")
    const parsed: Sidenote[] = []

    items.forEach((item, index) => {
      const number = index + 1

      // Find citation element
      const citationSelectors = [
        `sup[id="user-content-fnref-${number}"]`,
        `a[href="#user-content-fn-${number}"]`,
        `sup[id*="fnref-${number}"]`,
        `sup[id*="fnref${number}"]`,
      ]
      let citation: HTMLElement | null = null
      for (const sel of citationSelectors) {
        citation = container.querySelector(sel) as HTMLElement
        if (citation) break
      }

      // Clone and clean content
      const clone = item.cloneNode(true) as HTMLElement
      clone.querySelectorAll("a[href*='fnref'], .footnote-backref, a[data-footnote-backref]")
        .forEach(link => link.remove())

      parsed.push({
        id: sidenoteId(number),
        number,
        content: clone.innerHTML,
        citationElement: citation,
      })
    })

    return parsed
  }, [containerSelector])

  // ─── Initialize ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!enabled || !userEnabled) return
    const timer = setTimeout(() => {
      setSidenotes(parseFootnotes())
      setReady(true)
    }, 300)
    return () => clearTimeout(timer)
  }, [enabled, userEnabled, parseFootnotes])

  // ─── Hide original footnotes ───────────────────────────────────────────────
  useEffect(() => {
    if (!ready || !containerRef.current) return
    const section = containerRef.current.querySelector(
      "section[data-footnotes], .footnotes"
    ) as HTMLElement
    if (section) section.style.display = isWideViewport ? "none" : ""
    return () => { if (section) section.style.display = "" }
  }, [ready, isWideViewport])

  // ─── Click handler ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!ready || !isWideViewport) return

    const handleClick = (e: MouseEvent) => {
      const target = e.target
      if (!(target instanceof Element)) return

      const link = target.closest("a[href*='fn'], a[data-footnote-ref]") as HTMLAnchorElement
      if (!link) return

      const href = link.getAttribute("href") || ""
      const match = href.match(/(\d+)$/)
      if (!match) return

      e.preventDefault()
      const num = parseInt(match[1], 10)
      const id = sidenoteId(num)

      setActiveId(id)
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" })
      setTimeout(() => setActiveId(null), 2000)
    }

    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [ready, isWideViewport])

  // ─── Hover handlers ────────────────────────────────────────────────────────
  const handleSidenoteEnter = (note: Sidenote) => {
    setActiveId(note.id)
    note.citationElement?.classList.add("sidenote-citation-active")
  }

  const handleSidenoteLeave = (note: Sidenote) => {
    setActiveId(null)
    note.citationElement?.classList.remove("sidenote-citation-active")
  }

  const scrollToCitation = (note: Sidenote) => {
    note.citationElement?.scrollIntoView({ behavior: "smooth", block: "center" })
    setActiveId(note.id)
    setTimeout(() => setActiveId(null), 2000)
  }

  // ─── Early return ──────────────────────────────────────────────────────────
  if (!enabled || !userEnabled || !ready || !isWideViewport || sidenotes.length === 0) return null

  /* ═════════════════════════════════════════════════════════════════════════
     RENDER
     ═════════════════════════════════════════════════════════════════════════ */

  return (
    <div
      ref={columnRef}
      className="sidenote-column fixed pointer-events-auto z-10 overflow-y-auto overflow-x-hidden"
      style={{
        // Position: start right after content ends + small gap
        left: `calc(50% + ${CONFIG.contentWidth / 2}px + ${CONFIG.gapFromContent}px)`,
        // Start below header
        top: CONFIG.headerOffset,
        // Height: from header to bottom
        height: `calc(100vh - ${CONFIG.headerOffset}px)`,
        // Width: fill remaining space minus some padding from viewport edge
        width: `calc((100vw - ${CONFIG.contentWidth}px) / 2 - ${CONFIG.gapFromContent}px - 24px)`,
        maxWidth: "380px",
        paddingTop: "1rem",
        paddingBottom: "4rem",
      }}
    >
      {sidenotes.map((note) => {
        const isActive = activeId === note.id

        return (
          <div
            key={note.id}
            id={note.id}
            className={cn(
              "sidenote relative w-full pt-7",
              "transition-opacity duration-200",
              isActive ? "opacity-100 z-20" : "opacity-85 hover:opacity-100"
            )}
            style={{ marginBottom: CONFIG.sidenoteSpacing }}
            onMouseEnter={() => handleSidenoteEnter(note)}
            onMouseLeave={() => handleSidenoteLeave(note)}
          >
            {/* Number badge - sits ABOVE the content, overlapping top border */}
            <a
              href={`#user-content-fnref-${note.number}`}
              onClick={(e) => { e.preventDefault(); scrollToCitation(note) }}
              className={cn(
                "sidenote-number",
                "absolute top-0 left-0 z-10",
                "w-7 h-7 flex items-center justify-center",
                "text-sm font-semibold",
                "border border-dotted border-b-0",
                "transition-all duration-150",
                isActive
                  ? "border-foreground"
                  : "border-muted-foreground/50 hover:border-foreground"
              )}
              style={{ backgroundColor: "hsl(var(--background))" }}
            >
              {note.number}
            </a>

            {/* Content wrapper with top/bottom borders */}
            <div
              className={cn(
                "sidenote-content-wrapper",
                "border-y border-dotted",
                "transition-all duration-150",
                isActive ? "border-foreground" : "border-muted-foreground/40"
              )}
              style={{ maxHeight: CONFIG.maxHeight, overflowY: "auto" }}
            >
              {/* Inner content */}
              <div
                className="sidenote-content py-3 px-2 text-sm leading-relaxed"
                style={{ fontSize: "0.85em", lineHeight: "1.5" }}
                dangerouslySetInnerHTML={{ __html: note.content }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Sidenotes

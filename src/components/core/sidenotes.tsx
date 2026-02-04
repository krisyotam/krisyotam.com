"use client"
/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                             SIDENOTES.TSX                                 ║
 * ║                    Margin Sidenotes for Wide Viewports                    ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║  @author   Kris Yotam                                                     ║
 * ║  @date     2026-01-02                                                     ║
 * ║  @updated  2026-02-03                                                     ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║                                                                           ║
 * ║  Transforms footnotes into margin sidenotes on wide viewports.            ║
 * ║                                                                           ║
 * ║  Features:                                                                ║
 * ║  • Double border (3px double) on hover - Gwern's "2-lined" aesthetic      ║
 * ║  • Dotted top/bottom borders on content wrapper                           ║
 * ║  • Boxed number badge with connecting line on hover                       ║
 * ║  • Bidirectional highlighting (citation ↔ sidenote)                       ║
 * ║  • Smart positioning aligned with citations                               ║
 * ║  • Collision detection to avoid overlaps                                  ║
 * ║  • Support for both left and right columns                                ║
 * ║  • Responsive: sidenotes on desktop, footnotes on mobile                  ║
 * ║                                                                           ║
 * ║  Based on: gwern.net/static/js/sidenotes.js & css/default.css             ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { useState, useEffect, useRef, useCallback } from "react"

/* ═══════════════════════════════════════════════════════════════════════════
   CONFIGURATION
   ═══════════════════════════════════════════════════════════════════════════ */

const CONFIG = {
  // Minimum viewport width for sidenotes (px)
  minWidth: 1400,

  // Minimum vertical spacing between sidenotes (px)
  sidenoteSpacing: 60,

  // Padding around sidenotes (px)
  sidenotePadding: 10,

  // Border width for highlight state (px)
  sidenoteBorderWidth: 3,

  // Maximum height before sidenote becomes scrollable (px)
  maxHeight: 600,

  // Gap from content edge to sidenote column (px)
  gapFromContent: 64,

  // Maximum width of sidenote column (px)
  maxSidenoteWidth: 380,

  // Which columns to use
  useLeftColumn: false,
  useRightColumn: true,
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

interface PositionedSidenote extends Sidenote {
  top: number
  column: "left" | "right"
  height: number
  isCutOff: boolean
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
  const [sidenotes, setSidenotes] = useState<PositionedSidenote[]>([])
  const [isWideViewport, setIsWideViewport] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const [userEnabled, setUserEnabled] = useState(true)

  const leftColumnRef = useRef<HTMLDivElement>(null)
  const rightColumnRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLElement | null>(null)
  const markdownBodyRef = useRef<HTMLElement | null>(null)

  // ─── Load User Setting ────────────────────────────────────────────────────
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored !== null) {
      setUserEnabled(stored === "true")
    }

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
  const parseFootnotes = useCallback((): Sidenote[] => {
    const container = document.querySelector(containerSelector) as HTMLElement
    if (!container) return []
    containerRef.current = container

    // Find the markdown body (for positioning reference)
    markdownBodyRef.current = container.closest("article") || container

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

  // ─── Calculate Sidenote Positions ──────────────────────────────────────────
  const calculatePositions = useCallback((parsedSidenotes: Sidenote[]): PositionedSidenote[] => {
    if (!markdownBodyRef.current) return []

    const bodyRect = markdownBodyRef.current.getBoundingClientRect()
    const positioned: PositionedSidenote[] = []

    // Track occupied ranges for each column
    const occupiedLeft: { top: number; bottom: number }[] = []
    const occupiedRight: { top: number; bottom: number }[] = []

    parsedSidenotes.forEach((note, index) => {
      // Determine which column (odd = right, even = left when both enabled)
      let column: "left" | "right" = "right"
      if (CONFIG.useLeftColumn && CONFIG.useRightColumn) {
        column = note.number % 2 === 0 ? "left" : "right"
      } else if (CONFIG.useLeftColumn) {
        column = "left"
      }

      const occupied = column === "left" ? occupiedLeft : occupiedRight

      // Calculate ideal top position (aligned with citation)
      let idealTop = 0
      if (note.citationElement) {
        const citationRect = note.citationElement.getBoundingClientRect()
        idealTop = citationRect.top - bodyRect.top + 4
      }

      // Estimate height (will be refined after render)
      const estimatedHeight = 100

      // Find non-overlapping position
      let finalTop = Math.max(0, idealTop)

      // Check for collisions and push down if needed
      for (const range of occupied) {
        if (finalTop < range.bottom && finalTop + estimatedHeight + CONFIG.sidenoteSpacing > range.top) {
          finalTop = range.bottom + CONFIG.sidenoteSpacing
        }
      }

      // Add to occupied ranges
      occupied.push({
        top: finalTop,
        bottom: finalTop + estimatedHeight + CONFIG.sidenoteSpacing,
      })

      positioned.push({
        ...note,
        top: finalTop,
        column,
        height: estimatedHeight,
        isCutOff: false,
      })
    })

    return positioned
  }, [])

  // ─── Recalculate Positions After Render ────────────────────────────────────
  const recalculatePositions = useCallback(() => {
    if (!markdownBodyRef.current || sidenotes.length === 0) return

    const bodyRect = markdownBodyRef.current.getBoundingClientRect()
    const occupiedLeft: { top: number; bottom: number }[] = []
    const occupiedRight: { top: number; bottom: number }[] = []

    const newPositions = sidenotes.map((note) => {
      const occupied = note.column === "left" ? occupiedLeft : occupiedRight
      const sidenoteEl = document.getElementById(note.id)
      const actualHeight = sidenoteEl?.offsetHeight || note.height

      // Calculate ideal top position (aligned with citation)
      let idealTop = 0
      if (note.citationElement) {
        const citationRect = note.citationElement.getBoundingClientRect()
        idealTop = citationRect.top - bodyRect.top + 4
      }

      // Find non-overlapping position
      let finalTop = Math.max(0, idealTop)

      for (const range of occupied) {
        if (finalTop < range.bottom && finalTop + actualHeight + CONFIG.sidenoteSpacing > range.top) {
          finalTop = range.bottom + CONFIG.sidenoteSpacing
        }
      }

      occupied.push({
        top: finalTop,
        bottom: finalTop + actualHeight + CONFIG.sidenoteSpacing,
      })

      // Check if content is cut off
      const outerWrapper = sidenoteEl?.querySelector(".sidenote-outer-wrapper") as HTMLElement
      const isCutOff = outerWrapper ? outerWrapper.scrollHeight > outerWrapper.offsetHeight + 2 : false

      return {
        ...note,
        top: finalTop,
        height: actualHeight,
        isCutOff,
      }
    })

    setSidenotes(newPositions)
  }, [sidenotes])

  // ─── Initialize ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!enabled || !userEnabled) return

    const timer = setTimeout(() => {
      const parsed = parseFootnotes()
      const positioned = calculatePositions(parsed)
      setSidenotes(positioned)
      setReady(true)
    }, 300)

    return () => clearTimeout(timer)
  }, [enabled, userEnabled, parseFootnotes, calculatePositions])

  // ─── Recalculate on resize ─────────────────────────────────────────────────
  useEffect(() => {
    if (!ready) return

    const handleResize = () => {
      requestAnimationFrame(recalculatePositions)
    }

    window.addEventListener("resize", handleResize)

    // Initial recalculation after render
    const timer = setTimeout(recalculatePositions, 100)

    return () => {
      window.removeEventListener("resize", handleResize)
      clearTimeout(timer)
    }
  }, [ready, recalculatePositions])

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
  const handleSidenoteEnter = (note: PositionedSidenote) => {
    setActiveId(note.id)
    note.citationElement?.classList.add("sidenote-citation-active")
  }

  const handleSidenoteLeave = (note: PositionedSidenote) => {
    setActiveId(null)
    note.citationElement?.classList.remove("sidenote-citation-active")
  }

  const scrollToCitation = (note: PositionedSidenote) => {
    note.citationElement?.scrollIntoView({ behavior: "smooth", block: "center" })
    setActiveId(note.id)
    setTimeout(() => setActiveId(null), 2000)
  }

  // ─── Early return ──────────────────────────────────────────────────────────
  if (!enabled || !userEnabled || !ready || !isWideViewport || sidenotes.length === 0) return null

  const leftSidenotes = sidenotes.filter(n => n.column === "left")
  const rightSidenotes = sidenotes.filter(n => n.column === "right")

  /* ═════════════════════════════════════════════════════════════════════════
     RENDER
     ═════════════════════════════════════════════════════════════════════════ */

  const renderSidenote = (note: PositionedSidenote) => {
    const isActive = activeId === note.id
    const isHighlighted = isActive

    return (
      <div
        key={note.id}
        id={note.id}
        className={`sidenote ${isActive ? "targeted" : ""} ${isHighlighted ? "highlighted" : ""} ${note.isCutOff ? "cut-off" : ""}`}
        style={{ top: note.top }}
        onMouseEnter={() => handleSidenoteEnter(note)}
        onMouseLeave={() => handleSidenoteLeave(note)}
      >
        {/* Number badge - sidenote-self-link */}
        <a
          href={`#user-content-fnref-${note.number}`}
          onClick={(e) => { e.preventDefault(); scrollToCitation(note) }}
          className="sidenote-self-link"
        >
          {note.number}
        </a>

        {/* Outer wrapper with dotted borders */}
        <div className="sidenote-outer-wrapper">
          {/* Inner wrapper with content */}
          <div
            className="sidenote-inner-wrapper"
            dangerouslySetInnerHTML={{ __html: note.content }}
          />
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Left Column */}
      {CONFIG.useLeftColumn && (
        <div
          ref={leftColumnRef}
          id="sidenote-column-left"
          className="sidenote-column"
        >
          {leftSidenotes.map(renderSidenote)}
        </div>
      )}

      {/* Right Column */}
      {CONFIG.useRightColumn && (
        <div
          ref={rightColumnRef}
          id="sidenote-column-right"
          className="sidenote-column"
        >
          {rightSidenotes.map(renderSidenote)}
        </div>
      )}
    </>
  )
}

export default Sidenotes

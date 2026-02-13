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
  gapFromContent: 16,

  // Maximum width of sidenote column (px)
  maxSidenoteWidth: 380,

  // Minimum top offset - small buffer at top of content area (px)
  minTopOffset: 20,

  // Which columns to use (alternating: odd=right, even=left)
  useLeftColumn: true,
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
  const [userEnabled, setUserEnabled] = useState(false) // Default OFF until positioning is fixed
  const [columnPositions, setColumnPositions] = useState<{ left: number; right: number; topOffset: number } | null>(null)

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

  // ─── Calculate Column Positions ───────────────────────────────────────────
  const calculateColumnPositions = useCallback(() => {
    if (!markdownBodyRef.current) return

    const contentRect = markdownBodyRef.current.getBoundingClientRect()
    const columnWidth = Math.min(
      (window.innerWidth - contentRect.width) / 2 - 48,
      CONFIG.maxSidenoteWidth
    )

    // Find the positioned ancestor (element with position: relative/absolute/fixed)
    // The sidenote columns will be positioned relative to this ancestor
    let positionedAncestor: HTMLElement | null = markdownBodyRef.current.parentElement
    while (positionedAncestor && positionedAncestor !== document.body) {
      const style = window.getComputedStyle(positionedAncestor)
      if (style.position !== 'static') break
      positionedAncestor = positionedAncestor.parentElement
    }

    // Calculate offset relative to the positioned ancestor (not document)
    const ancestorRect = positionedAncestor?.getBoundingClientRect() || { top: 0, left: 0 }
    const topOffset = contentRect.top - ancestorRect.top

    // Left column: ends just before content starts
    // Right column: starts just after content ends
    setColumnPositions({
      left: contentRect.left - columnWidth - CONFIG.gapFromContent,
      right: contentRect.right + CONFIG.gapFromContent,
      topOffset,
    })
  }, [])

  // ─── Update Column Positions on Resize ────────────────────────────────────
  useEffect(() => {
    if (!ready || !isWideViewport) return

    calculateColumnPositions()
    window.addEventListener("resize", calculateColumnPositions)
    return () => window.removeEventListener("resize", calculateColumnPositions)
  }, [ready, isWideViewport, calculateColumnPositions])

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

  // ─── Calculate Sidenote Positions (Initial layout with estimated heights) ──
  const calculatePositions = useCallback((parsedSidenotes: Sidenote[]): PositionedSidenote[] => {
    if (!markdownBodyRef.current) return []

    const body = markdownBodyRef.current
    const bodyTop = body.offsetTop
    const estimatedHeight = 100

    // Helper: get citation's absolute position (scroll-independent)
    const getCitationTop = (citationEl: HTMLElement): number => {
      let top = 0
      let el: HTMLElement | null = citationEl
      while (el && el !== document.body) {
        top += el.offsetTop
        el = el.offsetParent as HTMLElement | null
      }
      return top - bodyTop
    }

    // Step 1: Assign columns and calculate ideal positions
    const leftNotes: (Sidenote & { column: "left"; posInCell: number })[] = []
    const rightNotes: (Sidenote & { column: "right"; posInCell: number })[] = []

    parsedSidenotes.forEach((note) => {
      // Determine which column (odd = right, even = left when both enabled)
      let column: "left" | "right" = "right"
      if (CONFIG.useLeftColumn && CONFIG.useRightColumn) {
        column = note.number % 2 === 0 ? "left" : "right"
      } else if (CONFIG.useLeftColumn) {
        column = "left"
      }

      // Calculate ideal top position (aligned with citation)
      let idealTop = CONFIG.minTopOffset
      if (note.citationElement) {
        idealTop = Math.max(CONFIG.minTopOffset, getCitationTop(note.citationElement) + 4)
      }

      if (column === "left") {
        leftNotes.push({ ...note, column, posInCell: idealTop })
      } else {
        rightNotes.push({ ...note, column, posInCell: idealTop })
      }
    })

    // Step 2: Sort by position
    leftNotes.sort((a, b) => a.posInCell - b.posInCell)
    rightNotes.sort((a, b) => a.posInCell - b.posInCell)

    // Step 3: Simple collision resolution for initial layout (will be refined after render)
    const resolveCollisions = (notes: { posInCell: number }[]) => {
      for (let i = 1; i < notes.length; i++) {
        const prevNote = notes[i - 1]
        const thisNote = notes[i]
        const minTop = prevNote.posInCell + estimatedHeight + CONFIG.sidenoteSpacing
        if (thisNote.posInCell < minTop) {
          thisNote.posInCell = minTop
        }
      }
    }

    resolveCollisions(leftNotes)
    resolveCollisions(rightNotes)

    // Step 4: Build positioned array
    const positioned: PositionedSidenote[] = parsedSidenotes.map((note) => {
      const column: "left" | "right" = CONFIG.useLeftColumn && CONFIG.useRightColumn
        ? (note.number % 2 === 0 ? "left" : "right")
        : CONFIG.useLeftColumn ? "left" : "right"

      const columnNotes = column === "left" ? leftNotes : rightNotes
      const adjustedNote = columnNotes.find(n => n.number === note.number)

      return {
        ...note,
        top: adjustedNote?.posInCell ?? CONFIG.minTopOffset,
        column,
        height: estimatedHeight,
        isCutOff: false,
      }
    })

    return positioned
  }, [])

  // ─── Recalculate Positions After Render (Gwern-style bidirectional adjustment) ────
  const recalculatePositions = useCallback(() => {
    if (!markdownBodyRef.current || !columnPositions) return

    // Get the actual column elements
    const leftColumn = leftColumnRef.current
    const rightColumn = rightColumnRef.current
    if (!leftColumn && !rightColumn) return

    // Get column positions relative to viewport
    const leftColumnRect = leftColumn?.getBoundingClientRect()
    const rightColumnRect = rightColumn?.getBoundingClientRect()

    // Read current sidenotes from state via closure (we'll use functional update)
    setSidenotes(currentSidenotes => {
      if (currentSidenotes.length === 0) return currentSidenotes

      const body = markdownBodyRef.current
      if (!body) return currentSidenotes

      // Separate sidenotes by column
      const leftNotes: (PositionedSidenote & { posInCell: number; actualHeight: number })[] = []
      const rightNotes: (PositionedSidenote & { posInCell: number; actualHeight: number })[] = []

      // Step 1: Set all sidenotes to their ideal positions (aligned with citations)
      currentSidenotes.forEach((note) => {
        const sidenoteEl = document.getElementById(note.id)
        const actualHeight = sidenoteEl?.offsetHeight || 100

        // Get the column's viewport top for this sidenote
        const columnRect = note.column === "left" ? leftColumnRect : rightColumnRect
        const columnViewportTop = columnRect?.top ?? 0

        // Re-query the citation element (stored refs may be stale after re-renders)
        const citationSelectors = [
          `sup[id="user-content-fnref-${note.number}"]`,
          `a[href="#user-content-fn-${note.number}"]`,
          `sup[id*="fnref-${note.number}"]`,
          `sup[id*="fnref${note.number}"]`,
        ]
        let citationEl: HTMLElement | null = null
        for (const sel of citationSelectors) {
          citationEl = document.querySelector(sel) as HTMLElement
          if (citationEl) break
        }

        // Calculate ideal top position: citation viewport position relative to column viewport position
        // This gives us the offset within the column where the sidenote should appear
        let idealTop = CONFIG.minTopOffset
        if (citationEl) {
          const citationRect = citationEl.getBoundingClientRect()
          // Simple subtraction: how far down from column top is the citation?
          idealTop = Math.max(CONFIG.minTopOffset, citationRect.top - columnViewportTop + 4)
        }

        const noteWithPos = {
          ...note,
          posInCell: idealTop,
          actualHeight,
          height: actualHeight,
        }

        if (note.column === "left") {
          leftNotes.push(noteWithPos)
        } else {
          rightNotes.push(noteWithPos)
        }
      })

      // Step 2: Sort each column's sidenotes by their ideal position
      leftNotes.sort((a, b) => a.posInCell - b.posInCell)
      rightNotes.sort((a, b) => a.posInCell - b.posInCell)

      // Step 3: Bidirectional adjustment function (Gwern's algorithm)
      const adjustColumnPositions = (notes: typeof leftNotes) => {
        if (notes.length === 0) return

        // Helper: get distance between two consecutive sidenotes
        // Positive = gap exists, Negative = overlap
        const getDistance = (noteA: typeof notes[0], noteB: typeof notes[0]) => {
          return noteB.posInCell - (noteA.posInCell + noteA.actualHeight + CONFIG.sidenoteSpacing)
        }

        // Helper: shift notes up by a given amount
        const shiftNotesUp = (noteIndexes: number[], shiftDistance: number) => {
          noteIndexes.forEach(idx => {
            notes[idx].posInCell -= shiftDistance
          })
        }

        // Helper: recursively push notes up to resolve overlap
        const pushNotesUp = (pushWhich: number[], pushForce: number, bruteStrength = false): number => {
          if (pushWhich.length === 0 || pushForce <= 0) return pushForce

          const firstIdx = pushWhich[0]
          // How much room is there to push up?
          const roomToPush = firstIdx === 0
            ? Math.max(0, notes[firstIdx].posInCell - CONFIG.minTopOffset)
            : Math.max(0, getDistance(notes[firstIdx - 1], notes[firstIdx]))

          // How much should each note move?
          const pushDistance = bruteStrength
            ? pushForce
            : Math.floor(pushForce / pushWhich.length)

          if (pushDistance <= roomToPush) {
            // Enough room - shift all notes and return remaining force
            shiftNotesUp(pushWhich, pushDistance)
            return pushForce - pushDistance
          } else {
            // Not enough room - shift by what we can, then try to involve more notes
            shiftNotesUp(pushWhich, roomToPush)
            if (firstIdx === 0) {
              // Hit the top, can't push more
              return pushForce - roomToPush
            }
            // Add the note above to the push set and recurse
            const newPushWhich = [firstIdx - 1, ...pushWhich]
            return pushNotesUp(newPushWhich, pushForce - roomToPush, bruteStrength)
          }
        }

        // Check each sidenote after the first for overlap with the one above
        for (let i = 1; i < notes.length; i++) {
          const prevNote = notes[i - 1]
          const thisNote = notes[i]

          // Calculate overlap (negative distance means overlap)
          const overlapAbove = Math.max(0, -1 * getDistance(prevNote, thisNote))
          if (overlapAbove === 0) continue

          // Split the overlap: push notes above UP, push current note DOWN
          const pushUpForce = Math.round(overlapAbove / 2)
          const remainingOverlap = pushNotesUp([i - 1], pushUpForce)
          thisNote.posInCell += (overlapAbove - pushUpForce) + remainingOverlap
        }
      }

      // Apply bidirectional adjustment to each column
      adjustColumnPositions(leftNotes)
      adjustColumnPositions(rightNotes)

      // Step 4: Build the final positions array
      const newPositions = currentSidenotes.map((note) => {
        const columnNotes = note.column === "left" ? leftNotes : rightNotes
        const adjustedNote = columnNotes.find(n => n.id === note.id)

        const sidenoteEl = document.getElementById(note.id)
        const outerWrapper = sidenoteEl?.querySelector(".sidenote-outer-wrapper") as HTMLElement
        const isCutOff = outerWrapper ? outerWrapper.scrollHeight > outerWrapper.offsetHeight + 2 : false

        return {
          ...note,
          top: adjustedNote?.posInCell ?? note.top,
          height: adjustedNote?.actualHeight ?? note.height,
          isCutOff,
        }
      })

      return newPositions
    })
  }, [columnPositions]) // Depends on columnPositions for correct position calculation

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
    if (!ready || !columnPositions) return

    const handleResize = () => {
      requestAnimationFrame(recalculatePositions)
    }

    window.addEventListener("resize", handleResize)

    // Additional recalculation after images load (they can change heights)
    const timer = setTimeout(recalculatePositions, 500)

    return () => {
      window.removeEventListener("resize", handleResize)
      clearTimeout(timer)
    }
  }, [ready, columnPositions, recalculatePositions])

  // ─── Scroll listener for cut-off sidenotes ─────────────────────────────────
  // When user scrolls to bottom of a cut-off sidenote, hide the "more" indicator
  useEffect(() => {
    if (!ready || !isWideViewport) return

    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement
      if (!target?.classList?.contains("sidenote-outer-wrapper")) return

      const sidenote = target.closest(".sidenote")
      if (!sidenote || !sidenote.classList.contains("cut-off")) return

      // Check if scrolled to bottom (with small buffer for tolerance)
      const isAtBottom = target.scrollTop + target.offsetHeight >= target.scrollHeight - 2

      if (isAtBottom) {
        sidenote.classList.add("hide-more-indicator")
      } else {
        sidenote.classList.remove("hide-more-indicator")
      }
    }

    // Use event delegation on the document with capture for scroll events
    document.addEventListener("scroll", handleScroll, true)

    return () => {
      document.removeEventListener("scroll", handleScroll, true)
    }
  }, [ready, isWideViewport])

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

  // Calculate column width for inline styles
  const columnWidth = columnPositions ? Math.min(
    (window.innerWidth - (markdownBodyRef.current?.getBoundingClientRect().width || 672)) / 2 - 48,
    CONFIG.maxSidenoteWidth
  ) : CONFIG.maxSidenoteWidth

  return (
    <>
      {/* Left Column */}
      {CONFIG.useLeftColumn && columnPositions && (
        <div
          ref={leftColumnRef}
          id="sidenote-column-left"
          className="sidenote-column"
          style={{
            left: columnPositions.left,
            top: columnPositions.topOffset,
            width: columnWidth,
          }}
        >
          {leftSidenotes.map(renderSidenote)}
        </div>
      )}

      {/* Right Column */}
      {CONFIG.useRightColumn && columnPositions && (
        <div
          ref={rightColumnRef}
          id="sidenote-column-right"
          className="sidenote-column"
          style={{
            left: columnPositions.right,
            top: columnPositions.topOffset,
            width: columnWidth,
          }}
        >
          {rightSidenotes.map(renderSidenote)}
        </div>
      )}
    </>
  )
}

export default Sidenotes

"use client"
/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                                 TOC.TSX                                   ║
 * ║                            Table of Contents                              ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║  @author   Kris Yotam                                                     ║
 * ║  @date     2026-01-02                                                     ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║                                                                           ║
 * ║  A clean, collapsible table of contents with section preview on hover.    ║
 * ║                                                                           ║
 * ║  Features:                                                                ║
 * ║  • Collapsible with smooth chevron rotation                               ║
 * ║  • Wikipedia-style hierarchical numbering (1, 1.1, 1.1.1, etc.)           ║
 * ║  • Indented nested headings                                               ║
 * ║  • Section preview popup on hover (shows content from that section)       ║
 * ║  • Auto-closes when a link is clicked                                     ║
 * ║  • Responsive and accessible                                              ║
 * ║                                                                           ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { cn } from "@/lib/utils"
import { useState, useRef, useCallback, useEffect } from "react"
import { createPortal } from "react-dom"
import { ChevronRight } from "lucide-react"

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════ */

export interface TOCItem {
  id: string
  text: string
  level: number
}

export interface TOCProps {
  headings: TOCItem[]
  className?: string
}

interface NumberedTOCItem extends TOCItem {
  number: string
}

interface PreviewState {
  isVisible: boolean
  title: string
  headingId: string
}

/* ═══════════════════════════════════════════════════════════════════════════
   CONFIGURATION
   ═══════════════════════════════════════════════════════════════════════════ */

const CONFIG = {
  hoverDelay: 200,           // ms before showing preview
  previewHeight: 700,        // px - tall vertical rectangle
  previewWidth: 500,         // px - wider for readability
  previewGap: 20,            // px gap from viewport edge
}

/* ═══════════════════════════════════════════════════════════════════════════
   UTILITIES
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Adds hierarchical numbering (1, 1.1, 1.1.1, etc.) to TOC items
 */
function addHierarchicalNumbering(items: TOCItem[]): NumberedTOCItem[] {
  const counters = [0, 0, 0, 0]
  return items.map((item) => {
    const lvl = item.level
    for (let i = lvl; i < counters.length; i++) counters[i] = 0
    counters[lvl - 1]++
    const number = counters.slice(0, lvl).join(".")
    return { ...item, number }
  })
}

/* ═══════════════════════════════════════════════════════════════════════════
   PREVIEW POPUP COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

interface PreviewPopupProps {
  headingId: string
  title: string
  onMouseEnter: () => void
  onMouseLeave: () => void
}

function PreviewPopup({ headingId, title, onMouseEnter, onMouseLeave }: PreviewPopupProps) {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // ─── Build iframe URL with hash anchor ────────────────────────────────────
  const iframeUrl = `${window.location.pathname}#${headingId}`

  // ─── Position: Left side of viewport, vertically centered ────────────────
  const viewportHeight = window.innerHeight
  const x = CONFIG.previewGap
  const y = Math.max(CONFIG.previewGap, (viewportHeight - CONFIG.previewHeight) / 2)

  const popup = (
    <div
      className={cn(
        "toc-preview-popup",
        "fixed z-[9999] pointer-events-auto",
        "flex flex-col",
        "shadow-2xl overflow-hidden"
      )}
      style={{
        left: x,
        top: y,
        width: CONFIG.previewWidth,
        height: CONFIG.previewHeight,
        border: "3px double hsl(var(--foreground))",
        backgroundColor: "hsl(var(--background))",
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* ─── Title Bar (matches popups.tsx design) ───────────────────────── */}
      <div
        className="flex items-center justify-center h-8 border-b-2 border-border"
        style={{
          backgroundColor: "hsl(var(--muted))",
          backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(128,128,128,0.1) 2px, rgba(128,128,128,0.1) 4px)",
          backgroundSize: "8px 8px",
        }}
      >
        <span className="text-sm font-medium text-muted-foreground truncate px-4">
          {title}
        </span>
      </div>

      {/* ─── Content Area (iframe preserves page formatting) ─────────────── */}
      <div className="flex-1 relative overflow-hidden">
        {/* Loading spinner */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
          </div>
        )}

        {/* Iframe with same page + hash anchor */}
        <iframe
          src={iframeUrl}
          className="w-full h-full border-0"
          title={`Preview: ${title}`}
          onLoad={() => setLoading(false)}
        />
      </div>
    </div>
  )

  return createPortal(popup, document.body)
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

export function TOC({ headings, className }: TOCProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [preview, setPreview] = useState<PreviewState>({
    isVisible: false,
    title: "",
    headingId: "",
  })

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isHoveringPreviewRef = useRef(false)

  // ─── Cleanup on unmount ───────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [])

  // ─── Hover handlers ───────────────────────────────────────────────────────
  const handleMouseEnter = useCallback((e: React.MouseEvent, heading: NumberedTOCItem) => {
    hoverTimeoutRef.current = setTimeout(() => {
      setPreview({
        isVisible: true,
        title: `${heading.number}. ${heading.text}`,
        headingId: heading.id,
      })
    }, CONFIG.hoverDelay)
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }

    // Small delay to allow moving to the preview popup
    setTimeout(() => {
      if (!isHoveringPreviewRef.current) {
        setPreview(prev => ({ ...prev, isVisible: false }))
      }
    }, 100)
  }, [])

  const handlePreviewMouseEnter = useCallback(() => {
    isHoveringPreviewRef.current = true
  }, [])

  const handlePreviewMouseLeave = useCallback(() => {
    isHoveringPreviewRef.current = false
    setPreview(prev => ({ ...prev, isVisible: false }))
  }, [])

  // ─── Early return ─────────────────────────────────────────────────────────
  if (!headings || headings.length === 0) {
    return null
  }

  const numberedHeadings = addHierarchicalNumbering(headings)

  /* ═════════════════════════════════════════════════════════════════════════
     RENDER
     ═════════════════════════════════════════════════════════════════════════ */

  return (
    <>
      <div
        className={cn(
          "my-2 bg-muted/50 dark:bg-[hsl(var(--popover))] w-full",
          className
        )}
      >
        {/* ─── Toggle Button ─────────────────────────────────────────────── */}
        <button
          type="button"
          className="flex w-full items-center justify-between px-4 py-2 text-left font-medium select-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>Table of Contents</span>
          <ChevronRight
            className={cn(
              "w-4 h-4 transform transition-transform",
              isOpen && "rotate-90"
            )}
          />
        </button>

        {/* ─── TOC List ──────────────────────────────────────────────────── */}
        <div
          className={cn(
            "px-4 py-2",
            !isOpen && "hidden"
          )}
        >
          <ul className="space-y-2">
            {numberedHeadings.map((heading) => (
              <li
                key={heading.id}
                style={{ paddingLeft: `${(heading.level - 1) * 16}px` }}
              >
                <a
                  href={`#${heading.id}`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-start gap-3 py-1 leading-relaxed"
                  onClick={() => setIsOpen(false)}
                  onMouseEnter={(e) => handleMouseEnter(e, heading)}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* ─── Number ──────────────────────────────────────────── */}
                  <span className="text-xs text-muted-foreground/70 mt-0.5 flex-shrink-0 min-w-[24px]">
                    {heading.number}.
                  </span>
                  {/* ─── Text ────────────────────────────────────────────── */}
                  <span className="break-words">{heading.text}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ─── Preview Popup (Portal) ──────────────────────────────────────── */}
      {preview.isVisible && preview.headingId && (
        <PreviewPopup
          headingId={preview.headingId}
          title={preview.title}
          onMouseEnter={handlePreviewMouseEnter}
          onMouseLeave={handlePreviewMouseLeave}
        />
      )}
    </>
  )
}

export default TOC

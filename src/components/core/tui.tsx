/*
+------------------+----------------------------------------------------------+
| FILE             | tui.tsx                                                  |
| ROLE             | Plan 9 / Acme-inspired TUI content browser               |
| OWNER            | Kris Yotam                                               |
| CREATED          | 2026-02-28                                               |
| UPDATED          | 2026-02-28                                               |
+------------------+----------------------------------------------------------+
| @type component                                                             |
| @path src/components/core/tui.tsx                                           |
+------------------+----------------------------------------------------------+
| SUMMARY                                                                     |
| Full Plan 9 desktop layout: teal desktop background with island sections.  |
| 3 top bars, central Acme content browser, footer taskbar — all floating    |
| with gaps between them. Draggable Cirno mascot with minimize.              |
| Left pane: collapsible directory tree. Right pane: raw MDX viewer.          |
| Keyboard navigation (arrows, Enter, Escape) and search.                    |
+-----------------------------------------------------------------------------+
*/

"use client"

import { useState, useCallback, useEffect, useRef, useMemo } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"

// =============================================================================
// Types
// =============================================================================

interface TreeEntry {
  slug: string
  title: string
  date: string
  preview: string
}

interface TUIProps {
  tree: Record<string, TreeEntry[]>
}

interface SelectedFile {
  type: string
  slug: string
}

interface FileContent {
  frontmatter: string
  body: string
}

// =============================================================================
// Plan 9 Color Palette
// =============================================================================

const P9 = {
  desktop: "#B5B5AD",       // grey desktop background
  tagBar: "#EAFFFF",        // pale cyan — Acme tag/command bar
  titleBar: "#FFFFEA",      // pale yellow — Acme window title bars
  body: "#FFFFF5",          // cream — Acme body/content background
  text: "#000000",
  textMuted: "#555555",
  selected: "#9EE09E",
  border: "#9EEEEE",        // Plan 9 teal blue window borders
  borderInner: "#888888",   // inner dividers (pane separators)
  borderLight: "#9EEEEE",
  hoverBg: "#EEEEE5",
  barAccent1: "#98D1CB",
  barAccent2: "#E8A0A0",
  barAccent3: "#88CC88",
  footerBg: "#9EDBDA",
  wsGrid: "#EAFFFF",
  wsHighlight: "#55CCCC",
} as const

const GAP = "14px"

// =============================================================================
// SVG Icons (Plan 9 pixel-art style, no emoji)
// =============================================================================

function FolderIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 10" style={{ flexShrink: 0 }}>
      <rect x="0" y="2" width="12" height="8" fill="none" stroke="#000" strokeWidth="1" />
      <rect x="0" y="2" width="5" height="2" fill="#000" />
    </svg>
  )
}

function HomeIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" style={{ flexShrink: 0 }}>
      <polygon points="6,1 11,6 9,6 9,11 3,11 3,6 1,6" fill="none" stroke="#000" strokeWidth="1" />
    </svg>
  )
}

// =============================================================================
// Floating Cirno
// =============================================================================

function Cirno({ minimized, setMinimized }: { minimized: boolean; setMinimized: (v: boolean) => void }) {
  const [pos, setPos] = useState(() => {
    if (typeof window !== "undefined") {
      return {
        x: Math.round((window.innerWidth - 560) / 2),
        y: Math.round((window.innerHeight - 600) / 2),
      }
    }
    return { x: 200, y: 100 }
  })
  const [dragging, setDragging] = useState(false)
  const dragOffset = useRef({ x: 0, y: 0 })

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest("[data-cirno-close]")) return
    e.preventDefault()
    setDragging(true)
    dragOffset.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    }
  }, [pos])

  useEffect(() => {
    if (!dragging) return

    function onMove(e: MouseEvent) {
      setPos({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      })
    }

    function onUp() {
      setDragging(false)
    }

    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }
  }, [dragging])

  if (minimized) {
    return null
  }

  return (
    <div
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        zIndex: 999,
        border: `2px solid ${P9.border}`,
        background: P9.body,
        boxShadow: "2px 2px 0 rgba(0,0,0,0.15)",
        cursor: dragging ? "grabbing" : "default",
        userSelect: "none",
        maxWidth: "560px",
      }}
    >
      <div
        onMouseDown={onMouseDown}
        style={{
          background: P9.tagBar,
          borderBottom: `1px solid ${P9.borderInner}`,
          padding: "1px 4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: dragging ? "grabbing" : "grab",
          fontFamily: "var(--font-mono), monospace",
          fontSize: "11px",
        }}
      >
        <span>/dev/cirno</span>
        <button
          data-cirno-close
          onClick={() => setMinimized(true)}
          title="Minimize"
          style={{
            background: P9.titleBar,
            border: `2px solid ${P9.borderInner}`,
            width: "24px",
            height: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: "13px",
            fontWeight: "bold",
            lineHeight: 1,
            padding: 0,
            color: P9.text,
          }}
        >
          &#x2212;
        </button>
      </div>
      <img
        src="/plan9-cirno.jpeg"
        alt="Cirno"
        draggable={false}
        style={{
          display: "block",
          width: "100%",
          height: "auto",
          imageRendering: "auto",
        }}
      />
    </div>
  )
}

// =============================================================================
// Top Bars (3 separate island bars)
// =============================================================================

function TopBars({ totalFiles }: { totalFiles: number }) {
  const now = new Date()
  const timeStr = now.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" })

  return (
    <div
      style={{
        display: "flex",
        gap: GAP,
        flexShrink: 0,
      }}
    >
      {/* Bar 1: Status bar */}
      <div
        style={{
          flex: "1 1 33%",
          border: `2px solid ${P9.border}`,
          overflow: "hidden",
          background: P9.body,
        }}
      >
        <div
          style={{
            background: P9.titleBar,
            padding: "1px 8px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "var(--font-mono), monospace",
            fontSize: "12px",
            borderBottom: `1px solid ${P9.borderInner}`,
            minHeight: "18px",
          }}
        >
          <span>krisyotam(9)</span>
          <span>front</span>
        </div>
        {/* Plan 9 stats graph — 4 rows spelling KRIS */}
        <div style={{ display: "flex", flexDirection: "column", borderTop: `1px solid ${P9.borderInner}` }}>
          {[
            { letter: "K", color: "#CC4444", bar1: "55%", bar2: "30%" },
            { letter: "R", color: "#4444BB", bar1: "70%", bar2: "45%" },
            { letter: "I", color: "#228822", bar1: "35%", bar2: "80%" },
            { letter: "S", color: "#77BB55", bar1: "60%", bar2: "20%" },
          ].map((row, i) => (
            <div
              key={row.letter}
              style={{
                display: "flex",
                alignItems: "stretch",
                height: "14px",
                borderBottom: `1px solid ${P9.borderInner}`,
              }}
            >
              {/* Small square with letter */}
              <div
                style={{
                  width: "16px",
                  flexShrink: 0,
                  background: row.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "9px",
                  fontWeight: "bold",
                  fontFamily: "var(--font-mono), monospace",
                  lineHeight: 1,
                  borderRight: `1px solid ${P9.borderInner}`,
                }}
              >
                {row.letter}
              </div>
              {/* Bar 1 */}
              <div style={{ flex: "1 1 50%", position: "relative", background: P9.body }}>
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: row.bar1, background: row.color, opacity: 0.7 }} />
              </div>
              {/* Vertical divider */}
              <div style={{ width: "1px", background: P9.borderInner, flexShrink: 0 }} />
              {/* Bar 2 */}
              <div style={{ flex: "1 1 50%", position: "relative", background: P9.body }}>
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: row.bar2, background: row.color, opacity: 0.7 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bar 2: File browser (Plan 9 file manager style) */}
      <div
        style={{
          flex: "1 1 34%",
          border: `2px solid ${P9.border}`,
          overflow: "hidden",
          background: P9.body,
        }}
      >
        {/* Title bar: home, folder, up arrow | /usr/krisyotam | new folder, new file */}
        <div
          style={{
            background: P9.titleBar,
            padding: "1px 8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: "var(--font-mono), monospace",
            fontSize: "12px",
            borderBottom: `1px solid ${P9.borderInner}`,
            minHeight: "18px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <HomeIcon size={12} />
            <FolderIcon size={11} />
            <svg width="10" height="10" viewBox="0 0 10 10"><polygon points="5,1 9,9 1,9" fill={P9.text} /></svg>
            <span style={{ fontWeight: "bold", marginLeft: "4px" }}>/usr/krisyotam</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <svg width="12" height="10" viewBox="0 0 12 10" title="New folder">
              <rect x="0" y="2" width="10" height="8" fill="none" stroke={P9.text} strokeWidth="1" />
              <rect x="0" y="2" width="5" height="2" fill={P9.text} />
              <line x1="9" y1="0" x2="9" y2="6" stroke={P9.text} strokeWidth="1.2" />
              <line x1="6.5" y1="3" x2="11.5" y2="3" stroke={P9.text} strokeWidth="1.2" />
            </svg>
            <svg width="12" height="10" viewBox="0 0 12 10" title="New file">
              <rect x="0" y="0" width="8" height="10" fill="none" stroke={P9.text} strokeWidth="1" />
              <line x1="9" y1="2" x2="9" y2="8" stroke={P9.text} strokeWidth="1.2" />
              <line x1="6.5" y1="5" x2="11.5" y2="5" stroke={P9.text} strokeWidth="1.2" />
            </svg>
          </div>
        </div>
        {/* Directory listing */}
        <div
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "11px",
          }}
        >
          <div style={{ padding: "1px 8px", display: "flex", alignItems: "center", gap: "6px" }}>
            <FolderIcon size={10} />
            <span>Blog</span>
            <span style={{ marginLeft: "auto", color: P9.textMuted }}>0</span>
            <span style={{ color: P9.textMuted }}>Feb 28 10:15</span>
          </div>
          <div style={{ padding: "1px 8px", display: "flex", alignItems: "center", gap: "6px" }}>
            <FolderIcon size={10} />
            <span>Books</span>
            <span style={{ marginLeft: "auto", color: P9.textMuted }}>0</span>
            <span style={{ color: P9.textMuted }}>Mar 14 23:30</span>
          </div>
          <div style={{ padding: "1px 8px", display: "flex", alignItems: "center", gap: "6px" }}>
            <FolderIcon size={10} />
            <span>Documents</span>
            <span style={{ marginLeft: "auto", color: P9.textMuted }}>0</span>
            <span style={{ color: P9.textMuted }}>Jun 27 23:43</span>
          </div>
        </div>
      </div>

      {/* Bar 3: Workspace grid — 3 rows x 5 cols */}
      <div
        style={{
          flex: "1 1 33%",
          border: `2px solid ${P9.border}`,
          overflow: "hidden",
          background: "#FFFFFF",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "11px",
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
          }}
        >
          {[
            { n: "1", l: "tui" },
            { n: "2", l: "www" },
            { n: "3", l: "term" },
            { n: "4", l: "mail" },
            { n: "5", l: "doc", href: "https://krisyotam.com/doc" },
            { n: "6", l: "dev" },
            { n: "7", l: "irc", href: "https://krisyotam.com/contact" },
            { n: "8", l: "notes", href: "https://notes.krisyotam.com" },
            { n: "9", l: "acme" },
            { n: "10", l: "rio" },
            { n: "11", l: "helix" },
            { n: "12", l: "git", href: "https://git.krisyotam.com/krisyotam" },
            { n: "13", l: "chat" },
            { n: "14", l: "WTF" },
            { n: "15", l: "stats" },
            { n: "16", l: "sam" },
            { n: "17", l: "mk" },
            { n: "18", l: "plumb" },
            { n: "19", l: "faces" },
            { n: "20", l: "dump" },
          ].map((ws) => {
            const isLink = !!ws.href
            const cellStyle: React.CSSProperties = {
              padding: "1px 3px",
              textAlign: "center",
              background: isLink ? P9.wsHighlight : "#D8D8D0",
              color: isLink ? "#fff" : P9.text,
              border: "1px solid #FFFFFF",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              cursor: isLink ? "pointer" : "default",
              textDecoration: "none",
              display: "block",
              fontSize: "inherit",
              fontFamily: "inherit",
            }

            if (isLink) {
              return (
                <a
                  key={ws.n}
                  href={ws.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={cellStyle}
                >
                  {ws.n}|{ws.l}
                </a>
              )
            }

            return (
              <div key={ws.n} style={cellStyle}>
                {ws.n}|{ws.l}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// Footer Taskbar
// =============================================================================

function Footer({ cirnoMinimized, onRestoreCirno }: { cirnoMinimized: boolean; onRestoreCirno: () => void }) {
  const [time, setTime] = useState("")

  useEffect(() => {
    function tick() {
      const d = new Date()
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      setTime(`${days[d.getDay()]} ${months[d.getMonth()]} ${d.getDate()} ${d.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" })}`)
    }
    tick()
    const id = setInterval(tick, 10000)
    return () => clearInterval(id)
  }, [])

  return (
    <div
      style={{
        flexShrink: 0,
        border: `2px solid ${P9.border}`,
        background: P9.body,
        display: "flex",
        alignItems: "stretch",
        height: "32px",
        fontFamily: "var(--font-mono), monospace",
        fontSize: "12px",
      }}
    >
      {/* Home button */}
      <a
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          padding: "0 10px",
          borderRight: `1px solid ${P9.borderInner}`,
          color: P9.text,
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
        /home
      </a>
      {/* Collapsed cirno.jpg — Plan 9 collapsed window style */}
      {cirnoMinimized && (
        <div
          onClick={onRestoreCirno}
          style={{
            display: "flex",
            alignItems: "stretch",
            borderRight: `1px solid ${P9.borderInner}`,
            cursor: "pointer",
          }}
        >
          <div
            style={{
              background: P9.tagBar,
              padding: "0 6px",
              display: "flex",
              alignItems: "center",
              borderRight: `1px solid ${P9.borderInner}`,
              fontSize: "11px",
              color: P9.textMuted,
            }}
          >
            &#x25A0;
          </div>
          <div
            style={{
              background: P9.titleBar,
              padding: "0 8px",
              display: "flex",
              alignItems: "center",
              fontSize: "11px",
            }}
          >
            cirno.jpg
          </div>
        </div>
      )}
      {/* Colored center panel */}
      <div
        style={{
          flex: "0 0 14%",
          borderRight: `1px solid ${P9.borderInner}`,
          background: P9.footerBg,
        }}
      />
      {/* Clock + info */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "16px",
          padding: "0 12px",
          color: P9.text,
        }}
      >
        <span>{time}</span>
        <span style={{ color: P9.textMuted }}>krisyotam.com</span>
        <span style={{ color: P9.textMuted }}>9front</span>
      </div>
    </div>
  )
}

// =============================================================================
// Main TUI Component
// =============================================================================

export function TUI({ tree }: TUIProps) {
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set())
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null)
  const [fileContent, setFileContent] = useState<FileContent | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [focusIndex, setFocusIndex] = useState(-1)
  const [cirnoMinimized, setCirnoMinimized] = useState(false)

  const treeRef = useRef<HTMLDivElement>(null)

  const contentTypes = useMemo(() => Object.keys(tree).sort(), [tree])
  const totalFiles = useMemo(
    () => Object.values(tree).reduce((sum, entries) => sum + entries.length, 0),
    [tree]
  )

  const navItems = useMemo(() => {
    const items: { kind: "dir" | "file"; type: string; slug?: string }[] = []
    const query = searchQuery.toLowerCase()

    for (const type of contentTypes) {
      const entries = tree[type]
      const filtered = query
        ? entries.filter(
            (e) =>
              e.slug.toLowerCase().includes(query) ||
              e.title.toLowerCase().includes(query)
          )
        : entries

      if (query && filtered.length === 0) continue
      items.push({ kind: "dir", type })

      if (expandedDirs.has(type)) {
        for (const entry of filtered) {
          items.push({ kind: "file", type, slug: entry.slug })
        }
      }
    }
    return items
  }, [contentTypes, tree, expandedDirs, searchQuery])

  const filteredTree = useMemo(() => {
    if (!searchQuery) return tree
    const query = searchQuery.toLowerCase()
    const result: Record<string, TreeEntry[]> = {}
    for (const type of contentTypes) {
      const filtered = tree[type].filter(
        (e) =>
          e.slug.toLowerCase().includes(query) ||
          e.title.toLowerCase().includes(query)
      )
      if (filtered.length > 0) result[type] = filtered
    }
    return result
  }, [tree, searchQuery, contentTypes])

  const catFile = useCallback(async (type: string, slug: string) => {
    setSelectedFile({ type, slug })
    setLoading(true)
    setFileContent(null)

    try {
      const res = await fetch(`/api/tui/${type}/${slug}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setFileContent({ frontmatter: data.frontmatter, body: data.body })
    } catch {
      setFileContent({
        frontmatter: "",
        body: `Error: failed to read ${type}/${slug}.mdx`,
      })
    } finally {
      setLoading(false)
    }
  }, [])

  const toggleDir = useCallback((type: string) => {
    setExpandedDirs((prev) => {
      const next = new Set(prev)
      if (next.has(type)) next.delete(type)
      else next.add(type)
      return next
    })
  }, [])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.target as HTMLElement).tagName === "INPUT") return

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setFocusIndex((prev) => Math.min(prev + 1, navItems.length - 1))
          break
        case "ArrowUp":
          e.preventDefault()
          setFocusIndex((prev) => Math.max(prev - 1, 0))
          break
        case "ArrowRight": {
          e.preventDefault()
          const item = navItems[focusIndex]
          if (item?.kind === "dir" && !expandedDirs.has(item.type)) {
            toggleDir(item.type)
          }
          break
        }
        case "ArrowLeft": {
          e.preventDefault()
          const item = navItems[focusIndex]
          if (item?.kind === "dir" && expandedDirs.has(item.type)) {
            toggleDir(item.type)
          } else if (item?.kind === "file") {
            const dirIdx = navItems.findIndex(
              (n) => n.kind === "dir" && n.type === item.type
            )
            if (dirIdx >= 0) setFocusIndex(dirIdx)
          }
          break
        }
        case "Enter": {
          e.preventDefault()
          const item = navItems[focusIndex]
          if (!item) break
          if (item.kind === "dir") toggleDir(item.type)
          else if (item.slug) catFile(item.type, item.slug)
          break
        }
        case "Escape":
          e.preventDefault()
          setSelectedFile(null)
          setFileContent(null)
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [navItems, focusIndex, expandedDirs, toggleDir, catFile])

  useEffect(() => {
    if (focusIndex < 0 || !treeRef.current) return
    const el = treeRef.current.querySelector(`[data-nav-index="${focusIndex}"]`)
    el?.scrollIntoView({ block: "nearest" })
  }, [focusIndex])

  const breadcrumb = selectedFile
    ? `/content/${selectedFile.type}/${selectedFile.slug}`
    : "/content"

  // =============================================================================
  // Render
  // =============================================================================

  return (
    <div
      style={{
        fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace",
        fontSize: "13px",
        lineHeight: "1.4",
        color: P9.text,
        background: P9.desktop,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: GAP,
        gap: GAP,
        overflow: "hidden",
      }}
    >
      {/* Floating Cirno */}
      <Cirno minimized={cirnoMinimized} setMinimized={setCirnoMinimized} />

      {/* ================================================================== */}
      {/* Top 3 Bars (separate islands) */}
      {/* ================================================================== */}
      <TopBars totalFiles={totalFiles} />

      {/* ================================================================== */}
      {/* Central Island: Acme workspace */}
      {/* ================================================================== */}
      <div
        style={{
          flex: 1,
          border: `2px solid ${P9.border}`,
          background: P9.body,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Acme command/tag bar */}
        <div
          style={{
            background: P9.tagBar,
            borderBottom: `1px solid ${P9.borderInner}`,
            padding: "3px 8px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexShrink: 0,
            minHeight: "24px",
            fontSize: "12px",
          }}
        >
          <span style={{ fontWeight: "bold" }}>New</span>
          <span style={{ fontWeight: "bold" }}>Cut</span>
          <span style={{ fontWeight: "bold" }}>Paste</span>
          <span style={{ fontWeight: "bold" }}>Snarf</span>
          <span style={{ fontWeight: "bold" }}>Sort</span>
          <span style={{ fontWeight: "bold" }}>Zerox</span>
          <span style={{ fontWeight: "bold" }}>Delcol</span>
          <span style={{ color: P9.textMuted, margin: "0 4px" }}>|</span>
          <input
            type="text"
            placeholder="Look"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setFocusIndex(-1)
            }}
            style={{
              background: P9.body,
              border: `1px solid ${P9.borderInner}`,
              padding: "1px 6px",
              fontFamily: "inherit",
              fontSize: "inherit",
              width: "180px",
              outline: "none",
            }}
          />
        </div>

        {/* Panes */}
        <div data-tui-panes style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* Left Pane — Directory Tree */}
          <div
            data-tui-tree
            style={{
              width: "30%",
              minWidth: "200px",
              maxWidth: "360px",
              borderRight: `1px solid ${P9.borderInner}`,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                background: P9.tagBar,
                borderBottom: `1px solid ${P9.borderInner}`,
                padding: "1px 8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
                minHeight: "20px",
                fontSize: "12px",
              }}
            >
              <span style={{ fontWeight: "bold" }}>{breadcrumb}</span>
              <span style={{ color: P9.textMuted }}>{totalFiles}</span>
            </div>

            <div
              style={{
                background: P9.titleBar,
                borderBottom: `1px solid ${P9.borderInner}`,
                padding: "1px 8px",
                fontWeight: "bold",
                flexShrink: 0,
                minHeight: "18px",
                display: "flex",
                alignItems: "center",
                fontSize: "12px",
              }}
            >
              Del Snarf | Look Put Mail
            </div>

            <ScrollArea style={{ flex: 1 }}>
              <div ref={treeRef} style={{ padding: "2px 0" }}>
                {contentTypes.map((type) => {
                  const entries = filteredTree[type]
                  if (!entries && searchQuery) return null

                  const isExpanded = expandedDirs.has(type)
                  const fileCount = tree[type].length
                  const dirNavIdx = navItems.findIndex(
                    (n) => n.kind === "dir" && n.type === type
                  )

                  return (
                    <div key={type}>
                      <div
                        data-nav-index={dirNavIdx}
                        onClick={() => toggleDir(type)}
                        style={{
                          padding: "1px 8px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          background:
                            focusIndex === dirNavIdx ? P9.selected : "transparent",
                          userSelect: "none",
                        }}
                        onMouseEnter={(e) => {
                          if (focusIndex !== dirNavIdx)
                            e.currentTarget.style.background = P9.hoverBg
                        }}
                        onMouseLeave={(e) => {
                          if (focusIndex !== dirNavIdx)
                            e.currentTarget.style.background = "transparent"
                        }}
                      >
                        <span style={{ width: "12px", display: "inline-block" }}>
                          {isExpanded ? "\u25BE" : "\u25B8"}
                        </span>
                        <span style={{ fontWeight: "bold" }}>{type}/</span>
                        <span
                          style={{
                            color: P9.textMuted,
                            fontSize: "11px",
                            marginLeft: "auto",
                          }}
                        >
                          {fileCount}
                        </span>
                      </div>

                      {isExpanded &&
                        (entries || tree[type]).map((entry) => {
                          const fileNavIdx = navItems.findIndex(
                            (n) =>
                              n.kind === "file" &&
                              n.type === type &&
                              n.slug === entry.slug
                          )
                          const isSelected =
                            selectedFile?.type === type &&
                            selectedFile?.slug === entry.slug

                          return (
                            <div
                              key={entry.slug}
                              data-nav-index={fileNavIdx}
                              onClick={() => catFile(type, entry.slug)}
                              title={`${entry.title}\n${entry.date}\n${entry.preview}`}
                              style={{
                                padding: "1px 8px 1px 28px",
                                cursor: "pointer",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                background: isSelected
                                  ? P9.selected
                                  : focusIndex === fileNavIdx
                                  ? P9.selected
                                  : "transparent",
                                userSelect: "none",
                              }}
                              onMouseEnter={(e) => {
                                if (!isSelected && focusIndex !== fileNavIdx)
                                  e.currentTarget.style.background = P9.hoverBg
                              }}
                              onMouseLeave={(e) => {
                                if (!isSelected && focusIndex !== fileNavIdx)
                                  e.currentTarget.style.background = "transparent"
                              }}
                            >
                              {entry.slug}.mdx
                            </div>
                          )
                        })}
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Right Pane — Content Viewer */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                background: P9.tagBar,
                borderBottom: `1px solid ${P9.borderInner}`,
                padding: "1px 8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
                minHeight: "20px",
                fontSize: "12px",
              }}
            >
              <span style={{ fontWeight: "bold" }}>
                {selectedFile
                  ? `${selectedFile.type}/${selectedFile.slug}.mdx`
                  : "output"}
              </span>
              <span style={{ color: P9.textMuted }}>
                Del Snarf | Look Put
              </span>
            </div>

            <div
              style={{
                background: P9.titleBar,
                borderBottom: `1px solid ${P9.borderInner}`,
                padding: "1px 8px",
                flexShrink: 0,
                minHeight: "18px",
                display: "flex",
                alignItems: "center",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              {selectedFile
                ? `$ cat ${selectedFile.type}/${selectedFile.slug}.mdx`
                : "cat"}
            </div>

            <ScrollArea style={{ flex: 1 }}>
              <div style={{ padding: "8px 12px" }}>
                {!selectedFile && !loading && (
                  <div style={{ color: P9.textMuted }}>
                    <div>; Plan 9 / Acme content browser</div>
                    <div>; click a file to cat it, or use arrow keys + Enter</div>
                    <div>; Escape to clear, Look to search</div>
                    <div>;</div>
                    <div>
                      ; {contentTypes.length} directories, {totalFiles} files
                    </div>
                  </div>
                )}

                {loading && (
                  <div style={{ color: P9.textMuted }}>
                    reading...
                  </div>
                )}

                {selectedFile && fileContent && !loading && (
                  <div>
                    {fileContent.frontmatter && (
                      <>
                        <div>---</div>
                        <div
                          style={{
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                          }}
                        >
                          {fileContent.frontmatter}
                        </div>
                        <div>---</div>
                        <div style={{ height: "8px" }} />
                      </>
                    )}

                    <div
                      style={{
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      {fileContent.body}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* Footer Taskbar (separate island) */}
      {/* ================================================================== */}
      <Footer cirnoMinimized={cirnoMinimized} onRestoreCirno={() => setCirnoMinimized(false)} />

      {/* Mobile responsive */}
      <style>{`
        @media (max-width: 640px) {
          [data-tui-panes] {
            flex-direction: column !important;
          }
          [data-tui-tree] {
            width: 100% !important;
            max-width: none !important;
            max-height: 40vh !important;
            border-right: none !important;
            border-bottom: 1px solid ${P9.borderInner};
          }
        }
      `}</style>
    </div>
  )
}

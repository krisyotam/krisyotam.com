"use client"
/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                              SETTINGS.TSX                                 ║
 * ║                       Site Settings & Search Menu                         ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║  @author   Kris Yotam                                                     ║
 * ║  @date     2026-01-03                                                     ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║                                                                           ║
 * ║  A unified settings menu providing site-wide search and user preferences. ║
 * ║                                                                           ║
 * ║  Features:                                                                ║
 * ║  • Global search across all content types (posts, essays, papers, etc.)   ║
 * ║  • Draggable, resizable search window                                     ║
 * ║  • User preferences (link previews, color themes, sidenotes)              ║
 * ║  • Quick access to RSS, FAQ, Changelog, and GitHub                        ║
 * ║  • Keyboard shortcuts (Escape to close)                                   ║
 * ║                                                                           ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import {
  Search, Settings, Rss, X, Maximize, Move,
  CircleHelp, GitCompare, Github, ExternalLink,
  Palette, PanelRightOpen
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { motion, useMotionValue } from "framer-motion"
import { Post } from "@/lib/posts"

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════ */

interface Page {
  title: string
  subtitle: string
  preview: string
  date: string
  "show-status": string
  status: string
  confidence: string
  importance: number
  path: string
  type: string
}

interface SearchResult {
  title: string
  subtitle?: string
  preview?: string
  date: string
  status: string
  category?: string
  path: string
  resultType: "post" | "page" | "essay" | "paper" | "fiction" | "news" | "note" | "progymnasmata" | "lab" | "lecture" | "link"
}

type LinkModalMode = "all" | "external" | "off"
type ColorTheme = "default" | "solarized"

/* ═══════════════════════════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════════════════════════ */

const STORAGE_KEYS = {
  linkModalMode: "settings_universalLinkModalMode",
  linkModalEnabled: "settings_universalLinkModal",
  colorTheme: "settings_colorTheme",
  sidenotesEnabled: "settings_sidenotesEnabled",
} as const

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

export function SettingsMenu() {
  /* ─── UI State ───────────────────────────────────────────────────────────── */
  const [spinDirection, setSpinDirection] = useState<"left" | "right" | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isLinkHoverMenuVisible, setIsLinkHoverMenuVisible] = useState(false)

  /* ─── Search State ───────────────────────────────────────────────────────── */
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  /* ─── Data State ─────────────────────────────────────────────────────────── */
  const [posts, setPosts] = useState<Post[]>([])
  const [pages, setPages] = useState<Page[]>([])
  const [essays, setEssays] = useState<any[]>([])
  const [papers, setPapers] = useState<any[]>([])
  const [fiction, setFiction] = useState<any[]>([])
  const [news, setNews] = useState<any[]>([])
  const [quickNotes, setQuickNotes] = useState<any[]>([])
  const [progymnasmata, setProgymnasmata] = useState<any[]>([])
  const [lab, setLab] = useState<any[]>([])
  const [lectures, setLectures] = useState<any[]>([])
  const [links, setLinks] = useState<any[]>([])

  /* ─── User Settings State ────────────────────────────────────────────────── */
  const [universalLinkModalEnabled, setUniversalLinkModalEnabled] = useState(true)
  const [universalLinkModalMode, setUniversalLinkModalMode] = useState<LinkModalMode>("external")
  const [colorTheme, setColorTheme] = useState<ColorTheme>("default")
  const [sidenotesEnabled, setSidenotesEnabled] = useState(false) // Default OFF

  /* ─── Refs ───────────────────────────────────────────────────────────────── */
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchWindowRef = useRef<HTMLDivElement>(null)
  const linkOptionRef = useRef<HTMLButtonElement>(null)
  const linkSubmenuRef = useRef<HTMLDivElement>(null)
  const hideSubmenuTimerRef = useRef<NodeJS.Timeout | null>(null)

  /* ─── Hooks ──────────────────────────────────────────────────────────────── */
  const router = useRouter()
  const { theme } = useTheme()
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  /* ═════════════════════════════════════════════════════════════════════════
     SUBMENU HANDLERS
     ═════════════════════════════════════════════════════════════════════════ */

  const showSubmenu = () => {
    if (hideSubmenuTimerRef.current) {
      clearTimeout(hideSubmenuTimerRef.current)
      hideSubmenuTimerRef.current = null
    }
    setIsLinkHoverMenuVisible(true)
  }

  const hideSubmenuWithDelay = () => {
    if (hideSubmenuTimerRef.current) {
      clearTimeout(hideSubmenuTimerRef.current)
    }
    hideSubmenuTimerRef.current = setTimeout(() => {
      setIsLinkHoverMenuVisible(false)
    }, 300)
  }

  /* ═════════════════════════════════════════════════════════════════════════
     SETTINGS PERSISTENCE
     ═════════════════════════════════════════════════════════════════════════ */

  // Load settings from localStorage on mount
  useEffect(() => {
    // Link modal settings
    const storedMode = localStorage.getItem(STORAGE_KEYS.linkModalMode)
    if (storedMode && ["all", "external", "off"].includes(storedMode)) {
      setUniversalLinkModalMode(storedMode as LinkModalMode)
      setUniversalLinkModalEnabled(storedMode !== "off")
    }

    // Color theme
    const storedTheme = localStorage.getItem(STORAGE_KEYS.colorTheme)
    if (storedTheme && ["default", "solarized"].includes(storedTheme)) {
      setColorTheme(storedTheme as ColorTheme)
      applyColorTheme(storedTheme as ColorTheme)
    }

    // Sidenotes setting (default: off)
    const storedSidenotes = localStorage.getItem(STORAGE_KEYS.sidenotesEnabled)
    if (storedSidenotes !== null) {
      setSidenotesEnabled(storedSidenotes === "true")
    }

    return () => {
      if (hideSubmenuTimerRef.current) {
        clearTimeout(hideSubmenuTimerRef.current)
      }
    }
  }, [])

  // Apply color theme to document
  const applyColorTheme = (theme: ColorTheme) => {
    const root = document.documentElement
    root.classList.remove("theme-solarized")
    if (theme === "solarized") {
      root.classList.add("theme-solarized")
    }
  }

  // Set color theme
  const setAndApplyColorTheme = (theme: ColorTheme) => {
    setColorTheme(theme)
    localStorage.setItem(STORAGE_KEYS.colorTheme, theme)
    applyColorTheme(theme)
  }

  // Set link modal mode
  const setLinkModalMode = (mode: LinkModalMode) => {
    setUniversalLinkModalMode(mode)
    localStorage.setItem(STORAGE_KEYS.linkModalMode, mode)

    const isEnabled = mode !== "off"
    setUniversalLinkModalEnabled(isEnabled)
    localStorage.setItem(STORAGE_KEYS.linkModalEnabled, String(isEnabled))

    setIsLinkHoverMenuVisible(false)
  }

  // Toggle sidenotes
  const toggleSidenotes = (enabled: boolean) => {
    setSidenotesEnabled(enabled)
    localStorage.setItem(STORAGE_KEYS.sidenotesEnabled, String(enabled))

    // Dispatch event for sidenotes component to react
    window.dispatchEvent(new CustomEvent("sidenotesSettingChanged", {
      detail: { enabled }
    }))
  }

  /* ═════════════════════════════════════════════════════════════════════════
     SEARCH WINDOW POSITIONING
     ═════════════════════════════════════════════════════════════════════════ */

  useEffect(() => {
    if (isSearchOpen && !isMaximized && searchWindowRef.current) {
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight
      const modalWidth = 600
      const modalHeight = 400

      x.set((windowWidth - modalWidth) / 2)
      y.set((windowHeight - modalHeight) / 3)
    }
  }, [isSearchOpen, isMaximized, x, y])

  const getConstraints = () => {
    if (!searchWindowRef.current) return {}
    const width = isMaximized ? window.innerWidth * 0.9 : 600
    const height = isMaximized ? window.innerHeight * 0.9 : 400

    return {
      top: 0,
      left: 0,
      right: window.innerWidth - width,
      bottom: window.innerHeight - height,
    }
  }

  /* ═════════════════════════════════════════════════════════════════════════
     DATA FETCHING
     ═════════════════════════════════════════════════════════════════════════ */

  const safelyFetchData = async (url: string) => {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        console.warn(`Failed to fetch from ${url}: ${response.status}`)
        return []
      }
      return await response.json()
    } catch (error) {
      console.warn(`Error fetching data from ${url}:`, error)
      return []
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        const [
          postsData, essaysData, papersData, fictionData,
          notesData, progymnasmataData,
        ] = await Promise.all([
          safelyFetchData("/api/posts/search"),
          safelyFetchData("/api/essays/essays"),
          safelyFetchData("/api/papers"),
          safelyFetchData("/api/fiction"),
          safelyFetchData("/api/notes"),
          safelyFetchData("/api/progymnasmata"),
        ])

        setPosts(postsData || [])
        setPages([])
        setEssays(essaysData || [])
        setPapers(papersData || [])
        setFiction(fictionData || [])
        setNews([])
        setQuickNotes(notesData || [])
        setProgymnasmata(progymnasmataData || [])
        setLab([])
        setLectures([])
        setLinks([])
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  /* ═════════════════════════════════════════════════════════════════════════
     SEARCH LOGIC
     ═════════════════════════════════════════════════════════════════════════ */

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([])
      return
    }

    const query = searchQuery.toLowerCase()
    let results: SearchResult[] = []

    // Helper to check if item matches query
    const matchesQuery = (item: any, fields: string[]) => {
      return fields.some(field => {
        const value = item[field]
        if (Array.isArray(value)) {
          return value.some((v: string) => v?.toLowerCase().includes(query))
        }
        return value?.toLowerCase?.().includes(query)
      })
    }

    // Search posts
    results.push(...posts
      .filter(post => matchesQuery(post, ["title", "subtitle", "preview", "category", "tags"]) && post.state !== "hidden")
      .map(post => {
        const displayDate = (post.end_date && post.end_date.trim()) ? post.end_date : post.start_date
        return {
          title: post.title,
          subtitle: post.subtitle,
          preview: post.preview,
          date: displayDate,
          status: post.status || "Draft",
          category: post.category,
          path: `/blog/${new Date(displayDate).getFullYear()}/${post.slug}`,
          resultType: "post" as const,
        }
      }))

    // Search pages
    results.push(...pages
      .filter(page => matchesQuery(page, ["title", "subtitle", "preview"]))
      .map(page => ({
        title: page.title,
        subtitle: page.subtitle,
        preview: page.preview,
        date: page.date,
        status: page.status,
        path: page.path,
        resultType: "page" as const,
      })))

    // Search essays
    results.push(...essays
      .filter(essay => matchesQuery(essay, ["title", "subtitle", "preview", "tags", "category"]))
      .map(essay => ({
        title: essay.title,
        subtitle: essay.subtitle,
        preview: essay.preview,
        date: essay.date,
        status: essay.status || "Published",
        category: essay.category,
        path: `/essays/${essay.slug}`,
        resultType: "essay" as const,
      })))

    // Search papers
    results.push(...papers
      .filter(paper => paper.state !== "hidden" && matchesQuery(paper, ["title", "subtitle", "preview", "tags"]))
      .map(paper => ({
        title: paper.title,
        subtitle: paper.subtitle,
        preview: paper.preview,
        date: paper.date,
        status: paper.status || "Published",
        category: "Academic",
        path: `/papers/${paper.slug}`,
        resultType: "paper" as const,
      })))

    // Search fiction
    results.push(...fiction
      .filter(item => matchesQuery(item, ["title", "subtitle", "preview"]))
      .map(item => ({
        title: item.title,
        subtitle: item.subtitle,
        preview: item.preview,
        date: item.date,
        status: item.status || "Published",
        category: "Fiction",
        path: `/fiction/${item.slug}`,
        resultType: "fiction" as const,
      })))

    // Search news
    results.push(...news
      .filter(item => matchesQuery(item, ["title", "subtitle", "preview"]))
      .map(item => ({
        title: item.title,
        subtitle: item.subtitle,
        preview: item.preview,
        date: item.date,
        status: item.status || "Published",
        category: "News",
        path: `/news/${item.slug}`,
        resultType: "news" as const,
      })))

    // Search notes
    results.push(...quickNotes
      .filter(item => matchesQuery(item, ["title", "subtitle", "preview", "content"]))
      .map(item => ({
        title: item.title,
        subtitle: item.subtitle,
        preview: item.preview || item.content?.substring(0, 100),
        date: item.date,
        status: item.status || "Published",
        category: "Note",
        path: `/notes/${item.slug}`,
        resultType: "note" as const,
      })))

    // Search progymnasmata
    results.push(...progymnasmata
      .filter(item => matchesQuery(item, ["title", "preview"]))
      .map(item => ({
        title: item.title,
        subtitle: item.subtitle,
        preview: item.preview,
        date: item.date,
        status: item.status || "Published",
        category: "Progymnasmata",
        path: `/progymnasmata/${item.slug}`,
        resultType: "progymnasmata" as const,
      })))

    // Search lab
    results.push(...lab
      .filter(item => matchesQuery(item, ["title", "description", "tags"]))
      .map(item => ({
        title: item.title,
        preview: item.description,
        date: item.date,
        status: item.status || "Published",
        category: "Lab",
        path: `/lab/${item.slug}`,
        resultType: "lab" as const,
      })))

    // Search lectures
    results.push(...lectures
      .filter(item => matchesQuery(item, ["title", "description", "tags"]))
      .map(item => ({
        title: item.title,
        preview: item.description,
        date: item.date,
        status: item.status || "Published",
        category: "Lecture",
        path: `/lectures/${item.slug}`,
        resultType: "lecture" as const,
      })))

    // Search links
    results.push(...links
      .filter(item => matchesQuery(item, ["title", "description", "url", "tags"]))
      .map(item => ({
        title: item.title,
        preview: item.description,
        date: item.date || new Date().toISOString(),
        status: "Link",
        category: item.category || "External Link",
        path: item.url,
        resultType: "link" as const,
      })))

    // Sort by date and limit
    results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    setSearchResults(results.slice(0, 10))
  }, [searchQuery, posts, pages, essays, papers, fiction, news, quickNotes, progymnasmata, lab, lectures, links])

  /* ═════════════════════════════════════════════════════════════════════════
     EVENT HANDLERS
     ═════════════════════════════════════════════════════════════════════════ */

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  // Escape key to close search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSearchOpen) {
        closeSearch()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isSearchOpen])

  // Create modal for external links
  const createModal = useCallback((url: string, title: string, x: number, y: number) => {
    window.dispatchEvent(new CustomEvent("openUniversalLinkModal", {
      detail: { url, title, x, y }
    }))
    setIsSearchOpen(false)
    setIsOpen(false)
    setSearchQuery("")
  }, [])

  /* ═════════════════════════════════════════════════════════════════════════
     ACTION HANDLERS
     ═════════════════════════════════════════════════════════════════════════ */

  const toggleDropdown = () => {
    setSpinDirection(isOpen ? "right" : "left")
    setIsOpen(!isOpen)
    setTimeout(() => setSpinDirection(null), 600)
    if (!isOpen) {
      setIsSearchOpen(false)
      setSearchQuery("")
    }
  }

  const toggleSearch = () => {
    setIsSearchOpen(true)
    setIsOpen(false)
  }

  const toggleMaximize = () => {
    const newMaximizedState = !isMaximized
    setIsMaximized(newMaximizedState)

    if (newMaximizedState && searchWindowRef.current) {
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight
      const modalWidth = windowWidth * 0.9
      const modalHeight = windowHeight * 0.9

      x.set((windowWidth - modalWidth) / 2)
      y.set((windowHeight - modalHeight) / 2)
    }
  }

  const closeSearch = () => {
    setIsSearchOpen(false)
    setIsMaximized(false)
    setSearchQuery("")
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchResults.length > 0) {
      const firstResult = searchResults[0]
      if (firstResult.resultType === "link" && firstResult.path?.startsWith("http")) {
        createModal(firstResult.path, firstResult.title, window.innerWidth / 2, window.innerHeight / 2)
      } else {
        router.push(firstResult.path)
      }
      setIsSearchOpen(false)
      setIsOpen(false)
      setSearchQuery("")
    }
  }

  const openExternal = (url: string) => {
    window.open(url, "_blank")
    setIsOpen(false)
  }

  /* ═════════════════════════════════════════════════════════════════════════
     RENDER: MENU BUTTON
     ═════════════════════════════════════════════════════════════════════════ */

  const MenuButton = ({ onClick, icon: Icon, label }: { onClick: () => void; icon: any; label: string }) => (
    <button
      onClick={onClick}
      className="relative flex h-8 w-8 items-center justify-center p-2 hover:bg-accent hover:text-accent-foreground"
      aria-label={label}
    >
      <Icon className="h-4 w-4" />
    </button>
  )

  /* ═════════════════════════════════════════════════════════════════════════
     RENDER: SETTINGS MODAL
     ═════════════════════════════════════════════════════════════════════════ */

  const SettingsModal = () => (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md border border-border bg-background shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold">User Settings</h2>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="p-1 hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Sidenotes Setting */}
          <div className="border border-border p-4">
            <div className="flex items-center space-x-2 mb-3">
              <PanelRightOpen className="h-4 w-4" />
              <label className="text-sm font-medium">Margin Notes</label>
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="sidenotesMode"
                  checked={!sidenotesEnabled}
                  onChange={() => toggleSidenotes(false)}
                  className="h-4 w-4"
                  style={{ accentColor: "hsl(var(--foreground))" }}
                />
                <span className="text-sm">Off (footnotes only)</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="sidenotesMode"
                  checked={sidenotesEnabled}
                  onChange={() => toggleSidenotes(true)}
                  className="h-4 w-4"
                  style={{ accentColor: "hsl(var(--foreground))" }}
                />
                <span className="text-sm">On (show in margins on wide screens)</span>
              </label>
            </div>

            <p className="text-xs text-muted-foreground mt-3">
              Display footnotes as margin sidenotes on wide viewports (1200px+).
            </p>
          </div>

          {/* Link Preview Setting */}
          <div className="border border-border p-4">
            <div className="flex items-center space-x-2 mb-3">
              <ExternalLink className="h-4 w-4" />
              <label className="text-sm font-medium">Link Previews</label>
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="linkModalMode"
                  checked={universalLinkModalMode === "all"}
                  onChange={() => setLinkModalMode("all")}
                  className="h-4 w-4"
                  style={{ accentColor: "hsl(var(--foreground))" }}
                />
                <span className="text-sm">All links (internal & external)</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="linkModalMode"
                  checked={universalLinkModalMode === "external"}
                  onChange={() => setLinkModalMode("external")}
                  className="h-4 w-4"
                  style={{ accentColor: "hsl(var(--foreground))" }}
                />
                <span className="text-sm">External links only</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="linkModalMode"
                  checked={universalLinkModalMode === "off"}
                  onChange={() => setLinkModalMode("off")}
                  className="h-4 w-4"
                  style={{ accentColor: "hsl(var(--foreground))" }}
                />
                <span className="text-sm">Off (no previews)</span>
              </label>
            </div>

            <p className="text-xs text-muted-foreground mt-3">
              Show preview popups when hovering over links.
            </p>
          </div>

          {/* Color Theme Setting */}
          <div className="border border-border p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Palette className="h-4 w-4" />
              <label className="text-sm font-medium">Color Theme</label>
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="colorTheme"
                  checked={colorTheme === "default"}
                  onChange={() => setAndApplyColorTheme("default")}
                  className="h-4 w-4"
                  style={{ accentColor: "hsl(var(--foreground))" }}
                />
                <span className="text-sm">Default (100 Whites)</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="colorTheme"
                  checked={colorTheme === "solarized"}
                  onChange={() => setAndApplyColorTheme("solarized")}
                  className="h-4 w-4"
                  style={{ accentColor: "hsl(var(--foreground))" }}
                />
                <span className="text-sm">Solarized</span>
              </label>
            </div>

            <p className="text-xs text-muted-foreground mt-3">
              Works with both light and dark modes.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border px-6 py-4">
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="w-full border border-border px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )

  /* ═════════════════════════════════════════════════════════════════════════
     RENDER: SEARCH WINDOW
     ═════════════════════════════════════════════════════════════════════════ */

  const SearchWindow = () => (
    <>
      {isMaximized && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={closeSearch} />
      )}
      <div className="fixed inset-0 z-50 pointer-events-none">
        <motion.div
          ref={searchWindowRef}
          drag={!isMaximized}
          dragMomentum={false}
          dragConstraints={getConstraints()}
          style={{ x, y }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`absolute bg-background border border-border shadow-md overflow-hidden pointer-events-auto ${
            isMaximized ? "w-[90vw] h-[90vh]" : "w-[600px]"
          }`}
        >
          {/* Title Bar */}
          <div className="search-handle flex h-10 items-center justify-between border-b border-border bg-muted/50 px-3 cursor-move">
            <div className="flex items-center space-x-2">
              <button onClick={closeSearch} className="p-1 hover:bg-accent hover:text-accent-foreground" aria-label="Close">
                <X className="h-3 w-3" />
              </button>
              <button onClick={toggleMaximize} className="p-1 hover:bg-accent hover:text-accent-foreground" aria-label="Maximize">
                <Maximize className="h-3 w-3" />
              </button>
            </div>
            <div className="flex-1 text-center text-sm font-medium">krisyotam.com search</div>
            <div className="flex items-center">
              <Move className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* Search Input */}
          <div className="flex border-b border-border">
            <div className="flex-1 p-2">
              <form onSubmit={handleSearchSubmit} className="flex">
                <input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="search..."
                  className="flex h-9 w-full border-l border-y border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
                <button
                  type="submit"
                  className="inline-flex h-9 items-center justify-center border-r border-y border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
                >
                  Search
                </button>
              </form>
            </div>
          </div>

          {/* Results */}
          <div className={`${isMaximized ? "max-h-[calc(90vh-120px)]" : "max-h-[300px]"} overflow-y-auto`}>
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="p-2">
                {searchResults.map((result, index) => (
                  <Link
                    key={index}
                    href={result.path}
                    onClick={() => {
                      setIsSearchOpen(false)
                      setIsOpen(false)
                    }}
                    className="block px-3 py-2 hover:bg-accent hover:text-accent-foreground"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">{result.title}</h4>
                      <span className="ml-2 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {result.resultType === "post" ? result.category : result.resultType}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{result.preview}</p>
                    <div className="mt-1 flex items-center text-xs text-muted-foreground">
                      <span>{new Date(result.date).toLocaleDateString()}</span>
                      <span className="mx-1">•</span>
                      <span>{result.status}</span>
                      <span className="mx-1">•</span>
                      <span className="text-xs text-muted-foreground truncate">{result.path}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : searchQuery.trim() !== "" ? (
              <div className="p-4 text-center text-sm text-muted-foreground">No results found</div>
            ) : null}
          </div>
        </motion.div>
      </div>
    </>
  )

  /* ═════════════════════════════════════════════════════════════════════════
     RENDER: MAIN COMPONENT
     ═════════════════════════════════════════════════════════════════════════ */

  return (
    <div className="fixed top-5 right-5 z-50" ref={dropdownRef}>
      {/* Main Settings Button */}
      <button
        onClick={toggleDropdown}
        className="flex h-10 w-10 items-center justify-center border border-input bg-background shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
        aria-label="Settings"
      >
        <span className={
          spinDirection === "left"
            ? "inline-block transition-transform duration-600 ease-in-out animate-spin-left"
            : spinDirection === "right"
            ? "inline-block transition-transform duration-600 ease-in-out animate-spin-right"
            : ""
        }>
          <Settings className="h-5 w-5" />
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-10 border border-border bg-background shadow-md">
          <div className="flex flex-col items-center p-1">
            <MenuButton onClick={toggleSearch} icon={Search} label="Search" />

            {/* Link Preview Options */}
            <div className="relative">
              <button
                ref={linkOptionRef}
                onMouseEnter={showSubmenu}
                onMouseLeave={hideSubmenuWithDelay}
                className="relative flex h-8 w-8 items-center justify-center p-2 hover:bg-accent hover:text-accent-foreground"
                aria-label="Link Preview Settings"
              >
                <ExternalLink className="h-4 w-4" />

                {/* Invisible hover bridge */}
                {isLinkHoverMenuVisible && (
                  <span
                    className="absolute right-0 w-12 h-full z-10"
                    onMouseEnter={showSubmenu}
                    onMouseLeave={hideSubmenuWithDelay}
                  />
                )}

                {/* Submenu */}
                {isLinkHoverMenuVisible && (
                  <div
                    ref={linkSubmenuRef}
                    className="absolute right-full top-0 mr-2 w-auto min-w-max bg-background border border-border shadow-md p-1"
                    onMouseEnter={showSubmenu}
                    onMouseLeave={hideSubmenuWithDelay}
                  >
                    <div className="text-xs font-medium px-2 py-1 mb-1 border-b border-border">Link Preview</div>
                    {(["all", "external", "off"] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setLinkModalMode(mode)}
                        className={`flex items-center justify-between w-full text-left px-2 py-1 text-xs hover:bg-accent hover:text-accent-foreground ${
                          universalLinkModalMode === mode ? "font-medium bg-accent/30" : ""
                        }`}
                      >
                        <span>{mode === "all" ? "All Links" : mode === "external" ? "External Only" : "Off"}</span>
                        {universalLinkModalMode === mode && <span className="text-primary">✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </button>
            </div>

            <MenuButton onClick={() => { setIsSettingsOpen(true); setIsOpen(false) }} icon={Settings} label="User Settings" />
            <MenuButton onClick={() => openExternal("https://krisyotam.substack.com/?utm_campaign=profile_chips")} icon={Rss} label="RSS Feed" />
            <MenuButton onClick={() => openExternal("/faq")} icon={CircleHelp} label="FAQ" />
            <MenuButton onClick={() => openExternal("/changelog")} icon={GitCompare} label="Changelog" />
            <MenuButton onClick={() => openExternal("https://github.com/krisyotam")} icon={Github} label="GitHub" />
          </div>
        </div>
      )}

      {/* Modals */}
      {isSettingsOpen && <SettingsModal />}
      {isSearchOpen && <SearchWindow />}
    </div>
  )
}

export default SettingsMenu

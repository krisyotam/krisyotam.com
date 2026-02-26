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
 * ║  • Global search across all content types via /api/search                 ║
 * ║  • Gwern-inspired clean search overlay                                    ║
 * ║  • User preferences (link previews, color themes, sidenotes)              ║
 * ║  • Quick access to RSS, FAQ, Changelog, and GitHub                        ║
 * ║  • Keyboard shortcuts (Escape to close)                                   ║
 * ║                                                                           ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import {
  Search, Settings, Rss, X,
  CircleHelp, GitCompare, Github, ExternalLink,
  Palette, PanelRightOpen
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import "./search.css"

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════ */

interface SearchItem {
  title: string
  preview: string
  slug: string
  type: string
  category: string
  tags: string[]
  start_date: string
  url: string
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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isLinkHoverMenuVisible, setIsLinkHoverMenuVisible] = useState(false)

  /* ─── Search State ───────────────────────────────────────────────────────── */
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchItem[]>([])
  const [content, setContent] = useState<SearchItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  /* ─── User Settings State ────────────────────────────────────────────────── */
  const [universalLinkModalEnabled, setUniversalLinkModalEnabled] = useState(true)
  const [universalLinkModalMode, setUniversalLinkModalMode] = useState<LinkModalMode>("external")
  const [colorTheme, setColorTheme] = useState<ColorTheme>("default")
  const [sidenotesEnabled, setSidenotesEnabled] = useState(false) // Default OFF

  /* ─── Refs ───────────────────────────────────────────────────────────────── */
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const linkOptionRef = useRef<HTMLButtonElement>(null)
  const linkSubmenuRef = useRef<HTMLDivElement>(null)
  const hideSubmenuTimerRef = useRef<NodeJS.Timeout | null>(null)

  /* ─── Hooks ──────────────────────────────────────────────────────────────── */
  const router = useRouter()
  const { theme } = useTheme()

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
     DATA FETCHING
     ═════════════════════════════════════════════════════════════════════════ */

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const res = await fetch("/api/search")
        if (!res.ok) {
          console.warn(`Search API returned ${res.status}`)
          return
        }
        const data: SearchItem[] = await res.json()
        setContent(data)
      } catch (error) {
        console.error("Error fetching search data:", error)
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

    const matchesQuery = (item: SearchItem) => {
      if (item.title?.toLowerCase().includes(query)) return true
      if (item.preview?.toLowerCase().includes(query)) return true
      if (item.category?.toLowerCase().includes(query)) return true
      if (item.type?.toLowerCase().includes(query)) return true
      if (item.tags?.some(t => t.toLowerCase().includes(query))) return true
      return false
    }

    const results = content
      .filter(matchesQuery)
      .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())
      .slice(0, 15)

    setSearchResults(results)
  }, [searchQuery, content])

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

  const closeSearch = () => {
    setIsSearchOpen(false)
    setSearchQuery("")
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchResults.length > 0) {
      const first = searchResults[0]
      router.push(first.url)
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

      {/* Search overlay — inlined to avoid remount on state change */}
      {/* Critical positioning via inline styles so HMR can't break layout */}
      {isSearchOpen && (
        <>
          <div
            className="search-overlay"
            style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.2)" }}
            onClick={closeSearch}
          />
          <div
            className="search-container"
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 51,
              width: 560,
              maxWidth: "calc(100vw - 2rem)",
              maxHeight: "calc(100vh - 4rem)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <form onSubmit={handleSearchSubmit} className="search-form">
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    e.preventDefault()
                    e.stopPropagation()
                    closeSearch()
                  }
                }}
                placeholder="search..."
                className="search-input"
              />
              <button type="submit" className="search-btn">
                Search
              </button>
            </form>
            <div className="search-results">
              {isLoading ? (
                <div className="search-loading">Loading...</div>
              ) : searchResults.length > 0 ? (
                searchResults.map((item, index) => (
                  <Link
                    key={index}
                    href={item.url}
                    onClick={() => {
                      setIsSearchOpen(false)
                      setIsOpen(false)
                      setSearchQuery("")
                    }}
                    className="search-result-link"
                  >
                    <div className="search-result-header">
                      <h4 className="search-result-title">{item.title}</h4>
                      <span className="search-result-type">{item.type}</span>
                    </div>
                    {item.preview && (
                      <p className="search-result-preview">{item.preview}</p>
                    )}
                    <div className="search-result-meta">
                      {item.start_date && new Date(item.start_date).toLocaleDateString()}
                      {item.category && <> &middot; {item.category}</>}
                    </div>
                  </Link>
                ))
              ) : searchQuery.trim() !== "" ? (
                <div className="search-empty">No results found</div>
              ) : null}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default SettingsMenu

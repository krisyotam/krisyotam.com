"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Search, Settings, Rss, X, Maximize, Move, CircleHelp, GitCompare, Code, Github, Link2, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { motion, useMotionValue } from "framer-motion"

interface Post {
  title: string
  subtitle: string
  preview: string
  date: string
  tags: string[]
  category: string
  slug: string
  status: string
  confidence: string
  importance: number
  state: string
}

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
  resultType: "post" | "page" | "category"
}

export function SettingsMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [pages, setPages] = useState<Page[]>([])
  const [searchFilter, setSearchFilter] = useState<"all" | "posts" | "pages">("all")
  const [isMaximized, setIsMaximized] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [universalLinkModalEnabled, setUniversalLinkModalEnabled] = useState(true)
  const [universalLinkModalMode, setUniversalLinkModalMode] = useState<"all" | "external" | "off">("external")
  const [isLinkHoverMenuVisible, setIsLinkHoverMenuVisible] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchWindowRef = useRef<HTMLDivElement>(null)
  const linkOptionRef = useRef<HTMLButtonElement>(null)
  const linkSubmenuRef = useRef<HTMLDivElement>(null)
  const hideSubmenuTimerRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()
  const { theme } = useTheme()

  // Use motion values for position
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Functions to handle submenu visibility
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
    }, 300) // 300ms delay to allow moving to submenu
  }

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (hideSubmenuTimerRef.current) {
        clearTimeout(hideSubmenuTimerRef.current)
      }
    }
  }, [])

  // Load universal link modal settings from localStorage
  useEffect(() => {
    const storedSetting = localStorage.getItem("settings_universalLinkModal")
    if (storedSetting !== null) {
      setUniversalLinkModalEnabled(storedSetting === "true")
    }
    
    const storedMode = localStorage.getItem("settings_universalLinkModalMode")
    if (storedMode !== null && ["all", "external", "off"].includes(storedMode)) {
      setUniversalLinkModalMode(storedMode as "all" | "external" | "off")
    }
  }, [])

  // Toggle universal link modal setting
  const toggleUniversalLinkModal = () => {
    const newValue = !universalLinkModalEnabled
    setUniversalLinkModalEnabled(newValue)
    localStorage.setItem("settings_universalLinkModal", String(newValue))
  }

  // Set universal link modal mode
  const setLinkModalMode = (mode: "all" | "external" | "off") => {
    setUniversalLinkModalMode(mode)
    localStorage.setItem("settings_universalLinkModalMode", mode)
    
    // Also update enabled state based on mode
    const isEnabled = mode !== "off"
    setUniversalLinkModalEnabled(isEnabled)
    localStorage.setItem("settings_universalLinkModal", String(isEnabled))
    
    // Hide the hover menu after selection
    setIsLinkHoverMenuVisible(false)
  }

  // Set initial position when search window opens
  useEffect(() => {
    if (isSearchOpen && !isMaximized && searchWindowRef.current) {
      // Position in the center of the screen
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight
      const modalWidth = 600
      const modalHeight = 400

      const centerX = (windowWidth - modalWidth) / 2
      const centerY = (windowHeight - modalHeight) / 3

      x.set(centerX)
      y.set(centerY)
    }
  }, [isSearchOpen, isMaximized, x, y])

  // Fetch posts and pages
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch posts
        const postsResponse = await fetch("/api/posts/search")
        const postsData = await postsResponse.json()
        setPosts(postsData)

        // Fetch pages
        const directoryResponse = await fetch("/api/directory")
        const directoryData = await directoryResponse.json()
        setPages(directoryData.pages.filter((page: Page) => page["show-status"] === "active"))
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([])
      return
    }

    const query = searchQuery.toLowerCase()
    let results: SearchResult[] = []

    // Search posts if filter is "all" or "posts"
    if (searchFilter === "all" || searchFilter === "posts") {
      const filteredPosts = posts
        .filter((post) => {
          const matchesTitle = post.title.toLowerCase().includes(query)
          const matchesSubtitle = post.subtitle?.toLowerCase().includes(query)
          const matchesPreview = post.preview?.toLowerCase().includes(query)
          const matchesCategory = post.category?.toLowerCase().includes(query)
          const matchesTags = post.tags?.some((tag) => tag.toLowerCase().includes(query))

          return (
            (matchesTitle || matchesSubtitle || matchesPreview || matchesCategory || matchesTags) &&
            post.state !== "hidden"
          )
        })
        .map((post) => ({
          title: post.title,
          subtitle: post.subtitle,
          preview: post.preview,
          date: post.date,
          status: post.status,
          category: post.category,
          path: `/blog/${new Date(post.date).getFullYear()}/${post.slug}`,
          resultType: "post" as const,
        }))

      results = [...results, ...filteredPosts]
    }

    // Search pages if filter is "all" or "pages"
    if (searchFilter === "all" || searchFilter === "pages") {
      const filteredPages = pages
        .filter((page) => {
          const matchesTitle = page.title.toLowerCase().includes(query)
          const matchesSubtitle = page.subtitle?.toLowerCase().includes(query)
          const matchesPreview = page.preview?.toLowerCase().includes(query)

          return matchesTitle || matchesSubtitle || matchesPreview
        })
        .map((page) => ({
          title: page.title,
          subtitle: page.subtitle,
          preview: page.preview,
          date: page.date,
          status: page.status,
          path: page.path,
          resultType: "page" as const,
        }))

      results = [...results, ...filteredPages]
    }

    // Sort by date (newest first) and limit to 5 results
    results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    setSearchResults(results.slice(0, 5))
  }, [searchQuery, posts, pages, searchFilter])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Focus search input when search is opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  // Handle escape key to close search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSearchOpen) {
        closeSearch()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isSearchOpen])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchResults.length > 0) {
      const firstResult = searchResults[0]
      router.push(firstResult.path)
      setIsSearchOpen(false)
      setIsOpen(false)
      setSearchQuery("")
    }
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setIsSearchOpen(false)
      setSearchQuery("")
    }
  }

  const toggleSearch = () => {
    setIsSearchOpen(true)
    setIsOpen(false)
  }

  const openRSS = () => {
    window.open("/rss.xml", "_blank")
    setIsOpen(false)
  }

  const openFAQ = () => {
    window.open("/faq", "_blank")
    setIsOpen(false)
  }

  const openChangelog = () => {
    window.open("/changelog", "_blank")
    setIsOpen(false)
  }

  const openScripts = () => {
    window.open("/scripts", "_blank")
    setIsOpen(false)
  }

  const openGithub = () => {
    window.open("https://github.com/krisyotam", "_blank")
    setIsOpen(false)
  }

  const openSettings = () => {
    setIsSettingsOpen(true)
    setIsOpen(false)
  }

  const toggleMaximize = () => {
    const newMaximizedState = !isMaximized
    setIsMaximized(newMaximizedState)

    // If maximizing, center the window
    if (newMaximizedState && searchWindowRef.current) {
      // Calculate center position for the window
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight
      const modalWidth = windowWidth * 0.9
      const modalHeight = windowHeight * 0.9

      const centerX = (windowWidth - modalWidth) / 2
      const centerY = (windowHeight - modalHeight) / 2

      // Set the position
      x.set(centerX)
      y.set(centerY)
    }
  }

  const closeSearch = () => {
    setIsSearchOpen(false)
    setIsMaximized(false)
    setSearchQuery("")
  }

  // Calculate constraints to keep modal on screen
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

  return (
    <div className="fixed top-5 right-5 z-50" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
        aria-label="Settings"
      >
        <Settings className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-10 rounded-md border border-border bg-background shadow-md">
          <div className="flex flex-col items-center p-1">
            <button
              onClick={toggleSearch}
              className="group relative flex h-8 w-8 items-center justify-center rounded-md p-2 hover:bg-accent hover:text-accent-foreground"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
              <span className="absolute right-full mr-2 w-auto min-w-max rounded bg-black px-2 py-1 text-xs font-medium text-white opacity-0 shadow transition-opacity group-hover:opacity-100 dark:bg-white dark:text-black">
                Search
              </span>
            </button>
            
            {/* Link Modal Options with improved hover handling */}
            <div className="relative pointer-events-none">
              <button
                ref={linkOptionRef}
                onMouseEnter={showSubmenu}
                onMouseLeave={hideSubmenuWithDelay}
                className="group relative flex h-8 w-8 items-center justify-center rounded-md p-2 hover:bg-accent hover:text-accent-foreground pointer-events-auto"
                aria-label="Link Preview Settings"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="absolute right-full mr-2 w-auto min-w-max rounded bg-black px-2 py-1 text-xs font-medium text-white opacity-0 shadow transition-opacity group-hover:opacity-100 dark:bg-white dark:text-black">
                  Link Preview
                </span>
                
                {/* Invisible bridge/buffer to prevent hover-gap issues */}
                {isLinkHoverMenuVisible && (
                  <span 
                    className="absolute right-0 w-12 h-[100%] z-10 pointer-events-auto"
                    onMouseEnter={showSubmenu}
                    onMouseLeave={hideSubmenuWithDelay}
                  ></span>
                )}
                
                {/* Hover submenu */}
                {isLinkHoverMenuVisible && (
                  <div
                    ref={linkSubmenuRef}
                    className="absolute right-full top-0 mr-2 w-auto min-w-max bg-background rounded-md border border-border shadow-md p-1 pointer-events-auto"
                    onMouseEnter={showSubmenu}
                    onMouseLeave={hideSubmenuWithDelay}
                  >
                    <div className="text-xs font-medium px-2 py-1 mb-1 border-b border-border">Link Preview Mode</div>
                    <button
                      onClick={() => setLinkModalMode("all")}
                      className={`flex items-center justify-between w-full text-left px-2 py-1 text-xs rounded hover:bg-accent hover:text-accent-foreground ${universalLinkModalMode === "all" ? "font-medium bg-accent/30" : ""}`}
                    >
                      <span>All Links</span>
                      {universalLinkModalMode === "all" && <span className="text-primary">✓</span>}
                    </button>
                    <button
                      onClick={() => setLinkModalMode("external")}
                      className={`flex items-center justify-between w-full text-left px-2 py-1 text-xs rounded hover:bg-accent hover:text-accent-foreground ${universalLinkModalMode === "external" ? "font-medium bg-accent/30" : ""}`}
                    >
                      <span>External Only</span>
                      {universalLinkModalMode === "external" && <span className="text-primary">✓</span>}
                    </button>
                    <button
                      onClick={() => setLinkModalMode("off")}
                      className={`flex items-center justify-between w-full text-left px-2 py-1 text-xs rounded hover:bg-accent hover:text-accent-foreground ${universalLinkModalMode === "off" ? "font-medium bg-accent/30" : ""}`}
                    >
                      <span>Off</span>
                      {universalLinkModalMode === "off" && <span className="text-primary">✓</span>}
                    </button>
                  </div>
                )}
              </button>
            </div>
            
            <button
              onClick={openSettings}
              className="group relative flex h-8 w-8 items-center justify-center rounded-md p-2 hover:bg-accent hover:text-accent-foreground"
              aria-label="User Settings"
            >
              <Settings className="h-4 w-4" />
              <span className="absolute right-full mr-2 w-auto min-w-max rounded bg-black px-2 py-1 text-xs font-medium text-white opacity-0 shadow transition-opacity group-hover:opacity-100 dark:bg-white dark:text-black">
                User Settings
              </span>
            </button>
            <button
              onClick={openRSS}
              className="group relative flex h-8 w-8 items-center justify-center rounded-md p-2 hover:bg-accent hover:text-accent-foreground"
              aria-label="RSS Feed"
            >
              <Rss className="h-4 w-4" />
              <span className="absolute right-full mr-2 w-auto min-w-max rounded bg-black px-2 py-1 text-xs font-medium text-white opacity-0 shadow transition-opacity group-hover:opacity-100 dark:bg-white dark:text-black">
                View RSS.xml
              </span>
            </button>
            <button
              onClick={openFAQ}
              className="group relative flex h-8 w-8 items-center justify-center rounded-md p-2 hover:bg-accent hover:text-accent-foreground"
              aria-label="FAQ"
            >
              <CircleHelp className="h-4 w-4" />
              <span className="absolute right-full mr-2 w-auto min-w-max rounded bg-black px-2 py-1 text-xs font-medium text-white opacity-0 shadow transition-opacity group-hover:opacity-100 dark:bg-white dark:text-black">
                FAQ
              </span>
            </button>
            <button
              onClick={openChangelog}
              className="group relative flex h-8 w-8 items-center justify-center rounded-md p-2 hover:bg-accent hover:text-accent-foreground"
              aria-label="Changelog"
            >
              <GitCompare className="h-4 w-4" />
              <span className="absolute right-full mr-2 w-auto min-w-max rounded bg-black px-2 py-1 text-xs font-medium text-white opacity-0 shadow transition-opacity group-hover:opacity-100 dark:bg-white dark:text-black">
                Changelog
              </span>
            </button>
            <button
              onClick={openScripts}
              className="group relative flex h-8 w-8 items-center justify-center rounded-md p-2 hover:bg-accent hover:text-accent-foreground"
              aria-label="Scripts"
            >
              <Code className="h-4 w-4" />
              <span className="absolute right-full mr-2 w-auto min-w-max rounded bg-black px-2 py-1 text-xs font-medium text-white opacity-0 shadow transition-opacity group-hover:opacity-100 dark:bg-white dark:text-black">
                Scripts
              </span>
            </button>
            <button
              onClick={openGithub}
              className="group relative flex h-8 w-8 items-center justify-center rounded-md p-2 hover:bg-accent hover:text-accent-foreground"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
              <span className="absolute right-full mr-2 w-auto min-w-max rounded bg-black px-2 py-1 text-xs font-medium text-white opacity-0 shadow transition-opacity group-hover:opacity-100 dark:bg-white dark:text-black">
                GitHub
              </span>
            </button>
          </div>
        </div>
      )}

      {/* User Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg border border-border bg-background p-6 shadow-lg">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="text-lg font-semibold">User Settings</h2>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="rounded-full p-1 hover:bg-accent hover:text-accent-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 py-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <ExternalLink className="h-4 w-4" />
                    <label className="text-sm font-medium">
                      Link Preview Modal
                    </label>
                  </div>
                </div>
                
                <div className="ml-6 space-y-2">
                  <label className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      name="linkModalMode" 
                      checked={universalLinkModalMode === "all"} 
                      onChange={() => setLinkModalMode("all")}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">All links (internal & external)</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      name="linkModalMode" 
                      checked={universalLinkModalMode === "external"} 
                      onChange={() => setLinkModalMode("external")}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">External links only</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      name="linkModalMode" 
                      checked={universalLinkModalMode === "off"} 
                      onChange={() => setLinkModalMode("off")}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">Off (no link previews)</span>
                  </label>
                </div>
                
                <p className="text-xs text-muted-foreground mt-2">
                  Configure how the link preview modal works when you hover over links on the site.
                </p>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {isSearchOpen && (
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
              className={`absolute bg-background border border-border rounded-md shadow-md overflow-hidden pointer-events-auto ${
                isMaximized ? "w-[90vw] h-[90vh]" : "w-[600px]"
              }`}
            >
              <div className="search-handle flex h-10 items-center justify-between border-b border-border bg-muted/50 px-3 cursor-move">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={closeSearch}
                    className="rounded-full p-1 hover:bg-accent hover:text-accent-foreground"
                    aria-label="Close"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <button
                    onClick={toggleMaximize}
                    className="rounded-full p-1 hover:bg-accent hover:text-accent-foreground"
                    aria-label="Maximize"
                  >
                    <Maximize className="h-3 w-3" />
                  </button>
                </div>
                <div className="flex-1 text-center text-sm font-medium">KrisYotam.com Search</div>
                <div className="flex items-center">
                  <Move className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="flex border-b border-border">
                <div className="flex-1 p-2">
                  <form onSubmit={handleSearchSubmit} className="flex">
                    <input
                      ref={searchInputRef}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="KrisYotam.com search"
                      className="flex h-9 w-full rounded-l-md border border-r-0 border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      className="inline-flex h-9 items-center justify-center rounded-r-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    >
                      Search
                    </button>
                  </form>
                </div>
              </div>

              <div className="border-b border-border p-2">
                <div className="text-xs text-muted-foreground">Search in:</div>
                <div className="mt-1 flex items-center space-x-4">
                  <label className="flex items-center space-x-1">
                    <input
                      type="radio"
                      name="searchFilter"
                      checked={searchFilter === "all"}
                      onChange={() => setSearchFilter("all")}
                      className="h-3.5 w-3.5 rounded-full border-muted-foreground"
                    />
                    <span className="text-sm">All</span>
                  </label>
                  <label className="flex items-center space-x-1">
                    <input
                      type="radio"
                      name="searchFilter"
                      checked={searchFilter === "posts"}
                      onChange={() => setSearchFilter("posts")}
                      className="h-3.5 w-3.5 rounded-full border-muted-foreground"
                    />
                    <span className="text-sm">Posts only</span>
                  </label>
                  <label className="flex items-center space-x-1">
                    <input
                      type="radio"
                      name="searchFilter"
                      checked={searchFilter === "pages"}
                      onChange={() => setSearchFilter("pages")}
                      className="h-3.5 w-3.5 rounded-full border-muted-foreground"
                    />
                    <span className="text-sm">Pages only</span>
                  </label>
                </div>
              </div>

              <div className={`${isMaximized ? "max-h-[calc(90vh-120px)]" : "max-h-[300px]"} overflow-y-auto`}>
                {searchResults.length > 0 ? (
                  <div className="p-2">
                    {searchResults.map((result, index) => (
                      <Link
                        key={index}
                        href={result.path}
                        onClick={() => {
                          setIsSearchOpen(false)
                          setIsOpen(false)
                        }}
                        className="block rounded-md px-3 py-2 hover:bg-accent hover:text-accent-foreground"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">{result.title}</h4>
                          <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
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
      )}
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Search, Settings, Rss, X, Maximize, Move, CircleHelp, GitCompare, Code, Github, Link2, ExternalLink, ChevronDown } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { motion, useMotionValue } from "framer-motion"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Post } from "@/utils/posts"

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
  resultType: "post" | "page" | "category" | "essay" | "paper" | "fiction" | "news" | "conspiracy" | "note" | "problem" | "progymnasmata" | "prompt" | "script" | "lab" | "lecture" | "link"
}

export function SettingsMenu() {
  const [spinDirection, setSpinDirection] = useState<"left"|"right"|null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [pages, setPages] = useState<Page[]>([])
  const [essays, setEssays] = useState<any[]>([])
  const [papers, setPapers] = useState<any[]>([])
  const [fiction, setFiction] = useState<any[]>([])
  const [news, setNews] = useState<any[]>([])
  const [conspiracies, setConspiracies] = useState<any[]>([])
  const [quickNotes, setQuickNotes] = useState<any[]>([])
  const [problems, setProblems] = useState<any[]>([])
  const [progymnasmata, setProgymnasmata] = useState<any[]>([])
  const [prompts, setPrompts] = useState<any[]>([])
  const [scripts, setScripts] = useState<any[]>([])
  const [lab, setLab] = useState<any[]>([])
  const [lectures, setLectures] = useState<any[]>([])
  const [links, setLinks] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchFilter, setSearchFilter] = useState<
    "all" | "posts" | "pages" | "bible" | "essays" | "papers" | "fiction" | "news" | "conspiracies" | "notes" | "problems" | "progymnasmata" | "prompts" | "scripts" | "lab" | "lectures" | "links" | "academic" | "misc"
  >("all")
  const [bibleVersion, setBibleVersion] = useState<string>("NKJV")
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

  // Helper function to safely fetch data from an API endpoint
  const safelyFetchData = async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`Failed to fetch from ${url}: ${response.status}`);
        return [];
      }
      return await response.json();
    } catch (error) {
      console.warn(`Error fetching data from ${url}:`, error);
      return [];
    }
  };

  // Fetch posts and pages
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch data from all sources in parallel
        const [
          postsData,
          directoryData,
          essaysData,
          papersData,
          fictionData,
          newsData,
          conspiraciesData,
          notesData,
          problemsData,
          progymnasmataData,
          promptsData,
          scriptsData,
          labData,
          lecturesData,
          linksData,
        ] = await Promise.all([
          safelyFetchData("/api/posts/search"),
          safelyFetchData("/api/directory"),
          safelyFetchData("/api/essays/essays"),
          safelyFetchData("/api/papers"),
          safelyFetchData("/api/fiction/fiction"),
          safelyFetchData("/api/news"),
          safelyFetchData("/api/conspiracies"),
          safelyFetchData("/api/notes"),
          safelyFetchData("/api/problems"),
          safelyFetchData("/api/progymnasmata"),
          safelyFetchData("/api/prompts"),
          safelyFetchData("/api/scripts"),
          safelyFetchData("/api/lab/labs"),
          safelyFetchData("/api/lectures"),
          safelyFetchData("/api/links"),
        ]);
        
        // Set state for each data type
        setPosts(postsData || []);
        setPages(directoryData?.pages?.filter((page: Page) => page["show-status"] === "active") || []);
        setEssays(essaysData || []);
        setPapers(papersData || []);
        setFiction(fictionData || []);
        setNews(newsData || []);
        setConspiracies(conspiraciesData || []);
        setQuickNotes(notesData || []);
        setProblems(problemsData || []);
        setProgymnasmata(progymnasmataData || []);
        setPrompts(promptsData || []);
        setScripts(scriptsData || []);
        setLab(labData || []);
        setLectures(lecturesData || []);
        setLinks(linksData || []);
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false);
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
          const matchesTags = post.tags?.some((tag: string) => tag.toLowerCase().includes(query))

          return (
            (matchesTitle || matchesSubtitle || matchesPreview || matchesCategory || matchesTags) &&
            post.state !== "hidden"
          )
        })
        .map((post) => {
          const displayDate = (post.end_date && post.end_date.trim()) ? post.end_date : post.start_date;
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
        })

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
    
    // Search essays if filter is "all" or "essays"
    if (searchFilter === "all" || searchFilter === "essays") {
      const filteredEssays = essays
        .filter((essay) => {
          const matchesTitle = essay.title?.toLowerCase().includes(query)
          const matchesSubtitle = essay.subtitle?.toLowerCase().includes(query)
          const matchesPreview = essay.preview?.toLowerCase().includes(query)
          const matchesTags = essay.tags?.some((tag: string) => tag.toLowerCase().includes(query))
          const matchesCategory = essay.category?.toLowerCase().includes(query)

          return matchesTitle || matchesSubtitle || matchesPreview || matchesTags || matchesCategory
        })
        .map((essay) => ({
          title: essay.title,
          subtitle: essay.subtitle,
          preview: essay.preview,
          date: essay.date,
          status: essay.status || "Published",
          category: essay.category,
          path: `/essays/${essay.slug}`,
          resultType: "essay" as const,
        }))

      results = [...results, ...filteredEssays]
    }
    
    // Search papers if filter is "all" or "papers"
    if (searchFilter === "all" || searchFilter === "papers") {
      const filteredPapers = papers
        .filter((paper) => {
          // First filter out papers with state "hidden"
          if (paper.state === "hidden") {
            return false;
          }
          
          const matchesTitle = paper.title?.toLowerCase().includes(query)
          const matchesSubtitle = paper.subtitle?.toLowerCase().includes(query)
          const matchesPreview = paper.preview?.toLowerCase().includes(query)
          const matchesTags = paper.tags?.some((tag: string) => tag.toLowerCase().includes(query))

          return matchesTitle || matchesSubtitle || matchesPreview || matchesTags
        })
        .map((paper) => ({
          title: paper.title,
          subtitle: paper.subtitle,
          preview: paper.preview,
          date: paper.date,
          status: paper.status || "Published",
          category: "Academic",
          path: `/papers/${paper.slug}`,
          resultType: "paper" as const,
        }))

      results = [...results, ...filteredPapers]
    }
    
    // Search fiction if filter is "all" or "fiction"
    if (searchFilter === "all" || searchFilter === "fiction") {
      const filteredFiction = fiction
        .filter((item) => {
          const matchesTitle = item.title?.toLowerCase().includes(query)
          const matchesSubtitle = item.subtitle?.toLowerCase().includes(query)
          const matchesPreview = item.preview?.toLowerCase().includes(query)

          return matchesTitle || matchesSubtitle || matchesPreview
        })
        .map((item) => ({
          title: item.title,
          subtitle: item.subtitle,
          preview: item.preview,
          date: item.date,
          status: item.status || "Published",
          category: "Fiction",
          path: `/fiction/${item.slug}`,
          resultType: "fiction" as const,
        }))

      results = [...results, ...filteredFiction]
    }
    
    // Search news if filter is "all" or "news"
    if (searchFilter === "all" || searchFilter === "news") {
      const filteredNews = news
        .filter((item) => {
          const matchesTitle = item.title?.toLowerCase().includes(query)
          const matchesSubtitle = item.subtitle?.toLowerCase().includes(query)
          const matchesPreview = item.preview?.toLowerCase().includes(query)

          return matchesTitle || matchesSubtitle || matchesPreview
        })
        .map((item) => ({
          title: item.title,
          subtitle: item.subtitle,
          preview: item.preview,
          date: item.date,
          status: item.status || "Published",
          category: "News",
          path: `/news/${item.slug}`,
          resultType: "news" as const,
        }))

      results = [...results, ...filteredNews]
    }
    
    // Search conspiracies if filter is "all" or "conspiracies"
    if (searchFilter === "all" || searchFilter === "conspiracies") {
      const filteredConspiracies = conspiracies
        .filter((item) => {
          const matchesTitle = item.title?.toLowerCase().includes(query)
          const matchesSubtitle = item.subtitle?.toLowerCase().includes(query)
          const matchesPreview = item.preview?.toLowerCase().includes(query)

          return matchesTitle || matchesSubtitle || matchesPreview
        })
        .map((item) => ({
          title: item.title,
          subtitle: item.subtitle,
          preview: item.preview,
          date: item.date,
          status: item.status || "Published",
          category: "Conspiracy",
          path: `/conspiracies/${item.slug}`,
          resultType: "conspiracy" as const,
        }))

      results = [...results, ...filteredConspiracies]
    }
    
    // Search quick notes if filter is "all" or "notes"
    if (searchFilter === "all" || searchFilter === "notes") {
      const filteredNotes = quickNotes
        .filter((item) => {
          const matchesTitle = item.title?.toLowerCase().includes(query)
          const matchesSubtitle = item.subtitle?.toLowerCase().includes(query)
          const matchesPreview = item.preview?.toLowerCase().includes(query)
          const matchesContent = item.content?.toLowerCase().includes(query)

          return matchesTitle || matchesSubtitle || matchesPreview || matchesContent
        })
        .map((item) => ({
          title: item.title,
          subtitle: item.subtitle,
          preview: item.preview || item.content?.substring(0, 100),
          date: item.date,
          status: item.status || "Published",
          category: "Note",
          path: `/notes/${item.slug}`,
          resultType: "note" as const,
        }))

      results = [...results, ...filteredNotes]
    }
    
    // Search problems if filter is "all" or "problems"
    if (searchFilter === "all" || searchFilter === "problems") {
      const filteredProblems = problems
        .filter((item) => {
          const matchesTitle = item.title?.toLowerCase().includes(query)
          const matchesPreview = item.preview?.toLowerCase().includes(query)
          const matchesTags = item.tags?.some((tag: string) => tag.toLowerCase().includes(query))

          return matchesTitle || matchesPreview || matchesTags
        })
        .map((item) => ({
          title: item.title,
          subtitle: item.subtitle,
          preview: item.preview,
          date: item.date,
          status: item.status || "Open",
          category: "Problem",
          path: `/problems/${item.slug}`,
          resultType: "problem" as const,
        }))

      results = [...results, ...filteredProblems]
    }
    
    // Search progymnasmata if filter is "all" or "progymnasmata"
    if (searchFilter === "all" || searchFilter === "progymnasmata") {
      const filteredProgymnasmata = progymnasmata
        .filter((item) => {
          const matchesTitle = item.title?.toLowerCase().includes(query)
          const matchesPreview = item.preview?.toLowerCase().includes(query)

          return matchesTitle || matchesPreview
        })
        .map((item) => ({
          title: item.title,
          subtitle: item.subtitle,
          preview: item.preview,
          date: item.date,
          status: item.status || "Published",
          category: "Progymnasmata",
          path: `/progymnasmata/${item.slug}`,
          resultType: "progymnasmata" as const,
        }))

      results = [...results, ...filteredProgymnasmata]
    }
    
    // Search prompts if filter is "all" or "prompts"
    if (searchFilter === "all" || searchFilter === "prompts") {
      const filteredPrompts = prompts
        .filter((item) => {
          const matchesTitle = item.title?.toLowerCase().includes(query)
          const matchesPreview = item.preview?.toLowerCase().includes(query)
          const matchesContent = item.content?.toLowerCase().includes(query)

          return matchesTitle || matchesPreview || matchesContent
        })
        .map((item) => ({
          title: item.title,
          subtitle: item.subtitle,
          preview: item.preview || item.content?.substring(0, 100),
          date: item.date,
          status: item.status || "Published",
          category: "Prompt",
          path: `/prompts/${item.slug}`,
          resultType: "prompt" as const,
        }))

      results = [...results, ...filteredPrompts]
    }
    
    // Search scripts if filter is "all" or "scripts"
    if (searchFilter === "all" || searchFilter === "scripts") {
      const filteredScripts = scripts
        .filter((item) => {
          if (typeof item === 'string') {
            return item.toLowerCase().includes(query);
          }
          
          const matchesName = item.name?.toLowerCase().includes(query)
          const matchesContent = item.content?.toLowerCase().includes(query)

          return matchesName || matchesContent
        })
        .map((item) => {
          if (typeof item === 'string') {
            return {
              title: item,
              preview: "Script file",
              date: new Date().toISOString(),
              status: "Available",
              category: "Script",
              path: `/scripts?filename=${encodeURIComponent(item)}`,
              resultType: "script" as const,
            };
          }
          
          return {
            title: item.name,
            preview: item.content?.substring(0, 100) || "Script file",
            date: item.modified || new Date().toISOString(),
            status: "Available",
            category: "Script",
            path: `/scripts?filename=${encodeURIComponent(item.name)}`,
            resultType: "script" as const,
          };
        })

      results = [...results, ...filteredScripts]
    }
    
    // Search lab content if filter is "all" or "lab"
    if (searchFilter === "all" || searchFilter === "lab") {
      const filteredLab = lab
        .filter((item) => {
          const matchesTitle = item.title?.toLowerCase().includes(query)
          const matchesDescription = item.description?.toLowerCase().includes(query)
          const matchesTags = item.tags?.some((tag: string) => tag.toLowerCase().includes(query))

          return matchesTitle || matchesDescription || matchesTags
        })
        .map((item) => ({
          title: item.title,
          preview: item.description,
          date: item.date,
          status: item.status || "Published",
          category: "Lab",
          path: `/lab/${item.slug}`,
          resultType: "lab" as const,
        }))

      results = [...results, ...filteredLab]
    }
    
    // Search lectures if filter is "all" or "academic"
    if (searchFilter === "all" || searchFilter === "academic") {
      const filteredLectures = lectures
        .filter((item) => {
          const matchesTitle = item.title?.toLowerCase().includes(query)
          const matchesDescription = item.description?.toLowerCase().includes(query)
          const matchesTags = item.tags?.some((tag: string) => tag.toLowerCase().includes(query))

          return matchesTitle || matchesDescription || matchesTags
        })
        .map((item) => ({
          title: item.title,
          preview: item.description,
          date: item.date,
          status: item.status || "Published",
          category: "Lecture",
          path: `/lectures/${item.slug}`,
          resultType: "lecture" as const,
        }))

      results = [...results, ...filteredLectures]
    }
    
    // Search links if filter is "all" or "misc"
    if (searchFilter === "all" || searchFilter === "misc") {
      const filteredLinks = links
        .filter((item) => {
          const matchesTitle = item.title?.toLowerCase().includes(query)
          const matchesDescription = item.description?.toLowerCase().includes(query)
          const matchesUrl = item.url?.toLowerCase().includes(query)
          const matchesTags = item.tags?.some((tag: string) => tag.toLowerCase().includes(query))

          return matchesTitle || matchesDescription || matchesUrl || matchesTags
        })
        .map((item) => ({
          title: item.title,
          preview: item.description,
          date: item.date || new Date().toISOString(),
          status: "Link",
          category: item.category || "External Link",
          path: item.url,
          resultType: "link" as const,
        }))

      results = [...results, ...filteredLinks]
    }

    // Sort by date (newest first) and limit to 10 results instead of 5 due to more sources
    results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    setSearchResults(results.slice(0, 10))
  }, [searchQuery, posts, pages, essays, papers, fiction, news, conspiracies, quickNotes, 
      problems, progymnasmata, prompts, scripts, lab, lectures, links, searchFilter])

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
    
    if (searchFilter === "bible" && searchQuery.trim() !== "") {
      // Generate the Bible search URL
      const bibleSearchUrl = `https://www.blueletterbible.org/search/preSearch.cfm?Criteria=${encodeURIComponent(searchQuery)}&t=${bibleVersion}`
      
      // Trigger the universal link modal to open with this URL
      createModal(bibleSearchUrl, `Bible Search: ${searchQuery}`, window.innerWidth / 2, window.innerHeight / 2)
      return
    }
    
    if (searchResults.length > 0) {
      const firstResult = searchResults[0]
      
      // Check if it's an external link
      if (firstResult.resultType === "link" && firstResult.path?.startsWith('http')) {
        // Use the universal link modal for external links
        createModal(firstResult.path, firstResult.title, window.innerWidth / 2, window.innerHeight / 2)
      } else {
        // Use the router for internal links
        router.push(firstResult.path)
      }
      
      setIsSearchOpen(false)
      setIsOpen(false)
      setSearchQuery("")
    }
  }

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

  const openRSS = () => {
    window.open("https://krisyotam.substack.com/?utm_campaign=profile_chips", "_blank")
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

  // Create a reference to the modal creation function from universal-link-modal
  // This is a simplified version just for our component
  const createModal = useCallback((url: string, title: string, x: number, y: number) => {
    // Create a custom event to trigger the universal link modal
    const event = new CustomEvent('openUniversalLinkModal', { 
      detail: { url, title, x, y }
    });
    window.dispatchEvent(event);
    
    // Close the search
    setIsSearchOpen(false)
    setIsOpen(false)
    setSearchQuery("")
  }, []);

  return (
    <div className="fixed top-5 right-5 z-50" ref={dropdownRef}>
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

      {isOpen && (
        <div className="absolute right-0 mt-2 w-10 border border-border bg-background shadow-md">
          <div className="flex flex-col items-center p-1">
            <button
              onClick={toggleSearch}
              className="relative flex h-8 w-8 items-center justify-center p-2 hover:bg-accent hover:text-accent-foreground"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
              <span className="absolute right-full mr-2 w-auto min-w-max bg-black px-2 py-1 text-xs font-medium text-white opacity-0 shadow transition-opacity hover:opacity-100 dark:bg-white dark:text-black pointer-events-none [.h-8:hover>&]:opacity-100">
                Search
              </span>
            </button>
            
            {/* Link Modal Options with improved hover handling */}
            <div className="relative pointer-events-none">
              <button
                ref={linkOptionRef}
                onMouseEnter={showSubmenu}
                onMouseLeave={hideSubmenuWithDelay}
                className="relative flex h-8 w-8 items-center justify-center p-2 hover:bg-accent hover:text-accent-foreground pointer-events-auto"
                aria-label="Link Preview Settings"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="absolute right-full mr-2 w-auto min-w-max bg-black px-2 py-1 text-xs font-medium text-white opacity-0 shadow transition-opacity hover:opacity-100 dark:bg-white dark:text-black pointer-events-none [.h-8:hover>&]:opacity-100">
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
                    className="absolute right-full top-0 mr-2 w-auto min-w-max bg-background border border-border shadow-md p-1 pointer-events-auto"
                    onMouseEnter={showSubmenu}
                    onMouseLeave={hideSubmenuWithDelay}
                  >
                    <div className="text-xs font-medium px-2 py-1 mb-1 border-b border-border">Link Preview Mode</div>
                    <button
                      onClick={() => setLinkModalMode("all")}
                      className={`flex items-center justify-between w-full text-left px-2 py-1 text-xs hover:bg-accent hover:text-accent-foreground ${universalLinkModalMode === "all" ? "font-medium bg-accent/30" : ""}`}
                    >
                      <span>All Links</span>
                      {universalLinkModalMode === "all" && <span className="text-primary">✓</span>}
                    </button>
                    <button
                      onClick={() => setLinkModalMode("external")}
                      className={`flex items-center justify-between w-full text-left px-2 py-1 text-xs hover:bg-accent hover:text-accent-foreground ${universalLinkModalMode === "external" ? "font-medium bg-accent/30" : ""}`}
                    >
                      <span>External Only</span>
                      {universalLinkModalMode === "external" && <span className="text-primary">✓</span>}
                    </button>
                    <button
                      onClick={() => setLinkModalMode("off")}
                      className={`flex items-center justify-between w-full text-left px-2 py-1 text-xs hover:bg-accent hover:text-accent-foreground ${universalLinkModalMode === "off" ? "font-medium bg-accent/30" : ""}`}
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
              className="relative flex h-8 w-8 items-center justify-center p-2 hover:bg-accent hover:text-accent-foreground"
              aria-label="User Settings"
            >
              <Settings className="h-4 w-4" />
              <span className="absolute right-full mr-2 w-auto min-w-max bg-black px-2 py-1 text-xs font-medium text-white opacity-0 shadow transition-opacity hover:opacity-100 dark:bg-white dark:text-black pointer-events-none [.h-8:hover>&]:opacity-100">
                User Settings
              </span>
            </button>
            <button
              onClick={openRSS}
              className="relative flex h-8 w-8 items-center justify-center p-2 hover:bg-accent hover:text-accent-foreground"
              aria-label="RSS Feed"
            >
              <Rss className="h-4 w-4" />
              <span className="absolute right-full mr-2 w-auto min-w-max bg-black px-2 py-1 text-xs font-medium text-white opacity-0 shadow transition-opacity hover:opacity-100 dark:bg-white dark:text-black pointer-events-none [.h-8:hover>&]:opacity-100">
                View RSS.xml
              </span>
            </button>
            <button
              onClick={openFAQ}
              className="relative flex h-8 w-8 items-center justify-center p-2 hover:bg-accent hover:text-accent-foreground"
              aria-label="FAQ"
            >
              <CircleHelp className="h-4 w-4" />
              <span className="absolute right-full mr-2 w-auto min-w-max bg-black px-2 py-1 text-xs font-medium text-white opacity-0 shadow transition-opacity hover:opacity-100 dark:bg-white dark:text-black pointer-events-none [.h-8:hover>&]:opacity-100">
                FAQ
              </span>
            </button>
            <button
              onClick={openChangelog}
              className="relative flex h-8 w-8 items-center justify-center p-2 hover:bg-accent hover:text-accent-foreground"
              aria-label="Changelog"
            >
              <GitCompare className="h-4 w-4" />
              <span className="absolute right-full mr-2 w-auto min-w-max bg-black px-2 py-1 text-xs font-medium text-white opacity-0 shadow transition-opacity hover:opacity-100 dark:bg-white dark:text-black pointer-events-none [.h-8:hover>&]:opacity-100">
                Changelog
              </span>
            </button>
            <button
              onClick={openScripts}
              className="relative flex h-8 w-8 items-center justify-center p-2 hover:bg-accent hover:text-accent-foreground"
              aria-label="Scripts"
            >
              <Code className="h-4 w-4" />
              <span className="absolute right-full mr-2 w-auto min-w-max bg-black px-2 py-1 text-xs font-medium text-white opacity-0 shadow transition-opacity hover:opacity-100 dark:bg-white dark:text-black pointer-events-none [.h-8:hover>&]:opacity-100">
                Scripts
              </span>
            </button>
            <button
              onClick={openGithub}
              className="relative flex h-8 w-8 items-center justify-center p-2 hover:bg-accent hover:text-accent-foreground"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
              <span className="absolute right-full mr-2 w-auto min-w-max bg-black px-2 py-1 text-xs font-medium text-white opacity-0 shadow transition-opacity hover:opacity-100 dark:bg-white dark:text-black pointer-events-none [.h-8:hover>&]:opacity-100">
                Git
              </span>
            </button>
          </div>
        </div>
      )}

      {/* User Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md border border-border bg-background p-6 shadow-lg">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="text-lg font-semibold">User Settings</h2>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="p-1 hover:bg-accent hover:text-accent-foreground"
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
                className="w-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
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
              className={`absolute bg-background border border-border shadow-md overflow-hidden pointer-events-auto ${
                isMaximized ? "w-[90vw] h-[90vh]" : "w-[600px]"
              }`}
            >
              <div className="search-handle flex h-10 items-center justify-between border-b border-border bg-muted/50 px-3 cursor-move">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={closeSearch}
                    className="p-1 hover:bg-accent hover:text-accent-foreground"
                    aria-label="Close"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <button
                    onClick={toggleMaximize}
                    className="p-1 hover:bg-accent hover:text-accent-foreground"
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
                      className="flex h-9 w-full border-l border-y border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      className="inline-flex h-9 items-center justify-center border-r border-y border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    >
                      Search
                    </button>
                  </form>
                </div>
              </div>

              <div className="border-b border-border p-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">Search in:</div>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1 text-sm px-2 py-1 rounded border border-input bg-transparent hover:bg-accent hover:text-accent-foreground">
                      {searchFilter === "all" ? "All Content" : 
                       searchFilter === "posts" ? "Posts" : 
                       searchFilter === "pages" ? "Pages" :
                       searchFilter === "essays" ? "Essays" :
                       searchFilter === "papers" ? "Papers" :
                       searchFilter === "fiction" ? "Fiction" :
                       searchFilter === "news" ? "News" :
                       searchFilter === "conspiracies" ? "Conspiracies" :
                       searchFilter === "notes" ? "Notes" :
                       searchFilter === "problems" ? "Problems" :
                       searchFilter === "progymnasmata" ? "Progymnasmata" :
                       searchFilter === "prompts" ? "Prompts" :
                       searchFilter === "scripts" ? "Scripts" :
                       searchFilter === "lab" ? "Lab" :
                       searchFilter === "lectures" ? "Lectures" :
                       searchFilter === "links" ? "Links" :
                       searchFilter === "bible" ? "Bible" : "All Content"}
                      <ChevronDown className="h-3 w-3" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                      <DropdownMenuRadioGroup value={searchFilter} onValueChange={value => setSearchFilter(value as any)}>
                        <DropdownMenuRadioItem value="all">All Content</DropdownMenuRadioItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioItem value="posts">Posts</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="pages">Pages</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="essays">Essays</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="papers">Papers</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="fiction">Fiction</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="news">News</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="conspiracies">Conspiracies</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="notes">Notes</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="problems">Problems</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="progymnasmata">Progymnasmata</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="prompts">Prompts</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="scripts">Scripts</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="lab">Lab</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="lectures">Lectures</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="links">Links</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="bible">Bible</DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              {searchFilter === "bible" && (
                <div className="border-b border-border p-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs text-muted-foreground">Bible version:</div>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center gap-1 text-xs px-2 py-1 rounded border border-input bg-transparent hover:bg-accent hover:text-accent-foreground">
                        {bibleVersion}
                        <ChevronDown className="h-3 w-3" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[120px] max-h-[200px] overflow-auto">
                        <DropdownMenuRadioGroup value={bibleVersion} onValueChange={setBibleVersion}>
                          <DropdownMenuRadioItem value="KJV">KJV</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="NKJV">NKJV</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="NLT">NLT</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="NIV">NIV</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="ESV">ESV</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="CSB">CSB</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="NASB20">NASB20</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="NASB95">NASB95</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="LSB">LSB</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="AMP">AMP</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="NET">NET</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="RSV">RSV</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Enter a Bible verse or search term and press Search
                  </div>
                </div>
              )}

              <div className={`${isMaximized ? "max-h-[calc(90vh-120px)]" : "max-h-[300px]"} overflow-y-auto`}>
                {isLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
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
      )}
    </div>
  )
}

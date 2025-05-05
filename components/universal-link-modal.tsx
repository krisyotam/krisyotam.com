"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { X, Maximize2, ChevronLeft, ChevronRight, Copy, ExternalLink, Check, Minimize2 } from "lucide-react"
import { linkEvents } from "@/components/typography/a"
import { usePathname } from "next/navigation"
import bannedDomains from "@/data/banned-domains.json"

// Configuration
const CONFIG = {
  debug: false,
  internalPreviews: false,
  externalPreviews: true,
  checkBannedDomains: true,
  excludedPages: ["/", "/categories"],
  additionalBannedDomains: [
    { name: "TikTok", domain: "tiktok.com" },
    { name: "Medium", domain: "medium.com" },
  ],
}

type ModalData = {
  id: string
  url: string
  title: string
  position: { x: number; y: number }
  isFullScreen: boolean
}

export function UniversalLinkModal() {
  const pathname = usePathname()
  // Calculate exclusion once and memoize it
  const isExcluded = useMemo(() => {
    return CONFIG.excludedPages.some((path) => pathname === path || pathname?.startsWith(`${path}/`))
  }, [pathname])

  // Get the universal link modal settings from localStorage
  const [isEnabled, setIsEnabled] = useState(true)
  const [modalMode, setModalMode] = useState<"all" | "external" | "off">("external")
  
  // Define all hooks before any conditional returns
  const [modals, setModals] = useState<ModalData[]>([])
  const [focusedModalIndex, setFocusedModalIndex] = useState<number | null>(null)
  const [copySuccess, setCopySuccess] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [activeModalId, setActiveModalId] = useState<string | null>(null)
  
  // State for rendering control - ensures component renders consistently
  const [shouldRenderContent, setShouldRenderContent] = useState(false)

  // Refs
  const openModalUrls = useRef<Set<string>>(new Set())
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null)
  const hoveredLinkRef = useRef<HTMLAnchorElement | null>(null)
  const debugRef = useRef({
    hoverCount: 0,
    modalAttempts: 0,
    lastHoveredUrl: "",
    errors: [] as string[],
    linkElements: 0,
  })

  // Helper functions - wrap in useCallback to maintain reference stability
  const getDomainFromUrl = useCallback((url: string) => {
    try {
      return new URL(url).hostname.replace("www.", "")
    } catch {
      return url
    }
  }, [])

  const isDomainBanned = useCallback((url: string): boolean => {
    if (!CONFIG.checkBannedDomains) return false

    try {
      const domain = getDomainFromUrl(url)
      return [...bannedDomains, ...CONFIG.additionalBannedDomains].some(
        (bannedDomain) => domain === bannedDomain.domain || domain.endsWith(`.${bannedDomain.domain}`),
      )
    } catch {
      return false
    }
  }, [getDomainFromUrl])

  const isInternalLink = useCallback((url: string): boolean => {
    try {
      if (url.startsWith("/") || url.startsWith("#") || url.startsWith("./") || url.startsWith("../")) {
        return true
      }
      return new URL(url).hostname === window.location.hostname
    } catch {
      return true
    }
  }, [])

  const shouldShowPreview = useCallback((url: string): boolean => {
    if (isDomainBanned(url)) return false
    
    // Check if internal and handle based on mode
    if (isInternalLink(url)) {
      return modalMode === "all" // Only show internal previews in "all" mode
    }
    
    // External links are shown in both "all" and "external" modes
    return modalMode === "all" || modalMode === "external"
  }, [isDomainBanned, isInternalLink, modalMode])

  // Modal management
  const createModal = useCallback(async (url: string, title: string, x: number, y: number) => {
    if (openModalUrls.current.has(url)) return
    if (url.startsWith("javascript:") || url === "#" || url === "") return
    if (isDomainBanned(url)) return
    
    // Don't create modals for internal links unless in "all" mode
    if (isInternalLink(url) && modalMode !== "all") return

    const newModal: ModalData = {
      id: `modal-${Date.now()}`,
      url,
      title: title || getDomainFromUrl(url),
      position: {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      },
      isFullScreen: false,
    }

    setModals((prev) => [...prev, newModal])
    openModalUrls.current.add(url)
  }, [isDomainBanned, isInternalLink, modalMode, getDomainFromUrl])

  const closeModal = useCallback((id: string) => {
    const modalToClose = modals.find((modal) => modal.id === id)
    if (modalToClose) {
      openModalUrls.current.delete(modalToClose.url)
    }

    const closingIndex = modals.findIndex((modal) => modal.id === id)
    setModals((prev) => prev.filter((modal) => modal.id !== id))

    if (focusedModalIndex !== null) {
      if (modals.length <= 1) {
        setFocusedModalIndex(null)
      } else if (closingIndex === focusedModalIndex) {
        setFocusedModalIndex(Math.max(0, focusedModalIndex - 1))
      } else if (closingIndex < focusedModalIndex) {
        setFocusedModalIndex(focusedModalIndex - 1)
      }
    }
  }, [modals, focusedModalIndex])

  // Event handlers
  const handleMouseDown = useCallback((e: React.MouseEvent, id: string) => {
    const target = e.target as HTMLElement
    if (target.tagName === "BUTTON" || target.closest("button")) return
    if (!target.closest(".drag-handle")) return

    const modal = modals.find((m) => m.id === id)
    if (modal && !modal.isFullScreen) {
      setIsDragging(true)
      setActiveModalId(id)
      setDragOffset({
        x: e.clientX - modal.position.x,
        y: e.clientY - modal.position.y,
      })

      setModals((prev) => {
        const filtered = prev.filter((m) => m.id !== id)
        return [...filtered, modal]
      })

      e.preventDefault()
    }
  }, [modals])

  const copyToClipboard = useCallback((url: string | undefined) => {
    if (!url) return
    navigator.clipboard
      .writeText(url)
      .then(() => setCopySuccess(true))
      .catch((err) => console.error("Failed to copy URL: ", err))
  }, [])

  const openInNewTab = useCallback((url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }, [])

  // Navigation
  const goToNextModal = useCallback(() => {
    if (focusedModalIndex === null || modals.length <= 1) return
    setFocusedModalIndex((prevIndex) => (prevIndex + 1) % modals.length)
  }, [focusedModalIndex, modals.length])

  const goToPrevModal = useCallback(() => {
    if (focusedModalIndex === null || modals.length <= 1) return
    setFocusedModalIndex((prevIndex) => (prevIndex - 1 + modals.length) % modals.length)
  }, [focusedModalIndex, modals.length])

  // Modal styles
  const getModalStyles = useCallback((modal: ModalData) => {
    if (modal.isFullScreen) {
      return {
        left: "5vw",
        top: "5vh",
        width: "90vw",
        height: "90vh",
        zIndex: 1000,
      }
    } else {
      return {
        left: `${modal.position.x}px`,
        top: `${modal.position.y}px`,
        width: "600px",
        height: "500px",
        transform: "translate(-50%, -50%)",
        zIndex: 1000,
      }
    }
  }, [])

  // Load settings from localStorage
  useEffect(() => {
    // Check if the user has disabled the universal link modal
    const storedSetting = localStorage.getItem("settings_universalLinkModal")
    if (storedSetting !== null) {
      setIsEnabled(storedSetting === "true")
    }
    
    // Get the modal mode setting
    const storedMode = localStorage.getItem("settings_universalLinkModalMode")
    if (storedMode !== null && ["all", "external", "off"].includes(storedMode)) {
      setModalMode(storedMode as "all" | "external" | "off")
    }
    
    // Update rendering state
    setShouldRenderContent(true)
  }, [])

  // Reset timers when component unmounts
  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current)
        hoverTimerRef.current = null
      }
    }
  }, [])

  // Effects
  useEffect(() => {
    if (copySuccess) {
      const timer = setTimeout(() => setCopySuccess(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [copySuccess])

  // Mouse movement and dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && activeModalId) {
        const modal = modals.find((m) => m.id === activeModalId)
        if (!modal) return

        // Calculate new position with boundary constraints
        let newX = e.clientX - dragOffset.x
        let newY = e.clientY - dragOffset.y

        const modalWidth = 600
        const modalHeight = 500

        newX = Math.max(modalWidth / 2, Math.min(newX, window.innerWidth - modalWidth / 2))
        newY = Math.max(modalHeight / 2, Math.min(newY, window.innerHeight - modalHeight / 2))

        setModals((prev) => prev.map((m) => (m.id === activeModalId ? { ...m, position: { x: newX, y: newY } } : m)))
      }
    }

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false)
        setActiveModalId(null)
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, activeModalId, dragOffset, modals])

  // Link hover detection
  useEffect(() => {
    const handleGlobalMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const linkElement = target.closest("a") as HTMLAnchorElement | null

      if (!linkElement) return
      if (linkElement.hasAttribute("data-hover-listener")) return
      if (
        linkElement.getAttribute("data-no-preview") === "true" ||
        linkElement.getAttribute("data-no-modal") === "true"
      )
        return

      const href = linkElement.href
      if (!href || href === "#" || href.startsWith("javascript:")) return

      if (isDomainBanned(href)) {
        linkElement.setAttribute("data-no-preview", "true")
        return
      }

      if (!shouldShowPreview(href)) {
        linkElement.setAttribute("data-no-preview", "true")
        return
      }

      if (hoveredLinkRef.current === linkElement) return

      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current)
      }

      hoveredLinkRef.current = linkElement
      debugRef.current.hoverCount++
      debugRef.current.lastHoveredUrl = href

      hoverTimerRef.current = setTimeout(() => {
        if (hoveredLinkRef.current !== linkElement) return

        debugRef.current.modalAttempts++
        const rect = linkElement.getBoundingClientRect()
        const x = rect.left + rect.width / 2
        const y = rect.top

        createModal(href, linkElement.textContent || "", x, y)
      }, 500)
    }

    const handleGlobalMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const linkElement = target.closest("a")

      if (linkElement && hoveredLinkRef.current === linkElement) {
        if (hoverTimerRef.current) {
          clearTimeout(hoverTimerRef.current)
          hoverTimerRef.current = null
        }
        hoveredLinkRef.current = null
      }
    }

    document.addEventListener("mouseover", handleGlobalMouseOver)
    document.addEventListener("mouseout", handleGlobalMouseOut)

    return () => {
      document.removeEventListener("mouseover", handleGlobalMouseOver)
      document.removeEventListener("mouseout", handleGlobalMouseOut)
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current)
      }
    }
  }, [isDomainBanned, shouldShowPreview, createModal])

  // Link events from A component
  useEffect(() => {
    const handleLinkHover = async (url: string, text: string, x: number, y: number) => {
      debugRef.current.hoverCount++
      debugRef.current.lastHoveredUrl = url

      if (isDomainBanned(url) || !shouldShowPreview(url)) return

      debugRef.current.modalAttempts++
      await createModal(url, text, x, y)
    }

    const unsubscribe = linkEvents.addListener(handleLinkHover)
    return unsubscribe
  }, [isDomainBanned, shouldShowPreview, createModal])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (focusedModalIndex === null) return

      if (e.key === "ArrowLeft") {
        goToPrevModal()
      } else if (e.key === "ArrowRight") {
        goToNextModal()
      } else if (e.key === "Escape") {
        setFocusedModalIndex(null)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [focusedModalIndex, goToPrevModal, goToNextModal])

  // Always render the same structure with the same number of hooks
  if (!shouldRenderContent || !isEnabled || modalMode === "off" || isExcluded) {
    return null
  }

  // Render functions - wrapped in memoized components
  const renderRegularModals = () => {
    return modals.map((modal, index) => (
      <div
        key={modal.id}
        className="fixed shadow-xl rounded-lg overflow-hidden"
        style={{
          ...getModalStyles(modal),
          display: focusedModalIndex === index ? "none" : "block",
        }}
        onMouseDown={(e) => handleMouseDown(e, modal.id)}
      >
        <div className="bg-background border border-border rounded-lg flex flex-col h-full relative">
          {/* Header */}
          <div className="flex items-center justify-end p-2 bg-muted/30 border-b border-border drag-handle cursor-grab">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setFocusedModalIndex(index)}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Maximize modal"
                title="Maximize"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => closeModal(modal.id)}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Close modal"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Drag handles */}
          <div
            className="absolute left-0 top-0 w-8 h-full cursor-ew-resize drag-handle hover:bg-muted/20 transition-colors"
            style={{ top: "40px", bottom: "0" }}
          />
          <div
            className="absolute right-0 top-0 w-8 h-full cursor-ew-resize drag-handle hover:bg-muted/20 transition-colors"
            style={{ top: "40px", bottom: "0" }}
          />
          <div className="absolute left-0 bottom-0 w-full h-8 cursor-ns-resize drag-handle hover:bg-muted/20 transition-colors" />
          <div className="absolute left-0 bottom-0 w-12 h-12 cursor-nesw-resize drag-handle hover:bg-muted/20 transition-colors" />
          <div className="absolute right-0 bottom-0 w-12 h-12 cursor-nwse-resize drag-handle hover:bg-muted/20 transition-colors" />

          {/* Content */}
          <div className="flex-1 relative">
            <div className="absolute inset-0 flex items-center justify-center bg-background">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
            <iframe
              src={modal.url}
              className="w-full h-full border-0"
              title={`External content: ${modal.url}`}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
              referrerpolicy="no-referrer"
              onLoad={(e) => {
                const iframe = e.currentTarget
                const parent = iframe.parentElement
                if (parent && parent.firstChild !== iframe) {
                  parent.firstChild?.remove()
                }
              }}
              onError={(e) => {
                const iframe = e.currentTarget
                const parent = iframe.parentElement
                if (parent) {
                  const errorDiv = document.createElement("div")
                  errorDiv.className =
                    "absolute inset-0 flex flex-col items-center justify-center bg-background p-4 text-center"
                  errorDiv.innerHTML = `
                    <div class="text-red-500 mb-2">Failed to load content</div>
                    <div class="text-sm text-muted-foreground mb-4">The website may be blocking embedding in iframes</div>
                    <a href="${iframe.src}" target="_blank" rel="noopener noreferrer" 
                       class="px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                      Open in New Tab
                    </a>
                  `
                  parent.appendChild(errorDiv)
                }
              }}
            />
          </div>
        </div>
      </div>
    ))
  }

  const renderFocusedModal = () => {
    if (focusedModalIndex === null || !modals[focusedModalIndex]) return null

    return (
      <>
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1001]"
          onClick={() => setFocusedModalIndex(null)}
        />

        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vh] rounded-xl shadow-2xl bg-background border border-border overflow-hidden z-[1002]">
          {/* URL bar and controls */}
          <div className="p-3 flex flex-col gap-2 bg-muted/30 border-b border-border">
            <div className="flex items-center w-full">
              <div className="flex-1 flex items-center bg-background border border-border rounded-md px-3 py-2 mr-2 overflow-hidden">
                <span className="text-sm font-mono truncate text-muted-foreground">
                  {modals[focusedModalIndex]?.url}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => copyToClipboard(modals[focusedModalIndex]?.url)}
                  className="p-1.5 rounded hover:bg-muted/50 transition text-muted-foreground hover:text-foreground"
                  aria-label="Copy URL"
                  title="Copy URL"
                >
                  {copySuccess ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                </button>

                <button
                  onClick={() => openInNewTab(modals[focusedModalIndex]?.url)}
                  className="p-1.5 rounded hover:bg-muted/50 transition text-muted-foreground hover:text-foreground"
                  aria-label="Open in new tab"
                  title="Open in new tab"
                >
                  <ExternalLink className="h-5 w-5" />
                </button>

                {modals.length > 1 && (
                  <>
                    <div className="h-6 border-l border-border mx-1"></div>
                    <button
                      onClick={goToPrevModal}
                      className="p-1.5 rounded hover:bg-muted/50 transition text-muted-foreground hover:text-foreground"
                      aria-label="Previous modal"
                      title="Previous modal"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <span className="text-sm text-muted-foreground">
                      {focusedModalIndex + 1} / {modals.length}
                    </span>
                    <button
                      onClick={goToNextModal}
                      className="p-1.5 rounded hover:bg-muted/50 transition text-muted-foreground hover:text-foreground"
                      aria-label="Next modal"
                      title="Next modal"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                <div className="h-6 border-l border-border mx-1"></div>
                <button
                  onClick={() => setFocusedModalIndex(null)}
                  className="p-1.5 rounded hover:bg-muted/50 transition text-muted-foreground hover:text-foreground"
                  aria-label="Minimize modal"
                  title="Minimize"
                >
                  <Minimize2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => closeModal(modals[focusedModalIndex].id)}
                  className="p-1.5 rounded hover:bg-muted/50 transition text-muted-foreground hover:text-foreground"
                  aria-label="Close modal"
                  title="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="h-[calc(100%-4.5rem)] overflow-hidden relative">
            <div className="absolute inset-0 flex items-center justify-center bg-background">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
            <iframe
              src={modals[focusedModalIndex]?.url}
              title={`External content: ${modals[focusedModalIndex]?.url}`}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
              referrerpolicy="no-referrer"
              onLoad={(e) => {
                const iframe = e.currentTarget
                const parent = iframe.parentElement
                if (parent && parent.firstChild !== iframe) {
                  parent.firstChild?.remove()
                }
              }}
              onError={(e) => {
                const iframe = e.currentTarget
                const parent = iframe.parentElement
                if (parent) {
                  const errorDiv = document.createElement("div")
                  errorDiv.className =
                    "absolute inset-0 flex flex-col items-center justify-center bg-background p-4 text-center"
                  errorDiv.innerHTML = `
                    <div class="text-red-500 mb-2">Failed to load content</div>
                    <div class="text-sm text-muted-foreground mb-4">The website may be blocking embedding in iframes</div>
                    <a href="${iframe.src}" target="_blank" rel="noopener noreferrer" 
                       class="px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                      Open in New Tab
                    </a>
                  `
                  parent.appendChild(errorDiv)
                }
              }}
            />
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {CONFIG.debug && (
        <div className="fixed bottom-0 left-0 bg-black/80 text-white p-2 text-xs z-[9999] font-mono">
          <div>Hover count: {debugRef.current.hoverCount}</div>
          <div>Modal attempts: {debugRef.current.modalAttempts}</div>
          <div>Open modals: {modals.length}</div>
          <div>Last URL: {debugRef.current.lastHoveredUrl.substring(0, 30)}...</div>
          {debugRef.current.errors.length > 0 && (
            <div className="text-red-400 mt-1">
              {debugRef.current.errors.slice(-3).map((err, i) => (
                <div key={i} className="text-red-300 truncate">
                  {err}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {renderRegularModals()}
      {renderFocusedModal()}
    </>
  )
}

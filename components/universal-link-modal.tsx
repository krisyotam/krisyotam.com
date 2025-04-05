"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { X, Maximize2, ChevronLeft, ChevronRight, Copy, ExternalLink, Check, Minimize2 } from "lucide-react"
import { linkEvents } from "@/components/typography/a"

type ModalData = {
  id: string
  url: string
  title: string
  position: { x: number; y: number }
  isFullScreen: boolean
}

// Configuration switches
const DEBUG_MODE = false
const ENABLE_INTERNAL_LINK_PREVIEWS = false // Set to false to disable previews for internal links
const ENABLE_EXTERNAL_LINK_PREVIEWS = true // Set to true to enable previews for external links

export function UniversalLinkModal() {
  // Use state for modals to ensure rendering
  const [modals, setModals] = useState<ModalData[]>([])
  const [focusedModalIndex, setFocusedModalIndex] = useState<number | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [copySuccess, setCopySuccess] = useState(false)
  const openModalUrls = useRef<Set<string>>(new Set())
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null)
  const hoveredLinkRef = useRef<HTMLAnchorElement | null>(null)
  const [showDebug] = useState(DEBUG_MODE)

  // Dragging state
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [activeModalId, setActiveModalId] = useState<string | null>(null)

  // Debug state
  const debugRef = useRef({
    hoverCount: 0,
    modalAttempts: 0,
    lastHoveredUrl: "",
    errors: [] as string[],
    linkElements: 0,
  })
  const [debugState, setDebugState] = useState({
    hoverCount: debugRef.current.hoverCount,
    modalAttempts: debugRef.current.modalAttempts,
    lastHoveredUrl: debugRef.current.lastHoveredUrl,
    errors: [] as string[],
    openModals: 0,
    linkElements: 0,
  })

  // Extract domain name for the title
  const getDomainFromUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname.replace("www.", "")
      return domain
    } catch (e) {
      return url
    }
  }

  // Update debug display periodically
  useEffect(() => {
    if (!showDebug) return

    const updateDebug = () => {
      // Count all links on the page
      const allLinks = document.querySelectorAll("a")
      debugRef.current.linkElements = allLinks.length

      setDebugState({
        hoverCount: debugRef.current.hoverCount,
        modalAttempts: debugRef.current.modalAttempts,
        lastHoveredUrl: debugRef.current.lastHoveredUrl,
        errors: debugRef.current.errors,
        openModals: modals.length,
        linkElements: debugRef.current.linkElements,
      })
    }

    // Update debug info every 100ms
    const interval = setInterval(updateDebug, 100)
    return () => clearInterval(interval)
  }, [modals.length, showDebug])

  // Check if a URL is internal
  const isInternalLink = (url: string): boolean => {
    try {
      // Check if it's a relative URL
      if (url.startsWith("/") || url.startsWith("#") || url.startsWith("./") || url.startsWith("../")) {
        return true
      }

      // Check if it's on the same domain
      const currentDomain = window.location.hostname
      const urlDomain = new URL(url).hostname
      return urlDomain === currentDomain
    } catch (e) {
      // If there's an error parsing the URL, assume it's internal
      return true
    }
  }

  // Check if preview should be shown for a URL
  const shouldShowPreview = (url: string): boolean => {
    const isInternal = isInternalLink(url)

    // For internal links, check ENABLE_INTERNAL_LINK_PREVIEWS
    if (isInternal) {
      return ENABLE_INTERNAL_LINK_PREVIEWS
    }

    // For external links, check ENABLE_EXTERNAL_LINK_PREVIEWS
    return ENABLE_EXTERNAL_LINK_PREVIEWS
  }

  // Create a modal
  const createModal = (url: string, title: string, x: number, y: number) => {
    try {
      // Don't create duplicate modals
      if (openModalUrls.current.has(url)) {
        console.log("Modal already exists for:", url)
        return
      }

      // Skip URLs with data-no-modal attribute
      if (url.startsWith("javascript:") || url === "#" || url === "") {
        console.log("Skipping non-URL:", url)
        return
      }

      console.log("Creating modal for:", url, "at position:", x, y)

      const newModal: ModalData = {
        id: `modal-${Date.now()}`,
        url,
        title: title || getDomainFromUrl(url),
        position: { x, y },
        isFullScreen: false,
      }

      // Add to open modals
      setModals((prev) => [...prev, newModal])
      openModalUrls.current.add(url)

      console.log("Modal created:", newModal.id)
      console.log("Current open modals:", modals.length + 1)
    } catch (err) {
      console.error("Error creating modal:", err)
      debugRef.current.errors.push(`Create error: ${err}`)
    }
  }

  // Track mouse position and handle global link hovering
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })

      // Handle dragging
      if (isDragging && activeModalId) {
        setModals((prev) =>
          prev.map((modal) =>
            modal.id === activeModalId
              ? {
                  ...modal,
                  position: {
                    x: e.clientX - dragOffset.x,
                    y: e.clientY - dragOffset.y,
                  },
                }
              : modal,
          ),
        )
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
  }, [isDragging, activeModalId, dragOffset])

  // Global event delegation for link hovering (for links not using the A component)
  useEffect(() => {
    const handleGlobalMouseOver = (e: MouseEvent) => {
      // Find the closest anchor element
      const target = e.target as HTMLElement
      const linkElement = target.closest("a") as HTMLAnchorElement | null

      if (!linkElement) return

      // Skip if this link already has our custom hover handling
      if (linkElement.hasAttribute("data-hover-listener")) return

      // Skip if this link has data-no-preview or data-no-modal
      if (
        linkElement.getAttribute("data-no-preview") === "true" ||
        linkElement.getAttribute("data-no-modal") === "true"
      )
        return

      // Skip if this is a javascript: link or empty href
      const href = linkElement.href
      if (!href || href === "#" || href.startsWith("javascript:")) return

      // Check if we should show preview for this URL
      if (!shouldShowPreview(href)) {
        // Mark this link as no-preview
        linkElement.setAttribute("data-no-preview", "true")
        return
      }

      // Skip if we're already hovering this link
      if (hoveredLinkRef.current === linkElement) return

      // Clear any existing timer
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current)
        hoverTimerRef.current = null
      }

      // Set the currently hovered link
      hoveredLinkRef.current = linkElement
      debugRef.current.hoverCount++
      debugRef.current.lastHoveredUrl = href

      // Set a timer to create the modal after a delay
      hoverTimerRef.current = setTimeout(() => {
        if (hoveredLinkRef.current !== linkElement) return

        debugRef.current.modalAttempts++

        // Get position for the modal
        const rect = linkElement.getBoundingClientRect()
        const x = rect.left + rect.width / 2
        const y = rect.top

        // Create the modal
        createModal(href, linkElement.textContent || "", x, y)
      }, 500)
    }

    const handleGlobalMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const linkElement = target.closest("a")

      // If we're leaving the currently hovered link, clear the timer
      if (linkElement && hoveredLinkRef.current === linkElement) {
        if (hoverTimerRef.current) {
          clearTimeout(hoverTimerRef.current)
          hoverTimerRef.current = null
        }
        hoveredLinkRef.current = null
      }
    }

    // Add global event listeners
    document.addEventListener("mouseover", handleGlobalMouseOver)
    document.addEventListener("mouseout", handleGlobalMouseOut)

    return () => {
      document.removeEventListener("mouseover", handleGlobalMouseOver)
      document.removeEventListener("mouseout", handleGlobalMouseOut)
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current)
      }
    }
  }, [])

  // Listen for link hover events from the A component
  useEffect(() => {
    const handleLinkHover = (url: string, text: string, x: number, y: number) => {
      debugRef.current.hoverCount++
      debugRef.current.lastHoveredUrl = url

      // Check if we should show preview for this URL
      if (!shouldShowPreview(url)) {
        return
      }

      debugRef.current.modalAttempts++

      console.log("Link hover event received:", url, text, x, y)
      createModal(url, text, x, y)
    }

    // Subscribe to link hover events
    const unsubscribe = linkEvents.addListener(handleLinkHover)

    return () => {
      unsubscribe()
    }
  }, [])

  // Handle keyboard navigation
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
  }, [focusedModalIndex, modals.length])

  // Copy URL to clipboard
  const copyToClipboard = (url: string) => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      })
      .catch((err) => {
        console.error("Failed to copy URL: ", err)
        debugRef.current.errors.push(`Copy error: ${err}`)
      })
  }

  // Open URL in new tab
  const openInNewTab = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  // Close a modal
  const closeModal = (id: string) => {
    try {
      const modalToClose = modals.find((modal) => modal.id === id)
      if (modalToClose) {
        openModalUrls.current.delete(modalToClose.url)
      }

      // Find the index of the modal being closed
      const closingIndex = modals.findIndex((modal) => modal.id === id)

      // Update modals state
      setModals((prev) => prev.filter((modal) => modal.id !== id))

      // Update focused index if needed
      if (focusedModalIndex !== null) {
        if (modals.length <= 1) {
          // If this was the last modal, clear the focus
          setFocusedModalIndex(null)
        } else if (closingIndex === focusedModalIndex) {
          // If we're closing the focused modal, focus the previous one
          setFocusedModalIndex(Math.max(0, focusedModalIndex - 1))
        } else if (closingIndex < focusedModalIndex) {
          // If we're closing a modal before the focused one, adjust the index
          setFocusedModalIndex(focusedModalIndex - 1)
        }
      }
    } catch (err) {
      console.error("Error closing modal:", err)
      debugRef.current.errors.push(`Close error: ${err}`)
    }
  }

  // Toggle fullscreen for a modal
  const toggleFullScreen = (index: number) => {
    try {
      setModals((prev) =>
        prev.map((modal, i) => (i === index ? { ...modal, isFullScreen: !modal.isFullScreen } : modal)),
      )
    } catch (err) {
      console.error("Error toggling fullscreen:", err)
      debugRef.current.errors.push(`Fullscreen error: ${err}`)
    }
  }

  // Enlarge and focus a modal
  const enlargeModal = (index: number) => {
    setFocusedModalIndex(index)
  }

  // Handle mouse down for dragging - now works on the entire modal
  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    // Don't initiate drag if clicking on a button
    const target = e.target as HTMLElement
    if (target.tagName === "BUTTON" || target.closest("button")) {
      return
    }

    // Only initiate drag if clicking on a drag handle
    if (!target.closest(".drag-handle")) {
      return
    }

    // Get the modal
    const modal = modals.find((m) => m.id === id)
    if (modal && !modal.isFullScreen) {
      setIsDragging(true)
      setActiveModalId(id)

      // Calculate offset from the mouse position to the modal position
      setDragOffset({
        x: e.clientX - modal.position.x,
        y: e.clientY - modal.position.y,
      })

      // Move this modal to the end of the array to bring it to front
      setModals((prev) => {
        const filtered = prev.filter((m) => m.id !== id)
        return [...filtered, modal]
      })

      // Prevent text selection during drag
      e.preventDefault()
    }
  }

  // Navigation between modals when in focused mode
  const goToNextModal = () => {
    if (focusedModalIndex === null || modals.length <= 1) return
    setFocusedModalIndex((focusedModalIndex + 1) % modals.length)
  }

  const goToPrevModal = () => {
    if (focusedModalIndex === null || modals.length <= 1) return
    setFocusedModalIndex((focusedModalIndex - 1 + modals.length) % modals.length)
  }

  // Add a test modal for debugging
  const addTestModal = () => {
    createModal("https://example.com", "Example.com", window.innerWidth / 2, window.innerHeight / 2)
  }

  // Force open specific URLs for testing
  const forceOpenVercel = () => {
    createModal("https://vercel.com", "Vercel", window.innerWidth / 2, window.innerHeight / 2)
  }

  const forceOpenGitHub = () => {
    createModal("https://github.com", "GitHub", window.innerWidth / 2, window.innerHeight / 2)
  }

  // Calculate modal styles based on fullscreen state
  const getModalStyles = (modal: ModalData) => {
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
  }

  // Close the focused modal completely
  const closeFocusedModal = () => {
    if (focusedModalIndex === null) return

    const modalId = modals[focusedModalIndex].id
    closeModal(modalId)
  }

  // Minimize the focused modal back to its original size
  const minimizeFocusedModal = () => {
    setFocusedModalIndex(null)
  }

  return (
    <>
      {/* Debug panel - only shown when DEBUG_MODE is true */}
      {showDebug && (
        <div className="fixed bottom-0 left-0 bg-black/80 text-white p-2 text-xs z-[9999] font-mono">
          <div className="flex gap-2 mb-2">
            <button onClick={addTestModal} className="bg-green-500 text-white p-1 rounded">
              Test Modal
            </button>
            <button onClick={forceOpenVercel} className="bg-blue-500 text-white p-1 rounded">
              Open Vercel
            </button>
            <button onClick={forceOpenGitHub} className="bg-purple-500 text-white p-1 rounded">
              Open GitHub
            </button>
            {modals.length > 0 && (
              <button onClick={() => enlargeModal(modals.length - 1)} className="bg-orange-500 text-white p-1 rounded">
                Focus Latest
              </button>
            )}
          </div>
          Hover count: {debugState.hoverCount}
          <br />
          Modal attempts: {debugState.modalAttempts}
          <br />
          Open modals: {debugState.openModals}
          <br />
          Links on page: {debugState.linkElements}
          <br />
          {focusedModalIndex !== null && (
            <>
              Focused modal: {focusedModalIndex + 1} / {modals.length}
              <br />
            </>
          )}
          Last URL: {debugState.lastHoveredUrl.substring(0, 30)}...
          <br />
          {debugState.errors.length > 0 && (
            <>
              <div className="text-red-400 mt-1">Errors:</div>
              {debugState.errors.slice(-3).map((err, i) => (
                <div key={i} className="text-red-300 truncate">
                  {err}
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* Regular modals */}
      {modals.map((modal, index) => (
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
            {/* Top header - draggable */}
            <div className="flex items-center justify-between p-3 bg-muted/30 border-b border-border drag-handle cursor-grab">
              <h3 className="text-sm font-medium truncate max-w-[400px]">{modal.title}</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => enlargeModal(index)}
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

            {/* Left border - draggable */}
            <div
              className="absolute left-0 top-0 w-8 h-full cursor-ew-resize drag-handle hover:bg-muted/20 transition-colors"
              style={{ top: "40px", bottom: "0" }}
            />

            {/* Right border - draggable */}
            <div
              className="absolute right-0 top-0 w-8 h-full cursor-ew-resize drag-handle hover:bg-muted/20 transition-colors"
              style={{ top: "40px", bottom: "0" }}
            />

            {/* Bottom border - draggable */}
            <div className="absolute left-0 bottom-0 w-full h-8 cursor-ns-resize drag-handle hover:bg-muted/20 transition-colors" />

            {/* Bottom-left corner - draggable */}
            <div className="absolute left-0 bottom-0 w-12 h-12 cursor-nesw-resize drag-handle hover:bg-muted/20 transition-colors" />

            {/* Bottom-right corner - draggable */}
            <div className="absolute right-0 bottom-0 w-12 h-12 cursor-nwse-resize drag-handle hover:bg-muted/20 transition-colors" />

            {/* Content area */}
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
                  // Remove loading indicator when iframe loads
                  const iframe = e.currentTarget
                  const parent = iframe.parentElement
                  if (parent && parent.firstChild !== iframe) {
                    parent.firstChild?.remove()
                  }
                }}
                onError={(e) => {
                  console.error("Iframe loading error:", e)
                  debugRef.current.errors.push(`Iframe error: ${e}`)

                  // Add a message to the iframe container
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
      ))}

      {/* Focused modal with pagination */}
      {focusedModalIndex !== null && modals[focusedModalIndex] && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1001]" onClick={minimizeFocusedModal} />

          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vh] rounded-xl shadow-2xl bg-background border border-border overflow-hidden z-[1002]">
            {/* URL bar and controls */}
            <div className="p-3 flex flex-col gap-2 bg-muted/30 border-b border-border">
              {/* URL bar */}
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
                    onClick={minimizeFocusedModal}
                    className="p-1.5 rounded hover:bg-muted/50 transition text-muted-foreground hover:text-foreground"
                    aria-label="Minimize modal"
                    title="Minimize"
                  >
                    <Minimize2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={closeFocusedModal}
                    className="p-1.5 rounded hover:bg-muted/50 transition text-muted-foreground hover:text-foreground"
                    aria-label="Close modal"
                    title="Close"
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
                  // Remove loading indicator when iframe loads
                  const iframe = e.currentTarget
                  const parent = iframe.parentElement
                  if (parent && parent.firstChild !== iframe) {
                    parent.firstChild?.remove()
                  }
                }}
                onError={(e) => {
                  console.error("Iframe loading error:", e)
                  debugRef.current.errors.push(`Iframe error: ${e}`)

                  // Add a message to the iframe container
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
      )}
    </>
  )
}


"use client"

import { useState, useRef, useEffect } from "react"
import { WikiLinkModal } from "./wiki-link-modal"

// Interface for modal data
interface ModalData {
  id: string
  url: string
  zIndex: number
}

export function WikiLinkHandler() {
  // Track multiple modals with an array
  const [openModals, setOpenModals] = useState<ModalData[]>([])
  const [baseZIndex, setBaseZIndex] = useState(50)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Function to bring a modal to the front
  const bringToFront = (modalId: string) => {
    setBaseZIndex((prev) => prev + 1)
    setOpenModals((prev) => prev.map((modal) => (modal.id === modalId ? { ...modal, zIndex: baseZIndex + 1 } : modal)))
  }

  useEffect(() => {
    // Function to determine if a link is external
    const isExternalLink = (href: string) => {
      // Check if the URL is external by looking for http/https protocol
      // or specific file extensions
      return (
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.endsWith(".pdf") ||
        href.endsWith(".doc") ||
        href.endsWith(".docx")
      )
    }

    // Function to handle link hover
    const handleLinkHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest("a") as HTMLAnchorElement

      if (link && isExternalLink(link.href)) {
        // Clear any existing timeout
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current)
        }

        // Set a timeout to open the modal after a short delay
        hoverTimeoutRef.current = setTimeout(() => {
          // Check if a modal for this URL is already open
          const existingModal = openModals.find((modal) => modal.url === link.href)

          if (existingModal) {
            // If modal already exists, bring it to front
            bringToFront(existingModal.id)
          } else {
            // Generate a unique ID for this modal
            const modalId = `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

            // Add new modal to the list with incremented z-index
            setBaseZIndex((prev) => prev + 1)
            setOpenModals((prev) => [
              ...prev,
              {
                id: modalId,
                url: link.href,
                zIndex: baseZIndex + 1,
              },
            ])
          }
        }, 500) // 500ms delay before showing modal
      }
    }

    // Function to handle link hover end
    const handleLinkHoverEnd = () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
        hoverTimeoutRef.current = null
      }
    }

    // Function to handle link click
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest("a") as HTMLAnchorElement

      if (link && isExternalLink(link.href)) {
        e.preventDefault()

        // Check if a modal for this URL is already open
        const existingModal = openModals.find((modal) => modal.url === link.href)

        if (existingModal) {
          // If modal already exists, bring it to front
          bringToFront(existingModal.id)
        } else {
          // Generate a unique ID for this modal
          const modalId = `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

          // Add new modal to the list with incremented z-index
          setBaseZIndex((prev) => prev + 1)
          setOpenModals((prev) => [
            ...prev,
            {
              id: modalId,
              url: link.href,
              zIndex: baseZIndex + 1,
            },
          ])
        }
      }
    }

    // Find all links in the wiki content
    const wikiContent = document.querySelector(".wiki-content")
    if (wikiContent) {
      const links = wikiContent.querySelectorAll("a")

      // Add event listeners to each link
      links.forEach((link) => {
        // Check if the link is external
        const external = isExternalLink(link.href)

        if (external) {
          // For external links, add hover listeners and prevent default click
          link.addEventListener("mouseenter", handleLinkHover)
          link.addEventListener("mouseleave", handleLinkHoverEnd)
          link.addEventListener("click", handleLinkClick)

          // Add a class to style external links
          link.classList.add("wiki-external-link")
        } else {
          // For internal links, just add styling class
          // Do NOT add hover or click handlers - let them work normally
          link.classList.add("wiki-internal-link")
        }
      })
    }

    // Cleanup function
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }

      if (wikiContent) {
        const links = wikiContent.querySelectorAll("a")
        links.forEach((link) => {
          if (isExternalLink(link.href)) {
            link.removeEventListener("mouseenter", handleLinkHover)
            link.removeEventListener("mouseleave", handleLinkHoverEnd)
            link.removeEventListener("click", handleLinkClick)
          }
        })
      }
    }
  }, [openModals, baseZIndex])

  // Function to close a specific modal
  const handleCloseModal = (modalId: string) => {
    setOpenModals((prev) => prev.filter((modal) => modal.id !== modalId))
  }

  return (
    <>
      {/* Render all open modals */}
      {openModals.map((modal) => (
        <WikiLinkModal
          key={modal.id}
          id={modal.id}
          url={modal.url}
          zIndex={modal.zIndex}
          isOpen={true}
          onClose={() => handleCloseModal(modal.id)}
          onFocus={() => bringToFront(modal.id)}
        />
      ))}
    </>
  )
}


"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Minimize2, Maximize2, X, AlignJustify } from "lucide-react"
import { cn } from "@/lib/utils"

interface TableOfContentsItem {
  id: string
  text: string
  level: number
  number?: string // Add number property for hierarchical numbering
}

interface TableOfContentsProps {
  headings: TableOfContentsItem[]
  className?: string
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ headings, className }) => {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [numberedHeadings, setNumberedHeadings] = useState<TableOfContentsItem[]>([])
  const tocRef = useRef<HTMLDivElement>(null)

  // Debug the incoming headings
  useEffect(() => {
    console.log("Raw headings received:", headings)
  }, [headings])

  // Add numbering to headings
  // Function to extract headings from the DOM with improved reliability
  const extractHeadingsFromDOM = () => {
    if (typeof document === "undefined") return

    // Find all h1, h2, and h3 elements in the document
    const headingElements = document.querySelectorAll(".post-content h1, .post-content h2, .post-content h3")
    console.log("Found heading elements in DOM:", headingElements.length)

    // Convert NodeList to array of TableOfContentsItem
    const extractedHeadings: TableOfContentsItem[] = []
    headingElements.forEach((element, index) => {
      const tagName = element.tagName.toLowerCase()
      const level = Number.parseInt(tagName.charAt(1))

      // Use existing ID or create one
      let id = element.id
      if (!id) {
        id = `heading-${index}`
        element.id = id
      }

      extractedHeadings.push({
        id,
        text: element.textContent || "",
        level,
      })
    })

    console.log("Extracted headings from DOM:", extractedHeadings)

    if (extractedHeadings.length > 0) {
      // Add hierarchical numbering
      const numbered = addHierarchicalNumbering(extractedHeadings)
      setNumberedHeadings(numbered)
      return true
    }
    return false
  }

  // Set up multiple attempts to extract headings with increasing delays
  useEffect(() => {
    if (headings && headings.length > 0) {
      // If headings are provided, use them
      const filteredHeadings = headings.filter((heading) => heading.level <= 3)
      const numbered = addHierarchicalNumbering(filteredHeadings)
      setNumberedHeadings(numbered)
      console.log("Table of Contents using provided headings:", numbered)
    } else {
      // If no headings are provided, extract them from the DOM with multiple attempts
      let attempts = 0
      const maxAttempts = 5
      const attemptExtraction = () => {
        console.log(`Attempt ${attempts + 1} to extract headings from DOM`)
        if (extractHeadingsFromDOM()) {
          console.log("Successfully extracted headings")
        } else if (attempts < maxAttempts) {
          attempts++
          // Increase delay with each attempt
          setTimeout(attemptExtraction, 300 * attempts)
        } else {
          console.warn("Failed to extract headings after multiple attempts")
        }
      }

      // Start the first attempt
      attemptExtraction()

      // Also set up a MutationObserver to detect when new headings might be added
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
            // Only try to extract again if we don't already have headings
            if (numberedHeadings.length === 0) {
              console.log("DOM changed, attempting to extract headings again")
              extractHeadingsFromDOM()
            }
          }
        }
      })

      // Start observing the post content area
      const postContent = document.querySelector(".post-content")
      if (postContent) {
        observer.observe(postContent, { childList: true, subtree: true })
      }

      return () => {
        observer.disconnect()
      }
    }
  }, [headings])

  // Remove the existing useEffect that tries to force re-extraction on mount
  // and replace with this more comprehensive approach
  useEffect(() => {
    // This effect runs when the component mounts
    const handleContentLoaded = () => {
      console.log("Content loaded event fired")
      if (numberedHeadings.length === 0) {
        extractHeadingsFromDOM()
      }
    }

    // Try to extract headings when the component mounts
    if (typeof document !== "undefined") {
      // If document is already loaded
      if (document.readyState === "complete") {
        handleContentLoaded()
      } else {
        // Wait for document to be fully loaded
        window.addEventListener("load", handleContentLoaded)
        return () => {
          window.removeEventListener("load", handleContentLoaded)
        }
      }
    }
  }, [])

  // Function to add hierarchical numbering to headings
  const addHierarchicalNumbering = (items: TableOfContentsItem[]): TableOfContentsItem[] => {
    const counters = [0, 0, 0] // Counters for h1, h2, h3
    const result: TableOfContentsItem[] = []

    for (const item of items) {
      const level = item.level

      // Reset lower level counters
      for (let i = level; i < counters.length; i++) {
        counters[i] = 0
      }

      // Increment current level counter
      counters[level - 1]++

      // Generate number based on level
      let number = ""
      if (level === 1) {
        number = `${counters[0]}`
      } else if (level === 2) {
        number = `${counters[0]}.${counters[1]}`
      } else if (level === 3) {
        number = `${counters[0]}.${counters[1]}.${counters[2]}`
      }

      result.push({
        ...item,
        number,
      })
    }

    return result
  }

  // Set up intersection observer to detect which heading is currently in view
  useEffect(() => {
    if (typeof document === "undefined" || numberedHeadings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      {
        rootMargin: "0% 0% -80% 0%",
      },
    )

    // Observe all headings in the document
    numberedHeadings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      observer.disconnect()
    }
  }, [numberedHeadings])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      // Scroll the element into view with smooth behavior
      element.scrollIntoView({ behavior: "smooth", block: "start" })
      // Update the active ID
      setActiveId(id)
    } else {
      console.error(`Element with ID "${id}" not found in the document`)

      // Try to find heading by text content as fallback
      const headingText = numberedHeadings.find((item) => item.id === id)?.text
      if (headingText) {
        const headingsElements = document.querySelectorAll("h1, h2, h3")
        for (const heading of headingsElements) {
          if (heading.textContent?.trim() === headingText) {
            heading.scrollIntoView({ behavior: "smooth", block: "start" })
            break
          }
        }
      }
    }
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const openModal = () => {
    setIsModalOpen(true)
    setIsMinimized(false)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  // Render the TOC content
  const renderTocContent = () => (
    <>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium">Table of Contents</h3>
        <div className="flex gap-1">
          {isModalOpen ? (
            <button
              onClick={closeModal}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <>
              <button
                onClick={toggleMinimize}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={isMinimized ? "Expand" : "Minimize"}
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </button>
              <button
                onClick={openModal}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Open in modal"
              >
                <AlignJustify className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
      <ul className={cn("space-y-1", isMinimized && "hidden")}>
        {numberedHeadings.map((heading) => (
          <li key={heading.id} style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}>
            <button
              className={cn(
                "text-left text-sm py-1 hover:text-foreground transition-colors w-full truncate flex",
                activeId === heading.id ? "text-foreground font-medium" : "text-muted-foreground",
              )}
              onClick={() => {
                scrollToSection(heading.id)
                if (isModalOpen) closeModal()
              }}
            >
              <span className="inline-block w-10 flex-shrink-0">{heading.number}.</span>
              <span className="truncate">{heading.text}</span>
            </button>
          </li>
        ))}
      </ul>
    </>
  )

  // If no headings are available, don't render anything
  if (numberedHeadings.length === 0) {
    return null
  }

  // Render minimized view
  if (isMinimized && !isModalOpen) {
    return (
      <div
        ref={tocRef}
        className={cn(
          "toc-minimized bg-card border border-border p-2 sticky top-8 transition-all duration-300",
          className,
        )}
      >
        <div className="toc-title flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">TOC</span>
          <button
            onClick={toggleMinimize}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Expand"
          >
            <Maximize2 className="h-3 w-3" />
          </button>
        </div>
      </div>
    )
  }

  // Render modal view
  if (isModalOpen) {
    return (
      <>
        <div className="toc-modal-backdrop" onClick={closeModal}></div>
        <div className="toc-modal">{renderTocContent()}</div>
      </>
    )
  }

  // Render normal view
  return (
    <div
      ref={tocRef}
      className={cn("bg-card border border-border p-4 sticky top-8 transition-all duration-300", className)}
    >
      {renderTocContent()}
    </div>
  )
}

export default TableOfContents


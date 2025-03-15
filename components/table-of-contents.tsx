"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Minimize2, Maximize2, X, AlignJustify } from "lucide-react"
import { cn } from "@/lib/utils"

interface TableOfContentsItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  headings: TableOfContentsItem[]
  className?: string
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ headings, className }) => {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const tocRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log("Table of Contents headings:", headings)

    // Check if heading IDs exist in the document
    setTimeout(() => {
      headings.forEach((heading) => {
        const element = document.getElementById(heading.id)
        console.log(`Heading ID "${heading.id}" exists in document:`, !!element)
      })
    }, 1000) // Give time for the content to render
  }, [headings])

  useEffect(() => {
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

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      headings.forEach((heading) => {
        const element = document.getElementById(heading.id)
        if (element) {
          observer.unobserve(element)
        }
      })
    }
  }, [headings])

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
      const headingText = headings.find((item) => item.id === id)?.text
      if (headingText) {
        const headingsElements = document.querySelectorAll("h1, h2, h3, h4, h5, h6")
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
        {headings.map((heading) => (
          <li key={heading.id} style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}>
            <button
              className={cn(
                "text-left text-sm py-1 hover:text-foreground transition-colors w-full truncate",
                activeId === heading.id ? "text-foreground font-medium" : "text-muted-foreground",
              )}
              onClick={() => {
                scrollToSection(heading.id)
                if (isModalOpen) closeModal()
              }}
            >
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </>
  )

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


"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { X, Maximize2, Minimize2 } from "lucide-react"
import wikipediaData from "@/data/wikipedia.json"

interface WikipediaTerms {
  terms: {
    term: string
    link: string
  }[]
}

interface WikipediaModalProps {
  term: string
  link: string
  onClose: () => void
}

// Draggable Wikipedia modal component
const WikipediaModal = ({ term, link, onClose }: WikipediaModalProps) => {
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  // Set initial position to center of screen
  useEffect(() => {
    const centerX = Math.max(window.innerWidth / 2 - 250, 20) // 500px width / 2
    const centerY = Math.max(window.innerHeight / 2 - 200, 20) // 400px height / 2
    setPos({ x: centerX, y: centerY })
  }, [])

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (modalRef.current && e.target === modalRef.current.querySelector(".drag-handle")) {
      setIsDragging(true)
      setDragOffset({
        x: e.clientX - pos.x,
        y: e.clientY - pos.y,
      })
    }
  }

  // Handle mouse move for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPos({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, dragOffset])

  // Toggle fullscreen mode
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen)
  }

  // Calculate modal styles based on fullscreen state
  const getModalStyles = () => {
    if (isFullScreen) {
      return {
        left: "5vw",
        top: "5vh",
        width: "90vw",
        height: "90vh",
        cursor: isDragging ? "grabbing" : "default",
      }
    } else {
      return {
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        width: "500px",
        height: "400px",
        cursor: isDragging ? "grabbing" : "default",
      }
    }
  }

  return createPortal(
    <div
      ref={modalRef}
      className="fixed z-50 shadow-xl rounded-lg overflow-hidden"
      style={getModalStyles()}
      onMouseDown={handleMouseDown}
    >
      <div className="bg-background border border-border rounded-lg flex flex-col h-full">
        <div className="drag-handle flex items-center justify-between p-3 bg-muted/30 border-b border-border cursor-grab">
          <h3 className="text-sm font-medium">{term}</h3>
          <div className="flex items-center space-x-2">
            <button onClick={toggleFullScreen} className="text-muted-foreground hover:text-foreground">
              {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="flex-1 relative">
          {!iframeLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-background">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}
          <iframe
            src={link}
            className="w-full h-full border-0"
            onLoad={() => setIframeLoaded(true)}
            title={`Wikipedia: ${term}`}
          />
        </div>
      </div>
    </div>,
    document.body,
  )
}

// Tagged term component
const TaggedTerm = ({ children, term, link }: { children: React.ReactNode; term: string; link: string }) => {
  console.log("🔍 DEBUG: Rendering TaggedTerm for:", term)

  const [showModal, setShowModal] = useState(false)
  const termRef = useRef<HTMLSpanElement>(null)

  const handleMouseEnter = () => {
    setShowModal(true)
  }

  // Only close the modal when explicitly requested
  const handleCloseModal = () => {
    setShowModal(false)
  }

  return (
    <>
      <span
        ref={termRef}
        style={{
          backgroundColor: "rgba(100, 100, 100, 0.1)",
          borderBottom: "2px solid hsl(var(--muted-foreground))",
          color: "hsl(var(--foreground))",
          padding: "0 4px",
          borderRadius: "4px",
          fontWeight: "500",
          cursor: "help",
        }}
        onMouseEnter={handleMouseEnter}
        // Removed the onMouseLeave handler to keep the modal open
      >
        {children}
      </span>
      {showModal && <WikipediaModal term={term} link={link} onClose={handleCloseModal} />}
    </>
  )
}

// Add new MarginNoteReference component
const MarginNoteReference = ({ index, onClick }: { index: number; onClick: () => void }) => {
  return (
    <sup
      onClick={onClick}
      className="cursor-pointer text-primary hover:text-primary/80 transition-colors"
      style={{
        fontFamily: "EB Garamond, serif",
        fontSize: "0.8em",
        fontWeight: "500",
      }}
    >
      [{index}]
    </sup>
  )
}

// Update the ScriptTagger function to track tagged terms and handle case-insensitive matching
export function ScriptTagger({ children }: { children: React.ReactNode }) {
  const [processedContent, setProcessedContent] = useState<React.ReactNode>(children)

  useEffect(() => {
    if (typeof children !== "string") {
      setProcessedContent(children)
      return
    }

    const text = children as string
    let result: React.ReactNode[] = [text]

    // Track which terms have already been tagged
    const taggedTerms = new Set<string>()

    // Process Wikipedia terms
    wikipediaData.terms.forEach(({ term, link }) => {
      const newResult: React.ReactNode[] = []

      result.forEach((segment) => {
        if (typeof segment !== "string") {
          newResult.push(segment)
          return
        }

        // If this term has already been tagged, don't process it again
        // Use lowercase for case-insensitive comparison
        if (taggedTerms.has(term.toLowerCase())) {
          newResult.push(segment)
          return
        }

        // Create a case-insensitive regex for matching
        const termRegex = new RegExp(`(${term})`, "gi")
        const parts = segment.split(termRegex)
        let hasTaggedTerm = false

        parts.forEach((part, index) => {
          // Case-insensitive comparison using toLowerCase()
          if (part.toLowerCase() === term.toLowerCase() && !hasTaggedTerm) {
            // Only tag the first occurrence
            newResult.push(
              <TaggedTerm key={`${term}-${index}`} term={term} link={link}>
                {part}
              </TaggedTerm>,
            )
            hasTaggedTerm = true
            taggedTerms.add(term.toLowerCase())
          } else if (part.toLowerCase() === term.toLowerCase()) {
            // For subsequent occurrences, just add the text
            newResult.push(part)
          } else if (part) {
            // Look for margin note references in the format [n]
            const noteRegex = /\[(\d+)\]/g
            const noteParts = part.split(noteRegex)

            noteParts.forEach((notePart, noteIndex) => {
              if (noteIndex % 2 === 0) {
                // Regular text
                if (notePart) newResult.push(notePart)
              } else {
                // Margin note reference
                const noteIndex = Number.parseInt(notePart, 10)
                newResult.push(
                  <MarginNoteReference
                    key={`note-${noteIndex}`}
                    index={noteIndex}
                    onClick={() => {
                      // Scroll to the corresponding margin note
                      const noteElement = document.querySelector(`[data-note-index="${noteIndex}"]`)
                      if (noteElement) {
                        noteElement.scrollIntoView({ behavior: "smooth" })
                        noteElement.classList.add("highlight")
                        setTimeout(() => noteElement.classList.remove("highlight"), 2000)
                      }
                    }}
                  />,
                )
              }
            })
          }
        })
      })

      result = newResult
    })

    setProcessedContent(result)
  }, [children])

  return <>{processedContent}</>
}


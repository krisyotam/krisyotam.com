"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { X, Calendar } from "lucide-react"
import { useTheme } from "next-themes"
import type { ProgymnasmataEntry } from "./progymnasmata"

interface ProgymnasmataContentViewerProps {
  entry: ProgymnasmataEntry
  onClose: () => void
}

const ContentViewerStyles = () => (
  <style jsx global>{`
    .content-viewer-overlay {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      background-color: rgba(0, 0, 0, 0.75) !important;
      z-index: 50 !important;
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
      padding: 1rem !important;
      overflow-y: auto !important;
    }
    
    .content-viewer {
      background-color: white !important;
      border-radius: 0.5rem !important;
      width: 100% !important;
      max-width: 800px !important;
      max-height: 90vh !important;
      overflow-y: auto !important;
      position: relative !important;
      display: flex !important;
      flex-direction: column !important;
    }
    
    .dark .content-viewer {
      background-color: #121212 !important;
      color: #f3f4f6 !important;
    }
    
    .content-viewer-header {
      padding: 1.5rem !important;
      border-bottom: 1px solid #e5e7eb !important;
      position: sticky !important;
      top: 0 !important;
      background-color: white !important;
      z-index: 10 !important;
    }
    
    .dark .content-viewer-header {
      background-color: #121212 !important;
      border-bottom-color: #2a2a2a !important;
    }
    
    .content-viewer-title {
      font-size: 1.875rem !important;
      font-weight: 700 !important;
      color: #111827 !important;
      line-height: 1.2 !important;
      margin-bottom: 0.5rem !important;
    }
    
    .dark .content-viewer-title {
      color: #f3f4f6 !important;
    }
    
    .content-viewer-meta {
      display: flex !important;
      align-items: center !important;
      gap: 1rem !important;
      margin-bottom: 0.5rem !important;
    }
    
    .content-viewer-type {
      display: inline-flex !important;
      align-items: center !important;
      border: 1px solid #6b7280 !important;
      border-radius: 9999px !important;
      padding: 0.25rem 0.75rem !important;
      font-size: 0.75rem !important;
      font-weight: 500 !important;
      line-height: 1 !important;
      color: #6b7280 !important;
    }
    
    .dark .content-viewer-type {
      color: #d1d5db !important;
      border-color: #4d4d4d !important;
    }
    
    .content-viewer-date {
      display: flex !important;
      align-items: center !important;
      font-size: 0.875rem !important;
      color: #6b7280 !important;
    }
    
    .dark .content-viewer-date {
      color: #9ca3af !important;
    }
    
    .content-viewer-close {
      position: absolute !important;
      top: 1rem !important;
      right: 1rem !important;
      background-color: transparent !important;
      border: none !important;
      color: #6b7280 !important;
      cursor: pointer !important;
      padding: 0.5rem !important;
      border-radius: 9999px !important;
      transition: background-color 0.2s ease !important;
    }
    
    .content-viewer-close:hover {
      background-color: rgba(0, 0, 0, 0.05) !important;
    }
    
    .dark .content-viewer-close {
      color: #9ca3af !important;
    }
    
    .dark .content-viewer-close:hover {
      background-color: rgba(255, 255, 255, 0.1) !important;
    }
    
    .content-viewer-body {
      padding: 1.5rem !important;
      font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif !important;
      line-height: 1.8 !important;
      color: #374151 !important;
    }
    
    .dark .content-viewer-body {
      color: #d1d5db !important;
    }
    
    .content-viewer-paragraph {
      margin-bottom: 1.5rem !important;
      font-size: 1.125rem !important;
    }
    
    .content-viewer-paragraph:last-child {
      margin-bottom: 0 !important;
    }
  `}</style>
)

export function ProgymnasmataContentViewer({ entry, onClose }: ProgymnasmataContentViewerProps) {
  const { theme } = useTheme()
  const contentRef = useRef<HTMLDivElement>(null)
  const { title, type, date, paragraphs } = entry

  useEffect(() => {
    // Prevent body scrolling when modal is open
    document.body.style.overflow = "hidden"

    // Handle escape key to close modal
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleEscape)

    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleEscape)
    }
  }, [onClose])

  // Handle click outside to close
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <>
      <ContentViewerStyles />
      <div className="content-viewer-overlay" onClick={handleOverlayClick}>
        <div className={`content-viewer ${theme === "dark" ? "dark" : ""}`} ref={contentRef}>
          <div className="content-viewer-header">
            <h2 className="content-viewer-title">{title}</h2>
            <div className="content-viewer-meta">
              <div className="content-viewer-type">{type}</div>
              <div className="content-viewer-date">
                <Calendar className="h-4 w-4 mr-1" />
                <span>
                  {new Date(date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
            <button className="content-viewer-close" onClick={onClose} aria-label="Close">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="content-viewer-body">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="content-viewer-paragraph">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}


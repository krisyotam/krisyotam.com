"use client"

import type React from "react"

import type { ReactNode } from "react"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { ExternalLink } from "lucide-react"

// Global event emitter for link hover events
export const linkEvents = {
  listeners: new Set<(url: string, text: string, x: number, y: number) => void>(),

  addListener: (callback: (url: string, text: string, x: number, y: number) => void) => {
    linkEvents.listeners.add(callback)
    return () => linkEvents.listeners.delete(callback)
  },

  emit: (url: string, text: string, x: number, y: number) => {
    linkEvents.listeners.forEach((callback) => callback(url, text, x, y))
  },
}

interface AProps {
  href: string
  children: ReactNode
  className?: string
  isInternal?: boolean
}

export function A({ href, children, className = "", isInternal = false }: AProps) {
  const [isHovering, setIsHovering] = useState(false)
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null)
  const linkRef = useRef<HTMLAnchorElement>(null)

  // Check if the link is external or internal
  const isExternal = href.startsWith("http") || href.startsWith("//")

  // Determine if we should apply the internal link styling
  // Either explicitly set by prop or determined by the href
  const shouldUseInternalStyle = isInternal || (!isExternal && href.startsWith("/"))

  // Handle mouse enter/leave events
  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.currentTarget.getAttribute("data-no-preview") === "true") return

    setIsHovering(true)

    // Clear any existing timer
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current)
    }

    // Set timer to emit event after delay
    hoverTimerRef.current = setTimeout(() => {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = rect.top

      // Emit event for universal-link-modal to handle
      linkEvents.emit(href, typeof children === "string" ? children : e.currentTarget.textContent || "", x, y)
    }, 500)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)

    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current)
      hoverTimerRef.current = null
    }
  }

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current)
      }
    }
  }, [])

  // For external links, use regular <a> tag instead of Next.js Link
  if (isExternal) {
    return (
      <a
        ref={linkRef}
        href={href}
        className={cn(
          "border-b border-dotted border-gray-500 hover:border-gray-900 dark:border-gray-500 dark:hover:border-white transition-colors inline-flex items-center wiki-external-link",
          className,
        )}
        // Don't open in modal, let it open in a new tab
        target="_blank"
        rel="noopener noreferrer"
        data-no-modal="true"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
        <ExternalLink className="ml-0.5 h-3 w-3 text-gray-400 inline-flex" />
      </a>
    )
  }

  // For internal links that aren't handled by the InternalLink component
  // Use regular <a> tag with data attribute to allow WikiLinkHandler to work
  if (shouldUseInternalStyle) {
    return (
      <a
        ref={linkRef}
        href={href}
        className={cn(
          "text-primary/80 hover:text-primary transition-colors",
          "border-b border-primary/30 hover:border-primary/60 wiki-internal-link",
          className,
        )}
        data-internal-link="true"
        data-no-modal="true"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </a>
    )
  }

  // For regular links (not external, not internal navigation)
  return (
    <a
      ref={linkRef}
      href={href}
      className={cn(
        "border-b border-dotted border-gray-500 hover:border-gray-900 dark:border-gray-500 dark:hover:border-white transition-colors",
        className,
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </a>
  )
}


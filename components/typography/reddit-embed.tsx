"use client"

import { useTheme } from "next-themes"
import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

// Add TypeScript interface for the Reddit embed global object
declare global {
  interface Window {
    rembeddit?: {
      load: () => void;
    };
  }
}

interface RedditEmbedProps {
  postUrl: string
  height?: number
  showMedia?: boolean
  showThread?: boolean
  className?: string
}

export function RedditEmbed({
  postUrl,
  height = 316,
  showMedia = false,
  showThread = false,
  className = "",
}: RedditEmbedProps) {
  const { resolvedTheme } = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)
  const embedInitialized = useRef(false)

  useEffect(() => {
    // Function to load the Reddit embed script
    const loadRedditEmbed = () => {
      if (
        typeof window !== "undefined" &&
        !document.querySelector('script[src="https://embed.reddit.com/widgets.js"]')
      ) {
        const script = document.createElement("script")
        script.src = "https://embed.reddit.com/widgets.js"
        script.async = true
        script.charset = "UTF-8"
        document.body.appendChild(script)
        
        // After script is loaded, initialize the embed
        script.onload = () => {
          // Give a small delay to ensure Reddit's JS has initialized
          setTimeout(createEmbed, 100)
        }
      } else {
        // Script already exists, create embed directly
        createEmbed()
      }
    }

    // Function to create the embed
    const createEmbed = () => {
      if (!containerRef.current) return

      // Clear previous embed if it exists
      containerRef.current.innerHTML = ""

      // Create the blockquote element
      const blockquote = document.createElement("blockquote")
      blockquote.className = "reddit-embed-bq"
      blockquote.style.height = `${height}px`
      blockquote.setAttribute("data-embed-height", height.toString())
      blockquote.setAttribute("data-embed-showheader", "true")
      blockquote.setAttribute("data-embed-showborder", "false")

      // Set theme based on the current theme
      if (resolvedTheme === "dark") {
        blockquote.setAttribute("data-embed-theme", "dark")
      } else {
        blockquote.setAttribute("data-embed-theme", "light")
      }

      // Add media and thread attributes if needed
      if (showMedia) {
        blockquote.setAttribute("data-embed-media", "www")
      }

      if (showThread) {
        blockquote.setAttribute("data-embed-parent", "false")
      }

      // Create a hidden link element (required by Reddit's embed script but won't be visible)
      const link = document.createElement("a")
      link.href = postUrl
      link.style.display = "none" // Hide the link
      
      // Append elements
      blockquote.appendChild(link)
      containerRef.current.appendChild(blockquote)

      // Force Reddit's embed script to re-process the page
      if (window.rembeddit && typeof window.rembeddit.load === "function") {
        window.rembeddit.load()
      }
    }

    // Create the embed when the component mounts or theme changes
    loadRedditEmbed()
    embedInitialized.current = true

    // Cleanup function
    return () => {
      embedInitialized.current = false
    }
  }, [postUrl, height, resolvedTheme, showMedia, showThread])

  // Define base classes for consistent styling with Box component
  const baseClasses = "p-6 rounded-none my-6 bg-muted/50 dark:bg-[hsl(var(--popover))]"

  return (
    <div className={cn(baseClasses, className)}>
      <div ref={containerRef} />
    </div>
  )
}

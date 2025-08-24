"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function ScrollbarController() {
  const pathname = usePathname()
  
  useEffect(() => {
    // Check if the current path is a blog post or notes page
    // Patterns: /blog/{year}/{slug} or /notes/{year}/{slug}
    const isBlogOrNotesPost = (
      /^\/blog\/\d{4}\/[\w-]+$/.test(pathname) || 
      /^\/notes\/\d{4}\/[\w-]+$/.test(pathname)
    )
    
    // Apply appropriate scrollbar style
    if (isBlogOrNotesPost) {
      // For blog posts and notes pages, always show scrollbar to prevent layout shift
      document.documentElement.classList.remove("hide-scrollbar")
      document.documentElement.classList.add("show-scrollbar")
    } else {
      // For other pages, hide the scrollbar
      document.documentElement.classList.remove("show-scrollbar")
      document.documentElement.classList.add("hide-scrollbar")
    }
    
    // Clean up when component unmounts
    return () => {
      document.documentElement.classList.remove("show-scrollbar")
      document.documentElement.classList.remove("hide-scrollbar")
    }
  }, [pathname])
  
  return null // This component doesn't render anything
} 
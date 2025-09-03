"use client"

import type React from "react"
import { useEffect } from "react"

export function BlogStyleWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Apply styles directly to ensure they're applied
    const style = document.createElement("style")
    style.textContent = `
      .post-content {
        border: 5px solid blue !important;
        padding: 20px !important;
        background-color: #f0f0f0 !important;
      }
      
      .post-content h1, .post-content h2, .post-content h3 {
        color: purple !important;
      }
      
      .post-content p {
        color: #333 !important;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return <>{children}</>
}


// components/link-tags.tsx
"use client"

import React, { useEffect } from "react"
import linkTags from "@/data/link-tags.json"

export default function LinkTags({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const root = document.querySelector(".post-content")
      if (!root) return

      // Only target <a> tags inside <p>, and skip any already-processed
      const links = root.querySelectorAll<HTMLAnchorElement>(
        "p a:not([data-link-icon])"
      )

      links.forEach(link => {
        const href = link.getAttribute("href")
        if (!href) return

        // helper to detect an external absolute URL
        const isAbsolute = /^https?:\/\//i.test(href)

        // find first matching tag
        const match = linkTags.find(tag => {
          // 1) file-extension match?
          if (tag.extension) {
            const re = new RegExp(`\\${tag.extension}(?:[?#]|$)`, "i")
            if (re.test(href)) return true
          }

          // 2) external-domain match?
          if (tag.domain && tag.domain !== "/") {
            if (href.includes(tag.domain)) return true
          }

          // 3) INTERNAL catch-all only for relative URLs
          if (tag.domain === "/") {
            // anything *not* starting with http:// or https://
            if (!isAbsolute) return true
          }

          return false
        })
        if (!match) return

        link.setAttribute("data-link-icon", match.name.toLowerCase())
        link.setAttribute("data-link-icon-type", "svg")
        link.setAttribute("data-link-icon-color", "#e00")
        link.setAttribute(
          "style",
          `--link-icon-url: url('/links/${match.svg}');`
        )

        const span = document.createElement("span")
        span.className = "link-icon-hook"
        link.appendChild(span)
      })
    })

    const rootElement = document.querySelector(".post-content")
    if (rootElement) {
      observer.observe(rootElement, { childList: true, subtree: true })
    }

    return () => observer.disconnect()
  }, [])

  return <>{children}</>
}

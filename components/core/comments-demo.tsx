"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

interface CommentsProps {
  mapping?: "pathname" | "url" | "title" | "og:title"
}

export function Comments({ mapping = "pathname" }: CommentsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    while (container.firstChild) {
      container.removeChild(container.firstChild)
    }

    const script = document.createElement("script")
    script.src = "https://giscus.app/client.js"
    script.async = true
    script.crossOrigin = "anonymous"
    script.setAttribute("data-repo", "krisyotam/comments")
    script.setAttribute("data-repo-id", "R_kgDOQxAiHw")
    script.setAttribute("data-category", "General")
    script.setAttribute("data-category-id", "DIC_kwDOQxAiH84C0YsU")
    script.setAttribute("data-mapping", mapping)
    script.setAttribute("data-strict", "0")
    script.setAttribute("data-reactions-enabled", "1")
    script.setAttribute("data-emit-metadata", "0")
    script.setAttribute("data-input-position", "top")
    script.setAttribute("data-theme", resolvedTheme === "dark" ? "dark" : "light")
    script.setAttribute("data-lang", "en")
    script.setAttribute("data-loading", "lazy")

    container.appendChild(script)
  }, [resolvedTheme, mapping])

  return (
    <section className="mt-4 pt-4 border-t border-border">
      <div ref={containerRef} />
    </section>
  )
}

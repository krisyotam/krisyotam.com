"use client"

import React, { useEffect, useState } from "react"
import { MarginCard } from "@/components/margin-notes"
import { Bibliography } from "@/components/bibliography"
import RelatedPosts from "@/components/related-posts"
import type { TOCHeading, MarginNote, BibliographyEntry } from "@/lib/mdx"

interface MDXRendererProps {
  children: React.ReactNode
  frontmatter: {
    headings?: TOCHeading[]
    marginNotes?: MarginNote[]
    bibliography?: BibliographyEntry[]
  }
  slug: string
}

export function MDXRenderer({ children, frontmatter, slug }: MDXRendererProps) {
  const { headings = [], marginNotes = [], bibliography = [] } = frontmatter

  // Assign IDs to headings synchronously to avoid layout shifts
  useEffect(() => {
    if (typeof document === "undefined") return
    const els = document.querySelectorAll<HTMLElement>(".mdx-content h1, .mdx-content h2, .mdx-content h3")
    els.forEach((heading, index) => {
      if (!heading.id) {
        const text = heading.textContent?.toLowerCase().replace(/[^\w]+/g, "-") || ""
        heading.id = text || `heading-${index}`
      }
    })
  }, [children])
  
  // Extract text content for related posts
  const [textContent, setTextContent] = useState("")
  useEffect(() => {
    if (typeof document === "undefined") return
    const contentEl = document.querySelector<HTMLElement>(".mdx-content")
    setTextContent(contentEl?.textContent || "")
  }, [children]);
  
  return (
    <div className="mdx-content relative z-10">
      {children}

      {/* Bibliography */}
      {bibliography.length > 0 && (
        <div className="my-8">
          <Bibliography bibliography={bibliography} />
        </div>
      )}

      {/* Related Posts */}
      <div className="my-8">
        <RelatedPosts slug={slug} />
      </div>
    </div>
  )
}

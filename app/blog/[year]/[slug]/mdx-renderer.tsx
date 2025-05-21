"use client"

import React, { useEffect, useState } from "react"
import { MarginCard } from "@/components/margin-notes"
import TableOfContents from "@/components/table-of-contents"
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
}

export function MDXRenderer({ children, frontmatter }: MDXRendererProps) {
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
  }, [children])

  const tocHeadings = headings.filter((h) => h.level <= 3)

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr_1fr] gap-8 relative">
      {/* Left sidebar: Table of Contents */}
      <div className="hidden md:block sticky top-8">
        <TableOfContents headings={tocHeadings} />
      </div>

      {/* Main content */}
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
          <RelatedPosts />
        </div>
      </div>

      {/* Right sidebar: Margin Notes */}
      <div className="hidden md:block sticky top-8 space-y-4">
        {marginNotes.length > 0 ? (
          marginNotes.map((note) => <MarginCard key={note.id} note={note} />)
        ) : (
          <div className="text-sm text-muted-foreground p-4 border border-border rounded-md">
            No margin notes available for this post.
          </div>
        )}
      </div>
    </div>
  )
}

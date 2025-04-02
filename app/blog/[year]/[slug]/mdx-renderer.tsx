"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { MarginCard } from "@/components/margin-card"
import TableOfContents from "@/components/table-of-contents"
import { Bibliography } from "@/components/bibliography"
import { RelatedPosts } from "@/components/related-posts"
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

  // Ensure we start at the top of the page
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0)
    }
  }, [frontmatter])

  // Filter headings to only include h1, h2, and h3
  const filteredHeadings = headings.filter((heading) => heading.level <= 3)

  // Extract text content for related posts matching
  const [textContent, setTextContent] = useState<string>("")

  // Extract text content from the rendered MDX
  useEffect(() => {
    if (typeof document !== "undefined") {
      const contentElement = document.querySelector(".mdx-content")
      if (contentElement) {
        setTextContent(contentElement.textContent || "")
      }
    }
  }, [children])

  // Debug the headings
  useEffect(() => {
    console.log("MDXRenderer received headings:", headings)
    console.log("Filtered headings:", filteredHeadings)
  }, [headings, filteredHeadings])

  // Improve the MDXRenderer component to ensure headings are properly processed

  // Add this useEffect to ensure headings have IDs
  useEffect(() => {
    // Ensure all headings have IDs for the Table of Contents
    if (typeof document !== "undefined") {
      setTimeout(() => {
        const headings = document.querySelectorAll(".mdx-content h1, .mdx-content h2, .mdx-content h3")
        headings.forEach((heading, index) => {
          if (!heading.id) {
            // Create an ID from the heading text
            const text = heading.textContent || ""
            const id = text.toLowerCase().replace(/[^\w]+/g, "-")
            heading.id = id || `heading-${index}`
            console.log(`Added ID to heading: ${heading.id}`)
          }
        })
      }, 100)
    }
  }, [children])

  return (
    <div className="relative">
      {/* Main content */}
      <div className="relative z-10 mdx-content">
        {/* Render MDX content */}
        {children}

        {/* Bibliography - if provided */}
        {bibliography && bibliography.length > 0 && (
          <div className="my-8">
            <Bibliography bibliography={bibliography} />
          </div>
        )}

        {/* Related Posts - Automatically finds related content */}
        {textContent && <RelatedPosts content={textContent} />}
      </div>

      {/* 
        SIDEBAR POSITIONING
        This section positions the Table of Contents and Margin Notes
      */}
      <>
        {/* Table of Contents - Left Sidebar */}
        <div className="hidden md:block absolute left-[-250px] top-0 w-[220px]">
          <div className="sticky top-8">
            <TableOfContents headings={filteredHeadings} />
          </div>
        </div>

        {/* Margin Notes - Right Sidebar */}
        {marginNotes && marginNotes.length > 0 && (
          <div className="hidden md:block absolute right-[-250px] top-0 w-[220px]">
            <div className="sticky top-8 space-y-4 pb-24">
              {marginNotes.map((note) => (
                <div key={note.id} className="mb-4">
                  <MarginCard note={note} />
                </div>
              ))}
            </div>
          </div>
        )}
      </>
      {/* END SIDEBAR POSITIONING */}
    </div>
  )
}


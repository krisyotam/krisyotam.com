/**
 * =============================================================================
 * Poem Page Client Component
 * =============================================================================
 *
 * Client-side component for displaying a single poem with content fetched via API.
 * Receives poem metadata as props from server components.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

"use client"

// =============================================================================
// Imports
// =============================================================================

import { Header, type HeaderStatus, type HeaderConfidence } from "@/components/core/header"
import { Footer } from "@/components/footer"
import { Citation } from "@/components/citation"
import { Comments } from "@/components/core/comments"
import { useEffect, useState, type JSX } from "react"
import type { VersePost } from "@/lib/data"

// =============================================================================
// Types
// =============================================================================

interface PoemPageClientProps {
  poem: VersePost
  type: string
  slug: string
}

// =============================================================================
// Page Component
// =============================================================================

export default function PoemPageClient({ poem, type, slug }: PoemPageClientProps) {
  // State for poem content and loading state
  const [poemContent, setPoemContent] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch poem content when component mounts
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch(`/api/verse/content?type=${type}&slug=${slug}`)

        if (!response.ok) {
          throw new Error('Failed to fetch poem content')
        }

        const data = await response.json()
        setPoemContent(data.content || "No content available for this poem.")
      } catch (error) {
        console.error('Error fetching poem content:', error)
        setError("Could not load poem content. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchContent()
  }, [type, slug])

  const tags = poem.tags || []
  const verseType = poem.verse_type ?? ""
  const typeSlug = verseType.toLowerCase().replace(/\s+/g, "-")

  // =============================================================================
  // Helpers
  // =============================================================================

  // Function to render poem content with proper line breaks and stanza spacing
  const renderPoemContent = (content: string) => {
    const lines = content.split('\n')
    const elements: JSX.Element[] = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      if (line.trim() === '') {
        // Empty line - add stanza break
        elements.push(<div key={`stanza-${i}`} className="h-4" />)
      } else {
        // Non-empty line with hover effect
        elements.push(
          <div
            key={i}
            className="leading-relaxed px-1 hover:bg-secondary/80 dark:hover:bg-secondary/60 transition-colors duration-150 rounded-sm cursor-pointer"
          >
            {line}
          </div>
        )
      }
    }

    return elements
  }

  // =============================================================================
  // Render
  // =============================================================================

  return (
    <div className="relative min-h-screen bg-background text-foreground pt-8">
      <div className="container max-w-[672px] mx-auto px-4">
        <Header
          variant="post"
          title={poem.title ?? ""}
          preview={poem.description ?? ""}
          start_date={poem.start_date ?? ""}
          end_date={poem.end_date ?? ""}
          status={poem.status as HeaderStatus | undefined}
          confidence={poem.confidence as HeaderConfidence | undefined}
          importance={poem.importance ?? 0}
          tags={tags}
          category={verseType}
          categoryHref={`/verse?type=${typeSlug}`}
          secondaryInfo={poem.collection ? `From collection: ${poem.collection}` : undefined}
          backText={`${verseType} Poems`}
          backHref={`/verse?type=${typeSlug}`}
        />

        <div className="p-6 my-6 rounded-none bg-muted/50 dark:bg-[hsl(var(--popover))] overflow-y-auto max-h-[500px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground animate-pulse">Loading...</div>
            </div>
          ) : error ? (
            <div className="text-red-500 py-4 text-center">{error}</div>
          ) : (
            <div className="poem-content">
              {renderPoemContent(poemContent)}
            </div>
          )}
        </div>

        <Comments />

        <div className="mt-4 mb-8">
          <Citation
            title={poem.title ?? ""}
            slug={poem.slug ?? ""}
            date={((poem.end_date ?? "").trim()) || (poem.start_date ?? "")}
            url={`https://krisyotam.com/verse/${type}/${slug}`}
          />
        </div>

        <Footer />
      </div>
    </div>
  )
}

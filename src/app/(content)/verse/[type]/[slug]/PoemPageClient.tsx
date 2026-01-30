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
import { VerseDisplay } from "@/components/content/verse"
import { ViewTracker } from "@/components/view-tracker"
import { useEffect, useState } from "react"
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
  const viewSlug = `verse/${type}/${slug}`;

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
  // Render
  // =============================================================================

  return (
    <div className="relative min-h-screen bg-background text-foreground pt-8">
      <ViewTracker slug={viewSlug} />
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

        <VerseDisplay
          content={poemContent}
          isLoading={isLoading}
          error={error}
        />

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

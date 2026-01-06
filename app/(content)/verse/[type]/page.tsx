/**
 * =============================================================================
 * Verse Type Page
 * =============================================================================
 *
 * Dynamic page for displaying poems of a specific verse type (e.g., haiku, sonnet).
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

export const dynamic = 'force-static'
export const revalidate = false

// =============================================================================
// Imports
// =============================================================================

import type { Metadata } from "next"
import { VerseClient } from "../verse-client"
import { getVerseTypes, getAllVerseContent, getVerseByType } from "@/lib/data"
import { notFound } from "next/navigation"

// =============================================================================
// Types
// =============================================================================

interface PageProps {
  params: Promise<{ type: string }>
}

// =============================================================================
// Helpers
// =============================================================================

function slugifyType(type: string) {
  return type.toLowerCase().replace(/\s+/g, "-")
}

// =============================================================================
// Static Generation
// =============================================================================

export async function generateStaticParams() {
  const verseTypes = getVerseTypes()
  return verseTypes.map((type) => ({
    type: type.slug,
  }))
}

// =============================================================================
// Metadata
// =============================================================================

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { type } = await params
  const verseTypes = getVerseTypes()
  const categorySlug = type.toLowerCase()
  const matchedCategory = verseTypes.find(t => t.slug === categorySlug)

  if (!matchedCategory && type !== 'all') {
    return {
      title: "Verse | Not Found",
      description: "The requested verse type could not be found."
    }
  }

  // Get a representative poem with an image for this type (if available)
  const poemsOfType = matchedCategory
    ? getVerseByType(categorySlug)
    : getAllVerseContent()

  // Find a poem with an image to use as the featured image
  const featuredPoem = poemsOfType.find(poem => poem.cover_image && poem.cover_image.length > 0)
  const title = matchedCategory
    ? `${matchedCategory.title} | Verse | Kris Yotam`
    : "Verse | Kris Yotam"
  const description = matchedCategory
    ? matchedCategory.preview
    : "A collection of poems, haikus, and other verse forms."

  return {
    title,
    description,
    openGraph: {
      title: matchedCategory
        ? `${matchedCategory.title} Collection | Kris Yotam`
        : "Poetry Collection | Kris Yotam",
      description: matchedCategory?.preview || description,
      type: "website",
      images: featuredPoem?.cover_image
        ? [
            {
              url: featuredPoem.cover_image,
              alt: `${matchedCategory?.title || 'Poetry'} Collection by Kris Yotam`,
              width: 1200,
              height: 630,
            },
          ]
        : [
            {
              url: "https://i.postimg.cc/6p4X2MNX/shall-i-compare-thee-to-a-winters-night.png",
              alt: `${matchedCategory?.title || 'Poetry'} Collection by Kris Yotam`,
              width: 1200,
              height: 630,
            }
          ],
    },
    twitter: {
      card: "summary_large_image",
      title: matchedCategory
        ? `${matchedCategory.title} Collection | Kris Yotam`
        : "Poetry Collection | Kris Yotam",
      description,
      images: featuredPoem?.cover_image
        ? [featuredPoem.cover_image]
        : ["https://i.postimg.cc/6p4X2MNX/shall-i-compare-thee-to-a-winters-night.png"],
    },
  }
}

// =============================================================================
// Page Component
// =============================================================================

export default async function TypedVersePage({ params }: PageProps) {
  const { type } = await params
  const verseTypes = getVerseTypes()
  const typeSlug = type.toLowerCase()
  const matchedCategory = verseTypes.find(t => t.slug === typeSlug)

  // Special case for 'all' to show all verses
  if (type !== 'all' && !matchedCategory) {
    notFound()
  }

  // Fetch all poems for client-side filtering
  const poems = getAllVerseContent()

  return (
    <VerseClient
      initialType={matchedCategory?.title || 'All'}
      verseTypes={verseTypes}
      poems={poems}
    />
  )
}

/**
 * =============================================================================
 * Individual Poem Page
 * =============================================================================
 *
 * Dynamic page for displaying a single poem by type and slug.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

// =============================================================================
// Imports
// =============================================================================

import { getAllVerseContent, getVerseContentByTypeAndSlug } from "@/lib/data"
import PoemPageClient from "./PoemPageClient"
import type { Metadata, ResolvingMetadata } from "next"
import { notFound } from "next/navigation"

// =============================================================================
// Types
// =============================================================================

interface PageProps {
  params: Promise<{ type: string; slug: string }>
}

// =============================================================================
// Static Generation
// =============================================================================

export async function generateStaticParams() {
  const poems = getAllVerseContent()
  return poems.map((poem) => ({
    type: (poem.verse_type ?? "").toLowerCase().replace(/\s+/g, "-"),
    slug: poem.slug ?? "",
  }))
}

// =============================================================================
// Metadata
// =============================================================================

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { type, slug } = await params

  // Find the poem by type and slug
  const poem = getVerseContentByTypeAndSlug(type, slug)

  // If poem not found, return default metadata
  if (!poem) {
    return {
      title: "Poem Not Found",
    }
  }

  // Get base URL from parent metadata for absolute URLs
  const previousImages = (await parent).openGraph?.images || []

  // Construct metadata with OpenGraph properties
  return {
    title: `${poem.title} | ${poem.verse_type} | Kris Yotam`,
    description: poem.description || `${poem.title} by Kris Yotam`,
    openGraph: {
      title: poem.title,
      description: poem.description || `${poem.title} by Kris Yotam`,
      type: "article",
      publishedTime: poem.start_date,
      authors: ["Kris Yotam"],
      tags: poem.tags || [],
      images: poem.image
        ? [
            {
              url: poem.image,
              alt: `Image for ${poem.title}`,
            },
          ]
        : previousImages,
    },
    twitter: {
      card: "summary_large_image",
      title: poem.title,
      description: poem.description || `${poem.title} by Kris Yotam`,
      images: poem.image ? [poem.image] : [],
    },
  }
}

// =============================================================================
// Page Component
// =============================================================================

export default async function PoemPage({ params }: PageProps) {
  const { type, slug } = await params

  // Fetch poem data from database
  const poem = getVerseContentByTypeAndSlug(type, slug)

  if (!poem) {
    notFound()
  }

  return <PoemPageClient poem={poem} type={type} slug={slug} />
}

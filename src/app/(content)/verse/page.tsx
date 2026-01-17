/**
 * =============================================================================
 * Verse Main Page
 * =============================================================================
 *
 * Main landing page for all verse/poetry content.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import type { Metadata } from "next"
import { VerseClient } from "./verse-client"
import { redirect } from "next/navigation"
import { getVerseTypes, getAllVerseContent } from "@/lib/data"
import { staticMetadata } from "@/lib/staticMetadata"

// =============================================================================
// Metadata
// =============================================================================

export const metadata: Metadata = staticMetadata.verse

// =============================================================================
// Types
// =============================================================================

interface PageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

// =============================================================================
// Page Component
// =============================================================================

export default async function VersePage({ searchParams }: PageProps) {
  // Await searchParams for Next.js 15
  const params = await searchParams

  // Handle redirect from old ?type=X format to new /verse/X format
  if (params && params.type) {
    const typeParam = typeof params.type === 'string' ? params.type : params.type[0]
    if (typeParam && typeParam.toLowerCase() !== 'all') {
      redirect(`/verse/${typeParam.toLowerCase().replace(/\s+/g, '-')}`)
    }
  }

  // Fetch data from database
  const verseTypes = getVerseTypes()
  const poems = getAllVerseContent()

  // If no type filter or "All" is selected, show all poems
  return (
    <VerseClient
      initialType="All"
      verseTypes={verseTypes}
      poems={poems}
    />
  )
}

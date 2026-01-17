/**
 * =============================================================================
 * Verse Type Client Component
 * =============================================================================
 *
 * Client-side component for displaying poems of a specific verse type.
 * Receives data as props from server components.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

"use client"

// =============================================================================
// Imports
// =============================================================================

import { PageHeader } from "@/components/core"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Navigation, ContentTable } from "@/components/content"
import { SelectOption } from "@/components/ui/custom-select"
import type { VerseType, VersePost } from "@/lib/data"

// =============================================================================
// Types
// =============================================================================

interface VerseTypeClientProps {
  typeSlug: string
  verseTypes: VerseType[]
  poems: VersePost[]
}

// =============================================================================
// Helpers
// =============================================================================

function slugifyType(type: string) {
  return type.toLowerCase().replace(/\s+/g, "-")
}

function unslugifyType(slug: string, verseTypes: VerseType[]): string {
  const typeData = verseTypes.find(t => t.slug === slug)
  return typeData ? typeData.title : "All"
}

// =============================================================================
// Page Component
// =============================================================================

export default function VerseTypeClient({ typeSlug, verseTypes, poems }: VerseTypeClientProps) {
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const typeData = verseTypes.find(t => t.slug === typeSlug)
  const currentType = typeData ? typeData.slug : "All"

  const filteredPoems = (currentType === "All"
    ? poems
    : poems.filter(poem => slugifyType(poem.verse_type ?? "") === typeSlug))
    .filter(poem => {
      if (!searchQuery) return true
      const q = searchQuery.toLowerCase()
      return (poem.title ?? "").toLowerCase().includes(q) ||
             (poem.description ?? "").toLowerCase().includes(q)
    })

  useEffect(() => {
    // Show loading state briefly for better UX during type changes
    const timeout = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(timeout)
  }, [typeSlug])

  // Get type options for the dropdown
  const typeOptions: SelectOption[] = [
    { value: "All", label: "All Types" },
    ...verseTypes.map(type => ({
      value: type.slug,
      label: type.title
    }))
  ]

  function handleTypeChange(selectedValue: string) {
    if (selectedValue === "All") {
      router.push("/verse")
    } else {
      router.push(`/verse/${encodeURIComponent(selectedValue)}`)
    }
  }

  // Get header data from type metadata
  const headerData = typeData ? {
    title: typeData.title,
    date: typeData.date,
    preview: typeData.preview,
    status: typeData.status as "In Progress" | "Draft" | "Finished" | "Abandoned" | "Notes",
    confidence: typeData.confidence as "likely" | "certain" | "possible" | "unlikely" | "highly likely" | "highly unlikely" | "remote" | "impossible",
    importance: typeData.importance
  } : {
    title: "Verse",
    date: "2025-01-01",
    preview: "A collection of original verse",
    status: "In Progress" as const,
    confidence: "likely" as const,
    importance: 7
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <PageHeader {...headerData} />

      <Navigation
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search poems..."
        showCategoryFilter={true}
        categoryOptions={typeOptions}
        selectedCategory={currentType}
        onCategoryChange={handleTypeChange}
        viewMode="list"
        onViewModeChange={() => {}}
        showViewToggle={false}
      />

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <svg className="animate-spin h-8 w-8 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        </div>
      ) : (
        <ContentTable
          items={filteredPoems.map(poem => ({
            title: poem.title ?? "",
            start_date: poem.start_date ?? "",
            end_date: poem.end_date,
            slug: poem.slug ?? "",
            tags: poem.tags ?? [],
            category: poem.verse_type ?? "",
            status: poem.status,
            confidence: poem.confidence,
            importance: poem.importance
          }))}
          basePath="/verse"
          showCategoryLinks={false}
          formatCategoryNames={false}
          emptyMessage="No poems found for this type."
        />
      )}
    </main>
  )
}

"use client"

/**
 * =============================================================================
 * Excerpts Page
 * =============================================================================
 *
 * Displays a collection of literary excerpts and longer passages.
 * Unlike quotes which are brief, excerpts preserve extended passages
 * that capture the full context and voice of the original work.
 *
 * @type page
 * @path src/app/(misc)/excerpts/page.tsx
 * =============================================================================
 */

import { useState, useEffect, useMemo } from "react"
import { ExcerptCard } from "@/components/excerpts/excerpt-card"
import { PageHeader } from "@/components/core"
import { PageDescription } from "@/components/core"

interface Excerpt {
  id?: number;
  text: string;
  author: string;
  source?: string | null;
}

const excerptsPageData = {
  title: "Excerpts",
  subtitle: "Extended Passages & Literary Fragments",
  start_date: "2026-02-07",
  end_date: new Date().toISOString(),
  preview: "A collection of extended passages from journals, novels, and essays that warrant preservation in their full context",
  status: "In Progress" as const,
  confidence: "certain" as const,
  importance: 7,
}

export const dynamic = "force-dynamic"

export default function ExcerptsPage() {
  const [excerpts, setExcerpts] = useState<Excerpt[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    async function fetchExcerpts() {
      try {
        const response = await fetch('/api/reference?type=excerpts')
        if (response.ok) {
          const data = await response.json()
          // Shuffle excerpts
          const arr = [...(data.excerpts || [])]
          for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            const tmp = arr[i]
            arr[i] = arr[j]
            arr[j] = tmp
          }
          setExcerpts(arr)
        }
      } catch (error) {
        console.error('Error fetching excerpts:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchExcerpts()
  }, [])

  // Filter by author or text (case-insensitive)
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return excerpts
    return excerpts.filter((item) => {
      const author = (item.author || "").toLowerCase()
      const text = (item.text || "").toLowerCase()
      const source = (item.source || "").toLowerCase()
      return author.includes(q) || text.includes(q) || source.includes(q)
    })
  }, [excerpts, search])

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        <PageHeader
          title={excerptsPageData.title}
          subtitle={excerptsPageData.subtitle}
          start_date={excerptsPageData.start_date}
          preview={excerptsPageData.preview}
          status={excerptsPageData.status}
          confidence={excerptsPageData.confidence}
          importance={excerptsPageData.importance}
        />

        <div className="mb-6">
          <label htmlFor="excerpt-search" className="sr-only">Search excerpts</label>
          <div className="flex gap-2">
            <input
              id="excerpt-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by author, text, or source..."
              className="w-full rounded-none border border-border bg-input px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {search ? (
              <button
                onClick={() => setSearch("")}
                className="px-3 py-2 text-sm border border-border rounded-none bg-muted/5"
                aria-label="Clear search"
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading excerpts...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filtered.map((excerpt, idx) => (
              <ExcerptCard
                key={excerpt.text.slice(0, 50) + (excerpt.author || '') + idx}
                text={excerpt.text}
                author={excerpt.author}
                source={excerpt.source || undefined}
              />
            ))}
          </div>
        )}
      </div>

      <PageDescription
        title="About this collection"
        description="These are extended passages from journals, diaries, novels, and essays that I find particularly resonant. Unlike quotes which capture a single thought, excerpts preserve the full voice and context of the original writing — the texture of thought as it unfolds across paragraphs."
      />
    </div>
  )
}

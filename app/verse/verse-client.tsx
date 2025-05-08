"use client"

import poemsData from "@/data/poems.json"
import type { Poem } from "@/utils/poems"
import { PageHeader } from "@/components/page-header"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

function slugifyType(type: string) {
  return type.toLowerCase().replace(/\s+/g, "-");
}

export function VerseClient({ initialType = "All" }: { initialType?: string }) {
  const [loading, setLoading] = useState(true)
  const [currentType, setCurrentType] = useState(initialType)
  const poems = poemsData as Poem[]
  const poemTypes = Array.from(new Set(poems.map(poem => poem.type))).sort()
  const router = useRouter()

  // Sort poems by date descending
  const sortedPoems = [...poems].sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime());
  const filteredPoems = currentType === "All" ? sortedPoems : sortedPoems.filter(poem => poem.type === currentType)

  useEffect(() => {
    // Update current type when initialType changes
    setCurrentType(initialType)
    
    // Show loading state briefly for better UX during type changes
    setLoading(true)
    const timeout = setTimeout(() => setLoading(false), 300)
    return () => clearTimeout(timeout)
  }, [initialType])

  // Helper to build the correct route for a poem
  function getPoemUrl(poem: Poem) {
    const typeSlug = slugifyType(poem.type);
    return `/verse/${encodeURIComponent(typeSlug)}/${String(poem.year)}/${encodeURIComponent(poem.slug)}`
  }

  function handleTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedType = e.target.value;
    if (selectedType === "All") {
      router.push("/verse");
    } else {
      router.push(`/verse/${slugifyType(selectedType)}`);
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <PageHeader
        title="Verse"
        subtitle="Poems, Haikus, and Other Forms"
        date="2025-01-01"
        preview="an anthology of original verse"
        status="In Progress"
        confidence="likely"
        importance={7}
      />

      <div className="mt-8">
        <div className="mb-4 flex items-center gap-2">
          <label htmlFor="type-filter" className="text-sm text-muted-foreground">Filter by type:</label>
          <select
            id="type-filter"
            className="border rounded px-2 py-1 text-sm bg-background"
            value={currentType}
            onChange={handleTypeChange}
          >
            <option value="All">All</option>
            {poemTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <svg className="animate-spin h-8 w-8 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          </div>
        ) : (
          <>
            <table className="w-full text-sm border border-muted/40 rounded-md overflow-hidden">
              <thead>
                <tr className="text-muted-foreground border-b border-muted/40 bg-muted/10">
                  <th className="py-2 text-left font-normal px-3">Title</th>
                  <th className="py-2 text-left font-normal px-3">Type</th>
                  <th className="py-2 text-left font-normal px-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredPoems.map(poem => (
                  <tr
                    key={poem.slug}
                    className="border-b border-muted/30 hover:bg-muted/20 cursor-pointer transition-colors"
                    onClick={() => router.push(getPoemUrl(poem))}
                  >
                    <td className="py-2 pr-4 px-3 font-medium">{poem.title}</td>
                    <td className="py-2 pr-4 px-3">{poem.type}</td>
                    <td className="py-2 pr-4 px-3">{poem.year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredPoems.length === 0 && !loading && (
              <div className="text-muted-foreground text-sm mt-6">No poems found for this type.</div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
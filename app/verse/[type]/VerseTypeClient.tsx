"use client"

import poemsData from "@/data/poems.json"
import type { Poem } from "@/utils/poems"
import { PageHeader } from "@/components/page-header"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

function slugifyType(type: string) {
  return type.toLowerCase().replace(/\s+/g, "-");
}

function unslugifyType(slug: string, allTypes: string[]) {
  return allTypes.find(t => slugifyType(t) === slug) || "All";
}

export default function VerseTypeClient({ params }: { params: { type: string } }) {
  const [loading, setLoading] = useState(true)
  const poems = poemsData as Poem[]
  const poemTypes = Array.from(new Set(poems.map(poem => poem.type))).sort()
  const router = useRouter()
  const currentType = unslugifyType(params.type, poemTypes)
  const filteredPoems = currentType === "All" ? poems : poems.filter(poem => poem.type === currentType)

  useEffect(() => {
    // Simulate loading for a short time for demo; replace with real async if needed
    const timeout = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(timeout)
  }, [params.type])

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
        date="2025-01-01"
        preview="a anthology of original verse"
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
                    onClick={() => window.location.href = getPoemUrl(poem)}
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
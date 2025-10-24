"use client"

import poemsData from "@/data/verse/verse.json"
import categoriesData from "@/data/verse/categories.json"
import type { Poem } from "@/utils/poems"
import { PageHeader } from "@/components/page-header"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { formatDate, formatDateRange } from "@/utils/date-formatter"

interface VerseType {
  slug: string;
  title: string;
  preview: string;
  date: string;
  status: "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished";
  confidence: "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain";
  importance: number;
}

function slugifyType(type: string) {
  return type.toLowerCase().replace(/\s+/g, "-");
}

function unslugifyType(slug: string, verseTypes: VerseType[]): string {
  const typeData = verseTypes.find(t => t.slug === slug);
  return typeData ? typeData.title : "All";
}

export default function VerseTypeClient({ params }: { params: { type: string } }) {
  const [loading, setLoading] = useState(true)
  const poems = poemsData as Poem[]
  const verseTypes = categoriesData.types as VerseType[]
  const router = useRouter()

  const typeData = verseTypes.find(t => t.slug === params.type)
  const currentType = typeData ? typeData.title : "All"
  
  const filteredPoems = currentType === "All" 
  ? poems 
  : poems.filter(poem => slugifyType(poem.type ?? "") === params.type)

  useEffect(() => {
    // Show loading state briefly for better UX during type changes
    const timeout = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(timeout)
  }, [params.type])

  function getPoemUrl(poem: Poem) {
  const typeSlug = slugifyType(poem.type ?? "");
  return `/verse/${encodeURIComponent(typeSlug)}/${encodeURIComponent(poem.slug ?? "")}`
  }

  function handleTypeChange(selectedValue: string) {
    if (selectedValue === "All") {
      router.push("/verse")
    } else {
      const typeData = verseTypes.find(t => t.title === selectedValue)
      if (typeData) {
        router.push(`/verse/${encodeURIComponent(typeData.slug)}`)
      }
    }
  }

  // Get header data from type metadata
  const headerData = typeData ? {
    title: typeData.title,
    date: typeData.date,
    preview: typeData.preview,
    status: typeData.status,
    confidence: typeData.confidence,
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
      <div className="mt-8">
        <div className="mb-4 flex items-center gap-2">
          <label htmlFor="type-filter" className="text-sm text-muted-foreground">Filter by type:</label>
          <select
            id="type-filter"
            className="border rounded px-2 py-1 text-sm bg-background"
            value={currentType}
            onChange={(e) => handleTypeChange(e.target.value)}
          >
            <option value="All">All</option>
            {verseTypes.map(type => (
              <option key={type.slug} value={type.title}>{type.title}</option>
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
                    <td className="py-2 pr-4 px-3">{poem.title}</td>
                    <td className="py-2 pr-4 px-3">{poem.type}</td>
                    <td className="py-2 pr-4 px-3">
                      {poem.end_date && poem.end_date.trim() 
                        ? formatDate(poem.end_date ?? "")
                        : formatDate(poem.start_date ?? "")
                      }
                    </td>
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
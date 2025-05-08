"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/page-header"

export function ProgymnasmataClient() {
  const [entries, setEntries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState<string>("All")

  useEffect(() => {
    async function fetchEntries() {
      try {
        const response = await fetch("/api/progymnasmata/entries")
        if (!response.ok) throw new Error("Failed to fetch entries")
        const data = await response.json()
        setEntries(data)
      } catch (error) {
        console.error("Error fetching progymnasmata entries:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchEntries()
  }, [])

  // Get all unique types for the filter
  const types = Array.from(new Set(entries.map(e => e.type))).sort()

  // Sort by date descending (assuming date is ISO string or similar)
  const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const filteredEntries = typeFilter === "All" ? sortedEntries : sortedEntries.filter(e => e.type === typeFilter)

  function handleTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setTypeFilter(e.target.value)
  }

  function getEntryUrl(entry: any) {
    // You may want to adjust this if your detail route is different
    return `/progymnasmata/${entry.type.toLowerCase()}/${entry.slug}`
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <PageHeader
        title="Progymnasmata"
        subtitle="Classical Rhetorical Exercises"
        date="2025-01-01"
        preview="classical rhetorical excercises inspired by aelius theon"
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
            value={typeFilter}
            onChange={handleTypeChange}
          >
            <option value="All">All</option>
            {types.map(type => (
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
                {filteredEntries.map(entry => (
                  <tr
                    key={entry.slug}
                    className="border-b border-muted/30 hover:bg-muted/20 cursor-pointer transition-colors"
                    onClick={() => window.location.href = getEntryUrl(entry)}
                  >
                    <td className="py-2 pr-4 px-3 font-medium">{entry.title}</td>
                    <td className="py-2 pr-4 px-3">{entry.type}</td>
                    <td className="py-2 pr-4 px-3">{new Date(entry.date).getFullYear()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredEntries.length === 0 && !loading && (
              <div className="text-muted-foreground text-sm mt-6">No exercises found for this type.</div>
            )}
          </>
        )}
      </div>
    </main>
  )
} 
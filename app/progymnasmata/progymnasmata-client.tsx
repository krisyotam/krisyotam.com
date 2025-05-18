"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/page-header"
import { useRouter, usePathname } from "next/navigation"
import { PageDescription } from "@/components/posts/typography/page-description"

interface ProgymnasmataClientProps {
  initialTypeFilter?: string
}

export function ProgymnasmataClient({ initialTypeFilter = "All" }: ProgymnasmataClientProps) {
  const [entries, setEntries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState<string>(initialTypeFilter)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const router = useRouter()
  const pathname = usePathname()

  // Fetch entries on mount
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

  // Sync typeFilter with URL path
  useEffect(() => {
    if (!pathname) return;
    
    if (pathname === "/progymnasmata") {
      setTypeFilter("All")
    } else if (pathname.startsWith("/progymnasmata/")) {
      const urlType = pathname.split("/")[2]
      // Find the type with proper capitalization from entries
      const matchedType = entries.find(e => 
        e.type.toLowerCase() === urlType.toLowerCase()
      )?.type || urlType
      setTypeFilter(matchedType)
    }
  }, [pathname, entries])

  // Get all unique types for the filter
  const types = Array.from(new Set(entries.map(e => e.type))).sort()

  // Sort by date descending (assuming date is ISO string or similar)
  const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const filteredEntries = sortedEntries.filter(entry => {
    const matchesType = typeFilter === "All" || 
                       entry.type === typeFilter || 
                       entry.type.toLowerCase() === typeFilter.toLowerCase();
    const matchesSearch = !searchQuery || 
                         entry.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (entry.description && entry.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  function handleTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newType = e.target.value;
    setTypeFilter(newType)
    
    // Update URL based on selected filter
    if (newType === "All") {
      router.push("/progymnasmata")
    } else {
      router.push(`/progymnasmata/${newType.toLowerCase()}`)
    }
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
        <div className="mb-6 flex items-center gap-4">
          <div className="flex items-center gap-2 whitespace-nowrap">
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
          
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="Search exercises..." 
              className="w-full px-3 py-1 border rounded text-sm bg-background"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </div>
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
            <table className="w-full text-sm border border-border overflow-hidden shadow-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-foreground">
                  <th className="py-2 text-left font-medium px-3">Title</th>
                  <th className="py-2 text-left font-medium px-3">Type</th>
                  <th className="py-2 text-left font-medium px-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry, index) => (
                  <tr
                    key={entry.slug}
                    className={`border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'}`}
                    onClick={() => window.location.href = getEntryUrl(entry)}
                  >
                    <td className="py-2 px-3 font-medium">{entry.title}</td>
                    <td className="py-2 px-3">{entry.type}</td>
                    <td className="py-2 px-3">{new Date(entry.date).getFullYear()}</td>
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
      
      <PageDescription
        title="About Progymnasmata"
        description="Progymnasmata are preliminary rhetorical exercises originated in ancient Greece. These exercises were designed to prepare students for more advanced rhetorical training by teaching them basic composition skills. The exercises include fable, narrative, chreia, maxim, refutation, confirmation, commonplace, encomium, vituperation, comparison, impersonation, description, thesis, and introduction of law. Each type follows specific rhetorical patterns and serves different purposes in developing argumentative and literary skills."
      />
    </main>
  )
} 
"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/page-header"
import { useRouter, usePathname } from "next/navigation"

interface OthersClientProps {
  initialCategoryFilter?: string
}

interface OtherEntry {
  title: string
  url: string
  description: string
  category: string
  tags: string[]
  slug: string
}

export function OthersClient({ initialCategoryFilter = "All" }: OthersClientProps) {
  const [entries, setEntries] = useState<OtherEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState<string>(initialCategoryFilter)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const pathname = usePathname()

  // Fetch entries on mount
  useEffect(() => {
    async function fetchEntries() {
      try {
        const response = await fetch("/api/others")
        if (!response.ok) throw new Error("Failed to fetch entries")
        const data = await response.json()
        setEntries(data)
      } catch (error) {
        console.error("Error fetching others entries:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchEntries()
  }, [])

  // Sync categoryFilter with URL path
  useEffect(() => {
    if (!pathname) return;
    
    if (pathname === "/others") {
      setCategoryFilter("All")
    } else if (pathname.startsWith("/others/category/")) {
      const urlCategory = decodeURIComponent(pathname.split("/")[3])
      setCategoryFilter(urlCategory)
    }
  }, [pathname])

  // Get all unique categories for the filter
  const categories = Array.from(new Set(entries.map(e => e.category))).sort()

  // Filter entries by category and search query
  const filteredEntries = entries.filter(entry => {
    const matchesCategory = categoryFilter === "All" || entry.category === categoryFilter
    
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch = searchQuery === "" || 
      entry.title.toLowerCase().includes(searchLower) ||
      entry.description.toLowerCase().includes(searchLower) ||
      entry.category.toLowerCase().includes(searchLower) ||
      entry.tags.some(tag => tag.toLowerCase().includes(searchLower))
    
    return matchesCategory && matchesSearch
  })

  function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newCategory = e.target.value;
    setCategoryFilter(newCategory)
    
    // Update URL based on selected filter
    if (newCategory === "All") {
      router.push("/others")
    } else {
      router.push(`/others/category/${encodeURIComponent(newCategory)}`)
    }
  }

  function getEntryUrl(entry: OtherEntry) {
    return `/others/${entry.slug}`
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <PageHeader
        title="Others"
        date="2025-01-01"
        preview="a curated collection of novel, and obscure blogs I read"
        status="In Progress"
        confidence="likely"
        importance={7}
      />
      <div className="mt-8">
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="text-sm text-muted-foreground mb-1 block">Search:</label>
            <input
              type="text"
              id="search"
              className="w-full border rounded px-3 py-2 text-sm bg-background"
              placeholder="Search by title, description, category, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-48">
            <label htmlFor="category-filter" className="text-sm text-muted-foreground mb-1 block">Filter by category:</label>
            <select
              id="category-filter"
              className="w-full border rounded px-3 py-2 text-sm bg-background"
              value={categoryFilter}
              onChange={handleCategoryChange}
            >
              <option value="All">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
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
            <table className="w-full text-sm border border-muted/40 rounded-md overflow-hidden">
              <thead>
                <tr className="text-muted-foreground border-b border-muted/40 bg-muted/10">
                  <th className="py-2 text-left font-normal px-3">Title</th>
                  <th className="py-2 text-left font-normal px-3">Category</th>
                  <th className="py-2 text-left font-normal px-3 hidden md:table-cell">Tags</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map(entry => (
                  <tr
                    key={entry.slug}
                    className="border-b border-muted/30 hover:bg-muted/40 dark:hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => router.push(getEntryUrl(entry))}
                  >
                    <td className="py-2 pr-4 px-3 font-medium">{entry.title}</td>
                    <td className="py-2 pr-4 px-3">{entry.category}</td>
                    <td className="py-2 pr-4 px-3 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {entry.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="px-1.5 py-0.5 text-xs bg-muted/30 rounded">
                            {tag}
                          </span>
                        ))}
                        {entry.tags.length > 3 && <span className="px-1.5 py-0.5 text-xs bg-muted/20 rounded">+{entry.tags.length - 3}</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredEntries.length === 0 && !loading && (
              <div className="text-muted-foreground text-sm mt-6">No entries found matching your criteria.</div>
            )}
          </>
        )}
      </div>
    </main>
  )
} 
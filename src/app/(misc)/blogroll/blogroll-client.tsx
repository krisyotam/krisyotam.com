"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

import { PageHeader } from "@/components/core"
import { Navigation } from "@/components/content/navigation"

interface BlogrollClientProps {
  initialCategoryFilter?: string
}

interface BlogrollEntry {
  title: string
  url: string
  category: string
  tags: string[]
}

export function BlogrollClient({ initialCategoryFilter = "All" }: BlogrollClientProps) {
  const [entries, setEntries] = useState<BlogrollEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState<string>(initialCategoryFilter)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const router = useRouter()
  const pathname = usePathname()

  // Fetch entries on mount
  useEffect(() => {
    async function fetchEntries() {
      try {
        const res = await fetch("/api/data?type=blogroll")
        if (!res.ok) throw new Error(`HTTP ${res.status} – ${res.statusText}`)

        const data = await res.json()
        if (!Array.isArray(data.blogs)) throw new Error("Expected blogroll array in `blogs`")
        setEntries(data.blogs)
      } catch (error) {
        console.error("Error fetching blogroll entries:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchEntries()
  }, [])

  // Sync categoryFilter with URL path
  useEffect(() => {
    if (!pathname) return

    if (pathname === "/blogroll") {
      setCategoryFilter("All")
    } else if (pathname.startsWith("/blogroll/category/")) {
      const urlCategory = decodeURIComponent(pathname.split("/")[3] || "")
      setCategoryFilter(urlCategory || "All")
    }
  }, [pathname])

  // Extract unique categories
  const categories = Array.from(
    new Set(entries.map(entry => entry.category).filter(Boolean))
  ).sort()

  // Filter by category + search
  const filteredEntries = entries.filter(entry => {
    const matchesCategory = categoryFilter === "All" || entry.category === categoryFilter
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch =
      !searchQuery ||
      entry.title.toLowerCase().includes(searchLower) ||
      entry.category.toLowerCase().includes(searchLower) ||
      entry.tags.some(tag => tag.toLowerCase().includes(searchLower))

    return matchesCategory && matchesSearch
  })

  function handleCategoryChange(newCategory: string) {
    setCategoryFilter(newCategory)
    if (newCategory === "All") {
      router.push("/blogroll")
    } else {
      router.push(`/blogroll/category/${encodeURIComponent(newCategory)}`)
    }
  }

  function openExternalUrl(url: string) {
    const fullUrl = url.startsWith('http') ? url : `https://${url}`
    window.open(fullUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <PageHeader
        title="Blogroll"
        start_date="2025-01-01"
        end_date={new Date().toISOString().split("T")[0]}
        preview="a curated collection of novel and obscure blogs I read, and have read, over the years"
      />

      <div className="mt-8">
        <Navigation
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search blogroll..."
          showCategoryFilter={true}
          categoryOptions={[
            { value: "All", label: "All Categories" },
            ...categories.map(cat => ({ value: cat, label: cat })),
          ]}
          selectedCategory={categoryFilter}
          onCategoryChange={handleCategoryChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <svg className="animate-spin h-8 w-8 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          </div>
        ) : (
          <>
            {viewMode === 'list' ? (
              <table className="w-full text-sm border border-border overflow-hidden shadow-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50 text-foreground">
                    <th className="py-2 text-left font-medium px-3">Title</th>
                    <th className="py-2 text-left font-medium px-3">Tags</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries.map((entry, index) => (
                    <tr
                      key={`${entry.title}-${index}`}
                      className={`border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${
                        index % 2 === 0 ? "bg-transparent" : "bg-muted/5"
                      }`}
                      onClick={() => openExternalUrl(entry.url)}
                    >
                      <td className="py-2 px-3 font-medium break-words whitespace-normal">{entry.title}</td>
                      <td className="py-2 px-3">
                        <div className="flex flex-wrap gap-1">
                          {entry.tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className="px-1.5 py-0.5 text-xs bg-muted/50 rounded-sm">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="w-full">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-0 border border-border">
                  {filteredEntries.map((entry, index) => {
                    let host = ''
                    try {
                      const urlStr = entry.url.startsWith('http') ? entry.url : `https://${entry.url}`
                      host = new URL(urlStr).host.replace(/^www\./, '')
                    } catch (e) {
                      host = entry.url.replace(/^https?:\/\//, '').replace(/^www\./, '')
                    }

                    return (
                      <div
                        key={`${entry.title}-${index}`}
                        className="p-6 border-r border-b border-border last:border-r-0 hover:bg-secondary/5 cursor-pointer"
                        onClick={() => openExternalUrl(entry.url)}
                      >
                        <div className="font-medium mb-1 break-words whitespace-normal">{entry.title}</div>
                        <div className="text-xs italic text-muted-foreground break-words whitespace-normal">{host}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {filteredEntries.length === 0 && !loading && (
              <div className="text-muted-foreground text-sm mt-6">
                No entries found matching your criteria.
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}

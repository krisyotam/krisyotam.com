"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

import { PageHeader, PageDescription } from "@/components/core"
import { Navigation } from "@/components/content/navigation"

interface BlogrollClientProps {
  initialCategoryFilter?: string
}

interface BlogrollEntry {
  title: string
  url: string
  category: string
  tags: string[]
  rss: string | null
  lastPostDate: string | null
  lastPostTitle: string | null
  lastChecked: string | null
  activityScore: number
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

  // Filter by category + search, then sort by activity
  const filteredEntries = entries
    .filter(entry => {
      const matchesCategory = categoryFilter === "All" || entry.category === categoryFilter
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch =
        !searchQuery ||
        entry.title.toLowerCase().includes(searchLower) ||
        entry.category.toLowerCase().includes(searchLower) ||
        entry.tags.some(tag => tag.toLowerCase().includes(searchLower))

      return matchesCategory && matchesSearch
    })
    .sort((a, b) => {
      // Sort by last post date (most recent first), with no-data entries at the bottom
      const dateA = a.lastPostDate || '1900-01-01'
      const dateB = b.lastPostDate || '1900-01-01'
      if (dateA !== dateB) {
        return dateB.localeCompare(dateA)
      }
      // For same date, sort alphabetically
      return a.title.localeCompare(b.title)
    })

  // Helper to format last post date
  function formatLastPost(entry: BlogrollEntry): string {
    if (!entry.lastPostDate) return ''
    const date = new Date(entry.lastPostDate)
    const now = new Date()
    const days = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (days === 0) return 'today'
    if (days === 1) return 'yesterday'
    if (days < 7) return `${days}d ago`
    if (days < 30) return `${Math.floor(days / 7)}w ago`
    if (days < 365) return `${Math.floor(days / 30)}mo ago`
    return `${Math.floor(days / 365)}y ago`
  }

  // Get activity indicator color based on score
  function getActivityColor(score: number): string {
    if (score >= 90) return 'bg-green-500'
    if (score >= 70) return 'bg-green-400'
    if (score >= 50) return 'bg-yellow-400'
    if (score >= 30) return 'bg-orange-400'
    if (score >= 10) return 'bg-orange-500'
    if (score > 0) return 'bg-red-400'
    return 'bg-gray-400'
  }

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

      <div className="my-3">
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
          className="mb-0"
        />
      </div>

      <div>
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
                    <th className="py-2 text-left font-medium px-3 w-8"></th>
                    <th className="py-2 text-left font-medium px-3">Title</th>
                    <th className="py-2 text-left font-medium px-3">Tags</th>
                    <th className="py-2 text-right font-medium px-3 hidden sm:table-cell">Last Post</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries.map((entry, index) => {
                    const visibleTags = entry.tags.slice(0, 1)
                    const remainingCount = entry.tags.length - 1

                    return (
                      <tr
                        key={`${entry.title}-${index}`}
                        className={`border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${
                          index % 2 === 0 ? "bg-transparent" : "bg-muted/5"
                        }`}
                        onClick={() => openExternalUrl(entry.url)}
                      >
                        <td className="py-2 px-3">
                          <div
                            className={`w-2 h-2 rounded-full ${getActivityColor(entry.activityScore)}`}
                            title={`Activity: ${entry.activityScore}/100`}
                          />
                        </td>
                        <td className="py-2 px-3 font-medium break-words whitespace-normal">
                          {entry.title}
                          {entry.lastPostDate && (
                            <span className="sm:hidden text-xs text-muted-foreground ml-2">
                              ({formatLastPost(entry)})
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3">
                          <div className="flex items-center gap-1">
                            {visibleTags.map((tag, i) => (
                              <span key={i} className="px-1.5 py-0.5 text-xs bg-muted/50 rounded-sm whitespace-nowrap">
                                {tag}
                              </span>
                            ))}
                            {remainingCount > 0 && (
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                +{remainingCount}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-2 px-3 hidden sm:table-cell text-muted-foreground text-xs text-right whitespace-nowrap">
                          {formatLastPost(entry) || '—'}
                        </td>
                      </tr>
                    )
                  })}
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
                        className="relative p-4 border-r border-b border-border last:border-r-0 hover:bg-secondary/5 cursor-pointer flex flex-col min-h-[100px]"
                        onClick={() => openExternalUrl(entry.url)}
                      >
                        {/* Activity indicator - top right */}
                        <div
                          className={`absolute top-3 right-3 w-2 h-2 rounded-full ${getActivityColor(entry.activityScore)}`}
                          title={`Activity: ${entry.activityScore}/100`}
                        />

                        {/* Title */}
                        <div className="font-medium text-sm leading-snug pr-5 mb-auto">
                          {entry.title}
                        </div>

                        {/* Footer: host + date */}
                        <div className="mt-3 space-y-0.5">
                          <div className="text-xs text-muted-foreground truncate">
                            {host}
                          </div>
                          {entry.lastPostDate && (
                            <div className="text-[11px] text-muted-foreground/60">
                              {formatLastPost(entry)}
                            </div>
                          )}
                        </div>
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

      <PageDescription
        title="About this blogroll"
        description="A personal collection of blogs curated from years of reading across philosophy, mathematics, technology, literature, and the obscure corners of the internet. Each entry represents a voice I've found worth returning to. The list is maintained and updated as I discover new writers and retire dormant links. Topics range from theoretical computer science and formal logic to film criticism and personal essays. If you write a blog and think it might belong here, you can submit it for consideration at krisyotam.com/surveys/submit-blog."
      />
    </main>
  )
}

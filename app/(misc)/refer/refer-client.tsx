"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { PageHeader } from "@/components/core"
import { CustomSelect } from "@/components/ui/custom-select"
import { Input } from "@/components/ui/input"

interface ReferEntry {
  title: string
  url: string
  website?: string
  description?: string
  category?: string
  tags?: string[]
  slug: string
  reward?: string
}

export function ReferClient({ initialCategoryFilter = "All" }: { initialCategoryFilter?: string }) {
  const [entries, setEntries] = useState<ReferEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState<string>(initialCategoryFilter)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    async function fetchEntries() {
      try {
        const res = await fetch('/api/refer')
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        setEntries(Array.isArray(data.refer) ? data.refer : [])
      } catch (err) {
        console.error('Failed to load refer data', err)
      } finally {
        setLoading(false)
      }
    }
    fetchEntries()
  }, [])

  useEffect(() => {
    if (!pathname) return
    if (pathname === '/refer') setCategoryFilter('All')
    else if (pathname.startsWith('/refer/category/')) {
      const parts = pathname.split('/')
      const cat = decodeURIComponent(parts[3] || '')
      setCategoryFilter(cat || 'All')
    }
  }, [pathname])

  const categories = Array.from(new Set(entries.map(e => e.category || '').filter(Boolean))).sort() as string[]

  const filtered = entries.filter(e => {
    const matchesCategory = categoryFilter === 'All' || e.category === categoryFilter
    const q = searchQuery.toLowerCase()
    const matchesSearch = !q || e.title.toLowerCase().includes(q) || (e.description || '').toLowerCase().includes(q) || (e.tags || []).some(t => t.toLowerCase().includes(q))
    return matchesCategory && matchesSearch
  })

  function handleCategoryChange(newCat: string) {
    setCategoryFilter(newCat)
    if (newCat === 'All') router.push('/refer')
    else router.push(`/refer/category/${encodeURIComponent(newCat)}`)
  }

  function getEntryUrl(entry: ReferEntry) {
    return `/refer/${entry.slug}`
  }

  return (
    <main className="w-full py-6">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button onClick={() => setViewMode('list')} className={`text-sm px-3 py-1 rounded-none border ${viewMode === 'list' ? 'bg-muted/50' : 'bg-transparent'}`}>List</button>
          <button onClick={() => setViewMode('grid')} className={`text-sm px-3 py-1 rounded-none border ${viewMode === 'grid' ? 'bg-muted/50' : 'bg-transparent'}`}>Grid</button>
        </div>

        <div className="flex items-center gap-2 whitespace-nowrap">
          <label htmlFor="category-filter" className="text-sm text-muted-foreground">Filter by category:</label>
          <CustomSelect
            id="category-filter"
            value={categoryFilter}
            onValueChange={handleCategoryChange}
            options={[{ value: 'All', label: 'All Categories' }, ...categories.map(c => ({ value: c, label: c }))]}
            className="text-sm min-w-[140px]"
          />
        </div>

        <div className="relative flex-1">
          <Input placeholder="Search refer entries..." className="w-full h-9 px-3 py-2 text-sm" onChange={(e) => setSearchQuery(e.target.value)} value={searchQuery} />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">Loading…</div>
      ) : (
        <>
          {viewMode === 'list' ? (
            <table className="w-full text-sm border border-border overflow-hidden shadow-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-foreground">
                  <th className="py-2 text-left font-medium px-3">Title</th>
                  <th className="py-2 text-left font-medium px-3">Category</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry, idx) => (
                  <tr key={entry.slug} className={`border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${idx % 2 === 0 ? '' : 'bg-muted/5'}`} onClick={() => router.push(getEntryUrl(entry))}>
                    <td className="py-2 px-3 font-medium break-words whitespace-normal">{entry.title}</td>
                    <td className="py-2 px-3 text-xs text-muted-foreground">{entry.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-0 border border-border">
              {filtered.map((entry) => (
                <div key={entry.slug} className="p-6 border-r border-b border-border last:border-r-0 hover:bg-secondary/5 cursor-pointer" onClick={() => router.push(getEntryUrl(entry))}>
                  <div className="font-medium mb-1 break-words whitespace-normal">{entry.title}</div>
                  <div className="text-xs italic text-muted-foreground break-words whitespace-normal">{entry.website || (new URL(entry.url).hostname.replace(/^www\./, ''))}</div>
                </div>
              ))}
            </div>
          )}

          {filtered.length === 0 && (
            <div className="text-muted-foreground text-sm mt-6">No refer entries found matching your criteria.</div>
          )}
        </>
      )}
    </main>
  )
}

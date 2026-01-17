"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, LayoutGrid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function MapList({ pages }: { pages: { path: string; title?: string; description?: string }[] }) {
  const [query, setQuery] = useState("")
  const [viewMode, setViewMode] = useState<'list'|'grid'>('list')

  const filtered = useMemo(() => {
    if (!query) return pages
    const q = query.toLowerCase()
    return pages.filter(p => (p.title || p.path).toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q))
  }, [pages, query])

  return (
    <main className="w-full py-2">
      <div className="mb-4 flex items-center gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input placeholder="Search pages..." className="w-full pl-10 rounded-none" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className={viewMode === 'list' ? 'bg-secondary/50 rounded-none' : 'rounded-none'} onClick={() => setViewMode('list')} aria-label="List view"><List className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" className={viewMode === 'grid' ? 'bg-secondary/50 rounded-none' : 'rounded-none'} onClick={() => setViewMode('grid')} aria-label="Grid view"><LayoutGrid className="h-4 w-4" /></Button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <ul className="space-y-2">
          {filtered.map(p => (
            <li key={p.path} className="border border-border p-3 bg-card rounded-none hover:bg-secondary/50 hover:shadow-sm transition-colors">
              <Link href={p.path} className="text-lg font-medium block">{p.title || p.path}</Link>
              <div className="mt-1 text-xs font-mono text-muted-foreground">{p.path}</div>
              <p className="mt-1 text-sm text-muted-foreground">{p.description || <span className="italic">No description yet.</span>}</p>
            </li>
          ))}
          {filtered.length === 0 && <li className="text-sm text-muted-foreground">No pages match.</li>}
        </ul>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map(p => (
            <Link key={p.path} href={p.path} className="block border border-border p-4 bg-card rounded-none hover:bg-secondary/50 hover:shadow-sm transition-colors">
              <div className="text-lg font-medium">{p.title || p.path}</div>
              <div className="mt-2 text-sm text-muted-foreground">{p.description || 'No description yet.'}</div>
              <div className="mt-4 text-xs font-mono text-muted-foreground">{p.path}</div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}

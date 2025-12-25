"use client"

import { useMemo, useState } from "react"
import SetGrid from "@/components/flashcards/set-grid-view"
import { SetListItem } from "@/components/flashcards/set-list-view"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LayoutGrid, List, Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface FlashcardsClientProps {
  sets: any[]
}

export default function FlashcardsClient({ sets }: FlashcardsClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')

  const normalized = useMemo(() => {
    return (sets || []).map((s: any, idx: number) => ({
      id: s.slug || `s-${idx}`,
      title: s.name || s.title || "Untitled",
      description: s.description || "",
      coverImage: s.cover_photo_url || s.cover_photo || "/placeholder.svg",
      link: s.url || s.link || "",
      dateCreated: s.date_of_create || s.dateCreated || "",
      notes: s.note_count ?? 0,
      audio: s.audio_count ?? 0,
      images: s.image_count ?? 0,
      raw: s,
    }))
  }, [sets])

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase()
    return (normalized || []).filter((p: any) => {
      const matchesSearch = !q || p.title?.toLowerCase().includes(q) || (p.description || "").toLowerCase().includes(q)
      return matchesSearch
    })
  }, [normalized, searchQuery])

  return (
    <main className="w-full py-2">
      <div className="mb-4 flex items-center gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input placeholder="Search flashcard sets..." className="w-full pl-10 rounded-none" value={searchQuery} onChange={(e: any) => setSearchQuery(e.target.value)} />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className={cn('rounded-none', viewMode === 'list' ? 'bg-secondary/50' : '')} onClick={() => setViewMode('list')} aria-label="List view"><List className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" className={cn('rounded-none', viewMode === 'grid' ? 'bg-secondary/50' : '')} onClick={() => setViewMode('grid')} aria-label="Grid view"><LayoutGrid className="h-4 w-4" /></Button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <SetGrid sets={filtered} />
      ) : (
        <div className="space-y-2">
          {filtered.map((p: any) => (
            <SetListItem
              key={p.id}
              title={p.title}
              description={p.description}
              coverImage={p.coverImage}
              link={p.link}
              dateCreated={p.dateCreated}
              notes={p.notes}
              audio={p.audio}
              images={p.images}
              raw={p.raw}
            />
          ))}

          {filtered.length === 0 && (
            <div className="py-6 text-center text-muted-foreground">No flashcard sets found.</div>
          )}
        </div>
      )}
    </main>
  )
}

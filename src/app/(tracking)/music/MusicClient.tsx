"use client"

import { useMemo, useState } from "react"
import PlaylistGrid from "@/components/media/music/playlist-grid-view"
import { PlaylistCard as PlaylistListItem } from "@/components/media/music/playlist-list-view"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LayoutGrid, List, Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface MusicClientProps {
  playlists: any[]
}

export default function MusicClient({ playlists }: MusicClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeGenre, setActiveGenre] = useState("all")
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')

  // Normalize incoming raw data (data/music/music.json has a different shape)
  const normalized = useMemo(() => {
    return (playlists || []).map((p: any, idx: number) => ({
      id: p.slug || p.id || `p-${idx}`,
      title: p.playlist_name || p.title || "Untitled",
      genre: p.category || p.genre || "",
      artists: p.artists || [],
      description: p.description || "",
      coverImage: p.cover_url || p.coverImage || "/placeholder.svg",
      link: p.spotify || p.link || p.tidal || "",
      dateCreated: p.last_updated || p.dateCreated || "",
      raw: p,
    }))
  }, [playlists])

  const genres = useMemo(() => {
    const g = ["all", ...Array.from(new Set((normalized || []).map((p) => p.genre || "")))]
    return g.sort()
  }, [normalized])

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase()
    return (normalized || []).filter((p: any) => {
      const matchesSearch =
        !q || p.title?.toLowerCase().includes(q) || (p.description || "").toLowerCase().includes(q) || (p.artists || []).some((a: string) => a.toLowerCase().includes(q))
      const matchesGenre = activeGenre === "all" || p.genre === activeGenre
      return matchesSearch && matchesGenre
    })
  }, [normalized, searchQuery, activeGenre])

  return (
    <main className="w-full py-2">
      <div className="mb-4 flex items-center gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input placeholder="Search playlists..." className="w-full pl-10 rounded-none" value={searchQuery} onChange={(e: any) => setSearchQuery(e.target.value)} />
        </div>

        <div className="flex items-center gap-2">
          <select
            id="genre-filter"
            value={activeGenre}
            onChange={(e) => setActiveGenre(e.target.value)}
            className="text-sm min-w-[140px] h-9 px-2 border bg-background rounded-none"
          >
            {genres.map((g) => (
              <option key={g} value={g}>{g === "all" ? "All Genres" : g}</option>
            ))}
          </select>

          <Button variant="outline" size="icon" className={cn('rounded-none', viewMode === 'list' ? 'bg-secondary/50' : '')} onClick={() => setViewMode('list')} aria-label="List view"><List className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" className={cn('rounded-none', viewMode === 'grid' ? 'bg-secondary/50' : '')} onClick={() => setViewMode('grid')} aria-label="Grid view"><LayoutGrid className="h-4 w-4" /></Button>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'grid' ? (
        <PlaylistGrid playlists={filtered} />
      ) : (
        <div className="space-y-2">
          {filtered.map((p: any) => (
            <PlaylistListItem
              key={p.id}
              playlistName={p.title}
              creator={p.raw?.creator || ""}
              songCount={Number(p.raw?.amount_of_songs ?? p.raw?.songCount ?? 0)}
              lastUpdated={p.raw?.last_updated ?? p.dateCreated ?? ""}
              coverImage={p.coverImage || "/placeholder.svg"}
            />
          ))}

          {filtered.length === 0 && (
            <div className="py-6 text-center text-muted-foreground">No playlists found.</div>
          )}
        </div>
      )}
    </main>
  )
}

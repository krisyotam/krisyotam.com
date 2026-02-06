"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { PageHeader } from "@/components/core"
import { CustomSelect, SelectOption } from "@/components/ui/custom-select"

interface WatchedShow {
  id: string
  title: string
  year: number
  posterUrl: string
  genres: string[]
  seasons: number
  episodes: number
}

export default function WatchedPage() {
  const router = useRouter()
  const pathname = usePathname()
  const [watched, setWatched] = useState<WatchedShow[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [genre, setGenre] = useState("all")
  const [decade, setDecade] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchWatched() {
      try {
        const res = await fetch("/api/tv?resource=watched&limit=0")
        const data = await res.json()
        setWatched(data)
      } catch (err) {
        console.error("Error fetching watched shows:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchWatched()
  }, [])

  const handleTabClick = (tab: "overview" | "watched") => {
    if (tab === "overview") {
      router.push("/tv")
    } else {
      router.push("/tv/watched")
    }
  }

  const activeTab = pathname === "/tv" ? "overview" : "watched"

  const allGenres = Array.from(new Set(watched.flatMap(show => show.genres || [])))
  const allDecades = Array.from(new Set(watched.filter(s => s.year).map(s => `${Math.floor(s.year / 10) * 10}s`))).sort()

  // Build select options
  const genreOptions: SelectOption[] = [
    { value: "all", label: "All Genres" },
    ...allGenres.sort().map(g => ({ value: g, label: g }))
  ]

  const decadeOptions: SelectOption[] = [
    { value: "all", label: "All Decades" },
    ...allDecades.map(d => ({ value: d, label: d }))
  ]

  const filtered = watched.filter(show => {
    const matchesSearch = searchQuery === "" ||
      show.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGenre = genre === "all" || (show.genres || []).includes(genre)
    const showDecade = show.year ? `${Math.floor(show.year / 10) * 10}s` : null
    const matchesDecade = decade === "all" || showDecade === decade
    return matchesSearch && matchesGenre && matchesDecade
  })

  return (
    <>
      <PageHeader
        title="Watched Shows"
        preview="Complete list of all TV shows I've watched"
        start_date="2025-01-01"
        end_date={new Date().toISOString().split('T')[0]}
        status="In Progress"
        importance={6}
        confidence="likely"
      />

      {/* Tab Navigation */}
      <div className="flex space-x-4 border-b mb-4">
        <button
          onClick={() => handleTabClick("overview")}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
            activeTab === "overview"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground"
          )}
        >
          Overview
        </button>
        <button
          onClick={() => handleTabClick("watched")}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
            activeTab === "watched"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground"
          )}
        >
          Watched
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800 dark:border-white" />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex items-center gap-4 flex-wrap">
            {/* Search */}
            <div className="flex-1 min-w-[240px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search shows..."
                className="w-full h-9 pl-10 pr-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery}
                aria-label="Search shows"
              />
            </div>

            {/* Genre Filter */}
            <CustomSelect
              id="genre-filter"
              value={genre}
              onValueChange={setGenre}
              options={genreOptions}
              placeholder="All Genres"
              className="text-sm min-w-[140px]"
            />

            {/* Decade Filter */}
            <CustomSelect
              id="decade-filter"
              value={decade}
              onValueChange={setDecade}
              options={decadeOptions}
              placeholder="All Decades"
              className="text-sm min-w-[140px]"
            />

            {/* Count */}
            <div className="px-3 py-1.5 bg-muted/50 dark:bg-[hsl(var(--popover))] border border-border text-sm whitespace-nowrap">
              <span className="font-semibold text-foreground">{filtered.length}</span>
              <span className="ml-1 text-muted-foreground">{filtered.length === 1 ? 'show' : 'shows'}</span>
            </div>
          </div>

          {/* Show Grid */}
          {filtered.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">No shows match your filters.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filtered.map(show => (
                <div
                  key={show.id}
                  className="aspect-[2/3] overflow-hidden bg-muted/30 shadow hover:bg-secondary/50 transition group relative"
                >
                  {show.posterUrl ? (
                    <img
                      src={show.posterUrl}
                      alt={show.title}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted p-4">
                      <span className="text-muted-foreground text-xs text-center line-clamp-3">{show.title}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white text-sm font-medium line-clamp-2">{show.title}</p>
                      <p className="text-white/70 text-xs">{show.year}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}

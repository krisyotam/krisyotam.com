"use client"

import { useEffect, useState } from "react"
import { TraktSectionHeader } from "@/components/trakt/trakt-section-header"
import { TraktEmptyState } from "@/components/trakt/trakt-empty-state"

interface WatchedFilm {
  id: string
  title: string
  year: number
  posterUrl: string
  genres: string[]
}

export default function FilmWatchedPage() {
  const [watched, setWatched] = useState<WatchedFilm[]>([])
  const [genre, setGenre] = useState("All")
  const [decade, setDecade] = useState("All")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchWatched() {
      try {
        const res = await fetch("/api/film/watched")
        const data = await res.json()
        setWatched(data)
      } catch (err) {
        console.error("Error fetching watched films:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchWatched()
  }, [])

  const allGenres = Array.from(new Set(watched.flatMap(film => film.genres || [])))
  const allDecades = Array.from(new Set(watched.map(f => `${Math.floor(f.year / 10) * 10}s`)))

  const filtered = watched.filter(film => {
    const matchesGenre = genre === "All" || (film.genres || []).includes(genre)
    const filmDecade = `${Math.floor(film.year / 10) * 10}s`
    const matchesDecade = decade === "All" || filmDecade === decade
    return matchesGenre && matchesDecade
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800 dark:border-white" />
      </div>
    )
  }

  return (
    <section className="space-y-6">
      <TraktSectionHeader title={`You have seen ${watched.length} films`} />

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="text-sm text-zinc-700 dark:text-zinc-300">Genre</label>
          <select
            className="block bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-none px-3 py-1 text-sm"
            value={genre}
            onChange={e => setGenre(e.target.value)}
          >
            <option>All</option>
            {allGenres.sort().map(g => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-zinc-700 dark:text-zinc-300">Decade</label>
          <select
            className="block bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-none px-3 py-1 text-sm"
            value={decade}
            onChange={e => setDecade(e.target.value)}
          >
            <option>All</option>
            {allDecades.sort().map(d => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Film Grid */}
      {filtered.length === 0 ? (
        <TraktEmptyState message="No films match your filters." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filtered.map(film => (
            <div
              key={film.id}
              className="aspect-[2/3] overflow-hidden rounded-none bg-muted/30 shadow hover:opacity-80 transition"
            >
              <img
                src={film.posterUrl}
                alt={film.title}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

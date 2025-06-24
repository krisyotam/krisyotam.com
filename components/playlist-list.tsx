"use client"

import { useState, useMemo } from "react"
import PlaylistCard from "./playlist-card"
import PlaylistSearch from "./playlist-search"
import GenreFilter from "./playlist-genre-filter"

interface Playlist {
  id: string
  title: string
  genre: string
  artists: string[]
  description: string
  coverImage: string
  link: string
  dateCreated: string
}

interface PlaylistListProps {
  playlists: Playlist[]
}

export default function PlaylistList({ playlists }: PlaylistListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)

  // Extract unique genres
  const genres = useMemo(() => {
    const genreSet = new Set(playlists.map((playlist) => playlist.genre))
    return Array.from(genreSet)
  }, [playlists])

  // Filter playlists based on search query and selected genre
  const filteredPlaylists = useMemo(() => {
    return playlists.filter((playlist) => {
      const matchesSearch =
        searchQuery === "" ||
        playlist.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        playlist.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        playlist.artists.some((artist) => artist.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesGenre = selectedGenre === null || playlist.genre === selectedGenre

      return matchesSearch && matchesGenre
    })
  }, [playlists, searchQuery, selectedGenre])

  return (
    <div>
      <div className="mb-8 space-y-4">
        <PlaylistSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <GenreFilter genres={genres} selectedGenre={selectedGenre} onSelectGenre={setSelectedGenre} />
      </div>

      {filteredPlaylists.length === 0 ? (
        <div className="mt-8 text-center text-gray-500 dark:text-[#999999]">
          No playlists found. Try adjusting your search or filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {filteredPlaylists.map((playlist) => (
            <PlaylistCard key={playlist.id} {...playlist} />
          ))}
        </div>
      )}
    </div>
  )
}


"use client"

import { useMemo } from "react"
import PlaylistCard from "./playlist-card"

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
  searchQuery: string
  activeGenre: string
}

export default function PlaylistList({ playlists, searchQuery, activeGenre }: PlaylistListProps) {
  // Filter playlists based on search query and selected genre
  const filteredPlaylists = useMemo(() => {
    return playlists.filter((playlist) => {
      const matchesSearch =
        searchQuery === "" ||
        playlist.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        playlist.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        playlist.artists.some((artist) => artist.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesGenre = activeGenre === "all" || playlist.genre === activeGenre

      return matchesSearch && matchesGenre
    })
  }, [playlists, searchQuery, activeGenre])

  return (
    <div>
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


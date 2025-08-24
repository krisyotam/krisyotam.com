"use client"

import { useState } from "react"
import PlaylistList from "@/components/playlist-list"
import playlists from "@/data/playlists.json"
import { PageHeader } from "@/components/page-header"
import { PageDescription } from "@/components/posts/typography/page-description"
import { CustomSelect, SelectOption } from "@/components/ui/custom-select"

// Playlists page metadata
const playlistsPageData = {
  title: "Playlists",
  subtitle: "Curated Music Collections",
  start_date: "2025-01-01",
  end_date: new Date().toISOString().split('T')[0],
  preview: "A collection of carefully curated playlists spanning various genres, moods, and musical eras.",
  status: "In Progress" as const,
  confidence: "certain" as const,
  importance: 6,
}

export default function PlaylistsClientPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeGenre, setActiveGenre] = useState("all")

  // Get unique genres and convert to SelectOption format
  const genres: SelectOption[] = ["all", ...Array.from(new Set(playlists.map(playlist => playlist.genre)))]
    .sort()
    .map(genre => ({
      value: genre,
      label: genre === "all" ? "All Genres" : genre
    }))

  const handleGenreChange = (genre: string) => {
    setActiveGenre(genre)
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground dark:bg-[#0d0d0d] dark:text-[#f2f2f2]">
      <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
        {/* Add the PageHeader component */}
        <PageHeader
          title={playlistsPageData.title}
          subtitle={playlistsPageData.subtitle}
          start_date={playlistsPageData.start_date}
          end_date={playlistsPageData.end_date}
          preview={playlistsPageData.preview}
          status={playlistsPageData.status}
          confidence={playlistsPageData.confidence}
          importance={playlistsPageData.importance}
        />

        {/* Search and filter on same row like notes page */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <label htmlFor="genre-filter" className="text-sm text-muted-foreground">Filter by genre:</label>
            <CustomSelect
              value={activeGenre}
              onValueChange={handleGenreChange}
              options={genres}
              className="text-sm min-w-[140px]"
            />
          </div>
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search playlists..."
              className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <PlaylistList 
          playlists={playlists} 
          searchQuery={searchQuery} 
          activeGenre={activeGenre}
        />
      </div>
      
      {/* PageDescription component */}
      <PageDescription
        title="About Playlists"
        description="I have used this page to accompany so of my longform articles on the auditory arts, I have curated several playlists to introduce new listeners to various artists, composers, and generes, there are also plenty of playlists for those of more refined (seasoned taste) in any specific genere."
      />
    </div>
  )
}


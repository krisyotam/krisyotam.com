"use client"

import { useState } from "react"
import PlaylistList from "@/components/playlist-list"
import playlists from "@/data/playlists.json"
import { PageHeader } from "@/components/page-header"
import { PageDescription } from "@/components/posts/typography/page-description"

// Playlists page metadata
const playlistsPageData = {
  title: "Playlists",
  subtitle: "Curated Music Collections",
  date: new Date().toISOString(),
  preview: "A collection of carefully curated playlists spanning various genres, moods, and musical eras.",
  status: "In Progress" as const,
  confidence: "certain" as const,
  importance: 6,
}

export default function PlaylistsClientPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground dark:bg-[#0d0d0d] dark:text-[#f2f2f2]">
      <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
        {/* Add the PageHeader component */}
        <PageHeader
          title={playlistsPageData.title}
          subtitle={playlistsPageData.subtitle}
          date={playlistsPageData.date}
          preview={playlistsPageData.preview}
          status={playlistsPageData.status}
          confidence={playlistsPageData.confidence}
          importance={playlistsPageData.importance}
        />

        <PlaylistList playlists={playlists} />
      </div>
      
      {/* PageDescription component */}
      <PageDescription
        title="About Playlists"
        description="I have used this page to accompany so of my longform articles on the auditory arts, I have curated several playlists to introduce new listeners to various artists, composers, and generes, there are also plenty of playlists for those of more refined (seasoned taste) in any specific genere."
      />
    </div>
  )
}


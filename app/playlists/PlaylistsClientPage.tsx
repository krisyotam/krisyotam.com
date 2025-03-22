"use client"

import { DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import PlaylistList from "@/components/playlist-list"
import playlists from "@/data/playlists.json"
import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { PageHeader } from "@/components/page-header"

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
  const [isModalOpen, setIsModalOpen] = useState(false)

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
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed bottom-4 left-4 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200 dark:bg-[#121212] dark:border-[#1f1f1f] dark:hover:bg-[#1f1f1f]"
            onClick={() => setIsModalOpen(true)}
          >
            <HelpCircle className="h-5 w-5 dark:text-[#f2f2f2]" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-background rounded-lg shadow-2xl border-0 dark:bg-[#121212] dark:border-[#1f1f1f]">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl font-semibold dark:text-[#f2f2f2]">About Playlists</DialogTitle>
            <DialogDescription className="text-base leading-relaxed dark:text-[#999999]">
              I have used this page to accompany so of my longform articles on the auditory arts, I have curated several
              playlists to introduce new listeners to various artists, composers, and generes, there are also plenty of
              playlists for those of more refined (seasoned taste) in any specific genere.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}


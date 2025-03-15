"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Book, FileText, Video } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface BibliographyEntry {
  id: string
  author: string
  title: string
  year: number
  publisher: string
  url: string
  type: "book" | "article" | "video" | "paper" | string
}

interface BibliographyProps {
  bibliography: BibliographyEntry[]
  className?: string
}

export function Bibliography({ bibliography, className }: BibliographyProps) {
  const [selectedEntry, setSelectedEntry] = useState<BibliographyEntry | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const entriesPerPage = 5

  const handleEntryClick = (entry: BibliographyEntry) => {
    setSelectedEntry(entry)
    setIsModalOpen(true)
  }

  // Calculate pagination
  const totalPages = Math.ceil(bibliography.length / entriesPerPage)
  const startIndex = (currentPage - 1) * entriesPerPage
  const endIndex = startIndex + entriesPerPage
  const currentEntries = bibliography.slice(startIndex, endIndex)

  // Determine if a URL is a YouTube video
  const isYouTubeUrl = (url: string): boolean => {
    return url.includes("youtube.com") || url.includes("youtu.be")
  }

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  // Get icon based on entry type
  const getEntryIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "book":
        return <Book className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      case "video":
        return <Video className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      case "article":
      case "paper":
      default:
        return <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
    }
  }

  return (
    <div className={cn("max-w-2xl mx-auto", className)}>
      <Card
        className={cn(
          "p-4 bg-card text-card-foreground border-border",
          "rounded-none", // Remove border radius
          "[&_h3]:mt-0 [&_h3]:mb-3", // Reset header margins
        )}
      >
        <h3 className="text-sm font-medium">Bibliography</h3>
        <div className="space-y-2">
          {currentEntries.map((entry) => (
            <button
              key={entry.id}
              className="w-full text-left py-1.5 px-2 hover:bg-secondary transition-colors flex items-start gap-2 text-xs"
              onClick={() => handleEntryClick(entry)}
            >
              {getEntryIcon(entry.type)}
              <div className="overflow-hidden">
                <span>
                  {entry.author} ({entry.year}). <span className="italic">{entry.title}</span>. {entry.publisher}.
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Add pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 px-2"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <span className="text-xs text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8 px-2"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[900px] bg-background text-foreground border-border p-0 rounded-none">
          <DialogHeader className="p-4 border-b border-border">
            <DialogTitle className="text-sm font-medium">
              <div>
                {selectedEntry?.title}
                <span className="text-muted-foreground ml-2 text-xs">
                  {selectedEntry?.author}, {selectedEntry?.year}
                </span>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="h-[70vh] w-full">
            {selectedEntry &&
              (isYouTubeUrl(selectedEntry.url) ? (
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeVideoId(selectedEntry.url)}`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <iframe src={`${selectedEntry.url}#toolbar=0`} className="w-full h-full"></iframe>
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Bibliography


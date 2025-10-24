"use client"

import { Book, FileText, Video } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

interface BibliographyEntry {
  id: string
  author: string
  title: string
  year: number
  publisher: string
  url: string
  type: "book" | "article" | "video" | "paper" | string
}

interface SimpleBibProps {
  className?: string
  data: BibliographyEntry[] // Data is passed directly to component
}

export function SimpleBib({ className, data }: SimpleBibProps) {
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

  if (!data || data.length === 0) {
    return null
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
          {data.map((entry) => (
            <div
              key={entry.id}
              className="py-1.5 px-2 hover:bg-secondary transition-colors flex items-start gap-2 text-xs"
            >
              {getEntryIcon(entry.type)}
              <div className="overflow-hidden">
                <span>
                  {entry.author} ({entry.year}). <span className="italic">{entry.title}</span>. {entry.publisher}.
                  {' '}
                  <a 
                    href={entry.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    View resource
                  </a>
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default SimpleBib

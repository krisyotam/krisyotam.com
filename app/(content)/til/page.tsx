import { getTilData } from "@/lib/data"
import TilClientPage from "./TilClientPage"
import { staticMetadata } from "@/lib/staticMetadata"
import type { Metadata } from "next"
import { ReactNode } from "react"

export const dynamic = "force-static"

export const metadata: Metadata = staticMetadata.til

interface TilEntryWithContent {
  entry: {
    title: string
    preview: string
    date: string
    tags: string[]
    category: string
    slug: string
    cover_image?: string
    status: string
    confidence: string
    importance: number
    state: string
  }
  content: ReactNode
}

export default async function TILPage() {
  try {
    const tilData = await getTilData()
    const tilEntries = tilData.til

    // Filter active entries and sort by date (newest first)
    const activeEntries = tilEntries
      .filter(entry => entry.state === "active")
      .sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      })

    // Dynamically import MDX content for each entry
    const entriesWithContent: TilEntryWithContent[] = await Promise.all(
      activeEntries.map(async (entry) => {
        try {
          const TilContent = (await import(`@/app/(content)/til/content/${entry.slug}.mdx`)).default
          return {
            entry: {
              title: entry.title,
              preview: entry.preview || "",
              date: entry.date,
              tags: entry.tags,
              category: entry.category,
              slug: entry.slug,
              cover_image: entry.cover_image,
              status: entry.status,
              confidence: entry.confidence,
              importance: entry.importance,
              state: entry.state,
            },
            content: <TilContent />
          }
        } catch (error) {
          console.error(`Failed to load MDX for TIL entry ${entry.slug}:`, error)
          return {
            entry: {
              title: entry.title,
              preview: entry.preview || "",
              date: entry.date,
              tags: entry.tags,
              category: entry.category,
              slug: entry.slug,
              cover_image: entry.cover_image,
              status: entry.status,
              confidence: entry.confidence,
              importance: entry.importance,
              state: entry.state,
            },
            content: <p className="text-muted-foreground">Content not found.</p>
          }
        }
      })
    )

    return (
      <div className="til-container">
        <TilClientPage entriesWithContent={entriesWithContent} initialCategory="all" />
      </div>
    )
  } catch (error) {
    console.error("Failed to fetch TIL entries:", error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="max-w-md p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Error Loading TIL Entries</h2>
          <p className="text-muted-foreground mb-6">
            Failed to load TIL entries. The GitHub repository might be unavailable or there might be an issue with the
            connection.
          </p>
        </div>
      </div>
    )
  }
}

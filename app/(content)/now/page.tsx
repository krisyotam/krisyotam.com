import { getNowData } from "@/lib/data"
import type { Metadata } from "next"
import NowClientPage from "./NowClientPage"
import { staticMetadata } from "@/lib/staticMetadata"
import { ReactNode } from "react"

export const metadata: Metadata = staticMetadata.now

interface NowEntryWithContent {
  entry: {
    title: string
    preview: string
    date: string
    tags: string[]
    category: string
    slug: string
    cover_image: string
    status: string
    confidence: string
    importance: number
    state: string
  }
  content: ReactNode
}

export default async function NowPage() {
  const nowData = await getNowData()
  const activeEntries = nowData.now
    .filter(entry => entry.state === "active")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Dynamically import MDX content for each entry
  const entriesWithContent: NowEntryWithContent[] = await Promise.all(
    activeEntries.map(async (entry) => {
      try {
        const NowContent = (await import(`@/app/(content)/now/content/${entry.slug}.mdx`)).default
        return {
          entry,
          content: <NowContent />
        }
      } catch (error) {
        console.error(`Failed to load MDX for now entry ${entry.slug}:`, error)
        return {
          entry,
          content: <p className="text-muted-foreground">Content not found.</p>
        }
      }
    })
  )

  return (
    <div className="now-container">
      <NowClientPage entriesWithContent={entriesWithContent} initialCategory="all" />
    </div>
  )
}


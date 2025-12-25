import type { Metadata } from "next"
import dynamic from "next/dynamic"
import musicData from "@/data/music/music.json"
import { PageHeader } from "@/components/page-header"

// Load client-only components dynamically so this page stays a server component
const MusicClient = dynamic(() => import("./MusicClient"), { ssr: false })
const PageDescription = dynamic(() => import("@/components/posts/typography/page-description"), { ssr: false })

// Removed generateMetadata to avoid Next.js metadata/client conflict

export default async function MusicPage() {
  // Load music data from the local JSON file (server-side)
  const playlists = (musicData as any)?.music || []

  return (
    <div className="relative min-h-screen bg-background text-foreground dark:bg-[#0d0d0d] dark:text-[#f2f2f2]">
      <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        <PageHeader
          title="Music"
          subtitle="Music — reviews, recommendations, and playlists"
          start_date="2023-01-01"
          end_date={new Date().toISOString().split('T')[0]}
          preview="carefully curated playlists from my studies of various genres, artists, and eras"
          status="In Progress"
          confidence="certain"
          importance={6}
        />
        <MusicClient playlists={playlists} />
      </div>

      <PageDescription
        title="About Music"
        description="A place for music recommendations, reviews, and curated playlist collections. Use the search or filters to explore."
        icons={[
          { slug: 'spotify', url: '#' },
          { slug: 'apple', url: '#' },
          { slug: 'tidal', url: '#' },
          { slug: 'qobuz', url: '#' },
        ]}
      />
    </div>
  )
}

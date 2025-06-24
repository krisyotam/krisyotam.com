import { Suspense } from "react"
import { PageHeader } from "@/components/page-header"
import MasonryGrid from "@/components/art/masonry-grid"
import artData from "@/data/art/art.json"

export default function ArtPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container max-w-2xl mx-auto px-4 py-8">
        <PageHeader
          title="Art"
          date={new Date().toISOString()}
          preview="my personal art, follow me at cara.app/krisyotam"
          status="In Progress"
          confidence="highly likely"
          importance={7}
        />
        <div className="mt-6">
          <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading artwork...</div>}>
            <MasonryGrid artworks={artData.artworks} />
          </Suspense>
        </div>
      </main>
    </div>
  )
} 
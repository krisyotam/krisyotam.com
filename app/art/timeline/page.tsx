import { Suspense } from "react"
import MasonryGrid from "@/components/art/masonry-grid"
import traditionalArt from "@/data/traditional-art.json"
import aiArt from "@/data/ai-art.json"

export default function TimelinePage({
  searchParams,
}: {
  searchParams: { filter?: string }
}) {
  const filter = searchParams.filter || "all"

  // Combine and sort by date
  const allArtworks = [...traditionalArt, ...aiArt].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  return (
    <div>
      <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading artwork...</div>}>
        <MasonryGrid artworks={allArtworks} filter={filter} />
      </Suspense>
    </div>
  )
}


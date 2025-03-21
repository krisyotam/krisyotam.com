import { Suspense } from "react"
import MasonryGrid from "@/components/art/masonry-grid"
import traditionalArt from "@/data/traditional-art.json"
import aiArt from "@/data/ai-art.json"

export default function PortfolioPage({
  searchParams,
}: {
  searchParams: { filter?: string }
}) {
  const filter = searchParams.filter || "all"
  const allArtworks = [...traditionalArt, ...aiArt]

  return (
    <div>
      <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading artwork...</div>}>
        <MasonryGrid artworks={allArtworks} filter={filter} />
      </Suspense>
    </div>
  )
}


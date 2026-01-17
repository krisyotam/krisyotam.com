import { Suspense } from "react"
import ArtClientPage from "./ArtClientPage"
import { getArt } from "@/lib/content-db"
import { staticMetadata } from "@/lib/staticMetadata"
import type { Metadata } from "next"

export const metadata: Metadata = staticMetadata.art

export default function ArtPage() {
  const artData = getArt()

  // Map artworks to the expected format for ArtClientPage
  const mappedArtworks = artData.map(artwork => ({
    id: String(artwork.id),
    title: artwork.title,
    description: artwork.description || "",
    imageUrl: artwork.image_url || undefined,
    dimension: artwork.dimension || "",
    start_date: artwork.start_date || "",
    end_date: artwork.end_date || undefined,
    date: artwork.end_date || artwork.start_date || "",
    category: artwork.category_slug || undefined,
    status: artwork.status || undefined,
    confidence: artwork.confidence || undefined,
    importance: artwork.importance || undefined,
    bio: artwork.bio || undefined,
  }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container max-w-2xl mx-auto px-4 py-8">
        <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading artwork...</div>}>
          <ArtClientPage artworks={mappedArtworks} initialCategory="all" />
        </Suspense>
      </main>
    </div>
  )
}

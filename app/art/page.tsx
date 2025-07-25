import { Suspense } from "react"
import ArtClientPage from "./ArtClientPage"
import artData from "@/data/art/art.json"
import { staticMetadata } from "@/lib/staticMetadata"
import type { Metadata } from "next"

export const metadata: Metadata = staticMetadata.art

export default function ArtPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container max-w-2xl mx-auto px-4 py-8">
        <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading artwork...</div>}>
          <ArtClientPage artworks={artData.artworks} initialCategory="all" />
        </Suspense>
      </main>
    </div>
  )
}
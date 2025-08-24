"use client"

import { useState, useEffect } from "react"
import ArtCardSmall from "./art-card-small"
import ArtCardWide from "./art-card-wide"
import ArtCardTall from "./art-card-tall"
import type { ArtworkItem } from "./art-card-base"

export default function MasonryGrid({
  artworks,
}: {
  artworks: ArtworkItem[]
}) {
  const [filteredArtworks, setFilteredArtworks] = useState<ArtworkItem[]>(artworks)

  useEffect(() => {
    setFilteredArtworks(artworks)
  }, [artworks])

  if (filteredArtworks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <p className="text-muted-foreground">No artworks found.</p>
      </div>
    )
  }

  const renderArtworkCard = (artwork: ArtworkItem) => {
    switch (artwork.dimension) {
      case "1x1":
        return <ArtCardSmall key={artwork.id} artwork={artwork} />
      case "7x4":
        return <ArtCardWide key={artwork.id} artwork={artwork} />
      case "4x7":
        return <ArtCardTall key={artwork.id} artwork={artwork} />
      default:
        return <ArtCardSmall key={artwork.id} artwork={artwork} />
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {filteredArtworks.map((artwork) => (
        <div key={artwork.id} className="w-full">
          {renderArtworkCard(artwork)}
        </div>
      ))}
    </div>
  )
}


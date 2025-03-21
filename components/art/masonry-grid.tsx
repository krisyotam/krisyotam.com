"use client"

import { useState, useEffect } from "react"
import ArtCardSmall from "./art-card-small"
import ArtCardWide from "./art-card-wide"
import ArtCardTall from "./art-card-tall"
import type { ArtworkItem } from "./art-card-base"

export default function MasonryGrid({
  artworks,
  filter = "all",
}: {
  artworks: ArtworkItem[]
  filter?: string
}) {
  const [filteredArtworks, setFilteredArtworks] = useState<ArtworkItem[]>([])

  useEffect(() => {
    if (filter === "all") {
      setFilteredArtworks(artworks)
    } else {
      setFilteredArtworks(artworks.filter((artwork) => artwork.type.toLowerCase() === filter.toLowerCase()))
    }
  }, [artworks, filter])

  if (filteredArtworks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg text-muted-foreground">No artworks found for this filter.</p>
      </div>
    )
  }

  // Distribute artworks into columns for true masonry effect
  const createMasonryLayout = () => {
    const columns = {
      col1: [] as ArtworkItem[],
      col2: [] as ArtworkItem[],
      col3: [] as ArtworkItem[],
      col4: [] as ArtworkItem[],
    }

    // Calculate approximate height for each artwork based on dimension
    const getApproxHeight = (dimension: string) => {
      switch (dimension) {
        case "1x1":
          return 1
        case "7x4":
          return 0.57 // 4/7
        case "4x7":
          return 1.75 // 7/4
        default:
          return 1
      }
    }

    // Calculate current height of each column
    const getColumnHeight = (col: ArtworkItem[]) => {
      return col.reduce((sum, item) => sum + getApproxHeight(item.dimension), 0)
    }

    // Find column with minimum height
    const getShortestColumn = () => {
      const heights = {
        col1: getColumnHeight(columns.col1),
        col2: getColumnHeight(columns.col2),
        col3: getColumnHeight(columns.col3),
        col4: getColumnHeight(columns.col4),
      }

      const minHeight = Math.min(...Object.values(heights))
      return Object.keys(heights).find(
        (key) => heights[key as keyof typeof heights] === minHeight,
      ) as keyof typeof columns
    }

    // Distribute artworks to columns
    filteredArtworks.forEach((artwork) => {
      const shortestCol = getShortestColumn()
      columns[shortestCol].push(artwork)
    })

    return columns
  }

  const columns = createMasonryLayout()

  // Determine number of columns based on screen size
  const getColumnClass = () => {
    return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1"
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
    <div className={getColumnClass()}>
      <div className="flex flex-col gap-1">{columns.col1.map((artwork) => renderArtworkCard(artwork))}</div>
      <div className="flex flex-col gap-1">{columns.col2.map((artwork) => renderArtworkCard(artwork))}</div>
      <div className="flex flex-col gap-1 hidden lg:flex">
        {columns.col3.map((artwork) => renderArtworkCard(artwork))}
      </div>
      <div className="flex flex-col gap-1 hidden xl:flex">
        {columns.col4.map((artwork) => renderArtworkCard(artwork))}
      </div>
    </div>
  )
}


"use client"

import { FavoriteCard } from "@/components/anime/anime-cards"
import { useState, useEffect } from "react"

interface TraktEpisodeCardProps {
  id: number
  showTitle: string
  episodeTitle: string
  season: number
  episode: number
  posterUrl?: string | null
  watchedAt?: string
}

export function TraktEpisodeCard({
  id,
  showTitle,
  episodeTitle,
  season,
  episode,
  posterUrl,
  watchedAt,
}: TraktEpisodeCardProps) {
  const [imageError, setImageError] = useState(false)

  // Create a placeholder URL with the show title if no poster is available or if there was an error
  const fallbackUrl = `/placeholder.svg?height=270&width=180&text=${encodeURIComponent(showTitle)}`
  const imageUrl = posterUrl && !imageError ? posterUrl : fallbackUrl

  useEffect(() => {
    console.log(`TraktEpisodeCard rendering: "${showTitle}" S${season}E${episode} - "${episodeTitle}"`)
    console.log(`Original poster URL: ${posterUrl || "None"}`)
    console.log(`Using image URL: ${imageUrl}`)

    // Pre-check if the image is accessible
    if (posterUrl) {
      const img = new Image()
      img.onload = () => console.log(`Image for "${showTitle}" S${season}E${episode} loaded successfully`)
      img.onerror = () => {
        console.error(`Image failed to load for episode: ${showTitle} S${season}E${episode} at URL: ${posterUrl}`)
        setImageError(true)
      }
      img.src = posterUrl
    }
  }, [showTitle, episodeTitle, season, episode, posterUrl, imageUrl])

  return (
    <FavoriteCard
      item={{
        name: showTitle,
        images: {
          jpg: {
            image_url: imageUrl,
          },
        },
        url: `https://trakt.tv/shows/${id}/seasons/${season}/episodes/${episode}`,
      }}
      type="episode"
      isCompany={false}
      subtitle={`S${season}:E${episode} - ${episodeTitle}`}
      onImageError={() => {
        console.error(`Image failed to load for episode: ${showTitle} S${season}E${episode}`)
        setImageError(true)
      }}
    />
  )
}


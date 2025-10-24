"use client"

import { AnimeFavoriteCard } from "@/components/anime/anime-cards"
import { useState, useEffect } from "react"

interface TraktShowCardProps {
  id: number
  title: string
  year?: number
  posterUrl?: string | null
}

export function TraktShowCard({ id, title, year, posterUrl }: TraktShowCardProps) {
  const [imageError, setImageError] = useState(false)

  // Create a placeholder URL with the title if no poster is available or if there was an error
  const fallbackUrl = `/placeholder.svg?height=270&width=180&text=${encodeURIComponent(title)}`
  const imageUrl = posterUrl && !imageError ? posterUrl : fallbackUrl

  useEffect(() => {
    console.log(`TraktShowCard rendering: "${title}" (${year})`)
    console.log(`Original poster URL: ${posterUrl || "None"}`)
    console.log(`Using image URL: ${imageUrl}`)

    // Pre-check if the image is accessible
    if (posterUrl) {
      const img = new Image()
      img.onload = () => console.log(`Image for "${title}" loaded successfully`)
      img.onerror = () => {
        console.error(`Image failed to load for show: ${title} at URL: ${posterUrl}`)
        setImageError(true)
      }
      img.src = posterUrl
    }
  }, [title, year, posterUrl, imageUrl])

  return (
    <AnimeFavoriteCard
      item={{
        name: title,
        images: {
          jpg: {
            image_url: imageUrl,
          },
        },
        url: `https://trakt.tv/shows/${id}`,
      }}
      type="anime"
      isCompany={false}
      subtitle={year ? `${year}` : undefined}
      onImageError={() => {
        console.error(`Image failed to load for show: ${title}`)
        setImageError(true)
      }}
    />
  )
}


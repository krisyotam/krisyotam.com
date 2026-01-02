"use client";

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { getPhotoUrl } from "@/lib/flickr"

export interface ArtworkItem {
  id: string
  title: string
  type?: string
  category?: string
  description: string
  imageUrl?: string
  dimension: string
  start_date: string
  end_date?: string
  date?: string // backward compatibility
  tags?: string[]
  status?: string
  confidence?: string
  importance?: number
  bio?: string
}

export default function ArtCardBase({
  artwork,
  className = "",
}: {
  artwork: ArtworkItem
  className?: string
}) {
  const [imageUrl, setImageUrl] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  
  const slug = artwork.title.toLowerCase().replace(/\s+/g, '-')

  useEffect(() => {
    const loadImage = async () => {
      setIsLoading(true)
      // Use imageUrl from the artwork data if available, otherwise fetch from Flickr
      if (artwork.imageUrl) {
        setImageUrl(artwork.imageUrl)
        setIsLoading(false)
      } else {
        try {
          const url = await getPhotoUrl(artwork.id)
          setImageUrl(url)
        } catch (error) {
          console.error("Error loading image:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadImage()
  }, [artwork.id, artwork.imageUrl])

  // Format date while preserving the exact day
  const displayDate = artwork.end_date || artwork.start_date || artwork.date;
  let formattedDate = "";
  if (displayDate && displayDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [year, month, day] = displayDate.split('-').map(num => parseInt(num, 10));
    const date = new Date(year, month - 1, day);
    formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: 'UTC'
    });
  } else if (displayDate) {
    formattedDate = new Date(displayDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: 'UTC'
    });
  }

  return (
    <Link href={`/art/${slug}`}>
      <div
        className={`group relative overflow-hidden rounded-none bg-card text-card-foreground transition-all cursor-pointer ${className}`}
      >
        <div className="relative w-full h-full">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <Image
              src={imageUrl || "/placeholder.svg?height=600&width=600"}
              alt={artwork.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105 rounded-none"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <h3 className="text-lg font-semibold text-white">{artwork.title}</h3>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-white/80">{formattedDate}</span>
              <span className="text-xs px-2 py-1 rounded-none bg-primary/80 text-primary-foreground">
                {artwork.category || artwork.type || "Art"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}


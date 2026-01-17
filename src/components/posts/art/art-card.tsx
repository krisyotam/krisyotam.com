"use client"

import { useState } from "react"
import { ArtModal } from "./art-modal"
import { cn } from "@/lib/utils"

export interface ArtworkInfo {
  id: string
  title: string
  artist: string
  year: string
  period: string
  type: string
  medium?: string
  dimensions?: string
  location?: string
  imageUrl: string
  description?: string
}

interface ArtCardProps {
  artwork: ArtworkInfo
  aspectRatio: "4x7" | "1x1" | "7x4"
  className?: string
}

export function ArtCard({ artwork, aspectRatio, className }: ArtCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const aspectRatioClass = {
    "4x7": "aspect-[4/7]",
    "1x1": "aspect-square",
    "7x4": "aspect-[7/4]",
  }[aspectRatio]

  return (
    <>
      <div
        className={cn(
          "group relative cursor-pointer overflow-hidden rounded-lg bg-background transition-all",
          "hover:shadow-lg hover:ring-2 hover:ring-primary/50",
          aspectRatioClass,
          className,
        )}
        onClick={() => setIsModalOpen(true)}
      >
        <div className="absolute inset-0 z-10 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
          <h3 className="text-lg font-bold text-white">{artwork.title}</h3>
          <p className="text-sm text-white/90">{artwork.artist}</p>
          <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1">
            <span className="inline-block text-xs text-white/80">{artwork.year}</span>
            <span className="inline-block text-xs text-white/80">{artwork.period}</span>
            <span className="inline-block text-xs text-white/80">{artwork.type}</span>
            {artwork.medium && <span className="inline-block text-xs text-white/80">{artwork.medium}</span>}
          </div>
        </div>
        <img
          src={artwork.imageUrl || "/placeholder.svg"}
          alt={artwork.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <ArtModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageUrl={artwork.imageUrl}
        alt={artwork.title}
      />
    </>
  )
}


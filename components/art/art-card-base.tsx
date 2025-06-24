"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { getPhotoUrl } from "@/utils/flickr-api"

export type ArtworkItem = {
  id: string
  title: string
  type: string
  description: string
  dimension: string
  date: string
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
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const loadImage = async () => {
      setIsLoading(true)
      const url = await getPhotoUrl(artwork.id)
      setImageUrl(url)
      setIsLoading(false)
    }

    loadImage()
  }, [artwork.id])

  const formattedDate = new Date(artwork.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  return (
    <>
      <div
        className={`group relative overflow-hidden rounded-sm bg-card text-card-foreground transition-all cursor-pointer ${className}`}
        onClick={() => setIsOpen(true)}
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
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <h3 className="text-lg font-semibold text-white">{artwork.title}</h3>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-white/80">{formattedDate}</span>
              <span className="text-xs px-2 py-1 rounded-full bg-primary/80 text-primary-foreground">
                {artwork.type}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none">
          <div className="relative flex flex-col bg-card rounded-lg overflow-hidden">
            <div className="relative w-full h-[70vh] max-h-[70vh]">
              {imageUrl && (
                <Image
                  src={imageUrl || "/placeholder.svg"}
                  alt={artwork.title}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              )}
            </div>
            <div className="p-6 bg-card">
              <h2 className="text-2xl font-bold mb-2">{artwork.title}</h2>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm px-2 py-1 rounded-full bg-primary/10 text-primary">{artwork.type}</span>
                <span className="text-sm text-muted-foreground">{formattedDate}</span>
              </div>
              <p className="text-card-foreground">{artwork.description}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}


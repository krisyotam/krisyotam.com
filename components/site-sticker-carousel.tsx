"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

interface SiteSticker {
  ownerName: string
  siteSticker: string
  siteUrl: string
  tags: string[]
  description: string
}

interface SiteStickerCarouselProps {
  sites: SiteSticker[]
}

export default function SiteStickerCarousel({ sites }: SiteStickerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0
    const newIndex = isFirstSlide ? sites.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
  }

  const goToNext = () => {
    const isLastSlide = currentIndex === sites.length - 1
    const newIndex = isLastSlide ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
  }

  if (sites.length === 0) {
    return <div>No sites available</div>
  }

  const currentSite = sites[currentIndex]

  return (
    <div className="w-full">
      <Card className="bg-muted/50 hover:bg-muted/70 transition-colors border-border">
        <CardContent className="p-6">
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-[300px] h-[200px] mb-4">
              <Link href={currentSite.siteUrl} target="_blank" rel="noopener noreferrer">
                <Image
                  src={currentSite.siteSticker || "/placeholder.svg"}
                  alt={`${currentSite.ownerName}'s site sticker`}
                  fill
                  style={{ objectFit: "contain" }}
                  className="rounded-md"
                  unoptimized={currentSite.siteSticker?.includes('krisyotam.com')}
                />
              </Link>
            </div>
            <h3 className="text-lg font-medium mb-2 text-center">{currentSite.ownerName}</h3>

            {/* Tags */}
            <div className="flex flex-wrap justify-center gap-2 mb-3">
              {currentSite.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Description */}
            <p className="text-sm text-center text-muted-foreground mb-4">{currentSite.description}</p>

            <div className="flex justify-center gap-2 mt-2">
              <Button
                variant="outline"
                size="icon"
                onClick={goToPrevious}
                className="h-8 w-8 rounded-full"
                aria-label="Previous site"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={goToNext}
                className="h-8 w-8 rounded-full"
                aria-label="Next site"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              {currentIndex + 1} of {sites.length}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

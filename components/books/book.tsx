"use client"

import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { useState } from "react"

interface BookProps {
  coverImage: string
  title: string
  author: string
  edition?: string
  originallyPublished: string | number
  genre: string
  link: string
  className?: string
}

export default function Book({
  coverImage,
  title,
  author,
  edition,
  originallyPublished,
  genre,
  link,
  className,
}: BookProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <Link
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "block w-64 flex-shrink-0 bg-card border border-border shadow-sm",
        "font-sans antialiased overflow-hidden",
        "transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-muted",
        className,
      )}
    >
      <div className="flex flex-col h-full">
        {/* Book Cover */}
        <div className="relative aspect-[2/3] overflow-hidden bg-muted flex items-stretch">
          <Image
            src={coverImage || "/placeholder.svg?height=360&width=240"}
            alt={`${title} by ${author}`}
            fill
            className={cn(
              "object-cover block transition-opacity duration-500",
              isLoaded ? "opacity-100" : "opacity-0"
            )}
            sizes="100vw"
            onLoad={() => setIsLoaded(true)}
            unoptimized={coverImage.startsWith("http")} // smart optimization toggle
          />
        </div>

        {/* Book Information */}
        <div className="p-4 space-y-2 flex-grow">
          <div className="flex justify-between items-start">
            <h2 className="text-base font-medium text-foreground leading-tight">{title}</h2>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 ml-1 mt-0.5" />
          </div>

          <div className="text-sm text-muted-foreground">{author}</div>

          <div className="pt-2 border-t border-border text-xs text-muted-foreground font-light space-y-1">
            {edition && <div>Edition: {edition}</div>}
            <div className="flex justify-between">
              <span>Published: {originallyPublished}</span>
              <span>{genre}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

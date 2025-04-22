"use client"

import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"

interface BookItem {
  coverImage: string
  title: string
  author: string
  edition?: string
  originallyPublished: string | number
  genre: string
  link: string
}

interface BookCollectionProps {
  books: BookItem[]
  title?: string
  className?: string
}

export default function BookCollection({ books = [], title, className }: BookCollectionProps) {
  const [currentBookIndex, setCurrentBookIndex] = useState(0)

  const currentBook = books.length > 0 ? books[currentBookIndex] : null

  const nextBook = () => {
    if (books.length > 1) {
      setCurrentBookIndex((prev) => (prev + 1) % books.length)
    }
  }

  const prevBook = () => {
    if (books.length > 1) {
      setCurrentBookIndex((prev) => (prev - 1 + books.length) % books.length)
    }
  }

  if (!currentBook) {
    return null
  }

  return (
    <div
      className={cn(
        "w-64 flex-shrink-0 bg-card border border-border shadow-sm",
        "font-sans antialiased overflow-hidden rounded-sm",
        className,
      )}
    >
      {title && (
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-base font-medium text-center text-foreground">{title}</h2>
        </div>
      )}

      <div className="flex flex-col h-full">
        {/* Book Cover with Navigation */}
        <div className="relative">
          <div className="aspect-[2/3] overflow-hidden bg-muted relative">
            <Image
              src={currentBook.coverImage || "/placeholder.svg?height=360&width=240"}
              alt={`${currentBook.title} by ${currentBook.author}`}
              fill
              className="object-cover"
            />
          </div>

          {books.length > 1 && (
            <>
              <button
                onClick={prevBook}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/70 rounded-full p-1 shadow-sm hover:bg-background"
                aria-label="Previous book"
              >
                <ChevronLeft className="h-4 w-4 text-muted-foreground" />
              </button>

              <button
                onClick={nextBook}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/70 rounded-full p-1 shadow-sm hover:bg-background"
                aria-label="Next book"
              >
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            </>
          )}
        </div>

        {/* Book Information */}
        <div className="p-4 space-y-2">
          <Link
            href={currentBook.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex justify-between items-start"
          >
            <h2 className="text-base font-medium text-foreground leading-tight group-hover:text-muted-foreground">
              {currentBook.title}
            </h2>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 ml-1 mt-0.5 group-hover:text-foreground" />
          </Link>

          <div className="text-sm text-muted-foreground">{currentBook.author}</div>

          <div className="pt-2 border-t border-border text-xs text-muted-foreground font-light space-y-1">
            {currentBook.edition && <div>Edition: {currentBook.edition}</div>}
            <div className="flex justify-between">
              <span>Published: {currentBook.originallyPublished}</span>
              <span>{currentBook.genre}</span>
            </div>
          </div>

          {books.length > 1 && (
            <div className="pt-2 text-center text-xs text-muted-foreground">
              {currentBookIndex + 1} of {books.length}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

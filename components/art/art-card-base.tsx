"use client";

import Image from "next/image"
import Link from "next/link"

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
  const slug = artwork.title.toLowerCase().replace(/\s+/g, '-')
  const imageUrl = artwork.imageUrl || "/placeholder.svg?height=600&width=600"

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
          <Image
            src={imageUrl}
            alt={artwork.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105 rounded-none"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

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

import Image from "next/image"
import Link from "next/link"
import { formatDate } from "@/lib/date"
import { Box } from "@/components/posts/typography/box"

interface PlaylistCardProps {
  id: string
  title: string
  genre: string
  artists: string[]
  description: string
  coverImage: string
  link: string
  dateCreated: string
}

export default function PlaylistCard({
  id,
  title,
  genre,
  artists,
  description,
  coverImage,
  link,
  dateCreated,
}: PlaylistCardProps) {
  const formattedDate = dateCreated ? formatDate(dateCreated.toString()) : ""
  const displayArtists = artists && artists.length > 3 ? `${artists.slice(0, 3).join(", ")} et al.` : (artists || []).join(", ")

  return (
    <Link href={link} target="_blank" rel="noopener noreferrer" className="block group">
      <Box className="hover:bg-muted/70 transition-colors cursor-pointer my-0">
        <div className="relative aspect-square overflow-hidden mb-4">
          <Image
            src={coverImage || "/placeholder.svg?height=400&width=400"}
            alt={title}
            width={400}
            height={400}
            className="h-full w-full object-cover transition-all duration-300"
            unoptimized={coverImage?.includes('krisyotam.com')}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-block bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
              {genre}
            </span>
            <span className="text-xs text-muted-foreground">{formattedDate}</span>
          </div>

          <h3 className="text-lg font-medium text-foreground">{title}</h3>

          <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>

          <div className="text-xs text-muted-foreground">
            <span className="font-medium">Artists: </span>
            {displayArtists}
          </div>
        </div>
      </Box>
    </Link>
  )
}

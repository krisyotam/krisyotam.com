import Image from "next/image"
import Link from "next/link"
import { formatDate } from "@/utils/date-formatter"

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
  // Convert string date to Date object
  const formattedDate = dateCreated ? formatDate(dateCreated.toString()) : ""

  // Format artists list: show first 3, then "et al." if more
  const displayArtists = artists.length > 3 ? `${artists.slice(0, 3).join(", ")} et al.` : artists.join(", ")

  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-all duration-300 hover:shadow-xl dark:border-[#1f1f1f] dark:bg-[#121212]">
      <Link href={link} target="_blank" rel="noopener noreferrer" className="block">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={coverImage || "/placeholder.svg?height=400&width=400"}
            alt={title}
            width={400}
            height={400}
            className="h-full w-full object-cover transition-all duration-300 filter grayscale group-hover:grayscale-0"
          />
        </div>
        <div className="p-4">
          <div className="mb-1 flex items-center justify-between">
            <span className="inline-block rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 dark:bg-[#1f1f1f] dark:text-[#f2f2f2]">
              {genre}
            </span>
            <span className="text-xs text-gray-500 dark:text-[#999999]">{formattedDate}</span>
          </div>
          <h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-[#f2f2f2]">{title}</h3>
          <p className="mb-2 text-sm text-gray-600 line-clamp-2 dark:text-[#999999]">{description}</p>
          <div className="text-xs text-gray-500 dark:text-[#999999]">
            <span className="font-medium dark:text-[#f2f2f2]">Artists: </span>
            {displayArtists}
          </div>
        </div>
      </Link>
    </div>
  )
}


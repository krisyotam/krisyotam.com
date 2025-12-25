import { useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { formatDate } from "@/utils/date-formatter"

interface Playlist {
  id: string
  title: string
  genre: string
  artists: string[]
  description: string
  coverImage: string
  link: string
  dateCreated: string
}

interface PlaylistGridProps {
  playlists: Playlist[]
  searchQuery?: string
  activeGenre?: string
}

export default function PlaylistGrid({ playlists, searchQuery = "", activeGenre = "all" }: PlaylistGridProps) {
  const filteredPlaylists = useMemo(() => {
    return playlists.filter((playlist) => {
      const matchesSearch =
        searchQuery === "" ||
        playlist.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (playlist.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (playlist.artists || []).some((artist) => artist.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesGenre = activeGenre === "all" || playlist.genre === activeGenre

      return matchesSearch && matchesGenre
    })
  }, [playlists, searchQuery, activeGenre])

  return (
    <div>
      {filteredPlaylists.length === 0 ? (
        <div className="mt-8 text-center text-muted-foreground">No playlists found. Try adjusting your search or filter.</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPlaylists.map((playlist) => {
            const formattedDate = playlist.dateCreated ? formatDate(playlist.dateCreated) : ""
            const displayArtists = playlist.artists && playlist.artists.length > 3 ? `${playlist.artists.slice(0, 3).join(", ")} et al.` : (playlist.artists || []).join(", ")

            return (
              <Link key={playlist.id} href={playlist.link} target="_blank" rel="noopener noreferrer" className="block group">
                <div className="player not-prose flex flex-col bg-[#EAEEEA] dark:bg-[#0E0E0E] border dark:border-[#131313] p-1">
                  <div className="flex flex-col bg-white dark:bg-[#18181A] p-3 shadow-2xs transition-colors rounded-sm">
                    <div className="relative aspect-square overflow-hidden mb-3 rounded-sm">
                      <Image
                        src={playlist.coverImage || "/placeholder.svg?height=400&width=400"}
                        alt={playlist.title}
                        width={400}
                        height={400}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="inline-block bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">{playlist.genre}</span>
                        <span className="text-xs text-muted-foreground">{formattedDate}</span>
                      </div>

                      <h3 className="text-base font-medium text-foreground">{playlist.title}</h3>

                      <p className="text-sm text-muted-foreground line-clamp-3">{playlist.description}</p>

                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">Artists: </span>
                        {displayArtists}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 pl-2">
                    <span className="flex items-center gap-2 text-xs leading-normal text-gray-500">
                      <div className="h-2 w-2 bg-[#ababab] dark:bg-[#454545] rounded-full" />
                      Last updated {formattedDate}
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

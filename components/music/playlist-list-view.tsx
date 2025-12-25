"use client"

import Image from "next/image"

// Accept either the individual props (playlistName, creator, ...) or a raw
// JSON object (the shape from data/music/music.json). This keeps backward
// compatibility while allowing the component to be fed the JSON directly.
interface RawPlaylist {
  playlist_name?: string
  creator?: string
  amount_of_songs?: number | string
  songCount?: number
  last_updated?: string
  cover_url?: string
}

interface PlaylistCardProps {
  // legacy props
  playlistName?: string
  creator?: string
  songCount?: number
  lastUpdated?: string
  coverImage?: string
  // new: accept raw JSON entry directly
  raw?: RawPlaylist
}

export function PlaylistCard({ playlistName, creator, songCount, lastUpdated, coverImage, raw }: PlaylistCardProps) {
  // prefer raw JSON values if provided
  const title = playlistName ?? raw?.playlist_name ?? "Untitled"
  const by = creator ?? raw?.creator ?? ""
  const tracks = typeof songCount === "number" ? songCount : (raw?.amount_of_songs ?? raw?.songCount ?? 0)
  const updated = lastUpdated ?? raw?.last_updated ?? ""
  const cover = coverImage ?? raw?.cover_url ?? "/placeholder.svg"

  return (
    <div className="player not-prose flex flex-col bg-[#EAEEEA] dark:bg-[#0E0E0E] border dark:border-[#131313] p-1 my-4">
      <div className="flex flex-row gap-4 p-2 bg-white dark:bg-[#18181A] shadow-2xs">
        <Image
          src={cover}
          height={64}
          width={64}
          alt={title}
          className="w-16 h-16"
        />
        <div className="flex flex-col justify-center">
          <h3 className="text-sm font-medium tracking-tight">{title}</h3>
          <p className="text-xs opacity-70">{by}</p>
          <p className="text-xs opacity-50">
            {tracks} {tracks === 1 ? "song" : "songs"}
          </p>
        </div>
      </div>
      <div>
        <span className="flex items-center gap-2 pt-[6px] pb-[2px] pl-1.5 text-xs leading-normal text-gray-500">
          <div className="h-2 w-2 bg-[#ababab] dark:bg-[#454545] rounded-full" />
          Last updated {updated}
        </span>
      </div>
    </div>
  )
}

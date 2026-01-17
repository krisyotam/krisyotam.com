"use client"

import Image from "next/image"

interface PlaylistCardProps {
  playlistName: string
  creator: string
  songCount: number
  lastUpdated: string
  coverImage: string
}

export function PlaylistCard({ playlistName, creator, songCount, lastUpdated, coverImage }: PlaylistCardProps) {
  return (
    <div className="player not-prose flex flex-col bg-[#EAEEEA] dark:bg-[#0E0E0E] border dark:border-[#131313] p-1 my-4">
      <div className="flex flex-row gap-4 p-2 bg-white dark:bg-[#18181A] shadow-2xs">
        <Image
          src={coverImage || "/placeholder.svg"}
          height={64}
          width={64}
          alt="Playlist Cover"
          className="w-16 h-16"
          unoptimized={coverImage?.includes('krisyotam.com')}
        />
        <div className="flex flex-col justify-center">
          <h3 className="text-sm font-medium tracking-tight">{playlistName}</h3>
          <p className="text-xs opacity-70">{creator}</p>
          <p className="text-xs opacity-50">
            {songCount} {songCount === 1 ? "song" : "songs"}
          </p>
        </div>
      </div>
      <div>
        <span className="flex items-center gap-2 pt-[6px] pb-[2px] pl-1.5 text-xs leading-normal text-gray-500">
          <div className="h-2 w-2 bg-[#ababab] dark:bg-[#454545] rounded-full" />
          Last updated {lastUpdated}
        </span>
      </div>
    </div>
  )
}

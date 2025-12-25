"use client"

import Image from "next/image"
import Link from "next/link"

interface RawSet {
  name?: string
  url?: string
  cover_photo_url?: string
  description?: string
  date_of_create?: string
  note_count?: number
  audio_count?: number
  image_count?: number
}

interface SetListProps {
  // legacy props
  title?: string
  description?: string
  coverImage?: string
  link?: string
  dateCreated?: string
  notes?: number
  audio?: number
  images?: number
  // or raw
  raw?: RawSet
}

export function SetListItem({ title, description, coverImage, link, dateCreated, notes, audio, images, raw }: SetListProps) {
  const t = title ?? raw?.name ?? "Untitled"
  const d = description ?? raw?.description ?? ""
  const cover = coverImage ?? raw?.cover_photo_url ?? "/placeholder.svg"
  const url = link ?? raw?.url ?? ""
  const updated = dateCreated ?? raw?.date_of_create ?? ""
  const noteCount = typeof notes === 'number' ? notes : (raw?.note_count ?? 0)
  const audioCount = typeof audio === 'number' ? audio : (raw?.audio_count ?? 0)
  const imageCount = typeof images === 'number' ? images : (raw?.image_count ?? 0)

  return (
    <Link href={url} target="_blank" rel="noopener noreferrer" className="block group">
      <div className="player not-prose flex flex-col bg-[#EAEEEA] dark:bg-[#0E0E0E] border dark:border-[#131313] p-1 my-4">
        <div className="flex flex-row gap-4 p-2 bg-white dark:bg-[#18181A] shadow-2xs">
          <Image
            src={cover}
            height={64}
            width={64}
            alt={t}
            className="w-16 h-16"
          />
          <div className="flex flex-col justify-center">
            <h3 className="text-sm font-medium tracking-tight">{t}</h3>
            <p className="text-xs opacity-70">{d}</p>
            <p className="text-xs opacity-50">{noteCount} cards • {audioCount} audio • {imageCount} images</p>
          </div>
        </div>
        <div>
          <span className="flex items-center gap-2 pt-[6px] pb-[2px] pl-1.5 text-xs leading-normal text-gray-500">
            <div className="h-2 w-2 bg-[#ababab] dark:bg-[#454545] rounded-full" />
            Last updated {updated}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default SetListItem

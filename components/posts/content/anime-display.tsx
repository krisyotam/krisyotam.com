import { cn } from "@/lib/utils"
import Image from "next/image"

interface AnimeProps {
  coverImage: string
  title: string
  studio: string
  director: string
  year: number
  episodes: number
  genre: string
  className?: string
}

export default function AnimeDisplay({
  coverImage,
  title,
  studio,
  director,
  year,
  episodes,
  genre,
  className,
}: AnimeProps) {
  return (
    <div
      className={cn(
        "w-80 !flex-shrink-0 !p-8 !bg-white dark:!bg-[#1A1A1A] !border !border-gray-200 dark:!border-zinc-800 !shadow-sm",
        "!font-sans !antialiased",
        className,
      )}
    >
      <div className="!space-y-6">
        <div className="!aspect-[2/3] !overflow-hidden !rounded-md !bg-gray-100 dark:!bg-[#1A1A1A] !mx-auto">
          <Image
            src={coverImage || "/placeholder.svg"}
            alt={title}
            width={240}
            height={360}
            className="!object-cover !w-full !h-full"
          />
        </div>

        <div className="!space-y-2 !text-center">
          <h2 className="!text-2xl !font-serif !tracking-tight !text-gray-900 dark:!text-gray-100 !m-0">{title}</h2>
          <div className="!text-sm !text-gray-600 dark:!text-gray-400 !font-light">{studio}</div>
        </div>

        <div className="!pt-4 !border-t !border-gray-200 dark:!border-gray-700 !text-xs !text-gray-500 dark:!text-gray-400 !font-light !space-y-2">
          <div className="!grid !grid-cols-2 !gap-4">
            <div>Director: {director}</div>
            <div className="!text-right">Year: {year}</div>
          </div>
          <div className="!grid !grid-cols-2 !gap-4">
            <div>Episodes: {episodes}</div>
            <div className="!text-right">{genre}</div>
          </div>
        </div>
      </div>
    </div>
  )
}


import { cn } from "@/lib/utils"
import Image from "next/image"

interface MangaProps {
  coverImage: string
  title: string
  author: string
  publisher: string
  yearStarted: number
  yearEnded?: number
  volumes: number
  genre: string
  className?: string
}

export default function MangaDisplay({
  coverImage,
  title,
  author,
  publisher,
  yearStarted,
  yearEnded,
  volumes,
  genre,
  className,
}: MangaProps) {
  return (
    <div
      className={cn(
        "!w-80 !flex-shrink-0 !p-8 !bg-white dark:!bg-[#1A1A1A] !border !border-gray-200 dark:!border-zinc-800 !shadow-sm",
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
          <div className="!text-sm !text-gray-600 dark:!text-gray-400 !font-light">{author}</div>
        </div>

        <div className="!pt-4 !border-t !border-gray-200 dark:!border-gray-700 !text-xs !text-gray-500 dark:!text-gray-400 !font-light !space-y-2">
          <div className="!grid !grid-cols-2 !gap-4">
            <div>Publisher: {publisher}</div>
            <div className="!text-right">
              {yearStarted} - {yearEnded ? yearEnded : "Present"}
            </div>
          </div>
          <div className="!grid !grid-cols-2 !gap-4">
            <div>Volumes: {volumes}</div>
            <div className="!text-right">{genre}</div>
          </div>
        </div>
      </div>
    </div>
  )
}


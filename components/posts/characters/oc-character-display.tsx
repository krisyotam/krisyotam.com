import { cn } from "@/lib/utils"
import Image from "next/image"

interface OcCharacterProps {
  image: string
  characterName: string
  novelTitle: string
  yearMade: number
  author: string
  className?: string
}

export default function OcCharacterDisplay({
  image,
  characterName,
  novelTitle,
  yearMade,
  author,
  className,
}: OcCharacterProps) {
  return (
    <div
      className={cn(
        "max-w-md mx-auto p-8 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 shadow-sm",
        "font-sans antialiased",
        className
      )}
    >
      <div className="space-y-6">
        <div className="aspect-[3/4] overflow-hidden rounded-md bg-gray-100 dark:bg-zinc-800 mx-auto relative">
          <Image
            src={image || "/placeholder.svg"}
            alt={characterName}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            className="object-cover"
            priority
          />
        </div>

        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-serif tracking-tight text-gray-900 dark:text-white">
            {characterName}
          </h2>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-zinc-800 text-xs text-gray-500 dark:text-zinc-500 font-light">
          <div className="grid grid-cols-3 gap-4">
            <div>Novel: {novelTitle}</div>
            <div>Author: {author}</div>
            <div className="text-right">Year: {yearMade}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
import { cn } from "@/lib/utils"
import Image from "next/image"

interface CharacterProps {
  image: string
  characterName: string
  actorName: string
  filmTitle: string
  filmYear: number
  className?: string
}

export default function CharacterDisplay({
  image,
  characterName,
  actorName,
  filmTitle,
  filmYear,
  className,
}: CharacterProps) {
  return (
    <div
      className={cn(
        "max-w-md mx-auto p-8 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 shadow-sm",
        "font-sans antialiased",
        className
      )}
      style={{
        textDecoration: "none",
      }}
    >
      <div className="space-y-6">
        <div className="aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-zinc-800 mx-auto relative">
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
          <h2
            className="text-2xl font-serif tracking-tight text-gray-900 dark:text-white"
            style={{ textDecoration: "none" }}
          >
            {characterName}
          </h2>
          <div className="text-sm text-gray-600 dark:text-zinc-400 font-light">
            Portrayed by {actorName}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-zinc-800 text-xs text-gray-500 dark:text-zinc-500 font-light">
          <div className="grid grid-cols-2 gap-4">
            <div>Film: {filmTitle}</div>
            <div className="text-right">Year: {filmYear}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

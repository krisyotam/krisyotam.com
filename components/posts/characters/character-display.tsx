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
        "max-w-md mx-auto p-8 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 shadow-sm !important",
        "font-sans antialiased !important",
        className,
      )}
      style={{
        /* CSS Reset */
        margin: "0 !important",
        padding: "2rem !important",
        boxSizing: "border-box !important",
        fontFamily: "inherit !important",
        lineHeight: "1.5 !important",
        WebkitFontSmoothing: "antialiased !important",
        MozOsxFontSmoothing: "grayscale !important",
      }}
    >
      <div
        className="space-y-6 !important"
        style={{
          margin: "0 !important",
          padding: "0 !important",
          boxSizing: "border-box !important",
        }}
      >
        <div
          className="aspect-[3/4] overflow-hidden rounded-md bg-gray-100 dark:bg-zinc-800 mx-auto relative !important"
          style={{
            width: "100% !important",
            height: "auto !important",
            position: "relative !important",
            display: "block !important",
            minHeight: "300px !important",
          }}
        >
          <Image
            src={image || "/placeholder.svg"}
            alt={characterName}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            className="object-cover !important"
            style={{
              /* Removed all properties that conflict with 'fill' */
              objectFit: "cover !important",
              objectPosition: "center !important",
              display: "block !important",
            }}
            priority
          />
        </div>

        <div
          className="space-y-2 text-center !important"
          style={{
            margin: "1.5rem 0 0 0 !important",
            padding: "0 !important",
            boxSizing: "border-box !important",
          }}
        >
          <h2
            className="text-2xl font-serif tracking-tight text-gray-900 dark:text-white m-0 !important"
            style={{
              margin: "0 !important",
              padding: "0 !important",
              fontSize: "1.5rem !important",
              fontWeight: "600 !important",
              lineHeight: "1.2 !important",
            }}
          >
            {characterName}
          </h2>
          <div
            className="text-sm text-gray-600 dark:text-zinc-400 font-light !important"
            style={{
              margin: "0.5rem 0 0 0 !important",
              padding: "0 !important",
              fontSize: "0.875rem !important",
              fontWeight: "300 !important",
            }}
          >
            Portrayed by {actorName}
          </div>
        </div>

        <div
          className="pt-4 border-t border-gray-200 dark:border-zinc-800 text-xs text-gray-500 dark:text-zinc-500 font-light !important"
          style={{
            marginTop: "1.5rem !important",
            paddingTop: "1rem !important",
            borderTopWidth: "1px !important",
            fontSize: "0.75rem !important",
            fontWeight: "300 !important",
          }}
        >
          <div
            className="grid grid-cols-2 gap-4 !important"
            style={{
              display: "grid !important",
              gridTemplateColumns: "1fr 1fr !important",
              gap: "1rem !important",
            }}
          >
            <div className="!important" style={{ margin: "0 !important", padding: "0 !important" }}>
              Film: {filmTitle}
            </div>
            <div
              className="text-right !important"
              style={{ margin: "0 !important", padding: "0 !important", textAlign: "right !important" }}
            >
              Year: {filmYear}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


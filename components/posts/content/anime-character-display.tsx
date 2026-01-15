import { cn } from "@/lib/utils"
import Image from "next/image"

interface AnimeCharacterProps {
  image: string
  characterName: string
  voiceActor: string
  animeName: string
  animeYear: number
  className?: string
}

export default function AnimeCharacterDisplay({
  image,
  characterName,
  voiceActor,
  animeName,
  animeYear,
  className,
}: AnimeCharacterProps) {
  return (
    <div
      className={cn(
        "max-w-md mx-auto p-8 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 shadow-sm",
        "font-sans antialiased",
        className,
      )}
      style={{
        /* CSS Reset */
        margin: "0",
        padding: "2rem",
        boxSizing: "border-box",
        fontFamily: "inherit",
        lineHeight: "1.5",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }}
    >
      <div
        className="space-y-6"
        style={{
          margin: "0",
          padding: "0",
          boxSizing: "border-box",
        }}
      >
        <div
          className="aspect-[3/4] overflow-hidden rounded-md bg-gray-100 dark:bg-[#1A1A1A] mx-auto relative"
          style={{
            width: "100%",
            height: "auto",
            position: "relative",
            display: "block",
            minHeight: "300px",
          }}
        >
          <Image
            src={image || "/placeholder.svg"}
            alt={characterName}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            className="object-cover"
            style={{
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
            }}
            priority
            unoptimized={image?.includes('krisyotam.com')}
          />
        </div>

        <div
          className="space-y-2 text-center"
          style={{
            margin: "1.5rem 0 0 0",
            padding: "0",
            boxSizing: "border-box",
          }}
        >
          <h2
            className="text-2xl font-serif tracking-tight text-gray-900 dark:text-white m-0"
            style={{
              margin: "0",
              padding: "0",
              fontSize: "1.5rem",
              fontWeight: "600",
              lineHeight: "1.2",
            }}
          >
            {characterName}
          </h2>
          {voiceActor && (
          <div
            className="text-sm text-gray-600 dark:text-zinc-400 font-light"
            style={{
              margin: "0.5rem 0 0 0",
              padding: "0",
              fontSize: "0.875rem",
              fontWeight: "300",
            }}
          >
            Voiced by {voiceActor}
          </div>
          )}
        </div>

        <div
          className="pt-4 border-t border-gray-200 dark:border-zinc-800 text-xs text-gray-500 dark:text-zinc-500 font-light"
          style={{
            marginTop: "1.5rem",
            paddingTop: "1rem",
            borderTopWidth: "1px",
            fontSize: "0.75rem",
            fontWeight: "300",
          }}
        >
          <div
            className="grid grid-cols-2 gap-4"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div style={{ margin: "0", padding: "0" }}>
              Anime: {animeName}
            </div>
            <div
              className="text-right"
              style={{ margin: "0", padding: "0", textAlign: "right" }}
            >
              Year: {animeYear}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


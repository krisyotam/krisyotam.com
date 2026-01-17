"use client"

import { useEffect, useRef } from "react"

interface YouTubeEmbedProps {
  videoId: string
  title?: string
  width?: number | string
  height?: number | string
  autoplay?: boolean
  startAt?: number
}

export function YouTubeEmbed({
  videoId,
  title = "YouTube video player",
  width = "100%",
  height = "auto",
  autoplay = false,
  startAt = 0,
}: YouTubeEmbedProps) {
  const aspectRatioRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Set aspect ratio for responsive sizing
    if (aspectRatioRef.current) {
      aspectRatioRef.current.style.paddingTop = "56.25%" // 16:9 aspect ratio
    }
  }, [])

  const params = new URLSearchParams({
    autoplay: autoplay ? "1" : "0",
    start: startAt.toString(),
  })

  return (
    <div className="w-full">
      <div className="relative w-full" ref={aspectRatioRef} style={{ paddingTop: "56.25%" }}>
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          width={width}
          height={height}
          src={`https://www.youtube.com/embed/${videoId}?${params.toString()}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  )
}


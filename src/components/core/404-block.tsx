/*
+------------------+----------------------------------------------------------+
| FILE             | 404-block.tsx                                            |
| ROLE             | 404 page gacha-style character block                     |
| OWNER            | Kris Yotam                                               |
| CREATED          | 2026-02-13                                               |
| UPDATED          | 2026-02-13                                               |
+------------------+----------------------------------------------------------+
| @type component                                                             |
| @path src/components/core/404-block.tsx                                     |
| @data media                                                                 |
+------------------+----------------------------------------------------------+
| SUMMARY                                                                     |
| Fetches a random 404 block entry from the API (weighted by rarity tier),    |
| renders the character image with status banner, optional audio player,      |
| quote, live clock, and pull probability with math breakdown tooltip.        |
| Supports dark mode image inversion and auto-detects PNG transparency.       |
+-----------------------------------------------------------------------------+
*/

"use client"

import Image from "next/image"
import { useState, useEffect, useRef, useCallback } from "react"
import { useTheme } from "next-themes"

// =============================================================================
// Types
// =============================================================================

export type Status = "common" | "uncommon" | "rare" | "legendary" | "mythic"

export interface StatusConfig {
  label: string
  barColor: string
  bgTint: string
  labelColor: string
  borderTint: string
}

export interface Block404Data {
  id: number
  img: string
  msg: string
  status: Status
  invert: "y" | "n"
  audio: string | null
  video: string | null
}

export interface PullData {
  tierRate: number
  itemsInTier: number
  chance: number
}

interface ApiResponse {
  block: Block404Data
  pull: PullData
  counts: Record<string, number>
}

// =============================================================================
// Status Color Configs
// =============================================================================

export const STATUS_CONFIG: Record<Status, StatusConfig> = {
  common: {
    label: "Common",
    barColor: "hsl(0, 0%, 65%)",
    bgTint: "transparent",
    labelColor: "hsl(0, 0%, 50%)",
    borderTint: "hsl(0, 0%, 88%)",
  },
  uncommon: {
    label: "Uncommon",
    barColor: "hsl(142, 40%, 45%)",
    bgTint: "hsla(142, 40%, 50%, 0.03)",
    labelColor: "hsl(142, 35%, 40%)",
    borderTint: "hsla(142, 30%, 50%, 0.12)",
  },
  rare: {
    label: "Rare",
    barColor: "hsl(217, 50%, 50%)",
    bgTint: "hsla(217, 50%, 55%, 0.03)",
    labelColor: "hsl(217, 45%, 45%)",
    borderTint: "hsla(217, 40%, 55%, 0.12)",
  },
  legendary: {
    label: "Legendary",
    barColor: "hsl(40, 65%, 50%)",
    bgTint: "hsla(40, 60%, 55%, 0.04)",
    labelColor: "hsl(40, 55%, 42%)",
    borderTint: "hsla(40, 50%, 55%, 0.15)",
  },
  mythic: {
    label: "Mythic",
    barColor: "linear-gradient(90deg, hsl(0,70%,60%), hsl(40,70%,55%), hsl(120,50%,45%), hsl(210,60%,55%), hsl(270,55%,55%), hsl(330,60%,55%))",
    bgTint: "hsla(270, 30%, 60%, 0.025)",
    labelColor: "mythic-rainbow",
    borderTint: "hsla(270, 25%, 55%, 0.10)",
  },
}

export const STATUS_CONFIG_DARK: Record<Status, StatusConfig> = {
  common: {
    label: "Common",
    barColor: "hsl(0, 0%, 40%)",
    bgTint: "transparent",
    labelColor: "hsl(0, 0%, 55%)",
    borderTint: "hsl(0, 0%, 15%)",
  },
  uncommon: {
    label: "Uncommon",
    barColor: "hsl(142, 35%, 40%)",
    bgTint: "hsla(142, 35%, 40%, 0.04)",
    labelColor: "hsl(142, 30%, 55%)",
    borderTint: "hsla(142, 30%, 40%, 0.15)",
  },
  rare: {
    label: "Rare",
    barColor: "hsl(217, 45%, 50%)",
    bgTint: "hsla(217, 45%, 50%, 0.04)",
    labelColor: "hsl(217, 40%, 60%)",
    borderTint: "hsla(217, 35%, 50%, 0.15)",
  },
  legendary: {
    label: "Legendary",
    barColor: "hsl(40, 55%, 50%)",
    bgTint: "hsla(40, 55%, 50%, 0.05)",
    labelColor: "hsl(40, 50%, 60%)",
    borderTint: "hsla(40, 45%, 50%, 0.18)",
  },
  mythic: {
    label: "Mythic",
    barColor: "linear-gradient(90deg, hsl(0,65%,55%), hsl(40,65%,50%), hsl(120,45%,40%), hsl(210,55%,50%), hsl(270,50%,50%), hsl(330,55%,50%))",
    bgTint: "hsla(270, 25%, 50%, 0.03)",
    labelColor: "mythic-rainbow",
    borderTint: "hsla(270, 20%, 50%, 0.12)",
  },
}

// =============================================================================
// Helpers
// =============================================================================

const MYTHIC_GRADIENT =
  "linear-gradient(90deg, hsl(0,70%,60%), hsl(40,70%,55%), hsl(120,50%,45%), hsl(210,60%,55%), hsl(270,55%,55%), hsl(330,60%,55%))"
const MYTHIC_GRADIENT_DARK =
  "linear-gradient(90deg, hsl(0,65%,55%), hsl(40,65%,50%), hsl(120,45%,40%), hsl(210,55%,50%), hsl(270,50%,50%), hsl(330,55%,50%))"

export function barStyle(config: StatusConfig): React.CSSProperties {
  if (config.barColor.startsWith("linear-gradient")) {
    return { background: config.barColor }
  }
  return { backgroundColor: config.barColor }
}

export function labelStyle(config: StatusConfig, isDark: boolean): React.CSSProperties {
  if (config.labelColor === "mythic-rainbow") {
    return {
      backgroundImage: isDark ? MYTHIC_GRADIENT_DARK : MYTHIC_GRADIENT,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      display: "inline-block",
    }
  }
  return { color: config.labelColor }
}

function isTransparentImg(src: string): boolean {
  return src.toLowerCase().endsWith(".png")
}

function isVideo(src: string): boolean {
  const ext = src.toLowerCase().split("?")[0]
  return ext.endsWith(".mp4") || ext.endsWith(".webm") || ext.endsWith(".ogg") || ext.endsWith(".mov")
}

function fmtTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

function useIsDark() {
  const { resolvedTheme } = useTheme()
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    setIsDark(resolvedTheme === "dark")
  }, [resolvedTheme])
  return isDark
}

// =============================================================================
// Clock
// =============================================================================

function Clock() {
  const [time, setTime] = useState("")

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      )
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <span className="text-[11px] font-mono tabular-nums text-muted-foreground">
      {time}
    </span>
  )
}

// =============================================================================
// Audio Player
// =============================================================================

export function AudioPlayer({
  src,
  config,
  isDark,
  autoplay = false,
  mediaRef,
}: {
  src?: string
  config: StatusConfig
  isDark: boolean
  autoplay?: boolean
  mediaRef?: React.RefObject<HTMLVideoElement | null>
}) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [seeking, setSeeking] = useState(false)
  const hasTriedAutoplay = useRef(false)

  // Use the video ref if provided, otherwise fall back to audio ref
  const getMedia = useCallback((): HTMLMediaElement | null => {
    return mediaRef?.current ?? audioRef.current
  }, [mediaRef])

  useEffect(() => {
    const media = getMedia()
    if (!media || !autoplay) return
    hasTriedAutoplay.current = false

    const tryPlay = () => {
      if (hasTriedAutoplay.current) return
      hasTriedAutoplay.current = true
      media.play().then(() => setPlaying(true)).catch(() => {})
    }

    tryPlay()
    media.addEventListener("canplaythrough", tryPlay)
    return () => media.removeEventListener("canplaythrough", tryPlay)
  }, [src, autoplay, getMedia])

  useEffect(() => {
    const media = getMedia()
    if (!media) return

    // Read current state immediately (in case events already fired)
    if (media.duration && !isNaN(media.duration)) setDuration(media.duration)
    if (media.currentTime) setCurrentTime(media.currentTime)
    if (!media.paused) setPlaying(true)

    const onTime = () => {
      if (!seeking) setCurrentTime(media.currentTime)
    }
    const onDuration = () => {
      if (media.duration && !isNaN(media.duration)) setDuration(media.duration)
    }
    const onEnded = () => setPlaying(false)
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)

    media.addEventListener("timeupdate", onTime)
    media.addEventListener("loadedmetadata", onDuration)
    media.addEventListener("durationchange", onDuration)
    media.addEventListener("ended", onEnded)
    media.addEventListener("play", onPlay)
    media.addEventListener("pause", onPause)

    return () => {
      media.removeEventListener("timeupdate", onTime)
      media.removeEventListener("loadedmetadata", onDuration)
      media.removeEventListener("durationchange", onDuration)
      media.removeEventListener("ended", onEnded)
      media.removeEventListener("play", onPlay)
      media.removeEventListener("pause", onPause)
    }
  }, [seeking, getMedia])

  const toggle = useCallback(() => {
    const media = getMedia()
    if (!media) return
    if (playing) {
      media.pause()
    } else {
      media.play()
    }
    setPlaying(!playing)
  }, [playing, getMedia])

  const onScrub = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    setCurrentTime(val)
    const media = getMedia()
    if (media) {
      media.currentTime = val
    }
  }, [getMedia])

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  const trackBg = (() => {
    const fillColor = config.barColor.startsWith("linear-gradient")
      ? "hsl(270, 45%, 55%)"
      : config.barColor
    const emptyColor = isDark ? "hsl(0,0%,20%)" : "hsl(0,0%,85%)"
    return `linear-gradient(to right, ${fillColor} ${progress}%, ${emptyColor} ${progress}%)`
  })()

  const thumbColor = config.barColor.startsWith("linear-gradient")
    ? "hsl(270, 45%, 55%)"
    : config.barColor

  return (
    <div className="w-full flex items-center gap-2">
      {/* Only render an <audio> element if we have a src and no video ref */}
      {src && !mediaRef && (
        <audio ref={audioRef} src={src} preload={autoplay ? "auto" : "metadata"} />
      )}

      {/* Scoped thumb styles */}
      <style>{`
        .media-scrubber::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: ${thumbColor};
          cursor: pointer;
          border: none;
          margin-top: -3.5px;
        }
        .media-scrubber::-moz-range-thumb {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: ${thumbColor};
          cursor: pointer;
          border: none;
        }
        .media-scrubber::-webkit-slider-runnable-track {
          height: 3px;
          cursor: pointer;
        }
        .media-scrubber::-moz-range-track {
          height: 3px;
          cursor: pointer;
          background: transparent;
        }
      `}</style>

      <button
        onClick={toggle}
        className="shrink-0 flex items-center justify-center w-5 h-5 text-muted-foreground hover:text-foreground transition-colors"
        aria-label={playing ? "Pause" : "Play"}
      >
        {playing ? (
          <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
            <rect x="0" y="0" width="3" height="12" />
            <rect x="7" y="0" width="3" height="12" />
          </svg>
        ) : (
          <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
            <polygon points="0,0 10,6 0,12" />
          </svg>
        )}
      </button>

      <span className="text-[10px] font-mono tabular-nums text-muted-foreground shrink-0 w-7 text-right">
        {fmtTime(currentTime)}
      </span>

      <input
        type="range"
        min={0}
        max={duration || 0}
        step={0.1}
        value={currentTime}
        onChange={onScrub}
        onMouseDown={() => setSeeking(true)}
        onMouseUp={() => setSeeking(false)}
        className="media-scrubber flex-1 h-[3px] appearance-none cursor-pointer"
        style={{ background: trackBg, borderRadius: 0 }}
      />

      <span className="text-[10px] font-mono tabular-nums text-muted-foreground shrink-0 w-7">
        {fmtTime(duration)}
      </span>
    </div>
  )
}

// =============================================================================
// Math Breakdown Tooltip
// =============================================================================

function MathBreakdown({
  pull,
  config,
  isDark,
}: {
  pull: PullData
  config: StatusConfig
  isDark: boolean
}) {
  const [open, setOpen] = useState(false)

  return (
    <span className="relative inline-flex items-center">
      <button
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen(!open)}
        className="inline-flex items-center justify-center w-[14px] h-[14px] rounded-full border border-border text-[9px] leading-none cursor-help text-muted-foreground"
        aria-label="Pull probability breakdown"
      >
        ?
      </button>

      {open && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-[240px] border border-border bg-popover text-popover-foreground p-3 text-[11px] leading-relaxed z-50">
          <div className="font-medium mb-1.5" style={labelStyle(config, isDark)}>
            {config.label} Pull Breakdown
          </div>
          <div className="space-y-1 font-mono">
            <div className="flex justify-between">
              <span>Tier rate</span>
              <span>{(pull.tierRate * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Items in tier</span>
              <span>{pull.itemsInTier}</span>
            </div>
            <div className="flex justify-between pt-1 mt-1 border-t border-border">
              <span>This pull</span>
              <span style={labelStyle(config, isDark)}>
                {(pull.chance * 100).toFixed(2)}%
              </span>
            </div>
          </div>
          <div className="mt-2 text-[10px] leading-snug text-muted-foreground">
            {(pull.tierRate * 100).toFixed(0)}% ÷ {pull.itemsInTier} = {(pull.chance * 100).toFixed(2)}%
          </div>
        </div>
      )}
    </span>
  )
}

// =============================================================================
// Main Export: Block404
// =============================================================================

export default function Block404() {
  const isDark = useIsDark()
  const [data, setData] = useState<ApiResponse | null>(null)
  const [error, setError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    fetch("/api/media?source=404")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch")
        return res.json()
      })
      .then((json: ApiResponse) => setData(json))
      .catch(() => setError(true))
  }, [])

  // Fallback while loading or on error — render the static Lain block
  if (!data) {
    return (
      <div className="border border-border p-6 flex flex-col items-center">
        <Image
          src="/images/404.png"
          alt="404 - Nothing of value was found"
          width={1200}
          height={1200}
          className="w-full max-h-[400px] object-contain mb-4"
          priority
        />
        <p className="text-sm text-muted-foreground text-center">
          {error ? "Failed to load 404 block" : "Loading..."}
        </p>
      </div>
    )
  }

  const { block, pull } = data
  const config = isDark ? STATUS_CONFIG_DARK[block.status] : STATUS_CONFIG[block.status]
  const invertImage = isDark && block.invert === "y"
  const transparent = isTransparentImg(block.img)
  const hasVideo = !!block.video
  const hasAudio = !!block.audio
  // Show the media bar if there's audio OR video
  const showMediaBar = hasAudio || hasVideo

  return (
    <div
      className="border-t border-l border-r flex flex-col"
      style={{
        backgroundColor: config.bgTint,
        borderColor: config.borderTint,
      }}
    >
      {/* Main content area */}
      <div className="pt-4 px-4 flex flex-col items-center">
        {/* Status banner */}
        <div className="mb-3 flex items-center gap-2 w-full">
          <div className="h-[1px] flex-1" style={barStyle(config)} />
          <span
            className="text-[10px] tracking-[0.2em] uppercase font-medium shrink-0"
            style={labelStyle(config, isDark)}
          >
            {config.label}
          </span>
          <div className="h-[1px] flex-1" style={barStyle(config)} />
        </div>

        {/* Character image OR video */}
        <div
          className={`w-full flex items-center justify-center ${
            hasVideo ? "" : transparent ? "" : "border border-border"
          }`}
        >
          {hasVideo ? (
            <video
              ref={videoRef}
              src={block.video!}
              autoPlay
              loop
              playsInline
              preload="auto"
              className="w-full max-h-[400px] object-contain"
              style={{
                filter: invertImage ? "invert(1) hue-rotate(180deg)" : undefined,
              }}
            />
          ) : (
            <Image
              src={block.img}
              alt="404 character"
              width={1200}
              height={1200}
              className="w-full max-h-[400px] object-contain"
              style={{
                filter: invertImage ? "invert(1) hue-rotate(180deg)" : undefined,
              }}
              priority
              unoptimized
            />
          )}
        </div>
      </div>

      {/* Media player bar — controls audio, or video playback */}
      {showMediaBar && (
        <div
          className="border-t px-4 py-2"
          style={{ borderColor: config.borderTint }}
        >
          {hasVideo ? (
            <AudioPlayer
              config={config}
              isDark={isDark}
              autoplay
              mediaRef={videoRef}
            />
          ) : (
            <AudioPlayer
              src={block.audio!}
              config={config}
              isDark={isDark}
              autoplay
            />
          )}
        </div>
      )}

      {/* Bottom bar — quote, clock, pull chance */}
      <div
        className="border-t px-4 py-2.5 flex flex-col gap-1.5"
        style={{
          borderColor: config.borderTint,
          backgroundColor: isDark ? "hsla(0,0%,0%,0.15)" : "hsla(0,0%,0%,0.015)",
        }}
      >
        <p className="text-[11px] italic font-serif text-center text-muted-foreground">
          &ldquo;{block.msg}&rdquo;
        </p>

        <div className="flex items-center justify-between">
          <Clock />
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span>
              Pull chance:{" "}
              <span style={labelStyle(config, isDark)}>
                {(pull.chance * 100).toFixed(2)}%
              </span>
            </span>
            <MathBreakdown pull={pull} config={config} isDark={isDark} />
          </div>
        </div>
      </div>

      {/* Tier color bar */}
      <div className="w-full h-[2px]" style={barStyle(config)} />
    </div>
  )
}

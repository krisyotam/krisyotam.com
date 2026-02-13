"use client"

/**
 * Test page for 404-block status tint colors + audio player.
 * Uses the exact same bento dimensions as the real 404 page.
 *
 * Visit: /test-404-tint
 */

import Image from "next/image"
import { useState, useEffect, useRef, useCallback } from "react"
import { useTheme } from "next-themes"

// =============================================================================
// Types
// =============================================================================

type Status = "common" | "uncommon" | "rare" | "legendary" | "mythic"

interface StatusConfig {
  label: string
  barColor: string
  bgTint: string
  labelColor: string
  borderTint: string
}

/** Simulates a row from the future DB table */
interface Block404Entry {
  img: string
  msg: string
  status: Status
  invert: "y" | "n"
  audio: string | null
}

/** Auto-detect if image is transparent (PNG) from extension */
function isTransparentImg(src: string): boolean {
  return src.toLowerCase().endsWith(".png")
}

// =============================================================================
// Status Color Configs
// =============================================================================

const STATUS_CONFIG: Record<Status, StatusConfig> = {
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

const STATUS_CONFIG_DARK: Record<Status, StatusConfig> = {
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
// Static test data
// =============================================================================

const LA_CAMPANELLA_URL =
  "https://gateway.pinata.cloud/ipfs/bafybeiczt2j4vlu2adk4l7rcbzaxl62zm3orm44rabavzqkjtwgjijmuzm"

const TEST_ENTRIES: Block404Entry[] = [
  {
    img: "/images/404.png",
    msg: "No matter where you go, everyone\u2019s connected.",
    status: "common",
    invert: "y",
    audio: null,
  },
  {
    img: "/images/404.png",
    msg: "Present Day, Present Time... ahahaha",
    status: "uncommon",
    invert: "y",
    audio: null,
  },
  {
    img: "/images/404.png",
    msg: "If you\u2019re not remembered, then you never existed.",
    status: "rare",
    invert: "n",
    audio: LA_CAMPANELLA_URL,
  },
  {
    img: "/images/404.png",
    msg: "Close the world. Open the nExt.",
    status: "legendary",
    invert: "y",
    audio: LA_CAMPANELLA_URL,
  },
  {
    img: "/images/404.png",
    msg: "I am connected to all living things through the Wired.",
    status: "mythic",
    invert: "y",
    audio: LA_CAMPANELLA_URL,
  },
]

// =============================================================================
// Probability helpers
// =============================================================================

const TIER_RATES: Record<Status, number> = {
  common: 0.50,
  uncommon: 0.25,
  rare: 0.15,
  legendary: 0.08,
  mythic: 0.02,
}

const TIER_ITEM_COUNTS: Record<Status, number> = {
  common: 24,
  uncommon: 12,
  rare: 8,
  legendary: 4,
  mythic: 2,
}

function getPullChance(status: Status) {
  const tierRate = TIER_RATES[status]
  const itemsInTier = TIER_ITEM_COUNTS[status]
  const individualChance = tierRate / itemsInTier
  return { tierRate, itemsInTier, individualChance }
}

// =============================================================================
// Theme hook
// =============================================================================

function useIsDark() {
  const { resolvedTheme } = useTheme()
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    setIsDark(resolvedTheme === "dark")
  }, [resolvedTheme])
  return isDark
}

// =============================================================================
// Mythic rainbow helpers
// =============================================================================

const MYTHIC_GRADIENT =
  "linear-gradient(90deg, hsl(0,70%,60%), hsl(40,70%,55%), hsl(120,50%,45%), hsl(210,60%,55%), hsl(270,55%,55%), hsl(330,60%,55%))"
const MYTHIC_GRADIENT_DARK =
  "linear-gradient(90deg, hsl(0,65%,55%), hsl(40,65%,50%), hsl(120,45%,40%), hsl(210,55%,50%), hsl(270,50%,50%), hsl(330,55%,50%))"

function isMythicRainbow(color: string) {
  return color === "mythic-rainbow"
}

function barStyle(config: StatusConfig): React.CSSProperties {
  if (config.barColor.startsWith("linear-gradient")) {
    return { background: config.barColor }
  }
  return { backgroundColor: config.barColor }
}

function labelStyle(config: StatusConfig, isDark: boolean): React.CSSProperties {
  if (isMythicRainbow(config.labelColor)) {
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

const STATUSES: Status[] = ["common", "uncommon", "rare", "legendary", "mythic"]

// =============================================================================
// Format time helper
// =============================================================================

function fmtTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

// =============================================================================
// Live Clock
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

function AudioPlayer({
  src,
  config,
  isDark,
}: {
  src: string
  config: StatusConfig
  isDark: boolean
}) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [seeking, setSeeking] = useState(false)

  // Autoplay on mount
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.play().then(() => setPlaying(true)).catch(() => {})
  }, [src])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTime = () => {
      if (!seeking) setCurrentTime(audio.currentTime)
    }
    const onDuration = () => setDuration(audio.duration || 0)
    const onEnded = () => setPlaying(false)

    audio.addEventListener("timeupdate", onTime)
    audio.addEventListener("loadedmetadata", onDuration)
    audio.addEventListener("durationchange", onDuration)
    audio.addEventListener("ended", onEnded)

    return () => {
      audio.removeEventListener("timeupdate", onTime)
      audio.removeEventListener("loadedmetadata", onDuration)
      audio.removeEventListener("durationchange", onDuration)
      audio.removeEventListener("ended", onEnded)
    }
  }, [seeking])

  const toggle = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
    } else {
      audio.play()
    }
    setPlaying(!playing)
  }, [playing])

  const onScrub = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    setCurrentTime(val)
    if (audioRef.current) {
      audioRef.current.currentTime = val
    }
  }, [])

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  /** Build the track gradient so the filled portion uses the tier color */
  const trackBg = (() => {
    const fillColor = config.barColor.startsWith("linear-gradient")
      ? "hsl(270, 45%, 55%)"
      : config.barColor
    const emptyColor = isDark ? "hsl(0,0%,20%)" : "hsl(0,0%,85%)"
    return `linear-gradient(to right, ${fillColor} ${progress}%, ${emptyColor} ${progress}%)`
  })()

  return (
    <div className="w-full flex items-center gap-2">
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Play/Pause */}
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

      {/* Time current */}
      <span className="text-[10px] font-mono tabular-nums text-muted-foreground shrink-0 w-7 text-right">
        {fmtTime(currentTime)}
      </span>

      {/* Scrub bar */}
      <input
        type="range"
        min={0}
        max={duration || 0}
        step={0.1}
        value={currentTime}
        onChange={onScrub}
        onMouseDown={() => setSeeking(true)}
        onMouseUp={() => setSeeking(false)}
        className="flex-1 h-[3px] appearance-none cursor-pointer"
        style={{
          background: trackBg,
          borderRadius: 0,
        }}
      />

      {/* Time total */}
      <span className="text-[10px] font-mono tabular-nums text-muted-foreground shrink-0 w-7">
        {fmtTime(duration)}
      </span>
    </div>
  )
}

// =============================================================================
// Math Breakdown Tooltip
// =============================================================================

function MathBreakdown({ status }: { status: Status }) {
  const isDark = useIsDark()
  const [open, setOpen] = useState(false)
  const { tierRate, itemsInTier, individualChance } = getPullChance(status)
  const config = isDark ? STATUS_CONFIG_DARK[status] : STATUS_CONFIG[status]

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
              <span>{(tierRate * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Items in tier</span>
              <span>{itemsInTier}</span>
            </div>
            <div className="flex justify-between pt-1 mt-1 border-t border-border">
              <span>This pull</span>
              <span style={labelStyle(config, isDark)}>
                {(individualChance * 100).toFixed(2)}%
              </span>
            </div>
          </div>
          <div className="mt-2 text-[10px] leading-snug text-muted-foreground">
            {(tierRate * 100).toFixed(0)}% ÷ {itemsInTier} = {(individualChance * 100).toFixed(2)}%
          </div>
        </div>
      )}
    </span>
  )
}

// =============================================================================
// 404 Bento Block
// =============================================================================

function BentoBlock404({ entry }: { entry: Block404Entry }) {
  const isDark = useIsDark()
  const config = isDark ? STATUS_CONFIG_DARK[entry.status] : STATUS_CONFIG[entry.status]
  const { individualChance } = getPullChance(entry.status)

  /** Should the image be inverted in dark mode? */
  const invertImage = isDark && entry.invert === "y"

  return (
    <div
      className="border flex flex-col"
      style={{
        backgroundColor: config.bgTint,
        borderColor: config.borderTint,
      }}
    >
      {/* Main content area */}
      <div className="p-6 flex flex-col items-center">
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

        {/* Character image */}
        <div
          className={`mb-4 flex items-center justify-center ${
            isTransparentImg(entry.img) ? "" : "border border-border"
          }`}
        >
          <Image
            src={entry.img}
            alt="404 character"
            width={400}
            height={400}
            className={isTransparentImg(entry.img) ? "" : "object-cover"}
            style={{
              filter: invertImage ? "invert(1) hue-rotate(180deg)" : undefined,
            }}
            priority
            unoptimized={entry.img.startsWith("http")}
          />
        </div>
      </div>

      {/* Audio player (if audio exists) */}
      {entry.audio && (
        <div
          className="border-t px-4 py-2"
          style={{ borderColor: config.borderTint }}
        >
          <AudioPlayer src={entry.audio} config={config} isDark={isDark} />
        </div>
      )}

      {/* Bottom bar — quote, time, probability */}
      <div
        className="border-t px-4 py-2.5 flex flex-col gap-1.5"
        style={{
          borderColor: config.borderTint,
          backgroundColor: isDark ? "hsla(0,0%,0%,0.15)" : "hsla(0,0%,0%,0.015)",
        }}
      >
        {/* Quote */}
        <p className="text-[11px] italic font-serif text-center text-muted-foreground">
          &ldquo;{entry.msg}&rdquo;
        </p>

        {/* Time + probability row */}
        <div className="flex items-center justify-between">
          <Clock />
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span>
              Pull chance:{" "}
              <span style={labelStyle(config, isDark)}>
                {(individualChance * 100).toFixed(2)}%
              </span>
            </span>
            <MathBreakdown status={entry.status} />
          </div>
        </div>
      </div>

      {/* Tier color bar at very bottom */}
      <div className="w-full h-[2px]" style={barStyle(config)} />
    </div>
  )
}

// =============================================================================
// Main Test Page
// =============================================================================

export default function Test404Tint() {
  const isDark = useIsDark()
  const [activeIdx, setActiveIdx] = useState(0)
  const activeEntry = TEST_ENTRIES[activeIdx]

  return (
    <div className="min-h-screen bg-background text-foreground pt-16">
      <div className="max-w-[672px] mx-auto px-4">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-lg font-medium">404-Block Tint Test</h1>
          <p className="text-sm text-muted-foreground">
            Audio player, invert flag, status tiers
          </p>
        </div>

        {/* Status tier selector */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {TEST_ENTRIES.map((entry, i) => {
            const config = isDark
              ? STATUS_CONFIG_DARK[entry.status]
              : STATUS_CONFIG[entry.status]
            const isActive = activeIdx === i
            return (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className="text-xs px-3 py-1 border transition-colors"
                style={{
                  borderColor:
                    isActive && !config.barColor.startsWith("linear")
                      ? config.barColor
                      : undefined,
                  borderImage:
                    isActive && config.barColor.startsWith("linear")
                      ? `${config.barColor} 1`
                      : undefined,
                  ...(isActive ? labelStyle(config, isDark) : {}),
                }}
              >
                {entry.status}
                {entry.audio ? " \u266B" : ""}
              </button>
            )
          })}
        </div>

        {/* Active bento */}
        <div className="mb-8">
          <BentoBlock404 entry={activeEntry} />
        </div>

        {/* Entry info */}
        <div className="mb-8 border border-border p-4 text-[12px] text-muted-foreground space-y-1">
          <p>
            <span className="font-medium text-foreground">invert:</span>{" "}
            {activeEntry.invert === "y" ? "yes" : "no"} — image{" "}
            {activeEntry.invert === "y"
              ? "inverts in dark mode (for transparent PNGs with dark lines)"
              : "stays as-is in dark mode (for framed/colored images)"}
          </p>
          <p>
            <span className="font-medium text-foreground">format:</span>{" "}
            {isTransparentImg(activeEntry.img) ? ".png (transparent, no frame)" : "non-png (auto-framed with border)"}
          </p>
          <p>
            <span className="font-medium text-foreground">audio:</span>{" "}
            {activeEntry.audio ? "La Campanella — autoplay (Pinata/IPFS)" : "none"}
          </p>
        </div>

        {/* All 5 stacked */}
        <div className="space-y-6 mb-16">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            All tiers stacked
          </p>
          {TEST_ENTRIES.map((entry, i) => (
            <BentoBlock404 key={i} entry={entry} />
          ))}
        </div>

      </div>
    </div>
  )
}

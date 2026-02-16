/*
+------------------+----------------------------------------------------------+
| FILE             | CardsClientPage.tsx                                      |
| ROLE             | Client page for 404 card collection index                |
| OWNER                                                          |
| CREATED          | 2026-02-13                                               |
| UPDATED          | 2026-02-13                                               |
+------------------+----------------------------------------------------------+
| @type component                                                             |
| @path src/app/(media)/cards/CardsClientPage.tsx                             |
+------------------+----------------------------------------------------------+
| SUMMARY                                                                     |
| Displays all 404 gacha cards with search, tier filter, and inline audio     |
| players (no autoplay). Supports both image and video cards. Each card       |
| shows status banner, image/video, quote, and pull probability.              |
+-----------------------------------------------------------------------------+
*/

"use client"

import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { Search } from "lucide-react"
import { CustomSelect, SelectOption } from "@/components/ui/custom-select"
import {
  type Status,
  type Block404Data,
  type StatusConfig,
  STATUS_CONFIG,
  STATUS_CONFIG_DARK,
  barStyle,
  labelStyle,
  AudioPlayer,
} from "@/components/core/404-block"

// =============================================================================
// Props
// =============================================================================

interface CardsClientPageProps {
  cards: Block404Data[]
  counts: Record<string, number>
  tierRates: Record<string, number>
}

// =============================================================================
// Helpers
// =============================================================================

function useIsDark() {
  const { resolvedTheme } = useTheme()
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    setIsDark(resolvedTheme === "dark")
  }, [resolvedTheme])
  return isDark
}

function isTransparentImg(src: string): boolean {
  return src.toLowerCase().endsWith(".png")
}

function isVideo(src: string): boolean {
  const ext = src.toLowerCase().split("?")[0]
  return ext.endsWith(".mp4") || ext.endsWith(".webm") || ext.endsWith(".ogg") || ext.endsWith(".mov")
}

const ALL_STATUSES: Status[] = ["common", "uncommon", "rare", "legendary", "mythic"]

// =============================================================================
// Card Component (no autoplay)
// =============================================================================

function CardBlock({
  card,
  tierRates,
  counts,
}: {
  card: Block404Data
  tierRates: Record<string, number>
  counts: Record<string, number>
}) {
  const isDark = useIsDark()
  const videoRef = useRef<HTMLVideoElement>(null)
  const config = isDark ? STATUS_CONFIG_DARK[card.status] : STATUS_CONFIG[card.status]
  const tierRate = tierRates[card.status] || 0
  const itemsInTier = counts[card.status] || 1
  const pullChance = tierRate / itemsInTier
  const transparent = isTransparentImg(card.img)
  const invertImage = isDark && card.invert === "y"
  const hasVideo = !!card.video
  const hasAudio = !!card.audio
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

        {/* Character image or video */}
        <div
          className={`w-full flex items-center justify-center ${
            hasVideo ? "" : transparent ? "" : "border border-border"
          }`}
        >
          {hasVideo ? (
            <video
              ref={videoRef}
              src={card.video!}
              loop
              playsInline
              preload="metadata"
              className="w-full max-h-[400px] object-contain"
              style={{
                filter: invertImage ? "invert(1) hue-rotate(180deg)" : undefined,
              }}
            />
          ) : (
            <Image
              src={card.img}
              alt="404 card"
              width={1200}
              height={1200}
              className="w-full max-h-[400px] object-contain"
              style={{
                filter: invertImage ? "invert(1) hue-rotate(180deg)" : undefined,
              }}
              unoptimized
            />
          )}
        </div>
      </div>

      {/* Media player (no autoplay on cards page) */}
      {showMediaBar && (
        <div
          className="border-t px-4 py-2"
          style={{ borderColor: config.borderTint }}
        >
          {hasVideo ? (
            <AudioPlayer config={config} isDark={isDark} mediaRef={videoRef} />
          ) : (
            <AudioPlayer src={card.audio!} config={config} isDark={isDark} />
          )}
        </div>
      )}

      {/* Bottom bar — quote + pull chance */}
      <div
        className="border-t px-4 py-2.5 flex flex-col gap-1.5"
        style={{
          borderColor: config.borderTint,
          backgroundColor: isDark ? "hsla(0,0%,0%,0.15)" : "hsla(0,0%,0%,0.015)",
        }}
      >
        <p className="text-[11px] italic font-serif text-center text-muted-foreground">
          &ldquo;{card.msg}&rdquo;
        </p>

        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-muted-foreground">
            #{card.id}
          </span>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span>
              Pull chance:{" "}
              <span style={labelStyle(config, isDark)}>
                {(pullChance * 100).toFixed(2)}%
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Tier color bar */}
      <div className="w-full h-[2px]" style={barStyle(config)} />
    </div>
  )
}

// =============================================================================
// Main Client Page
// =============================================================================

export default function CardsClientPage({
  cards,
  counts,
  tierRates,
}: CardsClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTier, setActiveTier] = useState<Status>("common")

  const tierOptions: SelectOption[] = ALL_STATUSES.map((s) => ({
    value: s,
    label: `${s.charAt(0).toUpperCase() + s.slice(1)} (${counts[s] || 0})`,
  }))

  const filtered = cards.filter((card) => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      card.msg.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.img.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.status.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch && card.status === activeTier
  })

  return (
    <div>
      {/* Navigation — search + tier filter */}
      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            aria-label="Search cards"
            placeholder="Search cards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-10 pr-3 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
          />
        </div>
        <CustomSelect
          options={tierOptions}
          value={activeTier}
          onValueChange={(value) => setActiveTier(value as Status)}
        />
      </div>

      {/* Count */}
      <p className="text-xs text-muted-foreground mb-4">
        {filtered.length} card{filtered.length !== 1 ? "s" : ""} in {activeTier}
      </p>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((card) => (
          <CardBlock
            key={card.id}
            card={card}
            tierRates={tierRates}
            counts={counts}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-12">
          No cards found.
        </p>
      )}
    </div>
  )
}

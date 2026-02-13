/*
+------------------+----------------------------------------------------------+
| FILE             | MediaCard.tsx                                            |
| ROLE             | Unified media card for anime, manga, film, TV, games    |
| OWNER            | Kris Yotam                                               |
| CREATED          | 2026-02-13                                               |
| UPDATED          | 2026-02-13                                               |
+------------------+----------------------------------------------------------+
| @type component                                                             |
| @path src/components/content/MediaCard.tsx                                  |
+------------------+----------------------------------------------------------+
| SUMMARY                                                                     |
| Single card component for all media types. Supports portrait/square aspect, |
| image overlay, score badge, progress bar, 3D flip, and custom children.     |
| Named exports provide backward-compatible interfaces for each route.        |
+-----------------------------------------------------------------------------+
*/

"use client"

import React, { useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Clock } from "lucide-react"

// =============================================================================
// Shared AnimeItem type (for MAL API data)
// =============================================================================

interface AnimeNode {
  main_picture?: { medium?: string; large?: string }
  title?: string
  my_list_status?: {
    score?: number
    num_episodes_watched?: number
    num_chapters_read?: number
  }
  num_episodes?: number
  num_chapters?: number
}

interface AnimeItem {
  node?: AnimeNode
  main_picture?: { medium?: string; large?: string }
  images?: { jpg?: { image_url?: string } }
  picture?: { large?: string }
  title?: string
  name?: string
  list_status?: {
    score?: number
    num_episodes_watched?: number
    num_chapters_read?: number
  }
  my_list_status?: {
    score?: number
    num_episodes_watched?: number
    num_chapters_read?: number
  }
  id?: number
  mal_id?: number
  url?: string
  link?: string
  photolink?: string
  description?: string
  text?: string
  num_episodes?: number
  num_chapters?: number
}

// =============================================================================
// Helpers
// =============================================================================

function getImageUrl(item: AnimeItem): string {
  return (
    item?.node?.main_picture?.medium ||
    item?.main_picture?.medium ||
    item?.images?.jpg?.image_url ||
    item?.picture?.large ||
    item?.photolink ||
    "/placeholder.svg?height=180&width=120"
  )
}

function getTitle(item: AnimeItem): string {
  return item?.node?.title || item?.title || item?.name || "Unknown Title"
}

function getScore(item: AnimeItem): number | null {
  const listStatus = item?.node?.my_list_status || item?.list_status || item?.my_list_status
  return listStatus?.score || null
}

function getProgress(item: AnimeItem, type: "anime" | "manga" = "anime"): number {
  const listStatus = item?.node?.my_list_status || item?.list_status || item?.my_list_status
  return listStatus?.[type === "anime" ? "num_episodes_watched" : "num_chapters_read"] || 0
}

function getTotal(item: AnimeItem, type: "anime" | "manga" = "anime"): number | null {
  const node = item?.node || item
  return node?.[type === "anime" ? "num_episodes" : "num_chapters"] || null
}

// =============================================================================
// Base MediaCard
// =============================================================================

interface MediaCardProps {
  imageUrl: string
  title: string
  url?: string
  aspectRatio?: "portrait" | "square"
  overlayText?: string
  subtitle?: React.ReactNode
  score?: number | null
  progress?: { current: number; total: number | null; label: string } | null
  description?: string
  onImageError?: () => void
  children?: React.ReactNode
}

export function MediaCard({
  imageUrl,
  title,
  url,
  aspectRatio = "portrait",
  overlayText,
  subtitle,
  score,
  progress,
  description,
  onImageError,
  children,
}: MediaCardProps) {
  const aspectClass = aspectRatio === "square" ? "aspect-square" : "aspect-[2/3]"
  const hasFlip = Boolean(description)

  const titleEl = url ? (
    <a href={url} target="_blank" rel="noopener noreferrer">
      {title}
    </a>
  ) : (
    title
  )

  const cardBody = (
    <>
      <div className={`relative ${aspectClass} overflow-hidden`}>
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover"
          onError={onImageError}
        />
        {score != null && score > 0 && (
          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded flex items-center">
            <Star className="h-3 w-3 mr-0.5 text-yellow-400" />
            {score}
          </div>
        )}
        {overlayText && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
            <span className="text-white text-xs font-medium">{overlayText}</span>
          </div>
        )}
      </div>
      <CardContent className="p-3 flex-1 flex flex-col">
        <h3 className="font-medium text-sm line-clamp-2 mb-1">{titleEl}</h3>
        {subtitle && (
          <div className="text-xs text-muted-foreground">{subtitle}</div>
        )}
        {progress && (
          <div className="mt-auto">
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gray-500 dark:bg-gray-400 h-full rounded-full"
                style={{
                  width: progress.total
                    ? `${(progress.current / progress.total) * 100}%`
                    : "100%",
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {progress.label}{" "}
              {progress.total
                ? `${progress.current}/${progress.total}`
                : `${progress.current}`}
            </p>
          </div>
        )}
        {children}
      </CardContent>
    </>
  )

  if (!hasFlip) {
    return (
      <Card className="w-full overflow-hidden border dark:border-zinc-800 dark:bg-[#1a1a1a] flex flex-col h-full">
        {cardBody}
      </Card>
    )
  }

  // 3D flip card
  const [flipped, setFlipped] = useState(false)
  const toggle = useCallback(() => setFlipped((v) => !v), [])

  const front = (
    <Card className="card-3d-front w-full overflow-hidden border dark:border-zinc-800 dark:bg-[#1a1a1a] flex flex-col h-full">
      {cardBody}
    </Card>
  )

  const back = (
    <Card className="card-3d-back w-full overflow-hidden border dark:border-zinc-800 dark:bg-[#111] flex flex-col h-full">
      <div className={`relative ${aspectClass} overflow-hidden`}>
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover opacity-30"
          onError={onImageError}
        />
        <div className="absolute inset-0 p-4 flex items-center justify-center">
          <div>
            <h3 className="font-medium text-sm mb-2">{title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed max-h-[8rem] overflow-auto">
              {description}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )

  return (
    <div
      className={`card-3d w-full h-full ${flipped ? "flip" : ""}`}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") toggle()
      }}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
    >
      <div className="card-3d-inner w-full h-full">
        {front}
        {back}
      </div>
    </div>
  )
}

// =============================================================================
// WatchingAnimeCard
// =============================================================================

interface WatchingAnimeCardProps {
  anime: AnimeItem
  type?: "anime" | "manga"
}

export function WatchingAnimeCard({ anime, type = "anime" }: WatchingAnimeCardProps) {
  const progressLabel = type === "anime" ? "Episode" : "Chapter"
  return (
    <MediaCard
      imageUrl={getImageUrl(anime)}
      title={getTitle(anime)}
      score={getScore(anime)}
      progress={{
        current: getProgress(anime, type),
        total: getTotal(anime, type),
        label: progressLabel,
      }}
    />
  )
}

// =============================================================================
// CompletedAnimeCard
// =============================================================================

interface CompletedAnimeCardProps {
  anime: AnimeItem
  type?: "anime" | "manga"
}

export function CompletedAnimeCard({ anime, type = "anime" }: CompletedAnimeCardProps) {
  const total = getTotal(anime, type)
  const totalLabel = type === "anime" ? "Episodes" : "Chapters"
  return (
    <MediaCard
      imageUrl={getImageUrl(anime)}
      title={getTitle(anime)}
      score={getScore(anime)}
      overlayText="Completed"
      subtitle={total ? `${total} ${totalLabel}` : undefined}
    />
  )
}

// =============================================================================
// AnimeFavoriteCard (for media favorites — anime, manga)
// =============================================================================

interface AnimeFavoriteCardProps {
  item: AnimeItem
  type: "anime" | "manga" | "character"
  isCompany?: boolean
  subtitle?: string
  onImageError?: () => void
}

export function AnimeFavoriteCard({
  item,
  type,
  isCompany = false,
  subtitle,
  onImageError,
}: AnimeFavoriteCardProps) {
  const imageUrl =
    item?.images?.jpg?.image_url ||
    item?.picture?.large ||
    item?.main_picture?.large ||
    item?.photolink ||
    "/placeholder.svg?height=180&width=120"
  const title = item?.name || item?.title || "Unknown"
  const url =
    item?.url ||
    item?.link ||
    `https://myanimelist.net/${type}/${item?.id || item?.mal_id}`

  return (
    <MediaCard
      imageUrl={imageUrl}
      title={title}
      url={url}
      aspectRatio={isCompany ? "square" : "portrait"}
      overlayText="Favorite"
      subtitle={subtitle}
      description={item?.description || item?.text || undefined}
      onImageError={onImageError}
    />
  )
}

// =============================================================================
// FilmCard
// =============================================================================

interface FilmCardProps {
  id: number
  title: string
  year?: number
  posterUrl?: string | null
}

export function FilmCard({ id, title, year, posterUrl }: FilmCardProps) {
  const [imageError, setImageError] = useState(false)
  const fallbackUrl = `/placeholder.svg?height=270&width=180&text=${encodeURIComponent(title)}`
  const imageUrl = posterUrl && !imageError ? posterUrl : fallbackUrl

  return (
    <MediaCard
      imageUrl={imageUrl}
      title={title}
      url={`https://trakt.tv/movies/${id}`}
      overlayText="Favorite"
      subtitle={year ? `${year}` : undefined}
      onImageError={() => setImageError(true)}
    />
  )
}

// =============================================================================
// ShowCard
// =============================================================================

interface ShowCardProps {
  id: number
  title: string
  year?: number
  posterUrl?: string | null
}

export function ShowCard({ id, title, year, posterUrl }: ShowCardProps) {
  const [imageError, setImageError] = useState(false)
  const fallbackUrl = `/placeholder.svg?height=270&width=180&text=${encodeURIComponent(title)}`
  const imageUrl = posterUrl && !imageError ? posterUrl : fallbackUrl

  return (
    <MediaCard
      imageUrl={imageUrl}
      title={title}
      url={`https://trakt.tv/shows/${id}`}
      overlayText="Favorite"
      subtitle={year ? `${year}` : undefined}
      onImageError={() => setImageError(true)}
    />
  )
}

// =============================================================================
// EpisodeCard
// =============================================================================

interface EpisodeCardProps {
  id: number
  title: string
  season?: number
  episode?: number
  posterUrl?: string | null
}

export function EpisodeCard({ id, title, season, episode, posterUrl }: EpisodeCardProps) {
  const [imageError, setImageError] = useState(false)
  const fallbackUrl = `/placeholder.svg?height=270&width=180&text=${encodeURIComponent(title)}`
  const imageUrl = posterUrl && !imageError ? posterUrl : fallbackUrl

  const parts: string[] = []
  if (season != null) parts.push(`S${season}`)
  if (episode != null) parts.push(`E${episode}`)
  const subtitle = parts.length > 0 ? parts.join("") : undefined

  return (
    <MediaCard
      imageUrl={imageUrl}
      title={title}
      url={`https://trakt.tv/movies/${id}`}
      overlayText="Favorite"
      subtitle={subtitle}
      onImageError={() => setImageError(true)}
    />
  )
}

// =============================================================================
// GameCard
// =============================================================================

interface Game {
  id: string
  name: string
  version?: string
  releaseDate: string
  console: string
  hoursPlayed: number
  genre: string[]
  coverImage: string
  developer?: string
  publisher?: string
  rating?: number
  favorite?: boolean
  favoriteWeight?: number
  dateLastPlayed?: string
}

interface GameCardProps {
  game: Game
}

export function GameCard({ game }: GameCardProps) {
  return (
    <MediaCard
      imageUrl={game.coverImage || "/placeholder.svg"}
      title={game.name}
      overlayText={game.console}
      onImageError={undefined}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          {game.hoursPlayed}h
        </div>
        {game.genre && game.genre.length > 0 && (
          <span className="text-xs bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
            {game.genre[0]}
          </span>
        )}
      </div>
    </MediaCard>
  )
}

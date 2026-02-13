/*
+------------------+----------------------------------------------------------+
| FILE             | PersonCard.tsx                                           |
| ROLE             | Unified person/character card for all routes             |
| OWNER            | Kris Yotam                                               |
| CREATED          | 2026-02-13                                               |
| UPDATED          | 2026-02-13                                               |
+------------------+----------------------------------------------------------+
| @type component                                                             |
| @path src/components/content/PersonCard.tsx                                 |
+------------------+----------------------------------------------------------+
| SUMMARY                                                                     |
| Single card component for all people and character types. Renders portrait  |
| 2:3 aspect image with "Favorite" overlay, name, and optional subtitle.     |
| Named exports: PersonCard, ActorCard, DirectorCard, ProducerCard,           |
| FavCharacterCard, GameCharacterCard.                                        |
+-----------------------------------------------------------------------------+
*/

"use client"

import React, { useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"

// =============================================================================
// Base PersonCard
// =============================================================================

interface PersonCardProps {
  name: string
  imageUrl: string
  url?: string
  subtitle?: React.ReactNode
  description?: string
  onImageError?: () => void
}

export function PersonCard({
  name,
  imageUrl,
  url,
  subtitle,
  description,
  onImageError,
}: PersonCardProps) {
  const hasFlip = Boolean(description)

  const titleEl = url ? (
    <a href={url} target="_blank" rel="noopener noreferrer">
      {name}
    </a>
  ) : (
    name
  )

  const cardBody = (
    <>
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={imageUrl || "/placeholder.svg?height=180&width=120"}
          alt={name}
          className="w-full h-full object-cover"
          onError={onImageError}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
          <span className="text-white text-xs font-medium">Favorite</span>
        </div>
      </div>
      <CardContent className="p-3">
        <h3 className="font-medium text-sm line-clamp-2">{titleEl}</h3>
        {subtitle && (
          <div className="text-xs text-muted-foreground">{subtitle}</div>
        )}
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

  const [flipped, setFlipped] = useState(false)
  const toggle = useCallback(() => setFlipped((v) => !v), [])

  const front = (
    <Card className="card-3d-front w-full overflow-hidden border dark:border-zinc-800 dark:bg-[#1a1a1a] flex flex-col h-full">
      {cardBody}
    </Card>
  )

  const back = (
    <Card className="card-3d-back w-full overflow-hidden border dark:border-zinc-800 dark:bg-[#111] flex flex-col h-full">
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={imageUrl || "/placeholder.svg?height=180&width=120"}
          alt={name}
          className="w-full h-full object-cover opacity-30"
          onError={onImageError}
        />
        <div className="absolute inset-0 p-4 flex items-center justify-center">
          <div>
            <h3 className="font-medium text-sm mb-2">{name}</h3>
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
// ActorCard
// =============================================================================

interface ActorCardProps {
  id: string | number
  name: string
  image: string
}

export function ActorCard({ id, name, image }: ActorCardProps) {
  return (
    <PersonCard
      name={name}
      imageUrl={image}
      url={`https://trakt.tv/people/${id}`}
    />
  )
}

// =============================================================================
// DirectorCard
// =============================================================================

interface DirectorCardProps {
  id: string | number
  name: string
  image: string
}

export function DirectorCard({ id, name, image }: DirectorCardProps) {
  return (
    <PersonCard
      name={name}
      imageUrl={image}
      url={`https://trakt.tv/people/${id}`}
    />
  )
}

// =============================================================================
// ProducerCard
// =============================================================================

interface ProducerCardProps {
  id: string | number
  name: string
  image: string
}

export function ProducerCard({ id, name, image }: ProducerCardProps) {
  return (
    <PersonCard
      name={name}
      imageUrl={image}
      url={`https://trakt.tv/people/${id}`}
    />
  )
}

// =============================================================================
// FavCharacterCard (film characters, optionally with actor attribution)
// =============================================================================

interface FavCharacterCardProps {
  id: string | number
  name: string
  image: string
  actor?: string
}

export function FavCharacterCard({ id, name, image, actor }: FavCharacterCardProps) {
  return (
    <PersonCard
      name={name}
      imageUrl={image}
      url={`https://trakt.tv/people/${id}`}
      subtitle={actor ? <span>Played by {actor}</span> : undefined}
    />
  )
}

// =============================================================================
// GameCharacterCard
// =============================================================================

interface GameCharacter {
  id: string
  name: string
  game: string
  role: string
  avatarImage: string
  description?: string
}

interface GameCharacterCardProps {
  character: GameCharacter
}

export function GameCharacterCard({ character }: GameCharacterCardProps) {
  return (
    <PersonCard
      name={character.name}
      imageUrl={character.avatarImage || "/placeholder.svg"}
      subtitle={character.game}
    />
  )
}

/*
+------------------+----------------------------------------------------------+
| FILE             | CompanyCard.tsx                                          |
| ROLE             | Unified company/org/hardware card for all routes         |
| OWNER            | Kris Yotam                                               |
| CREATED          | 2026-02-13                                               |
| UPDATED          | 2026-02-13                                               |
+------------------+----------------------------------------------------------+
| @type component                                                             |
| @path src/components/content/CompanyCard.tsx                                |
+------------------+----------------------------------------------------------+
| SUMMARY                                                                     |
| Single card component for companies, studios, consoles, and platforms.      |
| Renders square aspect image with name and optional subtitle. Supports 3D    |
| flip when description is provided.                                          |
| Named exports: CompanyCard, ConsoleCard, PlatformCard.                      |
+-----------------------------------------------------------------------------+
*/

"use client"

import React, { useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"

// =============================================================================
// Base CompanyCard
// =============================================================================

interface CompanyCardProps {
  name: string
  imageUrl: string
  url?: string
  subtitle?: string
  description?: string
  onImageError?: () => void
}

export function CompanyCard({
  name,
  imageUrl,
  url,
  subtitle,
  description,
  onImageError,
}: CompanyCardProps) {
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
      <div className="relative aspect-square overflow-hidden">
        <img
          src={imageUrl || "/placeholder.svg?height=150&width=150"}
          alt={name}
          className="w-full h-full object-cover"
          onError={onImageError}
        />
      </div>
      <CardContent className="p-3">
        <h3 className="font-medium text-sm line-clamp-1">{titleEl}</h3>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
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
      <div className="relative aspect-square overflow-hidden">
        <img
          src={imageUrl || "/placeholder.svg?height=150&width=150"}
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
// ConsoleCard
// =============================================================================

interface GameConsole {
  id: string
  name: string
  manufacturer: string
  releaseDate: string
  coverImage: string
  description?: string
}

interface ConsoleCardProps {
  console: GameConsole
}

export function ConsoleCard({ console: c }: ConsoleCardProps) {
  return (
    <CompanyCard
      name={c.name}
      imageUrl={c.coverImage || "/placeholder.svg?height=150&width=150"}
      subtitle={c.manufacturer}
      description={c.description}
    />
  )
}

// =============================================================================
// PlatformCard
// =============================================================================

interface GamePlatform {
  id: string
  name: string
  company: string
  releaseDate: string
  coverImage: string
  description?: string
}

interface PlatformCardProps {
  platform: GamePlatform
}

export function PlatformCard({ platform }: PlatformCardProps) {
  return (
    <CompanyCard
      name={platform.name}
      imageUrl={platform.coverImage || "/placeholder.svg?height=150&width=150"}
      subtitle={platform.company}
      description={platform.description}
    />
  )
}

"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/core"
import { PageDescription } from "@/components/core"
import { GameStatsSection } from "@/components/media/gaming/GameStats"
import { GameCard } from "@/components/content/MediaCard"
import { GameCharacterCard as CharacterCard } from "@/components/content/PersonCard"
import { ConsoleCard } from "@/components/content/CompanyCard"
import { PlatformCard } from "@/components/content/CompanyCard"
import { MediaSectionHeader } from "@/components/core/section-header"
import { PaginatedCardGrid } from "@/components/content/PaginatedCardGrid"
import { Gamepad2 } from "lucide-react"

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

interface GameCharacter {
  id: string
  name: string
  game: string
  role: string
  avatarImage: string
  description?: string
}

interface GameConsole {
  id: string
  name: string
  manufacturer: string
  releaseDate: string
  coverImage: string
  description?: string
}

interface GamePlatform {
  id: string
  name: string
  company: string
  releaseDate: string
  coverImage: string
  description?: string
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-8 text-center">
      <Gamepad2 className="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-zinc-600" />
      <p className="text-gray-500 dark:text-zinc-400">{message}</p>
    </div>
  )
}

export default function GameClientPage() {
  const [games, setGames] = useState<Game[]>([])
  const [characters, setCharacters] = useState<GameCharacter[]>([])
  const [consoles, setConsoles] = useState<GameConsole[]>([])
  const [platforms, setPlatforms] = useState<GamePlatform[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)

      try {
        const [gamesRes, charactersRes, consolesRes, platformsRes] = await Promise.all([
          fetch('/api/games?resource=games'),
          fetch('/api/games?resource=characters'),
          fetch('/api/games?resource=consoles'),
          fetch('/api/games?resource=platforms')
        ])

        if (!gamesRes.ok) throw new Error(`Failed to fetch games data: ${gamesRes.status}`)
        if (!charactersRes.ok) throw new Error(`Failed to fetch characters data: ${charactersRes.status}`)
        if (!consolesRes.ok) throw new Error(`Failed to fetch consoles data: ${consolesRes.status}`)
        if (!platformsRes.ok) throw new Error(`Failed to fetch platforms data: ${platformsRes.status}`)

        const gamesData = await gamesRes.json()
        const charactersData = await charactersRes.json()
        const consolesData = await consolesRes.json()
        const platformsData = await platformsRes.json()

        setGames(gamesData)
        setCharacters(charactersData)
        setConsoles(consolesData)
        setPlatforms(platformsData)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="games-page">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-zinc-100 mx-auto mb-4"></div>
            <p className="dark:text-zinc-300">Loading games data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="games-page">
        <div
          className="bg-gray-200 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-800 dark:text-zinc-200 px-4 py-3 relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    )
  }

  // Process data
  const recentlyPlayed = [...games].sort((a, b) => {
    const dateA = a.dateLastPlayed ? new Date(a.dateLastPlayed).getTime() : 0
    const dateB = b.dateLastPlayed ? new Date(b.dateLastPlayed).getTime() : 0
    return dateB - dateA
  }).slice(0, 20)

  const favoriteGames = [...games]
    .filter(game => game.favorite)
    .sort((a, b) => (b.favoriteWeight || 0) - (a.favoriteWeight || 0))
    .slice(0, 20)

  const mostPlayed = [...games].sort((a, b) => b.hoursPlayed - a.hoursPlayed).slice(0, 20)

  // Calculate stats
  const totalGames = games.length
  const totalHours = games.reduce((total, game) => total + game.hoursPlayed, 0)

  const uniqueGenres = new Set<string>()
  games.forEach(game => {
    game.genre.forEach(g => uniqueGenres.add(g))
  })
  const genresCount = uniqueGenres.size

  return (
    <div className="games-page">
      <PageDescription
        title="Games Page"
        description="This page shows my gaming activity, favorite games, and gaming stats. The data is manually curated and updated periodically."
      />

      <PageHeader
        title="Games"
        subtitle="My gaming journey and favorites"
        start_date="2025-01-01"
        end_date={new Date().toISOString().split('T')[0]}
        preview="a compilation of all the games I've played"
        status="In Progress"
        confidence="certain"
      />

      <section className="games-stats-section">
        <GameStatsSection
          gamesCount={totalGames}
          hoursPlayed={totalHours}
          genresCount={genresCount}
        />
      </section>

      {/* Recently Played */}
      <section className="film-section">
        <MediaSectionHeader title="Recently Played" count={recentlyPlayed.length} />
        {recentlyPlayed.length > 0 ? (
          <PaginatedCardGrid squareButtons={true}>
            {recentlyPlayed.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </PaginatedCardGrid>
        ) : (
          <EmptyState message="No recently played games available." />
        )}
      </section>

      {/* Favorite Games */}
      <section className="film-section">
        <MediaSectionHeader title="Favorite Games" count={favoriteGames.length} />
        {favoriteGames.length > 0 ? (
          <PaginatedCardGrid squareButtons={true}>
            {favoriteGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </PaginatedCardGrid>
        ) : (
          <EmptyState message="No favorite games available." />
        )}
      </section>

      {/* Most Played */}
      <section className="film-section">
        <MediaSectionHeader title="Most Played" count={mostPlayed.length} />
        {mostPlayed.length > 0 ? (
          <PaginatedCardGrid squareButtons={true}>
            {mostPlayed.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </PaginatedCardGrid>
        ) : (
          <EmptyState message="No most played games data available." />
        )}
      </section>

      {/* Favorite Characters */}
      <section className="film-section">
        <MediaSectionHeader title="Favorite Characters" count={characters.length} />
        {characters.length > 0 ? (
          <PaginatedCardGrid squareButtons={true}>
            {characters.map((character) => (
              <CharacterCard key={character.id} character={character} />
            ))}
          </PaginatedCardGrid>
        ) : (
          <EmptyState message="No favorite characters available." />
        )}
      </section>

      {/* Gaming Consoles */}
      <section className="film-section">
        <MediaSectionHeader title="Gaming Consoles" count={consoles.length} />
        {consoles.length > 0 ? (
          <PaginatedCardGrid squareButtons={true}>
            {consoles.map((console) => (
              <ConsoleCard key={console.id} console={console} />
            ))}
          </PaginatedCardGrid>
        ) : (
          <EmptyState message="No gaming consoles available." />
        )}
      </section>

      {/* Gaming Platforms */}
      <section className="film-section">
        <MediaSectionHeader title="Game Platforms" count={platforms.length} />
        {platforms.length > 0 ? (
          <PaginatedCardGrid squareButtons={true}>
            {platforms.map((platform) => (
              <PlatformCard key={platform.id} platform={platform} />
            ))}
          </PaginatedCardGrid>
        ) : (
          <EmptyState message="No game platforms available." />
        )}
      </section>
    </div>
  )
}

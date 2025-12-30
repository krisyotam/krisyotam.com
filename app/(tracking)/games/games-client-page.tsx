"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/core"
import { PageDescription } from "@/components/core"
import { GameStatsSection } from "@/components/posts/gaming/GameStats"
import { GameCard, GameCards } from "@/components/posts/gaming/GameCard"
import { CharacterCard, CharacterCards } from "@/components/posts/gaming/CharacterCard"
import { ConsoleCard, ConsoleCards } from "@/components/posts/gaming/ConsoleCard"
import { PlatformCard, PlatformCards } from "@/components/posts/gaming/PlatformCard"
import { SectionHeader } from "@/components/posts/gaming/SectionHeader"
import { HorizontalScroll, ScrollItem } from "@/components/posts/gaming/HorizontalScroll"
import { EmptyState } from "@/components/posts/gaming/EmptyState"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

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

export default function GameClientPage() {
  const [games, setGames] = useState<Game[]>([])
  const [characters, setCharacters] = useState<GameCharacter[]>([])
  const [consoles, setConsoles] = useState<GameConsole[]>([])
  const [platforms, setPlatforms] = useState<GamePlatform[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Pagination states
  const [currentConsolePage, setCurrentConsolePage] = useState(1)
  const [currentPlatformPage, setCurrentPlatformPage] = useState(1)
  const [currentCharacterPage, setCurrentCharacterPage] = useState(1)
  const [currentFavoriteGamesPage, setCurrentFavoriteGamesPage] = useState(1)
  const [currentRecentlyPlayedPage, setCurrentRecentlyPlayedPage] = useState(1)
  const [currentMostPlayedPage, setCurrentMostPlayedPage] = useState(1)
  const itemsPerPage = 5;
  
  useEffect(() => {
    async function fetchData() {
      console.log("GameClientPage: Starting to fetch data")
      setLoading(true)
      
      try {
        // Fetch data from API routes
        const [gamesRes, charactersRes, consolesRes, platformsRes] = await Promise.all([
          fetch('/api/games/games'),
          fetch('/api/games/characters'),
          fetch('/api/games/consoles'),
          fetch('/api/games/platforms')
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
          className="bg-gray-200 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-800 dark:text-zinc-200 px-4 py-3 rounded relative"
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
  }).slice(0, 10)

  const favoriteGames = [...games]
    .filter(game => game.favorite)
    .sort((a, b) => (b.favoriteWeight || 0) - (a.favoriteWeight || 0))
    .slice(0, 10)

  const mostPlayed = [...games].sort((a, b) => b.hoursPlayed - a.hoursPlayed).slice(0, 10)

  // Calculate stats
  const totalGames = games.length
  const totalHours = games.reduce((total, game) => total + game.hoursPlayed, 0)
  
  // Get unique genres and count them
  const uniqueGenres = new Set<string>()
  games.forEach(game => {
    game.genre.forEach(g => uniqueGenres.add(g))
  })
  const genresCount = uniqueGenres.size

  return (
    <div className="games-page">
      {/* Page description */}
      <PageDescription 
        title="Games Page"
        description="This page shows my gaming activity, favorite games, and gaming stats. The data is manually curated and updated periodically."
      />
      
      {/* Page header */}
      <PageHeader
        title="Games"
        subtitle="My gaming journey and favorites"
        start_date="2025-01-01"
        end_date={new Date().toISOString().split('T')[0]}
        preview="a compilation of all the games I've played"
        status="In Progress"
        confidence="certain"
      />

      {/* Stats section */}
      <section className="games-section">
        <GameStatsSection 
          gamesCount={totalGames}
          hoursPlayed={totalHours}
          genresCount={genresCount}
        />
      </section>

      {/* Recently played games - with pagination */}
      <section className="games-section">
        <SectionHeader title="Recently Played" count={recentlyPlayed.length} />
        {recentlyPlayed.length > 0 ? (
          <>
            <GameCards 
              games={recentlyPlayed.slice(
                (currentRecentlyPlayedPage - 1) * itemsPerPage, 
                currentRecentlyPlayedPage * itemsPerPage
              )} 
            />
            {/* Pagination controls */}
            {recentlyPlayed.length > itemsPerPage && (
              <div className="flex justify-center mt-6 gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentRecentlyPlayedPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentRecentlyPlayedPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <span className="flex items-center px-3 text-sm">
                  Page {currentRecentlyPlayedPage} of {Math.ceil(recentlyPlayed.length / itemsPerPage)}
                </span>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentRecentlyPlayedPage(prev => 
                    Math.min(prev + 1, Math.ceil(recentlyPlayed.length / itemsPerPage))
                  )}
                  disabled={currentRecentlyPlayedPage >= Math.ceil(recentlyPlayed.length / itemsPerPage)}
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <EmptyState message="No recently played games available." />
        )}
      </section>

      {/* Favorite games - with pagination */}
      <section className="games-section">
        <SectionHeader title="Favorite Games" count={favoriteGames.length} />
        {favoriteGames.length > 0 ? (
          <>
            <GameCards 
              games={favoriteGames.slice(
                (currentFavoriteGamesPage - 1) * itemsPerPage, 
                currentFavoriteGamesPage * itemsPerPage
              )} 
            />
            {/* Pagination controls */}
            {favoriteGames.length > itemsPerPage && (
              <div className="flex justify-center mt-6 gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentFavoriteGamesPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentFavoriteGamesPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <span className="flex items-center px-3 text-sm">
                  Page {currentFavoriteGamesPage} of {Math.ceil(favoriteGames.length / itemsPerPage)}
                </span>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentFavoriteGamesPage(prev => 
                    Math.min(prev + 1, Math.ceil(favoriteGames.length / itemsPerPage))
                  )}
                  disabled={currentFavoriteGamesPage >= Math.ceil(favoriteGames.length / itemsPerPage)}
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <EmptyState message="No favorite games available." />
        )}
      </section>

      {/* Most played games - with pagination */}
      <section className="games-section">
        <SectionHeader title="Most Played" count={mostPlayed.length} />
        {mostPlayed.length > 0 ? (
          <>
            <GameCards 
              games={mostPlayed.slice(
                (currentMostPlayedPage - 1) * itemsPerPage, 
                currentMostPlayedPage * itemsPerPage
              )} 
            />
            {/* Pagination controls */}
            {mostPlayed.length > itemsPerPage && (
              <div className="flex justify-center mt-6 gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentMostPlayedPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentMostPlayedPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <span className="flex items-center px-3 text-sm">
                  Page {currentMostPlayedPage} of {Math.ceil(mostPlayed.length / itemsPerPage)}
                </span>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentMostPlayedPage(prev => 
                    Math.min(prev + 1, Math.ceil(mostPlayed.length / itemsPerPage))
                  )}
                  disabled={currentMostPlayedPage >= Math.ceil(mostPlayed.length / itemsPerPage)}
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <EmptyState message="No most played games data available." />
        )}
      </section>

      {/* Favorite characters - with pagination */}
      <section className="games-section">
        <SectionHeader title="Favorite Characters" count={characters.length} />
        {characters.length > 0 ? (
          <>
            <CharacterCards 
              characters={characters.slice(
                (currentCharacterPage - 1) * itemsPerPage, 
                currentCharacterPage * itemsPerPage
              )} 
            />
            {/* Pagination controls */}
            {characters.length > itemsPerPage && (
              <div className="flex justify-center mt-6 gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentCharacterPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentCharacterPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <span className="flex items-center px-3 text-sm">
                  Page {currentCharacterPage} of {Math.ceil(characters.length / itemsPerPage)}
                </span>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentCharacterPage(prev => 
                    Math.min(prev + 1, Math.ceil(characters.length / itemsPerPage))
                  )}
                  disabled={currentCharacterPage >= Math.ceil(characters.length / itemsPerPage)}
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <EmptyState message="No favorite characters available." />
        )}
      </section>

      {/* Consoles - with pagination */}
      <section className="games-section">
        <SectionHeader title="Gaming Consoles" count={consoles.length} />
        {consoles.length > 0 ? (
          <>
            <ConsoleCards 
              consoles={consoles.slice(
                (currentConsolePage - 1) * itemsPerPage, 
                currentConsolePage * itemsPerPage
              )} 
            />
            {/* Pagination controls */}
            {consoles.length > itemsPerPage && (
              <div className="flex justify-center mt-6 gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentConsolePage(prev => Math.max(prev - 1, 1))}
                  disabled={currentConsolePage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <span className="flex items-center px-3 text-sm">
                  Page {currentConsolePage} of {Math.ceil(consoles.length / itemsPerPage)}
                </span>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentConsolePage(prev => 
                    Math.min(prev + 1, Math.ceil(consoles.length / itemsPerPage))
                  )}
                  disabled={currentConsolePage >= Math.ceil(consoles.length / itemsPerPage)}
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <EmptyState message="No gaming consoles available." />
        )}
      </section>

      {/* Gaming Platforms - with pagination */}
      <section className="games-section">
        <SectionHeader title="Game Platforms" count={platforms.length} />
        {platforms.length > 0 ? (
          <>
            <PlatformCards 
              platforms={platforms.slice(
                (currentPlatformPage - 1) * itemsPerPage, 
                currentPlatformPage * itemsPerPage
              )} 
            />
            {/* Pagination controls */}
            {platforms.length > itemsPerPage && (
              <div className="flex justify-center mt-6 gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentPlatformPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPlatformPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <span className="flex items-center px-3 text-sm">
                  Page {currentPlatformPage} of {Math.ceil(platforms.length / itemsPerPage)}
                </span>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPlatformPage(prev => 
                    Math.min(prev + 1, Math.ceil(platforms.length / itemsPerPage))
                  )}
                  disabled={currentPlatformPage >= Math.ceil(platforms.length / itemsPerPage)}
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <EmptyState message="No game platforms available." />
        )}
      </section>
    </div>
  )
}

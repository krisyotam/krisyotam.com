"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { PaginatedCardGrid } from "@/components/trakt/PaginatedCardGrid"
import { FilmCard } from "@/components/trakt/FilmCard"
import { ActorCard } from "@/components/trakt/ActorCard"
import { CompanyCard } from "@/components/trakt/CompanyCard"
import { FavCharacterCard } from "@/components/trakt/FavCharacterCard"
import { DirectorCard } from "@/components/trakt/DirectorCard"
import { MediaSectionHeader } from "@/components/core"

export default function TvClientPage() {
  const router = useRouter()
  const pathname = usePathname()
  const [watchedStats, setWatchedStats] = useState<any>(null)
  const [watchedShows, setWatchedShows] = useState<any[]>([])
  const [favoriteShows, setFavoriteShows] = useState<any[]>([])
  const [favShowrunners, setFavShowrunners] = useState<any[]>([])
  const [favActors, setFavActors] = useState<any[]>([])
  const [favNetworks, setFavNetworks] = useState<any[]>([])
  const [favCharacters, setFavCharacters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const [
          watchedStatsRes,
          watchedShowsRes,
          favoriteShowsRes,
          favShowrunnersRes,
          favActorsRes,
          favNetworksRes,
          favCharactersRes,
        ] = await Promise.all([
          fetch("/api/tv?resource=stats").then(res => res.json()).catch(() => ({ showsWatched: 0, episodesWatched: 0, timeWatchedHours: 0, topGenres: [] })),
          fetch("/api/tv?resource=watched&limit=20").then(res => res.json()).catch(() => []),
          fetch("/api/tv?resource=favorites&type=shows").then(res => res.json()).catch(() => []),
          fetch("/api/tv?resource=favorites&type=showrunners").then(res => res.json()).catch(() => []),
          fetch("/api/tv?resource=favorites&type=actors").then(res => res.json()).catch(() => []),
          fetch("/api/tv?resource=favorites&type=networks").then(res => res.json()).catch(() => []),
          fetch("/api/tv?resource=favorites&type=characters").then(res => res.json()).catch(() => []),
        ])

        setWatchedStats(watchedStatsRes)
        setWatchedShows(watchedShowsRes)
        setFavoriteShows(favoriteShowsRes)
        setFavShowrunners(favShowrunnersRes)
        setFavActors(favActorsRes)
        setFavNetworks(favNetworksRes)
        setFavCharacters(favCharactersRes)
      } catch (err) {
        setError("Failed to load TV data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleTabClick = (tab: "overview" | "watched") => {
    if (tab === "overview") {
      router.push("/tv")
    } else {
      router.push("/tv/watched")
    }
  }

  const activeTab = pathname === "/tv" ? "overview" : "watched"

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-zinc-100 mx-auto mb-4"></div>
          <p className="dark:text-zinc-300">Loading TV data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gray-200 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-800 dark:text-zinc-200 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    )
  }

  const formattedHours = (watchedStats?.timeWatchedHours || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 })
  const topGenres = watchedStats?.topGenres || []

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex space-x-4 border-b mb-4">
        <button
          onClick={() => handleTabClick("overview")}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
            activeTab === "overview"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground"
          )}
        >
          Overview
        </button>
        <button
          onClick={() => handleTabClick("watched")}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
            activeTab === "watched"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground"
          )}
        >
          Watched
        </button>
      </div>

      {/* Unified Stats Bar */}
      <section className="tv-section">
        <div className="border border-border bg-muted/30 dark:bg-[hsl(var(--popover))]">
          <div className="flex flex-wrap items-center justify-between px-4 py-3 gap-x-6 gap-y-2">
            {/* Stats */}
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-semibold text-foreground">{(watchedStats?.showsWatched || 0).toLocaleString()}</span>
                <span className="text-muted-foreground">shows</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-border" />
              <div className="hidden sm:flex items-baseline gap-1.5">
                <span className="text-xl font-semibold text-foreground">{(watchedStats?.episodesWatched || 0).toLocaleString()}</span>
                <span className="text-muted-foreground">episodes</span>
              </div>
              <div className="hidden md:block w-px h-4 bg-border" />
              <div className="hidden md:flex items-baseline gap-1.5">
                <span className="text-xl font-semibold text-foreground">{formattedHours}</span>
                <span className="text-muted-foreground">hours</span>
              </div>
            </div>
            {/* Top Genres */}
            {topGenres && topGenres.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="hidden lg:inline">Top:</span>
                {topGenres.slice(0, 4).map((genre: { genre: string; count: number }, i: number) => (
                  <span key={genre.genre} className="text-foreground">
                    {genre.genre}{i < Math.min(topGenres.length, 4) - 1 && <span className="text-muted-foreground ml-2">·</span>}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Favorite Shows Section */}
      <section className="tv-section">
        <MediaSectionHeader title="Favorite Shows" />
        {favoriteShows && favoriteShows.length > 0 ? (
          <PaginatedCardGrid squareButtons={true}>
            {favoriteShows.map((show) => (
              <FilmCard key={show.id} id={show.id} title={show.title} year={show.year} posterUrl={show.posterUrl} />
            ))}
          </PaginatedCardGrid>
        ) : (
          <div className="tv-empty-state">
            <p className="tv-empty-state-message">No favorite shows yet</p>
          </div>
        )}
      </section>

      {/* Favorite Showrunners Section */}
      <section className="tv-section">
        <MediaSectionHeader title="Favorite Showrunners" />
        {favShowrunners && favShowrunners.length > 0 ? (
          <PaginatedCardGrid squareButtons={true}>
            {favShowrunners.map((showrunner) => (
              <DirectorCard key={showrunner.id} id={showrunner.id} name={showrunner.name} image={showrunner.image} />
            ))}
          </PaginatedCardGrid>
        ) : (
          <div className="tv-empty-state">
            <p className="tv-empty-state-message">No favorite showrunners yet</p>
          </div>
        )}
      </section>

      {/* Favorite Actors Section */}
      <section className="tv-section">
        <MediaSectionHeader title="Favorite Actors" />
        {favActors && favActors.length > 0 ? (
          <PaginatedCardGrid squareButtons={true}>
            {favActors.map((actor) => (
              <ActorCard key={actor.id} id={actor.id} name={actor.name} image={actor.image} />
            ))}
          </PaginatedCardGrid>
        ) : (
          <div className="tv-empty-state">
            <p className="tv-empty-state-message">No favorite actors yet</p>
          </div>
        )}
      </section>

      {/* Favorite Characters Section */}
      <section className="tv-section">
        <MediaSectionHeader title="Favorite Characters" />
        {favCharacters && favCharacters.length > 0 ? (
          <PaginatedCardGrid squareButtons={true}>
            {favCharacters.map((character) => (
              <FavCharacterCard key={character.id} id={character.id} name={character.name} image={character.image} actor={character.actor} />
            ))}
          </PaginatedCardGrid>
        ) : (
          <div className="tv-empty-state">
            <p className="tv-empty-state-message">No favorite characters yet</p>
          </div>
        )}
      </section>

      {/* Watched Shows Section */}
      <section className="tv-section">
        <MediaSectionHeader title="Watched" />
        {watchedShows && watchedShows.length > 0 ? (
          <PaginatedCardGrid squareButtons={true}>
            {watchedShows.map((show) => (
              <FilmCard key={show.id} id={show.id} title={show.title} year={show.year} posterUrl={show.posterUrl} />
            ))}
          </PaginatedCardGrid>
        ) : (
          <div className="tv-empty-state">
            <p className="tv-empty-state-message">No watched shows yet</p>
          </div>
        )}
      </section>

      {/* Favorite Networks Section */}
      <section className="tv-section">
        <MediaSectionHeader title="Favorite Networks" />
        {favNetworks && favNetworks.length > 0 ? (
          <PaginatedCardGrid squareButtons={true}>
            {favNetworks.map((network) => (
              <CompanyCard key={network.id} id={network.id} name={network.name} image={network.image} description={network.description} />
            ))}
          </PaginatedCardGrid>
        ) : (
          <div className="tv-empty-state">
            <p className="tv-empty-state-message">No favorite networks yet</p>
          </div>
        )}
      </section>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { PaginatedCardGrid } from "@/components/content/PaginatedCardGrid"
import { FilmCard } from "@/components/content/MediaCard"
import { ActorCard, DirectorCard, FavCharacterCard } from "@/components/content/PersonCard"
import { CompanyCard } from "@/components/content/CompanyCard"
import { MediaSectionHeader } from "@/components/core/section-header"

export default function FilmClientPage() {
  const router = useRouter()
  const pathname = usePathname()
  const [watchedStats, setWatchedStats] = useState<any>(null)
  const [mostWatchedMovies, setMostWatchedMovies] = useState<any[]>([])
  const [mostWatchedGenres, setMostWatchedGenres] = useState<any[]>([])
  const [favoriteMovies, setFavoriteMovies] = useState<any[]>([])
  const [favDirectors, setFavDirectors] = useState<any[]>([])
  const [favActors, setFavActors] = useState<any[]>([])
  const [favCompanies, setFavCompanies] = useState<any[]>([])
  const [favCharacters, setFavCharacters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const [
          watchedStatsRes,
          genresRes,
          watchedMoviesRes,
          favoriteMoviesRes,
          favDirectorsRes,
          favActorsRes,
          favCompaniesRes,
          favCharactersRes,
        ] = await Promise.all([
          fetch("/api/film?resource=stats").then(res => res.json()).catch(() => ({ moviesWatched: 0, tvShowsWatched: 0, timeWatchedHours: 0 })),
          fetch("/api/film?source=trakt&resource=genres").then(res => res.json()).catch(() => []),
          fetch("/api/film?resource=watched&limit=20").then(res => res.json()).catch(() => []),
          fetch("/api/film?resource=favorites&type=movies&limit=20").then(res => res.json()).catch(() => []),
          fetch("/api/film?resource=favorites&type=directors").then(res => res.json()).catch(() => []),
          fetch("/api/film?resource=favorites&type=actors").then(res => res.json()).catch(() => []),
          fetch("/api/film?resource=favorites&type=companies").then(res => res.json()).catch(() => []),
          fetch("/api/film?resource=favorites&type=characters").then(res => res.json()).catch(() => []),
        ])

        setWatchedStats(watchedStatsRes)
        setMostWatchedGenres(genresRes)
        setMostWatchedMovies(watchedMoviesRes)
        setFavoriteMovies(favoriteMoviesRes)
        setFavDirectors(favDirectorsRes)
        setFavActors(favActorsRes)
        setFavCompanies(favCompaniesRes)
        setFavCharacters(favCharactersRes)
      } catch (err) {
        setError("Failed to load film data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleTabClick = (tab: "overview" | "watched") => {
    if (tab === "overview") {
      router.push("/film")
    } else {
      router.push("/film/watched")
    }
  }

  const activeTab = pathname === "/film" ? "overview" : "watched"

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-zinc-100 mx-auto mb-4"></div>
          <p className="dark:text-zinc-300">Loading film data...</p>
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
      <section className="film-section">
        <div className="border border-border bg-muted/30 dark:bg-[hsl(var(--popover))]">
          <div className="flex flex-wrap items-center justify-between px-4 py-3 gap-x-6 gap-y-2">
            {/* Stats */}
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-semibold text-foreground">{(watchedStats?.moviesWatched || 0).toLocaleString()}</span>
                <span className="text-muted-foreground">films</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-border" />
              <div className="hidden sm:flex items-baseline gap-1.5">
                <span className="text-xl font-semibold text-foreground">{(watchedStats?.tvShowsWatched || 0).toLocaleString()}</span>
                <span className="text-muted-foreground">this year</span>
              </div>
              <div className="hidden md:block w-px h-4 bg-border" />
              <div className="hidden md:flex items-baseline gap-1.5">
                <span className="text-xl font-semibold text-foreground">{formattedHours}</span>
                <span className="text-muted-foreground">hours</span>
              </div>
            </div>
            {/* Top Genres */}
            {mostWatchedGenres && mostWatchedGenres.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="hidden lg:inline">Top:</span>
                {mostWatchedGenres.slice(0, 4).map((genre: { genre: string; count: number }, i: number) => (
                  <span key={genre.genre} className="text-foreground">
                    {genre.genre}{i < Math.min(mostWatchedGenres.length, 4) - 1 && <span className="text-muted-foreground ml-2">·</span>}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Favorite Movies Section */}
      <section className="film-section">
        <MediaSectionHeader title="Favorite Films" />
        {favoriteMovies && favoriteMovies.length > 0 && (
          <PaginatedCardGrid squareButtons={true}>
            {favoriteMovies.map((movie) => (
              <FilmCard key={movie.id} id={movie.id} title={movie.title} year={movie.year} posterUrl={movie.posterUrl} />
            ))}
          </PaginatedCardGrid>
        )}
      </section>

      {/* Favorite Directors Section */}
      <section className="film-section">
        <MediaSectionHeader title="Favorite Directors" />
        {favDirectors && favDirectors.length > 0 && (
          <PaginatedCardGrid squareButtons={true}>
            {favDirectors.map((director) => (
              <DirectorCard key={director.id} id={director.id} name={director.name} image={director.image} />
            ))}
          </PaginatedCardGrid>
        )}
      </section>

      {/* Favorite Actors Section */}
      <section className="film-section">
        <MediaSectionHeader title="Favorite Actors" />
        {favActors && favActors.length > 0 && (
          <PaginatedCardGrid squareButtons={true}>
            {favActors.map((actor) => (
              <ActorCard key={actor.id} id={actor.id} name={actor.name} image={actor.image} />
            ))}
          </PaginatedCardGrid>
        )}
      </section>

      {/* Favorite Characters Section */}
      <section className="film-section">
        <MediaSectionHeader title="Favorite Characters" />
        {favCharacters && favCharacters.length > 0 && (
          <PaginatedCardGrid squareButtons={true}>
            {favCharacters.map((character) => (
              <FavCharacterCard key={character.id} id={character.id} name={character.name} image={character.image} actor={character.actor} />
            ))}
          </PaginatedCardGrid>
        )}
      </section>

      {/* Watched Movies Section */}
      <section className="film-section">
        <MediaSectionHeader title="Watched" />
        {mostWatchedMovies && mostWatchedMovies.length > 0 && (
          <PaginatedCardGrid squareButtons={true}>
            {mostWatchedMovies.map((movie) => (
              <FilmCard key={movie.id} id={movie.id} title={movie.title} year={movie.year} posterUrl={movie.posterUrl} />
            ))}
          </PaginatedCardGrid>
        )}
      </section>

      {/* Favorite Film Companies Section */}
      <section className="film-section">
        <MediaSectionHeader title="Favorite Film Companies" />
        {favCompanies && favCompanies.length > 0 && (
          <PaginatedCardGrid squareButtons={true}>
            {favCompanies.map((company) => (
              <CompanyCard key={company.id} name={company.name} imageUrl={company.image} description={company.description} />
            ))}
          </PaginatedCardGrid>
        )}
      </section>
    </div>
  )
}

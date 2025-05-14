"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { PageDescription } from "@/components/posts/typography/page-description"
import { TraktHorizontalScroll } from "@/components/trakt/trakt-horizontal-scroll"
import { FilmStatsSection } from "@/components/film/film-stats-section"
import { TraktMovieCard } from "@/components/trakt/trakt-movie-card"
import { TraktShowCard } from "@/components/trakt/trakt-show-card"
import { TraktFavActorCard } from "@/components/trakt/trakt-fav-actor-card"
import { TraktFavCompanyCard } from "@/components/trakt/trakt-fav-company-card"
import { TraktFavCharacterCard } from "@/components/trakt/trakt-fav-character-card"
import { TraktFavDirectorCard } from "@/components/trakt/trakt-fav-director-card"
import { TraktEmptyState } from "@/components/trakt/trakt-empty-state"
import { TraktSectionHeader } from "@/components/trakt/trakt-section-header"

export default function FilmClientPage() {
  const [watchedStats, setWatchedStats] = useState<any>(null)
  const [recentMovies, setRecentMovies] = useState<any[]>([])
  const [recentShows, setRecentShows] = useState<any[]>([])
  const [mostWatchedMovies, setMostWatchedMovies] = useState<any[]>([])
  const [mostWatchedShows, setMostWatchedShows] = useState<any[]>([])
  const [mostWatchedGenres, setMostWatchedGenres] = useState<any[]>([])
  const [favoriteMovies, setFavoriteMovies] = useState<any[]>([])
  const [favoriteShows, setFavoriteShows] = useState<any[]>([])
  const [favDirectors, setFavDirectors] = useState<any[]>([])
  const [favActors, setFavActors] = useState<any[]>([])
  const [favCompanies, setFavCompanies] = useState<any[]>([])
  const [favCharacters, setFavCharacters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      console.log("FilmClientPage: Starting to fetch data")
      setLoading(true)

      try {
        console.log("FilmClientPage: Fetching API data")
        // Fetch API data
        const [
          watchedStatsRes,
          genresRes,
          recentMoviesRes,
          recentShowsRes,
          mostWatchedMoviesRes,
          mostWatchedShowsRes,
          favoriteMoviesRes,
          favoriteShowsRes,
          favDirectorsRes,
          favActorsRes,
          favCompaniesRes,
          favCharactersRes,
        ] = await Promise.all([
          fetch("/api/film/stats")
            .then((res) => {
              console.log("FilmClientPage: Stats response status:", res.status)
              return res.json()
            })
            .catch((err) => {
              console.error("FilmClientPage: Error fetching stats:", err)
              return { movies: 0, episodes: 0, minutes: 0 }
            }),
          fetch("/api/film/genres")
            .then((res) => {
              console.log("FilmClientPage: Genres response status:", res.status)
              return res.json()
            })
            .catch((err) => {
              console.error("FilmClientPage: Error fetching genres:", err)
              return []
            }),
          fetch("/api/film/recent-movies?limit=20")
            .then((res) => {
              console.log("FilmClientPage: Recent movies response status:", res.status)
              return res.json()
            })
            .catch((err) => {
              console.error("FilmClientPage: Error fetching recent movies:", err)
              return []
            }),
          fetch("/api/film/recent-shows?limit=20")
            .then((res) => {
              console.log("FilmClientPage: Recent shows response status:", res.status)
              return res.json()
            })
            .catch((err) => {
              console.error("FilmClientPage: Error fetching recent shows:", err)
              return []
            }),
          fetch("/api/film/most-watched-movies?limit=20")
            .then((res) => {
              console.log("FilmClientPage: Most watched movies response status:", res.status)
              return res.json()
            })
            .catch((err) => {
              console.error("FilmClientPage: Error fetching most watched movies:", err)
              return []
            }),
          fetch("/api/film/most-watched-shows?limit=20")
            .then((res) => {
              console.log("FilmClientPage: Most watched shows response status:", res.status)
              return res.json()
            })
            .catch((err) => {
              console.error("FilmClientPage: Error fetching most watched shows:", err)
              return []
            }),
          fetch("/api/film/favorite-movies?limit=20")
            .then((res) => {
              console.log("FilmClientPage: Favorite movies response status:", res.status)
              return res.json()
            })
            .catch((err) => {
              console.error("FilmClientPage: Error fetching favorite movies:", err)
              return []
            }),
          fetch("/api/film/favorite-shows?limit=20")
            .then((res) => {
              console.log("FilmClientPage: Favorite shows response status:", res.status)
              return res.json()
            })
            .catch((err) => {
              console.error("FilmClientPage: Error fetching favorite shows:", err)
              return []
            }),
          // JSON-based favorites
          fetch("/api/film/fav-directors")
            .then((res) => {
              console.log("FilmClientPage: Favorite directors response status:", res.status)
              return res.json()
            })
            .catch((err) => {
              console.error("FilmClientPage: Error fetching favorite directors:", err)
              return []
            }),
          fetch("/api/film/fav-actors")
            .then((res) => {
              console.log("FilmClientPage: Favorite actors response status:", res.status)
              return res.json()
            })
            .catch((err) => {
              console.error("FilmClientPage: Error fetching favorite actors:", err)
              return []
            }),
          fetch("/api/film/fav-companies")
            .then((res) => {
              console.log("FilmClientPage: Favorite companies response status:", res.status)
              return res.json()
            })
            .catch((err) => {
              console.error("FilmClientPage: Error fetching favorite companies:", err)
              return []
            }),
          fetch("/api/film/fav-characters")
            .then((res) => {
              console.log("FilmClientPage: Favorite characters response status:", res.status)
              return res.json()
            })
            .catch((err) => {
              console.error("FilmClientPage: Error fetching favorite characters:", err)
              return []
            }),
        ])

        console.log("FilmClientPage: API data fetched, setting state")

        // Log received data
        console.log("FilmClientPage: Recent movies received:", recentMoviesRes.length)
        if (recentMoviesRes.length > 0) {
          console.log("FilmClientPage: Sample movie data:", {
            title: recentMoviesRes[0].title,
            posterUrl: recentMoviesRes[0].posterUrl,
          })
        }

        console.log("FilmClientPage: Recent shows received:", recentShowsRes.length)
        if (recentShowsRes.length > 0) {
          console.log("FilmClientPage: Sample show data:", {
            title: recentShowsRes[0].title,
            posterUrl: recentShowsRes[0].posterUrl,
          })
        }

        // Set API data
        setWatchedStats(watchedStatsRes)
        setMostWatchedGenres(genresRes)
        setRecentMovies(recentMoviesRes)
        setRecentShows(recentShowsRes)
        setMostWatchedMovies(mostWatchedMoviesRes)
        setMostWatchedShows(mostWatchedShowsRes)
        setFavoriteMovies(favoriteMoviesRes)
        setFavoriteShows(favoriteShowsRes)
        
        // Set JSON-based favorites data
        setFavDirectors(favDirectorsRes)
        setFavActors(favActorsRes)
        setFavCompanies(favCompaniesRes)
        setFavCharacters(favCharactersRes)

        console.log("FilmClientPage: All data fetched and state set")
      } catch (err) {
        console.error("FilmClientPage: Error fetching film data:", err)
        setError("Failed to load film data. Please try again later.")
      } finally {
        setLoading(false)
        console.log("FilmClientPage: Loading complete")
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="film-page">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-zinc-100 mx-auto mb-4"></div>
            <p className="dark:text-zinc-300">Loading film data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    console.error("FilmClientPage: Rendering error state:", error)
    return (
      <div className="film-page">
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

  console.log("FilmClientPage: Rendering content with data")
  console.log("FilmClientPage: Recent movies count:", recentMovies.length)
  console.log("FilmClientPage: Recent shows count:", recentShows.length)

  return (
    <div className="film-page">
      {/* PageDescription component instead of modal and help button */}
      <PageDescription 
        title="Film Page Help"
        description="This page displays Kris's film and TV watching activity and preferences. View Kris's profile information and watching statistics. Browse through the most recent movies and TV episodes Kris has watched. Explore Kris's favorite movies, shows, actors, producers, and characters."
      />

      {/* Page Header */}
      <PageHeader
        title="Film"
        subtitle=""
        date="2025-01-01"
        preview="a compilation of all the films I've watched to date"
        status="In Progress"
        confidence="certain"
        importance={8}
      />

      {/* Stats Section */}
      <section className="film-section">
        <TraktSectionHeader title="" />
        <FilmStatsSection
          moviesCount={watchedStats?.movies || 0}
          episodesCount={watchedStats?.episodes || 0}
          minutesWatched={watchedStats?.minutes || 0}
        />
      </section>

      {/* Genres Section */}
      <section className="film-section">
        <TraktSectionHeader title="Most Watched Genres" />
        {mostWatchedGenres && mostWatchedGenres.length > 0 ? (
          <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-md border border-gray-200 dark:border-zinc-800 p-4">
            <div className="flex flex-wrap gap-2">
              {mostWatchedGenres.slice(0, 12).map((genre) => (
                <div
                  key={genre.name}
                  className="bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-zinc-200 px-3 py-1 rounded-md text-sm"
                >
                  {genre.name} ({genre.count})
                </div>
              ))}
            </div>
          </div>
        ) : (
          <TraktEmptyState message="No genre data available." />
        )}
      </section>

      {/* Recently Watched Movies Section */}
      <section className="film-section">
        <TraktSectionHeader title="Recently Watched Movies" />
        {recentMovies && recentMovies.length > 0 ? (
          <TraktHorizontalScroll>
            {recentMovies.map((movie) => (
              <TraktMovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                year={movie.year}
                posterUrl={movie.posterUrl}
              />
            ))}
          </TraktHorizontalScroll>
        ) : (
          <TraktEmptyState message="No recently watched movies available." />
        )}
      </section>

      {/* Recently Watched Shows Section */}
      <section className="film-section">
        <TraktSectionHeader title="Recently Watched Shows" />
        {recentShows && recentShows.length > 0 ? (
          <TraktHorizontalScroll>
            {recentShows.map((show) => (
              <TraktShowCard
                key={show.id}
                id={show.id}
                title={show.title}
                year={show.year}
                posterUrl={show.posterUrl}
              />
            ))}
          </TraktHorizontalScroll>
        ) : (
          <TraktEmptyState message="No recently watched shows available." />
        )}
      </section>

      {/* Most Watched Movies Section */}
      <section className="film-section">
        <TraktSectionHeader title="Most Watched Movies" />
        {mostWatchedMovies && mostWatchedMovies.length > 0 ? (
          <TraktHorizontalScroll>
            {mostWatchedMovies.map((movie) => (
              <TraktMovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                year={movie.year}
                posterUrl={movie.posterUrl}
              />
            ))}
          </TraktHorizontalScroll>
        ) : (
          <TraktEmptyState message="No most watched movies available." />
        )}
      </section>

      {/* Most Watched Shows Section */}
      <section className="film-section">
        <TraktSectionHeader title="Most Watched Shows" />
        {mostWatchedShows && mostWatchedShows.length > 0 ? (
          <TraktHorizontalScroll>
            {mostWatchedShows.map((show) => (
              <TraktShowCard
                key={show.id}
                id={show.id}
                title={show.title}
                year={show.year}
                posterUrl={show.posterUrl}
              />
            ))}
          </TraktHorizontalScroll>
        ) : (
          <TraktEmptyState message="No most watched shows available." />
        )}
      </section>

      {/* Favorite Movies Section */}
      <section className="film-section">
        <TraktSectionHeader title="Favorite Movies" />
        {favoriteMovies && favoriteMovies.length > 0 ? (
          <TraktHorizontalScroll>
            {favoriteMovies.map((movie) => (
              <TraktMovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                year={movie.year}
                posterUrl={movie.posterUrl}
              />
            ))}
          </TraktHorizontalScroll>
        ) : (
          <TraktEmptyState message="No favorite movies available." />
        )}
      </section>

      {/* Favorite Shows Section */}
      <section className="film-section">
        <TraktSectionHeader title="Favorite Shows" />
        {favoriteShows && favoriteShows.length > 0 ? (
          <TraktHorizontalScroll>
            {favoriteShows.map((show) => (
              <TraktShowCard
                key={show.id}
                id={show.id}
                title={show.title}
                year={show.year}
                posterUrl={show.posterUrl}
              />
            ))}
          </TraktHorizontalScroll>
        ) : (
          <TraktEmptyState message="No favorite shows available." />
        )}
      </section>

      {/* Favorite Directors Section - JSON-based */}
      <section className="film-section">
        <TraktSectionHeader title="Favorite Directors" />
        {favDirectors && favDirectors.length > 0 ? (
          <TraktHorizontalScroll>
            {favDirectors.map((director) => (
              <TraktFavDirectorCard key={director.id} id={director.id} name={director.name} image={director.image} />
            ))}
          </TraktHorizontalScroll>
        ) : (
          <TraktEmptyState message="No favorite directors available." />
        )}
      </section>

      {/* Favorite Actors Section - JSON-based */}
      <section className="film-section">
        <TraktSectionHeader title="Favorite Actors" />
        {favActors && favActors.length > 0 ? (
          <TraktHorizontalScroll>
            {favActors.map((actor) => (
              <TraktFavActorCard key={actor.id} id={actor.id} name={actor.name} image={actor.image} />
            ))}
          </TraktHorizontalScroll>
        ) : (
          <TraktEmptyState message="No favorite actors available." />
        )}
      </section>

      {/* Favorite Characters Section - JSON-based */}
      <section className="film-section">
        <TraktSectionHeader title="Favorite Characters" />
        {favCharacters && favCharacters.length > 0 ? (
          <TraktHorizontalScroll>
            {favCharacters.map((character) => (
              <TraktFavCharacterCard
                key={character.id}
                id={character.id}
                name={character.name}
                image={character.image}
                actor={character.actor} // Pass the actor name to the component
              />
            ))}
          </TraktHorizontalScroll>
        ) : (
          <TraktEmptyState message="No favorite characters available." />
        )}
      </section>

      {/* Favorite Film Companies Section - JSON-based */}
      <section className="film-section">
        <TraktSectionHeader title="Favorite Film Companies" />
        {favCompanies && favCompanies.length > 0 ? (
          <TraktHorizontalScroll>
            {favCompanies.map((company) => (
              <TraktFavCompanyCard
                key={company.id}
                id={company.id}
                name={company.name}
                image={company.image}
                description={company.description}
              />
            ))}
          </TraktHorizontalScroll>
        ) : (
          <TraktEmptyState message="No favorite film companies available." />
        )}
      </section>
    </div>
  )
}


"use client"

import { useState, useEffect } from "react"
import { HelpCircle } from "lucide-react"
import { TraktHelpModal } from "@/components/trakt/trakt-help-modal"
import { TraktHorizontalScroll } from "@/components/trakt/trakt-horizontal-scroll"
import { TraktStatsSection } from "@/components/trakt/trakt-stats-section"
import { TraktProfileHeader } from "@/components/trakt/trakt-profile-header"
import { TraktMovieCard } from "@/components/trakt/trakt-movie-card"
import { TraktShowCard } from "@/components/trakt/trakt-show-card"
import { TraktFavActorCard } from "@/components/trakt/trakt-fav-actor-card"
import { TraktFavCompanyCard } from "@/components/trakt/trakt-fav-company-card"
import { TraktFavCharacterCard } from "@/components/trakt/trakt-fav-character-card"
import { TraktFavProducerCard } from "@/components/trakt/trakt-fav-producer-card"
import { TraktEmptyState } from "@/components/trakt/trakt-empty-state"
import { TraktSectionHeader } from "@/components/trakt/trakt-section-header"

export default function FilmClientPage() {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [watchedCounts, setWatchedCounts] = useState<any>(null)
  const [recentMovies, setRecentMovies] = useState<any[]>([])
  const [recentShows, setRecentShows] = useState<any[]>([]) // Changed from recentEpisodes to recentShows
  const [mostWatchedGenres, setMostWatchedGenres] = useState<any[]>([])
  const [mostWatchedShows, setMostWatchedShows] = useState<any[]>([])
  const [favoriteMovies, setFavoriteMovies] = useState<any[]>([])
  const [favoriteShows, setFavoriteShows] = useState<any[]>([])
  const [favProducers, setFavProducers] = useState<any[]>([])
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
          userDataRes,
          watchedCountsRes,
          recentMoviesRes,
          recentShowsRes, // Changed from recentEpisodesRes to recentShowsRes
          mostWatchedGenresRes,
          mostWatchedShowsRes,
          favoriteMoviesRes,
          favoriteShowsRes,
        ] = await Promise.all([
          fetch("/api/trakt/user-data")
            .then((res) => {
              console.log("FilmClientPage: User data response status:", res.status)
              return res.json()
            })
            .catch((err) => {
              console.error("FilmClientPage: Error fetching user data:", err)
              return null
            }),
          fetch("/api/trakt/watched-counts")
            .then((res) => {
              console.log("FilmClientPage: Watched counts response status:", res.status)
              return res.json()
            })
            .catch((err) => {
              console.error("FilmClientPage: Error fetching watched counts:", err)
              return { movies: 0, episodes: 0, minutes: 0 }
            }),
          fetch("/api/trakt/recent-movies?limit=20")
            .then((res) => {
              console.log("FilmClientPage: Recent movies response status:", res.status)
              return res.json()
            })
            .catch((err) => {
              console.error("FilmClientPage: Error fetching recent movies:", err)
              return []
            }),
          fetch("/api/trakt/recent-shows?limit=20") // Changed from recent-episodes to recent-shows
            .then((res) => {
              console.log("FilmClientPage: Recent shows response status:", res.status)
              return res.json()
            })
            .catch((err) => {
              console.error("FilmClientPage: Error fetching recent shows:", err)
              return []
            }),
          fetch("/api/trakt/most-watched-genres")
            .then((res) => {
              console.log("FilmClientPage: Most watched genres response status:", res.status)
              return res.json()
            })
            .catch((err) => {
              console.error("FilmClientPage: Error fetching most watched genres:", err)
              return []
            }),
          fetch("/api/trakt/most-watched-shows?limit=20")
            .then((res) => {
              console.log("FilmClientPage: Most watched shows response status:", res.status)
              return res.json()
            })
            .catch((err) => {
              console.error("FilmClientPage: Error fetching most watched shows:", err)
              return []
            }),
          fetch("/api/trakt/favorite-movies?limit=20")
            .then((res) => {
              console.log("FilmClientPage: Favorite movies response status:", res.status)
              return res.json()
            })
            .catch((err) => {
              console.error("FilmClientPage: Error fetching favorite movies:", err)
              return []
            }),
          fetch("/api/trakt/favorite-shows?limit=20")
            .then((res) => {
              console.log("FilmClientPage: Favorite shows response status:", res.status)
              return res.json()
            })
            .catch((err) => {
              console.error("FilmClientPage: Error fetching favorite shows:", err)
              return []
            }),
        ])

        console.log("FilmClientPage: API data fetched, setting state")

        // Log received data
        console.log("FilmClientPage: Recent movies received:", recentMoviesRes.length)
        if (recentMoviesRes.length > 0) {
          console.log("FilmClientPage: Sample movie data:", {
            title: recentMoviesRes[0].movie?.title,
            posterUrl: recentMoviesRes[0].posterUrl,
          })
        }

        console.log("FilmClientPage: Recent shows received:", recentShowsRes.length) // Changed from episodes to shows
        if (recentShowsRes.length > 0) {
          console.log("FilmClientPage: Sample show data:", {
            // Changed from episode to show
            title: recentShowsRes[0].show?.title,
            posterUrl: recentShowsRes[0].posterUrl,
          })
        }

        // Set API data
        setUserData(userDataRes)
        setWatchedCounts(watchedCountsRes)
        setRecentMovies(recentMoviesRes)
        setRecentShows(recentShowsRes) // Changed from setRecentEpisodes to setRecentShows
        setMostWatchedGenres(mostWatchedGenresRes)
        setMostWatchedShows(mostWatchedShowsRes)
        setFavoriteMovies(favoriteMoviesRes)
        setFavoriteShows(favoriteShowsRes)

        console.log("FilmClientPage: Fetching JSON data for favorites")
        // Fetch JSON data for favorites
        const [producersRes, actorsRes, companiesRes, charactersRes] = await Promise.all([
          fetch("/api/trakt/fav-producers")
            .then((res) => {
              console.log("FilmClientPage: Favorite producers response status:", res.status)
              return res.json()
            })
            .catch((err) => {
              console.error("FilmClientPage: Error fetching favorite producers:", err)
              return []
            }),
          fetch("/api/trakt/fav-actors")
            .then((res) => {
              console.log("FilmClientPage: Favorite actors response status:", res.status)
              return res.json()
            })
            .catch((err) => {
              console.error("FilmClientPage: Error fetching favorite actors:", err)
              return []
            }),
          fetch("/api/trakt/fav-companies")
            .then((res) => {
              console.log("FilmClientPage: Favorite companies response status:", res.status)
              return res.json()
            })
            .catch((err) => {
              console.error("FilmClientPage: Error fetching favorite companies:", err)
              return []
            }),
          fetch("/api/trakt/fav-characters")
            .then((res) => {
              console.log("FilmClientPage: Favorite characters response status:", res.status)
              return res.json()
            })
            .catch((err) => {
              console.error("FilmClientPage: Error fetching favorite characters:", err)
              return []
            }),
        ])

        console.log("FilmClientPage: JSON data fetched, setting state")

        // Set JSON data
        setFavProducers(producersRes)
        setFavActors(actorsRes)
        setFavCompanies(companiesRes)
        setFavCharacters(charactersRes)

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
  console.log("FilmClientPage: Recent shows count:", recentShows.length) // Changed from episodes to shows

  return (
    <div className="film-page">
      {/* Help Modal */}
      <TraktHelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />

      {/* Help button - moved to bottom left */}
      <button
        onClick={() => setIsHelpModalOpen(true)}
        className="fixed bottom-4 left-4 p-2 rounded-full bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 dark:hover:bg-zinc-700 transition-colors z-10"
        aria-label="Help"
      >
        <HelpCircle className="h-5 w-5 dark:text-zinc-300" />
      </button>

      {/* Profile Header */}
      <TraktProfileHeader
        username={userData?.username || "krisyotam"}
        fullName={userData?.name || "Kris Yotam"}
        avatar={userData?.images?.avatar?.full || "/placeholder.svg?height=96&width=96"}
        bio={userData?.about || "Film enthusiast and creator."}
        joinedAt={userData?.joined_at || "2020-01-01T00:00:00.000Z"}
        location={userData?.location || "Digital Nomad"}
        vip={userData?.vip || false}
      />

      {/* Stats Section */}
      <section className="film-section">
        <TraktSectionHeader title="" />
        <TraktStatsSection
          moviesCount={watchedCounts?.movies || 0}
          episodesCount={watchedCounts?.episodes || 0}
          minutesWatched={watchedCounts?.minutes || 0}
        />
      </section>

      {/* Genres Section */}
      <section className="film-section">
        <TraktSectionHeader title="" />
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
            {recentMovies.map((item) => (
              <TraktMovieCard
                key={item.id || `movie-${Math.random()}`}
                id={item.movie?.ids?.trakt || Math.floor(Math.random() * 1000)}
                title={item.movie?.title || "Movie Title"}
                year={item.movie?.year}
                posterUrl={item.posterUrl || "/placeholder.svg?height=270&width=180"}
              />
            ))}
          </TraktHorizontalScroll>
        ) : (
          <TraktEmptyState message="No recently watched movies available." />
        )}
      </section>

      {/* Recently Watched Shows Section - Changed from Episodes to Shows */}
      <section className="film-section">
        <TraktSectionHeader title="Recently Watched Shows" />
        {recentShows && recentShows.length > 0 ? (
          <TraktHorizontalScroll>
            {recentShows.map((item) => (
              <TraktShowCard
                key={item.id || `show-${Math.random()}`}
                id={item.show?.ids?.trakt || Math.floor(Math.random() * 1000)}
                title={item.show?.title || "Show Title"}
                year={item.show?.year}
                posterUrl={item.posterUrl || "/placeholder.svg?height=270&width=180"}
              />
            ))}
          </TraktHorizontalScroll>
        ) : (
          <TraktEmptyState message="No recently watched shows available." />
        )}
      </section>

      {/* Most Watched Shows Section */}
      <section className="film-section">
        <TraktSectionHeader title="Most Watched Shows" />
        {mostWatchedShows && mostWatchedShows.length > 0 ? (
          <TraktHorizontalScroll>
            {mostWatchedShows.map((item) => (
              <TraktShowCard
                key={item.show?.ids?.trakt || `show-${Math.random()}`}
                id={item.show?.ids?.trakt || Math.floor(Math.random() * 1000)}
                title={item.show?.title || "Show Title"}
                year={item.show?.year}
                posterUrl={item.posterUrl || "/placeholder.svg?height=270&width=180"}
              />
            ))}
          </TraktHorizontalScroll>
        ) : (
          <TraktEmptyState message="No most watched shows available." />
        )}
      </section>

      {/* Favorites Section */}
      <section className="film-section">
        <TraktSectionHeader title="Favorite Movies & Shows" />
        {(favoriteMovies && favoriteMovies.length > 0) || (favoriteShows && favoriteShows.length > 0) ? (
          <TraktHorizontalScroll>
            {favoriteMovies.map((item) => (
              <TraktMovieCard
                key={item.movie?.ids?.trakt || `fav-movie-${Math.random()}`}
                id={item.movie?.ids?.trakt || Math.floor(Math.random() * 1000)}
                title={item.movie?.title || "Movie Title"}
                year={item.movie?.year}
                posterUrl={item.posterUrl || "/placeholder.svg?height=270&width=180"}
              />
            ))}
            {favoriteShows.map((item) => (
              <TraktShowCard
                key={item.show?.ids?.trakt || `fav-show-${Math.random()}`}
                id={item.show?.ids?.trakt || Math.floor(Math.random() * 1000)}
                title={item.show?.title || "Show Title"}
                year={item.show?.year}
                posterUrl={item.posterUrl || "/placeholder.svg?height=270&width=180"}
              />
            ))}
          </TraktHorizontalScroll>
        ) : (
          <TraktEmptyState message="No favorite movies or shows available." />
        )}
      </section>

      {/* Favorite Producers Section - JSON-based */}
      <section className="film-section">
        <TraktSectionHeader title="Favorite Producers" />
        {favProducers && favProducers.length > 0 ? (
          <TraktHorizontalScroll>
            {favProducers.map((producer) => (
              <TraktFavProducerCard key={producer.id} id={producer.id} name={producer.name} image={producer.image} />
            ))}
          </TraktHorizontalScroll>
        ) : (
          <TraktEmptyState message="No favorite producers available." />
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
    </div>
  )
}


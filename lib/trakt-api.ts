// Trakt API client
const TRAKT_API_URL = "https://api.trakt.tv"
const TMDB_API_URL = "https://api.themoviedb.org/3"
const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p/w500"

// Helper function to get access token
async function getAccessToken() {
  const accessToken = process.env.TRAKT_TV_ACCESS_TOKEN
  const refreshToken = process.env.TRAKT_TV_REFRESH_TOKEN
  const clientId = process.env.TRAKT_TV_CLIENT_ID
  const clientSecret = process.env.TRAKT_TV_CLIENT_SECRET

  console.log("Attempting to get Trakt access token")

  // If we have an access token, use it
  if (accessToken) {
    console.log("Using existing access token")
    return accessToken
  }

  // If we have a refresh token, try to get a new access token
  if (refreshToken && clientId && clientSecret) {
    console.log("Attempting to refresh token")
    try {
      const response = await fetch(`${TRAKT_API_URL}/oauth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: "urn:ietf:wg:oauth:2.0:oob",
          grant_type: "refresh_token",
        }),
      })

      if (!response.ok) {
        console.error(`Failed to refresh token: ${response.statusText}`)
        throw new Error(`Failed to refresh token: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Successfully refreshed token")

      return data.access_token
    } catch (error) {
      console.error("Error refreshing token:", error)
      throw error
    }
  }

  console.error("No access token or refresh token available")
  throw new Error("No access token or refresh token available")
}

// Helper function to make authenticated requests to Trakt API
async function traktFetch(endpoint: string, options: RequestInit = {}) {
  console.log(`Fetching from Trakt API: ${endpoint}`)
  try {
    const accessToken = await getAccessToken()
    const clientId = process.env.TRAKT_TV_CLIENT_ID

    const response = await fetch(`${TRAKT_API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "trakt-api-version": "2",
        "trakt-api-key": clientId as string,
        ...options.headers,
      },
    })

    if (!response.ok) {
      console.error(`Trakt API error: ${response.statusText} for ${endpoint}`)
      throw new Error(`Trakt API error: ${response.statusText}`)
    }

    const data = await response.json()
    console.log(`Successfully fetched data from ${endpoint}`)
    return data
  } catch (error) {
    console.error(`Error fetching from Trakt API (${endpoint}):`, error)
    throw error
  }
}

// Helper function to get poster URLs from TMDB
async function getTMDBImages(items: any[], type: "movie" | "show" | "episode") {
  console.log(`Getting TMDB images for ${items.length} ${type}s`)

  // IMPORTANT: Fixed the typo in the environment variable name
  const tmdbApiKey = process.env.TMDB_API_KEY

  console.log(`TMDB API Key found: ${tmdbApiKey ? "YES" : "NO"}`)

  if (!tmdbApiKey) {
    console.error("TMDB_API_KEY not found in environment variables! Check your .env.local file.")
    console.log(
      "Available environment variables:",
      Object.keys(process.env)
        .filter((key) => key.includes("TMB") || key.includes("TRAKT"))
        .join(", "),
    )
    return items.map((item) => ({
      ...item,
      posterUrl: `/placeholder.svg?height=270&width=180&text=${encodeURIComponent(
        type === "episode"
          ? item.show?.title || "Episode"
          : item[type]?.title || type.charAt(0).toUpperCase() + type.slice(1),
      )}`,
    }))
  }

  console.log(`Using TMDB API Key: ${tmdbApiKey.substring(0, 4)}...${tmdbApiKey.substring(tmdbApiKey.length - 4)}`)

  try {
    const itemsWithPosters = await Promise.all(
      items.map(async (item, index) => {
        let tmdbId
        let posterPath = null
        let title = ""

        // For episodes, we need the show's TMDB ID
        if (type === "episode") {
          tmdbId = item.show?.ids?.tmdb
          title = item.show?.title || "Episode"
        } else {
          tmdbId = item[type]?.ids?.tmdb
          title = item[type]?.title || type.charAt(0).toUpperCase() + type.slice(1)
        }

        console.log(`[${index}] Processing ${type}: "${title}" with TMDB ID: ${tmdbId || "None"}`)

        if (!tmdbId) {
          console.error(`[${index}] No TMDB ID found for ${type}: "${title}". Using placeholder.`)
          return {
            ...item,
            posterUrl: `/placeholder.svg?height=270&width=180&text=${encodeURIComponent(title)}`,
          }
        }

        let endpoint = ""
        if (type === "movie") {
          endpoint = `/movie/${tmdbId}?api_key=${tmdbApiKey}`
        } else if (type === "show") {
          endpoint = `/tv/${tmdbId}?api_key=${tmdbApiKey}`
        } else if (type === "episode") {
          const season = item.episode?.season
          const number = item.episode?.number

          if (!season || !number) {
            console.error(`[${index}] Missing season or episode number for "${title}". Using show poster instead.`)
            endpoint = `/tv/${tmdbId}?api_key=${tmdbApiKey}`
          } else {
            endpoint = `/tv/${tmdbId}/season/${season}/episode/${number}?api_key=${tmdbApiKey}`
          }
        }

        const tmdbUrl = `${TMDB_API_URL}${endpoint}`
        console.log(`[${index}] Fetching TMDB data from: ${tmdbUrl}`)

        try {
          const response = await fetch(tmdbUrl)

          console.log(`[${index}] TMDB response status: ${response.status} ${response.statusText}`)

          if (!response.ok) {
            console.error(`[${index}] Failed to fetch TMDB data for ${type} with ID ${tmdbId}. Using placeholder.`)
            return {
              ...item,
              posterUrl: `/placeholder.svg?height=270&width=180&text=${encodeURIComponent(title)}`,
            }
          }

          const data = await response.json()
          console.log(`[${index}] TMDB data received for "${title}"`)

          if (type === "episode") {
            // For episodes, use the still image or fall back to the show's poster
            posterPath = data.still_path
            console.log(`[${index}] Episode still path: ${posterPath || "None"}`)

            if (!posterPath) {
              console.log(`[${index}] No still image for episode, fetching show poster`)
              const showEndpoint = `/tv/${tmdbId}?api_key=${tmdbApiKey}`
              const showUrl = `${TMDB_API_URL}${showEndpoint}`

              try {
                const showResponse = await fetch(showUrl)

                if (showResponse.ok) {
                  const showData = await showResponse.json()
                  posterPath = showData.poster_path
                  console.log(`[${index}] Show poster path: ${posterPath || "None"}`)
                } else {
                  console.error(
                    `[${index}] Failed to fetch show data: ${showResponse.status} ${showResponse.statusText}`,
                  )
                }
              } catch (showError) {
                console.error(`[${index}] Error fetching show data:`, showError)
              }
            }
          } else {
            posterPath = data.poster_path
            console.log(
              `[${index}] ${type.charAt(0).toUpperCase() + type.slice(1)} poster path: ${posterPath || "None"}`,
            )
          }

          let posterUrl
          if (posterPath) {
            posterUrl = `${TMDB_IMAGE_URL}${posterPath}`
            console.log(`[${index}] Full poster URL: ${posterUrl}`)

            // Test if the image is accessible
            try {
              const imgResponse = await fetch(posterUrl, { method: "HEAD" })
              console.log(`[${index}] Image accessibility check: ${imgResponse.status} ${imgResponse.statusText}`)

              if (!imgResponse.ok) {
                console.error(`[${index}] Image not accessible at ${posterUrl}. Using placeholder.`)
                posterUrl = `/placeholder.svg?height=270&width=180&text=${encodeURIComponent(title)}`
              }
            } catch (imgError) {
              console.error(`[${index}] Error checking image accessibility:`, imgError)
              posterUrl = `/placeholder.svg?height=270&width=180&text=${encodeURIComponent(title)}`
            }
          } else {
            posterUrl = `/placeholder.svg?height=270&width=180&text=${encodeURIComponent(title)}`
            console.log(`[${index}] Using placeholder for "${title}": ${posterUrl}`)
          }

          return { ...item, posterUrl }
        } catch (fetchError) {
          console.error(`[${index}] Error fetching TMDB data:`, fetchError)
          return {
            ...item,
            posterUrl: `/placeholder.svg?height=270&width=180&text=${encodeURIComponent(title)}`,
          }
        }
      }),
    )

    console.log(`Processed ${itemsWithPosters.length} items with posters`)
    return itemsWithPosters
  } catch (error) {
    console.error("Error in getTMDBImages:", error)
    // Return items with placeholder images on error
    return items.map((item) => ({
      ...item,
      posterUrl: `/placeholder.svg?height=270&width=180&text=${encodeURIComponent(
        type === "episode"
          ? item.show?.title || "Episode"
          : item[type]?.title || type.charAt(0).toUpperCase() + type.slice(1),
      )}`,
    }))
  }
}

// API functions
export async function getUserProfile() {
  console.log("Fetching user profile")
  try {
    const data = await traktFetch("/users/me?extended=full")
    return data
  } catch (error) {
    console.error("Error fetching user profile:", error)
    throw error
  }
}

export async function getRecentlyWatchedMovies(limit = 10) {
  console.log(`Fetching recently watched movies with limit ${limit}`)
  try {
    const history = await traktFetch(`/sync/history?type=movies&limit=${limit}&extended=full`)
    console.log(`Got ${history.length} recently watched movies from Trakt`)

    const moviesWithPosters = await getTMDBImages(history, "movie")
    console.log(`Processed ${moviesWithPosters.length} movies with posters`)

    // Log the first few items to see what we're getting
    moviesWithPosters.slice(0, 3).forEach((movie, i) => {
      console.log(`Movie ${i}: ${movie.movie?.title}, Poster URL: ${movie.posterUrl}`)
    })

    return moviesWithPosters
  } catch (error) {
    console.error("Error fetching recently watched movies:", error)
    throw error
  }
}

export async function getRecentlyWatchedEpisodes(limit = 10) {
  console.log(`Fetching recently watched episodes with limit ${limit}`)
  try {
    const history = await traktFetch(`/sync/history?type=episodes&limit=${limit}&extended=full`)
    console.log(`Got ${history.length} recently watched episodes from Trakt`)

    const episodesWithPosters = await getTMDBImages(history, "episode")
    console.log(`Processed ${episodesWithPosters.length} episodes with posters`)

    // Log the first few items to see what we're getting
    episodesWithPosters.slice(0, 3).forEach((episode, i) => {
      console.log(`Episode ${i}: ${episode.show?.title} - ${episode.episode?.title}, Poster URL: ${episode.posterUrl}`)
    })

    return episodesWithPosters
  } catch (error) {
    console.error("Error fetching recently watched episodes:", error)
    throw error
  }
}

// Add this new function to get recently watched shows
export async function getRecentlyWatchedShows(limit = 10) {
  console.log(`Fetching recently watched shows with limit ${limit}`)
  try {
    // Get history of episodes
    const history = await traktFetch(`/sync/history?type=episodes&limit=${limit * 2}&extended=full`)
    console.log(`Got ${history.length} episode history items from Trakt`)

    // Extract unique shows from the episode history
    const uniqueShows = new Map()
    history.forEach((item: any) => {
      if (item.show && item.show.ids && item.show.ids.trakt) {
        const showId = item.show.ids.trakt
        if (!uniqueShows.has(showId)) {
          uniqueShows.set(showId, {
            show: item.show,
            watched_at: item.watched_at,
          })
        }
      }
    })

    // Convert to array and sort by most recently watched
    const recentShows = Array.from(uniqueShows.values())
      .sort((a: any, b: any) => new Date(b.watched_at).getTime() - new Date(a.watched_at).getTime())
      .slice(0, limit)

    console.log(`Extracted ${recentShows.length} unique recently watched shows`)

    // Get posters for the shows
    const showsWithPosters = await getTMDBImages(recentShows, "show")
    console.log(`Processed ${showsWithPosters.length} recently watched shows with posters`)

    // Log the first few items to see what we're getting
    showsWithPosters.slice(0, 3).forEach((show, i) => {
      console.log(`Recent Show ${i}: ${show.show?.title}, Poster URL: ${show.posterUrl}`)
    })

    return showsWithPosters
  } catch (error) {
    console.error("Error fetching recently watched shows:", error)
    throw error
  }
}

export async function getMostWatchedGenres() {
  console.log("Fetching data for most watched genres calculation")
  try {
    // Try to get genres from history instead of watched
    // This is a fallback approach that might be more reliable
    const [movieHistory, showHistory] = await Promise.all([
      traktFetch("/sync/history?type=movies&limit=100&extended=full").catch(() => []),
      traktFetch("/sync/history?type=episodes&limit=100&extended=full").catch(() => []),
    ])

    console.log(`Retrieved ${movieHistory.length} movies and ${showHistory.length} episodes for genre calculation`)

    // Extract genres from movies and shows
    const genreCounts: Record<string, number> = {}

    // Process movie history
    movieHistory.forEach((item: any) => {
      if (item.movie?.genres) {
        item.movie.genres.forEach((genre: string) => {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1
        })
      }
    })

    // Process show history - we need to get unique shows
    const showsMap = new Map()
    showHistory.forEach((item: any) => {
      if (item.show?.ids?.trakt && item.show?.genres) {
        const showId = item.show.ids.trakt
        if (!showsMap.has(showId)) {
          showsMap.set(showId, item.show)
        }
      }
    })

    // Count genres from unique shows
    showsMap.forEach((show: any) => {
      if (show.genres) {
        show.genres.forEach((genre: string) => {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1
        })
      }
    })

    // Convert to array and sort
    const genres = Object.entries(genreCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)

    console.log(`Calculated ${genres.length} genres`)
    return genres
  } catch (error) {
    console.error("Error calculating most watched genres:", error)
    // Return an empty array instead of throwing
    return []
  }
}

export async function getMostWatchedMovies(limit = 10) {
  console.log(`Fetching most watched movies with limit ${limit}`)
  try {
    const movies = await traktFetch("/sync/watched?type=movies&extended=full")
    console.log(`Got ${movies.length} watched movies from Trakt`)

    // Sort by plays count (should already be sorted, but just to be sure)
    const sortedMovies = movies.sort((a: any, b: any) => b.plays - a.plays).slice(0, limit)
    console.log(`Sorted and limited to ${sortedMovies.length} most watched movies`)

    const moviesWithPosters = await getTMDBImages(sortedMovies, "movie")
    console.log(`Processed ${moviesWithPosters.length} most watched movies with posters`)

    // Log the first few items to see what we're getting
    moviesWithPosters.slice(0, 3).forEach((movie, i) => {
      console.log(
        `Most Watched Movie ${i}: ${movie.movie?.title}, Plays: ${movie.plays}, Poster URL: ${movie.posterUrl}`,
      )
    })

    return moviesWithPosters
  } catch (error) {
    console.error("Error fetching most watched movies:", error)
    throw error
  }
}

export async function getMostWatchedShows(limit = 10) {
  console.log(`Fetching most watched shows with limit ${limit}`)
  try {
    const shows = await traktFetch("/sync/watched?type=shows&extended=full")
    console.log(`Got ${shows.length} watched shows from Trakt`)

    // Sort by plays count (should already be sorted, but just to be sure)
    const sortedShows = shows.sort((a: any, b: any) => b.plays - a.plays).slice(0, limit)
    console.log(`Sorted and limited to ${sortedShows.length} most watched shows`)

    const showsWithPosters = await getTMDBImages(sortedShows, "show")
    console.log(`Processed ${showsWithPosters.length} most watched shows with posters`)

    // Log the first few items to see what we're getting
    showsWithPosters.slice(0, 3).forEach((show, i) => {
      console.log(`Most Watched Show ${i}: ${show.show?.title}, Plays: ${show.plays}, Poster URL: ${show.posterUrl}`)
    })

    return showsWithPosters
  } catch (error) {
    console.error("Error fetching most watched shows:", error)
    throw error
  }
}

export async function getFavoriteMovies(limit = 10) {
  console.log(`Fetching favorite movies with limit ${limit}`)
  try {
    const favorites = await traktFetch("/sync/favorites?type=movies&extended=full")
    console.log(`Got ${favorites.length} favorite movies from Trakt`)

    const favoritesWithPosters = await getTMDBImages(favorites, "movie")
    console.log(`Processed ${favoritesWithPosters.length} favorite movies with posters`)

    // Log the first few items to see what we're getting
    favoritesWithPosters.slice(0, 3).forEach((movie, i) => {
      console.log(`Favorite Movie ${i}: ${movie.movie?.title}, Poster URL: ${movie.posterUrl}`)
    })

    return favoritesWithPosters.slice(0, limit)
  } catch (error) {
    console.error("Error fetching favorite movies:", error)
    throw error
  }
}

export async function getFavoriteShows(limit = 10) {
  console.log(`Fetching favorite shows with limit ${limit}`)
  try {
    const favorites = await traktFetch("/sync/favorites?type=shows&extended=full")
    console.log(`Got ${favorites.length} favorite shows from Trakt`)

    const favoritesWithPosters = await getTMDBImages(favorites, "show")
    console.log(`Processed ${favoritesWithPosters.length} favorite shows with posters`)

    // Log the first few items to see what we're getting
    favoritesWithPosters.slice(0, 3).forEach((show, i) => {
      console.log(`Favorite Show ${i}: ${show.show?.title}, Poster URL: ${show.posterUrl}`)
    })

    return favoritesWithPosters.slice(0, limit)
  } catch (error) {
    console.error("Error fetching favorite shows:", error)
    throw error
  }
}

export async function getWatchedStats() {
  console.log("Fetching watched stats")
  try {
    const stats = await traktFetch("/users/me/stats")
    return {
      movies: stats.movies.watched,
      episodes: stats.episodes.watched,
      minutes: stats.movies.minutes + stats.episodes.minutes,
    }
  } catch (error) {
    console.error("Error fetching watched stats:", error)
    throw error
  }
}


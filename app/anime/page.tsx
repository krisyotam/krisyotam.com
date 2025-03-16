"use client"

import { useState, useEffect } from "react"
import { Loader2, AlertTriangle } from "lucide-react"
import { ProfileHeader } from "@/components/anime/profile-header"
import { TabSwitcher } from "@/components/anime/tab-switcher"
import { CollectionsPage } from "@/components/anime/collections-page"
import { WatchingAnimeCard, CompletedAnimeCard, FavoriteCard } from "@/components/anime/anime-cards"
import { StatsSection } from "@/components/anime/stats-section"
import { SectionHeader } from "@/components/anime/section-header"
import { AnimeHelpModal } from "@/components/anime/help-modal"
import { Badge } from "@/components/ui/badge"
import { Pagination } from "@/components/anime/pagination"
import "./anime.css"
import { CheckCircle, PauseCircle, Heart } from "lucide-react"

// Number of items to show per page
const ITEMS_PER_PAGE = 5

export default function AnimePage() {
  const [profile, setProfile] = useState<any>(null)
  const [watching, setWatching] = useState<any[]>([])
  const [completed, setCompleted] = useState<any[]>([])
  const [reading, setReading] = useState<any[]>([])
  const [completedManga, setCompletedManga] = useState<any[]>([])
  const [favorites, setFavorites] = useState<any>({ anime: [], characters: [], manga: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState<"anime" | "manga" | "collections">("anime")

  // Pagination state
  const [watchingPage, setWatchingPage] = useState(1)
  const [completedPage, setCompletedPage] = useState(1)
  const [favoritesPage, setFavoritesPage] = useState(1)
  const [charactersPage, setCharactersPage] = useState(1)

  useEffect(() => {
    // Reset pagination when tab changes
    setWatchingPage(1)
    setCompletedPage(1)
    setFavoritesPage(1)
    // Don't reset charactersPage as characters are the same for both tabs
  }, [activeTab])

  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoading(true)

        // Fetch user data from our API route
        const response = await fetch("/api/mal/user-data")

        // Check if the response is ok before trying to parse JSON
        if (!response.ok) {
          // Try to parse the error as JSON first
          try {
            const errorData = await response.json()
            throw new Error(errorData.message || `API error: ${response.status} ${response.statusText}`)
          } catch (jsonError) {
            // If JSON parsing fails, use the text content
            const errorText = await response.text()
            throw new Error(`API returned non-JSON response: ${errorText.substring(0, 100)}...`)
          }
        }

        // Parse the JSON response
        let userData
        try {
          userData = await response.json()
        } catch (jsonError) {
          console.error("Failed to parse JSON response:", jsonError)
          throw new Error("The API returned an invalid JSON response")
        }

        // Set user data with validation
        setProfile(userData.profile || null)

        // Set anime data
        setWatching(Array.isArray(userData.anime?.watching) ? userData.anime.watching : [])
        setCompleted(Array.isArray(userData.anime?.completed) ? userData.anime.completed : [])

        // Set manga data
        setReading(Array.isArray(userData.manga?.reading) ? userData.manga.reading : [])
        setCompletedManga(Array.isArray(userData.manga?.completed) ? userData.manga.completed : [])

        // Ensure favorites has all required properties
        const favs = userData.favorites || {}
        setFavorites({
          anime: Array.isArray(favs.anime) ? favs.anime : [],
          characters: Array.isArray(favs.characters) ? favs.characters : [],
          manga: Array.isArray(favs.manga) ? favs.manga : [],
        })
      } catch (err: any) {
        console.error("Error fetching data:", err)
        setError(err.message || "Failed to load your MyAnimeList data")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen dark:bg-[#121212]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin" />
          <p className="text-base">Loading your MyAnimeList data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4 max-w-4xl dark:bg-[#121212]">
        <div className="bg-card p-6 rounded-lg border shadow-sm dark:bg-[#1a1a1a] dark:border-gray-800">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-xl font-bold mb-4">Error Loading Data</h2>
              <p className="mb-4 text-sm">{error}</p>
              <p className="text-sm text-muted-foreground">
                Please ensure your MAL_ACCESS_TOKEN, MAL_REFRESH_TOKEN, CLIENT_ID, and CLIENT_SECRET environment
                variables are correctly set.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If no profile data is available, show a message
  if (!profile) {
    return (
      <div className="container mx-auto py-12 px-4 max-w-4xl dark:bg-[#121212]">
        <div className="bg-card p-6 rounded-lg border shadow-sm dark:bg-[#1a1a1a] dark:border-gray-800">
          <h2 className="text-xl font-bold mb-4">No Data Available</h2>
          <p className="mb-4 text-sm">Unable to load MyAnimeList profile data. Please check your API credentials.</p>
        </div>
      </div>
    )
  }

  // Get the current content based on active tab
  const currentContent =
    activeTab === "anime"
      ? {
          ongoing: watching,
          completed: completed,
          favorites: favorites.anime || [],
        }
      : activeTab === "manga"
        ? {
            ongoing: reading,
            completed: completedManga,
            favorites: favorites.manga || [],
          }
        : {
            ongoing: [],
            completed: [],
            favorites: [],
          }

  // Calculate pagination
  const watchingTotalPages = Math.max(1, Math.ceil(currentContent.ongoing.length / ITEMS_PER_PAGE))
  const completedTotalPages = Math.max(1, Math.ceil(currentContent.completed.length / ITEMS_PER_PAGE))
  const favoritesTotalPages = Math.max(1, Math.ceil(currentContent.favorites.length / ITEMS_PER_PAGE))
  const charactersTotalPages = Math.max(1, Math.ceil(favorites.characters.length / ITEMS_PER_PAGE))

  // Get paginated items
  const paginatedWatching = currentContent.ongoing.slice(
    (watchingPage - 1) * ITEMS_PER_PAGE,
    watchingPage * ITEMS_PER_PAGE,
  )

  const paginatedCompleted = currentContent.completed.slice(
    (completedPage - 1) * ITEMS_PER_PAGE,
    completedPage * ITEMS_PER_PAGE,
  )

  const paginatedFavorites = currentContent.favorites.slice(
    (favoritesPage - 1) * ITEMS_PER_PAGE,
    favoritesPage * ITEMS_PER_PAGE,
  )

  const paginatedCharacters = favorites.characters.slice(
    (charactersPage - 1) * ITEMS_PER_PAGE,
    charactersPage * ITEMS_PER_PAGE,
  )

  // Set up labels based on active tab
  const ongoingLabel = activeTab === "anime" ? "Currently Watching" : "Currently Reading"
  const completedLabel = "Recently Completed"
  const favoritesLabel = activeTab === "anime" ? "Favorite Anime" : "Favorite Manga"
  const emptyOngoingMessage =
    activeTab === "anime" ? "You're not currently watching any anime." : "You're not currently reading any manga."
  const emptyCompletedMessage =
    activeTab === "anime" ? "You haven't completed any anime yet." : "You haven't completed any manga yet."
  const emptyFavoritesMessage =
    activeTab === "anime" ? "You haven't added any favorite anime yet." : "You haven't added any favorite manga yet."

  return (
    <div className="container mx-auto py-6 px-4 max-w-5xl dark:bg-[#121212] anime-page">
      <AnimeHelpModal />

      <TabSwitcher
        activeTab={activeTab}
        onChange={setActiveTab}
        tabs={[
          { id: "anime", label: "Anime" },
          { id: "manga", label: "Manga" },
          { id: "collections", label: "Collections" },
        ]}
      />

      {activeTab === "collections" ? (
        <div className="mt-8">
          <CollectionsPage profile={profile} activeTab={activeTab === "manga" ? "manga" : "anime"} />
        </div>
      ) : (
        <>
          {/* Profile Header */}
          <div className="mt-8">
            <ProfileHeader profile={profile} activeTab={activeTab} />
          </div>

          {/* Stats Section */}
          <div className="mt-8">
            <StatsSection profile={profile} activeTab={activeTab} />
          </div>

          {/* Favorites Section - Moved to top */}
          <section className="mt-10">
            <SectionHeader title="My Favorites" icon={<Heart className="h-5 w-5" />} />

            {/* Favorite Anime/Manga */}
            <div className="flex justify-between items-center">
              <h3 className="text-base font-medium mt-5 mb-3 text-muted-foreground flex items-center">
                {favoritesLabel}
                {currentContent.favorites?.length > 0 && (
                  <Badge variant="outline" className="ml-2 text-xs dark:border-gray-700 dark:text-gray-300">
                    {currentContent.favorites.length}
                  </Badge>
                )}
              </h3>
              {currentContent.favorites.length > ITEMS_PER_PAGE && (
                <Pagination
                  currentPage={favoritesPage}
                  totalPages={favoritesTotalPages}
                  onPageChange={setFavoritesPage}
                />
              )}
            </div>
            <div className="grid grid-cols-5 gap-4">
              {currentContent.favorites && currentContent.favorites.length > 0 ? (
                paginatedFavorites.map((item, index) => (
                  <div key={item?.id || item?.mal_id || index} className="w-full">
                    <FavoriteCard item={item} type={activeTab === "anime" ? "anime" : "manga"} />
                  </div>
                ))
              ) : (
                <p className="col-span-full text-center text-muted-foreground py-3 text-sm">{emptyFavoritesMessage}</p>
              )}
            </div>

            {/* Favorite Characters */}
            <div className="flex justify-between items-center">
              <h3 className="text-base font-medium mt-6 mb-3 text-muted-foreground flex items-center">
                Favorite Characters
                {favorites.characters?.length > 0 && (
                  <Badge variant="outline" className="ml-2 text-xs dark:border-gray-700 dark:text-gray-300">
                    {favorites.characters.length}
                  </Badge>
                )}
              </h3>
              {favorites.characters.length > ITEMS_PER_PAGE && (
                <Pagination
                  currentPage={charactersPage}
                  totalPages={charactersTotalPages}
                  onPageChange={setCharactersPage}
                />
              )}
            </div>
            <div className="grid grid-cols-5 gap-4">
              {favorites.characters && favorites.characters.length > 0 ? (
                paginatedCharacters.map((character, index) => (
                  <div key={character?.id || character?.mal_id || index} className="w-full">
                    <FavoriteCard item={character} type="character" />
                  </div>
                ))
              ) : (
                <p className="col-span-full text-center text-muted-foreground py-3 text-sm">
                  You haven't added any favorite characters yet.
                </p>
              )}
            </div>
          </section>

          {/* Currently Watching/Reading Section */}
          <section className="mt-10">
            <div className="flex justify-between items-center">
              <SectionHeader
                title={ongoingLabel}
                icon={<PauseCircle className="h-5 w-5" />}
                count={currentContent.ongoing.length}
              />
              {currentContent.ongoing.length > ITEMS_PER_PAGE && (
                <Pagination currentPage={watchingPage} totalPages={watchingTotalPages} onPageChange={setWatchingPage} />
              )}
            </div>
            <div className="mt-3">
              <div className="grid grid-cols-5 gap-4">
                {paginatedWatching.length > 0 ? (
                  paginatedWatching.map((item) => (
                    <div key={item?.node?.id || Math.random().toString()} className="w-full">
                      <WatchingAnimeCard
                        anime={item?.node || null}
                        status={item?.list_status || null}
                        type={activeTab}
                      />
                    </div>
                  ))
                ) : (
                  <p className="col-span-full text-center text-muted-foreground py-3 text-sm">{emptyOngoingMessage}</p>
                )}
              </div>
            </div>
          </section>

          {/* Recently Completed Section */}
          <section className="mt-10 mb-12">
            <div className="flex justify-between items-center">
              <SectionHeader
                title={completedLabel}
                icon={<CheckCircle className="h-5 w-5" />}
                count={currentContent.completed.length}
              />
              {currentContent.completed.length > ITEMS_PER_PAGE && (
                <Pagination
                  currentPage={completedPage}
                  totalPages={completedTotalPages}
                  onPageChange={setCompletedPage}
                />
              )}
            </div>
            <div className="mt-3">
              <div className="grid grid-cols-5 gap-4">
                {paginatedCompleted.length > 0 ? (
                  paginatedCompleted.map((item) => (
                    <div key={item?.node?.id || Math.random().toString()} className="w-full">
                      <CompletedAnimeCard
                        anime={item?.node || null}
                        status={item?.list_status || null}
                        type={activeTab}
                      />
                    </div>
                  ))
                ) : (
                  <p className="col-span-full text-center text-muted-foreground py-3 text-sm">
                    {emptyCompletedMessage}
                  </p>
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  )
}


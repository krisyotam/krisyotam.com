"use client"

import { useState, useEffect } from "react"
import { Loader2, AlertTriangle, CheckCircle, PauseCircle, Heart, PlayCircle } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { TabSwitcher } from "@/components/anime/tab-switcher"
import { ListsPage } from "@/components/anime/lists-page"
import { WatchingAnimeCard, CompletedAnimeCard, FavoriteCard } from "@/components/anime/anime-cards"
import { StatsSection } from "@/components/anime/stats-section"
import { SectionHeader } from "@/components/anime/section-header"
import { Badge } from "@/components/ui/badge"
import { Pagination } from "@/components/anime/pagination"
import { PageDescription } from "@/components/posts/typography/page-description"

import favCharacters from "@/data/fav_chars.json"
import favPeople from "@/data/fav_people.json"
import favCompanies from "@/data/fav_companies.json"

// Number of items to show per page
const ITEMS_PER_PAGE = 5

// Define types for our data
interface AnimeItem {
  id?: number
  mal_id?: number
  node?: any
  list_status?: any
  [key: string]: any
}

export default function AnimeClientPage() {
  const [profile, setProfile] = useState<any>(null)
  const [watching, setWatching] = useState<AnimeItem[]>([])
  const [completed, setCompleted] = useState<AnimeItem[]>([])
  const [reading, setReading] = useState<AnimeItem[]>([])
  const [completedManga, setCompletedManga] = useState<AnimeItem[]>([])
  const [favorites, setFavorites] = useState<{
    anime: AnimeItem[]
    characters: AnimeItem[]
    manga: AnimeItem[]
  }>({ anime: [], characters: [], manga: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState<"anime" | "manga" | "lists">("anime")
  const [malDataAvailable, setMalDataAvailable] = useState(false)

  // Pagination state
  const [watchingPage, setWatchingPage] = useState(1)
  const [completedPage, setCompletedPage] = useState(1)
  const [favoritesPage, setFavoritesPage] = useState(1)
  const [charactersPage, setCharactersPage] = useState(1)
  const [peoplePage, setPeoplePage] = useState(1)
  const [companiesPage, setCompaniesPage] = useState(1)

  useEffect(() => {
    // Reset pagination when tab changes
    setWatchingPage(1)
    setCompletedPage(1)
    setFavoritesPage(1)
    // Don't reset charactersPage as characters are the same for both tabs
    setPeoplePage(1)
    setCompaniesPage(1)
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
        setMalDataAvailable(true)

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
        setMalDataAvailable(false)
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

  // If there's an error, show it but still allow access to static content
  const errorMessage = error ? (
    <div className="bg-card p-6 rounded-lg border shadow-sm dark:bg-[#1a1a1a] dark:border-gray-800 mb-8">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
        <div>
          <h2 className="text-xl font-bold mb-4">Error Loading MyAnimeList Data</h2>
          <p className="mb-4 text-sm">{error}</p>
          <p className="text-sm text-muted-foreground">
            Some features may be limited. Please ensure your MAL_ACCESS_TOKEN, MAL_REFRESH_TOKEN, CLIENT_ID, and CLIENT_SECRET environment
            variables are correctly set.
          </p>
        </div>
      </div>
    </div>
  ) : null;

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
  const charactersTotalPages = Math.max(1, Math.ceil(favCharacters.length / ITEMS_PER_PAGE))

  // Sort the favorites by ranking
  const sortedFavCharacters = [...favCharacters].sort((a, b) => a.ranking - b.ranking)
  const sortedFavPeople = [...favPeople].sort((a, b) => a.ranking - b.ranking)
  const sortedFavCompanies = [...favCompanies].sort((a, b) => a.ranking - b.ranking)

  // Calculate pagination for new sections
  const peopleTotalPages = Math.max(1, Math.ceil(sortedFavPeople.length / ITEMS_PER_PAGE))
  const companiesTotalPages = Math.max(1, Math.ceil(sortedFavCompanies.length / ITEMS_PER_PAGE))

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

  const paginatedCharacters = sortedFavCharacters.slice(
    (charactersPage - 1) * ITEMS_PER_PAGE,
    charactersPage * ITEMS_PER_PAGE,
  )

  const paginatedPeople = sortedFavPeople.slice(
    (peoplePage - 1) * ITEMS_PER_PAGE,
    peoplePage * ITEMS_PER_PAGE,
  )

  const paginatedCompanies = sortedFavCompanies.slice(
    (companiesPage - 1) * ITEMS_PER_PAGE,
    companiesPage * ITEMS_PER_PAGE,
  )

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl dark:bg-[#121212]">
      {errorMessage}

      {/* Page Header */}
      <PageHeader
        title="Anime & Manga"
        preview="comprehensive list of anime and manga consumed along with some recs"
        date={new Date().toISOString()}
        status="In Progress"
        confidence={malDataAvailable ? "highly likely" : "possible"}
        importance={7}
      />

      {/* Tab Switcher - Always show */}
      <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <div className="mt-8">
        {activeTab === "lists" ? (
          <ListsPage />
        ) : (
          <>
            {/* Watching Section - Only show if MAL data is available */}
            {malDataAvailable && (
              <section>
                <div className="flex justify-between items-center">
                  <SectionHeader
                    title={activeTab === "anime" ? "Currently Watching" : "Currently Reading"}
                    icon={<PlayCircle className="h-5 w-5" />}
                    count={currentContent.ongoing.length}
                  />
                  {currentContent.ongoing.length > ITEMS_PER_PAGE && (
                    <Pagination
                      currentPage={watchingPage}
                      totalPages={watchingTotalPages}
                      onPageChange={setWatchingPage}
                    />
                  )}
                </div>
                <div className="mt-3">
                  <div className="grid grid-cols-5 gap-4">
                    {paginatedWatching.length > 0 ? (
                      paginatedWatching.map((item, index) => (
                        <div key={item?.node?.id || index} className="w-full">
                          <WatchingAnimeCard
                            anime={item?.node ? { ...item.node, list_status: item.list_status } : null}
                            type={activeTab}
                          />
                        </div>
                      ))
                    ) : (
                      <p className="col-span-full text-center text-muted-foreground py-3 text-sm">
                        {activeTab === "anime" ? "No anime in progress" : "No manga in progress"}
                      </p>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* Completed Section - Only show if MAL data is available */}
            {malDataAvailable && (
              <section className="mt-10">
                <div className="flex justify-between items-center">
                  <SectionHeader
                    title={activeTab === "anime" ? "Completed Anime" : "Completed Manga"}
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
                      paginatedCompleted.map((item, index) => (
                        <div key={item?.node?.id || index} className="w-full">
                          <CompletedAnimeCard
                            anime={item?.node ? { ...item.node, list_status: item.list_status } : null}
                            type={activeTab}
                          />
                        </div>
                      ))
                    ) : (
                      <p className="col-span-full text-center text-muted-foreground py-3 text-sm">
                        {activeTab === "anime" ? "No completed anime" : "No completed manga"}
                      </p>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* Favorites Section - Only show if MAL data is available */}
            {malDataAvailable && (
              <section className="mt-10">
                <div className="flex justify-between items-center">
                  <SectionHeader
                    title="Favorites"
                    icon={<Heart className="h-5 w-5" />}
                    count={currentContent.favorites.length}
                  />
                  {currentContent.favorites.length > ITEMS_PER_PAGE && (
                    <Pagination
                      currentPage={favoritesPage}
                      totalPages={favoritesTotalPages}
                      onPageChange={setFavoritesPage}
                    />
                  )}
                </div>
                <div className="mt-3">
                  <div className="grid grid-cols-5 gap-4">
                    {paginatedFavorites.length > 0 ? (
                      paginatedFavorites.map((item, index) => (
                        <div key={item?.id || index} className="w-full">
                          <FavoriteCard item={item} type={activeTab} />
                        </div>
                      ))
                    ) : (
                      <p className="col-span-full text-center text-muted-foreground py-3 text-sm">
                        No favorites found
                      </p>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* Favorite Characters Section - Always show */}
            <section className="mt-10">
              <div className="flex justify-between items-center">
                <SectionHeader
                  title="Favorite Characters"
                  icon={<Heart className="h-5 w-5" />}
                  count={favCharacters.length}
                />
                {favCharacters.length > ITEMS_PER_PAGE && (
                  <Pagination
                    currentPage={charactersPage}
                    totalPages={charactersTotalPages}
                    onPageChange={setCharactersPage}
                  />
                )}
              </div>
              <div className="mt-3">
                <div className="grid grid-cols-5 gap-4">
                  {paginatedCharacters.map((character, index) => (
                    <div key={character.name || index} className="w-full">
                      <FavoriteCard item={character} type="character" />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Favorite People Section - Always show */}
            <section className="mt-10">
              <div className="flex justify-between items-center">
                <SectionHeader
                  title="Favorite People"
                  icon={<Heart className="h-5 w-5" />}
                  count={favPeople.length}
                />
                {favPeople.length > ITEMS_PER_PAGE && (
                  <Pagination
                    currentPage={peoplePage}
                    totalPages={peopleTotalPages}
                    onPageChange={setPeoplePage}
                  />
                )}
              </div>
              <div className="mt-3">
                <div className="grid grid-cols-5 gap-4">
                  {paginatedPeople.map((person, index) => (
                    <div key={person.name || index} className="w-full">
                      <FavoriteCard item={person} type="person" />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Favorite Companies Section - Always show */}
            <section className="mt-10">
              <div className="flex justify-between items-center">
                <SectionHeader
                  title="Favorite Companies"
                  icon={<Heart className="h-5 w-5" />}
                  count={favCompanies.length}
                />
                {favCompanies.length > ITEMS_PER_PAGE && (
                  <Pagination
                    currentPage={companiesPage}
                    totalPages={companiesTotalPages}
                    onPageChange={setCompaniesPage}
                  />
                )}
              </div>
              <div className="mt-3">
                <div className="grid grid-cols-5 gap-4">
                  {paginatedCompanies.map((company, index) => (
                    <div key={company.name || index} className="w-full">
                      <FavoriteCard item={company} type="company" />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </div>
      
      {/* Add PageDescription */}
      <PageDescription
        title="About This Page"
        description="This page showcases my anime experience and taste as a powerscaler, anime reviewer, and anime philosophy writer. Here you can explore my anime statistics, watching history, and favorites. The data is pulled directly from my MyAnimeList profile. I've curated this collection to reflect my journey through anime, highlighting series that have influenced my thinking and writing about anime philosophy."
      />
    </div>
  )
} 
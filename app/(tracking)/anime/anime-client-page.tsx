"use client";

import { useState, useEffect } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/core";
import { TabSwitcher } from "@/components/anime/tab-switcher";
import {
  WatchingAnimeCard,
  CompletedAnimeCard,
  AnimeFavoriteCard,
} from "@/components/anime/anime-cards";
import { StatsSection } from "@/components/anime/stats-section";
import { TraktSectionHeader } from "@/components/trakt/trakt-section-header";
import { Pagination } from "@/components/anime/pagination";
import { PageDescription } from "@/components/core";

import favCompanies from "@/data/fav_companies.json";

// Number of items to show per page
const ITEMS_PER_PAGE = 5;

// Define types for our data
interface AnimeItem {
  id?: number;
  mal_id?: number;
  node?: any;
  list_status?: any;
  [key: string]: any;
}

interface CharacterItem {
  id?: number;
  name?: string;
  ranking?: number;
  [key: string]: any;
}

interface PersonItem {
  id?: number;
  name?: string;
  ranking?: number;
  [key: string]: any;
}

interface CompanyItem {
  name?: string;
  ranking?: number;
  [key: string]: any;
}

export default function AnimeClientPage() {
  const [profile, setProfile] = useState<any>(null);
  const [watching, setWatching] = useState<AnimeItem[]>([]);
  const [completed, setCompleted] = useState<AnimeItem[]>([]);
  const [favorites, setFavorites] = useState<{
    anime: AnimeItem[];
    characters: CharacterItem[];
    people: PersonItem[];
  }>({
    anime: [],
    characters: [],
    people: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [malDataAvailable, setMalDataAvailable] = useState(false);

  // Pagination state
  const [watchingPage, setWatchingPage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);
  const [favoritesPage, setFavoritesPage] = useState(1);
  const [charactersPage, setCharactersPage] = useState(1);
  const [peoplePage, setPeoplePage] = useState(1);
  const [companiesPage, setCompaniesPage] = useState(1);

  useEffect(() => {
    async function fetchUserData() {
      try {
        console.log("Fetching user data...");
        const response = await fetch("/api/mal/user-data");

        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.status}`);
        }

        const userData = await response.json();
        console.log("User data fetched successfully");

        // Set profile data
        setProfile(userData.profile);
        setMalDataAvailable(true);

        // Set anime data
        setWatching(
          Array.isArray(userData.anime?.watching) ? userData.anime.watching : []
        );
        setCompleted(
          Array.isArray(userData.anime?.completed)
            ? userData.anime.completed
            : []
        );

        // Ensure favorites has anime, characters, people
        const favs = userData.favorites || {};
        setFavorites({
          anime: Array.isArray(favs.anime) ? favs.anime : [],
          characters: Array.isArray(favs.characters) ? favs.characters : [],
          people: Array.isArray(favs.people) ? favs.people : [],
        });
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load your MyAnimeList data");
        setMalDataAvailable(false);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen dark:bg-[#121212]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin" />
          <p className="text-base">Loading your MyAnimeList data...</p>
        </div>
      </div>
    );
  }

  const errorMessage = error ? (
    <div className="bg-card p-6 rounded-lg border shadow-sm dark:bg-[#1a1a1a] dark:border-gray-800 mb-8">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
        <div>
          <h2 className="text-xl font-bold mb-4">Error Loading MyAnimeList Data</h2>
          <p className="mb-4 text-sm">{error}</p>
          <p className="text-sm text-muted-foreground">
            Some features may be limited. Please ensure your MAL_ACCESS_TOKEN,
            MAL_REFRESH_TOKEN, MAL_CLIENT_ID, and MAL_CLIENT_SECRET environment
            variables are correctly set.
          </p>
        </div>
      </div>
    </div>
  ) : null;

  // Calculate pagination
  const watchingTotalPages = Math.max(1, Math.ceil(watching.length / ITEMS_PER_PAGE));
  const completedTotalPages = Math.max(
    1,
    Math.ceil(completed.length / ITEMS_PER_PAGE)
  );
  const favoritesTotalPages = Math.max(
    1,
    Math.ceil(favorites.anime.length / ITEMS_PER_PAGE)
  );
  const charactersTotalPages = Math.max(
    1,
    Math.ceil(favorites.characters.length / ITEMS_PER_PAGE)
  );
  const peopleTotalPages = Math.max(
    1,
    Math.ceil(favorites.people.length / ITEMS_PER_PAGE)
  );

  // Static favorite companies from JSON
  const sortedFavCompanies = [...favCompanies].sort(
    (a, b) => (a.ranking || 0) - (b.ranking || 0)
  );
  const companiesTotalPages = Math.max(
    1,
    Math.ceil(sortedFavCompanies.length / ITEMS_PER_PAGE)
  );

  // Sort dynamic favorites
  const sortedFavCharacters = [...favorites.characters].sort(
    (a, b) => (a.ranking || 0) - (b.ranking || 0)
  );
  const sortedFavPeople = [...favorites.people].sort(
    (a, b) => (a.ranking || 0) - (b.ranking || 0)
  );

  // Get paginated slices
  const watchingStart = (watchingPage - 1) * ITEMS_PER_PAGE;
  const watchingEnd = watchingStart + ITEMS_PER_PAGE;
  const paginatedWatching = watching.slice(watchingStart, watchingEnd);

  const completedStart = (completedPage - 1) * ITEMS_PER_PAGE;
  const completedEnd = completedStart + ITEMS_PER_PAGE;
  const paginatedCompleted = completed.slice(completedStart, completedEnd);

  const favoritesStart = (favoritesPage - 1) * ITEMS_PER_PAGE;
  const favoritesEnd = favoritesStart + ITEMS_PER_PAGE;
  const paginatedFavorites = favorites.anime.slice(favoritesStart, favoritesEnd);

  const charsStart = (charactersPage - 1) * ITEMS_PER_PAGE;
  const charsEnd = charsStart + ITEMS_PER_PAGE;
  const paginatedCharacters = sortedFavCharacters.slice(charsStart, charsEnd);

  const peopleStart = (peoplePage - 1) * ITEMS_PER_PAGE;
  const peopleEnd = peopleStart + ITEMS_PER_PAGE;
  const paginatedPeople = sortedFavPeople.slice(peopleStart, peopleEnd);

  const companiesStart = (companiesPage - 1) * ITEMS_PER_PAGE;
  const companiesEnd = companiesStart + ITEMS_PER_PAGE;
  const paginatedCompanies = sortedFavCompanies.slice(companiesStart, companiesEnd);

  return (
    <div className="min-h-screen dark:bg-[#121212]">
      <div className="max-w-6xl mx-auto p-6">
        <PageHeader
          title="Anime"
          start_date="2025-01-01"
          end_date={new Date().toISOString().split('T')[0]}
          preview="my anime watching activity and favorites"
          status="Finished"
          confidence="certain"
          importance={7}
        />

        <PageDescription
          title="Anime Page Information"
          description="Anime watching activity powered by MyAnimeList API, featuring watching statistics, current watches, completed series, and favorite picks."
        />

        {/* Tab Navigation */}
        <div className="mb-8">
          <TabSwitcher activeTab="anime" />
        </div>

        {errorMessage}

        {/* Stats Section */}
        <section className="mb-10">
          {profile?.anime_statistics && (
            <StatsSection profile={profile} activeTab="anime" />
          )}
        </section>

        {/* Currently Watching Section */}
        {malDataAvailable && (
          <section className="mb-10">
            <TraktSectionHeader title="Currently Watching" count={watching.length} />
            <div className="mt-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {paginatedWatching.length > 0 ? (
                  paginatedWatching.map((item, index) => (
                    <div key={item?.node?.id || index} className="w-full">
                      <WatchingAnimeCard
                        anime={
                          item?.node
                            ? { ...item.node, list_status: item.list_status }
                            : null
                        }
                        type="anime"
                      />
                    </div>
                  ))
                ) : (
                  <p className="col-span-full text-center text-muted-foreground py-8 text-sm">
                    No anime in progress
                  </p>
                )}
              </div>
              {watching.length > ITEMS_PER_PAGE && (
                <div className="flex justify-center mt-6">
                  <Pagination
                    currentPage={watchingPage}
                    totalPages={watchingTotalPages}
                    onPageChange={setWatchingPage}
                  />
                </div>
              )}
            </div>
          </section>
        )}

        {/* Completed Section */}
        {malDataAvailable && (
          <section className="mb-10">
            <TraktSectionHeader title="Completed Anime" count={completed.length} />
            <div className="mt-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {paginatedCompleted.length > 0 ? (
                  paginatedCompleted.map((item, index) => (
                    <div key={item?.node?.id || index} className="w-full">
                      <CompletedAnimeCard anime={item} type="anime" />
                    </div>
                  ))
                ) : (
                  <p className="col-span-full text-center text-muted-foreground py-8 text-sm">
                    No completed anime
                  </p>
                )}
              </div>
              {completed.length > ITEMS_PER_PAGE && (
                <div className="flex justify-center mt-6">
                  <Pagination
                    currentPage={completedPage}
                    totalPages={completedTotalPages}
                    onPageChange={setCompletedPage}
                  />
                </div>
              )}
            </div>
          </section>
        )}

        {/* Favorite Anime Section */}
        {malDataAvailable && (
          <section className="mb-10">
            <TraktSectionHeader title="Favorite Anime" count={favorites.anime.length} />
            <div className="mt-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {paginatedFavorites.length > 0 ? (
                  paginatedFavorites.map((item, index) => (
                    <div key={item?.id || index} className="w-full">
                      <AnimeFavoriteCard item={item} type="anime" />
                    </div>
                  ))
                ) : (
                  <p className="col-span-full text-center text-muted-foreground py-8 text-sm">
                    No favorite anime selected
                  </p>
                )}
              </div>
              {favorites.anime.length > ITEMS_PER_PAGE && (
                <div className="flex justify-center mt-6">
                  <Pagination
                    currentPage={favoritesPage}
                    totalPages={favoritesTotalPages}
                    onPageChange={setFavoritesPage}
                  />
                </div>
              )}
            </div>
          </section>
        )}

        {/* Favorite Characters Section */}
        <section className="mb-10">
          <TraktSectionHeader
            title="Favorite Characters"
            count={favorites.characters.length}
          />
          <div className="mt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {paginatedCharacters.length > 0 ? (
                paginatedCharacters.map((character, index) => (
                  <div
                    key={character.id || character.name || index}
                    className="w-full"
                  >
                    <AnimeFavoriteCard item={character} type="character" />
                  </div>
                ))
              ) : (
                <p className="col-span-full text-center text-muted-foreground py-8 text-sm">
                  No favorite characters found
                </p>
              )}
            </div>
            {favorites.characters.length > ITEMS_PER_PAGE && (
              <div className="flex justify-center mt-6">
                <Pagination
                  currentPage={charactersPage}
                  totalPages={charactersTotalPages}
                  onPageChange={setCharactersPage}
                />
              </div>
            )}
          </div>
        </section>

        {/* Favorite People Section */}
        <section className="mb-10">
          <TraktSectionHeader title="Favorite People" count={favorites.people.length} />
          <div className="mt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {paginatedPeople.length > 0 ? (
                paginatedPeople.map((person, index) => (
                  <div key={person.id || person.name || index} className="w-full">
                    <AnimeFavoriteCard item={person} type="character" />
                  </div>
                ))
              ) : (
                <p className="col-span-full text-center text-muted-foreground py-8 text-sm">
                  No favorite people found
                </p>
              )}
            </div>
            {favorites.people.length > ITEMS_PER_PAGE && (
              <div className="flex justify-center mt-6">
                <Pagination
                  currentPage={peoplePage}
                  totalPages={peopleTotalPages}
                  onPageChange={setPeoplePage}
                />
              </div>
            )}
          </div>
        </section>

        {/* Favorite Companies Section (from JSON) */}
        <section className="mb-10">
          <TraktSectionHeader
            title="Favorite Companies"
            count={sortedFavCompanies.length}
          />
          <div className="mt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {paginatedCompanies.length > 0 ? (
                paginatedCompanies.map((company, index) => (
                  <div key={company.name || index} className="w-full">
                    <AnimeFavoriteCard
                      item={company}
                      type="character"
                      isCompany={true}
                    />
                  </div>
                ))
              ) : (
                <p className="col-span-full text-center text-muted-foreground py-8 text-sm">
                  No favorite companies found
                </p>
              )}
            </div>
            {sortedFavCompanies.length > ITEMS_PER_PAGE && (
              <div className="flex justify-center mt-6">
                <Pagination
                  currentPage={companiesPage}
                  totalPages={companiesTotalPages}
                  onPageChange={setCompaniesPage}
                />
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

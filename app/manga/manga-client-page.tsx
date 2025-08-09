"use client";

import { useState, useEffect } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import {
  CompletedAnimeCard,
  AnimeFavoriteCard,
} from "@/components/anime/anime-cards";
import { StatsSection } from "@/components/anime/stats-section";
import { TraktSectionHeader } from "@/components/trakt/trakt-section-header";
import { TabSwitcher } from "@/components/anime/tab-switcher";
import { Pagination } from "@/components/anime/pagination";
import { PageDescription } from "@/components/posts/typography/page-description";

import favCompanies from "@/data/fav_companies.json";

// Number of items to show per page
const ITEMS_PER_PAGE = 5;

// Define types for our data
interface MangaItem {
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
  name?: string;
  ranking?: number;
  [key: string]: any;
}

interface CompanyItem {
  name?: string;
  ranking?: number;
  [key: string]: any;
}

export default function MangaClientPage() {
  const [profile, setProfile] = useState<any>(null);
  const [reading, setReading] = useState<MangaItem[]>([]);
  const [completed, setCompleted] = useState<MangaItem[]>([]);
  const [favorites, setFavorites] = useState<{
    manga: MangaItem[];
    characters: CharacterItem[];
  }>({ manga: [], characters: [] });
  const [favPeople, setFavPeople] = useState<PersonItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [malDataAvailable, setMalDataAvailable] = useState(false);

  // Pagination state
  const [readingPage, setReadingPage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);
  const [favoritesPage, setFavoritesPage] = useState(1);
  const [charactersPage, setCharactersPage] = useState(1);
  const [peoplePage, setPeoplePage] = useState(1);
  const [companiesPage, setCompaniesPage] = useState(1);

  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoading(true);

        // 1) fetch everything from /api/mal/user-data
        const response = await fetch("/api/mal/user-data");
        if (!response.ok) {
          try {
            const errorData = await response.json();
            throw new Error(
              errorData.message ||
                `API error: ${response.status} ${response.statusText}`
            );
          } catch {
            const errorText = await response.text();
            throw new Error(
              `API returned non-JSON response: ${errorText.substring(0, 100)}...`
            );
          }
        }

        const userData = await response.json();
        setProfile(userData.profile || null);
        setMalDataAvailable(true);

        // 2) set reading/completed/manga favorites
        setReading(
          Array.isArray(userData.manga?.reading) ? userData.manga.reading : []
        );
        setCompleted(
          Array.isArray(userData.manga?.completed)
            ? userData.manga.completed
            : []
        );

        const favs = userData.favorites || {};
        setFavorites({
          manga: Array.isArray(favs.manga) ? favs.manga : [],
          characters: Array.isArray(favs.characters)
            ? favs.characters
            : [],
        });

        // 3) fetch favorite people via API
        const username = userData.profile?.name;
        if (username) {
          try {
            const peopleResp = await fetch(
              `/api/mal/fav-people?username=${encodeURIComponent(username)}`
            );
            if (peopleResp.ok) {
              const peopleJson: PersonItem[] = await peopleResp.json();
              setFavPeople(Array.isArray(peopleJson) ? peopleJson : []);
            } else {
              console.error(
                "Failed to fetch favorite people:",
                peopleResp.status,
                await peopleResp.text().catch(() => "")
              );
            }
          } catch (err) {
            console.error("Error fetching favorite people:", err);
          }
        }
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
          <h2 className="text-xl font-bold mb-4">
            Error Loading MyAnimeList Data
          </h2>
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

  // Pagination helpers
  const readingTotalPages = Math.max(
    1,
    Math.ceil(reading.length / ITEMS_PER_PAGE)
  );
  const completedTotalPages = Math.max(
    1,
    Math.ceil(completed.length / ITEMS_PER_PAGE)
  );
  const favoritesTotalPages = Math.max(
    1,
    Math.ceil(favorites.manga.length / ITEMS_PER_PAGE)
  );
  const charactersTotalPages = Math.max(
    1,
    Math.ceil(favorites.characters.length / ITEMS_PER_PAGE)
  );

  // Sort dynamic "favorite characters"
  const sortedFavCharacters = [...favorites.characters].sort(
    (a, b) => (a.ranking || 0) - (b.ranking || 0)
  );
  // Sort dynamic "favorite people"
  const sortedFavPeople = [...favPeople].sort(
    (a, b) => (a.ranking || 0) - (b.ranking || 0)
  );
  // Sort static "favorite companies" (from JSON)
  const sortedFavCompanies = [...favCompanies].sort(
    (a, b) => (a.ranking || 0) - (b.ranking || 0)
  );

  const peopleTotalPages = Math.max(
    1,
    Math.ceil(sortedFavPeople.length / ITEMS_PER_PAGE)
  );
  const companiesTotalPages = Math.max(
    1,
    Math.ceil(sortedFavCompanies.length / ITEMS_PER_PAGE)
  );

  // Explicit slice indices for clarity
  const readingStart = (readingPage - 1) * ITEMS_PER_PAGE;
  const readingEnd = readingStart + ITEMS_PER_PAGE;
  const paginatedReading = reading.slice(readingStart, readingEnd);

  const completedStart = (completedPage - 1) * ITEMS_PER_PAGE;
  const completedEnd = completedStart + ITEMS_PER_PAGE;
  const paginatedCompleted = completed.slice(completedStart, completedEnd);

  const favoritesStart = (favoritesPage - 1) * ITEMS_PER_PAGE;
  const favoritesEnd = favoritesStart + ITEMS_PER_PAGE;
  const paginatedFavorites = favorites.manga.slice(
    favoritesStart,
    favoritesEnd
  );

  const charsStart = (charactersPage - 1) * ITEMS_PER_PAGE;
  const charsEnd = charsStart + ITEMS_PER_PAGE;
  const paginatedCharacters = sortedFavCharacters.slice(charsStart, charsEnd);

  const peopleStart = (peoplePage - 1) * ITEMS_PER_PAGE;
  const peopleEnd = peopleStart + ITEMS_PER_PAGE;
  const paginatedPeople = sortedFavPeople.slice(peopleStart, peopleEnd);

  const companiesStart = (companiesPage - 1) * ITEMS_PER_PAGE;
  const companiesEnd = companiesStart + ITEMS_PER_PAGE;
  const paginatedCompanies = sortedFavCompanies.slice(
    companiesStart,
    companiesEnd
  );

  // ---- reusable single-row grid classes ----
  const singleRowWrapper = "mt-4 overflow-x-auto";
  const singleRowGrid =
    "grid grid-flow-col auto-cols-[minmax(0,1fr)] lg:grid-cols-5 gap-4";

  return (
    <div className="min-h-screen dark:bg-[#121212]">
      <div className="max-w-6xl mx-auto p-6">
        <PageHeader
          title="Manga"
          start_date="2025-01-01"
          end_date={new Date().toISOString().split('T')[0]}
          preview="my manga reading activity and favorites"
          status="Finished"
          confidence="certain"
          importance={8}
        />
        <PageDescription
          title="Manga Reading Activity"
          description="Manga reading activity powered by MyAnimeList API, featuring reading statistics, current reads, completed series, and favorite picks."
        />

        {/* Tab Navigation */}
        <div className="mb-8">
          <TabSwitcher activeTab="manga" />
        </div>

        {errorMessage}

        {/* Stats Section */}
        <section className="mb-10">
          {profile?.manga_statistics && (
            <StatsSection profile={profile} activeTab="manga" />
          )}
        </section>

        {/* Currently Reading */}
        {malDataAvailable && (
          <section className="mb-10">
            <TraktSectionHeader
              title="Currently Reading"
              count={reading.length}
            />
            <div className="mt-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {paginatedReading.length ? (
                  paginatedReading.map((item, index) => (
                    <div
                      key={item?.node?.id || item?.id || item?.mal_id || index}
                      className="w-full"
                    >
                      <CompletedAnimeCard anime={item} type="manga" />
                    </div>
                  ))
                ) : (
                  <p className="col-span-full text-center text-muted-foreground py-8 text-sm">
                    No manga currently being read
                  </p>
                )}
              </div>
              {reading.length > ITEMS_PER_PAGE && (
                <div className="flex justify-center mt-6">
                  <Pagination
                    currentPage={readingPage}
                    totalPages={readingTotalPages}
                    onPageChange={setReadingPage}
                  />
                </div>
              )}
            </div>
          </section>
        )}

        {/* Completed Manga */}
        {malDataAvailable && (
          <section className="mb-10">
            <TraktSectionHeader
              title="Completed Manga"
              count={completed.length}
            />
            <div className="mt-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {paginatedCompleted.length ? (
                  paginatedCompleted.map((item, index) => (
                    <div
                      key={item?.node?.id || item?.id || item?.mal_id || index}
                      className="w-full"
                    >
                      <CompletedAnimeCard anime={item} type="manga" />
                    </div>
                  ))
                ) : (
                  <p className="col-span-full text-center text-muted-foreground py-8 text-sm">
                    No completed manga
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

        {/* Favorite Manga */}
        {malDataAvailable && (
          <section className="mb-10">
            <TraktSectionHeader
              title="Favorite Manga"
              count={favorites.manga.length}
            />
            <div className="mt-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {paginatedFavorites.length ? (
                  paginatedFavorites.map((item, index) => (
                    <div
                      key={item?.node?.id || item?.id || item?.mal_id || index}
                      className="w-full"
                    >
                      <AnimeFavoriteCard item={item} type="manga" />
                    </div>
                  ))
                ) : (
                  <p className="col-span-full text-center text-muted-foreground py-8 text-sm">
                    No favorite manga selected
                  </p>
                )}
              </div>
              {favorites.manga.length > ITEMS_PER_PAGE && (
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

        {/* Favorite Characters */}
        <section className="mb-10">
          <TraktSectionHeader
            title="Favorite Characters"
            count={favorites.characters.length}
          />
          <div className={singleRowWrapper}>
            <div className={singleRowGrid}>
              {paginatedCharacters.length ? (
                paginatedCharacters.map((character, index) => (
                  <div
                    key={character.id || character.name || index}
                    className="w-full min-w-0"
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

        {/* Favorite People */}
        <section className="mb-10">
          <TraktSectionHeader
            title="Favorite People"
            count={sortedFavPeople.length}
          />
          <div className={singleRowWrapper}>
            <div className={singleRowGrid}>
              {paginatedPeople.length ? (
                paginatedPeople.map((person, index) => (
                  <div key={person.name || index} className="w-full min-w-0">
                    <AnimeFavoriteCard item={person} type="character" />
                  </div>
                ))
              ) : (
                <p className="col-span-full text-center text-muted-foreground py-8 text-sm">
                    No favorite people found
                  </p>
              )}
            </div>
            {sortedFavPeople.length > ITEMS_PER_PAGE && (
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

        {/* Favorite Companies (from JSON) */}
        <section className="mb-10">
          <TraktSectionHeader
            title="Favorite Companies"
            count={sortedFavCompanies.length}
          />
          <div className={singleRowWrapper}>
            <div className={singleRowGrid}>
              {paginatedCompanies.length ? (
                paginatedCompanies.map((company, index) => (
                  <div key={company.name || index} className="w-full min-w-0">
                    <AnimeFavoriteCard
                      item={company}
                      type="character"
                      isCompany
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

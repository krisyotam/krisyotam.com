// lib/mal-api.ts

// -----------------------
// Helper: Refresh MAL OAuth Token
async function refreshToken() {
  try {
    console.log("MAL API Debug - refreshToken: Attempting to refresh token");
    const response = await fetch("/api/mal/refresh-token", {
      method: "POST",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("MAL API Debug - refreshToken: Failed to refresh token:", errorData);
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();
    console.log("MAL API Debug - refreshToken: Token refresh successful");
    return data;
  } catch (error) {
    console.error("MAL API Debug - refreshToken: Error:", error);
    throw error;
  }
}

// -----------------------
// Helper: Make MAL API Request (with automatic token‐refresh on 401)
async function makeMALRequest(url: string, accessToken: string, options: RequestInit = {}) {
  try {
    console.log("MAL API Debug - makeMALRequest: Making request to", url);
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // If the accessToken has expired or is invalid, attempt to refresh once
    if (response.status === 401) {
      console.log("MAL API Debug - makeMALRequest: Got 401, attempting token refresh");
      const refreshResult = await refreshToken();

      if (!refreshResult) {
        throw new Error("Failed to refresh token");
      }

      // After refresh, MAL_ACCESS_TOKEN in environment should be updated by your backend.
      const newAccessToken = process.env.MAL_ACCESS_TOKEN;
      if (!newAccessToken) {
        throw new Error("No access token available after refresh");
      }

      console.log("MAL API Debug - makeMALRequest: Retrying request with new token");
      const retryResponse = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newAccessToken}`,
        },
      });

      if (!retryResponse.ok) {
        console.error(
          "MAL API Debug - makeMALRequest: Retry failed with status:",
          retryResponse.status
        );
      }

      return retryResponse;
    }

    return response;
  } catch (error) {
    console.error("MAL API Debug - makeMALRequest: Error:", error);
    throw error;
  }
}

// -----------------------
// Get the authenticated user's profile (anime + manga stats)
export async function getUserProfile(accessToken: string) {
  try {
    console.log("MAL API Debug - getUserProfile: Starting request");
    const response = await makeMALRequest(
      "https://api.myanimelist.net/v2/users/@me?fields=anime_statistics,manga_statistics",
      accessToken
    );

    console.log("MAL API Debug - getUserProfile: Response status:", response.status);
    if (!response.ok) {
      const errorText = await response.text().catch(() => "Could not read error response");
      console.error(
        `MAL API Debug - getUserProfile: API error (${response.status}):`,
        errorText
      );
      throw new Error(`MAL API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("MAL API Debug - getUserProfile: Successfully parsed response");

    // If manga_statistics is missing, create a placeholder with zeros
    if (!data.manga_statistics) {
      console.log("MAL API Debug - getUserProfile: Creating placeholder manga statistics");
      data.manga_statistics = {
        num_items: 0,
        num_reading: 0,
        num_completed: 0,
        num_on_hold: 0,
        num_dropped: 0,
        num_plan_to_read: 0,
        num_chapters: 0,
        num_volumes: 0,
        mean_score: 0,
        num_days: 0,
      };
    }

    return data;
  } catch (error) {
    console.error("MAL API Debug - getUserProfile: Error:", error);
    throw error;
  }
}

// -----------------------
// Get a specific “list” (anime) for the authenticated user
export async function getUserAnimeList(
  accessToken: string,
  status: string,
  limit = 100
) {
  try {
    console.log(`MAL API Debug - getUserAnimeList: Starting request for ${status} anime`);
    const fields =
      "id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,nsfw,created_at,updated_at,media_type,status,genres,my_list_status,num_episodes,start_season,broadcast,source,average_episode_duration,rating,pictures,background,related_anime,related_manga,recommendations,studios,statistics";

    // Timeout after 15 seconds
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await makeMALRequest(
      `https://api.myanimelist.net/v2/users/@me/animelist?status=${status}&limit=${limit}&fields=${fields}`,
      accessToken,
      { signal: controller.signal }
    );

    clearTimeout(timeoutId);
    console.log(
      `MAL API Debug - getUserAnimeList: Response status for ${status}:`,
      response.status
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Could not read error response");
      console.error(
        `MAL API Debug - getUserAnimeList: API error (${response.status}):`,
        errorText
      );

      // For “completed” status, return empty array instead of throwing
      if (status === "completed") {
        console.warn(
          "MAL API Debug - getUserAnimeList: Returning empty array for completed anime due to API error"
        );
        return [];
      }

      throw new Error(`Failed to fetch anime list: ${response.status}`);
    }

    const data = await response.json();
    console.log(`MAL API Debug - getUserAnimeList: Successfully fetched ${status} anime`);
    return data.data || [];
  } catch (error) {
    console.error(`MAL API Debug - getUserAnimeList: Error fetching ${status} anime:`, error);

    // For “completed” status, return empty array instead of throwing
    if (status === "completed") {
      console.warn(
        "MAL API Debug - getUserAnimeList: Returning empty array for completed anime due to error:",
        error
      );
      return [];
    }

    throw error;
  }
}

// -----------------------
// Get a specific “list” (manga) for the authenticated user
export async function getUserMangaList(
  accessToken: string,
  status: string,
  limit = 100
) {
  try {
    console.log(`MAL API Debug - getUserMangaList: Starting request for ${status} manga`);
    const fields =
      "id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,nsfw,created_at,updated_at,media_type,status,genres,my_list_status,num_volumes,num_chapters,authors{first_name,last_name},pictures,background,related_anime,related_manga,recommendations";

    // Timeout after 15 seconds
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await makeMALRequest(
      `https://api.myanimelist.net/v2/users/@me/mangalist?status=${status}&limit=${limit}&fields=${fields}`,
      accessToken,
      { signal: controller.signal }
    );

    clearTimeout(timeoutId);
    console.log(
      `MAL API Debug - getUserMangaList: Response status for ${status}:`,
      response.status
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Could not read error response");
      console.error(
        `MAL API Debug - getUserMangaList: API error (${response.status}):`,
        errorText
      );

      // For “completed” status, return empty array instead of throwing
      if (status === "completed") {
        console.warn(
          "MAL API Debug - getUserMangaList: Returning empty array for completed manga due to API error"
        );
        return [];
      }

      throw new Error(`Failed to fetch manga list: ${response.status}`);
    }

    const data = await response.json();
    console.log(`MAL API Debug - getUserMangaList: Successfully fetched ${status} manga`);
    return data.data || [];
  } catch (error) {
    console.error(`MAL API Debug - getUserMangaList: Error fetching ${status} manga:`, error);

    // For “completed” status, return empty array instead of throwing
    if (status === "completed") {
      console.warn(
        "MAL API Debug - getUserMangaList: Returning empty array for completed manga due to error:",
        error
      );
      return [];
    }

    throw error;
  }
}

// -----------------------
// Get user’s “favorites” (anime, manga, characters, people) via MAL or fallback to Jikan
export async function getUserFavorites(username: string, accessToken: string) {
  console.log("MAL API Debug - getUserFavorites: Starting request");

  // First, try the official MAL API
  try {
    console.log("MAL API Debug - getUserFavorites: Trying official API first");
    const response = await makeMALRequest(
      `https://api.myanimelist.net/v2/users/${username}?fields=favorites`,
      accessToken
    );

    console.log("MAL API Debug - getUserFavorites: Official API response status:", response.status);
    if (response.ok) {
      const data = await response.json();
      console.log("MAL API Debug - getUserFavorites: Successfully fetched with official API");
      return data.favorites || { anime: [], manga: [], characters: [], people: [] };
    }
  } catch (err) {
    console.error("MAL API Debug - getUserFavorites: Error with official API:", err);
  }

  // Fallback to Jikan API (unofficial)
  try {
    console.log("MAL API Debug - getUserFavorites: Falling back to Jikan API");
    const response = await fetch(`https://api.jikan.moe/v4/users/${username}/favorites`);

    console.log("MAL API Debug - getUserFavorites: Jikan API response status:", response.status);
    if (!response.ok) {
      const errorText = await response.text().catch(() => "Could not read error response");
      console.error(
        `MAL API Debug - getUserFavorites: Jikan API error (${response.status}):`,
        errorText
      );
      throw new Error(`Failed to fetch favorites: ${response.status}`);
    }

    const data = await response.json();
    console.log("MAL API Debug - getUserFavorites: Successfully fetched with Jikan API");
    return {
      anime: data.data?.anime || [],
      manga: data.data?.manga || [],
      characters: data.data?.characters || [],
      people: data.data?.people || [],
    };
  } catch (err) {
    console.error("MAL API Debug - getUserFavorites: Error with Jikan API:", err);
    return { anime: [], manga: [], characters: [], people: [] };
  }
}

// -----------------------
// Convenience: Get a single anime by ID (MAL primary, fallback Jikan)
export async function getAnimeById(id: number) {
  try {
    const accessToken = process.env.MAL_ACCESS_TOKEN;
    if (accessToken) {
      try {
        const fields =
          "id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,nsfw,created_at,updated_at,media_type,status,genres,my_list_status,num_episodes,start_season,broadcast,source,average_episode_duration,rating,pictures,background,related_anime,related_manga,recommendations,studios,statistics";

        const response = await fetch(
          `https://api.myanimelist.net/v2/anime/${id}?fields=${fields}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (response.ok) {
          return await response.json();
        }
      } catch (error) {
        console.error("Error fetching anime with MAL API:", error);
      }
    }

    // Fallback to Jikan
    const response = await fetch(`https://api.jikan.moe/v4/anime/${id}/full`);
    if (!response.ok) {
      throw new Error(`Failed to fetch anime: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching anime by ID:", error);
    throw error;
  }
}

// -----------------------
// Convenience: Get a single manga by ID (MAL primary, fallback Jikan)
export async function getMangaById(id: number) {
  try {
    const accessToken = process.env.MAL_ACCESS_TOKEN;
    if (accessToken) {
      try {
        const fields =
          "id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,nsfw,created_at,updated_at,media_type,status,genres,my_list_status,num_volumes,num_chapters,authors{first_name,last_name},pictures,background,related_anime,related_manga,recommendations";

        const response = await fetch(
          `https://api.myanimelist.net/v2/manga/${id}?fields=${fields}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (response.ok) {
          return await response.json();
        }
      } catch (error) {
        console.error("Error fetching manga with MAL API:", error);
      }
    }

    // Fallback to Jikan
    const response = await fetch(`https://api.jikan.moe/v4/manga/${id}/full`);
    if (!response.ok) {
      throw new Error(`Failed to fetch manga: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching manga by ID:", error);
    throw error;
  }
}

// -----------------------
// Get basic user‐data from your own backend route (e.g. username, tokens, etc.)
export async function getUserData() {
  try {
    const response = await fetch("/api/mal/user-data");

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

// -----------------------
// NEW: Convenience wrappers for specific “favorites” categories

/**
 * Returns an array of favorite characters for a given MAL username.
 * Relies on getUserFavorites() internally.
 *
 * @param username - The MAL username to fetch favorites from.
 * @param accessToken - The current MAL OAuth access token.
 * @returns An array of “character” objects (MAL or Jikan format).
 */
export async function getFavoriteCharacters(
  username: string,
  accessToken: string
) {
  const favorites = await getUserFavorites(username, accessToken);
  return favorites.characters || [];
}

/**
 * Returns an array of favorite people (voice actors, staff, etc.) for a given MAL username.
 * Relies on getUserFavorites() internally.
 *
 * @param username - The MAL username to fetch favorites from.
 * @param accessToken - The current MAL OAuth access token.
 * @returns An array of “person” objects (MAL or Jikan format).
 */
export async function getFavoritePeople(
  username: string,
  accessToken: string
) {
  const favorites = await getUserFavorites(username, accessToken);
  return favorites.people || [];
}

/**
 * MAL’s official “favorites” does not include a user‐defined “favorite companies” field.
 * Therefore, this function returns an empty array.
 * If MAL adds support in the future, replace this stub with the proper endpoint call.
 *
 * @param username - The MAL username (unused at present).
 * @param accessToken - The current MAL OAuth access token (unused at present).
 * @returns An empty array (no companies supported).
 */
export async function getFavoriteCompanies(
  username: string,
  accessToken: string
) {
  console.warn(
    "getFavoriteCompanies: MAL API does not support user-defined favorite companies. Returning empty array."
  );
  return [];
}

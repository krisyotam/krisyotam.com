// Function to get user profile with both anime and manga statistics
export async function getUserProfile(accessToken: string) {
    try {
      // Request both anime and manga statistics
      const response = await fetch("https://api.myanimelist.net/v2/users/@me?fields=anime_statistics,manga_statistics", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
  
      if (!response.ok) {
        const errorText = await response.text().catch(() => "Could not read error response")
        console.error(`MAL API error (${response.status}):`, errorText)
        throw new Error(`MAL API error: ${response.status} ${response.statusText}`)
      }
  
      const data = await response.json()
  
      // If manga_statistics is missing, create a placeholder with zeros
      if (!data.manga_statistics) {
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
        }
      }
  
      return data
    } catch (error) {
      console.error("Error fetching user profile:", error)
      throw error
    }
  }
  
  // Function to get user anime list
  export async function getUserAnimeList(accessToken: string, status: string, limit = 100) {
    try {
      const fields =
        "id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,nsfw,created_at,updated_at,media_type,status,genres,my_list_status,num_episodes,start_season,broadcast,source,average_episode_duration,rating,pictures,background,related_anime,related_manga,recommendations,studios,statistics"
  
      // Add retry logic and timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout
  
      const response = await fetch(
        `https://api.myanimelist.net/v2/users/@me/animelist?status=${status}&limit=${limit}&fields=${fields}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        },
      )
  
      clearTimeout(timeoutId)
  
      if (!response.ok) {
        const errorText = await response.text().catch(() => "Could not read error response")
        console.error(`MAL API error (${response.status}):`, errorText)
  
        // Return empty array instead of throwing for completed status
        if (status === "completed") {
          console.warn("Returning empty array for completed anime due to API error")
          return []
        }
  
        throw new Error(`Failed to fetch anime list: ${response.status}`)
      }
  
      const data = await response.json()
      return data.data || []
    } catch (error) {
      console.error(`Error fetching ${status} anime:`, error)
  
      // Return empty array instead of throwing for completed status
      if (status === "completed") {
        console.warn("Returning empty array for completed anime due to error:", error)
        return []
      }
  
      throw error
    }
  }
  
  // Function to get user manga list
  export async function getUserMangaList(accessToken: string, status: string, limit = 100) {
    try {
      const fields =
        "id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,nsfw,created_at,updated_at,media_type,status,genres,my_list_status,num_volumes,num_chapters,authors{first_name,last_name},pictures,background,related_anime,related_manga,recommendations"
  
      // Add retry logic and timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout
  
      const response = await fetch(
        `https://api.myanimelist.net/v2/users/@me/mangalist?status=${status}&limit=${limit}&fields=${fields}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        },
      )
  
      clearTimeout(timeoutId)
  
      if (!response.ok) {
        const errorText = await response.text().catch(() => "Could not read error response")
        console.error(`MAL API error (${response.status}):`, errorText)
  
        // Return empty array instead of throwing for completed status
        if (status === "completed") {
          console.warn("Returning empty array for completed manga due to API error")
          return []
        }
  
        throw new Error(`Failed to fetch manga list: ${response.status}`)
      }
  
      const data = await response.json()
      return data.data || []
    } catch (error) {
      console.error(`Error fetching ${status} manga:`, error)
  
      // Return empty array instead of throwing for completed status
      if (status === "completed") {
        console.warn("Returning empty array for completed manga due to error:", error)
        return []
      }
  
      throw error
    }
  }
  
  // Function to get user favorites using two-tier approach
  export async function getUserFavorites(username: string, accessToken: string) {
    // First try with the official API
    try {
      const response = await fetch(`https://api.myanimelist.net/v2/users/${username}?fields=favorites`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
  
      if (response.ok) {
        const data = await response.json()
        return data.favorites || { anime: [], manga: [], characters: [] }
      }
    } catch (err) {
      console.error("Error fetching favorites with official API:", err)
    }
  
    // Fallback to Jikan API (unofficial)
    try {
      const response = await fetch(`https://api.jikan.moe/v4/users/${username}/favorites`)
  
      if (!response.ok) {
        const errorText = await response.text().catch(() => "Could not read error response")
        console.error(`Jikan API error (${response.status}):`, errorText)
        throw new Error(`Failed to fetch favorites: ${response.status}`)
      }
  
      const data = await response.json()
      return {
        anime: data.data?.anime || [],
        manga: data.data?.manga || [],
        characters: data.data?.characters || [],
      }
    } catch (err) {
      console.error("Error fetching favorites with Jikan API:", err)
      return { anime: [], manga: [], characters: [] }
    }
  }
  
  // Function to get anime by ID
  export async function getAnimeById(id: number) {
    try {
      // First try with MAL API if we have access token
      const accessToken = process.env.MAL_ACCESS_TOKEN
      if (accessToken) {
        try {
          const fields =
            "id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,nsfw,created_at,updated_at,media_type,status,genres,my_list_status,num_episodes,start_season,broadcast,source,average_episode_duration,rating,pictures,background,related_anime,related_manga,recommendations,studios,statistics"
  
          const response = await fetch(`https://api.myanimelist.net/v2/anime/${id}?fields=${fields}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
  
          if (response.ok) {
            return await response.json()
          }
        } catch (error) {
          console.error("Error fetching anime with MAL API:", error)
        }
      }
  
      // Fallback to Jikan API
      const response = await fetch(`https://api.jikan.moe/v4/anime/${id}/full`)
  
      if (!response.ok) {
        throw new Error(`Failed to fetch anime: ${response.status}`)
      }
  
      const data = await response.json()
      return data.data
    } catch (error) {
      console.error("Error fetching anime by ID:", error)
      throw error
    }
  }
  
  // Function to get manga by ID
  export async function getMangaById(id: number) {
    try {
      // First try with MAL API if we have access token
      const accessToken = process.env.MAL_ACCESS_TOKEN
      if (accessToken) {
        try {
          const fields =
            "id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,nsfw,created_at,updated_at,media_type,status,genres,my_list_status,num_volumes,num_chapters,authors{first_name,last_name},pictures,background,related_anime,related_manga,recommendations"
  
          const response = await fetch(`https://api.myanimelist.net/v2/manga/${id}?fields=${fields}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
  
          if (response.ok) {
            return await response.json()
          }
        } catch (error) {
          console.error("Error fetching manga with MAL API:", error)
        }
      }
  
      // Fallback to Jikan API
      const response = await fetch(`https://api.jikan.moe/v4/manga/${id}/full`)
  
      if (!response.ok) {
        throw new Error(`Failed to fetch manga: ${response.status}`)
      }
  
      const data = await response.json()
      return data.data
    } catch (error) {
      console.error("Error fetching manga by ID:", error)
      throw error
    }
  }
  
  // Helper function to get user data
  export async function getUserData() {
    try {
      const response = await fetch("/api/mal/user-data")
  
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
  
      return await response.json()
    } catch (error) {
      console.error("Error fetching user data:", error)
      throw error
    }
  }
  
  
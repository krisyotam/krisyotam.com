type TIL = {
  content: string
  date: string
  path: string
  title: string
}

// Client-side cache for TIL entries
let cachedTilEntries: TIL[] | null = null
let lastFetchTime = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export const getGitHubTilRepo = async () => {
  // Return cached results if available and not expired
  const now = Date.now()
  if (cachedTilEntries && now - lastFetchTime < CACHE_DURATION) {
    return cachedTilEntries
  }

  try {
    // Fetch the feed.json file from GitHub
    const response = await fetch("https://raw.githubusercontent.com/krisyotam/til/master/feed.json", {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 3600 }, // Revalidate once per hour
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch TIL feed: ${response.status} ${response.statusText}`)
    }

    const body = await response.text()

    try {
      // Parse the JSON and process the entries
      const til = JSON.parse(body) as TIL[]

      // Process the entries to ensure paths are correctly formatted
      const processedTil = await Promise.all(
        til.map(async (item) => {
          // Remove file extension from path
          const cleanPath = item.path.substring(0, item.path.lastIndexOf("."))

          // If content is not already included in the feed, fetch it
          let content = item.content
          if (!content) {
            try {
              const contentResponse = await fetch(
                `https://raw.githubusercontent.com/krisyotam/til/master/${item.path}`,
                { next: { revalidate: 3600 } },
              )

              if (contentResponse.ok) {
                content = await contentResponse.text()
              }
            } catch (error) {
              console.error(`Failed to fetch content for ${item.path}:`, error)
            }
          }

          return {
            ...item,
            path: cleanPath,
            content: content || "",
          }
        }),
      )

      // Update cache
      cachedTilEntries = processedTil
      lastFetchTime = now

      return processedTil
    } catch (e) {
      console.error("Error parsing TIL feed:", e)
      throw new Error("Unable to parse TIL Feed")
    }
  } catch (error) {
    console.error("Error in getGitHubTilRepo:", error)

    // If we have cached entries, return them even if they're expired
    if (cachedTilEntries) {
      return cachedTilEntries
    }

    // Return an empty array as fallback
    return []
  }
}


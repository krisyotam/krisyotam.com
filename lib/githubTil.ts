type TIL = {
  content: string
  date: string
  path: string
  title: string
  id?: number
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
    const response = await fetch("https://raw.githubusercontent.com/krisyotam/til/main/feed.json", {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 36 }, // Revalidate once per hour
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch TIL feed: ${response.status} ${response.statusText}`)
    }

    const body = await response.text()

    try {
      // Parse the JSON and process the entries
      const til = JSON.parse(body) as TIL[]

      // Process the entries to ensure paths are correctly formatted but don't fetch individual files
      const processedTil = til.map((item) => {
        // Remove file extension from path
        const cleanPath = item.path.replace(/\.md$/, "")

        return {
          ...item,
          path: cleanPath,
          // Use the content already in the feed.json
          content: item.content || ""
        }
      })

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

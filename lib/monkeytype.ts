// Monkeytype API client
// Documentation: https://docs.monkeytype.com/

const API_BASE_URL = "https://api.monkeytype.com"

// Helper function to make authenticated API requests
async function fetchFromMonkeytype(endpoint: string, params = {}) {
  const apiKey = process.env.MONKEY_TYPE_API_KEY

  if (!apiKey) {
    console.error("MONKEY_TYPE_API_KEY environment variable is not set")
    return null
  }

  try {
    // Build URL with query parameters
    const url = new URL(`${API_BASE_URL}${endpoint}`)
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value))
      }
    })

    // Log the request for debugging
    console.log(`Fetching from Monkeytype API: ${url.toString()}`)

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `ApeKey ${apiKey}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error(`Monkeytype API error (${response.status}):`, errorData)
      return null
    }

    const data = await response.json()
    console.log(`API response for ${endpoint}:`, data)
    return data.data
  } catch (error) {
    console.error("Error fetching from Monkeytype API:", error)
    return null
  }
}

// Get user's typing stats
export async function getStats() {
  return fetchFromMonkeytype("/users/stats")
}

// Get user's personal bests for a specific mode
export async function getPersonalBests(mode: string, mode2: string | number) {
  const data = await fetchFromMonkeytype("/users/personalBests", { mode, mode2 })

  // The API returns a complex nested structure
  // For debugging, log the entire structure
  console.log("Personal bests data:", JSON.stringify(data, null, 2))

  if (!data) return null

  // Try different access patterns based on the API response structure
  if (data[mode] && typeof data[mode] === "object") {
    // If mode2 is directly a key in the mode object
    if (data[mode][mode2]) {
      return data[mode][mode2]
    }

    // If mode2 is nested under a different structure
    const modeData = data[mode]
    const keys = Object.keys(modeData)

    if (keys.length > 0) {
      // If there's any data for this mode, return the first entry
      // This is a fallback approach
      const firstKey = keys[0]
      if (firstKey === String(mode2) || firstKey.includes(String(mode2))) {
        return modeData[firstKey]
      }

      // Last resort: just return the first entry
      return modeData[firstKey]
    }
  }

  return null
}

// Get user's test activity (last 372 days)
export async function getTestActivity() {
  return fetchFromMonkeytype("/users/currentTestActivity")
}

// Get user's recent results
export async function getResults(limit = 10) {
  return fetchFromMonkeytype("/results", { limit })
}

// Get user's streak information
export async function getStreak() {
  return fetchFromMonkeytype("/users/streak")
}


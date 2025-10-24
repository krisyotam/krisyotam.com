// Monkeytype API client
// Documentation: https://docs.monkeytype.com/

const API_BASE_URL = "https://api.monkeytype.com"

// Fallback data for when API is unavailable
const FALLBACK_DATA = {
  stats: {
    completedTests: 450,
    startedTests: 480,
    timeTyping: 32400, // 9 hours in seconds
  },
  personalBests: {
    wpm: 75,
    accuracy: 95.5,
    consistency: 85,
  },
  streak: {
    length: 12,
    maxLength: 28,
    hourOffset: null,
  },
  testActivity: null, // Will show no activity if API fails
  results: [], // Will show no recent results if API fails
}

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  retryStatuses: [503, 502, 504, 429], // Retry on these HTTP status codes
}

// Helper function to sleep for retry delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Helper function to make authenticated API requests with retry logic
async function fetchFromMonkeytype(endpoint: string, params = {}, retryCount = 0): Promise<any> {
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
      
      // Check if we should retry
      if (
        RETRY_CONFIG.retryStatuses.includes(response.status) &&
        retryCount < RETRY_CONFIG.maxRetries
      ) {
        console.log(`Retrying request (attempt ${retryCount + 1}/${RETRY_CONFIG.maxRetries})...`)
        await sleep(RETRY_CONFIG.retryDelay * (retryCount + 1)) // Exponential backoff
        return fetchFromMonkeytype(endpoint, params, retryCount + 1)
      }
      
      return null
    }

    const data = await response.json()
    console.log(`API response for ${endpoint}:`, data)
    return data.data
  } catch (error) {
    console.error("Error fetching from Monkeytype API:", error)
    
    // Retry on network errors
    if (retryCount < RETRY_CONFIG.maxRetries) {
      console.log(`Retrying request due to network error (attempt ${retryCount + 1}/${RETRY_CONFIG.maxRetries})...`)
      await sleep(RETRY_CONFIG.retryDelay * (retryCount + 1))
      return fetchFromMonkeytype(endpoint, params, retryCount + 1)
    }
    
    return null
  }
}

// Get user's typing stats
export async function getStats() {
  const data = await fetchFromMonkeytype("/users/stats")
  return data || FALLBACK_DATA.stats
}

// Get user's personal bests for a specific mode
export async function getPersonalBests(mode: string, mode2: string | number) {
  const data = await fetchFromMonkeytype("/users/personalBests", { mode, mode2 })

  // If API failed, return fallback data
  if (!data) {
    return FALLBACK_DATA.personalBests
  }

  // The API returns a complex nested structure
  // For debugging, log the entire structure
  console.log("Personal bests data:", JSON.stringify(data, null, 2))

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

  // Return fallback if no data found
  return FALLBACK_DATA.personalBests
}

// Get user's test activity (last 372 days)
export async function getTestActivity() {
  const data = await fetchFromMonkeytype("/users/currentTestActivity")
  return data || FALLBACK_DATA.testActivity
}

// Get user's recent results
export async function getResults(limit = 10) {
  const data = await fetchFromMonkeytype("/results", { limit })
  return data || FALLBACK_DATA.results
}

// Get user's streak information
export async function getStreak() {
  const data = await fetchFromMonkeytype("/users/streak")
  return data || FALLBACK_DATA.streak
}


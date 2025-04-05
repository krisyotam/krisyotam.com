import { getActivePosts } from "../utils/posts"
import quotesData from "../data/header-quotes.json"
import { HomeClient } from "../components/home-client"

function getRandomQuote() {
  const quotes = quotesData.quotes
  return quotes[Math.floor(Math.random() * quotes.length)]
}

export const dynamic = "force-dynamic"

export default async function Home() {
  try {
    // Fetch active posts directly using the getActivePosts function
    // Posts are already sorted by date (newest first) in the getActivePosts function
    const posts = await getActivePosts()

    // DEBUG: Log the posts being rendered

    // Ensure posts are available and in the expected format
    if (!posts || !Array.isArray(posts)) {
      console.error("Error: Posts data is missing or not an array")
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-xl text-gray-600 dark:text-gray-400">Failed to load posts. Please try again later.</p>
        </div>
      )
    }

    const randomQuote = getRandomQuote()

    // Use the HomeClient component which includes the toggle button
    return <HomeClient posts={posts} randomQuote={randomQuote} />
  } catch (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600 dark:text-gray-400">Failed to load posts. Please try again later.</p>
      </div>
    )
  }
}


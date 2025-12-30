import { getActivePosts } from "@/utils/posts"
import quotesData from "@/data/quotes.json"
import { HomeClient } from "@/components/home/HomeClient"
import FixOutlineIssue from "@/components/fix-outline-issue"

function getRandomQuote() {
  const quotes = quotesData.quotes
  return quotes[Math.floor(Math.random() * quotes.length)]
}

interface HomeWrapperProps {
  initialView?: 'list' | 'grid'
}

// Make the home wrapper render dynamically and avoid server-side caching
export const revalidate = 0
export const fetchCache = 'no-store'
export const dynamic = 'force-dynamic'

export default async function HomeWrapper({ initialView = 'list' }: HomeWrapperProps) {
  try {
    // Get all active posts from both essays.json and feed.json
    const posts = await getActivePosts()
    
    if (!posts || !Array.isArray(posts) || posts.length === 0) {
      throw new Error("No active posts found.")
    }
    
    const randomQuote = getRandomQuote()

    return (
      <>
        <FixOutlineIssue />
        <HomeClient posts={posts} randomQuote={randomQuote} initialView={initialView} />
      </>
    )
  } catch (error) {
    console.error("Critical error loading home page:", error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-2xl font-semibold mb-4">We're updating our site</h1>
        <p className="text-muted-foreground mb-6">Please check back soon for new content.</p>
        <p className="text-sm text-red-500">
          Error details: {error instanceof Error ? error.message : String(error)}
        </p>
      </div>
    )
  }
}

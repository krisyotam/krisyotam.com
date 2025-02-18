import { BlogPost } from "../components/blog-post"
import { getHomePagePosts } from "../utils/homePageGhost"
import quotesData from "../data/header-quotes.json"

function getRandomQuote() {
  const quotes = quotesData.quotes
  return quotes[Math.floor(Math.random() * quotes.length)]
}

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function Home() {
  try {
    const allPosts = await getHomePagePosts()
    const NOW_PAGE_FILTER_TAG = process.env.NOW_PAGE_FILTER_TAG || "krisyotam-now"

    // Filter out posts with the NOW_PAGE_FILTER_TAG
    const posts = allPosts.filter((post) => !post.tags.some((tag) => tag.name === NOW_PAGE_FILTER_TAG))

    const randomQuote = getRandomQuote()

    return (
      <div className="relative min-h-screen bg-background text-foreground">
        <div className="p-8 md:p-16 lg:p-24">
          <div className="max-w-4xl mx-auto">
            <header className="mb-16 pl-8">
              <h1 className="text-4xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Kris Yotam</h1>
              <p className="text-sm font-light italic text-gray-600 dark:text-gray-400">
                "{randomQuote.text}" - {randomQuote.author}
              </p>
            </header>
            <main>
              <div className="space-y-12">
                {posts.map((post) => (
                  <BlogPost
                    key={post.slug}
                    slug={post.slug}
                    title={post.title}
                    date={new Date(post.published_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                    excerpt={post.excerpt}
                  />
                ))}
              </div>
            </main>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Failed to fetch posts:", error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600 dark:text-gray-400">Failed to load posts. Please try again later.</p>
      </div>
    )
  }
}


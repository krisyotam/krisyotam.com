import { BlogPost } from "../components/blog-post"
import { getAllPosts } from "../utils/posts"
import quotesData from "../data/header-quotes.json"

function getRandomQuote() {
  const quotes = quotesData.quotes
  return quotes[Math.floor(Math.random() * quotes.length)]
}

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function Home() {
  try {
    // Fetch all posts and log the data for debugging
    const posts = await getAllPosts()

    // Ensure posts are available and in the expected format
    if (!posts || !Array.isArray(posts)) {
      console.error("Error: Posts data is missing or not an array")
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Failed to load posts. Please try again later.
          </p>
        </div>
      )
    }

    console.log(
      "Home page posts:",
      posts.map((p) => ({ slug: p.slug, type: p.type, date: p.date }))
    )

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
                {posts.map((post) => {
                  // Ensure post data is available before rendering each BlogPost
                  if (!post.slug || !post.type || !post.date || !post.preview) {
                    console.error("Missing post data:", post)
                    return null // Skip rendering this post if any required field is missing
                  }

                  return (
                    <BlogPost
                      key={post.slug}
                      slug={post.slug}
                      type={post.type}
                      title={post.title}
                      date={new Date(post.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                      excerpt={post.preview}
                    />
                  )
                })}
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

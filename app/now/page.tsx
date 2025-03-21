import { getActiveNowPost, getArchivedNowPosts, formatNowDate } from "@/utils/markdown"
import type { Metadata } from "next"
import { NowContent } from "@/components/now-content"
import { MonthlyArchive } from "@/components/monthly-archive"
import "./now-page.css"

export const metadata: Metadata = {
  title: "Now",
  description: "What I'm focused on right now",
}

export default async function NowPage() {
  const activePost = await getActiveNowPost()
  const archivedPosts = await getArchivedNowPosts()

  const lastUpdated = activePost ? formatNowDate(activePost.date) : "Unknown"

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
        <header className="mb-16">
          <h1 className="text-4xl font-semibold mb-3 text-foreground">Now</h1>
          <p className="text-muted-foreground">Last updated: {lastUpdated}</p>
          <div className="mt-6 text-foreground">
            <p>
              This is my{" "}
              <a href="https://nownownow.com/about" className="text-blue-600 hover:underline dark:text-blue-400">
                now page
              </a>
              . Inspired by Derek Sivers, it's a snapshot of what I'm focused on at this point in my life. Unlike social
              media that captures moments, this page reflects my current priorities, interests, and endeavors.
            </p>
          </div>
        </header>

        {activePost && activePost.content && <NowContent content={activePost.content} />}

        {archivedPosts.length > 0 && (
          <section className="mt-24">
            <h2 className="text-2xl font-semibold mb-6 text-foreground">Archive</h2>
            <div className="space-y-4">
              {archivedPosts.map((post) => (
                <MonthlyArchive
                  key={post.slug}
                  month={post.title}
                  content={post.content ? <NowContent content={post.content} /> : null}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}


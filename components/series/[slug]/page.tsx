import Link from "next/link"
import { Metadata } from "next"
import { getSeriesBySlug, getAllSeriesData } from "@/utils/series"
import { PageHeader } from "@/components/page-header"
import { getAllPosts } from "@/utils/posts"
import { getPostsForSeries } from "@/utils/series"
import { formatDate } from "@/utils/date-formatter"
import { notFound } from "next/navigation"
import { getPostYear } from "@/utils/posts"

// Ensure fresh data on each request
export const dynamic = "force-dynamic"
export const revalidate = 0

interface SeriesPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({
  params,
}: SeriesPageProps): Promise<Metadata> {
  const series = await getSeriesBySlug(params.slug)
  if (!series) {
    return {
      title: "Series Not Found",
    }
  }

  return {
    title: `${series.title} | Series`,
    description: series.preview,
  }
}

export async function generateStaticParams() {
  try {
    const seriesData = await getAllSeriesData()
    // Only generate paths for active series
    return seriesData
      .filter(series => series["show-status"] === "active")
      .map((series) => ({
        slug: series.slug,
      }))
  } catch (error) {
    console.error("Error generating series static params:", error)
    return []
  }
}

export default async function SeriesPage({ params }: SeriesPageProps) {
  try {
    const series = await getSeriesBySlug(params.slug)
    if (!series) {
      notFound()
    }

    const allPosts = await getAllPosts()
    const posts = await getPostsForSeries(params.slug, allPosts)

    return (
      <div className="relative min-h-screen bg-background text-foreground">
        <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
          <PageHeader
            title={series.title}
            subtitle={series.subtitle || ""}
            date={series.date}
            preview={series.preview || ""}
            status={series.status as "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished"}
            confidence={series.confidence as "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain"}
            importance={series.importance}
            backText="Series"
            backHref="/series"
          />

          <main>
            <div className="mt-8">
              {posts.length === 0 ? (
                <p className="text-muted-foreground">No posts found in this series.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <tbody>
                      {posts.map((post, index) => (
                        <tr key={post.slug} className="border-b border-border hover:bg-secondary/50 transition-colors">
                          <td className="py-4 px-2 w-8 text-center text-muted-foreground">
                            {index + 1}
                          </td>
                          <td className="py-4 px-2">
                            <Link href={`/blog/${getPostYear(post.date)}/${post.slug}`} className="text-foreground">
                              {post.title}
                            </Link>
                            <p className="text-sm text-muted-foreground mt-1">{post.preview}</p>
                          </td>
                          <td className="py-4 px-2 text-right text-muted-foreground">
                            {formatDate(post.date)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="mt-8">
              <Link href="/series" className="text-primary hover:underline">
                ← Back to all series
              </Link>
            </div>
          </main>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error rendering series page:", error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Series</h1>
          <p className="text-muted-foreground mb-4">There was a problem loading this series.</p>
          <Link href="/series" className="text-primary hover:underline">
            ← Back to all series
          </Link>
        </div>
      </div>
    )
  }
} 
import Link from "next/link"
import { Metadata } from "next"
import { getSeriesBySlug, getAllSeriesData } from "@/utils/series"
import { PageHeader } from "@/components/page-header"
import { getAllPosts } from "@/utils/posts"
import { getPostsForSeries } from "@/utils/series"
import { formatDate } from "@/utils/date-formatter"
import { notFound } from "next/navigation"

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
  const seriesData = await getAllSeriesData()
  return seriesData.map((series) => ({
    slug: series.slug,
  }))
}

export default async function SeriesPage({ params }: SeriesPageProps) {
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
          status={series.status}
          confidence={series.confidence}
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
                          <Link href={`/blog/${post.slug}`} className="text-foreground">
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
} 
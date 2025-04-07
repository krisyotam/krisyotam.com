import Link from "next/link"
import { getPostsByCategory, getCategories, getPostYear, getCategoryDataBySlug } from "@/utils/posts"
import { notFound } from "next/navigation"
import { CategoryHeader } from "@/components/category-header"
import { ArrowLeft } from "lucide-react"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.map((category) => ({
    slug: category.slug,
  }))
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string }
}) {
  try {
    const posts = await getPostsByCategory(params.slug)
    const categoryData = await getCategoryDataBySlug(params.slug)

    if (posts.length === 0) {
      notFound()
    }

    // If we have category data, use it; otherwise, fallback to derived data
    const categoryName =
      categoryData?.title ||
      posts[0]?.category ||
      params.slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")

    return (
      <div className="relative min-h-screen bg-background text-foreground">
        <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
          {categoryData ? (
            <CategoryHeader
              title={categoryData.title}
              subtitle={categoryData.subtitle}
              date={categoryData.date}
              preview={categoryData.preview}
              status={categoryData.status || "In Progress"}
              confidence={categoryData.confidence || "possible"}
              importance={categoryData.importance || 5}
              className="mb-12"
            />
          ) : (
            <header className="mb-16">
              <div className="mb-4">
                <Link
                  href="/categories"
                  className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Back to Categories
                </Link>
              </div>
              <h1 className="text-xl font-medium mb-1 text-foreground">{categoryName}</h1>
              <p className="text-muted-foreground">
                {posts.length} {posts.length === 1 ? "post" : "posts"}
              </p>
            </header>
          )}

          <main>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-2 font-semibold text-foreground">Title</th>
                    <th className="text-right py-4 px-2 font-semibold text-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => {
                    // Get the year from the post date for the URL
                    const year = getPostYear(post.date)

                    // Create the correct URL path using the new blog structure
                    const postUrl = `/blog/${year}/${post.slug}`

                    return (
                      <tr key={post.slug} className="border-b border-border hover:bg-secondary/50 transition-colors">
                        <td className="py-4 px-2">
                          <Link href={postUrl} className="text-foreground">
                            {post.title}
                          </Link>
                        </td>
                        <td className="py-4 px-2 text-right text-muted-foreground">
                          {new Date(post.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Failed to fetch category posts:", error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-xl text-muted-foreground">Failed to load category posts. Please try again later.</p>
      </div>
    )
  }
}


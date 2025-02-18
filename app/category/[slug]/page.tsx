import Link from "next/link"
import { getPostsByCategory, getCategories } from "../../../utils/ghost"
import { notFound } from "next/navigation"

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

    if (posts.length === 0) {
      notFound()
    }

    const categoryName = posts[0]?.tags.find((tag) => !tag.name.startsWith("#"))?.name || params.slug

    return (
      <div className="relative min-h-screen bg-background text-foreground">
        <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
          <header className="mb-16">
            <h1 className="text-4xl font-semibold mb-3 text-foreground">{categoryName}</h1>
            <p className="text-muted-foreground">
              {posts.length} {posts.length === 1 ? "post" : "posts"}
            </p>
          </header>
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
                  {posts.map((post) => (
                    <tr key={post.slug} className="border-b border-border hover:bg-secondary/50 transition-colors">
                      <td className="py-4 px-2">
                        <Link href={`/post/${post.slug}`} className="text-foreground hover:underline">
                          {post.title}
                        </Link>
                      </td>
                      <td className="py-4 px-2 text-right text-muted-foreground">
                        {new Date(post.published_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
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


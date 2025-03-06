import Link from "next/link"
import { getCategories, getPostsByCategory } from "../../utils/ghost"

export const dynamic = "force-dynamic"

type Category = {
  name: string
  slug: string
  count: number
}

type Post = {
  title: string
  slug: string
  tags: { name: string; slug: string }[]
}

export default async function CategoriesPage() {
  try {
    let categories: Category[] = await getCategories()

    // Fetch posts for each category and filter out those containing the "krisyotam-now" tag
    const filteredCategories: Category[] = []

    for (const category of categories) {
      const posts: Post[] = await getPostsByCategory(category.slug)

      const hasExcludedTag = posts.some((post) =>
        post.tags.some((tag) => tag.slug === "krisyotam-now")
      )

      if (!hasExcludedTag) {
        filteredCategories.push(category)
      }
    }

    if (filteredCategories.length === 0) {
      return (
        <div className="relative min-h-screen bg-background text-foreground">
          <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
            <p className="text-xl text-muted-foreground">No categories found.</p>
          </div>
        </div>
      )
    }

    return (
      <div className="relative min-h-screen bg-background text-foreground">
        <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
          <main>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <tbody>
                  {filteredCategories.map((category) => (
                    <tr key={category.slug} className="border-b border-border hover:bg-secondary/50 transition-colors">
                      <td className="py-4 px-2">
                        <Link href={`/category/${category.slug}`} className="text-foreground hover:underline">
                          {category.name}
                        </Link>
                      </td>
                      <td className="py-4 px-2 text-right text-muted-foreground">{category.count}</td>
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
    console.error("Failed to fetch categories:", error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-xl text-muted-foreground">Failed to load categories. Please try again later.</p>
      </div>
    )
  }
}

import Link from "next/link"
import { getCategories } from "../../utils/posts"

export const dynamic = "force-dynamic"

export default async function CategoriesPage() {
  try {
    const categories = await getCategories()

    if (categories.length === 0) {
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
                  {categories.map((category) => (
                    <tr key={category.slug} className="border-b border-border hover:bg-secondary/50 transition-colors">
                      <td className="py-4 px-2">
                        <Link href={`/category/${category.slug}`} className="text-foreground">
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


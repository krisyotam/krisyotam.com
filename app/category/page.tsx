import Link from "next/link"
import { getCategories, getAllCategoryData } from "@/utils/posts"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function CategoriesPage() {
  try {
    const categories = await getCategories()
    const categoryData = await getAllCategoryData()

    // Create a map of category data for quick lookup
    const categoryDataMap = new Map(categoryData.filter((cat) => cat.status === "active").map((cat) => [cat.slug, cat]))

    return (
      <div className="relative min-h-screen bg-background text-foreground">
        <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
          <header className="mb-16">
            <h1 className="text-3xl font-medium mb-2 text-foreground">Categories</h1>
            <p className="text-muted-foreground">Browse content by topic</p>
          </header>

          <main>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {categories.map((category) => {
                const catData = categoryDataMap.get(category.slug)

                return (
                  <Link
                    key={category.slug}
                    href={`/category/${category.slug}`}
                    className="block p-6 border border-border rounded-md hover:bg-secondary/50 transition-colors"
                  >
                    <h2 className="text-xl font-medium mb-2 text-foreground">{catData?.title || category.name}</h2>
                    {catData?.subtitle && <p className="text-sm text-muted-foreground mb-3">{catData.subtitle}</p>}
                    {catData?.preview && <p className="text-muted-foreground">{catData.preview}</p>}
                  </Link>
                )
              })}
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


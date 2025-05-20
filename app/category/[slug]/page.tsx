import { getPostsByCategory, getCategories, getCategoryDataBySlug } from "@/utils/posts"
import { notFound } from "next/navigation"
import { CategoryClient } from "./category-client"

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
      <CategoryClient 
        posts={posts} 
        categoryData={categoryData} 
        categoryName={categoryName} 
        slug={params.slug} 
      />
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


import type { Metadata } from "next"
import { BlogrollClient } from "../../blogroll-client"

interface PageProps {
  params: { category: string }
}

export function generateMetadata({ params }: PageProps): Metadata {
  const decodedCategory = decodeURIComponent(params.category)
  return {
    title: `${decodedCategory} | Blogroll | Kris Yotam`,
    description: `Websites and authors in the ${decodedCategory} category.`,
  }
}

export default function BlogrollCategoryPage({ params }: PageProps) {
  const decodedCategory = decodeURIComponent(params.category)
  return <BlogrollClient initialCategoryFilter={decodedCategory} />
} 
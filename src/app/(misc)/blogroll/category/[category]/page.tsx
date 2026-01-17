import type { Metadata } from "next"
import { BlogrollClient } from "../../blogroll-client"

interface PageProps {
  params: Promise<{ category: string }>
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const decodedCategory = decodeURIComponent(params.category)
  return {
    title: `${decodedCategory} | Blogroll | Kris Yotam`,
    description: `Websites and authors in the ${decodedCategory} category.`,
  }
}

export default async function BlogrollCategoryPage(props: PageProps) {
  const params = await props.params;
  const decodedCategory = decodeURIComponent(params.category)
  return <BlogrollClient initialCategoryFilter={decodedCategory} />
} 
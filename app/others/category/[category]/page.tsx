import type { Metadata } from "next"
import { OthersClient } from "../../others-client"

interface PageProps {
  params: { category: string }
}

export function generateMetadata({ params }: PageProps): Metadata {
  const decodedCategory = decodeURIComponent(params.category)
  return {
    title: `${decodedCategory} | Others | Kris Yotam`,
    description: `Websites and authors in the ${decodedCategory} category.`,
  }
}

export default function OthersCategoryPage({ params }: PageProps) {
  const decodedCategory = decodeURIComponent(params.category)
  return <OthersClient initialCategoryFilter={decodedCategory} />
} 
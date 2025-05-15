import { Metadata } from "next"
import FavsClient from "../favs-client"
import favsData from "@/data/favs.json"
import { Item } from "@/components/bento/types"
import { notFound } from "next/navigation"

// Generate metadata dynamically based on the category
export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const items = favsData.items as Item[]
  const categories = Array.from(new Set(items.map(item => item.category))).sort()
  
  // Decode the URL-encoded category parameter
  const categorySlug = params.category.toLowerCase()
  const matchedCategory = categories.find(category => 
    category.toLowerCase() === categorySlug
  )

  if (!matchedCategory) {
    return {
      title: "Favs | Not Found",
      description: "The requested category could not be found."
    }
  }
  
  const title = `${matchedCategory} | Favs`
  const description = `A collection of my favorite ${matchedCategory.toLowerCase()} items.`

  return {
    title,
    description,
    openGraph: {
      title,
      description
    }
  }
}

export default function CategoryFavsPage({ params }: { params: { category: string } }) {
  const items = favsData.items as Item[]
  const categories = Array.from(new Set(items.map(item => item.category))).sort()
  
  // Verify that the requested category exists
  const categorySlug = params.category.toLowerCase()
  const matchedCategory = categories.find(category => 
    category.toLowerCase() === categorySlug
  )

  // If category doesn't exist, show 404
  if (!matchedCategory) {
    notFound()
  }

  return <FavsClient initialCategory={matchedCategory} />
} 
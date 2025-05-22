import type { Metadata } from "next"
import { EssaysClient } from "../essays-client"
import essaysData from "@/data/essays.json"
import { notFound } from "next/navigation"
import type { Essay } from "@/types/essay"

// Generate metadata dynamically based on the essay category
export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const essays = essaysData as Essay[]
  const categories = Array.from(new Set(essays.map(item => item.category))).sort()
  
  // Decode the URL-encoded category parameter and convert from slug to regular category
  const categorySlug = params.category.toLowerCase()
  const matchedCategory = categories.find(category => 
    category.toLowerCase().replace(/\s+/g, "-") === categorySlug
  )

  if (!matchedCategory && params.category !== 'all') {
    return {
      title: "Essays | Not Found",
      description: "The requested essay category could not be found."
    }
  }

  // Get a representative essay with an image for this category (if available)
  const essaysOfCategory = matchedCategory 
    ? essays.filter(item => item.category === matchedCategory) 
    : essays;
  
  // Find an essay with an image to use as the featured image
  const featuredEssay = essaysOfCategory.find(item => item.img && item.img.length > 0);
  
  const title = matchedCategory ? `${matchedCategory} | Essays | Kris Yotam` : "Essays | Kris Yotam";
  const description = matchedCategory 
    ? `A collection of essays on ${matchedCategory.toLowerCase()}.`
    : "A collection of formal writings on diverse topics.";
  
  return {
    title,
    description,
    openGraph: {
      title: matchedCategory ? `${matchedCategory} Essays | Kris Yotam` : "Essays Collection | Kris Yotam",
      description,
      type: "website",
      images: [
        {
          url: "https://i.postimg.cc/jSDMT1Sn/research.png",
          alt: `${matchedCategory || 'Essays'} by Kris Yotam`,
          width: 1200,
          height: 630,
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: matchedCategory ? `${matchedCategory} Essays | Kris Yotam` : "Essays Collection | Kris Yotam",
      description,
      images: ["https://i.postimg.cc/jSDMT1Sn/research.png"],
    },
  }
}

export default function CategoryEssaysPage({ params }: { params: { category: string } }) {
  const essays = essaysData as Essay[]
  const categories = Array.from(new Set(essays.map(item => item.category))).sort()
  
  // Verify that the requested category exists
  const categorySlug = params.category.toLowerCase()
  const matchedCategory = categories.find(category => 
    category.toLowerCase().replace(/\s+/g, "-") === categorySlug
  )

  // Special case for 'all' to show all essays
  if (params.category !== 'all' && !matchedCategory) {
    notFound()
  }

  return <EssaysClient initialCategory={matchedCategory || 'All'} />
} 
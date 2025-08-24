import type { Metadata } from "next"
import { ResearchClient } from "../research-client"
import researchData from "@/data/research.json"
import { notFound } from "next/navigation"

interface Research {
  id: string
  title: string
  abstract: string
  importance: string | number
  authors: string[]
  subject: string
  keywords: string[]
  postedBy: string
  postedOn: string
  dateStarted: string
  status: string
  bibliography: string[]
  img: string
  pdfLink: string
  sourceLink: string
  category: string
  tags: string[]
}

// Generate metadata dynamically based on the research category
export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const research = researchData as Research[]
  const categories = Array.from(new Set(research.map(item => item.category))).sort()
  
  // Decode the URL-encoded category parameter and convert from slug to regular category
  const categorySlug = params.category.toLowerCase()
  const matchedCategory = categories.find(category => 
    category.toLowerCase().replace(/\s+/g, "-") === categorySlug
  )

  if (!matchedCategory && params.category !== 'all') {
    return {
      title: "Research | Not Found",
      description: "The requested research category could not be found."
    }
  }

  // Get a representative research with an image for this category (if available)
  const researchOfCategory = matchedCategory 
    ? research.filter(item => item.category === matchedCategory) 
    : research;
  
  // Find a research with an image to use as the featured image
  const featuredResearch = researchOfCategory.find(item => item.img && item.img.length > 0);
  
  const title = matchedCategory ? `${matchedCategory} | Research | Kris Yotam` : "Research | Kris Yotam";
  const description = matchedCategory 
    ? `A collection of research papers on ${matchedCategory.toLowerCase()}.`
    : "A collection of academic papers, publications, and ongoing research projects.";
  
  return {
    title,
    description,
    openGraph: {
      title: matchedCategory ? `${matchedCategory} Research | Kris Yotam` : "Research Collection | Kris Yotam",
      description,
      type: "website",
      images: [
        {
          url: "https://i.postimg.cc/jSDMT1Sn/research.png",
          alt: `${matchedCategory || 'Research'} by Kris Yotam`,
          width: 1200,
          height: 630,
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: matchedCategory ? `${matchedCategory} Research | Kris Yotam` : "Research Collection | Kris Yotam",
      description,
      images: ["https://i.postimg.cc/jSDMT1Sn/research.png"],
    },
  }
}

export default function CategoryResearchPage({ params }: { params: { category: string } }) {
  const research = researchData as Research[]
  const categories = Array.from(new Set(research.map(item => item.category))).sort()
  
  // Verify that the requested category exists
  const categorySlug = params.category.toLowerCase()
  const matchedCategory = categories.find(category => 
    category.toLowerCase().replace(/\s+/g, "-") === categorySlug
  )

  // Special case for 'all' to show all research
  if (params.category !== 'all' && !matchedCategory) {
    notFound()
  }

  return <ResearchClient initialCategory={matchedCategory || 'All'} />
} 
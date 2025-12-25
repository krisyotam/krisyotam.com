import type { Metadata } from "next"
import { ResearchClient } from "../research-client"
import researchDataRaw from "@/data/research/research.json"
import type { Research } from '@/types/research'
import { notFound } from "next/navigation"

// Generate metadata dynamically based on the research category
export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const research = (researchDataRaw as any).research as Research[]
  // derive categories from status field
  const categories = Array.from(new Set(research.map(item => item.status))).sort()
  
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

  // Get a representative research for this status (used as category)
  const researchOfCategory = matchedCategory 
    ? research.filter(item => item.status === matchedCategory) 
    : research;
  
  // Find a research with an image to use as the featured image
  const featuredResearch = researchOfCategory.find(item => item.imgs && item.imgs.length > 0);
  
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
  const research = (researchDataRaw as any).research as Research[]
  const categories = Array.from(new Set(research.map(item => item.status))).sort()
  
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
import type { Metadata } from "next"
import { ResearchClient } from "./research-client"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Research | Kris Yotam",
  description: "A collection of academic papers, publications, and ongoing research projects.",
  openGraph: {
    title: "Research Collection | Kris Yotam",
    description: "Explore a diverse collection of academic papers, publications, and ongoing research projects by Kris Yotam.",
    type: "website",
    images: [
      {
        url: "https://i.postimg.cc/jSDMT1Sn/research.png", 
        alt: "Kris Yotam's Research Collection",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Research Collection | Kris Yotam",
    description: "Explore a diverse collection of academic papers, publications, and ongoing research projects by Kris Yotam.",
    images: ["https://i.postimg.cc/jSDMT1Sn/research.png"],
  },
}

export default function ResearchPage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  // Handle redirect from old ?category=X format to new /research/X format
  if (searchParams && searchParams.category) {
    const categoryParam = typeof searchParams.category === 'string' ? searchParams.category : searchParams.category[0]
    if (categoryParam && categoryParam.toLowerCase() !== 'all') {
      redirect(`/research/${categoryParam.toLowerCase().replace(/\s+/g, '-')}`)
    }
  }
  
  // If no category filter or "All" is selected, show all research
  return <ResearchClient initialCategory="All" />
}


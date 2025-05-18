import type { Metadata } from "next"
import { EssaysClient } from "./essays-client"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Essays | Kris Yotam",
  description: "A collection of formal writings on diverse topics.",
  openGraph: {
    title: "Essays Collection | Kris Yotam",
    description: "Explore a diverse collection of formal writings on various topics by Kris Yotam.",
    type: "website",
    images: [
      {
        url: "https://i.postimg.cc/jSDMT1Sn/research.png", 
        alt: "Kris Yotam's Essays Collection",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Essays Collection | Kris Yotam",
    description: "Explore a diverse collection of formal writings on various topics by Kris Yotam.",
    images: ["https://i.postimg.cc/jSDMT1Sn/research.png"],
  },
}

export default function EssaysPage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  // Handle redirect from old ?category=X format to new /essays/X format
  if (searchParams && searchParams.category) {
    const categoryParam = typeof searchParams.category === 'string' ? searchParams.category : searchParams.category[0]
    if (categoryParam && categoryParam.toLowerCase() !== 'all') {
      redirect(`/essays/${categoryParam.toLowerCase().replace(/\s+/g, '-')}`)
    }
  }
  
  // If no category filter or "All" is selected, show all essays
  return <EssaysClient initialCategory="All" />
} 
import type { Metadata } from "next"
import { DocsClient } from "./docs-client"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Docs | Kris Yotam",
  description: "archived collection of my deep research docs from various models",
  openGraph: {
    title: "Docs | Kris Yotam",
    description: "archived collection of my deep research docs from various models",
    type: "website",
    images: [
      {
        url: "https://i.postimg.cc/yYQLwKsz/docs.png",
        alt: "AI Documents Collection",
        width: 1200,
        height: 630
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Docs | Kris Yotam",
    description: "archived collection of my deep research docs from various models",
    images: ["https://i.postimg.cc/yYQLwKsz/docs.png"],
  },
}

export default function DocsPage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  // Handle redirect from old ?category=X format to new /docs/X format
  if (searchParams && searchParams.category) {
    const categoryParam = typeof searchParams.category === 'string' ? searchParams.category : searchParams.category[0]
    if (categoryParam && categoryParam.toLowerCase() !== 'all') {
      redirect(`/docs/${categoryParam.toLowerCase().replace(/\s+/g, '-')}`)
    }
  }
  
  // If no category filter or "All" is selected, show all docs
  return <DocsClient initialCategory="All" />
} 
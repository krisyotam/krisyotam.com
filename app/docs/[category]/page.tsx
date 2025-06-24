import type { Metadata } from "next"
import docsData from "@/data/docs.json"
import { DocsClient } from "../docs-client"
import { notFound } from "next/navigation"

interface DocItem {
  id: string
  title: string
  slug: string
  description: string
  category: string
  tags: string[]
  date: string
  pdfUrl: string
  sourceUrl: string
  aiModel: string
  version: string
}

export async function generateStaticParams() {
  const categories = Array.from(new Set((docsData as DocItem[]).map(item => 
    item.category.toLowerCase().replace(/\s+/g, "-")
  )))
  
  return categories.map(category => ({
    category,
  }))
}

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  // Find the original category name for display purposes (preserving case)
  const originalCategoryName = (docsData as DocItem[]).find(
    item => item.category.toLowerCase().replace(/\s+/g, "-") === params.category
  )?.category
  
  if (!originalCategoryName) {
    return {
      title: "Category Not Found | AI Documents",
    }
  }
  
  return {
    title: `${originalCategoryName} | AI Documents | Kris Yotam`,
    description: `AI-generated technical documents in the ${originalCategoryName} category.`,
    openGraph: {
      title: `${originalCategoryName} Documents | Kris Yotam`,
      description: `Explore AI-generated technical documents in the ${originalCategoryName} category.`,
      type: "website",
      images: [
        {
          url: "https://i.postimg.cc/yYQLwKsz/docs.png",
          alt: `${originalCategoryName} Category | AI Documents`,
          width: 1200,
          height: 630
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${originalCategoryName} Documents | Kris Yotam`,
      description: `Explore AI-generated technical documents in the ${originalCategoryName} category.`,
      images: ["https://i.postimg.cc/yYQLwKsz/docs.png"],
    },
  }
}

export default function DocsCategoryPage({ params }: { params: { category: string } }) {
  // Find docs that match this category
  const matchingDocs = (docsData as DocItem[]).filter(
    item => item.category.toLowerCase().replace(/\s+/g, "-") === params.category
  )
  
  // Find the original category name (preserving case)
  const originalCategoryName = matchingDocs[0]?.category

  if (matchingDocs.length === 0 || !originalCategoryName) {
    notFound()
  }
  
  return <DocsClient initialCategory={originalCategoryName} />
} 
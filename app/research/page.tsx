import type { Metadata } from "next"
import { ResearchClient } from "./research-client"
import { redirect } from "next/navigation"
import { staticMetadata } from "@/lib/staticMetadata"

export const metadata: Metadata = staticMetadata.research

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


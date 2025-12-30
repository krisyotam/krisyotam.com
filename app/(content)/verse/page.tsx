// app/verse/page.tsx
import type { Metadata } from "next"
import { VerseClient } from "./verse-client"
import { redirect } from "next/navigation"
import categoriesData from "@/data/verse/categories.json"
import { staticMetadata } from "@/lib/staticMetadata"

export const metadata: Metadata = staticMetadata.verse

export default function VersePage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  // Handle redirect from old ?type=X format to new /verse/X format
  if (searchParams && searchParams.type) {
    const typeParam = typeof searchParams.type === 'string' ? searchParams.type : searchParams.type[0]
    if (typeParam && typeParam.toLowerCase() !== 'all') {
      redirect(`/verse/${typeParam.toLowerCase().replace(/\s+/g, '-')}`)
    }
  }
  
  // If no type filter or "All" is selected, show all poems
  return <VerseClient initialType="All" />
}

// app/verse/page.tsx
import type { Metadata } from "next"
import { VerseClient } from "./verse-client"
import { redirect } from "next/navigation"
import categoriesData from "@/data/verse/categories.json"
import { staticMetadata } from "@/lib/staticMetadata"

export const metadata: Metadata = staticMetadata.verse
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Poetry Collection | Kris Yotam",
    description: "Explore a diverse collection of original poems, haikus, and other verse forms by Kris Yotam.",
    images: ["https://i.postimg.cc/6p4X2MNX/shall-i-compare-thee-to-a-winters-night.png"],
  },
}

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

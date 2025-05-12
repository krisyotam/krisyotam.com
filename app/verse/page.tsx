// app/verse/page.tsx
import type { Metadata } from "next"
import { VerseClient } from "./verse-client"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Verse | Kris Yotam",
  description: "A collection of poems, haikus, and other verse forms.",
  openGraph: {
    title: "Poetry Collection | Kris Yotam",
    description: "Explore a diverse collection of original poems, haikus, and other verse forms by Kris Yotam.",
    type: "website",
    images: [
      {
        url: "https://i.postimg.cc/6p4X2MNX/shall-i-compare-thee-to-a-winters-night.png", // Using one of your poem images as a default
        alt: "Kris Yotam's Poetry Collection",
        width: 1200,
        height: 630,
      },
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

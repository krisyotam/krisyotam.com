// app/verse/[type]/page.tsx
import type { Metadata } from "next"
import { VerseClient } from "../verse-client"
import poemsData from "@/data/poems.json"
import type { Poem } from "@/utils/poems"
import { notFound } from "next/navigation"

// Generate metadata dynamically based on the verse type
export async function generateMetadata({ params }: { params: { type: string } }): Promise<Metadata> {
  const poems = poemsData as Poem[]
  const poemTypes = Array.from(new Set(poems.map(poem => poem.type))).sort()
  
  // Decode the URL-encoded type parameter and convert from slug to regular type
  const typeSlug = params.type.toLowerCase()
  const matchedType = poemTypes.find(type => 
    type.toLowerCase().replace(/\s+/g, "-") === typeSlug
  )

  if (!matchedType && params.type !== 'all') {
    return {
      title: "Verse | Not Found",
      description: "The requested verse type could not be found."
    }
  }

  return {
    title: matchedType ? `${matchedType} | Verse | Kris Yotam` : "Verse | Kris Yotam",
    description: matchedType 
      ? `A collection of ${matchedType.toLowerCase()} poems and verses.`
      : "A collection of poems, haikus, and other verse forms."
  }
}

export default function TypedVersePage({ params }: { params: { type: string } }) {
  const poems = poemsData as Poem[]
  const poemTypes = Array.from(new Set(poems.map(poem => poem.type))).sort()
  
  // Verify that the requested type exists
  const typeSlug = params.type.toLowerCase()
  const matchedType = poemTypes.find(type => 
    type.toLowerCase().replace(/\s+/g, "-") === typeSlug
  )

  // Special case for 'all' to show all verses
  if (params.type !== 'all' && !matchedType) {
    notFound()
  }

  return <VerseClient initialType={matchedType || 'All'} />
}
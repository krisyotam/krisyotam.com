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

  // Get a representative poem with an image for this type (if available)
  const poemsOfType = matchedType 
    ? poems.filter(poem => poem.type === matchedType) 
    : poems;
  
  // Find a poem with an image to use as the featured image
  const featuredPoem = poemsOfType.find(poem => poem.image && poem.image.length > 0);
  
  const title = matchedType ? `${matchedType} | Verse | Kris Yotam` : "Verse | Kris Yotam";
  const description = matchedType 
    ? `A collection of ${matchedType.toLowerCase()} poems and verses.`
    : "A collection of poems, haikus, and other verse forms.";
  
  return {
    title,
    description,
    openGraph: {
      title: matchedType ? `${matchedType} Collection | Kris Yotam` : "Poetry Collection | Kris Yotam",
      description,
      type: "website",
      images: featuredPoem?.image 
        ? [
            {
              url: featuredPoem.image,
              alt: `${matchedType || 'Poetry'} Collection by Kris Yotam`,
              width: 1200,
              height: 630,
            },
          ]
        : [
            {
              url: "https://i.postimg.cc/6p4X2MNX/shall-i-compare-thee-to-a-winters-night.png",
              alt: `${matchedType || 'Poetry'} Collection by Kris Yotam`,
              width: 1200,
              height: 630,
            }
          ],
    },
    twitter: {
      card: "summary_large_image",
      title: matchedType ? `${matchedType} Collection | Kris Yotam` : "Poetry Collection | Kris Yotam",
      description,
      images: featuredPoem?.image ? [featuredPoem.image] : ["https://i.postimg.cc/6p4X2MNX/shall-i-compare-thee-to-a-winters-night.png"],
    },
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
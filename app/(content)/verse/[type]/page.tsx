// app/verse/[type]/page.tsx
export const dynamic = 'force-static';
export const revalidate = false;
import type { Metadata } from "next"
import { VerseClient } from "../verse-client"
import poemsData from "@/data/verse/verse.json"
import categoriesData from "@/data/verse/categories.json"
import type { Poem } from "@/types/content"
import { notFound } from "next/navigation"

function slugifyType(type: string) {
  return type.toLowerCase().replace(/\s+/g, "-");
}

// Generate metadata dynamically based on the verse type
export async function generateMetadata({ params }: { params: { type: string } }): Promise<Metadata> {
  // Get category data from categories.json
  const categorySlug = params.type.toLowerCase()
  const matchedCategory = categoriesData.types.find(type => 
    type.slug === categorySlug
  )

  if (!matchedCategory && params.type !== 'all') {
    return {
      title: "Verse | Not Found",
      description: "The requested verse type could not be found."
    }
  }

  // Use category title for display and metadata
  const categoryTitle = matchedCategory?.title

  // Get a representative poem with an image for this type (if available)
  const poemsOfType = categoryTitle
    ? poemsData.filter(poem => slugifyType(poem.type) === categorySlug)
    : poemsData;
  
  // Find a poem with an image to use as the featured image
  const featuredPoem = poemsOfType.find(poem => poem.image && poem.image.length > 0);
  const title = categoryTitle ? `${categoryTitle} | Verse | Kris Yotam` : "Verse | Kris Yotam";
  const description = matchedCategory 
    ? matchedCategory.preview
    : "A collection of poems, haikus, and other verse forms.";
  
  return {
    title,
    description,
    openGraph: {
      title: categoryTitle ? `${categoryTitle} Collection | Kris Yotam` : "Poetry Collection | Kris Yotam",
      description: matchedCategory?.preview || description,
      type: "website",
      images: featuredPoem?.image 
        ? [
            {
              url: featuredPoem.image,
              alt: `${categoryTitle || 'Poetry'} Collection by Kris Yotam`,
              width: 1200,
              height: 630,
            },
          ]
        : [
            {
              url: "https://i.postimg.cc/6p4X2MNX/shall-i-compare-thee-to-a-winters-night.png",
              alt: `${categoryTitle || 'Poetry'} Collection by Kris Yotam`,
              width: 1200,
              height: 630,
            }
          ],
    },
    twitter: {
      card: "summary_large_image",
      title: categoryTitle ? `${categoryTitle} Collection | Kris Yotam` : "Poetry Collection | Kris Yotam",
      description,
      images: featuredPoem?.image ? [featuredPoem.image] : ["https://i.postimg.cc/6p4X2MNX/shall-i-compare-thee-to-a-winters-night.png"],
    },
  }
}

export default function TypedVersePage({ params }: { params: { type: string } }) {
  // Get category data
  const typeSlug = params.type.toLowerCase()
  const matchedCategory = categoriesData.types.find(type => 
    type.slug === typeSlug
  )

  // Special case for 'all' to show all verses
  if (params.type !== 'all' && !matchedCategory) {
    notFound()
  }

  return <VerseClient initialType={matchedCategory?.title || 'All'} />
}
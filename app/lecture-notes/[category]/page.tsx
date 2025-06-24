import { LectureNotesClient } from "../lecture-notes-client"
import lectureNotesData from "@/data/lecture-notes.json"
import type { Metadata } from "next"
import type { LectureNote } from "@/types/lecture-note"

function slugifyCategory(category: string) {
  return category.toLowerCase().replace(/\s+/g, "-")
}

// Generate static paths for all categories
export function generateStaticParams() {
  const notes = lectureNotesData as LectureNote[]
  const categories = Array.from(new Set(notes.map(note => note.category)))
  
  return categories.map(category => ({
    category: slugifyCategory(category)
  }))
}

export async function generateMetadata({ params }: { params: { category: string }}): Promise<Metadata> {
  // De-slugify the category name for display
  const deSlugifiedCategory = params.category.replace(/-/g, ' ')
  const displayCategory = deSlugifiedCategory
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
  
  return {
    title: `${displayCategory} Lecture Notes | Kris Yotam`,
    description: `Academic lecture notes on ${displayCategory.toLowerCase()} topics and courses.`,
    openGraph: {
      title: `${displayCategory} Lecture Notes | Kris Yotam`,
      description: `Explore academic lecture notes on ${displayCategory.toLowerCase()} topics and courses.`,
    },
  }
}

export default function LectureNotesCategoryPage({ params }: { params: { category: string }}) {
  // De-slugify the category name for filtering
  const deSlugifiedCategory = params.category.replace(/-/g, ' ')
  const displayCategory = deSlugifiedCategory
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
  
  return <LectureNotesClient initialCategory={displayCategory} />
} 
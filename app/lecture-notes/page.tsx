import type { Metadata } from "next"
import { LectureNotesClient } from "./lecture-notes-client"
import { redirect } from "next/navigation"
import { staticMetadata } from "@/lib/staticMetadata"

export const metadata: Metadata = staticMetadata.lectureNotes

export default function LectureNotesPage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  // Handle redirect from old ?category=X format to new /lecture-notes/X format
  if (searchParams && searchParams.category) {
    const categoryParam = typeof searchParams.category === 'string' ? searchParams.category : searchParams.category[0]
    if (categoryParam && categoryParam.toLowerCase() !== 'all') {
      redirect(`/lecture-notes/${categoryParam.toLowerCase().replace(/\s+/g, '-')}`)
    }
  }
    // If no category filter or "All" is selected, show all lecture notes
  return (
    <div className="lecture-notes-container">
      <LectureNotesClient initialCategory="All" />
    </div>
  )
} 
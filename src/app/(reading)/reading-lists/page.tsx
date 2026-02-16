import { ReadingPageContent } from "@/components/media/reading/reading"
import { PageHeader, PageDescription } from "@/components/core"
import type { Metadata } from "next"

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Reading Lists",
  description: "Curated reading lists and book collections.",
  keywords: "reading lists, book lists, curated books, collections",
  openGraph: {
    title: "Reading Lists",
    description: "Curated reading lists and collections",
    type: "website",
  },
}

export default function ReadingListsPage() {
  return (
    <main className="max-w-[650px] mx-auto px-4 py-12">
      <PageHeader
        title="Reading Lists"
        subtitle=""
        start_date={new Date().toISOString()}
        end_date=""
        preview="Curated reading lists and book collections"
        status="In Progress"
        confidence="certain"
        importance={5}
      />
      <ReadingPageContent page="reading-lists" />
      <PageDescription
        title="About Reading Lists"
        description="Themed collections and curated lists of books organized by topic, genre, or purpose. These lists help organize my reading goals and recommendations."
      />
    </main>
  )
}

import { ReadingListsClientPage } from "./reading-lists-client-page"
import { PageHeader } from "@/components/page-header"
import { PageDescription } from "@/components/posts/typography/page-description"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reading Lists | Kris Yotam",
  description: "Curated reading lists and book collections.",
  keywords: "reading lists, book lists, curated books, collections",
  openGraph: {
    title: "Reading Lists | Kris Yotam",
    description: "Curated reading lists and collections",
    type: "website",
  },
}

export default function ReadingListsPage() {
  const readingListsPageData = {
    title: "Reading Lists",
    subtitle: "",
    date: new Date().toISOString(),
    preview: "Curated reading lists and book collections",
    status: "In Progress" as const,
    confidence: "certain" as const,
    importance: 5,
  }

  return (
    <main className="max-w-[650px] mx-auto px-4 py-12">
      <PageHeader
        title={readingListsPageData.title}
        subtitle={readingListsPageData.subtitle}
        date={readingListsPageData.date}
        preview={readingListsPageData.preview}
        status={readingListsPageData.status}
        confidence={readingListsPageData.confidence}
        importance={readingListsPageData.importance}
      />

      <ReadingListsClientPage />
      
      <PageDescription
        title="About Reading Lists"
        description="Themed collections and curated lists of books organized by topic, genre, or purpose. These lists help organize my reading goals and recommendations."
      />
    </main>
  )
}

import { ReadingPageContent } from "@/components/media/reading"
import { PageHeader, PageDescription } from "@/components/core"
import type { Metadata } from "next"

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Read | Kris Yotam",
  description: "books, blog posts, short stories, papers, essays, and verse completed since 2024",
  keywords: "reading log, books read, blog posts, short stories, verse, ratings, reviews",
  openGraph: {
    title: "Read | Kris Yotam",
    description: "books, blog posts, short stories, papers, essays, and verse completed since 2024",
    type: "website",
  },
}

export default function ReadPage() {
  return (
    <main className="max-w-[650px] mx-auto px-4 py-12">
      <PageHeader
        title="Read"
        start_date="2025-01-01"
        end_date={new Date().toISOString()}
        preview="a compilation of books, blog posts, short stories, papers, essays, and verse completed since 2024"
        status="In Progress"
        confidence="certain"
        importance={7}
      />
      <ReadingPageContent page="read" />
      <PageDescription
        title="About the Read Page"
        description="This page shows all the content I've finished reading across different formats - books, blog posts, short stories, and verse. Each entry includes my rating and often links to my notes or commentary."
      />
    </main>
  )
}

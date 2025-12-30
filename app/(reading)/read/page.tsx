import { ReadClientPage } from "./read-client-page"
import { PageHeader } from "@/components/core"
import { PageDescription } from "@/components/core"
import { staticMetadata } from "@/lib/staticMetadata"
import type { Metadata } from "next"

// Force dynamic rendering to prevent Apollo Client issues during static export
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
  const readPageData = {
    title: "Read",
    start_date: "2025-01-01",
    end_date: new Date().toISOString(),
    preview: "a compilation of books, blog posts, short stories, papers, essays, and verse completed since 2024",
    status: "In Progress" as const,
    confidence: "certain" as const,
    importance: 7,
  }

  return (
    <main className="max-w-[650px] mx-auto px-4 py-12">
      <PageHeader
        title={readPageData.title}
        start_date={readPageData.start_date}
        end_date={readPageData.end_date}
        preview={readPageData.preview}
        status={readPageData.status}
        confidence={readPageData.confidence}
        importance={readPageData.importance}
      />

      <ReadClientPage />
      
      <PageDescription
        title="About the Read Page"
        description="This page shows all the content I've finished reading across different formats - books, blog posts, short stories, and verse. Each entry includes my rating and often links to my notes or commentary."
      />
    </main>
  )
}

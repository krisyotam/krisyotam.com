import WantToReadClientPage from "./want-to-read-client-page"
import { PageHeader } from "@/components/page-header"
import { PageDescription } from "@/components/posts/typography/page-description"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Want to Read | Kris Yotam",
  description: "A compilation of books I wish to read",
  keywords: ["want to read", "tbr", "to be read", "reading list", "books"],
  openGraph: {
    title: "Want to Read | Kris Yotam",
    description: "A compilation of books I wish to read",
    type: "website",
  },
}

export default function WantToReadPage() {
  const pageData = {
    title: "Want to Read",
    subtitle: "",
    start_date: new Date().toISOString(),
    end_date: "",
    preview: "A compilation of books I wish to read",
    status: "In Progress" as const,
    confidence: "certain" as const,
    importance: 7,
  }
  return (
    <main className="max-w-[650px] mx-auto px-4 py-12">
      <PageHeader
        title={pageData.title}
        subtitle={pageData.subtitle}
        start_date={pageData.start_date}
        end_date={pageData.end_date}
        preview={pageData.preview}
        status={pageData.status}
        confidence={pageData.confidence}
        importance={pageData.importance}
      />
      <WantToReadClientPage />
      <PageDescription
        title="About the Want to Read Page"
        description="This is my to-read list - books and content I'm planning to read in the future. Items are tracked through StoryGraph and other reading platforms."
      />
    </main>
  )
}
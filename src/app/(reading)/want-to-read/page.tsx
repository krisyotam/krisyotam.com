import { ReadingPageContent } from "@/components/media/reading/reading"
import { PageHeader, PageDescription } from "@/components/core"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Want to Read",
  description: "A compilation of books I wish to read",
  keywords: ["want to read", "tbr", "to be read", "reading list", "books"],
  openGraph: {
    title: "Want to Read",
    description: "A compilation of books I wish to read",
    type: "website",
  },
}

export default function WantToReadPage() {
  return (
    <main className="max-w-[650px] mx-auto px-4 py-12">
      <PageHeader
        title="Want to Read"
        subtitle=""
        start_date={new Date().toISOString()}
        end_date=""
        preview="A compilation of books I wish to read"
        status="In Progress"
        confidence="certain"
        importance={7}
      />
      <ReadingPageContent page="want-to-read" />
      <PageDescription
        title="About the Want to Read Page"
        description="This is my to-read list - books and content I'm planning to read in the future. Items are tracked through StoryGraph and other reading platforms."
      />
    </main>
  )
}

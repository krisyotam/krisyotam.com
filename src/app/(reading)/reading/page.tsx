import { ReadingPageContent } from "@/components/media/reading"
import { PageHeader, PageDescription } from "@/components/core"
import { staticMetadata } from "@/lib/staticMetadata"
import type { Metadata } from "next"

export const metadata: Metadata = staticMetadata.reading

export default function ReadingPage() {
  return (
    <main className="max-w-[650px] mx-auto px-4 py-12">
      <PageHeader
        title="Reading"
        subtitle=""
        start_date={new Date().toISOString()}
        end_date=""
        preview="Books I'm currently reading"
        status="In Progress"
        confidence="certain"
        importance={7}
      />
      <ReadingPageContent page="reading" />
      <PageDescription
        title="About the Reading Page"
        description="This page shows books I'm currently reading. My complete reading journey, including finished books, want-to-read list, and reading lists, can be found through the navigation tabs."
      />
    </main>
  )
}

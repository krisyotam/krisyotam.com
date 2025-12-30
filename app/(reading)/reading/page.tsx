import { ReadingClientPage } from "./reading-client-page"
import { PageHeader } from "@/components/core"
import { PageDescription } from "@/components/core"
import { staticMetadata } from "@/lib/staticMetadata"
import type { Metadata } from "next"

export const metadata: Metadata = staticMetadata.reading

export default function ReadingPage() {
  // Reading page metadata - currently reading
  const readingPageData = {
    title: "Reading",
    subtitle: "",
    start_date: new Date().toISOString(),
    end_date: "",
    preview: "Books I'm currently reading",
    status: "In Progress" as const,
    confidence: "certain" as const,
    importance: 7,
  }
  return (
    <main className="max-w-[650px] mx-auto px-4 py-12">
      {/* Add the PageHeader component */}
      <PageHeader
        title={readingPageData.title}
        subtitle={readingPageData.subtitle}
        start_date={readingPageData.start_date}
        end_date={readingPageData.end_date}
        preview={readingPageData.preview}
        status={readingPageData.status}
        confidence={readingPageData.confidence}
        importance={readingPageData.importance}
      />

      <ReadingClientPage />
      
      <PageDescription
        title="About the Reading Page"
        description="This page shows books I'm currently reading. My complete reading journey, including finished books, want-to-read list, and reading lists, can be found through the navigation tabs."
      />
    </main>
  )
}

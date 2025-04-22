import { ReadingClientPage } from "./reading-client-page"
import { PageHeader } from "@/components/page-header"

export const metadata = {
  title: "Reading List | Kris Yotam",
  description: "Books I'm currently reading, have read, and want to read.",
}

export default function ReadingPage() {
  // Reading page metadata
  const readingPageData = {
    title: "Reading",
    subtitle: "",
    date: new Date().toISOString(),
    preview: "my currently reading, read, and tbr tracked with literal.club",
    status: "In Progress" as const,
    confidence: "certain" as const,
    importance: 7,
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      {/* Add the PageHeader component */}
      <PageHeader
        title={readingPageData.title}
        subtitle={readingPageData.subtitle}
        date={readingPageData.date}
        preview={readingPageData.preview}
        status={readingPageData.status}
        confidence={readingPageData.confidence}
        importance={readingPageData.importance}
      />

      <ReadingClientPage />
    </main>
  )
}


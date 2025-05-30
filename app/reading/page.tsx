import { ReadingClientPage } from "./reading-client-page"
import { PageHeader } from "@/components/page-header"
import { PageDescription } from "@/components/posts/typography/page-description"

export const metadata = {
  title: "Reading | Kris Yotam",
  description: "books I am currently reading, have read, and want to read",
}

export default function ReadingPage() {
  // Reading page metadata
  const readingPageData = {
    title: "Reading",
    subtitle: "",
    date: new Date().toISOString(),
    preview: "my currently reading, read, and tbr tracked at storygraph.com/krisyotam",
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
        date={readingPageData.date}
        preview={readingPageData.preview}
        status={readingPageData.status}
        confidence={readingPageData.confidence}
        importance={readingPageData.importance}
      />

      <ReadingClientPage />
      
      <PageDescription
        title="About the Reading Page"
        description="This page tracks my current reading progress, books I've completed, and my to-read list. All reading data is synced from StoryGraph where I maintain my complete reading journey, including ratings, reviews, and reading statistics."
      />
    </main>
  )
}


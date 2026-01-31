import { ReadingPageContent } from "@/components/reading"
import { PageHeader, PageDescription } from "@/components/core"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reading Log | Kris Yotam",
  description: "Time-tracked reading sessions and activity log",
  keywords: "reading log, time tracking, reading sessions",
  openGraph: {
    title: "Reading Log | Kris Yotam",
    description: "Time-tracked reading sessions and activity log",
    type: "website",
  },
}

export default function ReadingLogPage() {
  return (
    <main className="max-w-[650px] mx-auto px-4 py-12">
      <PageHeader
        title="Reading Log"
        start_date={new Date().toISOString()}
        preview="Time-tracked reading sessions"
        status="In Progress"
        confidence="certain"
        importance={5}
      />
      <ReadingPageContent page="reading-log" />
      <PageDescription
        title="About the Reading Log"
        description="A detailed log of reading sessions including time spent, titles, and authors. Helps track reading habits and progress over time."
      />
    </main>
  )
}

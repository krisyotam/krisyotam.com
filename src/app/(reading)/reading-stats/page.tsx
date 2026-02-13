import { ReadingPageContent } from "@/components/media/reading"
import { PageHeader, PageDescription } from "@/components/core"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reading Stats | Kris Yotam",
  description: "Reading statistics and analytics",
  keywords: "reading stats, analytics, reading data",
  openGraph: {
    title: "Reading Stats | Kris Yotam",
    description: "Reading statistics and analytics",
    type: "website",
  },
}

export default function ReadingStatsPage() {
  return (
    <main className="max-w-[650px] mx-auto px-4 py-12">
      <PageHeader
        title="Reading Stats"
        start_date={new Date().toISOString()}
        preview="Reading statistics and analytics"
        status="In Progress"
        confidence="certain"
        importance={5}
      />
      <ReadingPageContent page="reading-stats" />
      <PageDescription
        title="About Reading Stats"
        description="Visual analytics of reading activity including daily trends, type breakdowns, and author statistics."
      />
    </main>
  )
}

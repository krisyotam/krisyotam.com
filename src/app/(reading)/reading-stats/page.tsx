import { ReadingNavigation } from "@/components/reading-navigation"
import { PostHeader } from "@/components/core"
import { ReadingStatsClient } from "./reading-stats-client-page"

export default function ReadingStatsPage() {
  return (
    <main className="max-w-[650px] mx-auto px-4 py-12">
      <PostHeader title="Reading Stats" start_date={new Date().toISOString().split('T')[0]} />
      <ReadingNavigation />
      <ReadingStatsClient />
    </main>
  )
}

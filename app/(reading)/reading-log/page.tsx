import { ReadingNavigation } from "@/components/reading-navigation"
import { PostHeader } from "@/components/post-header"
import { ReadingLogClient } from "./reading-log-client-page"

export default function ReadingLogPage() {
  return (
    <main className="max-w-[650px] mx-auto px-4 py-12">
      <PostHeader title="Reading Log" start_date={new Date().toISOString().split('T')[0]} />
      <ReadingNavigation />
      <ReadingLogClient />
    </main>
  )
}

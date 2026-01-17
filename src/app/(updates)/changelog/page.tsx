import { PageHeader } from "@/components/core"
import ChangelogClient from "./ui"

export default function ChangelogPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="container max-w-[672px] mx-auto px-4">
        <div className="mb-6 -mt-2 md:-mt-4">
          <PageHeader
            title="Changelog"
            subtitle="Site Updates & Changes"
            start_date="2025-01-01"
            end_date={new Date().toISOString().split("T")[0]}
            preview="Monthly chronological list of recent major writings/changes/additions to krisyotam.com (see also the monthly newsletter)"
            status="Finished"
            confidence="certain"
            importance={7}
            backText="Home"
            backHref="/"
            className="mb-2"
          />
        </div>

        <main>
          <ChangelogClient initialFeed="content" />
        </main>
      </div>
    </div>
  )
}

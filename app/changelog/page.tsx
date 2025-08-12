import { getMarkdownContent } from "@/utils/markdown"
import type { Metadata } from "next"
import { ChangelogContent } from "./changelog-content"
import { PageHeader } from "@/components/page-header"
import { staticMetadata } from "@/lib/staticMetadata"
import "./changelog.css"

export const metadata: Metadata = staticMetadata.changelog

export default async function ChangelogPage() {
  // Read the changelog content from the Markdown file
  const content = await getMarkdownContent("app/changelog/data/page.md")

  // Changelog metadata for the header
  const changelogData = {
    title: "Changelog",
    subtitle: "Site Updates & Changes",
    start_date: "2025-01-01",
    end_date: new Date().toISOString().split('T')[0],
    preview:
      "Monthly chronological list of recent major writings/changes/additions to krisyotam.com (see also the monthly newsletter)",
    status: "Finished" as const,
    confidence: "certain" as const,
    importance: 7,
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto mb-8">
        <PageHeader
          title={changelogData.title}
          subtitle={changelogData.subtitle}
          start_date={changelogData.start_date}
          end_date={changelogData.end_date}
          preview={changelogData.preview}
          status={changelogData.status}
          confidence={changelogData.confidence}
          importance={changelogData.importance}
        />
      </div>

      <div className="max-w-2xl mx-auto">
        <ChangelogContent content={content} />
      </div>
    </main>
  )
}


import { getMarkdownContent } from "@/utils/markdown"
import type { Metadata } from "next"
import { ChangelogContent } from "./changelog-content"
import { PageHeader } from "@/components/page-header"
import "./changelog.css"

export const metadata: Metadata = {
  title: "Changelog",
  description: "A record of all changes and updates to the site",
}

export default async function ChangelogPage() {
  // Read the changelog content from the Markdown file
  const content = await getMarkdownContent("app/changelog/data/page.md")

  // Changelog metadata for the header
  const changelogData = {
    title: "Changelog",
    subtitle: "Site Updates & Changes",
    date: new Date().toISOString(),
    preview:
      "A chronological record of all notable changes and updates to this website. The newest changes are at the top.",
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
          date={changelogData.date}
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


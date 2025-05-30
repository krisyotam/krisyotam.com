"use client"

import Link from "next/link"
import { getGitHubTilFeed } from "@/lib/githubTilFeed"
import { PageHeader } from "@/components/page-header"

export const dynamic = "force-static"

// TIL page metadata
const tilPageData = {
  title: "Today I Learned",
  subtitle: "Daily Learning Summaries",
  date: new Date().toISOString(),
  preview: "A collection of short notes from my cross-disciplinary studies, shared as I learn in public.",
  status: "In Progress" as const,
  confidence: "certain" as const,
  importance: 7,
}

export default async function TILPage() {
  try {
    const tilEntries = await getGitHubTilFeed()

    // Sort by date (assuming `date` is in a valid format for comparison, e.g., ISO string)
    const sortedEntries = tilEntries
      .slice() // Copy to avoid modifying the original array
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by date in descending order

    return (
      <div className="relative min-h-screen bg-background text-foreground">
        <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
          {/* Add the PageHeader component */}
          <PageHeader
            title={tilPageData.title}
            subtitle={tilPageData.subtitle}
            date={tilPageData.date}
            preview={tilPageData.preview}
            status={tilPageData.status}
            confidence={tilPageData.confidence}
            importance={tilPageData.importance}
          />

          <p className="text-muted-foreground mb-4">
            <strong>{tilEntries.length}</strong> TILs and counting... Feeling lucky?
          </p>
          <p className="text-muted-foreground mb-8">
            You can follow along by watching my{" "}
            <a
              href="https://github.com/krisyotam/til"
              className="text-foreground underline hover:text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub repository
            </a>
            .
          </p>

          <div className="space-y-0">
            {sortedEntries.map(({ date, title, path }) => (
              <div key={path} className="py-1 flex">
                <span className="text-muted-foreground w-24 flex-shrink-0">{date.substring(0, 10)}</span>
                <Link href={`/til/${path}`} className="text-foreground hover:text-primary hover:underline">
                  {title}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Failed to fetch TIL entries:", error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="max-w-md p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Error Loading TIL Entries</h2>
          <p className="text-muted-foreground mb-6">
            Failed to load TIL entries. The GitHub repository might be unavailable or there might be an issue with the
            connection.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }
}


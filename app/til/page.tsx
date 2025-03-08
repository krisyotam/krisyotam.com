import Link from "next/link"
import { getGitHubTilRepo } from "@/lib/githubTil"

export const dynamic = "force-static"

export default async function TILPage() {
  try {
    const tilEntries = await getGitHubTilRepo()
    const entriesCount = tilEntries.length

    return (
      <div className="relative min-h-screen bg-background text-foreground">
        <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
          <header className="mb-8">
            <h1 className="text-4xl font-semibold mb-3 text-foreground">Today I Learned</h1>
            <p className="text-muted-foreground mb-4">
              This is a collection of short notes that are a amalgamation of my daily<br /> learnings 
              summaries from cross disciplinary studies 
              . I share these notes<br /> 
              as I learn in public.
            </p>
            <p className="text-muted-foreground mb-4">
              <strong>{entriesCount}</strong> TILs and counting... Feeling lucky?
            </p>
            <p className="text-muted-foreground">
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
          </header>

          <div className="space-y-0">
            {tilEntries.map((entry) => (
              <div key={entry.path} className="py-1 flex">
                <span className="text-muted-foreground w-24 flex-shrink-0">{entry.date.substring(0, 10)}</span>
                <Link href={`/til/${entry.path}`} className="text-foreground hover:text-primary hover:underline">
                  {entry.title}
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


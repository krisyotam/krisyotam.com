import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { getGitHubTilRepo } from "@/lib/githubTil"
import { Button } from "@/components/ui/button"
import { notFound } from "next/navigation"
import { MarkdownContent } from "@/components/markdown-content"

export const dynamic = "force-static"

export async function generateStaticParams() {
  try {
    const tilEntries = await getGitHubTilRepo()
    return tilEntries.map((entry) => ({
      slug: entry.path.split("/"),
    }))
  } catch (error) {
    console.error("Error generating static params:", error)
    return []
  }
}

export default async function TILEntryPage({ params }: { params: { slug: string[] } }) {
  try {
    const tilEntries = await getGitHubTilRepo()
    const path = params.slug.join("/")
    const entry = tilEntries.find((e) => e.path === path)

    if (!entry) {
      notFound()
    }

    return (
      <div className="relative min-h-screen bg-background text-foreground">
        <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
          <div className="mb-8">
            <Button variant="outline" asChild>
              <Link href="/til">
                <ChevronLeft className="mr-2 h-4 w-4" /> Back to TIL
              </Link>
            </Button>
          </div>

          <article>
            <header className="mb-8">
              <h1 className="text-3xl font-semibold tracking-tight mb-2 text-foreground">{entry.title}</h1>
              <div className="text-sm text-muted-foreground">
                {new Date(entry.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </header>

            {entry.content ? (
              <MarkdownContent content={entry.content} />
            ) : (
              <div className="p-4 border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-md">
                <p className="text-red-800 dark:text-red-300">
                  Unable to load the content for this TIL entry. The content might not be available or there might be an
                  issue with the GitHub repository.
                </p>
              </div>
            )}
          </article>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Failed to fetch TIL entry:", error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="max-w-md p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Error Loading Content</h2>
          <p className="text-muted-foreground mb-6">
            Failed to load TIL entry. The content might not be available or there might be an issue with the GitHub
            repository.
          </p>
          <Button asChild>
            <Link href="/til">Return to TIL List</Link>
          </Button>
        </div>
      </div>
    )
  }
}


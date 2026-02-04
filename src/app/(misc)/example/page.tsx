import { PageHeader, PageDescription } from "@/components/core"
import { Box } from "@/components/posts/typography/box"
import Link from "next/link"

export default function ExampleTagsPage() {
  // Mock tags data for aesthetic testing
  const mockTags = [
    {
      name: "Asem 2023",
      posts: [
        "On the Occasion of Checking my Inbox, or, Why Phones Aren't Allowed at Work"
      ]
    },
    {
      name: "Books",
      posts: [
        "My Library",
        "Is Robert Eggers Woke Now?"
      ]
    },
    {
      name: "Capitalism",
      posts: [
        "Episode 2.2: Misery and Debt",
        "Episode 2.7: Sleep-Worker's Enquiry",
        "Episode 3.7: Spontaneity, Mediation, Rupture",
        "Episode 4.1: Editorial / State of the Pod",
        "BONUS EPISODE: Crisis and Immiseration: Critical Theory Today",
        "Episode 5.3: Error"
      ]
    },
    {
      name: "Collectives",
      posts: [
        "Episode 5.2: We Unhappy Few"
      ]
    },
    {
      name: "Conceptual",
      posts: [
        "Thinking Again and Supposing"
      ]
    },
    {
      name: "Contemporary",
      posts: [
        "Points of Light"
      ]
    },
    {
      name: "Mathematics",
      posts: [
        "On the Nature of Proof",
        "Category Theory for the Working Mathematician",
        "Why I Study Pure Mathematics"
      ]
    },
    {
      name: "Philosophy",
      posts: [
        "Reading Wittgenstein",
        "The Problem of Other Minds",
        "Notes on Heidegger's Being and Time"
      ]
    },
    {
      name: "Technology",
      posts: [
        "My Development Environment",
        "On Text Editors and the Unix Philosophy"
      ]
    },
    {
      name: "Writing",
      posts: [
        "Why I Write",
        "On Keeping a Digital Garden"
      ]
    }
  ]

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
        <PageHeader
          title="Tags"
          subtitle="Archive of posts sorted by tags"
          start_date="2025-01-01"
          end_date="2026-01-18"
          preview="Browse all posts organized by their tags."
          status="Finished"
          confidence="certain"
          importance={7}
        />

        <main className="mt-8">
          {/* Explanation box */}
          <Box className="mb-10">
            <p className="text-sm leading-relaxed">
              My approach to tagging is based on the principles outlined by{" "}
              <Link href="https://karl-voit.at/tags/" className="underline decoration-dotted underline-offset-2 hover:decoration-solid">
                Karl Voit
              </Link>
              . My system is quite rudimentary right now.
            </p>
          </Box>

          {/* Tags index */}
          <div className="space-y-6">
            {mockTags.map((tag) => (
              <div key={tag.name}>
                {/* Tag heading */}
                <h2 className="font-mono text-base underline underline-offset-4 decoration-1 mb-2">
                  <Link href="#" className="hover:no-underline">
                    {tag.name}
                  </Link>
                </h2>

                {/* Posts under this tag */}
                <ul className="space-y-1.5 ml-1">
                  {tag.posts.map((post, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-muted-foreground select-none">✱</span>
                      <Link
                        href="#"
                        className="text-sm underline decoration-dotted underline-offset-2 hover:decoration-solid"
                      >
                        {post}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </main>

        <PageDescription
          title="About This Page"
          description="This is an example page demonstrating the Gwern/UMT-style tag index layout where all tags and their posts are displayed inline on a single page."
        />
      </div>
    </div>
  )
}

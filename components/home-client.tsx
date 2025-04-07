"use client"

import { useState } from "react"
import { BlogPost } from "./blog-post"
import { LayoutGrid, Text } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import rehypeSanitize from "rehype-sanitize"

// Bio content in markdown format
const bioContent = `
This is the website of **Kris Yotam**. I am an autodidact, philomath, and polymath. I write about mathematics, philosophy, psychology, physics, and a 
multitude of other things you can view in my interests [here](/about).

**Navigation**: This site is fairly simple, in the bottom left there is a button which allows you toggle between home page & home feed. Home Feed lists direct access to the most recent posts
which can be found categorized [here](/categories). Home Page where you are currently located lists some basic information on this site. To the bottom right there is a home button,
this is the central navigation for the site. Through it you can access most pages, however some unlinked pages may be documented in my [wiki](/wiki).

Some other highly notable pages on this site are my [changelog](/changelog), [design page](/website), [research methods](/method), [meta-learning](/learn) strategies, and 
my [writing style](/write).
`

// Type definitions for props
interface Post {
  title: string
  subtitle?: string
  preview: string
  date: string
  tags: string[]
  category: string
  slug: string
  state: string
  status?: string
  confidence?: string
  importance?: number
}

interface HomeClientProps {
  posts: Post[]
  randomQuote: { text: string; author: string }
}

// Home page metadata for the grid view
const homePageData = {
  title: "Kris Yotam",
  subtitle: "Essays, Notes, and Explorations",
  date: new Date().toISOString(),
  preview: "A collection of writings on various topics including mathematics, philosophy, and technology.",
  status: "Finished" as const,
  confidence: "certain" as const,
  importance: 9,
}

function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="prose prose-sm max-w-none font-serif text-foreground post-content">
      <ReactMarkdown
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              data-no-preview="true"
              className="text-primary hover:underline"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export function HomeClient({ posts, randomQuote }: HomeClientProps) {
  const [viewMode, setViewMode] = useState("list") // "list" or "grid"

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // Client-side function to get year from date
  const getPostYear = (dateString: string): string => {
    return new Date(dateString).getFullYear().toString()
  }

  const formatQuoteWithLineBreaks = (text: string, maxCharsPerLine = 100): string => {
    const words = text.split(" ")
    const lines: string[] = []
    let currentLine = ""

    words.forEach((word) => {
      // If adding this word would exceed the max length, start a new line
      if (currentLine.length + word.length + 1 > maxCharsPerLine && currentLine.length > 0) {
        lines.push(currentLine)
        currentLine = word
      } else {
        // Add word to current line (with a space if not the first word on the line)
        currentLine = currentLine.length === 0 ? word : `${currentLine} ${word}`
      }
    })

    // Add the last line if it's not empty
    if (currentLine.length > 0) {
      lines.push(currentLine)
    }

    return lines.join("\n")
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {viewMode === "list" ? (
        // List view (unchanged)
        <div className="p-8 md:p-16 lg:p-24">
          <div className="max-w-4xl mx-auto">
            <header className="mb-16 pl-8">
              <h1 className="text-4xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Kris Yotam</h1>
              <p className="text-sm font-light italic text-gray-600 dark:text-gray-400 whitespace-pre-line">
                {formatQuoteWithLineBreaks(`"${randomQuote.text}" - ${randomQuote.author}`, 100)}
              </p>
            </header>
            <main>
              <div className="space-y-12">
                {posts.map((post) => {
                  if (!post.slug || !post.date || !post.preview) {
                    console.error("Missing post data:", post)
                    return null
                  }
                  const year = getPostYear(post.date)
                  const slugPath = `blog/${year}/${post.slug}`
                  // Assume all posts are tsx since we can't use isPostMDX
                  const postType = "tsx"
                  return (
                    <BlogPost
                      key={post.slug}
                      slug={slugPath}
                      type={postType}
                      title={post.title}
                      subtitle={post.subtitle}
                      date={formatDate(post.date)}
                      excerpt={post.preview}
                    />
                  )
                })}
              </div>
            </main>
          </div>
        </div>
      ) : (
        // Grid view without HomeBook component
        <div className="p-8 md:p-12 lg:p-16">
          <div className="max-w-2xl mx-auto">
            <PageHeader
              title={homePageData.title}
              subtitle={homePageData.subtitle}
              date={homePageData.date}
              preview={homePageData.preview}
              status={homePageData.status}
              confidence={homePageData.confidence}
              importance={homePageData.importance}
            />
            <Card className="mb-8 p-6 bg-card border border-border">
              <MarkdownContent content={bioContent} />
            </Card>
          </div>
        </div>
      )}

      {/* View toggle button - positioned at bottom left */}
      <div className="fixed bottom-8 left-8 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
          className="bg-background border border-border shadow-md hover:bg-secondary"
          aria-label={`Switch to ${viewMode === "list" ? "grid" : "list"} view`}
        >
          {viewMode === "list" ? <LayoutGrid className="h-5 w-5" /> : <Text className="h-5 w-5" />}
        </Button>
      </div>
    </div>
  )
}


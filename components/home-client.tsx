"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { BlogPost } from "./blog-post"
import { LayoutGrid, Text, BookOpen, Calendar, Hash, Github, BookMarked, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import rehypeSanitize from "rehype-sanitize"
import Link from "next/link"

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

interface Poem {
  id: string
  title: string
  dateCreated: string
  year: number
  type: string
  collection: string
  description: string
  slug: string
  image: string
  stanza1: string
  stanza2?: string
  stanza3?: string
  stanza4?: string
  stanza5?: string
  stanza6?: string
  stanza7?: string
  stanza8?: string
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

// Stats Card Component
function StatsCard({
  icon,
  title,
  value,
  subtitle,
}: { icon: React.ReactNode; title: string; value: string | number; subtitle?: string }) {
  return (
    <Card className="p-4 flex flex-col items-center justify-center text-center bg-card border border-border">
      <div className="mb-2 p-2 rounded-full bg-primary/10 text-primary">{icon}</div>
      <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
    </Card>
  )
}

// Blog Post Card Component
function BlogPostCard({ post }: { post: Post }) {
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  const year = new Date(post.date).getFullYear().toString()
  const slugPath = `blog/${year}/${post.slug}`

  // Get first 3 tags if there are many
  const displayTags = post.tags.slice(0, 3)
  const hasMoreTags = post.tags.length > 3

  return (
    <Card className="p-4 bg-card border border-border hover:bg-accent/50 transition-colors">
      <Link href={slugPath} className="no-underline">
        <h3 className="font-medium mb-1 line-clamp-1">{post.title}</h3>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{post.preview}</p>

        {/* Date and Status row */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-muted-foreground">{formattedDate}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
            {post.status || "Draft"}
          </span>
        </div>

        {/* Category */}
        <div className="mb-1">
          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{post.category}</span>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            <Tag className="h-3 w-3 text-muted-foreground" />
            {displayTags.map((tag, index) => (
              <span key={index} className="text-xs text-muted-foreground truncate max-w-[80px]">
                {tag}
                {index < displayTags.length - 1 && ", "}
              </span>
            ))}
            {hasMoreTags && <span className="text-xs text-muted-foreground">...</span>}
          </div>
        )}
      </Link>
    </Card>
  )
}

// Poetry Card Component
function PoetryCard({ poem }: { poem: Poem }) {
  const stanzas = [
    poem.stanza1,
    poem.stanza2,
    poem.stanza3,
    poem.stanza4,
    poem.stanza5,
    poem.stanza6,
    poem.stanza7,
    poem.stanza8,
  ].filter(Boolean)

  const previewStanza = stanzas[0]

  // Correct poetry path format
  const poetryPath = `/poetry/${poem.type.toLowerCase()}/${poem.year}/${poem.slug}`

  return (
    <Card className="p-4 bg-card border border-border hover:bg-accent/50 transition-colors">
      <Link href={poetryPath} className="no-underline">
        <h3 className="font-medium mb-1">{poem.title}</h3>
        <p className="text-xs text-muted-foreground mb-2">
          {poem.type} • {poem.year}
        </p>
        <div className="prose prose-sm prose-gray dark:prose-invert line-clamp-4 text-sm italic">
          {previewStanza.split("\n").map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </div>
      </Link>
    </Card>
  )
}

// GitHub Contributions Component
function GitHubContributions() {
  return (
    <Card className="p-4 bg-card border border-border">
      <div className="flex items-center gap-2 mb-3">
        <Github className="h-4 w-4" />
        <h3 className="text-sm font-medium">GitHub Contributions</h3>
      </div>
      <div className="w-full overflow-hidden">
        <img
          src={`https://ghchart.rshah.org/krisyotam`}
          alt="Kris Yotam's GitHub Contributions"
          className="w-full h-auto dark:invert"
          style={{ filter: "hue-rotate(180deg)" }}
        />
      </div>
      <div className="mt-2 text-xs text-right">
        <a
          href="https://github.com/krisyotam"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          View on GitHub
        </a>
      </div>
    </Card>
  )
}

export function HomeClient({ posts, randomQuote }: HomeClientProps) {
  const [viewMode, setViewMode] = useState("list") // "list" or "grid"
  const [randomPosts, setRandomPosts] = useState<Post[]>([])
  const [randomPoems, setRandomPoems] = useState<Poem[]>([])
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([])

  // Calculate consecutive writing streak (days since Jan 1, 2025)
  const startDate = new Date("2025-01-01")
  const currentDate = new Date()
  const diffTime = Math.abs(currentDate.getTime() - startDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  // Calculate years blogging (always > 1 as requested)
  const yearsBlogging = "> 1"

  useEffect(() => {
    // Get unique categories
    const categories = [...new Set(posts.map((post) => post.category))]
    setUniqueCategories(categories)

    // Get random posts
    const shuffledPosts = [...posts].sort(() => 0.5 - Math.random())
    setRandomPosts(shuffledPosts.slice(0, 3))

    // Fetch and set random poems
    const fetchPoems = async () => {
      try {
        const response = await fetch("/api/poems")
        const data = await response.json()
        const shuffledPoems = data.sort(() => 0.5 - Math.random())
        setRandomPoems(shuffledPoems.slice(0, 2))
      } catch (error) {
        console.error("Error fetching poems:", error)
        setRandomPoems([])
      }
    }

    fetchPoems()
  }, [posts])

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

  const formatQuoteWithLineBreaks = (text: string, maxCharsPerLine = 75): string => {
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
                {formatQuoteWithLineBreaks(`"${randomQuote.text}" - ${randomQuote.author}`, 75)}
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
        // Enhanced Grid view with new features
        <div className="p-8 md:p-12 lg:p-16">
          <div className="max-w-3xl mx-auto">
            <PageHeader
              title={homePageData.title}
              subtitle={homePageData.subtitle}
              date={homePageData.date}
              preview={homePageData.preview}
              status={homePageData.status}
              confidence={homePageData.confidence}
              importance={homePageData.importance}
            />

            {/* Bio Card */}
            <Card className="mb-8 p-6 bg-card border border-border">
              <MarkdownContent content={bioContent} />
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <StatsCard
                icon={<Calendar className="h-5 w-5" />}
                title="Writing Streak"
                value={diffDays}
                subtitle="consecutive days"
              />
              <StatsCard
                icon={<BookOpen className="h-5 w-5" />}
                title="Years Blogging"
                value={yearsBlogging}
                subtitle="since 2025"
              />
              <StatsCard
                icon={<Hash className="h-5 w-5" />}
                title="Topics"
                value={uniqueCategories.length}
                subtitle="unique categories"
              />
            </div>

            {/* Random Blog Posts */}
            <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
              <BookMarked className="h-5 w-5" />
              Suggested Readings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {randomPosts.map((post) => (
                <BlogPostCard key={post.slug} post={post} />
              ))}
            </div>

            {/* Random Poetry */}
            <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Featured Poetry
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {randomPoems.map((poem) => (
                <PoetryCard key={poem.id} poem={poem} />
              ))}
            </div>

            {/* GitHub Contributions */}
            <GitHubContributions />
          </div>
        </div>
      )}

      {/* View toggle button - positioned at bottom left */}
      <div className="fixed bottom-5 left-5 z-50">
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

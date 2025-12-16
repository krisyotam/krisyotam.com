"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { BlogPost } from "./blog-post"
import { LayoutGrid, Text, BookOpen, Calendar, Hash, Github, BookMarked, Tag, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CustomSelect, SelectOption } from "@/components/ui/custom-select"
import { Card, CardContent } from "@/components/ui/card"
import { HeartButton } from "@/components/heart-button"
import { PageHeader } from "@/components/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import rehypeSanitize from "rehype-sanitize"
import Link from "next/link"
import Image from "next/image"
import { Box } from "@/components/posts/typography/box";
import { Excerpt } from "@/components/posts/typography/excerpt";
import { Quote } from "@/components/posts/typography/quote";
import { Spoiler } from "@/components/posts/typography/spoiler";
import { PoemBox } from "@/components/posts/typography/poem"
import Collapse from "@/components/posts/typography/collapse"
import { EnhancedImageDisplay } from "@/components/posts/images/enhanced-image-display";
import { Image as BasicImage } from "@/components/posts/images/basic-image-display";
import AboutMe from "@/components/about/AboutMe"
import Profile from "@/components/about/Profile"
import Personality from "@/components/about/Personality"
import PersonalityMorals from "@/components/about/PersonalityMorals"
import Intelligence from "@/components/about/Intelligence"
import InterestingPeople from "@/components/about/InterestingPeople"
import OnMyMethod from "@/components/about/OnMyMethod"
import MyMission from "@/components/about/MyMission"
import Certifications from "@/components/about/Certifications"
import CoreValues from "@/components/about/CoreValues"
import ExperienceComponent from "@/components/about/Experience"
import CoreSkillsComponent from "@/components/about/CoreSkills"
import PersonalPhilosophy from "@/components/about/PersonalPhilosophy"
import AreasOfInterest from "@/components/about/AreasOfInterest"
import Practice from "@/components/about/Practice"
import Companies from "@/components/about/Companies"
import MySites from "@/components/about/MySites"
import OtherSites from "@/components/about/OtherSites"
import SiteInfo from "@/components/about/SiteInfo"
import Hosting from "@/components/about/Hosting"
import AboutThisSite from "@/components/about/AboutThisSite"
import SupportMe from "@/components/about/SupportMe"
import RecommendedContent from "@/components/about/RecommendedContent"
import { FeaturedPost } from "@/components/featured-post"
import { Post } from "@/utils/posts"
import Favorites from "@/components/Favorites"
import { InfiniteMovingQuotes } from "@/components/InfiniteMovingQuotes"
import { ThemeImageCompare } from "@/components/about/ThemeImageCompare"
import { BentoNav } from "@/components/bento-nav"
import TestimonialsSection from "@/components/about/testimonials"
import Uses from "@/components/about/Uses"

// URL generation helper - based on correct route patterns for both content types
function getPostUrl(post: Post): string {
  // Check if this is a blog post or an essay based on the path property
  if (post.path === 'blog') {
    // Blog posts are accessed by /blog/category-slug/slug
    const categorySlug = post.category.toLowerCase().replace(/\s+/g, '-');
    return `blog/${categorySlug}/${encodeURIComponent(post.slug)}`;
  } else {
    // Essays are accessed by /essays/category-slug/slug
    const categorySlug = post.category.toLowerCase().replace(/\s+/g, '-');
    return `essays/${categorySlug}/${post.slug}`;
  }
}

// Type definitions for props
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
  initialView?: 'list' | 'grid'
  onRequestNewQuote?: () => void
}

// Home page metadata for the grid view
const homePageData = {
  title: "Kris Yotam",
  subtitle: "Essays, Notes, and Musings",
  start_date: "2025-01-01",
  end_date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0],
  preview: "A collection of writings on multiple disciplines.",
  status: "Finished" as const,
  confidence: "certain" as const,
  importance: 9,
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
  const displayDate = (post.end_date && post.end_date.trim()) ? post.end_date : post.start_date;
  const formattedDate = new Date(displayDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  // Generate correct URL based on whether it's an essay or blog post
  const slugPath = getPostUrl(post);
  
  // Get first 3 tags if there are many
  const displayTags = post.tags.slice(0, 3)
  const hasMoreTags = post.tags.length > 3
  
  // Determine content type for display (Essay or Blog Post)
  const contentType = post.path === 'blog' ? 'Blog Post' : 'Essay'

  return (
    <Card className="p-4 bg-card border border-border hover:bg-accent/50 transition-colors">
      <Link href={slugPath} className="no-underline">
        <h3 className="font-medium mb-1 line-clamp-1">{post.title}</h3>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{post.preview}</p>

        {/* Date, Status, and Content Type row */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-muted-foreground">{formattedDate}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
              {post.status || "Draft"}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
              {contentType}
            </span>
          </div>
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
  // Generate the correct URL for the poem using the same pattern as in verse-client.tsx
  const typeSlug = poem.type.toLowerCase().replace(/\s+/g, "-");
  const poetryPath = `/verse/${encodeURIComponent(typeSlug)}/${poem.year}/${encodeURIComponent(poem.slug)}`;
  
  // Format the date
  const formattedDate = new Date(poem.dateCreated).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Card className="p-4 bg-card border border-border hover:bg-secondary/50 transition-colors">
      <Link href={poetryPath} className="no-underline">
        <h3 className="font-medium mb-1">{poem.title}</h3>
        <div className="flex justify-between items-center mb-2">
          <p className="text-xs text-muted-foreground">
            {poem.type} • {poem.year}
          </p>
          <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
            {formattedDate}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {poem.collection ? `Collection: ${poem.collection}` : "Standalone work"}
        </p>
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

// Post Table Row Component
function PostTableRow({ post }: { post: Post }) {
  const displayDate = (post.end_date && post.end_date.trim()) ? post.end_date : post.start_date;
  const formattedDate = new Date(displayDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
  
  // Generate correct URL - using same pattern as working essays-table.tsx
  const slugPath = getPostUrl(post);
  
  // Debug logging
  console.log('PostTableRow - Linking to:', slugPath);
  
  return (
    <tr className="border-t border-border hover:bg-secondary/50 transition-colors">
      <td className="py-2 pr-4 text-sm text-muted-foreground font-mono">{formattedDate}</td>
      <td className="py-2 pr-4">
        <Link href={slugPath} className="no-underline">
          {post.title}
        </Link>
      </td>
      <td className="py-2 text-sm text-right">
        <span className="px-2 py-0.5 text-xs rounded-md bg-muted text-muted-foreground">{post.category}</span>
      </td>
    </tr>
  )
}

// Posts Table Component with Pagination
function PostsTable({ posts }: { posts: Post[] }) {
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 10
  
  // Filter out excluded categories, ensure posts are active, and sort by date (newest first)
  const filteredPosts = posts
    .filter(post => !["On Myself", "On Website", "On Learning", "On Writing", "On Method"].includes(post.category))
    .filter(post => {
      const displayDate = (post.end_date && post.end_date.trim()) ? post.end_date : post.start_date;
      return post.slug && displayDate && post.preview;
    })
    .filter(post => post.state === "active" || !post.state) // Only include posts with state "active" or without a state property
    .sort((a, b) => {
      const dateA = (a.end_date && a.end_date.trim()) ? a.end_date : a.start_date;
      const dateB = (b.end_date && b.end_date.trim()) ? b.end_date : b.start_date;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    })
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage)
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost)
  
  // Handle page changes
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages))
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1))
  
  return (
    <div className="w-full mb-8">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-muted-foreground">
              <th className="w-1/5 pb-2 text-sm font-normal">Date</th>
              <th className="pb-2 text-sm font-normal">Title</th>
              <th className="w-1/6 pb-2 text-sm font-normal text-right">Category</th>
            </tr>
          </thead>
          <tbody>
            {currentPosts.map((post) => (
              <PostTableRow key={post.slug} post={post} />
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// Add this AccordionItem component
function AccordionItem({ 
  title, 
  content, 
  isOpen, 
  onToggle 
}: { 
  title: string; 
  content: React.ReactNode; 
  isOpen: boolean; 
  onToggle: () => void;
}) {
  const slug = title.toLowerCase().replace(/\s+/g, "-")
  
  return (
    <div className="border-b border-border" id={slug}>
      <button
        onClick={onToggle}
        className="w-full py-8 flex justify-between items-center text-left"
        aria-expanded={isOpen}
        aria-controls={`section-${slug}`}
      >
        <h2 className="text-2xl font-normal text-foreground">
          <a className="hover:text-primary transition-colors">
            {title}
          </a>
        </h2>
        {isOpen ? (
          <span className="text-2xl text-foreground" aria-hidden="true">
            -
          </span>
        ) : (
          <span className="text-2xl text-foreground" aria-hidden="true">
            +
          </span>
        )}
      </button>
      <div
        id={`section-${slug}`}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[5000px] mb-8" : "max-h-0"
        }`}
      >
        {content}
      </div>
    </div>
  )
}

export function HomeClient({ posts, randomQuote, initialView = 'list' }: HomeClientProps) {
  const [viewMode, setViewMode] = useState(initialView) // "list" or "grid"
  const [randomPosts, setRandomPosts] = useState<Post[]>([])
  const [randomPoems, setRandomPoems] = useState<Poem[]>([])
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([])
  const [expandQuote, setExpandQuote] = useState(false)
  const [currentQuote, setCurrentQuote] = useState(randomQuote)
  const [quoteLines, setQuoteLines] = useState<string[]>([])
  const [showMoreQuote, setShowMoreQuote] = useState(false)
  const [activeAboutTab, setActiveAboutTab] = useState<string>("about-me")
  const [openSections, setOpenSections] = useState<number[]>([0])

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

  useEffect(() => {
    // Format the quote to check if it needs the "show more" functionality
    const lines = formatQuoteWithLineBreaks(`"${currentQuote.text}" - ${currentQuote.author}`, 75).split('\n');
    setQuoteLines(lines);
    setShowMoreQuote(lines.length > 2);
    setExpandQuote(false);
  }, [currentQuote]);

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

  const getNewRandomQuote = async () => {
    try {
      // Get a new random quote from the server. Add a timestamp query param
      // and request no-store to avoid getting a cached response from the
      // browser or any intermediate caches.
      const response = await fetch(`/api/random-quote?ts=${Date.now()}`, {
        cache: 'no-store',
      });

      const newQuote = await response.json();
      setCurrentQuote(newQuote);
    } catch (error) {
      // If the API fails, generate a new random quote client-side
      // This assumes we have access to all quotes on the client, which may not be true
      // Fallback to a simple refresh of the page to get a new server-rendered quote
      window.location.reload();
    }
  };

  // Toggle accordion sections
  const toggleSection = (index: number) => {
    setOpenSections((current) => {
      if (current.includes(index)) {
        return current.filter((i) => i !== index)
      } else {
        return [...current, index]
      }
    })
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {viewMode === "list" ? (
        // List view (unchanged)
        <div className="p-8 md:p-16 lg:p-24">
          <div className="max-w-4xl mx-auto">
            <header className="mb-16 pl-8">
              <h1 className="text-4xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Kris Yotam</h1>
              <div className="relative">
                <p 
                  onClick={getNewRandomQuote}
                  className="text-sm font-light italic text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary cursor-pointer transition-colors"
                >
                  {showMoreQuote ? (
                    expandQuote ? (
                      quoteLines.map((line, index) => (
                        <span key={index} className="block">
                          {line}
                        </span>
                      ))
                    ) : (
                      <>
                        <span className="block">{quoteLines[0]}</span>
                        <span className="block">{quoteLines[1]}</span>
                      </>
                    )
                  ) : (
                    quoteLines.map((line, index) => (
                      <span key={index} className="block">
                        {line}
                      </span>
                    ))
                  )}
                </p>
                {showMoreQuote && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandQuote(!expandQuote);
                    }}
                    className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1"
                  >
                    <ChevronDown className={`h-4 w-4 transition-transform ${expandQuote ? 'rotate-180' : ''}`} />
                    <span className="ml-1">{expandQuote ? 'Show less' : 'Show more'}</span>
                  </button>
                )}
              </div>
            </header>
            <main>
              <div className="space-y-8">
                {posts
                  .filter(post => !["On Myself", "On Website", "On Learning", "On Writing", "On Method"].includes(post.category))
                  .filter(post => {
                    const displayDate = (post.end_date && post.end_date.trim()) ? post.end_date : post.start_date;
                    return post.slug && displayDate && post.preview;
                  })
                  .map((post) => {
                    // Generate correct URL - using same pattern as working essays-table.tsx
                    const slugPath = getPostUrl(post);

                    return (
                      <BlogPost
                        key={post.slug}
                        slug={slugPath}
                        type={"tsx"}
                        title={post.title}
                        subtitle={`${post.path === 'blog' ? 'Blog Post' : 'Essay'}: ${post.subtitle || post.category}`}
                        date={formatDate((post.end_date && post.end_date.trim()) ? post.end_date : post.start_date)}
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
              start_date={homePageData.start_date}
              end_date={homePageData.end_date}
              preview={homePageData.preview}
              status={homePageData.status}
              confidence={homePageData.confidence}
              importance={homePageData.importance}
            />

            {/* Logo and QR Code Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <Card className="bg-muted/50 hover:bg-muted/70 transition-colors border-0">
                <CardContent className="p-0 flex flex-col items-center justify-between h-full">
                  <div className="relative w-[360px] h-[360px] mt-8 -mb-8">
                    <Image
                      src="https://krisyotam.com/doc/site/krisyotam-personal-crest.png"
                      alt="Kris Yotam Logo"
                      fill
                      style={{ objectFit: "contain" }}
                      className="rounded-md logo-light select-none pointer-events-none"
                      onContextMenu={(e) => e.preventDefault()}
                      priority
                    />
                    <Image
                      src="https://krisyotam.com/doc/site/krisyotam-personal-crest-darkmode.png"
                      alt="Kris Yotam Logo (Dark Mode)"
                      fill
                      style={{ objectFit: "contain" }}
                      className="rounded-md logo-dark select-none pointer-events-none"
                      onContextMenu={(e) => e.preventDefault()}
                      priority
                    />
                  </div>
                  <div className="flex flex-col items-center gap-1 mt-0">
                    <p className="text-center text-sm text-muted-foreground">
                      toward a examined life
                    </p>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
                        <a href="/notes/on-myself/about-kris" target="_blank" rel="noopener noreferrer">
                          About Me
                        </a>
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
                        <a href="/notes/website/about-this-website" target="_blank" rel="noopener noreferrer">
                          About Website
                        </a>
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
                        <a href="/notes/on-myself/about-my-logo" target="_blank" rel="noopener noreferrer">
                          About Logo
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/50 hover:bg-muted/70 transition-colors border-0">
                <CardContent className="p-0 flex flex-col items-center justify-between h-full">
                  <div className="relative w-[340px] h-[340px] mt-8">
                    <Image
                      src="https://krisyotam.com/doc/site/krisyotam-light.png"
                      alt="Kris Yotam Logo"
                      fill
                      style={{ objectFit: "contain" }}
                      className="rounded-md logo-light select-none pointer-events-none"
                      onContextMenu={(e) => e.preventDefault()}
                      priority
                    />
                    <Image
                      src="https://krisyotam.com/doc/site/krisyotam-dark.png"
                      alt="Kris Yotam Logo"
                      fill
                      style={{ objectFit: "contain" }}
                      className="rounded-md logo-dark select-none pointer-events-none"
                      onContextMenu={(e) => e.preventDefault()}
                      priority
                    />
                  </div>
                  <div className="flex flex-col items-center gap-2 mt-6">
                    <p className="text-center text-sm text-muted-foreground">
                      💡 If you find something here worth preserving...
                    </p>
                    <div className="flex items-center gap-2">
                      <HeartButton />
                      <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
                        <a href="https://coff.ee/krisyotam" target="_blank" rel="noopener noreferrer">
                          ☕ Buy Me Tea
                        </a>
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
                        <a href="https://krisyotam.substack.com/" target="_blank" rel="noopener noreferrer">
                          📩 Join the List
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Focus section: floating quotes, most important pages (bento), dark mode preview, comments showcase */}
            <div className="my-6 md:my-8">
              <div className="space-y-6 md:space-y-8">
                {/* Sliding Quotes Animation (trim internal bottom padding) */}
                <InfiniteMovingQuotes className="[&>ul]:py-1 md:[&>ul]:py-2" />

                {/* Bento navigation */}
                <BentoNav />

                {/* Theme Image Compare Animation with caption */}
                <div>
                  <ThemeImageCompare />
                  <p className="mt-2 text-center text-xs text-muted-foreground">hover to view site in dark mode</p>
                </div>

                {/* Comment showcase */}
                <TestimonialsSection />
              </div>
            </div>

            {/* About This Site Collapse */}
            <div className="mb-6">
              <AboutThisSite />
              <SupportMe />
              <RecommendedContent />
            </div>

            {/* About Accordion */}
            <div className="mb-8">
              <AccordionItem
                title="About Me"
                content={<AboutMe />}
                isOpen={openSections.includes(0)}
                onToggle={() => toggleSection(0)}
              />
              {/* Favorites tab below About Me, above Socials */}
              <AccordionItem
                title="Favorites"
                content={<Favorites />}
                isOpen={openSections.includes(-1)}
                onToggle={() => toggleSection(-1)}
              />
              {/* Uses tab below Favorites, above Socials */}
              <AccordionItem
                title="Uses"
                content={<Uses />}
                isOpen={openSections.includes(-2)}
                onToggle={() => toggleSection(-2)}
              />
              <AccordionItem
                title="Socials"
                content={<MySites />}
                isOpen={openSections.includes(1)}
                onToggle={() => toggleSection(1)}
              />
              <AccordionItem
                title="Hosting"
                content={<Hosting />}
                isOpen={openSections.includes(2)}
                onToggle={() => toggleSection(2)}
              />
              <AccordionItem
                title="Profile"
                content={<Profile />}
                isOpen={openSections.includes(3)}
                onToggle={() => toggleSection(3)}
              />
              <AccordionItem
                title="Intelligence"
                content={<Intelligence />}
                isOpen={openSections.includes(4)}
                onToggle={() => toggleSection(4)}
              />
              <AccordionItem
                title="Personality"
                content={<Personality />}
                isOpen={openSections.includes(5)}
                onToggle={() => toggleSection(5)}
              />
              <AccordionItem
                title="Morals"
                content={<PersonalityMorals />}
                isOpen={openSections.includes(6)}
                onToggle={() => toggleSection(6)}
              />
              <AccordionItem
                title="On My Method"
                content={<OnMyMethod />}
                isOpen={openSections.includes(7)}
                onToggle={() => toggleSection(7)}
              />
              <AccordionItem
                title="My Mission"
                content={<MyMission />}
                isOpen={openSections.includes(8)}
                onToggle={() => toggleSection(8)}
              />
              <AccordionItem
                title="Certifications"
                content={<Certifications />}
                isOpen={openSections.includes(9)}
                onToggle={() => toggleSection(9)}
              />
              <AccordionItem
                title="Core Values"
                content={<CoreValues />}
                isOpen={openSections.includes(10)}
                onToggle={() => toggleSection(10)}
              />
              <AccordionItem
                title="Experience"
                content={<ExperienceComponent />}
                isOpen={openSections.includes(11)}
                onToggle={() => toggleSection(11)}
              />
              <AccordionItem
                title="Practice"
                content={<Practice />}
                isOpen={openSections.includes(12)}
                onToggle={() => toggleSection(12)}
              />
              <AccordionItem
                title="Core Skills"
                content={<CoreSkillsComponent />}
                isOpen={openSections.includes(13)}
                onToggle={() => toggleSection(13)}
              />
              <AccordionItem
                title="Personal Philosophy"
                content={<PersonalPhilosophy />}
                isOpen={openSections.includes(14)}
                onToggle={() => toggleSection(14)}
              />
              <AccordionItem
                title="Areas of Interest"
                content={<AreasOfInterest />}
                isOpen={openSections.includes(15)}
                onToggle={() => toggleSection(15)}
              />
              <AccordionItem
                title="Companies"
                content={<Companies />}
                isOpen={openSections.includes(16)}
                onToggle={() => toggleSection(16)}
              />

              <AccordionItem
                title="Other Sites"
                content={<OtherSites />}
                isOpen={openSections.includes(17)}
                onToggle={() => toggleSection(17)}
              />
              <AccordionItem
                title="Site Info"
                content={<SiteInfo />}
                isOpen={openSections.includes(18)}
                onToggle={() => toggleSection(18)}
              />
            </div>

            {/* Featured Post Section */}
            <div className="mb-8">
              <FeaturedPost posts={posts} />
            </div>

            {/* Posts Table with Feed Data */}
            <Card className="mb-8 p-6 bg-card border border-border">
              <PostsTable posts={posts} />
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {randomPosts.map((post) => (
                <BlogPostCard key={post.slug} post={post} />
              ))}
            </div>

            {/* Random Poetry */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {randomPoems.map((poem) => (
                <PoetryCard key={poem.id} poem={poem} />
              ))}
            </div>

            {/* Interesting People */}
            <div className="mb-8">
              <InterestingPeople />
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
          onClick={() => {
            const newView = viewMode === "list" ? "grid" : "list"
            setViewMode(newView)
            // Update URL without page reload
            window.history.pushState({}, '', newView === "list" ? "/" : "/grid")
          }}
          className="bg-background border border-border shadow-md hover:bg-secondary"
          aria-label={`Switch to ${viewMode === "list" ? "grid" : "list"} view`}
        >
          {viewMode === "list" ? <LayoutGrid className="h-5 w-5" /> : <Text className="h-5 w-5" />}
        </Button>
      </div>
    </div>
  )
}

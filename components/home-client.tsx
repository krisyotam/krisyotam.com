"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { BlogPost } from "./blog-post"
import { LayoutGrid, Text, BookOpen, Calendar, Hash, Github, BookMarked, Tag, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
  initialView?: 'list' | 'grid'
  onRequestNewQuote?: () => void
}

// Home page metadata for the grid view
const homePageData = {
  title: "Kris Yotam",
  subtitle: "Essays, Notes, and Musings",
  date: new Date().toISOString(),
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

  // Fixed poetry path to use /verse directly
  const poetryPath = `/verse/${poem.slug}`

  return (
    <Card className="p-4 bg-card border border-border hover:bg-accent/50 transition-colors">
      <Link href={poetryPath} className="no-underline">
        <h3 className="font-medium mb-1">{poem.title}</h3>
        <p className="text-xs text-muted-foreground mb-2">
          {poem.type} • {poem.year}
        </p>
        <div className="prose prose-sm prose-gray dark:prose-invert line-clamp-4 text-sm italic">
          {previewStanza?.split("\n").map((line, i) => (
            <p key={i} className="text-sm text-muted-foreground">
              {line}
            </p>
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

// Post Table Row Component
function PostTableRow({ post }: { post: Post }) {
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
  
  const year = new Date(post.date).getFullYear().toString()
  const slugPath = `blog/${year}/${post.slug}`
  
  return (
    <tr className="border-t border-border hover:bg-muted/30 transition-colors">
      <td className="py-2 pr-4 text-sm text-muted-foreground font-mono">{formattedDate}</td>
      <td className="py-2 pr-4">
        <Link href={slugPath} className="hover:underline">
          {post.title}
        </Link>
      </td>
      <td className="py-2 text-sm text-right">
        <span className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground">{post.category}</span>
      </td>
    </tr>
  )
}

// Posts Table Component with Pagination
function PostsTable({ posts }: { posts: Post[] }) {
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 10
  
  // Filter out excluded categories and sort by date (newest first)
  const filteredPosts = posts
    .filter(post => !["On Myself", "On Website", "On Learning", "On Writing", "On Method"].includes(post.category))
    .filter(post => post.slug && post.date && post.preview)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  
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
            />
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
      // Get a new random quote from the server
      const response = await fetch('/api/random-quote');
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
                    className="inline-flex items-center text-xs text-gray-500 dark:text-gray-500 hover:text-primary dark:hover:text-primary mt-1 cursor-pointer"
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
                  .filter(post => post.slug && post.date && post.preview)
                  .map((post) => {
                    const year = getPostYear(post.date)
                    const slugPath = `blog/${year}/${post.slug}`

                    return (
                      <BlogPost
                        key={post.slug}
                        slug={slugPath}
                        type={"tsx"}
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

            {/* Logo and QR Code Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <Card className="bg-muted/50 hover:bg-muted/70 transition-colors border-0">
                <CardContent className="p-4 flex items-center justify-center h-full">
                  <div className="relative w-[250px] h-[250px]">
                    <Image
                      src="https://i.postimg.cc/xTdhKB3b/krisyotam-aristocratic-logo.png"
                      alt="Kris Yotam Logo"
                      fill
                      style={{ objectFit: "contain" }}
                      className="rounded-md dark:invert dark:brightness-0 dark:contrast-100 select-none pointer-events-none"
                      onContextMenu={(e) => e.preventDefault()}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/50 hover:bg-muted/70 transition-colors">
                <CardContent className="p-4 flex flex-col items-center justify-center h-full">
                  <div className="relative w-[250px] h-[250px]">
                    <Image
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://orcid.org/0000-0003-0632-8894`}
                      alt="ORCID QR Code"
                      fill
                      style={{ objectFit: "contain" }}
                      className="rounded-md"
                    />
                  </div>
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    Scan to view my ORCID profile
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* About Accordion */}
            <div className="mb-8">
              <AccordionItem
                title="About Me"
                content={<AboutMe />}
                isOpen={openSections.includes(0)}
                onToggle={() => toggleSection(0)}
              />
              <AccordionItem
                title="Profile"
                content={<Profile />}
                isOpen={openSections.includes(1)}
                onToggle={() => toggleSection(1)}
              />
              <AccordionItem
                title="Personality"
                content={<Personality />}
                isOpen={openSections.includes(2)}
                onToggle={() => toggleSection(2)}
              />
              <AccordionItem
                title="Personality/Morals"
                content={<PersonalityMorals />}
                isOpen={openSections.includes(3)}
                onToggle={() => toggleSection(3)}
              />
              <AccordionItem
                title="On My Method"
                content={<OnMyMethod />}
                isOpen={openSections.includes(4)}
                onToggle={() => toggleSection(4)}
              />
              <AccordionItem
                title="My Mission"
                content={<MyMission />}
                isOpen={openSections.includes(5)}
                onToggle={() => toggleSection(5)}
              />
              <AccordionItem
                title="Certifications"
                content={<Certifications />}
                isOpen={openSections.includes(6)}
                onToggle={() => toggleSection(6)}
              />
              <AccordionItem
                title="Core Values"
                content={<CoreValues />}
                isOpen={openSections.includes(7)}
                onToggle={() => toggleSection(7)}
              />
              <AccordionItem
                title="Experience"
                content={<ExperienceComponent />}
                isOpen={openSections.includes(8)}
                onToggle={() => toggleSection(8)}
              />
              <AccordionItem
                title="Practice"
                content={<Practice />}
                isOpen={openSections.includes(9)}
                onToggle={() => toggleSection(9)}
              />
              <AccordionItem
                title="Core Skills"
                content={<CoreSkillsComponent />}
                isOpen={openSections.includes(10)}
                onToggle={() => toggleSection(10)}
              />
              <AccordionItem
                title="Personal Philosophy"
                content={<PersonalPhilosophy />}
                isOpen={openSections.includes(11)}
                onToggle={() => toggleSection(11)}
              />
              <AccordionItem
                title="Areas of Interest"
                content={<AreasOfInterest />}
                isOpen={openSections.includes(12)}
                onToggle={() => toggleSection(12)}
              />
              <AccordionItem
                title="Companies"
                content={<Companies />}
                isOpen={openSections.includes(13)}
                onToggle={() => toggleSection(13)}
              />
              <AccordionItem
                title="Socials"
                content={<MySites />}
                isOpen={openSections.includes(14)}
                onToggle={() => toggleSection(14)}
              />
              <AccordionItem
                title="Other Sites"
                content={<OtherSites />}
                isOpen={openSections.includes(15)}
                onToggle={() => toggleSection(15)}
              />
              <AccordionItem
                title="Site Info"
                content={<SiteInfo />}
                isOpen={openSections.includes(16)}
                onToggle={() => toggleSection(16)}
              />
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

"use client"

import { useState, useMemo } from "react"
import NewsletterHeader from "@/components/newsletter-header"
import NewsletterFooter from "@/components/newsletter-footer"
import NewsletterCard from "@/components/newsletter-card"
import NewsletterYearFilter from "@/components/newsletter-year-filter"
import NewsletterHelpModal from "@/components/newsletter-help-modal"
import { HelpCircle, Grid, List } from "lucide-react"
import { PageHeader } from "@/components/page-header"

// Add Newsletter page metadata after other imports
const newsletterPageData = {
  title: "Newsletter",
  subtitle: "Regular Updates and Insights",
  date: new Date().toISOString(),
  preview: "An archive of my newsletter issues, featuring updates, insights, and curated content on various topics.",
  status: "In Progress" as const,
  confidence: "certain" as const,
  importance: 6,
}

interface Newsletter {
  id: string
  title: string
  date: string
  year: string
  description: string
  tags: string[]
  link: string
  image: string
}

interface NewsletterClientPageProps {
  initialNewsletters: Newsletter[]
}

export default function NewsletterClientPage({ initialNewsletters }: NewsletterClientPageProps) {
  const [newsletters, setNewsletters] = useState<Newsletter[]>(initialNewsletters)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedYear, setSelectedYear] = useState("all")
  const [view, setView] = useState<"grid" | "list">("grid")
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false)

  // Extract unique years from newsletters
  const years = useMemo(() => {
    const uniqueYears = [...new Set(initialNewsletters.map((newsletter) => newsletter.year))]
    return uniqueYears.sort((a, b) => Number.parseInt(b) - Number.parseInt(a)) // Sort years in descending order
  }, [initialNewsletters])

  // Filter newsletters based on search query and selected year
  const filteredNewsletters = useMemo(() => {
    return initialNewsletters.filter((newsletter) => {
      const matchesSearch =
        searchQuery === "" ||
        newsletter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        newsletter.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        newsletter.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesYear = selectedYear === "all" || newsletter.year === selectedYear

      return matchesSearch && matchesYear
    })
  }, [initialNewsletters, searchQuery, selectedYear])

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] text-black dark:text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="w-full max-w-3xl mx-auto">
          {/* Add the PageHeader component */}
          <PageHeader
            title={newsletterPageData.title}
            subtitle={newsletterPageData.subtitle}
            date={newsletterPageData.date}
            preview={newsletterPageData.preview}
            status={newsletterPageData.status}
            confidence={newsletterPageData.confidence}
            importance={newsletterPageData.importance}
          />

          <NewsletterHeader />

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search newsletters..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-zinc-700 rounded-md bg-transparent focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-zinc-700"
                />
              </div>
              <div className="flex ml-4 space-x-2">
                <button
                  onClick={() => setView("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    view === "grid"
                      ? "bg-gray-200 dark:bg-zinc-800"
                      : "text-gray-500 hover:bg-gray-100 dark:text-zinc-500 dark:hover:bg-zinc-900"
                  }`}
                  aria-label="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`p-2 rounded-md transition-colors ${
                    view === "list"
                      ? "bg-gray-200 dark:bg-zinc-800"
                      : "text-gray-500 hover:bg-gray-100 dark:text-zinc-500 dark:hover:bg-zinc-900"
                  }`}
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mb-6">
              <NewsletterYearFilter years={years} selectedYear={selectedYear} onYearChange={setSelectedYear} />
            </div>
          </div>

          {filteredNewsletters.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-zinc-400">No newsletters found.</p>
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredNewsletters.map((newsletter) => (
                <NewsletterCard key={newsletter.id} newsletter={newsletter} view="grid" />
              ))}
            </div>
          ) : (
            <div className="space-y-0">
              {filteredNewsletters.map((newsletter) => (
                <NewsletterCard key={newsletter.id} newsletter={newsletter} view="list" />
              ))}
            </div>
          )}

          <NewsletterFooter />

          <button
            onClick={() => setIsHelpModalOpen(true)}
            className="fixed bottom-4 left-4 p-2 rounded-full bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
            aria-label="Help"
          >
            <HelpCircle className="w-5 h-5 text-gray-600 dark:text-zinc-400" />
          </button>

          <NewsletterHelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
        </div>
      </div>
    </div>
  )
}


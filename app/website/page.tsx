"use client"

import { useState, useEffect } from "react"
import { ConceptsBento } from "@/components/concepts-bento"
import { ExpandableSubsection } from "@/components/expandable-subsection"
import { WikiText } from "@/components/wiki-text"
import { BookOpen } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { WebsitePreview } from "@/components/website-preview"
import websitePreviewData from "@/data/website-preview.json"

// Website page metadata
const websitePageData = {
  title: "Website",
  subtitle: "Design, Architecture, and Philosophy",
  date: new Date().toISOString(),
  preview:
    "An exploration of the design principles, technical architecture, and philosophical approach behind this website.",
  status: "In Progress" as const,
  confidence: "certain" as const,
  importance: 7,
}

interface WikiTerm {
  term: string
  url: string
}

interface Subsection {
  title: string
  content: string
  wikiTerms: WikiTerm[]
}

interface Section {
  title: string
  content: string
  wikiTerms: WikiTerm[]
  subsections: Subsection[]
}

interface Reference {
  name: string
  url: string
}

interface WebsiteContent {
  sections: Section[]
  references: Reference[]
}

export default function WebsitePage() {
  const [content, setContent] = useState<WebsiteContent | null>(null)
  const [openSections, setOpenSections] = useState<number[]>([0])
  const [currentDate, setCurrentDate] = useState<string>("")

  useEffect(() => {
    // Format current date
    const now = new Date()
    const formattedDate = now.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    setCurrentDate(formattedDate)

    // Fetch content
    const fetchContent = async () => {
      try {
        const response = await fetch("/api/website-content")
        if (!response.ok) {
          throw new Error("Failed to fetch website content")
        }
        const data = await response.json()
        setContent(data)
      } catch (error) {
        console.error("Error fetching website content:", error)
      }
    }

    fetchContent()
  }, [])

  const toggleSection = (index: number) => {
    setOpenSections((current) => (current.includes(index) ? current.filter((i) => i !== index) : [...current, index]))
  }

  if (!content) {
    return (
      <div className="relative min-h-screen bg-background text-foreground">
        <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
          <PageHeader
            title={websitePageData.title}
            subtitle={websitePageData.subtitle}
            date={websitePageData.date}
            preview={websitePageData.preview}
            status={websitePageData.status}
            confidence={websitePageData.confidence}
            importance={websitePageData.importance}
          />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
        <PageHeader
          title={websitePageData.title}
          subtitle={websitePageData.subtitle}
          date={websitePageData.date}
          preview={websitePageData.preview}
          status={websitePageData.status}
          confidence={websitePageData.confidence}
          importance={websitePageData.importance}
        />

        {/* Website Preview Component */}
        <WebsitePreview
          description={websitePreviewData.description}
          lightModeImage={websitePreviewData.lightModeImage}
          darkModeImage={websitePreviewData.darkModeImage}
        />

        <div className="mb-6 p-4 bg-muted/30 border border-border rounded-md">
          <div className="flex items-start">
            <BookOpen className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
            <div>
              <h3 className="text-sm font-medium mb-1">Interactive Learning Experience</h3>
              <p className="text-sm text-muted-foreground">
                Throughout this page, <span className="border-b border-dotted border-primary/50">underlined terms</span>{" "}
                can be clicked to open Wikipedia articles in a draggable window. This allows you to explore concepts
                without losing your place in the text.
              </p>
            </div>
          </div>
        </div>

        <ConceptsBento references={content.references} />

        <div className="space-y-px mb-16">
          {content.sections.map((section, index) => (
            <div key={index} className="border-b border-border">
              <button
                onClick={() => toggleSection(index)}
                className="w-full py-8 flex justify-between items-center text-left"
                aria-expanded={openSections.includes(index)}
                aria-controls={`section-${index}`}
              >
                <h2 className="text-2xl font-normal text-foreground">{section.title}</h2>
                {openSections.includes(index) ? (
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
                id={`section-${index}`}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openSections.includes(index) ? "max-h-[5000px] mb-8" : "max-h-0"
                }`}
              >
                <div className="mb-6">
                  <WikiText text={section.content} terms={section.wikiTerms} />
                </div>

                {section.subsections.map((subsection, subIndex) => (
                  <ExpandableSubsection key={subIndex} title={subsection.title}>
                    <div className="prose dark:prose-invert max-w-none">
                      <WikiText text={subsection.content} terms={subsection.wikiTerms} />
                    </div>
                  </ExpandableSubsection>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


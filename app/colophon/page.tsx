"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { AnimatedTag } from "@/components/animated-tag"
import { UpdateModal } from "@/components/update-modal"
import { PageHeader } from "@/components/page-header"

// Add colophon page metadata after the other imports
const colophonPageData = {
  title: "Colophon",
  subtitle: "Design and Technical Details",
  date: new Date().toISOString(),
  preview: "Information about the design, typography, and technology used to create this website.",
  status: "Finished" as const,
  confidence: "certain" as const,
  importance: 6,
}

interface Inspiration {
  name: string
  url: string
}

interface Update {
  version: string
  date: string
  description: string
}

interface InspirationsData {
  lastUpdated: string
  inspirations: Inspiration[]
}

interface UpdatesData {
  updates: Update[]
}

export default function ColophonPage() {
  const [inspirationsData, setInspirationsData] = useState<InspirationsData | null>(null)
  const [updatesData, setUpdatesData] = useState<UpdatesData | null>(null)
  const [currentDate, setCurrentDate] = useState<string>("")
  const [isUpdatesExpanded, setIsUpdatesExpanded] = useState(false)
  const [selectedUpdate, setSelectedUpdate] = useState<Update | null>(null)

  useEffect(() => {
    // Format current date
    const now = new Date()
    const formattedDate = now.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    setCurrentDate(formattedDate)

    // Fetch inspirations data
    const fetchInspirations = async () => {
      try {
        const response = await fetch("/api/inspirations")
        if (!response.ok) {
          throw new Error("Failed to fetch inspirations")
        }
        const jsonData = await response.json()
        setInspirationsData(jsonData)
      } catch (error) {
        console.error("Error fetching inspirations:", error)
      }
    }

    // Fetch updates data
    const fetchUpdates = async () => {
      try {
        const response = await fetch("/api/updates")
        if (!response.ok) {
          throw new Error("Failed to fetch updates")
        }
        const jsonData = await response.json()
        setUpdatesData(jsonData)
      } catch (error) {
        console.error("Error fetching updates:", error)
      }
    }

    fetchInspirations()
    fetchUpdates()
  }, [])

  if (!inspirationsData || !updatesData) {
    return (
      <div className="relative min-h-screen bg-background text-foreground">
        <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24"></div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
        <PageHeader
          title={colophonPageData.title}
          subtitle={colophonPageData.subtitle}
          date={colophonPageData.date}
          preview={colophonPageData.preview}
          status={colophonPageData.status}
          confidence={colophonPageData.confidence}
          importance={colophonPageData.importance}
        />

        <div className="space-y-4">
          <section>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-t border-border">
              <h2 className="text-xl font-normal text-foreground">Typography</h2>
              <div className="md:col-span-2">
                <p className="text-foreground mb-4">
                  The site uses a carefully selected combination of fonts for different purposes:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-foreground">
                  <li>
                    <strong>Primary Sans-serif:</strong> Outfit (variable font, weights 100-900) for headings and UI elements
                  </li>
                  <li>
                    <strong>Primary Serif:</strong> Source Serif 4 for blog posts and long-form content
                  </li>
                  <li>
                    <strong>Monospace:</strong> Outfit Mono for code blocks and technical content
                  </li>
                  <li>
                    <strong>Special Purpose:</strong> EB Garamond for wiki content, with UnifrakturMaguntia for decorative drop caps
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-t border-border">
              <h2 className="text-xl font-normal text-foreground">Hosting & Infrastructure</h2>
              <div className="md:col-span-2">
                <p className="text-foreground mb-4">
                  The site is built with modern web technologies and hosted on reliable infrastructure:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-foreground">
                  <li>
                    <strong>Web Hosting:</strong> Hetzner for reliable and secure web hosting
                  </li>
                  <li>
                    <strong>Large File Storage:</strong> Hetzner for efficient handling of large media files
                  </li>
                  <li>
                    <strong>Framework:</strong> Next.js for server-side rendering and optimal performance
                  </li>
                  <li>
                    <strong>Analytics:</strong> Seline for privacy-focused, cookieless analytics
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-t border-border">
              <h2 className="text-xl font-normal text-foreground">Icons</h2>
              <div className="md:col-span-2">
                <p className="text-foreground">
                  Icons throughout the site are from{" "}
                  <AnimatedTag text="Lucide" href="https://lucide.dev" className="ml-1" />, chosen for their clean, consistent design and excellent dark mode support.
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-t border-border">
              <h2 className="text-xl font-normal text-foreground">Inspiration</h2>
              <div className="md:col-span-2">
                <p className="text-foreground mb-6">
                  I've gathered inspiration from various sources for different aspects of the site - styles, typography, layouts, and ideas. Here are some notable sites that have influenced this project:
                </p>
                <div className="flex flex-wrap gap-3">
                  {inspirationsData.inspirations.map((inspiration, index) => (
                    <AnimatedTag key={index} text={inspiration.name} href={inspiration.url} />
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-t border-border">
              <h2 className="text-xl font-normal text-foreground">Updates</h2>
              <div className="md:col-span-2">
                <button
                  onClick={() => setIsUpdatesExpanded(!isUpdatesExpanded)}
                  className="flex items-center justify-between w-full text-left mb-4 focus:outline-none"
                  aria-expanded={isUpdatesExpanded}
                >
                  <span className="text-foreground font-medium">Version History</span>
                  {isUpdatesExpanded ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isUpdatesExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="py-2 px-4 text-left font-medium text-foreground">Version</th>
                          <th className="py-2 px-4 text-left font-medium text-foreground">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {updatesData.updates.map((update, index) => (
                          <tr
                            key={index}
                            className="border-b border-border hover:bg-secondary/50 cursor-pointer transition-colors"
                            onClick={() => setSelectedUpdate(update)}
                          >
                            <td className="py-3 px-4 text-foreground">{update.version}</td>
                            <td className="py-3 px-4 text-muted-foreground">{update.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {selectedUpdate && (
          <UpdateModal
            isOpen={!!selectedUpdate}
            onClose={() => setSelectedUpdate(null)}
            version={selectedUpdate.version}
            date={selectedUpdate.date}
            description={selectedUpdate.description}
          />
        )}
      </div>
    </div>
  )
}


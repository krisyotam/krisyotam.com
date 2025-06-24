"use client"
import { format } from "date-fns"
import { ExternalLink } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"

// KaTeX for LaTeX rendering
import katex from "katex"
import "katex/dist/katex.min.css"

export type NuggetSource = "twitter" | "instagram" | "reddit" | "quora" | "mastodon" | "other"

export interface NuggetData {
  id: string
  title: string
  content: string
  date: string
  source: {
    type: NuggetSource
    url: string
  }
}

interface NuggetsProps {
  data: NuggetData[]
  className?: string
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
  },
}

// Function to process LaTeX in text
const processLatex = (text: string) => {
  // Find all LaTeX expressions between $$ and $$
  const parts = text.split(/(\$\$[^$]+\$\$)/g)

  return parts.map((part, index) => {
    if (part.startsWith("$$") && part.endsWith("$$")) {
      const latex = part.slice(2, -2)
      try {
        const html = katex.renderToString(latex, {
          throwOnError: false,
          output: "html",
          displayMode: false,
        })
        return <span key={index} dangerouslySetInnerHTML={{ __html: html }} />
      } catch (error) {
        return <span key={index}>{part}</span>
      }
    }
    return <span key={index}>{part}</span>
  })
}

// Function to count words in text
const countWords = (text: string) => {
  return text.trim().split(/\s+/).length
}

// Function to truncate text to a specific word count
const truncateToWordLimit = (text: string, limit: number) => {
  const words = text.trim().split(/\s+/)
  if (words.length <= limit) return text
  return words.slice(0, limit).join(" ") + "..."
}

export function Nugget({ nugget, className }: { nugget: NuggetData; className?: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const wordCount = countWords(nugget.content)
  const exceedsLimit = wordCount > 100

  return (
    <Card
      className={cn("nugget-card w-full border-0 shadow-none dark:bg-[#121212]", className)}
      style={{ all: "revert" }}
    >
      <div
        className="nugget-container flex flex-col md:flex-row md:items-start gap-4 border-b border-gray-200 dark:border-gray-800 pb-6"
        style={styles.container}
      >
        <div
          className="nugget-header md:w-1/4 flex flex-col"
        >
          <h3
            className="nugget-title text-base font-normal mb-1"
            style={{
              fontSize: "1rem",
              fontWeight: "normal",
              marginBottom: "0.25rem",
              color: "var(--foreground)",
            }}
          >
            {nugget.title}
          </h3>
          <div
            className="nugget-meta flex items-center gap-2 text-xs text-gray-500"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.75rem",
              color: "var(--muted-foreground)",
            }}
          >
            <time
              className="nugget-date"
              style={{
                fontFeatureSettings: "'tnum'",
              }}
            >
              {format(new Date(nugget.date), "MMM d, yyyy")}
            </time>
            <span
              className="nugget-separator"
              style={{
                color: "var(--muted-foreground)",
              }}
            >
              •
            </span>
            <Badge
              className="nugget-source-badge bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-[#1a1a1a] dark:text-gray-300 dark:hover:bg-[#252525] font-normal"
              style={{
                backgroundColor: "var(--muted)",
                color: "var(--muted-foreground)",
                fontWeight: "normal",
                fontSize: "0.75rem",
                padding: "0.125rem 0.5rem",
              }}
            >
              {nugget.source.type}
            </Badge>
          </div>
        </div>

        <div
          className="nugget-content md:w-3/4"
        >
          <div
            className="nugget-text prose prose-sm text-gray-800 mb-2"
            style={{
              fontSize: "0.875rem",
              lineHeight: "1.5",
              color: "var(--foreground)",
              marginBottom: "0.5rem",
              whiteSpace: "pre-wrap",
            }}
          >
            {processLatex(exceedsLimit ? truncateToWordLimit(nugget.content, 100) : nugget.content)}

            {exceedsLimit && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-blue-600 hover:text-blue-800 font-medium ml-1"
                style={{
                  color: "var(--primary)",
                  fontWeight: "500",
                  marginLeft: "0.25rem",
                  background: "none",
                  border: "none",
                  padding: "0",
                  cursor: "pointer",
                }}
              >
                See more
              </button>
            )}
          </div>
          <a
            href={nugget.source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="nugget-source-link flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              fontSize: "0.75rem",
              color: "var(--muted-foreground)",
              textDecoration: "none",
              transition: "color 0.2s ease-in-out",
            }}
          >
            Source{" "}
            <ExternalLink className="h-3 w-3" style={{ height: "0.75rem", width: "0.75rem" }} />
          </a>
        </div>
      </div>

      {/* Bento Box Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[450px] max-h-[80vh] p-0 rounded-xl overflow-hidden border-2 border-gray-100 dark:border-gray-800 shadow-lg dark:bg-[#121212]">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#1a1a1a]">
              <h3 className="text-lg font-medium">{nugget.title}</h3>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                <time>{format(new Date(nugget.date), "MMM d, yyyy")}</time>
                <span>•</span>
                <Badge variant="outline" className="text-xs py-0 dark:border-gray-700 dark:text-gray-300">
                  {nugget.source.type}
                </Badge>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="p-4 overflow-y-auto" style={{ maxHeight: "50vh" }}>
              <div className="prose prose-sm">{processLatex(nugget.content)}</div>
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#1a1a1a] flex justify-end">
              <a
                href={nugget.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800"
              >
                View Source <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export function Nuggets({ data, className }: NuggetsProps) {
  // Sort nuggets by date in descending order (newest first)
  const sortedData = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div
      className={cn("nuggets-container flex flex-col", className)}
      style={styles.container}
    >
      {sortedData.map((nugget) => (
        <Nugget key={nugget.id} nugget={nugget} />
      ))}
    </div>
  )
}


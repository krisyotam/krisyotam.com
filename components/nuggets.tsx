"use client"
import { format } from "date-fns"
import { ExternalLink } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

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

export function Nugget({ nugget, className }: { nugget: NuggetData; className?: string }) {
  return (
    <Card className={cn("nugget-card w-full border-0 shadow-none", className)} style={{ all: "revert" }}>
      <div
        className="nugget-container flex flex-col md:flex-row md:items-start gap-4 border-b border-gray-200 pb-6"
        style={{
          display: "flex !important",
          flexDirection: "column !important",
          gap: "1rem !important",
          borderBottom: "1px solid #e5e7eb !important",
          paddingBottom: "1.5rem !important",
          marginBottom: "1.5rem !important",
        }}
      >
        <div
          className="nugget-header md:w-1/4 flex flex-col"
          style={{
            display: "flex !important",
            flexDirection: "column !important",
            width: "100% !important",
            "@media (min-width: 768px)": {
              width: "25% !important",
            },
          }}
        >
          <h3
            className="nugget-title text-base font-normal mb-1"
            style={{
              fontSize: "1rem !important",
              fontWeight: "normal !important",
              marginBottom: "0.25rem !important",
              color: "var(--foreground) !important",
            }}
          >
            {nugget.title}
          </h3>
          <div
            className="nugget-meta flex items-center gap-2 text-xs text-gray-500"
            style={{
              display: "flex !important",
              alignItems: "center !important",
              gap: "0.5rem !important",
              fontSize: "0.75rem !important",
              color: "var(--muted-foreground) !important",
            }}
          >
            <time
              className="nugget-date"
              style={{
                fontFeatureSettings: "'tnum' !important",
              }}
            >
              {format(new Date(nugget.date), "MMM d, yyyy")}
            </time>
            <span
              className="nugget-separator"
              style={{
                color: "var(--muted-foreground) !important",
              }}
            >
              •
            </span>
            <Badge
              className="nugget-source-badge bg-gray-100 text-gray-800 hover:bg-gray-200 font-normal"
              style={{
                backgroundColor: "var(--muted) !important",
                color: "var(--muted-foreground) !important",
                fontWeight: "normal !important",
                fontSize: "0.75rem !important",
                padding: "0.125rem 0.5rem !important",
              }}
            >
              {nugget.source.type}
            </Badge>
          </div>
        </div>

        <div
          className="nugget-content md:w-3/4"
          style={{
            width: "100% !important",
            "@media (min-width: 768px)": {
              width: "75% !important",
            },
          }}
        >
          <div
            className="nugget-text prose prose-sm text-gray-800 mb-2"
            style={{
              fontSize: "0.875rem !important",
              lineHeight: "1.5 !important",
              color: "var(--foreground) !important",
              marginBottom: "0.5rem !important",
              whiteSpace: "pre-wrap !important",
            }}
          >
            {processLatex(nugget.content)}
          </div>
          <a
            href={nugget.source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="nugget-source-link flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800"
            style={{
              display: "flex !important",
              alignItems: "center !important",
              gap: "0.25rem !important",
              fontSize: "0.75rem !important",
              color: "var(--muted-foreground) !important",
              textDecoration: "none !important",
              transition: "color 0.2s ease-in-out !important",
            }}
          >
            Source{" "}
            <ExternalLink className="h-3 w-3" style={{ height: "0.75rem !important", width: "0.75rem !important" }} />
          </a>
        </div>
      </div>
    </Card>
  )
}

export function Nuggets({ data, className }: NuggetsProps) {
  return (
    <div
      className={cn("nuggets-container flex flex-col", className)}
      style={{
        display: "flex !important",
        flexDirection: "column !important",
        gap: "0 !important",
      }}
    >
      {data.map((nugget) => (
        <Nugget key={nugget.id} nugget={nugget} />
      ))}
    </div>
  )
}


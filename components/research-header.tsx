import { formatDate } from "@/utils/date-formatter"
import Link from "next/link"
import { ArrowLeft, Info } from "lucide-react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface ResearchHeaderProps {
  title: string
  subject?: string
  dateStarted: string
  authors?: string[]
  tags?: string[]
  category?: string
  abstract?: string
  status?: "active" | "completed" | "pending" | "abandoned"
  confidence?:
    | "impossible"
    | "remote"
    | "highly unlikely"
    | "unlikely"
    | "possible"
    | "likely"
    | "highly likely"
    | "certain"
    | string
  importance?: number
}

const confidenceExplanation = `The confidence tag expresses how well-supported the research is, or how likely its overall ideas are right. This uses a scale from "impossible" to "certain", based on the Kesselman List of Estimative Words:

1. "certain"
2. "highly likely"
3. "likely"
4. "possible"
5. "unlikely"
6. "highly unlikely"
7. "remote"
8. "impossible"

Even ideas that seem unlikely may be worth exploring if their potential impact is significant enough.`

const importanceExplanation = `The importance rating distinguishes between trivial topics and those which might change your life. Using a scale from 0-10, content is ranked based on its potential impact on:

- the reader
- the intended audience
- the world at large

For example, topics about fundamental research or transformative technologies would rank 9-10, while personal reflections or minor experiments might rank 0-1.`

const statusExplanation = `The status indicator reflects the current state of the research:

- Abandoned: Work that has been discontinued
- Pending: Research that is planned but not yet started
- Active: Ongoing research currently being conducted
- Completed: Finished research with finalized results

This helps readers understand the maturity and completeness of the content.`

function getConfidenceColor(confidence: string) {
  const colors = {
    certain: "text-foreground",
    "highly likely": "text-foreground/90",
    likely: "text-foreground/80",
    possible: "text-foreground/70",
    unlikely: "text-foreground/60",
    "highly unlikely": "text-foreground/50",
    remote: "text-foreground/40",
    impossible: "text-foreground/30",
  }
  return colors[confidence as keyof typeof colors] || "text-foreground/70"
}

function getStatusColor(status: string) {
  const colors = {
    completed: "text-foreground",
    active: "text-foreground/90",
    pending: "text-foreground/60",
    abandoned: "text-foreground/40",
  }
  return colors[status as keyof typeof colors] || "text-foreground/70"
}

function getImportanceColor(importance: number) {
  if (importance >= 8) return "text-foreground"
  if (importance >= 6) return "text-foreground/90"
  if (importance >= 4) return "text-foreground/70"
  if (importance >= 2) return "text-foreground/60"
  return "text-foreground/40"
}

export function ResearchHeader({
  title,
  subject,
  dateStarted,
  authors = [],
  tags = [],
  category,
  abstract,
  status = "active",
  confidence = "possible",
  importance = 5,
}: ResearchHeaderProps) {
  return (
    <header className="mb-4 relative">
      {/* Back to research link */}
      <Link
        href="/research"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 group font-serif italic"
      >
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Return to Research
      </Link>

      {/* Academic bento container */}
      <div className="border border-border bg-card text-card-foreground p-6 rounded-sm shadow-sm">
        {/* Responsive title that gets smaller based on length */}
        <h1
          className={cn(
            "font-serif font-medium tracking-tight mb-2 text-center uppercase",
            title.length > 50 ? "text-2xl" : title.length > 30 ? "text-3xl" : "text-4xl",
          )}
        >
          {title}
        </h1>

        {/* Metadata section with academic styling */}
        <div className="flex flex-wrap justify-center items-center gap-x-3 text-sm font-mono mb-6">
          {/* Status */}
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className={cn("flex items-center gap-1 cursor-help", getStatusColor(status))}>
                <Info className="h-3 w-3" />
                <span className="font-medium">status: {status}</span>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 text-sm bg-card text-card-foreground border-border p-4 font-serif">
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Status Indicator</h4>
                <p className="text-muted-foreground whitespace-pre-wrap">{statusExplanation}</p>
              </div>
            </HoverCardContent>
          </HoverCard>

          <span className="text-muted-foreground">·</span>

          {/* Confidence */}
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className={cn("flex items-center gap-1 cursor-help", getConfidenceColor(confidence))}>
                <Info className="h-3 w-3" />
                <span className="font-medium">certainty: {confidence}</span>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 text-sm bg-card text-card-foreground border-border p-4 font-serif">
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Confidence Rating</h4>
                <p className="text-muted-foreground whitespace-pre-wrap">{confidenceExplanation}</p>
              </div>
            </HoverCardContent>
          </HoverCard>

          <span className="text-muted-foreground">·</span>

          {/* Importance */}
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className={cn("flex items-center gap-1 cursor-help", getImportanceColor(importance))}>
                <Info className="h-3 w-3" />
                <span className="font-medium">importance: {importance}/10</span>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 text-sm bg-card text-card-foreground border-border p-4 font-serif">
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Importance Rating</h4>
                <p className="text-muted-foreground whitespace-pre-wrap">{importanceExplanation}</p>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>

        {/* Tags with academic styling */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="bg-secondary/40 text-xs font-mono hover:bg-secondary transition-colors rounded-none"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Category link with academic styling */}
        {category && (
          <div className="text-center mt-4">
            <Link
              href={`/research/${encodeURIComponent(category.toLowerCase().replace(/\s+/g, "-"))}`}
              className="text-sm font-serif italic text-muted-foreground hover:text-foreground transition-colors"
            >
              Filed under: {category}
            </Link>
          </div>
        )}
      </div>

      {/* Abstract preview if available */}
      {abstract && (
        <div className="mt-6 p-6 border border-border bg-muted/20">
          <h2 className="text-sm font-medium mb-2">Abstract</h2>
          <p className="text-sm text-muted-foreground">{abstract.length > 300 ? `${abstract.substring(0, 300)}...` : abstract}</p>
        </div>
      )}

      {/* Decorative bottom border */}
      <div className="mt-6 border-b border-border"></div>
    </header>
  )
}
import { formatDate } from "@/utils/date-formatter"
import Link from "next/link"
import { ArrowLeft, Info } from "lucide-react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { cn } from "@/lib/utils"

interface VerseHeaderProps {
  title: string
  subtitle?: string
  date: string
  tags?: string[]
  type: string
  collection?: string
  preview?: string
  status?: "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished"
  confidence?:
    | "impossible"
    | "remote"
    | "highly unlikely"
    | "unlikely"
    | "possible"
    | "likely"
    | "highly likely"
    | "certain"
  importance?: number
}

const confidenceExplanation = `The confidence tag expresses how well the poem achieves its intended effect or how well its ideas are communicated. This uses a scale from "impossible" to "certain", based on the Kesselman List of Estimative Words:

1. "certain"
2. "highly likely"
3. "likely"
4. "possible"
5. "unlikely"
6. "highly unlikely"
7. "remote"
8. "impossible"

This helps gauge the author's assessment of the poem's success in achieving its artistic goals.`

const importanceExplanation = `The importance rating distinguishes between personal poems and those with broader significance. Using a scale from 0-10, poetry is ranked based on its potential impact on:

- the reader
- the intended audience
- the literary world at large

For example, poems addressing universal themes or innovative in form would rank 9-10, while personal reflections or simple experiments might rank 0-1.`

const statusExplanation = `The status indicator reflects the current state of the poem:

- Abandoned: Work that has been discontinued
- Notes: Initial draft with rough ideas
- Draft: Early structured version with core imagery
- In Progress: Well-developed work actively being refined
- Finished: Completed work with no planned major changes

This helps readers understand the maturity and completeness of the poem.`

function getConfidenceColor(confidence: string) {
  const colors = {
    certain: "text-gray-900 dark:text-gray-100",
    "highly likely": "text-gray-800 dark:text-gray-200",
    likely: "text-gray-700 dark:text-gray-300",
    possible: "text-gray-600 dark:text-gray-400",
    unlikely: "text-gray-500 dark:text-gray-500",
    "highly unlikely": "text-gray-400 dark:text-gray-600",
    remote: "text-gray-300 dark:text-gray-700",
    impossible: "text-gray-200 dark:text-gray-800",
  }
  return colors[confidence as keyof typeof colors] || "text-gray-600 dark:text-gray-400"
}

function getStatusColor(status: string) {
  const colors = {
    Finished: "text-gray-900 dark:text-gray-100",
    "In Progress": "text-gray-800 dark:text-gray-200",
    Draft: "text-gray-700 dark:text-gray-300",
    Notes: "text-gray-500 dark:text-gray-500",
    Abandoned: "text-gray-400 dark:text-gray-600",
  }
  return colors[status as keyof typeof colors] || "text-gray-600 dark:text-gray-400"
}

function getImportanceColor(importance: number) {
  if (importance >= 8) return "text-gray-900 dark:text-gray-100"
  if (importance >= 6) return "text-gray-800 dark:text-gray-200"
  if (importance >= 4) return "text-gray-600 dark:text-gray-400"
  if (importance >= 2) return "text-gray-500 dark:text-gray-500"
  return "text-gray-400 dark:text-gray-600"
}

export function VerseHeader({
  title,
  subtitle,
  date,
  tags,
  type,
  collection,
  preview,
  status = "Draft",
  confidence = "possible",
  importance = 5,
}: VerseHeaderProps) {
  // Convert type to a slug format for the back link
  const typeSlug = String(type).toLowerCase().replace(/\s+/g, "-")
  
  return (
    <header className="mb-4 relative">
      {/* Back to verse with type filter */}
      <Link
        href={`/verse?type=${typeSlug}`}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 group font-serif italic"
      >
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to {type} Poems
      </Link>

      {/* Academic bento container */}
      <div className="border border-border bg-card text-card-foreground p-6 rounded-sm shadow-sm">
        {/* Responsive title that gets smaller based on length */}
        <h1
          className={cn(
            "font-serif font-medium tracking-tight mb-2 text-center uppercase",
            title.length > 60 ? "text-xl" : 
            title.length > 45 ? "text-2xl" : 
            title.length > 30 ? "text-3xl" : 
            "text-4xl",
            "break-words hyphens-auto"
          )}
        >
          {title}
        </h1>

        {/* Preview/description text */}
        {preview && (
          <p className="text-center font-serif text-sm text-muted-foreground italic mb-6 max-w-2xl mx-auto">
            {preview}
          </p>
        )}

        {/* Date above other metadata */}
        <div className="text-center mb-4">
          <time
            dateTime={date}
            className="font-mono text-sm text-muted-foreground"
          >
            {formatDate(date)}
          </time>
        </div>

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

        {/* Tags with academic styling - clickable links, max 3 */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {tags.slice(0, 3).map((tag) => (
              <Link
                key={tag}
                href={`/tag/${encodeURIComponent(tag.toLowerCase().replace(/\s+/g, "-"))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-border bg-secondary/40 px-2 py-1 text-xs font-mono hover:bg-secondary transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        {/* Type link replacing Category */}
        <div className="text-center mt-4">
          <Link
            href={`/verse?type=${typeSlug}`}
            className="text-sm font-serif italic text-muted-foreground hover:text-foreground transition-colors"
          >
            Filed under: {type}
          </Link>
        </div>
        
        {/* Collection info if available */}
        {collection && (
          <div className="text-center mt-2">
            <span className="text-sm font-serif italic text-muted-foreground">
              From collection: {collection}
            </span>
          </div>
        )}
      </div>

      {/* Decorative bottom border */}
      <div className="mt-6 border-b border-border"></div>
    </header>
  )
} 
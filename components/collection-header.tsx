import { formatDateWithValidation } from "@/utils/date-formatter"
import { ArrowLeft, Info } from "lucide-react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface CollectionHeaderProps {
  title: string
  subtitle?: string
  date?: string
  preview?: string
  status?: "abandoned" | "notes" | "draft" | "in progress" | "finished" | "maintained" | "complete"
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
  backLink?: string
  className?: string
  backText?: string
}

const confidenceExplanation = `The confidence tag expresses how well-supported the collection is, or how authoritative its curation. This uses a scale from "impossible" to "certain", based on the Kesselman List of Estimative Words:

1. "certain"
2. "highly likely"
3. "likely"
4. "possible"
5. "unlikely"
6. "highly unlikely"
7. "remote"
8. "impossible"

Higher confidence indicates a more thoroughly researched and professionally curated collection.`

const importanceExplanation = `The importance rating distinguishes between supplementary collections and those which are essential. Using a scale from 0-10, collections are ranked based on their impact on:

- literary significance
- scholarly importance
- cultural relevance

For example, canonical collections would rank 9-10, while more niche or specialized collections might rank 3-4.`

const statusExplanation = `The status indicator reflects the current state of the collection:

- Abandoned: Collection that has been discontinued
- Notes: Initial gathering of related works
- Draft: Early curation still being refined
- In Progress: Active collection with regular additions
- Maintained: Stable collection with occasional updates
- Complete: Definitive collection with no planned additions

This helps readers understand the maturity and ongoing development of the collection.`

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
  // Convert status to lowercase and match with standard format keys
  const statusKey = status.toLowerCase().replace(/ /g, " ")
  
  const colors = {
    complete: "text-gray-900 dark:text-gray-100",
    finished: "text-gray-900 dark:text-gray-100",
    maintained: "text-gray-800 dark:text-gray-200",
    "in progress": "text-gray-800 dark:text-gray-200",
    draft: "text-gray-700 dark:text-gray-300",
    notes: "text-gray-500 dark:text-gray-500",
    abandoned: "text-gray-400 dark:text-gray-600",
  }
  return colors[statusKey as keyof typeof colors] || "text-gray-600 dark:text-gray-400"
}

function getImportanceColor(importance: number) {
  if (importance >= 8) return "text-gray-900 dark:text-gray-100"
  if (importance >= 6) return "text-gray-800 dark:text-gray-200"
  if (importance >= 4) return "text-gray-600 dark:text-gray-400"
  if (importance >= 2) return "text-gray-500 dark:text-gray-500"
  return "text-gray-400 dark:text-gray-600"
}

export function CollectionHeader({
  title,
  subtitle,
  date = new Date().toISOString(),
  preview,
  status = "maintained",
  confidence = "likely",
  importance = 7,
  backLink = "/library",
  backText = "Library",
  className,
}: CollectionHeaderProps) {
  // Parse the date string to a Date object
  const dateObj = date ? new Date(date) : new Date()

  return (
    <header className={cn("mb-4 relative", className)}>
      {/* Back button with customizable text and link */}
      <Link
        href={backLink}
        data-no-preview="true"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 group font-serif italic"
      >
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Return to {backText}
      </Link>

      {/* Academic bento container */}
      <div className="border border-border bg-card text-card-foreground p-6 rounded-sm shadow-sm">
        {/* Title with academic styling */}
        <h1 className="text-4xl font-serif font-medium tracking-tight mb-2 text-center uppercase">
          {title.split(" ").join(" ")}
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
            dateTime={typeof date === "string" ? date : undefined}
            className="font-mono text-sm text-muted-foreground"
          >
            {formatDateWithValidation(dateObj)}
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

        {/* Decorative bottom border */}
        <div className="mt-4 border-b border-border"></div>
      </div>

      {/* Decorative bottom border */}
      <div className="mt-6 border-b border-border"></div>
    </header>
  )
}


import { formatDate } from "@/utils/date-formatter"
import { Info } from "lucide-react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface DirectoryPageHeaderProps {
  title: string
  subtitle?: string
  date: string
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
  className?: string
  path: string
}

const confidenceExplanation = `The confidence tag expresses how well-supported the essay is, or how likely its overall ideas are right. This uses a scale from "impossible" to "certain", based on the Kesselman List of Estimative Words:

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

const statusExplanation = `The status indicator reflects the current state of the work:

- Abandoned: Work that has been discontinued
- Notes: Initial collections of thoughts and references
- Draft: Early structured version with a central thesis
- In Progress: Well-developed work actively being refined
- Finished: Completed work with no planned major changes

This helps readers understand the maturity and completeness of the content.`

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

export function DirectoryPageHeader({
  title,
  subtitle,
  date,
  preview,
  status = "Draft",
  confidence = "possible",
  importance = 5,
  className,
  path,
}: DirectoryPageHeaderProps) {
  return (
    <Link href={path} className="block">
      <header className={cn("mb-6", className)}>
        {/* Academic bento container */}
        <div className="border border-border bg-card text-card-foreground p-4 rounded-sm shadow-sm">
          {/* Title with academic styling */}
          <h1 className="text-2xl font-serif font-medium tracking-tight mb-2 text-center uppercase">
            {title.split(" ").join("-")}
          </h1>

          {/* Subtitle */}
          {subtitle && <h2 className="text-sm font-serif text-muted-foreground mb-3 text-center">{subtitle}</h2>}

          {/* Preview/description text */}
          {preview && (
            <p className="text-center font-serif text-xs text-muted-foreground italic mb-4 max-w-2xl mx-auto">
              {preview}
            </p>
          )}

          {/* Date above other metadata */}
          <div className="text-center mb-3">
            <time
              dateTime={typeof date === "string" ? date : undefined}
              className="font-mono text-xs text-muted-foreground"
            >
              {typeof date === "string" ? formatDate(new Date(date)) : date}
            </time>
          </div>

          {/* Metadata section with academic styling */}
          <div className="flex flex-wrap justify-center items-center gap-x-2 text-xs font-mono mb-2">
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
        </div>

        {/* Decorative bottom border */}
        <div className="mt-4 border-b border-border"></div>
      </header>
    </Link>
  )
}

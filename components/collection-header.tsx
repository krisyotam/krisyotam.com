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

function getStatusStyle(status: string) {
  switch (status?.toLowerCase()) {
    case "abandoned":
      return "font-semibold"
    case "notes":
      return "font-medium"
    case "draft":
      return "font-medium"
    case "in progress":
      return "font-medium"
    case "finished":
      return "font-semibold"
    case "maintained":
      return "font-semibold"
    case "complete":
      return "font-bold"
    default:
      return "text-muted-foreground"
  }
}

function getConfidenceStyle(confidence: string) {
  switch (confidence?.toLowerCase()) {
    case "impossible":
    case "remote":
      return "font-light"
    case "highly unlikely":
    case "unlikely":
      return "font-light"
    case "possible":
      return "font-normal"
    case "likely":
      return "font-medium"
    case "highly likely":
      return "font-semibold"
    case "certain":
      return "font-bold"
    default:
      return "text-muted-foreground"
  }
}

function getImportanceStyle(importance: number) {
  if (importance >= 9) return "font-bold"
  if (importance >= 7) return "font-semibold"
  if (importance >= 5) return "font-medium"
  if (importance >= 3) return "font-normal"
  return "font-light"
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
  className,
}: CollectionHeaderProps) {
  // Parse the date string to a Date object
  const dateObj = date ? new Date(date) : new Date()

  return (
    <header className={cn("mb-8", className)}>
      {/* Back link */}
      <div className="mb-4">
        <Link
          href={backLink}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Library
        </Link>
      </div>

      {/* Academic bento container */}
      <div className="border border-border bg-card text-card-foreground p-6 rounded-sm shadow-sm">
        {/* Title with academic styling */}
        <h1 className="text-3xl font-serif font-medium tracking-tight mb-2">{title}</h1>

        {/* Subtitle if provided */}
        {subtitle && <p className="text-xl font-serif text-muted-foreground mb-4 italic">{subtitle}</p>}

        {/* Metadata row */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-sm text-muted-foreground mb-4">
          {/* Date */}
          <div className="font-mono">{formatDateWithValidation(dateObj)}</div>

          {/* Separator dot */}
          <div className="mx-1">·</div>

          {/* Status with hover explanation */}
          <div className="flex items-center">
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="flex items-center cursor-help">
                  <span className="text-muted-foreground">status:</span>
                  <span className={cn("ml-1", getStatusStyle(status))}>{status || "maintained"}</span>
                  <Info className="ml-1 h-3 w-3 text-muted-foreground" />
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 text-sm bg-card text-card-foreground border-border p-4 font-serif">
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Status Indicator</h4>
                  <p className="text-muted-foreground whitespace-pre-wrap">{statusExplanation}</p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>

          {/* Separator dot */}
          <div className="mx-1">·</div>

          {/* Confidence with hover explanation */}
          <div className="flex items-center">
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="flex items-center cursor-help">
                  <span className="text-muted-foreground">certainty:</span>
                  <span className={cn("ml-1", getConfidenceStyle(confidence))}>{confidence || "likely"}</span>
                  <Info className="ml-1 h-3 w-3 text-muted-foreground" />
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 text-sm bg-card text-card-foreground border-border p-4 font-serif">
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Confidence Rating</h4>
                  <p className="text-muted-foreground whitespace-pre-wrap">{confidenceExplanation}</p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>

          {/* Separator dot */}
          <div className="mx-1">·</div>

          {/* Importance with hover explanation */}
          <div className="flex items-center">
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="flex items-center cursor-help">
                  <span className="text-muted-foreground">importance:</span>
                  <span className={cn("ml-1", getImportanceStyle(importance || 7))}>{importance || 7}/10</span>
                  <Info className="ml-1 h-3 w-3 text-muted-foreground" />
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

        {/* Preview text */}
        {preview && <p className="text-muted-foreground font-serif leading-relaxed">{preview}</p>}
      </div>

      {/* Decorative bottom border */}
      <div className="mt-4 border-b border-border"></div>
    </header>
  )
}


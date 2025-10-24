import { formatDate } from "@/utils/date-formatter"
import Link from "next/link"
import { ArrowLeft, Info } from "lucide-react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { cn } from "@/lib/utils"

interface PromptsHeaderProps {
  title: string
  subtitle?: string
  date: string
  tags?: string[]
  category?: string
  preview?: string
  className?: string
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
  model?: string
  author?: string
  license?: string
  backText?: string
  backHref?: string
}

const confidenceExplanation = `The confidence tag expresses how well-tested the prompt is, or how likely it is to produce desired results. This uses a scale from "impossible" to "certain", based on the Kesselman List of Estimative Words:

1. "certain"
2. "highly likely"
3. "likely"
4. "possible"
5. "unlikely"
6. "highly unlikely"
7. "remote"
8. "impossible"

Even prompts that seem experimental may be worth exploring if their potential utility is significant enough.`

const importanceExplanation = `The importance rating distinguishes between utility prompts and those which might be critical to workflows. Using a scale from 0-10, prompts are ranked based on their potential impact on:

- content quality
- task efficiency
- creative output
- automation value

For example, research or writing prompts would rank 9-10, while simple utility prompts might rank 0-1.`

const statusExplanation = `The status indicator reflects the current state of the prompt:

- Abandoned: Prompt that has been discontinued
- Notes: Initial prototype or proof of concept
- Draft: Early working version with basic functionality
- In Progress: Well-developed prompt actively being refined
- Finished: Completed prompt with no planned major changes

This helps users understand the maturity and reliability of the prompt.`

const modelExplanation = `AI models and their strengths:

• GPT-4/4.5 (OpenAI): Excellent reasoning, creative writing, and complex analysis. Best for research and academic work.
• GPT-4o (OpenAI): Optimized for efficiency while maintaining high quality. Good balance of speed and capability.
• o1/o1-mini (OpenAI): Advanced reasoning models, excellent for complex problem-solving and mathematical tasks.
• Claude 3.5 Sonnet (Anthropic): Strong at following instructions, coding, and nuanced conversations. Very helpful and harmless.
• Claude 3 Opus (Anthropic): Most capable Claude model for complex reasoning and creative tasks.
• Gemini Pro/Ultra (Google): Strong multimodal capabilities, good at code and technical content.
• GPT-3.5 Turbo: Fast and cost-effective for simpler tasks and rapid iterations.`

const licenseExplanation = `Common content licenses and their implications:

• CC-0 (Public Domain): No restrictions, completely free to use and modify.
• CC BY: Attribution required, otherwise free to use and modify.
• CC BY-SA: Attribution required, derivative works must use same license.
• MIT: Permissive license allowing commercial use with attribution.
• GPL-3.0: Copyleft license requiring derivative works to be open source.
• Proprietary: All rights reserved, usage restricted by author.

Choose based on your intended use and distribution requirements.`

const authorExplanation = `The author field indicates who created or maintains the prompt. This helps with:

- Attribution and credit
- Finding related work by the same author
- Understanding the expertise behind the prompt design
- Knowing who to contact for questions or improvements

Prompts may have multiple contributors or be maintained by organizations.`

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

export function PromptsHeader({
  title,
  subtitle,
  date,
  tags,
  category,
  preview,
  className,
  status = "Draft",
  confidence = "possible",
  importance = 5,
  model,
  author,
  license,
  backText,
  backHref,
}: PromptsHeaderProps) {
  return (
    <header className={cn("mb-4 relative", className)}>
      {/* Back link */}
      <Link
        href={backHref || "/prompts"}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 group font-serif italic"
      >
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        {backText ? `Return to ${backText}` : "Return to Prompts"}
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

        {/* First metadata row: status, certainty, importance */}
        <div className="flex flex-wrap justify-center items-center gap-x-3 text-sm font-mono mb-4">
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
        </div>        {/* Second metadata row: model, author, license */}
        <div className="flex flex-wrap justify-center items-center gap-x-3 text-sm font-mono mb-6">
          {/* Model */}
          {model && (
            <>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div className="flex items-center gap-1 cursor-help text-muted-foreground">
                    <Info className="h-3 w-3" />
                    <span className="font-medium">model: {model}</span>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 text-sm bg-card text-card-foreground border-border p-4 font-serif">
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">AI Models</h4>
                    <p className="text-muted-foreground whitespace-pre-wrap">{modelExplanation}</p>
                  </div>
                </HoverCardContent>
              </HoverCard>
              <span className="text-muted-foreground">·</span>
            </>
          )}

          {/* Author */}
          {author && (
            <>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div className="flex items-center gap-1 cursor-help text-muted-foreground">
                    <Info className="h-3 w-3" />
                    <span className="font-medium">author: {author}</span>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 text-sm bg-card text-card-foreground border-border p-4 font-serif">
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">Prompt Author</h4>
                    <p className="text-muted-foreground whitespace-pre-wrap">{authorExplanation}</p>
                  </div>
                </HoverCardContent>
              </HoverCard>
              <span className="text-muted-foreground">·</span>
            </>
          )}

          {/* License */}
          {license && (
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="flex items-center gap-1 cursor-help text-muted-foreground">
                  <Info className="h-3 w-3" />
                  <span className="font-medium">license: {license}</span>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 text-sm bg-card text-card-foreground border-border p-4 font-serif">
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Content Licenses</h4>
                  <p className="text-muted-foreground whitespace-pre-wrap">{licenseExplanation}</p>
                </div>
              </HoverCardContent>
            </HoverCard>
          )}
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

        {/* Category link with academic styling */}
        {category && (
          <div className="text-center mt-4">
            <Link
              href={`/category/${encodeURIComponent(category.toLowerCase().replace(/\s+/g, "-"))}`}
              className="text-sm font-serif italic text-muted-foreground hover:text-foreground transition-colors"
            >
              Filed under: {category}
            </Link>
          </div>
        )}
      </div>

      {/* Decorative bottom border */}
      <div className="mt-6 border-b border-border"></div>
    </header>
  )
}

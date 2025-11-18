import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatDate } from "@/utils/date-formatter"

interface QuestionCardProps {
  id: number
  question: string
  category: string
  tags: string[]
  source: string
  dateAdded: string
  status: string
  state: "active" | "hidden"
  notes: string
  answer?: string
}

export function QuestionCard({
  id,
  question,
  category,
  tags,
  source,
  dateAdded,
  status,
  state,
  notes,
  answer = "",
}: QuestionCardProps) {
  // Determine color by status: open (red), answered/solved (green), dropped (gray), fallback (blue)
  const normalized = (status || "").toLowerCase();
  let statusColor = "bg-blue-500/10 text-blue-500";
  if (normalized === "open") {
    statusColor = "bg-red-500/10 text-red-500";
  } else if (normalized === "answered" || normalized === "solved") {
    statusColor = "bg-green-500/10 text-green-500";
  } else if (normalized === "dropped" || normalized === "abandoned") {
    statusColor = "bg-gray-500/10 text-gray-500";
  }

  return (
    <div className="border rounded-none p-6 space-y-4 bg-card hover:bg-card/80 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-medium leading-relaxed mb-2">
            {question}
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            {notes}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge variant="outline" className={statusColor}>
            {status}
          </Badge>
          {answer && answer.trim() !== "" ? (
            // Use client-side navigation for internal links, external links open in new tab
            answer.startsWith("/") ? (
              <Button asChild size="xs" variant="default" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-200 dark:border-green-800">
                <Link href={answer}>Answer</Link>
              </Button>
            ) : (
              <Button asChild size="xs" variant="default" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-200 dark:border-green-800">
                <a href={answer} target="_blank" rel="noopener noreferrer">Answer</a>
              </Button>
            )
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Source: {source}</span>
        <span>Added: {formatDate(dateAdded)}</span>
      </div>
    </div>
  )
}

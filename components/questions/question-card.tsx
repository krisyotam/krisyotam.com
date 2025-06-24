import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/utils/date-formatter"

interface QuestionCardProps {
  id: number
  question: string
  category: string
  tags: string[]
  source: string
  dateAdded: string
  status: "open" | "solved"
  state: "active" | "hidden"
  notes: string
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
}: QuestionCardProps) {
  const statusColor = status === "solved" ? "bg-green-500/10 text-green-500" : "bg-blue-500/10 text-blue-500"

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
        <Badge variant="outline" className={statusColor}>
          {status}
        </Badge>
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

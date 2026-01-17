interface QuoteCardProps {
  text: string
  author?: string
  source?: string
  dateFirstSeen?: string
  tags?: string[]
  notes?: string
}

import { Badge } from "@/components/ui/badge"

export function QuoteCard({ text, author, source, dateFirstSeen, tags, notes }: QuoteCardProps) {
  return (
    <div className="relative bg-white border border-border text-foreground shadow-sm h-full flex flex-col overflow-hidden dark:bg-card dark:text-card-foreground">
      <div className="p-4 flex flex-col h-full">
        <div className="text-2xl text-muted-foreground mb-2">“</div>
        <p className="text-sm font-medium mb-3 flex-grow leading-snug">{text}</p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div>
            {author && <div className="font-medium text-[13px] text-foreground">{author}</div>}
            {source && <div className="italic">{source}</div>}
          </div>
          <div className="text-right">
            {dateFirstSeen && <div className="text-[11px]">{dateFirstSeen}</div>}
          </div>
        </div>

        {tags && tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.slice(0, 3).map((t) => (
              <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
            ))}
          </div>
        )}

        {notes && <p className="mt-3 text-xs text-muted-foreground">{notes}</p>}
      </div>
    </div>
  )
}


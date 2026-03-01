"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"

interface QuoteCardProps {
  text: string
  author?: string
  source?: string
  dateFirstSeen?: string
  tags?: string[]
  notes?: string
}

const COLLAPSE_THRESHOLD = 280

export function QuoteCard({ text, author, source, dateFirstSeen, tags, notes }: QuoteCardProps) {
  const isLong = text.length > COLLAPSE_THRESHOLD
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="relative bg-white border border-border text-foreground shadow-sm h-full flex flex-col overflow-hidden dark:bg-card dark:text-card-foreground">
      <div className="p-4 flex flex-col h-full">
        <div className="text-2xl text-muted-foreground mb-2">&ldquo;</div>
        <div
          className={`text-sm font-medium mb-3 flex-grow leading-relaxed whitespace-pre-wrap ${isLong && !expanded ? "line-clamp-6" : ""}`}
        >
          {text}
        </div>
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-muted-foreground hover:text-foreground mb-3 text-left"
          >
            {expanded ? "Show less" : "Show more"}
          </button>
        )}
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

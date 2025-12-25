import React from "react"
import { Research as ResearchType } from "@/types/research"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"

// Grid item styled to be more aesthetic and match archive's no-rounded look
export default function ResearchGrid({
  items,
  onItemClick,
  onBentoClick,
}: {
  items: ResearchType[]
  onItemClick: (item: ResearchType) => void
  onBentoClick: (link: string, e: React.MouseEvent) => void
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {items.map((item, idx) => (
        <article
          key={`${item.name}-${idx}`}
          className="border border-border p-4 hover:bg-secondary/50 transition-colors cursor-pointer bg-card"
          onClick={() => onItemClick(item)}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold leading-snug">{item.name}</h3>
              <div className="text-xs text-muted-foreground mt-1">{item.status}</div>
            </div>

            {/* small bento with Are.na logo */}
            {item.are_na_link && (
              <div className="flex-shrink-0">
                <button
                  onClick={(e) => { e.stopPropagation(); onBentoClick(item.are_na_link || '', e) }}
                  className="w-9 h-9 border border-border flex items-center justify-center bg-background"
                  aria-label="Open on Are.na"
                >
                  <img src="/icons/arena.svg" alt="Are.na" className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          <p className="text-sm text-muted-foreground mt-3 line-clamp-4">{item.description}</p>

          {item.imgs && item.imgs.length > 0 && (
            <div className="mt-4">
              <img src={item.imgs[0].img_url} alt={item.imgs[0].title} className="w-full h-28 object-cover border border-border" />
            </div>
          )}
        </article>
      ))}
    </div>
  )
}

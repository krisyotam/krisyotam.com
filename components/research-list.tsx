import React from "react"
import { Research as ResearchType } from "@/types/research"

export default function ResearchList({
  items,
  onItemClick,
  onBentoClick,
}: {
  items: ResearchType[]
  onItemClick: (item: ResearchType) => void
  onBentoClick: (link: string, e: React.MouseEvent) => void
}) {
  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div
          key={`${item.name}-${idx}`}
          className="border border-border bg-card hover:bg-secondary/40 transition-colors cursor-pointer"
          onClick={() => onItemClick(item)}
        >
          <div className="px-4 pt-4 pb-3">
            <h3 className="font-semibold text-base leading-tight">
              {item.name}
            </h3>

            <div className="text-[11px] uppercase tracking-wide text-muted-foreground mt-1">
              {item.status} / {new Date(item.start_date).getFullYear()}
            </div>

            <p className="text-sm text-muted-foreground leading-snug mt-3 line-clamp-3">
              {item.description}
            </p>
          </div>

          <div className="border-t border-border px-4 py-2 flex items-center justify-between relative">

            <span className="text-xs text-muted-foreground">
              {item.status} • {new Date(item.start_date).getFullYear()}
            </span>

            {item.are_na_link && (
              <div className="flex items-center h-full pl-4">
                <div className="h-full w-px bg-border mr-4" />

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onBentoClick(item.are_na_link || "", e)
                  }}
                  aria-label="Open on Are.na"
                  className="flex items-center opacity-80 hover:opacity-100"
                >
                  <img
                    src="/icons/arena.svg"
                    alt="Are.na"
                    className="h-5 w-5"
                  />
                </button>
              </div>
            )}
          </div>

        </div>
      ))}
    </div>
  )
}

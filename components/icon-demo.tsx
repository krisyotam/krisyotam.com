"use client"

/**
 * IconDemo
 * Fully style-isolated demo component.
 * Does NOT inherit typography, spacing, or layout styles from parent pages.
 */
import React, { useMemo, useState } from "react"
import iconsData from "@/data/icons/icons.json"

interface IconDemoProps {
  pageSize?: number
}

export default function IconDemo({ pageSize = 36 }: IconDemoProps) {
  const icons = useMemo(() => (iconsData as any)?.icons || [], [])
  const total = icons.length
  const pages = Math.max(1, Math.ceil(total / pageSize))

  const [page, setPage] = useState(1)

  const start = (page - 1) * pageSize
  const pageItems = icons.slice(start, start + pageSize)
  const cols = 3

  return (
    <div className="not-prose isolate" style={{ display: "block", fontFamily: "inherit" }}>
      {/* outer border forced to solid using inline style so page-level overrides can't change it */}
      <div style={{ border: "1px solid hsl(var(--border))" }}>
        <div className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-${cols} gap-0`}>
          {pageItems.map((it: any, i: number) => {
            const isFirstCol = i % cols === 0
            const isFirstRow = i < cols

            // force tile borders with inline styles so horizontal & vertical lines are solid
            const tileStyle: React.CSSProperties = {
              borderLeft: isFirstCol ? undefined : "1px solid hsl(var(--border))",
              borderTop: isFirstRow ? undefined : "1px solid hsl(var(--border))",
              boxSizing: "border-box",
            }

            return (
              <div
                key={it.slug}
                role="figure"
                aria-label={it.slug}
                style={tileStyle}
                className={`w-full h-16 flex items-center justify-center text-sm bg-card text-foreground p-2 rounded-none`}
              >
                {/* show the actual icon file centered and larger for demo */}
                <img
                  src={`/icons/${it.svg}`}
                  alt={it.slug}
                  className="link-icon-img"
                  style={{ width: 28, height: 28, display: "block" }}
                />
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 mt-3">
        <div className="text-sm text-muted-foreground">
          {`Showing ${Math.min(start + 1, total)}–${Math.min(start + pageSize, total)} of ${total}`}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-2 py-1 border rounded-none text-sm"
          >
            Prev
          </button>

          <div className="text-sm">
            {page} / {pages}
          </div>

          <button
            onClick={() => setPage(p => Math.min(pages, p + 1))}
            disabled={page === pages}
            className="px-2 py-1 border rounded-none text-sm"
          >
            Next
          </button>
        </div>
      </div>

      <div className="mt-2 text-xs text-muted-foreground">
        this is self updating
      </div>
    </div>
  )
}

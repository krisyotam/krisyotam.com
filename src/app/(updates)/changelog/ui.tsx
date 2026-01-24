"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { CustomSelect, type SelectOption } from "@/components/ui/custom-select"

export type Entry = {
  id: string
  date: {
    day: string
    weekday: string
    month: string
    year: string
  }
  text: string
  kind?: string
}

function formatDateLabel(d: Entry["date"]) {
  return `${d.month} ${d.day}, ${d.year}`
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={[
        "h-4 w-4 transition-transform duration-200",
        open ? "rotate-180" : "rotate-0",
      ].join(" ")}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

function EntryCard({
  entry,
  open,
  onToggle,
}: {
  entry: Entry
  open: boolean
  onToggle: () => void
}) {
  return (
    <article className="border border-border bg-card text-card-foreground hover:bg-muted/40 transition-colors rounded-none overflow-hidden">
      {/* 3 columns, 2 rows:
          Row 1: DAY | TEXT | ARROW
          Divider (bottom of row 1) must run across all columns
          Row 2: WEEKDAY | META | (empty) */}
      <div className="grid grid-cols-[72px_1fr_44px] grid-rows-[auto_auto]">
        {/* ROW 1: LEFT (DAY) */}
        <div className="flex items-center justify-center border-r border-border border-b border-border font-serif text-2xl leading-none">
          {entry.date.day}
        </div>

        {/* ROW 1: MIDDLE (TEXT) */}
        <div className="min-w-0 px-6 py-4 border-b border-border overflow-hidden">
          <p
            className={[
              "font-serif text-base leading-relaxed",
              "min-w-0 overflow-hidden",
              open ? "whitespace-pre-wrap break-words" : "truncate",
            ].join(" ")}
          >
            {entry.text}
          </p>
        </div>

        {/* ROW 1: RIGHT (ARROW BUTTON) */}
        <div className="border-l border-border border-b border-border">
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            className="h-full w-full grid place-items-center hover:bg-secondary/50 transition-colors rounded-none"
            title={open ? "Collapse" : "Expand"}
          >
            <Chevron open={open} />
          </button>
        </div>

        {/* ROW 2: LEFT (WEEKDAY) */}
        <div className="flex items-center justify-center border-r border-border py-1 text-xs uppercase tracking-wide text-muted-foreground">
          {entry.date.weekday}
        </div>

        {/* ROW 2: MIDDLE (META UNDER THE LINE) */}
        <div className="min-w-0 px-6 py-2 overflow-hidden">
          <div className="text-xs text-muted-foreground flex items-center gap-2 min-w-0 overflow-hidden">
            <time className="shrink-0" dateTime={entry.id}>
              {formatDateLabel(entry.date)}
            </time>
            {entry.kind && (
              <>
                <span className="shrink-0">·</span>
                <span className="uppercase tracking-wide truncate min-w-0">
                  {entry.kind}
                </span>
              </>
            )}
          </div>
        </div>

        {/* ROW 2: RIGHT (EMPTY CELL TO KEEP THE VERTICAL LINE) */}
        <div className="border-l border-border" />
      </div>
    </article>
  )
}

async function fetchFeed(
  feed: "content" | "infra",
  q?: string
): Promise<Entry[]> {
  const url = new URL("/api/data", window.location.origin)
  url.searchParams.set("type", "changelog")
  url.searchParams.set("feed", feed)
  if (q?.trim()) url.searchParams.set("q", q)

  const res = await fetch(url.toString(), { cache: "no-store" })
  if (!res.ok) throw new Error("Failed to load changelog")
  const json = await res.json()
  return json.items as Entry[]
}

export default function ChangelogClient({
  initialFeed = "content",
}: {
  initialFeed?: "content" | "infra"
}) {
  const [feed, setFeed] = useState<"content" | "infra">(initialFeed)
  const [q, setQ] = useState("")
  const [items, setItems] = useState<Entry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    fetchFeed(feed, q)
      .then((data) => {
        if (!controller.signal.aborted) setItems(data)
      })
      .catch((e) => {
        if (!controller.signal.aborted) setError(e.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [feed, q])

  const filtered = useMemo(() => items, [items])

  function keyFor(entry: Entry) {
    return `${feed}:${entry.id}`
  }

  function toggle(entry: Entry) {
    const k = keyFor(entry)
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(k)) next.delete(k)
      else next.add(k)
      return next
    })
  }

  return (
    <div className="space-y-6">
      {/* SEARCH + FILTERS */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <label htmlFor="feed-filter" className="text-sm text-muted-foreground">
            Filter by feed:
          </label>
          <CustomSelect
            id="feed-filter"
            value={feed}
            onValueChange={(v) => setFeed((v as "content" | "infra") || "content")}
            options={
              [
                { value: "content", label: "Content" },
                { value: "infra", label: "Infra" },
              ] as SelectOption[]
            }
            className="text-sm min-w-[140px]"
          />
        </div>

        <div className="relative flex-1 min-w-0">
          <input
            type="text"
            placeholder="Search updates..."
            className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
            onChange={(e) => setQ(e.target.value)}
            value={q}
          />
        </div>
      </div>

      {/* RESULTS */}
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">No updates found.</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((e) => {
            const k = keyFor(e)
            const open = expanded.has(k)
            return (
              <EntryCard
                key={k}
                entry={e}
                open={open}
                onToggle={() => toggle(e)}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

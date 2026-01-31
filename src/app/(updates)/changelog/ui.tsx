"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { PageHeader } from "@/components/core"
import { Button } from "@/components/ui/button"
import { Search, Code, Pen } from "lucide-react"
import { cn } from "@/lib/utils"

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

type FeedType = "unified" | "content" | "infra"

const feedDescriptions: Record<FeedType, string> = {
  unified: "Monthly chronological list of all recent major writings, changes, and additions to krisyotam.com",
  content: "Updates to articles, essays, blog posts, and other written content on the site",
  infra: "Technical updates, bug fixes, and infrastructure changes to the site",
}

// Approximate character count that would cause truncation (based on typical card width)
const TRUNCATION_THRESHOLD = 80

function formatDateLabel(d: Entry["date"]) {
  return `${d.month} ${d.day}, ${d.year}`
}

function Chevron({ open, canExpand }: { open: boolean; canExpand: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn(
        "h-4 w-4 transition-transform duration-200",
        canExpand && open ? "rotate-180" : "rotate-0"
      )}
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
  // Check if the text is long enough to be truncated
  const canExpand = entry.text.length > TRUNCATION_THRESHOLD

  return (
    <article
      className="border border-border bg-card text-card-foreground hover:bg-muted/40 transition-colors rounded-none overflow-hidden"
      style={{ fontFamily: "var(--font-serif), 'Source Serif 4', Georgia, serif" }}
    >
      <div className="grid grid-cols-[72px_1fr_44px] grid-rows-[auto_auto]">
        {/* ROW 1: LEFT (DAY) */}
        <div className="flex items-center justify-center border-r border-border border-b border-border text-2xl leading-none py-4">
          {entry.date.day}
        </div>

        {/* ROW 1: MIDDLE (TEXT) */}
        <div className="min-w-0 px-6 py-4 border-b border-border overflow-hidden">
          <p
            className={cn(
              "text-base leading-relaxed",
              "min-w-0 overflow-hidden",
              canExpand && open ? "whitespace-pre-wrap break-words" : "truncate"
            )}
          >
            {entry.text}
          </p>
        </div>

        {/* ROW 1: RIGHT (ARROW BUTTON) */}
        <div className="border-l border-border border-b border-border">
          <button
            type="button"
            onClick={canExpand ? onToggle : undefined}
            aria-expanded={canExpand ? open : undefined}
            className={cn(
              "h-full w-full grid place-items-center transition-colors rounded-none",
              canExpand ? "hover:bg-secondary/50 cursor-pointer" : "cursor-default opacity-40"
            )}
            title={canExpand ? (open ? "Collapse" : "Expand") : undefined}
            disabled={!canExpand}
          >
            <Chevron open={open} canExpand={canExpand} />
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

async function fetchUnified(q?: string): Promise<Entry[]> {
  const [content, infra] = await Promise.all([
    fetchFeed("content", q),
    fetchFeed("infra", q),
  ])

  // Merge and sort by date (most recent first)
  const merged = [...content, ...infra].sort((a, b) => {
    const dateA = new Date(`${a.date.month} ${a.date.day}, ${a.date.year}`)
    const dateB = new Date(`${b.date.month} ${b.date.day}, ${b.date.year}`)
    return dateB.getTime() - dateA.getTime()
  })

  return merged
}

export default function ChangelogClient() {
  const [feed, setFeed] = useState<FeedType>("unified")
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

    const fetchData = feed === "unified"
      ? fetchUnified(q)
      : fetchFeed(feed, q)

    fetchData
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
    <>
      {/* Header */}
      <PageHeader
        title="Changelog"
        subtitle="Site Updates & Changes"
        start_date="2025-01-01"
        end_date={new Date().toISOString().split("T")[0]}
        preview={feedDescriptions[feed]}
        status="Finished"
        confidence="certain"
        importance={7}
        backText="Home"
        backHref="/"
      />

      {/* SEARCH + FILTER BUTTONS */}
      <div className="my-4 flex items-center gap-4 flex-wrap">
        {/* Search bar */}
        <div className="flex-1 min-w-[240px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search updates..."
            className="w-full h-9 pl-10 pr-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
            onChange={(e) => setQ(e.target.value)}
            value={q}
            aria-label="Search updates"
          />
        </div>

        {/* Feed filter buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "rounded-none",
              feed === "content" && "bg-secondary/50"
            )}
            onClick={() => setFeed("content")}
            aria-label="Content updates"
            aria-pressed={feed === "content"}
            title="Content updates"
          >
            <Pen className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "rounded-none",
              feed === "infra" && "bg-secondary/50"
            )}
            onClick={() => setFeed("infra")}
            aria-label="Infrastructure updates"
            aria-pressed={feed === "infra"}
            title="Infrastructure updates"
          >
            <Code className="h-4 w-4" />
          </Button>
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
    </>
  )
}

"use client"

import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

/**
 * SubscribeClient
 * Client-only UI for the /subscribe page. Adds a search bar matching the
 * style and behaviour of the music page search: icon on the left, full-
 * width input, and `rounded-none` appearance so it visually integrates
 * with the site's bento UI.
 *
 * We keep the component small and focused: it filters the local embed
 * list by an internal `query` (matching internal slugs) and renders the
 * filtered embeds (so authors can hide/show specific widgets via search).
 */

export default function SubscribeClient({ }: {}) {
  const [query, setQuery] = useState("")

  const sources = useMemo(() => [
    { id: "krisyotam", src: "https://krisyotam.substack.com/embed" },
    { id: "towardavantgarde", src: "https://towardavantgarde.substack.com/embed" },
    { id: "varianotanda", src: "https://varianotanda.substack.com/embed" },
  ], [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return sources
    return sources.filter(s => s.id.includes(q) || s.src.includes(q))
  }, [sources, query])

  return (
    <div className="w-full">
  <div className="mb-2 flex items-center gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input placeholder="Search subscriptions..." className="w-full pl-10 rounded-none" value={query} onChange={(e: any) => setQuery(e.target.value)} />
        </div>
      </div>

      {/* Render embeds matching the query */}
      <div className="grid grid-cols-1 gap-6">
        {filtered.map((s) => (
          <div key={s.id} className="border border-border bg-card p-6 rounded-none flex justify-center items-center">
            <iframe
              src={s.src}
              width={480}
              height={320}
              className="mx-auto block"
              style={{ border: "1px solid #EEE", background: "white" }}
              frameBorder={0}
              scrolling="no"
              title={s.id}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

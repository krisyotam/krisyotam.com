/* ============================================================================
 * page.tsx — Plan 9 / Acme TUI content browser
 * Kris Yotam | Created: 2026-02-28 | Updated: 2026-02-28
 * @type layout
 * @path src/app/tui/page.tsx
 * @data content
 * ========================================================================== */

import { getActiveContentByType } from "@/lib/data"
import { TUI } from "@/components/core/tui"

const CONTENT_TYPES = [
  "blog", "diary", "essays", "fiction", "news",
  "notes", "ocs", "papers", "progymnasmata", "reviews", "verse"
] as const

export const metadata = {
  title: "TUI — krisyotam.com",
  description: "Plan 9 / Acme-inspired terminal interface for browsing site content",
}

export default function TuiPage() {
  const tree: Record<string, { slug: string; title: string; date: string; preview: string }[]> = {}

  for (const type of CONTENT_TYPES) {
    tree[type] = getActiveContentByType(type).map((p) => ({
      slug: p.slug,
      title: p.title,
      date: p.start_date,
      preview: p.preview,
    }))
  }

  return <TUI tree={tree} />
}

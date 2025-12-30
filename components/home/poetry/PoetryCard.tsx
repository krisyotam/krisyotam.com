/**
 * Poetry Card Component
 * @author Kris Yotam
 * @date 2025-12-29
 * @description Card view for displaying poetry/verse from verse.json
 */

import { Card } from "@/components/ui/card"
import Link from "next/link"
import type { Poem } from "@/utils/poems"

interface PoetryCardProps {
  poem: Poem
}

export function PoetryCard({ poem }: PoetryCardProps) {
  // Generate the correct URL pattern: /verse/[type]/[slug]
  const typeSlug = (poem.type ?? "").toLowerCase().replace(/\s+/g, "-");
  const poetryPath = `/verse/${encodeURIComponent(typeSlug)}/${encodeURIComponent(poem.slug ?? "")}`;

  // Use start_date and format it
  const dateToUse = poem.start_date || poem.dateCreated || "";
  const year = dateToUse ? new Date(dateToUse).getFullYear() : "";
  const formattedDate = dateToUse ? new Date(dateToUse).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }) : "";

  return (
    <Card className="p-4 bg-card border border-border hover:bg-secondary/50 transition-colors">
      <Link href={poetryPath} className="no-underline">
        <h3 className="font-medium mb-1">{poem.title}</h3>
        <div className="flex justify-between items-center mb-2">
          <p className="text-xs text-muted-foreground">
            {poem.type}{year && ` • ${year}`}
          </p>
          {formattedDate && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
              {formattedDate}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {poem.description || (poem.collection ? `Collection: ${poem.collection}` : "Verse")}
        </p>
      </Link>
    </Card>
  )
}

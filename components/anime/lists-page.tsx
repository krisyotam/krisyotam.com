"use client"

import { useState } from "react"
import { ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import animangaLists from "@/data/animanga-lists.json"

export function ListsPage() {
  const [filter, setFilter] = useState<"all" | "anime" | "manga">("all")

  const filteredLists = animangaLists.lists.filter(list => 
    filter === "all" ? true : list.type === filter
  )

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded-md text-sm ${
            filter === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("anime")}
          className={`px-3 py-1 rounded-md text-sm ${
            filter === "anime"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          Anime
        </button>
        <button
          onClick={() => setFilter("manga")}
          className={`px-3 py-1 rounded-md text-sm ${
            filter === "manga"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          Manga
        </button>
      </div>

      {/* Lists Table */}
      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Link</th>
            </tr>
          </thead>
          <tbody>
            {filteredLists.map((list, index) => (
              <tr
                key={index}
                className="border-b transition-colors hover:bg-muted/50"
              >
                <td className="p-4 align-middle">{list.name}</td>
                <td className="p-4 align-middle">
                  <Badge variant={list.type === "anime" ? "default" : "secondary"}>
                    {list.type}
                  </Badge>
                </td>
                <td className="p-4 align-middle text-muted-foreground">
                  {new Date(list.date).toLocaleDateString()}
                </td>
                <td className="p-4 align-middle">
                  <a
                    href={list.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    View List
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 
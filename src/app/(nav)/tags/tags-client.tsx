"use client"

import { useState } from "react"
import Link from "next/link"
import { PageHeader } from "@/components/core"
import { Navigation } from "@/components/content/navigation"

interface Tag {
  title: string
  slug: string
  count: number
}

interface TagsClientProps {
  tags: Tag[]
}

export function TagsClient({ tags }: TagsClientProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTags = tags.filter((tag) => {
    return tag.title.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
        <PageHeader
          title="Tags"
          subtitle="Content organized by tag across all types"
          start_date="2025-01-01"
          end_date={new Date().toISOString().split('T')[0]}
          preview="Browse posts by tag to explore related ideas across the site."
          status="Finished"
          confidence="certain"
          importance={7}
          className="mb-3"
        />

        <Navigation
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search tags..."
          viewMode="list"
          onViewModeChange={() => {}}
          showViewToggle={false}
          className="mb-3"
        />

        <main>
          {filteredTags.length === 0 ? (
            <p className="text-muted-foreground">No tags found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border overflow-hidden shadow-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50 text-foreground">
                    <th className="py-2 text-left font-medium px-3">Tag</th>
                    <th className="py-2 text-right font-medium px-3"># of Posts</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTags.map((tag, index) => (
                    <tr
                      key={tag.slug}
                      className={`border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${
                        index % 2 === 0 ? "bg-transparent" : "bg-muted/5"
                      }`}
                    >
                      <td className="py-2 px-3">
                        <Link href={`/tag/${tag.slug}`} className="text-foreground">
                          {tag.title}
                        </Link>
                      </td>
                      <td className="py-2 px-3 text-right text-muted-foreground">
                        {tag.count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { ContentTable } from "@/components/content"
import { PageHeader, PageDescription } from "@/components/core"
import { CONTENT_TYPES } from "../config"

interface Tag {
  slug: string
  title: string
  preview: string
  date: string
  status: string
  confidence: string
  importance: number
}

interface Props {
  type: string
  tags: Tag[]
}

export default function ContentTagsClient({ type, tags }: Props) {
  const config = CONTENT_TYPES[type]
  const [searchQuery, setSearchQuery] = useState("")
  if (!config) return null

  return (
    <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-8">
      <PageHeader
        title={`"${config.label}" Tags`}
        date={new Date().toISOString()}
        preview={`Browse all ${config.label.toLowerCase()} tags.`}
        status={"Finished" as any}
        confidence={"certain" as any}
        importance={8}
        backText={config.label}
        backHref={`/${type}`}
      />
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search tags..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
        />
      </div>
      <ContentTable
        items={tags
          .filter(t => {
            const q = searchQuery.toLowerCase()
            return !q || t.title.toLowerCase().includes(q) || t.preview.toLowerCase().includes(q)
          })
          .sort((a, b) => b.importance - a.importance)
          .map(t => ({
            title: t.title,
            start_date: t.date,
            slug: t.slug,
            tags: [],
            category: t.preview,
          }))}
        basePath={`/${type}/tag`}
        showCategoryLinks={false}
        formatCategoryNames={false}
        emptyMessage="No tags found."
      />
      <PageDescription
        title="About Tags"
        description={`Browse all tags used in ${config.label.toLowerCase()}. Click a tag to see all related posts.`}
      />
    </div>
  )
}

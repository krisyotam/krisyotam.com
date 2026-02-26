"use client"

import { useState } from "react"
import { ContentTable } from "@/components/content"
import { PageHeader, PageDescription } from "@/components/core"
import { CONTENT_TYPES } from "../../config"

interface ContentPost {
  title: string
  start_date: string
  end_date?: string
  slug: string
  tags: string[]
  category: string
  status?: string
  confidence?: string
  importance?: number
}

interface TagData {
  title: string
  preview: string
  importance: number
  backText: string
  backHref: string
}

interface Props {
  type: string
  posts: ContentPost[]
  tagData: TagData
}

export default function ContentTaggedClient({ type, posts, tagData }: Props) {
  const config = CONTENT_TYPES[type]
  const [searchQuery, setSearchQuery] = useState("")
  if (!config) return null

  const filtered = posts.filter(p => {
    const q = searchQuery.toLowerCase()
    return !q || p.title.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q)) || p.category.toLowerCase().includes(q)
  })

  return (
    <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-8">
      <PageHeader
        title={tagData.title}
        start_date={new Date().toISOString()}
        preview={tagData.preview}
        status={"Active" as any}
        confidence={"certain" as any}
        importance={tagData.importance}
        backText={tagData.backText}
        backHref={tagData.backHref}
      />
      <div className="mb-4">
        <input
          type="text"
          placeholder={`Search ${config.label.toLowerCase()}...`}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
        />
      </div>
      <div className="mb-6 text-sm text-muted-foreground">
        {filtered.length} {filtered.length === 1 ? 'post' : 'posts'} tagged with &quot;{tagData.title}&quot;
      </div>
      <ContentTable
        items={filtered}
        basePath={`/${type}`}
        showCategoryLinks={true}
        formatCategoryNames={config.formatCategoryNames}
        emptyMessage="No posts found."
      />
      <PageDescription
        title={`About "${tagData.title}" Tag`}
        description={`Posts tagged with "${tagData.title}" in ${config.label.toLowerCase()}.`}
      />
    </div>
  )
}

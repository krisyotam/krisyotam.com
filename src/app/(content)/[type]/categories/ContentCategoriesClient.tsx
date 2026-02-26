"use client"

import { useState } from "react"
import { ContentTable } from "@/components/content"
import { PageHeader, PageDescription } from "@/components/core"
import { CONTENT_TYPES } from "../config"

interface Category {
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
  categories: Category[]
}

export default function ContentCategoriesClient({ type, categories }: Props) {
  const config = CONTENT_TYPES[type]
  const [searchQuery, setSearchQuery] = useState("")
  if (!config) return null

  return (
    <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-8">
      <PageHeader
        title={`"${config.label}" Categories`}
        date={new Date().toISOString()}
        preview={`Browse all ${config.label.toLowerCase()} categories.`}
        status={"Finished" as any}
        confidence={"certain" as any}
        importance={8}
        backText={config.label}
        backHref={`/${type}`}
      />
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search categories..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
        />
      </div>
      <ContentTable
        items={categories
          .filter(c => {
            const q = searchQuery.toLowerCase()
            return !q || c.title.toLowerCase().includes(q) || c.preview.toLowerCase().includes(q)
          })
          .sort((a, b) => b.importance - a.importance)
          .map(c => ({
            title: c.title,
            start_date: c.date,
            slug: c.slug,
            tags: [],
            category: c.preview,
          }))}
        basePath={`/${type}`}
        showCategoryLinks={false}
        formatCategoryNames={false}
        emptyMessage="No categories found."
      />
      <PageDescription
        title="About Categories"
        description={`Browse all categories for ${config.label.toLowerCase()}. Click on any category to see posts within it.`}
      />
    </div>
  )
}

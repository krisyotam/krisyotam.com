"use client"

import { useState } from "react"
import { PageHeader, PageDescription } from "@/components/core"
import { Navigation, ContentTable } from "@/components/content"
import { SelectOption } from "@/components/ui/custom-select"
import { useRouter } from "next/navigation"
import { CONTENT_TYPES } from "./config"

interface ContentPost {
  title: string
  subtitle?: string
  preview?: string
  start_date: string
  end_date?: string
  slug: string
  tags: string[]
  category: string
  status?: string
  confidence?: string
  importance?: number
  cover_image?: string
  state?: string
  views?: number
}

interface CategoryData {
  slug: string
  title: string
  preview?: string | null
  date?: string
  status?: string
  confidence?: string
  importance?: number
}

interface Props {
  type: string
  posts: ContentPost[]
  categories?: CategoryData[]
  initialCategory?: string
}

function slugifyCategory(c: string) {
  return c.toLowerCase().replace(/\s+/g, "-")
}

function formatName(c: string) {
  return c.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

export default function ContentClientPage({ type, posts, categories = [], initialCategory = "all" }: Props) {
  const config = CONTENT_TYPES[type]
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [viewMode, setViewMode] = useState<"grid" | "list" | "directory">(config?.defaultView || "list")
  const router = useRouter()

  if (!config) return null

  const categoryOptions: SelectOption[] = ["all", ...new Set(posts.map(p => p.category))]
    .sort()
    .map(c => ({
      value: c,
      label: c === "all" ? "All Categories" : (config.formatCategoryNames ? formatName(c) : c)
    }))

  const headerData = (() => {
    if (initialCategory === "all" || !initialCategory) {
      return {
        title: config.label,
        start_date: "2025-01-01",
        end_date: new Date().toISOString().split('T')[0],
        preview: config.description,
        status: "In Progress" as const,
        confidence: "likely" as const,
        importance: 6,
      }
    }
    const catSlug = slugifyCategory(initialCategory)
    const catData = categories.find(c => c.slug === catSlug)
    if (catData) {
      return {
        title: catData.title,
        start_date: catData.date || "2025-01-01",
        end_date: catData.date || new Date().toISOString().split('T')[0],
        preview: catData.preview || "",
        status: (catData.status || "In Progress") as any,
        confidence: (catData.confidence || "likely") as any,
        importance: catData.importance,
      }
    }
    return {
      title: config.label,
      start_date: "2025-01-01",
      end_date: new Date().toISOString().split('T')[0],
      preview: config.description,
      status: "In Progress" as const,
      confidence: "likely" as const,
      importance: 6,
    }
  })()

  const handleCategoryChange = (c: string) => {
    setActiveCategory(c)
    router.push(c === "all" ? `/${type}` : `/${type}/${slugifyCategory(c)}`)
  }

  const filtered = posts.filter(p => {
    const q = searchQuery.toLowerCase()
    const matchesSearch = !q || p.title.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q)) || p.category.toLowerCase().includes(q)
    const matchesCat = activeCategory === "all" || p.category === activeCategory
    return matchesSearch && matchesCat
  }).sort((a, b) => {
    const dA = a.end_date || a.start_date
    const dB = b.end_date || b.start_date
    return new Date(dB).getTime() - new Date(dA).getTime()
  })

  const GridView = () => (
    <div className={`grid grid-cols-1 md:grid-cols-2 ${config.gridCols === 3 ? 'lg:grid-cols-3' : ''} gap-6`}>
      {filtered.map(p => (
        <div
          key={p.slug}
          className="border border-border bg-card hover:bg-secondary/50 transition-colors cursor-pointer"
          onClick={() => router.push(`/${p.slug}`)}
        >
          <div
            style={{ aspectRatio: config.gridAspect }}
            className="bg-muted/30 border-b border-border flex items-center justify-center overflow-hidden"
          >
            {p.cover_image ? (
              <img src={p.cover_image} alt={p.title} className="w-full h-full object-cover" />
            ) : (
              <div className="text-muted-foreground text-xs text-center p-4">{p.title}</div>
            )}
          </div>
          <div className="p-3">
            <h3 className="font-medium text-xs mb-1 line-clamp-2">{p.title}</h3>
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
              {config.formatCategoryNames ? formatName(p.category) : p.category}
            </p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{new Date(p.end_date || p.start_date).getFullYear()}</span>
              <span>{(p.views ?? 0).toLocaleString()} views</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-8">
      <PageHeader {...headerData} />
      <Navigation
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder={`Search ${config.label.toLowerCase()}...`}
        showCategoryFilter={true}
        categoryOptions={categoryOptions}
        selectedCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showViewToggle={config.showViewToggle}
      />
      {viewMode === "list" ? (
        <ContentTable
          items={filtered}
          basePath={`/${type}`}
          showCategoryLinks={true}
          formatCategoryNames={config.formatCategoryNames}
          emptyMessage={`No ${config.label.toLowerCase()} found.`}
        />
      ) : (
        <GridView />
      )}
      <PageDescription title={`About ${config.label}`} description={config.description} />
    </div>
  )
}

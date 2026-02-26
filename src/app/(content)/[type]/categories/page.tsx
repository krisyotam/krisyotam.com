export const dynamic = 'force-static'
export const revalidate = false

import { notFound } from "next/navigation"
import { getActiveContentByType, getCategoriesByContentType } from "@/lib/data"
import ContentCategoriesClient from "./ContentCategoriesClient"
import { CONTENT_TYPES, VALID_TYPES } from "../config"
import type { Metadata } from "next"

interface Props { params: Promise<{ type: string }> }

export async function generateStaticParams() {
  return VALID_TYPES.map(type => ({ type }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params
  const config = CONTENT_TYPES[type]
  if (!config) return { title: "Not Found" }
  return {
    title: `${config.label} Categories`,
    description: `Browse all ${config.label.toLowerCase()} categories.`,
  }
}

export default async function ContentCategoriesPage({ params }: Props) {
  const { type } = await params
  const config = CONTENT_TYPES[type]
  if (!config) notFound()

  const posts = getActiveContentByType(type)
  const allCategories = getCategoriesByContentType(type)
  const existingSlugs = new Set(posts.map(p => p.category?.toLowerCase().replace(/\s+/g, "-")))
  const categories = allCategories
    .filter(c => existingSlugs.has(c.slug))
    .map(c => ({
      slug: c.slug,
      title: c.title,
      preview: c.preview || `${config.label} in the ${c.title} category.`,
      date: c.date || new Date().toISOString().split('T')[0],
      status: c.status || "Active",
      confidence: c.confidence || "certain",
      importance: c.importance || 5,
    }))
    .sort((a, b) => b.importance - a.importance)

  return <ContentCategoriesClient type={type} categories={categories} />
}

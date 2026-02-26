export const dynamic = 'force-static'
export const revalidate = false

import { notFound } from "next/navigation"
import ContentClientPage from "./ContentClientPage"
import { getActiveContentByType, getCategoriesByContentType } from "@/lib/data"
import { getViewCounts } from "@/lib/analytics-db"
import { CONTENT_TYPES, VALID_TYPES } from "./config"
import { staticMetadata } from "@/lib/staticMetadata"
import type { Metadata } from "next"

interface PageProps { params: Promise<{ type: string }> }

export async function generateStaticParams() {
  return VALID_TYPES.map(type => ({ type }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { type } = await params
  return staticMetadata[type] || { title: type }
}

export default async function ContentIndexPage({ params }: PageProps) {
  const { type } = await params
  if (!CONTENT_TYPES[type]) notFound()

  const rawPosts = getActiveContentByType(type)
  const categories = getCategoriesByContentType(type)

  const slugs = rawPosts.map(post => {
    const categorySlug = post.category.toLowerCase().replace(/\s+/g, "-")
    return `${type}/${categorySlug}/${post.slug}`
  })
  const viewCounts = await getViewCounts(slugs)

  const posts = rawPosts
    .map(post => {
      const categorySlug = post.category.toLowerCase().replace(/\s+/g, "-")
      const viewSlug = `${type}/${categorySlug}/${post.slug}`
      return {
        ...post,
        importance: typeof post.importance === 'string' ? parseInt(post.importance as string, 10) : post.importance,
        views: viewCounts[viewSlug] ?? 0
      }
    })
    .sort((a, b) => {
      const aDate = a.end_date || a.start_date
      const bDate = b.end_date || b.start_date
      return new Date(bDate).getTime() - new Date(aDate).getTime()
    })

  return <ContentClientPage type={type} posts={posts} categories={categories} />
}

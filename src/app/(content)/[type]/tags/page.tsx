export const dynamic = 'force-static'
export const dynamicParams = false
export const revalidate = false

import { notFound } from "next/navigation"
import { getActiveContentByType, getTagsByContentType } from "@/lib/data"
import ContentTagsClient from "./ContentTagsClient"
import { CONTENT_TYPES, VALID_TYPES } from "../config"
import type { Metadata } from "next"

interface Props { params: Promise<{ type: string }> }

function titleToSlug(t: string) {
  return t.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
}

export async function generateStaticParams() {
  return VALID_TYPES.map(type => ({ type }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params
  const config = CONTENT_TYPES[type]
  if (!config) return { title: "Not Found" }
  return {
    title: `${config.label} Tags`,
    description: `Browse all ${config.label.toLowerCase()} tags.`,
  }
}

export default async function ContentTagsPage({ params }: Props) {
  const { type } = await params
  const config = CONTENT_TYPES[type]
  if (!config) notFound()

  const posts = getActiveContentByType(type)
  const dbTags = getTagsByContentType(type)
  const allTagsSet = new Set<string>()
  posts.forEach(p => {
    if (p.tags && Array.isArray(p.tags)) p.tags.forEach(t => allTagsSet.add(t))
  })

  const tags = Array.from(allTagsSet).map(tagTitle => {
    const slug = titleToSlug(tagTitle)
    const dbTag = dbTags.find(t => t.slug === slug)
    return dbTag
      ? {
          slug: dbTag.slug,
          title: dbTag.title,
          preview: dbTag.preview || `Posts tagged with ${dbTag.title.toLowerCase()}.`,
          date: new Date().toISOString(),
          status: "Active",
          confidence: "certain",
          importance: dbTag.importance,
        }
      : {
          slug,
          title: tagTitle,
          preview: `Posts tagged with ${tagTitle.toLowerCase()}.`,
          date: new Date().toISOString(),
          status: "Active",
          confidence: "certain",
          importance: 5,
        }
  }).sort((a, b) => b.importance - a.importance)

  return <ContentTagsClient type={type} tags={tags} />
}

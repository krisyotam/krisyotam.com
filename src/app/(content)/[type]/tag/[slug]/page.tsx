export const dynamic = 'force-static'
export const dynamicParams = false
export const revalidate = false

import { notFound } from "next/navigation"
import { getActiveContentByType, getTagsByContentType } from "@/lib/data"
import ContentTaggedClient from "./ContentTaggedClient"
import { CONTENT_TYPES, VALID_TYPES } from "../../config"
import type { Metadata } from "next"

interface Props { params: Promise<{ type: string; slug: string }> }

function titleToSlug(t: string) {
  return t.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
}

export async function generateStaticParams() {
  const results: { type: string; slug: string }[] = []
  for (const type of VALID_TYPES) {
    const posts = getActiveContentByType(type)
    const tagSlugs = new Set<string>()
    posts.forEach(p => {
      if (p.tags) p.tags.forEach(t => tagSlugs.add(titleToSlug(t)))
    })
    tagSlugs.forEach(s => results.push({ type, slug: s }))
  }
  return results
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type, slug: tagSlug } = await params
  const config = CONTENT_TYPES[type]
  if (!config) return { title: "Not Found" }
  const posts = getActiveContentByType(type)
  let tagTitle: string | undefined
  for (const p of posts) {
    if (p.tags) {
      tagTitle = p.tags.find(t => titleToSlug(t) === tagSlug)
      if (tagTitle) break
    }
  }
  return {
    title: `${tagTitle || tagSlug} | ${config.label}`,
    description: `${config.label} tagged with ${tagTitle || tagSlug}`,
  }
}

export default async function ContentTagPage({ params }: Props) {
  const { type, slug: tagSlug } = await params
  const config = CONTENT_TYPES[type]
  if (!config) notFound()

  const allPosts = getActiveContentByType(type)
  const dbTags = getTagsByContentType(type)
  let originalTag: string | undefined
  const tagged = allPosts.filter(p => {
    if (p.tags) {
      const found = p.tags.find(t => titleToSlug(t) === tagSlug)
      if (found && !originalTag) originalTag = found
      return !!found
    }
    return false
  })
  if (!originalTag || tagged.length === 0) notFound()

  const dbTag = dbTags.find(t => t.slug === tagSlug)
  const tagData = {
    title: dbTag?.title || originalTag,
    preview: dbTag?.preview || `${config.label} tagged with ${originalTag}.`,
    importance: dbTag?.importance || 5,
    backText: "Tags",
    backHref: `/${type}/tags`,
  }

  const posts = tagged.sort((a, b) => {
    const dA = a.end_date || a.start_date
    const dB = b.end_date || b.start_date
    return new Date(dB).getTime() - new Date(dA).getTime()
  })

  return <ContentTaggedClient type={type} posts={posts} tagData={tagData} />
}

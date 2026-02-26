export const dynamic = 'force-static'
export const revalidate = false

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getActiveContentByType, getCategoriesByContentType } from "@/lib/data"
import ContentClientPage from "../ContentClientPage"
import { CONTENT_TYPES, VALID_TYPES } from "../config"

interface Props { params: Promise<{ type: string; category: string }> }

function slugifyCategory(c: string) {
  return c.toLowerCase().replace(/\s+/g, "-")
}

export async function generateStaticParams() {
  const results: { type: string; category: string }[] = []
  for (const type of VALID_TYPES) {
    const posts = getActiveContentByType(type)
    const cats = new Set<string>()
    posts.forEach(p => {
      if (p.category) cats.add(slugifyCategory(p.category))
    })
    cats.forEach(c => results.push({ type, category: c }))
  }
  return results
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type, category: catSlug } = await params
  const config = CONTENT_TYPES[type]
  if (!config) return { title: "Not Found" }
  const posts = getActiveContentByType(type)
  const post = posts.find(p => slugifyCategory(p.category) === catSlug)
  const catTitle = post?.category || catSlug
  return {
    title: `${catTitle} | ${config.label}`,
    description: `${config.label} in the ${catTitle} category`,
  }
}

export default async function ContentCategoryPage({ params }: Props) {
  const { type, category: catSlug } = await params
  if (!CONTENT_TYPES[type]) notFound()

  const allPosts = getActiveContentByType(type)
  const categories = getCategoriesByContentType(type)
  const post = allPosts.find(p => slugifyCategory(p.category) === catSlug)
  if (!post) notFound()

  return <ContentClientPage type={type} posts={allPosts} categories={categories} initialCategory={post.category} />
}

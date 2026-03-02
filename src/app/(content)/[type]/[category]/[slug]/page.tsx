export const dynamic = 'force-static'
export const dynamicParams = false
export const revalidate = false

import type { Metadata, ResolvingMetadata } from "next"
import { notFound } from "next/navigation"
import { getContentByType } from "@/lib/data"
import ContentPageClient from "./ContentPageClient"
import { TOC } from "@/components/core/toc"
import { Sidenotes } from "@/components/core/sidenotes"
import { ViewTracker } from "@/components/core/view-tracker"
import { extractHeadingsFromMDX } from "@/lib/mdx"
import { CONTENT_TYPES, VALID_TYPES } from "../../config"
import { getWordCount } from "@/lib/mdx-wordcount"

interface Props { params: Promise<{ type: string; category: string; slug: string }> }

function slugifyCategory(c: string) {
  return c.toLowerCase().replace(/\s+/g, "-")
}

export async function generateStaticParams() {
  const results: { type: string; category: string; slug: string }[] = []
  for (const type of VALID_TYPES) {
    if (type === 'documents') continue // Documents link directly to /doc/ (nginx), no detail page
    const posts = getContentByType(type)
    posts.forEach(p => results.push({
      type,
      category: slugifyCategory(p.category),
      slug: p.slug,
    }))
  }
  return results
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { type, category, slug } = await params
  const config = CONTENT_TYPES[type]
  if (!config) return { title: "Not Found" }
  const posts = getContentByType(type)
  const post = posts.find(p => slugifyCategory(p.category) === category && p.slug === slug)
  if (!post) return { title: "Not Found" }
  const coverUrl = post.cover_image || `https://picsum.photos/1200/630?text=${encodeURIComponent(post.title)}`
  const url = `https://krisyotam.com/${type}/${category}/${slug}`
  return {
    title: `${post.title} | ${post.category}`,
    description: post.preview || `${config.singular}: ${post.title}`,
    openGraph: {
      title: post.title,
      description: post.preview || `Read more on Kris Yotam`,
      url,
      type: "article",
      images: [{ url: coverUrl, width: 1200, height: 630, alt: post.title }],
      siteName: "Kris Yotam",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.preview || `Read more on Kris Yotam`,
      images: [coverUrl],
      creator: "@krisyotam",
    },
  }
}

export default async function ContentDetailPage({ params }: Props) {
  const { type, category, slug } = await params
  const config = CONTENT_TYPES[type]
  if (!config) notFound()

  const allPosts = getContentByType(type)
  const postData = allPosts.find(p => slugifyCategory(p.category) === category && p.slug === slug)
  if (!postData) notFound()

  const post = {
    ...postData,
    importance: typeof postData.importance === 'string'
      ? parseInt(postData.importance as string, 10)
      : postData.importance,
  }

  const viewSlug = `${type}/${category}/${slug}`

  // Standard MDX content types
  const headings = await extractHeadingsFromMDX(type, slug, category)
  const wordCount = getWordCount(config.contentDir, slug)

  let Post
  try {
    Post = (await import(`@/content/${config.contentDir}/${slug}.mdx`)).default
  } catch (error) {
    console.error(`Could not find MDX file for ${type}/${slug}`)
    notFound()
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground pt-16">
      <ViewTracker slug={viewSlug} />
      <div className="max-w-6xl mx-auto px-4">
        <div>
          <ContentPageClient type={type} post={post} allPosts={allPosts} headerOnly={true} />
        </div>
        <main id="content" className="container max-w-[672px] mx-auto px-4">
          {headings.length > 0 && <TOC headings={headings} />}
          <div className="content"><Post /></div>
          <ContentPageClient type={type} post={post} allPosts={allPosts} contentOnly={true} wordCount={wordCount} />
        </main>
        <Sidenotes containerSelector="#content" />
      </div>
    </div>
  )
}

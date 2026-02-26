"use client"

import { notFound } from "next/navigation"
import { LiveClock } from "@/components/ui/live-clock"
import { PostHeader } from "@/components/core"
import { Footer } from "@/components/core/footer"
import SiteFooter from "@/components/typography/expanded-footer-block"
import { Citation } from "@/components/core/citation"
import { Comments } from "@/components/core/comments"
import { Footnotes } from "@/components/core/footnotes"
import { CONTENT_TYPES } from "../../config"

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
}

interface Props {
  type: string
  post: ContentPost
  allPosts: ContentPost[]
  children?: React.ReactNode
  headerOnly?: boolean
  contentOnly?: boolean
}

function slugifyCategory(c: string) {
  return c.toLowerCase().replace(/\s+/g, "-")
}

export default function ContentPageClient({ type, post, allPosts, children, headerOnly, contentOnly }: Props) {
  if (!post) notFound()
  const config = CONTENT_TYPES[type]
  if (!config) notFound()

  const lastUpdated = (post.end_date && post.end_date.trim()) || new Date().toISOString().slice(0, 10)

  if (headerOnly) {
    return (
      <div className="container max-w-[672px] mx-auto px-4">
        <PostHeader
          title={post.title}
          subtitle={post.subtitle}
          start_date={post.start_date}
          end_date={post.end_date}
          tags={post.tags}
          category={post.category}
          backHref={`/${type}`}
          backText={config.label}
          preview={post.preview}
          status={(post.status as any) ?? "Notes"}
          confidence={(post.confidence as any) ?? "possible"}
          importance={post.importance ?? 5}
        />
      </div>
    )
  }

  if (contentOnly) {
    const url = `https://krisyotam.com/${type}/${slugifyCategory(post.category)}/${post.slug}`
    return (
      <div className="mt-8 w-full">
        <Comments />
        <Footnotes containerSelector="#content" />
        <SiteFooter lastUpdated={lastUpdated} rawMarkdown="" />
        <Citation
          title={post.title}
          slug={post.slug}
          date={(post.end_date && post.end_date.trim()) || post.start_date}
          url={url}
        />
        <div className="mt-4 w-full">
          <LiveClock />
          <Footer />
        </div>
      </div>
    )
  }

  return null
}

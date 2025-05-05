"use client"

import React, { useEffect } from "react"
import { MDXRemote } from "next-mdx-remote/rsc"
import { useMDXComponents } from "@/mdx-components"
import { BlogModalProvider } from "./blog-modal-provider"
import { MarginCard } from "@/components/margin-notes"
import TableOfContents from "@/components/table-of-contents"
import { BlogPostMeta } from "./blog-post-meta"

interface BlogPostContentProps {
  year: string
  slug: string
  mdxData: {
    content: string
    frontmatter: {
      headings?: { id: string; text: string; level: number }[]
      marginNotes?: any[]
    }
  } | null
  postData?: {
    title: string
    subtitle?: string
    preview?: string
    cover_image?: string
  }
}

function PostNotFound({ slug, year }: { slug: string; year: string }) {
  return (
    <div className="post-content">
      <h1>Post Content Not Found</h1>
      <p>We couldn't find the content for the post "{slug}" from {year}.</p>
    </div>
  )
}

export function BlogPostContent({ year, slug, mdxData, postData }: BlogPostContentProps) {
  // If there's no MDX data, show a fallback
  if (!mdxData) {
    return <PostNotFound slug={slug} year={year} />
  }

  const { content, frontmatter } = mdxData
  const headings = frontmatter.headings || []
  const marginNotes = frontmatter.marginNotes || []
  const mdxComponents = useMDXComponents({})

  // Scroll to top on mount
  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo(0, 0)
  }, [])

  // Prepare metadata for the BlogPostMeta component
  const title = postData?.title || slug
  const subtitle = postData?.subtitle ? ` - ${postData.subtitle}` : ''
  const description = postData?.preview || "Read more on Kris Yotam's blog"
  const coverUrl = postData?.cover_image || `https://picsum.photos/1200/630?text=${encodeURIComponent(title)}`
  const url = `https://krisyotam.com/blog/${year}/${slug}`

  return (
    <BlogModalProvider>
      {/* Add the meta component for extra tags */}
      <BlogPostMeta 
        title={`${title}${subtitle}`}
        description={description}
        imageUrl={coverUrl}
        url={url}
      />

      <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr_1fr] gap-8">
        {/* Left sidebar: Table of Contents */}
        {headings.length > 0 && (
          <div className="hidden md:block sticky top-8">
            <TableOfContents headings={headings} />
          </div>
        )}

        {/* Main content */}
        <div className="mdx-content">
          <MDXRemote source={content} components={mdxComponents} />
        </div>

        {/* Right sidebar: Margin Notes */}
        <div className="hidden md:block sticky top-8 space-y-4">
          {marginNotes.length > 0 ? (
            marginNotes.map((note, idx) => (
              <MarginCard key={note.id || idx} note={note} />
            ))
          ) : (
            <div className="text-sm text-muted-foreground p-4 border border-border rounded-md">
              No margin notes available for this post.
            </div>
          )}
        </div>
      </div>
    </BlogModalProvider>
  )
}

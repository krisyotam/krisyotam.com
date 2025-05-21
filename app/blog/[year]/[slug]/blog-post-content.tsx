"use client"

import React, { useEffect } from "react"
import { MDXRemote } from "next-mdx-remote/rsc"
import { useMDXComponents } from "@/mdx-components"
import { BlogModalProvider } from "./blog-modal-provider"
import { MDXRenderer } from "./mdx-renderer"
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

      <MDXRenderer frontmatter={frontmatter} slug={slug}>
        <MDXRemote source={content} components={mdxComponents} />
      </MDXRenderer>
    </BlogModalProvider>
  )
}

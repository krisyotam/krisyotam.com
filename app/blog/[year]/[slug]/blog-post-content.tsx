"use client"

import type React from "react"

import { Suspense, useEffect } from "react"
import dynamic from "next/dynamic"
import { MDXRemote } from "next-mdx-remote/rsc"
import { useMDXComponents } from "@/mdx-components"
import { BlogModalProvider } from "./blog-modal-provider"
import { MarginCard } from "@/components/margin-card"
import TableOfContents from "@/components/table-of-contents"

// Fallback content component when a post is not found
function PostNotFound({ slug, year }: { slug: string; year: string }) {
  return (
    <div className="post-content">
      <h1>Post Content Not Found</h1>
      <p>
        We couldn't find the content for the post "{slug}" from {year}.
      </p>
    </div>
  )
}

// MDX Renderer component
function MDXRenderer({
  children,
  frontmatter,
  postData,
}: {
  children: React.ReactNode
  frontmatter: any
  postData: any
}) {
  // Debug logging to check what we're working with
  useEffect(() => {
    console.log("MDXRenderer mounted with frontmatter:", frontmatter)
    console.log("MDXRenderer has margin notes:", frontmatter?.marginNotes ? "Yes" : "No")
    console.log("MDXRenderer has headings:", frontmatter?.headings ? "Yes" : "No")
  }, [frontmatter])

  // Ensure we have margin notes, even if they're not in frontmatter
  const marginNotes = frontmatter?.marginNotes || []
  const headings = frontmatter?.headings || []

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr_1fr] gap-8">
      {/* Left sidebar - Table of Contents */}
      <div className="hidden md:block">
        <div className="sticky top-8">
          <TableOfContents headings={headings} />
        </div>
      </div>

      {/* Main content */}
      <div className="mdx-main-content">{children}</div>

      {/* Right sidebar - Margin Notes */}
      <div className="hidden md:block">
        <div className="sticky top-8 space-y-4">
          {marginNotes.length > 0 ? (
            marginNotes.map((note: any) => (
              <div key={note.id || note.index} className="mb-4">
                <MarginCard note={note} />
              </div>
            ))
          ) : (
            <div className="text-sm text-muted-foreground p-4 border border-border rounded-md">
              No margin notes available for this post.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface BlogPostContentProps {
  year: string
  slug: string
  isMDX: boolean
  mdxData: {
    content: string
    frontmatter: any
  } | null
  blogPostExists: boolean
  postData: any // Add postData to props
}

export function BlogPostContent({ year, slug, isMDX, mdxData, blogPostExists, postData }: BlogPostContentProps) {
  // Debug logging
  useEffect(() => {
    console.log("BlogPostContent mounted with props:", { isMDX, blogPostExists })
    if (mdxData) {
      console.log("MDX data available:", {
        contentLength: mdxData.content.length,
        hasFrontmatter: !!mdxData.frontmatter,
        hasMarginNotes: mdxData.frontmatter?.marginNotes ? "Yes" : "No",
      })
    }
  }, [isMDX, mdxData, blogPostExists])

  // Get MDX components
  const mdxComponents = useMDXComponents({})

  // If MDX post exists, render it
  if (isMDX && mdxData) {
    return (
      <BlogModalProvider>
        <MDXRenderer frontmatter={mdxData.frontmatter} postData={postData}>
          <MDXRemote source={mdxData.content} components={mdxComponents} />
        </MDXRenderer>
      </BlogModalProvider>
    )
  }

  // If the post exists, dynamically import it using a relative path
  const PostContent = blogPostExists
    ? dynamic(() => import(`../../${year}/${slug}/page`), {
        loading: () => <div>Loading post content...</div>,
        ssr: true,
      })
    : () => <PostNotFound slug={slug} year={year} />

  return (
    <BlogModalProvider>
      <Suspense fallback={<div>Loading post content...</div>}>
        <PostContent />
      </Suspense>
    </BlogModalProvider>
  )
}


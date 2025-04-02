"use client"

import type React from "react"

import { Suspense } from "react"
import dynamic from "next/dynamic"
import { MDXRemote } from "next-mdx-remote/rsc"
import { useMDXComponents } from "@/mdx-components"
import { BlogModalProvider } from "./blog-modal-provider"

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
}: {
  children: React.ReactNode
  frontmatter: any
}) {
  return (
    <div className="mdx-content grid grid-cols-1 md:grid-cols-[1fr_3fr_1fr] gap-4">
      {/* Left sidebar - Table of Contents */}
      <div className="hidden md:block sticky top-6">
        {frontmatter.headings && frontmatter.headings.length > 0 && (
          <div className="toc-container p-4">
            <h3 className="text-lg font-semibold mb-2">Table of Contents</h3>
            <ul className="space-y-1">
              {frontmatter.headings.map((heading: any, index: number) => (
                <li
                  key={index}
                  className={`${
                    heading.level === 1 ? "ml-0 font-medium" : heading.level === 2 ? "ml-2 text-sm" : "ml-4 text-xs"
                  }`}
                >
                  <a href={`#${heading.id}`} className="hover:underline">
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="mdx-main-content">{children}</div>

      {/* Right sidebar - Margin Notes */}
      <div className="hidden md:block sticky top-6">
        {frontmatter.marginNotes && frontmatter.marginNotes.length > 0 && (
          <div className="margin-notes-container p-4">
            <h3 className="text-lg font-semibold mb-2">Notes</h3>
            <div className="space-y-4">
              {frontmatter.marginNotes.map((note: any, index: number) => (
                <div key={index} className="text-sm p-3 bg-muted rounded-md">
                  <div className="font-medium mb-1">{note.title}</div>
                  <div>{note.content}</div>
                </div>
              ))}
            </div>
          </div>
        )}
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
}

export function BlogPostContent({ year, slug, isMDX, mdxData, blogPostExists }: BlogPostContentProps) {
  // Get MDX components
  const mdxComponents = useMDXComponents({})

  // If MDX post exists, render it
  if (isMDX && mdxData) {
    return (
      <BlogModalProvider>
        <MDXRenderer frontmatter={mdxData.frontmatter}>
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


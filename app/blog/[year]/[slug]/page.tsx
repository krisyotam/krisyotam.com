"use client"

import { notFound } from "next/navigation"
import { PostHeader } from "@/components/post-header"
import { getPostBySlug, isPostMDX } from "@/utils/posts"
import { Suspense, useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { MDXRemote } from "next-mdx-remote/rsc"
import { useMDXComponents } from "@/mdx-components"
import { MDXRenderer } from "./mdx-renderer"

export const dynamicParams = true

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

// Function to extract headings from MDX content
function extractHeadings(content: string) {
  const headings = []
  const markdownHeadingRegex = /^(#{1,3})\s+(.+?)(?:\s+\{#([a-zA-Z0-9-]+)\})?$/gm
  const jsxHeadingRegex = /<h([1-3])[^>]*>(.*?)<\/h\1>/g

  while ((match = markdownHeadingRegex.exec(content)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    const id = match[3] || text.toLowerCase().replace(/[^\w]+/g, "-")
    headings.push({ level, text, id })
  }

  while ((match = jsxHeadingRegex.exec(content)) !== null) {
    const level = Number.parseInt(match[1])
    const text = match[2].trim()
    const id = text.toLowerCase().replace(/[^\w]+/g, "-")
    if (!headings.some((h) => h.text === text && h.level === level)) {
      headings.push({ level, text, id })
    }
  }

  console.log("Extracted headings:", headings)
  return headings
}

export default function PostPage({
  params,
}: {
  params: { year: string; slug: string }
}) {
  const [mdxContent, setMdxContent] = useState<{ content: string; frontmatter: any } | null>(null)
  const [postComponent, setPostComponent] = useState<React.ComponentType | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Ensure we start at the top of the page
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0)
    }

    async function loadPost() {
      try {
        const { year, slug } = params
        console.log("🔍 DEBUG: [year]/[slug]/page.tsx is rendering with params:", params)

        // Get post data from our posts utility (using feed.json)
        const postData = await getPostBySlug(slug)
        console.log("🔍 DEBUG: Post data retrieved:", postData ? "Found" : "Not found")

        if (!postData) {
          console.log(`Post not found in feed data: ${slug}`)
          notFound()
        }

        // Check if there's an MDX version of the post
        const isMDX = isPostMDX(year, slug)
        console.log(`🔍 DEBUG: Is MDX post:`, isMDX)

        if (isMDX) {
          // Fetch MDX content via an API-like request
          const mdxResponse = await fetch(`/api/post-mdx?year=${year}&slug=${slug}`)
          if (!mdxResponse.ok) throw new Error("Failed to fetch MDX content")
          const { content, frontmatter } = await mdxResponse.json()

          // If no headings in frontmatter, extract them from content
          if (!frontmatter.headings || frontmatter.headings.length === 0) {
            frontmatter.headings = extractHeadings(content)
          }

          console.log("Headings for MDX post:", frontmatter.headings)
          setMdxContent({ content, frontmatter })
        } else {
          // Check if there's a corresponding blog post file
          const existsResponse = await fetch(`/api/post-exists?year=${year}&slug=${slug}`)
          const blogPostExists = await existsResponse.json()
          console.log(`🔍 DEBUG: Blog post file exists:`, blogPostExists)

          if (blogPostExists) {
            const PostContent = dynamic(() => import(`../../${year}/${slug}/page`), {
              loading: () => <div>Loading post content...</div>,
              ssr: true,
            })
            setPostComponent(() => PostContent)
          } else {
            setPostComponent(() => () => <PostNotFound slug={slug} year={year} />)
          }
        }
      } catch (err) {
        console.error("Failed to load post:", err)
        setError(err instanceof Error ? err.message : String(err))
      }
    }

    loadPost()
  }, [params.year, params.slug])

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-3xl mx-auto p-8">
          <h1 className="text-2xl font-bold mb-4">Error Loading Post</h1>
          <p className="text-xl text-muted-foreground mb-4">We encountered an error while trying to load this post.</p>
          <pre className="bg-secondary p-4 rounded-md overflow-auto">{error}</pre>
        </div>
      </div>
    )
  }

  // Loading state
  const postData = getPostBySlug(params.slug) // Note: This might need to be awaited or cached
  if (!postData || (!mdxContent && !postComponent)) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-3xl mx-auto p-8 md:p-16 lg:p-24">
      <PostHeader title={postData.title} date={postData.date} tags={postData.tags} category={postData.category} />
      <article className="post-content">
        {mdxContent ? (
          <MDXRenderer frontmatter={mdxContent.frontmatter}>
            <MDXRemote source={mdxContent.content} components={components} />
          </MDXRenderer>
        ) : postComponent ? (
          <Suspense fallback={<div>Loading post content...</div>}>
            <postComponent />
          </Suspense>
        ) : null}
      </article>
    </div>
  )
}
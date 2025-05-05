// app/blog/[year]/[slug]/page.tsx
import dynamic from "next/dynamic"
import { Suspense } from "react"
import Head from "next/head"
import { notFound } from "next/navigation"
import { getAllPosts, getPostContent } from "@/utils/posts"
import { Metadata } from "next"

const BlogPostContent = dynamic(
  () => import("./blog-post-content").then((mod) => mod.BlogPostContent),
  { suspense: true }
)

export const dynamicParams = true

// Generate metadata for SEO and social sharing
export async function generateMetadata({ 
  params 
}: { 
  params: { year: string; slug: string } 
}): Promise<Metadata> {
  const { year, slug } = params
  
  // Fetch post data
  const posts = await getAllPosts()
  const postData = posts.find((post: any) => post.slug === slug)
  if (!postData) return { title: 'Post Not Found' }
  
  // Get cover image URL
  const coverUrl = postData.cover_image || 
    postData.cover || 
    `https://picsum.photos/1200/630?text=${encodeURIComponent(postData.title)}`
  
  // SEO fields
  const title = postData.title
  const description = postData.preview || "Thoughts on math, poetry, and more."
  const url = `https://krisyotam.com/blog/${year}/${slug}`
  
  return {
    title: `${title} | Kris Yotam`,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'Kris Yotam',
      images: [{ url: coverUrl, width: 1200, height: 630, alt: title }],
      locale: 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [coverUrl],
    },
  }
}

export default async function PostPage({
  params,
}: {
  params: { year: string; slug: string }
}) {
  const { year, slug } = params

  // 1) Fetch list metadata
  const posts = await getAllPosts()
  const postData = posts.find((post: any) => post.slug === slug)
  if (!postData) notFound()

  // 2) Load the raw MDX data
  const rawMdx = await getPostContent(year, slug)
  if (!rawMdx || !rawMdx.blogPostExists || !rawMdx.mdxData) notFound()

  // 3) Remap into the shape BlogPostContent expects
  const mdxDataForComponent = {
    content: rawMdx.mdxData,        // the MDX-compiled string
    frontmatter: {
      headings: [] as { id: string; text: string; level: number }[],
      marginNotes: [] as any[],
    },
  }

  return (
    <Suspense fallback={<div className="min-h-[200px]">Loading…</div>}>
      <article className="post-content">
        <BlogPostContent
          year={year}
          slug={slug}
          mdxData={mdxDataForComponent}
        />
      </article>
    </Suspense>
  )
}

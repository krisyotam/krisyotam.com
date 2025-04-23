// app/blog/[year]/[slug]/page.tsx
import dynamic from "next/dynamic"
import { Suspense } from "react"
import Head from "next/head"
import { notFound } from "next/navigation"
import { getAllPosts, getPostContent } from "@/utils/posts"

const BlogPostContent = dynamic(
  () => import("./blog-post-content").then((mod) => mod.BlogPostContent),
  { suspense: true }
)

export const dynamicParams = true

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

  // 4) SEO fields (using your domain)
  const title = postData.title
  const description = postData.preview || "Thoughts on math, poetry, and more."
  const coverUrl =
    postData.cover?.startsWith("http")
      ? postData.cover
      : `https://krisyotam.com${postData.cover || "/images/default-cover.jpg"}`
  const url = `https://krisyotam.com/blog/${year}/${slug}`
  const publishedTime = postData.date

  return (
    <>
      <Head>
        <title>{title} | Kris Yotam</title>
        <meta name="description" content={description} />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={coverUrl} />
        <meta property="article:published_time" content={publishedTime} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={coverUrl} />
      </Head>

      <Suspense fallback={<div className="min-h-[200px]">Loading…</div>}>
        <article className="post-content">
          <BlogPostContent
            year={year}
            slug={slug}
            mdxData={mdxDataForComponent}
          />
        </article>
      </Suspense>
    </>
  )
}

// app/blog/[year]/[slug]/page.tsx
import dynamic from "next/dynamic"
import { Suspense } from "react"
import { notFound } from "next/navigation"
import { PostHeader } from "@/components/post-header"
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

  // Fetch all posts from our data layer
  const posts = await getAllPosts()
  const postData = posts.find((post: any) => post.slug === slug)
  if (!postData) notFound()

  // Load MDX metadata + content
  const mdxData = await getPostContent(year, slug)
  if (!mdxData) notFound()

  return (
    <>
      {/* Render header immediately */}
      <PostHeader
        title={postData.title}
        date={postData.date}
        tags={postData.tags}
        category={postData.category}
      />

      {/* Suspend only the MDX body */}
      <Suspense fallback={<div className="min-h-[200px]">Loading...</div>}>
        <article className="post-content">
          <BlogPostContent year={year} slug={slug} mdxData={mdxData} />
        </article>
      </Suspense>
    </>
  )
}

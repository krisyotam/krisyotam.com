import { notFound } from "next/navigation"
import { PostHeader } from "@/components/post-header"
import { getPostBySlug, getPostContent } from "@/utils/posts"
import { BlogPostContent } from "./blog-post-content"

export const dynamicParams = true

export default async function PostPage({
  params,
}: {
  params: { year: string; slug: string }
}) {
  console.log("🔍 DEBUG: [year]/[slug]/page.tsx is rendering with params:", params)

  try {
    const { year, slug } = params

    // Get post data from our posts utility (using feed.json)
    const postData = await getPostBySlug(slug)
    console.log("🔍 DEBUG: Post data retrieved:", postData ? "Found" : "Not found")

    if (!postData) {
      console.log(`Post not found in feed data: ${slug}`)
      notFound()
    }

    // Check if there's an MDX version of the post and get content if it exists
    const { isMDX, mdxData, blogPostExists } = await getPostContent(year, slug)
    console.log(`🔍 DEBUG: Is MDX post:`, isMDX)

    return (
      <div className="max-w-3xl mx-auto p-8 md:p-16 lg:p-24">
        <PostHeader title={postData.title} date={postData.date} tags={postData.tags} category={postData.category} />
        <article className="post-content">
          <BlogPostContent year={year} slug={slug} isMDX={isMDX} mdxData={mdxData} blogPostExists={blogPostExists} />
        </article>
      </div>
    )
  } catch (error) {
    console.error("Failed to render post:", error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-3xl mx-auto p-8">
          <h1 className="text-2xl font-bold mb-4">Error Loading Post</h1>
          <p className="text-xl text-muted-foreground mb-4">We encountered an error while trying to load this post.</p>
          <pre className="bg-secondary p-4 rounded-md overflow-auto">
            {error instanceof Error ? error.message : String(error)}
          </pre>
        </div>
      </div>
    )
  }
}


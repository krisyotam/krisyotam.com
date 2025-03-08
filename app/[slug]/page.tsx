import { notFound } from "next/navigation"
import { PostHeader } from "@/components/post-header"
import { getPostBySlug } from "@/utils/posts"

export const dynamic = "force-dynamic"

export default async function TsxPostPage({
  params,
}: {
  params: { slug: string }
}) {
  try {
    console.log(`Rendering TSX post with slug: ${params.slug}`)

    // Get post data from our content registry
    const postContent = getPostContent(params.slug)

    if (!postContent) {
      console.log(`Post content not found for slug: ${params.slug}`)
      notFound()
    }

    // Also get post data from our posts utility for consistency
    const postData = await getPostBySlug(params.slug)

    if (!postData || postData.type !== "tsx") {
      console.log(`Post not found or not a TSX post in feed data: ${params.slug}`)
      // We'll continue anyway since we have the content from the registry
    }

    return (
      <div className="relative min-h-screen bg-background text-foreground">
        <div className="max-w-3xl mx-auto p-8 md:p-16 lg:p-24">
          <PostHeader
            title={postContent.title}
            date={postContent.date}
            tags={postContent.tags}
            category={postContent.category}
          />

          <article className="prose dark:prose-invert max-w-none">{postContent.content}</article>

          {/* Render any custom components */}
          {postContent.components?.booksGrid}
          {postContent.components?.toolsGrid}
          {/* Add other component types as needed */}
        </div>
      </div>
    )
  } catch (error) {
    console.error("Failed to render TSX post:", error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
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


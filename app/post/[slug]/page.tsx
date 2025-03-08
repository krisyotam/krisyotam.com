import { getPostBySlug } from "../../../utils/posts"
import { notFound } from "next/navigation"
import { PostHeader } from "@/components/post-header"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function PostPage({
  params,
}: {
  params: { slug: string }
}) {
  try {
    const post = await getPostBySlug(params.slug)

    if (!post || post.type !== "ghost" || !post.html) {
      notFound()
    }

    return (
      <div className="relative min-h-screen bg-background text-foreground">
        <div className="max-w-3xl mx-auto p-8 md:p-16 lg:p-24">
          <PostHeader title={post.title} date={post.date} tags={post.tags} category={post.category} />
          <article className="prose dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.html }} className="post-content text-foreground" />
          </article>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Failed to fetch post:", error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-xl text-muted-foreground">Failed to load post. Please try again later.</p>
      </div>
    )
  }
}


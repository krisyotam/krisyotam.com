import type React from "react"
import { PostHeader } from "@/components/post-header"
import { getPostBySlug } from "@/lib/posts"

interface PostWrapperProps {
  children: React.ReactNode
  slug: string
}

export async function PostWrapper({ children, slug }: PostWrapperProps) {
  // Get post data from our posts utility
  const postData = await getPostBySlug(slug)

  if (!postData) {
    return (
      <div className="max-w-3xl mx-auto p-8 md:p-16 lg:p-24">
        <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
        <p>We couldn't find the post data for "{slug}".</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-8 md:p-16 lg:p-24">
      <PostHeader title={postData.title} date={postData.date} tags={postData.tags} category={postData.category} />
      <article className="post-content">{children}</article>
    </div>
  )
}


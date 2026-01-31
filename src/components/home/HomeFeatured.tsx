/**
 * Home Featured Post Component
 * @author Kris Yotam
 * @date 2025-12-29
 * @description Featured post section wrapper
 */

import { Post } from "@/lib/posts"
import { FeaturedPost } from "@/components/home/featured-post"

interface HomeFeaturedProps {
  posts: Post[]
}

export function HomeFeatured({ posts }: HomeFeaturedProps) {
  return (
    <div className="mb-8">
      <FeaturedPost posts={posts} />
    </div>
  )
}

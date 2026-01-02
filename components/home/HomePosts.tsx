/**
 * Home Posts Section
 * @author Kris Yotam
 * @date 2025-12-29
 * @description Posts table with pagination
 */

import { Post } from "@/lib/posts"
import { Card } from "@/components/ui/card"
import { PostsTable } from "./posts"

interface HomePostsProps {
  posts: Post[]
}

export function HomePosts({ posts }: HomePostsProps) {
  return (
    <Card className="mb-8 p-6 bg-card border border-border">
      <PostsTable posts={posts} />
    </Card>
  )
}

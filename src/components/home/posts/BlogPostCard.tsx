/**
 * Blog Post Card Component
 * @author Kris Yotam
 * @date 2025-12-29
 * @description Card view for displaying blog posts and essays
 */

import { Post } from "@/lib/posts"
import { Card } from "@/components/ui/card"
import { Tag } from "lucide-react"
import Link from "next/link"
import { getPostUrl } from "./utils"

interface BlogPostCardProps {
  post: Post
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const displayDate = (post.end_date && post.end_date.trim()) ? post.end_date : post.start_date;
  const formattedDate = new Date(displayDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  // Generate correct URL based on whether it's an essay or blog post
  const slugPath = getPostUrl(post);

  // Get first 3 tags if there are many
  const displayTags = post.tags.slice(0, 3)
  const hasMoreTags = post.tags.length > 3

  // Determine content type for display (Essay or Blog Post)
  const contentType = post.path === 'blog' ? 'Blog Post' : 'Essay'

  return (
    <Card className="p-4 bg-card border border-border hover:bg-accent/50 transition-colors">
      <Link href={slugPath} className="no-underline">
        <h3 className="font-medium mb-1 line-clamp-1">{post.title}</h3>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{post.preview}</p>

        {/* Date, Status, and Content Type row */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-muted-foreground">{formattedDate}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
              {post.status || "Draft"}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
              {contentType}
            </span>
          </div>
        </div>

        {/* Category */}
        <div className="mb-1">
          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{post.category}</span>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            <Tag className="h-3 w-3 text-muted-foreground" />
            {displayTags.map((tag, index) => (
              <span key={index} className="text-xs text-muted-foreground truncate max-w-[80px]">
                {tag}
                {index < displayTags.length - 1 && ", "}
              </span>
            ))}
            {hasMoreTags && <span className="text-xs text-muted-foreground">...</span>}
          </div>
        )}
      </Link>
    </Card>
  )
}

/**
 * Post Table Row Component
 * @author Kris Yotam
 * @date 2025-12-29
 * @description Table row for displaying a post in list view
 */

import { Post } from "@/lib/posts"
import Link from "next/link"
import { getPostUrl } from "./utils"

interface PostTableRowProps {
  post: Post
}

export function PostTableRow({ post }: PostTableRowProps) {
  const displayDate = (post.end_date && post.end_date.trim()) ? post.end_date : post.start_date;
  const formattedDate = new Date(displayDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  // Generate correct URL - using same pattern as working essays-table.tsx
  const slugPath = getPostUrl(post);

  // Debug logging
  console.log('PostTableRow - Linking to:', slugPath);

  return (
    <tr className="border-t border-border hover:bg-secondary/50 transition-colors">
      <td className="py-2 pr-4 text-sm text-muted-foreground font-mono">{formattedDate}</td>
      <td className="py-2 pr-4">
        <Link href={slugPath} className="no-underline">
          {post.title}
        </Link>
      </td>
      <td className="py-2 text-sm text-right">
        <span className="px-2 py-0.5 text-xs rounded-md bg-muted text-muted-foreground">{post.category}</span>
      </td>
    </tr>
  )
}

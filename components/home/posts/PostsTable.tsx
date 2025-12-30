/**
 * Posts Table Component
 * @author Kris Yotam
 * @date 2025-12-29
 * @description Paginated table view of all posts
 */

"use client"

import { useState } from "react"
import { Post } from "@/utils/posts"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { PostTableRow } from "./PostTableRow"

interface PostsTableProps {
  posts: Post[]
}

export function PostsTable({ posts }: PostsTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 10

  // Filter out excluded categories, ensure posts are active, and sort by date (newest first)
  const filteredPosts = posts
    .filter(post => !["On Myself", "On Website", "On Learning", "On Writing", "On Method"].includes(post.category))
    .filter(post => {
      const displayDate = (post.end_date && post.end_date.trim()) ? post.end_date : post.start_date;
      return post.slug && displayDate && post.preview;
    })
    .filter(post => post.state === "active" || !post.state) // Only include posts with state "active" or without a state property
    .sort((a, b) => {
      const dateA = (a.end_date && a.end_date.trim()) ? a.end_date : a.start_date;
      const dateB = (b.end_date && b.end_date.trim()) ? b.end_date : b.start_date;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    })

  // Calculate pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage)
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost)

  // Handle page changes
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages))
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1))

  return (
    <div className="w-full mb-8">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-muted-foreground">
              <th className="w-1/5 pb-2 text-sm font-normal">Date</th>
              <th className="pb-2 text-sm font-normal">Title</th>
              <th className="w-1/6 pb-2 text-sm font-normal text-right">Category</th>
            </tr>
          </thead>
          <tbody>
            {currentPosts.map((post) => (
              <PostTableRow key={post.slug} post={post} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

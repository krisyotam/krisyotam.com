"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import relatedPostsData from "@/data/related-posts.json"

interface RelatedPost {
  post: string
  description: string
  keywords: string[]
  slug: string
  year: string
}

interface RelatedPostsProps {
  className?: string
  content?: string
}

export function RelatedPosts({ className, content }: RelatedPostsProps) {
  const [matchedPosts, setMatchedPosts] = useState<RelatedPost[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 10

  // Extract content from children if available
  useEffect(() => {
    if (!content) {
      // If no content is provided, try to extract it from the page
      const extractPageContent = () => {
        // Get all text content from the post-content div
        const postContentElement = document.querySelector(".post-content")
        if (postContentElement) {
          return postContentElement.textContent || ""
        }
        return ""
      }

      const pageContent = extractPageContent()
      findRelatedPosts(pageContent)
    } else {
      findRelatedPosts(content)
    }
  }, [content])

  // Find related posts based on keywords in the content
  const findRelatedPosts = (textContent: string) => {
    if (!textContent) return

    const lowerCaseContent = textContent.toLowerCase()
    const relatedPosts = relatedPostsData.posts.filter((post) => {
      return post.keywords.some((keyword) => lowerCaseContent.includes(keyword.toLowerCase()))
    })

    // Sort by number of keyword matches (most matches first)
    const sortedPosts = relatedPosts.sort((a, b) => {
      const aMatches = a.keywords.filter((keyword) => lowerCaseContent.includes(keyword.toLowerCase())).length

      const bMatches = b.keywords.filter((keyword) => lowerCaseContent.includes(keyword.toLowerCase())).length

      return bMatches - aMatches
    })

    // Remove duplicates
    const uniquePosts = sortedPosts.filter((post, index, self) => index === self.findIndex((p) => p.post === post.post))

    setMatchedPosts(uniquePosts)
  }

  // Calculate pagination
  const totalPages = Math.ceil(matchedPosts.length / postsPerPage)
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = matchedPosts.slice(indexOfFirstPost, indexOfLastPost)

  // Handle pagination
  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  // If no related posts found, don't render anything
  if (matchedPosts.length === 0) {
    return null
  }

  return (
    <div className={cn("max-w-2xl mx-auto mt-8", className)}>
      <Card className="p-4 bg-card text-card-foreground border-border">
        <h3 className="text-sm font-medium mb-3">Related Posts</h3>
        <div className="space-y-2">
          {currentPosts.map((post, index) => (
            <Link
              key={index}
              href={`/blog/${post.year}/${post.slug}`}
              className="w-full text-left py-1.5 px-2 hover:bg-secondary rounded-sm transition-colors flex items-start gap-2 text-xs block"
            >
              <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="overflow-hidden">
                <span className="font-medium">{post.post}</span>
                <p className="text-muted-foreground">{post.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className="h-8 px-2 text-xs"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <span className="text-xs text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              variant="ghost"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="h-8 px-2 text-xs"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}

export default RelatedPosts


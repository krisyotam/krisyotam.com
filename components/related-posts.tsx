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
  const postsPerPage = 5 // Changed to 5 posts per page

  // Add CSS directly to the component
  useEffect(() => {
    const style = document.createElement("style")
    style.textContent = `
      /* Reset for Related Posts Component */

      /* Box sizing reset */
      .related-posts-container *,
      .related-posts-container *::before,
      .related-posts-container *::after {
        box-sizing: border-box;
      }

      /* Reset margins and paddings */
      .related-posts-container {
        margin: 0;
        padding: 0;
      }

      /* Typography reset */
      .related-posts-container h3,
      .related-posts-container p,
      .related-posts-container span {
        margin: 0;
        padding: 0;
        font-weight: normal;
        line-height: 1.5;
      }

      /* Link reset */
      .related-posts-container a {
        text-decoration: none !important;
        color: inherit !important;
      }

      .related-posts-container a:hover {
        text-decoration: none !important;
        color: inherit !important;
      }

      /* List reset */
      .related-posts-container ul,
      .related-posts-container ol {
        list-style: none;
        margin: 0;
        padding: 0;
      }

      /* Button reset */
      .related-posts-container button {
        background: none;
        border: none;
        padding: 0;
        font: inherit;
        cursor: pointer;
        outline: inherit;
      }

      /* Card reset */
      .related-posts-card {
        border: 1px solid hsl(var(--border));
        border-radius: var(--radius);
        background-color: hsl(var(--card));
        color: hsl(var(--card-foreground));
        box-shadow: none;
      }

      /* Post item reset */
      .related-post-item {
        border: none;
        background: transparent;
        transition: background-color 0.2s ease;
      }

      .related-post-item:hover {
        background-color: hsl(var(--secondary));
      }

      /* Icon reset */
      .related-post-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      /* Pagination reset */
      .related-posts-pagination {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-top: 1px solid hsl(var(--border));
      }

      .pagination-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 2rem;
        padding: 0 0.5rem;
        font-size: 0.75rem;
        border-radius: var(--radius);
        transition: background-color 0.2s ease;
      }

      .pagination-button:hover:not(:disabled) {
        background-color: hsl(var(--secondary));
      }

      .pagination-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      /* Additional overrides to ensure no hover text color change or underline */
      a[href^="/blog/"] {
        text-decoration: none !important;
        color: inherit !important;
      }

      a[href^="/blog/"]:hover {
        text-decoration: none !important;
        color: inherit !important;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

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

  // Find related posts based on keywords in the content - updated for case-insensitive matching
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

  // If no related posts found, don't render anything
  if (matchedPosts.length === 0) {
    return null
  }

  return (
    <div className={cn("max-w-2xl mx-auto mt-8 related-posts-container", className)}>
      <Card
        className={cn(
          "p-4 bg-card text-card-foreground border-border",
          "rounded-none", // Remove border radius
          "[&_h3]:mt-0 [&_h3]:mb-3", // Reset header margins
          "shadow-none", // Remove shadow
        )}
      >
        <h3 className="text-sm font-medium">Related Posts</h3>
        <div className="space-y-2">
          {currentPosts.map((post, index) => (
            <Link
              key={index}
              href={`/blog/${post.year}/${post.slug}`}
              className={cn(
                "flex items-start gap-2 py-1.5 px-2",
                "hover:bg-secondary transition-colors",
                "no-underline !text-foreground hover:!text-foreground", // Remove underline and prevent text color change on hover
              )}
              style={{
                textDecoration: "none !important", // Ensure no underline
                color: "inherit !important", // Ensure text color doesn't change
              }}
            >
              <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div className="overflow-hidden">
                <span className="block font-medium text-xs mb-0.5">{post.post}</span>
                <p className="text-xs text-muted-foreground m-0">{post.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 px-2"
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
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8 px-2"
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


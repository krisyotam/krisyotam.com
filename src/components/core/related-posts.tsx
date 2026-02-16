// components/RelatedPostsClient.tsx
"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface PostPreview {
  slug: string
  title: string
  subtitle?: string
  preview: string
  date: string
  path?: string
  category?: string
}

interface RelatedPostsClientProps {
  slug: string
  className?: string
}

export default function RelatedPostsClient({
  slug,
  className,
}: RelatedPostsClientProps) {
  const [posts, setPosts] = useState<PostPreview[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const entriesPerPage = 5

  useEffect(() => {
    async function fetchRelatedPosts() {
      try {
        const response = await fetch(`/api/related-posts?slug=${slug}`)
        if (response.ok) {
          const data = await response.json()
          setPosts(data)
        }
      } catch (error) {
        console.error('Error fetching related posts:', error)
      }
    }

    fetchRelatedPosts()
  }, [slug])

  // Guard against undefined or empty posts
  if (!posts || posts.length === 0) {
    return null
  }

  const totalPages = Math.ceil(posts.length / entriesPerPage)
  const startIndex = (currentPage - 1) * entriesPerPage
  const currentEntries = posts.slice(startIndex, startIndex + entriesPerPage)

  const getYear = (dateStr: string) =>
    new Date(dateStr).getFullYear().toString()

  return (
    <div className={cn("max-w-2xl mx-auto", className)}>
      <Card
        className={cn(
          "p-4 bg-card text-card-foreground border-border",
          "rounded-none",
          "[&_h3]:mt-0 [&_h3]:mb-3"
        )}
      >
        <h3 className="text-sm font-medium">Related Posts</h3>
        <div className="space-y-2">
          {currentEntries.map((post) => {
            // Generate correct URL based on post type
            const getPostUrl = () => `/${post.slug}`
            
            return (
              <Link
                key={post.slug}
                href={getPostUrl()}
                className="w-full text-left py-1.5 px-2 hover:bg-secondary transition-colors"
              >
                <div className="font-semibold">{post.title}</div>
                {post.subtitle && (
                  <div className="text-xs text-muted-foreground mb-1">
                    {post.subtitle}
                  </div>
                )}
                <div className="text-xs">{post.preview}</div>
              </Link>
            )
          })}
        </div>

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

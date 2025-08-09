"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Calendar, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { Post } from "@/utils/posts"

interface FeaturedPostProps {
  posts: Post[]
  className?: string
}

interface PostWithImage extends Post {
  thumbnailUrl?: string | null
}

// Generate a placeholder thumbnail based on post data
function generatePlaceholderThumbnail(post: Post): string {
  // Create a simple gradient based on category and first letter of title
  const categoryColors: Record<string, string> = {
    "Technology": "from-blue-500 to-purple-600",
    "Philosophy": "from-green-500 to-teal-600", 
    "Writing": "from-orange-500 to-red-600",
    "Science": "from-cyan-500 to-blue-600",
    "Art": "from-pink-500 to-rose-600",
    "Business": "from-yellow-500 to-orange-600",
    "Health": "from-emerald-500 to-green-600",
    "Politics": "from-red-500 to-pink-600",
    "Education": "from-indigo-500 to-purple-600",
    "Programming": "from-violet-500 to-indigo-600",
    "Essays": "from-amber-500 to-orange-600",
    "default": "from-gray-500 to-slate-600"
  }
  
  const gradient = categoryColors[post.category] || categoryColors.default
  
  // Use a data URL to create a simple gradient placeholder
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#grad)" />
      <text x="200" y="150" font-family="Arial, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" fill="white" opacity="0.8">${post.title.charAt(0).toUpperCase()}</text>
      <text x="200" y="200" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="white" opacity="0.6">${post.category}</text>
    </svg>
  `)}`
}

export function FeaturedPost({ posts, className = "" }: FeaturedPostProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [processedPosts, setProcessedPosts] = useState<PostWithImage[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    function loadThumbnails() {
      setIsLoading(true)
      
      // First, try to get posts with cover images
      const postsWithCoverImages = posts.filter(post => 
        post.state === "active" && 
        !["On Myself", "On Website", "On Learning", "On Writing", "On Method"].includes(post.category) &&
        post.cover_image && 
        post.cover_image.trim() !== ""
      )
      
      // If no posts with cover images, fall back to all active posts
      const activePosts = postsWithCoverImages.length > 0 ? postsWithCoverImages : posts
        .filter(post => post.state === "active")
        .filter(post => !["On Myself", "On Website", "On Learning", "On Writing", "On Method"].includes(post.category))
        .filter(post => {
          const displayDate = (post.end_date && post.end_date.trim()) ? post.end_date : post.start_date;
          return post.slug && displayDate && post.preview;
        })
        .sort((a, b) => {
          const dateA = (a.end_date && a.end_date.trim()) ? a.end_date : a.start_date;
          const dateB = (b.end_date && b.end_date.trim()) ? b.end_date : b.start_date;
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        })
      
      const postsWithThumbnails = activePosts.map((post) => ({
        ...post,
        thumbnailUrl: post.cover_image && post.cover_image.trim() !== "" ? post.cover_image : null
      }))
      
      setProcessedPosts(postsWithThumbnails)
      setIsLoading(false)
    }

    if (posts.length > 0) {
      loadThumbnails()
    }
  }, [posts])

  if (isLoading) {
    return (
      <Card className={`mb-8 ${className}`}>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4"></div>
            <div className="aspect-[16/9] bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (processedPosts.length === 0) {
    return null
  }

  const currentPost = processedPosts[currentIndex]
  const hasMultiplePosts = processedPosts.length > 1

  const goToPrevious = () => {
    setCurrentIndex(prev => prev === 0 ? processedPosts.length - 1 : prev - 1)
  }
  const goToNext = () => {
    setCurrentIndex(prev => prev === processedPosts.length - 1 ? 0 : prev + 1)
  }
  
  const getPostUrl = (post: Post) => {
    if (post.path === 'essays') {
      return `/essays/${post.category}/${post.slug}`
    } else {
      // For blog posts, use category-based routing
      const categorySlug = post.category.toLowerCase().replace(/\s+/g, "-")
      return `/blog/${categorySlug}/${post.slug}`
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const thumbnailUrl = currentPost.thumbnailUrl || generatePlaceholderThumbnail(currentPost)

  return (
    <Card className={`mb-8 overflow-hidden ${className}`}>
      <CardContent className="p-0">
        <div className="relative group">
          {/* Thumbnail Image */}
          <div className="aspect-[16/9] relative overflow-hidden bg-muted">
            <Image
              src={thumbnailUrl}
              alt={currentPost.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
              priority={currentIndex === 0}
            />
            
            {/* Overlay with navigation */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Navigation buttons */}
            {hasMultiplePosts && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 transition-opacity opacity-0 group-hover:opacity-100"
                  aria-label="Previous post"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 transition-opacity opacity-0 group-hover:opacity-100"
                  aria-label="Next post"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* Featured badge */}
            <div className="absolute top-4 left-4">
              <span className="bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-full">
                Featured
              </span>            </div>

            {/* Pagination indicator */}
            {hasMultiplePosts && (
              <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                {currentIndex + 1} / {processedPosts.length}
              </div>
            )}
          </div>

          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <Link href={getPostUrl(currentPost)} className="group-hover:underline">
              <h2 className="text-xl font-semibold mb-2 line-clamp-2">
                {currentPost.title}
              </h2>
            </Link>
            
            {currentPost.subtitle && (
              <p className="text-sm text-gray-200 mb-2 line-clamp-1">
                {currentPost.subtitle}
              </p>
            )}
            
            <p className="text-sm text-gray-300 mb-3 line-clamp-2">
              {currentPost.preview}
            </p>

            {/* Meta information */}
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate((currentPost.end_date && currentPost.end_date.trim()) ? currentPost.end_date : currentPost.start_date)}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                <span>{currentPost.category}</span>
              </div>
              
              {currentPost.tags.length > 0 && (
                <div className="flex items-center gap-1">
                  <span>•</span>
                  <span>{currentPost.tags.slice(0, 2).join(", ")}</span>
                  {currentPost.tags.length > 2 && <span>...</span>}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom navigation dots */}
        {hasMultiplePosts && (
          <div className="flex justify-center gap-2 p-4 bg-card">
            {processedPosts.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex 
                    ? "bg-primary" 
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to post ${index + 1}`}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface BlogPost {
  title: string
  author: string
  date_read: string
  source_link: string
  archive_link: string
  word_count: number
  estimated_read_time: string
  rating: number
  notes_link: string
  publication_year: number
}

interface BlogPostsTableProps {
  data?: BlogPost[]
}

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function BlogPostsTable({ data }: BlogPostsTableProps) {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(data || [])
  const [loading, setLoading] = useState(!data)
  const router = useRouter()

  useEffect(() => {
    // Only fetch if no data was provided
    if (!data) {
      const loadBlogPosts = async () => {
        try {
          const response = await fetch('/api/reading/blogs')
          const responseData = await response.json()
          setBlogPosts(responseData['blog-posts'] || responseData['blogs'] || [])
        } catch (error) {
          console.error('Error loading blog posts:', error)
          setBlogPosts([])
        } finally {
          setLoading(false)
        }
      }

      loadBlogPosts()
    } else {
      // Use provided data immediately
      setBlogPosts(data)
      setLoading(false)
    }
  }, [data])

  // Helper to format date as "Month DD, YYYY"
  function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long", 
      day: "numeric"
    })
  }

  if (loading) {
    return null
  }

  if (!blogPosts.length) {
    return <p className="text-center py-10 text-muted-foreground">No blog posts found.</p>
  }

  return (
    <div className="mt-4">
      <table className="w-full text-sm border border-border overflow-hidden shadow-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-foreground">
            <th className="py-2 text-left font-medium px-3">Title</th>
            <th className="py-2 text-left font-medium px-3">Author</th>
            <th className="py-2 text-left font-medium px-3">Publication Year</th>
          </tr>
        </thead>
        <tbody>
          {blogPosts.slice().reverse().map((post, index) => (
            <tr
              key={index}
              className={`border-b border-border hover:bg-secondary/50 transition-colors ${
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'
              }`}
            >
              <td className="py-2 px-3">{post.title}</td>
              <td className="py-2 px-3">{post.author}</td>
              <td className="py-2 px-3">{post.publication_year}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

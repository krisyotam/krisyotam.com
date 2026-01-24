"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface BlogPost {
  title: string
  author: string
  source_link: string
  archive_link: string
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
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Only fetch if no data was provided
    if (!data) {
      const loadBlogPosts = async () => {
        try {
          const response = await fetch('/api/media?source=reading&type=blogs')
          const responseData = await response.json()
          setBlogPosts(responseData.blogs || [])
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

  // Filter blog posts based on search query
  const filteredBlogPosts = blogPosts.filter((post) => {
    const q = searchQuery.toLowerCase()
    return (
      !q ||
      post.title.toLowerCase().includes(q) ||
      post.author.toLowerCase().includes(q)
    )
  })

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

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <input 
          type="text" 
          placeholder="Search blog posts..." 
          className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
        />
      </div>

      {filteredBlogPosts.length === 0 ? (
        <p className="text-center py-10 text-muted-foreground">
          {searchQuery ? 'No blog posts found matching your search.' : 'No blog posts found.'}
        </p>
      ) : (
        <table className="w-full text-sm border border-border overflow-hidden shadow-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-foreground">
              <th className="py-2 text-left font-medium px-3">Title</th>
              <th className="py-2 text-left font-medium px-3">Author</th>
              <th className="py-2 text-left font-medium px-3">Publication Year</th>
            </tr>
          </thead>
          <tbody>
            {filteredBlogPosts.slice().reverse().map((post, index) => (
              <tr
                key={index}
                className={`border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${
                  index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'
                }`}
                onClick={() => {
                  console.log('Blog post clicked:', post.title, 'Link:', post.source_link);
                  if (post.source_link) {
                    const url = post.source_link.startsWith('http')
                      ? post.source_link
                      : `https://${post.source_link}`;
                    window.open(url, '_blank', 'noopener,noreferrer');
                  }
                }}
              >
                <td className="py-2 px-3">{post.title}</td>
                <td className="py-2 px-3">{post.author}</td>
                <td className="py-2 px-3">{post.publication_year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

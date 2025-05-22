"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { CategoryHeader } from "@/components/category-header"
import { PageDescription } from "@/components/posts/typography/page-description"

interface Post {
  title: string
  slug: string
  date: string
  category?: string
}

interface CategoryData {
  title: string
  subtitle?: string
  date: string
  preview?: string
  status: string
  confidence?: "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain"
  importance?: number
}

interface CategoryClientProps {
  posts: Post[]
  categoryData: CategoryData | null
  categoryName: string
  slug: string
}

export function CategoryClient({ posts, categoryData, categoryName, slug }: CategoryClientProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter posts based on search
  const filteredPosts = posts.filter((post) => {
    return post.title.toLowerCase().includes(searchQuery.toLowerCase())
  })

  function getPostYear(date: string) {
    return new Date(date).getFullYear().toString()
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
        {categoryData ? (
          <CategoryHeader
            title={categoryData.title}
            subtitle={categoryData.subtitle || ""}
            date={categoryData.date}
            preview={categoryData.preview || ""}
            status={categoryData.status as "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished" || "Draft"}
            confidence={categoryData.confidence || "possible"}
            importance={categoryData.importance || 5}
            backText="Categories"
            backHref="/categories"
            className="mb-12"
          />
        ) : (
          <header className="mb-16">
            <div className="mb-4">
              <Link
                href="/categories"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors group font-serif italic"
              >
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Return to Categories
              </Link>
            </div>
            <h1 className="text-xl font-medium mb-1 text-foreground">{categoryName}</h1>
            <p className="text-muted-foreground">
              {posts.length} {posts.length === 1 ? "post" : "posts"}
            </p>
          </header>
        )}

        <div className="mt-8">
          <div className="mb-6">
            <div className="relative">
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <table className="w-full text-sm border border-border overflow-hidden shadow-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-foreground">
                <th className="py-2 text-left font-medium px-3">Title</th>
                <th className="py-2 text-right font-medium px-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post, index) => {
                const year = getPostYear(post.date)
                const postUrl = `/blog/${year}/${post.slug}`
                
                return (
                  <tr
                    key={post.slug}
                    className={`border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'}`}
                  >
                    <td className="py-2 px-3 font-medium">
                      <Link href={postUrl} className="text-foreground">
                        {post.title}
                      </Link>
                    </td>
                    <td className="py-2 px-3 text-right text-muted-foreground">
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filteredPosts.length === 0 && (
            <div className="text-muted-foreground text-sm mt-6">No posts found.</div>
          )}
        </div>
        
        <PageDescription 
          title={`About ${categoryName}`}
          description={`Browse all posts in the ${categoryName} category.`}
        />
      </div>
    </div>
  )
} 
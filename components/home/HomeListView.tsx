/**
 * Home List View Component
 * @author Kris Yotam
 * @date 2025-12-29
 * @description List view rendering for home page
 */

"use client"

import { BlogPost } from "@/components/blog-post"
import { Post } from "@/utils/posts"
import { ListHeader } from "./list"
import { getPostUrl } from "./posts"

interface HomeListViewProps {
  posts: Post[]
  randomQuote: { text: string; author: string }
}

export function HomeListView({ posts, randomQuote }: HomeListViewProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="p-8 md:p-16 lg:p-24">
      <div className="max-w-4xl mx-auto">
        <ListHeader initialQuote={randomQuote} />
        <main>
          <div className="space-y-8">
            {posts
              .filter(post => !["On Myself", "On Website", "On Learning", "On Writing", "On Method"].includes(post.category))
              .filter(post => {
                const displayDate = (post.end_date && post.end_date.trim()) ? post.end_date : post.start_date;
                return post.slug && displayDate && post.preview;
              })
              .map((post) => {
                // Generate correct URL - using same pattern as working essays-table.tsx
                const slugPath = getPostUrl(post);

                return (
                  <BlogPost
                    key={post.slug}
                    slug={slugPath}
                    type={"tsx"}
                    title={post.title}
                    subtitle={`${post.path === 'blog' ? 'Blog Post' : 'Essay'}: ${post.subtitle || post.category}`}
                    date={formatDate((post.end_date && post.end_date.trim()) ? post.end_date : post.start_date)}
                    excerpt={post.preview}
                  />
                )
              })}
          </div>
        </main>
      </div>
    </div>
  )
}

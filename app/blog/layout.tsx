"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { PostHeader } from "@/components/post-header"
import { TableOfContents } from "@/components/table-of-contents"
import { MarginCard } from "@/components/margin-card"
import { Bibliography } from "@/components/bibliography"
import { BentoFooter } from "@/components/bento-footer"
import { ScriptTagger } from "@/components/script-tagger"
import Head from "next/head"

interface Post {
  title: string
  date: string
  tags: string[]
  category: string
  slug: string
  status: "active" | "hidden"
  preview: string
  headings: {
    id: string
    text: string
    level: number
    children?: any[]
  }[]
  marginNotes: {
    id: string
    title: string
    content: string
    index: number
    priority?: number
  }[]
  bibliography?: {
    id: string
    author: string
    title: string
    year: number
    publisher: string
    url: string
    type: string
  }[]
}

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [postData, setPostData] = useState<Post | null>(null)

  useEffect(() => {
    async function fetchPostData() {
      try {
        const pathParts = pathname.split("/")
        if (pathParts.length >= 4 && pathParts[1] === "blog") {
          const slug = pathParts[3]

          const response = await fetch(`/api/post?slug=${slug}`)
          if (response.ok) {
            const data = await response.json()
            setPostData(data)
          }
        }
      } catch (error) {
        console.error("Failed to fetch post data:", error)
      }
    }

    if (pathname.startsWith("/blog/")) {
      fetchPostData()
    }
  }, [pathname])

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Head>
        <script async src="https://cdn.seline.so/seline.js" data-token="9bc08e3c42882e0"></script>
      </Head>

      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:gap-4 lg:gap-6">
          <div className="hidden md:block md:w-56 lg:w-64 flex-shrink-0">
            <div className="sticky top-8">
              {postData?.headings && postData.headings.length > 0 && (
                <TableOfContents headings={postData.headings} className="mt-8" />
              )}
            </div>
          </div>

          <div className="flex-1 max-w-2xl mx-auto px-0 py-8">
            {postData && (
              <PostHeader
                title={postData.title}
                date={postData.date}
                tags={postData.tags}
                category={postData.category}
              />
            )}

            <article
              className="prose prose-lg mx-auto"
              style={{
                fontFamily: "'Outfit', sans-serif",
                lineHeight: 1.7,
                maxWidth: "100%",
              }}
            >
              <ScriptTagger>{children}</ScriptTagger>
            </article>

            {postData?.bibliography && postData.bibliography.length > 0 && (
              <div className="mt-16">
                <Bibliography bibliography={postData.bibliography} />
              </div>
            )}

            <BentoFooter className="mt-16" />
          </div>

          <div className="hidden md:block md:w-56 lg:w-64 flex-shrink-0">
            <div className="sticky top-8 space-y-4 pb-24">
              {postData?.marginNotes &&
                postData.marginNotes.map((note) => (
                  <div key={note.id} className="mt-8">
                    <MarginCard note={note} />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

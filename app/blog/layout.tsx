"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { PostHeader } from "@/components/post-header"
import TableOfContents from "@/components/table-of-contents"
import { MarginCard } from "@/components/margin-card"
import { Bibliography } from "@/components/bibliography"
import { BentoFooter } from "@/components/bento-footer"
import { ScriptTagger } from "@/components/script-tagger"
import { PostLatexRenderer } from "@/components/post-latex-renderer"
import { Commento } from "@/components/commento"

// Add Google Fonts import for Source Serif 4 and Old English font
const fontImport = `
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&display=swap');
@import url('https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap');
`

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
    source?: string
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

  // Add a loading state at the top of the component
  const [isLoading, setIsLoading] = useState(true)

  // Add font imports
  useEffect(() => {
    const style = document.createElement("style")
    style.textContent = fontImport
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  useEffect(() => {
    async function fetchPostData() {
      try {
        // Extract the slug from the pathname
        // Assuming the pathname format is /blog/YEAR/SLUG
        const pathParts = pathname.split("/")
        if (pathParts.length >= 4 && pathParts[1] === "blog") {
          const slug = pathParts[3]

          // Fetch the post data from your API
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

  // Add this useEffect to scroll to top and handle loading state
  useEffect(() => {
    // Scroll to top when pathname changes
    window.scrollTo(0, 0)

    // Set loading to true on route change
    setIsLoading(true)

    // Set a small timeout to ensure components have time to load
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [pathname])

  // Modify the return statement to include loading state
  return (
    <div className="relative min-h-screen bg-background text-foreground pt-16">
      {isLoading ? (
        <div className="max-w-6xl mx-auto px-4 animate-fade-in">
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="mt-4 text-sm text-muted-foreground">Loading post...</p>
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 animate-fade-in">
          {/* Header outside the grid - made smaller */}
          <header className="mb-2 max-w-xl mx-auto px-0">
            {postData && (
              <PostHeader
                title={postData.title}
                date={postData.date}
                tags={postData.tags}
                category={postData.category}
                className="post-header"
              />
            )}
          </header>

          {/* Grid for sidebars and content */}
          <div className="grid grid-cols-1 md:grid-cols-[16rem_1fr_16rem] md:gap-4 lg:gap-6">
            {/* Left Sidebar - moved down */}
            <div className="hidden md:block self-start mt-4">
              <section className="metadata-section">
                <div className="sticky top-6">
                  <TableOfContents key={pathname} headings={postData?.headings || []} />
                </div>
              </section>
            </div>

            {/* Main Content */}
            <div className="flex-1 max-w-2xl mx-auto px-0 self-start">
              <main>
                <section className="content-section" aria-label="Post Content">
                  <article
                    className="prose prose-sm mx-auto mt-0 post-content"
                    style={{
                      fontFamily: "'Source Serif 4', serif",
                      maxWidth: "100%",
                    }}
                  >
                    <PostLatexRenderer>
                      <ScriptTagger>{children}</ScriptTagger>
                    </PostLatexRenderer>
                  </article>
                </section>

                {/* Bibliography section */}
                {postData?.bibliography && postData.bibliography.length > 0 && (
                  <section className="bibliography-section" aria-label="Bibliography">
                    <article>
                      <Bibliography bibliography={postData.bibliography} />
                    </article>
                  </section>
                )}

                {/* Comments section */}
                <section className="comments-section" aria-label="Comments">
                  <Commento />
                </section>

                {/* Footer section */}
                <footer>
                  <BentoFooter className="mt-12" />
                </footer>
              </main>
            </div>

            {/* Right Sidebar - moved down */}
            <div className="hidden md:block self-start mt-4">
              <section className="margin-notes-section">
                <div className="sticky top-6 space-y-4 pb-24">
                  {postData?.marginNotes &&
                    postData.marginNotes.map((note) => (
                      <article key={note.id} className="mb-4">
                        <MarginCard note={note} />
                      </article>
                    ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}


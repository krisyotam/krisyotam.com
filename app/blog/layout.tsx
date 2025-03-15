"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { PostHeader } from "@/components/post-header"
import TableOfContents from "@/components/table-of-contents";
import { MarginCard } from "@/components/margin-card"
import { Bibliography } from "@/components/bibliography"
import { BentoFooter } from "@/components/bento-footer"
import { ScriptTagger } from "@/components/script-tagger"

// Add Google Fonts import for EB Garamond and Old English font
const fontImport = `
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;500;600;700;1,400;1,500;1,600;1,700&display=swap');
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

  // Update the style injection to make content more condensed and enhance the drop cap
  useEffect(() => {
    const style = document.createElement("style")
    style.textContent = `
    ${fontImport}
    
    /* Set default fonts */
    .prose {
      font-family: 'EB Garamond', serif;
      font-size: 0.95rem; /* Smaller base font size */
      line-height: 1.6; /* Tighter line height */
      letter-spacing: -0.01em;
      max-width: 55ch; /* Narrower content width */
    }
    
    .prose h1, .prose h2, .prose h3, .prose h4 {
      font-family: 'EB Garamond', serif;
      font-weight: 500;
      margin-top: 1.5em; /* Reduced top margin */
      margin-bottom: 0.5em; /* Reduced bottom margin */
    }
    
    /* Enhanced drop cap styling with UnifrakturMaguntia font */
    .prose > p:first-of-type::first-letter,
    article > p:first-of-type::first-letter {
      float: left;
      font-family: 'UnifrakturMaguntia', serif;
      font-size: 5.5em;
      line-height: 0.8;
      padding: 0.05em 0.05em 0 0;
      margin-bottom: -0.1em;
      color: hsl(var(--foreground));
    }

    /* Typography refinements for more condensed academic look */
    .prose {
      font-size: 1rem;
      line-height: 1.6;
      letter-spacing: -0.01em;
    }

    .prose h1 {
      font-size: 2rem;
      letter-spacing: -0.03em;
      margin-bottom: 1rem;
    }

    .prose h2 {
      font-size: 1.5rem;
      letter-spacing: -0.02em;
      text-transform: uppercase;
      font-weight: 500;
      margin-bottom: 0.75rem;
    }
    
    .prose h3 {
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
    }

    .prose p {
      margin-bottom: 0.75rem; /* Reduced paragraph spacing */
    }

    .prose blockquote {
      font-style: italic;
      border-left: none;
      padding-left: 1.5rem;
      font-size: 0.95em;
      margin: 1rem 0;
    }

    .prose blockquote cite {
      display: block;
      font-style: normal;
      font-size: 0.9em;
      margin-top: 0.5em;
    }
    
    /* Reduced spacing between list items */
    .prose ul li, .prose ol li {
      margin-top: 0.25rem;
      margin-bottom: 0.25rem;
    }

    /* Highlight effect for margin notes */
    [data-note-index].highlight {
      animation: highlight 2s ease-out;
    }

    @keyframes highlight {
      0% { background-color: hsl(var(--primary) / 0.1); }
      100% { background-color: transparent; }
    }

    /* Semantic section styling with reduced spacing */
    section {
      margin-bottom: 1.5rem;
    }

    section > h2 {
      font-size: 1.25rem;
      font-weight: 500;
      margin-bottom: 0.75rem;
      color: hsl(var(--muted-foreground));
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .content-section article {
      margin-bottom: 1.5rem;
    }

    .content-section article h3 {
      margin-bottom: 0.75rem;
    }
    
    /* Table of contents styling */
    .toc-container {
      position: relative;
    }
    
    .toc-controls {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      display: flex;
      gap: 0.25rem;
    }
    
    .toc-control-button {
      width: 1.5rem;
      height: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      cursor: pointer;
      color: hsl(var(--muted-foreground));
      transition: color 0.2s ease;
    }
    
    .toc-control-button:hover {
      color: hsl(var(--foreground));
    }
    
    .toc-minimized {
      width: 2rem;
      overflow: hidden;
    }
    
    .toc-minimized .toc-title {
      writing-mode: vertical-rl;
      transform: rotate(180deg);
      text-align: center;
      padding: 0.5rem 0;
      white-space: nowrap;
    }
    
    .toc-modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 50;
      width: 80%;
      max-width: 500px;
      max-height: 80vh;
      overflow-y: auto;
      background: hsl(var(--background));
      border: 1px solid hsl(var(--border));
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      padding: 1rem;
    }
    
    .toc-modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 49;
    }
  `
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

  return (
    <div className="relative min-h-screen bg-background text-foreground pt-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:gap-4 lg:gap-6">
          {/* Left sidebar column */}
          <div className="hidden md:block md:w-56 lg:w-64 flex-shrink-0">
            <section className="metadata-section" aria-label="Table of Contents">
              <div className="sticky top-8 z-20">
                {postData?.headings && postData.headings.length > 0 && (
                  <article className="toc-article">
                    <TableOfContents headings={postData.headings} className="mt-8" />
                  </article>
                )}
              </div>
            </section>
          </div>

          {/* Main content column */}
          <div className="flex-1 max-w-2xl mx-auto px-0">
            {/* Header section */}
            <header>
              {postData && (
                <PostHeader
                  title={postData.title}
                  date={postData.date}
                  tags={postData.tags}
                  category={postData.category}
                />
              )}
            </header>

            {/* Main content section */}
            <main>
              <section className="content-section" aria-label="Post Content">
                <article
                  className="prose prose-sm mx-auto mt-2"
                  style={{
                    fontFamily: "'EB Garamond', serif",
                    lineHeight: 1.6,
                    maxWidth: "100%",
                  }}
                >
                  <ScriptTagger>{children}</ScriptTagger>
                </article>
              </section>

              {/* Bibliography section */}
              {postData?.bibliography && postData.bibliography.length > 0 && (
                <section className="bibliography-section" aria-label="Bibliography">
                  <h2>References</h2>
                  <article>
                    <Bibliography bibliography={postData.bibliography} />
                  </article>
                </section>
              )}

              {/* Footer section */}
              <footer>
                <BentoFooter className="mt-12" />
              </footer>
            </main>
          </div>

          {/* Right sidebar column */}
          <div className="hidden md:block md:w-56 lg:w-64 flex-shrink-0">
            <section className="margin-notes-section" aria-label="Margin Notes">
              <div className="sticky top-8 space-y-4 pb-24">
                {postData?.marginNotes &&
                  postData.marginNotes.map((note) => (
                    <article key={note.id} className="mt-8">
                      <MarginCard note={note} />
                    </article>
                  ))}
              </div>
            </section>
          </div>
        </div>

        {/* Positioning data section at the bottom */}
        <section className="positioning-section" aria-hidden="true" style={{ display: "none" }}>
          <article className="toc-positioning">
            {/* Table of Contents positioning data */}
            <div id="toc-position" data-position="left-sidebar" data-sticky="true" data-offset="8"></div>
          </article>
          <article className="margin-notes-positioning">
            {/* Margin Notes positioning data */}
            <div id="margin-notes-position" data-position="right-sidebar" data-sticky="true" data-offset="8"></div>
          </article>
        </section>
      </div>
    </div>
  )
}


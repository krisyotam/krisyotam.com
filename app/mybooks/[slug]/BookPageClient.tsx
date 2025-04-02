"use client"

import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import fs from "fs"
import path from "path"
import { redirect } from "next/navigation"
import mybooksData from "../../../data/mybooks.json"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { TableOfContents } from "@/components/mybooks-contents"
import { useEffect, useState } from "react"

async function getBookContent(slug: string) {
  try {
    const filePath = path.join(process.cwd(), "app", "mybooks", "books", slug, "page.md")
    const fileContent = fs.readFileSync(filePath, "utf8")

    // Simple markdown to HTML conversion without external dependencies
    const html = fileContent
      .replace(/^# (.*$)/gm, "<h1>$1</h1>")
      .replace(/^## (.*$)/gm, "<h2>$1</h2>")
      .replace(/^### (.*$)/gm, "<h3>$1</h3>")
      .replace(/^#### (.*$)/gm, "<h4>$1</h4>")
      .replace(/^##### (.*$)/gm, "<h5>$5</h5>")
      .replace(/^###### (.*$)/gm, "<h6>$6</h6>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n\n/g, "</p><p>")
      .replace(/```(.*?)```/gs, "<pre><code>$1</code></pre>")
      .replace(/`(.*?)`/g, "<code>$1</code>")
      .replace(/!\[(.*?)\]$$(.*?)$$/g, '<img alt="$1" src="$2" />')
      .replace(/\[(.*?)\]$$(.*?)$$/g, '<a href="$2">$1</a>')
      .replace(/^> (.*$)/gm, "<blockquote>$1</blockquote>")
      .replace(/^- (.*$)/gm, "<ul><li>$1</li></ul>")
      .replace(/^([0-9]+)\. (.*$)/gm, "<ol><li>$2</li></ol>")

    // Wrap in paragraph tags if not already wrapped
    return `<p>${html}</p>`.replace(/<p><h([1-6])>/g, "<h$1>").replace(/<\/h([1-6])><\/p>/g, "</h$1>")
  } catch (error) {
    console.error(`Error reading book content for ${slug}:`, error)
    return null
  }
}

export function BookPageClient({ params }: { params: { slug: string } }) {
  const [bookHtml, setBookHtml] = useState<string | null>(null)
  const [bookData, setBookData] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const book = mybooksData.books.find((b) => b.slug === params.slug)

        if (!book) {
          notFound()
        }

        setBookData(book)

        // If the book is paid, redirect to the external link
        if (book.access === "paid" && book.link) {
          redirect(book.link)
        }

        // For free books, get the content from the local MD file
        const html = await getBookContent(params.slug)

        if (!html) {
          notFound()
        }

        setBookHtml(html)
      } catch (error) {
        console.error("Failed to fetch book:", error)
      }
    }

    fetchData()
  }, [params.slug])

  if (!bookData || !bookHtml) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-xl text-muted-foreground">Failed to load book. Please try again later.</p>
      </div>
    )
  }

  const imageUrl = bookData.cover_photo || bookData.feature_image || `/placeholder.svg?height=600&width=400`

  // Add IDs to headings for the table of contents
  const htmlWithIds = bookHtml.replace(
    /<(h[1-6])>(.*?)<\/h[1-6]>/g,
    (match, tag, content) => `<${tag} id="${content.toLowerCase().replace(/[^\w]+/g, "-")}">${content}</${tag}>`,
  )

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
        <div className="mb-8">
          <Button variant="outline" asChild>
            <Link href="/mybooks">
              <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </Link>
          </Button>
        </div>
        <div className="mb-8 flex justify-center">
          <div className="relative w-full max-w-md aspect-[3/4]">
            <Image src={imageUrl || "/placeholder.svg"} alt={bookData.title} fill className="object-cover rounded-lg" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4 text-center">{bookData.title}</h1>
        <p className="text-xl mb-4 text-center">by {bookData.authors.join(", ")}</p>
        <div className="flex justify-center mb-8">
          {bookData.tags.map((tag) => (
            <span key={tag} className="mr-2 px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm">
              {tag}
            </span>
          ))}
        </div>

        <TableOfContents content={htmlWithIds} />

        <style jsx global>{`
          /* Condensed markdown styling with !important */
          .book-content {
            font-family: system-ui, -apple-system, sans-serif !important;
            line-height: 1.5 !important;
            color: var(--foreground) !important;
          }
          
          .book-content h1, 
          .book-content h2, 
          .book-content h3, 
          .book-content h4, 
          .book-content h5, 
          .book-content h6 {
            margin-top: 1.2rem !important;
            margin-bottom: 0.5rem !important;
            font-weight: 700 !important;
            line-height: 1.2 !important;
          }
          
          .book-content h1 {
            font-size: 1.8rem !important;
            border-bottom: 1px solid var(--border) !important;
            padding-bottom: 0.3rem !important;
          }
          
          .book-content h2 {
            font-size: 1.5rem !important;
            margin-top: 1rem !important;
          }
          
          .book-content h3 {
            font-size: 1.3rem !important;
            margin-top: 0.8rem !important;
          }
          
          .book-content h4 {
            font-size: 1.1rem !important;
            margin-top: 0.6rem !important;
          }
          
          .book-content h5, .book-content h6 {
            font-size: 1rem !important;
            margin-top: 0.5rem !important;
          }
          
          .book-content p {
            margin-top: 0.5rem !important;
            margin-bottom: 0.5rem !important;
            line-height: 1.4 !important;
          }
          
          .book-content a {
            color: var(--primary) !important;
            text-decoration: none !important;
            border-bottom: 1px dotted var(--primary) !important;
          }
          
          .book-content a:hover {
            border-bottom: 1px solid var(--primary) !important;
          }
          
          .book-content blockquote {
            border-left: 3px solid var(--border) !important;
            padding-left: 1rem !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
            font-style: italic !important;
            color: var(--muted-foreground) !important;
          }
          
          .book-content ul, .book-content ol {
            padding-left: 1.5rem !important;
            margin-top: 0.5rem !important;
            margin-bottom: 0.5rem !important;
          }
          
          .book-content li {
            margin-bottom: 0.2rem !important;
          }
          
          .book-content code {
            background-color: var(--muted) !important;
            padding: 0.2rem 0.4rem !important;
            border-radius: 3px !important;
            font-family: monospace !important;
            font-size: 0.9em !important;
          }
          
          .book-content pre {
            background-color: var(--muted) !important;
            padding: 1rem !important;
            border-radius: 5px !important;
            overflow-x: auto !important;
            margin: 0.8rem 0 !important;
          }
          
          .book-content pre code {
            background-color: transparent !important;
            padding: 0 !important;
            border-radius: 0 !important;
            font-size: 0.9em !important;
            color: var(--foreground) !important;
          }
          
          .book-content img {
            max-width: 100% !important;
            height: auto !important;
            border-radius: 5px !important;
            margin: 0.8rem 0 !important;
          }
          
          .book-content hr {
            border: 0 !important;
            border-top: 1px solid var(--border) !important;
            margin: 1.5rem 0 !important;
          }
          
          .book-content table {
            width: 100% !important;
            border-collapse: collapse !important;
            margin: 1rem 0 !important;
          }
          
          .book-content th, .book-content td {
            border: 1px solid var(--border) !important;
            padding: 0.5rem !important;
            text-align: left !important;
          }
          
          .book-content th {
            background-color: var(--muted) !important;
            font-weight: 600 !important;
          }
          
          /* Condensed spacing between elements */
          .book-content * + * {
            margin-top: 0.5rem !important;
          }
          
          .book-content h1 + p,
          .book-content h2 + p,
          .book-content h3 + p,
          .book-content h4 + p,
          .book-content h5 + p,
          .book-content h6 + p {
            margin-top: 0.3rem !important;
          }
        `}</style>

        <div
          className="prose dark:prose-invert max-w-none book-content"
          dangerouslySetInnerHTML={{ __html: htmlWithIds }}
        />
      </div>
    </div>
  )
}


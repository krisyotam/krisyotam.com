import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import fs from "fs"
import path from "path"
import { redirect } from "next/navigation"
import mybooksData from "../../../data/mybooks.json"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { BookContent } from "./book-content"

export const dynamic = "force_dynamic"
export const revalidate = 0

export async function generateStaticParams() {
  // Only generate params for active books
  return mybooksData.books
    .filter((book) => book.status === "active")
    .map((book) => ({
      slug: book.slug,
    }))
}

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
      .replace(/^##### (.*$)/gm, "<h5>5</h5>")
      .replace(/^###### (.*$)/gm, "<h6>$1</h6>")
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

export default async function BookPage({ params }: { params: { slug: string } }) {
  try {
    const bookData = mybooksData.books.find((b) => b.slug === params.slug)

    if (!bookData) {
      notFound()
    }

    // If the book is paid, redirect to the external link
    if (bookData.access === "paid" && bookData.link) {
      redirect(bookData.link)
    }

    // For free books, get the content from the local MD file
    const bookHtml = await getBookContent(params.slug)

    if (!bookHtml) {
      notFound()
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
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt={bookData.title}
                fill
                className="object-cover rounded-lg"
              />
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

          <BookContent htmlContent={htmlWithIds} />
        </div>
      </div>
    )
  } catch (error) {
    console.error("Failed to fetch book:", error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-xl text-muted-foreground">Failed to load book. Please try again later.</p>
      </div>
    )
  }
}


import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { getBookBySlug } from "../../../utils/ghost"
import mybooksData from "../../../data/mybooks.json"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { TableOfContents } from "@/components/table-of-contents"

export const dynamic = "force-dynamic"

export async function generateStaticParams() {
  return mybooksData.books.map((book) => ({
    slug: book.slug,
  }))
}

export default async function BookPage({ params }: { params: { slug: string } }) {
  try {
    const book = await getBookBySlug(params.slug)
    const bookData = mybooksData.books.find((b) => b.slug === params.slug)

    if (!book || !bookData) {
      notFound()
    }

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
                src={book.feature_image || `/placeholder.svg?height=600&width=400`}
                alt={book.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-center">{book.title}</h1>
          <p className="text-xl mb-4 text-center">by {bookData.authors.join(", ")}</p>
          <div className="flex justify-center mb-8">
            {bookData.tags.map((tag) => (
              <span key={tag} className="mr-2 px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm">
                {tag}
              </span>
            ))}
          </div>
          {/* Remove this line */}
          {/* <p className="text-center mb-8 text-muted-foreground">{bookData.description}</p> */}
          <TableOfContents content={book.html} />
          <div
            className="prose dark:prose-invert max-w-none book-content"
            dangerouslySetInnerHTML={{
              __html: book.html.replace(
                /<(h[1-6])>(.*?)<\/h[1-6]>/g,
                (match, tag, content) =>
                  `<${tag} id="${content.toLowerCase().replace(/[^\w]+/g, "-")}">${content}</${tag}>`,
              ),
            }}
          />
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


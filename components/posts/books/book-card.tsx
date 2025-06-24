"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getBookByIsbn } from "@/lib/literal-api"

// Add a style block to reset margins on specific elements
const resetStyles = `
  .book-card-wrapper * {
    margin-top: 0 !important;
  }
  .book-card-wrapper h1, 
  .book-card-wrapper h2, 
  .book-card-wrapper h3, 
  .book-card-wrapper h4, 
  .book-card-wrapper h5, 
  .book-card-wrapper h6, 
  .book-card-wrapper p {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
  }
  .book-card-wrapper {
    padding-top: 1px !important;
    margin-top: 0 !important;
  }
`

interface Author {
  name: string
}

interface Book {
  title: string
  slug: string
  cover?: string
  authors: Author[]
}

interface BookCardProps {
  isbn: string
}

export function BookCard({ isbn }: BookCardProps) {
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBook() {
      setLoading(true)
      setError(null)

      try {
        const bookData = await getBookByIsbn(isbn)
        setBook(bookData)
        if (!bookData) {
          setError("Book not found")
        }
      } catch (err) {
        setError("Failed to fetch book data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (isbn) {
      fetchBook()
    }
  }, [isbn])

  if (loading) {
    return (
      <>
        <style jsx>{resetStyles}</style>
        <div className="book-card-wrapper">
          <Card className="!overflow-hidden !transition-all">
            <div className="!aspect-[2/3] !relative" style={{ width: "100%", overflow: "hidden" }}>
              <Skeleton className="!h-full !w-full" style={{ position: "absolute", top: 0, left: 0 }} />
            </div>
            <CardContent className="!p-4" style={{ overflow: "hidden" }}>
              <Skeleton className="!h-5 !w-full !mb-2" />
              <Skeleton className="!h-4 !w-2/3" />
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  if (error || !book) {
    return (
      <>
        <style jsx>{resetStyles}</style>
        <div className="book-card-wrapper">
          <Card className="!overflow-hidden !transition-all">
            <div
              className="!aspect-[2/3] !relative !bg-muted !flex !items-center !justify-center"
              style={{ width: "100%", overflow: "hidden" }}
            >
              <p className="!text-sm !text-muted-foreground !px-4 !text-center !font-sans" style={{ margin: 0 }}>
                Book not found
              </p>
            </div>
            <CardContent className="!p-4 !bg-card" style={{ overflow: "hidden" }}>
              <h3
                className="!font-semibold !line-clamp-1 !mb-1 !text-base !font-sans !text-foreground"
                style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
              >
                Error
              </h3>
              <p
                className="!text-sm !text-muted-foreground !font-sans"
                style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
              >
                {error || "Book not found"}
              </p>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  const authorNames = book.authors.map((author: Author) => author.name).join(", ")

  return (
    <>
      <style jsx>{resetStyles}</style>
      <div className="book-card-wrapper">
        <Link
          href={`https://literal.club/book/${book.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="!block !no-underline !text-inherit hover:!no-underline hover:!text-inherit !border-none !outline-none focus:!outline-none focus:!ring-0"
        >
          <Card className="!overflow-hidden !transition-all hover:!shadow-lg hover:!ring-2 hover:!ring-primary hover:!ring-offset-2 dark:hover:!ring-offset-background !cursor-pointer !border !border-solid !border-border">
            <div className="!aspect-[2/3] !relative" style={{ width: "100%", overflow: "hidden" }}>
              <Image
                src={book.cover || "/placeholder.svg?height=300&width=200"}
                alt={`Cover of ${book.title}`}
                fill
                className="!object-cover"
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
              />
            </div>
            <CardContent className="!p-4 !bg-card" style={{ overflow: "hidden" }}>
              <h3
                className="!font-semibold !line-clamp-1 !mb-1 !text-base !font-sans !text-foreground"
                style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
              >
                {book.title}
              </h3>
              <p
                className="!text-sm !text-muted-foreground !font-sans"
                style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
              >
                {authorNames}
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </>
  )
}
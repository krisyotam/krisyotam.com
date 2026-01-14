"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

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

interface BookCardProps {
  title: string
  slug: string
  cover?: string
  authors: string[]
}

export function BookCard({ title, slug, cover, authors }: BookCardProps) {
  const authorNames = authors.join(", ")

  return (
    <>
      <style jsx>{resetStyles}</style>
      <div className="book-card-wrapper">
        <Link
          href={`https://literal.club/book/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="!block !no-underline !text-inherit hover:!no-underline hover:!text-inherit !border-none !outline-none focus:!outline-none focus:!ring-0"
        >
          <Card className="!overflow-hidden !transition-all hover:!shadow-lg hover:!ring-2 hover:!ring-primary hover:!ring-offset-2 dark:hover:!ring-offset-background !cursor-pointer !border !border-solid !border-border">
            <div className="!aspect-[2/3] !relative" style={{ width: "100%", overflow: "hidden" }}>
              <Image
                src={cover || "/placeholder.svg?height=300&width=200"}
                alt={`Cover of ${title}`}
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
                {title}
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
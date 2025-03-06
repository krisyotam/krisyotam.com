import { Star } from "lucide-react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useQuery, gql } from "@apollo/client"

const GET_BOOK_COVER = gql`
  query GetBookCover($isbn: String!) {
    book(where: { isbn13: $isbn }) {
      cover
    }
  }
`

interface BookCardProps {
  isbn: string
  title: string
  authors: string[]
  rating: number
  isInteractive?: boolean
}

export function BookCard({ isbn, title, authors, rating, isInteractive = false }: BookCardProps) {
  const { data, loading, error } = useQuery(GET_BOOK_COVER, {
    variables: { isbn },
  })

  const coverUrl = data?.book?.cover || `/placeholder.svg?height=100&width=100`
  const authorText = authors.join(", ")

  return (
    <Card
      className={`flex overflow-hidden transition-colors hover:bg-accent/50 group h-full ${
        isInteractive ? "cursor-pointer" : ""
      }`}
    >
      <div className="w-[100px] bg-muted p-4 flex items-center justify-center">
        <div className="relative w-full h-[100px]">
          {loading ? (
            <div className="w-full h-full bg-muted animate-pulse" />
          ) : (
            <Image src={coverUrl || "/placeholder.svg"} alt={title} fill className="object-cover" />
          )}
        </div>
      </div>
      <div className="flex-1 p-4 overflow-hidden flex flex-col justify-between">
        <div className="space-y-1.5">
          <h3 className="font-medium leading-tight line-clamp-2">{title}</h3>
          <p className="text-sm text-muted-foreground truncate">by {authorText}</p>
        </div>
        <div className="flex items-center justify-between mt-2">
          {rating > 0 && (
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="text-sm text-muted-foreground">{rating}/5</span>
            </div>
          )}
          {isInteractive && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/books/${isbn}`}>Read</Link>
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}


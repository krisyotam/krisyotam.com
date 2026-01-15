import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

interface MyBookCardProps {
  book: {
    slug: string
    title: string
    subtitle: string
    authors: string[]
    cover_photo?: string
    feature_image?: string
    access: "free" | "paid"
    link?: string
    classification: string
    category: string
    tags: string[]
  }
}

export function MyBookCard({ book }: MyBookCardProps) {
  const imageUrl = book.cover_photo || book.feature_image || `/placeholder.svg?height=100&width=100`

  return (
    <Card className="flex overflow-hidden transition-colors hover:bg-accent/50 group cursor-pointer h-full">
      <div className="w-[100px] bg-muted p-4 flex items-center justify-center">
        <div className="relative w-full h-[100px]">
          <Image src={imageUrl || "/placeholder.svg"} alt={book.title} fill className="object-cover" unoptimized={imageUrl?.includes('krisyotam.com')} />
        </div>
      </div>
      <div className="flex-1 p-4 overflow-hidden flex flex-col justify-between">
        <div className="space-y-1.5">
          <h3 className="font-medium leading-tight line-clamp-2 hover:underline">{book.title}</h3>
          {book.subtitle && <p className="text-sm text-muted-foreground line-clamp-2">{book.subtitle}</p>}
          <p className="text-sm text-muted-foreground truncate">by {book.authors.join(", ")}</p>
          <div className="flex flex-wrap gap-1 mt-1">
            <span className="text-xs px-1.5 py-0.5 bg-secondary/50 text-secondary-foreground rounded-sm">
              {book.classification}
            </span>
            <span className="text-xs px-1.5 py-0.5 bg-secondary/50 text-secondary-foreground rounded-sm">
              {book.category}
            </span>
          </div>
        </div>
        <div className="mt-2">
          {book.access === "free" ? (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/mybooks/${book.slug}`}>Read</Link>
            </Button>
          ) : (
            <Button variant="default" size="sm" asChild>
              <a href={book.link} target="_blank" rel="noopener noreferrer" className="flex items-center">
                Buy <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}




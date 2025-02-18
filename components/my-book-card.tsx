import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface MyBookCardProps {
  book: {
    slug: string
    title: string
    subtitle: string
    excerpt: string
    feature_image: string
    published_at: string
    authors: string[]
  }
}

export function MyBookCard({ book }: MyBookCardProps) {
  return (
    <Card className="flex overflow-hidden transition-colors hover:bg-accent/50 group cursor-pointer h-full">
      <div className="w-[100px] bg-muted p-4 flex items-center justify-center">
        <div className="relative w-full h-[100px]">
          <Image
            src={book.feature_image || `/placeholder.svg?height=100&width=100`}
            alt={book.title}
            fill
            className="object-cover"
          />
        </div>
      </div>
      <div className="flex-1 p-4 overflow-hidden flex flex-col justify-between">
        <div className="space-y-1.5">
          <Link href={`/mybooks/${book.slug}`}>
            <h3 className="font-medium leading-tight line-clamp-2 hover:underline">{book.title}</h3>
          </Link>
          {book.subtitle && <p className="text-sm text-muted-foreground line-clamp-2">{book.subtitle}</p>}
          <p className="text-sm text-muted-foreground line-clamp-2">{book.excerpt}</p>
          <p className="text-sm text-muted-foreground truncate">by {book.authors.join(", ")}</p>
        </div>
        <div className="mt-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/mybooks/${book.slug}`}>Read</Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}


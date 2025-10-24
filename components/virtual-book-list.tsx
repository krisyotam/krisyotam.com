import type React from "react"
import { FixedSizeList as List } from "react-window"
import { BookCard } from "./book-card"

interface Book {
  isbn: string
  title: string
  authors: string[]
  rating: number
  coverUrl?: string
}

interface VirtualBookListProps {
  books: Book[]
}

const Row = ({ index, style, data }: { index: number; style: React.CSSProperties; data: Book[] }) => {
  console.log("Row props:", { index, data: data[index] })
  const book = data[index]
  return (
    <div style={style}>
      <BookCard
        isbn={book.isbn}
        title={book.title}
        authors={book.authors}
        rating={book.rating}
        isInteractive={true}
      />
    </div>
  )
}

export const VirtualBookList: React.FC<VirtualBookListProps> = ({ books }) => {
  console.log("VirtualBookList books:", books)
  try {
    return (
      <List height={600} itemCount={books.length} itemSize={150} width="100%" itemData={books}>
        {Row}
      </List>
    )
  } catch (error) {
    console.error("Error in VirtualBookList:", error)
    return <div>Error rendering book list</div>
  }
}


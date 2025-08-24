import { LibraryBookCard } from "./library-book-card"

type Book = {
  id: string
  title: string
  author: string
  cover: string
}

type Collection = {
  id: string
  title: string
  description: string
  books: Book[]
}

interface LocalCollectionContentProps {
  collection: Collection
}

export function LocalCollectionContent({ collection }: LocalCollectionContentProps) {
  if (!collection.books || collection.books.length === 0) {
    return <div className="py-8 text-center">No books in this collection.</div>
  }

  return (
    <div className="grid grid-cols-1 gap-4 py-4">
      {collection.books.map((book) => (
        <LibraryBookCard key={book.id} coverUrl={book.cover} title={book.title} author={book.author} rating={0} />
      ))}
    </div>
  )
}


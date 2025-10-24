import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    // Read from library.json file in the new location
    const libraryPath = path.join(process.cwd(), "data", "library", "library.json")
    const authorsPath = path.join(process.cwd(), "data", "library", "authors.json")
    
    const libraryData = JSON.parse(fs.readFileSync(libraryPath, "utf8"))
    const authorsData = JSON.parse(fs.readFileSync(authorsPath, "utf8"))
    
    // Create a lookup map for authors
    const authorsMap = new Map()
    authorsData.authors.forEach((author: any) => {
      authorsMap.set(author.slug, author)
    })
    
    // Enhance books with author information
    const booksWithAuthors = libraryData.books.map((book: any) => {
      const bookWithAuthors = { ...book }
      
      if (book.author) {
        // Single author case
        const authorInfo = authorsMap.get(book.author)
        if (authorInfo) {
          bookWithAuthors.authorName = authorInfo.name
          bookWithAuthors.authorInfo = authorInfo
        }
      } else if (book.authors && Array.isArray(book.authors)) {
        // Multiple authors case
        bookWithAuthors.authorNames = book.authors.map((slug: string) => {
          const authorInfo = authorsMap.get(slug)
          return authorInfo ? authorInfo.name : slug
        })
        bookWithAuthors.authorsInfo = book.authors.map((slug: string) => authorsMap.get(slug)).filter(Boolean)
      }
      
      return bookWithAuthors
    })

    return NextResponse.json(booksWithAuthors)
  } catch (error) {
    console.error("Error reading library catalog:", error)
    return NextResponse.json({ error: "Failed to fetch library catalog" }, { status: 500 })
  }
}


import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET(
  request: Request,
  { params }: { params: { title: string } }
) {
  try {
    const { title } = params
    
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
    
    // Find the book by title slug
    const book = libraryData.books.find((book: any) => {
      const slug = book.title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      return slug === title
    })
    
    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }
    
    // Enhance book with author information
    const bookWithAuthors = { ...book }
    
    if (book.author) {
      // Single author case
      const authorInfo = authorsMap.get(book.author)
      if (authorInfo) {
        bookWithAuthors.authorName = authorInfo.name
        bookWithAuthors.authors = [authorInfo]
      }
    } else if (book.authors && Array.isArray(book.authors)) {
      // Multiple authors case
      bookWithAuthors.authorNames = book.authors.map((slug: string) => {
        const authorInfo = authorsMap.get(slug)
        return authorInfo ? authorInfo.name : slug
      })
      bookWithAuthors.authors = book.authors.map((slug: string) => authorsMap.get(slug)).filter(Boolean)
    }

    return NextResponse.json(bookWithAuthors)
  } catch (error) {
    console.error("Error reading book details:", error)
    return NextResponse.json({ error: "Failed to fetch book details" }, { status: 500 })
  }
}
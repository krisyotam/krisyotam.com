import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET(
  request: Request,
  { params }: { params: { title: string } }
) {
  try {
    const { title } = params
    
    console.log("API Route - Looking for book with title/slug:", title)
    
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
      // Find the book by slug
    const book = libraryData.books.find((book: any) => {
      return book.slug === title
    })
    
    console.log("API Route - Found book:", book ? book.title : "Not found")
    console.log("API Route - Book slug:", book ? book.slug : "N/A")
    
    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }
      // Enhance book with comprehensive author information
    const bookWithAuthors = { ...book }
    
    // Handle both author and authors fields
    let authorsList: any[] = []
    if (book.author) {
      // Single author case
      const authorInfo = authorsMap.get(book.author)
      if (authorInfo) {
        authorsList = [authorInfo]
      }
    } else if (book.authors && Array.isArray(book.authors)) {
      // Multiple authors case - handle both slugs and IDs
      authorsList = book.authors.map((authorRef: string) => {
        // Try slug first, then ID
        let authorInfo = authorsMap.get(authorRef)
        if (!authorInfo) {
          authorInfo = authorsData.authors.find((a: any) => a.id === authorRef)
        }
        return authorInfo || { id: authorRef, name: authorRef, slug: authorRef }
      })
    }
    
    // Generate author name string
    const authorNames = authorsList.map((a: any) => a.name).join(', ')
    
    // Generate citation
    const citation = `${authorNames}. "${book.title}." ${book.publisher}, ${book.yearPublished}.${book.edition ? ` ${book.edition} edition.` : ''}${book.isbn ? ` ISBN: ${book.isbn}.` : ''}`
      // Use book's slug
    const slug = book.slug
      // Create comprehensive book object
    const enrichedBook = {
      ...bookWithAuthors,
      slug,
      authors: authorsList || [],
      authorName: authorNames,
      citation,
      // Ensure all fields have defaults
      description: book.description || '',
      isbn: book.isbn || '',
      edition: book.edition || '',
      pages: book.pages || '',
      language: book.language || 'English',
      series: book.series || '',
      volume: book.volume || '',
      doi: book.doi || '',
      url: book.url || '',
      notes: book.notes || '',
      tags: book.tags || [],
      subjects: book.subjects || [],
      classification: book.classification || '',
      subClassification: book.subClassification || '',
      acquired: book.acquired || '',
      location: book.location || '',
      condition: book.condition || '',
      coverUrl: book.coverUrl || ''
    }

    return NextResponse.json(enrichedBook)
  } catch (error) {
    console.error("Error reading book details:", error)
    return NextResponse.json({ error: "Failed to fetch book details" }, { status: 500 })
  }
}
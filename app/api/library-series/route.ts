import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    // Read from library.json file
    const libraryPath = path.join(process.cwd(), "data", "library", "library.json")
    const authorsPath = path.join(process.cwd(), "data", "library", "authors.json")
    
    const libraryData = JSON.parse(fs.readFileSync(libraryPath, "utf8"))
    const authorsData = JSON.parse(fs.readFileSync(authorsPath, "utf8"))
    
    // Create a lookup map for authors
    const authorsMap = new Map()
    authorsData.authors.forEach((author: any) => {
      authorsMap.set(author.slug, author)
    })
    
    // Group books by series
    const seriesMap = new Map()
    
    libraryData.books.forEach((book: any) => {
      const seriesName = book.series?.trim()
      
      // Skip books without series
      if (!seriesName) return
      
      if (!seriesMap.has(seriesName)) {
        seriesMap.set(seriesName, {
          id: seriesName.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
          title: seriesName,
          description: `Books in the ${seriesName} series`,
          books: []
        })
      }
      
      // Get author information
      let authorName = "Unknown Author"
      if (book.author) {
        const authorInfo = authorsMap.get(book.author)
        authorName = authorInfo ? authorInfo.name : book.author
      } else if (book.authors && Array.isArray(book.authors)) {
        const authorNames = book.authors.map((authorSlug: string) => {
          const authorInfo = authorsMap.get(authorSlug)
          return authorInfo ? authorInfo.name : authorSlug
        })
        authorName = authorNames.join(", ")
      }
        seriesMap.get(seriesName).books.push({
        id: book.id,
        title: book.title,
        author: authorName,
        cover: book.coverUrl || "/placeholder.svg?height=100&width=100",
        classification: book.classification,
        subClassification: book.subClassification
      })
    })
    
    // Convert to array and sort by number of books
    const collections = Array.from(seriesMap.values()).sort((a, b) => b.books.length - a.books.length)
    
    return NextResponse.json({ collections })
  } catch (error) {
    console.error("Error reading library series:", error)
    return NextResponse.json(
      { error: "Failed to load library series" },
      { status: 500 }
    )
  }
}

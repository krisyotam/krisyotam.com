import fs from "fs"
import path from "path"
import { remark } from "remark"
import html from "remark-html"
import { cache } from "react"

export type BookContent = {
  html: string
}

// Create a cached function to read book content
export const getBookBySlug = cache(async (slug: string): Promise<BookContent | null> => {
  try {
    // Construct the full path to the markdown file
    const fullPath = path.join(process.cwd(), "app/mybooks/books", slug, "page.md")

    console.log(`[getBookBySlug] Attempting to read file at: ${fullPath}`)

    // Check if the file exists
    if (!fs.existsSync(fullPath)) {
      console.log(`[getBookBySlug] ERROR: File not found at: ${fullPath}`)

      // Log the directory contents to help debug
      const dirPath = path.join(process.cwd(), "app/mybooks/books")
      if (fs.existsSync(dirPath)) {
        console.log(`[getBookBySlug] Contents of books directory:`, fs.readdirSync(dirPath))

        const slugDir = path.join(dirPath, slug)
        if (fs.existsSync(slugDir)) {
          console.log(`[getBookBySlug] Contents of ${slug} directory:`, fs.readdirSync(slugDir))
        } else {
          console.log(`[getBookBySlug] Slug directory does not exist: ${slugDir}`)
        }
      } else {
        console.log(`[getBookBySlug] Books directory does not exist: ${dirPath}`)
      }

      return null
    }

    console.log(`[getBookBySlug] File found at: ${fullPath}`)

    // Read the file contents
    const fileContents = fs.readFileSync(fullPath, "utf8")
    console.log(`[getBookBySlug] File contents length: ${fileContents.length} characters`)

    // Use remark to convert markdown into HTML
    console.log(`[getBookBySlug] Converting markdown to HTML...`)
    const processedContent = await remark()
      .use(html, { sanitize: false }) // Allow HTML in markdown
      .process(fileContents)

    const contentHtml = processedContent.toString()
    console.log(`[getBookBySlug] HTML content length: ${contentHtml.length} characters`)

    return {
      html: contentHtml,
    }
  } catch (error) {
    console.error(`[getBookBySlug] Error reading markdown file for ${slug}:`, error)
    return null
  }
})

// Get all book slugs for static generation
export function getAllBookSlugs() {
  try {
    const booksDirectory = path.join(process.cwd(), "app/mybooks/books")
    console.log(`[getAllBookSlugs] Looking for books in: ${booksDirectory}`)

    // Check if directory exists
    if (!fs.existsSync(booksDirectory)) {
      console.log(`[getAllBookSlugs] ERROR: Books directory does not exist: ${booksDirectory}`)
      return []
    }

    const entries = fs.readdirSync(booksDirectory, { withFileTypes: true })
    console.log(`[getAllBookSlugs] Found ${entries.length} entries in books directory`)

    const slugs = entries.filter((dirent) => dirent.isDirectory()).map((dirent) => dirent.name)

    console.log(`[getAllBookSlugs] Found ${slugs.length} book directories:`, slugs)

    return slugs
  } catch (error) {
    console.error(`[getAllBookSlugs] Error getting book slugs:`, error)
    return []
  }
}


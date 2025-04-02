import { type NextRequest, NextResponse } from "next/server"
import { getPostBySlug } from "@/lib/posts"
import { getPostMetadata } from "@/utils/mdx-utils"
import path from "path"
import fs from "fs"

export async function GET(request: NextRequest) {
  try {
    // Get the slug from the query parameters
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get("slug")

    console.log(`\n🔍 API ROUTE: Processing request for slug: ${slug}`)

    if (!slug) {
      console.log(`❌ API ROUTE: Missing slug parameter`)
      return NextResponse.json({ error: "Slug parameter is required" }, { status: 400 })
    }

    // Get the post data from our posts utility
    console.log(`🔍 API ROUTE: Fetching post data for slug: ${slug}`)
    const postData = await getPostBySlug(slug)

    if (!postData) {
      console.log(`❌ API ROUTE: Post not found for slug: ${slug}`)
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    console.log(`✅ API ROUTE: Post data found for slug: ${slug}`)

    // Determine the year from the post date
    const year = new Date(postData.date).getFullYear().toString()
    console.log(`📅 API ROUTE: Year determined from post date: ${year}`)

    // Check if the MDX or TSX file exists
    const mdxPath = path.join(process.cwd(), "app/blog", year, slug, "page.mdx")
    const tsxPath = path.join(process.cwd(), "app/blog", year, slug, "page.tsx")

    // Check if the margin-notes.json and bibliography.json files exist
    const marginNotesPath = path.join(process.cwd(), "app/blog", year, slug, "margin-notes.json")
    const bibliographyPath = path.join(process.cwd(), "app/blog", year, slug, "bibliography.json")

    console.log(`\n📁 API ROUTE: Checking files for ${slug}:`)
    console.log(`MDX exists: ${fs.existsSync(mdxPath)}`)
    console.log(`TSX exists: ${fs.existsSync(tsxPath)}`)
    console.log(`margin-notes.json exists: ${fs.existsSync(marginNotesPath)}`)
    console.log(`bibliography.json exists: ${fs.existsSync(bibliographyPath)}`)

    let headings: string | any[] = []
    let marginNotes: string | any[] = []
    let bibliography: string | any[] = []

    // Always use getPostMetadata to load metadata from separate files
    try {
      console.log(`\n🔍 API ROUTE: Loading metadata for ${slug} using getPostMetadata`)
      const metadata = await getPostMetadata(year, slug)
      headings = metadata.headings
      marginNotes = metadata.marginNotes
      bibliography = metadata.bibliography

      console.log(`\n📊 API ROUTE: Metadata loaded for ${slug}:`, {
        headingsCount: headings.length,
        marginNotesCount: marginNotes.length,
        bibliographyCount: bibliography.length,
      })
    } catch (error) {
      console.error(`\n❌ API ROUTE: Error loading metadata for ${slug}:`, error)
    }

    // Return the post data with additional metadata
    console.log(`\n✅ API ROUTE: Returning post data with metadata for ${slug}`)
    return NextResponse.json({
      ...postData,
      headings,
      marginNotes,
      bibliography,
    })
  } catch (error) {
    console.error(`\n❌ API ROUTE: Error in post API route:`, error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


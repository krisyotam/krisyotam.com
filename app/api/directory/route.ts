import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    // Read the JSON files
    const pagesPath = path.join(process.cwd(), "data", "page-directory.json")
    const categoriesPath = path.join(process.cwd(), "data", "category-data.json")

    const pagesData = JSON.parse(fs.readFileSync(pagesPath, "utf8"))
    const categoriesData = JSON.parse(fs.readFileSync(categoriesPath, "utf8"))

    // Extract and format the pages
    const pages = pagesData.pages.map((page: any) => ({
      ...page,
      type: "page",
    }))

    // Extract and format the categories
    const categories = categoriesData.categories.map((category: any) => ({
      ...category,
      path: `/category/${category.slug}`,
      type: "category",
    }))

    // Combine all items
    const all = [...pages, ...categories]

    return NextResponse.json({
      all,
      pages,
      categories,
    })
  } catch (error) {
    console.error("Error in directory API:", error)
    return NextResponse.json({ error: "Failed to fetch directory data" }, { status: 500 })
  }
}

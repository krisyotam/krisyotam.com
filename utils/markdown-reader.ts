import fs from "fs"
import path from "path"
import { remark } from "remark"
import html from "remark-html"

export async function getCharacterContent(slug: string) {
  try {
    const fullPath = path.join(process.cwd(), "app/ocs/profiles", slug, "page.md")
    const fileContents = fs.readFileSync(fullPath, "utf8")

    // Use remark to convert markdown into HTML string
    const processedContent = await remark().use(html).process(fileContents)

    const contentHtml = processedContent.toString()

    return {
      html: contentHtml,
    }
  } catch (error) {
    console.error(`Error reading character content for ${slug}:`, error)
    return null
  }
}

export async function getWorldContent(slug: string) {
  try {
    const fullPath = path.join(process.cwd(), "app/ocs/worlds", slug, "page.md")
    const fileContents = fs.readFileSync(fullPath, "utf8")

    // Use remark to convert markdown into HTML string
    const processedContent = await remark().use(html).process(fileContents)

    const contentHtml = processedContent.toString()

    return {
      html: contentHtml,
    }
  } catch (error) {
    console.error(`Error reading world content for ${slug}:`, error)
    return null
  }
}


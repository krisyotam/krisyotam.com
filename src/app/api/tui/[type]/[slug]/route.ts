/**
 * ============================================================================
 * TUI Raw Content API
 * ============================================================================
 * Returns raw MDX frontmatter and body for the TUI viewer.
 *
 * GET /api/tui/[type]/[slug]
 * Returns: { frontmatter: string, body: string }
 *
 * @type api
 * @path src/app/api/tui/[type]/[slug]/route.ts
 * @date 2026-02-28
 * @updated 2026-02-28
 * ============================================================================
 */

import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import matter from "gray-matter"

const VALID_TYPES = new Set([
  "blog", "diary", "essays", "fiction", "news",
  "notes", "ocs", "papers", "progymnasmata", "reviews", "verse"
])

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ type: string; slug: string }> }
) {
  const { type, slug } = await params

  if (!VALID_TYPES.has(type)) {
    return NextResponse.json(
      { error: `Invalid content type: ${type}` },
      { status: 400 }
    )
  }

  if (!SLUG_PATTERN.test(slug)) {
    return NextResponse.json(
      { error: `Invalid slug format: ${slug}` },
      { status: 400 }
    )
  }

  const filePath = path.join(process.cwd(), "src", "content", type, `${slug}.mdx`)

  if (!fs.existsSync(filePath)) {
    return NextResponse.json(
      { error: `File not found: ${type}/${slug}.mdx` },
      { status: 404 }
    )
  }

  try {
    const raw = fs.readFileSync(filePath, "utf-8")
    const { content } = matter(raw)

    // Extract frontmatter as raw YAML string
    const frontmatterLines = raw.split("---")
    const frontmatter = frontmatterLines.length >= 3
      ? frontmatterLines[1].trim()
      : ""

    return NextResponse.json({
      frontmatter,
      body: content.trim(),
    })
  } catch (error: any) {
    console.error(`Error reading ${type}/${slug}:`, error)
    return NextResponse.json(
      { error: "Failed to read content file" },
      { status: 500 }
    )
  }
}

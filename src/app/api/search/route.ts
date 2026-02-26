/**
 * ============================================================================
 * Search API Route
 * ============================================================================
 * Author: Kris Yotam
 * Date: 2026-02-26
 *
 * Returns a flat array of all active content for client-side search.
 * Queries all content types from content.db via getActiveContentByType().
 *
 * Usage:
 *   GET /api/search → [...{ title, preview, slug, type, category, tags, start_date, url }]
 *
 * @type api
 * @path src/app/api/search/route.ts
 * ============================================================================
 */

import { NextResponse } from "next/server"
import { getActiveContentByType, getSequencesData, getDocumentUrlMap } from "@/lib/data"

interface SearchItem {
  title: string
  preview: string
  slug: string
  type: string
  category: string
  tags: string[]
  start_date: string
  url: string
}

const CONTENT_TYPES = [
  "blog",
  "notes",
  "essays",
  "papers",
  "fiction",
  "verse",
  "reviews",
  "progymnasmata",
  "diary",
  "ocs",
  "news",
  "documents",
]

export async function GET() {
  try {
    const results: SearchItem[] = []
    const docUrls = getDocumentUrlMap()

    for (const type of CONTENT_TYPES) {
      try {
        const items = getActiveContentByType(type)
        for (const item of items) {
          const category = item.category?.toLowerCase().replace(/\s+/g, "-") || ""
          results.push({
            title: item.title,
            preview: item.preview || "",
            slug: item.slug,
            type,
            category,
            tags: item.tags || [],
            start_date: item.start_date || "",
            url: type === 'documents' && docUrls[item.slug]
              ? docUrls[item.slug]
              : `/${type}/${category}/${item.slug}`,
          })
        }
      } catch {
        // Table may not exist for this type — skip silently
      }
    }

    // Sequences
    try {
      const data = await getSequencesData()
      for (const seq of data.sequences) {
        if (seq.state !== "active") continue
        results.push({
          title: seq.title,
          preview: seq.preview || "",
          slug: seq.slug,
          type: "sequence",
          category: seq.category || "",
          tags: seq.tags || [],
          start_date: seq.start_date || "",
          url: `/sequences/${seq.slug}`,
        })
      }
    } catch {
      // sequences table may not exist
    }

    return NextResponse.json(results)
  } catch (error: any) {
    console.error("Error in search API:", error)
    return NextResponse.json(
      { error: "Failed to fetch search data", details: error.message },
      { status: 500 }
    )
  }
}

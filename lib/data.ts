// lib/data.ts - Server-side data fetching functions
import { readFile } from "fs/promises"
import path from "path"
import { Post, PostsData } from "@/utils/posts"

/**
 * Get essays data from essays.json
 * This function ensures the file is included in Vercel's build
 */
export async function getEssaysData(): Promise<PostsData> {
  const filePath = path.join(process.cwd(), "data/essays/essays.json")
  try {
    const json = await readFile(filePath, "utf-8")
    const data = JSON.parse(json)
    // Handle both old structure (posts) and new structure (essays)
    return { posts: data.essays || data.posts || [] }
  } catch (error) {
    console.error("Error reading essays.json:", error)
    return { posts: [] }
  }
}

/**
 * Get blog data from feed.json
 * This function ensures the file is included in Vercel's build
 */
export async function getBlogData(): Promise<Post[]> {
  const filePath = path.join(process.cwd(), "data/blog/feed.json")
  try {
    const json = await readFile(filePath, "utf-8")
    return JSON.parse(json) as Post[]
  } catch (error) {
    console.error("Error reading feed.json:", error)
    return []
  }
}

/**
 * Get categories data from categories.json
 */
export async function getCategoriesData(): Promise<any> {
  const filePath = path.join(process.cwd(), "data/essays/categories.json")
  try {
    const json = await readFile(filePath, "utf-8")
    return JSON.parse(json)
  } catch (error) {
    console.error("Error reading categories.json:", error)
    return { categories: [] }
  }
}

/**
 * Get series data from series.json
 */
export async function getSeriesData(): Promise<any> {
  const filePath = path.join(process.cwd(), "data/essays/series.json")
  try {
    const json = await readFile(filePath, "utf-8")
    return JSON.parse(json)
  } catch (error) {
    console.error("Error reading series.json:", error)
    return { series: [] }
  }
}

/**
 * Get tags data from tags.json
 */
export async function getTagsData(): Promise<any> {
  const filePath = path.join(process.cwd(), "data/essays/tags.json")
  try {
    const json = await readFile(filePath, "utf-8")
    return JSON.parse(json)
  } catch (error) {
    console.error("Error reading tags.json:", error)
    return { tags: [] }
  }
}

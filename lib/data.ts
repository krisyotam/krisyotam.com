// lib/data.ts - Server-side data fetching functions
import { readFile } from "fs/promises"
import path from "path"
import { Post, PostsData } from "@/lib/posts"

// TIL data types
export interface TilEntry {
  title: string
  preview: string
  date: string
  tags: string[]
  category: string
  slug: string
  cover_image: string
  status: string
  confidence: string
  importance: number
  state: string
}

export interface TilData {
  til: TilEntry[]
}

// Now data types
export interface NowEntry {
  title: string
  preview: string
  date: string
  tags: string[]
  category: string
  slug: string
  cover_image: string
  status: string
  confidence: string
  importance: number
  state: string
}

export interface NowData {
  now: NowEntry[]
}

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
 * Get blog data from blog.json
 * This function ensures the file is included in Vercel's build
 */
export async function getBlogData(): Promise<Post[]> {
  const filePath = path.join(process.cwd(), "data/blog/blog.json")
  try {
    const json = await readFile(filePath, "utf-8")
    return JSON.parse(json) as Post[]
  } catch (error) {
    console.error("Error reading blog.json:", error)
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

/**
 * Get TIL data from til.json
 * This function ensures the file is included in Vercel's build
 */
export async function getTilData(): Promise<TilData> {
  const filePath = path.join(process.cwd(), "data/til/til.json")
  try {
    const json = await readFile(filePath, "utf-8")
    return JSON.parse(json) as TilData
  } catch (error) {
    console.error("Error reading til.json:", error)
    return { til: [] }
  }
}

/**
 * Get Now data from now.json
 * This function ensures the file is included in Vercel's build
 */
export async function getNowData(): Promise<NowData> {
  const filePath = path.join(process.cwd(), "data/now/now.json")
  try {
    const json = await readFile(filePath, "utf-8")
    return JSON.parse(json) as NowData
  } catch (error) {
    console.error("Error reading now.json:", error)
    return { now: [] }
  }
}

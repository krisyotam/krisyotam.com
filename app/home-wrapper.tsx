'use server'

import { getActivePosts } from "../utils/posts"
import quotesData from "../data/header-quotes.json"
import { HomeClient } from "@/components/home-client"
import fs from 'fs'
import path from 'path'
import { serialize } from 'next-mdx-remote/serialize'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

function getRandomQuote() {
  const quotes = quotesData.quotes
  return quotes[Math.floor(Math.random() * quotes.length)]
}

interface HomeWrapperProps {
  initialView?: 'list' | 'grid'
}

export default async function HomeWrapper({ initialView = 'list' }: HomeWrapperProps) {
  try {
    // Fetch active posts directly using the getActivePosts function
    const posts = await getActivePosts()

    // Ensure posts are available and in the expected format
    if (!posts || !Array.isArray(posts)) {
      console.error("Error: Posts data is missing or not an array")
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-xl text-gray-600 dark:text-gray-400">Failed to load posts. Please try again later.</p>
        </div>
      )
    }

    const randomQuote = getRandomQuote()

    // Read and serialize the bio content
    const bioFilePath = path.join(process.cwd(), 'app', 'home-bio.mdx')
    const bioContent = await fs.promises.readFile(bioFilePath, 'utf8')
    
    const serializedBio = await serialize(bioContent, {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }]
        ],
      }
    })

    // Use the HomeClient component which includes the toggle button
    return <HomeClient posts={posts} randomQuote={randomQuote} bioContent={serializedBio} initialView={initialView} />
  } catch (error) {
    console.error("Error loading home page:", error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600 dark:text-gray-400">Failed to load posts. Please try again later.</p>
      </div>
    )
  }
} 
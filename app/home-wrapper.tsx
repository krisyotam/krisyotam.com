'use server'

import { getActivePosts, getAllPosts } from "../utils/posts"
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

// Default bio content as fallback
const DEFAULT_BIO = `
# Welcome to Kris Yotam's Website

I am an autodidact, philomath, and polymath. I write about mathematics, philosophy, 
psychology, literature, and many other topics.

Check out my recent posts and explore the site using the navigation menu.
`

interface HomeWrapperProps {
  initialView?: 'list' | 'grid'
}

export default async function HomeWrapper({ initialView = 'list' }: HomeWrapperProps) {
  try {
    // Try to load posts from feed.json first
    console.log("Attempting to load posts...")
    
    let posts;
    try {
      // Try to get active posts first (filtered for state==="active")
      posts = await getActivePosts()
      console.log(`Successfully loaded ${posts.length} active posts`)
    } catch (postError) {
      console.error("Error loading active posts:", postError)
      
      // Fallback: try to get all posts unfiltered
      try {
        console.log("Falling back to loading all posts...")
        posts = await getAllPosts()
        console.log(`Successfully loaded ${posts.length} unfiltered posts`)
      } catch (allPostsError) {
        console.error("Error loading all posts:", allPostsError)
        throw new Error("Failed to load any posts from feed.json")
      }
    }

    // Even if posts exist but are empty array or not an array, use a fallback
    if (!posts || !Array.isArray(posts) || posts.length === 0) {
      console.warn("Posts data is missing, not an array, or empty. Using fallback data.")
      // Create a minimal fallback post
      posts = [{
        title: "Welcome to Kris Yotam's Blog",
        subtitle: "Content is currently being updated",
        preview: "Please check back soon for new content.",
        date: new Date().toISOString(),
        tags: ["Update"],
        category: "Announcement",
        slug: "welcome",
        state: "active",
        status: "Published",
        confidence: "certain",
        importance: 9
      }]
    }

    const randomQuote = getRandomQuote()

    // Read and serialize the bio content
    let serializedBio;
    try {
      // Try multiple possible paths for the bio file
      const possiblePaths = [
        path.join(process.cwd(), 'app', 'home-bio.mdx'),
        path.join(process.cwd(), '.', 'app', 'home-bio.mdx'),
        path.join(process.cwd(), '..', 'app', 'home-bio.mdx'),
        path.join(process.cwd(), 'src', 'app', 'home-bio.mdx'),
        path.join(process.cwd(), '..', 'src', 'app', 'home-bio.mdx')
      ];

      let bioContent;
      let loadedPath = null;

      // Try each path until we find the file
      for (const bioPath of possiblePaths) {
        try {
          bioContent = await fs.promises.readFile(bioPath, 'utf8');
          loadedPath = bioPath;
          console.log(`Successfully loaded bio file from: ${bioPath}`);
          break;
        } catch (readError) {
          console.log(`Failed to load bio from: ${bioPath}`);
          continue;
        }
      }

      if (!bioContent) {
        throw new Error('Could not find home-bio.mdx in any of the expected locations');
      }
      
      serializedBio = await serialize(bioContent, {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            rehypeSlug,
            [rehypeAutolinkHeadings, { behavior: 'wrap' }]
          ],
        },
        scope: {}
      });
    } catch (bioError) {
      console.error("Error processing bio content:", bioError);
      // Create a simple fallback bio
      serializedBio = await serialize(DEFAULT_BIO, {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            rehypeSlug,
            [rehypeAutolinkHeadings, { behavior: 'wrap' }]
          ],
        }
      });
    }

    // Use the HomeClient component which includes the toggle button
    return <HomeClient posts={posts} randomQuote={randomQuote} bioContent={serializedBio} initialView={initialView} />
  } catch (error) {
    console.error("Critical error loading home page:", error)
    // Return a minimal error page
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-2xl font-semibold mb-4">We're updating our site</h1>
        <p className="text-muted-foreground mb-6">Please check back soon for new content.</p>
        <p className="text-sm text-red-500">Error details: {error instanceof Error ? error.message : String(error)}</p>
      </div>
    )
  }
}
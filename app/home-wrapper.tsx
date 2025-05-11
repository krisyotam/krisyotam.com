'use server'

import { getActivePosts, getAllPosts } from "../utils/posts"
import quotesData from "../data/header-quotes.json"
import { HomeClient } from "@/components/home-client"
import { serialize } from 'next-mdx-remote/serialize'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import fs from 'fs'
import path from 'path'

function getRandomQuote() {
  const quotes = quotesData.quotes
  return quotes[Math.floor(Math.random() * quotes.length)]
}

// Default bio content as fallback
const DEFAULT_BIO = `
I am an autodidact, philomath, and polymath dedicated to the pursuit of knowledge across multiple disciplines. My intellectual endeavors span mathematics, philosophy, psychology, literature, computer science, and numerous other fields which you can explore in my [areas of interest](/about#areas-of-interest).


This digital space serves as both a personal knowledge repository and a public garden of ideas. Unlike traditional blogs that prioritize recency, this site is organized around interconnected themes and evolving thoughts. Every page is meticulously crafted to provide both depth and accessibility.

The architecture follows a principle of longterm utility - content here is meant to persist and evolve rather than fade into archival obscurity. I've drawn inspiration from several thoughtful online spaces, most notably [Gwern Branwen](https://gwern.net/index), [Fabian Schultz](https://www.fabianschultz.com/), and [Guillermo Rauch](https://rauchg.com/), among others documented in my [Colophon](/colophon) page.


The site offers multiple pathways to explore content:

- **Command Menu**: Located in the bottom right corner, this provides quick access to all major sections.
- **View Toggle**: In the bottom left, switch between the essay view and a chronological feed of posts.
- **Categories & Tags**: All content is systematically organized by [categories](/categories) and [tags](/tags) for thematic browsing.
- **Series**: Curated sequences of posts designed to be read in order, exploring specific themes or subjects in depth.


- **[On Myself](/blog/2025/on-myself)**: A comprehensive introduction to my intellectual journey and personal philosophy.
- **[On Website](/category/on-website)**: Meta-documentation about this site's design, development, and evolution.
- **[Changelog](/changelog)**: A chronological record of site updates, automatically synced with my GitHub commits.
- **[Notes](/notes)**: Shorter-form thoughts and explorations that don't warrant full essays.
- **[Wisdom AI](/series/wisdom-ai)**: Documentation of my custom AI assistant development.


This site is built with Next.js and currently deployed on Vercel, though I plan to transition to a more permanent hosting solution for long-term preservation. The technical architecture prioritizes:

- **Longevity**: Content is designed to remain accessible and meaningful for decades.
- **Performance**: Fast load times and responsive design across devices.
- **Progressive Enhancement**: Core functionality works without JavaScript.
- **Thoughtful Typography**: Careful attention to readability and typographic detail.

In the top right settings menu, you'll find several utilities:

- **Search**: Full-text search across all content with semantic relevance ranking.
- **RSS**: Subscribe to updates via your preferred RSS reader.
- **FAQ**: Quick answers to common questions with direct linking capability.
- **Scripts**: Utility scripts including URL archiving, prose linting, and other content maintenance tools.
- **GitHub**: Access to the site's source code and content repositories.

## Philosophy of Content

Each piece of writing here is tagged with confidence levels and importance ratings. This intellectual honesty system indicates how certain I am about specific claims and how significant I consider particular ideas.

I believe in continuous refinement - posts are living documents that evolve as my understanding deepens. The site serves as both a public notebook and a curated collection of more polished works.

Feel free to explore using the navigation tools, or simply begin with recent posts below. For those interested in my technical work, visit the [Programming](/category/programming) section; for philosophical musings, the [Essays](/category/essays) category might be your starting point.
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
      // Get the bio content using a more reliable method
      const bioPath = path.join(process.cwd(), 'app', 'home-bio.mdx');
      console.log('Attempting to load bio from:', bioPath);
      console.log('Current working directory:', process.cwd());
      
      const bioContent = await fs.promises.readFile(bioPath, 'utf8');
      console.log('Successfully loaded bio content');
      
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
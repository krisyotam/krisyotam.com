// app/blog/[year]/[slug]/page.tsx
import dynamic from "next/dynamic"
import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getPostContent } from "@/utils/posts"
import { Metadata, ResolvingMetadata } from "next"
import { getPostByYearAndSlug, getAllPosts } from "@/utils/feed-utils"

const BlogPostContent = dynamic(
  () => import("./blog-post-content").then((mod) => mod.BlogPostContent),
  { suspense: true }
)

export const dynamicParams = true

// Generate metadata for SEO and social sharing
export async function generateMetadata({ 
  params 
}: { 
  params: { year: string; slug: string } 
}, parent: ResolvingMetadata): Promise<Metadata> {
  const { year, slug } = params
  
  // Fetch post data from feed.json
  const postData = getPostByYearAndSlug(year, slug)
  if (!postData) return { title: 'Post Not Found' }
  
  // Get cover image URL - prioritize cover_image field
  const coverUrl = postData.cover_image || 
    `https://picsum.photos/1200/630?text=${encodeURIComponent(postData.title)}`
  
  // SEO fields from feed.json
  const title = postData.title
  const description = postData.preview || "Thoughts on math, poetry, and more."
  const url = `https://krisyotam.com/blog/${year}/${slug}`
  
  console.log(`Generating metadata for ${slug}:`, { title, coverUrl, description })
  
  return {
    title: `${title} | Kris Yotam`,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'Kris Yotam',
      images: [{ 
        url: coverUrl, 
        width: 1200, 
        height: 630, 
        alt: title 
      }],
      locale: 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [coverUrl],
      creator: '@krisyotam',
    },
    alternates: {
      canonical: url,
    },
    other: {
      'og:image': coverUrl,
      'twitter:image': coverUrl,
    },
  }
}

export async function generateStaticParams() {
  // Generate static routes for all posts in feed.json
  const posts = getAllPosts();
  
  return posts.map(post => {
    const year = new Date(post.date).getFullYear().toString();
    return {
      year,
      slug: post.slug
    };
  });
}

export default async function PostPage({
  params,
}: {
  params: { year: string; slug: string }
}) {
  const { year, slug } = params

  // 1) Fetch post data from feed.json
  const postData = getPostByYearAndSlug(year, slug)
  if (!postData) notFound()

  // 2) Load the raw MDX data
  const rawMdx = await getPostContent(year, slug)
  if (!rawMdx || !rawMdx.blogPostExists || !rawMdx.mdxData) notFound()

  // 3) Remap into the shape BlogPostContent expects
  const mdxDataForComponent = {
    content: rawMdx.mdxData,        // the MDX-compiled string
    frontmatter: {
      headings: [] as { id: string; text: string; level: number }[],
      marginNotes: [] as any[],
    },
  }

  return (
    <Suspense fallback={<div className="min-h-[200px]">Loading…</div>}>
      <article className="post-content">
        <BlogPostContent
          year={year}
          slug={slug}
          mdxData={mdxDataForComponent}
          postData={postData}
        />
      </article>
    </Suspense>
  )
}

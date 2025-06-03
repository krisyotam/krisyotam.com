// app/essays/[year]/[slug]/page.tsx
import dynamic from "next/dynamic"
import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getPostContent } from "@/utils/posts"
import { Metadata, ResolvingMetadata } from "next"
import { getPostByYearAndSlug, getAllPosts } from "@/utils/feed-utils"

const EssayPostContent = dynamic(
  () => import("./essay-post-content").then((mod) => mod.EssayPostContent),
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
    // Fetch essay data from feed.json
  const essayData = getPostByYearAndSlug(year, slug)
  if (!essayData) return { title: 'Essay Not Found' }
    // Get cover image URL - prioritize cover_image field
  const coverUrl = essayData.cover_image || 
    `https://picsum.photos/1200/630?text=${encodeURIComponent(essayData.title)}`
  
  // SEO fields from feed.json
  const title = essayData.title
  const description = essayData.preview || "Thoughts on math, poetry, and more."
  const url = `https://krisyotam.com/essays/${year}/${slug}`
  
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
  // Generate static routes for all essays in feed.json
  const essays = getAllPosts();
  
  return essays.map(essay => {
    const year = new Date(essay.date).getFullYear().toString();
    return {
      year,
      slug: essay.slug
    };
  });
}

export default async function EssayPage({
  params,
}: {
  params: { year: string; slug: string }
}) {
  const { year, slug } = params

  // 1) Fetch essay data from feed.json
  const essayData = getPostByYearAndSlug(year, slug)
  if (!essayData) notFound()

  // 2) Load the raw MDX data
  const rawMdx = await getPostContent(year, slug)
  if (!rawMdx || !rawMdx.blogPostExists || !rawMdx.mdxData) notFound()

  // 3) Remap into the shape EssayPostContent expects
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
        <EssayPostContent
          year={year}
          slug={slug}
          mdxData={mdxDataForComponent}
          postData={essayData}
        />
      </article>
    </Suspense>
  )
}

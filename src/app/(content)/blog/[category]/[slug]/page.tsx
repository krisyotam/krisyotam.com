/**
 * =============================================================================
 * Blog Post Detail Page
 * =============================================================================
 *
 * Dynamic route for displaying individual blog posts.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

export const dynamic = 'force-static';
export const revalidate = false;

import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { getContentByType } from "@/lib/data";
import BlogPageClient from "./BlogPageClient";
import { TOC } from "@/components/core/toc";
import { Sidenotes } from "@/components/core/sidenotes";
import { extractHeadingsFromMDX } from "@/lib/mdx";
import type { BlogMeta } from "@/types/content";

// =============================================================================
// Types
// =============================================================================

type Status = "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished";
type Confidence = "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain";

interface BlogPageProps {
  params: Promise<{ category: string; slug: string }>;
}

// =============================================================================
// Helpers
// =============================================================================

function slugifyCategory(category: string) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

// =============================================================================
// Static Generation
// =============================================================================

export async function generateStaticParams() {
  const posts = getContentByType('blog');

  return posts.map(post => ({
    category: slugifyCategory(post.category),
    slug: post.slug
  }));
}

// =============================================================================
// Metadata
// =============================================================================

export async function generateMetadata(
  { params }: BlogPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { category, slug } = await params;
  const posts = getContentByType('blog');

  const post = posts.find(p =>
    slugifyCategory(p.category) === category && p.slug === slug
  );

  if (!post) {
    return { title: "Post Not Found" };
  }

  const coverUrl = post.cover_image ||
    `https://picsum.photos/1200/630?text=${encodeURIComponent(post.title)}`;
  const url = `https://krisyotam.com/blog/${category}/${slug}`;

  return {
    title: `${post.title} | ${post.category} | Kris Yotam`,
    description: post.preview || `Blog Post: ${post.title} in ${post.category} category`,
    openGraph: {
      title: post.title,
      description: post.preview || `Read more on Kris Yotam's blog`,
      url,
      type: "article",
      images: [{
        url: coverUrl,
        width: 1200,
        height: 630,
        alt: post.title
      }],
      siteName: "Kris Yotam",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.preview || `Read more on Kris Yotam's blog`,
      images: [coverUrl],
      creator: "@krisyotam"
    }
  };
}

// =============================================================================
// Page Component
// =============================================================================

export default async function BlogPage({ params }: BlogPageProps) {
  const { category, slug } = await params;
  const allPosts = getContentByType('blog');

  const postData = allPosts.find(p =>
    slugifyCategory(p.category) === category && p.slug === slug
  );

  if (!postData) {
    notFound();
  }

  // Transform post data
  const post: BlogMeta = {
    ...postData,
    status: postData.status as Status,
    confidence: postData.confidence as Confidence,
    state: postData.state as "active" | "hidden" | undefined,
    importance: typeof postData.importance === 'string'
      ? parseInt(postData.importance as string, 10)
      : postData.importance
  };

  const posts: BlogMeta[] = allPosts.map(p => ({
    ...p,
    status: p.status as Status,
    confidence: p.confidence as Confidence,
    state: p.state as "active" | "hidden" | undefined,
    importance: typeof p.importance === 'string'
      ? parseInt(p.importance as string, 10)
      : p.importance
  }));

  // Extract headings from MDX content
  const headings = await extractHeadingsFromMDX('blog', slug, category);

  // Dynamically import MDX file - try nested structure first, then fallback
  let Post;
  try {
    Post = (await import(`@/app/(content)/blog/content/${category}/${slug}.mdx`)).default;
  } catch (error) {
    try {
      Post = (await import(`@/app/(content)/blog/content/${slug}.mdx`)).default;
    } catch (fallbackError) {
      console.error(`Could not find MDX file for ${category}/${slug}`);
      notFound();
    }
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground pt-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header section */}
        <div>
          <BlogPageClient post={post} allPosts={posts} headerOnly={true} />
        </div>

        {/* Main content */}
        <main id="content" className="container max-w-[672px] mx-auto px-4">
          {headings.length > 0 && <TOC headings={headings} />}

          <div className="note-content">
            <Post />
          </div>

          <BlogPageClient post={post} allPosts={posts} contentOnly={true} />
        </main>

        <Sidenotes containerSelector="#content" />
      </div>
    </div>
  );
}

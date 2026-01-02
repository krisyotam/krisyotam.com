export const dynamic = 'force-static';
export const revalidate = false;
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import blogData from "@/data/blog/blog.json";
import BlogPageClient from "./BlogPageClient";
import { TableOfContents } from "@/components/typography/table-of-contents";
import { extractHeadingsFromMDX } from "@/lib/mdx";
import type { BlogMeta } from "@/types/content";

type Status = "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished";
type Confidence = "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain";

interface BlogData {
  title: string;
  date: string;
  slug: string;
  tags: string[];
  category: string;
  status: string;
  confidence: string;
  importance: number;
  preview?: string;
  cover_image?: string;
  state?: "active" | "hidden";
}

interface BlogPageProps {
  params: { category: string; slug: string };
}

// Helper function to slugify category
function slugifyCategory(category: string) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export async function generateStaticParams() {
  // Generate all category/slug combinations
  return blogData.map(post => ({
    category: slugifyCategory(post.category),
    slug: post.slug
  }));
}

export async function generateMetadata({ params }: BlogPageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const post = blogData.find(p => 
    slugifyCategory(p.category) === params.category && p.slug === params.slug
  );

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  // Get cover image URL - prioritize cover_image field
  const coverUrl = post.cover_image || 
    `https://picsum.photos/1200/630?text=${encodeURIComponent(post.title)}`

  const url = `https://krisyotam.com/blog/${params.category}/${params.slug}`;

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

export default async function BlogPage({ params }: BlogPageProps) {
  const postData = blogData.find(p => 
    slugifyCategory(p.category) === params.category && p.slug === params.slug
  );

  if (!postData) {
    notFound();
  }

  const post: BlogMeta = {
    ...postData,
    status: postData.status as Status,
    confidence: postData.confidence as Confidence,
    state: postData.state as "active" | "hidden" | undefined,
    importance: typeof postData.importance === 'string' ? parseInt(postData.importance, 10) : postData.importance
  };

  const posts: BlogMeta[] = blogData.map((post) => ({
    ...post,
    status: post.status as Status,
    confidence: post.confidence as Confidence,
    state: post.state as "active" | "hidden" | undefined,
    importance: typeof post.importance === 'string' ? parseInt(post.importance, 10) : post.importance
  }));

  // Extract headings from the blog MDX content
  const headings = await extractHeadingsFromMDX('blog', params.slug, params.category);

  // Dynamically import the MDX file - try nested structure first, then fallback to flat
  let Post;
  try {
  Post = (await import(`@/app/(content)/blog/content/${params.category}/${params.slug}.mdx`)).default;
  } catch (error) {
    // Fallback to flat structure for legacy posts
    try {
  Post = (await import(`@/app/(content)/blog/content/${params.slug}.mdx`)).default;
    } catch (fallbackError) {
      console.error(`Could not find MDX file for ${params.category}/${params.slug}`);
      notFound();
    }
  }
  return (
    <div className="relative min-h-screen bg-background text-foreground pt-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header section - full width */}
        <div className="mb-8">
          <BlogPageClient post={post} allPosts={posts} headerOnly={true} />
        </div>
        
        {/* Main content */}
        <main className="container max-w-[672px] mx-auto px-4">
          {/* Table of Contents - at the top of content */}
          {headings.length > 0 && (
            <TableOfContents headings={headings} />
          )}
          
          <div className="note-content">
            <Post />
          </div>
          <BlogPageClient post={post} allPosts={posts} contentOnly={true} />
        </main>
      </div>
    </div>
  );
}

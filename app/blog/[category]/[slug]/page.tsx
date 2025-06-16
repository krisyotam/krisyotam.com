export const dynamic = 'force-static';
export const revalidate = false;
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import BlogPageClient from "./BlogPageClient";
import type { BlogMeta } from "@/types/blog";

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
}

interface BlogPageProps {
  params: { category: string; slug: string };
}

// Helper function to slugify category
function slugifyCategory(category: string) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

// Fetch blog data from API
async function fetchBlogData() {
  try {
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://krisyotam.com' 
      : 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/data/blog/feed`, {
      cache: 'no-store'
    });
    if (!response.ok) {
      throw new Error('Failed to fetch blog data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching blog data:', error);
    return [];
  }
}

export async function generateStaticParams() {
  const blogData = await fetchBlogData();
  
  // Generate all category/slug combinations
  return blogData.map((post: BlogData) => ({
    category: slugifyCategory(post.category),
    slug: post.slug
  }));
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const blogData = await fetchBlogData();
  
  const post = blogData.find((p: BlogData) => 
    slugifyCategory(p.category) === params.category && p.slug === params.slug
  );

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} | ${post.category} | Kris Yotam`,
    description: `Blog Post: ${post.title} in ${post.category} category`,
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const blogData = await fetchBlogData();
  
  const postData = blogData.find((p: BlogData) => 
    slugifyCategory(p.category) === params.category && p.slug === params.slug
  );

  if (!postData) {
    notFound();
  }

  const post: BlogMeta = {
    ...postData,
    status: postData.status as Status,
    confidence: postData.confidence as Confidence
  };

  const posts: BlogMeta[] = blogData.map((post: BlogData) => ({
    ...post,
    status: post.status as Status,
    confidence: post.confidence as Confidence
  }));

  // Dynamically import the MDX file based on slug
  const Post = (await import(`@/app/blog/content/${params.slug}.mdx`)).default;

  return (
    <BlogPageClient post={post} allPosts={posts}>
      <div className="note-content">
        {/* MDX is now a real React component */}
        <Post />
      </div>
    </BlogPageClient>
  );
}

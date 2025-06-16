import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import BlogCategoryClient from "./BlogCategoryClient";
import type { BlogMeta, Status, Confidence } from "@/types/blog";

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
}

interface BlogCategoryPageProps {
  params: { category: string };
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
  
  // Get unique categories from blog data
  const categories = Array.from(new Set((blogData as BlogData[]).map(post => post.category)));
  
  // Generate params for each category
  return categories.map(category => ({
    category: slugifyCategory(category)
  }));
}

export async function generateMetadata({ params }: BlogCategoryPageProps): Promise<Metadata> {
  const blogData = await fetchBlogData();
  
  // Find the first post in this category to get category name
  const categoryPost = (blogData as BlogData[]).find(post =>
    slugifyCategory(post.category) === params.category
  );

  if (!categoryPost) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `${categoryPost.category} | Blog | Kris Yotam`,
    description: `Blog posts in the ${categoryPost.category} category`,
  };
}

export default async function BlogCategoryPage({ params }: BlogCategoryPageProps) {
  const blogData = await fetchBlogData();
  
  // Filter posts for this category
  const categoryPosts = (blogData as BlogData[])
    .filter(post => slugifyCategory(post.category) === params.category)
    .map(post => ({
      title: post.title,
      date: post.date,
      slug: post.slug,
      tags: post.tags,
      category: post.category,
      status: post.status as Status,
      confidence: post.confidence as Confidence,
      importance: post.importance,
      preview: post.preview
    }));

  if (!categoryPosts.length) {
    notFound();
  }

  // Get all posts for the client component
  const allPosts: BlogMeta[] = (blogData as BlogData[]).map(post => ({
    title: post.title,
    date: post.date,
    slug: post.slug,
    tags: post.tags,
    category: post.category,
    status: post.status as Status,
    confidence: post.confidence as Confidence,
    importance: post.importance,
    preview: post.preview
  }));

  return (
    <BlogCategoryClient 
      posts={categoryPosts} 
      allPosts={allPosts}
      category={categoryPosts[0].category}
    />
  );
}

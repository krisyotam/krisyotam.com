import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import blogData from "@/data/blog/blog.json";
import BlogCategoryClient from "./BlogCategoryClient";
import type { BlogMeta, Status, Confidence } from "@/types/content";

interface BlogData {
  title: string;
  start_date: string;
  end_date?: string;
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

interface BlogCategoryPageProps {
  params: { category: string };
}

// Helper function to slugify category
function slugifyCategory(category: string) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export async function generateStaticParams() {
  // Get unique categories from blog data
  const categories = Array.from(new Set((blogData as BlogData[]).map(post => post.category)));
  
  // Generate params for each category
  return categories.map(category => ({
    category: slugifyCategory(category)
  }));
}

export async function generateMetadata({ params }: BlogCategoryPageProps): Promise<Metadata> {
  // Find the first post in this category to get category name
  const categoryPost = (blogData as BlogData[]).find(post => 
    slugifyCategory(post.category) === params.category
  );

  if (!categoryPost) {
    return {
      title: "Category Not Found",
    };
  }
  
  const categoryTitle = categoryPost.category;
  const url = `https://krisyotam.com/blog/${params.category}`;
  const description = `Blog posts in the ${categoryTitle} category`;
  
  return {
    title: `${categoryTitle} | Blog | Kris Yotam`,
    description: description,
    openGraph: {
      title: `${categoryTitle} Blog Posts`,
      description: description,
      url,
      type: "website",
      images: [{
        url: `https://krisyotam.com/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: `${categoryTitle} Blog Posts`
      }],
      siteName: "Kris Yotam",
    },
    twitter: {
      card: "summary_large_image",
      title: `${categoryTitle} Blog Posts`,
      description: description,
      images: [`https://krisyotam.com/images/og-image.jpg`],
      creator: "@krisyotam"
    }
  };

  // Use safe navigation by checking if categoryPost exists before accessing properties
  const category = categoryPost?.category || 'Blog';
  return {
    title: `${category} | Blog | Kris Yotam`,
    description: `Blog posts in the ${category} category`,
  };
}

export default async function BlogCategoryPage({ params }: BlogCategoryPageProps) {
  // Filter posts for this category and exclude hidden posts
  const categoryPosts = (blogData as BlogData[])
    .filter(post => slugifyCategory(post.category) === params.category && post.state !== "hidden")
    .map(post => ({
      title: post.title,
      start_date: post.start_date,
      end_date: post.end_date,
      slug: post.slug,
      tags: post.tags,
      category: post.category,
      status: post.status as Status,
      confidence: post.confidence as Confidence,
      importance: post.importance,
      preview: post.preview,
      state: post.state as "active" | "hidden" | undefined
    }));

  if (!categoryPosts.length) {
    notFound();
  }

  // Get all posts for the client component, excluding hidden ones
  const allPosts: BlogMeta[] = (blogData as BlogData[])
    .filter(post => post.state !== "hidden")
    .map(post => ({
    title: post.title,
    start_date: post.start_date,
    end_date: post.end_date,
    slug: post.slug,
    tags: post.tags,
    category: post.category,
    status: post.status as Status,
    confidence: post.confidence as Confidence,
    importance: post.importance,
    preview: post.preview,
    state: post.state as "active" | "hidden" | undefined
  }));

  return (
    <BlogCategoryClient 
      posts={categoryPosts} 
      allPosts={allPosts}
      category={categoryPosts[0].category}
    />
  );
}

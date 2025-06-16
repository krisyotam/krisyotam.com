import BlogClientPage from "./BlogClientPage";
import type { Metadata } from "next";
import type { BlogMeta } from "@/types/blog";
import "./blog.css";

export const metadata: Metadata = {
  title: "Blog Posts",
  description: "Short-form reflections, updates, and informal analysis",
};

// Fetch blog data from API
async function fetchBlogData() {
  try {
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://krisyotam.com' 
      : 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/data/blog/feed`, {
      cache: 'no-store' // Ensure fresh data
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

export default async function BlogPage() {
  const blogData = await fetchBlogData();
  
  // Sort notes by date (newest first)
  const posts: BlogMeta[] = [...blogData]
    .map(post => ({
      ...post,
      status: post.status as BlogMeta['status'],
      confidence: post.confidence as BlogMeta['confidence']
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="notes-container">
      <BlogClientPage notes={posts} initialCategory="all" />
    </div>
  );
}
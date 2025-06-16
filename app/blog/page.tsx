import BlogClientPage from "./BlogClientPage";
import type { Metadata } from "next";
import type { BlogMeta } from "@/types/blog";
import blogData from "@/data/blog/feed.json";
import "./blog.css";

export const metadata: Metadata = {
  title: "Blog Posts",
  description: "Short-form reflections, updates, and informal analysis",
};

// Use direct import for static generation
function getBlogData() {
  return blogData;
}

export default async function BlogPage() {
  const blogData = getBlogData();
  
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
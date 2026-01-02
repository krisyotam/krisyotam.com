import BlogClientPage from "./BlogClientPage";
import blogData from "@/data/blog/blog.json";
import type { Metadata } from "next";
import type { BlogMeta } from "@/types/content";
import "./blog.css";
import "./blog-grid.css";
import { staticMetadata } from "@/lib/staticMetadata";

export const metadata: Metadata = staticMetadata.blog;

export default function BlogPage() {
  // Sort notes by date (newest first) and filter out hidden posts
  const posts: BlogMeta[] = blogData.map(post => ({
    ...post,
    importance: typeof post.importance === 'string' ? parseInt(post.importance, 10) : post.importance
  }))
    .filter(post => post.state !== "hidden") // Only show active posts
    .map(post => ({
      ...post,
      status: post.status as BlogMeta['status'],
      confidence: post.confidence as BlogMeta['confidence'],
      state: post.state as BlogMeta['state']
    }))
    .sort((a, b) => {
      const aDate = a.end_date || a.start_date;
      const bDate = b.end_date || b.start_date;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });

  return (
    <div className="notes-container">
      <BlogClientPage notes={posts} initialCategory="all" />
    </div>
  );
}
import BlogClientPage from "./BlogClientPage";
import blogData from "@/data/blog/feed.json";
import type { Metadata } from "next";
import type { BlogMeta } from "@/types/blog";
import "./blog.css";
import "./blog-grid.css";
import { staticMetadata } from "@/lib/staticMetadata";

export const metadata: Metadata = staticMetadata.blog;

export default function BlogPage() {
  // Sort notes by date (newest first) and filter out hidden posts
  const posts: BlogMeta[] = [...blogData]
    .filter(post => post.state !== "hidden") // Only show active posts
    .map(post => ({
      ...post,
      status: post.status as BlogMeta['status'],
      confidence: post.confidence as BlogMeta['confidence'],
      state: post.state as BlogMeta['state']
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="notes-container">
      <BlogClientPage notes={posts} initialCategory="all" />
    </div>
  );
}
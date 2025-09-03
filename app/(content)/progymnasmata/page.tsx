// app/progymnasmata/page.tsx
import type { Metadata } from "next";
import { ProgymnasmataClient } from "./progymnasmata-client";
import { staticMetadata } from "@/lib/staticMetadata";
import postsData from "@/data/progymnasmata/progymnasmata.json";
import categoriesData from "@/data/progymnasmata/categories.json";

export const metadata: Metadata = staticMetadata.progymnasmata;

export default function ProgymnasmataPage() {
  // Only show active posts and sort by date (newest first)
  const activePosts = postsData.filter(post => post.state === "active");
  const posts = [...activePosts].sort((a, b) => new Date(b.end_date || b.start_date).getTime() - new Date(a.end_date || a.start_date).getTime());
  const categories = categoriesData.categories;
  return (
    <div className="progymnasmata-container">
      <ProgymnasmataClient posts={posts} categories={categories} initialCategory="all" />
    </div>
  );
}

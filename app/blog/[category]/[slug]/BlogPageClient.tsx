/* app/blog/[category]/[slug]/BlogPageClient.tsx */

"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { LiveClock } from "@/components/live-clock";
import { PostHeader } from "@/components/post-header";
import { Footer } from "@/app/essays/components/footer";
import { Citation } from "@/components/citation";

interface BlogMeta {
  title: string;
  subtitle?: string;
  preview?: string;
  date: string;
  slug: string;
  tags: string[];
  category: string;
  status?: "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished";
  confidence?:
    | "impossible" | "remote" | "highly unlikely" | "unlikely"
    | "possible"  | "likely"  | "highly likely"   | "certain";
  importance?: number;
}

interface Props {
  post: BlogMeta;
  allPosts: BlogMeta[];
  children: React.ReactNode;
}

export default function BlogPageClient({ post, allPosts, children }: Props) {
  if (!post) notFound();

  /* prev / next */
  const sorted = [...allPosts].sort(
    (a, b) => +new Date(b.date) - +new Date(a.date)
  );
  const idx  = sorted.findIndex(n => n.slug === post.slug);
  const prev = idx < sorted.length - 1 ? sorted[idx + 1] : null;
  const next = idx > 0                 ? sorted[idx - 1] : null;

  // Helper function to create category slug
  function slugifyCategory(category: string) {
    return category.toLowerCase().replace(/\s+/g, "-");
  }

  return (
    <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-8">
      {/* clean page header (outside .note-content) ----------------------- */}
      <PostHeader 
        className=""     
        title={post.title}
        subtitle={post.subtitle}
        date={post.date}
        tags={post.tags}
        category={post.category}
        backHref="/blog"
        backText="Blog"
        preview={post.preview}
        status={post.status ?? "Notes"}
        confidence={post.confidence ?? "possible"}
        importance={post.importance ?? 5}
      />
      
      {/* MDX body -------------------------------------------------------- */}
      <div className="note-content">{children}</div>
      
      <div className="mt-8">
        <Citation 
          title={post.title}
          slug={post.slug}
          date={post.date}
          url={`https://krisyotam.com/blog/${slugifyCategory(post.category)}/${post.slug}`}
        />
      </div>
      
      <LiveClock />
      <Footer />
    </div>
  );
}

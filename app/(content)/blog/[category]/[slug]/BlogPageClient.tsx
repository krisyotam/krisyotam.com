/* app/blog/[category]/[slug]/BlogPageClient.tsx */

"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { LiveClock } from "@/components/live-clock";
import { PostHeader } from "@/components/post-header";
import { Footer } from "@/app/(content)/essays/components/footer";
import { Citation } from "@/components/citation";

interface BlogMeta {
  title: string;
  subtitle?: string;
  preview?: string;
  start_date: string;
  end_date?: string;
  slug: string;
  tags: string[];
  category: string;
  status?: "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished";
  confidence?:
    | "impossible" | "remote" | "highly unlikely" | "unlikely"
    | "possible"  | "likely"  | "highly likely"   | "certain";
  importance?: number;
  cover_image?: string; // Added for image support in blog posts
}

interface Props {
  post: BlogMeta;
  allPosts: BlogMeta[];
  children?: React.ReactNode;
  headerOnly?: boolean;
  contentOnly?: boolean;
}

export default function BlogPageClient({ post, allPosts, children, headerOnly, contentOnly }: Props) {
  if (!post) notFound();

  /* prev / next */
  const sorted = [...allPosts].sort((a, b) => {
    const dateA = (a.end_date && a.end_date.trim()) || a.start_date;
    const dateB = (b.end_date && b.end_date.trim()) || b.start_date;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });
  const idx  = sorted.findIndex(n => n.slug === post.slug);
  const prev = idx < sorted.length - 1 ? sorted[idx + 1] : null;
  const next = idx > 0                 ? sorted[idx - 1] : null;

  // Helper function to create category slug
  function slugifyCategory(category: string) {
    return category.toLowerCase().replace(/\s+/g, "-");
  }

  // Render only header
  if (headerOnly) {
    return (
      <div className="container max-w-[672px] mx-auto px-4">
        <PostHeader 
          className=""     
          title={post.title}
          subtitle={post.subtitle}
          start_date={post.start_date}
          end_date={post.end_date}
          tags={post.tags}
          category={post.category}
          backHref="/blog"
          backText="Blog"
          preview={post.preview}
          status={post.status ?? "Notes"}
          confidence={post.confidence ?? "possible"}
          importance={post.importance ?? 5}
        />
      </div>
    );
  }

  // Render only content (citation, footer, etc.)
  if (contentOnly) {
    return (
      <div className="mt-8">
        <Citation 
          title={post.title}
          slug={post.slug}
          date={(post.end_date && post.end_date.trim()) || post.start_date}
          url={`https://krisyotam.com/blog/${slugifyCategory(post.category)}/${post.slug}`}
        />
        <LiveClock />
        <Footer />
      </div>
    );
  }

  // Render full layout (legacy)
  return (
    <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-8">
      {/* clean page header (outside .note-content) ----------------------- */}
      <PostHeader 
        className=""     
        title={post.title}
        subtitle={post.subtitle}
        start_date={post.start_date}
        end_date={post.end_date}
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
          date={(post.end_date && post.end_date.trim()) || post.start_date}
          url={`https://krisyotam.com/blog/${slugifyCategory(post.category)}/${post.slug}`}
        />
      </div>
      
      <LiveClock />
      <Footer />
    </div>
  );
}

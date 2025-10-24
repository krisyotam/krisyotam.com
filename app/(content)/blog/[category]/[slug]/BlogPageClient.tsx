"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { LiveClock } from "@/components/live-clock";
import { PostHeader } from "@/components/post-header";
import { Footer } from "@/app/(content)/essays/components/footer";
import SiteFooter from "@/components/typography/expanded-footer-block";
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
    | "impossible"
    | "remote"
    | "highly unlikely"
    | "unlikely"
    | "possible"
    | "likely"
    | "highly likely"
    | "certain";
  importance?: number;
  cover_image?: string;
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

  const sorted = [...allPosts].sort((a, b) => {
    const dateA = (a.end_date && a.end_date.trim()) || a.start_date;
    const dateB = (b.end_date && b.end_date.trim()) || b.start_date;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });
  const idx = sorted.findIndex((n) => n.slug === post.slug);
  const prev = idx < sorted.length - 1 ? sorted[idx + 1] : null;
  const next = idx > 0 ? sorted[idx - 1] : null;

  function slugifyCategory(category: string) {
    return category.toLowerCase().replace(/\s+/g, "-");
  }

  const lastUpdated = (post.end_date && post.end_date.trim()) || new Date().toISOString().slice(0, 10);
  const rawMarkdown = typeof children === "string" ? children : "";

  if (headerOnly) {
    return (
      <div className="container max-w-[672px] mx-auto px-4">
        <PostHeader
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

  if (contentOnly) {
    return (
      <div className="mt-8 w-full">
        <SiteFooter lastUpdated={lastUpdated} rawMarkdown={rawMarkdown} />
        <Citation
          title={post.title}
          slug={post.slug}
          date={(post.end_date && post.end_date.trim()) || post.start_date}
          url={`https://krisyotam.com/blog/${slugifyCategory(post.category)}/${post.slug}`}
        />
        <div className="mt-4 w-full">
          <LiveClock />
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-16 flex flex-col min-h-screen">
      <PostHeader
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

      <div className="note-content flex-1">{children}</div>

      <div className="mt-8 w-full">
        <SiteFooter lastUpdated={lastUpdated} rawMarkdown={rawMarkdown} />
        <Citation
          title={post.title}
          slug={post.slug}
          date={(post.end_date && post.end_date.trim()) || post.start_date}
          url={`https://krisyotam.com/blog/${slugifyCategory(post.category)}/${post.slug}`}
        />
        <div className="mt-4 w-full">
          <LiveClock />
          <Footer />
        </div>
      </div>
    </div>
  );
}
